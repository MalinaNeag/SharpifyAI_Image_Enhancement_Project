import json
import requests
import logging
from flask import Blueprint, request, redirect, session, jsonify, url_for
from flask_login import LoginManager, UserMixin, login_user, logout_user, current_user
from oauthlib.oauth2 import WebApplicationClient
from config import Config


auth_bp = Blueprint("auth", __name__)

# Flask-Login Setup
login_manager = LoginManager()
login_manager.login_view = "auth.login"

# OAuth2 Client Setup
client = WebApplicationClient(Config.GOOGLE_CLIENT_ID)

# Logger Setup
logger = logging.getLogger(__name__)

# Simulated User Database (Replace with actual DB in the future)
users = {}


class User(UserMixin):
    """Flask-Login User model for session management."""
    def __init__(self, user_id, name, email, profile_pic):
        self.id = user_id
        self.name = name
        self.email = email
        self.profile_pic = profile_pic

    def to_dict(self):
        """Returns user details as a dictionary."""
        return {"id": self.id, "name": self.name, "email": self.email, "profile_pic": self.profile_pic}


@login_manager.user_loader
def load_user(user_id):
    """Load user session from the in-memory store."""
    return users.get(user_id)


@auth_bp.route("/login")
def login():
    """Redirect user to Google OAuth login."""
    try:
        google_discovery_url = Config.GOOGLE_DISCOVERY_URL
        google_provider_cfg = requests.get(google_discovery_url).json()
        authorization_endpoint = google_provider_cfg["authorization_endpoint"]

        request_uri = client.prepare_request_uri(
            authorization_endpoint,
            redirect_uri=Config.GOOGLE_REDIRECT_URI,
            scope=["openid", "email", "profile"]
        )

        logger.info(f"Redirecting user to Google OAuth: {request_uri}")
        return redirect(request_uri)

    except Exception as e:
        logger.error(f"Error during login initiation: {str(e)}")
        return jsonify({"message": "Internal server error"}), 500


@auth_bp.route("/login/callback")
def callback():
    """Handle Google OAuth callback."""
    try:
        code = request.args.get("code")
        google_provider_cfg = requests.get(Config.GOOGLE_DISCOVERY_URL).json()
        token_endpoint = google_provider_cfg["token_endpoint"]

        # Request access token
        token_url, headers, body = client.prepare_token_request(
            token_endpoint,
            authorization_response=request.url,
            redirect_url=Config.GOOGLE_REDIRECT_URI,
            code=code
        )

        token_response = requests.post(
            token_url,
            headers=headers,
            data=body,
            auth=(Config.GOOGLE_CLIENT_ID, Config.GOOGLE_CLIENT_SECRET),
        )

        # Validate token response
        if token_response.status_code != 200:
            logger.error(f"Token request failed: {token_response.text}")
            return jsonify({"message": "Failed to obtain access token"}), 400

        client.parse_request_body_response(json.dumps(token_response.json()))

        # Fetch user info
        userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
        uri, headers, body = client.add_token(userinfo_endpoint)
        userinfo_response = requests.get(uri, headers=headers, data=body).json()

        if userinfo_response.get("email_verified"):
            user_id = userinfo_response["sub"]
            users[user_id] = User(
                user_id=user_id,
                name=userinfo_response["name"],
                email=userinfo_response["email"],
                profile_pic=userinfo_response["picture"]
            )

            login_user(users[user_id])
            session["user_id"] = user_id  # Persist user in session

            logger.info(f"User logged in: {userinfo_response['email']}")
            return jsonify({
                "message": "User logged in successfully",
                "user": users[user_id].to_dict()
            }), 200
        else:
            logger.warning(f"User email not verified: {userinfo_response['email']}")
            return jsonify({"message": "User email not verified"}), 400

    except Exception as e:
        logger.error(f"Error during callback handling: {str(e)}")
        return jsonify({"message": "Internal server error"}), 500


@auth_bp.route("/logout")
def logout():
    """Log out the user and clear session."""
    if current_user.is_authenticated:
        user_email = current_user.email
        logout_user()
        session.clear()  # Clear all session data
        logger.info(f"User logged out: {user_email}")
        return jsonify({"message": "Logged out successfully"}), 200
    else:
        logger.warning("Logout attempt by an unauthenticated user")
        return jsonify({"message": "No active session found"}), 400


@auth_bp.route("/user")
def get_user():
    """Return the current authenticated user's information."""
    if current_user.is_authenticated:
        logger.info(f"User requested their details: {current_user.email}")
        return jsonify({"user": current_user.to_dict()}), 200
    else:
        logger.warning("Unauthenticated user attempted to access profile data")
        return jsonify({"message": "User not authenticated"}), 401
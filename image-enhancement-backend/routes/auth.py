import json
import os
import requests
import logging
from flask import Blueprint, request, redirect, session, jsonify, current_app, url_for
from flask_login import LoginManager, UserMixin, login_user, logout_user, current_user
from oauthlib.oauth2 import WebApplicationClient
from config import Config
from flask_cors import cross_origin

# Enable OAuth2 over HTTP for local development
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

auth_bp = Blueprint("auth", __name__)

# Initialize Flask-Login
login_manager = LoginManager()
login_manager.login_view = "auth.login"

# OAuth2 Client Setup
client = WebApplicationClient(Config.GOOGLE_CLIENT_ID)

# Logger Setup
logger = logging.getLogger(__name__)

# Simulated User Database (TEMPORARY - Replace with a real DB)
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
    """Load user session from the in-memory store (Temporary, use DB in production)."""
    return users.get(user_id)

def get_google_provider_cfg():
    """Fetch Google's OpenID Connect configuration."""
    return requests.get(Config.GOOGLE_DISCOVERY_URL).json()


@auth_bp.route("/login")
def login():
    """Redirect user to Google OAuth login."""
    try:
        google_provider_cfg = get_google_provider_cfg()
        authorization_endpoint = google_provider_cfg["authorization_endpoint"]

        request_uri = client.prepare_request_uri(
            authorization_endpoint,
            redirect_uri=Config.GOOGLE_REDIRECT_URI,
            scope=["openid", "email", "profile"],
            prompt="consent",  # 🔥 Force Google to show the sign-in screen
            access_type="offline"  # 🔥 Ensures we get a refresh token
        )

        logger.info(f"Redirecting user to Google OAuth: {request_uri}")
        return redirect(request_uri)

    except Exception as e:
        logger.error(f"Error during login initiation: {str(e)}")
        return jsonify({"message": "Internal server error"}), 500


@auth_bp.route("/login/callback")
@cross_origin()
def callback():
    """Handle Google OAuth callback."""
    try:
        code = request.args.get("code")
        google_provider_cfg = get_google_provider_cfg()
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
            user_email = userinfo_response["email"]

            users[user_id] = User(
                user_id=user_id,
                name=userinfo_response["name"],
                email=user_email,
                profile_pic=userinfo_response["picture"]
            )

            login_user(users[user_id])
            session["user_id"] = user_id
            session.permanent = True

            logger.info(f"User logged in: {user_email}")

            # ✅ Redirect user to React App with query params
            frontend_url = f"http://localhost:3000/?user={user_email}"
            return redirect(frontend_url)

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


def init_auth(app):
    """Attach Flask-Login to Flask app."""
    login_manager.init_app(app)
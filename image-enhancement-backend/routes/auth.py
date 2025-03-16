import requests
from flask import Blueprint, request, jsonify
from config import Config
import logging

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")  # Ensure correct URL prefix
logger = logging.getLogger(__name__)

def verify_firebase_token(token):
    """Verify Firebase token by sending request to Firebase API."""
    try:
        url = f"https://identitytoolkit.googleapis.com/v1/accounts:lookup?key={Config.FIREBASE_API_KEY}"
        response = requests.post(url, json={"idToken": token})

        if response.status_code != 200:
            logger.error(f"Firebase API Error: {response.status_code} - {response.text}")
            return None

        data = response.json()
        if "users" not in data:
            logger.error("Firebase API returned empty or invalid response.")
            return None

        user = data["users"][0]
        user_info = {
            "uid": user["localId"],
            "email": user.get("email", ""),
            "email_verified": user.get("emailVerified", False),
            "name": user.get("displayName", "Anonymous"),
            "profile_pic": user.get("photoUrl", ""),
        }

        logger.info(f"User verified: {user_info}")
        return user_info

    except requests.exceptions.RequestException as e:
        logger.error(f"RequestException in token verification: {str(e)}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error verifying token: {str(e)}")
        return None

@auth_bp.route("/verify-token", methods=["POST"])
def verify_token():
    """Verify Firebase token sent from frontend."""
    token = request.json.get("token")

    if not token:
        return jsonify({"message": "Missing token"}), 400

    user = verify_firebase_token(token)

    if user:
        return jsonify({"message": "User verified", "user": user}), 200
    else:
        return jsonify({"message": "Invalid token"}), 401

@auth_bp.route("/logout", methods=["POST"])
def logout():
    """Logout the user (handled client-side, just return success)."""
    logger.info("User logged out")
    return jsonify({"message": "User logged out"}), 200
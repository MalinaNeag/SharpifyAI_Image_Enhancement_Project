import logging
from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from services.s3_service import fetch_user_images, delete_file_from_s3

# Set up logger and Flask blueprint
logger = logging.getLogger(__name__)
gallery_bp = Blueprint("gallery", __name__)

@gallery_bp.route("/gallery", methods=["GET"])
@cross_origin()
def get_gallery():
    """
    Fetches all images for a given user based on their email address.
    The email must be passed as a query parameter (?email=...).
    """
    email = request.args.get("email")
    if not email:
        return jsonify({"error": "Missing 'email' query param"}), 400

    # Retrieve all image metadata for this user
    images = fetch_user_images(email)
    return jsonify({"images": images}), 200

@gallery_bp.route("/gallery", methods=["DELETE"])
@cross_origin()
def delete_gallery_item():
    """
    Deletes a specific image from S3 for a user.
    Expects a JSON body containing both `email` and `key` fields.
    """
    data = request.get_json(force=True) or {}
    email = data.get("email")
    key   = data.get("key")
    if not email or not key:
        return jsonify({"error": "Missing 'email' or 'key'"}), 400

    # Optional safety check: Ensure the key starts with the user's folder prefix
    prefix = email.replace("@", "_").replace(".", "_") + "/"
    if not key.startswith(prefix) and not key.startswith("enhanced/"):
        return jsonify({"error": "Invalid key"}), 400

    # Attempt to delete the file from S3
    success = delete_file_from_s3(key)
    if not success:
        return jsonify({"error": "Failed to delete"}), 500

    # Return updated list of user's images after deletion
    images = fetch_user_images(email)
    return jsonify({"images": images}), 200
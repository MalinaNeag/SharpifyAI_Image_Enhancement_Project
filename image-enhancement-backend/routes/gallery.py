import logging
from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from services.s3_service import fetch_user_images, delete_file_from_s3

logger = logging.getLogger(__name__)
gallery_bp = Blueprint("gallery", __name__)

@gallery_bp.route("/gallery", methods=["GET"])
@cross_origin()
def get_gallery():
    email = request.args.get("email")
    if not email:
        return jsonify({"error": "Missing 'email' query param"}), 400
    images = fetch_user_images(email)
    return jsonify({"images": images}), 200

@gallery_bp.route("/gallery", methods=["DELETE"])
@cross_origin()
def delete_gallery_item():
    data = request.get_json(force=True) or {}
    email = data.get("email")
    key   = data.get("key")
    if not email or not key:
        return jsonify({"error":"Missing 'email' or 'key'"}), 400

    # Optional safety check: key must start with user folder
    prefix = email.replace("@", "_").replace(".", "_") + "/"
    if not key.startswith(prefix) and not key.startswith("enhanced/"):
        return jsonify({"error":"Invalid key"}), 400

    success = delete_file_from_s3(key)
    if not success:
        return jsonify({"error":"Failed to delete"}), 500

    # return updated list
    images = fetch_user_images(email)
    return jsonify({"images": images}), 200
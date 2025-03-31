import os
import logging
from flask import Blueprint, request, jsonify
from services.s3_service import upload_file_to_s3
from utils.helpers import allowed_file, save_file_locally
from config import Config
from PIL import Image

upload_bp = Blueprint('upload', __name__)
logger = logging.getLogger(__name__)

# Define resolution constraints
MAX_WIDTH = 5000  # Maximum allowed width in pixels
MAX_HEIGHT = 5000  # Maximum allowed height in pixels


@upload_bp.route('/upload', methods=['POST'])
def upload_file():
    """Handles file upload and sends it to S3 under the user's email folder."""

    if 'file' not in request.files:
        logger.warning("No file provided in request.")
        return jsonify({"message": "No file provided"}), 400

    file = request.files['file']
    user_email = request.form.get("email")

    if not user_email:
        logger.warning("Missing user email in request.")
        return jsonify({"message": "Missing user email"}), 400

    if not allowed_file(file.filename):
        logger.warning(f"Invalid file format: {file.filename}")
        return jsonify({"message": "Invalid file format"}), 400

    file.seek(0, os.SEEK_END)
    file_size = file.tell()
    file.seek(0)

    if file_size > Config.MAX_CONTENT_LENGTH:
        logger.warning(f"File too large: {file.filename} ({file_size / 1024:.2f} KB)")
        return jsonify({"message": "File is too large"}), 400

    file_path, filename = save_file_locally(file)

    try:
        with Image.open(file_path) as img:
            width, height = img.size
            img_format = img.format

            logger.info(f"Image Details: {filename} | {img_format} | {width}x{height} px | {file_size / 1024:.2f} KB")

            if width > MAX_WIDTH or height > MAX_HEIGHT:
                logger.warning(f"Image resolution too large: {width}x{height} px")
                os.remove(file_path)
                return jsonify({"message": "Image resolution exceeds allowed size"}), 400

        enhancement_options = {
            "face": request.form.get("face") == "true",
            "background": request.form.get("background") == "true",
            "colorization": request.form.get("colorization") == "true",
            "text": request.form.get("text") == "true",
        }

        file_url = upload_file_to_s3(file_path, filename, user_email, enhancements=enhancement_options)

        if file_url:
            os.remove(file_path)
            logger.info(f"File uploaded successfully to S3: {file_url}")
            return jsonify({"message": "File uploaded successfully!", "file_url": file_url}), 200
        else:
            logger.error("File upload to S3 failed.")
            return jsonify({"message": "File upload failed"}), 500

    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        os.remove(file_path)
        return jsonify({"message": "Invalid or corrupted image"}), 400
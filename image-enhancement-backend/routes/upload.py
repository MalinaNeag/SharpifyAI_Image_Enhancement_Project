import os
import logging
from flask import Blueprint, request, jsonify
from services.s3_service import upload_file_to_s3
from utils.helpers import allowed_file, save_file_locally

upload_bp = Blueprint('upload', __name__)
logger = logging.getLogger(__name__)

@upload_bp.route('/upload', methods=['POST'])
def upload_file():
    """Handles file upload and sends it to S3."""
    if 'file' not in request.files:
        logger.warning("No file provided in request")
        return jsonify({"message": "No file provided"}), 400

    file = request.files['file']

    if not allowed_file(file.filename):
        logger.warning(f"Invalid file format: {file.filename}")
        return jsonify({"message": "Invalid file format"}), 400

    file_path, filename = save_file_locally(file)
    file_size = os.path.getsize(file_path)

    logger.info(f"File received: {filename} | Size: {file_size / 1024:.2f} KB")

    file_url = upload_file_to_s3(file_path, filename)

    if file_url:
        os.remove(file_path)  # Cleanup
        logger.info(f"File uploaded to S3: {file_url}")
        return jsonify({"message": "File uploaded successfully!", "file_url": file_url}), 200
    else:
        logger.error("File upload failed!")
        return jsonify({"message": "File upload failed"}), 500
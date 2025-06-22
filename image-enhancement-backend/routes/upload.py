import os
import logging
import uuid
import io
from flask import Blueprint, request, jsonify
from services.s3_service import upload_file_to_s3
from utils.helpers import allowed_file
from config import Config
from PIL import Image

upload_bp = Blueprint('upload', __name__)
logger = logging.getLogger(__name__)

# Define resolution constraints
MAX_WIDTH = 5000
MAX_HEIGHT = 5000

@upload_bp.route('/upload', methods=['POST'])
def upload_file():
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

    try:
        image = Image.open(file.stream).convert("RGB")
        width, height = image.size
        if width > MAX_WIDTH or height > MAX_HEIGHT:
            logger.warning(f"Image resolution too large: {width}x{height} px")
            return jsonify({"message": "Image resolution exceeds allowed size"}), 400

        run_id = uuid.uuid4().hex
        filename = f"original_{run_id}.png"
        buf = io.BytesIO()
        image.save(buf, format="PNG")
        buf.seek(0)

        enhancement_options = {
            "face": request.form.get("face") == "true",
            "background": request.form.get("background") == "true",
            "colorization": request.form.get("colorization") == "true",
            "text": request.form.get("text") == "true",
        }

        file_url = upload_file_to_s3(
            file_path=None,
            filename=filename,
            user_email=user_email,
            enhancements=enhancement_options,
            image_data=buf.read()  # your upload function must support this
        )

        if file_url:
            logger.info(f"File uploaded successfully to S3: {file_url}")
            return jsonify({
                "message": "File uploaded successfully!",
                "file_url": file_url,
                "run_id": run_id
            }), 200
        else:
            logger.error("File upload to S3 failed.")
            return jsonify({"message": "File upload failed"}), 500

    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        return jsonify({"message": "Invalid or corrupted image"}), 400
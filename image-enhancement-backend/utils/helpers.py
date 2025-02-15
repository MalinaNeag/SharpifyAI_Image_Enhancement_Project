import os
import logging
from werkzeug.utils import secure_filename
from config import Config

logger = logging.getLogger(__name__)

# Allowed file extensions for uploads
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif'}


def allowed_file(filename):
    """Check if a file has a valid extension."""
    if not filename or '.' not in filename:
        logger.warning("Filename is missing or has no extension.")
        return False

    ext = filename.rsplit('.', 1)[1].lower()

    if ext in ALLOWED_EXTENSIONS:
        logger.info(f"File extension '{ext}' is allowed.")
        return True
    else:
        logger.warning(f"File extension '{ext}' is not allowed.")
        return False


def save_file_locally(file):
    """Saves a file locally and returns its path with logging."""
    try:
        filename = secure_filename(file.filename)
        file_path = os.path.join(Config.UPLOAD_FOLDER, filename)

        # Ensure upload folder exists
        os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)

        file.save(file_path)
        file_size = os.path.getsize(file_path) / 1024  # Convert bytes to KB

        logger.info(f"File saved locally: {file_path} | Size: {file_size:.2f} KB")
        return file_path, filename

    except Exception as e:
        logger.error(f"Error saving file: {str(e)}")
        return None, None
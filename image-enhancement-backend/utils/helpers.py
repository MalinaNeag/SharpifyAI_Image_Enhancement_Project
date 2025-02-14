import os
from werkzeug.utils import secure_filename
from config import Config

ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif'}

def allowed_file(filename):
    """Check if a file has a valid extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_file_locally(file):
    """Saves a file locally and returns its path."""
    filename = secure_filename(file.filename)
    file_path = os.path.join(Config.UPLOAD_FOLDER, filename)
    file.save(file_path)
    return file_path, filename
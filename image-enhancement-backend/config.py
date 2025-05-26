import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Config:
    # AWS Configuration
    AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
    AWS_BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")
    AWS_REGION = os.getenv("AWS_REGION")

    if not all([AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_BUCKET_NAME, AWS_REGION]):
        raise ValueError("Missing AWS configuration in .env file!")

    # Upload Configuration
    UPLOAD_FOLDER = "./uploads"
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB
    SECRET_KEY = os.getenv("FLASK_SECRET_KEY", "default_secret_key")

    # 🔹 Add Firebase API Key
    FIREBASE_API_KEY = os.getenv("FIREBASE_API_KEY")

    if not FIREBASE_API_KEY:
        raise ValueError("Missing FIREBASE_API_KEY in .env file!")

    # Google OAuth Configuration (No longer needed if using Firebase)
    GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
    GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")
    GOOGLE_DISCOVERY_URL = "https://accounts.google.com/.well-known/openid-configuration"

    GRADIO_URL = os.getenv("GRADIO_URL", "https://cb46c50c95c6136918.gradio.live")

    # Ensure the upload directory exists
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
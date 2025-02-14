import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
    AWS_BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")
    AWS_REGION = os.getenv("AWS_REGION")
    UPLOAD_FOLDER = "./uploads"
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB
    SECRET_KEY = os.getenv("FLASK_SECRET_KEY")

# Ensure upload directory exists
os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
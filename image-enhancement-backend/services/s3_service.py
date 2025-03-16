import logging
import boto3
from config import Config

logger = logging.getLogger(__name__)

# Initialize AWS S3 client
s3_client = boto3.client(
    "s3",
    aws_access_key_id=Config.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=Config.AWS_SECRET_ACCESS_KEY,
    region_name=Config.AWS_REGION,
)


def upload_file_to_s3(file_path, filename, user_email):
    """Uploads file to S3 under a user-specific folder."""
    try:
        user_folder = user_email.replace("@", "_").replace(".", "_")
        s3_key = f"{user_folder}/{filename}"  # Store in user-specific folder

        logger.info(f"Uploading {filename} to S3 at {s3_key}")

        s3_client.upload_file(file_path, Config.AWS_BUCKET_NAME, s3_key, ExtraArgs={"ACL": "private"})

        file_url = f"https://{Config.AWS_BUCKET_NAME}.s3.{Config.AWS_REGION}.amazonaws.com/{s3_key}"

        logger.info(f"Upload successful: {file_url}")
        return file_url
    except Exception as e:
        logger.error(f"Error uploading to S3: {str(e)}")
        return None
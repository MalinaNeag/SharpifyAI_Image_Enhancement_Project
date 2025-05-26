import logging
import boto3
from botocore.exceptions import NoCredentialsError
from config import Config
import uuid

logger = logging.getLogger(__name__)

# Initialize AWS S3 client
s3_client = boto3.client(
    "s3",
    aws_access_key_id=Config.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=Config.AWS_SECRET_ACCESS_KEY,
    region_name=Config.AWS_REGION,
)


def upload_file_to_s3(file_path, filename, user_email, enhancements=None):
    try:
        user_folder = user_email.replace("@", "_").replace(".", "_")
        s3_key = f"{user_folder}/{filename}"

        with open(file_path, "rb") as f:
            file_data = f.read()

        metadata = {}
        if enhancements:
            metadata = {str(k).lower(): "true" for k, v in enhancements.items() if v}

        logger.info(f"Uploading {s3_key} with metadata: {metadata}")

        s3_client.put_object(
            Bucket=Config.AWS_BUCKET_NAME,
            Key=s3_key,
            Body=file_data,
            Metadata=metadata,
            ACL="private",
            ContentType="image/jpeg",
        )

        file_url = f"https://{Config.AWS_BUCKET_NAME}.s3.{Config.AWS_REGION}.amazonaws.com/{s3_key}"
        return file_url
    except Exception as e:
        logger.error(f"Upload error: {e}")
        return None

def fetch_user_images(email):
    """Fetch user images from S3 and their enhancement metadata."""
    try:
        user_folder = email.replace("@", "_").replace(".", "_") + "/"
        logger.info(f"Fetching images from: {Config.AWS_BUCKET_NAME}/{user_folder}")

        list_objects = s3_client.list_objects_v2(Bucket=Config.AWS_BUCKET_NAME, Prefix=user_folder)
        if "Contents" not in list_objects:
            logger.info("No images found for user.")
            return []

        images = []
        for obj in list_objects["Contents"]:
            file_key = obj["Key"]

            # Generate signed URL for image
            signed_url = s3_client.generate_presigned_url(
                "get_object",
                Params={"Bucket": Config.AWS_BUCKET_NAME, "Key": file_key},
                ExpiresIn=3600,
            )

            # Retrieve metadata (enhancements)
            try:
                metadata = s3_client.head_object(Bucket=Config.AWS_BUCKET_NAME, Key=file_key).get("Metadata", {})
                enhancements = [key for key, value in metadata.items() if value == "true"]
            except Exception as meta_err:
                logger.warning(f"No metadata for {file_key}: {meta_err}")
                enhancements = []

            images.append({
                "url": signed_url,
                "key": file_key,
                "enhancements": enhancements
            })

        return images

    except NoCredentialsError:
        logger.error("AWS credentials not found.")
        return []
    except Exception as e:
        logger.error(f"Error retrieving images: {str(e)}")
        return []

def upload_bytes_to_s3(data_bytes: bytes, content_type: str = "image/png") -> str | None:
    """
    Upload raw bytes (PNG/JPEG/etc.) to S3 under 'enhanced/<uuid>.png' and return the public URL.
    """
    key = f"enhanced/{uuid.uuid4().hex}.png"
    try:
        # Note: no ACL parameter (bucket policy must allow public-read by default)
        s3_client.put_object(
            Bucket=Config.AWS_BUCKET_NAME,
            Key=key,
            Body=data_bytes,
            ContentType=content_type,
        )
        url = f"https://{Config.AWS_BUCKET_NAME}.s3.{Config.AWS_REGION}.amazonaws.com/{key}"
        logger.info(f"[S3] Uploaded enhanced image → {url}")
        return url
    except (BotoCoreError, ClientError) as e:
        logger.error(f"[S3] upload_bytes_to_s3 failed: {e}")
        return None
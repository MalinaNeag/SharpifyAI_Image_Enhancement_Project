import logging
import boto3
import uuid
from botocore.exceptions import BotoCoreError, ClientError, NoCredentialsError
from config import Config

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Initialize AWS S3 client
s3_client = boto3.client(
    "s3",
    aws_access_key_id=Config.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=Config.AWS_SECRET_ACCESS_KEY,
    region_name=Config.AWS_REGION,
)


def upload_file_to_s3(
    file_path: str,
    filename: str,
    user_email: str,
    enhancements: dict | None = None
) -> str | None:
    """
    Upload a local file to S3 under '<user_folder>/<filename>' and return a public URL.
    Metadata keys (enhancements) will be set to "true".
    """
    try:
        user_folder = user_email.replace("@", "_").replace(".", "_")
        key = f"{user_folder}/{filename}"

        with open(file_path, "rb") as f:
            data = f.read()

        metadata = {k: "true" for k, v in (enhancements or {}).items() if v}

        logger.info(f"[S3] Putting object {key} with metadata={metadata}")
        s3_client.put_object(
            Bucket=Config.AWS_BUCKET_NAME,
            Key=key,
            Body=data,
            Metadata=metadata,
            ContentType="image/jpeg",
        )

        url = f"https://{Config.AWS_BUCKET_NAME}.s3.{Config.AWS_REGION}.amazonaws.com/{key}"
        logger.info(f"[S3] Uploaded → {url}")
        return url

    except (BotoCoreError, ClientError) as e:
        logger.error(f"[S3] upload_file_to_s3 error: {e}")
        return None


def upload_bytes_to_s3(
    data_bytes: bytes,
    user_email: str,
    enhancements: dict | None = None,
    content_type: str = "image/png"
) -> str | None:
    """
    Upload raw image bytes to S3 under '<user_folder>/enhanced_<uuid>.png' and return a public URL.
    Metadata keys (enhancements) will be set to "true".
    """
    try:
        user_folder = user_email.replace("@", "_").replace(".", "_")
        key = f"{user_folder}/enhanced_{uuid.uuid4().hex}.png"

        metadata = {k: "true" for k, v in (enhancements or {}).items() if v}

        logger.info(f"[S3] Putting bytes → {key} with metadata={metadata}")
        s3_client.put_object(
            Bucket=Config.AWS_BUCKET_NAME,
            Key=key,
            Body=data_bytes,
            Metadata=metadata,
            ContentType=content_type,
        )

        url = f"https://{Config.AWS_BUCKET_NAME}.s3.{Config.AWS_REGION}.amazonaws.com/{key}"
        logger.info(f"[S3] Uploaded → {url}")
        return url

    except (BotoCoreError, ClientError) as e:
        logger.error(f"[S3] upload_bytes_to_s3 failed: {e}")
        return None


def fetch_user_images(email: str) -> list[dict]:
    """
    List all images under '<user_folder>/' and return a list of
      { url, key, enhancements }.
    """
    user_folder = email.replace("@", "_").replace(".", "_") + "/"
    try:
        resp = s3_client.list_objects_v2(Bucket=Config.AWS_BUCKET_NAME, Prefix=user_folder)
        contents = resp.get("Contents", [])
        images = []

        for obj in contents:
            key = obj["Key"]
            url = f"https://{Config.AWS_BUCKET_NAME}.s3.{Config.AWS_REGION}.amazonaws.com/{key}"

            # fetch metadata
            try:
                head = s3_client.head_object(Bucket=Config.AWS_BUCKET_NAME, Key=key)
                meta = head.get("Metadata", {})
                enhancements = [k for k, v in meta.items() if v == "true"]
            except Exception as e:
                logger.warning(f"[S3] head_object failed for {key}: {e}")
                enhancements = []

            images.append({
                "url": url,
                "key": key,
                "enhancements": enhancements
            })

        return images

    except NoCredentialsError:
        logger.error("[S3] Credentials not found")
        return []
    except (BotoCoreError, ClientError) as e:
        logger.error(f"[S3] fetch_user_images failed: {e}")
        return []


def delete_file_from_s3(key: str) -> bool:
    """
    Delete the object at the given S3 key. Returns True if successful.
    """
    try:
        logger.info(f"[S3] Deleting {key}")
        s3_client.delete_object(Bucket=Config.AWS_BUCKET_NAME, Key=key)
        return True
    except (BotoCoreError, ClientError) as e:
        logger.error(f"[S3] delete_file_from_s3 failed: {e}")
        return False
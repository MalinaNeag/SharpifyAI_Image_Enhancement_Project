import logging
import re
import uuid

import boto3
from botocore.exceptions import BotoCoreError, ClientError, NoCredentialsError

from config import Config

# Configure logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Initialize S3 client using credentials from config
s3_client = boto3.client(
    "s3",
    aws_access_key_id=Config.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=Config.AWS_SECRET_ACCESS_KEY,
    region_name=Config.AWS_REGION,
)
BUCKET = Config.AWS_BUCKET_NAME

def upload_file_to_s3(
    file_path: str | None,
    filename: str,
    user_email: str,
    enhancements: dict | None = None,
    image_data: bytes | None = None,
    content_type: str = "image/png",
    run_id: str | None = None
) -> str | None:
    """
    Uploads a file (from disk or memory) to an S3 bucket.
    Adds optional enhancement metadata for later retrieval.
    Returns a public S3 URL on success.
    """
    try:
        user_folder = user_email.replace("@", "_").replace(".", "_")
        key = f"{user_folder}/{filename}"  # Use passed-in filename structure

        # Prepare metadata based on selected enhancements
        metadata = {k: "true" for k, v in (enhancements or {}).items() if v}

        # Read image content from memory or file
        if image_data:
            body = image_data
        elif file_path:
            with open(file_path, "rb") as f:
                body = f.read()
        else:
            raise ValueError("No file_path or image_data provided")

        # Upload to S3
        s3_client.put_object(
            Bucket=BUCKET,
            Key=key,
            Body=body,
            Metadata=metadata,
            ContentType=content_type
        )

        url = f"https://{BUCKET}.s3.{Config.AWS_REGION}.amazonaws.com/{key}"
        logger.info(f"[S3] uploaded -> {url}")
        return url

    except (BotoCoreError, ClientError, ValueError) as e:
        logger.error("upload_file_to_s3 error: %s", e)
        return None

def upload_bytes_to_s3(
    data_bytes: bytes,
    user_email: str,
    enhancements: dict | None = None,
    content_type: str = "image/png"
) -> str | None:
    """
    Uploads raw image bytes to S3 under a unique enhanced filename.
    Returns the public S3 URL or None on failure.
    """
    try:
        user_folder = user_email.replace("@", "_").replace(".", "_")
        key = f"{user_folder}/enhanced_{uuid.uuid4().hex}.png"

        metadata = {k: "true" for k,v in (enhancements or {}).items() if v}

        s3_client.put_object(
            Bucket=BUCKET,
            Key=key,
            Body=data_bytes,
            Metadata=metadata,
            ContentType=content_type,
        )
        url = f"https://{BUCKET}.s3.{Config.AWS_REGION}.amazonaws.com/{key}"
        logger.info(f"[S3] uploaded bytes -> {url}")
        return url

    except (BotoCoreError, ClientError) as e:
        logger.error("upload_bytes_to_s3 failed: %s", e)
        return None

def upload_main_image(data_bytes, user_email, enhancements, content_type="image/png", run_id=None):
    """
    Uploads a main enhanced image to S3, optionally with a given run_id.
    Returns the run_id, public URL, and S3 key.
    """
    if run_id is None:
        run_id = uuid.uuid4().hex  # Generate run ID if not passed

    filename = f"enhanced_{run_id}.png"
    user_folder = user_email.replace("@", "_").replace(".", "_")
    s3_key = f"{user_folder}/{filename}"

    # Use core upload function with specified filename and metadata
    s3_url = upload_file_to_s3(
        file_path=None,
        filename=filename,
        user_email=user_email,
        enhancements=enhancements,
        image_data=data_bytes
    )

    return run_id, s3_url, s3_key

def upload_plot_image(
    data_bytes: bytes,
    user_email: str,
    run_id: str,
    idx: int
) -> tuple[str, str] | tuple[None, None]:
    """
    Uploads an auxiliary plot image (e.g., metrics visualizations) to S3.
    Includes run_id and index in the filename.
    Returns the URL and key, or (None, None) on failure.
    """
    user_folder = user_email.replace("@", "_").replace(".", "_")
    key = f"{user_folder}/enhanced_{run_id}_plot_{idx}.png"
    try:
        s3_client.put_object(
            Bucket=BUCKET,
            Key=key,
            Body=data_bytes,
            ContentType="image/png"
        )
        url = f"https://{BUCKET}.s3.{Config.AWS_REGION}.amazonaws.com/{key}"
        return url, key
    except Exception as e:
        logger.error("upload_plot_image failed: %s", e)
        return None, None

def fetch_user_images(email: str) -> list[dict]:
    """
    Fetches all enhanced images (and associated plots) for a user.
    Scans S3 keys based on the user folder prefix and groups by run_id.
    Returns a list of image metadata dictionaries.
    """
    prefix = email.replace("@", "_").replace(".", "_") + "/"
    try:
        resp = s3_client.list_objects_v2(Bucket=BUCKET, Prefix=prefix)
        contents = resp.get("Contents", [])
    except Exception as e:
        logger.error("list_objects_v2 failed: %s", e)
        return []

    runs: dict[str, dict] = {}

    # Match enhanced images and extract metadata
    for obj in contents:
        key = obj["Key"]
        m = re.match(rf"^{re.escape(prefix)}enhanced_([0-9a-f]+)\\.png$", key)
        if not m:
            continue
        run_id = m.group(1)
        try:
            head = s3_client.head_object(Bucket=BUCKET, Key=key)
            meta = head.get("Metadata", {})
            enhancements = [k for k,v in meta.items() if v.lower()=="true"]
        except Exception:
            enhancements = []

        url = f"https://{BUCKET}.s3.{Config.AWS_REGION}.amazonaws.com/{key}"
        runs[run_id] = {
            "run_id": run_id,
            "url": url,
            "key": key,
            "enhancements": enhancements,
            "plots": []
        }

    # Match and group any plot images linked to a run_id
    for obj in contents:
        key = obj["Key"]
        m = re.match(rf"^{re.escape(prefix)}enhanced_([0-9a-f]+)_plot_[0-9]+\\.png$", key)
        if not m:
            continue
        run_id = m.group(1)
        if run_id in runs:
            url = f"https://{BUCKET}.s3.{Config.AWS_REGION}.amazonaws.com/{key}"
            runs[run_id]["plots"].append(url)

    return list(runs.values())

def delete_file_from_s3(key: str) -> bool:
    """
    Deletes a single file from S3 using its key.
    Returns True on success, False on failure.
    """
    try:
        s3_client.delete_object(Bucket=BUCKET, Key=key)
        return True
    except Exception as e:
        logger.error("delete_file_from_s3 failed: %s", e)
        return False
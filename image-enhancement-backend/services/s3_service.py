# backend/services/s3_service.py

import logging
import re
import uuid

import boto3
from botocore.exceptions import BotoCoreError, ClientError, NoCredentialsError

from config import Config

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Initialize S3 client
s3_client = boto3.client(
    "s3",
    aws_access_key_id=Config.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=Config.AWS_SECRET_ACCESS_KEY,
    region_name=Config.AWS_REGION,
)
BUCKET = Config.AWS_BUCKET_NAME


def upload_file_to_s3(
    file_path: str,
    filename: str,
    user_email: str,
    enhancements: dict | None = None
) -> str | None:
    """
    Used by your '/upload' route.
    Upload a local file to S3 under '<user_folder>/<filename>' and return its public URL.
    Stores enhancement flags as metadata.
    """
    try:
        user_folder = user_email.replace("@", "_").replace(".", "_")
        key = f"{user_folder}/{filename}"

        with open(file_path, "rb") as f:
            body = f.read()

        metadata = {k: "true" for k,v in (enhancements or {}).items() if v}

        s3_client.put_object(
            Bucket=BUCKET,
            Key=key,
            Body=body,
            Metadata=metadata,
            ContentType="image/jpeg",
        )
        url = f"https://{BUCKET}.s3.{Config.AWS_REGION}.amazonaws.com/{key}"
        logger.info(f"[S3] uploaded file -> {url}")
        return url

    except (BotoCoreError, ClientError) as e:
        logger.error("upload_file_to_s3 error: %s", e)
        return None


def upload_bytes_to_s3(
    data_bytes: bytes,
    user_email: str,
    enhancements: dict | None = None,
    content_type: str = "image/png"
) -> str | None:
    """
    Used by your '/enhance' proxy for generic byte uploads.
    Upload raw bytes under '<user_folder>/enhanced_<uuid>.png'.
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


def upload_main_image(
    data_bytes: bytes,
    user_email: str,
    enhancements: dict,
    content_type: str = "image/png"
) -> tuple[str, str, str] | tuple[None, None, None]:
    """
    Uploads the *main* enhanced image under enhanced_<run_id>.png
    Returns (run_id, url, key)
    """
    run_id = uuid.uuid4().hex
    user_folder = user_email.replace("@", "_").replace(".", "_")
    key = f"{user_folder}/enhanced_{run_id}.png"
    metadata = {k: "true" for k,v in enhancements.items() if v}
    try:
        s3_client.put_object(
            Bucket=BUCKET,
            Key=key,
            Body=data_bytes,
            Metadata=metadata,
            ContentType=content_type,
        )
        url = f"https://{BUCKET}.s3.{Config.AWS_REGION}.amazonaws.com/{key}"
        return run_id, url, key
    except Exception as e:
        logger.error("upload_main_image failed: %s", e)
        return None, None, None


def upload_plot_image(
    data_bytes: bytes,
    user_email: str,
    run_id: str,
    idx: int
) -> tuple[str, str] | tuple[None, None]:
    """
    Uploads a single analysis plot under enhanced_<run_id>_plot_<idx>.png
    Returns (url, key)
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
    Lists all S3 objects under '<user_folder>/' and **groups** them
    into runs of the form:
      { url, key, enhancements, plots: [ ... ] }
    """
    prefix = email.replace("@", "_").replace(".", "_") + "/"
    try:
        resp = s3_client.list_objects_v2(Bucket=BUCKET, Prefix=prefix)
        contents = resp.get("Contents", [])
    except Exception as e:
        logger.error("list_objects_v2 failed: %s", e)
        return []

    runs: dict[str, dict] = {}

    # 1) Collect main images
    for obj in contents:
        key = obj["Key"]
        m = re.match(rf"^{re.escape(prefix)}enhanced_([0-9a-f]+)\.png$", key)
        if not m:
            continue
        run_id = m.group(1)
        # fetch metadata flags
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

    # 2) Collect plots
    for obj in contents:
        key = obj["Key"]
        m = re.match(rf"^{re.escape(prefix)}enhanced_([0-9a-f]+)_plot_[0-9]+\.png$", key)
        if not m:
            continue
        run_id = m.group(1)
        if run_id in runs:
            url = f"https://{BUCKET}.s3.{Config.AWS_REGION}.amazonaws.com/{key}"
            runs[run_id]["plots"].append(url)

    return list(runs.values())


def delete_file_from_s3(key: str) -> bool:
    """
    Deletes the object at the given S3 key.
    """
    try:
        s3_client.delete_object(Bucket=BUCKET, Key=key)
        return True
    except Exception as e:
        logger.error("delete_file_from_s3 failed: %s", e)
        return False
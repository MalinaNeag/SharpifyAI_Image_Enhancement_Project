import io
import os
import base64
import logging
import requests
from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from gradio_client import Client as GradioClient
from config import Config
from PIL import Image
from services.s3_service import upload_bytes_to_s3

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
if not logger.handlers:
    ch = logging.StreamHandler()
    ch.setLevel(logging.DEBUG)
    ch.setFormatter(logging.Formatter("%(asctime)s - %(levelname)s - %(message)s"))
    logger.addHandler(ch)

enhance_proxy = Blueprint("enhance_proxy", __name__)

logger.info(f"[Gradio] Connecting to {Config.GRADIO_URL}")
gr_client = GradioClient(Config.GRADIO_URL)


@enhance_proxy.route("/enhance", methods=["OPTIONS", "POST"])
@cross_origin()
def proxy_predict():
    if request.method == "OPTIONS":
        return "", 200

    payload      = request.get_json(force=True, silent=True) or {}
    file_url     = payload.get("file_url")
    user_email   = payload.get("email")
    face         = payload.get("face", False)
    background   = payload.get("background", False)
    text         = payload.get("text", False)
    colorization = payload.get("colorization", False)

    if not file_url or not user_email:
        return jsonify({"error": "Missing file_url or email"}), 400

    # 1) Call Gradio (expect a single result)
    try:
        result = gr_client.predict(
            file_url, face, background, text, colorization,
            api_name="/predict"
        )
    except Exception as e:
        logger.exception("Gradio predict failed")
        return jsonify({"error": str(e)}), 502

    # 2) Normalize 'result' → bytes
    img_bytes = None
    content_type = "image/png"

    if isinstance(result, str) and os.path.isfile(result):
        with open(result, "rb") as f:
            img_bytes = f.read()
        ext = os.path.splitext(result)[1].lower().lstrip(".")
        content_type = f"image/{ext}"
    elif isinstance(result, str) and result.startswith("data:image"):
        header, b64 = result.split(",", 1)
        content_type = header.split(";")[0].split(":", 1)[1]
        img_bytes = base64.b64decode(b64)
    elif isinstance(result, str) and result.startswith("http"):
        r = requests.get(result, timeout=60)
        r.raise_for_status()
        img_bytes, content_type = r.content, r.headers.get("Content-Type", content_type)
    elif isinstance(result, Image.Image):
        buf = io.BytesIO()
        result.save(buf, "PNG")
        img_bytes = buf.getvalue()
    else:
        return jsonify({"error": "Cannot decode enhanced image"}), 500

    # 3) Upload enhanced image
    enhanced_url = upload_bytes_to_s3(
        data_bytes=img_bytes,
        user_email=user_email,
        enhancements={
            "face": face,
            "background": background,
            "text": text,
            "colorization": colorization
        },
        content_type=content_type
    )
    if not enhanced_url:
        return jsonify({"error": "S3 upload failed"}), 502

    # 4) Return only the enhanced URL
    return jsonify({"data": [enhanced_url]}), 200
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
    logger.info("=== /enhance called ===")
    if request.method == "OPTIONS":
        logger.info("[CORS] Preflight OPTIONS")
        return "", 200

    payload = request.get_json(force=True, silent=True) or {}
    logger.debug(f"[Payload] {payload}")

    # Required parameters
    file_url     = payload.get("file_url")
    user_email   = payload.get("email")
    face         = payload.get("face", False)
    background   = payload.get("background", False)
    text         = payload.get("text", False)
    colorization = payload.get("colorization", False)

    if not file_url or not user_email:
        logger.warning("[Error] Missing file_url or email")
        return jsonify({"error": "Missing file_url or email"}), 400

    # 1) Call Gradio
    logger.info(f"[Gradio] predict({file_url}, face={face}, background={background}, text={text}, colorization={colorization})")
    try:
        result = gr_client.predict(
            file_url, face, background, text, colorization,
            api_name="/predict"
        )
        logger.info("[Gradio] predict returned")
    except Exception as e:
        logger.exception("[Error] Gradio client call failed")
        return jsonify({"error": f"Gradio error: {e}"}), 502

    logger.debug(f"[Raw result] type={type(result)}, value={result}")

    # 2) Normalize result → raw bytes
    img_bytes = None
    content_type = "image/png"

    # a) Local file path?
    if isinstance(result, str) and os.path.isfile(result):
        logger.info(f"[Result] local file path → reading {result}")
        with open(result, "rb") as f:
            img_bytes = f.read()
        ext = os.path.splitext(result)[1].lower().lstrip(".")
        content_type = f"image/{ext if ext!='webp' else 'webp'}"

    # b) Data-URI?
    elif isinstance(result, str) and result.startswith("data:image"):
        logger.info("[Result] data URI → decoding")
        header, b64data = result.split(",", 1)
        content_type = header.split(";")[0].split(":",1)[1]
        img_bytes = base64.b64decode(b64data)

    # c) Remote URL?
    elif isinstance(result, str) and result.startswith("http"):
        logger.info(f"[Result] remote URL → fetching bytes from {result}")
        try:
            resp = requests.get(result, timeout=60)
            resp.raise_for_status()
            img_bytes = resp.content
            content_type = resp.headers.get("Content-Type", content_type)
        except Exception as e:
            logger.warning(f"[Warning] failed to fetch remote URL: {e}")

    # d) Dict with `path`?
    elif isinstance(result, dict) and result.get("path") and os.path.isfile(result["path"]):
        p = result["path"]
        logger.info(f"[Result] dict path → reading {p}")
        with open(p, "rb") as f:
            img_bytes = f.read()
        ext = os.path.splitext(p)[1].lower().lstrip(".")
        content_type = f"image/{ext if ext!='webp' else 'webp'}"

    # e) PIL Image?
    elif hasattr(result, "save") and isinstance(result, Image.Image):
        logger.info("[Result] PIL.Image → converting to PNG bytes")
        buf = io.BytesIO()
        result.save(buf, format="PNG")
        img_bytes = buf.getvalue()
        content_type = "image/png"

    else:
        # fallback: return raw URL or data-URI
        fallback = None
        if isinstance(result, dict) and result.get("url"):
            fallback = result["url"]
        elif isinstance(result, str):
            fallback = result
        if fallback:
            logger.info(f"[Fallback] returning raw: {fallback[:60]}…")
            return jsonify({"data":[fallback]}), 200

        logger.error("[Error] Could not extract image bytes or URL")
        return jsonify({"error":"Failed to process result"}), 500

    # 3) Upload to S3 in the user’s folder, tagging metadata
    if img_bytes:
        logger.info("[S3] uploading enhanced bytes to S3 under user folder")
        s3_url = upload_bytes_to_s3(
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
        if not s3_url:
            logger.error("[Error] S3 upload failed")
            return jsonify({"error":"S3 upload failed"}), 502

        logger.info(f"[Done] returning S3 URL {s3_url}")
        return jsonify({"data":[s3_url]}), 200

    # Should never happen
    logger.error("[Error] No image bytes produced")
    return jsonify({"error":"Unknown processing error"}), 500
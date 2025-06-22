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
from services.s3_service import upload_main_image

# Configure logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
if not logger.handlers:
    ch = logging.StreamHandler()
    ch.setLevel(logging.DEBUG)
    ch.setFormatter(logging.Formatter("%(asctime)s - %(levelname)s - %(message)s"))
    logger.addHandler(ch)

# Create Flask blueprint and initialize Gradio client
enhance_proxy = Blueprint("enhance_proxy", __name__)
logger.info(f"[Gradio] Connecting to {Config.GRADIO_URL}")
gr_client = GradioClient(Config.GRADIO_URL)

@enhance_proxy.route("/enhance", methods=["OPTIONS", "POST"])
@cross_origin()
def proxy_predict():
    # Handle CORS preflight
    if request.method == "OPTIONS":
        return "", 200

    # Extract and validate request payload
    payload = request.get_json(force=True, silent=True) or {}
    file_url     = payload.get("file_url")
    user_email   = payload.get("email")
    run_id       = payload.get("run_id")
    face         = payload.get("face", False)
    background   = payload.get("background", False)
    text         = payload.get("text", False)
    colorization = payload.get("colorization", False)

    if not file_url or not user_email:
        return jsonify({"error": "Missing file_url or email"}), 400

    # Step 1: Send prediction request to Gradio backend
    try:
        result = gr_client.predict(
            file_url, face, background, text, colorization,
            api_name="/predict"
        )
    except Exception as e:
        logger.exception("Gradio predict failed")
        return jsonify({"error": str(e)}), 502

    # Step 2: Convert Gradio output to image bytes
    img_bytes = None
    content_type = "image/png"

    if isinstance(result, str) and os.path.isfile(result):
        # Gradio returned a local file path
        with open(result, "rb") as f:
            img_bytes = f.read()
        ext = os.path.splitext(result)[1].lower().lstrip(".")
        content_type = f"image/{ext}"
    elif isinstance(result, str) and result.startswith("data:image"):
        # Gradio returned a base64-encoded image string
        header, b64 = result.split(",", 1)
        content_type = header.split(";")[0].split(":", 1)[1]
        img_bytes = base64.b64decode(b64)
    elif isinstance(result, str) and result.startswith("http"):
        # Gradio returned a direct image URL
        r = requests.get(result, timeout=60)
        r.raise_for_status()
        img_bytes = r.content
        content_type = r.headers.get("Content-Type", content_type)
    elif isinstance(result, Image.Image):
        # Gradio returned a PIL image
        buf = io.BytesIO()
        result.save(buf, "PNG")
        img_bytes = buf.getvalue()
    else:
        return jsonify({"error": "Cannot decode enhanced image"}), 500

    # Step 3: Upload enhanced image to S3, using provided run_id
    run_id_final, enhanced_url, _ = upload_main_image(
        data_bytes=img_bytes,
        user_email=user_email,
        enhancements={
            "face": face,
            "background": background,
            "text": text,
            "colorization": colorization
        },
        content_type=content_type,
        run_id=run_id  # Provided run_id from frontend (used for pairing)
    )
    if not enhanced_url or not run_id_final:
        return jsonify({"error": "S3 upload failed"}), 502

    # Step 4: Reconstruct original image URL using naming convention and S3 structure
    orig_filename = f"original_{run_id_final}.png"
    user_folder = user_email.replace("@", "_").replace(".", "_")
    original_url = f"https://{Config.AWS_BUCKET_NAME}.s3.{Config.AWS_REGION}.amazonaws.com/{user_folder}/{orig_filename}"

    # Step 5: Return both image URLs and run ID to frontend
    return jsonify({
        "data": {
            "original_url": original_url,
            "enhanced_url": enhanced_url,
            "run_id": run_id_final
        }
    }), 200
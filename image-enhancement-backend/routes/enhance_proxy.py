# routes/enhance_proxy.py

import io
import os
import base64
import logging
from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from gradio_client import Client as GradioClient
from config import Config
from PIL import Image

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
if not logger.handlers:
    ch = logging.StreamHandler()
    ch.setLevel(logging.DEBUG)
    ch.setFormatter(logging.Formatter("%(asctime)s - %(levelname)s - %(message)s"))
    logger.addHandler(ch)

enhance_proxy = Blueprint("enhance_proxy", __name__)

logger.info(f"Initializing Gradio client at {Config.GRADIO_URL}")
gr_client = GradioClient(Config.GRADIO_URL)

@enhance_proxy.route("/enhance", methods=["OPTIONS", "POST"])
@cross_origin()
def proxy_predict():
    logger.info("=== /enhance called ===")
    if request.method == "OPTIONS":
        logger.info("Preflight OPTIONS")
        return "", 200

    payload = request.get_json(force=True, silent=True) or {}
    logger.debug(f"Payload: {payload}")

    file_url     = payload.get("file_url")
    face         = payload.get("face", False)
    background   = payload.get("background", False)
    text         = payload.get("text", False)
    colorization = payload.get("colorization", False)

    if not file_url:
        logger.warning("Missing file_url")
        return jsonify({"error": "Missing file_url"}), 400

    logger.info("Calling gr_client.predict() …")
    try:
        result = gr_client.predict(
            file_url, face, background, text, colorization,
            api_name="/predict"
        )
        logger.info("… gr_client.predict returned")
    except Exception as e:
        logger.exception("Gradio client error")
        return jsonify({"error": f"Gradio call failed: {e}"}), 502

    logger.debug(f"Raw result type={type(result)}, value={result}")

    # Convert whatever Gradio gave us into a valid <img src="…">
    src = None

    # 1) If dict with URL
    if isinstance(result, dict) and result.get("url"):
        src = result["url"]
        logger.info("Using result['url'] as src")

    # 2) If string
    elif isinstance(result, str):
        # If it's a path to a real file on disk
        if os.path.isfile(result):
            logger.info(f"Result is file path; re-opening via PIL to PNG: {result}")
            try:
                with Image.open(result) as img:
                    buf = io.BytesIO()
                    img.save(buf, format="PNG")
                    b64 = base64.b64encode(buf.getvalue()).decode("utf-8")
                    src = f"data:image/png;base64,{b64}"
            except Exception as img_err:
                logger.exception("Failed to PIL-open the path; falling back to raw read")
                raw = open(result, "rb").read()
                b64 = base64.b64encode(raw).decode("utf-8")
                # still label it as webp
                src = f"data:image/webp;base64,{b64}"
        else:
            # treat it as already a URL or data URI
            src = result
            logger.info("Result is string URL/data-URI; using directly")

    # 3) If PIL Image directly
    elif isinstance(result, Image.Image):
        logger.info("Result is PIL.Image; encoding to data URI")
        buf = io.BytesIO()
        result.save(buf, format="PNG")
        b64 = base64.b64encode(buf.getvalue()).decode("utf-8")
        src = f"data:image/png;base64,{b64}"

    else:
        logger.warning("Unexpected result type; casting to string")
        src = str(result)

    logger.debug(f"Final src length={len(src)}")
    logger.info("Returning JSON…")
    return jsonify({"data":[src]}), 200
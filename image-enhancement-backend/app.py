import logging
from flask import Flask
from flask_cors import CORS
from config import Config
from routes.upload import upload_bp
from routes.enhance import enhance_bp
from routes.health import health_bp
from routes.auth import auth_bp

app = Flask(__name__)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})
app.config.from_object(Config)


# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("backend.log"),
        logging.StreamHandler(),
    ]
)
logger = logging.getLogger(__name__)

# Register Blueprints
app.register_blueprint(upload_bp)
app.register_blueprint(enhance_bp)
app.register_blueprint(health_bp)
app.register_blueprint(auth_bp)

logger.info("Backend initialized and running!")

if __name__ == "__main__":
    app.run(debug=True)
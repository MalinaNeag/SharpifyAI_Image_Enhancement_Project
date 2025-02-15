import os
import logging
from flask import Flask, session
from flask_cors import CORS
from flask_login import LoginManager
from flask_session import Session
from config import Config
from routes.upload import upload_bp
from routes.enhance import enhance_bp
from routes.health import health_bp
from routes.auth import auth_bp, init_auth

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Enable Flask Sessions with persistent storage
app.config["SESSION_TYPE"] = "filesystem"
app.config["SESSION_PERMANENT"] = True
app.config["SESSION_FILE_DIR"] = os.path.join(os.getcwd(), "flask_sessions")
os.makedirs(app.config["SESSION_FILE_DIR"], exist_ok=True)
Session(app)

# Secure CORS Configuration
ALLOWED_ORIGINS = ["http://localhost:3000", "http://192.168.1.26:3000", "https://yourapp.com"]
CORS(app, supports_credentials=True, origins=ALLOWED_ORIGINS)

# Initialize Flask-Login
init_auth(app)

# Configure Logging
logging.basicConfig(
    level=logging.DEBUG if app.debug else logging.INFO,  # Show more logs in development
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("backend.log"),  # Logs to a file
        logging.StreamHandler()  # Logs to terminal
    ]
)
logger = logging.getLogger(__name__)
logger.info("Backend initialized and running!")

# Register Blueprints
app.register_blueprint(upload_bp)
app.register_blueprint(enhance_bp)
app.register_blueprint(health_bp)
app.register_blueprint(auth_bp)
@app.route("/health")
def health():
    return {"status": "ok"}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
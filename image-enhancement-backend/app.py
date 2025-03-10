import os
import logging
from flask import Flask
from flask_cors import CORS
from routes.auth import auth_bp  # Import auth routes

# Initialize Flask app
app = Flask(__name__)
CORS(app, supports_credentials=True)  # Allow credentials for cross-origin requests

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix="/auth")

@app.route("/")
def home():
    return "Backend is running!"

if __name__ == "__main__":
    app.run(debug=True)
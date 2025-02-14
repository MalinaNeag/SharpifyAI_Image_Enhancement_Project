from flask import Blueprint, jsonify

health_bp = Blueprint('health', __name__)

@health_bp.route('/')
def home():
    """Health check route."""
    return jsonify({"message": "Backend is running!"})
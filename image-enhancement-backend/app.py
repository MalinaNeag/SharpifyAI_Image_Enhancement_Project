import os
import boto3
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load environment variables from .env file
load_dotenv()

# AWS configuration
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")
AWS_REGION = os.getenv("AWS_REGION")

# Initialize AWS S3 client
s3_client = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION
)

# Local file upload settings
UPLOAD_FOLDER = './uploads'
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif'}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH

# Create the uploads folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Helper function to check allowed file extensions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def upload_file():
    # Check if the file is present in the request
    if 'file' not in request.files:
        return jsonify({"message": "No file part in the request"}), 400

    file = request.files['file']

    # Check if the file size exceeds the maximum allowed size
    if file.content_length > app.config['MAX_CONTENT_LENGTH']:
        return jsonify({"message": "File is too large"}), 400

    # Validate file extension
    if not allowed_file(file.filename):
        return jsonify({"message": "Invalid file format"}), 400

    # Save the file locally with a secure filename
    filename = secure_filename(file.filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)

    try:
        file.save(file_path)
        app.logger.info(f"File saved locally at {file_path}")

        # Upload file to S3
        s3_client.upload_file(file_path, AWS_BUCKET_NAME, filename, ExtraArgs={"ACL": "private"})
        app.logger.info(f"File uploaded to S3: {filename}")

        # Generate the S3 file URL
        file_url = f"https://{AWS_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{filename}"

        # Remove the local file after upload
        os.remove(file_path)

        return jsonify({"message": "File uploaded successfully!", "file_url": file_url}), 200
    except Exception as e:
        app.logger.error(f"Error occurred while uploading: {str(e)}")
        return jsonify({"message": f"Error occurred while uploading: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
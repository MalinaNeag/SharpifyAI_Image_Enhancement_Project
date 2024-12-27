import os
import boto3
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from dotenv import load_dotenv  # Import the dotenv package
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load the environment variables from the .env file
load_dotenv()

# Set up AWS credentials (now from .env file)
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")  # Get from .env file
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")  # Get from .env file
AWS_BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")  # Get from .env file
AWS_REGION = os.getenv("AWS_REGION")  # Get from .env file

# Initialize boto3 S3 client
s3_client = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION
)

UPLOAD_FOLDER = './uploads'
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Max file size 16MB


# Helper function to check allowed file extensions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"message": "No file part"}), 400

    file = request.files['file']
    if file.content_length > app.config['MAX_CONTENT_LENGTH']:
        return jsonify({"message": "File is too large"}), 400
    if not allowed_file(file.filename):
        return jsonify({"message": "Invalid file format"}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)

    try:
        file.save(file_path)
        app.logger.info(f"File saved locally at {file_path}")

        # Upload file to S3
        s3_client.upload_file(file_path, AWS_BUCKET_NAME, filename, ExtraArgs={"ACL": "private"})
        app.logger.info(f"File uploaded to S3: {filename}")

        file_url = f"https://{AWS_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{filename}"
        os.remove(file_path)

        # Return a successful JSON response
        return jsonify({"message": "File uploaded successfully!", "file_url": file_url}), 200
    except Exception as e:
        app.logger.error(f"Error occurred while uploading: {str(e)}")
        return jsonify({"message": f"Error occurred while uploading: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(debug=True)

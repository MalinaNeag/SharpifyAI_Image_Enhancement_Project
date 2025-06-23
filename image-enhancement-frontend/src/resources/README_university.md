# SharpifyAI — Modular AI Image Enhancement

GitHub Repository: https://github.com/MalinaNeag/modular-super-res-project

## Overview

SharpifyAI is a full-stack academic application designed to enhance low-resolution images using region-specific AI models. It performs semantic segmentation to identify distinct areas of an image (faces, background, text) and applies a specialized super-resolution model to each region individually:

- GFPGAN for face restoration
- Real-ESRGAN for background enhancement
- TextBSR for text sharpening

Technologies used include: React (frontend), Flask (backend), Google Firebase (authentication), AWS S3 (cloud storage), and Gradio/Colab (AI model execution).

---

## Step-by-Step Setup Instructions

### 1. Launch the AI Inference Notebook

1. Open the file `SharpifyAI.ipynb` in Google Colab
2. Enable GPU acceleration and run all cells
3. Copy the Gradio link generated in the final cell (e.g., https://xxxx.gradio.live)
4. Paste this link in both `.env` files as `GRADIO_URL`

---

### 2. Clone the Project

```bash
git clone https://github.com/MalinaNeag/modular-super-res-project.git
cd modular-super-res-project
```

---

### 3. Configure Environment Variables

Create two `.env` files:

#### Frontend `.env` (inside `image-enhancement-frontend/`)
```
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=

REACT_APP_BACKEND_URL=http://127.0.0.1:5000
REACT_APP_GRADIO_URL=https://your-gradio-link.gradio.live

REACT_APP_AWS_ACCESS_KEY_ID=
REACT_APP_AWS_SECRET_ACCESS_KEY=
AWS_BUCKET_NAME=
AWS_REGION=
```

#### Backend `.env` (inside `image-enhancement-backend/`)
```
FLASK_APP=app.py
FLASK_ENV=development
FLASK_DEBUG=1
FLASK_SECRET_KEY=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://127.0.0.1:5000/login/callback

FIREBASE_API_KEY=

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_BUCKET_NAME=
AWS_REGION=

GRADIO_URL=https://your-gradio-link.gradio.live
```

---

### 4. Obtain Required Credentials

- **Firebase**: Create a project at [console.firebase.google.com](https://console.firebase.google.com) → Project Settings → Web App
- **Google OAuth**: [console.cloud.google.com](https://console.cloud.google.com) → Credentials → OAuth 2.0 → Add redirect URI
- **AWS**: Use IAM to generate credentials and create an S3 bucket
- **Gradio**: Run the Colab notebook and use the generated URL

---

### 5. Install and Run the Backend

```bash
cd image-enhancement-backend
pip install -r requirements.txt
python app.py
```

---

### 6. Install and Run the Frontend (in a new terminal)

```bash
cd ../image-enhancement-frontend
npm install
npm run start
```

---

## Project Structure

```
modular-super-res-project/
├── image-enhancement-backend/   # Flask backend
├── image-enhancement-frontend/  # React frontend
├── SharpifyAI.ipynb             # Colab notebook for AI models
└── README.md
```

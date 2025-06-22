# SharpifyAI — Modular AI Image Enhancement
![SharpifyAI Preview](image-enhancement-frontend/src/resources/preview.jpg)
## What is SharpifyAI?

**SharpifyAI** is a full-stack web application designed to enhance low-quality images by applying AI super-resolution techniques **selectively** across distinct image regions: faces, backgrounds, and text.

Unlike traditional tools that apply a uniform model to the whole image, SharpifyAI performs **semantic segmentation** to isolate and enhance each region using a **dedicated model**:

- 🧑‍🦰 `GFPGAN` for facial restoration
- 🌄 `Real-ESRGAN` for background enhancement
- 🔤 `TextBSR` for improving text clarity

Built using **React (frontend)**, **Flask (backend)**, **Firebase Authentication**, **AWS S3**, and integrated with **Gradio/Colab** for GPU-powered AI inference.

## Key Features

- Upload images and choose which regions to enhance (face / background / text)
- Compare original vs enhanced results directly in-browser
- Download final high-resolution outputs
- Full support for desktop and mobile interfaces
- Evaluated with PSNR, SSIM, LPIPS, ΔE₀₀, OCR confidence, and more

## 🚀  How to Run Locally

### 📂 Clone the repository
```bash
git clone https://github.com/MalinaNeag/modular-super-res-project.git
cd modular-super-res-project
```

### ▶️ Run the backend
```bash
cd image-enhancement-backend
python app.py
```

### ▶️ Run the frontend
In a separate terminal:
```bash
cd ../image-enhancement-frontend
npm install
npm run start
```

## ⚙️ Pipeline Setup (Colab)

Before starting the app, launch the Google Colab notebook to run the enhancement models:

1. Open `colab/SharpifyAI.ipynb`
2. Run all cells
3. Copy the generated `https://xxxx.gradio.live` link
4. Paste into both `.env` files as `GRADIO_URL`

## 🌍 Environment Variables

Create `.env` files in both frontend and backend directories:

### Frontend `.env`
```env
# Firebase
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=

# Backend & Gradio
REACT_APP_BACKEND_URL=http://127.0.0.1:5000
REACT_APP_GRADIO_URL=https://your-gradio-link.gradio.live

# AWS
REACT_APP_AWS_ACCESS_KEY_ID=
REACT_APP_AWS_SECRET_ACCESS_KEY=
AWS_BUCKET_NAME=
AWS_REGION=
```

### Backend `.env`
```env
# Flask security key
FLASK_SECRET_KEY=

# Google OAuth2 credentials (from Google Cloud Console)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://127.0.0.1:5000/login/callback

# Firebase API key (can match frontend key)
FIREBASE_API_KEY=

# AWS credentials (from AWS IAM)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_BUCKET_NAME=
AWS_REGION=

# Gradio URL from Colab
GRADIO_URL=https://your-gradio-link.gradio.live
```

### 🔐 Where to get these credentials

- **Firebase variables**: from Firebase Console → Project Settings
- **Google OAuth**: from Google Cloud Console → OAuth 2.0 Credentials
- **AWS**: from AWS IAM (Access Key, Secret Key) and S3 bucket
- **Gradio**: generated when running the Colab notebook

## 📱 Mobile Support

This application is fully responsive and supports both desktop and mobile interfaces.

## 📁 Project Structure
```
modular-super-res-project/
├── image-enhancement-backend/   # Flask API
├── image-enhancement-frontend/  # React App
├── SharpifyAI/                  # Colab Notebooks
└── README.md
```

## 🔐 License & Academic Use

This project was developed as part of a Bachelor Thesis and is intended for academic and educational use only. All AI model integrations are sourced from publicly available pretrained repositories.

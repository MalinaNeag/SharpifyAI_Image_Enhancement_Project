FROM nvidia/cuda:11.3.1-cudnn8-runtime-ubuntu20.04

ENV DEBIAN_FRONTEND=noninteractive
# Install basic dependencies
# Add required build dependencies before installing Python packages
RUN apt-get update && \
    apt-get install -y \
    python3 \
    python3-pip \
    pkg-config \
    libhdf5-dev \
    build-essential \
    cmake \
    git \
    wget \
    curl \
    libglib2.0-0 \
    libsm6 \
    libxrender-dev \
    libxext6 \
    libgl1-mesa-glx \
    tesseract-ocr

# Upgrade pip
RUN pip3 install --upgrade pip
# Install PyTorch and TorchVision manually with the custom index
RUN pip3 install torch==1.12.1 torchvision==0.13.1 -f https://download.pytorch.org/whl/cpu/torch_stable.html

# Copy and install Python dependencies
COPY requirements.txt /app/requirements.txt
WORKDIR /app
RUN pip3 install -r requirements.txt

# Clone RetinaFace
RUN git clone https://github.com/serengil/retinaface.git
RUN pip3 install retina-face

# Clone GFP-GAN
RUN git clone https://github.com/TencentARC/GFPGAN.git
RUN pip3 install -r GFPGAN/requirements.txt
RUN mkdir -p GFPGAN/experiments/pretrained_models
RUN wget -P GFPGAN/experiments/pretrained_models \
    https://github.com/TencentARC/GFPGAN/releases/download/v1.3.4/GFPGANv1.4.pth

# Clone Real-ESRGAN
# Clone Real-ESRGAN and fetch VERSION file explicitly
# Clone Real-ESRGAN and fetch VERSION file explicitly
RUN git clone https://github.com/xinntao/Real-ESRGAN.git
RUN wget https://raw.githubusercontent.com/xinntao/Real-ESRGAN/master/VERSION -P Real-ESRGAN
RUN pip3 install -r Real-ESRGAN/requirements.txt

# Change directory to Real-ESRGAN before running setup.py
WORKDIR /app/Real-ESRGAN
RUN python3 setup.py develop
RUN wget -P weights \
    https://github.com/xinntao/Real-ESRGAN/releases/download/v0.1.0/RealESRGAN_x4plus.pth

# Return to original working directory
WORKDIR /app

# Copy your Python code
COPY pipeline.py /app/pipeline.py
COPY api.py /app/api.py

# Install FastAPI dependencies
RUN pip3 install fastapi uvicorn python-multipart

# Expose the port for the API
EXPOSE 8000

# Start the API with FastAPI
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]
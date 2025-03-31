import argparse
import os
import json
import numpy as np
import torch
from PIL import Image, ImageDraw, ImageOps, ImageFilter, ImageEnhance
from retinaface import RetinaFace
from gfpgan import GFPGANer
import pytesseract


class ImageEnhancementPipeline:
    def __init__(self, input_dir, output_dir, process_face, process_background, process_text):
        self.input_dir = input_dir
        self.output_dir = output_dir
        self.process_face = process_face
        self.process_background = process_background
        self.process_text = process_text

        # Define directories
        self.faces_dir = os.path.join(output_dir, "cropped_faces")
        self.enhanced_faces_dir = os.path.join(output_dir, "enhanced_faces")
        self.images_with_boxes_dir = os.path.join(output_dir, "images_with_boxes")
        self.enhanced_background_dir = os.path.join(output_dir, "enhanced_background")
        self.enhanced_text_dir = os.path.join(output_dir, "enhanced_text")
        self.final_output_dir = os.path.join(output_dir, "final_output")
        self.bounding_boxes_json = os.path.join(output_dir, "face_bounding_boxes.json")

        # Path to the virtual environment for DiffTSR
        self.difftsr_env_path = "/content/difftsr_env"

        # Create necessary directories
        self._create_directories()

    def _create_directories(self):
        os.makedirs(self.input_dir, exist_ok=True)
        os.makedirs(self.output_dir, exist_ok=True)
        os.makedirs(self.faces_dir, exist_ok=True)
        os.makedirs(self.enhanced_faces_dir, exist_ok=True)
        os.makedirs(self.images_with_boxes_dir, exist_ok=True)
        os.makedirs(self.enhanced_background_dir, exist_ok=True)
        os.makedirs(self.enhanced_text_dir, exist_ok=True)
        os.makedirs(self.final_output_dir, exist_ok=True)


    def preprocess_image(self, image):
        """Preprocess the image for better OCR results."""
        # Convert to grayscale
        image = image.convert("L")

        # Increase contrast
        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(2.0)

        # Apply adaptive thresholding
        image = image.point(lambda p: p > 128 and 255)

        return image

    def detect_text_regions(self, image_path):
        """Detect text regions and extract text using Tesseract OCR with preprocessing."""
        print(f"[INFO] Detecting text regions in: {os.path.basename(image_path)}")
        try:
            image = Image.open(image_path)

            # Preprocess the image
            preprocessed_image = self.preprocess_image(image)

            # Perform OCR
            ocr_data = pytesseract.image_to_data(preprocessed_image, output_type=pytesseract.Output.DICT)
            text_data = []

            # Extract bounding boxes and text
            for i in range(len(ocr_data['text'])):
                text = ocr_data['text'][i].strip()
                if text:  # Only consider non-empty text
                    x, y, w, h = ocr_data['left'][i], ocr_data['top'][i], ocr_data['width'][i], ocr_data['height'][i]
                    text_data.append({
                        "text": text,
                        "bounding_box": {
                            "x1": x,
                            "y1": y,
                            "x2": x + w,
                            "y2": y + h
                        }
                    })

            print(f"[INFO] Detected {len(text_data)} text regions.")
            return text_data

        except Exception as e:
            print(f"[ERROR] Error detecting text regions: {e}")
            return []

    def save_text_to_json(self, text_data, file_name):
        """Save detected text and bounding boxes to a JSON file."""
        print(f"[INFO] Saving detected text to JSON for: {file_name}")
        try:
            json_path = os.path.join(self.final_output_dir, f"{os.path.splitext(file_name)[0]}_text.json")
            with open(json_path, "w") as json_file:
                json.dump(text_data, json_file, indent=4)
            print(f"[INFO] Text data saved to: {json_path}")
        except Exception as e:
            print(f"[ERROR] Error saving text to JSON: {e}")

    def enhance_text_region(self, text_region, image_path):
        """Enhance a single text region using DiffTSR."""
        x1, y1, x2, y2 = text_region['bounding_box'].values()
        cropped_text_image = Image.open(image_path).crop((x1, y1, x2, y2))
        cropped_text_path = os.path.join(self.enhanced_text_dir, f"text_region_{x1}_{y1}.png")
        cropped_text_image.save(cropped_text_path)

        # Run DiffTSR in the virtual environment
        enhanced_text_path = os.path.join(self.enhanced_text_dir, f"text_region_{x1}_{y1}_enhanced.png")
        command = f"""
            . {self.difftsr_env_path} && \
            python /content/DiffTSR/inference_DiffTSR.py \
                --ckpt_path /content/DiffTSR/ckpt/DiffTSR.ckpt \
                --config_path /content/DiffTSR/model/DiffTSR_config.yaml \
                --img_path {cropped_text_path} \
                --save_path {enhanced_text_path}
        """
        os.system(command)

        if not os.path.exists(enhanced_text_path):
            print(f"[WARNING] Enhanced text not found for region ({x1}, {y1}, {x2}, {y2})")
            return None

        return enhanced_text_path

    def enhance_text(self, image_path, text_regions):
        """Enhance all text regions and overlay them back onto the base image."""
        print(f"[INFO] Enhancing text for: {os.path.basename(image_path)}")
        enhanced_regions = []

        for region in text_regions:
            enhanced_path = self.enhance_text_region(region, image_path)
            if enhanced_path:
                enhanced_regions.append((region, enhanced_path))

        # Overlay each enhanced text region onto the original image
        base_image = Image.open(image_path).convert("RGBA")
        for region, enhanced_path in enhanced_regions:
            enhanced_image = Image.open(enhanced_path).convert("RGBA")
            x1, y1, x2, y2 = region['bounding_box'].values()

            resized_enhanced_text = enhanced_image.resize((x2 - x1, y2 - y1), Image.LANCZOS)
            mask = Image.new("L", resized_enhanced_text.size, 255)
            base_image.paste(resized_enhanced_text, (x1, y1), mask)

        final_output_path = os.path.join(self.final_output_dir, f"{os.path.basename(image_path).split('.')[0]}_text_enhanced.png")
        base_image.save(final_output_path)
        print(f"[INFO] Final image with enhanced text saved to: {final_output_path}")

        return final_output_path



    def overlay_enhanced_text(self, base_image_path, enhanced_text_path, final_output_name):
        """Overlay enhanced text onto the base image."""
        print(f"[INFO] Overlaying enhanced text on: {final_output_name}")
        try:
            base_image = Image.open(base_image_path).convert("RGBA")
            enhanced_text_image = Image.open(enhanced_text_path).convert("RGBA")

            # Overlay the enhanced text
            combined_image = Image.alpha_composite(base_image, enhanced_text_image)

            # Convert to RGB if saving as JPEG
            combined_image = combined_image.convert("RGB")

            # Save the final image
            final_output_path = os.path.join(self.final_output_dir, final_output_name)
            combined_image.save(final_output_path, "JPEG")
            print(f"[INFO] Final image with enhanced text saved: {final_output_path}")
        except Exception as e:
            print(f"[ERROR] Error overlaying enhanced text: {e}")


    def detect_faces(self, image_path, file_name):
        """Detect faces and save cropped images."""
        print(f"[INFO] Detecting faces in: {file_name}")
        try:
            faces = RetinaFace.detect_faces(image_path)
            if not faces:
                print(f"[INFO] No faces detected in: {file_name}")
                return []

            face_data = []
            img = Image.open(image_path)
            annotated_image = img.copy()
            draw = ImageDraw.Draw(annotated_image)

            for i, (face_key, face_info) in enumerate(faces.items()):
                x1, y1, x2, y2 = map(int, face_info["facial_area"])
                cropped_face = img.crop((x1, y1, x2, y2))
                cropped_face_path = os.path.join(self.faces_dir, f"{file_name}_face_{i + 1}.jpg")
                cropped_face.save(cropped_face_path)

                # Draw rectangle and landmarks
                draw.rectangle([(x1, y1), (x2, y2)], outline="red", width=5)
                landmarks = face_info.get("landmarks", {})
                for lx, ly in landmarks.values():
                    draw.ellipse([(lx - 3, ly - 3), (lx + 3, ly + 3)], fill="blue")

                face_data.append({
                    "face_index": i + 1,
                    "coordinates": {"x1": x1, "y1": y1, "x2": x2, "y2": y2},
                    "score": float(face_info.get("score", 0)),
                    "landmarks": landmarks,
                    "cropped_path": cropped_face_path
                })

            annotated_image_path = os.path.join(self.images_with_boxes_dir, f"{file_name}_with_boxes.jpg")
            annotated_image.save(annotated_image_path)
            print(f"[INFO] Annotated image saved: {annotated_image_path}")

            return face_data

        except Exception as e:
            print(f"[ERROR] Error during face detection in {file_name}: {e}")
            return []

    def enhance_faces(self, face_data):
        """Enhance faces using GFP-GAN."""
        print("[INFO] Enhancing faces...")
        gfpgan = GFPGANer(
            model_path='GFPGAN/experiments/pretrained_models/GFPGANv1.4.pth',
            upscale=4,
            arch='clean',
            channel_multiplier=2,
            bg_upsampler=None,
            device='cuda' if torch.cuda.is_available() else 'cpu'
        )

        for face_info in face_data:
            cropped_face_path = face_info["cropped_path"]
            enhanced_face_path = os.path.join(self.enhanced_faces_dir, os.path.basename(cropped_face_path))

            try:
                print(f"[INFO] Running GFP-GAN on {cropped_face_path}...")
                input_image = Image.open(cropped_face_path).convert("RGB")
                _, _, enhanced_face = gfpgan.enhance(np.array(input_image), has_aligned=False, only_center_face=True)
                enhanced_image = Image.fromarray(enhanced_face)
                enhanced_image.save(enhanced_face_path)
                face_info["enhanced_path"] = enhanced_face_path
                print(f"[INFO] Enhanced face saved to: {enhanced_face_path}")
            except Exception as e:
                print(f"[ERROR] GFP-GAN failed for {cropped_face_path}: {e}")

    def merge_faces_into_original(self, face_data, original_path, final_output_name):
      """Merge enhanced faces into the original image."""
      print(f"[INFO] Merging enhanced faces into the original image for {final_output_name}...")
      original_image = Image.open(original_path).convert("RGB")

      for face_info in face_data:
          x1, y1, x2, y2 = face_info["coordinates"].values()
          enhanced_face_path = face_info.get("enhanced_path")
          if not enhanced_face_path:
              continue

          enhanced_face = Image.open(enhanced_face_path).convert("RGBA")
          resized_face = enhanced_face.resize((x2 - x1, y2 - y1), Image.LANCZOS)
          mask = Image.new("L", resized_face.size, 255).filter(ImageFilter.GaussianBlur(radius=30))
          original_image.paste(resized_face, (x1, y1), mask)

      final_output_path = os.path.join(self.final_output_dir, final_output_name)
      original_image.save(final_output_path)
      print(f"[INFO] Final image with enhanced faces saved: {final_output_path}")


    def enhance_background(self, image_path):
        """Enhance background using Real-ESRGAN."""
        print(f"[INFO] Enhancing background for {image_path}...")
        try:
            # Modify the output filename to include "_background"
            file_name = os.path.basename(image_path)
            enhanced_image_name = f"{os.path.splitext(file_name)[0]}_background{os.path.splitext(file_name)[1]}"
            enhanced_path = os.path.join(self.enhanced_background_dir, enhanced_image_name)

            # Only process the current image
            command = f"""
                python /content/Real-ESRGAN/inference_realesrgan.py \
                    -i {image_path} \
                    -o {self.enhanced_background_dir} \
                    -n RealESRGAN_x4plus \
                    --outscale 4 \
                    --tile 512 \
                    --denoise 0.5 \
                    --suffix background \
                    --fp32
            """
            os.system(command)

            if not os.path.exists(enhanced_path):
                raise FileNotFoundError(f"Enhanced background not found at {enhanced_path}")

            print(f"[INFO] Enhanced background saved: {enhanced_path}")
            return enhanced_path
        except Exception as e:
            print(f"[ERROR] Error enhancing background for {image_path}: {e}")
            return None

    def multi_scale_blending(self, face_img, background_img, mask, levels=6):
      """
      Perform multi-scale blending using image pyramids for smooth transitions.
      :param face_img: The enhanced face image.
      :param background_img: The cropped background image.
      :param mask: The alpha mask for blending.
      :param levels: Number of pyramid levels for blending.
      :return: Blended image.
      """
      # Build Gaussian pyramids
      face_pyramid = [face_img]
      bg_pyramid = [background_img]
      mask_pyramid = [mask]

      for _ in range(levels - 1):
          face_pyramid.append(face_pyramid[-1].resize(
              (face_pyramid[-1].width // 2, face_pyramid[-1].height // 2), Image.Resampling.LANCZOS))
          bg_pyramid.append(bg_pyramid[-1].resize(
              (bg_pyramid[-1].width // 2, bg_pyramid[-1].height // 2), Image.Resampling.LANCZOS))
          mask_pyramid.append(mask_pyramid[-1].resize(
              (mask_pyramid[-1].width // 2, mask_pyramid[-1].height // 2), Image.Resampling.LANCZOS))

      # Blend starting from the smallest level
      blended = Image.composite(face_pyramid[-1], bg_pyramid[-1], mask_pyramid[-1])
      for i in range(levels - 2, -1, -1):
          blended = blended.resize(face_pyramid[i].size, Image.Resampling.LANCZOS)
          blended = Image.composite(face_pyramid[i], blended, mask_pyramid[i])

      return blended

    def merge_faces_and_background(self, background_path, face_data, final_output_name):
      """Merge enhanced faces into the enhanced background with advanced blending and edge smoothing."""
      print(f"[INFO] Merging enhanced faces and background for {final_output_name}...")

      try:
          # Load the Real-ESRGAN-enhanced background
          background_image = Image.open(background_path).convert("RGB")
          original_width, original_height = background_image.size

          # Process each detected face
          for face_info in face_data:
              x1, y1, x2, y2 = face_info["coordinates"].values()

              # Calculate the scaled bounding box coordinates
              upscale_factor_x = 4
              upscale_factor_y = 4
              scaled_x1 = int(x1 * upscale_factor_x)
              scaled_y1 = int(y1 * upscale_factor_y)
              scaled_x2 = int(x2 * upscale_factor_x)
              scaled_y2 = int(y2 * upscale_factor_y)

              # Load the enhanced face image
              enhanced_face_path = face_info.get("enhanced_path")
              if not enhanced_face_path or not os.path.exists(enhanced_face_path):
                  print(f"[WARNING] Enhanced face not found for {final_output_name}")
                  continue

              enhanced_face = Image.open(enhanced_face_path).convert("RGBA")
              face_width = scaled_x2 - scaled_x1
              face_height = scaled_y2 - scaled_y1

              # Resize the enhanced face
              resized_face = ImageOps.fit(enhanced_face, (face_width, face_height), method=Image.LANCZOS)

              # Create a soft gradient mask for blending
              mask = Image.new("L", resized_face.size, 255)
              mask = mask.filter(ImageFilter.GaussianBlur(radius=30))  # Larger radius for smoother edges

              # Extract the corresponding region from the background
              background_crop = background_image.crop((scaled_x1, scaled_y1, scaled_x2, scaled_y2))
              blended_face = Image.composite(resized_face, background_crop, mask)

              # Perform multi-scale blending for smoother integration
              blended_face = self.multi_scale_blending(blended_face, background_crop, mask)

              # Paste the blended face back onto the background
              background_image.paste(blended_face, (scaled_x1, scaled_y1), mask)

          # Save the final merged image
          final_output_path = os.path.join(self.final_output_dir, final_output_name)
          background_image.save(final_output_path)
          print(f"[INFO] Final merged image saved: {final_output_path}")

      except Exception as e:
          print(f"[ERROR] Error during merging faces and background: {e}")

    def merge_original_faces_and_enhanced_background(self, background_path, original_path, face_data, final_output_name):
        """Replace enhanced faces in the background with original faces."""
        print(f"[INFO] Replacing enhanced faces with original faces in {final_output_name}...")

        try:
            # Load the enhanced background and the original input image
            enhanced_background = Image.open(background_path).convert("RGB")
            original_image = Image.open(original_path).convert("RGB")

            # Determine the scaling factor (e.g., 4x from Real-ESRGAN)
            scale_factor = 4
            enhanced_width, enhanced_height = enhanced_background.size
            original_width, original_height = original_image.size

            # Check if scaling matches expectations
            assert enhanced_width == original_width * scale_factor
            assert enhanced_height == original_height * scale_factor

            for face_info in face_data:
                # Get face bounding box coordinates
                x1, y1, x2, y2 = face_info["coordinates"].values()

                # Scale the coordinates to match the enhanced background
                scaled_x1 = int(x1 * scale_factor)
                scaled_y1 = int(y1 * scale_factor)
                scaled_x2 = int(x2 * scale_factor)
                scaled_y2 = int(y2 * scale_factor)

                # Crop the original face region directly from the original image
                original_face = original_image.crop((x1, y1, x2, y2))

                # Resize the cropped face to match its scaled region
                face_width, face_height = scaled_x2 - scaled_x1, scaled_y2 - scaled_y1
                resized_face = original_face.resize((face_width, face_height), Image.LANCZOS)

                # Create a mask for smooth blending
                mask = Image.new("L", resized_face.size, 255).filter(ImageFilter.GaussianBlur(radius=10))

                # Paste the resized face onto the enhanced background
                enhanced_background.paste(resized_face, (scaled_x1, scaled_y1), mask)

            # Save the final merged image
            final_output_path = os.path.join(self.final_output_dir, final_output_name)
            enhanced_background.save(final_output_path)
            print(f"[INFO] Final image with original faces and enhanced background saved: {final_output_path}")

        except Exception as e:
            print(f"[ERROR] Error during merging: {e}")

    def save_bounding_boxes(self, bounding_boxes):
        """Save bounding box data to JSON."""
        print("[INFO] Saving bounding box data...")
        try:
            # Convert NumPy types to native Python types
            def convert_np_to_native(obj):
                if isinstance(obj, (float, np.float32)):
                    return float(obj)
                if isinstance(obj, (int, np.int32)):
                    return int(obj)
                if isinstance(obj, dict):
                    return {k: convert_np_to_native(v) for k, v in obj.items()}
                if isinstance(obj, list):
                    return [convert_np_to_native(v) for v in obj]
                return obj

            bounding_boxes = convert_np_to_native(bounding_boxes)

            with open(self.bounding_boxes_json, "w") as json_file:
                json.dump(bounding_boxes, json_file, indent=4)
            print(f"[INFO] Bounding box data saved: {self.bounding_boxes_json}")
        except Exception as e:
            print(f"[ERROR] Error saving bounding boxes: {e}")

    def run_pipeline(self):
        """Run the full pipeline."""
        print("[INFO] Starting the pipeline...")

        for file_name in os.listdir(self.input_dir):
            # Skip non-image files
            if not file_name.lower().endswith((".jpg", ".jpeg", ".png")):
                print(f"[INFO] Skipping non-image file: {file_name}")
                continue

            input_path = os.path.join(self.input_dir, file_name)
            face_data = self.detect_faces(input_path, file_name) if self.process_face or self.process_background else []

            # Option 1: Background only
            if self.process_background and not self.process_face:
                print(f"[INFO] Processing background enhancement for: {file_name}")

                # Enhance the full image (background)
                enhanced_bg_path = self.enhance_background(input_path)

                if enhanced_bg_path and os.path.exists(enhanced_bg_path):
                    # Replace enhanced faces with original faces
                    final_output_name = f"{os.path.splitext(file_name)[0]}_background_original_faces{os.path.splitext(file_name)[1]}"
                    self.merge_original_faces_and_enhanced_background(
                        enhanced_bg_path, input_path, face_data, final_output_name
                    )
                else:
                    print(f"[ERROR] Enhanced background not found for {file_name}")

            # Option 2: Face enhancement only
            elif self.process_face and not self.process_background:
                if face_data:
                    print(f"[INFO] Processing face enhancement for: {file_name}")
                    # Enhance detected faces
                    self.enhance_faces(face_data)

                    # Merge enhanced faces back into the original image
                    final_output_name = f"{os.path.splitext(file_name)[0]}_face{os.path.splitext(file_name)[1]}"
                    self.merge_faces_into_original(face_data, input_path, final_output_name)
                else:
                    print(f"[INFO] No faces detected in {file_name}, skipping face enhancement.")

            # Option 3: Both face and background enhancement
            elif self.process_face and self.process_background:
                print(f"[INFO] Processing both face and background enhancement for: {file_name}")

                # Enhance the background
                enhanced_bg_path = self.enhance_background(input_path)

                if enhanced_bg_path and os.path.exists(enhanced_bg_path):
                    if face_data:
                        # Enhance detected faces
                        self.enhance_faces(face_data)

                    # Merge enhanced faces and enhanced background
                    final_output_name = f"{os.path.splitext(file_name)[0]}_face_background{os.path.splitext(file_name)[1]}"
                    self.merge_faces_and_background(enhanced_bg_path, face_data, final_output_name)
                else:
                    print(f"[ERROR] Enhanced background not found for {file_name}")

            # Option 4: Text enhancement
            if self.process_text:
                print(f"[INFO] Processing text enhancement for: {file_name}")
                detected_text = self.detect_text_regions(input_path)
                if detected_text:
                    self.save_text_to_json(detected_text, file_name)
                    enhanced_text_path = self.enhance_text(input_path, detected_text)
                    if enhanced_text_path:
                        final_output_name = f"{os.path.splitext(file_name)[0]}_final_with_text{os.path.splitext(file_name)[1]}"
                        self.overlay_enhanced_text(input_path, enhanced_text_path, final_output_name)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Image Enhancement Pipeline")
    parser.add_argument("--input_dir", type=str, required=True, help="Input directory")
    parser.add_argument("--output_dir", type=str, required=True, help="Output directory")
    parser.add_argument("--face", action="store_true", help="Enable face enhancement")
    parser.add_argument("--background", action="store_true", help="Enable background enhancement")
    parser.add_argument("--text", action="store_true", help="Enable text enhancement")
    args = parser.parse_args()

    pipeline = ImageEnhancementPipeline(
        input_dir=args.input_dir,
        output_dir=args.output_dir,
        process_face=args.face,
        process_background=args.background,
        process_text=args.text
    )
    pipeline.run_pipeline()
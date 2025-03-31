from fastapi import FastAPI, File, UploadFile
from pipeline import ImageEnhancementPipeline
import shutil, os

app = FastAPI()

pipeline = ImageEnhancementPipeline(
    input_dir="input",
    output_dir="output",
    process_face=True,
    process_background=True,
    process_text=True
)

@app.post("/enhance")
async def enhance_image(file: UploadFile = File(...)):
    input_path = f"input/{file.filename}"
    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    pipeline.run_pipeline()

    output_image_path = f"output/final_output/{file.filename}"
    return {"enhanced_image_url": output_image_path}
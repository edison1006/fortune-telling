from typing import List

from fastapi import Depends, FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import models, schemas
from .db import Base, engine, get_db
from .ocr import analyze_image_text

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Fortune Telling API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/readings", response_model=schemas.ReadingOut)
def create_reading(reading: schemas.ReadingCreate, db: Session = Depends(get_db)):
    db_reading = models.Reading(
        type=reading.type,
        input_data=reading.input_data,
        result=reading.result,
        user_id=reading.user_id,
    )
    db.add(db_reading)
    db.commit()
    db.refresh(db_reading)
    return db_reading


@app.get("/readings", response_model=List[schemas.ReadingOut])
def list_readings(db: Session = Depends(get_db)):
    return db.query(models.Reading).order_by(models.Reading.created_at.desc()).limit(50).all()


@app.post("/ocr/face")
async def ocr_face(image: UploadFile = File(...)):
    """
    Upload a face photo; returns raw OCR text extracted by AWS Textract.
    """
    return await analyze_image_text(image, mode="face")


@app.post("/ocr/palm")
async def ocr_palm(image: UploadFile = File(...)):
    """
    Upload a palm photo; returns raw OCR text extracted by AWS Textract.
    """
    return await analyze_image_text(image, mode="palm")





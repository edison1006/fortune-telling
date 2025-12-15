import os
from typing import Literal

import boto3
from fastapi import HTTPException, UploadFile

AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")


def _get_textract_client():
    if not (AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY):
        # Allow running locally without credentials; raise a clear error only when called.
        raise HTTPException(
            status_code=500,
            detail="AWS credentials are not configured. Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY.",
        )
    return boto3.client(
        "textract",
        region_name=AWS_REGION,
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    )


async def analyze_image_text(file: UploadFile, mode: Literal["face", "palm"]):
    """
    Simple wrapper around AWS Textract OCR.
    In future you can switch to Rekognition for face landmarks / attributes.
    """
    try:
        content = await file.read()
        client = _get_textract_client()
        response = client.detect_document_text(Document={"Bytes": content})
        lines = [
            item["DetectedText"]
            for item in response.get("Blocks", [])
            if item.get("BlockType") == "LINE"
        ]
        return {
            "mode": mode,
            "raw_text": "\n".join(lines),
            "summary": (
                "OCR successful. Use this text plus your own rules/model "
                "to interpret palmistry / face-reading details."
            ),
        }
    except HTTPException:
        raise
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"OCR error: {exc}") from exc








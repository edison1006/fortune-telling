from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ReadingCreate(BaseModel):
    type: str
    input_data: str
    result: str
    user_id: Optional[int] = None


class ReadingOut(BaseModel):
    id: int
    type: str
    input_data: str
    result: str
    user_id: Optional[int]
    created_at: datetime

    class Config:
        orm_mode = True


class BaziRequest(BaseModel):
    """Simple Bazi input: birth date and optional time."""

    birth_date: str  # ISO date string: YYYY-MM-DD
    birth_time: Optional[str] = None  # HH:MM, optional
    user_id: Optional[int] = None


class BaziPillar(BaseModel):
    stem: str
    branch: str
    element: str
    animal: Optional[str] = None


class BaziResponse(BaseModel):
    year_pillar: BaziPillar
    month_pillar: Optional[BaziPillar] = None
    day_pillar: Optional[BaziPillar] = None
    hour_pillar: Optional[BaziPillar] = None
    summary: str
    interpretation: Optional[str] = None  # AI生成的解读
    raw_input: BaziRequest


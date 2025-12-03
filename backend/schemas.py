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





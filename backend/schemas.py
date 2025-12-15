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
    hidden_stems: Optional[list] = None  # 地支藏干
    ten_god: Optional[str] = None  # 十神


class ElementAnalysis(BaseModel):
    """五行分析"""
    element_count: dict  # 各五行数量
    dominant_element: Optional[str] = None  # 主导五行
    missing_elements: list = []  # 缺失的五行
    element_balance: str = ""  # 五行平衡情况


class TenGodAnalysis(BaseModel):
    """十神分析"""
    year_ten_god: Optional[str] = None
    month_ten_god: Optional[str] = None
    day_ten_god: str = "日主"  # 日主
    hour_ten_god: Optional[str] = None
    ten_god_summary: str = ""  # 十神总结


class BaziAnalysis(BaseModel):
    """八字综合分析"""
    day_master: str  # 日主
    day_master_element: str  # 日主五行
    element_analysis: ElementAnalysis
    ten_god_analysis: TenGodAnalysis
    use_god: Optional[str] = None  # 用神
    avoid_god: Optional[str] = None  # 忌神
    analysis_summary: str = ""  # 分析总结


class BaziResponse(BaseModel):
    year_pillar: BaziPillar
    month_pillar: Optional[BaziPillar] = None
    day_pillar: Optional[BaziPillar] = None
    hour_pillar: Optional[BaziPillar] = None
    summary: str
    interpretation: Optional[str] = None  # AI生成的解读
    analysis: Optional[BaziAnalysis] = None  # 详细分析
    raw_input: BaziRequest


from datetime import datetime
from typing import Optional, List, Dict

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
    """Simple Bazi input: birth date, optional time, and optional focus."""

    birth_date: str  # ISO date string: YYYY-MM-DD
    birth_time: Optional[str] = None  # HH:MM, optional
    # Focus of analysis:
    # overall: overall fate / life pattern
    # wealth:  wealth
    # career:  career
    # love:    love / romance
    # health:  health
    # family:  family
    analysis_focus: Optional[str] = None
    user_id: Optional[int] = None


class BaziPillar(BaseModel):
    stem: str
    branch: str
    element: str
    animal: Optional[str] = None
    hidden_stems: Optional[List[str]] = None  # Hidden heavenly stems within the Earthly Branch
    ten_god: Optional[str] = None  # Ten-God relationship relative to the Day Master


class ElementAnalysis(BaseModel):
    """Five Elements (Wu Xing) analysis."""

    element_count: Dict[str, float]  # Count/weight of each element
    dominant_element: Optional[str] = None  # Dominant element
    missing_elements: List[str] = []  # Elements that are relatively weak/absent
    element_balance: str = ""  # Balance description among the Five Elements


class TenGodAnalysis(BaseModel):
    """Ten-God (Shi Shen) analysis."""
    year_ten_god: Optional[str] = None
    month_ten_god: Optional[str] = None
    day_ten_god: str = "Day Master"  # Day Master itself
    hour_ten_god: Optional[str] = None
    ten_god_summary: str = ""  # Overall summary of Ten-God distribution


class BaziAnalysis(BaseModel):
    """Overall Bazi structural analysis."""

    day_master: str  # Day Master stem
    day_master_element: str  # Day Master's element
    element_analysis: ElementAnalysis
    ten_god_analysis: TenGodAnalysis
    use_god: Optional[str] = None  # Useful god (Yong Shen)
    avoid_god: Optional[str] = None  # Unfavorable god (Ji Shen)
    analysis_summary: str = ""  # Text summary of the analysis


class BaziResponse(BaseModel):
    year_pillar: BaziPillar
    month_pillar: Optional[BaziPillar] = None
    day_pillar: Optional[BaziPillar] = None
    hour_pillar: Optional[BaziPillar] = None
    summary: str
    interpretation: Optional[str] = None  # AI-generated interpretation text
    analysis: Optional[BaziAnalysis] = None  # Detailed structural analysis
    raw_input: BaziRequest


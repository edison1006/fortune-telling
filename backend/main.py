from typing import List
from datetime import datetime
import json

from fastapi import Depends, FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import models, schemas
from .db import Base, engine, get_db
from .ocr import analyze_image_text

# 尝试导入AI服务，如果失败也不影响基本功能
try:
    from .ai_service import generate_bazi_interpretation
    AI_SERVICE_AVAILABLE = True
except ImportError:
    AI_SERVICE_AVAILABLE = False
    print("Warning: AI service not available, will use basic interpretation")

# 尝试创建数据库表，如果失败也不影响API功能
try:
    Base.metadata.create_all(bind=engine)
except Exception as db_init_error:
    print(f"Warning: Database initialization failed: {db_init_error}")
    print("API will work without database")

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


HEAVENLY_STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]
EARTHLY_BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]
FIVE_ELEMENTS = {
    "甲": "木",
    "乙": "木",
    "丙": "火",
    "丁": "火",
    "戊": "土",
    "己": "土",
    "庚": "金",
    "辛": "金",
    "壬": "水",
    "癸": "水",
}
CHINESE_ZODIAC = [
    "鼠",
    "牛",
    "虎",
    "兔",
    "龙",
    "蛇",
    "马",
    "羊",
    "猴",
    "鸡",
    "狗",
    "猪",
]


def compute_year_pillar(year: int) -> schemas.BaziPillar:
    """
    Calculate year pillar using 1984 (甲子年) as base of 60-year cycle.
    """
    base_year = 1984  # 甲子年
    offset = (year - base_year) % 60
    stem = HEAVENLY_STEMS[offset % 10]
    branch_index = offset % 12
    branch = EARTHLY_BRANCHES[branch_index]
    element = FIVE_ELEMENTS[stem]
    animal = CHINESE_ZODIAC[branch_index]
    return schemas.BaziPillar(stem=stem, branch=branch, element=element, animal=animal)


def compute_month_pillar(year_stem: str, month: int) -> schemas.BaziPillar:
    """
    Calculate month pillar using 年上起月法 (Year-based month calculation).
    Month 1 = 寅月 (February), Month 2 = 卯月 (March), etc.
    """
    # 年上起月法：根据年干确定月干
    # 甲己之年丙作首，乙庚之年戊为头，丙辛之年寻庚起，丁壬壬寅顺水流，若问戊癸何处起，甲寅之上好追求
    month_stem_map = {
        "甲": ["丙", "丁", "戊", "己", "庚", "辛", "壬", "癸", "甲", "乙", "丙", "丁"],
        "乙": ["戊", "己", "庚", "辛", "壬", "癸", "甲", "乙", "丙", "丁", "戊", "己"],
        "丙": ["庚", "辛", "壬", "癸", "甲", "乙", "丙", "丁", "戊", "己", "庚", "辛"],
        "丁": ["壬", "癸", "甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"],
        "戊": ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸", "甲", "乙"],
        "己": ["丙", "丁", "戊", "己", "庚", "辛", "壬", "癸", "甲", "乙", "丙", "丁"],
        "庚": ["戊", "己", "庚", "辛", "壬", "癸", "甲", "乙", "丙", "丁", "戊", "己"],
        "辛": ["庚", "辛", "壬", "癸", "甲", "乙", "丙", "丁", "戊", "己", "庚", "辛"],
        "壬": ["壬", "癸", "甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"],
        "癸": ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸", "甲", "乙"],
    }
    
    # 月份对应地支：1月=寅，2月=卯，...，12月=丑
    month_branches = ["寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥", "子", "丑"]
    
    # 调整月份：公历1月对应农历12月（丑月），公历2月对应农历1月（寅月）
    if month == 1:
        lunar_month = 12  # 丑月
    else:
        lunar_month = month - 1  # 公历2月=农历1月（寅月）
    
    stem = month_stem_map[year_stem][lunar_month - 1]
    branch = month_branches[lunar_month - 1]
    element = FIVE_ELEMENTS[stem]
    
    return schemas.BaziPillar(stem=stem, branch=branch, element=element, animal=None)


def compute_day_pillar(year: int, month: int, day: int) -> schemas.BaziPillar:
    """
    Calculate day pillar using a simplified formula.
    This is a simplified version; for production, use a proper Chinese calendar library.
    """
    # 使用1900年1月1日为基准日（庚子日）
    base_date = datetime(1900, 1, 1)
    target_date = datetime(year, month, day)
    days_diff = (target_date - base_date).days
    
    # 1900年1月1日是庚子日，庚是第6个天干（索引6），子是第0个地支（索引0）
    base_stem_index = 6
    base_branch_index = 0
    
    stem_index = (base_stem_index + days_diff) % 10
    branch_index = (base_branch_index + days_diff) % 12
    
    stem = HEAVENLY_STEMS[stem_index]
    branch = EARTHLY_BRANCHES[branch_index]
    element = FIVE_ELEMENTS[stem]
    
    return schemas.BaziPillar(stem=stem, branch=branch, element=element, animal=None)


def compute_hour_pillar(day_stem: str, hour: int) -> schemas.BaziPillar:
    """
    Calculate hour pillar using 日上起时法 (Day-based hour calculation).
    Hour 23-1 = 子时, 1-3 = 丑时, ..., 21-23 = 亥时
    """
    # 日上起时法：根据日干确定时干
    # 甲己还生甲，乙庚丙作初，丙辛从戊起，丁壬庚子居，戊癸何方发，壬子是真途
    hour_stem_map = {
        "甲": ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸", "甲", "乙"],
        "乙": ["丙", "丁", "戊", "己", "庚", "辛", "壬", "癸", "甲", "乙", "丙", "丁"],
        "丙": ["戊", "己", "庚", "辛", "壬", "癸", "甲", "乙", "丙", "丁", "戊", "己"],
        "丁": ["庚", "辛", "壬", "癸", "甲", "乙", "丙", "丁", "戊", "己", "庚", "辛"],
        "戊": ["壬", "癸", "甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"],
        "己": ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸", "甲", "乙"],
        "庚": ["丙", "丁", "戊", "己", "庚", "辛", "壬", "癸", "甲", "乙", "丙", "丁"],
        "辛": ["戊", "己", "庚", "辛", "壬", "癸", "甲", "乙", "丙", "丁", "戊", "己"],
        "壬": ["庚", "辛", "壬", "癸", "甲", "乙", "丙", "丁", "戊", "己", "庚", "辛"],
        "癸": ["壬", "癸", "甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"],
    }
    
    # 时辰对应地支：23-1=子，1-3=丑，3-5=寅，5-7=卯，7-9=辰，9-11=巳，11-13=午，13-15=未，15-17=申，17-19=酉，19-21=戌，21-23=亥
    hour_branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]
    
    # 确定时辰索引（时辰从23点开始）
    if hour == 23 or hour == 0:
        hour_index = 0  # 子时 (23:00-01:00)
    elif hour >= 1 and hour < 3:
        hour_index = 1  # 丑时 (01:00-03:00)
    elif hour >= 3 and hour < 5:
        hour_index = 2  # 寅时 (03:00-05:00)
    elif hour >= 5 and hour < 7:
        hour_index = 3  # 卯时 (05:00-07:00)
    elif hour >= 7 and hour < 9:
        hour_index = 4  # 辰时 (07:00-09:00)
    elif hour >= 9 and hour < 11:
        hour_index = 5  # 巳时 (09:00-11:00)
    elif hour >= 11 and hour < 13:
        hour_index = 6  # 午时 (11:00-13:00)
    elif hour >= 13 and hour < 15:
        hour_index = 7  # 未时 (13:00-15:00)
    elif hour >= 15 and hour < 17:
        hour_index = 8  # 申时 (15:00-17:00)
    elif hour >= 17 and hour < 19:
        hour_index = 9  # 酉时 (17:00-19:00)
    elif hour >= 19 and hour < 21:
        hour_index = 10  # 戌时 (19:00-21:00)
    else:  # hour >= 21 and hour < 23
        hour_index = 11  # 亥时 (21:00-23:00)
    
    stem = hour_stem_map[day_stem][hour_index]
    branch = hour_branches[hour_index]
    element = FIVE_ELEMENTS[stem]
    
    return schemas.BaziPillar(stem=stem, branch=branch, element=element, animal=None)


@app.post("/bazi", response_model=schemas.BaziResponse)
def calculate_bazi(payload: schemas.BaziRequest, db: Session = Depends(get_db)):
    """
    Calculate complete Bazi (Four Pillars): Year, Month, Day, and Hour pillars.
    """
    try:
        # Parse YYYY-MM-DD format
        birth = datetime.strptime(payload.birth_date, "%Y-%m-%d")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid birth_date format, expected YYYY-MM-DD: {str(e)}")

    try:
        # Calculate Year Pillar
        year_pillar = compute_year_pillar(birth.year)
        
        # Calculate Month Pillar
        month_pillar = compute_month_pillar(year_pillar.stem, birth.month)
        
        # Calculate Day Pillar
        day_pillar = compute_day_pillar(birth.year, birth.month, birth.day)
        
        # Calculate Hour Pillar (if time provided)
        hour_pillar = None
        if payload.birth_time:
            try:
                # Parse HH:MM format
                time_parts = payload.birth_time.split(":")
                hour = int(time_parts[0])
                hour_pillar = compute_hour_pillar(day_pillar.stem, hour)
            except (ValueError, IndexError) as time_error:
                # If time parsing fails, just skip hour pillar
                print(f"Warning: Failed to parse birth_time '{payload.birth_time}': {time_error}")

        # Build summary
        summary_parts = [
            f"年柱：{year_pillar.stem}{year_pillar.branch}年（{year_pillar.element}，{year_pillar.animal}）",
            f"月柱：{month_pillar.stem}{month_pillar.branch}月（{month_pillar.element}）",
            f"日柱：{day_pillar.stem}{day_pillar.branch}日（{day_pillar.element}）",
        ]
        
        if hour_pillar:
            summary_parts.append(f"时柱：{hour_pillar.stem}{hour_pillar.branch}时（{hour_pillar.element}）")
        else:
            summary_parts.append("时柱：未提供出生时间")
        
        summary = " | ".join(summary_parts)

        # 生成AI解读（可选，如果AI服务不可用则使用基础解读）
        interpretation = None
        if AI_SERVICE_AVAILABLE:
            try:
                # 尝试生成AI解读
                interpretation = generate_bazi_interpretation(
                    year_pillar.dict(),
                    month_pillar.dict(),
                    day_pillar.dict(),
                    hour_pillar.dict() if hour_pillar else None,
                    language="zh"  # 可以根据请求参数调整
                )
            except Exception as ai_error:
                print(f"Warning: Failed to generate AI interpretation: {ai_error}")
                # 如果AI失败，使用基础解读
                try:
                    from .ai_service import generate_basic_interpretation
                    interpretation = generate_basic_interpretation(
                        year_pillar.dict(),
                        month_pillar.dict(),
                        day_pillar.dict(),
                        hour_pillar.dict() if hour_pillar else None,
                        language="zh"
                    )
                except Exception as basic_error:
                    print(f"Warning: Failed to generate basic interpretation: {basic_error}")
        else:
            # AI服务不可用，使用简单的基础解读
            try:
                from .ai_service import generate_basic_interpretation
                interpretation = generate_basic_interpretation(
                    year_pillar.dict(),
                    month_pillar.dict(),
                    day_pillar.dict(),
                    hour_pillar.dict() if hour_pillar else None,
                    language="zh"
                )
            except Exception:
                # 最后的fallback
                interpretation = f"您的八字为：{summary}。这是一份基础的命理分析，建议咨询专业命理师获取更详细的解读。"

        # Save into readings table for history (optional, don't fail if DB is unavailable)
        try:
            result_data = {
                "year_pillar": year_pillar.dict(),
                "month_pillar": month_pillar.dict(),
                "day_pillar": day_pillar.dict(),
            }
            if hour_pillar:
                result_data["hour_pillar"] = hour_pillar.dict()
            result_data["summary"] = summary
            if interpretation:
                result_data["interpretation"] = interpretation
            
            reading = models.Reading(
                type="bazi",
                input_data=json.dumps(payload.dict(), ensure_ascii=False),
                result=json.dumps(result_data, ensure_ascii=False),
                user_id=payload.user_id,
            )
            db.add(reading)
            db.commit()
            db.refresh(reading)
        except Exception as db_error:
            # Log but don't fail - calculation is more important than saving
            print(f"Warning: Failed to save reading to database: {db_error}")

        return schemas.BaziResponse(
            year_pillar=year_pillar,
            month_pillar=month_pillar,
            day_pillar=day_pillar,
            hour_pillar=hour_pillar,
            summary=summary,
            interpretation=interpretation,
            raw_input=payload
        )
    except Exception as calc_error:
        # Catch any calculation errors and return a proper error message
        error_msg = f"Bazi calculation failed: {str(calc_error)}"
        print(f"Error in calculate_bazi: {error_msg}")
        raise HTTPException(status_code=500, detail=error_msg)

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





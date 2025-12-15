from typing import List
from datetime import datetime
import json
import sys
import os

from fastapi import Depends, FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# Support both relative and absolute imports
try:
    from . import models, schemas
    from .db import Base, engine, get_db
    from .ocr import analyze_image_text
except ImportError:
    # If relative imports fail, fall back to absolute imports
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    import models
    import schemas
    from db import Base, engine, get_db
    from ocr import analyze_image_text

# Try to import the AI service; if it fails the core API still works
try:
    try:
        from .ai_service import generate_bazi_interpretation
    except ImportError:
        from ai_service import generate_bazi_interpretation
    AI_SERVICE_AVAILABLE = True
except ImportError:
    AI_SERVICE_AVAILABLE = False
    print("Warning: AI service not available, will use basic interpretation")

# Try to create database tables; if this fails the API can still respond
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
    "甲": "Wood",
    "乙": "Wood",
    "丙": "Fire",
    "丁": "Fire",
    "戊": "Earth",
    "己": "Earth",
    "庚": "Metal",
    "辛": "Metal",
    "壬": "Water",
    "癸": "Water",
}
CHINESE_ZODIAC = [
    "Rat",
    "Ox",
    "Tiger",
    "Rabbit",
    "Dragon",
    "Snake",
    "Horse",
    "Goat",
    "Monkey",
    "Rooster",
    "Dog",
    "Pig",
]

# Mapping Earthly Branch -> hidden Heavenly Stems (principal, middle, remaining)
BRANCH_HIDDEN_STEMS = {
    "子": ["癸"],  # Zi: Gui (Water)
    "丑": ["己", "癸", "辛"],  # Chou: Ji (Earth, principal), Gui (Water, middle), Xin (Metal, remaining)
    "寅": ["甲", "丙", "戊"],  # Yin: Jia (Wood), Bing (Fire), Wu (Earth)
    "卯": ["乙"],  # Mao: Yi (Wood)
    "辰": ["戊", "乙", "癸"],  # Chen: Wu (Earth), Yi (Wood), Gui (Water)
    "巳": ["丙", "戊", "庚"],  # Si: Bing (Fire), Wu (Earth), Geng (Metal)
    "午": ["丁", "己"],  # Wu: Ding (Fire), Ji (Earth)
    "未": ["己", "丁", "乙"],  # Wei: Ji (Earth), Ding (Fire), Yi (Wood)
    "申": ["庚", "壬", "戊"],  # Shen: Geng (Metal), Ren (Water), Wu (Earth)
    "酉": ["辛"],  # You: Xin (Metal)
    "戌": ["戊", "辛", "丁"],  # Xu: Wu (Earth), Xin (Metal), Ding (Fire)
    "亥": ["壬", "甲"],  # Hai: Ren (Water), Jia (Wood)
}

# Ten-God relationship table (relative to the Day Master)
TEN_GODS = {
    "比肩": "same",  # Same element, same polarity (peer / companion)
    "劫财": "same_yin_yang",  # Same element, opposite polarity
    "食神": "output_same",  # Day Master produces this, same polarity (output/resourcefulness)
    "伤官": "output_diff",  # Day Master produces this, opposite polarity
    "偏财": "controlled_same",  # Day Master controls this, same polarity (indirect wealth)
    "正财": "controlled_diff",  # Day Master controls this, opposite polarity (direct wealth)
    "七杀": "control_same",  # This controls Day Master, same polarity (Seven Killings)
    "正官": "control_diff",  # This controls Day Master, opposite polarity (Direct Officer)
    "偏印": "generate_same",  # This produces Day Master, same polarity (Indirect Resource)
    "正印": "generate_diff",  # This produces Day Master, opposite polarity (Direct Resource)
}

# Five Elements generating cycle
ELEMENT_GENERATION = {  # Generate: Wood -> Fire -> Earth -> Metal -> Water -> Wood
    "木": "火",
    "火": "土",
    "土": "金",
    "金": "水",
    "水": "木",
}

ELEMENT_CONQUEST = {  # Control: Wood controls Earth, Earth controls Water, Water controls Fire, Fire controls Metal, Metal controls Wood
    "木": "土",
    "土": "水",
    "水": "火",
    "火": "金",
    "金": "木",
}


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


def get_hidden_stems(branch: str) -> list:
    """获取地支藏干"""
    return BRANCH_HIDDEN_STEMS.get(branch, [])


def get_ten_god(day_stem: str, target_stem: str) -> str:
    """
    计算十神（以日主为基准）
    日主与目标天干的关系
    """
    day_element = FIVE_ELEMENTS[day_stem]
    target_element = FIVE_ELEMENTS[target_stem]
    
    # 判断阴阳：甲丙戊庚壬为阳，乙丁己辛癸为阴
    day_is_yang = day_stem in ["甲", "丙", "戊", "庚", "壬"]
    target_is_yang = target_stem in ["甲", "丙", "戊", "庚", "壬"]
    same_yin_yang = day_is_yang == target_is_yang
    
    if day_stem == target_stem:
        return "比肩"
    
    if day_element == target_element:
        return "劫财"
    
    # 我生：日主生目标
    if ELEMENT_GENERATION.get(day_element) == target_element:
        return "食神" if same_yin_yang else "伤官"
    
    # 我克：日主克目标
    if ELEMENT_CONQUEST.get(day_element) == target_element:
        return "偏财" if same_yin_yang else "正财"
    
    # 克我：目标克日主
    if ELEMENT_CONQUEST.get(target_element) == day_element:
        return "七杀" if same_yin_yang else "正官"
    
    # 生我：目标生日主
    if ELEMENT_GENERATION.get(target_element) == day_element:
        return "偏印" if same_yin_yang else "正印"
    
    return "未知"


def analyze_elements(pillars: list) -> schemas.ElementAnalysis:
    """分析五行分布"""
    element_count = {"木": 0, "火": 0, "土": 0, "金": 0, "水": 0}
    
    # 统计天干和地支藏干的五行
    for pillar in pillars:
        if pillar:
            # 天干五行
            element_count[pillar.element] = element_count.get(pillar.element, 0) + 1
            
            # 地支藏干五行
            hidden_stems = get_hidden_stems(pillar.branch)
            for stem in hidden_stems:
                stem_element = FIVE_ELEMENTS.get(stem)
                if stem_element:
                    element_count[stem_element] = element_count.get(stem_element, 0) + 0.3  # 藏干权重较低
    
    # 找出主导五行
    dominant_element = max(element_count.items(), key=lambda x: x[1])[0] if element_count else None
    
    # 找出缺失的五行
    missing_elements = [elem for elem, count in element_count.items() if count == 0]
    
    # 判断五行平衡
    max_count = max(element_count.values()) if element_count.values() else 0
    min_count = min(element_count.values()) if element_count.values() else 0
    balance_diff = max_count - min_count
    
    if balance_diff <= 1:
        balance_status = "五行较为平衡"
    elif balance_diff <= 2:
        balance_status = "五行略有偏颇"
    else:
        balance_status = "五行明显失衡"
    
    return schemas.ElementAnalysis(
        element_count=element_count,
        dominant_element=dominant_element,
        missing_elements=missing_elements,
        element_balance=balance_status
    )


def analyze_ten_gods(year_pillar, month_pillar, day_pillar, hour_pillar) -> schemas.TenGodAnalysis:
    """分析十神"""
    day_stem = day_pillar.stem
    
    year_ten_god = get_ten_god(day_stem, year_pillar.stem) if year_pillar else None
    month_ten_god = get_ten_god(day_stem, month_pillar.stem) if month_pillar else None
    hour_ten_god = get_ten_god(day_stem, hour_pillar.stem) if hour_pillar else None
    
    # 统计十神分布
    ten_god_count = {}
    for tg in [year_ten_god, month_ten_god, hour_ten_god]:
        if tg:
            ten_god_count[tg] = ten_god_count.get(tg, 0) + 1
    
    # 生成十神总结
    summary_parts = []
    if ten_god_count.get("正官") or ten_god_count.get("七杀"):
        summary_parts.append("官杀较旺，有领导力和责任感")
    if ten_god_count.get("正财") or ten_god_count.get("偏财"):
        summary_parts.append("财星较旺，财运较好")
    if ten_god_count.get("食神") or ten_god_count.get("伤官"):
        summary_parts.append("食伤较旺，才华横溢")
    if ten_god_count.get("正印") or ten_god_count.get("偏印"):
        summary_parts.append("印星较旺，学习能力强")
    
    ten_god_summary = "；".join(summary_parts) if summary_parts else "十神分布较为均衡"
    
    return schemas.TenGodAnalysis(
        year_ten_god=year_ten_god,
        month_ten_god=month_ten_god,
        day_ten_god="日主",
        hour_ten_god=hour_ten_god,
        ten_god_summary=ten_god_summary
    )


def analyze_use_god(day_master_element: str, element_analysis: schemas.ElementAnalysis) -> tuple:
    """
    分析用神和忌神
    简化版本：根据五行平衡情况判断
    """
    element_count = element_analysis.element_count
    day_element = day_master_element
    
    # 计算日主的力量
    day_power = element_count.get(day_element, 0)
    
    # 计算生助日主的力量（生我的五行）
    generate_element = None
    for elem, gen_elem in ELEMENT_GENERATION.items():
        if gen_elem == day_element:
            generate_element = elem
            break
    
    generate_power = element_count.get(generate_element, 0) if generate_element else 0
    
    # 计算总力量
    total_support = day_power + generate_power
    
    # 计算克制日主的力量（克我的五行）
    control_element = None
    for elem, conq_elem in ELEMENT_CONQUEST.items():
        if conq_elem == day_element:
            control_element = elem
            break
    
    control_power = element_count.get(control_element, 0) if control_element else 0
    
    # 判断身强身弱
    if total_support > control_power + 1:
        # 身强，用神为克泄耗
        use_god = control_element or ELEMENT_GENERATION.get(day_element) or ELEMENT_CONQUEST.get(day_element)
        avoid_god = generate_element or day_element
    else:
        # 身弱，用神为生扶
        use_god = generate_element or day_element
        avoid_god = control_element
    
    return use_god, avoid_god


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

        # 添加地支藏干和十神信息
        year_pillar.hidden_stems = get_hidden_stems(year_pillar.branch)
        year_pillar.ten_god = get_ten_god(day_pillar.stem, year_pillar.stem)
        
        month_pillar.hidden_stems = get_hidden_stems(month_pillar.branch)
        month_pillar.ten_god = get_ten_god(day_pillar.stem, month_pillar.stem)
        
        day_pillar.hidden_stems = get_hidden_stems(day_pillar.branch)
        day_pillar.ten_god = "日主"
        
        if hour_pillar:
            hour_pillar.hidden_stems = get_hidden_stems(hour_pillar.branch)
            hour_pillar.ten_god = get_ten_god(day_pillar.stem, hour_pillar.stem)

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
        
        # 进行详细分析
        pillars_list = [year_pillar, month_pillar, day_pillar, hour_pillar]
        element_analysis = analyze_elements(pillars_list)
        ten_god_analysis = analyze_ten_gods(year_pillar, month_pillar, day_pillar, hour_pillar)
        
        # 分析用神忌神
        use_god, avoid_god = analyze_use_god(day_pillar.element, element_analysis)
        
        # 生成分析总结
        analysis_summary_parts = [
            f"日主：{day_pillar.stem}（{day_pillar.element}）",
            f"五行分布：{', '.join([f'{k}{int(v) if v == int(v) else v:.1f}个' for k, v in element_analysis.element_count.items()])}",
            f"五行平衡：{element_analysis.element_balance}",
            f"十神：{ten_god_analysis.ten_god_summary}",
        ]
        if use_god:
            analysis_summary_parts.append(f"用神：{use_god}，忌神：{avoid_god if avoid_god else '无'}")
        
        analysis_summary = " | ".join(analysis_summary_parts)
        
        bazi_analysis = schemas.BaziAnalysis(
            day_master=day_pillar.stem,
            day_master_element=day_pillar.element,
            element_analysis=element_analysis,
            ten_god_analysis=ten_god_analysis,
            use_god=use_god,
            avoid_god=avoid_god,
            analysis_summary=analysis_summary
        )

        # 准备分析数据字典，用于解读函数（包含五行、十神、用神/忌神等）
        analysis_dict = {
            'element_analysis': element_analysis.dict(),
            'ten_god_analysis': ten_god_analysis.dict(),
            'use_god': use_god,
            'avoid_god': avoid_god
        }

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
                    language="zh",  # 可以根据请求参数调整
                    analysis_focus=payload.analysis_focus,
                )
            except Exception as ai_error:
                print(f"Warning: Failed to generate AI interpretation: {ai_error}")
                # 如果AI失败，使用基础解读
                try:
                    try:
                        from .ai_service import generate_basic_interpretation
                    except ImportError:
                        from ai_service import generate_basic_interpretation
                    interpretation = generate_basic_interpretation(
                        year_pillar.dict(),
                        month_pillar.dict(),
                        day_pillar.dict(),
                        hour_pillar.dict() if hour_pillar else None,
                        language="zh",
                        analysis=analysis_dict
                    )
                except Exception as basic_error:
                    print(f"Warning: Failed to generate basic interpretation: {basic_error}")
        else:
            # AI服务不可用，使用简单的基础解读
            try:
                try:
                    from .ai_service import generate_basic_interpretation
                except ImportError:
                    from ai_service import generate_basic_interpretation
                interpretation = generate_basic_interpretation(
                    year_pillar.dict(),
                    month_pillar.dict(),
                    day_pillar.dict(),
                    hour_pillar.dict() if hour_pillar else None,
                    language="zh",
                    analysis=analysis_dict,
                    analysis_focus=payload.analysis_focus,
                )
                interpretation = generate_basic_interpretation(
                    year_pillar.dict(),
                    month_pillar.dict(),
                    day_pillar.dict(),
                    hour_pillar.dict() if hour_pillar else None,
                    language="zh",
                    analysis=analysis_dict,
                    analysis_focus=payload.analysis_focus,
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
            analysis=bazi_analysis,
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





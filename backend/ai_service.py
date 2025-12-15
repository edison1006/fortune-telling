"""
AI服务模块：使用OpenAI API生成八字解读
如果OpenAI API不可用，可以切换到其他AI服务（如Claude、本地模型等）
"""
import os
from typing import Optional

try:
    import openai
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False

# 也可以使用其他AI服务，比如通过HTTP请求调用
def generate_bazi_interpretation(
    year_pillar: dict,
    month_pillar: dict,
    day_pillar: dict,
    hour_pillar: Optional[dict] = None,
    language: str = "zh"
) -> Optional[str]:
    """
    使用AI API生成八字解读
    
    参数:
        year_pillar, month_pillar, day_pillar, hour_pillar: 四柱信息
        language: 语言代码 (zh, en, mi)
    
    返回:
        解读文本，如果失败则返回None
    """
    # 构建八字信息
    pillars_info = f"年柱：{year_pillar['stem']}{year_pillar['branch']}（{year_pillar['element']}）"
    pillars_info += f"\n月柱：{month_pillar['stem']}{month_pillar['branch']}（{month_pillar['element']}）"
    pillars_info += f"\n日柱：{day_pillar['stem']}{day_pillar['branch']}（{day_pillar['element']}）"
    if hour_pillar:
        pillars_info += f"\n时柱：{hour_pillar['stem']}{hour_pillar['branch']}（{hour_pillar['element']}）"
    
    # 根据语言选择提示词
    prompts = {
        "zh": f"""请根据以下八字信息，生成一段简洁的命理解读（200字以内）：

{pillars_info}

请从性格特点、运势走向、人生建议三个方面进行解读，语言要通俗易懂，积极正面。""",
        "en": f"""Please provide a brief Bazi (Four Pillars) interpretation (within 200 words) based on the following information:

{pillars_info}

Please interpret from three aspects: personality traits, fortune trends, and life advice. Use simple language and be positive.""",
        "mi": f"""Tēnā koa whakaputa he whakamāramatanga poto mō te Bazi (Ngā Pou e Whā) (ki raro i te 200 kupu) i runga i ngā kōrero e whai ake nei:

{pillars_info}

Tēnā koa whakamārama mai i ētahi taha e toru: ngā āhuatanga whaiaro, ngā huarahi o te waimarie, me ngā tohutohu ora. Whakamahia te reo māmā, kia pai hoki te wairua."""
    }
    
    prompt = prompts.get(language, prompts["zh"])
    
    # 方法1: 使用OpenAI API
    if OPENAI_AVAILABLE:
        api_key = os.getenv("OPENAI_API_KEY")
        if api_key:
            try:
                from openai import OpenAI
                client = OpenAI(api_key=api_key)
                response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": "你是一位专业的命理师，擅长用通俗易懂的语言解读八字。"},
                        {"role": "user", "content": prompt}
                    ],
                    max_tokens=300,
                    temperature=0.7,
                )
                return response.choices[0].message.content.strip()
            except Exception as e:
                print(f"OpenAI API error: {e}")
    
    # 方法2: 使用HTTP请求调用其他AI服务（示例：可以替换为其他API）
    # 这里可以添加对其他AI服务的支持，比如：
    # - Anthropic Claude API
    # - 本地部署的模型
    # - 其他AI服务提供商
    
    # 方法3: 如果AI服务不可用，返回基础解读
    return generate_basic_interpretation(year_pillar, month_pillar, day_pillar, hour_pillar, language)


def generate_basic_interpretation(
    year_pillar: dict,
    month_pillar: dict,
    day_pillar: dict,
    hour_pillar: Optional[dict] = None,
    language: str = "zh",
    analysis: Optional[dict] = None
) -> str:
    """
    生成基础的八字解读（不依赖AI API）
    这是一个简单的规则库，可以后续扩展
    """
    # 五行分析
    elements = [year_pillar['element'], month_pillar['element'], day_pillar['element']]
    if hour_pillar:
        elements.append(hour_pillar['element'])
    
    element_count = {}
    for elem in elements:
        element_count[elem] = element_count.get(elem, 0) + 1
    
    # 如果有详细分析数据，使用它
    if analysis:
        element_analysis = analysis.get('element_analysis', {})
        ten_god_analysis = analysis.get('ten_god_analysis', {})
        use_god = analysis.get('use_god')
        avoid_god = analysis.get('avoid_god')
        
        element_count = element_analysis.get('element_count', element_count)
        element_balance = element_analysis.get('element_balance', '')
        ten_god_summary = ten_god_analysis.get('ten_god_summary', '')
    else:
        element_balance = ''
        ten_god_summary = ''
        use_god = None
        avoid_god = None
    
    # 基础解读模板
    interpretations = {
        "zh": f"""根据您的八字分析：

【四柱信息】
年柱：{year_pillar['stem']}{year_pillar['branch']}年（{year_pillar['element']}，{year_pillar.get('animal', '')}）
月柱：{month_pillar['stem']}{month_pillar['branch']}月（{month_pillar['element']}）
日柱：{day_pillar['stem']}{day_pillar['branch']}日（{day_pillar['element']}）【日主】
{f"时柱：{hour_pillar['stem']}{hour_pillar['branch']}时（{hour_pillar['element']}）" if hour_pillar else "时柱：未提供"}

【五行分析】
五行分布：{', '.join([f'{k}行{int(v) if v == int(v) else v:.1f}个' for k, v in element_count.items()])}
五行平衡：{element_balance if element_balance else '需进一步分析'}

【十神分析】
{ten_god_summary if ten_god_summary else '十神分布较为均衡'}

【性格特点】
{year_pillar['stem']}{year_pillar['branch']}年出生的人，通常具有坚韧不拔的性格。{day_pillar['element']}日主的人，{get_personality_trait(day_pillar['element'], 'zh')}。

【用神忌神】
{f"用神：{use_god}，忌神：{avoid_god if avoid_god else '无'}" if use_god else "需结合大运流年进一步分析"}

【运势建议】
保持内心的平衡，顺应自然规律，在合适的时机把握机会。""",
        "en": f"""Based on your Bazi analysis:

【Four Pillars】
Year: {year_pillar['stem']}{year_pillar['branch']} ({year_pillar['element']}, {year_pillar.get('animal', '')})
Month: {month_pillar['stem']}{month_pillar['branch']} ({month_pillar['element']})
Day: {day_pillar['stem']}{day_pillar['branch']} ({day_pillar['element']}) [Day Master]
{f"Hour: {hour_pillar['stem']}{hour_pillar['branch']} ({hour_pillar['element']})" if hour_pillar else "Hour: Not provided"}

【Five Elements Analysis】
Distribution: {', '.join([f'{int(v) if v == int(v) else v:.1f} {k} elements' for k, v in element_count.items()])}
Balance: {element_balance if element_balance else 'Further analysis needed'}

【Ten Gods Analysis】
{ten_god_summary if ten_god_summary else 'Ten gods distribution is relatively balanced'}

【Personality Traits】
People born in {year_pillar['stem']}{year_pillar['branch']} year typically have a resilient character. Those with {day_pillar['element']} as day master are {get_personality_trait(day_pillar['element'], 'en')}.

【Use God & Avoid God】
{f"Use God: {use_god}, Avoid God: {avoid_god if avoid_god else 'None'}" if use_god else "Further analysis with luck cycles needed"}

【Fortune Advice】
Maintain inner balance, follow natural laws, and seize opportunities at the right time.""",
        "mi": f"""I runga i tō tātari Bazi:

【Ngā Pou e Whā】
Tau: {year_pillar['stem']}{year_pillar['branch']} ({year_pillar['element']}, {year_pillar.get('animal', '')})
Marama: {month_pillar['stem']}{month_pillar['branch']} ({month_pillar['element']})
Rā: {day_pillar['stem']}{day_pillar['branch']} ({day_pillar['element']}) [Rangatira Rā]
{f"Hāora: {hour_pillar['stem']}{hour_pillar['branch']} ({hour_pillar['element']})" if hour_pillar else "Hāora: Kāore i whakaratoa"}

【Te Tātari o ngā Rima】
Te whakawhitinga: {', '.join([f'{int(v) if v == int(v) else v:.1f} ngā {k}' for k, v in element_count.items()])}
Te taurite: {element_balance if element_balance else 'Me tātari anō'}

【Te Tātari o ngā Atua Tekau】
{ten_god_summary if ten_god_summary else 'He taurite te whakawhitinga o ngā atua tekau'}

【Ngā Āhuatanga Whaiaro】
Ko ngā tāngata i whānau mai i te tau {year_pillar['stem']}{year_pillar['branch']}, he āhua pakari tō rātou whaiaro. Ko ngā tāngata me te {day_pillar['element']} hei rangatira rā, {get_personality_trait(day_pillar['element'], 'mi')}.

【Te Atua Whakamahi me te Atua Pare】
{f"Te Atua Whakamahi: {use_god}, Te Atua Pare: {avoid_god if avoid_god else 'Kore'}" if use_god else "Me tātari anō me ngā hurihanga waimarie"}

【Ngā Tohutohu Waimarie】
Kia mau ki te taurite o roto, whai i ngā ture taiao, ka hopu i ngā whaiwāhitanga i te wā tika."""
    }
    
    return interpretations.get(language, interpretations["zh"])


def get_personality_trait(element: str, language: str) -> str:
    """根据五行返回性格特点"""
    traits = {
        "zh": {
            "木": "富有创造力和活力，善于成长和发展",
            "火": "热情开朗，充满活力，善于表达",
            "土": "稳重踏实，注重实际，值得信赖",
            "金": "理性果断，追求完美，有原则性",
            "水": "灵活变通，智慧深邃，适应力强"
        },
        "en": {
            "木": "creative and energetic, good at growth and development",
            "火": "enthusiastic and outgoing, full of vitality, good at expression",
            "土": "steady and practical, reliable and trustworthy",
            "金": "rational and decisive, pursue perfection, principled",
            "水": "flexible and adaptable, wise and deep, strong adaptability"
        },
        "mi": {
            "木": "auaha me te hihiri, pai ki te tipu me te whanaketanga",
            "火": "ngākau nui me te pāpā, ki tonu i te kaha, pai ki te whakaputa",
            "土": "pūmau me te whai tikanga, pono me te pono",
            "金": "aroaro me te whakatau, whai i te tino pai, whai kaupapa",
            "水": "ngāwari me te uru, mārama me te hōhonu, pakari te uru"
        }
    }
    return traits.get(language, {}).get(element, "")


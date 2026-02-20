"""
AI service module: generate Bazi interpretations using the OpenAI API.
If the OpenAI API is not available, this module can be adapted to other AI
services (for example Claude, local models, etc.).
"""
import os
from typing import Optional

try:
    import openai
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False

# You can also plug in other AI services here (for example via HTTP APIs).
def generate_bazi_interpretation(
    year_pillar: dict,
    month_pillar: dict,
    day_pillar: dict,
    hour_pillar: Optional[dict] = None,
    language: str = "zh",
    analysis_focus: Optional[str] = None,
) -> Optional[str]:
    """
    Generate a Bazi (Four Pillars) interpretation using an AI API.

    Args:
        year_pillar, month_pillar, day_pillar, hour_pillar: Four Pillars info.
        language: language code (\"zh\", \"en\", \"mi\").
        analysis_focus: optional focus area for the interpretation.

    Returns:
        Interpretation text, or None if generation fails.
    """
    # 构建八字信息
    pillars_info = f"年柱：{year_pillar['stem']}{year_pillar['branch']}（{year_pillar['element']}）"
    pillars_info += f"\n月柱：{month_pillar['stem']}{month_pillar['branch']}（{month_pillar['element']}）"
    pillars_info += f"\n日柱：{day_pillar['stem']}{day_pillar['branch']}（{day_pillar['element']}）"
    if hour_pillar:
        pillars_info += f"\n时柱：{hour_pillar['stem']}{hour_pillar['branch']}（{hour_pillar['element']}）"
    
    # 额外的侧重点说明（命运 / 财运 / 事业 / 感情 / 健康 / 家庭等）
    focus_map_zh = {
        "career": "在分析时，请在保持整体结构的前提下，更加聚焦于事业、专业发展、职业节奏与合作模式的解读；",
        "wealth": "在分析时，请在保持整体结构的前提下，更加关注金钱观、资源获取方式、风险承受能力与理财习惯；",
        "love": "在分析时，请在保持整体结构的前提下，更加聚焦于情感表达方式、亲密关系模式以及与他人相处的节奏；",
        "health": "在分析时，请在保持整体结构的前提下，更加关注身心能量的消耗与恢复节奏、压力承载方式以及长期健康习惯；",
        "family": "在分析时，请在保持整体结构的前提下，更加聚焦于家庭氛围、亲子与原生家庭影响，以及伴侣/家庭角色中的互动模式；",
    }
    focus_hint_zh = focus_map_zh.get(analysis_focus or "overall", "在分析时，可以兼顾事业、财运与关系，但不必做过于具体的事件预测；")

    # 根据语言选择提示词（结构化、解释性分析，而不是预测）
    prompts = {
        "zh": f"""你是一名专业、理性且经验丰富的八字分析师，采用结构化八字理论进行分析。
你的任务不是神秘化预测未来，而是基于四柱、五行、十神和旺衰关系，
对当事人当前的人生状态、优势结构和潜在挑战进行“解释性分析”。

请严格按照下面的中文小标题，输出五个部分，每部分 2–5 句话：
1）总体结构判断
2）五行与日主关系说明
3）优势倾向
4）潜在压力或挑战
5）可执行的调整建议

分析时请遵循：
- {focus_hint_zh}
- 以日主为核心，结合月令与整体五行分布判断强弱，用“偏强 / 偏弱 / 相对平衡”等表述；
- 重点解释“为什么会有这样的状态和倾向”，而不是预言具体事件；
- 所有结论都要能从八字结构（四柱、五行、十神）中找到逻辑依据；
- 建议要偏向方向性和日常行为调整，而不是保证具体结果；
- 语气务实、温和、可信，避免夸张、恐吓或宿命论。

四柱信息如下（如时柱缺失，可说明信息有限）：
{pillars_info}""",
        "en": f"""You are a professional and experienced Bazi (Four Pillars) analyst.
Your task is NOT to mystically predict the future, but to give an explanatory analysis
of the person's current life pattern, strengths and potential challenges,
based on the structure of the four pillars, five elements and Ten Gods.

Please output FIVE sections (2–5 sentences each) with these headings:
1) Overall structural assessment
2) Relationship between the Day Master and the Five Elements
3) Strengths and supportive tendencies
4) Potential pressures or challenges
5) Practical adjustment suggestions

Guidelines:
- Center the Day Master and judge relative strength (slightly strong / slightly weak / relatively balanced), using the overall five-element distribution;
- Focus on explaining WHY certain patterns or tendencies appear, rather than predicting concrete events;
- Every conclusion should be logically grounded in the chart structure (stems, branches, five elements, Ten Gods);
- Suggestions should be directional (mindset, behavior, focus), not promises of specific outcomes;
- Keep the tone steady, warm and non-fatalistic.

Four Pillars:
{pillars_info}""",
        "mi": f"""He mātanga koe mō te tātari Bazi (Ngā Pou e Whā), he tōtika, he whai wheako.
Ehara tō mahi i te matapae makutu i te āpōpō, engari he whakamārama i ngā tauira oranga o nāianei,
ngā kaha me ngā wero pea, i runga i te hanganga o ngā pou, ngā rima o ngā mea, me ngā Atua Tekau.

Tēnā koa tukuna he rīpoata ki ngā wāhanga e rima, 2–5 rerenga ia wāhanga:
1) Te arotake whānui o te hanganga
2) Te hononga o te Rangatira Rā ki ngā Rima o ngā mea
3) Ngā kaha me ngā ia tautoko
4) Ngā pēhitanga, ngā wero pea
5) Ngā tohutohu whakatikatika ka taea te mahi

Arataki:
- Arotahi ki te Rangatira Rā, me te kaha, te ngoikore rānei, me te taurite o ngā Rima o ngā mea;
- Whakamārama “he aha i pēnei ai te āhua”, kaua e matapae kaupapa motuhake ā mua;
- Me hono ia whakatau ki te hanganga o te mahere (ngā pou, ngā Rima o ngā mea, me ngā Atua Tekau);
- Me whakaatu tohutohu aronga noa mō te whanonga me te wairua, kaua e whakapūmau hua;
- Kia mārie te reo, kaua e whakamataku, kaua hoki e hāngai ki te matapōkere.

Ngā Pou e Whā:
{pillars_info}"""
    }
    
    prompt = prompts.get(language, prompts["zh"])
    
    # Method 1: use the OpenAI API
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
    
    # Method 2: use HTTP requests to call other AI services (examples):
    # - Anthropic Claude API
    # - locally deployed models
    # - other AI providers
    
    # Method 3: if no AI service is available, fall back to a basic interpretation
    return generate_basic_interpretation(
        year_pillar,
        month_pillar,
        day_pillar,
        hour_pillar,
        language=language,
        analysis=None,
        analysis_focus=analysis_focus,
    )


def generate_basic_interpretation(
    year_pillar: dict,
    month_pillar: dict,
    day_pillar: dict,
    hour_pillar: Optional[dict] = None,
    language: str = "zh",
    analysis: Optional[dict] = None,
    analysis_focus: Optional[str] = None,
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
        dominant_element = element_analysis.get('dominant_element')
        missing_elements = element_analysis.get('missing_elements', [])
    else:
        element_balance = ''
        ten_god_summary = ''
        use_god = None
        avoid_god = None
        dominant_element = None
        missing_elements = []

    # 为结构化解读准备一些描述性文本（偏解释，不做具体预言）
    # 日主强弱与五行倾向
    if element_balance.startswith("五行较为平衡"):
        structure_comment_zh = "整体结构相对均衡，性格与能力的不同面向比较容易同时展开。"
    elif element_balance.startswith("五行略有偏颇"):
        structure_comment_zh = "命局在某一两个方向上略有侧重，容易在特定领域更投入或更用力。"
    elif element_balance:
        structure_comment_zh = "命局五行力量分布对比明显，容易呈现出比较鲜明的性格和人生节奏。"
    else:
        structure_comment_zh = "整体结构呈现出一定的侧重，需要结合个人实际体验来理解。"

    # 主导五行和缺失五行说明
    if dominant_element:
        dominant_zh = f"当前命局中，{dominant_element}行力量相对突出，对思维方式和处事风格影响较大。"
    else:
        dominant_zh = "命局中暂未看到某一单一五行绝对占优，更像是多种特质并存。"

    if missing_elements:
        missing_zh = f"相对而言，{''.join(missing_elements)}行力量偏少，相关主题往往需要主动经营和学习。"
    else:
        missing_zh = "五行并不存在完全缺失，更像是轻重有别，而非全无。"

    # 用神、忌神解释
    if use_god:
        use_god_zh = f"在命理角度，{use_god}行所代表的品质，更适合作为你长期刻意培养和依靠的方向。"
    else:
        use_god_zh = "具体用神还需要结合大运流年和现实处境综合判断。"

    if avoid_god:
        avoid_god_zh = f"而{avoid_god}行相关的能量，如果用力过度，容易放大压力或消耗，需要保持节制。"
    else:
        avoid_god_zh = "暂时看不到特别需要刻意回避的单一能量，更重要的是保持整体平衡。"
    
    # 根据分析侧重点（overall / wealth / career / love / health / family）调整中文部分的关注点
    focus = analysis_focus or "overall"
    if focus == "career":
        focus_adv_zh = (
            "在事业与专业发展上，你的命局结构支持你通过长期积累来建立专业信任，适合在相对稳定、需要持续深耕的领域发力。"
        )
        focus_challenge_zh = (
            "在职业节奏或角色转换时，可能会对不确定性和环境变化更敏感，需要给自己留出适应和过渡的空间。"
        )
        focus_advice_zh = (
            "在工作选择上，更适合寻找既能发挥核心能力、又允许渐进式成长的路径，同时避免过度透支精力去迎合外在评价。"
        )
    elif focus == "wealth":
        focus_adv_zh = (
            "在财富与资源层面，这种五行配置有利于你通过稳健经营、长期规划来累积成果，而不是完全依赖短期运气。"
        )
        focus_challenge_zh = (
            "在金钱、安全感或资源分配上，可能会有时出现“要更稳”与“想更快”之间的拉扯，需要留意情绪化决策。"
        )
        focus_advice_zh = (
            "更适合建立一套自己认可的理财与消费原则，用小步长期执行的方式来降低焦虑，而不是频繁大幅度调整策略。"
        )
    elif focus == "love":
        focus_adv_zh = (
            "在人际与情感关系中，你的命局结构让你在表达关怀、给予支持或陪伴他人时，往往显得真诚而有分寸。"
        )
        focus_challenge_zh = (
            "在亲密关系里，你可能一方面期待稳定和可靠，另一方面又希望保留一定的个人空间，这容易带来内在矛盾感。"
        )
        focus_advice_zh = (
            "更适合用坦诚沟通去说明自己的节奏和边界，让对方理解你的在乎方式，而不是用过度付出或过度退缩来试探关系。"
        )
    elif focus == "health":
        focus_adv_zh = (
            "在身心健康与精力管理方面，这种命局结构如果运用得当，往往能形成比较稳定的作息与恢复节奏，有利于长期维持战斗力。"
        )
        focus_challenge_zh = (
            "当压力累积而未被及时疏导时，你可能不容易立刻察觉自己已经透支，容易用“再坚持一下”的方式掩盖疲惫感。"
        )
        focus_advice_zh = (
            "更适合用“可持续”的标准来安排工作与生活节奏，给自己设定固定的休整窗口，并尝试用运动、睡眠和情绪表达来做温和的排压。"
        )
    elif focus == "family":
        focus_adv_zh = (
            "在家庭与亲密关系层面，你的命局结构让你在承担责任、照顾他人感受时具有一定的稳定性和耐心，适合经营长期关系。"
        )
        focus_challenge_zh = (
            "在原生家庭影响、代际期待或家庭角色分工上，你可能会在“照顾自己”与“照顾他人”之间摇摆，需要学会更清晰地表达真实需求。"
        )
        focus_advice_zh = (
            "建议在家庭议题上，逐步建立“可以被讨论”的空间，用商量而不是自我牺牲的方式来维系关系，让关爱更有弹性、也更可持续。"
        )
    else:
        # overall：偏综合视角
        focus_adv_zh = (
            "整体来看，你更适合在熟悉且可控的节奏中，持续打磨自己的优势，让人生路径呈现出“稳中有进”的趋势。"
        )
        focus_challenge_zh = (
            "当生活节奏被外力打乱，或者短期内需要面对多重任务时，你可能会感到心力被拉扯，需要更刻意地学会取舍。"
        )
        focus_advice_zh = (
            "通过给自己设定清晰的优先级、保留固定的休整时间，可以让你在稳定的基础上逐步扩展新的可能性。"
        )

    # 基础解读模板（与前端业务逻辑一致，偏解释性与结构化，并按侧重点微调）
    interpretations = {
        "zh": f"""【总体结构判断】
整体来看，日主属{day_pillar['element']}，在这个命局中与其他五行之间形成了「{element_balance or '有侧重但仍需结合实际体验'}」的格局。{structure_comment_zh}

【五行与日主关系说明】
从五行分布看：{', '.join([f'{k}行约{int(v) if v == int(v) else v:.1f}个' for k, v in element_count.items()])}。{dominant_zh}{(' ' + missing_zh) if missing_zh else ''}
日主为{day_pillar['element']}，通常代表{get_personality_trait(day_pillar['element'], 'zh')}这一类特质，会成为你做选择和看世界的重要出发点。

【优势倾向】
1. 在结构上，你更容易依赖{day_pillar['element']}及其相关的思维和行为方式，在熟悉的领域里表现出稳定的优势。
2. 十神配置显示：{ten_god_summary if ten_god_summary else "各类角色能量比较均衡，你在不同情境中具备切换角色的潜力。"}
3. {focus_adv_zh}

【潜在压力或挑战】
1. 当某一两种五行长期被过度使用时（例如当前命局中相对偏重的部分），容易出现「惯性太强、弹性不足」的状况，需要适时调整节奏。
2. {missing_zh}
3. {focus_challenge_zh}

【可执行的调整建议】
1. 命理上的用神方向：{use_god_zh}
2. 需要温和留意的部分：{avoid_god_zh}
3. {focus_advice_zh}""",
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


def chat_with_master(messages: list, language: str = "zh") -> str:
    """
    Chat with the AI fortune master. Accepts a list of {role, content} and returns
    the assistant's reply. Uses OpenAI if available; otherwise returns a fallback.
    """
    system_prompts = {
        "zh": "你是「AI 大师」在线解读助手，擅长八字、星座、塔罗、运势等命理与心理层面的解读。"
        "回答时保持温和、理性、不夸大不恐吓；可结合传统文化与心理学给出建议，避免具体事件预言。"
        "用简洁易懂的中文回复。",
        "en": "You are the AI Fortune Master assistant, skilled in Bazi, zodiac, tarot, and fortune interpretation. "
        "Keep replies warm, rational, and non-alarming; you may combine tradition with psychology for advice, "
        "but avoid predicting specific events. Reply in clear, concise English.",
        "mi": "Ko koe te kaiāwhina AI Fortune Master, he tohunga ki te Bazi, te whetū, te tarot me te whakamārama waimarie. "
        "Kia ngāwari, kia tōtika ō whakautu; ka taea te whakauru i ngā tikanga tawhito me te hinengaro, "
        "engari kaua e matapae kaupapa. Whakautu mai ki te reo Māori māmā.",
    }
    system_content = system_prompts.get(language, system_prompts["zh"])

    if OPENAI_AVAILABLE:
        api_key = os.getenv("OPENAI_API_KEY")
        if api_key:
            try:
                from openai import OpenAI
                client = OpenAI(api_key=api_key)
                api_messages = [{"role": "system", "content": system_content}]
                for m in messages:
                    role = (m.get("role") or "user").lower()
                    if role == "system":
                        continue
                    api_messages.append({"role": role if role in ("user", "assistant") else "user", "content": (m.get("content") or "").strip()})
                response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=api_messages,
                    max_tokens=500,
                    temperature=0.7,
                )
                return (response.choices[0].message.content or "").strip()
            except Exception as e:
                print(f"OpenAI chat error: {e}")

    fallbacks = {
        "zh": "暂时无法连接解读服务。请稍后再试，或先试试八字、塔罗等其他功能。",
        "en": "The interpretation service is temporarily unavailable. Please try again later or use Bazi, Tarot, etc.",
        "mi": "Kāore e taea te hono ki te ratonga whakamārama. Tēnā whakamātau ā muri ake, ka taea rānei te Bazi, Tarot.",
    }
    return fallbacks.get(language, fallbacks["en"])


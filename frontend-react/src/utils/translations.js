// 多语言翻译对象
export const translations = {
  zh: {
    // Header
    languageSettings: "语言设置",
    backToHome: "返回主页",
    account: "账户",
    
    // Homepage
    heroTitle: "未来算法",
    heroSubtitle: "看不清未来？也许你只是缺一把解开命运的钥匙",
    
    // Features（主页 5 个功能卡片）
    zodiac: {
      title: "西方占星术（星座）",
      description: "根据出生日期查询您的星座与核心性格关键词",
    },
    bazi: {
      title: "中国八字",
      description: "以传统四柱八字体系分析命局与人生走势",
    },
    tarot: {
      title: "塔罗牌 Tarot",
      description: "抽取一张塔罗牌，获取此刻的指引信息",
    },
    palmFace: {
      title: "手相 / 面相",
      description: "通过手相与面相特征，感知性格与运势走向",
    },
    numerology: {
      title: "数字命理 Numerology",
      description: "用出生日期计算生命路径数字与数字能量",
    },
    
    // Pages
    zodiacPage: {
      title: "西方占星术（星座）",
      description: "根据您的出生日期快速查找您的太阳星座和核心性格关键词。",
      birthDate: "出生日期",
      queryButton: "查询星座",
      errorNoDate: "请选择您的出生日期。",
      errorInvalidDate: "无法确定您的星座。请选择有效的日期。",
    },
    numerologyPage: {
      title: "数字命理 Numerology",
      description: "根据您的出生日期计算您的生命路径数字。",
      birthDate: "出生日期",
      calculateButton: "计算生命路径数字",
      errorNoDate: "请选择您的出生日期。",
      lifePath: "生命路径",
    },
    tarotPage: {
      title: "塔罗牌 Tarot（单张）",
      description: "抽取一张塔罗牌，获得您当前情况的快速指引。",
      drawButton: "抽取一张牌",
    },
    baziPage: {
      title: "中国八字",
      description: "这是一个占位符部分。后续我们可以接入完整的八字排盘与解读逻辑。",
      plan: "计划：前端收集出生日期、时间和地点，Python 后端计算天干地支、宫位等详细信息，结果存储在 PostgreSQL 中，以便用户查看过去的占卜记录。",
      birthDate: "出生日期",
      birthTime: "出生时间（可选）",
      calculateButton: "计算八字",
      calculating: "计算中...",
      placeholder: "这里将显示您的八字年柱和概要说明。",
    },
    palmFacePage: {
      title: "手相 / 面相",
      description: "通过观察手掌纹路与面部特征，感知性格倾向与运势走向。本页面目前作为占位符，后续可接入拍照上传与 AI 分析功能。",
    },
  },
  en: {
    // Header
    languageSettings: "Language Settings",
    backToHome: "Back to Home",
    account: "Account",
    
    // Homepage
    heroTitle: "FutureAlgo",
    heroSubtitle: "Can't see the future? Perhaps you just need the key to unlock your destiny",
    
    // Features
    zodiac: {
      title: "Western Astrology (Zodiac)",
      description: "Find your zodiac sign and core personality keywords from your birth date",
    },
    bazi: {
      title: "Chinese Bazi",
      description: "Use the traditional Four Pillars system to analyze your destiny chart",
    },
    tarot: {
      title: "Tarot Cards",
      description: "Draw a tarot card for quick insight into your current situation",
    },
    palmFace: {
      title: "Palm / Face Reading",
      description: "Read character and destiny through palm lines and facial features",
    },
    numerology: {
      title: "Numerology",
      description: "Calculate your Life Path number from your date of birth",
    },
    
    // Pages
    zodiacPage: {
      title: "Western Astrology (Zodiac)",
      description: "Quickly find your Sun sign and core personality keywords from your birth date.",
      birthDate: "Date of birth",
      queryButton: "Query Zodiac",
      errorNoDate: "Please select your date of birth.",
      errorInvalidDate: "Could not determine your sign. Please select a valid date.",
    },
    numerologyPage: {
      title: "Numerology",
      description: "Calculate your Life Path number from your date of birth.",
      birthDate: "Date of birth",
      calculateButton: "Calculate Life Path",
      errorNoDate: "Please select your date of birth.",
      lifePath: "Life Path",
    },
    tarotPage: {
      title: "Tarot Reading (One Card)",
      description: "Draw a single tarot card for guidance in your current situation.",
      drawButton: "Draw a card",
    },
    baziPage: {
      title: "Chinese Bazi",
      description: "This is a placeholder section. Later we can plug in full Bazi chart logic and interpretations.",
      plan: "Plan: the frontend collects birth date, time, and location, the Python backend calculates stems/branches, palaces, and other details, and results are stored in PostgreSQL so users can review past readings.",
      birthDate: "Date of birth",
      birthTime: "Birth time (optional)",
      calculateButton: "Calculate Bazi",
      calculating: "Calculating...",
      placeholder: "Your Bazi year pillar and summary will appear here.",
    },
    palmFacePage: {
      title: "Palm / Face Reading",
      description: "Read tendencies and life themes through palm lines and facial features. This page is a placeholder; later you can connect photo upload and AI analysis here.",
    },
  },
  mi: {
    // Header
    languageSettings: "Whakarite Reo",
    backToHome: "Hoki ki te Kāinga",
    account: "Pūkete",
    
    // Homepage
    heroTitle: "FutureAlgo",
    heroSubtitle: "Kāore e kitea te heke mai? Tērā pea hei tika māu hei kī rānei ki te whakatuwhera i tō ara ora",
    
    // Features
    zodiac: {
      title: "Te Matakite Whetū Pākehā",
      description: "Kimihia tō tohu whetū me ngā kupu matua o tō āhua i runga i tō rā whānau",
    },
    bazi: {
      title: "Bazi Hainamana",
      description: "Whakamahia te pūnaha pou e whā ki te tātari i tō mahere ora",
    },
    tarot: {
      title: "Ngā Kāri Tarot",
      description: "Tohua he kāri tarot hei ārahi mō tō āhuatanga o nāianei",
    },
    palmFace: {
      title: "Tohu Ringa / Kanohi",
      description: "Pānuihia te tangata me te ara ora mā ngā rārangi ringa me ngā āhuatanga kanohi",
    },
    numerology: {
      title: "Tau Matakite Numerology",
      description: "Tātaihia tō tau Ara Ora mai i tō rā whānau",
    },
    
    // Pages
    zodiacPage: {
      title: "Te Matakite Whetū Pākehā",
      description: "Kimihia wawe tō tohu Rā me ngā kupu matua o tō whaiaro mai i tō rā whānau.",
      birthDate: "Te rā whānau",
      queryButton: "Rapua te Tohu Whetū",
      errorNoDate: "Tīpakohia tō rā whānau.",
      errorInvalidDate: "Kāore i taea te whakatau i tō tohu. Tīpakohia he rā tika.",
    },
    numerologyPage: {
      title: "Tau Matakite Numerology",
      description: "Tātaihia tō tau Ara Ora mai i tō rā whānau.",
      birthDate: "Te rā whānau",
      calculateButton: "Tātaihia te Ara Ora",
      errorNoDate: "Tīpakohia tō rā whānau.",
      lifePath: "Te Ara Ora",
    },
    tarotPage: {
      title: "Te Matakite Tarot (Kotahi Kāri)",
      description: "Tohua kotahi kāri hei ārahi wawe mōu i tō tūranga o nāianei.",
      drawButton: "Tohua he kāri",
    },
    baziPage: {
      title: "Bazi Hainamana",
      description: "He wāhanga tūpāpaku tēnei. Ka taea e koe te whakauru i ngā tātai me ngā whakamāramatanga Bazi a muri ake.",
      plan: "Mahere: ka kohikohi te mua i te rā whānau, te wā, me te wāhi; ka tātai te muri Python i ngā rākau, ngā whare me ētahi atu taipitopito, ka tiakina ki PostgreSQL kia taea ai te tiro anō i ngā matakite.",
      birthDate: "Te rā whānau",
      birthTime: "Te wā whānau (kōwhiringa)",
      calculateButton: "Tātai Bazi",
      calculating: "E tātai ana...",
      placeholder: "Ka puta ki konei tō pou tau Bazi me te whakarāpopototanga.",
    },
    palmFacePage: {
      title: "Tohu Ringa / Kanohi",
      description: "Pānuihia te āhua me te ara ora mā ngā rārangi ringa me ngā āhuatanga kanohi. He wāhanga tūpāpaku tēnei, ā muri ake ka taea te tāpiri tukunga whakaahua me te tātari AI.",
    },
  },
};


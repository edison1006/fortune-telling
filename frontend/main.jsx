const apiBase = "http://127.0.0.1:8000";

function useInput(initialValue = "") {
  const [value, setValue] = React.useState(initialValue);
  const onChange = (e) => setValue(e.target.value);
  return { value, onChange, setValue };
}

// 多语言翻译对象
const translations = {
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
    },
    palmFacePage: {
      title: "Tohu Ringa / Kanohi",
      description: "Pānuihia te āhua me te ara ora mā ngā rārangi ringa me ngā āhuatanga kanohi. He wāhanga tūpāpaku tēnei, ā muri ake ka taea te tāpiri tukunga whakaahua me te tātari AI.",
    },
  },
};


// 主页卡片视图
function HomePage({ onNavigate, language }) {
  const t = translations[language] || translations.zh;

  const features = [
    {
      id: "zodiac",
      title: t.zodiac.title,
      description: t.zodiac.description,
      icon: "♈",
    },
    {
      id: "tarot",
      title: t.tarot.title,
      description: t.tarot.description,
      icon: "🃏",
    },
    {
      id: "bazi",
      title: t.bazi.title,
      description: t.bazi.description,
      icon: "☯️",
    },
    {
      id: "palmface",
      title: t.palmFace.title,
      description: t.palmFace.description,
      icon: "✋",
    },
    {
      id: "numerology",
      title: t.numerology.title,
      description: t.numerology.description,
      icon: "🔢",
    },
  ];

  return (
    <main className="main">
      <div className="hero-card">
        <h1>{t.heroTitle}</h1>
        <p>{t.heroSubtitle}</p>
      </div>
      <div className="cards-grid">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="feature-card"
            onClick={() => onNavigate(feature.id)}
          >
            <div className="card-icon">{feature.icon}</div>
            <h3 className="card-title">{feature.title}</h3>
            <p className="card-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

// 功能页面组件
function ZodiacPage({ onBack, language }) {
  const t = translations[language] || translations.zh;
  const birth = useInput("");
  const [result, setResult] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!birth.value) {
      setResult(t.zodiacPage.errorNoDate);
      return;
    }
    const date = new Date(birth.value + "T12:00:00");
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const sign = getZodiacSign(month, day);
    if (sign) {
      setResult(`${sign.name} - ${sign.description}`);
    } else {
      setResult(t.zodiacPage.errorInvalidDate);
    }
  };

  return (
    <main className="main">
      <button type="button" className="back-button" onClick={onBack}>
        ← {t.backToHome}
      </button>
      <section className="section">
        <h2>{t.zodiacPage.title}</h2>
        <p>{t.zodiacPage.description}</p>
        <form onSubmit={handleSubmit} className="form-row">
          <label>
            {t.zodiacPage.birthDate}
            <input type="date" value={birth.value} onChange={birth.onChange} />
          </label>
          <button type="submit">{t.zodiacPage.queryButton}</button>
        </form>
        <div className="result-box">{result}</div>
      </section>
    </main>
  );
}

function NumerologyPage({ onBack, language }) {
  const t = translations[language] || translations.zh;
  const birth = useInput("");
  const [result, setResult] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!birth.value) {
      setResult(t.numerologyPage.errorNoDate);
      return;
    }
    const digits = birth.value.replace(/-/g, "");
    const lifePath = reduceToDigit(digits);
    const meaning = getLifePathMeaning(lifePath);
    setResult(`${t.numerologyPage.lifePath} ${lifePath}: ${meaning}`);
  };

  return (
    <main className="main">
      <button type="button" className="back-button" onClick={onBack}>
        ← {t.backToHome}
      </button>
      <section className="section">
        <h2>{t.numerologyPage.title}</h2>
        <p>{t.numerologyPage.description}</p>
        <form onSubmit={handleSubmit} className="form-row">
          <label>
            {t.numerologyPage.birthDate}
            <input type="date" value={birth.value} onChange={birth.onChange} />
          </label>
          <button type="submit">{t.numerologyPage.calculateButton}</button>
        </form>
        <div className="result-box">{result}</div>
      </section>
    </main>
  );
}

function TarotPage({ onBack, language }) {
  const t = translations[language] || translations.zh;
  const [result, setResult] = React.useState("");

  const draw = () => {
    const card = sample(tarotDeck);
    setResult(`${card.name}: ${card.message}`);
  };

  return (
    <main className="main">
      <button type="button" className="back-button" onClick={onBack}>
        ← {t.backToHome}
      </button>
      <section className="section">
        <h2>{t.tarotPage.title}</h2>
        <p>{t.tarotPage.description}</p>
        <button type="button" onClick={draw}>
          {t.tarotPage.drawButton}
        </button>
        <div className="result-box">{result}</div>
      </section>
    </main>
  );
}

function BaziPage({ onBack, language }) {
  const t = translations[language] || translations.zh;
  
  return (
    <main className="main">
      <button type="button" className="back-button" onClick={onBack}>
        ← {t.backToHome}
      </button>
      <section className="section">
        <h2>{t.baziPage.title}</h2>
        <p>{t.baziPage.description}</p>
        <p className="small">
          {t.baziPage.plan}
        </p>
      </section>
    </main>
  );
}

function PalmFacePage({ onBack, language }) {
  const t = translations[language] || translations.zh;

  return (
    <main className="main">
      <button type="button" className="back-button" onClick={onBack}>
        ← {t.backToHome}
      </button>
      <section className="section">
        <h2>{t.palmFacePage.title}</h2>
        <p>{t.palmFacePage.description}</p>
      </section>
    </main>
  );
}

function App() {
  const [currentPage, setCurrentPage] = React.useState("home");
  const [language, setLanguage] = React.useState("zh"); // zh, en, mi
  const [showLanguageMenu, setShowLanguageMenu] = React.useState(false);
  const languageMenuRef = React.useRef(null);

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  const navigateHome = () => {
    setCurrentPage("home");
  };

  const toggleLanguageMenu = () => {
    setShowLanguageMenu((prev) => !prev);
  };

  const handleChangeLanguage = (lang) => {
    setLanguage(lang);
    setShowLanguageMenu(false);
  };

  // 点击外部区域关闭菜单
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setShowLanguageMenu(false);
      }
    };

    if (showLanguageMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLanguageMenu]);

  const t = translations[language] || translations.zh;
  const languageLabel =
    language === "en" ? "English" : language === "mi" ? "Māori" : "中文";

  const renderPage = () => {
    switch (currentPage) {
      case "zodiac":
        return <ZodiacPage onBack={navigateHome} language={language} />;
      case "numerology":
        return <NumerologyPage onBack={navigateHome} language={language} />;
      case "tarot":
        return <TarotPage onBack={navigateHome} language={language} />;
      case "bazi":
        return <BaziPage onBack={navigateHome} language={language} />;
      case "palmface":
        return <PalmFacePage onBack={navigateHome} language={language} />;
      default:
        return <HomePage onNavigate={navigateTo} language={language} />;
    }
  };

  return (
    <>
      <header className="app-header">
        <div className="logo" onClick={navigateHome} style={{ cursor: "pointer" }}>
          FutureAlgo
        </div>
        <div className="header-right">
          <div className="language-selector" ref={languageMenuRef}>
            <button
              type="button"
              className="language-button"
              onClick={toggleLanguageMenu}
            >
              {t.languageSettings}（{languageLabel}）
            </button>
            {showLanguageMenu && (
              <div className="language-menu">
                <button
                  type="button"
                  className={`language-menu-item ${language === "zh" ? "active" : ""}`}
                  onClick={() => handleChangeLanguage("zh")}
                >
                  中文
                </button>
                <button
                  type="button"
                  className={`language-menu-item ${language === "en" ? "active" : ""}`}
                  onClick={() => handleChangeLanguage("en")}
                >
                  English
                </button>
                <button
                  type="button"
                  className={`language-menu-item ${language === "mi" ? "active" : ""}`}
                  onClick={() => handleChangeLanguage("mi")}
                >
                  Māori
                </button>
              </div>
            )}
          </div>
          {currentPage !== "home" && (
            <button type="button" className="back-button-header" onClick={navigateHome}>
              {t.backToHome}
            </button>
          )}
          <button type="button" className="account-button">
            {t.account}
          </button>
        </div>
      </header>
      {renderPage()}
    </>
  );
}

// ---- Frontend-only helper functions for astrology, numerology, tarot, and I Ching ----

function getZodiacSign(month, day) {
  const signs = [
    { name: "Aries", start: [3, 21], end: [4, 19], description: "Passionate, direct, and ready to take action." },
    { name: "Taurus", start: [4, 20], end: [5, 20], description: "Grounded, practical, and comfort-loving." },
    { name: "Gemini", start: [5, 21], end: [6, 20], description: "Curious, adaptable, and highly communicative." },
    { name: "Cancer", start: [6, 21], end: [7, 22], description: "Sensitive, protective, and family-oriented." },
    { name: "Leo", start: [7, 23], end: [8, 22], description: "Confident, expressive, and drawn to the spotlight." },
    { name: "Virgo", start: [8, 23], end: [9, 22], description: "Detail-focused, analytical, and improvement-driven." },
    { name: "Libra", start: [9, 23], end: [10, 22], description: "Graceful, harmony-seeking, and partnership-oriented." },
    { name: "Scorpio", start: [10, 23], end: [11, 21], description: "Intense, deep, and loyal to the core." },
    { name: "Sagittarius", start: [11, 22], end: [12, 21], description: "Optimistic, freedom-loving, and adventurous." },
    { name: "Capricorn", start: [12, 22], end: [1, 19], description: "Ambitious, responsible, and long-term focused." },
    { name: "Aquarius", start: [1, 20], end: [2, 18], description: "Independent, idealistic, and future-oriented." },
    { name: "Pisces", start: [2, 19], end: [3, 20], description: "Gentle, imaginative, and deeply empathetic." },
  ];
  return signs.find((sign) => {
    const [sm, sd] = sign.start;
    const [em, ed] = sign.end;
    if (sm <= em) {
      return (
        (month === sm && day >= sd) ||
        (month === em && day <= ed) ||
        (month > sm && month < em)
      );
    }
    // Wraps year (Capricorn)
    return (
      (month === sm && day >= sd) ||
      (month === em && day <= ed) ||
      month > sm ||
      month < em
    );
  });
}

function reduceToDigit(input) {
  let sum = input
    .split("")
    .map((d) => parseInt(d, 10))
    .filter((n) => !Number.isNaN(n))
    .reduce((acc, n) => acc + n, 0);
  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = String(sum)
      .split("")
      .map((d) => parseInt(d, 10))
      .reduce((acc, n) => acc + n, 0);
  }
  return sum;
}

function getLifePathMeaning(num) {
  const meanings = {
    1: "Leader type: pioneering, independent, and action-oriented.",
    2: "Diplomat type: cooperative, sensitive, and relationship-focused.",
    3: "Creative type: expressive, social, and stage-loving.",
    4: "Builder type: practical, structured, and stability-oriented.",
    5: "Adventurer type: freedom-seeking, curious, and change-friendly.",
    6: "Nurturer type: caring, responsible, and home-focused.",
    7: "Seeker type: introspective, analytical, and spiritual.",
    8: "Executive type: ambitious, strategic, and resource-focused.",
    9: "Humanitarian type: idealistic, compassionate, and global-minded.",
    11: "Master number: inspiration, intuition, and spiritual leadership.",
    22: "Master number: large-scale building, vision, and manifestation.",
  };
  return meanings[num] || "A unique combination that needs a more detailed, personal interpretation.";
}

const tarotDeck = [
  {
    name: "0 The Fool",
    message: "A new journey is beginning. Stay open-hearted and trust your intuition.",
  },
  {
    name: "I The Magician",
    message: "You already have the resources you need. It is time to act and manifest your ideas.",
  },
  {
    name: "II The High Priestess",
    message: "Pause outward action and listen within. Hidden information is rising from your subconscious.",
  },
  {
    name: "X Wheel of Fortune",
    message: "Circumstances are shifting. Align with the change and be ready to seize opportunity.",
  },
  {
    name: "XIII Death",
    message: "An old phase is ending. Let go to make space for a more authentic beginning.",
  },
  {
    name: "XVII The Star",
    message: "Hope and gentle healing are present. Trust that your path is quietly realigning.",
  },
  {
    name: "XIX The Sun",
    message: "Energy and clarity are high. Show yourself and celebrate your progress.",
  },
];

const ichingHexagrams = [
  {
    number: 1,
    name: "Qian – The Creative",
    message: "Strong creative force. Take the initiative and act with steady determination.",
  },
  {
    number: 2,
    name: "Kun – The Receptive",
    message: "Softness is strength here. Support, receive, and cooperate rather than pushing alone.",
  },
  {
    number: 11,
    name: "Tai – Peace",
    message: "Heaven and earth are in harmony. Consolidate your gains and share good fortune.",
  },
  {
    number: 24,
    name: "Fu – Return",
    message: "A turning point after a low period. Restart from small, sincere steps and correct your course.",
  },
  {
    number: 46,
    name: "Sheng – Pushing Upward",
    message: "Steady, step-by-step growth. Avoid rushing; consistent effort lifts you higher.",
  },
];

function sample(list) {
  return list[Math.floor(Math.random() * list.length)];
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);



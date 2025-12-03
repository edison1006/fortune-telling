document.addEventListener("DOMContentLoaded", () => {
  const savedLang = window.localStorage.getItem("ft_lang") || "en";

  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = String(new Date().getFullYear());
  }

  const hero = document.querySelector(".hero");
  const featureOverview = document.querySelector(".feature-overview");
  const featureSections = Array.from(
    document.querySelectorAll(".feature-section")
  );
  const languageSelect = document.getElementById("language-select");

  function showHome() {
    if (hero) hero.classList.remove("hidden");
    if (featureOverview) featureOverview.classList.remove("hidden");
    featureSections.forEach((sec) => sec.classList.add("hidden"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showSectionById(id) {
    if (hero) hero.classList.add("hidden");
    if (featureOverview) featureOverview.classList.add("hidden");
    featureSections.forEach((sec) => {
      if (sec.id === id) {
        sec.classList.remove("hidden");
      } else {
        sec.classList.add("hidden");
      }
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Initial state: only main hero + 5 feature cards, hide all detail sections
  showHome();

  // Apply initial language
  applyLanguage(savedLang);
  if (languageSelect) {
    languageSelect.value = savedLang;
    languageSelect.addEventListener("change", () => {
      const lang = languageSelect.value || "en";
      window.localStorage.setItem("ft_lang", lang);
      applyLanguage(lang);
    });
  }

  // Clicks on overview cards / hero buttons
  document.querySelectorAll("[data-scroll-target]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-scroll-target");
      if (!target) return;
      const id = target.startsWith("#") ? target.slice(1) : target;
      showSectionById(id);
    });
  });

  // Header nav links (#contact, #settings, etc.)
  document.querySelectorAll(".nav a[href^='#']").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const href = link.getAttribute("href");
      if (!href) return;
      const id = href.replace("#", "");
      showSectionById(id);
    });
  });

  // Clicking the logo returns to main overview
  const homeLogo = document.querySelector("[data-home]");
  if (homeLogo) {
    homeLogo.addEventListener("click", () => {
      showHome();
    });
  }

  // Zodiac sign finder (simple tropical sun sign ranges, non-leap-year base)
  const zodiacForm = document.getElementById("zodiac-form");
  const zodiacBirthInput = document.getElementById("zodiac-birthdate");
  const zodiacResult = document.getElementById("zodiac-result");

  if (zodiacForm && zodiacBirthInput && zodiacResult) {
    zodiacForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const value = zodiacBirthInput.value;
      if (!value) {
        zodiacResult.textContent = "Please choose your date of birth.";
        return;
      }
      const date = new Date(value + "T12:00:00");
      const month = date.getUTCMonth() + 1;
      const day = date.getUTCDate();

      const sign = getZodiacSign(month, day);
      zodiacResult.innerHTML = sign
        ? `<strong>${sign.name}</strong> – ${sign.description}`
        : "Could not determine your sign. Please try again.";
    });
  }

  // Numerology: Life Path number from birth date
  const numerologyForm = document.getElementById("numerology-form");
  const numerologyBirthInput = document.getElementById("numerology-birthdate");
  const numerologyResult = document.getElementById("numerology-result");

  if (numerologyForm && numerologyBirthInput && numerologyResult) {
    numerologyForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const value = numerologyBirthInput.value;
      if (!value) {
        numerologyResult.textContent = "Please choose your date of birth.";
        return;
      }
      const digits = value.replace(/-/g, "");
      const lifePath = reduceToDigit(digits);
      const meaning = getLifePathMeaning(lifePath);
      numerologyResult.innerHTML = `<strong>Life Path ${lifePath}</strong> – ${meaning}`;
    });
  }

  // I Ching: random hexagram prototype
  const ichingBtn = document.getElementById("iching-cast-btn");
  const ichingResult = document.getElementById("iching-result");

  if (ichingBtn && ichingResult) {
    ichingBtn.addEventListener("click", () => {
      const hex = sample(ichingHexagrams);
      ichingResult.innerHTML = `<strong>${hex.number}. ${hex.name}</strong><br>${hex.message}`;
    });
  }
});

function getZodiacSign(month, day) {
  const signs = [
    { name: "Aries", start: [3, 21], end: [4, 19], description: "Bold, pioneering, and driven by passion." },
    { name: "Taurus", start: [4, 20], end: [5, 20], description: "Grounded, sensual, and patient with steady power." },
    { name: "Gemini", start: [5, 21], end: [6, 20], description: "Curious, communicative, and quick-minded." },
    { name: "Cancer", start: [6, 21], end: [7, 22], description: "Protective, intuitive, and emotionally deep." },
    { name: "Leo", start: [7, 23], end: [8, 22], description: "Radiant, expressive, and proud of heart." },
    { name: "Virgo", start: [8, 23], end: [9, 22], description: "Precise, thoughtful, and dedicated to improvement." },
    { name: "Libra", start: [9, 23], end: [10, 22], description: "Balanced, aesthetic, and partnership-oriented." },
    { name: "Scorpio", start: [10, 23], end: [11, 21], description: "Intense, magnetic, and transformative." },
    { name: "Sagittarius", start: [11, 22], end: [12, 21], description: "Adventurous, philosophical, and freedom-loving." },
    { name: "Capricorn", start: [12, 22], end: [1, 19], description: "Ambitious, disciplined, and practical." },
    { name: "Aquarius", start: [1, 20], end: [2, 18], description: "Visionary, independent, and future-focused." },
    { name: "Pisces", start: [2, 19], end: [3, 20], description: "Compassionate, dreamlike, and sensitive to subtle worlds." },
  ];

  return signs.find((sign) => {
    const [sm, sd] = sign.start;
    const [em, ed] = sign.end;
    if (sm <= em) {
      // e.g., Aries, Taurus ... Sagittarius
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
    1: "Leader, initiator, and independent path-maker.",
    2: "Diplomat, peacemaker, and intuitive partner.",
    3: "Creative, expressive, and socially vibrant.",
    4: "Builder, organizer, and foundation-creator.",
    5: "Adventurer, freedom-seeker, and agent of change.",
    6: "Nurturer, healer, and guardian of home and harmony.",
    7: "Seeker, analyst, and spiritual/intellectual explorer.",
    8: "Manifestor, strategist, and steward of power and resources.",
    9: "Humanitarian, old soul, and compassionate visionary.",
    11: "Master number of inspiration, spiritual insight, and illumination.",
    22: "Master number of large-scale building, legacy, and practical vision.",
  };
  return meanings[num] || "A unique path with potentials that go beyond simple keywords.";
}

const ichingHexagrams = [
  {
    number: 1,
    name: "Qian – The Creative",
    message:
      "Powerful creative energy is rising. Act with integrity and perseverance; great beginnings are favored.",
  },
  {
    number: 2,
    name: "Kun – The Receptive",
    message:
      "Yielding and support are your strength now. Listen, receive, and adapt instead of forcing outcomes.",
  },
  {
    number: 11,
    name: "Tai – Peace",
    message:
      "Heaven and earth are in harmony. This is a time to stabilize what is good and share good fortune with others.",
  },
  {
    number: 24,
    name: "Fu – Return",
    message:
      "A turning point allows you to return to what is authentic. Small, sincere steps lead to lasting renewal.",
  },
  {
    number: 29,
    name: "Kan – The Abysmal Water",
    message:
      "Challenges may feel deep and repetitive. Steady courage and honesty help you move safely through difficulty.",
  },
  {
    number: 46,
    name: "Sheng – Pushing Upward",
    message:
      "Gradual, sincere effort raises you step by step. Stay humble and consistent; progress is supported.",
  },
  {
    number: 53,
    name: "Jian – Gradual Progress",
    message:
      "Like a tree growing on a mountain, true development is slow but stable. Avoid rushing the process.",
  },
  {
    number: 61,
    name: "Zhong Fu – Inner Truth",
    message:
      "Gentle honesty brings alignment. When your heart is clear, others naturally respond and trust deepens.",
  },
  {
    number: 63,
    name: "Ji Ji – After Completion",
    message:
      "A cycle is nearly complete. Maintain awareness and care so that success does not fade into complacency.",
  },
  {
    number: 64,
    name: "Wei Ji – Before Completion",
    message:
      "You are close to a breakthrough, but not there yet. Move carefully and pay attention to small details.",
  },
];

function sample(list) {
  return list[Math.floor(Math.random() * list.length)];
}

const translations = {
  en: {
    "logo-title": "Fortune Portal",
    "nav-contact": "Contact",
    "nav-settings": "Settings",
    "hero-title": "Explore Your Destiny",
    "hero-subtitle":
      "A modern hub for ancient wisdom: Western astrology, Chinese Bazi & Ziwei, Tarot, Palmistry, Face Reading, Numerology, and the Book of Changes.",
    "hero-btn-astrology": "Start with Astrology",
    "hero-btn-tarot": "Draw a Tarot Card",
    "card-astrology-title": "Astrology",
    "card-astrology-text": "Discover your zodiac sign and core personality themes.",
    "card-bazi-title": "Bazi / Ziwei",
    "card-bazi-text": "Chinese destiny analysis based on birth pillars and star palaces.",
    "card-tarot-title": "Tarot",
    "card-tarot-text": "Draw a guiding card for clarity in the present moment.",
    "card-palm-title": "Palm & Face",
    "card-palm-text": "Symbolic reading of hands and facial features.",
    "card-numerology-title": "Numbers & I Ching",
    "card-numerology-text": "Life Path numbers and shifting patterns of change.",
    "settings-title": "Settings",
    "settings-subtitle": "Configure your preferences such as language, theme, and privacy.",
    "settings-language-title": "Language & Theme",
    "settings-language-text":
      "Choose your preferred language. Theme toggles can be added here later.",
    "settings-language-label": "Language",
  },
  zh: {
    "logo-title": "占卜门户",
    "nav-contact": "联系",
    "nav-settings": "设置",
    "hero-title": "探索你的命运",
    "hero-subtitle":
      "一个汇集古老智慧的现代入口：西方占星、八字与紫微、塔罗、手相、面相、数字命理与《易经》。",
    "hero-btn-astrology": "从星座开始",
    "hero-btn-tarot": "抽一张塔罗牌",
    "card-astrology-title": "占星",
    "card-astrology-text": "查看你的太阳星座与性格关键词。",
    "card-bazi-title": "八字 / 紫微",
    "card-bazi-text": "基于生日四柱与星曜宫位的命运分析。",
    "card-tarot-title": "塔罗",
    "card-tarot-text": "抽一张指引牌，看清当下的主题。",
    "card-palm-title": "手相与面相",
    "card-palm-text": "通过手部与面部特征进行象征性解读。",
    "card-numerology-title": "数字与易经",
    "card-numerology-text": "生命灵数与变化中的卦象提示。",
    "settings-title": "设置",
    "settings-subtitle": "在这里配置语言、主题与隐私偏好。",
    "settings-language-title": "语言与主题",
    "settings-language-text": "选择你偏好的界面语言。主题切换可在此处后续添加。",
    "settings-language-label": "界面语言",
  },
  mi: {
    "logo-title": "Tomo Matakite",
    "nav-contact": "Whakapā",
    "nav-settings": "Tautuhinga",
    "hero-title": "Tūhura i tō āpōpō",
    "hero-subtitle":
      "He tomokanga hou ki ngā mātauranga onamata: ngā whetū Pākehā, Bazi Hainamana, Ziwei, Tarot, pānui ringa, pānui kanohi, tatau tau, me te Pukapuka o Ngā Panonitanga.",
    "hero-btn-astrology": "Tīmata i te Astrology",
    "hero-btn-tarot": "Tango kāri Tarot",
    "card-astrology-title": "Astrology",
    "card-astrology-text": "Tirohia tō tohu zodiac me ō āhuatanga matua.",
    "card-bazi-title": "Bazi / Ziwei",
    "card-bazi-text": "Tātari oranga i runga i ngā pou whānau me ngā whetū.",
    "card-tarot-title": "Tarot",
    "card-tarot-text": "Tango i tētahi kāri hei arataki i a koe i tēnei wā.",
    "card-palm-title": "Ringa & Kanohi",
    "card-palm-text": "He pānui tohu mai i ō ringa me ō āhuatanga kanohi.",
    "card-numerology-title": "Tau & I Ching",
    "card-numerology-text": "Ngā nama ara ora me ngā tauira panoni.",
    "settings-title": "Tautuhinga",
    "settings-subtitle": "Whakaritea ō manakohanga pērā i te reo, te kaupapa me te tūmataiti.",
    "settings-language-title": "Reo & Kaupapa",
    "settings-language-text":
      "Kōwhiria tō reo pai mō te paetukutuku. Ka tāpirihia ngā kaupapa ā muri ake.",
    "settings-language-label": "Reo",
  },
};

function applyLanguage(lang) {
  const dict = translations[lang] || translations.en;
  document
    .querySelectorAll("[data-i18n]")
    .forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      const value = dict[key];
      if (typeof value === "string") {
        el.textContent = value;
      }
    });
}




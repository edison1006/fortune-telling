export const API_BASE = "http://127.0.0.1:8000";

// 天干地支等常量
export const HEAVENLY_STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
export const EARTHLY_BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

// 星座数据
export const ZODIAC_SIGNS = [
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

// 塔罗牌
export const TAROT_DECK = [
  { name: "0 The Fool", message: "A new journey is beginning. Stay open-hearted and trust your intuition." },
  { name: "I The Magician", message: "You already have the resources you need. It is time to act and manifest your ideas." },
  { name: "II The High Priestess", message: "Pause outward action and listen within. Hidden information is rising from your subconscious." },
  { name: "X Wheel of Fortune", message: "Circumstances are shifting. Align with the change and be ready to seize opportunity." },
  { name: "XIII Death", message: "An old phase is ending. Let go to make space for a more authentic beginning." },
  { name: "XVII The Star", message: "Hope and gentle healing are present. Trust that your path is quietly realigning." },
  { name: "XIX The Sun", message: "Energy and clarity are high. Show yourself and celebrate your progress." },
];

// 易经卦象
export const ICHING_HEXAGRAMS = [
  { number: 1, name: "Qian – The Creative", message: "Strong creative force. Take the initiative and act with steady determination." },
  { number: 2, name: "Kun – The Receptive", message: "Softness is strength here. Support, receive, and cooperate rather than pushing alone." },
  { number: 11, name: "Tai – Peace", message: "Heaven and earth are in harmony. Consolidate your gains and share good fortune." },
  { number: 24, name: "Fu – Return", message: "A turning point after a low period. Restart from small, sincere steps and correct your course." },
  { number: 46, name: "Sheng – Pushing Upward", message: "Steady, step-by-step growth. Avoid rushing; consistent effort lifts you higher." },
];

// 生命路径数字含义
export const LIFE_PATH_MEANINGS = {
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


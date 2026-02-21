import { useState, useEffect, useMemo } from 'react';
import { translations } from '../utils/translations';

const CHECKIN_STORAGE_KEY = 'fortune_checkin_date';

function getTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function seedFromDate(dateStr) {
  let h = 0;
  for (let i = 0; i < dateStr.length; i++) h = (h * 31 + dateStr.charCodeAt(i)) >>> 0;
  return h;
}

function pickIndex(seed, count) {
  return Math.abs(seed) % count;
}

const SLIPS_ZH = [
  '上上签：诸事顺遂，心诚则灵。',
  '上签：稳中求进，贵人相助。',
  '中上签：小有波折，终能如愿。',
  '中签：平心静气，静候佳音。',
  '中平签：宜守不宜进，蓄势待发。',
  '中下签：谨言慎行，可逢凶化吉。',
  '下签：韬光养晦，来日方长。',
];

const TIPS_ZH = [
  '今日宜：整理思绪，做一个小决定。',
  '今日宜：对身边的人说一句感谢。',
  '今日宜：完成一件拖延的小事。',
  '今日宜：早睡半小时，养足精神。',
  '今日宜：少刷手机，多听一首歌。',
  '今日宜：出门走走，换换气场。',
  '今日宜：写下三个小目标，明日执行。',
];

const COLORS_ZH = ['红色', '橙色', '金色', '绿色', '蓝色', '紫色', '白色'];
const DIRECTIONS_ZH = ['东方', '东南', '南方', '西南', '西方', '西北', '北方'];

const SLIPS_EN = [
  'Best: Smooth sailing when your heart is true.',
  'Good: Steady progress with help from others.',
  'Fair: Minor bumps, but you will get there.',
  'Neutral: Stay calm and wait for good news.',
  'Moderate: Hold rather than push; bide your time.',
  'Low: Be cautious; you can turn things around.',
  'Challenging: Lay low; better days ahead.',
];

const TIPS_EN = [
  'Today: Sort your thoughts and make one small decision.',
  'Today: Say thanks to someone around you.',
  'Today: Finish one thing you have been putting off.',
  'Today: Sleep 30 min earlier and rest well.',
  'Today: Less screen time; listen to one song.',
  'Today: Take a short walk and shift the vibe.',
  'Today: Write three small goals for tomorrow.',
];

const COLORS_EN = ['Red', 'Orange', 'Gold', 'Green', 'Blue', 'Purple', 'White'];
const DIRECTIONS_EN = ['East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest', 'North'];

function CheckInPage({ onBack, language }) {
  const t = translations[language] || translations.en;
  const p = t.checkInPage || {};
  const todayStr = getTodayStr();
  const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(CHECKIN_STORAGE_KEY) : null;
  const [signed, setSigned] = useState(stored === todayStr);

  const seed = useMemo(() => seedFromDate(todayStr), [todayStr]);
  const isZh = language === 'zh';

  const slip = useMemo(() => {
    const list = isZh ? SLIPS_ZH : SLIPS_EN;
    return list[pickIndex(seed, list.length)];
  }, [seed, isZh]);

  const tip = useMemo(() => {
    const list = isZh ? TIPS_ZH : TIPS_EN;
    return list[pickIndex(seed + 1, list.length)];
  }, [seed, isZh]);

  const color = useMemo(() => {
    const list = isZh ? COLORS_ZH : COLORS_EN;
    return list[pickIndex(seed + 2, list.length)];
  }, [seed, isZh]);

  const direction = useMemo(() => {
    const list = isZh ? DIRECTIONS_ZH : DIRECTIONS_EN;
    return list[pickIndex(seed + 3, list.length)];
  }, [seed, isZh]);

  const handleCheckIn = () => {
    try {
      localStorage.setItem(CHECKIN_STORAGE_KEY, todayStr);
    } catch (_) {}
    setSigned(true);
  };

  useEffect(() => {
    if (stored !== todayStr) setSigned(false);
  }, [todayStr, stored]);

  return (
    <main className="main">
      <button type="button" className="btn back-button" onClick={onBack}>
        ← {t.backToHome}
      </button>
      <div className="page-section checkin-page">
        <h2>{p.title}</h2>
        {!signed ? (
          <button type="button" className="btn btn-primary checkin-btn" onClick={handleCheckIn}>
            {p.checkInButton}
          </button>
        ) : (
          <p className="checkin-signed">{p.signedToday}</p>
        )}
        {signed && (
          <div className="checkin-cards">
            <div className="checkin-card">
              <h3>{p.dailyDraw}</h3>
              <p className="checkin-value">{slip}</p>
            </div>
            <div className="checkin-card">
              <h3>{p.todayTip}</h3>
              <p className="checkin-value">{tip}</p>
            </div>
            <div className="checkin-card">
              <h3>{p.luckyColor}</h3>
              <p className="checkin-value">{color}</p>
            </div>
            <div className="checkin-card">
              <h3>{p.luckyDirection}</h3>
              <p className="checkin-value">{direction}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default CheckInPage;

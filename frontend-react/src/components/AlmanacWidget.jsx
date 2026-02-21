import { useState, useEffect } from 'react';
import { Lunar } from 'lunar-javascript';
import { translations } from '../utils/translations';

const WORLD_TIME_API = 'https://worldtimeapi.org/api/ip';

function yiJiToTags(str) {
  if (!str || typeof str !== 'string') return [];
  const trimmed = str.replace(/\s/g, '');
  if (!trimmed) return [];
  const parts = [];
  for (let i = 0; i < trimmed.length; i += 2) {
    parts.push(trimmed.slice(i, i + 2));
  }
  return parts;
}

function AlmanacWidget({ language }) {
  const t = translations[language] || translations.zh;
  const a = t.almanac || {};
  const [ipTime, setIpTime] = useState(null);
  const [tz, setTz] = useState('');
  const [fetchedAt, setFetchedAt] = useState(0);
  const [tick, setTick] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(WORLD_TIME_API)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const dt = data.datetime ? new Date(data.datetime) : new Date();
        setIpTime(dt.getTime());
        setTz(data.timezone || data.abbreviation || '');
        setFetchedAt(Date.now());
        setError(false);
      })
      .catch(() => {
        if (!cancelled) {
          setIpTime(Date.now());
          setTz(Intl.DateTimeFormat().resolvedOptions().timeZone || '');
          setFetchedAt(Date.now());
          setError(true);
        }
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (ipTime == null) return;
    const id = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, [ipTime]);

  const now = ipTime != null ? new Date(ipTime + (Date.now() - fetchedAt)) : null;
  let lunarStr = '';
  let dayYi = '';
  let dayJi = '';
  if (now) {
    try {
      const lunar = Lunar.fromDate(now);
      lunarStr = lunar.toString();
      dayYi = lunar.getDayYi() || '';
      dayJi = lunar.getDayJi() || '';
    } catch (_) {
      lunarStr = '—';
    }
  }

  const timeStr = now
    ? now.toLocaleTimeString(language === 'zh' ? 'zh-CN' : 'en', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '';
  const dateStr = now
    ? now.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en', { year: 'numeric', month: '2-digit', day: '2-digit' })
    : '';

  return (
    <aside className="almanac-widget" aria-label={a.title}>
      <h3 className="almanac-widget-title">{a.title}</h3>
      {now ? (
        <>
          <p className="almanac-widget-time">{timeStr}</p>
          <p className="almanac-widget-date">{dateStr}</p>
          {tz ? <p className="almanac-widget-tz">{a.timezone}: {tz}</p> : null}
          {lunarStr ? <p className="almanac-widget-lunar">{lunarStr}</p> : null}
          {(dayYi || dayJi) ? (
            <div className="almanac-widget-yiji">
              {dayYi ? (
                <div className="almanac-widget-row">
                  <span className="almanac-widget-label">{a.suitable}</span>
                  <div className="almanac-widget-tags" aria-label={a.suitable}>
                    {yiJiToTags(dayYi).map((tag, i) => (
                      <span key={`yi-${i}`} className="almanac-widget-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              ) : null}
              {dayJi ? (
                <div className="almanac-widget-row">
                  <span className="almanac-widget-label">{a.avoid}</span>
                  <div className="almanac-widget-tags" aria-label={a.avoid}>
                    {yiJiToTags(dayJi).map((tag, i) => (
                      <span key={`ji-${i}`} className="almanac-widget-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </>
      ) : (
        <p className="almanac-widget-loading">{a.loading}</p>
      )}
    </aside>
  );
}

export default AlmanacWidget;

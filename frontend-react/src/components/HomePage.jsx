import { useState, useRef } from 'react';
import { translations } from '../utils/translations';
import AlmanacWidget from './AlmanacWidget';
import HomeCarousel from './HomeCarousel';

function HomePage({ onNavigate, language }) {
  const t = translations[language] || translations.en;
  const gridRef = useRef(null);
  const zodiacSigns = t.todayHoroscope?.zodiacSigns || [];
  const ZODIAC_IDS = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
  /* 12 星座今日简评星级（示例数据，可后续接接口） */
  const zodiacStarCounts = [4, 3, 5, 4, 3, 4, 5, 3, 4, 4, 3, 5];
  const [selectedZodiacId, setSelectedZodiacId] = useState('aries');
  const selectedZodiac = zodiacSigns.find((z) => z.id === selectedZodiacId) || zodiacSigns[0];
  const getZodiacSpritePosition = (id, cellSize = 72) => {
    const i = ZODIAC_IDS.indexOf(id);
    if (i < 0) return '0 0';
    const col = i % 6;
    const row = Math.floor(i / 6);
    return `-${col * cellSize}px -${row * cellSize}px`;
  };
  const renderStars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

  const features = [
    { id: 'bazi', title: t.bazi.title, description: t.bazi.description, icon: '☯️' },
    { id: 'zodiac', title: t.zodiac.title, description: t.zodiac.description, icon: '♈' },
    { id: 'tarot', title: t.tarot.title, description: t.tarot.description, icon: '🃏' },
    { id: 'nametest', title: t.nameTest.title, description: t.nameTest.description, icon: '✍️' },
    { id: 'palmface', title: t.palmFace.title, description: t.palmFace.description, icon: '✋' },
    { id: 'daily', title: t.dailyFortune.title, description: t.dailyFortune.description, icon: '📅' },
  ];

  const freeGamesTitle = t.freeGames?.sectionTitle ?? 'Free Test Mini-Games';
  const freeGamesCards = [
    { id: 'futurepartner', title: t.futurePartner?.title, description: t.futurePartner?.description, icon: '💕' },
    { id: 'pastlife', title: t.pastLife?.title, description: t.pastLife?.description, icon: '🕰️' },
    { id: 'personality', title: t.personality?.title, description: t.personality?.description, icon: '📊' },
    { id: 'luckynumber', title: t.luckyNumber?.title, description: t.luckyNumber?.description, icon: '🍀' },
    { id: 'wealthindex', title: t.wealthIndex?.title, description: t.wealthIndex?.description, icon: '💰' },
    { id: 'babynaming', title: t.babyNaming?.title, description: t.babyNaming?.description, icon: '✍️' },
  ];

  return (
    <main className="main">
      <div className="home-first-row">
        <div className="almanac-widget-wrap almanac-widget-wrap--with-checkin">
          <AlmanacWidget language={language} />
          <div className="almanac-widget-checkin">
            <span className="almanac-widget-checkin-icon" aria-hidden="true">✨</span>
            <span className="almanac-widget-checkin-title">{t.checkIn?.title}</span>
            <span className="almanac-widget-checkin-desc">{t.checkIn?.description}</span>
            <button type="button" className="almanac-widget-checkin-btn" onClick={() => onNavigate('checkin')}>
              {t.checkInPage?.checkInButton ?? t.checkIn?.title}
            </button>
          </div>
        </div>
        <HomeCarousel language={language} onNavigate={onNavigate} />
      </div>
      <section className="home-feature-blocks" aria-label={t.todayHoroscope?.title}>
        <article className="feature-block">
          <div className="feature-block-head">
            <h3 className="feature-block-title">{t.todayHoroscope?.title}</h3>
            <button type="button" className="feature-block-link" onClick={() => onNavigate('zodiac')}>
              {t.todayHoroscope?.linkTo} →
            </button>
          </div>
          <div className="feature-block-body feature-block--horoscope">
            <div className="horoscope-all-signs" aria-label={t.todayHoroscope?.title}>
              {zodiacSigns.map((z, idx) => (
                <button
                  type="button"
                  key={z.id}
                  className={`horoscope-mini-item ${selectedZodiacId === z.id ? 'is-selected' : ''}`}
                  onClick={() => setSelectedZodiacId(z.id)}
                  title={z.name}
                  aria-pressed={selectedZodiacId === z.id}
                >
                  <span
                    className="horoscope-mini-icon"
                    role="img"
                    aria-hidden
                    style={{
                      backgroundImage: 'url(/zodiac-icons/zodiac-sprite.png)',
                      backgroundSize: '288px 96px',
                      backgroundPosition: getZodiacSpritePosition(z.id, 48),
                    }}
                  />
                  <span className="horoscope-mini-stars">{renderStars(zodiacStarCounts[idx] ?? 4)}</span>
                </button>
              ))}
            </div>
            <div className="horoscope-sign">
              <div
                className="horoscope-icon horoscope-icon--sprite"
                role="img"
                aria-label={selectedZodiac?.name}
                style={{
                  backgroundImage: 'url(/zodiac-icons/zodiac-sprite.png)',
                  backgroundPosition: getZodiacSpritePosition(selectedZodiacId),
                }}
              />
              <select
                className="feature-block-select"
                value={selectedZodiacId}
                onChange={(e) => setSelectedZodiacId(e.target.value)}
                aria-label={t.todayHoroscope?.title}
              >
                {zodiacSigns.map((z) => (
                  <option key={z.id} value={z.id}>{z.name}</option>
                ))}
              </select>
            </div>
            <div className="horoscope-luck">
              <div className="luck-row"><span className="luck-label">{t.todayHoroscope?.overallLuck}</span><span className="luck-stars">★★★★☆</span></div>
              <div className="luck-row"><span className="luck-label">{t.todayHoroscope?.loveLuck}</span><span className="luck-stars luck-stars--love">★★☆☆☆</span></div>
              <div className="luck-row"><span className="luck-label">{t.todayHoroscope?.careerLuck}</span><span className="luck-stars luck-stars--career">★★★☆☆</span></div>
              <div className="luck-row"><span className="luck-label">{t.todayHoroscope?.wealthLuck}</span><span className="luck-stars luck-stars--wealth">★★☆☆☆</span></div>
            </div>
            <p className="horoscope-review"><strong>{t.todayHoroscope?.luckReview}</strong> {t.todayHoroscope?.luckReviewSample}</p>
          </div>
        </article>
        <div className="home-feature-blocks-right">
          <article className="feature-block feature-block--rect">
            <div className="feature-block-head">
              <h3 className="feature-block-title">{t.deityConsultation?.title}</h3>
              <button type="button" className="feature-block-link" onClick={() => onNavigate('checkin')}>
                {t.deityConsultation?.linkTo} →
              </button>
            </div>
            <div className="feature-block-body feature-block--deity">
              {[
                { key: 'caishen', name: t.deityConsultation?.caishen, icon: '💰' },
                { key: 'yuelao', name: t.deityConsultation?.yuelao, icon: '💕' },
                { key: 'wenchang', name: t.deityConsultation?.wenchang, icon: '📜' },
                { key: 'guanyu', name: t.deityConsultation?.guanyu, icon: '⚔️' },
              ].map((d) => (
                <div key={d.key} className="deity-item">
                  <span className="deity-icon" aria-hidden="true">{d.icon}</span>
                  <span className="deity-offerings">— {t.deityConsultation?.offerings}</span>
                  <button type="button" className="feature-block-btn" onClick={() => onNavigate('checkin')}>
                    {t.deityConsultation?.askBtn}{d.name}
                  </button>
                </div>
              ))}
            </div>
          </article>
          <article className="feature-block feature-block--rect">
            <div className="feature-block-head">
              <h3 className="feature-block-title">{t.prayerLamps?.title}</h3>
              <button type="button" className="feature-block-link" onClick={() => onNavigate('daily')}>
                {t.prayerLamps?.linkTo} →
              </button>
            </div>
            <div className="feature-block-body feature-block--lamps">
              {[
                { key: 'peace', name: t.prayerLamps?.peaceLamp, icon: '🪔' },
                { key: 'fate', name: t.prayerLamps?.fateLamp, icon: '🪷' },
                { key: 'taisui', name: t.prayerLamps?.taisuiLamp, icon: '🔴' },
                { key: 'light', name: t.prayerLamps?.lightLamp, icon: '✨' },
              ].map((l) => (
                <div key={l.key} className="lamp-item">
                  <span className="lamp-icon" aria-hidden="true">{l.icon}</span>
                  <span className="lamp-name">{l.name}</span>
                  <span className="lamp-offerings">— {t.prayerLamps?.offerings}</span>
                  <button type="button" className="feature-block-btn" onClick={() => onNavigate('daily')}>
                    {t.prayerLamps?.lightBtn}
                  </button>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
      <section className="cards-section" id="fortune-grid" ref={gridRef}>
        <div className="cards-grid">
          {features.map((feature) => (
            <button
              type="button"
              key={feature.id}
              className="feature-card"
              onClick={() => onNavigate(feature.id)}
            >
              <div className="card-figure">
                <span className="card-icon" aria-hidden="true">{feature.icon}</span>
              </div>
              <div className="card-body">
                <h3 className="card-title">{feature.title}</h3>
                <p className="card-description">{feature.description}</p>
                <span className="card-cta"><span className="card-cta-inner"><span className="card-cta-text">{t.cardExplore}</span><span className="card-arrow" aria-hidden="true">→</span></span></span>
              </div>
            </button>
          ))}
        </div>
      </section>
      <section className="cards-section cards-section--games" id="free-games">
        <h2 className="cards-section-title">{freeGamesTitle}</h2>
        <div className="cards-grid cards-grid--games">
          {freeGamesCards.map((card) => (
            <button
              type="button"
              key={card.id}
              className="feature-card"
              onClick={() => onNavigate(card.id)}
            >
              <div className="card-figure">
                <span className="card-icon" aria-hidden="true">{card.icon}</span>
              </div>
              <div className="card-body">
                <h3 className="card-title">{card.title}</h3>
                <p className="card-description">{card.description}</p>
                <span className="card-cta"><span className="card-cta-inner"><span className="card-cta-text">{t.cardExplore}</span><span className="card-arrow" aria-hidden="true">→</span></span></span>
              </div>
            </button>
          ))}
        </div>
      </section>
      <section className="cards-section cards-section--knowledge" id="knowledge-base">
        <button
          type="button"
          className="feature-card feature-card--knowledge"
          onClick={() => onNavigate('knowledge')}
        >
          <div className="card-figure">
            <span className="card-icon" aria-hidden="true">📚</span>
          </div>
          <div className="card-body">
            <h3 className="card-title">{t.knowledgeBase?.title}</h3>
            <p className="card-description">{t.knowledgeBase?.description}</p>
            <span className="card-cta"><span className="card-cta-inner"><span className="card-cta-text">{t.cardExplore}</span><span className="card-arrow" aria-hidden="true">→</span></span></span>
          </div>
        </button>
      </section>
      <section className="home-dashboard" aria-label={t.dashboard?.fortuneIndexTitle}>
        <div className="dashboard-card dashboard-card--index">
          <h3 className="dashboard-card-title">{t.dashboard?.fortuneIndexTitle}</h3>
          <div className="fortune-index-chart">
            {['love', 'career', 'wealth', 'health', 'overall'].map((key, i) => {
              const values = [78, 85, 72, 90, 82];
              const pct = values[i] ?? 80;
              return (
                <div key={key} className="fortune-index-row">
                  <span className="fortune-index-label">{t.dashboard?.indexLabels?.[key] ?? key}</span>
                  <div className="fortune-index-bar-wrap">
                    <div className="fortune-index-bar" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="fortune-index-value">{pct}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="dashboard-card dashboard-card--trending">
          <h3 className="dashboard-card-title">{t.dashboard?.trendingTitle}</h3>
          <ul className="trending-list">
            {(t.dashboard?.trendingItems ?? []).map((item, i) => (
              <li key={i}>
                <button type="button" className="trending-item" onClick={() => onNavigate('knowledge')}>
                  <span className="trending-item-title">{item.title}</span>
                  <span className="trending-item-heat">{item.heat}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

export default HomePage;

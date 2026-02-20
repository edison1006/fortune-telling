import { useRef } from 'react';
import { translations } from '../utils/translations';

function HomePage({ onNavigate, language }) {
  const t = translations[language] || translations.en;
  const gridRef = useRef(null);

  const centerTitle = t.home?.centerTitle ?? t.heroTitle;
  const subtitle = t.home?.heroSubtitle ?? t.heroSubtitle;
  const ctaButton = t.home?.ctaButton ?? 'Start Reading';

  const features = [
    { id: 'bazi', title: t.bazi.title, description: t.bazi.description, icon: '☯️' },
    { id: 'zodiac', title: t.zodiac.title, description: t.zodiac.description, icon: '♈' },
    { id: 'tarot', title: t.tarot.title, description: t.tarot.description, icon: '🃏' },
    { id: 'nametest', title: t.nameTest.title, description: t.nameTest.description, icon: '✍️' },
    { id: 'palmface', title: t.palmFace.title, description: t.palmFace.description, icon: '✋' },
    { id: 'daily', title: t.dailyFortune.title, description: t.dailyFortune.description, icon: '📅' },
  ];

  const scrollToGrid = () => {
    gridRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="main">
      <div className="hero-card">
        <h1>{centerTitle}</h1>
        <p>{subtitle}</p>
        <button
          type="button"
          className="btn btn-primary hero-cta"
          onClick={scrollToGrid}
        >
          {ctaButton}
        </button>
      </div>
      <section className="cards-section" id="fortune-grid" ref={gridRef}>
        <div className="cards-grid">
          {features.map((feature) => (
            <button
              type="button"
              key={feature.id}
              className="feature-card"
              onClick={() => onNavigate(feature.id)}
            >
              <span className="card-icon" aria-hidden="true">{feature.icon}</span>
              <span className="card-title">{feature.title}</span>
              <span className="card-description">{feature.description}</span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

export default HomePage;

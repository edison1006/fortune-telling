import { translations } from '../utils/translations';

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

export default HomePage;


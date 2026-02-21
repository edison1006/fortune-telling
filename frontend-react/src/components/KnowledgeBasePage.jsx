import { translations } from '../utils/translations';

const CATEGORIES = [
  { key: 'baziIntro', icon: '☯️' },
  { key: 'fengShui', icon: '🏠' },
  { key: 'zodiacAnalysis', icon: '♈' },
  { key: 'fortuneStories', icon: '📜' },
  { key: 'luckTips', icon: '✨' },
];

function KnowledgeBasePage({ onBack, language }) {
  const t = translations[language] || translations.en;
  const p = t.knowledgeBasePage || {};

  return (
    <main className="main knowledge-base-page">
      <button type="button" className="btn back-button" onClick={onBack}>
        ← {t.backToHome}
      </button>
      <div className="knowledge-base-header">
        <h1>{p.title}</h1>
        <p>{p.subtitle}</p>
      </div>
      <section className="knowledge-base-categories">
        {CATEGORIES.map(({ key, icon }) => (
          <article key={key} className="knowledge-base-card">
            <span className="knowledge-base-card-icon" aria-hidden="true">{icon}</span>
            <h2 className="knowledge-base-card-title">{p[key]}</h2>
            <p className="knowledge-base-card-more">{p.moreComing}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

export default KnowledgeBasePage;

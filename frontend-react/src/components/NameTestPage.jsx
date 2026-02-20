import { translations } from '../utils/translations';

function NameTestPage({ onBack, language }) {
  const t = translations[language] || translations.en;
  const pageT = t.nameTestPage || { title: 'Name Test', description: 'Name strokes and five-elements analysis. This feature is coming soon.' };

  return (
    <main className="main">
      <button type="button" className="btn back-button" onClick={onBack}>
        ← {t.backToHome}
      </button>
      <div className="page-section">
        <h2>{pageT.title}</h2>
        <p>{pageT.description}</p>
        <p className="result-placeholder">{pageT.comingSoon || 'Coming soon.'}</p>
      </div>
    </main>
  );
}

export default NameTestPage;

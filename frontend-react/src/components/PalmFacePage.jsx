import { translations } from '../utils/translations';

function PalmFacePage({ onBack, language }) {
  const t = translations[language] || translations.zh;

  return (
    <main className="main">
      <button type="button" className="btn back-button" onClick={onBack}>
        ← {t.backToHome}
      </button>
      <div className="page-section">
        <h2>{t.palmFacePage.title}</h2>
        <p>{t.palmFacePage.description}</p>
      </div>
    </main>
  );
}

export default PalmFacePage;


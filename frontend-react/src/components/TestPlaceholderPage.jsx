import { translations } from '../utils/translations';

const PAGE_KEYS = {
  futurepartner: 'futurePartnerPage',
  pastlife: 'pastLifePage',
  personality: 'personalityPage',
  luckynumber: 'luckyNumberPage',
  wealthindex: 'wealthIndexPage',
  babynaming: 'babyNamingPage',
};

function TestPlaceholderPage({ onBack, language, pageKey }) {
  const t = translations[language] || translations.en;
  const key = PAGE_KEYS[pageKey] || 'futurePartnerPage';
  const pageT = t[key] || { title: 'Test', description: '', comingSoon: 'Coming soon.' };

  return (
    <main className="main">
      <button type="button" className="btn back-button" onClick={onBack}>
        ← {t.backToHome}
      </button>
      <div className="page-section">
        <h2>{pageT.title}</h2>
        <p>{pageT.description}</p>
        <p className="result-placeholder">{pageT.comingSoon}</p>
      </div>
    </main>
  );
}

export default TestPlaceholderPage;

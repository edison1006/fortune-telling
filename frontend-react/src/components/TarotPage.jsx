import { useState } from 'react';
import { translations } from '../utils/translations';
import { TAROT_DECK } from '../utils/constants';
import { sample } from '../utils/helpers';

function TarotPage({ onBack, language }) {
  const t = translations[language] || translations.zh;
  const [result, setResult] = useState("");

  const draw = () => {
    const card = sample(TAROT_DECK);
    setResult(`${card.name}: ${card.message}`);
  };

  return (
    <main className="main">
      <button type="button" className="btn back-button" onClick={onBack}>
        ← {t.backToHome}
      </button>
      <div className="page-section">
        <h2>{t.tarotPage.title}</h2>
        <p>{t.tarotPage.description}</p>
        <button type="button" className="btn btn-primary" onClick={draw}>
          {t.tarotPage.drawButton}
        </button>
        <div className="result-box">{result}</div>
      </div>
    </main>
  );
}

export default TarotPage;


import { useState } from 'react';
import { translations } from '../utils/translations';
import { reduceToDigit, getLifePathMeaning } from '../utils/helpers';

function NumerologyPage({ onBack, language }) {
  const t = translations[language] || translations.zh;
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!birthDate) {
      setResult(t.numerologyPage.errorNoDate);
      return;
    }
    const digits = birthDate.replace(/-/g, "");
    const lifePath = reduceToDigit(digits);
    const meaning = getLifePathMeaning(lifePath);
    setResult(`${t.numerologyPage.lifePath} ${lifePath}: ${meaning}`);
  };

  return (
    <main className="main">
      <button type="button" className="btn back-button" onClick={onBack}>
        ← {t.backToHome}
      </button>
      <div className="page-section">
        <h2>{t.numerologyPage.title}</h2>
        <p>{t.numerologyPage.description}</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t.numerologyPage.birthDate}</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {t.numerologyPage.calculateButton}
          </button>
        </form>
        <div className="result-box">{result}</div>
      </div>
    </main>
  );
}

export default NumerologyPage;


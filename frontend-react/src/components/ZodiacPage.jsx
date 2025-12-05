import { useState } from 'react';
import { translations } from '../utils/translations';
import { getZodiacSign } from '../utils/helpers';

function ZodiacPage({ onBack, language }) {
  const t = translations[language] || translations.zh;
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!birthDate) {
      setResult(t.zodiacPage.errorNoDate);
      return;
    }
    const date = new Date(birthDate + "T12:00:00");
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const sign = getZodiacSign(month, day);
    if (sign) {
      setResult(`${sign.name} - ${sign.description}`);
    } else {
      setResult(t.zodiacPage.errorInvalidDate);
    }
  };

  return (
    <main className="main">
      <button type="button" className="btn back-button" onClick={onBack}>
        ← {t.backToHome}
      </button>
      <div className="page-section">
        <h2>{t.zodiacPage.title}</h2>
        <p>{t.zodiacPage.description}</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t.zodiacPage.birthDate}</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {t.zodiacPage.queryButton}
          </button>
        </form>
        <div className="result-box">{result}</div>
      </div>
    </main>
  );
}

export default ZodiacPage;


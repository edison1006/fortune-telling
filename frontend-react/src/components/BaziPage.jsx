import { useState } from 'react';
import { translations } from '../utils/translations';
import { API_BASE } from '../utils/constants';

function BaziPage({ onBack, language }) {
  const t = translations[language] || translations.zh;
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!birthDate) {
      setResult(
        language === "en"
          ? "Please select your birth date."
          : language === "mi"
          ? "Tīpakohia tō rā whānau."
          : "请选择您的出生日期。"
      );
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const payload = {
        birth_date: birthDate,
        birth_time: birthTime && birthTime.trim() ? birthTime.trim() : null,
      };
      const res = await fetch(`${API_BASE}/bazi`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) {
        let errorMessage = "Request failed";
        try {
          const err = await res.json();
          errorMessage = err.detail || err.message || JSON.stringify(err);
        } catch (e) {
          errorMessage = `HTTP ${res.status}: ${res.statusText}`;
        }
        throw new Error(errorMessage);
      }
      
      const data = await res.json();
      // 显示完整的八字结果，包括AI解读
      let displayResult = data.summary || "";
      if (data.interpretation) {
        displayResult += "\n\n【详细解读】\n" + data.interpretation;
      }
      setResult(displayResult || JSON.stringify(data, null, 2));
    } catch (err) {
      console.error("Bazi calculation error:", err);
      const errorMsg = err.message || String(err);
      setResult(
        (language === "en"
          ? "Bazi calculation failed: "
          : language === "mi"
          ? "I rahua te tātai Bazi: "
          : "八字计算失败：") + errorMsg
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main">
      <button type="button" className="btn back-button" onClick={onBack}>
        ← {t.backToHome}
      </button>
      <div className="page-section">
        <h2>{t.baziPage.title}</h2>
        <p>{t.baziPage.description}</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t.baziPage.birthDate}</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>{t.baziPage.birthTime}</label>
            <input
              type="time"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? t.baziPage.calculating : t.baziPage.calculateButton}
          </button>
        </form>
        <div className="result-box">
          {result || t.baziPage.placeholder}
        </div>
      </div>
    </main>
  );
}

export default BaziPage;


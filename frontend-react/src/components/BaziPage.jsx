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
      
      // 格式化显示结果
      let displayResult = "";
      
      // 八字排盘
      displayResult += "【八字排盘】\n";
      displayResult += `年柱：${data.year_pillar.stem}${data.year_pillar.branch}（${data.year_pillar.element}${data.year_pillar.animal ? `，${data.year_pillar.animal}` : ''}）`;
      if (data.year_pillar.ten_god) {
        displayResult += ` [${data.year_pillar.ten_god}]`;
      }
      displayResult += "\n";
      
      displayResult += `月柱：${data.month_pillar.stem}${data.month_pillar.branch}（${data.month_pillar.element}）`;
      if (data.month_pillar.ten_god) {
        displayResult += ` [${data.month_pillar.ten_god}]`;
      }
      displayResult += "\n";
      
      displayResult += `日柱：${data.day_pillar.stem}${data.day_pillar.branch}（${data.day_pillar.element}）[日主]`;
      displayResult += "\n";
      
      if (data.hour_pillar) {
        displayResult += `时柱：${data.hour_pillar.stem}${data.hour_pillar.branch}（${data.hour_pillar.element}）`;
        if (data.hour_pillar.ten_god) {
          displayResult += ` [${data.hour_pillar.ten_god}]`;
        }
        displayResult += "\n";
      } else {
        displayResult += "时柱：未提供\n";
      }
      
      // 详细分析
      if (data.analysis) {
        displayResult += "\n【详细分析】\n";
        displayResult += data.analysis.analysis_summary || "";
        displayResult += "\n";
        
        // 五行分布可视化
        if (data.analysis.element_analysis) {
          displayResult += "\n【五行分布】\n";
          const elementCount = data.analysis.element_analysis.element_count;
          for (const [elem, count] of Object.entries(elementCount)) {
            const bars = "█".repeat(Math.round(count * 2));
            displayResult += `${elem}：${bars} ${count.toFixed(1)}\n`;
          }
          displayResult += `\n五行平衡：${data.analysis.element_analysis.element_balance}\n`;
        }
      }
      
      // AI解读
      if (data.interpretation) {
        displayResult += "\n【详细解读】\n";
        displayResult += data.interpretation;
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
        <div className="result-box bazi-result">
          {result ? (
            <pre style={{ 
              whiteSpace: 'pre-wrap', 
              fontFamily: 'inherit',
              margin: 0,
              lineHeight: '1.8'
            }}>{result}</pre>
          ) : (
            t.baziPage.placeholder
          )}
        </div>
      </div>
    </main>
  );
}

export default BaziPage;


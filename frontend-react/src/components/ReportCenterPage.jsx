import { useState, useCallback } from 'react';
import { jsPDF } from 'jspdf';
import { translations } from '../utils/translations';

const PDF_STORAGE_KEY = 'fortune_report_pdf_count';
const MAX_FREE_PDF = 3;

function getPdfCount() {
  try {
    const n = parseInt(localStorage.getItem(PDF_STORAGE_KEY) || '0', 10);
    return isNaN(n) ? 0 : n;
  } catch {
    return 0;
  }
}

function setPdfCount(n) {
  try {
    localStorage.setItem(PDF_STORAGE_KEY, String(Math.max(0, n)));
  } catch {}
}

function ReportCenterPage({ onBack, language }) {
  const t = translations[language] || translations.en;
  const rc = t.reportCenter || {};
  const [pdfCount, setPdfCountState] = useState(getPdfCount);
  const [message, setMessage] = useState(null);

  const remaining = Math.max(0, MAX_FREE_PDF - pdfCount);
  const canDownload = remaining > 0;

  const replaceN = (str, n) => (str || '').replace(/\{\{n\}\}/g, String(n));

  const pdfTitleByKey = {
    daily: "Today's Fortune",
    weekly: "Weekly Fortune",
    monthly: "Monthly Fortune",
    annual: "Annual / Flowing Year",
    wealth: "Wealth Report",
    love: "Love Report",
    career: "Career Report",
  };

  const downloadPdf = useCallback((reportKey, title, content) => {
    if (!canDownload) {
      setMessage(rc.freeCountExhausted || 'No free downloads left');
      return;
    }
    const doc = new jsPDF();
    const pdfTitle = pdfTitleByKey[reportKey] || title;
    doc.setFontSize(18);
    doc.text(pdfTitle, 20, 22);
    doc.setFontSize(11);
    const pdfBody = typeof content === 'string' && /[\u4e00-\u9fff]/.test(content)
      ? 'Fortune report content will appear here after you complete a reading.'
      : (content || 'Fortune report content will appear here after your reading.');
    const lines = doc.splitTextToSize(pdfBody, 170);
    doc.text(lines, 20, 34);
    doc.save(`fortune-report-${reportKey}.pdf`);
    const newCount = getPdfCount() + 1;
    setPdfCount(newCount);
    setPdfCountState(newCount);
    setMessage(rc.downloadSuccess || 'Downloaded');
    setTimeout(() => setMessage(null), 2000);
  }, [canDownload, rc.downloadSuccess, rc.freeCountExhausted]);

  const reportSections = [
    { key: 'daily', title: rc.daily, contentKey: 'daily' },
    { key: 'weekly', title: rc.weekly, contentKey: 'weekly' },
    { key: 'monthly', title: rc.monthly, contentKey: 'monthly' },
    { key: 'annual', title: rc.annual, contentKey: 'annual' },
  ];

  const specialSections = [
    { key: 'wealth', title: rc.wealth },
    { key: 'love', title: rc.love },
    { key: 'career', title: rc.career },
  ];

  const placeholderContent = {
    daily: language === 'zh' ? '今日运势报告：完成测算后，此处将显示您的今日运势概要与建议。' : 'Today\'s fortune summary and advice will appear here after your reading.',
    weekly: language === 'zh' ? '本周运势报告：完成测算后，此处将显示本周运势与重点提示。' : 'Weekly fortune and key tips will appear here after your reading.',
    monthly: language === 'zh' ? '本月运势报告：完成测算后，此处将显示本月运势与流月要点。' : 'Monthly fortune and highlights will appear here after your reading.',
    annual: language === 'zh' ? '流年分析：完成测算后，此处将显示流年运势与年度建议。' : 'Annual / flowing year analysis and advice will appear here after your reading.',
  };

  return (
    <main className="main">
      <button type="button" className="btn back-button" onClick={onBack}>
        ← {t.backToHome}
      </button>

      <div className="report-center-header">
        <h1>{rc.title}</h1>
        <p>{rc.subtitle}</p>
        <p className="report-center-quota">
          {replaceN(rc.freeCountRemaining, remaining)}
        </p>
        {message && <p className="report-center-message" role="status">{message}</p>}
      </div>

      <section className="report-sections">
        {reportSections.map(({ key, title, contentKey }) => (
          <div key={key} className="report-card">
            <h3>{title}</h3>
            <p className="report-card-content">{placeholderContent[contentKey] || placeholderContent.daily}</p>
            <button
              type="button"
              className="btn btn-secondary report-download-btn"
              onClick={() => downloadPdf(key, title, placeholderContent[contentKey] || '')}
              disabled={!canDownload}
              aria-label={`${rc.downloadPdf}: ${title}`}
            >
              {rc.downloadPdf}
            </button>
          </div>
        ))}
      </section>

      <section className="report-sections">
        <h2 className="report-section-title">{rc.specialReports}</h2>
        <div className="report-cards-grid">
          {specialSections.map(({ key, title }) => (
            <div key={key} className="report-card report-card-small">
              <h3>{title}</h3>
              <p className="report-card-content">
                {language === 'zh' ? '专项报告内容将在完成测算后显示。' : 'Report content will appear here after your reading.'}
              </p>
              <button
                type="button"
                className="btn btn-secondary report-download-btn"
                onClick={() => downloadPdf(key, title, `${title}. Content will appear after your reading.`)}
                disabled={!canDownload}
                aria-label={`${rc.downloadPdf}: ${title}`}
              >
                {rc.downloadPdf}
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default ReportCenterPage;

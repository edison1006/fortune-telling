import { translations } from '../utils/translations';

function Header({ onNavigateHome, onNavigateToReports, language, onLanguageChange, showLanguageMenu, onToggleLanguageMenu, languageMenuRef, currentPage }) {
  const t = translations[language] || translations.zh;
  const languageLabel = language === "en" ? "English" : language === "mi" ? "Māori" : "中文";
  const reportsLabel = (t.reportCenter && t.reportCenter.title) ? t.reportCenter.title : (language === "zh" ? "报告中心" : "Report Center");

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo" onClick={onNavigateHome}>
          FutureAlgo
        </div>
        <div className="header-right">
          {onNavigateToReports && (
            <button type="button" className="btn btn-secondary header-nav-btn" onClick={onNavigateToReports}>
              {reportsLabel}
            </button>
          )}
          <div className="language-selector" ref={languageMenuRef}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onToggleLanguageMenu}
              aria-expanded={showLanguageMenu}
              aria-haspopup="listbox"
              aria-label={t.languageSettings}
            >
              {t.languageSettings}（{languageLabel}）
            </button>
            {showLanguageMenu && (
              <div className="language-menu" role="listbox" aria-label={t.languageSettings}>
                <button
                  type="button"
                  role="option"
                  aria-selected={language === "zh"}
                  className={`language-menu-item ${language === "zh" ? "active" : ""}`}
                  onClick={() => onLanguageChange("zh")}
                >
                  中文
                </button>
                <button
                  type="button"
                  role="option"
                  aria-selected={language === "en"}
                  className={`language-menu-item ${language === "en" ? "active" : ""}`}
                  onClick={() => onLanguageChange("en")}
                >
                  English
                </button>
                <button
                  type="button"
                  role="option"
                  aria-selected={language === "mi"}
                  className={`language-menu-item ${language === "mi" ? "active" : ""}`}
                  onClick={() => onLanguageChange("mi")}
                >
                  Māori
                </button>
              </div>
            )}
          </div>
          {currentPage !== "home" && (
            <button type="button" className="btn btn-secondary" onClick={onNavigateHome}>
              {t.backToHome}
            </button>
          )}
          <button type="button" className="btn btn-secondary">
            {t.account}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;


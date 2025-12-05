import { translations } from '../utils/translations';

function Header({ onNavigateHome, language, onLanguageChange, showLanguageMenu, onToggleLanguageMenu, languageMenuRef, currentPage }) {
  const t = translations[language] || translations.zh;
  const languageLabel = language === "en" ? "English" : language === "mi" ? "Māori" : "中文";

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo" onClick={onNavigateHome}>
          FutureAlgo
        </div>
        <div className="header-right">
          <div className="language-selector" ref={languageMenuRef}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onToggleLanguageMenu}
            >
              {t.languageSettings}（{languageLabel}）
            </button>
            {showLanguageMenu && (
              <div className="language-menu">
                <button
                  type="button"
                  className={`language-menu-item ${language === "zh" ? "active" : ""}`}
                  onClick={() => onLanguageChange("zh")}
                >
                  中文
                </button>
                <button
                  type="button"
                  className={`language-menu-item ${language === "en" ? "active" : ""}`}
                  onClick={() => onLanguageChange("en")}
                >
                  English
                </button>
                <button
                  type="button"
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


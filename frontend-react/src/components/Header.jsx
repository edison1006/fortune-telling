import { useState } from 'react';
import { translations } from '../utils/translations';

function Header({
  onNavigateHome,
  onNavigateToReports,
  onNavigate,
  language,
  onLanguageChange,
  showLanguageMenu,
  onToggleLanguageMenu,
  languageMenuRef,
  currentPage,
}) {
  const t = translations[language] || translations.zh;
  const languageLabel = language === 'en' ? 'English' : language === 'mi' ? 'Māori' : '中文';
  const top = t.headerTop || {};
  const mid = t.headerMid || {};
  const nav = t.headerNav || {};
  const siteName = t.home?.centerTitle ?? t.heroTitle ?? 'Oracle Sanctum';
  const tagline = mid.tagline ?? t.home?.heroSubtitle ?? '';

  const [searchQuery, setSearchQuery] = useState('');
  const [showNavMenu, setShowNavMenu] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if ((searchQuery || '').trim()) onNavigate?.('knowledge');
    setSearchQuery('');
  };

  const navList = [
    { id: 'bazi', label: nav.fortune },
    { id: 'zodiac', label: nav.zodiac },
    { id: 'knowledge', label: nav.articles },
    { id: 'community', label: nav.community },
    { id: 'reports', label: nav.reports },
  ];

  return (
    <header className="header header--three-tier">
      {/* Row 1: brand (left) + top utility (right) */}
      <div className="header-mid">
        <div className="header-mid-inner">
          <div className="header-brand" onClick={onNavigateHome}>
            {tagline ? <p className="header-tagline">{tagline}</p> : null}
            <h1 className="header-logo">{siteName}</h1>
          </div>
          <div className="header-top-links">
            <button type="button" className="header-top-link">{top.login}</button>
            <span className="header-top-sep">|</span>
            <button type="button" className="header-top-link">{top.freeJoin}</button>
            <span className="header-top-sep">|</span>
            <button type="button" className="header-top-link">{top.memberCenter}</button>
            <span className="header-top-sep">|</span>
            <div className="language-selector" ref={languageMenuRef}>
              <button
                type="button"
                className="header-top-link"
                onClick={onToggleLanguageMenu}
                aria-expanded={showLanguageMenu}
                aria-haspopup="listbox"
              >
                {languageLabel}
              </button>
              {showLanguageMenu && (
                <div className="language-menu" role="listbox">
                  <button type="button" role="option" className={`language-menu-item ${language === 'zh' ? 'active' : ''}`} onClick={() => onLanguageChange('zh')}>中文</button>
                  <button type="button" role="option" className={`language-menu-item ${language === 'en' ? 'active' : ''}`} onClick={() => onLanguageChange('en')}>English</button>
                  <button type="button" role="option" className={`language-menu-item ${language === 'mi' ? 'active' : ''}`} onClick={() => onLanguageChange('mi')}>Māori</button>
                </div>
              )}
            </div>
            <span className="header-top-sep">|</span>
            <button type="button" className="btn header-top-download" onClick={() => {}}>{top.downloadApp}</button>
          </div>
        </div>
      </div>

      {/* Row 2: main nav (left) + search (far right) */}
      <div className="header-nav">
        <div className="header-nav-inner">
          <button
            type="button"
            className="btn header-nav-categories"
            onClick={() => { setShowNavMenu((v) => !v); onNavigateHome?.(); }}
            aria-expanded={showNavMenu}
          >
            <span className="header-nav-hamburger" aria-hidden>≡</span>
            {nav.allCategories}
          </button>
          <nav className="header-nav-links">
            {navList.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`header-nav-link ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => onNavigate?.(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
          {currentPage !== 'home' && (
            <button type="button" className="btn header-nav-back" onClick={onNavigateHome}>
              {t.backToHome}
            </button>
          )}
          <div className="header-nav-search">
            <form className="header-search" onSubmit={handleSearch}>
              <input
                type="text"
                className="header-search-input"
                placeholder={mid.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label={mid.search}
              />
              <button type="submit" className="btn header-search-btn">{mid.search}</button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

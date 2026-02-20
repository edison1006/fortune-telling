import { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import { translations } from './utils/translations';
import Header from './components/Header';
import HomePage from './components/HomePage';
import './App.css';

const ZodiacPage = lazy(() => import('./components/ZodiacPage'));
const NumerologyPage = lazy(() => import('./components/NumerologyPage'));
const TarotPage = lazy(() => import('./components/TarotPage'));
const BaziPage = lazy(() => import('./components/BaziPage'));
const PalmFacePage = lazy(() => import('./components/PalmFacePage'));
const NameTestPage = lazy(() => import('./components/NameTestPage'));
const DailyFortunePage = lazy(() => import('./components/DailyFortunePage'));

function PageFallback() {
  return (
    <main className="main" aria-busy="true">
      <div className="page-loading" role="status" aria-live="polite">
        <span className="page-loading-spinner" aria-hidden="true" />
        <span>Loading…</span>
      </div>
    </main>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [language, setLanguage] = useState("en");
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const languageMenuRef = useRef(null);

  const navigateTo = useCallback((page) => setCurrentPage(page), []);
  const navigateHome = useCallback(() => setCurrentPage("home"), []);
  const toggleLanguageMenu = useCallback(() => setShowLanguageMenu((prev) => !prev), []);
  const handleChangeLanguage = useCallback((lang) => {
    setLanguage(lang);
    setShowLanguageMenu(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setShowLanguageMenu(false);
      }
    };
    if (showLanguageMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showLanguageMenu]);

  const renderPage = () => {
    switch (currentPage) {
      case "zodiac":
        return <ZodiacPage onBack={navigateHome} language={language} />;
      case "numerology":
        return <NumerologyPage onBack={navigateHome} language={language} />;
      case "tarot":
        return <TarotPage onBack={navigateHome} language={language} />;
      case "bazi":
        return <BaziPage onBack={navigateHome} language={language} />;
      case "palmface":
        return <PalmFacePage onBack={navigateHome} language={language} />;
      case "nametest":
        return <NameTestPage onBack={navigateHome} language={language} />;
      case "daily":
        return <DailyFortunePage onBack={navigateHome} language={language} />;
      default:
        return <HomePage onNavigate={navigateTo} language={language} />;
    }
  };

  return (
    <div className="app">
      <Header
        onNavigateHome={navigateHome}
        language={language}
        onLanguageChange={handleChangeLanguage}
        showLanguageMenu={showLanguageMenu}
        onToggleLanguageMenu={toggleLanguageMenu}
        languageMenuRef={languageMenuRef}
        currentPage={currentPage}
      />
      <Suspense fallback={<PageFallback />}>
        {renderPage()}
      </Suspense>
    </div>
  );
}

export default App;

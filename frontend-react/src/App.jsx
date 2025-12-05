import { useState, useEffect, useRef } from 'react';
import { translations } from './utils/translations';
import Header from './components/Header';
import HomePage from './components/HomePage';
import ZodiacPage from './components/ZodiacPage';
import NumerologyPage from './components/NumerologyPage';
import TarotPage from './components/TarotPage';
import BaziPage from './components/BaziPage';
import PalmFacePage from './components/PalmFacePage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [language, setLanguage] = useState("zh"); // zh, en, mi
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const languageMenuRef = useRef(null);

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  const navigateHome = () => {
    setCurrentPage("home");
  };

  const toggleLanguageMenu = () => {
    setShowLanguageMenu((prev) => !prev);
  };

  const handleChangeLanguage = (lang) => {
    setLanguage(lang);
    setShowLanguageMenu(false);
  };

  // 点击外部区域关闭菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setShowLanguageMenu(false);
      }
    };

    if (showLanguageMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
      {renderPage()}
    </div>
  );
}

export default App;

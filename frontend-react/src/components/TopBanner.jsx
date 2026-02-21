import { translations } from '../utils/translations';

function TopBanner({ language }) {
  const t = translations[language] || translations.en;
  const title = t.home?.centerTitle ?? t.heroTitle ?? 'Oracle Sanctum';
  const subtitle = t.home?.heroSubtitle ?? t.heroSubtitle ?? '';

  return (
    <div className="top-banner" role="banner">
      <h1 className="top-banner-title">{title}</h1>
      {subtitle ? <p className="top-banner-subtitle">{subtitle}</p> : null}
    </div>
  );
}

export default TopBanner;

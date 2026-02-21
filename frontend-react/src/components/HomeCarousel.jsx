import { useState, useEffect } from 'react';
import { translations } from '../utils/translations';

const AUTOPLAY_MS = 5000;

function HomeCarousel({ language, onNavigate }) {
  const t = translations[language] || translations.zh;
  const slides = t.homeCarousel?.slides || [];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [slides.length]);

  if (!slides.length) return null;

  const slide = slides[index];
  const go = (delta) => setIndex((i) => (i + delta + slides.length) % slides.length);

  return (
    <section className="home-carousel" aria-label="轮播">
      <div className="home-carousel-inner">
        <button
          type="button"
          className="home-carousel-btn home-carousel-btn--prev"
          onClick={() => go(-1)}
          aria-label="上一张"
        >
          ‹
        </button>
        <button
          type="button"
          className="home-carousel-card"
          onClick={() => slide?.linkId && onNavigate?.(slide.linkId)}
        >
          {slide?.icon && <span className="home-carousel-icon" aria-hidden="true">{slide.icon}</span>}
          <span className="home-carousel-title">{slide?.title}</span>
          <span className="home-carousel-desc">{slide?.description}</span>
        </button>
        <button
          type="button"
          className="home-carousel-btn home-carousel-btn--next"
          onClick={() => go(1)}
          aria-label="下一张"
        >
          ›
        </button>
      </div>
      {slides.length > 1 && (
        <div className="home-carousel-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`home-carousel-dot ${i === index ? 'is-active' : ''}`}
              onClick={() => setIndex(i)}
              aria-label={`第 ${i + 1} 张`}
              aria-current={i === index ? 'true' : undefined}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default HomeCarousel;

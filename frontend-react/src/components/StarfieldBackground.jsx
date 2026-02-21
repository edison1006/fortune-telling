import { useMemo } from 'react';

const STAR_COUNT = 120;
const TWINKLE_DURATION = 4;

function StarfieldBackground() {
  const stars = useMemo(() => {
    return Array.from({ length: STAR_COUNT }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * TWINKLE_DURATION,
      duration: TWINKLE_DURATION + Math.random() * 2,
      opacity: 0.3 + Math.random() * 0.7,
    }));
  }, []);

  return (
    <div className="starfield" aria-hidden="true">
      <div className="starfield-vignette" />
      <div className="starfield-rays starfield-rays--1" />
      <div className="starfield-rays starfield-rays--2" />
      {stars.map(({ id, left, top, size, delay, duration, opacity }) => (
        <div
          key={id}
          className="starfield-star"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            width: size,
            height: size,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
            opacity,
          }}
        />
      ))}
    </div>
  );
}

export default StarfieldBackground;

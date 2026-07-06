'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SITE } from '@/lib/site';

const HeroSlider = ({ slides }) => {
  const [index, setIndex] = useState(0);
  const hasMultiple = slides.length > 1;

  useEffect(() => {
    if (!hasMultiple) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(id);
  }, [hasMultiple, slides.length]);

  const waLink = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    'Hello Rashi Worldwide, I have a Product inquiry.'
  )}`;

  return (
    <header className="hero-banner">
      <div className="hero-slides">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`hero-slide ${i === index ? 'is-active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        ))}
        <div className="hero-scrim" />
      </div>

      <div className="hero-overlay">
        <h1 className="hero-heading">Premium Apparel, Exported Worldwide</h1>
        <p className="hero-subtext">
          Fashion is a universal language. We weave comfort, culture, and timeless
          luxury into garments that speak to the world.
        </p>
        <div className="hero-actions">
          <Link href="/catalog" className="btn btn-primary hero-btn">Browse Catalog</Link>
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn hero-btn hero-btn-ghost">
            Chat on WhatsApp
          </a>
        </div>
      </div>

      {hasMultiple && (
        <div className="hero-dots" role="tablist" aria-label="Hero slides">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              className={`hero-dot ${i === index ? 'is-active' : ''}`}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-selected={i === index}
              role="tab"
            />
          ))}
        </div>
      )}
    </header>
  );
};

export default HeroSlider;

'use client';

import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { SITE } from '@/lib/site';
import '@/styles/storefront.css';

const headingOptions = [
  "New Arrivals: Global Drop '26",
  'Just In: Minimalist Aesthetics',
  'Fresh Collection: Borderless Style',
  'Now Live: Premium Essentials',
];

const Storefront = ({ initialStocks = [] }) => {
  const stocks = initialStocks;

  const [currentHeading, setCurrentHeading] = useState(headingOptions[0]);
  const [fadeState, setFadeState] = useState('fade-in');
  const [viewMode, setViewMode] = useState('storefront');
  const [activeStockIndex, setActiveStockIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    if (viewMode !== 'storefront') return;
    const interval = setInterval(() => {
      setFadeState('fade-out');
      setTimeout(() => {
        setCurrentHeading((prev) => {
          const i = headingOptions.indexOf(prev);
          return headingOptions[(i + 1) % headingOptions.length];
        });
        setFadeState('fade-in');
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, [viewMode]);

  const nextStock = () => {
    if (stocks.length === 0) return;
    setActiveStockIndex((prev) => (prev + 1) % stocks.length);
  };
  const prevStock = () => {
    if (stocks.length === 0) return;
    setActiveStockIndex((prev) => (prev - 1 + stocks.length) % stocks.length);
  };

  const currentStockLook = stocks[activeStockIndex];
  const displayedStocks = stocks.slice(0, visibleCount);

  if (stocks.length === 0) {
    return (
      <section className="catalog-section empty-state" style={{ margin: '2rem auto 4rem' }}>
        <h2>New stock lots are being added</h2>
        <p>Our catalog updates regularly — message us directly and we&apos;ll confirm current availability for your requirement.</p>
        <a
          href={`https://wa.me/${SITE.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          Enquire on WhatsApp
        </a>
      </section>
    );
  }

  return (
    <div className="storefront-container">
      {viewMode === 'storefront' ? (
        <div className="view-fade-wrapper">
          <section className="catalog-section">
            <div className="section-header">
              <h2 className={`dynamic-h1 ${fadeState}`}>{currentHeading}</h2>
              {/* <button
                className="btn btn-outline lookbook-trigger"
                onClick={() => { setViewMode('lookbook'); setActiveStockIndex(0); }}
              >
                View Lookbook
              </button> */}
            </div>

            <div className="products-grid">
              {displayedStocks.map((item, index) => (
                <ProductCard key={item.id} item={item} index={index} />
              ))}
            </div>

            {stocks.length > visibleCount && (
              <div className="load-more-container">
                <button
                  className="btn btn-outline load-more-btn"
                  onClick={() => setVisibleCount(stocks.length)}
                >
                  Load {stocks.length - visibleCount} more items
                </button>
              </div>
            )}
          </section>
        </div>
      ) : (
        <div className="fullscreen-lookbook-view">
          <div className="lookbook-top-bar">
            <button className="minimal-close-btn" onClick={() => setViewMode('storefront')}>
              ✕ Close
            </button>
            <div className="lookbook-pagination">
              0{activeStockIndex + 1} <span>/ 0{stocks.length}</span>
            </div>
          </div>

          {currentStockLook ? (
            <div className="lookbook-magazine-stage" key={activeStockIndex}>
              <div className="magazine-media-pane">
                <img src={currentStockLook.image} alt={currentStockLook.title} className="magazine-img" />
              </div>
              <div className="magazine-content-pane">
                <div className="content-inner-wrapper">
                  <span className="textile-spec-badge">{currentStockLook.fabric || 'Textile Specification'}</span>
                  <h1 className="magazine-cloth-title">{currentStockLook.title}</h1>
                  <p className="magazine-cloth-desc">{currentStockLook.description}</p>

                  <div className="technical-details" style={{ marginTop: '1.5rem', fontSize: '0.9rem', lineHeight: '1.6rem' }}>
                    {currentStockLook.brand && <div><strong>Brand:</strong> {currentStockLook.brand}</div>}
                    {currentStockLook.colors && <div><strong>Colors:</strong> {currentStockLook.colors}</div>}
                    {currentStockLook.sizes && <div><strong>Sizes:</strong> {currentStockLook.sizes}</div>}
                    {currentStockLook.moq && <div><strong>Minimum Order (MOQ):</strong> {currentStockLook.moq}</div>}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ color: '#141414', textAlign: 'center', marginTop: '20vh' }}>No active stock records found.</div>
          )}

          <button className="nav-arrow-control prev-arrow" onClick={prevStock} aria-label="Previous look"> ‹ </button>
          <button className="nav-arrow-control next-arrow" onClick={nextStock} aria-label="Next look"> › </button>
        </div>
      )}
    </div>
  );
};

export default Storefront;

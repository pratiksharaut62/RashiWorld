'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { SITE } from '@/lib/site';
import '@/styles/stock-details.css';

const isVideoFile = (url) => {
  if (!url) return false;
  const base = url.split('?')[0];
  return (
    base.endsWith('.mp4') ||
    base.endsWith('.webm') ||
    base.endsWith('.ogg') ||
    url.includes('/video') ||
    url.includes('video_')
  );
};

const StockDetails = ({ stock }) => {
  const selectedStock = stock;

  const [activeMedia, setActiveMedia] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const videoRef = useRef(null);

  const mediaGallery =
    selectedStock?.images ||
    (selectedStock?.image ? [selectedStock.image] : ['/assets/placeholder.jpeg']);

  useEffect(() => {
    if (mediaGallery.length > 0 && !activeMedia) {
      setActiveMedia(mediaGallery[0]);
    }
  }, [mediaGallery, activeMedia]);

  useEffect(() => {
    setVideoError(false);
  }, [activeMedia]);

  const isVideo = isVideoFile(activeMedia);

  useEffect(() => {
    let isCurrentContext = true;
    if (isVideo && videoRef.current && !videoError) {
      videoRef.current.muted = isMuted;
      videoRef.current.load();
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          if (error.name === 'AbortError' || error.name === 'NotAllowedError') return;
          if (isCurrentContext) setVideoError(true);
        });
      }
    }
    return () => { isCurrentContext = false; };
  }, [isVideo, isMuted, activeMedia, videoError]);

  const nextMedia = () => {
    const i = mediaGallery.indexOf(activeMedia);
    setActiveMedia(mediaGallery[(i + 1) % mediaGallery.length]);
  };
  const prevMedia = () => {
    const i = mediaGallery.indexOf(activeMedia);
    setActiveMedia(mediaGallery[(i - 1 + mediaGallery.length) % mediaGallery.length]);
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  const isExpired = selectedStock?.expiry ? new Date(selectedStock.expiry) < new Date() : false;

  const encodedMessage = encodeURIComponent(
    `Hi Rashi Worldwide, I would like to request a bulk lot quote for: ${selectedStock.title || 'Premium Apparel Lot'} (ID: ${selectedStock.id || 'N/A'}).`
  );
  const whatsappLink = `https://wa.me/${SITE.whatsapp}?text=${encodedMessage}`;

  return (
    <div className="stock-detail-page compact-container">
      <div className="breadcrumb-nav">
        <Link href="/catalog" className="back-link">
          <span className="arrow">←</span> Back to Catalog
        </Link>
      </div>

      <div className="stock-main-layout standard-split">
        <section className="media-showcase layout-locked">
          <div className="main-display-box premium-shadow">
            {mediaGallery.length > 1 && (
              <>
                <button className="gallery-nav-btn prev-btn" onClick={prevMedia} aria-label="Previous image">‹</button>
                <button className="gallery-nav-btn next-btn" onClick={nextMedia} aria-label="Next image">›</button>
              </>
            )}

            <button className="zoom-trigger-btn" onClick={() => setIsLightboxOpen(true)} aria-label="Zoom media view">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="camera-svg-icon" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="11" y1="8" x2="11" y2="14" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </button>

            {!isVideo ? (
              <div className="image-viewer-container" onClick={() => setIsLightboxOpen(true)} style={{ cursor: 'pointer' }}>
                <img src={activeMedia} alt={selectedStock.title} className="active-media image-fade" key={activeMedia} />
              </div>
            ) : (
              <div className="video-player-wrapper" style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
                {videoError ? (
                  <div className="video-error-fallback" style={{ padding: '20px', textAlign: 'center', color: '#ff6b6b' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⚠️</div>
                    <h4>Video Loading Failed</h4>
                    <p style={{ fontSize: '0.85rem', color: '#aaa', marginTop: '5px' }}>The file URL is broken or format is unsupported.</p>
                  </div>
                ) : (
                  <>
                    <video ref={videoRef} autoPlay muted={isMuted} loop playsInline className="active-media" key={activeMedia} onClick={() => setIsLightboxOpen(true)} style={{ cursor: 'pointer' }}>
                      <source src={activeMedia} />
                      Your browser does not support HTML5 video playback.
                    </video>
                    <button
                      type="button"
                      className="sound-toggle-btn"
                      onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                    >
                      {isMuted ? '🔈 Unmute Video' : '🔊 Audio On'}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {mediaGallery.length > 1 && (
            <div className="media-gallery-grid">
              {mediaGallery.map((mediaUrl, index) => {
                const isThumbVideo = isVideoFile(mediaUrl);
                return (
                  <div
                    key={index}
                    className={`gallery-thumb-wrapper ${activeMedia === mediaUrl ? 'active-thumb' : ''}`}
                    onClick={() => setActiveMedia(mediaUrl)}
                  >
                    {isThumbVideo ? (
                      <div className="video-thumb-placeholder">▶ Video</div>
                    ) : (
                      <img src={mediaUrl} alt={`View ${index + 1}`} className="gallery-thumb-img" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="info-specification structured-panel">
          <div className="product-header">
            <div className="status-tags">
              <span className="export-badge premium-gold">✨ Verified Export Lot</span>
              {selectedStock.brand && <span className="brand-badge">{selectedStock.brand}</span>}
            </div>
            <h1 className="stock-main-title">{selectedStock.title}</h1>
          </div>

          <div className="description-wrapper refined-narrative-box">
            <h3>Commercial Description</h3>
            <p className="line-break-text">
              {selectedStock.description || 'No commercial narrative provided for this item lot.'}
            </p>
          </div>

          <div className="specs-container">
            <h3>Lot Specifications</h3>
            <div className="specs-grid">
              {selectedStock.id && (
                <div className="spec-item"><span className="spec-label">Lot ID</span><span className="spec-value">{selectedStock.id}</span></div>
              )}
              {selectedStock.brand && (
                <div className="spec-item"><span className="spec-label">Brand</span><span className="spec-value">{selectedStock.brand}</span></div>
              )}
              {selectedStock.fabric && (
                <div className="spec-item"><span className="spec-label">Fabric Composition</span><span className="spec-value">{selectedStock.fabric}</span></div>
              )}
              {selectedStock.moq && (
                <div className="spec-item"><span className="spec-label">Minimum Order Qty (MOQ)</span><span className="spec-value highlight-value">{selectedStock.moq}</span></div>
              )}
              {selectedStock.sizes && (
                <div className="spec-item"><span className="spec-label">Available Sizes</span><span className="spec-value">{selectedStock.sizes}</span></div>
              )}
              {selectedStock.colors && (
                <div className="spec-item"><span className="spec-label">Assorted Colors</span><span className="spec-value">{selectedStock.colors}</span></div>
              )}
              {selectedStock.expiry && (
                <div className="spec-item">
                  <span className="spec-label">Deal Expiry</span>
                  <span className={`spec-value expiry-text ${isExpired ? 'expired-red' : ''}`}>
                    {formatDate(selectedStock.expiry)} {isExpired && '(Expired)'}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="action-footer-panel">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="clean-text-action-btn">
              Submit Bulk Inquiry &amp; Get Price Quote
            </a>
            <p className="commercial-notice">⚡ Freight calculations, packing lists, and custom shipping details compiled instantly upon allocation lookup.</p>
          </div>
        </section>
      </div>

      {isLightboxOpen && (
        <div className="lightbox-modal-overlay" onClick={() => setIsLightboxOpen(false)}>
          <button className="lightbox-close-btn" onClick={() => setIsLightboxOpen(false)}>✕</button>
          <div className="lightbox-content-holder" onClick={(e) => e.stopPropagation()}>
            {!isVideo ? (
              <img src={activeMedia} alt={selectedStock.title} className="lightbox-zoomed-media" />
            ) : (
              <video src={activeMedia} controls autoPlay className="lightbox-zoomed-media" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StockDetails;

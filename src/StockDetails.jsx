import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import './StockDetails.css';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL; 
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY; 
const supabase = createClient(supabaseUrl, supabaseAnonKey); 

const StockDetails = () => {
    const { slug } = useParams(); 
    const location = useLocation();

    const [selectedStock, setSelectedStock] = useState(location.state || null);
    const [fetching, setFetching] = useState(!location.state);
    const [errorMsg, setErrorMsg] = useState(null);

    const [activeMedia, setActiveMedia] = useState(null);
    const [isMuted, setIsMuted] = useState(true);
    const [videoError, setVideoError] = useState(false); 
    const videoRef = useRef(null);

    // New State for full-screen zoom preview modal
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const isVideoFile = (url) => {
        if (!url) return false;
        return (
            url.split('?')[0].endsWith('.mp4') || 
            url.split('?')[0].endsWith('.webm') || 
            url.split('?')[0].endsWith('.ogg') ||
            url.includes('/video') ||
            url.includes('video_')
        );
    };

    useEffect(() => {
        if (!selectedStock && slug) {
            async function fetchSingleStock() {
                try {
                    const { data, error } = await supabase
                        .from('stocks')
                        .select('id, slug, title, brand, category, description, colors, sizes, moq, fabric, photos, video_url, status, expiry_date')
                        .eq('slug', slug)
                        .single();

                    if (error) throw error;

                    if (data) {
                        let rawPhotos = [];
                        if (Array.isArray(data.photos)) {
                            rawPhotos = data.photos;
                        } else if (typeof data.photos === 'string') {
                            try {
                                rawPhotos = JSON.parse(data.photos);
                            } catch {
                                rawPhotos = data.photos ? [data.photos] : [];
                            }
                        }

                        const resolvedImages = rawPhotos.map((photo) => {
                            if (!photo) return null;
                            if (photo.startsWith('http')) {
                                return photo;
                            } else {
                                const { data: storageData } = supabase.storage 
                                    .from('images') 
                                    .getPublicUrl(photo); 
                                return storageData.publicUrl; 
                            }
                        }).filter(Boolean);

                        if (data.video_url) {
                            resolvedImages.push(data.video_url);
                        }

                        setSelectedStock({
                            id: data.id, 
                            slug: data.slug,
                            title: data.title, 
                            brand: data.brand,
                            category: data.category,
                            description: data.description,
                            colors: data.colors,
                            sizes: data.sizes,
                            moq: data.moq,
                            fabric: data.fabric,
                            videoUrl: data.video_url,
                            status: data.status,
                            expiry: data.expiry_date,
                            image: resolvedImages[0] || "/assets/placeholder.jpeg",
                            images: resolvedImages.length > 0 ? resolvedImages : ["/assets/placeholder.jpeg"]
                        });
                    } else {
                        setErrorMsg("Product record could not be found.");
                    }
                } catch (err) {
                    console.error("Error loading direct product link:", err.message);
                    setErrorMsg("Unable to retrieve item information safely.");
                } finally {
                    setFetching(false);
                }
            }
            fetchSingleStock();
        }
    }, [slug, selectedStock]);

    const mediaGallery = selectedStock?.images || 
        (selectedStock?.image ? [selectedStock.image] : ["/assets/placeholder.jpeg"]);

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
                playPromise.catch(error => {
                    if (error.name === 'AbortError') {
                        console.info("Play request safely set aside during DOM switch.");
                        return;
                    } 
                    if (error.name === 'NotAllowedError') {
                        console.warn("Browser blocked autoplay. Playback initialization delayed.");
                        return;
                    }
                    console.warn("Autoplay context restriction caught: ", error);
                    if (isCurrentContext) {
                        setVideoError(true);
                    }
                });
            }
        }

        return () => {
            isCurrentContext = false; 
        };
    }, [isVideo, isMuted, activeMedia, videoError]);

    const nextMedia = () => {
        const currentIndex = mediaGallery.indexOf(activeMedia);
        const nextIndex = (currentIndex + 1) % mediaGallery.length;
        setActiveMedia(mediaGallery[nextIndex]);
    };

    const prevMedia = () => {
        const currentIndex = mediaGallery.indexOf(activeMedia);
        const prevIndex = (currentIndex - 1 + mediaGallery.length) % mediaGallery.length;
        setActiveMedia(mediaGallery[prevIndex]);
    };

    const formatDate = (dateString) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    const isExpired = selectedStock?.expiry ? new Date(selectedStock.expiry) < new Date() : false;

    if (fetching) {
        return <div className="stock-detail-page error-state">Syncing Product Specifications...</div>;
    }

    if (errorMsg || !selectedStock) {
        return (
            <div className="stock-detail-page error-state">
                <div className="breadcrumb-nav">
                    <Link to="/" className="back-link">← Back to Collections</Link>
                </div>
                <div className="error-message-box">
                    <h2>{errorMsg || "No Product Selected"}</h2>
                    <p>Please return to our primary layout catalog to select an authorized item.</p>
                </div>
            </div>
        );
    }

    const whatsappBaseUrl = "https://wa.me/917709008441";
    const encodedMessage = encodeURIComponent(
        `Hi Rashi Worldwide, I would like to request a bulk lot quote for: ${selectedStock.title || "Premium Apparel Lot"} (ID: ${selectedStock.id || 'N/A'}).`
    );
    const whatsappLink = `${whatsappBaseUrl}?text=${encodedMessage}`;

    return (
        <div className="stock-detail-page compact-container">
            <div className="breadcrumb-nav">
                <Link to="/" className="back-link">
                    <span className="arrow">←</span> Back to Global Collections
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

                        {/* Floating Zoom Camera Action Trigger Button */}
                        <button 
                            className="zoom-trigger-btn" 
                            onClick={() => setIsLightboxOpen(true)}
                            aria-label="Zoom media view"
                        >
                            📷
                        </button>

                        {!isVideo ? (
                            <div className="image-viewer-container" onClick={() => setIsLightboxOpen(true)} style={{cursor: 'pointer'}}>
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
                                        <video
                                            ref={videoRef}
                                            autoPlay
                                            muted={isMuted}
                                            loop
                                            playsInline
                                            className="active-media"
                                            key={activeMedia}
                                            onClick={() => setIsLightboxOpen(true)}
                                            style={{cursor: 'pointer'}}
                                        >
                                            <source src={activeMedia} />
                                            Your browser does not support HTML5 video playback.
                                        </video>
                                        <button
                                            type="button"
                                            className="sound-toggle-btn"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Avoid triggering lightbox overlay toggle
                                                setIsMuted(!isMuted);
                                            }}
                                            style={{
                                                position: 'absolute',
                                                bottom: '15px',
                                                right: '15px',
                                                zIndex: 12,
                                                background: 'rgba(0,0,0,0.7)',
                                                color: '#fff',
                                                border: 'none',
                                                padding: '6px 12px',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            {isMuted ? "🔈 Unmute Video" : "🔊 Audio On"}
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
                            {selectedStock.description || "No commercial narrative provided for this item lot."}
                        </p>
                    </div>

                    <div className="specs-container">
                        <h3>Lot Specifications</h3>
                        <div className="specs-grid">
                            {selectedStock.id && (
                                <div className="spec-item">
                                    <span className="spec-label">Lot ID</span>
                                    <span className="spec-value">{selectedStock.id}</span>
                                </div>
                            )}
                            {selectedStock.brand && (
                                <div className="spec-item">
                                    <span className="spec-label">Brand</span>
                                    <span className="spec-value">{selectedStock.brand}</span>
                                </div>
                            )}
                            {selectedStock.fabric && (
                                <div className="spec-item">
                                    <span className="spec-label">Fabric Composition</span>
                                    <span className="spec-value">{selectedStock.fabric}</span>
                                </div>
                            )}
                            {selectedStock.moq && (
                                <div className="spec-item">
                                    <span className="spec-label">Minimum Order Qty (MOQ)</span>
                                    <span className="spec-value highlight-value">{selectedStock.moq}</span>
                                </div>
                            )}
                            {selectedStock.sizes && (
                                <div className="spec-item">
                                    <span className="spec-label">Available Sizes</span>
                                    <span className="spec-value">{selectedStock.sizes}</span>
                                </div>
                            )}
                            {selectedStock.colors && (
                                <div className="spec-item">
                                    <span className="spec-label">Assorted Colors</span>
                                    <span className="spec-value">{selectedStock.colors}</span>
                                </div>
                            )}
                            {selectedStock.expiry && (
                                <div className="spec-item">
                                    <span className="spec-label">Deal Expiry</span>
                                    <span className="spec-value expiry-text ${isExpired ? 'expired-red' : ''}">
                                        {formatDate(selectedStock.expiry)} {isExpired && "(Expired)"}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="action-footer-panel">
                        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="clean-text-action-btn">
                            Submit Bulk Inquiry & Get Price Quote
                        </a>
                        <p className="commercial-notice">⚡ Freight calculations, packing lists, and custom shipping details compiled instantly upon allocation lookup.</p>
                    </div>
                </section>
            </div>

            {/* High Resolution Immersive Lightbox Modal Container */}
            {isLightboxOpen && (
                <div className="lightbox-modal-overlay" onClick={() => setIsLightboxOpen(false)}>
                    <button className="lightbox-close-btn" onClick={() => setIsLightboxOpen(false)}>✕</button>
                    <div className="lightbox-content-holder" onClick={(e) => e.stopPropagation()}>
                        {!isVideo ? (
                            <img src={activeMedia} alt={selectedStock.title} className="lightbox-zoomed-media" />
                        ) : (
                            <video 
                                src={activeMedia} 
                                controls 
                                autoPlay 
                                className="lightbox-zoomed-media"
                            />
                        )}

                        {/* Floating Zoom Camera Action Trigger Button with crisp SVG icon */}
<button 
    className="zoom-trigger-btn" 
    onClick={() => setIsLightboxOpen(true)}
    aria-label="Zoom media view"
>
    <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="camera-svg-icon"
    >
        <path d="M14.5 4h-5L8 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-4l-1.5-3z" />
        <circle cx="12" cy="13" r="3" />
        <circle cx="18.5" cy="9.5" r="0.5" fill="currentColor" />
    </svg>
</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StockDetails;
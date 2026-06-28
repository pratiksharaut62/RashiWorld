import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './StockDetails.css';

const StockDetails = () => {
    
    const stockData = {
        title: "Rashi Worldwide - Premium Clothing Exports",
        brand: "Puma, Nike, Lacoste, Rare Rabbit, U.S.Polo ASSN, Hackett, Under Armour, Adidas, Hermès, Custom",
        category: "T-shirt, Polo, Jacket, Track Pants, Cargo, Shorts, Hoodie, Other",
        fabric: "Cotton Denim, T400 Denim, Rayon Fabric, Interlock Fabric, Cotton T-Shirt, Premium T400 Stretch Fabric with Heavy Zip",
        moq: "50 Sets per colour",
        colours: "Multiple Colors Available",
        sizeRange: "S, M, L, XL, XXL",
        description: "A well-structured product catalog showcasing apparel categories, fabric details, size ranges, color options, and stock availability, allowing global buyers to efficiently browse collections and submit inquiries for bulk orders.",
        // FIXED: Converted all media locations to clean, absolute public asset routes
        media: [
            { id: 1, type: 'image', url: "/assets/stock5.jpeg" },
            { id: 2, type: 'image', url: "/assets/stock6.jpeg" },
            { id: 3, type: 'image', url: "/assets/stock2.jpeg" },
            { id: 4, type: 'video', url: "/assets/sampleVideo.mp4" }
        ]
    };

    const [activeMediaIndex, setActiveMediaIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const currentMedia = stockData.media[activeMediaIndex];
    const videoRef = useRef(null);

    useEffect(() => {
        if (currentMedia.type === 'video' && videoRef.current) {
            videoRef.current.muted = isMuted;

            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn("Playback prevented or interrupted: ", error);
                });
            }
        }
    }, [activeMediaIndex, currentMedia.type, isMuted]);

    // Formulate the WhatsApp API URL safely
    const whatsappBaseUrl = "https://wa.me/917709008441";
    const encodedMessage = encodeURIComponent(
        `Hi Rashi Worldwide, I'm interested in [${stockData.title}]. Please share more details.`
    );
    const whatsappLink = `${whatsappBaseUrl}?text=${encodedMessage}`;

    return (
        <div className="stock-detail-page">
            {/* Top Navigation Row */}
            <div className="breadcrumb-nav">
                <Link to="/" className="back-link">
                    <span className="arrow">←</span> Back to All Stock
                </Link>
            </div>

            <div className="stock-main-layout">
                {/* LEFT SIDE: Media Segment */}
                <section className="media-showcase">
                    <div className="main-display-box">
                        {currentMedia.type === 'image' ? (
                            <img
                                src={currentMedia.url}
                                alt={`View of ${stockData.title}`}
                                className="active-media image-clickable"
                                onClick={() => setIsLightboxOpen(true)}
                            />
                        ) : (
                            <div className="video-player-wrapper">
                                <video
                                    key={currentMedia.url}
                                    ref={videoRef}
                                    autoPlay
                                    muted={isMuted}
                                    loop
                                    playsInline
                                    className="active-media"
                                >
                                    <source src={currentMedia.url} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                                <button
                                    className="sound-toggle-btn"
                                    onClick={() => setIsMuted(!isMuted)}
                                >
                                    {isMuted ? "🔈 Tap to Unmute" : "🔊 Audio On"}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Thumbnails Carousel Track */}
                    <div className="thumbnails-track">
                        {stockData.media.map((item, index) => (
                            <button
                                key={item.id}
                                className={`thumb-card ${index === activeMediaIndex ? 'is-active' : ''}`}
                                onClick={() => setActiveMediaIndex(index)}
                            >
                                {item.type === 'image' ? (
                                    <img src={item.url} alt="Thumbnail preview" />
                                ) : (
                                    <div className="video-thumb-placeholder">
                                        <span className="play-icon">▶</span>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </section>

                {/* RIGHT SIDE: Info Segment */}
                <section className="info-specification">
                    <h1 className="stock-main-title">{stockData.title}</h1>

                    {/* Specifications Data Matrix */}
                    <table className="specs-table">
                        <tbody>
                            <tr>
                                <td className="spec-label">Brand</td>
                                <td className="spec-val">{stockData.brand}</td>
                            </tr>
                            <tr>
                                <td className="spec-label">Category</td>
                                <td className="spec-val">{stockData.category}</td>
                            </tr>
                            <tr>
                                <td className="spec-label">Fabric Material</td>
                                <td className="spec-val">{stockData.fabric}</td>
                            </tr>
                            <tr>
                                <td className="spec-label">Min. Order Qty (MOQ)</td>
                                <td className="spec-val highlight-moq">{stockData.moq}</td>
                            </tr>
                            <tr>
                                <td className="spec-label">Colours Available</td>
                                <td className="spec-val">{stockData.colours}</td>
                            </tr>
                            <tr>
                                <td className="spec-label">Size Ranges</td>
                                <td className="spec-val">{stockData.sizeRange}</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Description Paragraph Block */}
                    <div className="description-wrapper">
                        <h3>Product Architecture</h3>
                        <p className="line-break-text">{stockData.description}</p>
                    </div>

                    {/* Single Direct WhatsApp Call To Action */}
                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inquire-wa-action-btn"
                    >
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/733/733585.png"
                            alt="WhatsApp Icon"
                            className="wa-btn-icon"
                        ></img>
                        Inquire on WhatsApp
                    </a>
                </section>
            </div>

            {/* DESKTOP DESIRED LIGHTBOX VIEW */}
            {isLightboxOpen && currentMedia.type === 'image' && (
                <div className="lightbox-portal" onClick={() => setIsLightboxOpen(false)}>
                    <div className="lightbox-stage" onClick={(e) => e.stopPropagation()}>
                        <button className="close-portal-btn" onClick={() => setIsLightboxOpen(false)}>×</button>
                        <img src={currentMedia.url} alt="Expanded visual perspective" className="lightbox-img" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default StockDetails;
import React, { useState, useEffect } from 'react';
import './Welcome.css';

const Welcome = () => {
    const headingOptions = [
        "New Arrivals: Global Drop '26",
        "Just In: Minimalist Aesthetics",
        "Fresh Collection: Borderless Style",
        "Now Live: Premium Essentials"
    ];

    const [currentHeading, setCurrentHeading] = useState(headingOptions[0]);
    const [fadeState, setFadeState] = useState('fade-in');
    const [viewMode, setViewMode] = useState('storefront');

    // Manage single active lookbook item slide index
    const [activeLookIndex, setActiveLookIndex] = useState(0);

    useEffect(() => {
        if (viewMode !== 'storefront') return;
        const interval = setInterval(() => {
            setFadeState('fade-out');
            setTimeout(() => {
                setCurrentHeading(prev => {
                    const currentIndex = headingOptions.indexOf(prev);
                    const nextIndex = (currentIndex + 1) % headingOptions.length;
                    return headingOptions[nextIndex];
                });
                setFadeState('fade-in');
            }, 300);
        }, 5000);
        return () => clearInterval(interval);
    }, [viewMode]);

    // FIXED: Changed "src/assets/..." and object variables to static "/assets/..." paths
    const newArrivals = [
        {
            id: 1,
            title: "Classic Pure Linen Formal Shirt",
            tag: "Best Seller",
            image: "/assets/stock8.jpeg"
        },
        {
            id: 2,
            title: "Premium Cotton Classic Regular Shirt",
            tag: "New",
            image: "/assets/stock5.jpeg"
        },
        {
            id: 3,
            title: "Soft Cotton Casual Shirt",
            tag: "Limited",
            image: "/assets/stock12.jpeg"
        },
        {
            id: 4,
            title: "Classic Slim-fit Shirt",
            tag: "Best Seller",
            image: "/assets/stock6.jpeg"
        }
    ];

    // FIXED: Changed all lookbook elements from "src/assets/..." to absolute "/assets/..." paths
    const lookbookItems = [
        {
            title: "U.S. POLO ASSN",
            desc: "Established United States Polo Association in 1890. Official lifestyle and sports-inspired brand. Offers apparel for men, women, and children. Blends timeless style with modern fashion trends.",
            image: "/assets/stock13.jpeg"
        },
        {
            title: "Christian Dior",
            desc: "Premium luxury 100% genuine Textured Knit Fabric. Uses high-quality materials such as silk, wool, cashmere, cotton, linen, velvet fabric. Exceptional comfort and lasting Quality.",
            image: "/assets/stock2.jpeg"
        },
        {
            title: "Christian Dior",
            desc: "Excellent Color retention and shape stability after proper care. Focus on elegant drape, refined texture and luxurious feel.",
            image: "/assets/stock9.jpeg"
        },
        {
            title: "Nike Jordan t-shirt",
            desc: "Modern Athletic style with clean stitching and a premium finish. Export soft quality and durable fabric. Ethically sourced fibers that soften naturally over time with heavy industrial washes.",
            image: "/assets/stock7.jpeg"
        },
        {
            title: "Hackett London Cotton Polo shirt",
            desc: "Classic British-inspired design with elegant checks, stripes, or solid colors. Suitable for business, smart casual and everyday wear.",
            image: "/assets/stock4.jpeg"
        },
        {
            title: "Lacoste Cotton Polo shirt",
            desc: "450 GSM unbrushed loopback cotton providing an armor-like structural drop. Tailored dropped shoulders paired with clean seamless side hems.",
            image: "/assets/stock3.jpeg"
        },
        {
            title: "Rare Rabbit",
            desc: "Premium Quality Turkish Linen Soft Hand Feel, Wash Soften Enzyme, Style Stiff Canvas Full Sleeves, 14 Colors Available, Size Available M,L,XL,XXL and Brand Packing Single Original Poly, 100% Good Quality.",
            image: "/assets/stock10.jpeg"
        },
        {
            title: "Nike Jordan Cotton t-shirt",
            desc: "Crisp, cool luxury poplin fabric showcasing dropped architectural line silhouettes. Features extra-long plackets and clean premium collar stays.",
            image: "/assets/stock11.jpeg"
        }
    ];

    const nextLook = () => {
        setActiveLookIndex((prev) => (prev + 1) % lookbookItems.length);
    };

    const prevLook = () => {
        setActiveLookIndex((prev) => (prev - 1 + lookbookItems.length) % lookbookItems.length);
    };

    const currentLook = lookbookItems[activeLookIndex];

    return (
        <div className="storefront-container">
            {viewMode === 'storefront' ? (
                /* --- ULTRA CLEAN CATALOG VIEW --- */
                <div className="view-fade-wrapper">
                    <header className="hero-banner">
                        <div className="hero-overlay">
                            <span className="hero-subtitle">GLOBAL COUTURE</span>
                            <blockquote className="brand-quote">
                                "Fashion is a universal language. We weave comfort, culture, and timeless luxury into garments that speak to the world."
                            </blockquote>
                            <button className="hero-btn" onClick={() => { setViewMode('lookbook'); setActiveLookIndex(0); }}>
                                View Editorial Lookbook
                            </button>
                        </div>
                    </header>

                    <section className="catalog-section">
                        <div className="section-header">
                            <h1 className={`dynamic-h1 ${fadeState}`}>{currentHeading}</h1>
                        </div>

                        <div className="products-grid">
                            {newArrivals.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="product-card"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                    onClick={() => { setViewMode('lookbook'); setActiveLookIndex(index); }}
                                >
                                    <div className="image-wrapper">
                                        <span className="product-badge">{item.tag}</span>
                                        <img src={item.image} alt={item.title} className="product-img" />
                                    </div>
                                    <div className="product-details">
                                        <h3 className="product-title">{item.title}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            ) : (
                /* --- FULL SCREEN MAGAZINE-STYLE IMMERSIVE LOOKBOOK --- */
                <div className="fullscreen-lookbook-view">
                    {/* Header Action Row */}
                    <div className="lookbook-top-bar">
                        <button className="minimal-close-btn" onClick={() => setViewMode('storefront')}>
                            ✕ Close Lookbook
                        </button>
                        <div className="lookbook-pagination">
                            0{activeLookIndex + 1} <span>/ 0{lookbookItems.length}</span>
                        </div>
                    </div>

                    {/* Main Fullscreen Stage Frame */}
                    <div className="lookbook-magazine-stage" key={activeLookIndex}>
                        <div className="magazine-media-pane">
                            <img src={currentLook.image} alt={currentLook.title} className="magazine-img" />
                        </div>

                        <div className="magazine-content-pane">
                            <div className="content-inner-wrapper">
                                <span className="textile-spec-badge">TEXTILE SPECIFICATION</span>
                                <h1 className="magazine-cloth-title">{currentLook.title}</h1>
                                <p className="magazine-cloth-desc">{currentLook.desc}</p>
                            </div>
                        </div>
                    </div>

                    {/* Left & Right Absolute Navigation Controls */}
                    <button className="nav-arrow-control prev-arrow" onClick={prevLook} aria-label="Previous look">
                        ‹
                    </button>
                    <button className="nav-arrow-control next-arrow" onClick={nextLook} aria-label="Next look">
                        ›
                    </button>
                </div>
            )}
        </div>
    );
};

export default Welcome;
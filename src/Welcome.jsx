import React, { useState, useEffect } from 'react'; 
import { useNavigate } from "react-router-dom"; 
import { createClient } from '@supabase/supabase-js'; 
import './Welcome.css'; 

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL; 
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY; 
const supabase = createClient(supabaseUrl, supabaseAnonKey); 

const Welcome = () => { 
  const navigate = useNavigate(); 
  
  const headingOptions = [ 
    "New Arrivals: Global Drop '26", 
    "Just In: Minimalist Aesthetics", 
    "Fresh Collection: Borderless Style", 
    "Now Live: Premium Essentials" 
  ]; 
  
  const [currentHeading, setCurrentHeading] = useState(headingOptions[0]); 
  const [fadeState, setFadeState] = useState('fade-in'); 
  const [viewMode, setViewMode] = useState('storefront'); 
  const [activeStockIndex, setActiveStockIndex] = useState(0); 
  const [stocks, setStocks] = useState([]); 
  const [loading, setLoading] = useState(true); 
  
  // New state to manage the limit of visible items
  const [visibleCount, setVisibleCount] = useState(6); 

  useEffect(() => { 
    async function fetchStorefrontData() { 
      try { 
        const { data: stocksData, error: stocksError } = await supabase 
          .from('stocks') 
          .select('id, slug, title, brand, category, description, colors, sizes, moq, fabric, photos, video_url, status, expiry_date'); 
        
        if (stocksError) throw stocksError; 

        if (stocksData) {
          const mappedStocks = stocksData.map(item => {
            let finalImageUrl = '';
            let rawPhotos = [];

            if (Array.isArray(item.photos)) {
              rawPhotos = item.photos;
            } else if (typeof item.photos === 'string') {
              try {
                rawPhotos = JSON.parse(item.photos);
              } catch {
                rawPhotos = item.photos ? [item.photos] : [];
              }
            }

            const resolvedImages = rawPhotos.map((photo) => {
              if (!photo) return null;
              if (photo.startsWith('http')) {
                return photo;
              } else {
                const { data } = supabase.storage 
                  .from('images') 
                  .getPublicUrl(photo); 
                return data.publicUrl; 
              }
            }).filter(Boolean);

            if (item.video_url) {
              resolvedImages.push(item.video_url);
            }

            finalImageUrl = resolvedImages[0] || "/assets/placeholder.jpeg";

            return { 
              id: item.id, 
              slug: item.slug,
              title: item.title, 
              brand: item.brand,
              category: item.category,
              description: item.description,
              colors: item.colors,
              sizes: item.sizes,
              moq: item.moq,
              fabric: item.fabric,
              videoUrl: item.video_url,
              status: item.status,
              expiry: item.expiry_date,
              image: finalImageUrl,
              images: resolvedImages.length > 0 ? resolvedImages : [finalImageUrl]
            }; 
          }); 

          setStocks(mappedStocks); 
        } 
      } catch (error) { 
        console.error("Database connection error:", error.message); 
      } finally { 
        setLoading(false); 
      } 
    } 

    fetchStorefrontData(); 
  }, []); 

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

  const nextStock = () => { 
    if (stocks.length === 0) return; 
    setActiveStockIndex((prev) => (prev + 1) % stocks.length); 
  }; 

  const prevStock = () => { 
    if (stocks.length === 0) return; 
    setActiveStockIndex((prev) => (prev - 1 + stocks.length) % stocks.length); 
  }; 

  // Helper navigation to use for both full card click or explicit button click
  const handleViewDetails = (item) => {
    navigate(`/stockDetails/${item.slug}`, { 
      state: { 
        id: item.id,
        slug: item.slug,
        image: item.image, 
        images: item.images, 
        title: item.title, 
        brand: item.brand,
        category: item.category,
        description: item.description,
        colors: item.colors,
        sizes: item.sizes,
        moq: item.moq,
        fabric: item.fabric,
        videoUrl: item.videoUrl,
        status: item.status,
        expiry: item.expiry
      }, 
    });
  };

  const currentStockLook = stocks[activeStockIndex]; 

  if (loading) { 
    return <div className="storefront-container" style={{ color: '#fff', padding: '3rem' }}>Syncing with Storefront...</div>; 
  } 

  // Slice the data to show only up to the specified dynamic visibility count
  const displayedStocks = stocks.slice(0, visibleCount);

  return ( 
    <div className="storefront-container"> 
      {viewMode === 'storefront' ? ( 
        <div className="view-fade-wrapper"> 
          <header className="hero-banner"> 
            <div className="hero-overlay"> 
              <span className="hero-subtitle">GLOBAL COUTURE</span> 
              <blockquote className="brand-quote"> 
                "Fashion is a universal language. We weave comfort, culture, and timeless luxury into garments that speak to the world." 
              </blockquote> 
              <button className="hero-btn" onClick={() => { setViewMode('lookbook'); setActiveStockIndex(0); }}> 
                View All New Stocks
              </button> 
            </div> 
          </header> 

          <section className="catalog-section"> 
            <div className="section-header"> 
              <h1 className={`dynamic-h1 ${fadeState}`}>{currentHeading}</h1> 
            </div> 
            
            <div className="products-grid"> 
              {displayedStocks.map((item, index) => ( 
                <div 
                  key={item.id} 
                  className="product-card" 
                  style={{ animationDelay: `${index * 0.05}s` }} 
                  onClick={() => handleViewDetails(item)} 
                > 
                  <div className="image-wrapper"> 
                    <span className="product-badge">{item.brand || item.category || "New"}</span> 
                    {item.image && <img src={item.image} alt={item.title} className="product-img" />} 
                  </div> 
                  <div className="product-details"> 
                    <h3 className="product-title">{item.title}</h3> 
                    {item.moq && <p className="product-moq" style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '0.75rem' }}>MOQ: {item.moq}</p>} 
                    
                    {/* Explicit View Details Button */}
                    <button 
                      className="view-details-btn" 
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents double-triggering card's wrapper onClick
                        handleViewDetails(item);
                      }}
                    >
                      View Details
                    </button>
                  </div> 
                </div> 
              ))} 
            </div> 

            {/* Load More Button Wrapper */}
            {stocks.length > visibleCount && (
              <div className="load-more-container" style={{ textAlign: 'center', marginTop: '3rem' }}>
                <button 
                  className="load-more-btn" 
                  onClick={() => setVisibleCount(stocks.length)}
                >
                  Load More Items ({stocks.length - visibleCount} )
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
                  <span className="textile-spec-badge">{currentStockLook.fabric || 'TEXTILE SPECIFICATION'}</span> 
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
            <div style={{ color: '#fff', textAlign: 'center', marginTop: '20vh' }}>No active stock records found.</div> 
          )} 

          <button className="nav-arrow-control prev-arrow" onClick={prevStock} aria-label="Previous look"> ‹ </button> 
          <button className="nav-arrow-control next-arrow" onClick={nextStock} aria-label="Next look"> › </button> 
        </div> 
      )} 
    </div> 
  ); 
}; 

export default Welcome;
'use client';

import { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import '@/styles/catalog.css';

const CatalogClient = ({ initialStocks = [] }) => {
  const stocks = initialStocks;

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');

  const categories = useMemo(() => {
    const set = new Set(
      stocks.map((s) => s.category).filter(Boolean).map((c) => c.trim())
    );
    return ['All', ...Array.from(set).sort()];
  }, [stocks]);

  const visible = useMemo(() => {
    let list = [...stocks];

    if (category !== 'All') {
      list = list.filter((s) => (s.category || '').trim() === category);
    }

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((s) =>
        [s.title, s.brand, s.category, s.fabric, s.description]
          .filter(Boolean)
          .some((f) => f.toLowerCase().includes(q))
      );
    }

    if (sort === 'title') {
      list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else if (sort === 'newest') {
      list.sort((a, b) => (b.id || 0) - (a.id || 0));
    }

    return list;
  }, [stocks, category, search, sort]);

  return (
    <div className="storefront-container catalog-page">
      <header className="catalog-hero">
        <h1>Catalog</h1>
        <p className="hero-desc">
          Our complete range of verified export lots. Filter, search and request a bulk quote.
        </p>
      </header>

      <div className="catalog-toolbar">
        <div className="catalog-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            placeholder="Search by title, brand or fabric…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search catalog"
          />
        </div>

        <label className="catalog-sort">
          <span>Sort</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Newest first</option>
            <option value="title">Title A–Z</option>
          </select>
        </label>
      </div>

      {categories.length > 1 && (
        <div className="catalog-chips" role="tablist" aria-label="Categories">
          {categories.map((c) => (
            <button
              key={c}
              className={`chip ${category === c ? 'active' : ''}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <section className="catalog-section catalog-results">
        {visible.length === 0 ? (
          <div className="empty-state" style={{ margin: '0 auto' }}>
            <h2>No matching items</h2>
            <p>Try a different search term or category filter.</p>
            <button className="btn btn-outline" onClick={() => { setSearch(''); setCategory('All'); }}>
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <p className="catalog-count">{visible.length} item{visible.length !== 1 ? 's' : ''}</p>
            <div className="products-grid">
              {visible.map((item, i) => (
                <ProductCard key={item.id} item={item} index={i} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default CatalogClient;

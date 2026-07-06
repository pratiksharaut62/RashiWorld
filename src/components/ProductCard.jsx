import Link from 'next/link';

/**
 * Reusable storefront/catalog product card.
 * Links to the product detail page, which fetches full data server-side.
 */
const ProductCard = ({ item, index = 0 }) => {
  return (
    <Link
      href={`/stockDetails/${item.slug}`}
      className="product-card"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="image-wrapper">
        <span className="product-badge">{item.brand || item.category || 'New'}</span>
        {item.image && (
          <img src={item.image} alt={item.title} className="product-img" loading="lazy" />
        )}
      </div>
      <div className="product-details">
        {item.category && <span className="product-cat">{item.category}</span>}
        <h3 className="product-title">{item.title}</h3>
        {item.moq && <p className="product-moq">MOQ: {item.moq}</p>}
        <span className="view-details-btn">
          View Details
          <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
};

export default ProductCard;

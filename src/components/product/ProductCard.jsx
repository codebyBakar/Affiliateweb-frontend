import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import Stars from '../ui/Stars.jsx';
import { useWishlist } from '../../hooks/useData.js';
import { toast } from 'sonner';
import Icon from '../ui/Icon.jsx';

const tagClass = {
  new: 'badge-new',
  trending: 'badge-trending',
  sale: 'badge-sale',
  bestseller: 'badge-bestseller',
};

const cardVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function ProductCard({ product, index = 0 }) {
  const { isWished, toggle } = useWishlist();
  if (!product) return null;

  const tag = product.tags?.[0];
  const tagName = tag?.name?.toLowerCase() || '';
  const wished = isWished(product._id || product.id);

  const handleWish = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product._id || product.id);
  };

  return (
    <m.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '-50px' }}
      variants={cardVariants}
      style={{ transitionDelay: index * 0.06 }}
    >
      <Link to={`/products/${product.slug}`} className="product-card" aria-label={product.name}>
        <div className="product-card__img">
          <img
            src={product.images?.[0] || product.image || '/placeholder.jpg'}
            alt={product.name}
            loading="lazy"
          />
          {tag && (
            <span className={`badge product-card__badge ${tagClass[tagName] || 'badge-new'}`}>
              {tag.name}
            </span>
          )}
          <button
            className="product-card__wish"
            onClick={handleWish}
            aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Icon
              name={wished ? 'heart-fill' : 'heart'}
              size={14}
              stroke={wished ? 'var(--rose)' : 'var(--muted)'}
              fill={wished ? 'var(--rose)' : 'none'}
            />
          </button>
        </div>

        <div className="product-card__body">
          <div className="product-card__cat">
            {product.category?.name || product.category || ''}
          </div>
          <h3 className="product-card__name">{product.name}</h3>
          <div className="product-card__meta">
            <div>
              <span className="product-card__price">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="product-card__price-orig">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            <div className="product-card__rating">
              <Stars rating={product.rating} size={11} />
              <span style={{ marginLeft: 4 }}>
                {product.reviewCount?.toLocaleString() || 0}
              </span>
            </div>
          </div>
          <a
            className="product-card__buy"
            href={product.affiliateLink || '#'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              toast.success(`Redirecting to store page for ${product.name}!`);
            }}
            aria-label={`Buy ${product.name}`}
          >
            {product.affiliatePlatform === 'aliexpress'
              ? 'Buy Now →'
              : product.affiliatePlatform === 'ebay'
                ? 'Buy Now →'
                : 'Buy Now →'}
          </a>
        </div>
      </Link>
    </m.div>
  );
}

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { m } from 'framer-motion';
import Stars from '../components/ui/Stars.jsx';
import Icon from '../components/ui/Icon.jsx';
import ProductCard from '../components/product/ProductCard.jsx';
import { SkeletonProductDetail } from '../components/ui/Skeleton.jsx';
import ImageLightbox from '../components/ui/ImageLightbox.jsx';
import { useProduct } from '../hooks/useData.js';
import { useWishlist } from '../hooks/useData.js';
import { api } from '../utils/api.js';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: product, loading, error } = useProduct(slug);
  const { isWished, toggle } = useWishlist();
  const [activeImg, setActiveImg] = useState(0);
  const [related, setRelated] = useState([]);
  const [openAccordion, setOpenAccordion] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (product?._id) {
      api.getRelatedProducts(product._id).then(setRelated).catch(() => { });
    }
    setActiveImg(0);
  }, [product?._id]);

  if (loading) return (
    <div className="page-content" style={{ minHeight: '100dvh', background: 'var(--canvas)' }}>
      <div className="container" style={{ paddingTop: 36, paddingBottom: 60 }}>
        <SkeletonProductDetail />
      </div>
    </div>
  );
  if (error || !product) return (
    <div className="page-content" style={{ minHeight: '100dvh', background: 'var(--canvas)' }}>
      <div className="container" style={{ textAlign: 'center', padding: '80px 0' }}>
        <div style={{ fontSize: 48, marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
          <Icon name="star" size={48} stroke="var(--clay)" fill="var(--clay)" />
        </div>
        <h2 className="t-h2">Product not found</h2>
        <button className="btn btn-outline btn-md" style={{ marginTop: 20 }} onClick={() => navigate('/shop')}>
          Back to Shop
        </button>
      </div>
    </div>
  );

  const images = product.images?.length ? product.images : ['/placeholder.jpg'];
  const wished = isWished(product._id);
  const platform = product.affiliatePlatform;
  const buyLabel = platform === 'aliexpress' ? 'Buy Now' : platform === 'ebay' ? 'Buy Now' : 'Buy Now';

  const toggleAccordion = (key) => setOpenAccordion(k => k === key ? '' : key);
  const toggleTag = (t) => setSelectedTags(s => s.includes(t) ? s.filter(x => x !== t) : [...s, t]);

  return (
    <div className="page-content">
      <div className="container" style={{ paddingTop: 36, paddingBottom: 60 }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 36, flexWrap: 'wrap' }}>
          <Link to="/" className="t-small" style={{ opacity: 0.6 }}>Home</Link>
          <Icon name="chevron-r" size={12} stroke="var(--muted)" />
          <Link to="/shop" className="t-small" style={{ opacity: 0.6 }}>Shop</Link>
          <Icon name="chevron-r" size={12} stroke="var(--muted)" />
          <span className="t-small">{product.name}</span>
        </div>

        <div className="product-detail-grid">
          {/* Gallery */}
          <div className="product-detail-gallery">
            <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={activeImg}
              onClick={() => setLightboxOpen(true)}
              style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', aspectRatio: '4/4', background: 'var(--nude)', marginBottom: 14, cursor: 'pointer', position: 'relative' }}>
              <img src={images[activeImg]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' , backgroundSize: 'cover' , backgroundPosition: ' center' }} />
              <div style={{ position: 'absolute', top: 12, right: 12, width: 34, height: 34, borderRadius: '50%', background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', pointerEvents: 'none' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35M11 8v6M8 11h6"/></svg>
              </div>
            </m.div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {images.slice(0, 4).map((src, i) => (
                <div key={src} onClick={() => setActiveImg(i)}
                  style={{ width: 72, height: 72, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: `2px solid ${activeImg === i ? 'var(--clay)' : 'transparent'}`, cursor: 'pointer', flexShrink: 0 }}>
                  <img src={src} alt={`${product.name} ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <m.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
              {product.tags?.slice(0, 3).reduce((acc, t) => {
                if (t) acc.push(<span key={t._id} style={{ padding: '4px 12px', border: '1px solid var(--border-md)', borderRadius: 999, fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                  {t.name}
                </span>);
                return acc;
              }, [])}
            </div>

            <span className="t-label">{product.category?.name}</span>
            <h1 className="t-h1" style={{ marginTop: 8 }}>{product.name}</h1>
            {product.subtitle && <p className="t-body" style={{ marginTop: 4 }}>{product.subtitle}</p>}

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
              <Stars rating={product.rating} size={16} />
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--muted)' }}>
                {product.rating} ({product.reviewCount?.toLocaleString()} reviews)
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, margin: '16px 0' }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 30, fontWeight: 700 }}>${product.price}</span>
              {product.originalPrice && (
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: 16, color: 'var(--muted)', textDecoration: 'line-through' }}>
                  ${product.originalPrice}
                </span>
              )}
              {product.originalPrice && (
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, color: 'var(--sage)', background: 'var(--sage-light)', padding: '3px 10px', borderRadius: 999 }}>
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </span>
              )}
            </div>

            <p className="t-body">{product.description}</p>

            <div style={{ height: 1, background: 'var(--border)', margin: '24px 0' }} />

            {/* Skin types */}
            {product.skinType?.length > 0 && (
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>
                  Skin Type
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {product.skinType.map(t => (
                    <span key={t} onClick={() => toggleTag(t)}
                      style={{ padding: '5px 14px', border: `1px solid ${selectedTags.includes(t) ? 'var(--ink)' : 'var(--border)'}`, borderRadius: 999, background: selectedTags.includes(t) ? 'var(--ink)' : 'transparent', color: selectedTags.includes(t) ? 'white' : 'var(--muted)', fontFamily: 'var(--font-ui)', fontSize: 11, cursor: 'pointer', transition: 'var(--transition)' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Shades */}
            {product.shades?.length > 0 && (
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>
                  Available Shades
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {product.shades.map(s => (
                    <span key={s} style={{ padding: '5px 14px', border: '1px solid var(--border)', borderRadius: 999, fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--muted)' }}>{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>
                  Sizes
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {product.sizes.map(s => (
                    <span key={s} onClick={() => toggleTag(s)}
                      style={{ padding: '6px 16px', border: `1px solid ${selectedTags.includes(s) ? 'var(--ink)' : 'var(--border)'}`, borderRadius: 'var(--radius)', background: selectedTags.includes(s) ? 'var(--ink)' : 'transparent', color: selectedTags.includes(s) ? 'white' : 'var(--muted)', fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'var(--transition)' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ height: 1, background: 'var(--border)', margin: '24px 0' }} />

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: 12 }}>
              <a href={product.affiliateLink || '#'} target="_blank" rel="noopener noreferrer"
                className="desktop-buy-btn"
                onClick={() => toast.success(`Redirecting to store page for ${product.name}!`)}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '17px 24px', background: 'var(--ink)', color: 'white', borderRadius: 999, fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'var(--transition)', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--clay-deep)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--ink)'}>
                <Icon name="external" size={16} stroke="white" />
                {buyLabel}
              </a>
              <button className="desktop-wish-btn" onClick={() => toggle(product._id)}
                style={{ padding: '17px 20px', border: `1px solid ${wished ? 'var(--rose)' : 'var(--border-md)'}`, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'var(--transition)', background: wished ? 'var(--rose-light)' : 'transparent', cursor: 'pointer' }}>
                <Icon name={wished ? 'heart-fill' : 'heart'} size={18} stroke={wished ? 'var(--rose)' : 'var(--ink)'} fill={wished ? 'var(--rose)' : 'none'} />
              </button>
            </div>

            {/* Trust badges */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
              {[
                { icon: 'truck', label: 'Free Shipping' },
                { icon: 'shield', label: 'Verified Products' },
                { icon: 'leaf', label: 'Eco Packaging' },
              ].map(b => (
                <div key={b.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, fontFamily: 'var(--font-ui)', fontSize: 10, color: 'var(--muted)', lineHeight: 1.5 }}>
                  <Icon name={b.icon} size={16} stroke="var(--muted)" />
                  <span>{b.label}</span>
                </div>
              ))}
            </div>

            {/* Accordions */}
            <div style={{ marginTop: 28 }}>
              {[
                { key: 'ingredients', label: 'Ingredients', content: product.ingredients },
                { key: 'benefits', label: 'Benefits & Features', content: product.benefits?.join('\n') },
                { key: 'fabric', label: 'Fabric & Care', content: product.fabric },
                // { key: 'shipping', label: 'Shipping & Returns', content: 'Free shipping on orders over $50. Easy 30-day returns on all affiliate purchases through our partner retailers.' },
              ].filter(a => a.content).map(acc => (
                <div key={acc.key} style={{ borderTop: '1px solid var(--border)' }}>
                  <button onClick={() => toggleAccordion(acc.key)}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '15px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{acc.label}</span>
                    <Icon name={openAccordion === acc.key ? 'chevron-d' : 'chevron-r'} size={16} stroke="var(--muted)" />
                  </button>
                  {openAccordion === acc.key && (
                    <m.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ paddingBottom: 18, fontSize: 14, color: 'var(--muted)', lineHeight: 1.7 }}>
                      {acc.content.split('\n').map((line) => <p key={line}>{line}</p>)}
                    </m.div>
                  )}
                </div>
              ))}
            </div>
          </m.div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="section" style={{ background: 'var(--mist)' }}>
          <div className="container">
            <div className="section-header">
              <span className="t-label">You May Also Love</span>
              <h2 className="t-h2" style={{ marginTop: 8 }}>Related Products</h2>
            </div>
            <div className="grid-4">
              {related.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Sticky mobile buy button */}
      <div style={{ display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 99, padding: '16px 20px', background: 'rgba(251,247,244,0.98)', backdropFilter: 'blur(16px)', borderTop: '1px solid var(--border)', boxShadow: '0 -4px 24px rgba(45,43,48,0.08)' }} className="mobile-sticky-buy">
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <a href={product.affiliateLink || '#'} target="_blank" rel="noopener noreferrer"
            onClick={() => toast.success(`Redirecting to store page for ${product.name}!`)}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '16px', background: 'var(--clay-deep)', color: 'white', borderRadius: 999, fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            <Icon name="external" size={16} stroke="white" />
            {buyLabel} — ${product.price}
          </a>
          <button onClick={() => toggle(product._id)}
            style={{ padding: '16px', border: `1px solid ${wished ? 'var(--rose)' : 'var(--border-md)'}`, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--transition)', background: wished ? 'var(--rose-light)' : 'transparent', cursor: 'pointer' }}>
            <Icon name={wished ? 'heart-fill' : 'heart'} size={20} stroke={wished ? 'var(--rose)' : 'var(--ink)'} fill={wished ? 'var(--rose)' : 'none'} />
          </button>
        </div>
      </div>
      <style>{`.mobile-sticky-buy { display: none; } .desktop-wish-btn { display: flex; } @media(max-width:768px){ .mobile-sticky-buy { display: block !important; } .desktop-wish-btn { display: none !important; } }`}</style>

      {lightboxOpen && (
        <ImageLightbox
          images={images}
          activeIndex={activeImg}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}

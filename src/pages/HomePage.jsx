import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api.js';
import { toast } from 'sonner';
import { m, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/product/ProductCard.jsx';
import { SkeletonGrid } from '../components/ui/Skeleton.jsx';
import Stars from '../components/ui/Stars.jsx';
import Icon from '../components/ui/Icon.jsx';
import { useProducts, useCategories } from '../hooks/useData.js';
import { useSiteSettings } from '../context/SiteSettingsContext.jsx';
import { UserEmptyState } from '../components/ui/EmptyState.jsx';
const FADE = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.55 } };

const HERO_SLIDES = [
  { src: '/assets/head.avif', alt: 'Skincare' },
  { src: '/assets/hero.jpg', alt: 'Cosmetics' },
  { src: '/assets/totbag.avif', alt: 'Hand Bags' },
  { src: '/assets/cloths.webp', alt: 'Clothing' },
];
const EDIT_IMG = '/assets/editorial.jpg';

const MASONRY = [
  { src: '/assets/serum.avif', name: 'All Types Of Serums', tall: true },
  { src: '/assets/bag.avif', name: 'Hand Bags', tall: false },
  { src: '/assets/base.avif', name: 'Makeup Bases', tall: false },
  { src: '/assets/moist.avif', name: 'Different Moisturizers', tall: true },
  { src: '/assets/totbag.avif', name: 'Tote Bags', tall: false },
  { src: '/assets/pallets.avif', name: 'Cosmetic Pallets', tall: false },
  { src: '/assets/allskin.avif', name: 'All Types Of Skincare', tall: true },
  { src: '/assets/allbags.jpg', name: 'All Types of Bags', tall: false },
  { src: '/assets/cosmetic.avif', name: 'All types of Cosmetics', tall: false },
];
const TESTIMONIALS = [
  { text: 'The Glow Serum Pro completely transformed my morning routine. My skin has never looked this radiant.', name: 'Sarah M.', meta: 'Verified Buyer · Skincare', avatar: '/assets/avatar1.jpg' },
  { text: 'Discovered Bellezza through Pinterest and I am obsessed. The curation is so thoughtful — every product feels luxurious.', name: 'Emma K.', meta: 'Verified Buyer · Fashion', avatar: '/assets/avatar2.jpg' },
  { text: 'Finally a platform that understands what clean beauty actually means. The K-Beauty section is my weekly indulgence.', name: 'Yuna L.', meta: 'Verified Buyer · K-Beauty', avatar: '/assets/avatar3.jpg' },
];

function RotatingStar() {
  return (
    <div style={{ position: 'absolute', top: 2, left: -58, width: 180, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg viewBox="0 0 110 110" style={{ width: '100%', height: '100%', animation: 'spin 12s linear infinite', position: 'absolute', zIndex: 99 }}>
        <defs>
          <path id="sp" d="M55,55 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0" />
        </defs>
        <text fill="var(--ink)" fontSize="8.5" fontFamily="var(--font-ui)" fontWeight="600" letterSpacing="3">
          <textPath href="#sp">NATURAL BEAUTY • CONSCIOUS SKINCARE • </textPath>
        </text>
      </svg>

      {/* Star in center */}
      <svg
        viewBox="0 0 28 28"
        style={{
          width: 50,
          height: 50,
          animation: 'spin 20s linear infinite',
          zIndex: 1
        }}
      >
        <g transform="translate(0 -0.001)">
          <path
            d="M 0 28.001 L 0 0.001 L 28 0.001 L 28 28.001 Z"
            fill="transparent"
          />
          <path
            d="M 13.992 0.004 C 13.992 0.012 13.945 0.354 13.89 0.765 C 13.311 5.033 12.8 7.197 11.982 8.833 C 10.76 11.281 8.859 12.432 4.669 13.266 C 3.622 13.475 1.804 13.761 0.326 13.948 C 0.146 13.971 0.002 13.992 0.005 13.993 C 0.007 13.995 0.203 14.023 0.439 14.056 C 3.415 14.452 5.285 14.794 6.739 15.212 C 10.376 16.257 11.951 17.946 12.943 21.871 C 13.282 23.203 13.582 24.92 13.917 27.433 C 13.959 27.739 13.996 27.993 13.998 27.997 C 14.002 27.999 14.009 27.948 14.016 27.882 C 14.036 27.684 14.223 26.328 14.313 25.738 C 14.958 21.444 15.637 19.335 16.873 17.787 C 17.078 17.528 17.545 17.065 17.818 16.848 C 18.662 16.178 19.646 15.698 21.041 15.274 C 22.473 14.84 24.379 14.481 27.414 14.074 C 27.72 14.032 27.974 13.997 27.976 13.993 C 27.98 13.992 27.901 13.979 27.802 13.966 C 26.335 13.779 24.696 13.526 23.605 13.321 C 20.744 12.782 18.959 12.095 17.719 11.058 C 16.998 10.453 16.435 9.713 15.967 8.751 C 15.168 7.107 14.633 4.8 14.082 0.615 C 14.011 0.065 13.998 -0.023 13.992 0.004 Z"
            fill="var(--clay)"
          />
        </g>
      </svg>

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await api.subscribe(email);
      toast.success(res.message || 'Thanks for subscribing! ✨');
      setEmail('');
    } catch (err) {
      toast.error(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ maxWidth: 480, margin: '0 auto', display: 'flex', gap: 8, background: 'var(--snow)', borderRadius: 999, padding: '8px 8px 8px 24px', border: '1px solid rgba(255,255,255,0.12)' }}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          disabled={loading}
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: 'var(--font-sans)', fontSize: 14, color: 'black' }}
        />
        <button type="submit" className="btn btn-clay btn-md" disabled={loading}>
          {loading ? 'Subscribing…' : 'Subscribe'}
        </button>
      </div>
    </form>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const { data: productsData, loading, error: productsError } = useProducts({ featured: true, limit: 8 });
  const { data: categories, error: categoriesError } = useCategories();
  const { settings } = useSiteSettings();
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex(prev => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const products = productsData?.products || [];
  const catList = categories || [];
  const useSlider = catList.length > 5;
  const handleCategoryClick = (slug) => {
    navigate(`/shop?category=${slug}`);
  };

  return (
    <div className="page-content">
      {/* ── HERO ── */}
      <section style={{ background: 'var(--canvas)', overflow: 'hidden' }}>
        <div className="container" style={{ paddingTop: 0 }}>
          <div className="hero-grid">
            <m.div className="hero-text-motion" {...FADE}>
              {settings.heroBadgeText && (
                <div className="hero-badge-wrap">
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--clay)', display: 'inline-block' }} />
                  <span className="t-label" style={{ textTransform: 'none', fontSize: 12, letterSpacing: '0.06em', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    {settings.heroBadgeText}
                    <Icon name="star" size={10} stroke="var(--clay)" fill="var(--clay)" />
                  </span>
                </div>
              )}
              <h1 className="t-hero">
                Where Natural<br /><em>Beauty</em> Begins
              </h1>
              <p className="t-body" style={{ marginTop: 20, maxWidth: 440, fontSize: 16 }}>
                Curated skincare, makeup and fashion picks that celebrate your natural glow. Ethically sourced, beautifully presented.
              </p>
              <div className="hero-buttons">
                <button className="btn btn-primary btn-lg" onClick={() => navigate('/shop')}>
                  Explore Collection <Icon name="arrow-r" size={16} stroke="white" />
                </button>
                <button className="btn btn-outline btn-lg" onClick={() => navigate('/trending')}>
                  What's Trending
                </button>
              </div>
              {/* <div className="hero-rating">
                <div style={{ display: 'flex' }}>
                  {AVATS.map((src, i) => (
                    <div key={i} style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid white', overflow: 'hidden', marginLeft: i ? -10 : 0, flexShrink: 0 }}>
                      <img src={src} alt="customer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                    </div>
                  ))}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600 }}>10K+ Happy Customers</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <Stars rating={5} size={11} />
                    <span className="t-small">4.9 / 5 average rating</span>
                  </div>
                </div>
              </div> */}
            </m.div>

            <m.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.65 }} className="hero-image-wrap" style={{ position: 'relative' }}>
              <RotatingStar />
              <div style={{ borderRadius: '200px 200px 20px 20px', overflow: 'hidden', aspectRatio: '4/5', boxShadow: 'var(--shadow-lg)', position: 'relative' }}>
                <AnimatePresence>
                  <m.img
                    key={HERO_SLIDES[slideIndex].src}
                    src={HERO_SLIDES[slideIndex].src}
                    alt={HERO_SLIDES[slideIndex].alt}
                    initial={{ opacity: 0, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
                  />
                </AnimatePresence>
              </div>
              <div style={{ position: 'absolute', bottom: 32, left: -24, background: 'white', borderRadius: 'var(--radius-md)', padding: '14px 18px', boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                  <img src={settings.heroBoxImage || MASONRY[0].src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600 }}>{settings.heroBoxTitle}</div>
                  <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--clay-deep)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    {settings.heroBoxDescription}
                    <Icon name="star" size={10} stroke="var(--clay-deep)" fill="var(--clay-deep)" />
                  </div>
                </div>
              </div>
            </m.div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div style={{ background: 'var(--ink)', padding: '16px 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'inline-flex', animation: 'marquee 28s linear infinite' }}>
          {Array(8).fill(null).map((_, i) => (
            <span key={`marquee-${i}`} style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(15px,2vw,22px)', color: 'white', padding: '0 32px', opacity: 0.9 }}>
              GLOW EVERY DAY <Icon name="star" size={12} stroke="var(--clay)" fill="var(--clay)" style={{ verticalAlign: 'middle' }} /> BEAUTY THAT FEELS AS GOOD AS IT LOOKS <Icon name="star" size={12} stroke="var(--clay)" fill="var(--clay)" style={{ verticalAlign: 'middle', marginLeft: 32 }} />
            </span>
          ))}
        </div>
        <style>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
      </div>

      {/* ── CATEGORIES ── */}
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: 28 }}>
            <span className="t-label">Browse By Category</span>
            <h2 className="t-h2" style={{ marginTop: 8 }}>Find Your Perfect Match</h2>
          </div>
          {categoriesError && (
            <UserEmptyState
              type="categories"
              hasError={true}
              actionLabel="Retry"
              onAction={() => window.location.reload()}
            />
          )}
          {!categoriesError && (!categories || categories.length === 0) && (
            <UserEmptyState
              type="categories"
              hasError={false}
              title="No categories available"
              description="Categories will appear here once added."
            />
          )}
          {!categoriesError && categories && categories.length > 0 && (
            <div className={`categories-scroll ${useSlider ? 'is-slider' : ''}`} style={{
              display: 'flex',
              gap: 20,
              paddingBottom: useSlider ? 16 : 0,
              justifyContent: useSlider ? 'flex-start' : 'center',
              flexWrap: 'nowrap',
              overflowX: useSlider ? 'auto' : 'visible',
              scrollbarWidth: useSlider ? 'none' : 'auto',
            }}>
              {categories.map(cat => (
                <button
                  key={cat._id}
                  onClick={() => handleCategoryClick(cat.slug)}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, cursor: 'pointer', background: 'none', border: 'none', padding: 0, flexShrink: 0, flexGrow: useSlider ? 0 : 1, maxWidth: useSlider ? 'none' : '200px', width: useSlider ? 'clamp(110px,15vw,140px)' : 'auto' }}
                >
                  <div style={{ width: 'clamp(110px,15vw,140px)', height: 'clamp(110px,15vw,140px)', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--border)', transition: 'border-color 0.3s, transform 0.3s, box-shadow 0.3s', boxShadow: 'var(--shadow-soft)' }}>
                    <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} />
                  </div>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink)', transition: 'color 0.3s', textAlign: 'center', whiteSpace: 'nowrap' }}>
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          )}
          <style>{`
            .categories-scroll button:hover img { transform: scale(1.05); }
            .categories-scroll button:hover span { color: var(--clay-deep); }
            .categories-scroll button:focus-visible { outline: 2px solid var(--clay); outline-offset: 4px; border-radius: 4px; }
            @media (max-width: 768px) {
              .categories-scroll {
                justify-content: flex-start !important;
                overflow-x: auto !important;
                flex-wrap: nowrap !important;
                scrollbar-width: none;
                padding-bottom: 16px;
                -webkit-overflow-scrolling: touch;
              }
              .categories-scroll::-webkit-scrollbar { display: none; }
              .categories-scroll > * { width: clamp(90px,18vw,110px) !important; flex-shrink: 0 !important; }
              .categories-scroll > * div:first-child { width: clamp(80px,16vw,100px) !important; height: clamp(80px,16vw,100px) !important; }
            }
            @media (min-width: 769px) {
              .categories-scroll:not(.is-slider) > * { flex: 1 1 0; max-width: 200px; }
              .categories-scroll.is-slider > * { flex: 0 0 auto; }
              .categories-scroll.is-slider { overflow-x: auto; scrollbar-width: none; padding-bottom: 16px; }
              .categories-scroll.is-slider::-webkit-scrollbar { display: none; }
              .categories-scroll.is-slider > * div:first-child { width: clamp(110px,12vw,140px) !important; height: clamp(110px,12vw,140px) !important; }
            }
          `}</style>
        </div>
      </section>

      {/* ── PRODUCTS GRID ── */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <span className="t-label">Our Collection</span>
              <h2 className="t-h2" style={{ marginTop: 8 }}>Carefully Curated Picks</h2>
            </div>
            <button className="btn btn-outline btn-md" onClick={() => navigate('/shop')}>
              View All <Icon name="arrow-r" size={14} />
            </button>
          </div>
          {productsError && (
            <UserEmptyState
              type="products"
              hasError={true}
              actionLabel="Retry"
              onAction={() => window.location.reload()}
            />
          )}
          {!productsError && !loading && products.length === 0 && (
            <UserEmptyState
              type="products"
              hasError={false}
              title="No featured products yet"
              description="Check back soon for our curated picks!"
            />
          )}
          {!productsError && (loading || products.length > 0) && (
            <div>
              {loading
                ? <SkeletonGrid count={8} cols="grid-4" />
                : <div className="grid-4">{products.map(p => <ProductCard key={p._id} product={p} />)}</div>
              }
            </div>
          )}
        </div>
      </section>

      {/* ── EDITORIAL FEATURE ── */}
      <section className="section" style={{ background: 'var(--nude)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 'clamp(32px,5vw,80px)', alignItems: 'center' }}>
            <m.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', aspectRatio: '4/5' }}>
              <img src={EDIT_IMG} alt="K-Beauty Edit" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </m.div>
            <div>
              <span className="t-label">The K-Beauty Edit</span>
              <h2 className="t-h1" style={{ marginTop: 16 }}>Skin That<br /><em>Tells a Story</em></h2>
              <p className="t-body" style={{ marginTop: 16 }}>
                Inspired by the 10-step Korean skincare ritual, our curated edit brings the very best formulations directly to your routine.
              </p>
              <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
                {[
                  { icon: 'image', title: 'Deep Hydration', text: 'Layered moisture that lasts through day and night' },
                  { icon: 'star', title: 'Glass Skin Effect', text: 'Achieve luminous, poreless-looking skin naturally' },
                  { icon: 'leaf', title: 'Clean Ingredients', text: 'Botanical actives, zero harsh chemicals' },
                ].map(f => (
                  <div key={f.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--snow)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon name={f.icon} size={20} stroke="var(--clay)" />
                    </div>
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: 16, fontWeight: 500, marginBottom: 3 }}>{f.title}</h4>
                      <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.55 }}>{f.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary btn-lg" style={{ marginTop: 32 }} onClick={() => navigate('/shop')}>
                Shop K-Beauty <Icon name="arrow-r" size={16} stroke="white" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── MASONRY ── */}
      <section className="section" style={{ background: 'var(--soft-mist)' }}>
        <div className="container">
          <div className="section-header">
            <span className="t-label">Pinterest Style</span>
            <h2 className="t-h2" style={{ marginTop: 8 }}>Beauty Discovery Board</h2>
          </div>
          <div className="pinterest-board">
            {MASONRY.map(item => (
              <div key={item.name} style={{ breakInside: 'avoid', marginBottom: 14 }}>
                <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', position: 'relative', cursor: 'pointer', aspectRatio: item.tall ? '4/3' : '5/4' }}
                  onClick={() => navigate('/shop')}>
                  <img src={item.src} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    loading="lazy" />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(45,43,48,0.6) 0%, transparent 55%)', opacity: 0, transition: '0.3s' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                    <div style={{ position: 'absolute', bottom: 14, left: 14 }}>
                      <div style={{ color: 'white', fontFamily: 'var(--font-serif)', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>{item.name}</div>
                      <span style={{ background: 'white', color: 'var(--ink)', padding: '3px 12px', borderRadius: 999, fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 600 }}>View →</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="section" style={{ background: 'var(--ink)', textAlign: 'center' }}>
        <div className="container">
          <span className="t-label" style={{ color: 'var(--clay)' }}>Stay in the glow</span>
          <h2 className="t-h2" style={{ color: 'white', marginTop: 14, maxWidth: 460, margin: '14px auto' }}>
            Get Beauty Drops Straight to Your Inbox
          </h2>
          <p className="t-body" style={{ color: 'rgba(255,255,255,0.5)', marginTop: 12, marginBottom: 32 }}>
            New arrivals, exclusive deals, and the best of Korean skincare — weekly.
          </p>
          <NewsletterForm />
        </div>
      </section>

      <style>{`
        .hero-text-motion {
          margin-top: -66px;
        }
        .hero-image-wrap {
          margin-top: -66px;
        }
        @media (max-width: 768px) {
          .hero-text-motion {
            margin-top: 0;
          }
          .hero-image-wrap {
            margin-top: 0;
          }
        }
      `}</style>
    </div>
  );
}

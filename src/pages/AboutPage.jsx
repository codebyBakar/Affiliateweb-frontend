import { m } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSiteSettings } from '../context/SiteSettingsContext.jsx';

const STATS = [
  ['30+', 'Awards'],
  ['32+', 'Investments'],
  ['100+', 'Products'],
  ['10k+', 'Users'],
];

export default function AboutPage() {
  const { settings } = useSiteSettings();
  const siteName = settings?.siteName || 'BEAUTY-HOUSE';

  const story = '/assets/story.avif'
  const sec2 = '/assets/sec2.avif'
  const sec3 = '/assets/sec3.avif'

  const navigate = useNavigate();

  return (
    <div className="page-content">
      {/* Our Story Section - Top */}
      <section className="section" style={{ background: 'var(--snow)', padding: 'clamp(40px,8vw,80px) clamp(16px,4vw,40px) 0' }}>
        <div className="container" style={{ paddingBottom: 'clamp(40px,8vw,80px)' }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(40px,8vw,80px)' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px,5vw,56px)', fontWeight: 400, lineHeight: 1.2 }}>
              Our Story
            </h2>
            <p className="t-body" style={{ maxWidth: 640, margin: '24px auto 0', fontSize: 16, lineHeight: 1.7, color: 'var(--clay)' }}>
             {siteName} is your trusted affiliate-curated marketplace for premium beauty and lifestyle products. We partner with top brands to bring you carefully selected items. When you shop through our links, we earn a commission at no extra cost to you—helping us keep our platform free and independent.
            </p>
          </div>
        </div>
        <m.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', width: 'calc(100% - clamp(32px,8vw,80px))', margin: '0 clamp(16px,4vw,40px) clamp(16px,4vw,40px)' , aspectRatio: '16/9' }}>
          <img
            src={story}
            alt="Our Story"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </m.div>
      </section>

      {/* Shopiframe Integration Section */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 'clamp(32px,6vw,80px)', alignItems: 'center' }}>
          
            <m.div
              initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px,5vw,48px)', fontWeight: 400, lineHeight: 1.2, marginBottom: 24 }}>
                Affiliate-Powered<br />Commerce Made<br />Simple & Profitable
              </h2>
              <p className="t-body" style={{ marginTop: 18, fontSize: 16, lineHeight: 1.6 }}>
                As an affiliate e-commerce platform, {siteName} combines the best of both worlds. We feature exclusive partner products and earn commissions on your purchases—allowing us to operate independently while offering you genuine, expertly-curated recommendations. No ads, no hidden agendas, just honest beauty at its best.
              </p>
            </m.div>

              <m.div
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
              style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', aspectRatio: '7/5' }}>
              <img
                src={sec2}
                alt="Shopiframe Integration"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </m.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: 'var(--snow)', padding: 'clamp(56px,8vh,100px) 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 32, textAlign: 'center' }}>
            {STATS.map(([val, label], i) => (
              <m.div key={label}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px,5vw,56px)', fontWeight: 600, color: 'var(--ink)', lineHeight: 1 }}>{val}</div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 500, color: 'var(--clay)', letterSpacing: '0.05em', marginTop: 12 }}>{label}</div>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Section */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 'clamp(32px,6vw,80px)', alignItems: 'center' }}>
            <m.div
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px,5vw,48px)', fontWeight: 400, lineHeight: 1.2, marginBottom: 24 }}>
                Quality Curation,<br />Transparency, And<br />Affiliate Excellence
              </h2>
              <p className="t-body" style={{ marginTop: 18, fontSize: 16, lineHeight: 1.6 }}>
                Every product featured on {siteName} is hand-picked by our team of beauty experts. We partner exclusively with brands we genuinely trust and use ourselves. As an affiliate platform, we're transparent about our partnerships—because your trust is our most valuable asset. We succeed when you find exactly what you need.
              </p>
            </m.div>
            <m.div
              initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
              style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', aspectRatio: '7/5' }}>
              <img
                src={sec3}
                alt="Quality Design"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </m.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2 className="t-h2" style={{ marginBottom: 28 }}>
            Discover the Beauty of {siteName}
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/shop')}>Shop Now</button>
            <button className="btn btn-outline btn-lg" onClick={() => navigate('/trending')}>Explore Collections</button>
          </div>
        </div>
      </section>
    </div>
  );
}

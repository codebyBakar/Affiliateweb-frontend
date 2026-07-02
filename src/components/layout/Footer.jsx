import { Link } from 'react-router-dom';
import { ScrollReveal } from '../../components/ui/ScrollReveal.jsx';
import { useSiteSettings } from '../../context/SiteSettingsContext.jsx';
import Icon from '../../components/ui/Icon.jsx';

const COLS = [
  {
    heading: 'Discover',
    links: [
      { label: 'Skincare', to: '/shop?category=skincare' },
      { label: 'Makeup', to: '/shop?category=makeup' },
      { label: 'Bags', to: '/shop?category=bags' },
      { label: 'Fashion', to: '/shop?category=fashion' },
      { label: 'K-Beauty', to: '/shop?category=k-beauty' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Our Story', to: '/about' },
      { label: 'Sustainability', to: '/about' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'FAQ', to: '/' },
      { label: 'Affiliate Info', to: '/' },
      { label: 'Contact', to: '/' },
      { label: 'Privacy Policy', to: '/' },
    ],
  },
];

const SOCIAL_LINKS = {
  instagram: { url: 'https://www.instagram.com/beeutygo?igsh=bTVraTBtbTNvbXMw', brand: { bg: '#E1306C', border: '#E1306C' } },
  pinterest: { url: 'https://www.pinterest.com/abubakerg2005/', brand: { bg: '#E60023', border: '#E60023' } },
  tiktok: { url: 'https://www.tiktok.com/@beeutygo', brand: { bg: '#111', border: '#111' } },
};

export default function Footer() {
  const { settings } = useSiteSettings();
  const siteName = settings?.siteName || 'BEAUTY-HOUSE';
  const tagline = settings?.tagline || 'Where natural beauty begins. Curated skincare, makeup, bags and fashion for the modern woman.';

  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '64px 0 32px', background: 'var(--canvas)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 48 }}>
          <ScrollReveal delay={0.1} variant="fadeUp">
            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)' }}>{siteName}</div>
              <p style={{ marginTop: 16, fontSize: 14, lineHeight: 1.7, color: 'var(--muted)', maxWidth: 280 }}>
                {tagline}
              </p>
              <div style={{ marginTop: 28, display: 'flex', gap: 12 }}>
                {['instagram', 'pinterest', 'tiktok'].map((name) => {
                  const { url, brand } = SOCIAL_LINKS[name];
                  return (
                    <a
                      key={name}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)', background: 'var(--snow)', cursor: 'pointer', color: 'var(--ink)', textDecoration: 'none' }}
                      aria-label={name}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = brand.bg;
                        e.currentTarget.style.borderColor = brand.border;
                        e.currentTarget.style.color = '#fff';
                        e.currentTarget.style.transform = 'scale(1.12)';
                        e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.15)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'var(--snow)';
                        e.currentTarget.style.borderColor = 'var(--border)';
                        e.currentTarget.style.color = 'var(--ink)';
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <Icon name={name} size={18} strokeWidth={name === 'instagram' ? 1.8 : 0} fill={name === 'instagram' ? 'none' : 'currentColor'} stroke={name === 'instagram' ? undefined : 'none'} />
                    </a>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>

          {COLS.map((col, i) => (
            <ScrollReveal key={col.heading} delay={0.15 + i * 0.08} variant="fadeUp">
              <div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink)', marginBottom: 24 }}>{col.heading}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {col.links.map((l) => (
                    <Link key={l.label} to={l.to} style={{ fontSize: 14, color: 'var(--muted)', transition: 'var(--transition-fast)', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--clay-deep)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div style={{ marginTop: 56, paddingTop: 28, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <ScrollReveal delay={0.2} variant="fadeIn">
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>
              © {new Date().getFullYear()} {siteName}. All rights reserved.
            </span>


          </ScrollReveal>
          <ScrollReveal delay={0.25} variant="fadeIn">
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>
              Developed By <a style={{ textDecoration: 'underline' }} href="https://github.com/codebyBakar">CodebyBakar</a>
            </span>
          </ScrollReveal>

          {/* <div style={{ display: 'flex', gap: 28 }}>
            {['Privacy', 'Terms', 'Cookies'].map((t) => (
              <span key={t} style={{ fontSize: 12, color: 'var(--muted)', cursor: 'pointer', transition: 'var(--transition-fast)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--clay-deep)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>
                {t}
              </span>
            ))}
          </div> */}
        </div>
      </div>
    </footer>
  );
}
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import Icon from '../components/ui/Icon.jsx';

export default function NotFoundPage() {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '60px 20px', position: 'relative', overflow: 'hidden' }}>
      {/* Falling man illustration */}
      <m.div
        initial={{ y: -200, opacity: 0, rotate: -15 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', zIndex: 1, pointerEvents: 'none' }}
      >
        <img
          src="/assets/YSSlmyitCetA3OCV9uD3fsY7N60.avif"
          alt="Oops! Falling through space"
          style={{ width: '280px', height: 'auto', filter: 'drop-shadow(0 20px 40px rgba(45,43,48,0.15))' }}
        />
      </m.div>

      {/* Main content */}
      <m.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ position: 'relative', zIndex: 2, maxWidth: 400 }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 24, padding: '12px 28px', background: 'var(--rose-light)', border: '1px solid var(--rose)', borderRadius: 999 }}>
          <Icon name="alert-triangle" size={18} stroke="var(--rose)" />
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, color: 'var(--rose)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>404 Error</span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(48px,8vw,80px)', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.1, marginBottom: 16 }}>
          Page Not Found
        </h1>

        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 16, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 32, maxWidth: 360 }}>
          Oops! Looks like you've wandered into uncharted territory. The page you're looking for doesn't exist or has been moved.
        </p>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary btn-lg" style={{ padding: '16px 36px' }}>
            <Icon name="home" size={16} stroke="white" style={{ marginRight: 8 }} />
            Back to Home
          </Link>
          <Link to="/shop" className="btn btn-outline btn-lg" style={{ padding: '16px 36px' }}>
            <Icon name="grid" size={16} stroke="var(--ink)" style={{ marginRight: 8 }} />
            Browse Products
          </Link>
        </div>

        {/* Decorative elements */}
        <div style={{ marginTop: 48, display: 'flex', justifyContent: 'center', gap: 24, opacity: 0.4 }}>
          <Icon name="star" size={20} stroke="var(--clay)" fill="var(--clay)" />
          <Icon name="heart" size={20} stroke="var(--clay)" />
          <Icon name="star" size={20} stroke="var(--clay)" fill="var(--clay)" />
        </div>
      </m.div>

      {/* Floating decorative particles */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <m.div
            key={`particle-${i}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.3, 0], scale: [0, 1, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 20}%`,
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: i % 2 === 0 ? 'var(--clay)' : 'var(--rose)'
            }}
          />
        ))}
      </div>
    </div>
  );
}
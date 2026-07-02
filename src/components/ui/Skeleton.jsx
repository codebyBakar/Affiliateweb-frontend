function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-card__img" />
      <div className="skeleton-card__body">
        <div className="skeleton" style={{ height: 10, width: '55%', marginBottom: 10 }} />
        <div className="skeleton" style={{ height: 15, width: '85%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 12, width: '60%', marginBottom: 14 }} />
        <div className="skeleton" style={{ height: 36, borderRadius: 999 }} />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8, cols = 'grid-4' }) {
  return (
    <div className={cols}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={`skel-${i}`} />
      ))}
    </div>
  );
}

export function SkeletonProductDetail() {
  return (
    <div className="skel-pd-grid">
      <div>
        <div className="skeleton" style={{ aspectRatio: '4/4', borderRadius: 'var(--radius-xl)', marginBottom: 14 }} />
        <div style={{ display: 'flex', gap: 10 }}>
          {[...Array(4)].map((_, i) => (
            <div key={`skel-thumb-${i}`} className="skeleton" style={{ width: 72, height: 72, borderRadius: 'var(--radius-md)' }} />
          ))}
        </div>
      </div>
      <div style={{ paddingTop: 8 }}>
        <div className="skeleton" style={{ height: 12, width: 100, marginBottom: 16 }} />
        <div className="skeleton" style={{ height: 40, width: '80%', marginBottom: 12 }} />
        <div className="skeleton" style={{ height: 16, width: '60%', marginBottom: 24 }} />
        <div className="skeleton" style={{ height: 32, width: 120, marginBottom: 24 }} />
        <div className="skeleton" style={{ height: 14, marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 14, marginBottom: 8, width: '90%' }} />
        <div className="skeleton" style={{ height: 14, width: '70%', marginBottom: 32 }} />
        <div className="skeleton" style={{ height: 56, borderRadius: 999 }} />
      </div>
      <style>{`.skel-pd-grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(24px,4vw,60px);padding:40px 0}@media(max-width:768px){.skel-pd-grid{grid-template-columns:1fr}}`}</style>
    </div>
  );
}

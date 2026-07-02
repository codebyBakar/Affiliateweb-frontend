import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useSiteSettings } from '../../context/SiteSettingsContext.jsx';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const { settings } = useSiteSettings();
  const siteName = settings?.siteName || 'BEAUTY-HOUSE';

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--canvas)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 600, marginBottom: 12 }}>{siteName}</div>
          <div className="skeleton" style={{ width: 120, height: 4, borderRadius: 2, margin: '0 auto' }} />
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="*/404" replace />;
  return children;
}

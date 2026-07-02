import { useState, useEffect } from 'react';
import { NavLink, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useSiteSettings } from '../../context/SiteSettingsContext.jsx';
import Icon from '../../components/ui/Icon.jsx';
import '../../styles/admin.css';

const NAV = [
  { to: '/admin', icon: 'bar-chart', label: 'Dashboard', end: true },
  { to: '/admin/products', icon: 'package', label: 'Products' },
  { to: '/admin/categories', icon: 'grid', label: 'Categories' },
  { to: '/admin/tags', icon: 'tag', label: 'Tags' },
  { to: '/admin/settings', icon: 'settings', label: 'Settings' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { settings } = useSiteSettings();
  const siteName = settings?.siteName || 'BEAUTY-HOUSE';
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="admin-wrap">
      {/* Sidebar */}
      <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="admin-sidebar__logo">
          <h2>{siteName}</h2>
          <p>Admin Dashboard</p>
        </div>

        <nav className="admin-nav">
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `admin-nav__item${isActive ? ' active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon name={item.icon} size={17} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          {/* <div className="admin-affiliate-card">
            <div className="admin-affiliate-card__label">This Month</div>
            <div className="admin-affiliate-card__value">$12,450</div>
            <div className="admin-affiliate-card__change">↑ 18% vs last month</div>
          </div> */}
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600 }}>{user?.name}</div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{user?.email}</div>
            </div>
            <button className="nav-icon-btn" onClick={handleLogout} title="Logout">
              <Icon name="logout" size={16} stroke="var(--muted)" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        {/* Mobile top bar */}
        <div style={{ display: 'none' }} className="admin-mobile-bar">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="nav-icon-btn">
            <Icon name="menu" size={20} />
          </button>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 600 }}>Admin</span>
          <button onClick={handleLogout} className="nav-icon-btn">
            <Icon name="logout" size={18} />
          </button>
        </div>

        <Outlet />
      </main>

      <style>{`
        @media(max-width:768px){
          .admin-mobile-bar { display: flex !important; align-items: center; justify-content: space-between; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--border); }
        }
      `}</style>
    </div>
  );
}

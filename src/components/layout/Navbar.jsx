import { useState, useCallback } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import Icon from '../ui/Icon.jsx';
import MobileMenu from './MobileMenu.jsx';
import { useSiteSettings } from '../../context/SiteSettingsContext.jsx';
import '../../styles/components.css';

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/shop', label: 'Shop' },
  { to: '/trending', label: 'Trending' },
  { to: '/about', label: 'About' },
];

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { settings } = useSiteSettings();
  const siteName = settings?.siteName || 'Bellezza';
  const logo = settings?.logo || '/assets/logo.png';

  const handleLogoClick = useCallback((e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname]);

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <div className="navbar__inner">
            <Link to="/" className="navbar__logo" aria-label={siteName} onClick={handleLogoClick}>
              <img src={logo} alt={siteName} className="navbar__logo-img" />
            </Link>

            <ul className="navbar__links">
              {NAV_LINKS.map(({ to, label, end }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      `navbar__link${isActive ? ' active' : ''}`
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="navbar__actions">
              <button
                className="nav-icon-btn"
                onClick={() => navigate('/search')}
                aria-label="Search"
              >
                <Icon name="search" size={18} />
              </button>
              <button
                className="nav-icon-btn"
                onClick={() => navigate('/favorites')}
                aria-label="Wishlist"
              >
                <Icon name="heart" size={18} />
              </button>
              <button
                className="hamburger"
                onClick={() => setDrawerOpen(true)}
                aria-label="Open menu"
              >
                <span /><span /><span />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <MobileMenu open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}


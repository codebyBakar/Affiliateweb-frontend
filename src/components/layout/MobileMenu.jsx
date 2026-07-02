import { NavLink } from 'react-router-dom';
import Icon from '../ui/Icon.jsx';

const NAV_LINKS = [
    { to: '/', label: 'Home', end: true },
    { to: '/shop', label: 'Shop' },
    { to: '/trending', label: 'Trending' },
    { to: '/about', label: 'About' },
];

export default function MobileMenu({ open, onClose }) {
    return (
        <>
            <div
                className={`drawer-overlay${open ? ' open' : ''}`}
                onClick={onClose}
                aria-hidden={!open}
            />

            <aside
                className={`drawer${open ? ' open' : ''}`}
                role="dialog"
                aria-modal="true"
                aria-label="Mobile menu"
            >
                <button 
                    className="drawer__close-btn" 
                    onClick={onClose} 
                    aria-label="Close menu"
                >
                    <Icon name="close" size={24} />
                </button>

                <nav className="drawer__nav">
                    {NAV_LINKS.map(({ to, label, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) => `drawer__link${isActive ? ' active' : ''}`}
                            onClick={onClose}
                        >
                            {label}
                        </NavLink>
                    ))}
                </nav>
            </aside>
        </>
    );
}


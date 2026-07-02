import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { LazyMotion, domAnimation, AnimatePresence, m } from 'framer-motion';
import { AuthProvider } from './context/AuthContext.jsx';
import { SiteSettingsProvider } from './context/SiteSettingsContext.jsx';
import ProtectedRoute from './components/admin/ProtectedRoute.jsx';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import { Toaster } from 'sonner';

// Public pages
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const ShopPage = lazy(() => import('./pages/ShopPage.jsx'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage.jsx'));
const SearchPage = lazy(() => import('./pages/SearchPage.jsx'));
const TrendingPage = lazy(() => import('./pages/TrendingPage.jsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

// Admin pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin.jsx'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout.jsx'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts.jsx'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories.jsx'));
const AdminTags = lazy(() => import('./pages/admin/AdminTags.jsx'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings.jsx'));

const PAGE_TRANSITION = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
};

function PublicLayout({ children }) {
  const location = useLocation();
  const isProductDetail = location.pathname.startsWith('/products/');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <Navbar />
      <m.div key="public" {...PAGE_TRANSITION}>
        {children}
      </m.div>
      <Footer />
    </>
  );
}

function AppRoutes() {
  const location = useLocation();

  return (
    <Suspense fallback={
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%' }} />
      </div>
    }>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public routes */}
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/shop" element={<PublicLayout><ShopPage /></PublicLayout>} />
          <Route path="/products/:slug" element={<PublicLayout><ProductDetailPage /></PublicLayout>} />
          <Route path="/favorites" element={<PublicLayout><FavoritesPage /></PublicLayout>} />
          <Route path="/search" element={<PublicLayout><SearchPage /></PublicLayout>} />
          <Route path="/trending" element={<PublicLayout><TrendingPage /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />

          {/* Admin routes */}
          <Route path="/cOVID@1122BEEUTYGO" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="tags" element={<AdminTags />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={
            <PublicLayout>
              <NotFoundPage />
            </PublicLayout>
          } />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SiteSettingsProvider>
        <LazyMotion features={domAnimation}>
          <AppRoutes />
        </LazyMotion>
        <Toaster
          richColors
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--snow)',
              color: 'var(--ink)',
              border: '1px solid var(--border)',
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-md)'
            }
          }}
        />
      </SiteSettingsProvider>
    </AuthProvider>
  );
}

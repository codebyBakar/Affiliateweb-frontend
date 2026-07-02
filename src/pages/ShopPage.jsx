import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { m } from 'framer-motion';
import ProductCard from '../components/product/ProductCard.jsx';
import { SkeletonGrid } from '../components/ui/Skeleton.jsx';
import Icon from '../components/ui/Icon.jsx';
import { api } from '../utils/api.js';
import { useCategories } from '../hooks/useData.js';
import { UserEmptyState } from '../components/ui/EmptyState.jsx';

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Featured' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: '-rating', label: 'Top Rated' },
  { value: '-reviewCount', label: 'Most Reviewed' },
];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: categories, loading: catLoading } = useCategories();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState('-createdAt');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const activeCategory = searchParams.get('category') || 'all';

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeLimit = isMobile ? 8 : 12;

  const fetchProducts = async (pg = 1, cat = activeCategory, s = sort, append = false) => {
    if (!append) setLoading(true);
    setError(null);
    try {
      const params = { page: pg, limit: activeLimit, sort: s };
      if (cat !== 'all') {
        const found = categories?.find(c => c.slug === cat);
        if (found) params.category = found._id;
      }
      const data = await api.getProducts(params);
      if (append) {
        setProducts(prev => [...prev, ...(data.products || [])]);
      } else {
        setProducts(data.products || []);
      }
      setTotalPages(data.pages);
      setTotal(data.total);
      setPage(pg);
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeCategory === 'all' || categories) {
      fetchProducts(1, activeCategory, sort);
    }
  }, [activeCategory, sort, categories, isMobile]);

  const handleCategory = (slug) => {
    if (slug === 'all') searchParams.delete('category');
    else searchParams.set('category', slug);
    setSearchParams(searchParams);
  };

  const FILTERS = [
    { label: 'All', slug: 'all' },
    ...(categories?.map(c => ({ label: c.name, slug: c.slug })) || []),
  
  ];

  return (
    <div className="page-content">
      {/* Header */}
      <div style={{ paddingTop: 56, paddingBottom: 48, textAlign: 'left' }}>
        <div className="container">
          <span className="t-label">The Collection</span>
          <h1 className="t-h1" style={{ marginTop: 12 }}>Discover Everything</h1>
          <p className="t-body" style={{  paddingTop:15}}>
           Experience beauty made just for you – high-quality, skin-Care Products , Cosmetics ,Bags and Clothing.          </p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 32 }}>
        {/* Filters */}
        <div className="shop-filters-scroll">
          {FILTERS.map(f => (
            <button key={f.slug}
              onClick={() => handleCategory(f.slug)}
              style={{ padding: '8px 18px', border: `1px solid ${activeCategory === f.slug ? 'var(--ink)' : 'var(--border)'}`, borderRadius: 999, fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', background: activeCategory === f.slug ? 'var(--ink)' : 'transparent', color: activeCategory === f.slug ? 'white' : 'var(--muted)', cursor: 'pointer', transition: 'var(--transition)', whiteSpace: 'nowrap' }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0', paddingBottom: 16, borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: 12 }}>
          <span className="t-small">{loading ? '...' : `${total} products`}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="t-small">Sort:</span>
            <select className="form-input" style={{ width: 'auto', padding: '7px 14px', fontSize: 12 }}
              value={sort} onChange={e => setSort(e.target.value)}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <UserEmptyState
            type="products"
            hasError={true}
            actionLabel="Retry"
            onAction={() => fetchProducts(page, activeCategory, sort)}
          />
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <UserEmptyState
            type="products"
            hasError={false}
            title={`No products in ${activeCategory === 'all' ? 'this collection' : 'this category'}`}
            description={activeCategory === 'all' ? 'No products have been added yet. Check back soon!' : 'No products found in this category. Try another category or check back later.'}
          />
        )}

        {/* Grid */}
        {!error && (loading || products.length > 0) && (
          <>
            {loading && page === 1 && <SkeletonGrid count={8} cols={isMobile ? "grid-1" : "grid-4"} />}
            {!loading && products.length > 0 && (
              <m.div className="shop-products-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </m.div>
            )}

            {/* Load More Button (Mobile only) */}
            {!loading && isMobile && page < totalPages && (
              <div style={{ display: 'flex', justifyContent: 'center', margin: '32px 0 48px' }}>
                <button className="btn btn-primary btn-lg" onClick={() => fetchProducts(page + 1, activeCategory, sort, true)}>
                  Load More
                </button>
              </div>
            )}

            {/* Pagination (Desktop only) */}
            {!loading && !isMobile && totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, padding: '48px 0' }}>
                <button className="btn btn-outline btn-sm" disabled={page === 1} onClick={() => fetchProducts(page - 1, activeCategory, sort)}>
                  <Icon name="chevron-l" size={14} /> Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button key={n} onClick={() => fetchProducts(n, activeCategory, sort)}
                    style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid var(--border)', background: n === page ? 'var(--ink)' : 'transparent', color: n === page ? 'white' : 'var(--ink)', fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'var(--transition)' }}>
                    {n}
                  </button>
                ))}
                <button className="btn btn-outline btn-sm" disabled={page === totalPages} onClick={() => fetchProducts(page + 1, activeCategory, sort)}>
                  Next <Icon name="chevron-r" size={14} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

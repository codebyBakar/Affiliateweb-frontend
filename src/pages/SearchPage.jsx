import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { m, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import ProductCard from '../components/product/ProductCard.jsx';
import { SkeletonGrid } from '../components/ui/Skeleton.jsx';
import Icon from '../components/ui/Icon.jsx';
import { api } from '../utils/api.js';
import { UserEmptyState } from '../components/ui/EmptyState.jsx';

const SUGGESTIONS = ['Korean Skincare', 'Lip Tint', 'Serum', 'Foundation', 'Tote Bag', 'Silk Dress', 'Vitamin C', 'Moisturizer'];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [inputVal, setInputVal] = useState(searchParams.get('q') || '');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setInputVal(q);
      setQuery(q);
      doSearch(q);
    }
  }, [searchParams]);

  const doSearch = async (q) => {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const data = await api.getProducts({ search: q, limit: 16 });
      setProducts(data.products);
      setTotal(data.total);
      if (data.total > 0) {
        toast.success(`Found ${data.total} products for "${q}"`);
      } else {
        toast.info(`No products found for "${q}"`);
      }
    } catch (e) {
      setProducts([]);
      setError(e.message);
      toast.error('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    setSearchParams({ q: inputVal.trim() });
  };

  const handleSuggestion = (s) => {
    setInputVal(s);
    setSearchParams({ q: s });
  };

  return (
    <div className="page-content">
      {/* Search Header */}
      <div style={{ background: 'var(--canvas)', paddingTop: 56, paddingBottom: 48, textAlign: 'center' }}>
        <div className="container">
          <span className="t-label">Search</span>
          <h1 className="t-h2" style={{ marginTop: 12, marginBottom: 28 }}>Find Your Beauty</h1>

          <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: '0 auto', position: 'relative' }}>
            <input
              ref={inputRef}
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder="Search skincare, makeup, bags, fashion..."
              style={{ width: '100%', padding: '16px 56px 16px 24px', background: 'var(--snow)', border: '1px solid var(--border-md)', borderRadius: 999, fontFamily: 'var(--font-sans)', fontSize: 15, outline: 'none', transition: 'border-color var(--transition)' }}
              onFocus={e => e.target.style.borderColor = 'var(--clay)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-md)'}
            />
            <button type="submit" style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', width: 44, height: 44, background: 'var(--ink)', borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', transition: 'var(--transition)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--clay-deep)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--ink)'}>
              <Icon name="search" size={16} stroke="white" />
            </button>
          </form>

          {/* Suggestions */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
            {SUGGESTIONS.map(s => (
              <button key={s} onClick={() => handleSuggestion(s)}
                style={{ padding: '6px 14px', border: '1px solid var(--border)', borderRadius: 999, fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--muted)', cursor: 'pointer', transition: 'var(--transition)', background: 'transparent' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--clay)'; e.currentTarget.style.color = 'var(--clay-deep)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)'; }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 36, paddingBottom: 60 }}>
        <AnimatePresence mode="wait">
          {loading && (
            <m.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SkeletonGrid count={8} cols="grid-4" />
            </m.div>
          )}

          {error && (
            <m.div key="error" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <UserEmptyState
                type="search"
                hasError={true}
                actionLabel="Retry Search"
                onAction={() => doSearch(query)}
              />
            </m.div>
          )}

          {!loading && !error && searched && products.length === 0 && (
            <m.div key="empty" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', padding: '60px 0' }}>
              <UserEmptyState
                type="search"
                hasError={false}
                title={`No results for "${query}"`}
                description="Try different keywords or browse our categories below."
                actionLabel="Browse All Products"
                onAction={() => window.location.href = '/shop'}
              />
            </m.div>
          )}

          {!loading && !error && products.length > 0 && (
            <m.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ marginBottom: 24 }}>
                <span className="t-body">
                  <strong>{total}</strong> results for <strong>"{query}"</strong>
                </span>
              </div>
              <div className="grid-4">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
            </m.div>
          )}

          {!searched && !error && (
            <m.div key="default" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="section-header" style={{ marginBottom: 28, textAlign: 'left' }}>
                <span className="t-label">Popular Right Now</span>
                <h2 className="t-h3" style={{ marginTop: 8 }}>Trending Searches</h2>
              </div>
              <TrendingSearchGrid />
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TrendingSearchGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getProducts({ trending: true, limit: 8 })
      .then(d => setProducts(d.products))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <SkeletonGrid count={8} cols="grid-4" />;
  if (error) {
    return (
      <UserEmptyState
        type="products"
        hasError={true}
        title="Unable to load trending products"
        actionLabel="Retry"
        onAction={() => window.location.reload()}
      />
    );
  }
  if (products.length === 0) {
    return (
      <UserEmptyState
        type="products"
        hasError={false}
        title="No trending products yet"
        description="Check back soon for popular picks!"
      />
    );
  }
  return (
    <div className="grid-4">
      {products.map(p => <ProductCard key={p._id} product={p} />)}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard.jsx';
import { SkeletonGrid } from '../components/ui/Skeleton.jsx';
import { useWishlist } from '../hooks/useData.js';
import { api } from '../utils/api.js';
import { UserEmptyState } from '../components/ui/EmptyState.jsx';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { wishlist } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (wishlist.length === 0) {
      setProducts([]);
      return;
    }

    const loadWishedProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getProducts({ ids: wishlist.join(',') });
        setProducts(data.products || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadWishedProducts();
  }, [wishlist]);

  return (
    <div className="page-content" style={{ minHeight: '70vh' }}>
      <div style={{  paddingTop: 56, paddingBottom: 48, textAlign: 'center' }}>
        <div className="container">
          <span className="t-label">Your Saved Items</span>
          <h1 className="t-h1" style={{ marginTop: 12 }}>My Favorites</h1>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
        {error && (
          <UserEmptyState
            type="products"
            hasError={true}
            title="Unable to load favorites"
            actionLabel="Retry"
            onAction={() => window.location.reload()}
          />
        )}
        {!error && loading && <SkeletonGrid count={4} cols="grid-4" />}
        {!error && !loading && products.length > 0 && (
          <div className="grid-4">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
        {!error && !loading && products.length === 0 && (
          <UserEmptyState
            type="products"
            hasError={false}
            title="Your wishlist is empty"
            description="Explore our collection of skincare, makeup, and lifestyle products to save your favorites."
            actionLabel="Explore Shop"
            onAction={() => navigate('/shop')}
          />
        )}
      </div>
    </div>
  );
}

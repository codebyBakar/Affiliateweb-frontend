import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/ui/Icon.jsx';
import { api } from '../../utils/api.js';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getStats(),
      api.getAdminProducts({ limit: 6 }),
    ]).then(([s, p]) => {
      setStats(s);
      setRecentProducts(p.products);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const STAT_CARDS = [
    { label: 'Total Products', value: stats?.total ?? '—', change: '↑ 12 this week', icon: 'package' },
    { label: 'Active Listings', value: stats?.active ?? '—', change: 'Live on site', icon: 'check' },
    { label: 'Trending Items', value: stats?.trending ?? '—', change: 'Updated today', icon: 'trending' },
    { label: 'Featured Picks', value: stats?.featured ?? '—', change: 'On homepage', icon: 'star' },
  ];

  return (
    <>
      <div className="admin-topbar">
        <div>
          <h1 className="t-h2">Dashboard</h1>
          <p className="t-small" style={{ marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            Welcome back
            <Icon name="star" size={12} stroke="var(--clay)" fill="var(--clay)" />
            Here's what's happening.
          </p>
        </div>
        <button className="btn btn-primary btn-md" onClick={() => navigate('/admin/products', { state: { showAddForm: true } })}>
          <Icon name="plus" size={16} stroke="white" /> Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="admin-stats">
        {STAT_CARDS.map(s => (
          <div key={s.label} className="admin-stat">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div className="admin-stat__label">{s.label}</div>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius)', background: 'var(--nude)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={s.icon} size={16} stroke="var(--clay-deep)" />
              </div>
            </div>
            <div className="admin-stat__value">{loading ? <span className="skeleton" style={{ display: 'inline-block', width: 60, height: 28 }} /> : s.value}</div>
            <div className="admin-stat__change">{s.change}</div>
          </div>
        ))}
      </div>

      {/* Affiliate Revenue Snapshot */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 24 }}>
        <div className="admin-card" style={{ margin: 0 }}>
          <div className="admin-card__header">
            <span className="admin-card__title">Recent Products</span>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/products')}>
              View All →
            </button>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array(5).fill(null).map((_, i) => (
                    <tr key={`skel-${i}`}>
                      <td colSpan={4}><div className="skeleton" style={{ height: 14, borderRadius: 4 }} /></td>
                    </tr>
                  ))
                  : recentProducts.map(p => (
                    <tr key={p._id} style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/products', { state: { editProductId: p._id } })}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <img src={p.images?.[0]} alt={p.name} className="admin-product-img" />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</div>
                            <div className="t-small">{p.rating}★ · {p.reviewCount?.toLocaleString()} reviews</div>
                          </div>
                        </div>
                      </td>
                      <td>{p.category?.name}</td>
                      <td style={{ fontWeight: 600 }}>${p.price}</td>
                      <td>
                        <span className={`badge badge-${p.status}`}>{p.status}</span>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="admin-card" style={{ margin: 0 }}>
          <div className="admin-card__header">
            <span className="admin-card__title">Quick Actions</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Add New Product', icon: 'plus', to: '/admin/products', state: { showAddForm: true }, color: 'var(--ink)' },
              { label: 'Manage Categories', icon: 'grid', to: '/admin/categories', color: 'var(--clay-deep)' },
              { label: 'Manage Tags', icon: 'tag', to: '/admin/tags', color: 'var(--sage)' },
              { label: 'Site Settings', icon: 'settings', to: '/admin/settings', color: 'var(--muted)' },
              { label: 'View Live Site', icon: 'external', to: '/', color: 'var(--clay)' },
            ].map(a => (
              <button key={a.label} onClick={() => navigate(a.to)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--canvas)', cursor: 'pointer', transition: 'var(--transition)', textAlign: 'left' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--mist)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--canvas)'}>
                <div style={{ width: 32, height: 32, borderRadius: 'var(--radius)', background: 'var(--snow)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={a.icon} size={15} stroke={a.color} />
                </div>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 500 }}>{a.label}</span>
                <Icon name="chevron-r" size={14} stroke="var(--muted)" style={{ marginLeft: 'auto' }} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
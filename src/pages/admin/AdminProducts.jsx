import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../../components/ui/Icon.jsx';
import Stars from '../../components/ui/Stars.jsx';
import { api } from '../../utils/api.js';
import { useCategories, useTags } from '../../hooks/useData.js';
import VerificationModal from '../../components/ui/VerificationModal.jsx';
import { AdminEmptyState } from '../../components/ui/EmptyState.jsx';
import { toast } from 'sonner';

function ProductForm({ initial, onSave, onCancel, categories, tags }) {
  const [form, setForm] = useState(initial || {
    name: '', subtitle: '', description: '', price: '', originalPrice: '',
    affiliateLink: '', affiliatePlatform: 'amazon',
    images: [''], category: '', tags: [],
    productType: 'skincare', status: 'active',
    featured: false, trending: false,
    rating: 0, reviewCount: 0,
    skinType: '', benefits: '', ingredients: '',
    shades: '', finishType: '', sizes: '', colors: '', fabric: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        images: form.images.filter(Boolean),
        skinType: form.skinType ? form.skinType.split(',').map(s => s.trim()) : [],
        benefits: form.benefits ? form.benefits.split('\n').filter(Boolean) : [],
        shades: form.shades ? form.shades.split(',').map(s => s.trim()) : [],
        sizes: form.sizes ? form.sizes.split(',').map(s => s.trim()) : [],
        colors: form.colors ? form.colors.split(',').map(s => s.trim()) : [],
      };
      await onSave(payload);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      {error && (
        <div style={{ background: 'var(--rose-light)', border: '1px solid var(--rose)', borderRadius: 'var(--radius)', padding: '10px 16px', fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--rose)' }}>
          {error}
        </div>
      )}

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Product Name *</label>
          <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Glow Serum Pro" required />
        </div>
        <div className="form-group">
          <label className="form-label">Subtitle</label>
          <input className="form-input" value={form.subtitle} onChange={e => set('subtitle', e.target.value)} placeholder="Short tagline" />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Description *</label>
        <textarea className="form-input" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Detailed product description..." required />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Price ($) *</label>
          <input className="form-input" type="number" min="0" step="0.01" value={form.price} onChange={e => set('price', e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">Original Price ($)</label>
          <input className="form-input" type="number" min="0" step="0.01" value={form.originalPrice} onChange={e => set('originalPrice', e.target.value)} placeholder="Optional sale price" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Rating (0-5)</label>
          <input className="form-input" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={e => set('rating', Number(e.target.value))} placeholder="e.g. 4.7, 3.5, 4.2" />
        </div>
        <div className="form-group">
          <label className="form-label">Review Count</label>
          <input className="form-input" type="number" min="0" value={form.reviewCount} onChange={e => set('reviewCount', Number(e.target.value))} />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Affiliate Link *</label>
        <input className="form-input" type="url" value={form.affiliateLink} onChange={e => set('affiliateLink', e.target.value)} placeholder="https://amazon.com/dp/..." required />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Platform</label>
          <select className="form-input" value={form.affiliatePlatform} onChange={e => set('affiliatePlatform', e.target.value)}>
            <option value="amazon">Amazon</option>
            <option value="ebay">eBay</option>
            <option value="aliexpress">AliExpress</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Category *</label>
          <select className="form-input" value={form.category} onChange={e => set('category', e.target.value)} required>
            <option value="">Select category…</option>
            {categories?.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Product Type</label>
          <select className="form-input" value={form.productType} onChange={e => set('productType', e.target.value)}>
            <option value="skincare">Skincare</option>
            <option value="makeup">Makeup</option>
            <option value="bag">Bag</option>
            <option value="clothing">Clothing</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-input" value={form.status} onChange={e => set('status', e.target.value)}>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Product Images</label>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
          {form.images.reduce((acc, img, i) => {
            if (!img) return acc;
            acc.push(<div key={img} style={{ position: 'relative', width: 90, height: 120, borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)' }}>
              <img src={img} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button type="button" onClick={() => set('images', form.images.filter((_, j) => j !== i))}
                style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 12, fontWeight: 'bold', color: 'var(--rose)' }}>
                ×
              </button>
            </div>);
            return acc;
          }, [])}
          <label style={{ width: 90, height: 120, borderRadius: 'var(--radius)', border: '1px dashed var(--border-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'var(--mist)', transition: 'var(--transition)' }} className="upload-box-hover">
            <span style={{ fontSize: 20, color: 'var(--muted)' }}>+</span>
            <span style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 600, marginTop: 4 }}>Upload File</span>
            <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={async (e) => {
              const files = Array.from(e.target.files);
              if (!files.length) return;
              try {
                const results = await api.uploadMultipleToCloudinary(files);
                set('images', [...form.images.filter(Boolean), ...results.map(r => r.url)]);
              } catch (err) {
                alert(`Upload failed: ${err.message}`);
              }
            }} />
          </label>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Tags</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {tags?.map(t => (
            <label key={t._id} className="checkbox-group">
              <input type="checkbox"
                checked={form.tags.includes(t._id)}
                onChange={e => set('tags', e.target.checked ? [...form.tags, t._id] : form.tags.filter(x => x !== t._id))}
              />
              <span>{t.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Type-specific fields */}
      {(form.productType === 'skincare') && (
        <>
          <div className="form-group">
            <label className="form-label">Skin Types (comma-separated)</label>
            <input className="form-input" value={form.skinType} onChange={e => set('skinType', e.target.value)} placeholder="Dry, Normal, Combination" />
          </div>
          <div className="form-group">
            <label className="form-label">Benefits (one per line)</label>
            <textarea className="form-input" value={form.benefits} onChange={e => set('benefits', e.target.value)} placeholder="Reduces dark spots&#10;Deep hydration" style={{ minHeight: 80 }} />
          </div>
          <div className="form-group">
            <label className="form-label">Ingredients</label>
            <textarea className="form-input" value={form.ingredients} onChange={e => set('ingredients', e.target.value)} placeholder="Vitamin C, Hyaluronic Acid..." style={{ minHeight: 80 }} />
          </div>
        </>
      )}

      {form.productType === 'makeup' && (
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Shades (comma-separated)</label>
            <input className="form-input" value={form.shades} onChange={e => set('shades', e.target.value)} placeholder="Fair, Light, Medium" />
          </div>
          <div className="form-group">
            <label className="form-label">Finish Type</label>
            <input className="form-input" value={form.finishType} onChange={e => set('finishType', e.target.value)} placeholder="Matte, Dewy, Satin" />
          </div>
        </div>
      )}

      {(form.productType === 'clothing' || form.productType === 'bag') && (
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Sizes (comma-separated)</label>
            <input className="form-input" value={form.sizes} onChange={e => set('sizes', e.target.value)} placeholder="XS, S, M, L, XL" />
          </div>
          <div className="form-group">
            <label className="form-label">Colors (comma-separated)</label>
            <input className="form-input" value={form.colors} onChange={e => set('colors', e.target.value)} placeholder="Black, Nude, Cream" />
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', padding: '4px 0' }}>
        <label className="checkbox-group">
          <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} />
          <span>Featured on Homepage</span>
        </label>
        <label className="checkbox-group">
          <input type="checkbox" checked={form.trending} onChange={e => set('trending', e.target.checked)} />
          <span>Mark as Trending</span>
        </label>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-outline btn-md" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary btn-md" disabled={saving}>
          {saving ? 'Saving...' : initial ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}

export default function AdminProducts() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: categories, error: categoriesError } = useCategories();
  const { data: tags, error: tagsError } = useTags();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState('');
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [verification, setVerification] = useState({ isOpen: false, actionName: '', onVerify: null, isDelete: true });

  const loadProducts = async (pg = 1) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAdminProducts({ page: pg, limit: 15, ...(search && { search }) });
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
      setPage(pg);
    } catch (e) {
      console.error(e);
      setError(e.message);
      toast.error(e.message || 'Failed to load products');
    } finally { setLoading(false); }
  };

  useEffect(() => {
    setSelectMode(false);
    setSelectedIds(new Set());
    if (location.state?.showAddForm) {
      setShowForm(true);
    } else if (location.state?.editProductId) {
      const productToEdit = products.find(p => p._id === location.state.editProductId);
      if (productToEdit) {
        setEditProduct(productToEdit);
      }
    }
    loadProducts(1);
  }, [search, location.state]);

  const handleCreate = async (data) => {
    try {
      await api.createProduct(data);
      setShowForm(false);
      loadProducts(1);
      toast.success(`Product "${data.name}" created successfully!`);
    } catch (err) {
      toast.error(err.message || 'Failed to create product');
    }
  };

  const handleUpdate = (data) => {
    setVerification({
      isOpen: true,
      actionName: `Updating Product: ${data.name}`,
      isDelete: false,
      onVerify: async () => {
        try {
          await api.updateProduct(editProduct._id, data);
          setEditProduct(null);
          loadProducts(page);
          toast.success(`Product "${data.name}" updated successfully!`);
        } catch (err) {
          toast.error(err.message || 'Failed to update product');
        } finally {
          setVerification(v => ({ ...v, isOpen: false }));
        }
      }
    });
  };

  const handleDelete = (id) => {
    const prod = products.find(p => p._id === id);
    const productName = prod ? prod.name : 'this product';
    setVerification({
      isOpen: true,
      actionName: `Deleting Product: ${productName}`,
      isDelete: true,
      onVerify: async () => {
        setDeleting(id);
        try {
          await api.deleteProduct(id);
          toast.success(`Product "${productName}" deleted successfully!`);
          loadProducts(page);
        } catch (e) { 
          alert(e.message); 
          toast.error(e.message || 'Failed to delete product');
        } finally { 
          setDeleting(null); 
          setVerification(v => ({ ...v, isOpen: false }));
        }
      }
    });
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === products.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(products.map(p => p._id)));
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);
    setVerification({
      isOpen: true,
      actionName: `Deleting ${ids.length} product(s)`,
      isDelete: true,
      onVerify: async () => {
        let success = 0, fail = 0;
        for (const id of ids) {
          try {
            await api.deleteProduct(id);
            success++;
          } catch {
            fail++;
          }
        }
        if (success > 0) {
          toast.success(`${success} product(s) deleted successfully!${fail ? ` (${fail} failed)` : ''}`);
        }
        if (fail > 0) {
          toast.error(`${fail} product(s) failed to delete`);
        }
        setSelectedIds(new Set());
        setSelectMode(false);
        loadProducts(page);
        setVerification(v => ({ ...v, isOpen: false }));
      }
    });
  };

  const editInitial = editProduct ? {
    ...editProduct,
    category: editProduct.category?._id || editProduct.category,
    tags: editProduct.tags?.reduce((acc, t) => { if (t) acc.push(t._id || t); return acc; }, []) || [],
    rating: editProduct.rating || 0,
    reviewCount: editProduct.reviewCount || 0,
    skinType: editProduct.skinType?.join(', ') || '',
    benefits: editProduct.benefits?.join('\n') || '',
    shades: editProduct.shades?.join(', ') || '',
    sizes: editProduct.sizes?.join(', ') || '',
    colors: editProduct.colors?.join(', ') || '',
    images: editProduct.images?.length ? editProduct.images : [''],
  } : null;

  if (showForm || editProduct) {
    return (
      <>
        <div className="admin-topbar">
          <h1 className="t-h2">{editProduct ? 'Edit Product' : 'Add New Product'}</h1>
        </div>
        <div className="admin-card">
          <ProductForm
            initial={editProduct ? editInitial : null}
            onSave={editProduct ? handleUpdate : handleCreate}
            onCancel={() => { setShowForm(false); setEditProduct(null); }}
            categories={categories}
            tags={tags}
          />
        </div>
        <VerificationModal
          isOpen={verification.isOpen}
          onClose={() => setVerification(v => ({ ...v, isOpen: false }))}
          onVerify={verification.onVerify}
          actionName={verification.actionName}
          isDelete={verification.isDelete}
        />
      </>
    );
  }

  return (
    <>
      <div className="admin-topbar">
        <div>
          <h1 className="t-h2">Products</h1>
          <p className="t-small" style={{ marginTop: 4 }}>{total} total products</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {selectMode ? (
            <>
              <button className="btn btn-outline btn-md" onClick={() => { setSelectMode(false); setSelectedIds(new Set()); }}>
                Cancel
              </button>
              <button className="btn btn-danger btn-md" onClick={handleBulkDelete} disabled={selectedIds.size === 0}>
                <Icon name="trash" size={14} /> Delete Selected ({selectedIds.size})
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-outline btn-md" onClick={() => setSelectMode(true)}>
                <Icon name="check" size={14} /> Select
              </button>
              <button className="btn btn-primary btn-md" onClick={() => setShowForm(true)}>
                <Icon name="plus" size={16} stroke="white" /> Add Product
              </button>
            </>
          )}
        </div>
      </div>

      {/* Search */}
      <div style={{ maxWidth: 360, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--snow)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', transition: 'var(--transition)' }}>
          <div style={{ padding: '0 14px', color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="search" size={16} stroke="var(--muted)" />
          </div>
          <input className="form-input" style={{ border: 'none', outline: 'none', background: 'transparent', padding: '12px 16px', flex: 1, fontFamily: 'var(--font-sans)', fontSize: 14 }} placeholder="Search products..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="admin-card">
        {error && (
          <AdminEmptyState
            type="products"
            hasError={true}
            actionLabel="Retry"
            onAction={() => loadProducts(page)}
          />
        )}
        {!loading && !error && products.length === 0 && (
          <AdminEmptyState
            type="products"
            hasError={false}
            actionLabel="Add Product"
            onAction={() => setShowForm(true)}
          />
        )}
        {!error && (loading || products.length > 0) && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  {selectMode && (
                    <th style={{ width: 40 }}>
                      <input type="checkbox"
                        checked={products.length > 0 && selectedIds.size === products.length}
                        onChange={toggleSelectAll}
                        style={{ cursor: 'pointer', accentColor: 'var(--ink)', width: 16, height: 16 }}
                      />
                    </th>
                  )}
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Tags</th>
                  <th>Status</th>
                  <th>Flags</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array(6).fill(null).map((_, i) => (
                      <tr key={`skel-${i}`}>
                        {selectMode && <td style={{ width: 40 }}><div className="skeleton" style={{ height: 16, width: 16, borderRadius: 2, margin: '0 auto' }} /></td>}
                        {Array(7).fill(null).map((_, j) => (
                          <td key={`skel-cell-${j}`}><div className="skeleton" style={{ height: 12, borderRadius: 4 }} /></td>
                        ))}
                      </tr>
                    ))
                  : products.map(p => (
                      <tr key={p._id} className={selectMode && selectedIds.has(p._id) ? 'admin-row-selected' : ''}>
                        {selectMode && (
                          <td style={{ width: 40 }}>
                            <input type="checkbox"
                              checked={selectedIds.has(p._id)}
                              onChange={() => toggleSelect(p._id)}
                              style={{ cursor: 'pointer', accentColor: 'var(--ink)', width: 16, height: 16 }}
                            />
                          </td>
                        )}
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <img src={p.images?.[0]} alt={p.name} className="admin-product-img" />
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</div>
                              <div className="t-small">{p.rating}★ · {p.reviewCount?.toLocaleString()}</div>
                            </div>
                          </div>
                        </td>
                        <td>{p.category?.name}</td>
                        <td>
                          <span style={{ fontWeight: 600 }}>${p.price}</span>
                          {p.originalPrice && <span className="t-small" style={{ display: 'block', textDecoration: 'line-through' }}>${p.originalPrice}</span>}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                            {p.tags?.slice(0, 2).reduce((acc, t) => {
                              if (t) acc.push(<span key={t._id} className="badge" style={{ background: (t.color || '#888') + '22', color: t.color || '#888' }}>{t.name}</span>);
                              return acc;
                            }, [])}
                          </div>
                        </td>
                        <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                        <td>
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            {p.featured && <Icon name="star" size={12} stroke="#F5C842" fill="#F5C842" title="Featured" />}
                            {p.trending && <Icon name="trending" size={12} stroke="var(--amber)" title="Trending" />}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button className="btn btn-outline btn-sm" onClick={() => setEditProduct(p)} title="Edit">
                              <Icon name="edit" size={13} />
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)} disabled={deleting === p._id} title="Delete">
                              <Icon name="trash" size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
            <button className="btn btn-outline btn-sm" disabled={page === 1} onClick={() => loadProducts(page - 1)}>
              <Icon name="chevron-l" size={13} /> Prev
            </button>
            {Array.from({ length: pages }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => loadProducts(n)}
                style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--border)', background: n === page ? 'var(--ink)' : 'transparent', color: n === page ? 'white' : 'var(--ink)', fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'var(--transition)' }}>
                {n}
              </button>
            ))}
            <button className="btn btn-outline btn-sm" disabled={page === pages} onClick={() => loadProducts(page + 1)}>
              Next <Icon name="chevron-r" size={13} />
            </button>
          </div>
        )}
      </div>
      <VerificationModal
        isOpen={verification.isOpen}
        onClose={() => setVerification(v => ({ ...v, isOpen: false }))}
        onVerify={verification.onVerify}
        actionName={verification.actionName}
        isDelete={verification.isDelete}
      />
    </>
  );
}
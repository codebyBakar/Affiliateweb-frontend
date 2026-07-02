import { useState, useEffect } from 'react';
import Icon from '../../components/ui/Icon.jsx';
import { useCategories } from '../../hooks/useData.js';
import { api } from '../../utils/api.js';
import VerificationModal from '../../components/ui/VerificationModal.jsx';
import { AdminEmptyState } from '../../components/ui/EmptyState.jsx';
import { toast } from 'sonner';

export default function AdminCategories() {
  const { data: categories, error: categoriesError, refetch } = useCategories();
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', icon: '', image: '', featured: false });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [verification, setVerification] = useState({ isOpen: false, actionName: '', onVerify: null, isDelete: true });

  useEffect(() => {
    if (categoriesError) {
      toast.error(categoriesError || 'Failed to load categories');
    }
  }, [categoriesError]);

  const openAdd = () => { setForm({ name: '', description: '', icon: '', image: '', featured: false }); setEditItem(null); setShowForm(true); };
  const openEdit = (cat) => {
    setForm({ name: cat.name, description: cat.description || '', icon: cat.icon || '', image: cat.image || '', featured: cat.featured });
    setEditItem(cat);
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');

    if (editItem) {
      setVerification({
        isOpen: true,
        actionName: `Updating Category: ${form.name}`,
        isDelete: false,
        onVerify: async () => {
          setSaving(true);
          try {
            await api.updateCategory(editItem._id, form);
            toast.success(`Category "${form.name}" updated successfully!`);
            setShowForm(false);
            refetch();
          } catch (err) {
            setError(err.message);
            toast.error(err.message || 'Failed to update category');
          } finally {
            setSaving(false);
            setVerification(v => ({ ...v, isOpen: false }));
          }
        }
      });
    } else {
      setSaving(true);
      try {
        await api.createCategory(form);
        toast.success(`Category "${form.name}" created successfully!`);
        setShowForm(false);
        refetch();
      } catch (err) {
        setError(err.message);
        toast.error(err.message || 'Failed to create category');
      } finally {
        setSaving(false);
      }
    }
  };

  const handleDelete = (id) => {
    const cat = categories?.find(c => c._id === id);
    const categoryName = cat ? cat.name : 'this category';
    setVerification({
      isOpen: true,
      actionName: `Deleting Category: ${categoryName}`,
      isDelete: true,
      onVerify: async () => {
        try {
          await api.deleteCategory(id);
          toast.success(`Category "${categoryName}" deleted successfully!`);
          refetch();
        } catch (e) {
          alert(e.message);
          toast.error(e.message || 'Failed to delete category');
        } finally {
          setVerification(v => ({ ...v, isOpen: false }));
        }
      }
    });
  };

  return (
    <>
      <div className="admin-topbar">
        <div>
          <h1 className="t-h2">Categories</h1>
          <p className="t-small" style={{ marginTop: 4 }}>{categories?.length || 0} categories</p>
        </div>
        <button className="btn btn-primary btn-md" onClick={openAdd}>
          <Icon name="plus" size={16} stroke="white" /> Add Category
        </button>
      </div>

      {showForm && (
        <div className="admin-card">
          <div className="admin-card__header">
            <span className="admin-card__title">{editItem ? 'Edit Category' : 'New Category'}</span>
          </div>
          {error && <div style={{ background: 'var(--rose-light)', color: 'var(--rose)', padding: '10px 14px', borderRadius: 'var(--radius)', marginBottom: 16, fontFamily: 'var(--font-ui)', fontSize: 13 }}>{error}</div>}
          <form onSubmit={handleSave} className="admin-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="e.g. Skincare" />
              </div>
              <div className="form-group">
                <label className="form-label">Icon</label>
                <input className="form-input" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="e.g. grid, image, package" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <input className="form-input" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Short category description" />
            </div>
            <div className="form-group">
              <label className="form-label">Category Image</label>
              {form.image ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <img src={form.image} alt="preview" style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)' }} />
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => setForm(f => ({ ...f, image: '' }))}>Remove</button>
                </div>
              ) : (
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 'var(--radius)', border: '1px dashed var(--border-md)', cursor: 'pointer', background: 'var(--mist)' }}>
                  <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}>Select Image File</span>
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const res = await api.uploadImage(file);
                      setForm(f => ({ ...f, image: res.url }));
                    } catch (err) {
                      alert(`Upload failed: ${err.message}`);
                    }
                  }} />
                </label>
              )}
            </div>
            <label className="checkbox-group">
              <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} />
              <span>Featured Category</span>
            </label>
            <div className="form-actions">
              <button type="button" className="btn btn-outline btn-md" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-md" disabled={saving}>{saving ? 'Saving...' : editItem ? 'Update' : 'Create'}</button>
            </div>
          </form>
        </div>
      )}

      {categoriesError && (
        <AdminEmptyState
          type="categories"
          hasError={true}
          actionLabel="Retry"
          onAction={refetch}
        />
      )}
      {!categoriesError && (!categories || categories.length === 0) && (
        <AdminEmptyState
          type="categories"
          hasError={false}
          actionLabel="Add Category"
          onAction={() => { setForm({ name: '', description: '', icon: '', image: '', featured: false }); setEditItem(null); setShowForm(true); }}
        />
      )}
      {!categoriesError && categories && categories.length > 0 && (
        <div className="admin-card">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Category</th><th>Slug</th><th>Description</th><th>Featured</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {categories.map(cat => (
                  <tr key={cat._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {cat.image
                          ? <img src={cat.image} alt={cat.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                          : <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--nude)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{cat.icon}</div>
                        }
                        <span style={{ fontWeight: 600 }}>{cat.name}</span>
                      </div>
                    </td>
                    <td><code style={{ fontFamily: 'monospace', fontSize: 12, background: 'var(--mist)', padding: '2px 8px', borderRadius: 4 }}>{cat.slug}</code></td>
                    <td className="t-small">{cat.description || '—'}</td>
                    <td>{cat.featured ? <Icon name="star" size={12} stroke="#F5C842" fill="#F5C842" /> : '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-outline btn-sm" onClick={() => openEdit(cat)}><Icon name="edit" size={13} /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(cat._id)}><Icon name="trash" size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
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

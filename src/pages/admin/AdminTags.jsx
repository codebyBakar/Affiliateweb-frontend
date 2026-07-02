import { useState, useEffect } from 'react';
import Icon from '../../components/ui/Icon.jsx';
import { useTags } from '../../hooks/useData.js';
import { api } from '../../utils/api.js';
import VerificationModal from '../../components/ui/VerificationModal.jsx';
import { AdminEmptyState } from '../../components/ui/EmptyState.jsx';
import { toast } from 'sonner';

const COLOR_PRESETS = ['#BFA492','#8FA89A','#D4A5A0','#2D2B30','#F5C842','#9CB5C7','#C4A882','#B5A4BF'];

export default function AdminTags() {
  const { data: tags, error: tagsError, refetch } = useTags();
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', color: '#BFA492' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [verification, setVerification] = useState({ isOpen: false, actionName: '', onVerify: null, isDelete: true });

  useEffect(() => {
    if (tagsError) {
      toast.error(tagsError || 'Failed to load tags');
    }
  }, [tagsError]);

  const openAdd = () => { setForm({ name: '', color: '#BFA492' }); setEditItem(null); setShowForm(true); };
  const openEdit = (tag) => { setForm({ name: tag.name, color: tag.color }); setEditItem(tag); setShowForm(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');

    if (editItem) {
      setVerification({
        isOpen: true,
        actionName: `Updating Tag: ${form.name}`,
        isDelete: false,
        onVerify: async () => {
          setSaving(true);
          try {
            await api.updateTag(editItem._id, form);
            toast.success(`Tag "${form.name}" updated successfully!`);
            setShowForm(false);
            refetch();
          } catch (err) {
            setError(err.message);
            toast.error(err.message || 'Failed to update tag');
          } finally {
            setSaving(false);
            setVerification(v => ({ ...v, isOpen: false }));
          }
        }
      });
    } else {
      setSaving(true);
      try {
        await api.createTag(form);
        toast.success(`Tag "${form.name}" created successfully!`);
        setShowForm(false);
        refetch();
      } catch (err) {
        setError(err.message);
        toast.error(err.message || 'Failed to create tag');
      } finally {
        setSaving(false);
      }
    }
  };

  const handleDelete = (id) => {
    const tag = tags?.find(t => t._id === id);
    const tagName = tag ? tag.name : 'this tag';
    setVerification({
      isOpen: true,
      actionName: `Deleting Tag: ${tagName}`,
      isDelete: true,
      onVerify: async () => {
        try {
          await api.deleteTag(id);
          toast.success(`Tag "${tagName}" deleted successfully!`);
          refetch();
        } catch (e) {
          alert(e.message);
          toast.error(e.message || 'Failed to delete tag');
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
          <h1 className="t-h2">Tags</h1>
          <p className="t-small" style={{ marginTop: 4 }}>{tags?.length || 0} tags</p>
        </div>
        <button className="btn btn-primary btn-md" onClick={openAdd}>
          <Icon name="plus" size={16} stroke="white" /> Add Tag
        </button>
      </div>

      {showForm && (
        <div className="admin-card">
          <div className="admin-card__header">
            <span className="admin-card__title">{editItem ? 'Edit Tag' : 'New Tag'}</span>
          </div>
          {error && <div style={{ background: 'var(--rose-light)', color: 'var(--rose)', padding: '10px 14px', borderRadius: 'var(--radius)', marginBottom: 16, fontFamily: 'var(--font-ui)', fontSize: 13 }}>{error}</div>}
          <form onSubmit={handleSave} className="admin-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Tag Name *</label>
                <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="e.g. Bestseller" />
              </div>
              <div className="form-group">
                <label className="form-label">Color</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  {COLOR_PRESETS.map(c => (
                    <div key={c} onClick={() => setForm(f => ({ ...f, color: c }))}
                      style={{ width: 28, height: 28, borderRadius: '50%', background: c, cursor: 'pointer', border: form.color === c ? '3px solid var(--ink)' : '2px solid transparent', transition: 'var(--transition)' }} />
                  ))}
                  <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                    style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--border)', cursor: 'pointer', padding: 2 }} />
                </div>
              </div>
            </div>

            {/* Preview */}
            <div>
              <div className="form-label" style={{ marginBottom: 8 }}>Preview</div>
              <span className="badge" style={{ background: form.color + '22', color: form.color }}>
                {form.name || 'Tag Preview'}
              </span>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-outline btn-md" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-md" disabled={saving}>{saving ? 'Saving...' : editItem ? 'Update' : 'Create'}</button>
            </div>
          </form>
        </div>
      )}

      {tagsError && (
        <AdminEmptyState
          type="tags"
          hasError={true}
          actionLabel="Retry"
          onAction={refetch}
        />
      )}
      {!tagsError && (!tags || tags.length === 0) && (
        <AdminEmptyState
          type="tags"
          hasError={false}
          actionLabel="Add Tag"
          onAction={() => { setForm({ name: '', color: '#BFA492' }); setEditItem(null); setShowForm(true); }}
        />
      )}
      {!tagsError && tags && tags.length > 0 && (
        <>
          <div className="admin-card">
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {tags.map(tag => (
                <div key={tag._id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: tag.color, flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 500 }}>{tag.name}</span>
                  <code style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--muted)' }}>{tag.slug}</code>
                  <div style={{ display: 'flex', gap: 4, marginLeft: 4 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(tag)} style={{ padding: '4px' }}><Icon name="edit" size={13} stroke="var(--muted)" /></button>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(tag._id)} style={{ padding: '4px' }}><Icon name="trash" size={13} stroke="var(--rose)" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tag usage table */}
          <div className="admin-card">
            <div className="admin-card__header">
              <span className="admin-card__title">All Tags</span>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th>Tag</th><th>Slug</th><th>Color</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {tags.map(tag => (
                    <tr key={tag._id}>
                      <td>
                        <span className="badge" style={{ background: tag.color + '22', color: tag.color }}>{tag.name}</span>
                      </td>
                      <td><code style={{ fontFamily: 'monospace', fontSize: 12, background: 'var(--mist)', padding: '2px 8px', borderRadius: 4 }}>{tag.slug}</code></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 20, height: 20, borderRadius: '50%', background: tag.color }} />
                          <span className="t-small">{tag.color}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-outline btn-sm" onClick={() => openEdit(tag)}><Icon name="edit" size={13} /></button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(tag._id)}><Icon name="trash" size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
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

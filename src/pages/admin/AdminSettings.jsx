import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useSiteSettings } from '../../context/SiteSettingsContext.jsx';
import Icon from '../../components/ui/Icon.jsx';
import { api } from '../../utils/api.js';
import VerificationModal from '../../components/ui/VerificationModal.jsx';
import { toast } from 'sonner';

export default function AdminSettings() {
  const { user } = useAuth();
  const { settings, updateSettings, refetch } = useSiteSettings();
  const [siteForm, setSiteForm] = useState({ siteName: '', tagline: '', logo: '', amazonId: '', aliexpressId: '', ebayId: '', heroBadgeText: '', heroBoxImage: '', heroBoxTitle: '', heroBoxDescription: '' });
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '', password: '', confirmPassword: '' });
  const [saved, setSaved] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verification, setVerification] = useState({ isOpen: false, actionName: '', onVerify: null, isDelete: false });

  useEffect(() => {
    if (settings) {
      setSiteForm({
        siteName: settings.siteName || '',
        tagline: settings.tagline || '',
        logo: settings.logo || '',
        amazonId: settings.amazonId || '',
        aliexpressId: settings.aliexpressId || '',
        ebayId: settings.ebayId || '',
        heroBadgeText: settings.heroBadgeText || '',
        heroBoxImage: settings.heroBoxImage || '',
        heroBoxTitle: settings.heroBoxTitle || '',
        heroBoxDescription: settings.heroBoxDescription || '',
      });
    }
  }, [settings]);

  const handleSiteSave = (e) => {
    e.preventDefault();
    setVerification({
      isOpen: true,
      actionName: 'Updating Site Settings',
      isDelete: false,
      onVerify: async () => {
        setSaving(true);
        try {
          await updateSettings(siteForm);
          setSaved('site');
          toast.success('Site settings updated successfully!');
          setTimeout(() => setSaved(''), 2500);
          refetch();
        } catch (err) {
          toast.error(err.message || 'Failed to update site settings');
        } finally {
          setSaving(false);
          setVerification(v => ({ ...v, isOpen: false }));
        }
      }
    });
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    if (profileForm.password && profileForm.password !== profileForm.confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }
    setVerification({
      isOpen: true,
      actionName: profileForm.password ? 'Changing Password & Profile' : 'Updating Admin Profile',
      isDelete: false,
      onVerify: async () => {
        setSaving(true);
        setError('');
        try {
          await api.updateProfile({ name: profileForm.name, email: profileForm.email, ...(profileForm.password ? { password: profileForm.password } : {}) });
          setSaved('profile');
          toast.success(profileForm.password ? 'Password & profile updated!' : 'Profile updated successfully!');
          setProfileForm(f => ({ ...f, password: '', confirmPassword: '' }));
          setTimeout(() => setSaved(''), 2500);
        } catch (err) {
          setError(err.message);
          toast.error(err.message || 'Failed to update profile');
        } finally {
          setSaving(false);
          setVerification(v => ({ ...v, isOpen: false }));
        }
      }
    });
  };

  const SavedBadge = () => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: 'var(--sage-light)', color: 'var(--sage)', borderRadius: 999, fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600 }}>
      <Icon name="check" size={12} stroke="var(--sage)" /> Saved!
    </span>
  );

  return (
    <>
      <div className="admin-topbar">
        <h1 className="t-h2">Settings</h1>
      </div>

      {/* Site Settings */}
      <div className="admin-card">
        <div className="admin-card__header">
          <span className="admin-card__title">Site Settings</span>
          {saved === 'site' && <SavedBadge />}
        </div>
        <form onSubmit={handleSiteSave} className="admin-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Site Name</label>
              <input className="form-input" value={siteForm.siteName} onChange={e => setSiteForm(f => ({ ...f, siteName: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Tagline</label>
              <input className="form-input" value={siteForm.tagline} onChange={e => setSiteForm(f => ({ ...f, tagline: e.target.value }))} />
            </div>
          </div>
          <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Site Logo</p>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Logo Image</label>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <label style={{ width: 120, height: 50, borderRadius: 'var(--radius)', border: '1px dashed var(--border-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'var(--mist)', transition: 'var(--transition)', flexShrink: 0 }} className="upload-box-hover">
                  <span style={{ fontSize: 20, color: 'var(--muted)' }}>{uploading ? '...' : '+'}</span>
                  <span style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 600, marginTop: 4 }}>{uploading ? 'Uploading' : 'Upload'}</span>
                  <input type="file" accept="image/*" style={{ display: 'none' }} disabled={uploading} onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploading(true);
                    try {
                      const result = await api.uploadToCloudinary(file, 'bellezza/settings');
                      setSiteForm(f => ({ ...f, logo: result.url }));
                      toast.success('Logo uploaded!');
                    } catch (err) {
                      toast.error('Upload failed: ' + err.message);
                    } finally {
                      setUploading(false);
                    }
                  }} />
                </label>
                {siteForm.logo && (
                  <div style={{ width: 120, height: 50, borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)', flexShrink: 0, position: 'relative' }}>
                    <img src={siteForm.logo} alt="Logo preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    <button type="button" onClick={() => setSiteForm(f => ({ ...f, logo: '' }))}
                      style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 12, fontWeight: 'bold', color: 'var(--rose)' }}>
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Affiliate IDs</p>
          {/* <div className="form-row-3">
            <div className="form-group">
              <label className="form-label">Amazon Affiliate ID</label>
              <input className="form-input" value={siteForm.amazonId} onChange={e => setSiteForm(f => ({ ...f, amazonId: e.target.value }))} placeholder="your-id-20" />
            </div>
            <div className="form-group">
              <label className="form-label">AliExpress Affiliate ID</label>
              <input className="form-input" value={siteForm.aliexpressId} onChange={e => setSiteForm(f => ({ ...f, aliexpressId: e.target.value }))} placeholder="affiliate_id" />
            </div>
            <div className="form-group">
              <label className="form-label">eBay Affiliate ID</label>
              <input className="form-input" value={siteForm.ebayId} onChange={e => setSiteForm(f => ({ ...f, ebayId: e.target.value }))} placeholder="campaign_id" />
            </div>
          </div> */}
          <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Hero Section — Badge</p>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Badge Text</label>
              <input className="form-input" value={siteForm.heroBadgeText} onChange={e => setSiteForm(f => ({ ...f, heroBadgeText: e.target.value }))} placeholder="New arrivals in K-Beauty" />
            </div>
          </div>
          <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Hero Section — Floating Card</p>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Product Image</label>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <label style={{ width: 90, height: 120, borderRadius: 'var(--radius)', border: '1px dashed var(--border-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'var(--mist)', transition: 'var(--transition)', flexShrink: 0 }} className="upload-box-hover">
                  <span style={{ fontSize: 20, color: 'var(--muted)' }}>{uploading ? '...' : '+'}</span>
                  <span style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 600, marginTop: 4 }}>{uploading ? 'Uploading' : 'Upload'}</span>
                  <input type="file" accept="image/*" style={{ display: 'none' }} disabled={uploading} onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploading(true);
                    try {
                      const result = await api.uploadToCloudinary(file, 'bellezza/settings');
                      setSiteForm(f => ({ ...f, heroBoxImage: result.url }));
                      toast.success('Hero image uploaded!');
                    } catch (err) {
                      toast.error('Upload failed: ' + err.message);
                    } finally {
                      setUploading(false);
                    }
                  }} />
                </label>
                {siteForm.heroBoxImage && (
                  <div style={{ width: 90, height: 120, borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)', flexShrink: 0, position: 'relative' }}>
                    <img src={siteForm.heroBoxImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button type="button" onClick={() => setSiteForm(f => ({ ...f, heroBoxImage: '' }))}
                      style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 12, fontWeight: 'bold', color: 'var(--rose)' }}>
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Description</label>
              <input className="form-input" value={siteForm.heroBoxDescription} onChange={e => setSiteForm(f => ({ ...f, heroBoxDescription: e.target.value }))} placeholder="Best seller this week" />
            </div>

            <div className="form-group">
              <label className="form-label">Product Title</label>
              <input className="form-input" value={siteForm.heroBoxTitle} onChange={e => setSiteForm(f => ({ ...f, heroBoxTitle: e.target.value }))} placeholder="Glow Serum Pro" />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-md">Save Site Settings</button>
          </div>
        </form>
      </div>

      {/* Profile */}
      <div className="admin-card">
        <div className="admin-card__header">
          <span className="admin-card__title">Admin Profile</span>
          {saved === 'profile' && <SavedBadge />}
        </div>
        {error && <div style={{ background: 'var(--rose-light)', color: 'var(--rose)', padding: '10px 14px', borderRadius: 'var(--radius)', marginBottom: 16, fontFamily: 'var(--font-ui)', fontSize: 13 }}>{error}</div>}
        <form onSubmit={handleProfileSave} className="admin-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" value={profileForm.name} onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" value={profileForm.email} onChange={e => setProfileForm(f => ({ ...f, email: e.target.value }))} />
            </div>
          </div>
          <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Change Password</p>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="form-input"
                  type={showPassword ? 'text' : 'password'}
                  value={profileForm.password}
                  onChange={e => setProfileForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Leave blank to keep current"
                  style={{ paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    color: 'var(--muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  <Icon name={showPassword ? 'eye-off' : 'eye'} size={18} />
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="form-input"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={profileForm.confirmPassword}
                  onChange={e => setProfileForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  placeholder="Repeat new password"
                  style={{ paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    color: 'var(--muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  <Icon name={showConfirmPassword ? 'eye-off' : 'eye'} size={18} />
                </button>
              </div>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-md" disabled={saving}>
              {saving ? 'Saving...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>

      {/* About */}
      <div className="admin-card">
        <div className="admin-card__header">
          <span className="admin-card__title">About This Installation</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16 }}>
          {[
            { label: 'Version', value: 'v1.0.0' },
            { label: 'Framework', value: 'React + Vite' },
            { label: 'Backend', value: 'Node.js + Express' },
            { label: 'Database', value: 'MongoDB + Mongoose' },
          ].map(item => (
            <div key={item.label} style={{ padding: 16, background: 'var(--canvas)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div className="t-label" style={{ marginBottom: 6 }}>{item.label}</div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 600 }}>{item.value}</div>
            </div>
          ))}
        </div>
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
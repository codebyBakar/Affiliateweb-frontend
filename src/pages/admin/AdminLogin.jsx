import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useSiteSettings } from '../../context/SiteSettingsContext.jsx';
import Icon from '../../components/ui/Icon.jsx';
import { toast } from 'sonner';

const EMAIL_RX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const SANITIZE_RX = /<[^>]*>/g;

function sanitize(str) {
  return String(str).replace(SANITIZE_RX, '').trim();
}

function validateEmail(email) {
  if (!email) return 'Email is required';
  if (email.length > 254) return 'Email address is too long';
  if (!EMAIL_RX.test(email)) return 'Please enter a valid email address';
  return '';
}

function validatePassword(password) {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (password.length > 128) return 'Password is too long';
  return '';
}

function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 15;
  if (/[a-z]/.test(password)) score += 15;
  if (/[A-Z]/.test(password)) score += 15;
  if (/[0-9]/.test(password)) score += 15;
  if (/[^a-zA-Z0-9]/.test(password)) score += 20;
  return Math.min(score, 100);
}

function getStrengthLabel(score) {
  if (score < 30) return { label: 'Weak', color: 'var(--rose)' };
  if (score < 60) return { label: 'Fair', color: 'var(--clay)' };
  if (score < 80) return { label: 'Good', color: 'var(--clay-deep)' };
  return { label: 'Strong', color: 'var(--success)' };
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { settings } = useSiteSettings();
  const siteName = settings?.siteName || 'BEAUTY-HOUSE';

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  const submitRef = useRef(null);

  const handleChange = useCallback((field, value) => {
    const cleaned = sanitize(value);
    setForm(prev => ({ ...prev, [field]: cleaned }));
    if (touched[field]) {
      const err = field === 'email' ? validateEmail(cleaned) : validatePassword(cleaned);
      setErrors(prev => ({ ...prev, [field]: err }));
    }
  }, [touched]);

  const handleBlur = useCallback((field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const value = form[field];
    const err = field === 'email' ? validateEmail(value) : validatePassword(value);
    setErrors(prev => ({ ...prev, [field]: err }));
  }, [form]);

  const isFormValid = () => {
    const emailErr = validateEmail(form.email);
    const passErr = validatePassword(form.password);
    setErrors({ email: emailErr, password: passErr });
    setTouched({ email: true, password: true });
    return !emailErr && !passErr;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (lockoutTimer > 0) return;

    if (!isFormValid()) return;

    setLoading(true);
    try {
      await login(form.email, form.password);
      setFailedAttempts(0);
      toast.success('Signed in successfully!');
      navigate('/admin');
    } catch (err) {
      const msg = err.message || 'Invalid email or password';
      setServerError(msg);
      toast.error(msg);

      const newCount = failedAttempts + 1;
      setFailedAttempts(newCount);

      if (newCount >= 3) {
        let countdown = 30;
        setLockoutTimer(countdown);
        const interval = setInterval(() => {
          countdown -= 1;
          setLockoutTimer(countdown);
          if (countdown <= 0) {
            clearInterval(interval);
            setLockoutTimer(0);
            setFailedAttempts(0);
          }
        }, 1000);
      }
    } finally {
      setLoading(false);
    }
  };

  const passwordScore = form.password ? getPasswordStrength(form.password) : 0;
  const strength = form.password ? getStrengthLabel(passwordScore) : null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--canvas)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 32, fontWeight: 600, marginBottom: 8 }}>{siteName}</div>
          <p className="t-small">Admin Dashboard</p>
        </div>

        <div style={{ background: 'var(--snow)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 36 }}>
          <h2 className="t-h3" style={{ marginBottom: 24 }}>Sign In</h2>

          {serverError && (
            <div style={{
              background: 'var(--rose-light)',
              border: '1px solid var(--rose)',
              borderRadius: 'var(--radius)',
              padding: '12px 16px',
              marginBottom: 20,
              fontFamily: 'var(--font-ui)',
              fontSize: 13,
              color: 'var(--rose)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
            }}>
              <Icon name="alert-circle" size={16} stroke="var(--rose)" style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{serverError}</span>
            </div>
          )}
          {lockoutTimer > 0 && !serverError && (
            <div style={{
              background: 'var(--rose-light)',
              border: '1px solid var(--rose)',
              borderRadius: 'var(--radius)',
              padding: '12px 16px',
              marginBottom: 20,
              fontFamily: 'var(--font-ui)',
              fontSize: 13,
              color: 'var(--rose)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <Icon name="alert-triangle" size={16} stroke="var(--rose)" style={{ flexShrink: 0 }} />
              <span>Too many attempts. Retry in <strong>{lockoutTimer}s</strong></span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                className="form-input"
                type="email"
                placeholder="admin@example.com"
                value={form.email}
                onChange={e => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                required
                autoComplete="email"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                aria-invalid={touched.email && errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
                style={{
                  borderColor: touched.email && errors.email ? 'var(--rose)' : undefined,
                }}
              />
              {touched.email && errors.email && (
                <div id="email-error" role="alert" style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: 11,
                  color: 'var(--rose)',
                  marginTop: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}>
                  <Icon name="alert-circle" size={10} stroke="var(--rose)" />
                  {errors.email}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  className="form-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
                  value={form.password}
                  onChange={e => handleChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  required
                  autoComplete="current-password"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  aria-invalid={touched.password && errors.password ? 'true' : 'false'}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  style={{
                    paddingRight: 40,
                    borderColor: touched.password && errors.password ? 'var(--rose)' : undefined,
                  }}
                  maxLength={128}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
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
                    justifyContent: 'center',
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  <Icon name={showPassword ? 'eye-off' : 'eye'} size={18} />
                </button>
              </div>
              {touched.password && errors.password && (
                <div id="password-error" role="alert" style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: 11,
                  color: 'var(--rose)',
                  marginTop: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}>
                  <Icon name="alert-circle" size={10} stroke="var(--rose)" />
                  {errors.password}
                </div>
              )}
              {form.password && !errors.password && (
                <div style={{ marginTop: 8 }}>
                  <div style={{
                    height: 4,
                    borderRadius: 2,
                    background: 'var(--border)',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: '100%',
                      borderRadius: 2,
                      background: strength?.color || 'var(--border)',
                      transform: `scaleX(${passwordScore / 100})`,
                      transformOrigin: 'left',
                      transition: 'transform 0.3s ease, background 0.3s ease',
                    }} />
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: 10,
                    color: strength?.color || 'var(--muted)',
                    marginTop: 3,
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                  }}>
                    Password strength: {strength?.label || ''}
                  </div>
                </div>
              )}
            </div>

            <button
              ref={submitRef}
              type="submit"
              className="btn btn-primary btn-lg btn-full"
              disabled={loading || lockoutTimer > 0}
              style={{ marginTop: 4 }}
            >
              {loading ? 'Signing in...' : lockoutTimer > 0 ? `Wait ${lockoutTimer}s` : 'Sign In'}
            </button>
          </form>

          <div style={{
            marginTop: 24,
            paddingTop: 20,
            borderTop: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'center',
          }}>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.04em' }}>
              Secured with end-to-end encryption
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

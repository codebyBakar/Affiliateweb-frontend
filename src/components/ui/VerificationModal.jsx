import { useEffect, useRef } from 'react';
import Icon from './Icon.jsx';

export default function VerificationModal({
  isOpen,
  onClose,
  onVerify,
  actionName = 'perform this action',
  isDelete = false,
  confirmText = ''
}) {
  const confirmButtonRef = useRef(null);

  // Auto-focus the confirm button for keyboard navigation accessibility
  useEffect(() => {
    if (isOpen && confirmButtonRef.current) {
      setTimeout(() => {
        confirmButtonRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Dynamically generate confirm button text based on the action name
  const getConfirmButtonText = () => {
    if (confirmText) return confirmText;
    const lowerAction = actionName.toLowerCase();
    if (lowerAction.includes('delete')) {
      return 'Yes, Delete';
    }
    if (lowerAction.includes('site settings')) {
      return 'Yes, Save Settings';
    }
    if (lowerAction.includes('profile') || lowerAction.includes('password')) {
      return 'Yes, Update Profile';
    }
    return 'Yes, Proceed';
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    onVerify();
  };

  return (
    <>
      {/* Dynamic Keyframes Injection */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-scale-in {
          animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      ` }} />

      {/* MODAL BACKDROP */}
      <div 
        className="animate-fade-in"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(45, 43, 48, 0.4)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10500,
          padding: 20
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {/* MODAL BOX */}
        <div 
          className="animate-scale-in"
          style={{
            background: 'var(--snow)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '36px 32px',
            width: '100%',
            maxWidth: 420,
            boxShadow: 'var(--shadow-lg)',
            textAlign: 'center',
            position: 'relative'
          }}
        >
          {/* Circular Action Icon Header */}
          <div style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: isDelete ? 'var(--rose-light)' : 'var(--sage-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: isDelete ? 'var(--rose)' : 'var(--sage)',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
          }}>
            {isDelete ? (
              <Icon name="trash" size={26} stroke="var(--rose)" />
            ) : (
              <Icon name="shield" size={26} stroke="var(--sage)" />
            )}
          </div>

          <h3 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 22,
            fontWeight: 500,
            color: 'var(--ink)',
            margin: '0 0 10px 0'
          }}>
            Confirm Action
          </h3>

          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 14,
            color: 'var(--muted)',
            lineHeight: 1.5,
            margin: '0 0 20px 0'
          }}>
            Are you sure you want to proceed with this action?
          </p>

          {/* Action Details Card */}
          <div style={{
            background: 'var(--canvas)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 18px',
            marginBottom: 24,
            textAlign: 'left'
          }}>
            <div style={{
              fontSize: 10,
              fontWeight: 600,
              color: 'var(--muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 6
            }}>
              Action Details
            </div>
            <div style={{
              fontSize: 13,
              fontWeight: 600,
              color: isDelete ? 'var(--rose)' : 'var(--ink)',
              lineHeight: 1.4
            }}>
              {actionName}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: 12
          }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
              style={{
                flex: 1,
                padding: '12px 20px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
                fontSize: 12,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>

            <button
              ref={confirmButtonRef}
              type="button"
              onClick={handleConfirm}
              className="btn"
              style={{
                flex: 1,
                padding: '12px 20px',
                borderRadius: 'var(--radius-full)',
                background: isDelete ? 'var(--rose)' : 'var(--ink)',
                color: '#fff',
                border: 'none',
                fontWeight: 600,
                fontSize: 12,
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              {getConfirmButtonText()}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

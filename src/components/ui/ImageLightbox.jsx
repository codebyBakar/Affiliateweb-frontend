import { useState, useEffect, useCallback, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import Icon from './Icon.jsx';

export default function ImageLightbox({ images, activeIndex, onClose }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(activeIndex);
  const overlayRef = useRef(null);
  const dragRef = useRef({ startX: 0, startY: 0, posX: 0, posY: 0 });
  const touchRef = useRef({ lastDist: null, startX: 0, startY: 0, posX: 0, posY: 0 });

  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [currentIndex]);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    setScale(prev => Math.max(1, Math.min(6, prev + delta)));
  }, []);

  const handleMouseDown = (e) => {
    if (scale <= 1) return;
    setIsDragging(true);
    dragRef.current.startX = e.clientX - position.x;
    dragRef.current.startY = e.clientY - position.y;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragRef.current.startX,
      y: e.clientY - dragRef.current.startY
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleDoubleClick = (e) => {
    if (scale > 1) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    } else {
      setScale(2.5);
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setPosition({
        x: -(x - 0.5) * rect.width * 0.6,
        y: -(y - 0.5) * rect.height * 0.6
      });
    }
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchRef.current.lastDist = Math.hypot(dx, dy);
    } else if (e.touches.length === 1 && scale > 1) {
      setIsDragging(true);
      touchRef.current.startX = e.touches[0].clientX - position.x;
      touchRef.current.startY = e.touches[0].clientY - position.y;
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      if (touchRef.current.lastDist) {
        setScale(prev => Math.max(1, Math.min(6, prev * (dist / touchRef.current.lastDist))));
      }
      touchRef.current.lastDist = dist;
    } else if (isDragging && scale > 1 && e.touches.length === 1) {
      setPosition({
        x: e.touches[0].clientX - touchRef.current.startX,
        y: e.touches[0].clientY - touchRef.current.startY
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchRef.current.lastDist = null;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setCurrentIndex(prev => Math.max(0, prev - 1));
      if (e.key === 'ArrowRight') setCurrentIndex(prev => Math.min(images.length - 1, prev + 1));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length, onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const atStart = currentIndex === 0;
  const atEnd = currentIndex === images.length - 1;

  return (
    <AnimatePresence>
      <m.div
        ref={overlayRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.92)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          touchAction: scale > 1 ? 'none' : 'auto'
        }}
        onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
        onWheel={handleWheel}
      >
        <button onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16, zIndex: 10,
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(8px)'
          }}>
          <Icon name="close" size={20} stroke="white" />
        </button>

        {images.length > 1 && !atStart && (
          <button onClick={(e) => { e.stopPropagation(); setCurrentIndex(prev => prev - 1); }}
            style={{
              position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', zIndex: 10,
              width: 44, height: 44, borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(8px)'
            }}>
            <Icon name="chevron-l" size={22} stroke="white" />
          </button>
        )}

        {images.length > 1 && !atEnd && (
          <button onClick={(e) => { e.stopPropagation(); setCurrentIndex(prev => prev + 1); }}
            style={{
              position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', zIndex: 10,
              width: 44, height: 44, borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(8px)'
            }}>
            <Icon name="chevron-r" size={22} stroke="white" />
          </button>
        )}

        {images.length > 1 && (
          <div style={{
            position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-ui)', fontSize: 13,
            background: 'rgba(0,0,0,0.4)', padding: '6px 14px', borderRadius: 999,
            backdropFilter: 'blur(8px)'
          }}>
            {currentIndex + 1} / {images.length}
          </div>
        )}

        <m.div
          key={currentIndex}
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300, mass: 0.8 }}
          style={{
            maxWidth: '90vw', maxHeight: '90vh',
            cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'pointer',
            userSelect: 'none', WebkitUserSelect: 'none',
            overflow: 'hidden'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onDoubleClick={handleDoubleClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={images[currentIndex]}
            alt=""
            draggable={false}
            style={{
              display: 'block',
              maxWidth: '90vw', maxHeight: '90vh',
              objectFit: 'contain',
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.2s ease-out'
            }}
          />
        </m.div>

        <div style={{
          position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: 6, alignItems: 'center',
          background: 'rgba(255,255,255,0.1)',
          padding: '8px 14px', borderRadius: 999,
          backdropFilter: 'blur(8px)'
        }}>
          <button onClick={(e) => { e.stopPropagation(); setScale(s => Math.max(1, s - 0.5)); }}
            style={{ background: 'none', border: 'none', cursor: scale > 1 ? 'pointer' : 'default', color: 'white', padding: '4px', display: 'flex', opacity: scale <= 1 ? 0.4 : 1 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35M8 11h6" />
            </svg>
          </button>
          <span style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-ui)', fontSize: 11, minWidth: 34, textAlign: 'center' }}>
            {Math.round(scale * 100)}%
          </span>
          <button onClick={(e) => { e.stopPropagation(); setScale(s => Math.min(6, s + 0.5)); }}
            style={{ background: 'none', border: 'none', cursor: scale < 6 ? 'pointer' : 'default', color: 'white', padding: '4px', display: 'flex', opacity: scale >= 6 ? 0.4 : 1 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35M8 11h6M11 8v6" />
            </svg>
          </button>
          <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.15)', margin: '0 4px' }} />
          <button onClick={(e) => { e.stopPropagation(); setScale(1); setPosition({ x: 0, y: 0 }); }}
            style={{ background: 'none', border: 'none', cursor: scale !== 1 ? 'pointer' : 'default', color: 'rgba(255,255,255,0.6)', fontSize: 11, fontFamily: 'var(--font-ui)', padding: '4px 6px', opacity: scale === 1 ? 0.4 : 1 }}>
            Reset
          </button>
        </div>
      </m.div>
    </AnimatePresence>
  );
}

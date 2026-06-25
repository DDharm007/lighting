import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './BubbleMenu.css';

const DEFAULT_ITEMS = [
  { id: '1', label: 'home',     href: '#', ariaLabel: 'Home',     rotation: -8, hoverBgColor: '#3b82f6', hoverTextColor: '#ffffff' },
  { id: '2', label: 'about',    href: '#', ariaLabel: 'About',    rotation:  8, hoverBgColor: '#10b981', hoverTextColor: '#ffffff' },
  { id: '3', label: 'projects', href: '#', ariaLabel: 'Projects', rotation:  8, hoverBgColor: '#f59e0b', hoverTextColor: '#ffffff' },
  { id: '4', label: 'blog',     href: '#', ariaLabel: 'Blog',     rotation:  8, hoverBgColor: '#ef4444', hoverTextColor: '#ffffff' },
  { id: '5', label: 'contact',  href: '#', ariaLabel: 'Contact',  rotation: -8, hoverBgColor: '#8b5cf6', hoverTextColor: '#ffffff' },
];

export default function BubbleMenu({
  logo = 'Logo',
  onMenuClick,
  className = '',
  style = {},
  menuAriaLabel = 'Toggle menu',
  menuBg = '#ffffff',
  menuContentColor = '#111111',
  useFixedPosition = false,
  items,
  animationEase = 'back.out(1.5)',
  animationDuration = 0.5,
  staggerDelay = 0.12,
  onItemClick,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const overlayRef = useRef(null);
  const bubblesRef = useRef([]);
  const labelRefs = useRef([]);

  const menuItems = items?.length ? items : DEFAULT_ITEMS;

  const containerClassName = [
    'bubble-menu',
    useFixedPosition ? 'fixed' : 'absolute',
    className,
  ].filter(Boolean).join(' ');

  const handleToggle = () => {
    const next = !isMenuOpen;
    if (next) setShowOverlay(true);
    setIsMenuOpen(next);
    onMenuClick?.(next);
  };

  useEffect(() => {
    const overlay = overlayRef.current;
    const bubbles = bubblesRef.current.filter(Boolean);
    const labels = labelRefs.current.filter(Boolean);
    if (!overlay || !bubbles.length) return;

    if (isMenuOpen) {
      gsap.set(overlay, { display: 'flex' });
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.set(bubbles, { scale: 0, transformOrigin: '50% 50%' });
      gsap.set(labels, { y: 24, autoAlpha: 0 });

      bubbles.forEach((bubble, i) => {
        const delay = i * staggerDelay + gsap.utils.random(-0.05, 0.05);
        const tl = gsap.timeline({ delay });
        tl.to(bubble, { scale: 1, duration: animationDuration, ease: animationEase });
        if (labels[i]) {
          tl.to(labels[i], { y: 0, autoAlpha: 1, duration: animationDuration, ease: 'power3.out' }, `-=${animationDuration * 0.9}`);
        }
      });
    } else if (showOverlay) {
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.to(labels, { y: 24, autoAlpha: 0, duration: 0.2, ease: 'power3.in' });
      gsap.to(bubbles, {
        scale: 0, duration: 0.2, ease: 'power3.in',
        onComplete: () => { gsap.set(overlay, { display: 'none' }); setShowOverlay(false); }
      });
    }
  }, [isMenuOpen, showOverlay, animationEase, animationDuration, staggerDelay]);

  useEffect(() => {
    const handleResize = () => {
      if (!isMenuOpen) return;
      const isDesktop = window.innerWidth >= 900;
      bubblesRef.current.filter(Boolean).forEach((bubble, i) => {
        const item = menuItems[i];
        if (bubble && item) gsap.set(bubble, { rotation: isDesktop ? (item.rotation ?? 0) : 0 });
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen, menuItems]);

  return (
    <>
      <nav className={containerClassName} style={style} aria-label="Main navigation">
        <div
          className="bubble logo-bubble"
          aria-label="Logo"
          style={{ background: menuBg, minHeight: 48, borderRadius: 9999 }}
        >
          <span className="logo-content">
            {typeof logo === 'string'
              ? (logo.startsWith('http') || logo.startsWith('data:image')) 
                ? <img src={logo} alt="Logo" className="bubble-logo max-h-[60%] max-w-full object-contain block" />
                : <span style={{ fontWeight: 700, color: menuContentColor, fontSize: 16, whiteSpace: 'nowrap' }}>{logo}</span>
              : logo}
          </span>
        </div>

        <button
          type="button"
          className={`bubble toggle-bubble menu-btn${isMenuOpen ? ' open' : ''}`}
          onClick={handleToggle}
          aria-label={menuAriaLabel}
          aria-pressed={isMenuOpen}
          style={{ background: menuBg }}
        >
          <span className="menu-line" style={{
            background: menuContentColor,
            transform: isMenuOpen ? 'translateY(4px) rotate(45deg)' : undefined,
          }} />
          <span className="menu-line" style={{
            background: menuContentColor,
            transform: isMenuOpen ? 'translateY(-4px) rotate(-45deg)' : undefined,
          }} />
        </button>
      </nav>

      {showOverlay && (
        <div
          ref={overlayRef}
          className={`bubble-menu-items ${useFixedPosition ? 'fixed' : 'absolute'}`}
          aria-hidden={!isMenuOpen}
        >
          <ul className="pill-list" role="menu" aria-label="Menu links">
            {menuItems.map((item, idx) => (
              <li key={item.id || idx} role="none" className="pill-col">
                <a
                  role="menuitem"
                  href={item.href}
                  aria-label={item.ariaLabel || item.label}
                  className="pill-link"
                  onClick={(e) => onItemClick?.(e, item.href)}
                  style={{
                    '--item-rot': `${item.rotation ?? 0}deg`,
                    '--pill-bg': menuBg,
                    '--pill-color': menuContentColor,
                    '--hover-bg': item.hoverBgColor || menuContentColor,
                    '--hover-color': item.hoverTextColor || menuBg,
                  }}
                  ref={el => { if (el) bubblesRef.current[idx] = el; }}
                >
                  <span
                    className="pill-label"
                    ref={el => { if (el) labelRefs.current[idx] = el; }}
                  >
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './PillNav.css';

const DEFAULT_ITEMS = [
  { id: '1', label: 'Home',     href: '#', ariaLabel: 'Home' },
  { id: '2', label: 'About',    href: '#', ariaLabel: 'About' },
  { id: '3', label: 'Projects', href: '#', ariaLabel: 'Projects' },
  { id: '4', label: 'Blog',     href: '#', ariaLabel: 'Blog' },
  { id: '5', label: 'Contact',  href: '#', ariaLabel: 'Contact' },
];

const PillNav = ({
  logo,
  logoAlt = 'Logo',
  items,
  activeHref,
  className = '',
  ease = 'power3.out',
  baseColor = '#120F17',
  pillColor = '#ffffff',
  hoveredPillTextColor = '#120F17',
  pillTextColor,
  initialLoadAnimation = true,
  onItemClick,
}) => {
  const resolvedPillTextColor = pillTextColor ?? baseColor;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const circleRefs = useRef([]);
  const tlRefs = useRef([]);
  const activeTweenRefs = useRef([]);
  const logoImgRef = useRef(null);
  const logoTweenRef = useRef(null);
  const hamburgerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navItemsRef = useRef(null);
  const logoRef = useRef(null);

  const menuItems = items?.length ? items : DEFAULT_ITEMS;

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach(circle => {
        if (!circle?.parentElement) return;
        const pill = circle.parentElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        if (!w || !h) return;
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, { xPercent: -50, scale: 0, transformOrigin: `50% ${originY}px` });

        const label = pill.querySelector('.pill-label');
        const white = pill.querySelector('.pill-label-hover');

        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        const index = circleRefs.current.indexOf(circle);
        if (index === -1) return;

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });
        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' }, 0);
        if (label) tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0);
        if (white) {
          gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(white, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0);
        }
        tlRefs.current[index] = tl;
      });
    };

    layout();
    window.addEventListener('resize', layout);
    if (document.fonts) document.fonts.ready.then(layout).catch(() => {});

    const menu = mobileMenuRef.current;
    if (menu) gsap.set(menu, { visibility: 'hidden', opacity: 0 });

    if (initialLoadAnimation) {
      const logoEl = logoRef.current;
      const navItems = navItemsRef.current;
      if (logoEl) { gsap.set(logoEl, { scale: 0 }); gsap.to(logoEl, { scale: 1, duration: 0.6, ease }); }
      if (navItems) { gsap.set(navItems, { width: 0, overflow: 'hidden' }); gsap.to(navItems, { width: 'auto', duration: 0.6, ease }); }
    }

    return () => window.removeEventListener('resize', layout);
  }, [menuItems, ease, initialLoadAnimation]);

  const handleEnter = (i) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), { duration: 0.3, ease, overwrite: 'auto' });
  };

  const handleLeave = (i) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, { duration: 0.2, ease, overwrite: 'auto' });
  };

  const handleLogoEnter = () => {
    const img = logoImgRef.current;
    if (!img) return;
    logoTweenRef.current?.kill();
    gsap.set(img, { rotate: 0 });
    logoTweenRef.current = gsap.to(img, { rotate: 360, duration: 0.5, ease, overwrite: 'auto' });
  };

  const toggleMobileMenu = () => {
    const next = !isMobileMenuOpen;
    setIsMobileMenuOpen(next);
    const hamburger = hamburgerRef.current;
    const menu = mobileMenuRef.current;
    if (hamburger) {
      const lines = hamburger.querySelectorAll('.hamburger-line');
      if (next) {
        gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease });
      } else {
        gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease });
      }
    }
    if (menu) {
      if (next) {
        gsap.set(menu, { visibility: 'visible' });
        gsap.fromTo(menu, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, ease });
      } else {
        gsap.to(menu, { opacity: 0, y: 10, duration: 0.2, ease, onComplete: () => gsap.set(menu, { visibility: 'hidden' }) });
      }
    }
  };

  const cssVars = {
    '--base': baseColor,
    '--pill-bg': pillColor,
    '--hover-text': hoveredPillTextColor,
    '--pill-text': resolvedPillTextColor,
    '--nav-h': '42px',
    '--pill-pad-x': '18px',
    '--pill-gap': '3px',
  };

  const isLogoImage = logo && (logo.startsWith('http') || logo.startsWith('data:image') || logo.startsWith('/'));

  return (
    <div className="pill-nav-container">
      <nav className={`pill-nav ${className}`} aria-label="Primary" style={cssVars}>
        <a
          href="#"
          className="pill-logo"
          aria-label="Home"
          onMouseEnter={handleLogoEnter}
          ref={el => { logoRef.current = el; }}
          style={{ color: pillColor }}
        >
          {isLogoImage
            ? <img src={logo} alt={logoAlt} ref={logoImgRef} />
            : <span className="pill-logo-text" style={{ color: pillColor }}>{logo || 'Logo'}</span>
          }
        </a>

        <div ref={navItemsRef} className="pill-nav-items desktop-only">
          <ul className="pill-list" role="menubar">
            {menuItems.map((item, i) => (
              <li key={item.id || i} role="none" className="flex h-full">
                <a
                  role="menuitem"
                  href={item.href}
                  className={`pill${activeHref === item.href ? ' is-active' : ''}`}
                  aria-label={item.ariaLabel || item.label}
                  onClick={(e) => onItemClick?.(e, item.href)}
                  onMouseEnter={() => handleEnter(i)}
                  onMouseLeave={() => handleLeave(i)}
                >
                  <span
                    className="hover-circle"
                    aria-hidden="true"
                    ref={el => { circleRefs.current[i] = el; }}
                  />
                  <span className="label-stack">
                    <span className="pill-label">{item.label}</span>
                    <span className="pill-label-hover" aria-hidden="true">{item.label}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <button
          ref={hamburgerRef}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
          className="mobile-menu-button mobile-only"
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </nav>

      <div ref={mobileMenuRef} className="mobile-menu-popover mobile-only" style={cssVars}>
        <ul className="mobile-menu-list">
          {menuItems.map((item, i) => (
            <li key={item.id || i}>
              <a
                href={item.href}
                className={`mobile-menu-link${activeHref === item.href ? ' is-active' : ''}`}
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  onItemClick?.(e, item.href);
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PillNav;

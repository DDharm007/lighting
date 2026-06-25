import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import './FlowingMenu.css';

const DEFAULT_ITEMS = [
  { id: '1', link: '#', text: 'Home',     image: '' },
  { id: '2', link: '#', text: 'About',    image: '' },
  { id: '3', link: '#', text: 'Projects', image: '' },
  { id: '4', link: '#', text: 'Contact',  image: '' },
];

const MenuItem = ({
  link,
  text,
  image,
  speed,
  textColor,
  marqueeBgColor,
  marqueeTextColor,
  borderColor,
  isFirst,
  onItemClick,
}) => {
  const itemRef       = useRef(null);
  const marqueeRef    = useRef(null);
  const marqueeInnerRef = useRef(null);
  const animationRef  = useRef(null);
  const [repetitions, setRepetitions] = useState(6);

  const animDefaults = { duration: 0.6, ease: 'expo' };

  const findClosestEdge = (mx, my, w, h) => {
    const top = (mx - w / 2) ** 2 + my ** 2;
    const bot = (mx - w / 2) ** 2 + (my - h) ** 2;
    return top < bot ? 'top' : 'bottom';
  };

  useEffect(() => {
    const calc = () => {
      if (!marqueeInnerRef.current) return;
      const part = marqueeInnerRef.current.querySelector('.flowing-marquee__part');
      if (!part) return;
      const w = part.offsetWidth;
      if (!w) return;
      setRepetitions(Math.max(6, Math.ceil(window.innerWidth / w) + 2));
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, [text, image]);

  useEffect(() => {
    const setup = () => {
      if (!marqueeInnerRef.current) return;
      const part = marqueeInnerRef.current.querySelector('.flowing-marquee__part');
      if (!part) return;
      const w = part.offsetWidth;
      if (!w) return;
      animationRef.current?.kill();
      animationRef.current = gsap.to(marqueeInnerRef.current, {
        x: -w,
        duration: speed,
        ease: 'none',
        repeat: -1,
      });
    };
    const t = setTimeout(setup, 60);
    return () => {
      clearTimeout(t);
      animationRef.current?.kill();
    };
  }, [text, image, repetitions, speed]);

  const handleMouseEnter = (e) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const r = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(e.clientX - r.left, e.clientY - r.top, r.width, r.height);
    gsap.timeline({ defaults: animDefaults })
      .set(marqueeRef.current,       { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .set(marqueeInnerRef.current,  { y: edge === 'top' ?  '101%' : '-101%' }, 0)
      .to([marqueeRef.current, marqueeInnerRef.current], { y: '0%' }, 0);
  };

  const handleMouseLeave = (e) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const r = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(e.clientX - r.left, e.clientY - r.top, r.width, r.height);
    gsap.timeline({ defaults: animDefaults })
      .to(marqueeRef.current,      { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .to(marqueeInnerRef.current, { y: edge === 'top' ?  '101%' : '-101%' }, 0);
  };

  return (
    <div
      className="flowing-menu__item"
      ref={itemRef}
      style={{ borderColor: isFirst ? 'transparent' : borderColor }}
    >
      <a
        className="flowing-menu__item-link"
        href={link}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={(e) => onItemClick?.(e, link)}
        style={{ color: textColor }}
      >
        {text}
      </a>

      <div
        className="flowing-marquee"
        ref={marqueeRef}
        style={{ backgroundColor: marqueeBgColor }}
      >
        <div className="flowing-marquee__inner-wrap">
          <div className="flowing-marquee__inner" ref={marqueeInnerRef} aria-hidden="true">
            {Array.from({ length: repetitions }).map((_, idx) => (
              <div className="flowing-marquee__part" key={idx} style={{ color: marqueeTextColor }}>
                <span>{text}</span>
                {image && (
                  <div
                    className="flowing-marquee__img"
                    style={{ backgroundImage: `url(${image})` }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const FlowingMenu = ({
  items,
  speed = 15,
  textColor = '#fff',
  bgColor = '#120F17',
  marqueeBgColor = '#fff',
  marqueeTextColor = '#120F17',
  borderColor = '#ffffff40',
  onItemClick,
}) => {
  const menuItems = items?.length ? items : DEFAULT_ITEMS;

  return (
    <div className="flowing-menu-wrap" style={{ backgroundColor: bgColor }}>
      <nav className="flowing-menu">
        {menuItems.map((item, idx) => (
          <MenuItem
            key={item.id || idx}
            {...item}
            speed={speed}
            textColor={textColor}
            marqueeBgColor={marqueeBgColor}
            marqueeTextColor={marqueeTextColor}
            borderColor={borderColor}
            isFirst={idx === 0}
            onItemClick={onItemClick}
          />
        ))}
      </nav>
    </div>
  );
};

export default FlowingMenu;

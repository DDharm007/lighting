import React, { useState, useEffect, useRef } from "react";

const EASE_MAP = {
  "power1.out": "cubic-bezier(0.25, 1, 0.5, 1)",
  "power2.out": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  "power3.out": "cubic-bezier(0.16, 1, 0.3, 1)",
  "power4.out": "cubic-bezier(0.15, 1, 0.3, 1)",
  "back.out": "cubic-bezier(0.175, 0.885, 0.32, 1.275)"
};

export function InfinitySplitText({ text, styles = {}, elementId }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const splitType = styles.splitType || "chars";
  const easeKey = styles.ease || "power3.out";
  const ease = EASE_MAP[easeKey] || EASE_MAP["power3.out"];
  const staggerDelay = parseInt(String(styles.staggerDelay ?? 40)) || 40;
  const duration = parseFloat(String(styles.duration ?? 0.6)) || 0.6;

  let segments = [];
  if (splitType === "words") {
    segments = text.split(" ");
  } else {
    segments = text.split("");
  }

  const styleTag = `
    @keyframes inf-split-up-${elementId} {
      from { opacity: 0; transform: translateY(60%) rotateX(-30deg); }
      to   { opacity: 1; transform: translateY(0) rotateX(0deg); }
    }
  `;
  return (
    <div ref={ref} style={{ ...styles, overflow: "hidden", perspective: "800px" }}>
      <style>{styleTag}</style>
      <span style={{ display: "inline-block", fontFamily: styles.fontFamily, fontSize: styles.fontSize, fontWeight: styles.fontWeight, fontStyle: styles.fontStyle, color: styles.color, lineHeight: 1.2 }}>
        {segments.map((seg, i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: visible ? 1 : 0,
              animation: visible ? `inf-split-up-${elementId} ${duration}s ${ease} both` : "none",
              animationDelay: `${i * staggerDelay}ms`,
              whiteSpace: seg === " " ? "pre" : "normal",
              marginRight: splitType === "words" ? "0.3em" : "0",
            }}
          >{seg}</span>
        ))}
      </span>
    </div>
  );
}

export function InfinityBlurText({ text, styles = {}, elementId }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const words = text.split(" ");
  const styleTag = `
    @keyframes inf-blur-in-${elementId} {
      from { opacity: 0; filter: blur(12px); transform: translateY(8px); }
      to   { opacity: 1; filter: blur(0); transform: translateY(0); }
    }
  `;
  return (
    <div ref={ref} style={styles}>
      <style>{styleTag}</style>
      <span style={{ display: "inline", fontFamily: styles.fontFamily, fontSize: styles.fontSize, fontWeight: styles.fontWeight, fontStyle: styles.fontStyle, color: styles.color }}>
        {words.map((word, i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              marginRight: "0.25em",
              opacity: visible ? 1 : 0,
              animation: visible ? `inf-blur-in-${elementId} 0.7s cubic-bezier(0.22,1,0.36,1) both` : "none",
              animationDelay: `${i * 80}ms`,
            }}
          >{word}</span>
        ))}
      </span>
    </div>
  );
}

export function InfinityCircularText({ text, styles = {} }) {
  const size = parseInt(String(styles.width || "200")) || 200;
  const r = size * 0.38;
  const cx = size / 2;
  const d = `M ${cx},${cx - r} A ${r},${r} 0 1 1 ${cx - 0.01},${cx - r}`;
  const fontSize = parseInt(String(styles.fontSize || "14")) || 14;
  const rotateSpeed = 20;
  const styleTag = `@keyframes inf-rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
  return (
    <div style={{ ...styles, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{styleTag}</style>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ animation: `inf-rotate ${rotateSpeed}s linear infinite`, overflow: "visible" }}>
        <defs>
          <path id="circPath" d={d} />
        </defs>
        <text
          fill={styles.color || "#a78bfa"}
          fontSize={fontSize}
          fontFamily={styles.fontFamily || "Poppins"}
          fontWeight={styles.fontWeight || "500"}
          fontStyle={styles.fontStyle}
          letterSpacing="2"
        >
          <textPath href="#circPath" textLength={2 * Math.PI * r * 0.98} lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
    </div>
  );
}

export function InfinityTextType({ content, styles = {} }) {
  let phrases = [];
  try { const p = JSON.parse(content); if (Array.isArray(p)) phrases = p; } catch { phrases = [content]; }
  if (!phrases.length) phrases = ["Hello World"];
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [cursorOn, setCursorOn] = useState(true);
  useEffect(() => {
    const cursor = setInterval(() => setCursorOn(v => !v), 530);
    return () => clearInterval(cursor);
  }, []);
  useEffect(() => {
    const target = phrases[phraseIdx] || "";
    let timeout;
    if (!deleting) {
      if (displayed.length < target.length) {
        timeout = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 60);
      } else {
        timeout = setTimeout(() => setDeleting(true), 1800);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(target.slice(0, displayed.length - 1)), 30);
      } else {
        setDeleting(false);
        setPhraseIdx((phraseIdx + 1) % phrases.length);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, phraseIdx, phrases]);
  return (
    <div style={styles}>
      <span style={{ fontFamily: styles.fontFamily, fontSize: styles.fontSize, fontWeight: styles.fontWeight, fontStyle: styles.fontStyle, color: styles.color }}>
        {displayed}
        <span style={{ opacity: cursorOn ? 1 : 0, borderRight: `3px solid ${styles.color || "#fff"}`, marginLeft: "2px", display: "inline-block", height: "1em", verticalAlign: "middle", transition: "opacity 0.1s" }}>&nbsp;</span>
      </span>
    </div>
  );
}

export function InfinityShuffleText({ text, styles = {}, elementId }) {
  const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";
  const [displayed, setDisplayed] = useState(text);
  const [active, setActive] = useState(false);
  const timerRef = useRef(null);
  const iterRef = useRef(0);
  const trigger = () => {
    if (active) return;
    setActive(true);
    iterRef.current = 0;
    timerRef.current = setInterval(() => {
      iterRef.current += 1;
      const progress = iterRef.current / (text.length * 3);
      setDisplayed(
        text.split("").map((ch, i) => {
          if (ch === " ") return " ";
          if (i < Math.floor(progress * text.length)) return ch;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join("")
      );
      if (iterRef.current >= text.length * 3) {
        clearInterval(timerRef.current);
        setDisplayed(text);
        setActive(false);
      }
    }, 30);
  };
  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);
  return (
    <div style={{ ...styles, cursor: "pointer" }} onMouseEnter={trigger}>
      <span style={{ fontFamily: styles.fontFamily, fontSize: styles.fontSize, fontWeight: styles.fontWeight, fontStyle: styles.fontStyle, color: styles.color, letterSpacing: "0.05em", fontVariantNumeric: "tabular-nums" }}>
        {displayed}
      </span>
    </div>
  );
}

export function InfinityShinyText({ text, styles = {}, elementId }) {
  const color = styles.color || "#b5b5b5";
  const shineColor = "#ffffff";
  const styleTag = `
    @keyframes inf-shine-${elementId} {
      0%   { background-position: 200% center; }
      100% { background-position: -200% center; }
    }
  `;
  const gradientStyle = {
    backgroundImage: `linear-gradient(120deg, ${color} 0%, ${color} 35%, ${shineColor} 50%, ${color} 65%, ${color} 100%)`,
    backgroundSize: "200% auto",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animation: `inf-shine-${elementId} 3s linear infinite`,
    display: "inline-block",
    fontFamily: styles.fontFamily,
    fontSize: styles.fontSize,
    fontWeight: styles.fontWeight,
    fontStyle: styles.fontStyle,
    lineHeight: 1.1,
  };
  return (
    <div style={styles}>
      <style>{styleTag}</style>
      <span style={gradientStyle}>{text}</span>
    </div>
  );
}

export function InfinityTextPressure({ text, styles = {} }) {
  const containerRef = useRef(null);
  const spansRef = useRef([]);
  const rafRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const cursorRef = useRef({ x: 0, y: 0 });

  const chars = text.split("");

  useEffect(() => {
    const handleMove = (e) => { cursorRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", handleMove);
    if (containerRef.current) {
      const r = containerRef.current.getBoundingClientRect();
      mouseRef.current = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      cursorRef.current = { ...mouseRef.current };
    }
    const animate = () => {
      mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / 10;
      mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / 10;
      spansRef.current.forEach(span => {
        if (!span) return;
        const rect = span.getBoundingClientRect();
        const cx = rect.x + rect.width / 2;
        const cy = rect.y + rect.height / 2;
        const dx = mouseRef.current.x - cx;
        const dy = mouseRef.current.y - cy;
        const d = Math.sqrt(dx * dx + dy * dy);
        const maxD = 300;
        const t = Math.max(0, 1 - d / maxD);
        const wght = Math.round(100 + t * 800);
        span.style.fontWeight = String(wght);
        span.style.fontVariationSettings = `'wght' ${wght}`;
      });
      rafRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => { window.removeEventListener("mousemove", handleMove); cancelAnimationFrame(rafRef.current); };
  }, []);

  const textColor = styles.color || "#ffffff";
  return (
    <div ref={containerRef} style={{ ...styles, display: "flex", justifyContent: "space-between", alignItems: "center", overflow: "hidden" }}>
      <style>{"@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap');"}</style>
      {chars.map((ch, i) => (
        <span
          key={i}
          ref={el => { spansRef.current[i] = el; }}
          style={{
            display: "inline-block",
            color: textColor,
            fontFamily: styles.fontFamily || "Poppins",
            fontSize: styles.fontSize || "36px",
            fontStyle: styles.fontStyle,
            transition: "font-weight 0.1s",
            userSelect: "none",
            textTransform: "uppercase",
          }}
        >{ch === " " ? "\u00a0" : ch}</span>
      ))}
    </div>
  );
}

export function InfinityCurvedLoop({ text, styles = {}, elementId }) {
  const measureRef = useRef(null);
  const textPathRef = useRef(null);
  const [spacing, setSpacing] = useState(0);
  const [offset, setOffset] = useState(0);
  const dragRef = useRef(false);
  const lastXRef = useRef(0);
  const velRef = useRef(0);
  const dirRef = useRef("left");
  const speed = 2;
  const pathId = `curve-path-${elementId}`;
  const displayText = text + "\u00a0";
  const totalText = spacing > 0 ? Array(Math.ceil(1800 / spacing) + 2).fill(displayText).join("") : displayText;
  const curveAmount = 120;
  const pathD = `M-100,40 Q500,${40 + curveAmount} 1540,40`;
  const textColor = styles.color || "#ffffff";
  const fontSize = parseInt(String(styles.fontSize || "64")) || 64;

  useEffect(() => {
    if (measureRef.current) setSpacing(measureRef.current.getComputedTextLength());
  }, [displayText]);

  useEffect(() => {
    if (!spacing) return;
    if (textPathRef.current) {
      textPathRef.current.setAttribute("startOffset", String(-spacing) + "px");
      setOffset(-spacing);
    }
  }, [spacing]);

  useEffect(() => {
    if (!spacing) return;
    let rafId;
    const step = () => {
      if (!dragRef.current && textPathRef.current) {
        const delta = dirRef.current === "right" ? speed : -speed;
        const cur = parseFloat(textPathRef.current.getAttribute("startOffset") || "0");
        let next = cur + delta;
        if (next <= -spacing) next += spacing;
        if (next > 0) next -= spacing;
        textPathRef.current.setAttribute("startOffset", next + "px");
        setOffset(next);
      }
      rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [spacing]);

  const onPointerDown = (e) => {
    dragRef.current = true; lastXRef.current = e.clientX; velRef.current = 0;
    e.target.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragRef.current || !textPathRef.current) return;
    const dx = e.clientX - lastXRef.current; lastXRef.current = e.clientX; velRef.current = dx;
    const cur = parseFloat(textPathRef.current.getAttribute("startOffset") || "0");
    let next = cur + dx;
    if (next <= -spacing) next += spacing;
    if (next > 0) next -= spacing;
    textPathRef.current.setAttribute("startOffset", next + "px");
    setOffset(next);
  };
  const endDrag = () => { dragRef.current = false; dirRef.current = velRef.current > 0 ? "right" : "left"; };

  return (
    <div
      style={{ ...styles, cursor: dragRef.current ? "grabbing" : "grab", visibility: spacing > 0 ? "visible" : "hidden", display: "flex", alignItems: "center" }}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={endDrag} onPointerLeave={endDrag}
    >
      <svg
        style={{ userSelect: "none", width: "100%", overflow: "visible", display: "block", aspectRatio: "100 / 12" }}
        viewBox="0 0 1440 120"
      >
        <text ref={measureRef} xmlSpace="preserve" style={{ visibility: "hidden", opacity: 0, pointerEvents: "none", fontSize, fontFamily: styles.fontFamily || "Poppins", fontWeight: styles.fontWeight || "900", fontStyle: styles.fontStyle }}>
          {displayText}
        </text>
        <defs><path id={pathId} d={pathD} fill="none" stroke="transparent" /></defs>
        {spacing > 0 && (
          <text xmlSpace="preserve" fill={textColor} fontSize={fontSize} fontFamily={String(styles.fontFamily || "Poppins")} fontWeight={String(styles.fontWeight || "900")} textAnchor="start" style={{ textTransform: "uppercase", fontStyle: styles.fontStyle }}>
            <textPath ref={textPathRef} href={`#${pathId}`} startOffset={offset + "px"} xmlSpace="preserve">{totalText}</textPath>
          </text>
        )}
      </svg>
    </div>
  );
}

export function InfinityFuzzyText({ text, styles = {}, elementId }) {
  const canvasRef = useRef(null);
  const fontSize = parseInt(String(styles.fontSize || "64")) || 64;
  const color = styles.color || "#ffffff";
  const fontFamily = styles.fontFamily || "Poppins";
  const fontWeight = styles.fontWeight || 900;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    let rafId;
    let isHovering = false;

    const init = async () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const fontStr = `${styles.fontStyle || ""} ${fontWeight} ${fontSize}px ${fontFamily}`;
      try { await document.fonts.load(fontStr); } catch { await document.fonts.ready; }
      if (cancelled) return;

      const offscreen = document.createElement("canvas");
      const offCtx = offscreen.getContext("2d");
      offCtx.font = fontStr;
      offCtx.textBaseline = "alphabetic";
      const m = offCtx.measureText(text);
      const tw = Math.ceil(m.actualBoundingBoxRight + m.actualBoundingBoxLeft + 20);
      const th = Math.ceil((m.actualBoundingBoxAscent || fontSize) + (m.actualBoundingBoxDescent || fontSize * 0.2));
      offscreen.width = tw; offscreen.height = th;
      offCtx.font = fontStr; offCtx.textBaseline = "alphabetic";
      offCtx.fillStyle = color;
      offCtx.fillText(text, m.actualBoundingBoxLeft + 10, m.actualBoundingBoxAscent || fontSize);

      const fuzz = 30;
      const mx = fuzz + 10;
      canvas.width = tw + mx * 2;
      canvas.height = th;
      ctx.translate(mx, 0);

      const run = () => {
        if (cancelled) return;
        ctx.clearRect(-mx, 0, tw + mx * 2, th);
        const intensity = isHovering ? 0.6 : 0.18;
        for (let j = 0; j < th; j++) {
          const dx = Math.floor(intensity * (Math.random() - 0.5) * fuzz * 2);
          ctx.drawImage(offscreen, 0, j, tw, 1, dx, j, tw, 1);
        }
        rafId = requestAnimationFrame(run);
      };
      rafId = requestAnimationFrame(run);

      const handleEnter = () => { isHovering = true; };
      const handleLeave = () => { isHovering = false; };
      canvas.addEventListener("mouseenter", handleEnter);
      canvas.addEventListener("mouseleave", handleLeave);
    };

    init();
    return () => { cancelled = true; cancelAnimationFrame(rafId); };
  }, [text, fontSize, color, fontFamily, fontWeight]);

  return <canvas ref={canvasRef} style={{ display: "block", maxWidth: "100%" }} />;
}

export function InfinityGlitchText({ text, styles = {}, elementId }) {
  const speed = 0.5;
  const enableShadows = true;
  const enableOnHover = styles.enableOnHover === true || styles.enableOnHover === "true";

  const inlineStyles = {
    '--after-duration': `${speed * 3}s`,
    '--before-duration': `${speed * 2}s`,
    '--after-shadow': enableShadows ? '-5px 0 red' : 'none',
    '--before-shadow': enableShadows ? '5px 0 cyan' : 'none',
    fontSize: styles.fontSize || '64px',
    color: styles.color || '#000000',
    fontFamily: styles.fontFamily || 'Poppins',
    fontWeight: styles.fontWeight || 900,
    fontStyle: styles.fontStyle
  };

  const hoverClass = enableOnHover ? 'enable-on-hover' : '';

  return (
    <div
      className={`glitch ${hoverClass}`}
      style={inlineStyles}
      data-text={text}
    >
      {text}
      <style>{`
        .glitch {
          color: inherit;
          font-size: inherit;
          font-family: inherit;
          font-weight: inherit;
          white-space: nowrap;
          position: relative;
          margin: 0 auto;
          user-select: none;
          cursor: pointer;
          display: inline-block;
        }

        .glitch::after,
        .glitch::before {
          content: attr(data-text);
          position: absolute;
          top: 0;
          color: inherit;
          background-color: transparent;
          overflow: hidden;
          clip-path: inset(0 0 0 0);
          width: 100%;
          height: 100%;
        }

        .glitch:not(.enable-on-hover)::after {
          left: 5px;
          text-shadow: var(--after-shadow, -5px 0 red);
          animation: animate-glitch var(--after-duration, 1.5s) infinite linear alternate-reverse;
        }
        .glitch:not(.enable-on-hover)::before {
          left: -5px;
          text-shadow: var(--before-shadow, 5px 0 cyan);
          animation: animate-glitch var(--before-duration, 1s) infinite linear alternate-reverse;
        }

        .glitch.enable-on-hover::after,
        .glitch.enable-on-hover::before {
          content: '';
          opacity: 0;
          animation: none;
        }

        .glitch.enable-on-hover:hover::after {
          content: attr(data-text);
          opacity: 1;
          left: 5px;
          text-shadow: var(--after-shadow, -5px 0 red);
          animation: animate-glitch var(--after-duration, 1.5s) infinite linear alternate-reverse;
        }
        .glitch.enable-on-hover:hover::before {
          content: attr(data-text);
          opacity: 1;
          left: -5px;
          text-shadow: var(--before-shadow, 5px 0 cyan);
          animation: animate-glitch var(--before-duration, 1s) infinite linear alternate-reverse;
        }

        @keyframes animate-glitch {
          0% { clip-path: inset(20% 0 50% 0); }
          5% { clip-path: inset(10% 0 60% 0); }
          10% { clip-path: inset(15% 0 55% 0); }
          15% { clip-path: inset(25% 0 35% 0); }
          20% { clip-path: inset(30% 0 40% 0); }
          25% { clip-path: inset(40% 0 20% 0); }
          30% { clip-path: inset(10% 0 60% 0); }
          35% { clip-path: inset(15% 0 55% 0); }
          40% { clip-path: inset(25% 0 35% 0); }
          45% { clip-path: inset(30% 0 40% 0); }
          50% { clip-path: inset(40% 0 20% 0); }
          55% { clip-path: inset(50% 0 10% 0); }
          60% { clip-path: inset(15% 0 55% 0); }
          65% { clip-path: inset(25% 0 35% 0); }
          70% { clip-path: inset(30% 0 40% 0); }
          75% { clip-path: inset(40% 0 20% 0); }
          80% { clip-path: inset(50% 0 10% 0); }
          85% { clip-path: inset(60% 0 5% 0); }
          90% { clip-path: inset(10% 0 70% 0); }
          95% { clip-path: inset(20% 0 50% 0); }
          100% { clip-path: inset(30% 0 30% 0); }
        }
      `}</style>
    </div>
  );
}

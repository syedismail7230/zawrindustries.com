'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import servicesData from '@/data/services_data.json';

interface Offering {
  title: string;
  description: string;
  deliverables: string[];
}

interface PhaseDetail {
  phase: number;
  title: string;
  activities: string[];
  outputs: string[];
}

interface ServiceDetail {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  challenges: string[];
  offerings: Offering[];
  methodology: PhaseDetail[];
}

const typedServicesData = servicesData as Record<string, ServiceDetail>;

function ChallengesSection({ challenges }: { challenges: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const barrelRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const isHovered = useRef(false);

  // Target and current active indexes (0 to 4)
  const targetIndex = useRef(0);
  const currentIndex = useRef(0);

  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  // Cylinder geometry constants
  const itemSpacing = 35; // degrees between items
  const radius = 180; // cylinder radius in pixels
  const centerIdx = 2; // middle challenge index to anchor the math

  useEffect(() => {
    let animationFrameId: number;

    const tick = () => {
      // 1. Smoothly interpolate current active index
      const easing = 0.08;
      currentIndex.current += (targetIndex.current - currentIndex.current) * easing;

      // 2. Map current index directly to 3D rotation of the entire cylinder
      const currentRotation = (currentIndex.current - centerIdx) * itemSpacing;

      if (barrelRef.current) {
        // Rotate the entire cylinder vertically around X axis, pushed back by -radius
        barrelRef.current.style.transform = `translateZ(-${radius}px) rotateX(${-currentRotation}deg)`;

        // Calculate and apply perspective styling, opacity, and active states for each item
        const items = barrelRef.current.querySelectorAll('.barrel-item');
        let closestIndex = 0;
        let minDistance = Infinity;

        items.forEach((item, index) => {
          // Angle offset from the front facing plane (0deg is facing screen)
          const itemAngle = (index - centerIdx) * itemSpacing;
          const diff = itemAngle - currentRotation;

          // Safe cosine-based opacity decay to prevent NaN
          const cosVal = Math.max(0, Math.cos((diff * Math.PI) / 180));
          const opacity = Math.max(0.18, Math.pow(cosVal, 2.8));
          
          const element = item as HTMLElement;
          element.style.opacity = `${opacity}`;

          // Smoothly dim color for non-active items
          const activeFraction = Math.max(0, 1 - Math.abs(diff / itemSpacing));
          element.style.color = `rgba(255, 255, 255, ${0.18 + activeFraction * 0.82})`;

          // Highlight the active item facing closest to Z=0
          const dist = Math.abs(diff);
          if (dist < minDistance) {
            minDistance = dist;
            closestIndex = index;
          }

          if (dist < itemSpacing / 2) {
            element.classList.add('active-item');
          } else {
            element.classList.remove('active-item');
          }
        });

        if (closestIndex !== activeIndexRef.current) {
          activeIndexRef.current = closestIndex;
          setActiveIndex(closestIndex);
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    const handleScroll = () => {
      // If the user is hovering and rolling manually, ignore page scroll triggers
      if (isHovered.current) return;

      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Calculate progress of section through the viewport center
      const elementHeight = rect.height;
      const elementTop = rect.top;
      const elementCenter = elementTop + elementHeight / 2;

      // Map progress to active index (from 0 to 4)
      const startPoint = viewportHeight * 0.82;
      const endPoint = viewportHeight * 0.18;
      const progress = (elementCenter - startPoint) / (endPoint - startPoint);
      const boundedProgress = Math.max(0, Math.min(1, progress));

      targetIndex.current = boundedProgress * (challenges.length - 1);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Native wheel listener on the viewport to roll challenges vertically
    const viewport = viewportRef.current;
    const handleNativeWheel = (e: WheelEvent) => {
      // Prevent browser default page scroll when scrolling inside challenges
      e.preventDefault();

      // Scroll index smoothly
      targetIndex.current += e.deltaY * 0.0035;
      targetIndex.current = Math.min(challenges.length - 1, Math.max(0, targetIndex.current));
    };

    if (viewport) {
      viewport.addEventListener('wheel', handleNativeWheel, { passive: false });
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleScroll);
      if (viewport) {
        viewport.removeEventListener('wheel', handleNativeWheel);
      }
    };
  }, [challenges.length]);

  return (
    <div 
      ref={containerRef}
      style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '11rem 6%', 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '4rem',
        alignItems: 'center',
        position: 'relative',
        borderTop: '1px solid rgba(255, 255, 255, 0.04)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.04)'
      }}
    >
      {/* 3D Barrel Roll CSS styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .barrel-viewport {
          position: relative;
          perspective: 1200px;
          height: 380px;
          width: 100%;
          overflow: visible;
          display: flex;
          align-items: center;
        }
        .barrel-cylinder {
          transform-style: preserve-3d;
          position: relative;
          width: 100%;
          height: 60px;
          will-change: transform;
        }
        .barrel-item {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          height: 100%;
          display: flex;
          align-items: center;
          font-size: clamp(1.4rem, 2.8vw, 2.2rem);
          color: rgba(255, 255, 255, 0.18);
          font-weight: 400;
          transform-style: preserve-3d;
          backface-visibility: hidden;
          cursor: pointer;
          user-select: none;
          transition: font-weight 0.4s ease, text-shadow 0.4s ease;
        }
        .barrel-item.active-item {
          font-weight: 600;
          color: #ffffff;
          text-shadow: 0 0 25px rgba(255, 255, 255, 0.4), 0 0 10px rgba(59, 130, 246, 0.3);
        }
      `}} />

      {/* Left Column: Sticky Title Stack */}
      <div style={{ 
        flex: '1 1 350px', 
        position: 'sticky', 
        top: '35vh', 
        height: 'fit-content',
        zIndex: 5
      }}>
        <h2 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
          fontWeight: 400,
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          margin: 0,
          background: 'linear-gradient(135deg, #3b82f6 0%, #ec4899 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Business<br />
          Challenges<br />
          We Solve
        </h2>
      </div>

      {/* Right Column: 3D Cylindrical Barrel Roll list */}
      <div style={{ flex: '1 1 500px', display: 'flex', alignItems: 'center', position: 'relative' }}>
        <div 
          ref={viewportRef}
          className="barrel-viewport"
          onMouseEnter={() => { isHovered.current = true; }}
          onMouseLeave={() => { isHovered.current = false; }}
        >
          {/* Top linear-gradient overlay fade */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '25%',
            background: 'linear-gradient(to bottom, #000000 0%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 10
          }} />

          {/* Bottom linear-gradient overlay fade */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '25%',
            background: 'linear-gradient(to top, #000000 0%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 10
          }} />

          <div ref={barrelRef} className="barrel-cylinder">
            {challenges.map((challenge, idx) => {
              const itemAngle = (idx - centerIdx) * itemSpacing;
              return (
                <div 
                  key={idx}
                  className="barrel-item"
                  style={{
                    transform: `rotateX(${itemAngle}deg) translateZ(${radius}px)`,
                  }}
                  onClick={() => {
                    targetIndex.current = idx;
                  }}
                >
                  {challenge}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function OfferingsSection({ serviceName, offerings }: { serviceName: string; offerings: Offering[] }) {
  const [flippedCards, setFlippedCards] = useState<boolean[]>([]);

  useEffect(() => {
    if (offerings) {
      setFlippedCards(new Array(offerings.length).fill(false));
    }
  }, [offerings]);

  const toggleFlip = (idx: number) => {
    setFlippedCards(prev => {
      const copy = [...prev];
      copy[idx] = !copy[idx];
      return copy;
    });
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 6% 8rem 6%' }}>
      <style dangerouslySetInnerHTML={{__html: `
        .offerings-section-title {
          font-size: clamp(2rem, 4.5vw, 3.2rem);
          font-weight: 400;
          text-align: center;
          color: #ffffff;
          margin-bottom: 4.5rem;
          letter-spacing: -0.02em;
        }
        .offerings-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 2rem;
          width: 100%;
        }
        @media (min-width: 640px) {
          .offerings-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .offerings-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .flip-card-container {
          perspective: 1200px;
          height: 440px;
          width: 100%;
        }
        .flip-card {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .flip-card.flipped {
          transform: rotateY(180deg);
        }
        .flip-card-front, .flip-card-back {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }
        .flip-card-front {
          background: linear-gradient(135deg, #072a6b 0%, #211c4f 45%, #5a1161 100%);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 2.8rem 2.4rem;
          justify-content: space-between;
          cursor: pointer;
        }
        .flip-card-back {
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.06);
          color: #000000;
          padding: 2.2rem 2rem;
          transform: rotateY(180deg);
          justify-content: flex-start;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
          cursor: pointer;
          overflow-y: auto; /* Fixes text going out of card */
        }
        .offering-title {
          font-size: clamp(1.5rem, 2vw, 1.85rem);
          font-weight: 300;
          color: #ffffff;
          line-height: 1.25;
          letter-spacing: -0.015em;
          font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
        }
        .offering-arrow {
          align-self: flex-end;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          opacity: 0.95;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
        }
        .flip-card-container:hover .offering-arrow {
          transform: translate(6px, -6px);
          opacity: 1;
        }
        .back-desc {
          font-size: 0.95rem;
          line-height: 1.55;
          color: #222222;
          font-weight: 400;
          margin: 0 0 1rem 0;
        }
        .back-subtitle {
          font-size: 1.02rem;
          font-weight: 700;
          color: #000000;
          margin: 0 0 0.65rem 0;
        }
        .back-list {
          list-style-type: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }
        .back-list-item {
          font-size: 0.9rem;
          line-height: 1.45;
          color: #333333;
          position: relative;
          padding-left: 1.25rem;
        }
        .back-list-item::before {
          content: "•";
          position: absolute;
          left: 0;
          top: 0;
          color: #000000;
          font-size: 1rem;
        }
      `}} />

      <h2 className="offerings-section-title">
        {serviceName} Offerings
      </h2>

      <div className="offerings-grid">
        {offerings.map((offering, idx) => (
          <div key={idx} className="flip-card-container" onClick={() => toggleFlip(idx)}>
            <div className={`flip-card ${flippedCards[idx] ? 'flipped' : ''}`}>
              
              {/* Front Side */}
              <div className="flip-card-front">
                <div className="offering-title">
                  {offering.title}
                </div>
                <div className="offering-arrow">
                  <svg 
                    width="60" 
                    height="60" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </div>
              </div>

              {/* Back Side */}
              <div className="flip-card-back">
                <p className="back-desc">
                  {offering.description}
                </p>
                {offering.deliverables && offering.deliverables.length > 0 && (
                  <>
                    <div className="back-subtitle">
                      Deliverables
                    </div>
                    <ul className="back-list">
                      {offering.deliverables.map((item, itemIdx) => (
                        <li key={itemIdx} className="back-list-item">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MethodologySection({ methodology }: { methodology: PhaseDetail[] }) {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const trackRef    = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx]           = useState(0);
  const [windowWidth, setWindowWidth]       = useState(1200);
  const [scrollProgress, setScrollProgress] = useState(0);

  // ── Internal refs (no re-render needed) ────────────────────────────────────
  const virtualRef  = useRef(0);   // accumulated wheel delta, 0 → RANGE
  const progressRef = useRef(0);   // mirrors scrollProgress but always fresh
  const RANGE       = 1400;        // total virtual-scroll px to complete animation

  // ── Layout helper ──────────────────────────────────────────────────────────
  const getLayout = (ww: number, n: number) => {
    const isMob = ww < 768;
    const pad     = isMob ? 32 : 80;
    const S       = Math.max(isMob ? 280 : 420, Math.min(isMob ? 400 : 640, Math.floor(ww / 2)));
    const colW    = S - (isMob ? 48 : 80);
    const tailLen = Math.floor(S * 0.55); // straight tail on last segment
    // Track must contain all columns + trailing pad + straight tail space
    const trackW     = (n - 1) * S + pad + colW + pad + tailLen;
    const lastColRight = (n - 1) * S + pad + colW + tailLen;
    const maxTx = Math.max(0, lastColRight - (ww - pad));
    return { pad, S, trackW, maxTx, colW, tailLen };
  };

  // ── Resize ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    onResize();
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ── Wheel capture ──────────────────────────────────────────────────────────
  // Strategy:
  //   1. Only activate when the section's vertical center is within the viewport.
  //   2. Call e.preventDefault() — stops the PAGE from scrolling.
  //   3. Add deltaY to an internal virtualRef accumulator.
  //   4. Derive progress 0→1 from virtualRef / RANGE.
  //   5. Drive SVG strokeDashoffset + track translateX from progress (via ref, no React re-render lag).
  //   6. Sync React state occasionally for SVG re-render.
  //   7. When progress reaches 1 (going down) or 0 (going up) — return without
  //      preventDefault so the browser scrolls naturally past the section.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let rafId = 0;

    const applyProgress = (p: number) => {
      progressRef.current = p;
      setScrollProgress(p);
      const N = methodology.length;
      setActiveIdx(Math.min(N - 1, Math.floor(p * N)));
      if (trackRef.current) {
        const { maxTx } = getLayout(window.innerWidth, N);
        trackRef.current.style.transform = `translateX(${-p * maxTx}px)`;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      const rect     = el.getBoundingClientRect();
      // Lock when section is fully in view below the navbar (~60px) — use 100px tolerance
      const inView   = rect.top <= 100 && rect.top > -el.offsetHeight;
      if (!inView) return;

      const goingDown = e.deltaY > 0;
      const goingUp   = e.deltaY < 0;
      const p         = progressRef.current;

      // If animation is complete going down, or at zero going up — let browser scroll
      if (goingDown && p >= 1) return;
      if (goingUp   && p <= 0) return;

      // Capture this wheel event entirely
      e.preventDefault();
      e.stopPropagation();

      virtualRef.current = Math.max(0, Math.min(RANGE, virtualRef.current + e.deltaY));
      const newP = virtualRef.current / RANGE;

      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => applyProgress(newP));
    };

    let touchY0 = 0;
    const handleTouchStart = (e: TouchEvent) => { touchY0 = e.touches[0].clientY; };
    const handleTouchMove  = (e: TouchEvent) => {
      const rect   = el.getBoundingClientRect();
      // Lock when section is fully in view below the navbar
      const inView = rect.top <= 100 && rect.top > -el.offsetHeight;
      if (!inView) return;

      const dy       = touchY0 - e.touches[0].clientY;
      const goingDown = dy > 0;
      const goingUp   = dy < 0;
      const p         = progressRef.current;

      if (goingDown && p >= 1) return;
      if (goingUp   && p <= 0) return;

      e.preventDefault();
      virtualRef.current = Math.max(0, Math.min(RANGE, virtualRef.current + dy));
      applyProgress(virtualRef.current / RANGE);
      touchY0 = e.touches[0].clientY;
    };

    window.addEventListener('wheel',      handleWheel,      { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true  });
    window.addEventListener('touchmove',  handleTouchMove,  { passive: false });
    return () => {
      window.removeEventListener('wheel',      handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove',  handleTouchMove);
      cancelAnimationFrame(rafId);
    };
  }, [methodology.length]);

  // ── Layout constants (render) ───────────────────────────────────────────────
  const N        = methodology.length;
  const isMobile = windowWidth < 768;
  const { pad: padding, S, trackW: trackWidth, colW, tailLen } = getLayout(windowWidth, N);
  const startX   = padding;


  // 8 strands: k = ±1,±2,±3,±4 (no flat center k=0)
  // baseAmp halved vs old 5-strand design so maxK=4 gives same total spread as old maxK=2
  const baseAmp = isMobile ? 12 : 21;
  const maxAmp  = baseAmp * (1 + (N - 3) * 0.05);
  // maxExcursion = how far k=4 strands swing from CY
  const maxExcursion = Math.ceil(4 * maxAmp * 1.35) + 8;
  // SVG height = room above + room below; CY sits exactly in the middle
  const svgHeight = 2 * maxExcursion + 16;
  const CY        = maxExcursion + 8;
  const PATH_LEN  = S * 1.8;
  const TIP_LEN   = 44;

  const getDrawP = (segIdx: number) => {
    if (N <= 1) return 1;
    const s = segIdx / (N - 1);
    const e = (segIdx + 1) / (N - 1);
    return Math.max(0, Math.min(1, (scrollProgress - s) / (e - s)));
  };

  return (
    <div
      ref={sectionRef}
      style={{
        height: '100vh',
        position: 'relative',
        background: '#000',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingTop: isMobile ? '3rem' : '4.5rem',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .meth-track-wrap { width: 100%; overflow: hidden; position: relative; }
        .meth-track { position: relative; flex-shrink: 0; will-change: transform; }
        .meth-col { position: absolute; }
        .meth-divider {
          position: absolute;
          width: 1px;
          background: linear-gradient(to bottom,
            rgba(255,255,255,0.01) 0%,
            rgba(255,255,255,0.18) 20%,
            rgba(255,255,255,0.18) 80%,
            rgba(255,255,255,0.01) 100%
          );
          pointer-events: none;
        }
        /* Gradient text — MUST be in raw CSS for -webkit-background-clip to work */
        .meth-title {
          margin: 0 0 1rem 0;
          font-weight: 600;
          line-height: 1.1;
          letter-spacing: -0.02em;
          font-family: var(--font-plus-jakarta), Inter, sans-serif;
        }
        .meth-title-active {
          background: linear-gradient(135deg, #06b6d4 0%, #a855f7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
        }
        .meth-title-inactive {
          color: rgba(255,255,255,0.28);
        }
        .meth-phase-label {
          font-weight: 400;
          line-height: 1.1;
          letter-spacing: -0.02em;
          font-family: var(--font-plus-jakarta), Inter, sans-serif;
          transition: color 0.5s ease;
          margin-bottom: 0.6rem;
        }
        .meth-phase-label-active  { color: #ffffff; }
        .meth-phase-label-inactive { color: rgba(255,255,255,0.28); }
        .meth-list-item { line-height: 1.55; transition: color 0.5s ease; }
        .meth-list-item-active   { color: rgba(255,255,255,0.85); }
        .meth-list-item-inactive { color: rgba(255,255,255,0.22); }
      ` }} />

      {/* ── Section Title ── */}
      <h2 style={{
        fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 400,
        letterSpacing: '-0.03em', textAlign: 'center', color: '#fff',
        margin: 0, marginBottom: isMobile ? '1rem' : '1.6rem',
        fontFamily: 'var(--font-plus-jakarta), Inter, sans-serif', flexShrink: 0,
        opacity: 0.9,
      }}>
        Methodology
      </h2>

      {/* ── Horizontal Track ── */}
      <div className="meth-track-wrap">
        <div
          ref={trackRef}
          className="meth-track"
          style={{ width: `${trackWidth}px`, height: isMobile ? `${svgHeight + 32 + 320}px` : `${svgHeight + 56 + 400}px` }}
        >
          {/* ── SVG Wave Threads ── */}
          <svg
            width={trackWidth}
            height={svgHeight}
            style={{ display: 'block', overflow: 'hidden' }}
          >
            <defs>
              {/* No shared wg gradient — colors applied per-strand below */}
              <linearGradient id="ag" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="rgba(255,255,255,0.18)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.04)" />
              </linearGradient>
              {/* Soft body glow */}
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3.5" result="b" />
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              {/* Strong bloom for the drawing tip */}
              <filter id="tipglow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="7" result="b1" />
                <feGaussianBlur stdDeviation="14" result="b2" />
                <feMerge>
                  <feMergeNode in="b2"/>
                  <feMergeNode in="b1"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {Array.from({ length: N - 1 }).map((_, si) => {
              const nx  = si * S + startX;
              const nnx = (si + 1) * S + startX;

              // Exponential decay: first eye biggest, each subsequent eye smaller
              const A = maxAmp * Math.pow(0.72, si);

              const isLast = si === N - 2;
              // Last segment: open-fan + straight tail; others: symmetric eye shape
              const PATH_LEN_SEG = isLast ? PATH_LEN + tailLen * 1.15 : PATH_LEN;

              const dp      = getDrawP(si);
              const drawing = dp > 0 && dp < 1;
              return (
                <g key={si}>
                  {/* 8 strands: ±1 ±2 ±3 ±4 — no flat center, all visibly arc */}
                  {([-4, -3, -2, -1, 1, 2, 3, 4] as const).map((k) => {
                    const ka = k * A;
                    // Path: last segment fans out and goes straight; others are eye/lens
                    const d = isLast
                      // Open fan then straight: pinch → bezier open → L straight tail
                      ? `M ${nx} ${CY} C ${nx+S*0.35} ${CY} ${nnx-S*0.1} ${CY+ka} ${nnx} ${CY+ka} L ${nnx+tailLen} ${CY+ka}`
                      // Normal eye segment
                      : `M ${nx} ${CY} C ${nx+S*0.38} ${CY+ka*1.35}, ${nx+S*0.62} ${CY+ka*1.35}, ${nnx} ${CY}`;
                    const ak = Math.abs(k);
                    const sw = ak === 1 ? 2.5 : ak === 2 ? 1.8 : ak === 3 ? 1.3 : 1.0;
                    // Per-strand color: inner (|k|=1) → blue, outer (|k|=4) → pink/magenta
                    const strandColor =
                      ak === 1 ? '#3b82f6' :
                      ak === 2 ? '#7c69f5' :
                      ak === 3 ? '#b94de8' :
                                 '#ec4899';
                    return (
                      <g key={k}>
                        {/* Ghost track */}
                        <path d={d} fill="none" stroke="url(#ag)" strokeWidth={sw * 0.65} opacity={0.22} />
                        {/* Drawn portion */}
                        <path
                          d={d} fill="none" stroke={strandColor} strokeWidth={sw}
                          strokeDasharray={`${PATH_LEN_SEG}`}
                          strokeDashoffset={PATH_LEN_SEG * (1 - dp)}
                          opacity={dp > 0 ? 0.92 : 0}
                          filter="url(#glow)"
                        />
                        {/* Leading-edge tip glow */}
                        {drawing && (
                          <path
                            d={d} fill="none" stroke={strandColor}
                            strokeWidth={sw * 2.2}
                            strokeDasharray={`${TIP_LEN} ${PATH_LEN_SEG * 2}`}
                            strokeDashoffset={TIP_LEN - dp * PATH_LEN_SEG}
                            opacity={0.95}
                            filter="url(#tipglow)"
                          />
                        )}
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </svg>

          {/* ── Content Columns — separated from SVG wave area ── */}
          <div style={{ position: 'relative', width: '100%', height: isMobile ? '320px' : '400px', marginTop: isMobile ? '32px' : '56px' }}>
            {methodology.map((phase, idx) => {
              const nodeX    = idx * S + startX;
              const isActive = idx === activeIdx;
              const items    = [...(phase.activities || []), ...(phase.outputs || [])];
              // Center column within its S-wide segment: shift right by half the gap
              const halfGap  = Math.floor((S - colW) / 2);
              const colLeft  = nodeX + halfGap;

              return (
                <div key={idx}>
                  {/* Vertical divider — centered in the gap between adjacent columns */}
                  {idx > 0 && (
                    <div
                      className="meth-divider"
                      style={{ left: `${nodeX}px`, top: 0, height: isMobile ? '260px' : '340px' }}
                    />
                  )}

                  {/* Phase content panel */}
                  <div
                    className="meth-col"
                    style={{ left: `${colLeft}px`, top: 0, width: `${colW}px` }}
                  >
                    {/* "Phase N" heading */}
                    <div
                      className={`meth-phase-label ${isActive ? 'meth-phase-label-active' : 'meth-phase-label-inactive'}`}
                      style={{ fontSize: isMobile ? '1.6rem' : 'clamp(1.8rem, 2.5vw, 2.6rem)' }}
                    >
                      Phase {phase.phase}
                    </div>

                    {/* Phase title */}
                    <h3
                      className={`meth-title ${isActive ? 'meth-title-active' : 'meth-title-inactive'}`}
                      style={{ fontSize: isMobile ? '1.6rem' : 'clamp(1.8rem, 2.5vw, 2.8rem)' }}
                    >
                      {phase.title}
                    </h3>

                    {/* Activities list */}
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: isMobile ? '0.4rem' : '0.55rem' }}>
                      {items.slice(0, 6).map((item, i) => (
                        <li
                          key={i}
                          className={`meth-list-item ${isActive ? 'meth-list-item-active' : 'meth-list-item-inactive'}`}
                          style={{ fontSize: isMobile ? '0.82rem' : '0.95rem' }}
                        >
                          {i + 1}.&nbsp;{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DynamicServicePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const service = typedServicesData[slug];

  const [heroSrc, setHeroSrc] = useState(`/assets/${slug}-hero.png`);

  useEffect(() => {
    if (slug) {
      setHeroSrc(`/assets/${slug}-hero.png`);
    }
  }, [slug]);

  if (!service) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#000000', color: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 600, marginBottom: '1rem' }}>Service Not Found</h1>
        <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>The requested service page could not be located.</p>
        <Link href="/industries/it-service" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#ffffff', color: '#000000', border: 'none', borderRadius: '0.5rem', fontWeight: 600, textDecoration: 'none' }}>
          Back to IT Services
        </Link>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#000000', color: '#ffffff', fontFamily: 'Inter, sans-serif', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* Hidden image element to detect fallback error automatically */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src={heroSrc} 
        alt="hidden-fallback-detector" 
        style={{ display: 'none' }}
        onError={() => setHeroSrc('/assets/cloud-services-hero.png')}
      />

      {/* ── STYLE INJECTIONS for interactive highlights and premium hover states ── */}
      <style dangerouslySetInnerHTML={{__html: `
        .neon-btn {
          background: #000000;
          color: #ffffff;
          border: 2px solid transparent;
          background-image: linear-gradient(#000000, #000000), linear-gradient(135deg, #3b82f6, #ec4899);
          background-origin: border-box;
          background-clip: padding-box, border-box;
          border-radius: 100px;
          padding: 0.85rem 2.2rem;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
          display: inline-block;
          text-align: center;
        }
        .neon-btn:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.5), 0 0 25px rgba(236, 72, 153, 0.4);
          background-image: linear-gradient(#111111, #111111), linear-gradient(135deg, #ec4899, #3b82f6);
        }
      `}} />

      {/* ── IMMERSIVE BANNER HERO — fit to screen perfectly ── */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        backgroundImage: `url("${heroSrc}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        padding: '0 clamp(1rem, 6vw, 8%) 8vh clamp(1rem, 6vw, 8%)',
      }}>
        {/* Sleek bottom dark vignette overlay for legibility */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0) 100%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '800px' }}>
          <h1 style={{
            fontSize: 'clamp(2.3rem, 5.5vw, 5rem)',
            fontWeight: 300,
            color: '#ffffff',
            margin: 0,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            textShadow: '0 4px 20px rgba(0,0,0,0.6)',
          }}>
            {service.name}
          </h1>
          <div style={{ marginTop: '2rem' }}>
            <Link href="/contact" style={{ textDecoration: 'none' }}>
              <button className="neon-btn">
                Talk to Expert
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── CORE DESCRIPTION SECTION ── */}
      <div style={{ maxWidth: '850px', margin: '0 auto', padding: '7rem 6% 3rem 6%', textAlign: 'center', position: 'relative' }}>
        {/* Subtle decorative glow blob */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none',
          zIndex: 1
        }} />

        <h2 style={{
          fontSize: 'clamp(1.6rem, 3vw, 2.5rem)',
          fontWeight: 400,
          lineHeight: 1.25,
          letterSpacing: '-0.02em',
          marginTop: '0.5rem',
          marginBottom: '2.5rem',
          color: '#ffffff',
        }}>
          {service.tagline}
        </h2>
        <p style={{
          fontSize: '1rem',
          lineHeight: 1.75,
          color: 'rgba(255, 255, 255, 0.8)',
          fontWeight: 300,
          marginBottom: '1.5rem',
        }}>
          {service.description}
        </p>
      </div>

      {/* ── BUSINESS CHALLENGES WE SOLVE — Scroll-linked highlights ── */}
      {service.challenges && service.challenges.length > 0 && (
        <ChallengesSection challenges={service.challenges} />
      )}

      {/* ── SERVICE SUITE GRID ── */}
      {service.offerings && service.offerings.length > 0 && (
        <OfferingsSection serviceName={service.name} offerings={service.offerings} />
      )}

      {/* ── METHODOLOGY TIMELINE WAVE SECTION ── */}
      {service.methodology && service.methodology.length > 0 && (
        <MethodologySection methodology={service.methodology} />
      )}

    </div>
  );
}

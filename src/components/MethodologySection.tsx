'use client';

import React, { useState, useEffect, useRef } from 'react';

export interface PhaseDetail {
  phase: number;
  title: string;
  activities: string[];
  outputs: string[];
}

export function MethodologySection({ methodology }: { methodology: PhaseDetail[] }) {
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
    const pad   = isMob ? 16 : 24;
    // Desktop: 4 phases per screen (ww/4). Mobile: 2 phases (ww/2)
    const S     = isMob ? Math.floor(ww / 2) : Math.floor(ww / 4);
    const colW  = S - (isMob ? 24 : 32);
    const tailLen = Math.floor(S * 0.55); // straight tail on last segment
    // Track must contain all columns + trailing pad + straight tail space
    const trackW      = (n - 1) * S + pad + colW + pad + tailLen;
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

  // ── Wheel / touch capture ───────────────────────────────────────────────────
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
      const rect   = el.getBoundingClientRect();
      const inView = rect.top <= 100 && rect.top > -el.offsetHeight;
      if (!inView) return;

      const goingDown = e.deltaY > 0;
      const goingUp   = e.deltaY < 0;
      const p         = progressRef.current;

      if (goingDown && p >= 1) return;
      if (goingUp   && p <= 0) return;

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
      const inView = rect.top <= 100 && rect.top > -el.offsetHeight;
      if (!inView) return;

      const dy        = touchY0 - e.touches[0].clientY;
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

  // Scale baseAmp with S so eye aspect ratio stays constant regardless of segment width
  const baseAmp = Math.max(6, Math.round(S * 0.041));
  const maxAmp  = baseAmp * (1 + (N - 3) * 0.05);
  const maxExcursion = Math.ceil(4 * maxAmp * 1.35) + 8;
  const svgHeight = 2 * maxExcursion + 16;
  const CY        = maxExcursion + 8;
  const PATH_LEN  = S * 1.8;
  const TIP_LEN   = 44; // kept for future use

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
        justifyContent: 'center',
        paddingTop: 0,
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
        .meth-title {
          margin: 0 0 0.3rem 0;
          font-weight: 600;
          line-height: 1.15;
          letter-spacing: -0.02em;
          font-family: var(--font-plus-jakarta), Inter, sans-serif;
        }
        .meth-title-active {
          background: linear-gradient(135deg, #60a5fa 0%, #f472b6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
        }
        .meth-title-inactive { color: rgba(255,255,255,0.28); }
        .meth-phase-label {
          font-weight: 400;
          line-height: 1.1;
          letter-spacing: -0.02em;
          font-family: var(--font-plus-jakarta), Inter, sans-serif;
          transition: color 0.5s ease;
          margin-bottom: 0.2rem;
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
          style={{ width: `${trackWidth}px`, height: isMobile ? `${svgHeight + 12 + 320}px` : `${svgHeight + 20 + 400}px` }}
        >
          {/* ── SVG Wave Threads ── */}
          <svg
            width={trackWidth}
            height={svgHeight}
            style={{ display: 'block', overflow: 'hidden' }}
          >
            <defs>
              {/* Blue → Pink gradient, userSpaceOnUse so all paths share same absolute coords */}
              <linearGradient id="wg" x1="0" y1="0" x2={trackWidth} y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%"   stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#f472b6" />
              </linearGradient>
              <linearGradient id="ag" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="rgba(255,255,255,0.18)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.04)" />
              </linearGradient>
            </defs>

            {Array.from({ length: N - 1 }).map((_, si) => {
              const nx  = si * S + startX;
              const nnx = (si + 1) * S + startX;

              const A = maxAmp * Math.pow(0.72, si);

              const isLast = si === N - 2;
              const PATH_LEN_SEG = isLast ? PATH_LEN + tailLen * 1.15 : PATH_LEN;

              const dp      = getDrawP(si);
              return (
                <g key={si}>
                  {([-4, -3, -2, -1, 1, 2, 3, 4] as const).map((k) => {
                    const ka = k * A;
                    const d = isLast
                      ? `M ${nx} ${CY} C ${nx+S*0.35} ${CY} ${nnx-S*0.1} ${CY+ka} ${nnx} ${CY+ka} L ${nnx+tailLen} ${CY+ka}`
                      : `M ${nx} ${CY} C ${nx+S*0.38} ${CY+ka*1.35}, ${nx+S*0.62} ${CY+ka*1.35}, ${nnx} ${CY}`;
                    const ak = Math.abs(k);
                    const sw = ak === 1 ? 2.5 : ak === 2 ? 1.8 : ak === 3 ? 1.3 : 1.0;
                    return (
                      <g key={k}>
                        <path d={d} fill="none" stroke="url(#ag)" strokeWidth={sw * 0.65} opacity={0.22} />
                        <path
                          d={d} fill="none" stroke="url(#wg)" strokeWidth={sw}
                          strokeDasharray={`${PATH_LEN_SEG}`}
                          strokeDashoffset={PATH_LEN_SEG * (1 - dp)}
                          opacity={dp > 0 ? 0.92 : 0}
                        />
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </svg>

          {/* ── Content Columns ── */}
          <div style={{ position: 'relative', width: '100%', height: isMobile ? '320px' : '400px', marginTop: isMobile ? '12px' : '20px' }}>
            {methodology.map((phase, idx) => {
              const nodeX    = idx * S + startX;
              const isActive = idx === activeIdx;
              const items    = [...(phase.activities || []), ...(phase.outputs || [])];
              const halfGap  = Math.floor((S - colW) / 2);
              const colLeft  = nodeX + halfGap;

              return (
                <div key={idx}>
                  {idx > 0 && (
                    <div
                      className="meth-divider"
                      style={{ left: `${nodeX}px`, top: 0, height: isMobile ? '260px' : '340px' }}
                    />
                  )}
                  <div
                    className="meth-col"
                    style={{ left: `${colLeft}px`, top: 0, width: `${colW}px` }}
                  >
                    <div
                      className={`meth-phase-label ${isActive ? 'meth-phase-label-active' : 'meth-phase-label-inactive'}`}
                      style={{ fontSize: isMobile ? '0.78rem' : '0.88rem' }}
                    >
                      Phase {phase.phase}
                    </div>
                    <h3
                      className={`meth-title ${isActive ? 'meth-title-active' : 'meth-title-inactive'}`}
                      style={{ fontSize: isMobile ? '1.1rem' : 'clamp(1.1rem, 1.6vw, 1.45rem)' }}
                    >
                      {phase.title}
                    </h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0.4rem 0 0 0', display: 'flex', flexDirection: 'column', gap: isMobile ? '0.2rem' : '0.28rem' }}>
                      {items.slice(0, 6).map((item, i) => (
                        <li
                          key={i}
                          className={`meth-list-item ${isActive ? 'meth-list-item-active' : 'meth-list-item-inactive'}`}
                          style={{ fontSize: isMobile ? '0.72rem' : '0.78rem' }}
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

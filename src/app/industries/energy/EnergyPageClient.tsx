'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface ProjectItem {
  id: string;
  category: string;
  year: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  metrics: string;
}

const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'ev-forecourt-modernization',
    category: 'EV & Forecourt Infrastructure',
    year: '2026',
    title: 'Petrol Forecourt to Ultra-Fast EV Charging Plazas',
    description: 'Engineering turnkey transition blueprints for fuel retail forecourts, incorporating 60kW–360kW DC fast chargers, architectural solar canopies, on-site battery storage (BESS), and dynamic load management.',
    image: '/assets/energy/energy-ev-forecourt.jpg',
    tags: ['EV Charging', 'Petrol Forecourts', 'Modular DC', 'Solar BESS'],
    metrics: '60kW–360kW DC · Turnkey Scope',
  },
  {
    id: 'hybrid-microgrid',
    category: 'Industrial Microgrids',
    year: '2026',
    title: 'Hybrid Microgrids for Industrial Facilities',
    description: 'Integrating commercial solar arrays with scalable battery energy storage systems (BESS) and automated load-balancing controllers to increase operational power resilience.',
    image: '/assets/energy/energy-microgrid-plant.jpg',
    tags: ['Microgrids', 'BESS Storage', 'Power Resilience'],
    metrics: 'Solar PV + BESS Storage',
  },
  {
    id: 'utility-solar',
    category: 'Photovoltaic Infrastructure',
    year: '2025',
    title: 'Commercial & Utility Solar Systems',
    description: 'Designing and deploying high-efficiency photovoltaic systems engineered for industrial rooftops, commercial campuses, and ground-mounted solar fields.',
    image: '/assets/energy/energy-solar-field.jpg',
    tags: ['Solar PV', 'Industrial Rooftop', 'Grid-Tied'],
    metrics: 'High-Efficiency PV Systems',
  },
  {
    id: 'green-hydrogen',
    category: 'Clean Fuels & Thermal',
    year: '2026',
    title: 'Clean Hydrogen Integration Concepts',
    description: 'Evaluating zero-emission PEM electrolyzer systems powered by dedicated renewable generation for industrial heating and clean fuel applications.',
    image: '/assets/energy/energy-clean-pipes.jpg',
    tags: ['Clean H2', 'Electrolysis', 'Industrial Heat'],
    metrics: 'Zero-Emission Electrolysis',
  },
  {
    id: 'alpine-wind',
    category: 'High-Yield Wind Generation',
    year: '2025',
    title: 'Wind Energy System Integration',
    description: 'Deploying aerodynamic, high-reliability wind turbine systems designed for commercial clean power generation and grid interconnect compliance.',
    image: '/assets/energy/energy-wind-panorama.jpg',
    tags: ['Wind Energy', 'Aerodynamic Turbines', 'Grid Compliance'],
    metrics: 'High-Reliability Wind Systems',
  },
];

export default function EnergyPageClient() {
  const projectsSpacerRef = useRef<HTMLDivElement>(null);
  const [pinState, setPinState] = useState<'before' | 'pinned' | 'after'>('before');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const spacer = projectsSpacerRef.current;
      if (!spacer) return;

      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      const top = spacer.offsetTop;
      const height = spacer.offsetHeight;

      const pinStart = top;
      const pinEnd = top + height - vh;

      if (scrollY <= pinStart) {
        setPinState('before');
        setProgress(0);
      } else if (scrollY >= pinEnd) {
        setPinState('after');
        setProgress(1);
      } else {
        setPinState('pinned');
        setProgress((scrollY - pinStart) / (pinEnd - pinStart));
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const numTransitions = PROJECTS_DATA.length - 1;
  const sliceSize = 1 / numTransitions;

  const activeCardIndex = Math.min(
    PROJECTS_DATA.length - 1,
    Math.floor(progress * (PROJECTS_DATA.length - 1) + 0.45)
  );

  const jumpToProject = (idx: number) => {
    const spacer = projectsSpacerRef.current;
    if (!spacer) return;
    const top = spacer.offsetTop;
    const height = spacer.offsetHeight;
    const vh = window.innerHeight;
    const targetScroll = top + (idx / numTransitions) * (height - vh);
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        color: '#0f172a',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflowX: 'clip',
      }}
    >
      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION (Layered: Background -> "Clean Energy" Text -> Turbine WebM Video)
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          height: '100vh',
          minHeight: '100vh',
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#111827',
        }}
      >
        {/* Layer 1: Scenic Mountain Background Image */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'url("/assets/energy-hero-bg.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            zIndex: 1,
          }}
        />

        {/* Layer 2: Giant Display Text "Clean Energy" (Sandwiched Behind Turbine) */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 2,
            width: '100%',
            textAlign: 'center',
            pointerEvents: 'none',
            userSelect: 'none',
            padding: '0 1rem',
          }}
        >
          <h1
            style={{
              fontSize: 'clamp(3.5rem, 11.5vw, 11rem)',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              lineHeight: 1,
              margin: 0,
              color: '#ffffff',
              whiteSpace: 'nowrap',
              textShadow: '0 4px 28px rgba(0, 0, 0, 0.18)',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
          >
            Clean Energy
          </h1>
        </div>

        {/* Layer 3: Turbine Video (In Front of Text) */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 3,
          }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              height: '100%',
              maxHeight: '100vh',
              width: 'auto',
              maxWidth: '100vw',
              objectFit: 'contain',
              objectPosition: 'bottom center',
              filter: 'drop-shadow(0 2px 14px rgba(245, 158, 11, 0.12)) contrast(1.02) brightness(1.02)',
            }}
          >
            <source src="/assets/turbine-alpha.webm" type="video/webm" />
            <source src="/assets/turbine.mp4" type="video/mp4" />
          </video>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. EDITORIAL MISSION SECTION (Asymmetric Cards & Statement)
      ───────────────────────────────────────────────────────────── */}
      <section
        id="energy-mission"
        style={{
          padding: 'clamp(5rem, 10vh, 8.5rem) 1.5rem',
          maxWidth: '1240px',
          margin: '0 auto',
        }}
      >
        {/* Narrative Statement */}
        <div style={{ marginBottom: '4.5rem' }}>
          <h2
            style={{
              fontSize: 'clamp(1.8rem, 3.8vw, 3.2rem)',
              fontWeight: 400,
              letterSpacing: '-0.03em',
              lineHeight: 1.25,
              color: '#0f172a',
              margin: 0,
              maxWidth: '980px',
            }}
          >
            Zawr Energy exists to make clean energy accessible, measurable, and community-powered. Because sustainability only works if enterprise infrastructure and heavy industry take part.
          </h2>
        </div>

        {/* Symmetrically Aligned Editorial Image Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(2rem, 4vw, 3.5rem)',
            alignItems: 'start',
          }}
          className="energy-editorial-grid"
        >
          {/* Card 1: Clean Industrial Pipes */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div
              style={{
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
                aspectRatio: '16 / 10',
                backgroundColor: '#f1f5f9',
              }}
            >
              <img
                src="/assets/energy/energy-clean-pipes.jpg"
                alt="Green hydrogen and geothermal industrial pipeline infrastructure"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="energy-zoom-hover"
                loading="lazy"
              />
            </div>
            <div
              style={{
                padding: '0.5rem 0.5rem 0 0.5rem',
              }}
            >
              <p
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 500,
                  color: '#1e293b',
                  lineHeight: 1.5,
                  margin: '0 0 0.5rem 0',
                }}
              >
                Why clean energy isn&apos;t just technology, it&apos;s a movement for industrial resilience.
              </p>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Advancing Grid · December 2026 Telemetry
              </span>
            </div>
          </div>

          {/* Card 2: Solar Field (Aligned) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div
              style={{
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
                aspectRatio: '16 / 10',
                backgroundColor: '#f1f5f9',
              }}
            >
              <img
                src="/assets/energy/energy-solar-field.jpg"
                alt="Utility scale photovoltaic solar energy farm"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="energy-zoom-hover"
                loading="lazy"
              />
            </div>
            <div
              style={{
                padding: '0.5rem 0.5rem 0 0.5rem',
              }}
            >
              <p
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 500,
                  color: '#1e293b',
                  lineHeight: 1.5,
                  margin: '0 0 0.5rem 0',
                }}
              >
                Utility-scale solar arrays integrated with real-time autonomous load balancing.
              </p>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                High-Yield Solar Generation · 180+ MW Peak
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. CENTERPIECE TYPOGRAPHY: SUSTAINABILITY MASK
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: 'clamp(4rem, 8vh, 7rem) 1.5rem',
          maxWidth: '1240px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Masked Typography Cutout Container */}
        <div
          style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            userSelect: 'none',
          }}
        >
          {/* Base Layer: Warm Amber Word */}
          <h2
            style={{
              fontSize: 'clamp(2.8rem, 8.8vw, 7.8rem)',
              fontWeight: 600,
              letterSpacing: '-0.035em',
              color: '#f49d37',
              margin: 0,
              lineHeight: 1.1,
              whiteSpace: 'nowrap',
            }}
          >
            Sustainability
          </h2>

          {/* Mask Layer: Center Forest Capsule Pill with Pure White Clipped Word */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '48%',
              height: '106%',
              borderRadius: '9999px',
              overflow: 'hidden',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.22)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
              pointerEvents: 'none',
            }}
          >
            {/* Darkened Forest Background Image */}
            <img
              src="/assets/energy/energy-forest-canopy.jpg"
              alt="Lush green forest canopy"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.68) contrast(1.18)',
                zIndex: 1,
              }}
            />

            {/* Clipped White Text Layer perfectly synchronized to outer text */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <h2
                style={{
                  fontSize: 'clamp(2.8rem, 8.8vw, 7.8rem)',
                  fontWeight: 600,
                  letterSpacing: '-0.035em',
                  color: '#ffffff',
                  margin: 0,
                  lineHeight: 1.1,
                  whiteSpace: 'nowrap',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.35)',
                }}
              >
                Sustainability
              </h2>
            </div>
          </div>
        </div>

        <p
          style={{
            fontSize: 'clamp(1rem, 1.6vw, 1.25rem)',
            color: '#64748b',
            maxWidth: '680px',
            margin: '2rem auto 0 auto',
            lineHeight: 1.6,
          }}
        >
          Decarbonizing industrial value chains while protecting and restoring planetary ecosystems.
        </p>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. DARK CARD: EV CHARGING & PETROL PUMP FORECOURT MODERNIZATION
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: 'clamp(4rem, 8vh, 7rem) 1.5rem',
          maxWidth: '1240px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            backgroundColor: '#0a0d14',
            color: '#ffffff',
            borderRadius: '32px',
            padding: 'clamp(2.5rem, 6vw, 5rem)',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 30px 60px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {/* Subtle Glow Gradient */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.15) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 45%)',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              position: 'relative',
              zIndex: 2,
            }}
          >
            {/* Header / Subtag */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '1.5rem',
                marginBottom: 'clamp(3rem, 6vh, 4.5rem)',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#f59e0b',
                    display: 'block',
                    marginBottom: '0.75rem',
                  }}
                >
                  E-Mobility &amp; Retail Forecourt Transition
                </span>
                <h3
                  style={{
                    fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
                    fontWeight: 400,
                    letterSpacing: '-0.03em',
                    lineHeight: 1.15,
                    margin: 0,
                    maxWidth: '680px',
                    color: '#ffffff',
                  }}
                >
                  Transforming Petrol Forecourts into High-Power EV Charging Plazas.
                </h3>
              </div>

              <Link
                href="/contact/client-relations"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  padding: '10px 24px',
                  borderRadius: '100px',
                  fontSize: '0.88rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.25s ease',
                  backdropFilter: 'blur(8px)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.color = '#000000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.color = '#ffffff';
                }}
              >
                <span>Forecourt Solutions</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>
              </Link>
            </div>

            {/* 3 Large Stat Metrics */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 'clamp(2rem, 4vw, 3.5rem)',
                paddingTop: '2rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.12)',
              }}
            >
              {/* Stat 1: 360kW Ultra-Fast DC */}
              <div>
                <div
                  style={{
                    fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
                    fontWeight: 500,
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                    color: '#f59e0b',
                    marginBottom: '0.75rem',
                  }}
                >
                  360kW
                  <span style={{ fontSize: '1.25rem', fontWeight: 400, marginLeft: '6px', color: '#ffffff' }}>DC</span>
                </div>
                <p
                  style={{
                    fontSize: '0.92rem',
                    color: '#94a3b8',
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  Ultra-fast modular charging dispensers supporting rapid battery top-ups for passenger EVs and commercial delivery fleets.
                </p>
              </div>

              {/* Stat 2: 150-1000V Architecture */}
              <div>
                <div
                  style={{
                    fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)',
                    fontWeight: 500,
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                    color: '#ffffff',
                    marginBottom: '0.75rem',
                  }}
                >
                  150–1000V
                </div>
                <p
                  style={{
                    fontSize: '0.92rem',
                    color: '#94a3b8',
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  Wide dynamic voltage architecture compatible with standard 400V passenger EVs and high-voltage 800V/1000V commercial vehicles.
                </p>
              </div>

              {/* Stat 3: OCPP 2.0 Open Standard */}
              <div>
                <div
                  style={{
                    fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)',
                    fontWeight: 500,
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                    color: '#10b981',
                    marginBottom: '0.75rem',
                  }}
                >
                  OCPP 2.0
                </div>
                <p
                  style={{
                    fontSize: '0.92rem',
                    color: '#94a3b8',
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  Open communication protocol compliance enabling automated dynamic power routing, smart billing, and real-time remote diagnostics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. BENTO GRID STATS & VERIFIED ADVISORY
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: 'clamp(4rem, 8vh, 7rem) 1.5rem',
          maxWidth: '1240px',
          margin: '0 auto',
        }}
      >
        <div style={{ marginBottom: '3.5rem' }}>
          <h2
            style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              fontWeight: 400,
              letterSpacing: '-0.03em',
              lineHeight: 1.25,
              color: '#0f172a',
              margin: 0,
              maxWidth: '820px',
            }}
          >
            Engineering Principles for Clean Energy &amp; Mobility Infrastructure.
          </h2>
        </div>

        {/* Bento Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '1.5rem',
          }}
          className="energy-bento-grid"
        >
          {/* Bento Card 1: Modular Hardware (Span 4) */}
          <div
            style={{
              gridColumn: 'span 4',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              borderRadius: '24px',
              padding: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '260px',
              boxShadow: '0 16px 32px rgba(15, 23, 42, 0.15)',
              position: 'relative',
              overflow: 'hidden',
            }}
            className="energy-bento-col-4"
          >
            <div>
              <div
                style={{
                  fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
                  fontWeight: 500,
                  letterSpacing: '-0.03em',
                  color: '#f59e0b',
                  lineHeight: 1.05,
                  marginBottom: '0.75rem',
                }}
              >
                Modular
                <span style={{ display: 'block', fontSize: '1.1rem', fontWeight: 400, color: '#ffffff' }}>Architecture</span>
              </div>
              <p
                style={{
                  fontSize: '0.9rem',
                  color: '#94a3b8',
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                Scalable hardware configurations from 60kW single dispensers to multi-megawatt plazas with integrated solar and BESS storage.
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '1.5rem',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: '#f59e0b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#000000',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                }}
              >
                ✓
              </div>
              <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 500 }}>ISO &amp; IEC Standards</span>
            </div>
          </div>

          {/* Bento Card 2: Multi-Source Generation (Span 4) */}
          <div
            style={{
              gridColumn: 'span 4',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '24px',
              padding: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '260px',
            }}
            className="energy-bento-col-4"
          >
            <div>
              <div
                style={{
                  fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
                  fontWeight: 500,
                  letterSpacing: '-0.03em',
                  color: '#0f172a',
                  lineHeight: 1.05,
                  marginBottom: '0.75rem',
                }}
              >
                Hybrid
                <span style={{ display: 'block', fontSize: '1.1rem', fontWeight: 400, color: '#64748b' }}>Microgrids</span>
              </div>
              <p
                style={{
                  fontSize: '0.92rem',
                  color: '#475569',
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                Coordinated power management combining solar generation, battery buffer storage, and utility grid interconnects.
              </p>
            </div>
            <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 500 }}>Microgrid Integration</span>
          </div>

          {/* Bento Card 3: Turnkey Deployment (Span 4) */}
          <div
            style={{
              gridColumn: 'span 4',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '24px',
              padding: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '260px',
            }}
            className="energy-bento-col-4"
          >
            <div>
              <div
                style={{
                  fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
                  fontWeight: 500,
                  letterSpacing: '-0.03em',
                  color: '#0f172a',
                  lineHeight: 1.05,
                  marginBottom: '0.75rem',
                }}
              >
                Turnkey
                <span style={{ display: 'block', fontSize: '1.1rem', fontWeight: 400, color: '#64748b' }}>Engineering</span>
              </div>
              <p
                style={{
                  fontSize: '0.92rem',
                  color: '#475569',
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                End-to-end engineering scopes encompassing site feasibility, permitting, hardware installation, and lifecycle maintenance.
              </p>
            </div>
            <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 500 }}>Lifecycle Engineering</span>
          </div>

          {/* Bento Card 4: Engineering Framework (Full Span 12) */}
          <div
            style={{
              gridColumn: 'span 12',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '24px',
              padding: 'clamp(1.75rem, 4vw, 2.75rem)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.03)',
            }}
          >
            <div style={{ maxWidth: '850px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                <span style={{ color: '#f59e0b', fontSize: '1.25rem' }}>“</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Our Engineering Blueprint
                </span>
              </div>
              <p
                style={{
                  fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
                  color: '#1e293b',
                  lineHeight: 1.6,
                  fontStyle: 'normal',
                  margin: '0 0 1rem 0',
                }}
              >
                &ldquo;Zawr Energy designs clean energy and EV charging systems grounded in transparent engineering, open communication protocols, and proven industrial electrical standards.&rdquo;
              </p>
              <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                <strong style={{ color: '#0f172a' }}>Zawr Energy Engineering Framework</strong> · Technical &amp; Infrastructure Division
              </div>
            </div>

            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                color: '#0f172a',
              }}
            >
              ⚡
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. CLEAN ENERGY PROJECTS SHOWCASE (Scroll-Pinned Stacking Cards Animation)
      ───────────────────────────────────────────────────────────── */}
      <section
        id="energy-projects"
        ref={projectsSpacerRef}
        style={{
          position: 'relative',
          height: `${(PROJECTS_DATA.length - 1) * 110 + 50}vh`,
          backgroundColor: '#ffffff',
        }}
      >
        <div
          style={
            pinState === 'pinned'
              ? { position: 'fixed', top: 0, left: 0, right: 0, height: '100vh', zIndex: 10, backgroundColor: '#ffffff', overflow: 'hidden' }
              : pinState === 'after'
              ? { position: 'absolute', bottom: 0, left: 0, right: 0, height: '100vh', zIndex: 1, backgroundColor: '#ffffff', overflow: 'hidden' }
              : { position: 'absolute', top: 0, left: 0, right: 0, height: '100vh', zIndex: 1, backgroundColor: '#ffffff', overflow: 'hidden' }
          }
        >
          {/* Top Header & Interactive Category Navigation Tabs */}
          <div
            style={{
              position: 'absolute',
              top: 'clamp(1.5rem, 3.5vh, 3rem)',
              left: 0,
              right: 0,
              maxWidth: '1240px',
              margin: '0 auto',
              padding: '0 1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '1rem',
              zIndex: 20,
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#f59e0b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  display: 'block',
                  marginBottom: '0.2rem',
                }}
              >
                Industry Solutions
              </span>
              <h2
                style={{
                  fontSize: 'clamp(1.75rem, 3.2vw, 2.6rem)',
                  fontWeight: 400,
                  letterSpacing: '-0.03em',
                  color: '#0f172a',
                  margin: 0,
                }}
              >
                Clean Energy Across Industries
              </h2>
            </div>

            {/* Interactive Category Tabs */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
              }}
            >
              {PROJECTS_DATA.map((proj, idx) => {
                const isSelected = idx === activeCardIndex;
                return (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => jumpToProject(idx)}
                    style={{
                      padding: '7px 16px',
                      fontSize: '0.82rem',
                      fontWeight: isSelected ? 600 : 400,
                      borderRadius: '100px',
                      border: '1px solid',
                      borderColor: isSelected ? '#0f172a' : '#e2e8f0',
                      backgroundColor: isSelected ? '#0f172a' : '#ffffff',
                      color: isSelected ? '#ffffff' : '#64748b',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                      boxShadow: isSelected ? '0 4px 14px rgba(15, 23, 42, 0.15)' : 'none',
                    }}
                  >
                    {proj.category}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stacked Full-Card Stage (Centered in Viewport - Matching OurProcessSection full-bleed cards) */}
          <div
            style={{
              position: 'absolute',
              top: '55%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              maxWidth: '1100px',
              height: 'clamp(440px, 60vh, 580px)',
              zIndex: 10,
            }}
          >
            {PROJECTS_DATA.map((item, index) => {
              let translateY = 0;
              let opacity = 1;

              if (index === 0) {
                translateY = 0;
                opacity = 1;
              } else {
                const cardStart = (index - 1) * sliceSize;
                const cardEnd = index * sliceSize;

                if (progress <= cardStart) {
                  translateY = 100;
                  opacity = 0;
                } else if (progress >= cardEnd) {
                  translateY = 0;
                  opacity = 1;
                } else {
                  const cardProgress = (progress - cardStart) / sliceSize;
                  translateY = (1 - cardProgress) * 100;
                  opacity = cardProgress > 0.02 ? 1 : 0;
                }
              }

              // Stacking depth effects from cards landed above
              let effectiveCardsOnTop = 0;
              for (let k = index + 1; k < PROJECTS_DATA.length; k++) {
                const kStart = (k - 1) * sliceSize;
                const kEnd = k * sliceSize;
                if (progress >= kEnd) {
                  effectiveCardsOnTop += 1;
                } else if (progress > kStart) {
                  effectiveCardsOnTop += (progress - kStart) / sliceSize;
                }
              }

              const scale = Math.max(0.88, 1 - effectiveCardsOnTop * 0.035);
              const stackShift = -effectiveCardsOnTop * 16;

              return (
                <div
                  key={item.id}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '28px',
                    overflow: 'hidden',
                    backgroundColor: '#0a0e1a',
                    zIndex: index + 1,
                    opacity,
                    transform: `translateY(calc(${translateY}% + ${stackShift}px)) scale(${scale})`,
                    transformOrigin: 'center bottom',
                    willChange: 'transform, opacity',
                    transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease',
                    boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                  className="energy-stacked-card"
                >
                  {/* Full-Bleed Card Image */}
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />

                  {/* Bottom Gradient & Text Overlay (Matching Homepage Our Process Section) */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(5, 8, 18, 0.92) 0%, rgba(5, 8, 18, 0.55) 45%, rgba(0, 0, 0, 0) 85%)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      padding: 'clamp(2rem, 4vw, 3.25rem)',
                      boxSizing: 'border-box',
                      zIndex: 2,
                    }}
                  >
                    {/* Content Area Inside Card */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        zIndex: 3,
                        maxWidth: '850px',
                      }}
                    >
                      <h3
                        style={{
                          fontSize: 'clamp(1.75rem, 3.2vw, 2.8rem)',
                          fontWeight: 500,
                          color: '#ffffff',
                          letterSpacing: '-0.025em',
                          lineHeight: 1.15,
                          margin: 0,
                          textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
                        }}
                      >
                        {item.title}
                      </h3>

                      <p
                        style={{
                          fontSize: 'clamp(0.95rem, 1.4vw, 1.12rem)',
                          color: 'rgba(255, 255, 255, 0.88)',
                          lineHeight: 1.6,
                          margin: 0,
                          textShadow: '0 1px 6px rgba(0, 0, 0, 0.4)',
                          maxWidth: '750px',
                        }}
                      >
                        {item.description}
                      </p>

                      {/* Tags & Action Button Row */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '1rem',
                          marginTop: '0.5rem',
                        }}
                      >
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              style={{
                                padding: '5px 14px',
                                borderRadius: '100px',
                                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                                backdropFilter: 'blur(8px)',
                                border: '1px solid rgba(255, 255, 255, 0.18)',
                                fontSize: '0.8rem',
                                fontWeight: 500,
                                color: '#ffffff',
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <Link
                          href="/contact/client-relations"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: '#ffffff',
                            color: '#0f172a',
                            padding: '10px 22px',
                            borderRadius: '100px',
                            fontSize: '0.88rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
                            transition: 'all 0.25s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f59e0b';
                            e.currentTarget.style.color = '#ffffff';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#ffffff';
                            e.currentTarget.style.color = '#0f172a';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          <span>Deploy with Zawr Energy</span>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. WARM AMBER / GOLD GRADIENT CALL TO ACTION BANNER
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: 'clamp(4rem, 8vh, 7rem) 1.5rem',
          maxWidth: '1240px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 55%, #c2410c 100%)',
            borderRadius: '32px',
            padding: 'clamp(3rem, 7vw, 5.5rem) clamp(2rem, 5vw, 4.5rem)',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '2rem',
            boxShadow: '0 24px 50px rgba(245, 158, 11, 0.25)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Ambient Glow Graphic */}
          <div
            style={{
              position: 'absolute',
              right: '-10%',
              top: '-30%',
              width: '500px',
              height: '500px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <h2
            style={{
              fontSize: 'clamp(2.2rem, 5.5vw, 4.2rem)',
              fontWeight: 500,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              margin: 0,
              maxWidth: '820px',
              color: '#ffffff',
              textShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            }}
          >
            Your Next Step Toward a Sustainable Future Starts Here.
          </h2>

          <p
            style={{
              fontSize: 'clamp(1rem, 1.6vw, 1.2rem)',
              lineHeight: 1.6,
              maxWidth: '680px',
              margin: 0,
              color: 'rgba(255, 255, 255, 0.92)',
            }}
          >
            Whether developing utility-scale solar generation, commissioning hybrid microgrids, or modernizing fuel forecourts with ultra-fast EV charging, partner with Zawr Energy.
          </p>

          <div style={{ marginTop: '0.5rem' }}>
            <Link
              href="/contact/client-relations"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: '#000000',
                color: '#ffffff',
                padding: '14px 34px',
                borderRadius: '100px',
                fontSize: '0.95rem',
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1e293b';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#000000';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.3)';
              }}
            >
              <span>Get Started</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Embedded CSS for responsive behaviors & hover effects */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes energyProjectFadeIn {
          from {
            opacity: 0;
            transform: translateY(14px) scale(0.99);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .energy-zoom-hover:hover {
          transform: scale(1.04);
        }

        @media (max-width: 900px) {
          .energy-bento-col-4 {
            grid-column: span 6 !important;
          }
        }

        @media (max-width: 640px) {
          .energy-mission-header {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
          .energy-bento-col-4 {
            grid-column: span 12 !important;
          }
        }
      ` }} />
    </div>
  );
}

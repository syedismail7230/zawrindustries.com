'use client';

import React, { useState } from 'react';
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
    id: 'hybrid-microgrid',
    category: 'Industrial Microgrids',
    year: '2026',
    title: 'Hybrid Microgrid for Energy Independence',
    description: 'Fusing 45MW utility solar arrays with 120MWh battery energy storage systems (BESS) and intelligent AI load-shedding algorithms to deliver 99.99% autonomous uptime for heavy industry.',
    image: '/assets/energy/energy-microgrid-plant.jpg',
    tags: ['Clean Energy', 'Full Scale', 'BESS'],
    metrics: '45MW Solar · 120MWh Storage',
  },
  {
    id: 'utility-solar',
    category: 'Photovoltaic Infrastructure',
    year: '2025',
    title: 'Utility-Scale Solar Generation Parks',
    description: 'Engineering dual-axis tracking PV fields with autonomous robotic dry-cleaning telematics, maximizing kilowatt-hour yield across arid and high-irradiance industrial regions.',
    image: '/assets/energy/energy-solar-field.jpg',
    tags: ['Solar PV', 'Robotic Telematics', 'Grid-Tied'],
    metrics: '180+ MW Peak Capacity',
  },
  {
    id: 'green-hydrogen',
    category: 'Clean Fuels & Thermal',
    year: '2026',
    title: 'Green Hydrogen & Thermal Recovery',
    description: 'Closed-loop polymer electrolyte membrane (PEM) electrolyzers powered by dedicated wind and solar arrays, supplying zero-emission hydrogen for high-temperature metallurgy.',
    image: '/assets/energy/energy-clean-pipes.jpg',
    tags: ['Green H2', 'Zero Emission', 'Heavy Industry'],
    metrics: '12,000 kg H2 / Day',
  },
  {
    id: 'alpine-wind',
    category: 'High-Yield Wind Generation',
    year: '2025',
    title: 'Alpine & Coastal Wind Corridors',
    description: 'Deploying high-torque, variable-pitch aerodynamic wind turbines engineered for extreme wind shear, generating continuous baseline clean power directly into national grids.',
    image: '/assets/energy/energy-wind-panorama.jpg',
    tags: ['Wind Energy', 'Alpine Turbine', 'Grid Baseload'],
    metrics: '95MW Clean Generation',
  },
];

export default function EnergyPageClient() {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const activeProject = PROJECTS_DATA[activeProjectIndex];

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
          1. HERO SECTION (Massive "New Energy" + Scenic Alpine Wind)
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          minHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '8rem 1.5rem 6rem 1.5rem',
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.45)), url("/assets/energy/energy-hero-wind.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          backgroundRepeat: 'no-repeat',
          color: '#ffffff',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 2,
          }}
        >
          {/* Massive Display Title */}
          <h1
            style={{
              fontSize: 'clamp(3.5rem, 11vw, 9.5rem)',
              fontWeight: 500,
              letterSpacing: '-0.04em',
              lineHeight: 0.95,
              margin: 0,
              color: '#ffffff',
              textShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              maxWidth: '1100px',
            }}
          >
            New Energy
          </h1>
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
        {/* Top Tag & Narrative */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(60px, 120px) 1fr',
            gap: '2rem',
            marginBottom: '4.5rem',
            alignItems: 'flex-start',
          }}
          className="energy-mission-header"
        >
          <div
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              color: '#94a3b8',
              fontFamily: 'monospace',
            }}
          >
            01
          </div>
          <div>
            <h2
              style={{
                fontSize: 'clamp(1.8rem, 3.8vw, 3.2rem)',
                fontWeight: 400,
                letterSpacing: '-0.03em',
                lineHeight: 1.25,
                color: '#0f172a',
                margin: 0,
                maxWidth: '960px',
              }}
            >
              Zawr Energy exists to make clean energy accessible, measurable, and community-powered. Because sustainability only works if enterprise infrastructure and heavy industry take part.
            </h2>
          </div>
        </div>

        {/* Asymmetric Floating Editorial Image Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'center',
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
                aspectRatio: '4 / 3',
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

          {/* Card 2: Solar Field (Staggered Offset) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              marginTop: 'clamp(0rem, 4vw, 3rem)',
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
        <div
          style={{
            fontSize: '1rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            color: '#94a3b8',
            fontFamily: 'monospace',
            marginBottom: '1.5rem',
          }}
        >
          02
        </div>

        {/* Masked Typography Cutout Container */}
        <div
          style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
          }}
        >
          {/* Background Pill Image Mask */}
          <div
            style={{
              position: 'absolute',
              width: 'clamp(180px, 32vw, 360px)',
              height: 'clamp(70px, 12vw, 130px)',
              borderRadius: '100px',
              overflow: 'hidden',
              boxShadow: '0 16px 36px rgba(0, 0, 0, 0.15)',
              zIndex: 1,
            }}
          >
            <img
              src="/assets/energy/energy-forest-canopy.jpg"
              alt="Lush green natural forest canopy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.9) contrast(1.1)',
              }}
            />
          </div>

          {/* Giant Word "Sustainability" Overlay */}
          <h2
            style={{
              fontSize: 'clamp(2.8rem, 9.5vw, 8rem)',
              fontWeight: 600,
              letterSpacing: '-0.04em',
              color: '#f59e0b',
              margin: 0,
              position: 'relative',
              zIndex: 2,
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            Sustainability
          </h2>
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
          4. DARK GLOBAL IMPACT MATRIX CARD (World Can't Wait)
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
          {/* Subtle World Map Watermark / Ambient Gradient */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.12) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.08) 0%, transparent 45%)',
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
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    color: '#f59e0b',
                    fontFamily: 'monospace',
                    display: 'block',
                    marginBottom: '0.75rem',
                  }}
                >
                  03
                </span>
                <h3
                  style={{
                    fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
                    fontWeight: 400,
                    letterSpacing: '-0.03em',
                    lineHeight: 1.15,
                    margin: 0,
                    maxWidth: '640px',
                    color: '#ffffff',
                  }}
                >
                  The World Can&apos;t Wait. Here&apos;s Why We Need Clean Energy Now.
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
                <span>Our Solutions</span>
                <span style={{ fontSize: '1rem' }}>↗</span>
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
              {/* Stat 1 */}
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
                  40.9B
                  <span style={{ fontSize: '1.25rem', fontWeight: 400, marginLeft: '6px', color: '#ffffff' }}>tons</span>
                </div>
                <p
                  style={{
                    fontSize: '0.92rem',
                    color: '#94a3b8',
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  Global annual CO₂ emissions baseline recorded across heavy industrial sectors.
                </p>
              </div>

              {/* Stat 2 */}
              <div>
                <div
                  style={{
                    fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
                    fontWeight: 500,
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                    color: '#ffffff',
                    marginBottom: '0.75rem',
                  }}
                >
                  80%
                </div>
                <p
                  style={{
                    fontSize: '0.92rem',
                    color: '#94a3b8',
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  Digitalized grid operational uptime and telemetry efficiency across Zawr installations.
                </p>
              </div>

              {/* Stat 3 */}
              <div>
                <div
                  style={{
                    fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
                    fontWeight: 500,
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                    color: '#10b981',
                    marginBottom: '0.75rem',
                  }}
                >
                  -45%
                </div>
                <p
                  style={{
                    fontSize: '0.92rem',
                    color: '#94a3b8',
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  Corporate Scope 1 &amp; Scope 2 emissions reduction achieved by 2030 partner commitments.
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
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(60px, 120px) 1fr',
            gap: '2rem',
            marginBottom: '3.5rem',
            alignItems: 'flex-start',
          }}
          className="energy-mission-header"
        >
          <div
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              color: '#94a3b8',
              fontFamily: 'monospace',
            }}
          >
            04
          </div>
          <div>
            <h2
              style={{
                fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                fontWeight: 400,
                letterSpacing: '-0.03em',
                lineHeight: 1.25,
                color: '#0f172a',
                margin: 0,
                maxWidth: '780px',
              }}
            >
              Every number here represents a step toward a sustainable future and the communities we serve.
            </h2>
          </div>
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
          {/* Bento Card 1: Dark Offset Accent (Span 4) */}
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
                85,000+
                <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: 400, color: '#ffffff' }}>tons</span>
              </div>
              <p
                style={{
                  fontSize: '0.9rem',
                  color: '#94a3b8',
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                Carbon emissions offset annually through operational clean energy infrastructure.
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
              <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 500 }}>Verified Audit</span>
            </div>
          </div>

          {/* Bento Card 2: 120+ MW Generation (Span 4) */}
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
                120+ MW
              </div>
              <p
                style={{
                  fontSize: '0.92rem',
                  color: '#475569',
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                Installed clean generation and dispatch capacity across solar, wind, and industrial storage.
              </p>
            </div>
            <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 500 }}>Active Assets</span>
          </div>

          {/* Bento Card 3: 50+ Projects (Span 4) */}
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
                50+
              </div>
              <p
                style={{
                  fontSize: '0.92rem',
                  color: '#475569',
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                Grid-tied industrial microgrid &amp; BESS complexes in commercial operation worldwide.
              </p>
            </div>
            <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 500 }}>Global Footprint</span>
          </div>

          {/* Bento Card 4: Advisory Quote (Full Span 12) */}
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
                  Enterprise Transition Feedback
                </span>
              </div>
              <p
                style={{
                  fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
                  color: '#1e293b',
                  lineHeight: 1.6,
                  fontStyle: 'italic',
                  margin: '0 0 1rem 0',
                }}
              >
                &ldquo;Zawr Energy&apos;s hybrid microgrid infrastructure helped us transition 60% of our precision manufacturing plants to 24/7 renewable power in under 18 months.&rdquo;
              </p>
              <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                <strong style={{ color: '#0f172a' }}>Advisory Board &amp; Industrial Partner</strong> · Heavy Manufacturing Consortium
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
          6. FULL-WIDTH PANORAMIC CINEMATIC WIND BANNER
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: '2rem 1.5rem clamp(5rem, 10vh, 8rem) 1.5rem',
          maxWidth: '1240px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            position: 'relative',
            borderRadius: '32px',
            overflow: 'hidden',
            aspectRatio: '21 / 9',
            minHeight: '360px',
            boxShadow: '0 24px 50px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          className="energy-panorama-box"
        >
          <img
            src="/assets/energy/energy-wind-panorama.jpg"
            alt="Alpine and coastal wind turbines at sunset"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          {/* Subtle gradient overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.45))',
            }}
          />

          {/* Centered Floating Pill Badge */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
            }}
          >
            <Link
              href="/contact/client-relations"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 28px',
                borderRadius: '100px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                color: '#ffffff',
                fontSize: '0.95rem',
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                e.currentTarget.style.color = '#000000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.color = '#ffffff';
              }}
            >
              <span>Our Impact</span>
              <span style={{ fontSize: '1.1rem' }}>↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. CLEAN ENERGY PROJECTS SHOWCASE
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: 'clamp(4rem, 8vh, 7rem) 1.5rem',
          maxWidth: '1240px',
          margin: '0 auto',
          borderTop: '1px solid #f1f5f9',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginBottom: '3.5rem',
          }}
        >
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
            <span
              style={{
                fontSize: '1rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                color: '#94a3b8',
                fontFamily: 'monospace',
              }}
            >
              05
            </span>
            <h2
              style={{
                fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                fontWeight: 400,
                letterSpacing: '-0.03em',
                color: '#0f172a',
                margin: 0,
              }}
            >
              Clean Energy Across Industries
            </h2>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
            }}
          >
            {PROJECTS_DATA.map((proj, idx) => {
              const isSelected = idx === activeProjectIndex;
              return (
                <button
                  key={proj.id}
                  type="button"
                  onClick={() => setActiveProjectIndex(idx)}
                  style={{
                    padding: '8px 16px',
                    fontSize: '0.82rem',
                    fontWeight: isSelected ? 600 : 400,
                    borderRadius: '100px',
                    border: '1px solid',
                    borderColor: isSelected ? '#000000' : '#e2e8f0',
                    backgroundColor: isSelected ? '#000000' : '#ffffff',
                    color: isSelected ? '#ffffff' : '#64748b',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {proj.category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Project Highlight Card */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(2.5rem, 5vw, 4.5rem)',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            borderRadius: '32px',
            padding: 'clamp(1.5rem, 3vw, 2.5rem)',
            border: '1px solid #f1f5f9',
            boxShadow: '0 20px 45px rgba(0, 0, 0, 0.04)',
          }}
          className="energy-project-split"
        >
          {/* Left Column: Project Copy */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#f59e0b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {activeProject.category}
              </span>
              <span style={{ color: '#cbd5e1' }}>·</span>
              <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>{activeProject.year}</span>
            </div>

            <h3
              style={{
                fontSize: 'clamp(1.75rem, 3.2vw, 2.6rem)',
                fontWeight: 400,
                letterSpacing: '-0.03em',
                color: '#0f172a',
                lineHeight: 1.2,
                margin: 0,
              }}
            >
              {activeProject.title}
            </h3>

            <p
              style={{
                fontSize: '1rem',
                color: '#475569',
                lineHeight: 1.75,
                margin: 0,
              }}
            >
              {activeProject.description}
            </p>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              {activeProject.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '100px',
                    backgroundColor: '#f1f5f9',
                    fontSize: '0.78rem',
                    fontWeight: 500,
                    color: '#475569',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <Link
                href="/contact/client-relations"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  textDecoration: 'none',
                  borderBottom: '1px solid #0f172a',
                  paddingBottom: '2px',
                  transition: 'opacity 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                <span>Deploy with Zawr Energy</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Project Image */}
          <div
            style={{
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden',
              aspectRatio: '16 / 10',
              boxShadow: '0 16px 36px rgba(0, 0, 0, 0.08)',
              backgroundColor: '#f1f5f9',
            }}
          >
            <img
              src={activeProject.image}
              alt={activeProject.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />

            {/* Floating Top-Right Badges */}
            <div
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                display: 'flex',
                gap: '8px',
              }}
            >
              <span
                style={{
                  padding: '6px 14px',
                  borderRadius: '100px',
                  backgroundColor: 'rgba(0, 0, 0, 0.65)',
                  backdropFilter: 'blur(8px)',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                }}
              >
                {activeProject.metrics}
              </span>
            </div>
          </div>
        </div>

        {/* Carousel indicator dots */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '2rem',
          }}
        >
          {PROJECTS_DATA.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveProjectIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              style={{
                width: idx === activeProjectIndex ? '28px' : '8px',
                height: '8px',
                borderRadius: '100px',
                backgroundColor: idx === activeProjectIndex ? '#0f172a' : '#cbd5e1',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                padding: 0,
              }}
            />
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. WARM AMBER / GOLD GRADIENT CALL TO ACTION BANNER
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
            Whether developing utility-scale solar generation, commissioning hybrid microgrids, or executing corporate decarbonization strategies, partner with Zawr Energy.
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
              <span style={{ fontSize: '1.15rem' }}>↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Embedded CSS for responsive behaviors & hover effects */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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
          .energy-panorama-box {
            aspect-ratio: 16 / 10 !important;
          }
        }
      ` }} />
    </div>
  );
}

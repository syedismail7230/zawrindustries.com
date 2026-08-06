'use client';

import React from 'react';

export default function AboutMission() {
  return (
    <section
      id="mission"
      style={{
        backgroundColor: '#090d16',
        color: '#ffffff',
        padding: 'clamp(5rem, 8vw, 8rem) 1.5rem',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: 'relative',
        scrollMarginTop: '80px',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: 'clamp(2rem, 5vw, 5rem)',
          alignItems: 'flex-start',
        }}
      >
        <div style={{ gridColumn: 'span 4' }} className="mission-col">
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              fontWeight: 300,
              color: '#ffffff',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            Our Mission
          </h2>
        </div>

        <div style={{ gridColumn: 'span 8' }} className="mission-col">
          <p
            style={{
              fontSize: 'clamp(1.2rem, 2.3vw, 1.55rem)',
              fontWeight: 300,
              color: '#ffffff',
              lineHeight: 1.6,
              margin: '0 0 2rem 0',
            }}
          >
            To engineer high-performance software ecosystems, autonomous robotics, and strategic capital assets that drive compounding growth, operational resilience, and measurable economic value for global industry leaders.
          </p>

          {/* Key Mission Pillars */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1.5rem',
              paddingTop: '2rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            }}
            className="mission-pillars-grid"
          >
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.35rem' }}>
                Engineering Precision
              </div>
              <div style={{ fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.55, fontWeight: 400 }}>
                Building Zero-Trust, high-frequency enterprise software architectures.
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.35rem' }}>
                Operational Value
              </div>
              <div style={{ fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.55, fontWeight: 400 }}>
                Maximizing throughput and eliminating downtime via autonomous telemetry.
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.35rem' }}>
                Societal Progress
              </div>
              <div style={{ fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.55, fontWeight: 400 }}>
                Fostering workforce development, regional job creation, and economic growth.
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .mission-col {
            grid-column: span 12 !important;
          }
          .mission-pillars-grid {
            grid-template-columns: 1fr !important;
            gap: 1.25rem !important;
          }
        }
      `}</style>
    </section>
  );
}


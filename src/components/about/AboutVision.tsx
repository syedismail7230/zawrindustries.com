'use client';

import React from 'react';

export default function AboutVision() {
  return (
    <section
      id="vision"
      style={{
        backgroundColor: '#ffffff',
        color: '#0f172a',
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
        <div style={{ gridColumn: 'span 4' }} className="vision-col">
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              fontWeight: 300,
              color: '#0f172a',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            Our Vision
          </h2>
        </div>

        <div style={{ gridColumn: 'span 8' }} className="vision-col">
          <p
            style={{
              fontSize: 'clamp(1.2rem, 2.3vw, 1.55rem)',
              fontWeight: 300,
              color: '#0f172a',
              lineHeight: 1.6,
              margin: '0 0 2rem 0',
            }}
          >
            To pioneer the next era of industrial autonomy, digital transformation, and sustainable infrastructure—setting the global benchmark for multi-sector enterprise excellence.
          </p>

          {/* Key Strategic Pillars */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1.5rem',
              paddingTop: '2rem',
              borderTop: '1px solid #e2e8f0',
            }}
            className="vision-pillars-grid"
          >
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.35rem' }}>
                Global Leadership
              </div>
              <div style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.55, fontWeight: 400 }}>
                Architecting borderless software platforms & strategic capital portfolios.
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.35rem' }}>
                Autonomous Scale
              </div>
              <div style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.55, fontWeight: 400 }}>
                Deploying self-optimizing robotics & smart industrial ecosystems.
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.35rem' }}>
                Sustainable Impact
              </div>
              <div style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.55, fontWeight: 400 }}>
                Building carbon-neutral real estate corridors & clean energy frameworks.
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .vision-col {
            grid-column: span 12 !important;
          }
          .vision-pillars-grid {
            grid-template-columns: 1fr !important;
            gap: 1.25rem !important;
          }
        }
      `}</style>
    </section>
  );
}


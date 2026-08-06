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
          alignItems: 'center',
        }}
      >
        <div style={{ gridColumn: 'span 4' }} className="vision-col">
          <div
            style={{
              fontSize: '0.78rem',
              textTransform: 'uppercase',
              letterSpacing: '0.22em',
              color: '#3b82f6',
              fontWeight: 600,
              marginBottom: '0.75rem',
            }}
          >
            SECTION 07
          </div>
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
              fontSize: 'clamp(1.15rem, 2.2vw, 1.45rem)',
              fontWeight: 300,
              color: '#334155',
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            To become a globally recognized multi-sector industrial conglomerate known for architecting world-class software platforms, autonomous manufacturing infrastructure, and sustainable real estate corridors that empower organizations to thrive in an interconnected global economy.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .vision-col {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </section>
  );
}

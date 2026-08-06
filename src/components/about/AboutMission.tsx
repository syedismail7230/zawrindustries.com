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
          alignItems: 'center',
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
              fontSize: 'clamp(1.15rem, 2.2vw, 1.45rem)',
              fontWeight: 300,
              color: 'rgba(255, 255, 255, 0.85)',
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            To empower enterprises and organizations through innovative technology, reliable software engineering, autonomous robotics, and strategic capital development that create measurable business value, operational efficiency, and lasting societal impact.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .mission-col {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </section>
  );
}

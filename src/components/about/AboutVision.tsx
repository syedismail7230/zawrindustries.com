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
              fontSize: 'clamp(1.15rem, 2vw, 1.4rem)',
              fontWeight: 300,
              color: '#0f172a',
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            To establish Zawr Industries as a globally recognized, multi-sector conglomerate that integrates technology, manufacturing, logistics, and asset management into a unified, innovation-driven ecosystem, delivering sustainable growth, operational excellence, and long-term stakeholder value across international markets.
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



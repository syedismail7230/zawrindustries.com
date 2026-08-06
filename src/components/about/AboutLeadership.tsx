'use client';

import React from 'react';

export default function AboutLeadership() {
  return (
    <section
      style={{
        backgroundColor: '#f8fafc',
        color: '#0f172a',
        padding: 'clamp(5rem, 8vw, 8rem) 1.5rem',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: 'relative',
        borderTop: '1px solid #e2e8f0',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: 'clamp(3rem, 6vw, 6rem)',
          alignItems: 'center',
        }}
      >
        {/* Left Column: Managing Director Portrait Image */}
        <div
          style={{
            gridColumn: 'span 5',
            position: 'relative',
          }}
          className="leadership-portrait-col"
        >
          <div
            style={{
              position: 'relative',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0,0,0,0.1)',
              backgroundColor: '#e2e8f0',
              aspectRatio: '3.2 / 4',
            }}
          >
            <img
              src="/assets/md-portrait.png"
              alt="Managing Director - Zawr Industries"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
        </div>

        {/* Right Column: Executive Vision & Message */}
        <div
          style={{
            gridColumn: 'span 7',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.75rem',
          }}
          className="leadership-text-col"
        >
          <div
            style={{
              fontSize: '0.78rem',
              textTransform: 'uppercase',
              letterSpacing: '0.22em',
              color: '#64748b',
              fontWeight: 600,
            }}
          >
            EXECUTIVE LEADERSHIP & VISION
          </div>

          <h2
            style={{
              fontSize: 'clamp(1.8rem, 3.8vw, 3rem)',
              fontWeight: 300,
              color: '#0f172a',
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            "Technology is not merely a toolâ€”it is the structural foundation of modern enterprise value."
          </h2>

          <div
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.1rem)',
              color: '#475569',
              lineHeight: 1.8,
              fontWeight: 400,
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
          >
            <p style={{ margin: 0 }}>
              At Zawr Industries, we approach technology from a holistic engineering perspective. Whether architecting high-frequency digital platforms, building autonomous manufacturing hubs, or developing sustainable real estate corridors, our mission remains absolute: deliver uncompromised quality, resilience, and measurable long-term impact.
            </p>
            <p style={{ margin: 0 }}>
              We partner with visionary enterprises worldwide to accelerate their digital evolution, streamline operations, and create category-defining platforms.
            </p>
          </div>

          {/* Signature / Designation */}
          <div style={{ marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid #cbd5e1' }}>
            <div style={{ fontSize: '1.15rem', fontWeight: 600, color: '#0f172a', letterSpacing: '-0.01em' }}>
              Office of the Managing Director
            </div>
            <div style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '0.2rem', fontWeight: 400 }}>
              Zawr Industries LLP â€” Global Executive Operations
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .leadership-portrait-col, .leadership-text-col {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </section>
  );
}

'use client';

import React from 'react';

const impactStats = [
  { value: '50+', label: 'Enterprise Clients Worldwide' },
  { value: '12+', label: 'Proprietary Tech & Industry Platforms' },
  { value: '99.9%', label: 'Platform Reliability & Uptime SLA' },
  { value: '3', label: 'Global Delivery & Innovation Hubs' },
];

export default function AboutImpact() {
  return (
    <section
      id="impact"
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
        }}
      >
        {/* Header */}
        <div style={{ maxWidth: '750px', marginBottom: 'clamp(3rem, 5vw, 4.5rem)' }}>
          <div
            style={{
              fontSize: '0.78rem',
              textTransform: 'uppercase',
              letterSpacing: '0.22em',
              color: '#60a5fa',
              fontWeight: 600,
              marginBottom: '0.75rem',
            }}
          >
            SECTION 04
          </div>
          <h2
            style={{
              fontSize: 'clamp(1.8rem, 3.8vw, 3rem)',
              fontWeight: 300,
              color: '#ffffff',
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            Our Global Economic & Technology Impact
          </h2>
        </div>

        {/* World Map Vector */}
        <div style={{ maxWidth: '900px', margin: '0 auto clamp(3.5rem, 6vw, 5rem) auto' }}>
          <img
            src="/assets/world-map.svg"
            alt="Zawr Global Footprint"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '420px',
              display: 'block',
              margin: '0 auto',
              opacity: 0.85,
            }}
          />
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '2rem',
            textAlign: 'center',
            paddingTop: '2.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}
          className="impact-stats-grid"
        >
          {impactStats.map((stat, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div
                style={{
                  fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                  fontWeight: 300,
                  color: '#ffffff',
                  letterSpacing: '-0.03em',
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: '0.88rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: 400,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .impact-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 2rem 1rem !important;
          }
        }
      `}</style>
    </section>
  );
}

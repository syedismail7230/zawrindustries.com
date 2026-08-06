'use client';

import React from 'react';

const impactStats = [
  { value: '50+', label: 'Enterprise Clients Globally' },
  { value: '12+', label: 'Core Tech & Industry Platforms' },
  { value: '99.9%', label: 'Platform Uptime & Reliability SLA' },
  { value: '3', label: 'Global Delivery & Tech Hubs' },
];

export default function AboutGlobalImpact() {
  return (
    <section
      style={{
        backgroundColor: '#ffffff',
        color: '#0f172a',
        padding: 'clamp(6rem, 10vw, 9rem) 1.5rem',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: 'relative',
        borderTop: '1px solid #e2e8f0',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
        }}
      >
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto clamp(3.5rem, 6vw, 5rem) auto' }}>
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
            GLOBAL FOOTPRINT & REACH
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
            Delivering Enterprise Engineering Across India, UAE & International Markets
          </h2>
        </div>

        {/* Global World Map Vector Container */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '1000px',
            margin: '0 auto clamp(4rem, 6vw, 6rem) auto',
            padding: '2rem 1rem',
          }}
        >
          <img
            src="/assets/world-map.svg"
            alt="Zawr Industries Global Footprint Map"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '480px',
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
            borderTop: '1px solid rgba(15, 23, 42, 0.08)',
          }}
          className="stats-grid"
        >
          {impactStats.map((stat, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div
                style={{
                  fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                  fontWeight: 300,
                  color: '#0f172a',
                  letterSpacing: '-0.03em',
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: '0.88rem',
                  color: '#64748b',
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
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 2.5rem 1.5rem !important;
          }
        }
      `}</style>
    </section>
  );
}

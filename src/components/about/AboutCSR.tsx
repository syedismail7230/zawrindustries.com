'use client';

import React from 'react';

const csrPillars = [
  {
    title: 'Sustainability & Environmental Stewardship',
    image: '/assets/sustainability-environment.png',
    desc: 'Promoting eco-friendly energy grids, green building materials, and carbon-reduction initiatives across all operations.',
  },
  {
    title: 'Community & Economic Empowerment',
    image: '/assets/sustainability-empowerment.png',
    desc: 'Investing in local job creation, tech skills training, and sustainable community growth initiatives in India and UAE.',
  },
];

export default function AboutCSR() {
  return (
    <section
      id="csr"
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
        }}
      >
        {/* Header */}
        <div style={{ maxWidth: '750px', marginBottom: 'clamp(3rem, 5vw, 4.5rem)' }}>
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
            SECTION 09
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
            Corporate Social Responsibility (CSR)
          </h2>
        </div>

        {/* CSR Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '2rem',
          }}
        >
          {csrPillars.map((item, index) => (
            <div
              key={index}
              style={{
                gridColumn: 'span 6',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
              }}
              className="csr-card"
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16 / 10',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  backgroundColor: '#f1f5f9',
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 500, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.96rem', color: '#64748b', lineHeight: 1.65, margin: 0, fontWeight: 400 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .csr-card {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </section>
  );
}

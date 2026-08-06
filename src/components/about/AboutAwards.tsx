'use client';

import React from 'react';

const awardsList = [
  {
    title: 'Top Enterprise Technology Provider',
    issuer: 'APAC Tech Excellence Awards',
    year: '2025',
    category: 'Software & AI Integration',
  },
  {
    title: 'Industrial Autonomy Partner of the Year',
    issuer: 'Robotics & Manufacturing Forum',
    year: '2025',
    category: 'Smart Manufacturing',
  },
  {
    title: 'Sustainable PropTech Development Award',
    issuer: 'Global Urban Infrastructure Summit',
    year: '2024',
    category: 'Real Estate & PropTech',
  },
];

export default function AboutAwards() {
  return (
    <section
      id="awards"
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
            SECTION 03
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
            Awards & Industry Recognition
          </h2>
        </div>

        {/* Awards Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '2rem',
          }}
        >
          {awardsList.map((award, index) => (
            <div
              key={index}
              style={{
                gridColumn: 'span 4',
                padding: '2.5rem 2rem',
                backgroundColor: '#fafafa',
                borderRadius: '18px',
                border: '1px solid rgba(15, 23, 42, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
              className="award-card"
            >
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#3b82f6', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                {award.category} • {award.year}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 500, color: '#0f172a', margin: 0, lineHeight: 1.35 }}>
                {award.title}
              </h3>
              <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 400 }}>
                Issued by {award.issuer}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .award-card {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </section>
  );
}

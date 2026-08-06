'use client';

import React from 'react';

const coreValues = [
  {
    number: '01',
    title: 'Zero-Compromise Engineering',
    desc: 'We build systems with high-availability, security-first protocols, and long-term architectural maintainability.',
  },
  {
    number: '02',
    title: 'Intellectual Rigor & Innovation',
    desc: 'Continuously pushing the boundaries of AI, autonomous industrial robotics, and biophilic real estate design.',
  },
  {
    number: '03',
    title: 'Respect to Talent & Autonomy',
    desc: 'Empowering deep technical leaders and multidisciplinary creators to take end-to-end ownership of transformative projects.',
  },
  {
    number: '04',
    title: 'Generational Legacy & Responsibility',
    desc: 'Creating physical, digital, and economic assets engineered to create lasting value for decades to come.',
  },
];

export default function AboutValues() {
  return (
    <section
      id="values"
      style={{
        backgroundColor: '#f8fafc',
        color: '#0f172a',
        padding: 'clamp(5rem, 8vw, 8rem) 1.5rem',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: 'relative',
        borderTop: '1px solid #e2e8f0',
        borderBottom: '1px solid #e2e8f0',
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
            SECTION 06
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
            Our Core Values & Operating Principles
          </h2>
        </div>

        {/* Values Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '2rem',
          }}
        >
          {coreValues.map((value, index) => (
            <div
              key={index}
              style={{
                gridColumn: 'span 6',
                padding: '2.5rem 2rem',
                backgroundColor: '#ffffff',
                borderRadius: '18px',
                border: '1px solid rgba(15, 23, 42, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
              className="value-card"
            >
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.08em' }}>
                {value.number}
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 500, color: '#0f172a', margin: 0, letterSpacing: '-0.01em' }}>
                {value.title}
              </h3>
              <p style={{ fontSize: '0.96rem', color: '#64748b', lineHeight: 1.65, margin: 0, fontWeight: 400 }}>
                {value.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .value-card {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </section>
  );
}

'use client';

import React from 'react';

const ethicsPrinciples = [
  { title: 'Zero-Trust Data Protection', desc: 'Strict data privacy controls, SOC2 compliance, and end-to-end security architecture.' },
  { title: 'Transparent Governance', desc: 'Full financial, operational, and regulatory accountability in all market jurisdictions.' },
  { title: 'Fair Employment & Diversity', desc: 'Fostering an inclusive, harassment-free workplace rooted in meritocracy and equal growth.' },
  { title: 'Anti-Corruption & Integrity', desc: 'Absolute compliance with global anti-bribery, anti-corruption, and ethical commerce laws.' },
];

export default function AboutCodeOfConduct() {
  return (
    <section
      id="code-of-conduct"
      style={{
        backgroundColor: '#ffffff',
        color: '#0f172a',
        padding: 'clamp(5rem, 8vw, 8rem) 1.5rem',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: 'relative',
        borderTop: '1px solid #e2e8f0',
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
            SECTION 11
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
            Code of Conduct & Business Ethics
          </h2>
        </div>

        {/* Ethics Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '2rem',
          }}
        >
          {ethicsPrinciples.map((item, index) => (
            <div
              key={index}
              style={{
                gridColumn: 'span 6',
                padding: '2.25rem 2rem',
                backgroundColor: '#fafafa',
                borderRadius: '18px',
                border: '1px solid rgba(15, 23, 42, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
              className="ethics-card"
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: 500, color: '#0f172a', margin: 0, letterSpacing: '-0.01em' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.94rem', color: '#64748b', lineHeight: 1.6, margin: 0, fontWeight: 400 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .ethics-card {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </section>
  );
}

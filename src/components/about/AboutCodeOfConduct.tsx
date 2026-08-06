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
        borderTop: '1px solid #f1f5f9',
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

        {/* Ethics Grid with In-Between Divider Lines */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
          }}
        >
          {ethicsPrinciples.map((item, index) => {
            const isLeftCol = index % 2 === 0;
            const isTopRow = index < 2;

            return (
              <div
                key={index}
                style={{
                  gridColumn: 'span 6',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                  paddingLeft: isLeftCol ? 0 : 'clamp(1.5rem, 3.5vw, 3.5rem)',
                  paddingRight: isLeftCol ? 'clamp(1.5rem, 3.5vw, 3.5rem)' : 0,
                  paddingTop: isTopRow ? 0 : 'clamp(1.5rem, 3vw, 2.5rem)',
                  paddingBottom: isTopRow ? 'clamp(1.5rem, 3vw, 2.5rem)' : 0,
                  borderRight: isLeftCol ? '1px solid #e2e8f0' : 'none',
                  borderBottom: isTopRow ? '1px solid #e2e8f0' : 'none',
                }}
                className={`ethics-item ${isLeftCol ? 'ethics-item-left' : ''} ${isTopRow ? 'ethics-item-top' : ''}`}
              >
                <h3 style={{ fontSize: '1.2rem', fontWeight: 500, color: '#0f172a', margin: 0, letterSpacing: '-0.01em' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.94rem', color: '#64748b', lineHeight: 1.65, margin: 0, fontWeight: 400 }}>
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .ethics-item {
            grid-column: span 12 !important;
            border-right: none !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
            border-bottom: 1px solid #e2e8f0 !important;
            padding-top: 1.5rem !important;
            padding-bottom: 1.5rem !important;
          }
          .ethics-item:last-child {
            border-bottom: none !important;
          }
        }
      `}</style>
    </section>
  );
}



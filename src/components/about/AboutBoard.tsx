'use client';

import React from 'react';

export default function AboutBoard() {
  return (
    <section
      id="board"
      style={{
        backgroundColor: '#f8fafc',
        color: '#0f172a',
        padding: 'clamp(5rem, 8vw, 8rem) 1.5rem',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: 'relative',
        zIndex: 20,
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
            SECTION 02
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
            Board of Directors & Executive Leadership
          </h2>
        </div>

        {/* Board Showcase */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: 'clamp(3rem, 6vw, 6rem)',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              gridColumn: 'span 5',
              position: 'relative',
            }}
            className="board-col"
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

          <div
            style={{
              gridColumn: 'span 7',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}
            className="board-col"
          >
            <div style={{ fontSize: '1.5rem', fontWeight: 500, color: '#0f172a', letterSpacing: '-0.02em' }}>
              Office of the Managing Director
            </div>
            <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.8, margin: 0, fontWeight: 400 }}>
              Guided by experienced technology pioneers and industrial strategists, the Board of Directors at Zawr Industries LLP governs corporate governance, capital allocation, global expansion, and multi-sector strategy.
            </p>
            <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.8, margin: 0, fontWeight: 400 }}>
              Our executive board ensures that every initiative across software, robotics, and real estate adheres to strict ethical standards, financial discipline, and zero-compromise engineering quality.
            </p>

            <div style={{ paddingTop: '1.5rem', borderTop: '1px solid #cbd5e1' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                CORPORATE GOVERNANCE COMMITTEES
              </div>
              <div style={{ fontSize: '0.94rem', color: '#64748b', marginTop: '0.5rem', lineHeight: 1.6 }}>
                Audit & Compliance • Risk & Cybersecurity • Technology & R&D • Global Strategy
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .board-col {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </section>
  );
}

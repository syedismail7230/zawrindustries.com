'use client';

import React from 'react';

export default function AboutBoard() {
  return (
    <section
      id="board"
      style={{
        backgroundColor: '#ffffff',
        color: '#0f172a',
        padding: 'clamp(4rem, 7vw, 7rem) 1.5rem',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: 'relative',
        zIndex: 20,
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
        {/* Section Header */}
        <div style={{ maxWidth: '750px', marginBottom: 'clamp(3rem, 5vw, 5rem)' }}>
          <div
            style={{
              fontSize: '0.78rem',
              textTransform: 'uppercase',
              letterSpacing: '0.22em',
              color: '#64748b',
              fontWeight: 600,
              marginBottom: '0.75rem',
            }}
          >
            SECTION 02
          </div>
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
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

        {/* TOP ROW: Sitting MD Image (Left) + Office of MD Governance Box (Right) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: 'clamp(2rem, 4vw, 4rem)',
            alignItems: 'center',
            marginBottom: 'clamp(4rem, 7vw, 7rem)',
          }}
        >
          {/* Sitting MD Image */}
          <div
            style={{
              gridColumn: 'span 5',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
            className="board-row-col"
          >
            <div
              style={{
                width: '100%',
                maxWidth: '460px',
                aspectRatio: '3.2 / 4',
                position: 'relative',
              }}
            >
              <img
                src="/assets/MD-office.png"
                alt="Office of the Managing Director - Zawr Industries"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  objectPosition: 'center',
                  display: 'block',
                }}
              />
            </div>
          </div>

          {/* MD Governance Box */}
          <div
            style={{
              gridColumn: 'span 7',
              backgroundColor: '#f8fafc',
              padding: 'clamp(2rem, 3.5vw, 3.5rem)',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
            className="board-row-col"
          >
            <h3
              style={{
                fontSize: 'clamp(1.3rem, 2.2vw, 1.6rem)',
                fontWeight: 500,
                color: '#0f172a',
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              Office of the Managing Director
            </h3>

            <p style={{ fontSize: '0.98rem', color: '#475569', lineHeight: 1.75, margin: 0, fontWeight: 400 }}>
              Guided by experienced technology pioneers and industrial strategists, the Board of Directors at Zawr Industries LLP governs corporate governance, capital allocation, global expansion, and multi-sector strategy.
            </p>

            <p style={{ fontSize: '0.98rem', color: '#475569', lineHeight: 1.75, margin: 0, fontWeight: 400 }}>
              Our executive board ensures that every initiative across software, robotics, and real estate adheres to strict ethical standards, financial discipline, and zero-compromise engineering quality.
            </p>

            <div style={{ paddingTop: '1.25rem', borderTop: '1px solid #e2e8f0', marginTop: '0.5rem' }}>
              <div
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  marginBottom: '0.4rem',
                }}
              >
                CORPORATE GOVERNANCE COMMITTEES
              </div>
              <div style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6 }}>
                Audit & Compliance • Risk & Cybersecurity • Technology & R&D • Global Strategy
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: Executive Portraits & Bios (MD Left, CEO Right) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: 'clamp(2rem, 4vw, 4rem)',
            alignItems: 'start',
          }}
        >
          {/* MD Standing Profile Card */}
          <div
            style={{
              gridColumn: 'span 6',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
            className="board-row-col"
          >
            <div
              style={{
                width: '100%',
                maxWidth: '460px',
                aspectRatio: '3 / 4',
                position: 'relative',
              }}
            >
              <img
                src="/assets/md-portrait.png"
                alt="Managing Director - Mohammed Ahmed"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  objectPosition: 'bottom center',
                  display: 'block',
                }}
              />
            </div>
            <div style={{ marginTop: '1.25rem', maxWidth: '460px' }}>
              <div
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: '#475569',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '0.25rem',
                }}
              >
                Managing Director
              </div>
              <div
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 500,
                  color: '#0f172a',
                  letterSpacing: '-0.01em',
                  marginBottom: '0.6rem',
                }}
              >
                Mohammed Ahmed
              </div>
              <p
                style={{
                  fontSize: '0.95rem',
                  color: '#475569',
                  lineHeight: 1.65,
                  margin: '0 0 1rem 0',
                  fontWeight: 400,
                }}
              >
                Co-founder and Managing Director. Directs multi-sector growth, corporate governance, capital strategy, and international partnership portfolios across technology and industrial sectors.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.78rem', backgroundColor: '#f1f5f9', color: '#334155', padding: '0.3rem 0.75rem', borderRadius: '20px', fontWeight: 500 }}>
                  Corporate Strategy
                </span>
                <span style={{ fontSize: '0.78rem', backgroundColor: '#f1f5f9', color: '#334155', padding: '0.3rem 0.75rem', borderRadius: '20px', fontWeight: 500 }}>
                  Capital Allocation
                </span>
                <span style={{ fontSize: '0.78rem', backgroundColor: '#f1f5f9', color: '#334155', padding: '0.3rem 0.75rem', borderRadius: '20px', fontWeight: 500 }}>
                  Global Expansion
                </span>
              </div>
            </div>
          </div>

          {/* CEO Standing Profile Card */}
          <div
            style={{
              gridColumn: 'span 6',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
            className="board-row-col"
          >
            <div
              style={{
                width: '100%',
                maxWidth: '460px',
                aspectRatio: '3 / 4',
                position: 'relative',
              }}
            >
              <img
                src="/assets/CEO.png"
                alt="CEO - Syed Ismail Zabiulla"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  objectPosition: 'bottom center',
                  display: 'block',
                }}
              />
            </div>
            <div style={{ marginTop: '1.25rem', maxWidth: '460px' }}>
              <div
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: '#475569',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '0.25rem',
                }}
              >
                CEO & Co-Founder
              </div>
              <div
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 500,
                  color: '#0f172a',
                  letterSpacing: '-0.01em',
                  marginBottom: '0.6rem',
                }}
              >
                Syed Ismail Zabiulla
              </div>
              <p
                style={{
                  fontSize: '0.95rem',
                  color: '#475569',
                  lineHeight: 1.65,
                  margin: '0 0 1rem 0',
                  fontWeight: 400,
                }}
              >
                Co-founder and Chief Executive Officer. Spearheads enterprise AI technology development, proprietary product engineering, and global operational execution across international markets.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.78rem', backgroundColor: '#f1f5f9', color: '#334155', padding: '0.3rem 0.75rem', borderRadius: '20px', fontWeight: 500 }}>
                  Technology & AI
                </span>
                <span style={{ fontSize: '0.78rem', backgroundColor: '#f1f5f9', color: '#334155', padding: '0.3rem 0.75rem', borderRadius: '20px', fontWeight: 500 }}>
                  Product Architecture
                </span>
                <span style={{ fontSize: '0.78rem', backgroundColor: '#f1f5f9', color: '#334155', padding: '0.3rem 0.75rem', borderRadius: '20px', fontWeight: 500 }}>
                  Global Delivery
                </span>
              </div>
            </div>
          </div>
        </div>


      </div>

      <style>{`
        @media (max-width: 900px) {
          .board-row-col {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </section>
  );
}





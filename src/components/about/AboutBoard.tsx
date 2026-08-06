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
              color: '#3b82f6',
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

        {/* ROW 1: Managing Director */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: 'clamp(2rem, 4vw, 4rem)',
            alignItems: 'center',
            marginBottom: 'clamp(4rem, 7vw, 7rem)',
          }}
        >
          {/* MD Portrait */}
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
            <div style={{ marginTop: '1.25rem' }}>
              <div
                style={{
                  fontSize: '1.08rem',
                  fontWeight: 400,
                  color: '#334155',
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
                }}
              >
                Mohammed Ahmed
              </div>
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

        {/* ROW 2: CEO */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: 'clamp(2rem, 4vw, 4rem)',
            alignItems: 'center',
          }}
        >
          {/* CEO Governance Box */}
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
            className="board-row-col ceo-box"
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
              Office of the Chief Executive Officer
            </h3>

            <p style={{ fontSize: '0.98rem', color: '#475569', lineHeight: 1.75, margin: 0, fontWeight: 400 }}>
              Led by visionary technology leadership, executive management directs company-wide software innovation, product architecture, and enterprise AI transformation across international markets.
            </p>

            <p style={{ fontSize: '0.98rem', color: '#475569', lineHeight: 1.75, margin: 0, fontWeight: 400 }}>
              Ensuring operational excellence across software engineering, digital platforms, and client delivery while scaling high-impact technology solutions globally.
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
                EXECUTIVE LEADERSHIP COMMITTEES
              </div>
              <div style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6 }}>
                Product Architecture • Software Engineering • Enterprise AI • Global Delivery
              </div>
            </div>
          </div>

          {/* CEO Portrait */}
          <div
            style={{
              gridColumn: 'span 5',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
            className="board-row-col ceo-portrait"
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
            <div style={{ marginTop: '1.25rem' }}>
              <div
                style={{
                  fontSize: '1.08rem',
                  fontWeight: 400,
                  color: '#334155',
                  marginBottom: '0.25rem',
                }}
              >
                CEO
              </div>
              <div
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 500,
                  color: '#0f172a',
                  letterSpacing: '-0.01em',
                }}
              >
                Syed Ismail Zabiulla
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
          .ceo-box {
            order: 2;
          }
          .ceo-portrait {
            order: 1;
          }
        }
      `}</style>
    </section>
  );
}




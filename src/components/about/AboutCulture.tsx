'use client';

import React from 'react';

export default function AboutCulture() {
  return (
    <section
      style={{
        backgroundColor: '#090d16',
        color: '#ffffff',
        padding: 'clamp(6rem, 10vw, 9rem) 1.5rem',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <div style={{ maxWidth: '750px', marginBottom: 'clamp(3rem, 6vw, 5rem)' }}>
          <div
            style={{
              fontSize: '0.78rem',
              textTransform: 'uppercase',
              letterSpacing: '0.22em',
              color: '#475569',
              fontWeight: 600,
              marginBottom: '0.75rem',
            }}
          >
            CULTURE & PHILOSOPHY
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
            Powered by Extraordinary Talent & Uncompromising Rigor
          </h2>
        </div>

        {/* 2-Column Culture Gallery */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: 'clamp(2rem, 4vw, 3.5rem)',
            alignItems: 'center',
          }}
        >
          {/* Card 1: Life at Zawr */}
          <div
            style={{
              gridColumn: 'span 6',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}
            className="culture-col"
          >
            <div
              style={{
                position: 'relative',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                aspectRatio: '16 / 10',
              }}
            >
              <img
                src="/assets/life-at-zawr.png"
                alt="Life at Zawr"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 400, color: '#ffffff', margin: '0 0 0.5rem 0' }}>
                Life at Zawr Industries
              </h3>
              <p style={{ fontSize: '0.98rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6, margin: 0 }}>
                A vibrant ecosystem built on intellectual curiosity, creative freedom, and relentless pursuit of engineering excellence.
              </p>
            </div>
          </div>

          {/* Card 2: Respect to Talent */}
          <div
            style={{
              gridColumn: 'span 6',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}
            className="culture-col"
          >
            <div
              style={{
                position: 'relative',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                aspectRatio: '16 / 10',
              }}
            >
              <img
                src="/assets/respect-to-talent.png"
                alt="Respect to Talent"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 400, color: '#ffffff', margin: '0 0 0.5rem 0' }}>
                Respect to Talent & Ownership
              </h3>
              <p style={{ fontSize: '0.98rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6, margin: 0 }}>
                We empower deep domain experts to own complex challenges end-to-end, fostering a culture of trust and high achievement.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .culture-col {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </section>
  );
}

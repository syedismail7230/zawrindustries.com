'use client';

import React from 'react';

export default function AboutInnovation() {
  return (
    <section
      id="innovation"
      style={{
        backgroundColor: '#090d16',
        color: '#ffffff',
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
              color: '#60a5fa',
              fontWeight: 600,
              marginBottom: '0.75rem',
            }}
          >
            SECTION 10
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
            Innovation & Advanced R&D
          </h2>
        </div>

        {/* Innovation Content Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '3rem',
            alignItems: 'center',
          }}
        >
          <div style={{ gridColumn: 'span 6' }} className="innov-col">
            <h3 style={{ fontSize: '1.5rem', fontWeight: 400, color: '#ffffff', marginBottom: '1rem' }}>
              Pioneering Enterprise AI & Industrial Robotics
            </h3>
            <p style={{ fontSize: '1.02rem', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.75, margin: 0, fontWeight: 300 }}>
              Our dedicated R&D labs continuously engineer next-generation artificial intelligence algorithms, generative workflow tools, computer vision for AGV navigation, and microservices cloud infrastructure designed for enterprise scalability.
            </p>
          </div>

          <div style={{ gridColumn: 'span 6' }} className="innov-col">
            <div
              style={{
                position: 'relative',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: '#121827',
                aspectRatio: '16 / 10',
              }}
            >
              <img
                src="/assets/emp-innovation.png"
                alt="Innovation at Zawr"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .innov-col {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </section>
  );
}

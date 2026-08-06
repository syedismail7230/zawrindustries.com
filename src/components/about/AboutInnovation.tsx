'use client';

import React from 'react';

export default function AboutInnovation() {
  return (
    <section
      id="innovation"
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
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: 'clamp(2rem, 4vw, 4rem)',
          alignItems: 'center',
        }}
      >
        {/* Left Column: Unified Header & Copy */}
        <div
          style={{
            gridColumn: 'span 6',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
          className="innov-col"
        >
          <h2
            style={{
              fontSize: 'clamp(2rem, 3.8vw, 3rem)',
              fontWeight: 300,
              color: '#0f172a',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            Innovation & Advanced R&D
          </h2>

          <h3
            style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#0f172a',
              lineHeight: 1.35,
              margin: 0,
            }}
          >
            Pioneering Enterprise AI & Industrial Robotics
          </h3>

          <p
            style={{
              fontSize: '1rem',
              color: '#475569',
              lineHeight: 1.7,
              margin: 0,
              fontWeight: 400,
            }}
          >
            Our dedicated R&D labs continuously engineer next-generation artificial intelligence algorithms, generative workflow tools, computer vision for AGV navigation, and microservices cloud infrastructure designed for enterprise scalability.
          </p>
        </div>

        {/* Right Column: Robo-Dog Image */}
        <div
          style={{
            gridColumn: 'span 6',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          className="innov-col"
        >
          <img
            src="/assets/robo-dog.png"
            alt="Industrial Robotics at Zawr"
            style={{
              width: '100%',
              maxWidth: '560px',
              height: 'auto',
              display: 'block',
              objectFit: 'contain',
            }}
          />
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



'use client';

import React from 'react';

export default function AboutStatement() {
  return (
    <section
      style={{
        backgroundColor: '#ffffff',
        color: '#0f172a',
        padding: 'clamp(5rem, 9vw, 8rem) 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '850px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2.25rem',
        }}
      >
        {/* Crisp Geometric Black Z Logo Icon */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src="/assets/about-hero.png"
            alt="Zawr Industries Geometric Z Logo"
            style={{
              height: 'clamp(75px, 10vw, 105px)',
              width: 'auto',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </div>

        {/* Headline */}
        <h2
          style={{
            fontSize: 'clamp(2rem, 4.5vw, 3.4rem)',
            fontWeight: 400,
            letterSpacing: '-0.03em',
            lineHeight: 1.25,
            color: '#0f172a',
            margin: 0,
            maxWidth: '650px',
          }}
        >
          We turn ideas into lasting impact
        </h2>
      </div>
    </section>
  );
}

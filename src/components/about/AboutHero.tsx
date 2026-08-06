'use client';

import React from 'react';

export default function AboutHero() {
  return (
    <section
      style={{
        backgroundColor: '#090d16',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: 'clamp(7rem, 12vw, 10rem)',
        paddingBottom: 'clamp(5rem, 8vw, 7rem)',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Background Ambient Radial Glows */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '70vw',
          height: '50vh',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(168, 85, 247, 0.08) 45%, rgba(9, 13, 22, 0) 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 1.5rem',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Top Eyebrow Tag */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(12px)',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            marginBottom: '2rem',
          }}
        >
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#3b82f6' }} />
          <span
            style={{
              fontSize: '0.78rem',
              fontWeight: 500,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            ABOUT ZAWR INDUSTRIES
          </span>
        </div>

        {/* Hero Main Headline */}
        <h1
          style={{
            fontSize: 'clamp(2.4rem, 5.5vw, 4.5rem)',
            fontWeight: 300,
            letterSpacing: '-0.035em',
            lineHeight: 1.15,
            color: '#ffffff',
            maxWidth: '1050px',
            marginBottom: '1.75rem',
          }}
        >
          Architecting the Digital & Industrial Enterprise of Tomorrow.
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 'clamp(1.05rem, 2.2vw, 1.35rem)',
            fontWeight: 300,
            color: 'rgba(255, 255, 255, 0.72)',
            lineHeight: 1.7,
            maxWidth: '820px',
            marginBottom: 'clamp(3rem, 5vw, 4.5rem)',
          }}
        >
          Zawr Industries LLP is a multi-sector technology conglomerate, software engineering powerhouse, and strategic business transformation partner engineered for global scale.
        </p>

        {/* Featured Showcase Hero Image */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: '#121827',
            aspectRatio: '16 / 9',
            maxHeight: '620px',
          }}
        >
          <img
            src="/assets/this-is-zawr.png"
            alt="This is Zawr Industries"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
          {/* Subtle Bottom Gradient Scrim */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(9, 13, 22, 0.8) 0%, rgba(9, 13, 22, 0) 40%)',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>
    </section>
  );
}

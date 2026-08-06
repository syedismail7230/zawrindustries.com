'use client';

import React from 'react';

export default function EstateFullBannerSection() {
  return (
    <section
      style={{
        width: '100%',
        backgroundColor: '#ffffff',
        padding: '0 0 clamp(2rem, 5vw, 4rem) 0',
        overflow: 'hidden',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Full-width Edge-to-Edge Image Container with Bottom-Left Text Overlay */}
      <div
        style={{
          width: '100%',
          maxWidth: '100%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <img
          src="/assets/last-estate.png"
          alt="Zawr Estate - Exceptional Living Spaces Across Global Growth Corridors"
          style={{
            width: '100%',
            height: 'auto',
            minHeight: '380px',
            maxHeight: '88vh',
            objectFit: 'cover',
            display: 'block',
          }}
        />

        {/* Soft Dark Gradient Scrim overlay in bottom left */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '65%',
            background:
              'linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.4) 60%, rgba(15, 23, 42, 0) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Bottom Left Text Overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: 'clamp(1.5rem, 5vw, 4rem)',
            left: 'clamp(1.25rem, 4vw, 4vw)',
            right: '1.25rem',
            maxWidth: '620px',
            color: '#ffffff',
            zIndex: 10,
          }}
        >
          <h3
            style={{
              fontSize: 'clamp(1.35rem, 4vw, 2.75rem)',
              fontWeight: 300,
              letterSpacing: '-0.025em',
              lineHeight: 1.2,
              margin: '0 0 0.6rem 0',
              color: '#ffffff',
            }}
          >
            Shaping Landscapes into Generational Legacy
          </h3>
          <p
            style={{
              fontSize: 'clamp(0.85rem, 2.2vw, 0.98rem)',
              color: 'rgba(255, 255, 255, 0.85)',
              lineHeight: 1.5,
              fontWeight: 400,
              margin: 0,
            }}
          >
            Integrating sustainable master-planning with dramatic coastal topographies across prime international destinations.
          </p>
        </div>
      </div>
    </section>
  );
}

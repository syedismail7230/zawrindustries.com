'use client';

import React from 'react';

export default function EstateComfortOfHomeSection() {
  return (
    <section
      style={{
        backgroundColor: '#ffffff',
        color: '#0f172a',
        padding: 'clamp(4rem, 8vw, 8rem) 1.5rem clamp(5rem, 10vw, 10rem)',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: 'relative',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: 'clamp(2rem, 5vw, 5rem)',
          alignItems: 'center',
        }}
      >
        {/* Left Column: Clean Minimalist Image Showcase */}
        <div
          style={{
            gridColumn: 'span 6',
            position: 'relative',
          }}
          className="comfort-image-container"
        >
          <div
            style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              backgroundColor: '#f1f5f9',
              aspectRatio: '1.2 / 1',
              width: '100%',
            }}
          >
            <img
              src="/assets/coffee-estate.png"
              alt="The comfort of your own home"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
        </div>

        {/* Right Column: Ultra-Minimalist Architectural Points */}
        <div
          style={{
            gridColumn: 'span 6',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
          className="comfort-text-container"
        >
          {/* Minimalist Heading */}
          <h2
            style={{
              fontSize: 'clamp(1.6rem, 4vw, 3rem)',
              fontWeight: 300,
              color: '#0f172a',
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            The quiet comfort of a home that is truly yours.
          </h2>

          {/* Minimalist Narrative Text */}
          <p
            style={{
              fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)',
              color: '#64748b',
              lineHeight: 1.7,
              fontWeight: 400,
              margin: 0,
            }}
          >
            Beyond architecture and square footage lies the stillness of belonging. A home of your own 
            is a private sanctuary where morning light falls softer, time slows down, and every space 
            reflects your personal rhythm.
          </p>

          {/* Hairline Divider */}
          <div style={{ height: '1px', backgroundColor: 'rgba(15, 23, 42, 0.08)', margin: '0.25rem 0' }} />

          {/* Minimalist Points Only */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {/* Item 01 */}
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#94a3b8', letterSpacing: '0.05em' }}>01</span>
              <h4 style={{ fontSize: 'clamp(0.98rem, 2.5vw, 1.1rem)', fontWeight: 400, color: '#0f172a', margin: 0 }}>
                Uncompromised Serenity
              </h4>
            </div>

            {/* Item 02 */}
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#94a3b8', letterSpacing: '0.05em' }}>02</span>
              <h4 style={{ fontSize: 'clamp(0.98rem, 2.5vw, 1.1rem)', fontWeight: 400, color: '#0f172a', margin: 0 }}>
                Natural Light & Organic Flow
              </h4>
            </div>

            {/* Item 03 */}
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#94a3b8', letterSpacing: '0.05em' }}>03</span>
              <h4 style={{ fontSize: 'clamp(0.98rem, 2.5vw, 1.1rem)', fontWeight: 400, color: '#0f172a', margin: 0 }}>
                Generational Legacy
              </h4>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .comfort-image-container, .comfort-text-container {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </section>
  );
}

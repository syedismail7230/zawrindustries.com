'use client';

import React from 'react';

export default function KnownForMakingSection() {
  return (
    <section
      className="known-for-section"
      style={{
        backgroundColor: '#ffffff',
        width: '100%',
        padding: '5rem 2rem 7rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      {/* Headline with Enlarged Brightened Inline Image Pills */}
      <h2
        className="known-for-headline"
        style={{
          fontSize: 'clamp(1.8rem, 5vw, 3.6rem)',
          color: '#111111',
          fontWeight: 400,
          letterSpacing: '-0.02em',
          lineHeight: 1.45,
          margin: 0,
          maxWidth: '1250px',
          width: '100%',
        }}
      >
        <div style={{ whiteSpace: 'normal', wordBreak: 'keep-all' }}>
          <span>Turning</span>{' '}
          <span
            style={{
              display: 'inline-block',
              verticalAlign: 'middle',
              margin: '0 0.4em',
            }}
          >
            <img
              src="/assets/hard.png"
              alt="Complexity blueprint"
              className="known-pill-img"
              style={{
                width: 'clamp(95px, 11vw, 150px)',
                height: 'clamp(58px, 6.8vw, 92px)',
                objectFit: 'cover',
                borderRadius: '14px',
                display: 'block',
                filter: 'brightness(1.28) contrast(1.18) saturate(1.15)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: '0 8px 28px rgba(0, 0, 0, 0.18)',
              }}
            />
          </span>{' '}
          <span>complexity</span>
        </div>

        <div style={{ marginTop: '0.3em', whiteSpace: 'normal', wordBreak: 'keep-all' }}>
          <span>into clarity.</span>{' '}
          <span
            style={{
              display: 'inline-block',
              verticalAlign: 'middle',
              margin: '0 0.4em',
            }}
          >
            <img
              src="/assets/easy.png"
              alt="Clarity mechanism"
              className="known-pill-img"
              style={{
                width: 'clamp(95px, 11vw, 150px)',
                height: 'clamp(58px, 6.8vw, 92px)',
                objectFit: 'cover',
                borderRadius: '14px',
                display: 'block',
                filter: 'brightness(1.28) contrast(1.18) saturate(1.15)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: '0 8px 28px rgba(0, 0, 0, 0.18)',
              }}
            />
          </span>
        </div>
      </h2>

      <style jsx>{`
        @media (max-width: 768px) {
          .known-for-section {
            padding: 3.5rem 1.25rem 4.5rem 1.25rem !important;
          }
          .known-for-headline {
            font-size: clamp(1.4rem, 4.5vw, 2.2rem) !important;
          }
          .known-pill-img {
            width: clamp(75px, 11vw, 110px) !important;
            height: clamp(46px, 6.8vw, 68px) !important;
            border-radius: 10px !important;
          }
        }
        @media (max-width: 480px) {
          .known-for-section {
            padding: 2.5rem 0.75rem 3.5rem 0.75rem !important;
          }
          .known-for-headline {
            font-size: clamp(1.2rem, 4.8vw, 1.7rem) !important;
          }
          .known-pill-img {
            width: 72px !important;
            height: 46px !important;
            border-radius: 8px !important;
          }
        }
      `}</style>
    </section>
  );
}

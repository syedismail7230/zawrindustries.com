'use client';

import React, { useState } from 'react';

interface Industry {
  name: string;
  image: string;
}

export function IndustriesSection({ industries }: { industries: Industry[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div
      style={{
        background: '#000',
        padding: 'clamp(4rem, 8vh, 7rem) 0',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        overflow: 'hidden',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .ind-section { padding: 0 clamp(1rem, 5vw, 5%); }

        .ind-title {
          text-align: center;
          font-size: clamp(2rem, 4vw, 3.2rem);
          font-weight: 300;
          letter-spacing: -0.03em;
          color: #fff;
          margin: 0 0 clamp(2.5rem, 5vh, 4rem) 0;
          font-family: var(--font-plus-jakarta), Inter, sans-serif;
          opacity: 0.95;
        }

        /* Accordion strip container */
        .ind-accordion {
          display: flex;
          justify-content: center;
          height: clamp(340px, 45vh, 520px);
          gap: 6px;
          border-radius: 16px;
          overflow: hidden;
        }

        /* Each vertical strip */
        .ind-card {
          position: relative;
          flex: 0 0 auto;
          width: 52px;         /* collapsed width */
          transition: width 0.55s cubic-bezier(0.16, 1, 0.3, 1);
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          flex-shrink: 0;
        }
        .ind-card.ind-active {
          width: clamp(220px, 30vw, 400px);  /* expanded width */
        }

        /* Background image fills the strip */
        .ind-card-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1),
                      filter 0.55s ease;
          filter: brightness(0.55) saturate(0.8);
        }
        .ind-card.ind-active .ind-card-bg {
          filter: brightness(0.75) saturate(1.1);
          transform: scale(1.04);
        }

        /* Dark gradient overlay so label is always legible */
        .ind-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            rgba(0,0,0,0.55) 0%,
            rgba(0,0,0,0.1) 60%,
            rgba(0,0,0,0) 100%
          );
          pointer-events: none;
        }

        /* Vertical label — always visible on left edge */
        .ind-label {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          pointer-events: none;
        }
        .ind-label span {
          writing-mode: vertical-rl;
          text-orientation: mixed;
          transform: rotate(180deg);
          font-size: clamp(0.7rem, 1.1vw, 0.9rem);
          font-weight: 500;
          letter-spacing: 0.04em;
          color: #fff;
          white-space: nowrap;
          font-family: var(--font-plus-jakarta), Inter, sans-serif;
          text-shadow: 0 2px 8px rgba(0,0,0,0.8);
          transition: opacity 0.25s ease;
        }
        .ind-card.ind-active .ind-label span {
          opacity: 0;
        }

        /* Full name badge that fades in when expanded */
        .ind-name-badge {
          position: absolute;
          bottom: 1.2rem;
          left: 3.8rem;
          right: 1rem;
          z-index: 10;
          pointer-events: none;
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.35s ease 0.1s, transform 0.35s ease 0.1s;
        }
        .ind-card.ind-active .ind-name-badge {
          opacity: 1;
          transform: translateY(0);
        }
        .ind-name-badge h3 {
          margin: 0;
          font-size: clamp(1rem, 2vw, 1.5rem);
          font-weight: 300;
          letter-spacing: -0.02em;
          color: #fff;
          font-family: var(--font-plus-jakarta), Inter, sans-serif;
          text-shadow: 0 2px 12px rgba(0,0,0,0.9);
          line-height: 1.2;
        }
        .ind-name-badge p {
          margin: 0.4rem 0 0 0;
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          font-family: var(--font-plus-jakarta), Inter, sans-serif;
        }
      ` }} />

      <div className="ind-section">
        <h2 className="ind-title">Industries We Serve</h2>

        <div className="ind-accordion">
          {industries.map((ind, i) => (
            <div
              key={i}
              className={`ind-card${hovered === i ? ' ind-active' : ''}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Background photo */}
              <div
                className="ind-card-bg"
                style={{ backgroundImage: `url('${ind.image}')` }}
              />

              {/* Vertical rotated label (always visible) */}
              <div className="ind-label">
                <span>{ind.name}</span>
              </div>

              {/* Expanded name badge */}
              <div className="ind-name-badge">
                <h3>{ind.name}</h3>
                <p>Industry</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

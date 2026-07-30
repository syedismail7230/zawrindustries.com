'use client';

import React, { useState } from 'react';

interface Industry {
  name: string;
  image: string;
  projectName?: string;
  projectDescription?: string;
}

export function IndustriesSection({ 
  industries, 
  theme = 'dark', 
  title = "Industries We Serve", 
  projectLabel = "Featured Project" 
}: { 
  industries: Industry[]; 
  theme?: 'light' | 'dark'; 
  title?: string;
  projectLabel?: string;
}) {
  const [hovered, setHovered] = useState<number>(0);
  const active = industries[hovered];

  return (
    <div className={`ind-container theme-${theme}`} style={{ background: theme === 'light' ? '#ffffff' : '#000000', borderTop: theme === 'light' ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.04)', overflow: 'hidden', padding: 'clamp(4rem,8vh,7rem) clamp(1rem,5vw,5%)' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .ind-title {
          text-align: center;
          font-size: clamp(1.8rem, 3.5vw, 3rem);
          font-weight: 300;
          letter-spacing: -0.03em;
          color: #fff;
          margin: 0 0 clamp(2rem,4vh,3.5rem) 0;
          font-family: var(--font-plus-jakarta), Inter, sans-serif;
        }
        .ind-layout {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: clamp(1rem, 2.5vw, 2.5rem);
          align-items: center;
        }
        /* Left panel – project name */
        .ind-left {
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: clamp(280px, 38vh, 480px);
        }
        .ind-project-label {
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          margin-bottom: 0.9rem;
          font-family: var(--font-plus-jakarta), Inter, sans-serif;
        }
        .ind-project-name {
          font-size: clamp(1.5rem, 2.8vw, 2.6rem);
          font-weight: 300;
          letter-spacing: -0.025em;
          line-height: 1.15;
          color: #fff;
          margin: 0 0 1.4rem 0;
          font-family: var(--font-plus-jakarta), Inter, sans-serif;
          transition: opacity 0.3s ease;
        }
        .ind-project-divider {
          width: 2.5rem;
          height: 1.5px;
          background: linear-gradient(90deg, #ffffff, #52525b);
          margin-bottom: 1.2rem;
          border-radius: 2px;
        }
        /* Right panel – description */
        .ind-right {
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: clamp(280px, 38vh, 480px);
        }
        .ind-desc {
          font-size: clamp(0.82rem, 1.1vw, 0.96rem);
          line-height: 1.75;
          color: rgba(255,255,255,0.62);
          font-family: var(--font-plus-jakarta), Inter, sans-serif;
          font-weight: 300;
          transition: opacity 0.3s ease;
          max-width: 380px;
        }
        .ind-industry-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          margin-top: 1.4rem;
          padding: 0.35rem 0.9rem;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 100px;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.6);
          font-family: var(--font-plus-jakarta), Inter, sans-serif;
        }
        .ind-industry-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #ffffff;
          flex-shrink: 0;
        }
        /* Center accordion */
        .ind-accordion {
          display: flex;
          height: clamp(300px, 42vh, 500px);
          gap: 5px;
          border-radius: 14px;
          overflow: hidden;
        }
        .ind-card {
          position: relative;
          flex: 0 0 44px;
          transition: flex 0.52s cubic-bezier(0.16,1,0.3,1);
          border-radius: 10px;
          overflow: hidden;
          cursor: pointer;
        }
        .ind-card.ind-active { flex: 0 0 clamp(160px,22vw,300px); }
        .ind-card-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transition: filter 0.52s ease, transform 0.52s cubic-bezier(0.16,1,0.3,1);
          filter: grayscale(100%) brightness(0.45);
        }
        .ind-card.ind-active .ind-card-bg {
          filter: grayscale(100%) brightness(0.85);
          transform: scale(1.04);
        }
        .ind-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.05) 60%, transparent 100%);
          pointer-events: none;
        }
        .ind-label {
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 44px;
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
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          color: #fff;
          white-space: nowrap;
          font-family: var(--font-plus-jakarta), Inter, sans-serif;
          text-shadow: 0 2px 8px rgba(0,0,0,0.8);
          transition: opacity 0.25s ease;
        }
        .ind-card.ind-active .ind-label span { opacity: 0; }
        .ind-name-badge {
          position: absolute;
          bottom: 1rem;
          left: 3.4rem;
          right: 0.8rem;
          z-index: 10;
          pointer-events: none;
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s;
        }
        .ind-card.ind-active .ind-name-badge { opacity: 1; transform: translateY(0); }
        .ind-name-badge h3 {
          margin: 0;
          font-size: clamp(0.9rem, 1.6vw, 1.3rem);
          font-weight: 300;
          letter-spacing: -0.02em;
          color: #fff;
          font-family: var(--font-plus-jakarta), Inter, sans-serif;
          text-shadow: 0 2px 10px rgba(0,0,0,0.9);
          line-height: 1.2;
        }
        .ind-name-badge p {
          margin: 0.3rem 0 0 0;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          font-family: var(--font-plus-jakarta), Inter, sans-serif;
        }

        /* Light Theme Overrides */
        .theme-light .ind-title {
          color: #111111;
        }
        .theme-light .ind-project-label {
          color: rgba(0,0,0,0.45);
        }
        .theme-light .ind-project-name {
          color: #111111;
        }
        .theme-light .ind-desc {
          color: rgba(0,0,0,0.7);
        }
        .theme-light .ind-industry-badge {
          border: 1px solid rgba(0,0,0,0.1);
          color: rgba(0,0,0,0.6);
        }

        @media (max-width: 768px) {
          .ind-layout { grid-template-columns: 1fr; }
          .ind-left, .ind-right { min-height: auto; }
          .ind-accordion { height: 220px; }
        }
      ` }} />

      <h2 className="ind-title">{title}</h2>

      <div className="ind-layout">
        {/* LEFT — project name */}
        <div className="ind-left">
          <div className="ind-project-label">{projectLabel}</div>
          <h3 className="ind-project-name">{active?.projectName ?? active?.name}</h3>
          <div className="ind-project-divider" />
        </div>

        {/* CENTER — accordion */}
        <div className="ind-accordion">
          {industries.map((ind, i) => (
            <div
              key={i}
              className={`ind-card${hovered === i ? ' ind-active' : ''}`}
              onMouseEnter={() => setHovered(i)}
            >
              <div className="ind-card-bg" style={{ backgroundImage: `url('${ind.image}')` }} />
              <div className="ind-label"><span>{ind.name}</span></div>
              <div className="ind-name-badge">
                <h3>{ind.name}</h3>
                <p>Industry</p>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT — project description */}
        <div className="ind-right">
          <p className="ind-desc">{active?.projectDescription ?? `Tailored solution for the ${active?.name} sector.`}</p>
          <div className="ind-industry-badge">
            <span className="ind-industry-dot" />
            {active?.name}
          </div>
        </div>
      </div>
    </div>
  );
}

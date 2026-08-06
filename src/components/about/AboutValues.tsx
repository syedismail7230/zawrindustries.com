'use client';

import React, { useState } from 'react';

export default function AboutValues() {
  const [activeCircle, setActiveCircle] = useState<number | null>(null);

  return (
    <section
      id="values"
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
        }}
      >
        {/* Header */}
        <div style={{ maxWidth: '750px', margin: '0 auto clamp(3.5rem, 6vw, 5rem) auto', textAlign: 'center' }}>
          <h2
            style={{
              fontSize: 'clamp(1.8rem, 3.8vw, 3rem)',
              fontWeight: 300,
              color: '#0f172a',
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              margin: '0 0 1rem 0',
            }}
          >
            Our Core Values
          </h2>
          <p
            style={{
              fontSize: '1.05rem',
              color: '#64748b',
              fontWeight: 400,
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            The intersection of integrity, innovation, and long-term excellence.
          </p>
        </div>

        {/* Centered Venn Diagram Visual */}
        <div
          style={{
            maxWidth: '520px',
            margin: '0 auto',
            position: 'relative',
          }}
        >
          <svg viewBox="30 40 440 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>

            {/* Circle 1: Integrity (Top) */}
            <g
              onMouseEnter={() => setActiveCircle(1)}
              onMouseLeave={() => setActiveCircle(null)}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
            >
              <circle
                cx="250"
                cy="180"
                r="125"
                stroke="#0f172a"
                strokeWidth={activeCircle === 1 ? '2.5' : '1.5'}
                fill={activeCircle === 1 ? 'rgba(15, 23, 42, 0.05)' : 'none'}
              />
              <text x="250" y="145" textAnchor="middle" fill="#0f172a" fontSize="14" fontWeight="600" letterSpacing="0.06em">
                INTEGRITY
              </text>
              <text x="250" y="165" textAnchor="middle" fill="#64748b" fontSize="12">
                Rigor & Trust
              </text>
            </g>

            {/* Circle 2: Innovation (Bottom Left) */}
            <g
              onMouseEnter={() => setActiveCircle(2)}
              onMouseLeave={() => setActiveCircle(null)}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
            >
              <circle
                cx="175"
                cy="295"
                r="125"
                stroke="#0f172a"
                strokeWidth={activeCircle === 2 ? '2.5' : '1.5'}
                fill={activeCircle === 2 ? 'rgba(15, 23, 42, 0.05)' : 'none'}
              />
              <text x="145" y="325" textAnchor="middle" fill="#0f172a" fontSize="14" fontWeight="600" letterSpacing="0.06em">
                INNOVATION
              </text>
              <text x="145" y="345" textAnchor="middle" fill="#64748b" fontSize="12">
                Pioneering & Research
              </text>
            </g>

            {/* Circle 3: Excellence (Bottom Right) */}
            <g
              onMouseEnter={() => setActiveCircle(3)}
              onMouseLeave={() => setActiveCircle(null)}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
            >
              <circle
                cx="325"
                cy="295"
                r="125"
                stroke="#0f172a"
                strokeWidth={activeCircle === 3 ? '2.5' : '1.5'}
                fill={activeCircle === 3 ? 'rgba(15, 23, 42, 0.05)' : 'none'}
              />
              <text x="355" y="325" textAnchor="middle" fill="#0f172a" fontSize="14" fontWeight="600" letterSpacing="0.06em">
                EXCELLENCE
              </text>
              <text x="355" y="345" textAnchor="middle" fill="#64748b" fontSize="12">
                Impact & Legacy
              </text>
            </g>

            {/* Intersecting Center Region (Mathematically exact intersection of the 3 circles) */}
            <g style={{ cursor: 'pointer' }}>
              <path
                d="M 200,294.6 A 125 125 0 0 1 250,195 A 125 125 0 0 1 300,294.6 A 125 125 0 0 1 200,294.6 Z"
                fill="#0f172a"
              />
              <text x="250" y="256" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="700" letterSpacing="0.08em">
                SHARED
              </text>
              <text x="250" y="270" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="500" letterSpacing="0.04em">
                VALUES
              </text>
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}





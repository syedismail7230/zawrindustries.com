'use client';

import React from 'react';

const missionPoints = [
  'Deliver high-quality, reliable, and cost-efficient solutions across all business segments.',
  'Foster continuous innovation through technology adoption and data-driven decision-making.',
  'Build resilient infrastructure and operational frameworks capable of supporting large-scale growth.',
  'Ensure optimal utilization of resources to generate consistent and measurable returns.',
  'Maintain transparency, accountability, and integrity in all corporate dealings.',
];

export default function AboutMission() {
  return (
    <section
      id="mission"
      style={{
        backgroundColor: '#ffffff',
        color: '#0f172a',
        padding: 'clamp(5rem, 8vw, 8rem) 1.5rem',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: 'relative',
        scrollMarginTop: '80px',
        borderTop: '1px solid #f1f5f9',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: 'clamp(2rem, 5vw, 5rem)',
          alignItems: 'flex-start',
        }}
      >
        <div style={{ gridColumn: 'span 4' }} className="mission-col">
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              fontWeight: 300,
              color: '#0f172a',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            Our Mission
          </h2>
        </div>

        <div style={{ gridColumn: 'span 8' }} className="mission-col">
          <p
            style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
              fontWeight: 300,
              color: '#334155',
              lineHeight: 1.75,
              margin: '0 0 1.5rem 0',
            }}
          >
            Zawr Industries is committed to designing, developing, and operating scalable business solutions across its core verticals by leveraging advanced technology, optimized industrial processes, and efficient supply chain systems. The organization endeavors to maximize asset value, enhance enterprise productivity, and create employment opportunities while maintaining strict adherence to regulatory compliance, ethical governance, and sustainable business practices.
          </p>

          <p
            style={{
              fontSize: '1.05rem',
              fontWeight: 600,
              color: '#0f172a',
              margin: '0 0 1.25rem 0',
            }}
          >
            The company further undertakes to:
          </p>

          <ul
            style={{
              margin: '0 0 2rem 0',
              paddingLeft: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
              color: '#475569',
              fontSize: '0.98rem',
              lineHeight: 1.65,
              fontWeight: 400,
            }}
          >
            {missionPoints.map((point, index) => (
              <li key={index} style={{ paddingLeft: '0.25rem' }}>
                {point}
              </li>
            ))}
          </ul>

          <p
            style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.12rem)',
              fontWeight: 300,
              color: '#334155',
              lineHeight: 1.75,
              margin: 0,
            }}
          >
            Through this structured approach, Zawr Industries positions itself as a comprehensive business enabler, capable of driving economic impact while maintaining long-term strategic stability.
          </p>
        </div>
      </div>


      <style>{`
        @media (max-width: 900px) {
          .mission-col {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </section>
  );
}



'use client';

import React from 'react';

const pillars = [
  {
    title: 'Software & AI Engineering',
    tag: 'ENTERPRISE TECH',
    description: 'Custom SaaS platforms, cloud-native infrastructure, LLM integrations, and cybersecurity for global enterprises.',
    icon: 'âš¡',
  },
  {
    title: 'Industrial Autonomy & Robotics',
    tag: 'ADVANCED MANUFACTURING',
    description: 'Automated Guided Vehicles (AGVs), CNC precision engineering, IoT factory dashboards, and autonomous logistics.',
    icon: 'ðŸ¤–',
  },
  {
    title: 'Real Estate & PropTech',
    tag: 'SUSTAINABLE ESTATES',
    description: 'Eco-resorts, luxury residences, biophilic urban towers, and digital asset management across growth corridors.',
    icon: 'ðŸ ›ï¸ ',
  },
  {
    title: 'Business & Process Transformation',
    tag: 'STRATEGIC ADVISORY',
    description: 'Cognitive operations, CRM/CXM solutions, digital marketing, and enterprise IT consulting.',
    icon: 'ðŸŒ ',
  },
];

export default function AboutPillars() {
  return (
    <section
      style={{
        backgroundColor: '#ffffff',
        color: '#0f172a',
        padding: 'clamp(6rem, 10vw, 9rem) 1.5rem',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: 'relative',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
        }}
      >
        {/* Section Header */}
        <div style={{ maxWidth: '750px', marginBottom: 'clamp(3rem, 6vw, 5rem)' }}>
          <div
            style={{
              fontSize: '0.78rem',
              textTransform: 'uppercase',
              letterSpacing: '0.22em',
              color: '#64748b',
              fontWeight: 600,
              marginBottom: '0.75rem',
            }}
          >
            BUSINESS DIVISIONS
          </div>
          <h2
            style={{
              fontSize: 'clamp(1.8rem, 3.8vw, 3rem)',
              fontWeight: 300,
              color: '#0f172a',
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            A Diversified Ecosystem of High-Growth Industries
          </h2>
        </div>

        {/* 4 Pillars Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: 'clamp(1.5rem, 3vw, 2.5rem)',
          }}
        >
          {pillars.map((pillar, index) => (
            <PillarCard key={index} pillar={pillar} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PillarCard({ pillar, index }: { pillar: { title: string; tag: string; description: string; icon: string }; index: number }) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        gridColumn: 'span 6',
        padding: 'clamp(2rem, 3.5vw, 3rem)',
        backgroundColor: isHovered ? '#0f172a' : '#fafafa',
        color: isHovered ? '#ffffff' : '#0f172a',
        borderRadius: '20px',
        border: isHovered ? '1px solid #0f172a' : '1px solid rgba(15, 23, 42, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 25px 50px rgba(15, 23, 42, 0.15)' : 'none',
        cursor: 'pointer',
      }}
      className="pillar-card"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.15em',
            color: isHovered ? '#475569' : '#64748b',
            textTransform: 'uppercase',
          }}
        >
          {pillar.tag}
        </span>
        <span style={{ fontSize: '1.5rem' }}>{pillar.icon}</span>
      </div>

      <h3
        style={{
          fontSize: 'clamp(1.25rem, 2.2vw, 1.55rem)',
          fontWeight: 400,
          letterSpacing: '-0.02em',
          lineHeight: 1.3,
          margin: 0,
        }}
      >
        {pillar.title}
      </h3>

      <p
        style={{
          fontSize: 'clamp(0.9rem, 1.8vw, 0.98rem)',
          color: isHovered ? 'rgba(255, 255, 255, 0.8)' : '#64748b',
          lineHeight: 1.65,
          fontWeight: 400,
          margin: 0,
        }}
      >
        {pillar.description}
      </p>

      <style>{`
        @media (max-width: 768px) {
          .pillar-card {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </div>
  );
}

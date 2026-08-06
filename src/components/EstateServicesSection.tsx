'use client';

import React, { useState } from 'react';

const estateServices = [
  {
    id: '01',
    title: 'Real Estate Investments',
    subtitle: 'CAPITAL & ACQUISITIONS',
    description:
      'Strategic capital deployment, joint ventures, and prime land acquisition targeting high-yielding global growth corridors.',
    image: '/assets/invest-estate.png',
  },
  {
    id: '02',
    title: 'Construction & Development',
    subtitle: 'PRECISION ENGINEERING',
    description:
      'Precision architectural engineering, sustainable master-planning, and luxury turnkey construction built to enduring global standards.',
    image: '/assets/construction-estate.png',
  },
  {
    id: '03',
    title: 'Property & Asset Management',
    subtitle: 'PORTFOLIO OPTIMIZATION',
    description:
      'Bespoke luxury facility management, tenant experience optimization, and long-term capital value protection for prime portfolios.',
    image: '/assets/management-estate.png',
  },
];

export default function EstateServicesSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section
      style={{
        backgroundColor: '#ffffff',
        color: '#0f172a',
        padding: 'clamp(5rem, 8vw, 8rem) 1.5rem clamp(5rem, 8vw, 8rem)',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: 'relative',
      }}
    >
      <div
        style={{
          maxWidth: '1320px',
          margin: '0 auto',
        }}
      >
        {/* Section Header */}
        <div style={{ maxWidth: '750px', marginBottom: 'clamp(3rem, 5vw, 4rem)' }}>
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
            End-to-End Real Estate Expertise Across the Entire Lifecycle
          </h2>
        </div>

        {/* Unique Bespoke Interactive Architectural Accordion Showcase */}
        <div
          style={{
            display: 'flex',
            gap: '1.25rem',
            height: 'clamp(420px, 55vh, 540px)',
            width: '100%',
          }}
          className="services-accordion-container"
        >
          {estateServices.map((service, index) => {
            const isActive = activeIndex === index;

            return (
              <div
                key={service.id}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
                style={{
                  flex: isActive ? 2.8 : 1,
                  position: 'relative',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'flex 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s ease',
                  backgroundColor: '#0f172a',
                }}
                className={`accordion-pillar ${isActive ? 'active' : ''}`}
              >
                {/* Background Image Showcase */}
                <img
                  src={service.image}
                  alt={service.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    opacity: isActive ? 0.9 : 0.45,
                    transform: isActive ? 'scale(1.05)' : 'scale(1.0)',
                    transition: 'opacity 0.6s ease, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                    filter: isActive ? 'none' : 'grayscale(30%)',
                  }}
                />

                {/* Dark Gradient Overlay for High Contrast Legibility */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: isActive
                      ? 'linear-gradient(to top, rgba(15, 23, 42, 0.92) 0%, rgba(15, 23, 42, 0.4) 50%, rgba(15, 23, 42, 0.1) 100%)'
                      : 'linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.5) 100%)',
                    transition: 'background 0.6s ease',
                  }}
                />

                {/* Bottom Content Area */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: 'clamp(1.5rem, 3vw, 2.5rem)',
                    color: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem',
                    zIndex: 10,
                  }}
                >
                  {/* Subtitle */}
                  <div
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      letterSpacing: '0.18em',
                      color: 'rgba(255, 255, 255, 0.7)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {service.subtitle}
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontSize: isActive ? 'clamp(1.35rem, 2.2vw, 1.8rem)' : 'clamp(1.1rem, 1.8vw, 1.35rem)',
                      fontWeight: 400,
                      letterSpacing: '-0.02em',
                      lineHeight: 1.25,
                      margin: 0,
                      color: '#ffffff',
                      transition: 'font-size 0.4s ease',
                    }}
                  >
                    {service.title}
                  </h3>

                  {/* Description (Expanded on Active) */}
                  <div
                    style={{
                      maxHeight: isActive ? '120px' : '0px',
                      opacity: isActive ? 1 : 0,
                      overflow: 'hidden',
                      transition: 'max-height 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease',
                    }}
                  >
                    <p
                      style={{
                        fontSize: 'clamp(0.88rem, 1.8vw, 0.96rem)',
                        color: 'rgba(255, 255, 255, 0.85)',
                        lineHeight: 1.6,
                        fontWeight: 400,
                        margin: '0.4rem 0 0 0',
                      }}
                    >
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .services-accordion-container {
            flex-direction: column !important;
            height: auto !important;
          }
          .accordion-pillar {
            height: 320px !important;
            flex: none !important;
          }
        }
      `}</style>
    </section>
  );
}

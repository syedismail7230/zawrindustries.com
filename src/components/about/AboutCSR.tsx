'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const csrPillars = [
  {
    title: 'Sustainability & Environmental Stewardship',
    image: '/assets/sustainability-environment.png',
    desc: 'Promoting eco-friendly energy grids, green building materials, and carbon-reduction initiatives across all operations.',
    link: '/sustainability/environment',
    tag: 'Environment',
  },
  {
    title: 'Community & Economic Empowerment',
    image: '/assets/sustainability-empowerment.png',
    desc: 'Investing in local job creation, tech skills training, and sustainable community growth initiatives in India and UAE.',
    link: '/sustainability/empowerment',
    tag: 'Empowerment',
  },
  {
    title: 'Health, Safety & Wellbeing',
    image: 'https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_800,c_limit,dpr_auto/v1783710493/zawr/assets/health-hero.png',
    desc: 'Ensuring world-class workplace safety standards, employee wellness programs, and community healthcare initiatives.',
    link: '/sustainability/health',
    tag: 'Health',
  },
  {
    title: 'Education & Youth Skill Development',
    image: 'https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_800,c_limit,dpr_auto/v1783710465/zawr/assets/edu-hero.png',
    desc: 'Empowering future innovators through STEM education sponsorships, technical bootcamps, and university research grants.',
    link: '/sustainability/education',
    tag: 'Education',
  },
];

export default function AboutCSR() {
  const [displayedPillars, setDisplayedPillars] = useState(csrPillars.slice(0, 2));

  useEffect(() => {
    // Randomize 2 unique pillars on every page visit
    const shuffled = [...csrPillars].sort(() => 0.5 - Math.random());
    setDisplayedPillars(shuffled.slice(0, 2));
  }, []);

  return (
    <section
      id="csr"
      style={{
        backgroundColor: '#ffffff',
        color: '#0f172a',
        padding: 'clamp(5rem, 8vw, 8rem) 1.5rem',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: 'relative',
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
        <div style={{ maxWidth: '750px', marginBottom: 'clamp(3rem, 5vw, 4.5rem)' }}>
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
            Corporate Social Responsibility (CSR)
          </h2>
        </div>

        {/* CSR Cards (Random 2 on every page visit) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '2rem',
          }}
        >
          {displayedPillars.map((item, index) => (
            <Link
              key={item.link || index}
              href={item.link}
              style={{
                gridColumn: 'span 6',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                textDecoration: 'none',
                color: 'inherit',
              }}
              className="csr-card"
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16 / 10',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  backgroundColor: '#f1f5f9',
                }}
                className="csr-img-container"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.5s ease',
                  }}
                  className="csr-img"
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.92)',
                    backdropFilter: 'blur(8px)',
                    color: '#0f172a',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.35rem 0.85rem',
                    borderRadius: '20px',
                    letterSpacing: '0.05em',
                  }}
                >
                  {item.tag}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
                <div style={{ flex: 1 }}>
                  <h3 
                    style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: 600, 
                      color: '#0f172a', 
                      margin: '0 0 0.4rem 0',
                      lineHeight: 1.3,
                    }}
                    className="csr-title"
                  >
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.92rem', color: '#64748b', lineHeight: 1.6, margin: 0, fontWeight: 400 }}>
                    {item.desc}
                  </p>
                </div>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1.4" strokeLinecap="square" strokeLinejoin="miter" style={{ transition: 'transform 0.2s', flexShrink: 0 }} className="csr-arrow">
                  <line x1="6" y1="18" x2="18" y2="6"></line>
                  <polyline points="7 6 18 6 18 17"></polyline>
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .csr-card:hover .csr-img {
          transform: scale(1.05);
        }
        .csr-card:hover .csr-arrow {
          transform: translate(3px, -3px);
        }

        @media (max-width: 900px) {
          .csr-card {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </section>
  );
}

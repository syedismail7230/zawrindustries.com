'use client';

import React, { useEffect, useRef, useState } from 'react';

interface EstateImageItem {
  id: number;
  src: string;
  tag: string;
  category: string;
  col: number;
  row: number;
}

const estateItems: EstateImageItem[] = [
  // Row 1: Columns 1, 3, 5
  { id: 1, src: '/assets/estate-animation/image (1).png', tag: 'Parametric Pavilion', category: 'Fluid Future Architecture', col: 1, row: 1 },
  { id: 2, src: '/assets/estate-animation/image (2).png', tag: 'Pop Brutalism', category: 'Color Gradient Facades', col: 3, row: 1 },
  { id: 3, src: '/assets/estate-animation/image (3).png', tag: 'Organic Bio-Villa', category: 'Canopy Forest Sanctuary', col: 5, row: 1 },

  // Row 2: Columns 2, 4
  { id: 4, src: '/assets/estate-animation/image (4).png', tag: 'Heritage Palace', category: 'Lakeside Waterfront Estate', col: 2, row: 2 },
  { id: 5, src: '/assets/estate-animation/image (5).png', tag: 'Cliffside Cave Estate', category: 'Rock Carved Living Suites', col: 4, row: 2 },

  // Row 3: Columns 1, 3, 5
  { id: 6, src: '/assets/estate-animation/image (6).png', tag: 'Subterranean Luxury', category: 'Eco Mountain Retreat', col: 1, row: 3 },
  { id: 7, src: '/assets/estate-animation/image (7).png', tag: 'Biophilic High-Rise', category: 'Vertical Forest Towers', col: 3, row: 3 },
  { id: 8, src: '/assets/estate-animation/image (8).png', tag: 'Classical Palatial Mansion', category: 'Baroque Heritage Design', col: 5, row: 3 },

  // Row 4: Columns 2, 4
  { id: 9, src: '/assets/estate-animation/image (9).png', tag: 'Futuristic Glass Residence', category: 'Modern Structural Steel', col: 2, row: 4 },
  { id: 10, src: '/assets/estate-animation/image (10).png', tag: 'Eco Mountain Sanctuary', category: 'Sustainable Alpine Haven', col: 4, row: 4 },
];

export default function EstateAnimationScrollGrid() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [headerState, setHeaderState] = useState<'relative' | 'fixed' | 'bottom'>('relative');

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top < windowHeight && rect.bottom > 0) {
        setScrollY(windowHeight - rect.top);
      }

      // Pin header when top of section reaches 6rem (96px) from window top
      const targetTop = 96;
      const endOffset = 260;

      if (rect.top <= targetTop && rect.bottom > targetTop + endOffset) {
        setHeaderState('fixed');
      } else if (rect.bottom <= targetTop + endOffset) {
        setHeaderState('bottom');
      } else {
        setHeaderState('relative');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        backgroundColor: '#ffffff',
        padding: '3rem 4vw 20rem',
        width: '100%',
        maxWidth: '1600px',
        margin: '0 auto',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: 'relative',
        minHeight: '220vh',
      }}
    >
      {/* Invisible Spacer when header is fixed to prevent layout shift */}
      {headerState === 'fixed' && <div style={{ height: '180px' }} />}

      {/* Solid White Fixed Header Container with Dense Bottom Fade */}
      <div style={{
        position: headerState === 'fixed' ? 'fixed' : headerState === 'bottom' ? 'absolute' : 'relative',
        top: headerState === 'fixed' ? 0 : 'auto',
        bottom: headerState === 'bottom' ? '2rem' : 'auto',
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 50,
        backgroundColor: '#ffffff',
        paddingTop: headerState === 'fixed' ? '5.8rem' : '1.5rem',
        paddingBottom: '2.5rem',
        textAlign: 'center',
        boxShadow: headerState === 'fixed' ? '0 25px 45px rgba(255,255,255,1)' : 'none',
      }}>
        <div style={{ maxWidth: '850px', margin: '0 auto', padding: '0 1rem' }}>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
            fontWeight: 400,
            color: '#0f172a',
            letterSpacing: '-0.02em',
            lineHeight: 1.25,
          }}>
            Curated Spaces Built Across Global Growth Corridors
          </h2>
        </div>

        {/* Dense Soft White Fade Bar Extending Below Heading */}
        <div style={{
          position: 'absolute',
          bottom: '-6rem',
          left: 0,
          right: 0,
          height: '6.5rem',
          background: 'linear-gradient(to bottom, #ffffff 0%, rgba(255,255,255,0.96) 35%, rgba(255,255,255,0.7) 65%, rgba(255,255,255,0) 100%)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* 5-Column Checkerboard Grid Container */}
      <div
        className="checkerboard-grid"
        style={{
          position: 'relative',
          zIndex: 1,
          marginTop: headerState === 'fixed' ? '0' : '2rem',
        }}
      >
        {estateItems.map((item) => {
          // Parallax lift on scroll
          const parallaxMult = item.col % 2 === 0 ? 0.12 : 0.06;
          const parallaxOffset = scrollY * parallaxMult;

          return (
            <div
              key={item.id}
              className={`checker-item col-${item.col} row-${item.row}`}
              style={{
                gridColumn: item.col,
                gridRow: item.row,
                transform: `translateY(-${parallaxOffset}px)`,
                transition: 'transform 0.1s cubic-bezier(0, 0, 0.2, 1)',
              }}
            >
              <EstateCard item={item} />
            </div>
          );
        })}
      </div>

      <style>{`
        .checkerboard-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 6rem 2vw;
          align-items: start;
          width: 100%;
        }
        @media (max-width: 1100px) {
          .checkerboard-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 4.5rem 2vw;
          }
          .checker-item {
            grid-column: auto !important;
            grid-row: auto !important;
            transform: none !important;
          }
        }
        @media (max-width: 640px) {
          .checkerboard-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 3.5rem 1.5rem;
          }
        }
      `}</style>
    </section>
  );
}

function EstateCard({ item }: { item: EstateImageItem }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        cursor: 'pointer',
        width: '100%',
        maxWidth: '215px',
        margin: '0 auto',
      }}
    >
      {/* Small Compact Image Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: isHovered ? '0 18px 36px rgba(0,0,0,0.12)' : '0 6px 18px rgba(0,0,0,0.04)',
        backgroundColor: '#f1f5f9',
        aspectRatio: '3.1 / 4',
        transition: 'box-shadow 0.35s ease, transform 0.35s ease',
      }}>
        <img
          src={item.src}
          alt={item.tag}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transform: isHovered ? 'scale(1.06)' : 'scale(1.0)',
            transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          loading="lazy"
        />
      </div>

      {/* Tag Label Below */}
      <div style={{ paddingLeft: '0.1rem' }}>
        <div style={{
          fontSize: '0.92rem',
          fontWeight: 600,
          color: '#0f172a',
          letterSpacing: '-0.01em',
        }}>
          {item.tag}
        </div>
        <div style={{
          fontSize: '0.78rem',
          color: '#64748b',
          fontWeight: 400,
          marginTop: '0.1rem',
        }}>
          {item.category}
        </div>
      </div>
    </div>
  );
}

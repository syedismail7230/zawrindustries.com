'use client';

import React, { useEffect, useRef, useState } from 'react';

interface EstateImageItem {
  id: number;
  src: string;
  tag: string;
  category: string;
  col: number; // 1-indexed column position in 5-column checkerboard
  row: number; // 1-indexed row position
}

const estateItems: EstateImageItem[] = [
  // Row 1: Columns 1, 3, 5
  { id: 1, src: '/assets/estate-animation/image (1).png', tag: 'Parametric Pavilion', category: 'Fluid Future Architecture', col: 1, row: 1 },
  { id: 2, src: '/assets/estate-animation/image (2).png', tag: 'Pop Brutalism', category: 'Color Gradient Facades', col: 3, row: 1 },
  { id: 3, src: '/assets/estate-animation/image (3).png', tag: 'Organic Bio-Villa', category: 'Canopy Forest Sanctuary', col: 5, row: 1 },

  // Row 2: Columns 2, 4 (staggered in between gaps)
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

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top < windowHeight && rect.bottom > 0) {
        setScrollY(windowHeight - rect.top);
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
        padding: '5rem 4vw 11rem',
        width: '100%',
        maxWidth: '1600px',
        margin: '0 auto',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Header Section */}
      <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 6rem' }}>
        <div style={{
          fontSize: '0.78rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          color: '#15803d',
          marginBottom: '0.75rem',
        }}>
          Architectural Portfolio & PropTech Visions
        </div>
        <h2 style={{
          fontSize: 'clamp(2rem, 3.8vw, 3.2rem)',
          fontWeight: 800,
          color: '#0f172a',
          letterSpacing: '-0.025em',
          lineHeight: 1.2,
        }}>
          Curated Spaces Built Across Global Growth Corridors
        </h2>
      </div>

      {/* 5-Column Checkerboard Grid Matching Mockup Screenshot Exactly */}
      <div className="checkerboard-grid">
        {estateItems.map((item) => {
          // Parallax offset based on column position
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
      {/* Small Compact Image Container matching user mockup */}
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

      {/* Tag Label Directly Below (Matching Mockup Screenshot) */}
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

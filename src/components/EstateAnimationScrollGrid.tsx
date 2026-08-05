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

  // Row 5: Columns 1, 3, 5
  { id: 11, src: '/assets/estate-animation/image (11).png', tag: 'Sunlit Architectural Promenade', category: 'Outdoor Terrace Living', col: 1, row: 5 },
  { id: 12, src: '/assets/estate-animation/image (12).png', tag: 'Infinity Pool & Horizon Deck', category: 'Aquatic Sanctuary', col: 3, row: 5 },
  { id: 13, src: '/assets/estate-animation/image (13).png', tag: 'Biophilic Garden Atrium', category: 'Nature-Integrated Spaces', col: 5, row: 5 },
];

export default function EstateAnimationScrollGrid() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [isPinned, setIsPinned] = useState(false);
  const [isUnpinnedBottom, setIsUnpinnedBottom] = useState(false);

  useEffect(() => {
    let rafId: number;

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const navOffset = 96;

      if (rect.top <= navOffset && rect.bottom > navOffset + 350) {
        setIsPinned(true);
        setIsUnpinnedBottom(false);
      } else if (rect.bottom <= navOffset + 350) {
        setIsPinned(false);
        setIsUnpinnedBottom(true);
      } else {
        setIsPinned(false);
        setIsUnpinnedBottom(false);
      }

      if (rect.top < windowHeight && rect.bottom > 0) {
        rafId = requestAnimationFrame(() => {
          setScrollY(windowHeight - rect.top);
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        backgroundColor: '#ffffff',
        padding: '2rem 4vw 10rem',
        width: '100%',
        maxWidth: '1600px',
        margin: '0 auto',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: 'relative',
        minHeight: '260vh',
      }}
    >
      {/* Invisible Spacer when heading is pinned to prevent layout jump */}
      {isPinned && <div style={{ height: '160px' }} />}

      {/* Solid White Fixed Header Container with Dense Bottom Fade */}
      <div
        style={{
          position: isPinned ? 'fixed' : isUnpinnedBottom ? 'absolute' : 'relative',
          top: isPinned ? 0 : 'auto',
          bottom: isUnpinnedBottom ? '3rem' : 'auto',
          left: 0,
          right: 0,
          width: '100%',
          zIndex: 50,
          backgroundColor: '#ffffff',
          paddingTop: isPinned ? '5.8rem' : '1.5rem',
          paddingBottom: '2.5rem',
          textAlign: 'center',
          boxShadow: isPinned ? '0 25px 45px rgba(255,255,255,1)' : 'none',
        }}
      >
        <div style={{ maxWidth: '850px', margin: '0 auto', padding: '0 1rem' }}>
          <h2
            style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              fontWeight: 400,
              color: '#0f172a',
              letterSpacing: '-0.02em',
              lineHeight: 1.25,
            }}
          >
            Curated Spaces Built Across Global Growth Corridors
          </h2>
        </div>

        {/* Ultra-Dense Soft White Fade Bar Extending Below Heading */}
        <div
          style={{
            position: 'absolute',
            bottom: '-6.5rem',
            left: 0,
            right: 0,
            height: '7rem',
            background:
              'linear-gradient(to bottom, #ffffff 0%, rgba(255,255,255,0.98) 40%, rgba(255,255,255,0.7) 70%, rgba(255,255,255,0) 100%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* 5-Column Checkerboard Grid Container */}
      <div
        className="checkerboard-grid"
        style={{
          position: 'relative',
          zIndex: 1,
          marginTop: isPinned ? '0' : '2rem',
        }}
      >
        {estateItems.map((item) => {
          const parallaxMult = item.col % 2 === 0 ? 0.10 : 0.05;
          const parallaxOffset = scrollY * parallaxMult;

          const isRow1 = item.row === 1;
          const row1TopPadding = isRow1 ? '7.5rem' : '0px';

          return (
            <div
              key={item.id}
              className={`checker-item col-${item.col} row-${item.row}`}
              style={{
                gridColumn: item.col,
                gridRow: item.row,
                marginTop: row1TopPadding,
                transform: `translate3d(0, -${parallaxOffset}px, 0)`,
                willChange: 'transform',
                transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
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
          gap: 10rem 2.5vw;
          align-items: start;
          width: 100%;
        }
        @media (max-width: 1100px) {
          .checkerboard-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 6rem 2vw;
          }
          .checker-item {
            grid-column: auto !important;
            grid-row: auto !important;
            transform: none !important;
            margin-top: 0 !important;
          }
        }
        @media (max-width: 640px) {
          .checkerboard-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 4rem 1.5rem;
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
      <div
        style={{
          position: 'relative',
          width: '100%',
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: isHovered ? '0 18px 36px rgba(0,0,0,0.12)' : '0 6px 18px rgba(0,0,0,0.04)',
          backgroundColor: '#f1f5f9',
          aspectRatio: '3.1 / 4',
          transition: 'box-shadow 0.35s ease, transform 0.35s ease',
        }}
      >
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

      <div style={{ paddingLeft: '0.1rem' }}>
        <div
          style={{
            fontSize: '0.92rem',
            fontWeight: 600,
            color: '#0f172a',
            letterSpacing: '-0.01em',
          }}
        >
          {item.tag}
        </div>
        <div
          style={{
            fontSize: '0.78rem',
            color: '#64748b',
            fontWeight: 400,
            marginTop: '0.1rem',
          }}
        >
          {item.category}
        </div>
      </div>
    </div>
  );
}

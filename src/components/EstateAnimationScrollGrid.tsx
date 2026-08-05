'use client';

import React, { useEffect, useRef, useState } from 'react';

interface EstateImageItem {
  id: number;
  src: string;
  tag: string;
  category: string;
  col?: number;
  row?: number;
}

// Vertical Checkerboard Grid Items (10 Items)
const verticalItems: EstateImageItem[] = [
  { id: 1, src: '/assets/estate-animation/image (1).png', tag: 'Parametric Pavilion', category: 'Fluid Future Architecture', col: 1, row: 1 },
  { id: 2, src: '/assets/estate-animation/image (2).png', tag: 'Pop Brutalism', category: 'Color Gradient Facades', col: 3, row: 1 },
  { id: 3, src: '/assets/estate-animation/image (3).png', tag: 'Organic Bio-Villa', category: 'Canopy Forest Sanctuary', col: 5, row: 1 },
  { id: 4, src: '/assets/estate-animation/image (4).png', tag: 'Heritage Palace', category: 'Lakeside Waterfront Estate', col: 2, row: 2 },
  { id: 5, src: '/assets/estate-animation/image (5).png', tag: 'Cliffside Cave Estate', category: 'Rock Carved Living Suites', col: 4, row: 2 },
  { id: 6, src: '/assets/estate-animation/image (6).png', tag: 'Subterranean Luxury', category: 'Eco Mountain Retreat', col: 1, row: 3 },
  { id: 7, src: '/assets/estate-animation/image (7).png', tag: 'Biophilic High-Rise', category: 'Vertical Forest Towers', col: 3, row: 3 },
  { id: 8, src: '/assets/estate-animation/image (8).png', tag: 'Classical Palatial Mansion', category: 'Baroque Heritage Design', col: 5, row: 3 },
  { id: 9, src: '/assets/estate-animation/image (9).png', tag: 'Futuristic Glass Residence', category: 'Modern Structural Steel', col: 2, row: 4 },
  { id: 10, src: '/assets/estate-animation/image (10).png', tag: 'Eco Mountain Sanctuary', category: 'Sustainable Alpine Haven', col: 4, row: 4 },
];

// Horizontal Scroll Items (Last 3 from estate-animation + 6 from estate-lifestyle)
const horizontalItems: EstateImageItem[] = [
  // Last 3 of estate-animation that transform into horizontal scroll
  { id: 11, src: '/assets/estate-animation/image (11).png', tag: 'Sunlit Architectural Promenade', category: 'Outdoor Terrace Living' },
  { id: 12, src: '/assets/estate-animation/image (12).png', tag: 'Infinity Pool & Horizon Deck', category: 'Aquatic Sanctuary' },
  { id: 13, src: '/assets/estate-animation/image (13).png', tag: 'Biophilic Garden Atrium', category: 'Nature-Integrated Spaces' },

  // 6 from estate-lifestyle
  { id: 14, src: '/assets/estate-lifestyle/image (1).png', tag: 'Private Cliffside Lounge', category: 'Panoramic Vista Suites' },
  { id: 15, src: '/assets/estate-lifestyle/image (2).png', tag: 'Lakeside Wellness Pavilion', category: 'Hydrotherapy & Spa' },
  { id: 16, src: '/assets/estate-lifestyle/image (3).png', tag: 'Zen Courtyard Gardens', category: 'Botanical Reflection Hub' },
  { id: 17, src: '/assets/estate-lifestyle/image (4).png', tag: 'Penthouse Sky Terrace', category: 'High-Altitude Hospitality' },
  { id: 18, src: '/assets/estate-lifestyle/image (5).png', tag: 'Subterranean Private Cellar', category: 'Bespoke Wine Cave' },
  { id: 19, src: '/assets/estate-lifestyle/image (6).png', tag: 'Sunset Amphitheater', category: 'Open-Air Cultural Space' },
];

export default function EstateAnimationScrollGrid() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [horizontalProgress, setHorizontalProgress] = useState(0);
  const [isPinned, setIsPinned] = useState(false);
  const [isUnpinnedBottom, setIsUnpinnedBottom] = useState(false);

  useEffect(() => {
    let rafId: number;

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const navOffset = 96;

      // Pin header when top of section reaches 96px
      if (rect.top <= navOffset && rect.bottom > navOffset + 300) {
        setIsPinned(true);
        setIsUnpinnedBottom(false);
      } else if (rect.bottom <= navOffset + 300) {
        setIsPinned(false);
        setIsUnpinnedBottom(true);
      } else {
        setIsPinned(false);
        setIsUnpinnedBottom(false);
      }

      if (rect.top < windowHeight && rect.bottom > 0) {
        const scrolledIn = windowHeight - rect.top;
        const totalHeight = rect.height - windowHeight;

        // Calculate progress for horizontal transition phase (starts after vertical grid)
        const horizontalStartRatio = 0.45;
        const rawProgress = Math.max(0, scrolledIn / totalHeight - horizontalStartRatio) / (1 - horizontalStartRatio);
        const clampedHorizontalProgress = Math.max(0, Math.min(1, rawProgress));

        rafId = requestAnimationFrame(() => {
          setScrollY(scrolledIn);
          setHorizontalProgress(clampedHorizontalProgress);
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        backgroundColor: '#ffffff',
        padding: '2rem 0 10rem',
        width: '100%',
        margin: '0 auto',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: 'relative',
        minHeight: '380vh', // Extended scroll height for combined vertical + horizontal sequence
      }}
    >
      {/* Invisible Spacer when heading is pinned */}
      {isPinned && <div style={{ height: '160px' }} />}

      {/* Single Unified Sticky Fixed Heading Container */}
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

      {/* MAIN CONTAINER */}
      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 4vw' }}>
        {/* PHASE 1: 5-Column Checkerboard Grid Container */}
        <div
          className="checkerboard-grid"
          style={{
            position: 'relative',
            zIndex: 1,
            marginTop: isPinned ? '0' : '2rem',
          }}
        >
          {verticalItems.map((item) => {
            const parallaxMult = (item.col || 1) % 2 === 0 ? 0.10 : 0.05;
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

        {/* PHASE 2: Seamless Horizontal Transformation Track */}
        <div
          style={{
            marginTop: '8rem',
            position: 'relative',
            zIndex: 2,
            width: '100%',
            overflow: 'hidden',
            padding: '2rem 0 4rem',
          }}
        >
          {/* Horizontal Track Gliding Smoothly */}
          <div
            style={{
              display: 'flex',
              gap: '3.5rem',
              transform: `translate3d(-${horizontalProgress * 78}%, 0, 0)`,
              willChange: 'transform',
              transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {horizontalItems.map((item) => (
              <div key={item.id} style={{ flexShrink: 0, width: '255px' }}>
                <EstateCard item={item} />
              </div>
            ))}
          </div>
        </div>
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
      {/* Small Compact Image Container */}
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

      {/* Tag Label Below */}
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

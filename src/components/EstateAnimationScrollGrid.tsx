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

// Vertical Checkerboard Grid Items (Rows 1 to 3)
const verticalRowsTop: EstateImageItem[] = [
  { id: 3, src: '/assets/estate-animation/image (3).png', tag: 'Organic Bio-Villa', category: 'Canopy Forest Sanctuary', col: 1, row: 1 },
  { id: 4, src: '/assets/estate-animation/image (4).png', tag: 'Heritage Palace', category: 'Lakeside Waterfront Estate', col: 3, row: 1 },
  { id: 5, src: '/assets/estate-animation/image (5).png', tag: 'Cliffside Cave Estate', category: 'Rock Carved Living Suites', col: 5, row: 1 },
  { id: 6, src: '/assets/estate-animation/image (6).png', tag: 'Subterranean Luxury', category: 'Eco Mountain Retreat', col: 2, row: 2 },
  { id: 7, src: '/assets/estate-animation/image (7).png', tag: 'Biophilic High-Rise', category: 'Vertical Forest Towers', col: 4, row: 2 },
  { id: 8, src: '/assets/estate-animation/image (8).png', tag: 'Classical Palatial Mansion', category: 'Baroque Heritage Design', col: 1, row: 3 },
  { id: 9, src: '/assets/estate-animation/image (9).png', tag: 'Futuristic Glass Residence', category: 'Modern Structural Steel', col: 3, row: 3 },
  { id: 10, src: '/assets/estate-animation/image (10).png', tag: 'Eco Mountain Sanctuary', category: 'Sustainable Alpine Haven', col: 5, row: 3 },
];

// Row 4 Items (Sunlit Promenade & Infinity Horizon Deck - The Last Second Row)
const row4Items: EstateImageItem[] = [
  { id: 11, src: '/assets/estate-animation/image (11).png', tag: 'Sunlit Promenade', category: 'Outdoor Terrace Living', col: 2, row: 4 },
  { id: 12, src: '/assets/estate-animation/image (12).png', tag: 'Infinity Horizon Deck', category: 'Aquatic Sanctuary', col: 4, row: 4 },
];

// Row 5: Exact 6 Lifestyle Items in Exact Order Specified by User:
// 1. golf -> Golf Fairways
// 2. pool -> Infinity Pool
// 3. rooftop -> Skyline Rooftop
// 4. beach -> Private Beach
// 5. boat -> Private Superyacht
// 6. fireside -> Fireside Hearth
const row5HorizontalItems: EstateImageItem[] = [
  // Col 1 (Animation 1)
  { id: 1, src: '/assets/estate-animation/image (1).png', tag: 'Parametric Pavilion', category: 'Fluid Future Architecture' },
  
  // Col 2 (1. golf)
  { id: 14, src: '/assets/estate-lifestyle/image (1).png', tag: 'Golf Fairways', category: 'Championship Greens' },
  
  // Col 3 (Animation 2 - Color stairs)
  { id: 2, src: '/assets/estate-animation/image (2).png', tag: 'Pop Brutalism', category: 'Color Gradient Facades' },
  
  // Col 4 (2. pool)
  { id: 15, src: '/assets/estate-lifestyle/image (2).png', tag: 'Infinity Pool', category: 'Aquatic Sanctuary' },
  
  // Col 5 (Animation 13 - Dark green moss building)
  { id: 13, src: '/assets/estate-animation/image (13).png', tag: 'Biophilic Garden Atrium', category: 'Nature-Integrated Spaces' },

  // Remaining Lifestyle Cards in exact order: 3. rooftop, 4. beach, 5. boat, 6. fireside
  { id: 16, src: '/assets/estate-lifestyle/image (3).png', tag: 'Skyline Rooftop', category: 'High-Altitude Lounge' },
  { id: 17, src: '/assets/estate-lifestyle/image (4).png', tag: 'Private Beach', category: 'Oceanfront Shoreline' },
  { id: 18, src: '/assets/estate-lifestyle/image (5).png', tag: 'Private Superyacht', category: 'Maritime Charter' },
  { id: 19, src: '/assets/estate-lifestyle/image (6).png', tag: 'Fireside Hearth', category: 'Subterranean Lounge' },
];

export default function EstateAnimationScrollGrid() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const row4Ref = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [horizontalProgress, setHorizontalProgress] = useState(0);
  const [showLifestyle, setShowLifestyle] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isUnpinnedBottom, setIsUnpinnedBottom] = useState(false);

  useEffect(() => {
    let rafId: number;

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const navOffset = 96;

      // Section Pinning state: Stays pinned until horizontal scroll has completely finished gliding all 9 cards
      if (rect.top <= navOffset && rect.bottom > windowHeight) {
        setIsPinned(true);
        setIsUnpinnedBottom(false);
      } else if (rect.bottom <= windowHeight) {
        setIsPinned(false);
        setIsUnpinnedBottom(true);
      } else {
        setIsPinned(false);
        setIsUnpinnedBottom(false);
      }

      if (rect.top < windowHeight && rect.bottom > 0) {
        const scrolledIn = windowHeight - rect.top;
        const totalHeight = rect.height - windowHeight;
        const scrollRatio = Math.max(0, Math.min(1, scrolledIn / totalHeight));

        // Strict DOM check: Row 4 (the last second row) MUST be completely off-screen above the sticky header
        let isRow4Past = false;
        if (row4Ref.current) {
          const r4Rect = row4Ref.current.getBoundingClientRect();
          isRow4Past = r4Rect.bottom <= navOffset + 80;
        } else {
          isRow4Past = scrollRatio >= 0.65;
        }

        const isLifestyleVisible = isRow4Past;

        // Horizontal scroll starts at 0.78 and completes smoothly at 0.98, ensuring Card 9 (Fireside Hearth) is 100% fully visible before unpinning
        const horizontalStartRatio = 0.78;
        const rawHorizProgress = Math.max(0, scrollRatio - horizontalStartRatio) / (0.98 - horizontalStartRatio);
        const clampedHorizontalProgress = Math.max(0, Math.min(1, rawHorizProgress));

        rafId = requestAnimationFrame(() => {
          setScrollY(scrolledIn);
          setShowLifestyle(isLifestyleVisible);
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

  const isHorizontalActive = horizontalProgress > 0.01;
  const isFadeVisible = !showLifestyle;

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
        minHeight: '620vh',
      }}
    >
      {/* Invisible Spacer when heading is pinned */}
      {isPinned && <div style={{ height: '180px' }} />}

      {/* STICKY HEADING CONTAINER WITH CLEARANCE BELOW NAVBAR */}
      <div
        style={{
          position: isPinned ? 'fixed' : isUnpinnedBottom ? 'absolute' : 'relative',
          top: isPinned ? 0 : 'auto',
          bottom: isUnpinnedBottom ? '2rem' : 'auto',
          left: 0,
          right: 0,
          width: '100%',
          zIndex: 40,
          backgroundColor: '#ffffff',
          paddingTop: isPinned ? '6.5rem' : '2rem',
          paddingBottom: '2.5rem',
          textAlign: 'center',
          boxShadow: isPinned && isFadeVisible ? '0 20px 30px rgba(255,255,255,1)' : 'none',
          transition: 'box-shadow 0.4s ease',
        }}
      >
        <div style={{ maxWidth: '850px', margin: '0 auto', padding: '0 1rem', position: 'relative' }}>
          {/* Heading 1: Curated Spaces Built Across Global Growth Corridors */}
          <h2
            style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              fontWeight: 400,
              color: '#0f172a',
              letterSpacing: '-0.02em',
              lineHeight: 1.25,
              opacity: isHorizontalActive ? 0 : 1,
              filter: isHorizontalActive ? 'blur(14px)' : 'blur(0px)',
              transform: isHorizontalActive ? 'scale(0.95)' : 'scale(1.0)',
              transition:
                'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), filter 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            Curated Spaces Built Across Global Growth Corridors
          </h2>

          {/* Heading 2: The Art of Living — Curated Estate Lifestyle */}
          <h2
            style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              fontWeight: 400,
              color: '#0f172a',
              letterSpacing: '-0.02em',
              lineHeight: 1.25,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              margin: '0 auto',
              padding: '0 1rem',
              opacity: isHorizontalActive ? 1 : 0,
              filter: isHorizontalActive ? 'blur(0px)' : 'blur(14px)',
              transform: isHorizontalActive ? 'scale(1.0)' : 'scale(1.05)',
              pointerEvents: isHorizontalActive ? 'auto' : 'none',
              transition:
                'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), filter 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            The Art of Living — Curated Estate Lifestyle
          </h2>
        </div>

        {/* Soft White Fade Bar Below Heading */}
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
            opacity: isFadeVisible ? 1 : 0,
            transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 4vw' }}>
        {/* Rows 1 to 3: Checkerboard Grid */}
        <div
          className="checkerboard-grid"
          style={{
            position: 'relative',
            zIndex: 1,
            marginTop: isPinned ? '0' : '2rem',
          }}
        >
          {verticalRowsTop.map((item) => {
            const parallaxMult = (item.col || 1) % 2 === 0 ? 0.08 : 0.04;
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

        {/* Row 4: Tracked with row4Ref (The Last Second Row) */}
        <div
          ref={row4Ref}
          className="checkerboard-grid"
          style={{
            position: 'relative',
            zIndex: 1,
            marginTop: '10rem',
          }}
        >
          {row4Items.map((item) => (
            <div
              key={item.id}
              className={`checker-item col-${item.col}`}
              style={{
                gridColumn: item.col,
              }}
            >
              <EstateCard item={item} />
            </div>
          ))}
        </div>

        {/* Row 5: Pinned position: fixed at top 17.5rem during horizontal scroll so IT CANNOT MOVE VERTICALLY UP */}
        <div
          style={{
            position: isPinned && showLifestyle ? 'fixed' : 'relative',
            top: isPinned && showLifestyle ? '17.5rem' : 'auto',
            left: isPinned && showLifestyle ? '4vw' : 'auto',
            right: isPinned && showLifestyle ? '4vw' : 'auto',
            zIndex: 30,
            width: isPinned && showLifestyle ? 'calc(100vw - 8vw)' : '100%',
            overflow: 'hidden',
            padding: '1rem 0 4rem',
            marginTop: isPinned && showLifestyle ? '0' : '10rem',
            backgroundColor: '#ffffff',
          }}
        >
          {/* Row 5 Track */}
          <div
            style={{
              display: 'flex',
              gap: '2.5vw',
              transform: `translate3d(-${horizontalProgress * 80}%, 0, 0)`,
              willChange: 'transform, opacity',
              transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {row5HorizontalItems.map((item) => {
              const isLifestyleCard = item.id >= 14;
              const cardOpacity = isLifestyleCard ? (showLifestyle ? 1 : 0) : 1;

              return (
                <div
                  key={item.id}
                  style={{
                    flexShrink: 0,
                    width: 'calc((100vw - 8vw - 10vw) / 5)',
                    opacity: cardOpacity,
                    visibility: isLifestyleCard && !showLifestyle ? 'hidden' : 'visible',
                    transition: isLifestyleCard ? 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.4s ease' : 'none',
                    pointerEvents: isLifestyleCard && !showLifestyle ? 'none' : 'auto',
                  }}
                >
                  <EstateCard item={item} />
                </div>
              );
            })}
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

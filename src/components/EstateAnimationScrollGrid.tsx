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

// Vertical Checkerboard Grid Items (Rows 1 to 4)
const verticalRows: EstateImageItem[] = [
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

// Row 5: Interleaved Horizontal Track Cards (3 Animation + 6 Lifestyle Cards)
const row5HorizontalItems: EstateImageItem[] = [
  // Col 1: Animation 11
  { id: 11, src: '/assets/estate-animation/image (11).png', tag: 'Sunlit Architectural Promenade', category: 'Outdoor Terrace Living' },
  // Col 2: Lifestyle 1 (Fades in at Col 2 when last row vertical scroll ends)
  { id: 14, src: '/assets/estate-lifestyle/image (1).png', tag: 'Private Cliffside Lounge', category: 'Panoramic Vista Suites' },
  // Col 3: Animation 12
  { id: 12, src: '/assets/estate-animation/image (12).png', tag: 'Infinity Pool & Horizon Deck', category: 'Aquatic Sanctuary' },
  // Col 4: Lifestyle 2 (Fades in at Col 4 when last row vertical scroll ends)
  { id: 15, src: '/assets/estate-lifestyle/image (2).png', tag: 'Lakeside Wellness Pavilion', category: 'Hydrotherapy & Spa' },
  // Col 5: Animation 13
  { id: 13, src: '/assets/estate-animation/image (13).png', tag: 'Biophilic Garden Atrium', category: 'Nature-Integrated Spaces' },

  // Remaining Lifestyle Cards that scroll into view horizontally after the small pause
  { id: 16, src: '/assets/estate-lifestyle/image (3).png', tag: 'Zen Courtyard Gardens', category: 'Botanical Reflection Hub' },
  { id: 17, src: '/assets/estate-lifestyle/image (4).png', tag: 'Penthouse Sky Terrace', category: 'High-Altitude Hospitality' },
  { id: 18, src: '/assets/estate-lifestyle/image (5).png', tag: 'Subterranean Private Cellar', category: 'Bespoke Wine Cave' },
  { id: 19, src: '/assets/estate-lifestyle/image (6).png', tag: 'Sunset Amphitheater', category: 'Open-Air Cultural Space' },
];

export default function EstateAnimationScrollGrid() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [verticalShift, setVerticalShift] = useState(0);
  const [horizontalProgress, setHorizontalProgress] = useState(0);
  const [showLifestyle, setShowLifestyle] = useState(false);

  useEffect(() => {
    let rafId: number;

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const navOffset = 96;

      if (rect.top <= navOffset && rect.bottom > windowHeight) {
        const scrolledIn = navOffset - rect.top;
        const totalHeight = rect.height - windowHeight;
        const scrollRatio = Math.max(0, Math.min(1, scrolledIn / totalHeight));

        // STEP 1: Vertical Grid Shift (0.0 to 0.45)
        // Moves Rows 1-4 upwards until Row 5 locks centered in the viewport
        const maxVertShift = 1750; // Total vertical distance to bring Row 5 up to screen center
        const vertProgress = Math.min(1, scrollRatio / 0.45);
        const currentVertShift = vertProgress * maxVertShift;

        // STEP 2: Last row reached end -> lifestyle images appear immediately at 0.45+
        const isLifestyleVisible = scrollRatio >= 0.45;

        // STEP 3 & 4: Small pause between 0.45 and 0.62, then horizontal scroll starts at 0.62+
        const horizontalStartRatio = 0.62;
        const rawHorizProgress = Math.max(0, scrollRatio - horizontalStartRatio) / (1 - horizontalStartRatio);
        const clampedHorizontalProgress = Math.max(0, Math.min(1, rawHorizProgress));

        rafId = requestAnimationFrame(() => {
          setVerticalShift(currentVertShift);
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

  return (
    <section
      ref={sectionRef}
      style={{
        backgroundColor: '#ffffff',
        width: '100%',
        margin: '0 auto',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: 'relative',
        minHeight: '380vh',
      }}
    >
      {/* Viewport Locked Frame: Sticks below header navigation */}
      <div
        style={{
          position: 'sticky',
          top: '5.5rem',
          height: 'calc(100vh - 5.5rem)',
          width: '100%',
          overflow: 'hidden',
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Sticky Section Heading */}
        <div
          style={{
            width: '100%',
            zIndex: 50,
            backgroundColor: '#ffffff',
            paddingTop: '1.5rem',
            paddingBottom: '2rem',
            textAlign: 'center',
            borderBottom: '1px solid rgba(241, 245, 249, 0.8)',
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

          {/* Ultra-Dense Soft White Fade Bar Below Heading */}
          <div
            style={{
              position: 'absolute',
              bottom: '-4.5rem',
              left: 0,
              right: 0,
              height: '5rem',
              background:
                'linear-gradient(to bottom, #ffffff 0%, rgba(255,255,255,0.98) 40%, rgba(255,255,255,0.7) 70%, rgba(255,255,255,0) 100%)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Scroll Content Viewport Window */}
        <div
          style={{
            flex: 1,
            maxWidth: '1600px',
            width: '100%',
            margin: '0 auto',
            padding: '2rem 4vw 0',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Vertical Container that translates upward during Step 1 */}
          <div
            style={{
              transform: `translate3d(0, -${verticalShift}px, 0)`,
              willChange: 'transform',
              transition: 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Rows 1 to 4: Checkerboard Grid */}
            <div className="checkerboard-grid">
              {verticalRows.map((item) => (
                <div
                  key={item.id}
                  className={`checker-item col-${item.col} row-${item.row}`}
                  style={{
                    gridColumn: item.col,
                    gridRow: item.row,
                  }}
                >
                  <EstateCard item={item} />
                </div>
              ))}
            </div>

            {/* Row 5: Positioned below Row 4 with natural gap. Glides horizontally in Step 4 */}
            <div
              style={{
                marginTop: '10rem',
                width: '100%',
                overflow: 'hidden',
                paddingBottom: '4rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: '2.5vw',
                  transform: `translate3d(-${horizontalProgress * 70}%, 0, 0)`,
                  willChange: 'transform, opacity',
                  transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {row5HorizontalItems.map((item) => {
                  const isLifestyleCard = item.id >= 14;
                  // STEP 2: Lifestyle cards fade in IMMEDIATELY when last row reaches end (showLifestyle is true)
                  // STEP 3: Small pause buffer while showLifestyle is true and horizontalProgress is 0
                  // STEP 4: Horizontal scroll glides left when horizontalProgress > 0
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

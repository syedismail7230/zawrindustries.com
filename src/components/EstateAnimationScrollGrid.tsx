'use client';

import React, { useEffect, useRef, useState } from 'react';

interface EstateImageItem {
  id: number;
  src: string;
  tag: string;
  category: string;
}

const estateItems: EstateImageItem[] = [
  { id: 1, src: '/assets/estate-animation/image (1).png', tag: 'Parametric Pavilion', category: 'Fluid Future Architecture' },
  { id: 2, src: '/assets/estate-animation/image (2).png', tag: 'Pop Brutalism', category: 'Color Gradient Facades' },
  { id: 3, src: '/assets/estate-animation/image (3).png', tag: 'Organic Bio-Villa', category: 'Canopy Forest Sanctuary' },
  { id: 4, src: '/assets/estate-animation/image (4).png', tag: 'Heritage Palace', category: 'Lakeside Waterfront Estate' },
  { id: 5, src: '/assets/estate-animation/image (5).png', tag: 'Cliffside Cave Estate', category: 'Rock Carved Living Suites' },
  { id: 6, src: '/assets/estate-animation/image (6).png', tag: 'Subterranean Luxury', category: 'Eco Mountain Retreat' },
  { id: 7, src: '/assets/estate-animation/image (7).png', tag: 'Biophilic High-Rise', category: 'Vertical Forest Towers' },
  { id: 8, src: '/assets/estate-animation/image (8).png', tag: 'Classical Palatial Mansion', category: 'Baroque Heritage Design' },
  { id: 9, src: '/assets/estate-animation/image (9).png', tag: 'Futuristic Glass Residence', category: 'Modern Structural Steel' },
  { id: 10, src: '/assets/estate-animation/image (10).png', tag: 'Eco Mountain Sanctuary', category: 'Sustainable Alpine Haven' },
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

  // Split items into 3 columns for staggered masonry layout
  const col1 = [estateItems[0], estateItems[3], estateItems[6], estateItems[9]];
  const col2 = [estateItems[1], estateItems[4], estateItems[7]];
  const col3 = [estateItems[2], estateItems[5], estateItems[8]];

  return (
    <section
      ref={sectionRef}
      style={{
        backgroundColor: '#ffffff',
        padding: '5rem 6% 9rem',
        maxWidth: '1150px',
        margin: '0 auto',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Header Section */}
      <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 5.5rem' }}>
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
          fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)',
          fontWeight: 800,
          color: '#0f172a',
          letterSpacing: '-0.025em',
          lineHeight: 1.2,
        }}>
          Curated Spaces Built Across Global Growth Corridors
        </h2>
      </div>

      {/* Staggered Grid with Small Image Cards & Large Spacing Gaps (Matching Design Idea) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '7.5rem 5.5rem',
        alignItems: 'start',
        justifyContent: 'center',
      }}>
        {/* Column 1 (Speed Multiplier 0.08) */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '7rem',
          transform: `translateY(-${scrollY * 0.08}px)`,
          transition: 'transform 0.1s cubic-bezier(0, 0, 0.2, 1)',
        }}>
          {col1.map((item) => (
            <EstateCard key={item.id} item={item} />
          ))}
        </div>

        {/* Column 2 (Speed Multiplier 0.14 - Staggered Offset Top) */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '7rem',
          marginTop: '6rem',
          transform: `translateY(-${scrollY * 0.14}px)`,
          transition: 'transform 0.1s cubic-bezier(0, 0, 0.2, 1)',
        }}>
          {col2.map((item) => (
            <EstateCard key={item.id} item={item} />
          ))}
        </div>

        {/* Column 3 (Speed Multiplier 0.06 - Staggered Offset Top) */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '7rem',
          marginTop: '11rem',
          transform: `translateY(-${scrollY * 0.06}px)`,
          transition: 'transform 0.1s cubic-bezier(0, 0, 0.2, 1)',
        }}>
          {col3.map((item) => (
            <EstateCard key={item.id} item={item} />
          ))}
        </div>
      </div>
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
      {/* Small Compact Image Container with Hover Effect */}
      <div style={{
        position: 'relative',
        width: '100%',
        borderRadius: '16px',
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

      {/* Tag Label Directly Below (Matching Design Idea Screenshot) */}
      <div style={{ paddingLeft: '0.15rem' }}>
        <div style={{
          fontSize: '0.92rem',
          fontWeight: 600,
          color: '#0f172a',
          letterSpacing: '-0.01em',
        }}>
          {item.tag}
        </div>
        <div style={{
          fontSize: '0.8rem',
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

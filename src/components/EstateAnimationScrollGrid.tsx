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

  // 4 Columns for full-width Criss-Cross diagonal layout
  const col1 = [estateItems[0], estateItems[4], estateItems[8]];
  const col2 = [estateItems[2], estateItems[6]];
  const col3 = [estateItems[1], estateItems[5], estateItems[9]];
  const col4 = [estateItems[3], estateItems[7]];

  return (
    <section
      ref={sectionRef}
      style={{
        backgroundColor: '#ffffff',
        padding: '5rem 3vw 12rem',
        width: '100%',
        maxWidth: '1650px',
        margin: '0 auto',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Header Section */}
      <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 6.5rem' }}>
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

      {/* Full-Width Criss-Cross 4-Column Grid utilizing all side space */}
      <div className="criss-cross-grid">
        {/* Column 1 (Left Edge - Offset 0px) */}
        <div className="criss-cross-col col-1" style={{
          transform: `translateY(-${scrollY * 0.07}px)`,
        }}>
          {col1.map((item) => (
            <EstateCard key={item.id} item={item} />
          ))}
        </div>

        {/* Column 2 (Center-Left - Offset 140px) */}
        <div className="criss-cross-col col-2" style={{
          marginTop: '7.5rem',
          transform: `translateY(-${scrollY * 0.15}px)`,
        }}>
          {col2.map((item) => (
            <EstateCard key={item.id} item={item} />
          ))}
        </div>

        {/* Column 3 (Center-Right - Offset 45px) */}
        <div className="criss-cross-col col-3" style={{
          marginTop: '3.5rem',
          transform: `translateY(-${scrollY * 0.10}px)`,
        }}>
          {col3.map((item) => (
            <EstateCard key={item.id} item={item} />
          ))}
        </div>

        {/* Column 4 (Right Edge - Offset 200px) */}
        <div className="criss-cross-col col-4" style={{
          marginTop: '11.5rem',
          transform: `translateY(-${scrollY * 0.18}px)`,
        }}>
          {col4.map((item) => (
            <EstateCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      <style>{`
        .criss-cross-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8.5rem 3vw;
          align-items: start;
          width: 100%;
        }
        .criss-cross-col {
          display: flex;
          flex-direction: column;
          gap: 9rem;
          transition: transform 0.1s cubic-bezier(0, 0, 0.2, 1);
        }
        @media (max-width: 1024px) {
          .criss-cross-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 5rem 2rem;
          }
          .criss-cross-col {
            margin-top: 0 !important;
            transform: none !important;
            gap: 4rem;
          }
        }
        @media (max-width: 640px) {
          .criss-cross-grid {
            grid-template-columns: 1fr;
            gap: 3.5rem;
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
        gap: '0.85rem',
        cursor: 'pointer',
        width: '100%',
        maxWidth: '270px',
        margin: '0 auto',
      }}
    >
      {/* Image Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: isHovered ? '0 20px 42px rgba(0,0,0,0.14)' : '0 6px 20px rgba(0,0,0,0.05)',
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

      {/* Tag & Category Label */}
      <div style={{ paddingLeft: '0.15rem' }}>
        <div style={{
          fontSize: '0.94rem',
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

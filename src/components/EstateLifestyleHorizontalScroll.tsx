'use client';

import React, { useEffect, useRef, useState } from 'react';

interface LifestyleCardItem {
  id: number;
  src: string;
  tag: string;
  category: string;
  source: 'animation' | 'lifestyle';
}

const lifestyleItems: LifestyleCardItem[] = [
  // 3 Transition Cards from estate-animation
  { id: 11, src: '/assets/estate-animation/image (11).png', tag: 'Sunlit Architectural Promenade', category: 'Outdoor Terrace Living', source: 'animation' },
  { id: 12, src: '/assets/estate-animation/image (12).png', tag: 'Infinity Pool & Horizon Deck', category: 'Aquatic Sanctuary', source: 'animation' },
  { id: 13, src: '/assets/estate-animation/image (13).png', tag: 'Biophilic Garden Atrium', category: 'Nature-Integrated Spaces', source: 'animation' },

  // 6 Cards from estate-lifestyle
  { id: 1, src: '/assets/estate-lifestyle/image (1).png', tag: 'Private Cliffside Lounge', category: 'Panoramic Vista Suites', source: 'lifestyle' },
  { id: 2, src: '/assets/estate-lifestyle/image (2).png', tag: 'Lakeside Wellness Pavilion', category: 'Hydrotherapy & Spa', source: 'lifestyle' },
  { id: 3, src: '/assets/estate-lifestyle/image (3).png', tag: 'Zen Courtyard Gardens', category: 'Botanical Reflection Hub', source: 'lifestyle' },
  { id: 4, src: '/assets/estate-lifestyle/image (4).png', tag: 'Penthouse Sky Terrace', category: 'High-Altitude Hospitality', source: 'lifestyle' },
  { id: 5, src: '/assets/estate-lifestyle/image (5).png', tag: 'Subterranean Private Cellar', category: 'Bespoke Wine Cave', source: 'lifestyle' },
  { id: 6, src: '/assets/estate-lifestyle/image (6).png', tag: 'Sunset Amphitheater', category: 'Open-Air Cultural Space', source: 'lifestyle' },
];

export default function EstateLifestyleHorizontalScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let rafId: number;

    const handleScroll = () => {
      if (!containerRef.current || !trackRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress (0 to 1) while container scrolls through viewport
      const totalScrollableDistance = rect.height - windowHeight;
      if (totalScrollableDistance <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / totalScrollableDistance));

      rafId = requestAnimationFrame(() => {
        setScrollProgress(progress);
      });
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
      ref={containerRef}
      style={{
        backgroundColor: '#ffffff',
        height: '350vh', // Tall scroll track to give smooth horizontal scroll pace
        position: 'relative',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Sticky Viewport Frame pinned at top: 5.5rem */}
      <div
        style={{
          position: 'sticky',
          top: '5.5rem',
          height: 'calc(100vh - 5.5rem)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
        }}
      >
        {/* Horizontal Track Wrapper */}
        <div style={{ width: '100%', overflow: 'hidden', padding: '1rem 0 3rem' }}>
          <div
            ref={trackRef}
            style={{
              display: 'flex',
              gap: '3.5rem',
              paddingLeft: '6vw',
              paddingRight: '12vw',
              transform: `translate3d(-${scrollProgress * 72}%, 0, 0)`,
              willChange: 'transform',
              transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {lifestyleItems.map((item) => (
              <LifestyleCard key={`${item.source}-${item.id}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LifestyleCard({ item }: { item: LifestyleCardItem }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        flexShrink: 0,
        width: '260px',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        cursor: 'pointer',
      }}
    >
      {/* Image Container with Hover Scale */}
      <div style={{
        position: 'relative',
        width: '100%',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: isHovered ? '0 20px 40px rgba(0,0,0,0.12)' : '0 6px 18px rgba(0,0,0,0.04)',
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

      {/* Clean Tag & Subtitle Label Below */}
      <div style={{ paddingLeft: '0.1rem' }}>
        <div style={{
          fontSize: '0.94rem',
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

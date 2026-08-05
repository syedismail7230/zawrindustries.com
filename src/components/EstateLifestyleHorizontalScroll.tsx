'use client';

import React, { useEffect, useRef, useState } from 'react';

interface LifestyleCard {
  id: number;
  src: string;
  tag: string;
  category: string;
  description: string;
}

const lifestyleItems: LifestyleCard[] = [
  {
    id: 1,
    src: '/assets/estate-lifestyle/image (1).png',
    tag: 'Infinity Deck & Private Oasis',
    category: 'Zen Solitude',
    description: 'Panoramic open-air living spaces designed for serene reflection and uncompromised privacy.',
  },
  {
    id: 2,
    src: '/assets/estate-lifestyle/image (2).png',
    tag: 'Biophilic Wellness Sanctuary',
    category: 'Holistic Living',
    description: 'Indoor thermal springs, circadian lighting, and oxygenated conservatory lounges.',
  },
  {
    id: 3,
    src: '/assets/estate-lifestyle/image (3).png',
    tag: 'Skyline Social Club',
    category: 'Curated Gathering',
    description: 'Exclusive private dining rooms, sommelier tasting vaults, and rooftop amphitheaters.',
  },
  {
    id: 4,
    src: '/assets/estate-lifestyle/image (4).png',
    tag: 'Subterranean Spa & Cellar',
    category: 'Indulgent Comfort',
    description: 'Temperature-controlled vintage vaults integrated with stone-hewn hydrotherapy pools.',
  },
  {
    id: 5,
    src: '/assets/estate-lifestyle/image (5).png',
    tag: 'Canopy Nature Trail',
    category: 'Eco Living',
    description: 'Private botanical preserves, organic hydroponic farms, and elevated canopy walks.',
  },
  {
    id: 6,
    src: '/assets/estate-lifestyle/image (6).png',
    tag: 'Coastal Dock & Heli-Pad',
    category: 'Seamless Mobility',
    description: 'Direct maritime access and private aviation lounge facilities integrated on site.',
  },
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

      // Calculate progress through 300vh container
      const totalScrollable = rect.height - windowHeight;
      const currentScroll = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / totalScrollable));

      rafId = requestAnimationFrame(() => {
        setScrollProgress(progress);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Calculate total width to translate track horizontally
  // 6 cards of 380px + gap = ~2500px total track width
  const maxTranslatePercentage = 75; // Translates track up to 75% left

  return (
    <section
      ref={containerRef}
      style={{
        position: 'relative',
        height: '280vh',
        backgroundColor: '#0a0f0d',
        color: '#ffffff',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Pinned Viewport Container */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {/* Section Header */}
        <div
          style={{
            padding: '3.5rem 5% 2rem',
            maxWidth: '1400px',
            width: '100%',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '1.5rem',
            zIndex: 10,
          }}
        >
          <div>
            <div
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.16em',
                color: '#52b788',
                marginBottom: '0.5rem',
              }}
            >
              Curated Lifestyle & Wellness
            </div>
            <h2
              style={{
                fontSize: 'clamp(2rem, 3.8vw, 3.2rem)',
                fontWeight: 300,
                color: '#f8fafc',
                letterSpacing: '-0.025em',
                lineHeight: 1.15,
              }}
            >
              Architecture Designed for How You Live
            </h2>
          </div>

          <div
            style={{
              fontSize: '0.9rem',
              color: '#94a3b8',
              maxWidth: '360px',
              lineHeight: 1.6,
            }}
          >
            Scroll down to explore private amenities, biophilic spaces, and master-planned lifestyle retreats.
          </div>
        </div>

        {/* Horizontal Card Track */}
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            gap: '2.5rem',
            paddingLeft: '5%',
            paddingRight: '10%',
            width: 'max-content',
            transform: `translate3d(-${scrollProgress * maxTranslatePercentage}%, 0, 0)`,
            willChange: 'transform',
            transition: 'transform 0.1s cubic-bezier(0, 0, 0.2, 1)',
          }}
        >
          {lifestyleItems.map((item) => (
            <LifestyleCardItem key={item.id} item={item} />
          ))}
        </div>

        {/* Bottom Horizontal Scroll Progress Bar */}
        <div
          style={{
            position: 'absolute',
            bottom: '2.5rem',
            left: '5%',
            right: '5%',
            height: '2px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${Math.max(8, scrollProgress * 100)}%`,
              backgroundColor: '#52b788',
              borderRadius: '2px',
              transition: 'width 0.1s ease',
            }}
          />
        </div>
      </div>
    </section>
  );
}

function LifestyleCardItem({ item }: { item: LifestyleCard }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        flexShrink: 0,
        width: '380px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem',
        cursor: 'pointer',
      }}
    >
      {/* Image Frame */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '460px',
          borderRadius: '22px',
          overflow: 'hidden',
          backgroundColor: '#1e293b',
          boxShadow: isHovered
            ? '0 25px 50px rgba(0,0,0,0.5)'
            : '0 12px 30px rgba(0,0,0,0.3)',
          transition: 'box-shadow 0.4s ease, transform 0.4s ease',
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
            transform: isHovered ? 'scale(1.07)' : 'scale(1.0)',
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          loading="lazy"
        />

        {/* Category Pill Overlay */}
        <div
          style={{
            position: 'absolute',
            top: '1.25rem',
            left: '1.25rem',
            backgroundColor: 'rgba(10, 15, 13, 0.75)',
            backdropFilter: 'blur(12px)',
            color: '#74c69d',
            fontSize: '0.78rem',
            fontWeight: 600,
            padding: '0.4rem 0.9rem',
            borderRadius: '100px',
            border: '1px solid rgba(116, 198, 157, 0.3)',
          }}
        >
          {item.category}
        </div>
      </div>

      {/* Card Info & Description */}
      <div style={{ paddingLeft: '0.2rem' }}>
        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#f8fafc',
            letterSpacing: '-0.015em',
            marginBottom: '0.4rem',
          }}
        >
          {item.tag}
        </h3>
        <p
          style={{
            fontSize: '0.88rem',
            color: '#94a3b8',
            lineHeight: 1.5,
          }}
        >
          {item.description}
        </p>
      </div>
    </div>
  );
}

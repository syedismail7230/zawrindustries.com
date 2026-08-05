'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScrollTextRevealProps {
  text?: string;
}

export default function ScrollTextReveal({
  text = "We're here to build something meaningful together, turning ideas into impactful real estate experiences that create lasting value and drive real growth."
}: ScrollTextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const words = text.split(' ');

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start revealing when container top reaches 75% of viewport
      // Complete reveal when container reaches 35% of viewport
      const start = windowHeight * 0.85;
      const end = windowHeight * 0.25;

      const progress = (start - rect.top) / (start - end);
      const clamped = Math.max(0, Math.min(1, progress));
      setScrollProgress(clamped);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={containerRef}
      style={{
        backgroundColor: '#ffffff',
        padding: '8rem 6% 9rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        minHeight: '60vh',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <p style={{
          fontSize: 'clamp(2.1rem, 4.4vw, 3.8rem)',
          fontWeight: 500,
          lineHeight: 1.35,
          letterSpacing: '-0.025em',
          wordWrap: 'break-word',
        }}>
          {words.map((word, index) => {
            const wordProgress = index / words.length;
            const isRevealed = scrollProgress >= wordProgress;

            // Compute subtle per-word transition intensity
            const diff = scrollProgress - wordProgress;
            const opacity = isRevealed ? Math.min(1, 0.25 + diff * 6) : 0.15;
            const blurAmount = isRevealed ? Math.max(0, 4 - diff * 24) : 4;

            return (
              <span
                key={index}
                style={{
                  display: 'inline-block',
                  marginRight: '0.3em',
                  color: '#000000',
                  opacity: opacity,
                  filter: `blur(${blurAmount}px)`,
                  transition: 'opacity 0.25s ease-out, filter 0.25s ease-out, transform 0.25s ease-out',
                  transform: isRevealed ? 'translateY(0px)' : 'translateY(4px)',
                  willChange: 'opacity, filter, transform',
                }}
              >
                {word}
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
}

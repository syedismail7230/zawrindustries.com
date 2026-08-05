'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScrollTextRevealProps {
  text?: string;
}

export default function ScrollTextReveal({
  text = "Every piece of land has its own character and story. We build thoughtful spaces that feel natural to live in, blending clean modern design with enduring quality. Places built not just to impress today, but to last for generations."
}: ScrollTextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const words = text.split(' ');

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start revealing as soon as top enters 95% of viewport
      // Complete 100% unblur for ALL words when top reaches 50% (center of screen)
      const startY = windowHeight * 0.95;
      const endY = windowHeight * 0.50;

      const progress = (startY - rect.top) / (startY - endY);
      const clamped = Math.max(0, Math.min(1, progress));
      setScrollProgress(clamped);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      style={{
        backgroundColor: '#ffffff',
        padding: '5rem 6% 6rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        minHeight: '35vh',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <p style={{
          fontSize: 'clamp(1.35rem, 2.5vw, 2.1rem)',
          fontWeight: 400,
          lineHeight: 1.5,
          letterSpacing: '-0.015em',
          wordWrap: 'break-word',
        }}>
          {words.map((word, index) => {
            // Distribute word thresholds up to 0.85 so the entire sentence is 100% sharp by 85% progress
            const wordThreshold = (index / Math.max(1, words.length - 1)) * 0.85;
            const isRevealed = scrollProgress >= wordThreshold;

            return (
              <span
                key={index}
                style={{
                  display: 'inline-block',
                  marginRight: '0.3em',
                  color: '#000000',
                  opacity: isRevealed ? 1.0 : 0.15,
                  filter: isRevealed ? 'blur(0px)' : 'blur(4px)',
                  transform: isRevealed ? 'translateY(0px)' : 'translateY(3px)',
                  transition: 'opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), filter 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
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

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
    let rafId: number;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start reveal when top enters 85% of viewport
      // Complete reveal when top reaches 25% of viewport (works smoothly on Mobile & Desktop)
      const startY = windowHeight * 0.85;
      const endY = windowHeight * 0.25;

      const progress = (startY - rect.top) / (startY - endY);
      const clamped = Math.max(0, Math.min(1, progress));

      rafId = requestAnimationFrame(() => {
        setScrollProgress(clamped);
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
        padding: 'clamp(4rem, 8vw, 7rem) 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        minHeight: '40vh',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <p
          style={{
            fontSize: 'clamp(1.35rem, 4vw, 2.2rem)',
            fontWeight: 400,
            lineHeight: 1.55,
            letterSpacing: '-0.015em',
            wordWrap: 'break-word',
            margin: 0,
          }}
        >
          {words.map((word, index) => {
            // Distribute word thresholds evenly from 0.0 to 0.90
            const wordThreshold = (index / Math.max(1, words.length - 1)) * 0.90;
            const isRevealed = scrollProgress >= wordThreshold;

            return (
              <span
                key={index}
                style={{
                  display: 'inline-block',
                  marginRight: '0.3em',
                  color: '#000000',
                  opacity: isRevealed ? 1.0 : 0.12,
                  filter: isRevealed ? 'blur(0px)' : 'blur(5px)',
                  transform: isRevealed ? 'translateY(0px)' : 'translateY(4px)',
                  transition:
                    'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), filter 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
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

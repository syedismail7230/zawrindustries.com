'use client';

import React, { useEffect, useRef, useState } from 'react';

const aboutDescription =
  "Zawr Industries LLP is a multi-sector industrial conglomerate integrating advanced software engineering, automated logistics, precision manufacturing, real estate, and healthcare technology into a unified ecosystem. Engineered for global scale and long-term sustainability, we empower enterprises through artificial intelligence, robust supply chain infrastructure, and transparent corporate governance—delivering sustainable value and driving digital transformation across international markets.";

export default function AboutStatement() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let animationFrameId: number;

    const updateScrollProgress = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;

      // Start revealing when element top hits 85% of screen height
      // Finish revealing when element top reaches 20% of screen height
      const startPos = windowHeight * 0.85;
      const endPos = windowHeight * 0.20;

      const progress = (startPos - rect.top) / (startPos - endPos);
      const clampedProgress = Math.max(0, Math.min(1, progress));

      setScrollProgress(clampedProgress);
    };

    const onScroll = () => {
      animationFrameId = requestAnimationFrame(updateScrollProgress);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateScrollProgress();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const words = aboutDescription.split(' ');

  return (
    <section
      ref={containerRef}
      id="about-us"
      style={{
        backgroundColor: '#ffffff',
        color: '#0f172a',
        padding: 'clamp(6rem, 11vw, 9rem) 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: 'relative',
        borderTop: '1px solid #f1f5f9',
        scrollMarginTop: '80px',
      }}
    >
      <div
        style={{
          maxWidth: '1040px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2.25rem',
        }}
      >
        {/* Crisp Geometric Black Z Logo Icon */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src="/assets/about-hero.png"
            alt="Zawr Industries Geometric Z Logo"
            style={{
              height: 'clamp(60px, 8vw, 85px)',
              width: 'auto',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </div>

        {/* Headline Quote */}
        <h2
          style={{
            fontSize: 'clamp(2rem, 4.2vw, 3.2rem)',
            fontWeight: 400,
            letterSpacing: '-0.03em',
            lineHeight: 1.25,
            color: '#0f172a',
            margin: 0,
            maxWidth: '750px',
          }}
        >
          We turn ideas into lasting impact
        </h2>

        {/* Word-by-Word Scroll Text Reveal Paragraph */}
        <p
          style={{
            fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
            fontWeight: 300,
            letterSpacing: '-0.02em',
            lineHeight: 1.55,
            margin: '1rem 0 0 0',
            maxWidth: '920px',
            textAlign: 'center',
          }}
        >
          {words.map((word, i) => {
            const targetWordProgress = i / words.length;
            const isRevealed = scrollProgress >= targetWordProgress;

            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  marginRight: '0.28em',
                  color: isRevealed ? '#0f172a' : '#94a3b8',
                  opacity: isRevealed ? 1 : 0.25,
                  transform: isRevealed ? 'translateY(0)' : 'translateY(3px)',
                  transition: 'opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), color 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s ease-out',
                  fontWeight: isRevealed ? 400 : 300,
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



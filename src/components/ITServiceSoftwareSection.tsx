'use client';

import React, { useState, useEffect, useRef } from 'react';

const PARAGRAPH_1 = "Zawr Industries is a technology-driven business group focused on building, transforming, and scaling businesses through technology, innovation, and strategic execution. We bring together technology, business intelligence, digital solutions, and operational expertise to turn ambitious ideas into scalable ventures.";

const PARAGRAPH_2 = "From developing intelligent platforms to enabling businesses with modern digital infrastructure, we work at the intersection of technology and enterprise—creating solutions designed not only for today, but for what comes next.";

const PARAGRAPH_3 = "We don’t just build technology. We build businesses, systems, and possibilities.";

export default function ITServiceSoftwareSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let rafId: number;

    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        if (!sectionRef.current) return;
        const rect = sectionRef.current.getBoundingClientRect();
        const scrollableDistance = rect.height - window.innerHeight;

        if (scrollableDistance <= 0) return;

        if (rect.top > 0) {
          setScrollProgress(0);
        } else if (rect.top < -scrollableDistance) {
          setScrollProgress(1);
        } else {
          const progress = -rect.top / scrollableDistance;
          setScrollProgress(progress);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const p1Words = PARAGRAPH_1.split(' ');
  const p2Words = PARAGRAPH_2.split(' ');
  const p3Words = PARAGRAPH_3.split(' ');
  const totalWords = p1Words.length + p2Words.length + p3Words.length;

  let globalWordCounter = 0;

  return (
    <section
      ref={sectionRef}
      className="it-service-software-section"
      style={{
        position: 'relative',
        height: '240vh', // Pinned scroll track length
        backgroundColor: '#ffffff',
        width: '100%',
      }}
    >
      {/* Sticky Inner Container: Centered in Viewport */}
      <div
        className="it-service-sticky-wrapper"
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 2rem',
          boxSizing: 'border-box',
        }}
      >
        <div
          className="it-service-container"
          style={{
            maxWidth: '1350px',
            width: '100%',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1.25fr',
            gap: 'clamp(2.5rem, 6vw, 5.5rem)',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Image masked with image.svg */}
          <div
            className="it-service-image-col"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '460px',
                aspectRatio: '313 / 309',
                borderRadius: '8px',
                overflow: 'hidden',
                WebkitMaskImage: 'url(/assets/image.svg)',
                maskImage: 'url(/assets/image.svg)',
                WebkitMaskSize: '100% 100%',
                maskSize: '100% 100%',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
              }}
            >
              <img
                src="/assets/h3.png"
                alt="IT Service & Software Conglomerate"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
                loading="eager"
              />
            </div>
          </div>

          {/* Right Column: Content with Pinned Word Reveal */}
          <div
            className="it-service-content-col"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <h3
              style={{
                fontSize: 'clamp(1.1rem, 1.8vw, 1.35rem)',
                fontWeight: 400,
                color: '#333333',
                letterSpacing: '-0.01em',
                margin: 0,
                marginBottom: '2rem',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              Building what’s next.
            </h3>

            {/* Paragraph 1 */}
            <p
              style={{
                fontSize: 'clamp(0.95rem, 1.15vw, 1.08rem)',
                lineHeight: 1.7,
                margin: 0,
                marginBottom: '1.25rem',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              {p1Words.map((word, idx) => {
                const currentWordIdx = globalWordCounter++;
                const isRevealed = scrollProgress >= currentWordIdx / totalWords;
                return (
                  <span
                    key={`p1-${idx}`}
                    style={{
                      color: isRevealed ? '#111111' : '#b5b5b5',
                      opacity: isRevealed ? 1 : 0.35,
                      transition: 'color 0.15s ease, opacity 0.15s ease',
                      display: 'inline-block',
                      marginRight: '0.28em',
                    }}
                  >
                    {word}
                  </span>
                );
              })}
            </p>

            {/* Paragraph 2 */}
            <p
              style={{
                fontSize: 'clamp(0.95rem, 1.15vw, 1.08rem)',
                lineHeight: 1.7,
                margin: 0,
                marginBottom: '2rem',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              {p2Words.map((word, idx) => {
                const currentWordIdx = globalWordCounter++;
                const isRevealed = scrollProgress >= currentWordIdx / totalWords;
                return (
                  <span
                    key={`p2-${idx}`}
                    style={{
                      color: isRevealed ? '#111111' : '#b5b5b5',
                      opacity: isRevealed ? 1 : 0.35,
                      transition: 'color 0.15s ease, opacity 0.15s ease',
                      display: 'inline-block',
                      marginRight: '0.28em',
                    }}
                  >
                    {word}
                  </span>
                );
              })}
            </p>

            {/* Paragraph 3 */}
            <p
              style={{
                fontSize: 'clamp(1rem, 1.25vw, 1.15rem)',
                lineHeight: 1.6,
                fontWeight: 500,
                margin: 0,
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              {p3Words.map((word, idx) => {
                const currentWordIdx = globalWordCounter++;
                const isRevealed = scrollProgress >= currentWordIdx / totalWords;
                return (
                  <span
                    key={`p3-${idx}`}
                    style={{
                      color: isRevealed ? '#111111' : '#b5b5b5',
                      opacity: isRevealed ? 1 : 0.35,
                      transition: 'color 0.15s ease, opacity 0.15s ease',
                      display: 'inline-block',
                      marginRight: '0.28em',
                    }}
                  >
                    {word}
                  </span>
                );
              })}
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 960px) {
          .it-service-software-section {
            height: auto !important;
          }
          .it-service-sticky-wrapper {
            position: relative !important;
            height: auto !important;
            padding: 4rem 1.25rem !important;
          }
          .it-service-container {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
          .it-service-content-col {
            text-align: left;
          }
        }
      `}</style>
    </section>
  );
}

'use client';

import { useState, useEffect } from 'react';

const WORDS = ['meaningful.', 'powerful.', 'impactful.'];

export default function TechStatementReveal() {
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % WORDS.length);
        setIsVisible(true);
      }, 350);
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="tech-statement-section"
      style={{
        backgroundColor: '#ffffff',
        width: '100%',
        padding: '3rem 2rem 1.5rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <h2
        className="tech-statement-text"
        style={{
          fontSize: 'clamp(1.4rem, 4vw, 3.2rem)',
          color: '#111111',
          fontWeight: 400,
          letterSpacing: '-0.02em',
          lineHeight: 1.35,
          margin: 0,
        }}
      >
        <span className="tech-statement-prefix">We make technology </span>
        <span
          className="tech-word-container"
          style={{
            display: 'inline-block',
            width: '6.4em',
            textAlign: 'left',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              transition: 'opacity 0.4s ease, filter 0.4s ease',
              opacity: isVisible ? 1 : 0,
              filter: isVisible ? 'blur(0px)' : 'blur(8px)',
              color: '#111111',
              fontWeight: 400,
            }}
          >
            {WORDS[index]}
          </span>
        </span>
      </h2>

      <style jsx>{`
        @media (max-width: 768px) {
          .tech-statement-section {
            padding: 2.5rem 1.5rem 1rem 1.5rem !important;
          }
          .tech-statement-text {
            font-size: clamp(1.8rem, 5.5vw, 2.8rem) !important;
          }
          .tech-word-container {
            width: 6.4em !important;
          }
        }
        @media (max-width: 480px) {
          .tech-statement-section {
            padding: 2rem 1.2rem 1rem 1.2rem !important;
          }
          .tech-statement-text {
            font-size: clamp(1.85rem, 6.8vw, 2.6rem) !important;
          }
          .tech-word-container {
            width: auto !important;
            min-width: 5.8em !important;
          }
        }
      `}</style>
    </section>
  );
}

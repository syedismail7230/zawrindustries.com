'use client';

import React, { useState, useEffect, useRef } from 'react';

interface ProcessStep {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

const STEPS: ProcessStep[] = [
  {
    number: '01',
    title: 'Perspective',
    subtitle: 'Seeing through your vision',
    description: 'We align deeply with your business goals, market dynamics, and user needs to build a clear strategic blueprint before execution begins.',
    image: '/assets/perspective.png',
  },
  {
    number: '02',
    title: 'Ideation',
    subtitle: 'Designing every detail',
    description: 'From system architecture to digital user experience, we design solutions with meticulous detail tailored for enterprise scaling.',
    image: '/assets/ideation.png',
  },
  {
    number: '03',
    title: 'Creation',
    subtitle: 'Crafting the product',
    description: 'Our engineering teams build robust, intelligent platforms utilizing modern tech stacks, cloud infrastructure, and operational excellence.',
    image: '/assets/creation.png',
  },
  {
    number: '04',
    title: 'Launch',
    subtitle: 'Presenting to the world',
    description: 'We deploy, monitor, and scale your venture with strategic execution, ensuring seamless performance and long-term business impact.',
    image: '/assets/launch.png',
  },
];

export default function OurProcessSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [maxTranslateX, setMaxTranslateX] = useState(0);

  useEffect(() => {
    const updateDimensions = () => {
      if (!trackRef.current) return;
      const trackWidth = trackRef.current.scrollWidth;
      const viewportWidth = window.innerWidth;
      // Extra 950px offset ensures 4th card (Launch) translates fully into the center of the screen
      const maxScroll = Math.max(0, trackWidth - viewportWidth + (viewportWidth > 768 ? 950 : 400));
      setMaxTranslateX(maxScroll);
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });

    if (trackRef.current) {
      resizeObserver.observe(trackRef.current);
    }

    window.addEventListener('resize', updateDimensions);

    let rafId: number;
    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        if (!sectionRef.current) return;
        const rect = sectionRef.current.getBoundingClientRect();
        const scrollableDistance = rect.height - window.innerHeight;

        if (scrollableDistance <= 0) return;

        // Multiply denominator by 0.65 so 100% horizontal scroll completes EARLY before page bottom!
        let progress = -rect.top / (scrollableDistance * 0.65);
        progress = Math.min(1, Math.max(0, progress));
        setScrollProgress(progress);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const translateX = scrollProgress * maxTranslateX;

  return (
    <section
      ref={sectionRef}
      className="horizontal-scroll-process-section"
      style={{
        position: 'relative',
        height: '360vh', // Generous scroll track height
        backgroundColor: '#ffffff',
        width: '100%',
        paddingBottom: '6rem',
      }}
    >
      {/* Sticky Viewport Stage */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflow: 'hidden',
          backgroundColor: '#ffffff',
        }}
      >
        {/* Header Title (Centered) */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: 'clamp(1.5rem, 2.5vw, 2.5rem)',
            padding: '0 1.5rem',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)',
              fontWeight: 400,
              color: '#111111',
              letterSpacing: '-0.02em',
              lineHeight: 1.12,
              margin: 0,
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            Our Process
          </h2>
        </div>

        {/* Horizontal Card Track */}
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            gap: 'clamp(2rem, 4vw, 3.5rem)',
            paddingLeft: 'clamp(2rem, 8vw, 12vw)',
            paddingRight: 'clamp(12rem, 26vw, 38vw)',
            transform: `translateX(-${translateX}px)`,
            transition: 'transform 0.12s cubic-bezier(0.1, 1, 0.3, 1)',
            willChange: 'transform',
          }}
        >
          {STEPS.map((step) => (
            <div
              key={step.number}
              style={{
                flexShrink: 0,
                width: 'clamp(640px, 66vw, 1080px)',
                height: 'clamp(460px, 67vh, 750px)',
                borderRadius: '32px',
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: '#f5f5f7',
                boxShadow: '0 28px 70px -15px rgba(0, 0, 0, 0.14), 0 12px 30px -10px rgba(0, 0, 0, 0.06)',
                cursor: 'pointer',
              }}
            >
              {/* Card Image */}
              <img
                src={step.image}
                alt={step.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />

              {/* Bottom Gradient Overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0) 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: 'clamp(2.25rem, 4.5vw, 4rem)',
                  boxSizing: 'border-box',
                }}
              >
                <h3
                  style={{
                    fontSize: 'clamp(2.4rem, 3.8vw, 3.8rem)',
                    fontWeight: 400,
                    color: '#ffffff',
                    letterSpacing: '-0.02em',
                    margin: 0,
                    marginBottom: '0.35rem',
                    fontFamily: 'Inter, -apple-system, sans-serif',
                  }}
                >
                  {step.title}
                </h3>

                <p
                  style={{
                    fontSize: 'clamp(1.15rem, 1.6vw, 1.5rem)',
                    fontWeight: 400,
                    fontStyle: 'italic',
                    color: 'rgba(255, 255, 255, 0.9)',
                    margin: 0,
                    fontFamily: 'Inter, -apple-system, sans-serif',
                  }}
                >
                  {step.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .horizontal-scroll-process-section {
            height: auto !important;
          }
          .horizontal-scroll-process-section > div {
            position: relative !important;
            height: auto !important;
            padding: 4rem 0 !important;
          }
          .horizontal-scroll-process-section div[ref="trackRef"] {
            overflow-x: auto !important;
            padding-left: 1.25rem !important;
            padding-right: 1.25rem !important;
            transform: none !important;
          }
          .horizontal-scroll-process-section div[style*="flexShrink: 0"] {
            width: 88vw !important;
            height: 400px !important;
          }
        }
      `}</style>
    </section>
  );
}

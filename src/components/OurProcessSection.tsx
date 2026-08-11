'use client';

import React, { useEffect, useRef, useState } from 'react';

const STEPS = [
  {
    number: '01',
    title: 'Perspective',
    subtitle: 'Seeing through your vision',
    description: 'We align deeply with your business goals, market dynamics, and user needs to build a clear strategic blueprint before execution begins.',
    image: '/assets/perspective-img.png',
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

type PinState = 'before' | 'pinned' | 'after';

export default function OurProcessSection() {
  const spacerRef = useRef<HTMLDivElement>(null);
  const [pinState, setPinState] = useState<PinState>('before');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const spacer = spacerRef.current;
      if (!spacer) return;

      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      const top = spacer.offsetTop;
      const height = spacer.offsetHeight;

      const pinStart = top;
      const pinEnd = top + height - vh;

      if (scrollY <= pinStart) {
        setPinState('before');
        setProgress(0);
      } else if (scrollY >= pinEnd) {
        setPinState('after');
        setProgress(1);
      } else {
        setPinState('pinned');
        setProgress((scrollY - pinStart) / (pinEnd - pinStart));
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const sliceSize = 1 / STEPS.length;
  const activeIndex = Math.min(STEPS.length - 1, Math.floor(progress / sliceSize));
  const sliceStart = activeIndex * sliceSize;
  const activeCardProgress = progress >= 1 ? 1 : Math.min(1, (progress - sliceStart) / sliceSize);

  const innerStyle: React.CSSProperties =
    pinState === 'pinned'
      ? { position: 'fixed', top: 0, left: 0, right: 0, height: '100vh', zIndex: 10, backgroundColor: '#ffffff' }
      : pinState === 'after'
      ? { position: 'absolute', bottom: 0, left: 0, right: 0, height: '100vh', zIndex: 1, backgroundColor: '#ffffff' }
      : { position: 'absolute', top: 0, left: 0, right: 0, height: '100vh', zIndex: 1, backgroundColor: '#ffffff' };

  return (
    <section
      ref={spacerRef}
      style={{
        position: 'relative',
        height: `${STEPS.length * 120 + 20}vh`,
        backgroundColor: '#ffffff',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <div style={innerStyle}>
        {/* Section Header */}
        <div style={{ position: 'absolute', top: 'clamp(3rem, 5.5vh, 4.5rem)', left: 0, right: 0, textAlign: 'center', zIndex: 10 }}>
          <h2 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)', fontWeight: 400, color: '#0f172a', letterSpacing: '-0.03em', margin: 0 }}>
            Our Process
          </h2>
        </div>

        {/* Stacked Full-Image Cards Stage */}
        <div
          style={{
            position: 'absolute',
            top: '52%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '1020px',
            height: 'clamp(380px, 58vh, 600px)',
          }}
        >
          {STEPS.map((item, index) => {
            const isActive = index === activeIndex;
            const hasLanded = index < activeIndex;
            const isPending = index > activeIndex;
            const cardsOnTop = activeIndex - index;

            const translateY = isActive ? (1 - activeCardProgress) * 100 : isPending ? 100 : 0;
            const scale = hasLanded ? Math.max(0.88, 1 - cardsOnTop * 0.034) : 1;
            const stackShift = hasLanded ? -cardsOnTop * 14 : 0;

            return (
              <div
                key={item.number}
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '28px',
                  overflow: 'hidden',
                  backgroundColor: '#111111',
                  zIndex: index + 1,
                  opacity: isPending ? 0 : 1,
                  transform: `translateY(calc(${translateY}% + ${stackShift}px)) scale(${scale})`,
                  transformOrigin: 'center bottom',
                  willChange: 'transform, opacity',
                  transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease',
                  boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.18)',
                }}
              >
                {/* Full Card Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />

                {/* Bottom Gradient & Text Overlay (Matching Screenshot) */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: 'clamp(2rem, 4vw, 3.5rem)',
                    boxSizing: 'border-box',
                  }}
                >
                  <h3
                    style={{
                      fontSize: 'clamp(2.2rem, 3.8vw, 3.6rem)',
                      fontWeight: 400,
                      color: '#ffffff',
                      letterSpacing: '-0.02em',
                      margin: 0,
                      marginBottom: '0.35rem',
                      fontFamily: 'Inter, -apple-system, sans-serif',
                    }}
                  >
                    {item.title}
                  </h3>

                  <p
                    style={{
                      fontSize: 'clamp(1.1rem, 1.6vw, 1.45rem)',
                      fontWeight: 400,
                      fontStyle: 'italic',
                      color: 'rgba(255, 255, 255, 0.9)',
                      margin: 0,
                      fontFamily: 'Inter, -apple-system, sans-serif',
                    }}
                  >
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

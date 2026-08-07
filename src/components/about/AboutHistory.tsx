'use client';

import React, { useEffect, useRef, useState } from 'react';

const milestones = [
  {
    year: '2023',
    title: 'The Inception',
    description: 'It started with one idea to build a company that would impact millions of lives, create thousands of jobs, and inspire a better future for generations.',
    image: '/assets/history/2023.png',
  },
  {
    year: '2024',
    title: 'Commence',
    description: 'On 12 January 2024, Zawr Industries was officially registered by Mr. Syed Ismail Zabiulla and Mr. Mohammed Ahmed, with its registered office in Bengaluru, India. What started as an idea soon became a mission to build more than just a company, but an organization committed to innovation, creating opportunities, and making a meaningful impact on millions of lives.',
    image: '/assets/history/2024.png',
  },
  {
    year: '2025',
    title: 'Building the Foundation',
    description: 'Built by a team passionate about innovation, Zawr Industries started its journey by developing cutting-edge technology solutions. The initial strategy was clear: establish a strong foundation in IT services, earn the trust of clients, and then expand into multiple business sectors.',
    image: '/assets/history/2025.png',
  },
  {
    year: '2026',
    title: 'Going Global',
    description: 'As Zawr Industries enters its third year, the vision has grown beyond borders. What began as an ambitious startup has evolved into a global organization, extending its footprint across the United States, Australia, Russia, Africa, and the United Arab Emirates.',
    image: '/assets/history/2026.png',
  },
];

type PinState = 'before' | 'pinned' | 'after';

export default function AboutHistory() {
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

  const sliceSize = 1 / milestones.length;
  const activeIndex = Math.min(milestones.length - 1, Math.floor(progress / sliceSize));
  const sliceStart = activeIndex * sliceSize;
  const activeCardProgress = progress >= 1 ? 1 : Math.min(1, (progress - sliceStart) / sliceSize);

  const innerStyle: React.CSSProperties =
    pinState === 'pinned'
      ? { position: 'fixed', top: 0, left: 0, right: 0, height: '100vh', zIndex: 100, backgroundColor: '#ffffff' }
      : pinState === 'after'
      ? { position: 'absolute', bottom: 0, left: 0, right: 0, height: '100vh', zIndex: 1, backgroundColor: '#ffffff' }
      : { position: 'absolute', top: 0, left: 0, right: 0, height: '100vh', zIndex: 1, backgroundColor: '#ffffff' };

  return (
    <section
      id="history"
      ref={spacerRef}
      style={{
        position: 'relative',
        height: String(milestones.length * 120 + 20) + 'vh',
        backgroundColor: '#ffffff',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <div style={innerStyle}>

        <div style={{ position: 'absolute', top: 'clamp(5rem, 8vh, 6.5rem)', left: 0, right: 0, textAlign: 'center', zIndex: 10 }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', fontWeight: 400, color: '#0f172a', letterSpacing: '-0.03em', margin: 0 }}>
            Our history
          </h2>
        </div>

        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', marginTop: '2vh', width: '92%', maxWidth: '1080px', height: 'clamp(360px, 50vh, 520px)' }}>
          {milestones.map((item, index) => {
            const isActive = index === activeIndex;
            const hasLanded = index < activeIndex;
            const isPending = index > activeIndex;
            const cardsOnTop = activeIndex - index;

            const translateY = isActive ? (1 - activeCardProgress) * 100 : isPending ? 100 : 0;
            const scale = hasLanded ? Math.max(0.88, 1 - cardsOnTop * 0.034) : 1;
            const stackShift = hasLanded ? -cardsOnTop * 13 : 0;

            return (
              <div
                key={item.year}
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: '#ffffff',
                  padding: 'clamp(1.5rem, 3.5vw, 3rem)',
                  display: 'grid',
                  gridTemplateColumns: '7fr 5fr',
                  gap: 'clamp(1rem, 3vw, 3rem)',
                  alignItems: 'center',
                  zIndex: index + 1,
                  opacity: isPending ? 0 : 1,
                  transform: 'translateY(calc(' + translateY + '% + ' + stackShift + 'px)) scale(' + scale + ')',
                  transformOrigin: 'center bottom',
                  willChange: 'transform, opacity',
                  transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease',
                }}
                className="history-card-item"
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', fontWeight: 400, color: '#94a3b8' }}>{item.year}</div>
                  <h3 style={{ fontSize: 'clamp(1.3rem, 2.8vw, 2.2rem)', fontWeight: 400, color: '#0f172a', letterSpacing: '-0.03em', margin: '0 0 0.5rem 0', lineHeight: 1.15 }}>{item.title}</h3>
                  <p style={{ fontSize: 'clamp(0.85rem, 1.35vw, 0.95rem)', color: '#475569', lineHeight: 1.65, margin: 0 }}>{item.description}</p>
                </div>
                <div className="history-img-wrapper" style={{ width: '100%', aspectRatio: '4 / 3', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: item.year === '2025' ? 'contain' : 'cover', padding: item.year === '2025' ? '1.5rem' : '0', display: 'block', filter: index < 2 ? 'grayscale(100%)' : 'none' }}
                  />
                </div>
              </div>
            );
          })}
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .history-card-item {
            grid-template-columns: 1fr !important;
            align-content: center !important;
            gap: 1rem !important;
          }
          .history-img-wrapper {
            max-height: 180px !important;
            aspect-ratio: 16 / 9 !important;
          }
        }
      `}</style>
    </section>
  );
}

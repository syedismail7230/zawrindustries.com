'use client';

import React, { useEffect, useRef, useState } from 'react';

interface HistoryMilestone {
  year: string;
  title: string;
  description: string;
  image: string;
}

const milestones: HistoryMilestone[] = [
  {
    year: '2023',
    title: 'The Inception',
    description:
      'It started with one idea to build a company that would impact millions of lives, create thousands of jobs, and inspire a better future for generations.',
    image: '/assets/history/2023.png',
  },
  {
    year: '2024',
    title: 'Commence',
    description:
      'On 12 January 2024, Zawr Industries was officially registered by Mr. Syed Ismail Zabiulla and Mr. Mohammed Ahmed, with its registered office in Bengaluru, India. What started as an idea soon became a mission a journey to build more than just a company, but an organization committed to innovation, creating opportunities, and making a meaningful impact on millions of lives.',
    image: '/assets/history/2024.png',
  },
  {
    year: '2025',
    title: 'Commence',
    description:
      "Built by a team passionate about innovation, Zawr Industries started its journey by developing cutting-edge technology solutions. The initial strategy was clear: establish a strong foundation in IT services, earn the trust of clients, and then expand into multiple business sectors. The launch of Firm AI became the company's first major milestone, representing its first step toward this vision. Alongside delivering technology solutions for clients, the team also developed its first proprietary software product, laying the groundwork for the future growth of Zawr Industries into a diversified enterprise.",
    image: '/assets/history/2025.png',
  },
  {
    year: '2026',
    title: 'Going global',
    description:
      'As Zawr Industries enters its third year, the vision has grown beyond borders. What began as an ambitious startup has evolved into a global organization, extending its footprint across the United States, Australia, Russia, Africa, and the United Arab Emirates. With an expanding international client portfolio and expertise spanning multiple industries, Zawr Industries continues its journey of innovation, delivering world-class solutions while steadily building a truly global enterprise.',
    image: '/assets/history/2026.png',
  },
];

export default function AboutHistory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgresses, setScrollProgresses] = useState<number[]>([0, 0, 0, 0]);

  useEffect(() => {
    let rafId: number;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const cardElements = containerRef.current.querySelectorAll<HTMLDivElement>('.history-animated-card');
      const windowHeight = window.innerHeight;

      const newProgresses: number[] = [];

      cardElements.forEach((card) => {
        const rect = card.getBoundingClientRect();
        // Calculate progress from 0 (below screen) to 1 (centered/stacked)
        const totalDistance = windowHeight * 0.8;
        const currentPos = windowHeight - rect.top;
        const progress = Math.max(0, Math.min(1, currentPos / totalDistance));
        newProgresses.push(progress);
      });

      rafId = requestAnimationFrame(() => {
        setScrollProgresses(newProgresses);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      id="history"
      ref={containerRef}
      style={{
        backgroundColor: '#ffffff',
        color: '#0f172a',
        padding: 'clamp(5rem, 8vw, 8rem) 1.5rem',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: 'relative',
      }}
    >
      {/* Section Title */}
      <div style={{ textAlign: 'center', marginBottom: 'clamp(4rem, 7vw, 6rem)' }}>
        <h2
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            fontWeight: 400,
            color: '#0f172a',
            letterSpacing: '-0.03em',
            margin: 0,
          }}
        >
          Our history
        </h2>
      </div>

      {/* Animated Stacking Cards Track */}
      <div
        style={{
          maxWidth: '1050px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '5rem',
        }}
      >
        {milestones.map((item, index) => {
          const progress = scrollProgresses[index] || 0;
          const isNextProgress = scrollProgresses[index + 1] || 0;

          // Scale down slightly as next card overlaps on top
          const stackScale = 1 - isNextProgress * 0.05;
          const stackOpacity = 1 - isNextProgress * 0.25;

          // Entrance animation: slides up and fades in smoothly as user scrolls down
          const translateY = (1 - progress) * 90; // 90px down to 0px
          const cardOpacity = Math.max(0.1, progress) * stackOpacity;

          const stickyTopOffset = 110 + index * 20;

          return (
            <div
              key={item.year}
              className="history-animated-card"
              style={{
                position: 'sticky',
                top: `${stickyTopOffset}px`,
                backgroundColor: '#ffffff',
                borderRadius: '28px',
                padding: 'clamp(2rem, 4vw, 3.5rem)',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.09), 0 2px 6px rgba(0,0,0,0.04)',
                border: '1px solid rgba(15, 23, 42, 0.08)',
                display: 'grid',
                gridTemplateColumns: 'repeat(12, 1fr)',
                gap: 'clamp(2rem, 4vw, 4rem)',
                alignItems: 'center',
                zIndex: index + 1,
                transform: `translate3d(0, ${translateY}px, 0) scale(${stackScale})`,
                opacity: cardOpacity,
                willChange: 'transform, opacity',
                transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {/* Left Column Text Details */}
              <div
                style={{
                  gridColumn: 'span 7',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem',
                }}
                className="card-text-col"
              >
                <h3
                  style={{
                    fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                    fontWeight: 400,
                    color: '#0f172a',
                    letterSpacing: '-0.03em',
                    margin: 0,
                    lineHeight: 1.15,
                  }}
                >
                  {item.title}
                </h3>

                <div
                  style={{
                    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                    fontWeight: 400,
                    color: '#94a3b8',
                    letterSpacing: '-0.02em',
                    marginBottom: '0.8rem',
                  }}
                >
                  {item.year}
                </div>

                <p
                  style={{
                    fontSize: 'clamp(0.95rem, 1.8vw, 1.08rem)',
                    color: '#334155',
                    lineHeight: 1.7,
                    margin: 0,
                    fontWeight: 400,
                  }}
                >
                  {item.description}
                </p>
              </div>

              {/* Right Column Image Container */}
              <div
                style={{
                  gridColumn: 'span 5',
                  width: '100%',
                }}
                className="card-img-col"
              >
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '4 / 3',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    backgroundColor: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                  }}
                >
                  <img
                    src={item.image}
                    alt={`${item.title} ${item.year}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: item.year === '2025' ? 'contain' : 'cover',
                      padding: item.year === '2025' ? '2rem' : '0',
                      backgroundColor: item.year === '2025' ? '#ffffff' : 'transparent',
                      display: 'block',
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .card-text-col, .card-img-col {
            grid-column: span 12 !important;
          }
          .history-animated-card {
            top: 85px !important;
            padding: 1.75rem !important;
          }
        }
      `}</style>
    </section>
  );
}

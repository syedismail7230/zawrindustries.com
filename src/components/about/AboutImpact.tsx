'use client';

import React, { useState, useEffect, useRef } from 'react';

const impactStats = [
  { value: '500+', label: 'Enterprise Clients Worldwide' },
  { value: '12+', label: 'Proprietary Tech & Industry Platforms' },
  { value: '99.9%', label: 'Platform Reliability & Uptime SLA' },
  { value: '7', label: 'Global Delivery & Innovation Hubs' },
];

function CountUpNumber({ targetValue }: { targetValue: string }) {
  const [displayValue, setDisplayValue] = useState('0');
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const numMatch = targetValue.match(/[\d.]+/);
    if (!numMatch) {
      setDisplayValue(targetValue);
      return;
    }

    const targetNum = parseFloat(numMatch[0]);
    const isDecimal = targetValue.includes('.');
    const suffix = targetValue.replace(/[\d.]+/, '');

    let animationFrameId: number;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const startTime = performance.now();
          const duration = 1800; // 1.8 seconds smooth animation

          const updateCount = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            // Ease-out cubic curve
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = easeProgress * targetNum;

            if (isDecimal) {
              setDisplayValue(`${currentVal.toFixed(1)}${suffix}`);
            } else {
              setDisplayValue(`${Math.floor(currentVal)}${suffix}`);
            }

            if (progress < 1) {
              animationFrameId = requestAnimationFrame(updateCount);
            } else {
              setDisplayValue(targetValue);
            }
          };

          animationFrameId = requestAnimationFrame(updateCount);
        } else {
          // Reset count when user scrolls away so animation re-triggers on return
          setDisplayValue(isDecimal ? `0.0${suffix}` : `0${suffix}`);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [targetValue]);

  return <span ref={nodeRef}>{displayValue}</span>;
}

export default function AboutImpact() {
  return (
    <section
      id="impact"
      style={{
        backgroundColor: '#ffffff',
        color: '#0f172a',
        padding: 'clamp(5rem, 8vw, 8rem) 1.5rem',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: 'relative',
        scrollMarginTop: '80px',
        borderTop: '1px solid #f1f5f9',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <div style={{ maxWidth: '750px', marginBottom: 'clamp(3rem, 5vw, 4.5rem)' }}>
          <h2
            style={{
              fontSize: 'clamp(1.8rem, 3.8vw, 3rem)',
              fontWeight: 300,
              color: '#0f172a',
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            Our Global Economic & Technology Impact
          </h2>
        </div>

        {/* World Map Vector */}
        <div style={{ maxWidth: '900px', margin: '0 auto clamp(3.5rem, 6vw, 5rem) auto' }}>
          <img
            src="/assets/world-map.svg"
            alt="Zawr Global Footprint"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '420px',
              display: 'block',
              margin: '0 auto',
              opacity: 0.9,
              filter: 'brightness(0)',
            }}
          />
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '2rem',
            textAlign: 'center',
            paddingTop: '2.5rem',
            borderTop: '1px solid #e2e8f0',
          }}
          className="impact-stats-grid"
        >
          {impactStats.map((stat, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div
                style={{
                  fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                  fontWeight: 300,
                  color: '#0f172a',
                  letterSpacing: '-0.03em',
                }}
              >
                <CountUpNumber targetValue={stat.value} />
              </div>
              <div
                style={{
                  fontSize: '0.88rem',
                  color: '#64748b',
                  fontWeight: 400,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .impact-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 2rem 1rem !important;
          }
        }
      `}</style>
    </section>
  );
}



'use client';

import React, { useRef, useState, useEffect } from 'react';

export function AgvScrollSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how far section has scrolled through viewport (0 to 1)
      const totalDistance = windowHeight + rect.height;
      const currentPos = windowHeight - rect.top;
      const progress = Math.min(1, Math.max(0, currentPos / totalDistance));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Map scrollProgress (0 to 1) to horizontal position percentage (-20% to 110%)
  const agvLeftPercent = -25 + scrollProgress * 140;

  return (
    <section
      ref={sectionRef}
      style={{
        width: '100%',
        backgroundColor: '#ffffff',
        padding: '5rem 0 6rem 0',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Top Description Text matching reference screenshot */}
      <div style={{
        maxWidth: '750px',
        textAlign: 'center',
        padding: '0 1.5rem',
        marginBottom: '4rem',
      }}>
        <p style={{
          fontSize: 'clamp(1.1rem, 2vw, 1.45rem)',
          fontWeight: 400,
          color: '#111111',
          lineHeight: 1.5,
          margin: 0,
          letterSpacing: '-0.01em',
        }}>
          Robotics orchestration and automated guided vehicles (AGV) coordinating high-density fulfillment hubs.
        </p>
      </div>

      {/* Track & AGV Animation Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '240px',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}>
        {/* Bold Backing Banner Text matching reference screenshot */}
        <div style={{
          position: 'absolute',
          width: '100%',
          textAlign: 'center',
          fontSize: 'clamp(1.2rem, 2.8vw, 2.3rem)',
          fontWeight: 800,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: '#000000',
          whiteSpace: 'nowrap',
          userSelect: 'none',
          zIndex: 1,
          padding: '0 1rem',
          boxSizing: 'border-box',
        }}>
          AUTOMATED AGV &amp; WAREHOUSE ROUTING WITH &lt;12MS LATENCY
        </div>

        {/* AGV Vehicle gliding from Left to Right */}
        <div
          style={{
            position: 'absolute',
            left: `${agvLeftPercent}%`,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 'clamp(260px, 32vw, 460px)',
            zIndex: 10,
            willChange: 'left',
            pointerEvents: 'none',
          }}
        >
          <img
            src="https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto:good,w_1200,c_limit,dpr_auto/v1785803597/zawr/assets/AGV.png"
            alt="ZAWR Automated Guided Vehicle AGV Robot"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              filter: 'drop-shadow(0 15px 25px rgba(0, 0, 0, 0.25))',
            }}
          />
        </div>
      </div>
    </section>
  );
}

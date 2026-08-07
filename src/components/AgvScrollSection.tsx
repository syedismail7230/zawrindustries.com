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

  // Map scrollProgress (0 to 1) to horizontal position percentage (-25% to 115%)
  const agvLeftPercent = -25 + scrollProgress * 140;
  // Calculate text reveal percentage (0% to 100%)
  const revealPercent = Math.min(100, Math.max(0, (scrollProgress - 0.1) * 125));

  return (
    <section
      ref={sectionRef}
      style={{
        width: '100%',
        backgroundColor: '#ffffff',
        padding: 'clamp(2.5rem, 6vw, 5rem) 0',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .agv-track-container {
          position: relative;
          width: 100%;
          height: clamp(160px, 24vh, 240px);
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .agv-banner-text {
          position: absolute;
          width: 100%;
          text-align: center;
          font-size: clamp(0.85rem, 3.2vw, 2.3rem);
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          white-space: nowrap;
          user-select: none;
          padding: 0 0.5rem;
          box-sizing: border-box;
        }

        .agv-vehicle-img {
          width: clamp(180px, 30vw, 460px);
        }

        @media (max-width: 600px) {
          .agv-banner-text {
            font-size: clamp(0.75rem, 3vw, 1.1rem);
            letter-spacing: 0.02em;
          }
          .agv-vehicle-img {
            width: clamp(160px, 45vw, 280px);
          }
        }
      ` }} />

      {/* Top Description Text matching reference screenshot */}
      <div style={{
        maxWidth: '750px',
        textAlign: 'center',
        padding: '0 1.5rem',
        marginBottom: 'clamp(2rem, 5vw, 4.5rem)',
      }}>
        <p style={{
          fontSize: 'clamp(1rem, 1.8vw, 1.45rem)',
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
      <div className="agv-track-container">
        {/* Faint Background Placeholder Track Text */}
        <div
          className="agv-banner-text"
          style={{
            color: 'rgba(0, 0, 0, 0.06)',
            zIndex: 1,
          }}
        >
          AUTOMATED AGV &amp; WAREHOUSE ROUTING WITH &lt;12MS LATENCY
        </div>

        {/* Revealed High-Contrast Text (Unmasked as AGV moves) */}
        <div
          className="agv-banner-text"
          style={{
            color: '#000000',
            zIndex: 2,
            clipPath: `polygon(0 0, ${revealPercent}% 0, ${revealPercent}% 100%, 0 100%)`,
            WebkitClipPath: `polygon(0 0, ${revealPercent}% 0, ${revealPercent}% 100%, 0 100%)`,
            transition: 'clip-path 0.05s ease-out, -webkit-clip-path 0.05s ease-out',
          }}
        >
          AUTOMATED AGV &amp; WAREHOUSE ROUTING WITH &lt;12MS LATENCY
        </div>

        {/* AGV Vehicle gliding from Left to Right */}
        <div
          style={{
            position: 'absolute',
            left: `${agvLeftPercent}%`,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            willChange: 'left',
            pointerEvents: 'none',
          }}
        >
          <img
            src="https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_1200,c_limit,dpr_auto/v1785803597/zawr/assets/AGV.png"
            alt="ZAWR Automated Guided Vehicle AGV Robot"
            className="agv-vehicle-img"
            style={{
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

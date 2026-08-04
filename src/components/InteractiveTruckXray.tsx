'use client';

import React, { useState, useRef } from 'react';

export function InteractiveTruckXray() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  };

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsHovered(true);
    handlePointerMove(e);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    setMousePos(null);
  };

  // Spot size calculated relative to container height/width
  const spotlightRadius = 65;

  return (
    <section style={{
      width: '100%',
      backgroundColor: '#ffffff',
      padding: '4rem clamp(1rem, 5vw, 6%) 5rem clamp(1rem, 5vw, 6%)',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: 'Inter, sans-serif',
      overflow: 'hidden',
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .truck-xray-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 1rem;
          border-radius: 9999px;
          background: rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(0, 0, 0, 0.1);
          color: #111111;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 1.25rem;
        }

        .truck-pulse-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: #22c55e;
          box-shadow: 0 0 8px #22c55e;
          animation: truck-pulse 2s infinite ease-in-out;
        }

        @keyframes truck-pulse {
          0%, 100% { opacity: 0.5; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.3); }
        }

        .truck-frame-container {
          position: relative;
          width: 100%;
          max-width: 1100px;
          aspect-ratio: 1536 / 1024;
          margin: 0 auto;
          cursor: crosshair;
          user-select: none;
          touch-action: none;
        }

        .truck-hint-pill {
          position: absolute;
          bottom: 1.5rem;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.85);
          color: #ffffff;
          padding: 0.6rem 1.4rem;
          border-radius: 9999px;
          font-size: 0.85rem;
          font-weight: 400;
          letter-spacing: 0.02em;
          pointer-events: none;
          z-index: 30;
          box-shadow: 0 10px 25px rgba(0,0,0,0.25);
          backdrop-filter: blur(8px);
          transition: opacity 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .truck-xray-lens {
          position: absolute;
          pointer-events: none;
          z-index: 25;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          border: 1.5px stroke rgba(0, 0, 0, 0.8);
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.9), 0 10px 30px rgba(0, 0, 0, 0.3);
        }
      ` }} />

      <div className="truck-xray-badge">
        <span className="truck-pulse-dot" />
        <span>Live Volumetric Telemetry</span>
      </div>

      <div style={{ textAlign: 'center', maxWidth: '800px', marginBottom: '2.5rem' }}>
        <h2 style={{
          fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
          fontWeight: 300,
          color: '#000000',
          letterSpacing: '-0.02em',
          margin: 0,
        }}>
          Interactive Cargo Inspection
        </h2>
        <p style={{
          fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)',
          color: 'rgba(0, 0, 0, 0.65)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
          fontWeight: 300,
        }}>
          Hover or drag over the container payload to reveal real-time internal cargo stowage and volumetric space allocation.
        </p>
      </div>

      {/* Interactive Stacked Truck Images */}
      <div
        ref={containerRef}
        className="truck-frame-container"
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        {/* Layer 1: Closed Container Truck (truck-container.png) */}
        <img
          src="https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto:good,w_1600,c_limit,dpr_auto/v1785802031/zawr/assets/truck-container.png"
          alt="ZAWR Logistics Closed Container Truck"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            pointerEvents: 'none',
          }}
        />

        {/* Layer 2: Inner Cargo Truck (truck-container-naked.png) clipped with dynamic cursor circle */}
        <img
          src="https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto:good,w_1600,c_limit,dpr_auto/v1785802032/zawr/assets/truck-container-naked.png"
          alt="ZAWR Logistics Inner Cargo Stowage"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            pointerEvents: 'none',
            clipPath: isHovered && mousePos 
              ? `circle(${spotlightRadius}px at ${mousePos.x}px ${mousePos.y}px)` 
              : 'circle(0px at 50% 50%)',
            WebkitClipPath: isHovered && mousePos 
              ? `circle(${spotlightRadius}px at ${mousePos.x}px ${mousePos.y}px)` 
              : 'circle(0px at 50% 50%)',
            transition: isHovered ? 'none' : 'clip-path 0.3s ease-out, -webkit-clip-path 0.3s ease-out',
          }}
        />

        {/* Spot Ring outline following cursor */}
        {isHovered && mousePos && (
          <div
            className="truck-xray-lens"
            style={{
              left: `${mousePos.x}px`,
              top: `${mousePos.y}px`,
              width: `${spotlightRadius * 2}px`,
              height: `${spotlightRadius * 2}px`,
            }}
          />
        )}

        {/* Guidance hint pill when not hovering */}
        {!isHovered && (
          <div className="truck-hint-pill">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span>Hover to inspect cargo payload 🔍</span>
          </div>
        )}
      </div>
    </section>
  );
}

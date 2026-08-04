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

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || !e.touches[0]) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;
    setMousePos({ x, y });
    setIsHovered(true);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    handleTouchMove(e);
  };

  const handleTouchEnd = () => {
    setIsHovered(false);
    setMousePos(null);
  };

  // Spot size radius
  const spotlightRadius = 65;

  return (
    <section style={{
      width: '100%',
      backgroundColor: '#ffffff',
      padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1rem, 5vw, 6%)',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: 'Inter, sans-serif',
      overflow: 'hidden',
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
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

        .truck-xray-lens {
          position: absolute;
          pointer-events: none;
          z-index: 25;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          border: 1.5px stroke rgba(0, 0, 0, 0.8);
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.9), 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        @media (max-width: 600px) {
          .truck-frame-container {
            border-radius: 12px;
          }
        }
      ` }} />

      {/* Section Title & 5-6 Line Tech Summary */}
      <div style={{ textAlign: 'center', maxWidth: '840px', marginBottom: 'clamp(1.8rem, 4vw, 3rem)' }}>
        <h2 style={{
          fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
          fontWeight: 300,
          color: '#000000',
          letterSpacing: '-0.02em',
          margin: '0 0 1.25rem 0',
        }}>
          Interactive Cargo Inspection
        </h2>
        <p style={{
          fontSize: 'clamp(0.9rem, 1.15vw, 1.08rem)',
          lineHeight: 1.8,
          color: 'rgba(0, 0, 0, 0.7)',
          fontWeight: 300,
          margin: 0,
        }}>
          Zawr Industries integrates next-generation non-intrusive cargo inspection technology to provide real-time volumetric telemetry, tamper verification, and automated payload auditing across global trade corridors. Utilizing advanced optical sensors, IoT environmental monitoring, and spatial AI algorithms, our platform continuously scans internal container conditions without disrupting transit timelines. Logistics managers gain instant visibility into cargo density, weight distribution, and environmental integrity from dispatch to final delivery. This automated intelligence eliminates manual customs bottlenecks, safeguards high-value freight against unauthorized tampering, and accelerates cross-border compliance with unprecedented accuracy.
        </p>
      </div>

      {/* Interactive Stacked Truck Images */}
      <div
        ref={containerRef}
        className="truck-frame-container"
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
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
      </div>
    </section>
  );
}

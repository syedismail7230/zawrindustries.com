'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';

interface Hotspot {
  id: string;
  label: string;
  value: string;
  x: number; // percentage from left
  y: number; // percentage from top
  description: string;
}

const robotHotspots: Hotspot[] = [
  {
    id: 'base',
    label: 'J1 ROTARY BASE',
    value: '360° Continuous Orbit',
    x: 28,
    y: 82,
    description: 'High-torque direct drive motor with ±0.005mm repeatability.',
  },
  {
    id: 'shoulder',
    label: 'J2 SHOULDER PIVOT',
    value: '135° Pitch Control',
    x: 32,
    y: 52,
    description: 'Reinforced dual-bearing housing for heavy payload transport.',
  },
  {
    id: 'arm-branding',
    label: 'ZAWR INDUSTRIAL LINK',
    value: 'Make in India Certified',
    x: 22,
    y: 35,
    description: 'Aircraft-grade aluminum composite chassis with thermal dissipation.',
  },
  {
    id: 'elbow',
    label: 'J3 ELBOW JOINT',
    value: '210° Articulation',
    x: 52,
    y: 22,
    description: 'Zero-backlash harmonic drive for high-speed pick-and-place.',
  },
  {
    id: 'gripper',
    label: 'MULTI-SEGMENT GRIPPER',
    value: 'Adaptive Optical Claw',
    x: 78,
    y: 42,
    description: 'Precision force feedback sensor with integrated laser scanner.',
  },
];

export default function IndustrialRobot3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState<string>('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(robotHotspots[4]); // default to gripper

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 12;
    const rotateX = -((y - centerY) / centerY) * 12;

    setTransformStyle(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleMouseLeave = () => {
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  // Touch gesture support for mobile tilt
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.touches.length !== 1) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 10;
    const rotateX = -((y - centerY) / centerY) * 10;

    setTransformStyle(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      
      {/* 3D Interactive Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseLeave}
        style={{
          width: '100%',
          height: '100%',
          minHeight: '480px',
          position: 'relative',
          borderRadius: '24px',
          background: '#000000',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
          transform: transformStyle,
          transition: 'transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)',
          transformStyle: 'preserve-3d',
          cursor: 'pointer',
        }}
      >
        {/* Robot Image */}
        <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Image
            src="/robot-arm.png"
            alt="ZAWR Industrial Robot Arm"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            style={{
              objectFit: 'contain',
              objectPosition: 'center',
              padding: '2rem',
              filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.8))',
            }}
            priority
          />
        </div>

        {/* Interactive Telemetry Hotspots */}
        {robotHotspots.map((spot) => (
          <div
            key={spot.id}
            onClick={() => setActiveHotspot(spot)}
            onMouseEnter={() => setActiveHotspot(spot)}
            style={{
              position: 'absolute',
              top: `${spot.y}%`,
              left: `${spot.x}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 20,
              cursor: 'pointer',
            }}
          >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: activeHotspot?.id === spot.id ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
                  border: activeHotspot?.id === spot.id ? '2px solid #000000' : '1px solid rgba(255, 255, 255, 0.8)',
                  boxShadow: activeHotspot?.id === spot.id ? '0 0 15px rgba(255, 255, 255, 0.9)' : 'none',
                  transition: 'all 0.3s ease',
                  display: 'block',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                  animation: activeHotspot?.id === spot.id ? 'ping 1.8s infinite' : 'none',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>
        ))}

        {/* Active Hotspot Telemetry Card (Floating HUD) */}
        {activeHotspot && (
          <div
            style={{
              position: 'absolute',
              bottom: '1.2rem',
              left: '1.2rem',
              right: '1.2rem',
              padding: '1rem 1.2rem',
              background: 'rgba(15, 15, 15, 0.88)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '16px',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.3rem',
              pointerEvents: 'none',
              zIndex: 30,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(255, 255, 255, 0.6)' }}>
                {activeHotspot.label}
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ffffff', background: 'rgba(255, 255, 255, 0.15)', padding: '0.2rem 0.6rem', borderRadius: '20px' }}>
                {activeHotspot.value}
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.85)', margin: 0, lineHeight: 1.4 }}>
              {activeHotspot.description}
            </p>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes ping {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}} />
    </div>
  );
}

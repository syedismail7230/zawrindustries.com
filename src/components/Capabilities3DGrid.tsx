'use client';

import React, { useState, useRef } from 'react';

interface Capability {
  title: string;
  description: string;
  metric: string;
  metricLabel: string;
}

interface CapabilityCardProps {
  cap: Capability;
}

function Capability3DTiltCard({ cap }: CapabilityCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState<string>('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  const [glowStyle, setGlowStyle] = useState<{ x: number; y: number; opacity: number }>({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Rotate max 12 degrees
    const rotateY = ((x - centerX) / centerX) * 10;
    const rotateX = -((y - centerY) / centerY) * 10;

    const glowX = (x / rect.width) * 100;
    const glowY = (y / rect.height) * 100;

    setTransformStyle(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.03, 1.03, 1.03)`);
    setGlowStyle({ x: glowX, y: glowY, opacity: 1 });
  };

  const handleMouseLeave = () => {
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlowStyle({ x: 50, y: 50, opacity: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transition: 'transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s ease',
        transformStyle: 'preserve-3d',
        background: '#f8f9fa',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        borderRadius: '20px',
        padding: '2.2rem 1.6rem',
        position: 'relative',
        cursor: 'pointer',
        boxShadow: glowStyle.opacity > 0 ? '0 20px 40px rgba(0, 0, 0, 0.1)' : '0 4px 12px rgba(0, 0, 0, 0.03)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* 3D Glow reflection overlay following mouse */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          borderRadius: '20px',
          background: `radial-gradient(circle at ${glowStyle.x}% ${glowStyle.y}%, rgba(0, 0, 0, 0.05), transparent 70%)`,
          opacity: glowStyle.opacity,
          transition: 'opacity 0.2s ease',
        }}
      />

      <div style={{ transform: 'translateZ(20px)', transition: 'transform 0.2s ease' }}>
        <div style={{
          fontSize: 'clamp(1.8rem, 2.5vw, 2.3rem)',
          fontWeight: 400,
          color: '#000000',
          letterSpacing: '-0.03em',
          marginBottom: '0.2rem'
        }}>
          {cap.metric}
        </div>
        <div style={{
          fontSize: '0.68rem',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: 'rgba(0, 0, 0, 0.45)',
          marginBottom: '1.8rem'
        }}>
          {cap.metricLabel}
        </div>
        <h3 style={{
          fontSize: '1.15rem',
          fontWeight: 500,
          color: '#000000',
          marginBottom: '0.75rem',
          letterSpacing: '-0.01em',
          lineHeight: 1.3,
        }}>
          {cap.title}
        </h3>
        <p style={{
          fontSize: '0.88rem',
          lineHeight: 1.65,
          color: 'rgba(0, 0, 0, 0.65)',
          fontWeight: 300,
          margin: 0
        }}>
          {cap.description}
        </p>
      </div>
    </div>
  );
}

export function Capabilities3DGrid({ capabilities }: { capabilities: Capability[] }) {
  return (
    <div style={{ width: '100%', marginBottom: '5rem' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .capabilities-4-col-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          width: 100%;
        }

        @media (max-width: 1080px) {
          .capabilities-4-col-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
          }
        }

        @media (max-width: 600px) {
          .capabilities-4-col-grid {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }
        }
      ` }} />

      <div className="capabilities-4-col-grid">
        {capabilities.map((cap, idx) => (
          <Capability3DTiltCard key={idx} cap={cap} />
        ))}
      </div>
    </div>
  );
}

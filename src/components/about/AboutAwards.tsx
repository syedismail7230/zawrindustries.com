'use client';

import React, { useState, useRef } from 'react';

const awardsList = [
  { title: 'Startup India' },
  { title: 'Startup Karnataka' },
  { title: 'Best Technology Company' },
  { title: 'Best Talent Employees' },
];

function Award3DItem({ title }: { title: string }) {
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  const [isHovered, setIsHovered] = useState(false);
  const iconRef = useRef<HTMLDivElement>(null);
  const gradId = title.replace(/\s+/g, '');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const icon = iconRef.current;
    if (!icon) return;
    const rect = icon.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotateX = (-y / (rect.height / 2)) * 20;
    const rotateY = (x / (rect.width / 2)) * 20;
    setTransform(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.12, 1.12, 1.12) translateY(-6px)`);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  return (
    <div
      style={{
        gridColumn: 'span 3',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '1.25rem',
      }}
      className="award-item"
    >
      {/* 3D Interactive Badge Icon ONLY */}
      <div
        ref={iconRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          width: '100px',
          height: '128px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transform,
          transformStyle: 'preserve-3d',
          transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
          willChange: 'transform',
        }}
      >
        <svg width="84" height="112" viewBox="0 0 48 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={`blackSteel_${gradId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="35%" stopColor="#334155" />
              <stop offset="70%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
          </defs>
          {/* Outer Black Steel badge (No outer outline) */}
          <polygon points="4,4 44,4 44,46 24,60 4,46" fill={`url(#blackSteel_${gradId})`} />
          {/* Inside line */}
          <polygon points="9,9 39,9 39,43 24,54 9,43" stroke="#ffffff" strokeWidth="2.5" fill="none" />
        </svg>
      </div>




      {/* Static Text - Unaffected by hover/tilt */}
      <h3
        style={{
          fontSize: '1.25rem',
          fontWeight: 500,
          color: '#0f172a',
          margin: 0,
          lineHeight: 1.35,
        }}
      >
        {title}
      </h3>
    </div>
  );
}

export default function AboutAwards() {
  return (
    <section
      id="awards"
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
            Awards & Recognitions
          </h2>
        </div>

        {/* 4 Awards Grid - 3D Hover Interactive */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: 'clamp(2rem, 4vw, 3.5rem)',
          }}
        >
          {awardsList.map((award, index) => (
            <Award3DItem key={index} title={award.title} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .award-item {
            grid-column: span 6 !important;
          }
        }
        @media (max-width: 600px) {
          .award-item {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </section>
  );
}



"use client";

import React from 'react';

// High-fidelity Client Component that interpolates mouse movements with inertia (elastic liquid easing)
function ServicePill({ children }: { children: React.ReactNode }) {
  const pillRef = React.useRef<HTMLDivElement>(null);
  
  // Target mouse coordinates relative to the pill bounding box
  const targetX = React.useRef(0);
  const targetY = React.useRef(0);
  
  // Current interpolated coordinates
  const currentX = React.useRef(0);
  const currentY = React.useRef(0);
  
  const isHovered = React.useRef(false);
  const animationFrameId = React.useRef<number | null>(null);

  const tick = () => {
    if (!pillRef.current) return;
    
    // Liquid easing math: 0.08 provides a highly viscous, smooth fluid inertia lag
    const easingFactor = 0.08; 
    
    currentX.current += (targetX.current - currentX.current) * easingFactor;
    currentY.current += (targetY.current - currentY.current) * easingFactor;
    
    pillRef.current.style.setProperty('--mouse-x', `${currentX.current}px`);
    pillRef.current.style.setProperty('--mouse-y', `${currentY.current}px`);
    
    const dx = targetX.current - currentX.current;
    const dy = targetY.current - currentY.current;
    
    // If user is hovering, or the liquid glow is still easing/catching up, keep animating
    if (isHovered.current || Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
      animationFrameId.current = requestAnimationFrame(tick);
    } else {
      animationFrameId.current = null;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    targetX.current = e.clientX - rect.left;
    targetY.current = e.clientY - rect.top;
    
    if (animationFrameId.current === null) {
      animationFrameId.current = requestAnimationFrame(tick);
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    isHovered.current = true;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Snap initial target coordinate to eliminate origin-jump animations
    targetX.current = x;
    targetY.current = y;
    
    // Snap current coordinates on first entry
    if (currentX.current === 0 && currentY.current === 0) {
      currentX.current = x;
      currentY.current = y;
    }
    
    if (animationFrameId.current === null) {
      animationFrameId.current = requestAnimationFrame(tick);
    }
  };

  const handleMouseLeave = () => {
    isHovered.current = false;
    // Loop will automatically stop once dx/dy decay below the threshold
  };

  React.useEffect(() => {
    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <div
      ref={pillRef}
      className="service-pill"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}

export default function ServicesMarquee() {
  return (
    <div style={{
      backgroundColor: '#000000',
      padding: '6.5rem 0 4.5rem 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      width: '100%',
    }}>
      {/* Style injection for horizontal marquee animations and cursor effects */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scrollRowLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-25%); }
        }
        @keyframes scrollRowRight {
          0% { transform: translateX(-25%); }
          100% { transform: translateX(0); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
        }
        .scroll-row-left {
          animation: scrollRowLeft var(--duration, 25s) linear infinite;
        }
        .scroll-row-right {
          animation: scrollRowRight var(--duration, 25s) linear infinite;
        }
        .marquee-group {
          display: flex;
          flex-shrink: 0;
          align-items: center;
          justify-content: space-around;
          gap: 1.5rem;
          padding-right: 1.5rem;
        }
        .service-pill {
          position: relative;
          flex-shrink: 0;
          padding: 0.9rem 1.8rem;
          background: linear-gradient(#000000, #000000) padding-box,
                      linear-gradient(135deg, #3b82f6, #ec4899) border-box;
          border: 2px solid transparent;
          border-radius: 100px;
          font-size: 0.95rem;
          font-weight: 500;
          color: #ffffff;
          text-align: center;
          white-space: nowrap;
          display: inline-block;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), filter 0.3s ease;
          cursor: pointer;
          z-index: 2;
        }
        
        /* Viscous liquid-like glowing spotlight halo behind the pill */
        .service-pill::after {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 100px;
          background: radial-gradient(
            130px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
            rgba(236, 72, 153, 0.75) 0%,
            rgba(59, 130, 246, 0.75) 50%,
            transparent 100%
          );
          filter: blur(16px);
          opacity: 0;
          transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: -1;
          pointer-events: none;
        }
        
        .service-pill:hover {
          transform: scale(1.06);
          filter: brightness(1.3);
        }
        
        .service-pill:hover::after {
          opacity: 1;
        }
      `}} />

      <div style={{ maxWidth: '1200px', width: '100%', padding: '0 8%', textAlign: 'center', marginBottom: '4rem', zIndex: 10 }}>
        <span style={{
          fontSize: '0.8rem',
          fontWeight: 600,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: '#a855f7',
        }}>
          Portfolio
        </span>
        <h2 style={{
          fontSize: 'clamp(2rem, 4vw, 3.2rem)',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          marginTop: '1rem',
          color: '#ffffff',
        }}>
          Our Services
        </h2>
      </div>

      {/* Edge-to-edge Horizontal Marquee Container */}
      <div style={{
        position: 'relative',
        width: '100vw',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.75rem',
        zIndex: 8,
        padding: '1.5rem 0',
      }}>
        {/* Left and Right Fade Vignettes to blend scrolling edges perfectly */}
        <div style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: 'clamp(40px, 12vw, 150px)',
          background: 'linear-gradient(to right, #000000 0%, transparent 100%)',
          zIndex: 15,
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          width: 'clamp(40px, 12vw, 150px)',
          background: 'linear-gradient(to left, #000000 0%, transparent 100%)',
          zIndex: 15,
          pointerEvents: 'none',
        }} />

        {/* Row 1: Left */}
        <div style={{ overflow: 'hidden', width: '100%', padding: '1.25rem 0', margin: '-1.25rem 0' }}>
          <div className="marquee-track scroll-row-left" style={{ '--duration': '22s' } as React.CSSProperties}>
            <div className="marquee-group">
              {[
                "AI & Data Analytics",
                "Cloud",
                "Cognitive Business Operations",
                "Cybersecurity",
                "Network Solutions",
                "Industrial Autonomy and Engineering"
              ].map((item, idx) => (
                <ServicePill key={idx}>{item}</ServicePill>
              ))}
            </div>
            <div className="marquee-group" aria-hidden="true">
              {[
                "AI & Data Analytics",
                "Cloud",
                "Cognitive Business Operations",
                "Cybersecurity",
                "Network Solutions",
                "Industrial Autonomy and Engineering"
              ].map((item, idx) => (
                <ServicePill key={`dup1-1-${idx}`}>{item}</ServicePill>
              ))}
            </div>
            <div className="marquee-group" aria-hidden="true">
              {[
                "AI & Data Analytics",
                "Cloud",
                "Cognitive Business Operations",
                "Cybersecurity",
                "Network Solutions",
                "Industrial Autonomy and Engineering"
              ].map((item, idx) => (
                <ServicePill key={`dup1-2-${idx}`}>{item}</ServicePill>
              ))}
            </div>
            <div className="marquee-group" aria-hidden="true">
              {[
                "AI & Data Analytics",
                "Cloud",
                "Cognitive Business Operations",
                "Cybersecurity",
                "Network Solutions",
                "Industrial Autonomy and Engineering"
              ].map((item, idx) => (
                <ServicePill key={`dup1-3-${idx}`}>{item}</ServicePill>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Right */}
        <div style={{ overflow: 'hidden', width: '100%', padding: '1.25rem 0', margin: '-1.25rem 0' }}>
          <div className="marquee-track scroll-row-right" style={{ '--duration': '25s' } as React.CSSProperties}>
            <div className="marquee-group">
              {[
                "Enterprise Solutions",
                "Consulting",
                "Software Development",
                "Web Development",
                "Application Development",
                "Startup MVP"
              ].map((item, idx) => (
                <ServicePill key={idx}>{item}</ServicePill>
              ))}
            </div>
            <div className="marquee-group" aria-hidden="true">
              {[
                "Enterprise Solutions",
                "Consulting",
                "Software Development",
                "Web Development",
                "Application Development",
                "Startup MVP"
              ].map((item, idx) => (
                <ServicePill key={`dup2-1-${idx}`}>{item}</ServicePill>
              ))}
            </div>
            <div className="marquee-group" aria-hidden="true">
              {[
                "Enterprise Solutions",
                "Consulting",
                "Software Development",
                "Web Development",
                "Application Development",
                "Startup MVP"
              ].map((item, idx) => (
                <ServicePill key={`dup2-2-${idx}`}>{item}</ServicePill>
              ))}
            </div>
            <div className="marquee-group" aria-hidden="true">
              {[
                "Enterprise Solutions",
                "Consulting",
                "Software Development",
                "Web Development",
                "Application Development",
                "Startup MVP"
              ].map((item, idx) => (
                <ServicePill key={`dup2-3-${idx}`}>{item}</ServicePill>
              ))}
            </div>
          </div>
        </div>

        {/* Row 3: Left */}
        <div style={{ overflow: 'hidden', width: '100%', padding: '1.25rem 0', margin: '-1.25rem 0' }}>
          <div className="marquee-track scroll-row-left" style={{ '--duration': '20s' } as React.CSSProperties}>
            <div className="marquee-group">
              {[
                "CRM Solution",
                "CXM Solution",
                "Digital Marketing",
                "Blockchain",
                "IoT",
                "DevOps"
              ].map((item, idx) => (
                <ServicePill key={idx}>{item}</ServicePill>
              ))}
            </div>
            <div className="marquee-group" aria-hidden="true">
              {[
                "CRM Solution",
                "CXM Solution",
                "Digital Marketing",
                "Blockchain",
                "IoT",
                "DevOps"
              ].map((item, idx) => (
                <ServicePill key={`dup3-1-${idx}`}>{item}</ServicePill>
              ))}
            </div>
            <div className="marquee-group" aria-hidden="true">
              {[
                "CRM Solution",
                "CXM Solution",
                "Digital Marketing",
                "Blockchain",
                "IoT",
                "DevOps"
              ].map((item, idx) => (
                <ServicePill key={`dup3-2-${idx}`}>{item}</ServicePill>
              ))}
            </div>
            <div className="marquee-group" aria-hidden="true">
              {[
                "CRM Solution",
                "CXM Solution",
                "Digital Marketing",
                "Blockchain",
                "IoT",
                "DevOps"
              ].map((item, idx) => (
                <ServicePill key={`dup3-3-${idx}`}>{item}</ServicePill>
              ))}
            </div>
          </div>
        </div>

        {/* Row 4: Right */}
        <div style={{ overflow: 'hidden', width: '100%', padding: '1.25rem 0', margin: '-1.25rem 0' }}>
          <div className="marquee-track scroll-row-right" style={{ '--duration': '28s' } as React.CSSProperties}>
            <div className="marquee-group">
              {[
                "Unit test",
                "Quality Assurance",
                "Workplace Transformation",
                "Process Automation",
                "Business Process Management"
              ].map((item, idx) => (
                <ServicePill key={idx}>{item}</ServicePill>
              ))}
            </div>
            <div className="marquee-group" aria-hidden="true">
              {[
                "Unit test",
                "Quality Assurance",
                "Workplace Transformation",
                "Process Automation",
                "Business Process Management"
              ].map((item, idx) => (
                <ServicePill key={`dup4-1-${idx}`}>{item}</ServicePill>
              ))}
            </div>
            <div className="marquee-group" aria-hidden="true">
              {[
                "Unit test",
                "Quality Assurance",
                "Workplace Transformation",
                "Process Automation",
                "Business Process Management"
              ].map((item, idx) => (
                <ServicePill key={`dup4-2-${idx}`}>{item}</ServicePill>
              ))}
            </div>
            <div className="marquee-group" aria-hidden="true">
              {[
                "Unit test",
                "Quality Assurance",
                "Workplace Transformation",
                "Process Automation",
                "Business Process Management"
              ].map((item, idx) => (
                <ServicePill key={`dup4-3-${idx}`}>{item}</ServicePill>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

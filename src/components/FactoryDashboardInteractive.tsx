'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function FactoryDashboardInteractive() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={containerRef}
      style={{
        padding: 'clamp(4rem, 8vw, 7rem) 5%',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{
            fontSize: '0.78rem',
            fontWeight: 800,
            letterSpacing: '0.14em',
            color: '#64748b',
            textTransform: 'uppercase',
            display: 'inline-block',
            marginBottom: '0.9rem',
            fontFamily: 'system-ui, sans-serif',
          }}>
            INTELLIGENT SHOP FLOOR OPERATING SYSTEM
          </span>

          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3.4rem)',
            fontWeight: 400,
            color: '#000000',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            marginBottom: '1.2rem',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}>
            Zawr FactoryOS · Telemetry & AGV Fleet Twin
          </h2>

          <p style={{
            fontSize: '1.05rem',
            color: '#64748b',
            maxWidth: '680px',
            margin: '0 auto',
            lineHeight: 1.7,
            fontWeight: 300,
          }}>
            An enterprise single-pane-of-glass platform mapping autonomous AGV routing, workstation mission dispatching, and live shop floor telemetry.
          </p>
        </div>

        {/* Scroll Animated Dashboard Container */}
        <div
          style={{
            transform: isVisible
              ? 'perspective(1200px) rotateX(0deg) translateY(0) scale(1)'
              : 'perspective(1200px) rotateX(12deg) translateY(40px) scale(0.94)',
            opacity: isVisible ? 1 : 0.2,
            transition: 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.9s ease',
            borderRadius: '24px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)',
            backgroundColor: '#ffffff',
            overflow: 'hidden',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/factory-dashboard.png"
            alt="Zawr FactoryOS Management System Dashboard"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              filter: 'grayscale(100%) contrast(1.05)',
              backgroundColor: '#ffffff',
            }}
          />
        </div>

      </div>
    </section>
  );
}

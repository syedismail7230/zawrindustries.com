'use client';

import React, { useState, useEffect, useRef } from 'react';

type NavTab = 'Dashboard' | 'Operations' | 'Missions' | 'Vehicles' | 'Logs' | 'Alerts' | 'Analytics';

export default function FactoryDashboardInteractive() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<NavTab>('Dashboard');
  const [is3DView, setIs3DView] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hoveredAgv, setHoveredAgv] = useState<string | null>(null);

  // Live AGV Coordinates (%)
  const [agvCoords, setAgvCoords] = useState({
    agv489: { x: 59, y: 44 },
    agv571: { x: 72, y: 46 },
    agv018: { x: 56, y: 77 },
    agv254: { x: 67, y: 77 },
  });

  // Scroll Entry Animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.12 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // AGV pulse motion loop
  useEffect(() => {
    const interval = setInterval(() => {
      const time = Date.now() / 1000;
      setAgvCoords({
        agv489: { x: 59 + Math.sin(time * 0.8) * 0.8, y: 44 + Math.cos(time * 0.8) * 0.4 },
        agv571: { x: 72 + Math.cos(time * 0.9) * 0.9, y: 46 + Math.sin(time * 0.9) * 0.5 },
        agv018: { x: 56 + Math.sin(time * 1.1) * 0.7, y: 77 + Math.cos(time * 1.1) * 0.3 },
        agv254: { x: 67 + Math.cos(time * 0.7) * 0.6, y: 77 + Math.sin(time * 0.7) * 0.4 },
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={containerRef}
      style={{
        padding: 'clamp(4rem, 8vw, 7rem) 4%',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Editorial Section Header */}
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
            INTELLIGENT SHOP FLOOR DIGITAL TWIN
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
            Zawr FactoryOS · Real-Time Telemetry & Fleet Management
          </h2>

          <p style={{
            fontSize: '1.05rem',
            color: '#64748b',
            maxWidth: '680px',
            margin: '0 auto',
            lineHeight: 1.7,
            fontWeight: 300,
          }}>
            An enterprise-grade digital twin platform uniting autonomous AGV fleet routing, workstation mission dispatching, and live shop floor telemetry into a single interactive view.
          </p>
        </div>

        {/* Scroll Animated Dashboard Container */}
        <div
          style={{
            transform: isVisible
              ? 'perspective(1200px) rotateX(0deg) scale(1)'
              : 'perspective(1200px) rotateX(8deg) scale(0.95)',
            opacity: isVisible ? 1 : 0.3,
            transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease',
            borderRadius: '24px',
            boxShadow: '0 30px 70px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.08)',
            backgroundColor: '#ffffff',
            overflow: 'hidden',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            position: 'relative',
          }}
        >
          {/* Dashboard Image Viewport */}
          <div style={{ position: 'relative', width: '100%', overflow: 'hidden', backgroundColor: '#ffffff' }}>
            {/* Base High-Resolution Dashboard UI Image — Monochrome Black & White */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/factory-dashboard.png"
              alt="Zawr Manufacturing Factory OS Dashboard"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                filter: 'grayscale(100%) contrast(1.05)',
                transform: is3DView
                  ? `perspective(1200px) rotateX(20deg) rotateZ(-2deg) scale(${zoomLevel * 1.04})`
                  : `scale(${zoomLevel})`,
                transformOrigin: 'center center',
                transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.3s ease',
              }}
            />

            {/* Interactive Sidebar Hotspot Overlay (Left sidebar items on image) */}
            <div style={{
              position: 'absolute',
              top: '12%',
              left: '1%',
              width: '4.5%',
              height: '75%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              alignItems: 'center',
              zIndex: 30,
            }}>
              {[
                { id: 'Dashboard' as NavTab, label: 'Dashboard' },
                { id: 'Operations' as NavTab, label: 'Operations' },
                { id: 'Missions' as NavTab, label: 'Missions' },
                { id: 'Vehicles' as NavTab, label: 'Vehicles' },
                { id: 'Logs' as NavTab, label: 'Logs' },
                { id: 'Alerts' as NavTab, label: 'Alerts' },
                { id: 'Analytics' as NavTab, label: 'Analytics' },
              ].map((tab) => (
                <div
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  title={`Switch to ${tab.label}`}
                  style={{
                    width: '100%',
                    height: '12%',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    backgroundColor: activeTab === tab.id ? 'rgba(0,0,0,0.06)' : 'transparent',
                    transition: 'background 0.2s ease',
                  }}
                />
              ))}
            </div>

            {/* Live Pulsing AGV Nodes Overlay */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              transform: is3DView
                ? `perspective(1200px) rotateX(20deg) rotateZ(-2deg) scale(${zoomLevel * 1.04})`
                : `scale(${zoomLevel})`,
              transformOrigin: 'center center',
              transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            }}>
              {[
                { id: 'AGV-489', coords: agvCoords.agv489, label: 'AGV-489 (Active · 88% Batt)' },
                { id: 'AGV-571', coords: agvCoords.agv571, label: 'AGV-571 (Active · 94% Batt)' },
                { id: 'AGV-018', coords: agvCoords.agv018, label: 'AGV-018 (Active · 76% Batt)' },
                { id: 'AGV-254', coords: agvCoords.agv254, label: 'AGV-254 (Active · 91% Batt)' },
              ].map((agv) => (
                <div
                  key={agv.id}
                  onMouseEnter={() => setHoveredAgv(agv.id)}
                  onMouseLeave={() => setHoveredAgv(null)}
                  style={{
                    position: 'absolute',
                    left: `${agv.coords.x}%`,
                    top: `${agv.coords.y}%`,
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'auto',
                    cursor: 'pointer',
                    zIndex: 20,
                  }}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0, 0, 0, 0.15)',
                    border: '2px solid #000000',
                    animation: 'pulseRing 2s infinite ease-in-out',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#000000' }} />
                  </div>

                  {hoveredAgv === agv.id && (
                    <div style={{
                      position: 'absolute',
                      bottom: '24px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: '#000000',
                      color: '#ffffff',
                      padding: '0.35rem 0.65rem',
                      borderRadius: '6px',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                      zIndex: 30,
                    }}>
                      {agv.label}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Interactive View Controls Floating Dock */}
            <div style={{
              position: 'absolute',
              bottom: '4%',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              padding: '0.4rem 0.9rem',
              borderRadius: '30px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
              zIndex: 35,
            }}>
              {/* 2D / 3D Toggle */}
              <div style={{ display: 'flex', backgroundColor: '#f1f5f9', padding: '3px', borderRadius: '20px' }}>
                <button
                  onClick={() => setIs3DView(false)}
                  style={{
                    padding: '0.35rem 0.9rem',
                    borderRadius: '16px',
                    border: 'none',
                    backgroundColor: !is3DView ? '#000000' : 'transparent',
                    color: !is3DView ? '#ffffff' : '#64748b',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  2D View
                </button>
                <button
                  onClick={() => setIs3DView(true)}
                  style={{
                    padding: '0.35rem 0.9rem',
                    borderRadius: '16px',
                    border: 'none',
                    backgroundColor: is3DView ? '#000000' : 'transparent',
                    color: is3DView ? '#ffffff' : '#64748b',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  3D Twin
                </button>
              </div>

              {/* Zoom controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderLeft: '1px solid #e2e8f0', paddingLeft: '0.8rem' }}>
                <button onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.4))} style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 800, fontSize: '0.9rem', color: '#000000' }}>+</button>
                <button onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.85))} style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 800, fontSize: '0.9rem', color: '#000000' }}>-</button>
                <button onClick={() => { setZoomLevel(1); setIs3DView(false); }} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Reset</button>
              </div>
            </div>

          </div>

          {/* Interactive Selected Tab Telemetry Banner */}
          <div style={{
            backgroundColor: '#000000',
            color: '#ffffff',
            padding: '1.2rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ffffff', animation: 'pulse 1.5s infinite' }} />
              <div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>SELECTED VIEW TELEMETRY</span>
                <span style={{ fontSize: '1rem', fontWeight: 600, color: '#ffffff' }}>
                  Zawr FactoryOS · Active Tab: {activeTab}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '2rem', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: '#94a3b8', fontSize: '0.72rem', display: 'block' }}>FACILITY</span>
                <span style={{ fontWeight: 600, color: '#ffffff' }}>Menlo Park HQ · Floor 4</span>
              </div>
              <div>
                <span style={{ color: '#94a3b8', fontSize: '0.72rem', display: 'block' }}>ACTIVE FLEET</span>
                <span style={{ fontWeight: 600, color: '#ffffff' }}>18 AGVs Online</span>
              </div>
              <div>
                <span style={{ color: '#94a3b8', fontSize: '0.72rem', display: 'block' }}>SYSTEM HEALTH</span>
                <span style={{ fontWeight: 600, color: '#22c55e' }}>● 100% OPERATIONAL</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulseRing {
          0% { transform: scale(0.95); opacity: 0.9; }
          50% { transform: scale(1.15); opacity: 0.6; }
          100% { transform: scale(0.95); opacity: 0.9; }
        }
      ` }} />
    </section>
  );
}

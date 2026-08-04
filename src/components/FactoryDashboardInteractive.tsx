'use client';

import React, { useState, useEffect, useRef } from 'react';

interface TaskItem {
  id: string;
  source: string;
  dest: string;
  eta: string;
  agv: string;
  progress: number;
  status: string;
  mapCoords: { x: number; y: number };
}

const DASHBOARD_TASKS: TaskItem[] = [
  { id: 'TSK-00051', source: 'PRB-0240', dest: 'HSO-30171', eta: '+15m', agv: 'AGV-489', progress: 32, status: 'Active', mapCoords: { x: 49, y: 44 } },
  { id: 'TSK-00047', source: 'ESO-1102', dest: 'FSO-74812', eta: '+15m', agv: 'AGV-571', progress: 27, status: 'Active', mapCoords: { x: 74, y: 46 } },
  { id: 'TSK-00031', source: 'PRB-0240', dest: 'HSO-30171', eta: '+15m', agv: 'AGV-018', progress: 32, status: 'Active', mapCoords: { x: 62, y: 56 } },
  { id: 'TSK-00022', source: 'ESO-1102', dest: 'FSO-74812', eta: '+15m', agv: 'AGV-254', progress: 32, status: 'Active', mapCoords: { x: 68, y: 76 } },
];

export default function FactoryDashboardInteractive() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'TASKS' | 'FLEET' | 'EVENTS'>('TASKS');
  const [selectedTaskId, setSelectedTaskId] = useState<string>('TSK-00051');
  const [is3DView, setIs3DView] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hoveredAgv, setHoveredAgv] = useState<string | null>(null);

  // AGV Live Coordinates (%)
  const [agvCoords, setAgvCoords] = useState({
    agv489: { x: 49, y: 44 },
    agv571: { x: 74, y: 46 },
    agv018: { x: 62, y: 56 },
    agv254: { x: 68, y: 76 },
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
        agv489: { x: 49 + Math.sin(time * 0.8) * 1.5, y: 44 + Math.cos(time * 0.8) * 0.8 },
        agv571: { x: 74 + Math.cos(time * 0.9) * 1.8, y: 46 + Math.sin(time * 0.9) * 1.0 },
        agv018: { x: 62 + Math.sin(time * 1.1) * 1.4, y: 56 + Math.cos(time * 1.1) * 0.7 },
        agv254: { x: 68 + Math.cos(time * 0.7) * 1.2, y: 76 + Math.sin(time * 0.7) * 0.9 },
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  const filteredTasks = DASHBOARD_TASKS.filter(
    (t) =>
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.agv.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.source.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeTaskObj = DASHBOARD_TASKS.find((t) => t.id === selectedTaskId) || DASHBOARD_TASKS[0];

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
            borderRadius: '28px',
            boxShadow: '0 30px 70px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.08)',
            backgroundColor: '#ffffff',
            overflow: 'hidden',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            position: 'relative',
          }}
        >
          {/* Main Dashboard Image Layer with Interactive Overlays */}
          <div style={{
            position: 'relative',
            width: '100%',
            backgroundColor: '#ffffff',
            overflow: 'hidden',
          }}>
            {/* Base Pixel-Perfect Dashboard UI Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/factory-dashboard.png"
              alt="Zawr Manufacturing Factory OS Dashboard"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                transform: is3DView
                  ? `perspective(1200px) rotateX(24deg) rotateZ(-3deg) scale(${zoomLevel * 1.05})`
                  : `scale(${zoomLevel})`,
                transformOrigin: 'center center',
                transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />

            {/* Interactive Hotspot Overlays on Floor Plan Map Area */}
            <div style={{
              position: 'absolute',
              top: '18%',
              left: '32%',
              width: '66%',
              height: '75%',
              pointerEvents: 'none',
              transform: is3DView
                ? `perspective(1200px) rotateX(24deg) rotateZ(-3deg) scale(${zoomLevel * 1.05})`
                : `scale(${zoomLevel})`,
              transformOrigin: 'center center',
              transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            }}>
              
              {/* Dynamic Animated AGV Markers */}
              {[
                { id: 'AGV-489', coords: agvCoords.agv489, taskId: 'TSK-00051', label: 'AGV-489 (Active · 88% Batt)' },
                { id: 'AGV-571', coords: agvCoords.agv571, taskId: 'TSK-00047', label: 'AGV-571 (Active · 94% Batt)' },
                { id: 'AGV-018', coords: agvCoords.agv018, taskId: 'TSK-00031', label: 'AGV-018 (Active · 76% Batt)' },
                { id: 'AGV-254', coords: agvCoords.agv254, taskId: 'TSK-00022', label: 'AGV-254 (Active · 91% Batt)' },
              ].map((agv) => {
                const isSelected = selectedTaskId === agv.taskId;
                return (
                  <div
                    key={agv.id}
                    onMouseEnter={() => setHoveredAgv(agv.id)}
                    onMouseLeave={() => setHoveredAgv(null)}
                    onClick={() => setSelectedTaskId(agv.taskId)}
                    style={{
                      position: 'absolute',
                      left: `${agv.coords.x}%`,
                      top: `${agv.coords.y}%`,
                      transform: 'translate(-50%, -50%)',
                      pointerEvents: 'auto',
                      cursor: 'pointer',
                      zIndex: isSelected ? 20 : 10,
                    }}
                  >
                    {/* Pulsing ring */}
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: isSelected ? 'rgba(34, 197, 94, 0.3)' : 'rgba(0, 0, 0, 0.15)',
                      border: isSelected ? '2px solid #22c55e' : '2px solid #000000',
                      boxShadow: isSelected ? '0 0 12px rgba(34, 197, 94, 0.6)' : 'none',
                      animation: 'pulseRing 2s infinite ease-in-out',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: isSelected ? '#22c55e' : '#000000',
                      }} />
                    </div>

                    {/* Tooltip on hover */}
                    {hoveredAgv === agv.id && (
                      <div style={{
                        position: 'absolute',
                        bottom: '28px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: '#000000',
                        color: '#ffffff',
                        padding: '0.4rem 0.7rem',
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
                );
              })}

            </div>

            {/* Interactive Control Buttons Bar (Overlaid at bottom of map view) */}
            <div style={{
              position: 'absolute',
              bottom: '3.5%',
              left: '42%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              padding: '0.4rem 0.9rem',
              borderRadius: '30px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
              zIndex: 25,
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
                    transition: 'all 0.2s ease',
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
                    transition: 'all 0.2s ease',
                  }}
                >
                  3D Twin
                </button>
              </div>

              {/* Zoom controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderLeft: '1px solid #e2e8f0', paddingLeft: '0.8rem' }}>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.5))}
                  style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 800, fontSize: '0.9rem', color: '#000000' }}
                  title="Zoom In"
                >
                  +
                </button>
                <button
                  onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.8))}
                  style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 800, fontSize: '0.9rem', color: '#000000' }}
                  title="Zoom Out"
                >
                  -
                </button>
                <button
                  onClick={() => { setZoomLevel(1); setIs3DView(false); }}
                  style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}
                >
                  Reset
                </button>
              </div>
            </div>

          </div>

          {/* Interactive Selected Task Telemetry Status Banner */}
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
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', animation: 'pulse 1.5s infinite' }} />
              <div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>SELECTED TASK TELEMETRY</span>
                <span style={{ fontSize: '1rem', fontWeight: 600, color: '#ffffff' }}>
                  {activeTaskObj.id} · {activeTaskObj.source} ➔ {activeTaskObj.dest} ({activeTaskObj.agv})
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '2rem', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: '#94a3b8', fontSize: '0.72rem', display: 'block' }}>ESTIMATED ETA</span>
                <span style={{ fontWeight: 600, color: '#ffffff' }}>{activeTaskObj.eta}</span>
              </div>
              <div>
                <span style={{ color: '#94a3b8', fontSize: '0.72rem', display: 'block' }}>DISPATCH PROGRESS</span>
                <span style={{ fontWeight: 600, color: '#ffffff' }}>{activeTaskObj.progress}%</span>
              </div>
              <div>
                <span style={{ color: '#94a3b8', fontSize: '0.72rem', display: 'block' }}>FLEET STATUS</span>
                <span style={{ fontWeight: 600, color: '#22c55e' }}>● {activeTaskObj.status}</span>
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

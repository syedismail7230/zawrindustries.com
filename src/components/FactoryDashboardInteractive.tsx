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
  { id: 'TSK-00031', source: 'PRB-0240', dest: 'HSO-30171', eta: '+15m', agv: 'AGV-018', progress: 64, status: 'Active', mapCoords: { x: 62, y: 56 } },
  { id: 'TSK-00022', source: 'ESO-1102', dest: 'FSO-74812', eta: '+15m', agv: 'AGV-254', progress: 89, status: 'Active', mapCoords: { x: 68, y: 76 } },
  { id: 'TSK-00019', source: 'AXL-9041', dest: 'CELL-04', eta: '+22m', agv: 'AGV-102', progress: 14, status: 'Queued', mapCoords: { x: 30, y: 30 } },
  { id: 'TSK-00014', source: 'CNC-501', dest: 'INSPECT-01', eta: '+3m', agv: 'AGV-088', progress: 95, status: 'Active', mapCoords: { x: 80, y: 20 } },
];

type NavTab = 'Dashboard' | 'Operations' | 'Missions' | 'Vehicles' | 'Logs' | 'Alerts' | 'Analytics';

export default function FactoryDashboardInteractive() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeNavTab, setActiveNavTab] = useState<NavTab>('Dashboard');
  const [activeSubTab, setActiveSubTab] = useState<'TASKS' | 'FLEET' | 'EVENTS'>('TASKS');
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
          {/* Top Window Chrome Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.9rem 1.8rem',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            flexWrap: 'wrap',
            gap: '1rem',
          }}>
            {/* Logo + Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em', color: '#000000' }}>ZAWR</span>
                <span style={{ fontWeight: 400, fontSize: '1rem', letterSpacing: '0.04em', color: '#64748b' }}>MANUFACTURING</span>
              </div>
            </div>

            {/* Search Input Bar */}
            <div style={{ position: 'relative', flex: '1', maxWidth: '400px', minWidth: '200px' }}>
              <input
                type="text"
                placeholder="Search tasks, vehicles, logs and assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 1rem 0.5rem 2.2rem',
                  fontSize: '0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                  outline: 'none',
                  color: '#0f172a',
                }}
              />
              <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.85rem', color: '#94a3b8' }}>🔍</span>
            </div>

            {/* Admin Profile & Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                onClick={() => alert('New Mission Dispatch initialized')}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid #000000',
                  backgroundColor: '#000000',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  cursor: 'pointer',
                }}
              >
                + New Work
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', borderLeft: '1px solid #e2e8f0', paddingLeft: '1rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                }}>
                  RR
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#000000' }}>Robert Robertson</span>
                  <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Administrator</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar + Main Content Viewport */}
          <div style={{ display: 'grid', gridTemplateColumns: '72px 1fr', minHeight: '620px' }}>
            
            {/* Sidebar Navigation Tabs */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRight: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '1.2rem 0',
              gap: '1.4rem',
            }}>
              {[
                { id: 'Dashboard' as NavTab, label: 'Dashboard', icon: '⊞' },
                { id: 'Operations' as NavTab, label: 'Operations', icon: '⚙' },
                { id: 'Missions' as NavTab, label: 'Missions', icon: '📋' },
                { id: 'Vehicles' as NavTab, label: 'Vehicles', icon: '🚚' },
                { id: 'Logs' as NavTab, label: 'Logs', icon: '📄' },
                { id: 'Alerts' as NavTab, label: 'Alerts', icon: '🔔' },
                { id: 'Analytics' as NavTab, label: 'Analytics', icon: '📊' },
              ].map((tab) => {
                const isActive = activeNavTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveNavTab(tab.id)}
                    title={tab.label}
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      border: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: isActive ? '#000000' : 'transparent',
                      color: isActive ? '#ffffff' : '#64748b',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      padding: '2px',
                    }}
                  >
                    <span style={{ fontSize: '1.1rem' }}>{tab.icon}</span>
                    <span style={{ fontSize: '0.55rem', fontWeight: isActive ? 700 : 500, marginTop: '2px' }}>
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic View Content Area depending on Active Sidebar Tab */}
            <div style={{ backgroundColor: '#ffffff', position: 'relative', overflow: 'hidden' }}>
              
              {/* TAB 1: DASHBOARD VIEW (Pixel Perfect Interactive Map) */}
              {activeNavTab === 'Dashboard' && (
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
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

                  {/* Dynamic AGV Markers Overlay */}
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
                          <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: isSelected ? 'rgba(34, 197, 94, 0.3)' : 'rgba(0, 0, 0, 0.15)',
                            border: isSelected ? '2px solid #22c55e' : '2px solid #000000',
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

                  {/* View Controls Floating Dock */}
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

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderLeft: '1px solid #e2e8f0', paddingLeft: '0.8rem' }}>
                      <button onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.5))} style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 800, fontSize: '0.9rem', color: '#000000' }}>+</button>
                      <button onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.8))} style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 800, fontSize: '0.9rem', color: '#000000' }}>-</button>
                      <button onClick={() => { setZoomLevel(1); setIs3DView(false); }} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Reset</button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: OPERATIONS VIEW */}
              {activeNavTab === 'Operations' && (
                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#000000', margin: 0 }}>Shop Floor Machine Operations & Line Health</h3>
                      <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Real-time 5-axis CNC spindle speeds, robot cell arm telemetry, and line output</span>
                    </div>
                    <span style={{ padding: '0.3rem 0.8rem', backgroundColor: '#ecfdf5', color: '#059669', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700 }}>
                      ● ALL SYSTEMS NOMINAL
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem' }}>
                    {[
                      { title: '5-Axis CNC Milling Center 01', metric: '12,000 RPM', sub: 'Spindle Speed · Temp 42°C', status: 'Active Job #804', progress: 88 },
                      { title: 'Robotic Arc Welding Cell 04', metric: '88 Nm Torque', sub: 'Arm Latency <8ms · Laser Sync', status: 'Welding Frame #A12', progress: 74 },
                      { title: 'Automated Picking Conveyor B2', metric: '1.8 m/s', sub: 'Line Load 420 kg · Sensor OK', status: 'Continuous Loop', progress: 95 },
                      { title: 'Optical Quality Inspector 02', metric: '450 units/hr', sub: 'Defect Rate 0.02% · Laser Calibrated', status: 'Scanning Batch #09', progress: 100 },
                    ].map((op, idx) => (
                      <div key={idx} style={{ padding: '1.4rem', borderRadius: '16px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{op.status}</div>
                          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#000000', marginBottom: '0.8rem' }}>{op.title}</div>
                          <div style={{ fontSize: '1.8rem', fontWeight: 400, color: '#000000', letterSpacing: '-0.03em', marginBottom: '0.2rem' }}>{op.metric}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{op.sub}</div>
                        </div>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 600, color: '#000000', marginBottom: '0.3rem' }}>
                            <span>Efficiency</span>
                            <span>{op.progress}%</span>
                          </div>
                          <div style={{ height: '5px', backgroundColor: '#cbd5e1', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${op.progress}%`, height: '100%', backgroundColor: '#000000' }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: MISSIONS VIEW */}
              {activeNavTab === 'Missions' && (
                <div style={{ padding: '2rem' }}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#000000', margin: 0 }}>Active Work Order Missions Queue</h3>
                    <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Live dispatched tasks, route assignments, and fulfillment progress</span>
                  </div>

                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                          <th style={{ padding: '1rem 1.2rem' }}>Mission ID</th>
                          <th style={{ padding: '1rem 1.2rem' }}>Vehicle</th>
                          <th style={{ padding: '1rem 1.2rem' }}>Route (Source ➔ Dest)</th>
                          <th style={{ padding: '1rem 1.2rem' }}>ETA</th>
                          <th style={{ padding: '1rem 1.2rem' }}>Progress</th>
                          <th style={{ padding: '1rem 1.2rem' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {DASHBOARD_TASKS.map((task) => (
                          <tr key={task.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '1rem 1.2rem', fontWeight: 700, color: '#000000' }}>⚡ {task.id}</td>
                            <td style={{ padding: '1rem 1.2rem', fontWeight: 600, color: '#000000' }}>🚚 {task.agv}</td>
                            <td style={{ padding: '1rem 1.2rem', color: '#475569' }}>{task.source} ➔ {task.dest}</td>
                            <td style={{ padding: '1rem 1.2rem', fontWeight: 600, color: '#000000' }}>{task.eta}</td>
                            <td style={{ padding: '1rem 1.2rem', width: '180px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <div style={{ flex: 1, height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                                  <div style={{ width: `${task.progress}%`, height: '100%', backgroundColor: '#000000' }} />
                                </div>
                                <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>{task.progress}%</span>
                              </div>
                            </td>
                            <td style={{ padding: '1rem 1.2rem' }}>
                              <span style={{ padding: '0.2rem 0.6rem', borderRadius: '12px', backgroundColor: '#ecfdf5', color: '#059669', fontSize: '0.75rem', fontWeight: 700 }}>
                                ● {task.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: VEHICLES VIEW */}
              {activeNavTab === 'Vehicles' && (
                <div style={{ padding: '2rem' }}>
                  <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#000000', margin: 0 }}>AGV Autonomous Fleet Manager</h3>
                      <span style={{ fontSize: '0.82rem', color: '#64748b' }}>18 Active Autonomous Guided Vehicles registered on shop floor grid</span>
                    </div>
                    <span style={{ padding: '0.4rem 1rem', borderRadius: '20px', backgroundColor: '#000000', color: '#ffffff', fontSize: '0.78rem', fontWeight: 700 }}>
                      18 / 18 ONLINE
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem' }}>
                    {[
                      { agv: 'AGV-489', batt: '88%', speed: '1.4 m/s', load: '450 kg', loc: 'Cell A-2', state: 'Active Mission' },
                      { agv: 'AGV-571', batt: '94%', speed: '1.6 m/s', load: '320 kg', loc: 'Cell B-4', state: 'Active Mission' },
                      { agv: 'AGV-018', batt: '76%', speed: '1.2 m/s', load: '500 kg', loc: 'Cell C-1', state: 'Active Mission' },
                      { agv: 'AGV-254', batt: '91%', speed: '1.8 m/s', load: '280 kg', loc: 'Cell D-3', state: 'Active Mission' },
                      { agv: 'AGV-102', batt: '62%', speed: '0.0 m/s', load: '0 kg', loc: 'Dock #01', state: 'Fast-Charging' },
                      { agv: 'AGV-088', batt: '99%', speed: '1.7 m/s', load: '150 kg', loc: 'Cell A-4', state: 'Standby Route' },
                    ].map((v, i) => (
                      <div key={i} style={{ padding: '1.2rem', borderRadius: '16px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                          <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#000000' }}>🚚 {v.agv}</span>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.5rem', backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #cbd5e1' }}>🔋 {v.batt}</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                          <div>Speed: <strong>{v.speed}</strong></div>
                          <div>Payload: <strong>{v.load}</strong></div>
                          <div>Location: <strong>{v.loc}</strong></div>
                        </div>
                        <div style={{ marginTop: '0.8rem', paddingTop: '0.6rem', borderTop: '1px solid #e2e8f0', fontSize: '0.72rem', fontWeight: 700, color: '#059669' }}>
                          ● {v.state}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: LOGS VIEW */}
              {activeNavTab === 'Logs' && (
                <div style={{ padding: '2rem' }}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#000000', margin: 0 }}>Audit Stream & System Event Logs</h3>
                    <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Real-time shop floor event telemetry, AGV docking logs, and safety triggers</span>
                  </div>

                  <div style={{ backgroundColor: '#0f172a', color: '#f8fafc', padding: '1.4rem', borderRadius: '16px', fontFamily: 'monospace', fontSize: '0.82rem', lineHeight: 1.8, maxHeight: '420px', overflowY: 'auto' }}>
                    <div><span style={{ color: '#64748b' }}>[10:34:12.804]</span> <span style={{ color: '#38bdf8' }}>AGV-489</span>: Arrived at Workstation Cell A-2. Initiated automated pallet transport #PRB-0240.</div>
                    <div><span style={{ color: '#64748b' }}>[10:33:55.102]</span> <span style={{ color: '#4ade80' }}>INSPECTION</span>: Computer vision optical quality pass on Part #74812 (Tolerance: ±0.003mm).</div>
                    <div><span style={{ color: '#64748b' }}>[10:32:40.450]</span> <span style={{ color: '#38bdf8' }}>AGV-571</span>: Obstacle path clear. Rerouted via Track Segment 4B at 1.6 m/s.</div>
                    <div><span style={{ color: '#64748b' }}>[10:31:18.991]</span> <span style={{ color: '#fbbf24' }}>ROBOT-CELL-02</span>: Completed cycle #500. Next automatic calibration in 48h.</div>
                    <div><span style={{ color: '#64748b' }}>[10:29:05.310]</span> <span style={{ color: '#38bdf8' }}>AGV-018</span>: Battery fast-charged to 76%. Released from Dock Station #2.</div>
                    <div><span style={{ color: '#64748b' }}>[10:27:44.118]</span> <span style={{ color: '#4ade80' }}>SYSTEM</span>: Production Hall 2 telemetry sync verified across 18 AGVs.</div>
                  </div>
                </div>
              )}

              {/* TAB 6: ALERTS VIEW */}
              {activeNavTab === 'Alerts' && (
                <div style={{ padding: '2rem' }}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#000000', margin: 0 }}>System Health & Active Alerts</h3>
                    <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Live safety alerts, collision avoidance telemetry, and sensor thresholds</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[
                      { type: 'CRITICAL', title: 'AGV-102 Low Charge Warning', msg: 'Battery dropped below 15% during transit. Autonomous fast-charge reroute initiated to Dock #01.', color: '#ef4444', bg: '#fef2f2' },
                      { type: 'WARNING', title: 'Conveyor Line 3 Vibration Threshold', msg: 'Spindle vibration reading 0.04g above nominal curve. Preventive maintenance inspection recommended.', color: '#f59e0b', bg: '#fffbeb' },
                      { type: 'INFO', title: 'Firmware v4.2.1 Deployment Complete', msg: 'Fleetwide safety firmware patch successfully updated across all 18 registered AGV units.', color: '#3b82f6', bg: '#eff6ff' },
                    ].map((alt, idx) => (
                      <div key={idx} style={{ padding: '1.2rem 1.5rem', borderRadius: '12px', border: `1px solid ${alt.color}`, backgroundColor: alt.bg, display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.75rem', padding: '0.3rem 0.6rem', borderRadius: '6px', backgroundColor: alt.color, color: '#ffffff' }}>
                          {alt.type}
                        </span>
                        <div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#000000', marginBottom: '0.2rem' }}>{alt.title}</div>
                          <div style={{ fontSize: '0.82rem', color: '#475569' }}>{alt.msg}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: ANALYTICS VIEW */}
              {activeNavTab === 'Analytics' && (
                <div style={{ padding: '2rem' }}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#000000', margin: 0 }}>Shop Floor Production & OEE Analytics</h3>
                    <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Key performance indicators, daily output quotas, and energy metrics</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem' }}>
                    {[
                      { label: 'Overall Equipment Effectiveness', value: '94.8%', sub: '+3.2% vs Monthly Target' },
                      { label: 'Daily Units Produced', value: '4,820', sub: 'Quota: 5,000 units (96.4%)' },
                      { label: 'Fleet Energy Efficiency', value: '98.2 Wh/km', sub: '-12% Power Consumption' },
                      { label: 'Control Response Latency', value: '8.4 ms', sub: 'Sub-10ms Real-Time Sync' },
                    ].map((st, i) => (
                      <div key={i} style={{ padding: '1.4rem', borderRadius: '16px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{st.label}</span>
                        <div style={{ fontSize: '2.2rem', fontWeight: 400, color: '#000000', letterSpacing: '-0.04em', margin: '0.4rem 0' }}>{st.value}</div>
                        <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 600 }}>{st.sub}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Bottom Telemetry Status Banner */}
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
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>SELECTED VIEW TELEMETRY</span>
                <span style={{ fontSize: '1rem', fontWeight: 600, color: '#ffffff' }}>
                  Zawr FactoryOS · Active Tab: {activeNavTab} ({activeTaskObj.id})
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '2rem', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: '#94a3b8', fontSize: '0.72rem', display: 'block' }}>FACILITY</span>
                <span style={{ fontWeight: 600, color: '#ffffff' }}>Menlo Park HQ</span>
              </div>
              <div>
                <span style={{ color: '#94a3b8', fontSize: '0.72rem', display: 'block' }}>DISPATCH STATUS</span>
                <span style={{ fontWeight: 600, color: '#ffffff' }}>{activeTaskObj.progress}% Complete</span>
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

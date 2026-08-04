'use client';

import React, { useState, useEffect, useRef } from 'react';

interface Task {
  id: string;
  source: string;
  dest: string;
  eta: string;
  agv: string;
  progress: number;
  status: 'Active' | 'Queued' | 'Completed';
  location: string;
}

const INITIAL_TASKS: Task[] = [
  { id: 'TSK-00051', source: 'PRB-0240', dest: 'HSO-30171', eta: '+15m', agv: 'AGV-489', progress: 32, status: 'Active', location: 'Cell A-2' },
  { id: 'TSK-00047', source: 'ESO-1102', dest: 'FSO-74812', eta: '+15m', agv: 'AGV-571', progress: 27, status: 'Active', location: 'Cell B-4' },
  { id: 'TSK-00031', source: 'PRB-0240', dest: 'HSO-30171', eta: '+10m', agv: 'AGV-018', progress: 64, status: 'Active', location: 'Cell C-1' },
  { id: 'TSK-00022', source: 'ESO-1102', dest: 'FSO-74812', eta: '+5m', agv: 'AGV-254', progress: 89, status: 'Active', location: 'Cell D-3' },
  { id: 'TSK-00019', source: 'AXL-9041', dest: 'CELL-04', eta: '+22m', agv: 'AGV-102', progress: 14, status: 'Queued', location: 'Cell A-1' },
];

export default function FactoryDashboardInteractive() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'TASKS' | 'FLEET' | 'EVENTS'>('TASKS');
  const [selectedTask, setSelectedTask] = useState<string>('TSK-00051');
  const [is3DMode, setIs3DMode] = useState<boolean>(false);
  const [selectedFacility, setSelectedFacility] = useState<string>('Menlo Park HQ · Floor 4');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [agvPositions, setAgvPositions] = useState({
    agv489: { x: 220, y: 150 },
    agv571: { x: 480, y: 260 },
    agv018: { x: 350, y: 380 },
    agv254: { x: 620, y: 180 },
  });

  // Scroll Animation using IntersectionObserver
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

  // AGV pulse motion simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setAgvPositions((prev) => ({
        agv489: { x: 220 + Math.sin(Date.now() / 1000) * 20, y: 150 + Math.cos(Date.now() / 1000) * 10 },
        agv571: { x: 480 + Math.cos(Date.now() / 1200) * 25, y: 260 + Math.sin(Date.now() / 1200) * 15 },
        agv018: { x: 350 + Math.sin(Date.now() / 900) * 30, y: 380 + Math.sin(Date.now() / 900) * 10 },
        agv254: { x: 620 + Math.cos(Date.now() / 1100) * 15, y: 180 + Math.cos(Date.now() / 1100) * 20 },
      }));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const filteredTasks = INITIAL_TASKS.filter(
    (t) =>
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.agv.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.source.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          }}>
            INTELLIGENT FACTORY OPERATING SYSTEM
          </span>

          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3.4rem)',
            fontWeight: 400,
            color: '#000000',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            marginBottom: '1.2rem',
          }}>
            Zawr FactoryOS · Real-Time Telemetry & AGV Fleet Twin
          </h2>

          <p style={{
            fontSize: '1.05rem',
            color: '#64748b',
            maxWidth: '680px',
            margin: '0 auto',
            lineHeight: 1.7,
            fontWeight: 300,
          }}>
            An enterprise single-pane-of-glass dashboard mapping automated guided vehicle routing, live assembly cell workloads, and autonomous mission telemetry in real time.
          </p>
        </div>

        {/* Scroll Animated Dashboard Container */}
        <div
          style={{
            transform: isVisible
              ? 'perspective(1200px) rotateX(0deg) scale(1)'
              : 'perspective(1200px) rotateX(10deg) scale(0.94)',
            opacity: isVisible ? 1 : 0.4,
            transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease',
            borderRadius: '24px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.08)',
            backgroundColor: '#f8fafc',
            overflow: 'hidden',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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

            {/* Top Search Filter */}
            <div style={{ position: 'relative', flex: '1', maxWidth: '420px', minWidth: '220px' }}>
              <input
                type="text"
                placeholder="Search orders, jobs, vehicles and assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 1rem 0.55rem 2.4rem',
                  fontSize: '0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#f1f5f9',
                  outline: 'none',
                  color: '#0f172a',
                }}
              />
              <svg style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', fill: '#94a3b8' }} viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </div>

            {/* Right Action Icons & Admin Profile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
              <button
                onClick={() => alert('New Work Order Dispatcher initialized')}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#000000',
                  cursor: 'pointer',
                }}
              >
                + New Work
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: '1px solid #e2e8f0', paddingLeft: '1rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  color: '#000000',
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

          {/* Main Dashboard Workspace Body */}
          <div style={{ display: 'grid', gridTemplateColumns: '64px 340px 1fr', minHeight: '620px' }}>
            
            {/* 1. Left Nav Toolbar */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRight: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '1.2rem 0',
              gap: '1.6rem',
            }}>
              {[
                { label: 'Dashboard', icon: '⊞', active: true },
                { label: 'Operations', icon: '⚙' },
                { label: 'Missions', icon: '📋' },
                { label: 'Vehicles', icon: '🚚' },
                { label: 'Logs', icon: '📄' },
                { label: 'Alerts', icon: '🔔' },
                { label: 'Analytics', icon: '📊' },
              ].map((item) => (
                <div
                  key={item.label}
                  title={item.label}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: item.active ? '#000000' : 'transparent',
                    color: item.active ? '#ffffff' : '#64748b',
                    cursor: 'pointer',
                    fontSize: '1rem',
                  }}
                >
                  <span>{item.icon}</span>
                  <span style={{ fontSize: '0.55rem', marginTop: '2px', fontWeight: item.active ? 600 : 400 }}>{item.label}</span>
                </div>
              ))}
            </div>

            {/* 2. Controls & Active Task Panel */}
            <div style={{
              backgroundColor: '#f8fafc',
              borderRight: '1px solid #e2e8f0',
              padding: '1.2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.2rem',
              overflowY: 'auto',
              maxHeight: '680px',
            }}>
              {/* Location Picker Card */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '0.9rem 1rem',
                border: '1px solid #e2e8f0',
              }}>
                <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', fontWeight: 600 }}>LOCATION</span>
                <select
                  value={selectedFacility}
                  onChange={(e) => setSelectedFacility(e.target.value)}
                  style={{
                    width: '100%',
                    marginTop: '0.3rem',
                    padding: '0.4rem',
                    border: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: '#000000',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="Menlo Park HQ · Floor 4">Menlo Park HQ · Floor 4</option>
                  <option value="Bangalore Plant · Assembly Bay 2">Bangalore Plant · Assembly Bay 2</option>
                  <option value="Pune Smart Factory · Floor 1">Pune Smart Factory · Floor 1</option>
                </select>
              </div>

              {/* Filter Tabs */}
              <div style={{ display: 'flex', backgroundColor: '#e2e8f0', padding: '3px', borderRadius: '8px' }}>
                {(['TASKS', 'FLEET', 'EVENTS'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      flex: 1,
                      padding: '0.45rem 0',
                      border: 'none',
                      borderRadius: '6px',
                      backgroundColor: activeTab === tab ? '#000000' : 'transparent',
                      color: activeTab === tab ? '#ffffff' : '#64748b',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      cursor: 'pointer',
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Task Cards List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {filteredTasks.map((t) => {
                  const isSelected = selectedTask === t.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTask(t.id)}
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        padding: '1rem',
                        border: isSelected ? '2px solid #000000' : '1px solid #e2e8f0',
                        boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.06)' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#000000' }}>⚡ {t.id}</span>
                        </div>
                        <span style={{
                          fontSize: '0.68rem',
                          fontWeight: 600,
                          padding: '0.2rem 0.5rem',
                          borderRadius: '12px',
                          backgroundColor: '#f1f5f9',
                          color: '#475569',
                        }}>
                          ● {t.status}
                        </span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.6rem' }}>
                        <span>{t.source}</span>
                        <span>{t.dest}</span>
                        <span style={{ fontWeight: 600, color: '#000000' }}>{t.eta}</span>
                      </div>

                      {/* Progress bar */}
                      <div style={{ height: '4px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.6rem' }}>
                        <div style={{ width: `${t.progress}%`, height: '100%', backgroundColor: '#000000', borderRadius: '4px', transition: 'width 0.4s ease' }} />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: '#64748b' }}>
                        <span style={{ fontWeight: 600, color: '#000000' }}>🚚 {t.agv}</span>
                        <span>Location: {t.location}</span>
                        <span style={{ fontWeight: 700, color: '#000000' }}>{t.progress}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Interactive Floor Plan Digital Twin Canvas */}
            <div style={{
              backgroundColor: '#ffffff',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Floor Header Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#000000', margin: 0 }}>PRODUCTION HALL 2</h3>
                  <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', backgroundColor: '#ecfdf5', color: '#059669', borderRadius: '20px', fontWeight: 600 }}>
                    ● LIVE TELEMETRY
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.82rem', color: '#475569', alignItems: 'center' }}>
                  <span>👥 <strong>12</strong> Operators</span>
                  <span>🚚 <strong>18</strong> AGVs</span>
                  <span>📋 <strong>7</strong> Active Tasks</span>
                </div>
              </div>

              {/* Floor Plan Vector Canvas */}
              <div style={{
                flex: 1,
                backgroundColor: '#f8fafc',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '440px',
              }}>
                <svg
                  viewBox="0 0 800 500"
                  style={{
                    width: '100%',
                    height: '100%',
                    transform: is3DMode
                      ? `rotateX(42deg) rotateZ(-12deg) scale(${zoomLevel * 0.95})`
                      : `rotateX(0deg) rotateZ(0deg) scale(${zoomLevel})`,
                    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  {/* Grid background */}
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {/* AGV Transport Track Loops */}
                  <rect x="60" y="60" width="680" height="380" rx="30" fill="none" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="8 6" />
                  <path d="M 180 140 H 620 V 360 H 180 Z" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="6 4" />

                  {/* Workstation Grid Banks */}
                  {[
                    { x: 100, y: 100, label: 'Cell A-1' },
                    { x: 260, y: 100, label: 'Cell A-2' },
                    { x: 420, y: 100, label: 'Cell A-3' },
                    { x: 580, y: 100, label: 'Cell A-4' },
                    { x: 100, y: 300, label: 'Cell B-1' },
                    { x: 260, y: 300, label: 'Cell B-2' },
                    { x: 420, y: 300, label: 'Cell B-3' },
                    { x: 580, y: 300, label: 'Cell B-4' },
                  ].map((cell, idx) => (
                    <g key={idx}>
                      <rect x={cell.x} y={cell.y} width="120" height="90" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
                      <rect x={cell.x + 10} y={cell.y + 10} width="100" height="70" rx="4" fill="#f1f5f9" />
                      <text x={cell.x + 60} y={cell.y + 48} textAnchor="middle" fontSize="11" fontWeight="600" fill="#475569">
                        {cell.label}
                      </text>
                    </g>
                  ))}

                  {/* Dynamic Moving AGV Nodes */}
                  <g>
                    {/* AGV-489 */}
                    <circle cx={agvPositions.agv489.x} cy={agvPositions.agv489.y} r="14" fill="#000000" />
                    <text x={agvPositions.agv489.x} y={agvPositions.agv489.y + 4} textAnchor="middle" fontSize="9" fontWeight="700" fill="#ffffff">
                      489
                    </text>

                    {/* AGV-571 */}
                    <circle cx={agvPositions.agv571.x} cy={agvPositions.agv571.y} r="14" fill="#000000" />
                    <text x={agvPositions.agv571.x} y={agvPositions.agv571.y + 4} textAnchor="middle" fontSize="9" fontWeight="700" fill="#ffffff">
                      571
                    </text>

                    {/* AGV-018 */}
                    <circle cx={agvPositions.agv018.x} cy={agvPositions.agv018.y} r="14" fill="#000000" />
                    <text x={agvPositions.agv018.x} y={agvPositions.agv018.y + 4} textAnchor="middle" fontSize="9" fontWeight="700" fill="#ffffff">
                      018
                    </text>

                    {/* AGV-254 */}
                    <circle cx={agvPositions.agv254.x} cy={agvPositions.agv254.y} r="14" fill="#000000" />
                    <text x={agvPositions.agv254.x} y={agvPositions.agv254.y + 4} textAnchor="middle" fontSize="9" fontWeight="700" fill="#ffffff">
                      254
                    </text>
                  </g>
                </svg>

                {/* Floating Bottom View Mode Controls */}
                <div style={{
                  position: 'absolute',
                  bottom: '1rem',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(8px)',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '30px',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
                }}>
                  <div style={{ display: 'flex', backgroundColor: '#e2e8f0', padding: '2px', borderRadius: '20px' }}>
                    <button
                      onClick={() => setIs3DMode(false)}
                      style={{
                        padding: '0.3rem 0.8rem',
                        borderRadius: '16px',
                        border: 'none',
                        backgroundColor: !is3DMode ? '#000000' : 'transparent',
                        color: !is3DMode ? '#ffffff' : '#475569',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      2D View
                    </button>
                    <button
                      onClick={() => setIs3DMode(true)}
                      style={{
                        padding: '0.3rem 0.8rem',
                        borderRadius: '16px',
                        border: 'none',
                        backgroundColor: is3DMode ? '#000000' : 'transparent',
                        color: is3DMode ? '#ffffff' : '#475569',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      3D Twin
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '0.3rem', borderLeft: '1px solid #cbd5e1', paddingLeft: '0.75rem' }}>
                    <button
                      onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.6))}
                      style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem', color: '#000' }}
                    >
                      +
                    </button>
                    <button
                      onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.7))}
                      style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem', color: '#000' }}
                    >
                      -
                    </button>
                    <button
                      onClick={() => { setZoomLevel(1); setIs3DMode(false); }}
                      style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

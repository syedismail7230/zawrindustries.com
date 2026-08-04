'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function FactoryDashboardInteractive() {
  const containerRef = useRef<HTMLDivElement>(null);
  const activePathRef = useRef<SVGPathElement>(null);
  
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'TASKS' | 'FLEET' | 'EVENTS'>('TASKS');
  const [viewMode, setViewMode] = useState<'2D' | '3D'>('2D');
  const [selectedTask, setSelectedTask] = useState<string>('TSK-00051');
  const [agvOffset, setAgvOffset] = useState<number>(0);
  const [activeHall, setActiveHall] = useState<string>('PRODUCTION HALL 2');
  const [isLive, setIsLive] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [zoomed, setZoomed] = useState<number>(1);

  // Animated AGV positions on path
  const [movingAgvPos, setMovingAgvPos] = useState<{ x: number; y: number }>({ x: 140, y: 125 });

  // 1. Scroll-driven 3D tilt animation
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;
      const distance = elementCenter - viewportCenter;
      
      const normalized = Math.max(-1, Math.min(1, distance / (windowHeight / 2)));
      setScrollProgress(normalized);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Continuous AGV Path Interpolation Loop
  useEffect(() => {
    let animId: number;
    let start: number;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      
      // Animate dash offset for route line
      setAgvOffset((elapsed / 25) % 1000);

      // Interpolate AGV 78 position along path
      if (activePathRef.current && isLive) {
        const totalLen = activePathRef.current.getTotalLength();
        if (totalLen > 0) {
          const currentDistance = ((elapsed / 15) % totalLen);
          const point = activePathRef.current.getPointAtLength(currentDistance);
          setMovingAgvPos({ x: point.x, y: point.y });
        }
      }

      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [isLive]);

  // 3D Transform values based on scroll
  const rotateX = scrollProgress * 8;
  const scale = 1 - Math.abs(scrollProgress) * 0.03;
  const opacity = 1 - Math.abs(scrollProgress) * 0.15;

  const tasksList = [
    { id: 'TSK-00051', origin: 'PRB-0240', dest: 'HSO-30171', time: '+15m', agv: 'AGV-489', stops: '1/4', battery: '32%', progress: 65, active: true },
    { id: 'TSK-00047', origin: 'ESO-1102', dest: 'FSO-74812', time: '+15m', agv: 'AGV-571', stops: '3/4', battery: '27%', progress: 27, active: true },
    { id: 'TSK-00031', origin: 'PRB-0240', dest: 'HSO-30171', time: '+15m', agv: 'AGV-018', stops: '1/4', battery: '32%', progress: 48, active: true },
    { id: 'TSK-00022', origin: 'ESO-1102', dest: 'FSO-74812', time: '+15m', agv: 'AGV-254', stops: '3/4', battery: '32%', progress: 85, active: true },
  ];

  const fleetList = [
    { agv: 'AGV-489', status: 'In Transit', load: '320 kg', battery: '82%', location: 'Hall 2 · Route A' },
    { agv: 'AGV-571', status: 'Docked / Charging', load: '0 kg', battery: '94%', location: 'Hall 2 · Dock 4' },
    { agv: 'AGV-018', status: 'In Transit', load: '450 kg', battery: '76%', location: 'Hall 2 · Route C' },
    { agv: 'AGV-254', status: 'Picking Payload', load: '180 kg', battery: '61%', location: 'Hall 2 · Station 9' },
  ];

  const eventsList = [
    { time: '10:34:12', msg: 'AGV-489 entered Production Corridor B', type: 'info' },
    { time: '10:32:05', msg: 'Task TSK-00051 auto-assigned to AGV-489', type: 'success' },
    { time: '10:28:40', msg: 'CNC Station 04 completed cycle #1842', type: 'info' },
    { time: '10:25:11', msg: 'AGV-571 battery reached 94% threshold', type: 'success' },
  ];

  // Specific path routes corresponding to selected tasks
  const getTaskPathD = () => {
    switch (selectedTask) {
      case 'TSK-00047':
        return 'M 140 305 H 390 V 215 H 680';
      case 'TSK-00031':
        return 'M 140 125 H 270 V 305 H 680';
      case 'TSK-00022':
        return 'M 390 125 V 305 H 680';
      default:
        // TSK-00051
        return 'M 140 125 H 390 V 215 H 680';
    }
  };

  return (
    <section style={{
      padding: 'clamp(4rem, 8vw, 7rem) 4%',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      overflow: 'hidden',
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header Information Block */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{
            display: 'inline-block',
            fontSize: '0.78rem',
            fontWeight: 800,
            letterSpacing: '0.14em',
            color: '#64748b',
            marginBottom: '1.2rem',
            textTransform: 'uppercase',
            fontFamily: 'system-ui, sans-serif',
          }}>
            AUTONOMOUS FACTORY TELEMETRY
          </span>

          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3.4rem)',
            fontWeight: 400,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            color: '#000000',
            marginBottom: '1.4rem',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}>
            Zawr Factory Management System (FMS)
          </h2>

          <p style={{
            fontSize: '1.05rem',
            color: '#475569',
            lineHeight: 1.8,
            maxWidth: '780px',
            margin: '0 auto',
            fontWeight: 300,
          }}>
            Our proprietary Factory Management System provides unified 3D digital twin observability, sub-millisecond AGV telemetry, and autonomous production floor orchestration — driving zero-defect manufacturing with 99.98% operational uptime.
          </p>
        </div>

        {/* Scroll-Animated Interactive Dashboard Container */}
        <div
          ref={containerRef}
          style={{
            transform: `perspective(1200px) rotateX(${rotateX}deg) scale(${Math.max(0.92, scale)})`,
            opacity: Math.min(1, Math.max(0.7, opacity)),
            transition: 'transform 0.15s cubic-bezier(0.1, 0.9, 0.2, 1), opacity 0.2s ease',
            borderRadius: '24px',
            border: '1px solid #cbd5e1',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.08), 0 4px 20px rgba(0, 0, 0, 0.04)',
            backgroundColor: '#ffffff',
            overflow: 'hidden',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          
          {/* TOP BAR */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.9rem 1.6rem',
            borderBottom: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            gap: '1rem',
            flexWrap: 'wrap',
          }}>
            {/* Logo & Menu */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
              <button
                aria-label="Toggle Navigation Menu"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              </button>
              <span style={{ fontSize: '0.95rem', fontWeight: 800, letterSpacing: '0.08em', color: '#000000' }}>
                ZAWR MANUFACTURING
              </span>
            </div>

            {/* Search Input */}
            <div style={{ flex: '1 1 300px', maxWidth: '420px', position: 'relative' }}>
              <input
                type="text"
                placeholder="Search orders, jobs, vehicles and assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 1rem 0.55rem 2.4rem',
                  fontSize: '0.85rem',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                  outline: 'none',
                  color: '#000000',
                }}
              />
              <svg style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>

            {/* Right Action Icons & Admin Profile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button style={{
                padding: '0.5rem 1.1rem',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                color: '#000000',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}>
                <span>+</span> New Work
              </button>

              {/* Notification Bell Badge */}
              <div style={{ position: 'relative', cursor: 'pointer', padding: '6px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                <span style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>3</span>
              </div>

              {/* Admin Avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', paddingLeft: '0.5rem', borderLeft: '1px solid #e2e8f0' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#1e293b',
                }}>RR</div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#000000', lineHeight: 1.1 }}>Robert Robertson</span>
                  <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Administrator</span>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT WORKSPACE GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: '60px 300px 1fr', minHeight: '620px' }}>
            
            {/* 1. FAR-LEFT NAVIGATION SIDEBAR */}
            <div style={{
              borderRight: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              padding: '1rem 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem', alignItems: 'center', width: '100%' }}>
                {[
                  { name: 'Dashboard', icon: <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/>, active: true },
                  { name: 'Operations', icon: <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>, active: false },
                  { name: 'Missions', icon: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>, active: false },
                  { name: 'Vehicles', icon: <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM18.5 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>, active: false },
                  { name: 'Logs', icon: <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>, active: false },
                  { name: 'Alerts', icon: <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>, active: false },
                  { name: 'Analytics', icon: <g><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></g>, active: false },
                ].map((item) => (
                  <div
                    key={item.name}
                    title={item.name}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: item.active ? '#f1f5f9' : 'transparent',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={item.active ? '#000000' : '#94a3b8'} strokeWidth="2">{item.icon}</svg>
                    <span style={{ fontSize: '0.55rem', color: item.active ? '#000000' : '#94a3b8', marginTop: '2px', fontWeight: item.active ? 700 : 400 }}>{item.name}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                <div title="Settings" style={{ cursor: 'pointer' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                </div>
              </div>
            </div>

            {/* 2. SUB-SIDEBAR (Location & Task List Panel) */}
            <div style={{
              borderRight: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              padding: '1.2rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.2rem',
            }}>
              {/* Location Selectors */}
              <div style={{
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                padding: '0.8rem 1rem',
                border: '1px solid #e2e8f0',
              }}>
                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', fontWeight: 700 }}>LOCATION</span>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.3rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#000000' }}>Menlo Park HQ</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>▼</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem', paddingLeft: '1.4rem' }}>Floor 4</div>
              </div>

              {/* Tabs: TASKS / FLEET / EVENTS */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                backgroundColor: '#f1f5f9',
                borderRadius: '8px',
                padding: '3px',
                gap: '2px',
              }}>
                {(['TASKS', 'FLEET', 'EVENTS'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: '0.45rem 0',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: activeTab === tab ? '#ffffff' : 'transparent',
                      color: activeTab === tab ? '#000000' : '#64748b',
                      boxShadow: activeTab === tab ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                      transition: 'all 0.2s ease',
                    }}>
                    {tab}
                  </button>
                ))}
              </div>

              {/* TAB CONTENT: TASKS */}
              {activeTab === 'TASKS' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', maxHeight: '420px', paddingRight: '2px' }}>
                  {tasksList.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTask(task.id)}
                      style={{
                        padding: '0.85rem 0.9rem',
                        borderRadius: '12px',
                        border: selectedTask === task.id ? '1.5px solid #000000' : '1px solid #e2e8f0',
                        backgroundColor: selectedTask === task.id ? '#f8fafc' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: selectedTask === task.id ? '0 4px 12px rgba(0,0,0,0.04)' : 'none',
                      }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ color: '#000000', fontSize: '0.75rem' }}>⚡</span>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#000000' }}>{task.id}</span>
                        </div>
                        <span style={{ fontSize: '0.68rem', color: '#16a34a', fontWeight: 600 }}>● Active</span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#475569', marginBottom: '0.5rem' }}>
                        <span>{task.origin}</span>
                        <span style={{ color: '#94a3b8' }}>→</span>
                        <span>{task.dest}</span>
                        <span style={{ color: '#94a3b8' }}>{task.time}</span>
                      </div>

                      {/* Progress Bar */}
                      <div style={{ height: '4px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.6rem' }}>
                        <div style={{ width: `${task.progress}%`, height: '100%', backgroundColor: '#000000', borderRadius: '4px', transition: 'width 0.3s ease' }} />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b' }}>
                        <span>🚚 {task.agv}</span>
                        <span>Stops: {task.stops}</span>
                        <span>🔋 {task.battery}</span>
                      </div>
                    </div>
                  ))}
                  <div style={{ textAlign: 'center', paddingTop: '0.4rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#000000', cursor: 'pointer' }}>
                      View all tasks &gt;
                    </span>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: FLEET */}
              {activeTab === 'FLEET' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', maxHeight: '420px' }}>
                  {fleetList.map((item) => (
                    <div key={item.agv} style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#000000' }}>
                        <span>{item.agv}</span>
                        <span style={{ fontSize: '0.7rem', color: '#16a34a' }}>{item.status}</span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.3rem' }}>{item.location}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#475569', marginTop: '0.4rem' }}>
                        <span>Load: {item.load}</span>
                        <span>Battery: {item.battery}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB CONTENT: EVENTS */}
              {activeTab === 'EVENTS' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', overflowY: 'auto', maxHeight: '420px' }}>
                  {eventsList.map((ev, i) => (
                    <div key={i} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                      <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600 }}>{ev.time}</div>
                      <div style={{ fontSize: '0.74rem', color: '#000000', marginTop: '0.2rem', lineHeight: 1.4 }}>{ev.msg}</div>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* 3. MAIN FLOOR PLAN TELEMETRY STAGE */}
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '1.2rem 1.6rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
            }}>
              
              {/* Telemetry Stage Header */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.8rem' }}>
                  
                  {/* Hall Dropdown */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#000000', margin: 0, letterSpacing: '-0.02em' }}>
                      {activeHall}
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', cursor: 'pointer' }}>▼</span>
                  </div>

                  {/* Hall Live Stats Badges */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', fontSize: '0.78rem', color: '#475569' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      <span><strong>12</strong> Operators</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/></svg>
                      <span><strong>18</strong> AGVs</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>
                      <span><strong>7</strong> Active Tasks</span>
                    </div>

                    {/* LIVE Pulse Badge */}
                    <div
                      onClick={() => setIsLive(!isLive)}
                      style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '50px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #cbd5e1',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: '#000000',
                        cursor: 'pointer',
                      }}>
                      <div style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        backgroundColor: isLive ? '#22c55e' : '#94a3b8',
                        boxShadow: isLive ? '0 0 8px #22c55e' : 'none',
                      }} />
                      <span>{isLive ? 'LIVE' : 'PAUSED'}</span>
                    </div>
                  </div>

                </div>

                {/* Timeline scrubber bar */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.7rem',
                  color: '#64748b',
                  padding: '0.4rem 0.8rem',
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  marginBottom: '1rem',
                }}>
                  <span>08:00</span>
                  <span style={{ color: '#cbd5e1' }}>4.2K</span>
                  <span>09:00</span>
                  <span>10:00</span>
                  
                  {/* Current Live Head Indicator */}
                  <div style={{
                    padding: '0.2rem 0.5rem',
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    fontWeight: 700,
                    borderRadius: '4px',
                    fontSize: '0.68rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                  }}>
                    <span>10:34</span>
                    <span style={{ fontSize: '0.55rem', color: '#38bdf8' }}>▲</span>
                  </div>

                  <span>11:00</span>
                  <span style={{ color: '#cbd5e1' }}>5.1K</span>
                  <span>12:00</span>
                </div>
              </div>

              {/* BLUEPRINT FLOOR PLAN MAP CANVAS (2D / 3D Perspective) */}
              <div style={{
                position: 'relative',
                flex: '1 1 380px',
                minHeight: '400px',
                borderRadius: '16px',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transformStyle: 'preserve-3d',
                transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
              }}>

                {/* 2D / 3D Floor Canvas Render */}
                <div style={{
                  width: '94%',
                  height: '92%',
                  position: 'relative',
                  transform: `scale(${zoomed}) ${viewMode === '3D' ? 'rotateX(42deg) rotateZ(-12deg) scale(0.92)' : ''}`,
                  transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  transformOrigin: 'center center',
                }}>
                  
                  {/* SVG Blueprint Track Lines */}
                  <svg width="100%" height="100%" viewBox="0 0 800 450" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
                    
                    {/* Grid Guidelines matching user reference image */}
                    {/* Horizontal Guidelines */}
                    <line x1="40" y1="125" x2="760" y2="125" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
                    <line x1="40" y1="215" x2="760" y2="215" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
                    <line x1="40" y1="305" x2="760" y2="305" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />

                    {/* Vertical Guidelines */}
                    <line x1="140" y1="30" x2="140" y2="400" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
                    <line x1="445" y1="30" x2="445" y2="400" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
                    <line x1="680" y1="30" x2="680" y2="400" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />

                    {/* 8 Soft Light Blue Rack Pods matching reference image */}
                    {[
                      { id: 1, x: 170, y: 55 },
                      { id: 2, x: 275, y: 55 },
                      { id: 3, x: 380, y: 55 },
                      { id: 4, x: 485, y: 55 },
                      { id: 5, x: 170, y: 245 },
                      { id: 6, x: 275, y: 245 },
                      { id: 7, x: 380, y: 245 },
                      { id: 8, x: 485, y: 245 },
                    ].map((rack) => (
                      <g key={rack.id}>
                        <rect
                          x={rack.x}
                          y={rack.y}
                          width="85"
                          height="135"
                          rx="14"
                          fill="#f0f4f8"
                          stroke="#cbd5e1"
                          strokeWidth="1.5"
                        />
                        {/* Rack shelves texture lines */}
                        {Array.from({ length: 6 }).map((_, rIdx) => (
                          <line
                            key={rIdx}
                            x1={rack.x + 10}
                            y1={rack.y + 18 + rIdx * 18}
                            x2={rack.x + 75}
                            y2={rack.y + 18 + rIdx * 18}
                            stroke="#cbd5e1"
                            strokeWidth="1"
                            strokeDasharray="3 3"
                          />
                        ))}
                      </g>
                    ))}

                    {/* Active Mission Heavy Black Path following exact grid corridors */}
                    <path
                      ref={activePathRef}
                      d={getTaskPathD()}
                      fill="none"
                      stroke="#000000"
                      strokeWidth="3.5"
                      strokeDasharray="8 6"
                      strokeDashoffset={-agvOffset}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* AGV Badges positioned on exact grid nodes matching reference image */}
                    
                    {/* AGV 94 (Pod 1 bottom) */}
                    <g transform="translate(230, 175)">
                      <rect x="-16" y="-9" width="32" height="18" rx="4" fill="#000000" />
                      <text x="0" y="3.5" fill="#ffffff" fontSize="10" fontWeight="700" textAnchor="middle">94</text>
                      <circle cx="12" cy="-6" r="2" fill="#22c55e" />
                    </g>

                    {/* AGV 59 (Pod 3 right aisle) */}
                    <g transform="translate(465, 160)">
                      <rect x="-16" y="-9" width="32" height="18" rx="4" fill="#000000" />
                      <text x="0" y="3.5" fill="#ffffff" fontSize="10" fontWeight="700" textAnchor="middle">59</text>
                      <circle cx="12" cy="-6" r="2" fill="#22c55e" />
                    </g>

                    {/* Dynamic Moving AGV 78 following active path */}
                    <g transform={`translate(${movingAgvPos.x}, ${movingAgvPos.y})`}>
                      <rect x="-18" y="-10" width="36" height="20" rx="5" fill="#000000" stroke="#38bdf8" strokeWidth="1.5" />
                      <text x="0" y="4" fill="#ffffff" fontSize="10" fontWeight="700" textAnchor="middle">78</text>
                      <circle cx="14" cy="-7" r="2.5" fill="#22c55e" />
                    </g>

                    {/* AGV 178 (Pod 7 top) */}
                    <g transform="translate(430, 235)">
                      <rect x="-16" y="-9" width="32" height="18" rx="4" fill="#000000" />
                      <text x="0" y="3.5" fill="#ffffff" fontSize="10" fontWeight="700" textAnchor="middle">178</text>
                      <circle cx="12" cy="-6" r="2" fill="#22c55e" />
                    </g>

                    {/* AGV 283 (Pod 8 top) */}
                    <g transform="translate(535, 235)">
                      <rect x="-16" y="-9" width="32" height="18" rx="4" fill="#000000" />
                      <text x="0" y="3.5" fill="#ffffff" fontSize="10" fontWeight="700" textAnchor="middle">283</text>
                      <circle cx="12" cy="-6" r="2" fill="#22c55e" />
                    </g>

                    {/* AGV 114 (Pod 7 bottom) */}
                    <g transform="translate(385, 385)">
                      <rect x="-16" y="-9" width="32" height="18" rx="4" fill="#000000" />
                      <text x="0" y="3.5" fill="#ffffff" fontSize="10" fontWeight="700" textAnchor="middle">114</text>
                      <circle cx="12" cy="-6" r="2" fill="#22c55e" />
                    </g>

                    {/* AGV 96 & 234 paired at top dock */}
                    <g transform="translate(535, 30)">
                      {/* Charge icon */}
                      <rect x="-34" y="-9" width="16" height="18" rx="4" fill="#ffffff" stroke="#000000" strokeWidth="1.5"/>
                      <text x="-26" y="4" fill="#000000" fontSize="10" fontWeight="bold" textAnchor="middle">⚡</text>

                      {/* AGV 96 */}
                      <rect x="-15" y="-9" width="30" height="18" rx="4" fill="#000000" />
                      <text x="0" y="3.5" fill="#ffffff" fontSize="10" fontWeight="700" textAnchor="middle">96</text>
                      <circle cx="11" cy="-6" r="2" fill="#22c55e" />

                      {/* AGV 234 */}
                      <rect x="18" y="-9" width="32" height="18" rx="4" fill="#000000" />
                      <text x="34" y="3.5" fill="#ffffff" fontSize="10" fontWeight="700" textAnchor="middle">234</text>
                      <circle cx="46" cy="-6" r="2" fill="#22c55e" />
                    </g>

                    {/* AGV 196 & 209 stacked at left portal */}
                    <g transform="translate(140, 190)">
                      <rect x="-16" y="-18" width="32" height="16" rx="4" fill="#000000" />
                      <text x="0" y="-6" fill="#ffffff" fontSize="9" fontWeight="700" textAnchor="middle">196</text>
                      <rect x="-16" y="2" width="32" height="16" rx="4" fill="#000000" />
                      <text x="0" y="14" fill="#ffffff" fontSize="9" fontWeight="700" textAnchor="middle">209</text>
                    </g>

                    {/* Destination Hub Station (Right Corridor) */}
                    <g transform="translate(680, 260)">
                      <rect x="-12" y="-12" width="24" height="24" rx="6" fill="#ffffff" stroke="#000000" strokeWidth="1.5"/>
                      <text x="0" y="4" fill="#000000" fontSize="11" fontWeight="bold" textAnchor="middle">📦</text>
                    </g>

                    {/* Aisle Node Badge (V) */}
                    <g transform="translate(445, 90)">
                      <rect x="-8" y="-8" width="16" height="16" rx="3" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1"/>
                      <text x="0" y="3" fill="#475569" fontSize="9" fontWeight="bold" textAnchor="middle">V</text>
                    </g>

                  </svg>

                </div>

                {/* BOTTOM MAP CONTROLS OVERLAY */}
                <div style={{
                  position: 'absolute',
                  bottom: '1rem',
                  left: '1rem',
                  right: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  zIndex: 10,
                  pointerEvents: 'auto',
                }}>
                  {/* Scale key */}
                  <div style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '0.3rem 0.7rem',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: '#000000',
                  }}>
                    10 m <span style={{ color: '#94a3b8', fontWeight: 400 }}>| 50 ft</span>
                  </div>

                  {/* 2D / 3D Toggle */}
                  <div style={{
                    display: 'flex',
                    backgroundColor: '#000000',
                    borderRadius: '8px',
                    padding: '3px',
                    gap: '2px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}>
                    <button
                      onClick={() => setViewMode('2D')}
                      style={{
                        padding: '0.35rem 0.8rem',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: viewMode === '2D' ? '#ffffff' : 'transparent',
                        color: viewMode === '2D' ? '#000000' : '#ffffff',
                        transition: 'all 0.2s ease',
                      }}>
                      🎲 2D
                    </button>

                    <button
                      onClick={() => setViewMode('3D')}
                      style={{
                        padding: '0.35rem 0.8rem',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: viewMode === '3D' ? '#ffffff' : 'transparent',
                        color: viewMode === '3D' ? '#000000' : '#ffffff',
                        transition: 'all 0.2s ease',
                      }}>
                      🧊 3D
                    </button>
                  </div>

                  {/* Map Zoom Controls */}
                  <div style={{
                    display: 'flex',
                    gap: '4px',
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    padding: '3px',
                    border: '1px solid #cbd5e1',
                  }}>
                    <button onClick={() => setZoomed(1)} title="Fit Bounds" style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px 8px', fontSize: '0.75rem' }}>⛶</button>
                    <button onClick={() => setZoomed(prev => Math.max(0.8, prev - 0.15))} title="Zoom Out" style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px 8px', fontSize: '0.75rem' }}>-</button>
                    <button onClick={() => setZoomed(prev => Math.min(1.5, prev + 0.15))} title="Zoom In" style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px 8px', fontSize: '0.75rem' }}>+</button>
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

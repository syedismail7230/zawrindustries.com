'use client';

import React, { useState, useEffect, useRef } from 'react';

type NavTab =
  | 'Dashboard'
  | 'Production Management'
  | 'Machine Monitoring'
  | 'MES'
  | 'Inventory/Warehouse'
  | 'Quality Management'
  | 'Maintenance'
  | 'Workforce Management'
  | 'Production Scheduling'
  | 'Analytics & Reporting'
  | 'User & Role Management'
  | 'ERP/PLC Integration';

// Helper Component for Smooth Gradient Area Sparkline Charts (matching user screenshot)
const Sparkline = ({
  color = '#22c55e',
  data = [30, 45, 35, 55, 40, 65, 50, 75, 60, 85],
  height = 42,
  width = 120,
  id = 'sp-1',
}: {
  color?: string;
  data?: number[];
  height?: number;
  width?: number;
  id?: string;
}) => {
  const max = Math.max(...data, 100);
  const min = Math.min(...data, 0);
  const range = max - min || 1;

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 8) - 4;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `M 0,${height} L ${points.join(' L ')} L ${width},${height} Z`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.35} />
          <stop offset="100%" stopColor={color} stopOpacity={0.0} />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#grad-${id})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default function FactoryDashboardInteractive() {
  const containerRef = useRef<HTMLDivElement>(null);
  const activePathRef = useRef<SVGPathElement>(null);
  
  const [mounted, setMounted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeNavTab, setActiveNavTab] = useState<NavTab>('Dashboard');
  const [activeTab, setActiveTab] = useState<'TASKS' | 'FLEET' | 'EVENTS'>('TASKS');
  const [viewMode, setViewMode] = useState<'2D' | '3D'>('2D');
  const [selectedTask, setSelectedTask] = useState<string>('TSK-00051');
  const [agvOffset, setAgvOffset] = useState<number>(0);
  const [activeHall, setActiveHall] = useState<string>('PRODUCTION HALL 2');
  const [isLive, setIsLive] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [zoomed, setZoomed] = useState<number>(1);
  const [woFilter, setWoFilter] = useState<string>('ALL');

  // Animated AGV positions on path
  const [movingAgvPos, setMovingAgvPos] = useState<{ x: number; y: number }>({ x: 169, y: 45 });

  useEffect(() => {
    setMounted(true);
  }, []);

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
      
      setAgvOffset((elapsed / 20) % 1000);

      if (activePathRef.current && isLive) {
        const totalLen = activePathRef.current.getTotalLength();
        if (totalLen > 0) {
          const currentDistance = ((elapsed / 12) % totalLen);
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

  // Orthogonal grid routes corresponding to selected tasks
  const getTaskPathD = () => {
    switch (selectedTask) {
      case 'TSK-00047':
        return 'M 409 485 V 275 A 10 10 0 0 0 419 265 H 780';
      case 'TSK-00031':
        return 'M 40 265 H 279 A 10 10 0 0 1 289 275 V 475 A 10 10 0 0 0 299 485 H 780';
      case 'TSK-00022':
        return 'M 169 45 H 279 A 10 10 0 0 1 289 55 V 475 A 10 10 0 0 0 299 485 H 780';
      default:
        // TSK-00051
        return 'M 169 235 V 55 A 10 10 0 0 1 179 45 H 530 A 10 10 0 0 1 540 55 V 255 A 10 10 0 0 0 550 265 H 780';
    }
  };

  // Helper to render high-density pod matrix (6 cols x 10 rows)
  const renderPodGrid = (startX: number, startY: number) => {
    const cells = [];
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 6; c++) {
        cells.push(
          <rect
            key={`${r}-${c}`}
            x={startX + c * 13}
            y={startY + r * 13}
            width="10"
            height="10"
            rx="2"
            fill="#4b5563"
          />
        );
      }
    }
    return cells;
  };

  // Helper to render component tray grid (4 cols x 4 rows)
  const renderTrayGrid = (startX: number, startY: number) => {
    const cells = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        cells.push(
          <rect
            key={`t-${r}-${c}`}
            x={startX + c * 11}
            y={startY + r * 11}
            width="8"
            height="8"
            rx="1.5"
            fill="#64748b"
          />
        );
      }
    }
    return cells;
  };

  // All 12 Navigation Modules requested by User
  const navItems: { name: NavTab; icon: React.ReactNode; shortLabel: string }[] = [
    { name: 'Dashboard', shortLabel: 'Dashboard', icon: <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/> },
    { name: 'Production Management', shortLabel: 'Production', icon: <path d="M2 20h20M5 20V8l7-5 7 5v12"/> },
    { name: 'Machine Monitoring', shortLabel: 'Machines', icon: <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/> },
    { name: 'MES', shortLabel: 'MES', icon: <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/> },
    { name: 'Inventory/Warehouse', shortLabel: 'Inventory', icon: <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/> },
    { name: 'Quality Management', shortLabel: 'Quality', icon: <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3"/> },
    { name: 'Maintenance', shortLabel: 'Maintenance', icon: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/> },
    { name: 'Workforce Management', shortLabel: 'Workforce', icon: <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/> },
    { name: 'Production Scheduling', shortLabel: 'Scheduling', icon: <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/> },
    { name: 'Analytics & Reporting', shortLabel: 'Analytics', icon: <g><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></g> },
    { name: 'User & Role Management', shortLabel: 'Users/Roles', icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/> },
    { name: 'ERP/PLC Integration', shortLabel: 'ERP / PLC', icon: <path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16M5 19a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/> },
  ];

  if (!mounted) return null;

  return (
    <section suppressHydrationWarning style={{
      padding: 'clamp(2.5rem, 5vw, 5rem) 3%',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      overflow: 'hidden',
    }}>
      <style>{`
        /* Hide scrollbars completely across all browsers while retaining scrollability */
        .fms-no-scrollbar {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
        .fms-no-scrollbar::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }

        /* Global Mobile Dashboard CSS Overrides */
        @media (max-width: 900px) {
          .fms-main-grid {
            display: flex !important;
            flex-direction: column !important;
            min-height: auto !important;
          }
          .fms-nav-sidebar {
            display: flex !important;
            flex-direction: row !important;
            width: 100% !important;
            max-height: none !important;
            overflow-x: auto !important;
            border-right: none !important;
            border-bottom: 1px solid #e2e8f0 !important;
            padding: 0.5rem 0.6rem !important;
            gap: 0.5rem !important;
            justify-content: flex-start !important;
            -webkit-overflow-scrolling: touch;
          }
          .fms-nav-sidebar-container {
            width: 100% !important;
            display: flex !important;
            flex-direction: row !important;
            gap: 0.4rem !important;
          }
          .fms-nav-item {
            width: auto !important;
            min-width: 76px !important;
            padding: 0.4rem 0.6rem !important;
            flex-shrink: 0 !important;
          }
          .fms-sub-sidebar {
            border-right: none !important;
            border-bottom: 1px solid #e2e8f0 !important;
            width: 100% !important;
            max-height: none !important;
          }
          .fms-stage {
            padding: 1rem 0.8rem !important;
            min-height: 380px !important;
          }
          .fms-map-canvas {
            min-height: 340px !important;
          }
          .fms-grid-4col {
            grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)) !important;
          }
          .fms-grid-3col {
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)) !important;
          }
          .fms-table-wrap {
            overflow-x: auto !important;
          }
        }
      `}</style>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header Information Block */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{
            display: 'inline-block',
            fontSize: '0.75rem',
            fontWeight: 500,
            letterSpacing: '0.14em',
            color: '#64748b',
            marginBottom: '1rem',
            textTransform: 'uppercase',
            fontFamily: 'system-ui, sans-serif',
          }}>
            AUTONOMOUS FACTORY TELEMETRY
          </span>

          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 3.2rem)',
            fontWeight: 300,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            color: '#000000',
            marginBottom: '1.2rem',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}>
            Zawr Factory Management System (FMS)
          </h2>

          <p style={{
            fontSize: '0.98rem',
            color: '#475569',
            lineHeight: 1.75,
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
            padding: '0.9rem 1.4rem',
            borderBottom: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            gap: '1rem',
            flexWrap: 'wrap',
          }}>
            {/* Logo & Menu */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                aria-label="Toggle Navigation Menu"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              </button>
              <span style={{ fontSize: '0.88rem', fontWeight: 500, letterSpacing: '0.08em', color: '#000000' }}>
                ZAWR MANUFACTURING
              </span>
            </div>

            {/* Search Input */}
            <div style={{ flex: '1 1 240px', maxWidth: '420px', position: 'relative' }}>
              <input
                type="text"
                placeholder="Search orders, jobs, vehicles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 1rem 0.5rem 2.2rem',
                  fontSize: '0.82rem',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                  outline: 'none',
                  color: '#000000',
                  fontWeight: 400,
                }}
              />
              <svg style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)' }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>

            {/* Right Action Icons & Admin Profile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
              <button style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                color: '#000000',
                fontWeight: 500,
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}>
                <span>+</span> New Work
              </button>

              {/* Notification Bell Badge */}
              <div style={{ position: 'relative', cursor: 'pointer', padding: '4px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                <span style={{
                  position: 'absolute',
                  top: '0px',
                  right: '0px',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  fontSize: '0.58rem',
                  fontWeight: 500,
                  width: '13px',
                  height: '13px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>3</span>
              </div>

              {/* Admin Avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingLeft: '0.4rem', borderLeft: '1px solid #e2e8f0' }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: '#e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: '#1e293b',
                }}>RR</div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#000000', lineHeight: 1.1 }}>Robert Robertson</span>
                  <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 400 }}>Administrator</span>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT WORKSPACE GRID */}
          <div className="fms-main-grid" style={{ display: 'grid', gridTemplateColumns: activeNavTab === 'Dashboard' ? '76px 280px 1fr' : '76px 1fr', minHeight: '660px' }}>
            
            {/* 1. NAVIGATION SIDEBAR */}
            <div className="fms-nav-sidebar fms-no-scrollbar" style={{
              borderRight: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              padding: '0.8rem 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              overflowY: 'auto',
              maxHeight: '660px',
            }}>
              <div className="fms-nav-sidebar-container" style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', alignItems: 'center', width: '100%', padding: '0 4px' }}>
                {navItems.map((item) => {
                  const isActive = activeNavTab === item.name;
                  return (
                    <div
                      key={item.name}
                      onClick={() => setActiveNavTab(item.name)}
                      title={item.name}
                      className="fms-nav-item"
                      style={{
                        width: '66px',
                        padding: '0.45rem 0.2rem',
                        borderRadius: '10px',
                        backgroundColor: isActive ? '#f1f5f9' : 'transparent',
                        border: isActive ? '1px solid #cbd5e1' : '1px solid transparent',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isActive ? '#000000' : '#64748b'} strokeWidth={isActive ? '1.8' : '1.5'}>{item.icon}</svg>
                      <span style={{ fontSize: '0.52rem', color: isActive ? '#000000' : '#64748b', marginTop: '3px', fontWeight: isActive ? 500 : 400, textAlign: 'center', lineHeight: 1.15 }}>{item.shortLabel}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* TAB VIEW 1: DASHBOARD VIEW */}
            {activeNavTab === 'Dashboard' && (
              <>
                {/* SUB-SIDEBAR (Location & Task List Panel) */}
                <div className="fms-sub-sidebar" style={{
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
                    <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', fontWeight: 500 }}>LOCATION</span>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.3rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        <span style={{ fontSize: '0.82rem', fontWeight: 500, color: '#000000' }}>Menlo Park HQ</span>
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
                          fontWeight: activeTab === tab ? 500 : 400,
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
                    <div className="fms-no-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', maxHeight: '420px', paddingRight: '2px' }}>
                      {tasksList.map((task) => (
                        <div
                          key={task.id}
                          onClick={() => setSelectedTask(task.id)}
                          style={{
                            padding: '0.85rem 0.9rem',
                            borderRadius: '12px',
                            border: selectedTask === task.id ? '1px solid #000000' : '1px solid #e2e8f0',
                            backgroundColor: selectedTask === task.id ? '#f8fafc' : '#ffffff',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: selectedTask === task.id ? '0 4px 12px rgba(0,0,0,0.04)' : 'none',
                          }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <span style={{ color: '#000000', fontSize: '0.75rem' }}>⚡</span>
                              <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#000000' }}>{task.id}</span>
                            </div>
                            <span style={{ fontSize: '0.68rem', color: '#16a34a', fontWeight: 500 }}>● Active</span>
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
                        <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#000000', cursor: 'pointer' }}>
                          View all tasks &gt;
                        </span>
                      </div>
                    </div>
                  )}

                  {/* TAB CONTENT: FLEET */}
                  {activeTab === 'FLEET' && (
                    <div className="fms-no-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', maxHeight: '420px' }}>
                      {fleetList.map((item) => (
                        <div key={item.agv} style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 500, color: '#000000' }}>
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
                    <div className="fms-no-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', overflowY: 'auto', maxHeight: '420px' }}>
                      {eventsList.map((ev, i) => (
                        <div key={i} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                          <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 500 }}>{ev.time}</div>
                          <div style={{ fontSize: '0.74rem', color: '#000000', marginTop: '0.2rem', lineHeight: 1.4 }}>{ev.msg}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* MAIN FLOOR PLAN TELEMETRY STAGE */}
                <div className="fms-stage" style={{
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 500, color: '#000000', margin: 0, letterSpacing: '-0.01em' }}>
                          {activeHall}
                        </h3>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', cursor: 'pointer' }}>▼</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', fontSize: '0.78rem', color: '#475569', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                          <span><strong>12</strong> Operators</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/></svg>
                          <span><strong>18</strong> AGVs</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>
                          <span><strong>7</strong> Active Tasks</span>
                        </div>

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
                            fontWeight: 500,
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
                    <div className="fms-no-scrollbar" style={{
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
                      overflowX: 'auto',
                    }}>
                      <span>08:00</span>
                      <span style={{ color: '#cbd5e1' }}>4.2K</span>
                      <span>09:00</span>
                      <span>10:00</span>
                      <div style={{
                        padding: '0.2rem 0.5rem',
                        backgroundColor: '#000000',
                        color: '#ffffff',
                        fontWeight: 500,
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

                  {/* BLUEPRINT MAP */}
                  <div className="fms-map-canvas" style={{
                    position: 'relative',
                    flex: '1 1 420px',
                    minHeight: '440px',
                    borderRadius: '24px',
                    backgroundColor: '#eaeef4',
                    border: '1px solid #cbd5e1',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  }}>
                    <div style={{
                      width: '98%',
                      height: '96%',
                      position: 'relative',
                      transform: `scale(${zoomed}) ${viewMode === '3D' ? 'rotateX(52deg) rotateZ(-20deg) translateY(-25px) scale(0.92)' : ''}`,
                      transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
                      transformOrigin: 'center center',
                      filter: viewMode === '3D' ? 'drop-shadow(0px 30px 40px rgba(0, 0, 0, 0.22))' : 'none',
                    }}>
                      <svg width="100%" height="100%" viewBox="0 0 1000 600" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
                        {/* Floor Boundary - Base Layer & 3D Extruded Perimeter Wall */}
                        {viewMode === '3D' && (
                          <path
                            d="M 40 46 H 480 A 16 16 0 0 0 520 46 H 960 A 30 30 0 0 1 990 76 V 286 A 16 16 0 0 0 990 326 V 556 A 30 30 0 0 1 960 586 H 520 A 16 16 0 0 0 480 586 H 40 A 30 30 0 0 1 10 556 V 326 A 16 16 0 0 0 10 286 V 76 A 30 30 0 0 1 40 46 Z"
                            fill="#cbd5e1"
                            opacity="0.8"
                          />
                        )}
                        <path
                          d="M 40 30 H 480 A 16 16 0 0 0 520 30 H 960 A 30 30 0 0 1 990 60 V 270 A 16 16 0 0 0 990 310 V 540 A 30 30 0 0 1 960 570 H 520 A 16 16 0 0 0 480 570 H 40 A 30 30 0 0 1 10 540 V 310 A 16 16 0 0 0 10 270 V 60 A 30 30 0 0 1 40 30 Z"
                          fill={viewMode === '3D' ? '#f1f5f9' : '#e6ebf2'}
                          stroke="#cbd5e1"
                          strokeWidth="2"
                        />
                        
                        {/* 8 Storage Pods — 2D flat or 3D Extruded Isometric Towers */}
                        {[
                          { px: 62, py: 65, id: 1 },
                          { px: 182, py: 65, id: 2 },
                          { px: 302, py: 65, id: 3 },
                          { px: 422, py: 65, id: 4 },
                          { px: 62, py: 375, id: 5 },
                          { px: 182, py: 375, id: 6 },
                          { px: 302, py: 375, id: 7 },
                          { px: 422, py: 375, id: 8 },
                        ].map((pod) => (
                          <g key={`pod-${pod.id}`}>
                            {viewMode === '3D' ? (
                              <>
                                {/* 3D Pod Base Drop Shadow */}
                                <rect x={pod.px + 6} y={pod.py + 10} width="94" height="144" rx="10" fill="rgba(0,0,0,0.18)" />
                                {/* 3D Pod Extruded Front Face */}
                                <rect x={pod.px} y={pod.py + 130} width="94" height="18" rx="4" fill="#475569" />
                                {/* 3D Pod Extruded Side Face */}
                                <path d={`M ${pod.px + 94} ${pod.py - 14} L ${pod.px + 104} ${pod.py - 6} L ${pod.px + 104} ${pod.py + 138} L ${pod.px + 94} ${pod.py + 130} Z`} fill="#334155" />
                                {/* 3D Raised Top Face */}
                                <g transform="translate(-6, -14)">
                                  <rect x={pod.px} y={pod.py} width="94" height="144" rx="10" fill="#94a3b8" stroke="#64748b" strokeWidth="1.5" />
                                  {renderPodGrid(pod.px + 8, pod.py + 8)}
                                </g>
                              </>
                            ) : (
                              <>
                                <rect x={pod.px} y={pod.py} width="94" height="144" rx="10" fill="#cbd5e1" opacity="0.4" />
                                {renderPodGrid(pod.px + 8, pod.py + 8)}
                              </>
                            )}
                          </g>
                        ))}

                        {/* Robotic Workstations — 2D or 3D Extruded */}
                        {[[160, 110], [280, 110], [400, 110], [160, 420], [280, 420], [400, 420]].map((pos, i) => (
                          <g key={`st-${i}`} transform={`translate(${pos[0]}, ${pos[1]})`}>
                            {viewMode === '3D' && (
                              <>
                                {/* 3D Workstation Base Shadow */}
                                <rect x="-12" y="-14" width="24" height="40" rx="6" fill="rgba(0,0,0,0.22)" />
                                {/* 3D Pillar Extrusion */}
                                <rect x="-10" y="-24" width="20" height="36" rx="6" fill="#475569" />
                              </>
                            )}
                            <rect x="-10" y={viewMode === '3D' ? "-28" : "-18"} width="20" height="36" rx="6" fill={viewMode === '3D' ? '#000000' : '#94a3b8'} />
                            <text x="0" y={viewMode === '3D' ? "-14" : "-4"} fill="#ffffff" fontSize="9" textAnchor="middle">🦾</text>
                            <text x="0" y={viewMode === '3D' ? "0" : "10"} fill="#ffffff" fontSize="9" textAnchor="middle">🔧</text>
                            <rect x="-12" y={viewMode === '3D' ? "-16" : "-6"} width="24" height="12" rx="3" fill="#ffffff" stroke="#000000" strokeWidth="1"/>
                            <text x="0" y={viewMode === '3D' ? "-7" : "3"} fill="#000000" fontSize="8" fontWeight="normal" textAnchor="middle">🛍️</text>
                          </g>
                        ))}

                        {renderTrayGrid(680, 65)}
                        {renderTrayGrid(750, 65)}
                        {renderTrayGrid(680, 375)}
                        {renderTrayGrid(750, 375)}
                        <line x1="40" y1="45" x2="940" y2="45" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" />
                        <line x1="40" y1="235" x2="940" y2="235" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" />
                        <line x1="40" y1="265" x2="940" y2="265" stroke="#475569" strokeWidth="1.8" />
                        <line x1="40" y1="295" x2="940" y2="295" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" />
                        <line x1="40" y1="335" x2="940" y2="335" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" />
                        <line x1="40" y1="535" x2="940" y2="535" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" />
                        <line x1="40" y1="45" x2="40" y2="535" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" />
                        <line x1="169" y1="45" x2="169" y2="535" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" />
                        <line x1="289" y1="45" x2="289" y2="535" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" />
                        <line x1="409" y1="45" x2="409" y2="535" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" />
                        <line x1="540" y1="45" x2="540" y2="535" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" />
                        <rect x="150" y="245" width="370" height="40" rx="20" fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 4" />
                        <path d="M 940 375 C 880 375, 840 430, 840 510" fill="none" stroke="#475569" strokeWidth="1.2" />
                        <path d="M 940 395 C 890 395, 840 445, 840 510" fill="none" stroke="#475569" strokeWidth="1.2" />
                        <path d="M 940 415 C 900 415, 840 460, 840 510" fill="none" stroke="#475569" strokeWidth="1.2" />
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
                        
                        {/* Moving 3D Volumetric AGV Vehicle */}
                        <g transform={`translate(${movingAgvPos.x}, ${movingAgvPos.y})`}>
                          {viewMode === '3D' ? (
                            <>
                              {/* 3D AGV Shadow */}
                              <rect x="-18" y="-6" width="36" height="20" rx="5" fill="rgba(0,0,0,0.25)" />
                              {/* 3D Extruded Body */}
                              <rect x="-20" y="-18" width="40" height="20" rx="6" fill="#000000" stroke="#38bdf8" strokeWidth="1.8" />
                              <rect x="-16" y="-22" width="32" height="14" rx="4" fill="#1e293b" />
                              <text x="0" y="-12" fill="#ffffff" fontSize="10" fontWeight="500" textAnchor="middle">78</text>
                              <circle cx="12" cy="-18" r="3" fill="#22c55e" />
                            </>
                          ) : (
                            <>
                              <rect x="-18" y="-10" width="36" height="20" rx="5" fill="#000000" stroke="#38bdf8" strokeWidth="1.5" />
                              <text x="0" y="4" fill="#ffffff" fontSize="10" fontWeight="500" textAnchor="middle">78</text>
                              <circle cx="14" cy="-7" r="2.5" fill="#22c55e" />
                            </>
                          )}
                        </g>
                        <g transform="translate(169, 140)">
                          <rect x="-14" y="-8" width="28" height="16" rx="4" fill="#000000" />
                          <text x="0" y="3" fill="#ffffff" fontSize="9" fontWeight="500" textAnchor="middle">94</text>
                        </g>
                        <g transform="translate(289, 140)">
                          <rect x="-14" y="-8" width="28" height="16" rx="4" fill="#000000" />
                          <text x="0" y="3" fill="#ffffff" fontSize="9" fontWeight="500" textAnchor="middle">234</text>
                        </g>
                        <g transform="translate(409, 140)">
                          <rect x="-14" y="-8" width="28" height="16" rx="4" fill="#000000" />
                          <text x="0" y="3" fill="#ffffff" fontSize="9" fontWeight="500" textAnchor="middle">59</text>
                        </g>
                        <g transform="translate(540, 200)">
                          <rect x="-14" y="-8" width="28" height="16" rx="4" fill="#000000" />
                          <text x="0" y="3" fill="#ffffff" fontSize="9" fontWeight="500" textAnchor="middle">98</text>
                        </g>
                        <g transform="translate(350, 265)">
                          <rect x="-14" y="-8" width="28" height="16" rx="4" fill="#000000" />
                          <text x="0" y="3" fill="#ffffff" fontSize="9" fontWeight="500" textAnchor="middle">178</text>
                        </g>
                        <g transform="translate(470, 265)">
                          <rect x="-14" y="-8" width="28" height="16" rx="4" fill="#000000" />
                          <text x="0" y="3" fill="#ffffff" fontSize="9" fontWeight="500" textAnchor="middle">283</text>
                        </g>
                        <g transform="translate(289, 440)">
                          <rect x="-14" y="-8" width="28" height="16" rx="4" fill="#000000" />
                          <text x="0" y="3" fill="#ffffff" fontSize="9" fontWeight="500" textAnchor="middle">114</text>
                        </g>
                        <g transform="translate(40, 200)">
                          <rect x="-12" y="-16" width="24" height="14" rx="3" fill="#000000" />
                          <text x="0" y="-6" fill="#ffffff" fontSize="8" fontWeight="500" textAnchor="middle">198</text>
                          <rect x="-12" y="2" width="24" height="14" rx="3" fill="#000000" />
                          <text x="0" y="12" fill="#ffffff" fontSize="8" fontWeight="500" textAnchor="middle">209</text>
                        </g>
                        <g transform="translate(620, 45)">
                          <rect x="-30" y="-10" width="18" height="20" rx="4" fill="#ffffff" stroke="#000000" strokeWidth="1.5"/>
                          <text x="-21" y="4" fill="#000000" fontSize="11" fontWeight="normal" textAnchor="middle">⚡</text>
                          <rect x="-8" y="-9" width="24" height="18" rx="4" fill="#000000" />
                          <text x="4" y="3" fill="#ffffff" fontSize="9" fontWeight="500" textAnchor="middle">96</text>
                          <rect x="20" y="-9" width="26" height="18" rx="4" fill="#000000" />
                          <text x="33" y="3" fill="#ffffff" fontSize="9" fontWeight="500" textAnchor="middle">234</text>
                        </g>
                        <g transform="translate(80, 265)">
                          <rect x="-12" y="-12" width="24" height="24" rx="6" fill="#ffffff" stroke="#000000" strokeWidth="1.5"/>
                          <text x="0" y="4" fill="#000000" fontSize="12" fontWeight="normal" textAnchor="middle">⚡</text>
                        </g>
                        <g transform="translate(920, 460)">
                          <rect x="-12" y="-12" width="24" height="24" rx="6" fill="#ffffff" stroke="#000000" strokeWidth="1.5"/>
                          <text x="0" y="4" fill="#000000" fontSize="12" fontWeight="normal" textAnchor="middle">⚡</text>
                        </g>
                        <g transform="translate(640, 180)">
                          <rect x="-12" y="-12" width="24" height="24" rx="6" fill="#ffffff" stroke="#000000" strokeWidth="1.5"/>
                          <text x="0" y="4" fill="#000000" fontSize="11" fontWeight="normal" textAnchor="middle">🛍️</text>
                          <circle cx="10" cy="-10" r="5" fill="#000000" />
                          <text x="10" y="-7" fill="#ffffff" fontSize="8" fontWeight="normal" textAnchor="middle">!</text>
                        </g>
                      </svg>
                    </div>

                    {/* MAP CONTROLS OVERLAY */}
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
                      <div style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        padding: '0.3rem 0.7rem',
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        color: '#000000',
                      }}>
                        10 m <span style={{ color: '#94a3b8', fontWeight: 400 }}>| 50 ft</span>
                      </div>

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
                            fontWeight: viewMode === '2D' ? 500 : 400,
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
                            fontWeight: viewMode === '3D' ? 500 : 400,
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
              </>
            )}

            {/* TAB VIEW 2: PRODUCTION MANAGEMENT VIEW WITH GRADIENT AREA CHARTS */}
            {activeNavTab === 'Production Management' && (
              <div className="fms-no-scrollbar" style={{ padding: '1.2rem', backgroundColor: '#f8fafc', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.8rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 500, color: '#000000', margin: 0 }}>Production Line Orchestration & Work Orders</h3>
                    <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0.2rem 0 0' }}>Real-time line balancing, batch throughput tracking, and active assembly work orders.</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.6rem' }}>
                    <button style={{ padding: '0.5rem 1rem', backgroundColor: '#000000', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 500, cursor: 'pointer' }}>+ Create Work Order</button>
                    <span style={{ padding: '0.5rem 0.9rem', backgroundColor: '#22c55e15', color: '#16a34a', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 500, display: 'flex', alignItems: 'center' }}>● Shift 1 Active</span>
                  </div>
                </div>

                <div className="fms-grid-4col" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.8rem' }}>
                  {[
                    { label: 'Active Work Orders', val: '24 Jobs', change: '+3 today', color: '#22c55e', data: [15, 18, 14, 20, 19, 22, 24], id: 'pm-1' },
                    { label: 'CNC Spindle Load', val: '94.2%', change: 'Optimal', color: '#0284c7', data: [80, 85, 82, 90, 88, 92, 94], id: 'pm-2' },
                    { label: 'Robotic Arc Precision', val: '99.94%', change: 'ISO Certified', color: '#16a34a', data: [98, 99, 99.2, 99.5, 99.8, 99.94], id: 'pm-3' },
                    { label: 'Target Output Rate', val: '4,200 pcs/hr', change: '+12.5% vs target', color: '#6366f1', data: [3200, 3500, 3700, 3900, 4100, 4200], id: 'pm-4' },
                  ].map((stat) => (
                    <div key={stat.id} style={{ backgroundColor: '#ffffff', padding: '1.2rem', borderRadius: '12px', border: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.4rem' }}>{stat.label}</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 500, color: '#000000' }}>{stat.val}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '0.8rem' }}>
                        <div style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 400 }}>{stat.change}</div>
                        <Sparkline color={stat.color} data={stat.data} width={90} height={32} id={stat.id} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Filter Bar */}
                <div className="fms-no-scrollbar" style={{ display: 'flex', gap: '0.6rem', marginBottom: '1rem', overflowX: 'auto' }}>
                  {['ALL', 'IN PROGRESS', 'COMPLETED', 'QUEUED'].map(f => (
                    <button
                      key={f}
                      onClick={() => setWoFilter(f)}
                      style={{
                        padding: '0.4rem 0.8rem',
                        fontSize: '0.75rem',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        backgroundColor: woFilter === f ? '#000000' : '#ffffff',
                        color: woFilter === f ? '#ffffff' : '#000000',
                        cursor: 'pointer',
                        fontWeight: 500,
                      }}>
                      {f}
                    </button>
                  ))}
                </div>

                <div className="fms-table-wrap fms-no-scrollbar" style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #cbd5e1', padding: '1.2rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 500, color: '#000000', marginBottom: '1rem' }}>Active Work Orders Queue</h4>
                  <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                        <th style={{ padding: '0.6rem 0' }}>Job ID</th>
                        <th>Component Description</th>
                        <th>Assigned Cell</th>
                        <th>Target Qty</th>
                        <th>Completed</th>
                        <th>Efficiency</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: 'WO-8902', desc: 'Aerospace Turbine Flange CNC-04', cell: 'Cell 4 (5-Axis)', target: '500 pcs', comp: '412 pcs', eff: '98.4%', status: 'In Progress' },
                        { id: 'WO-8903', desc: 'Robotic Chassis Arc Weld Pack', cell: 'Welding Rig A', target: '1,200 pcs', comp: '1,150 pcs', eff: '99.1%', status: 'In Progress' },
                        { id: 'WO-8904', desc: 'AGV Heavy Structural Plate', cell: 'Laser Cutter 2', target: '300 pcs', comp: '300 pcs', eff: '100%', status: 'Completed' },
                        { id: 'WO-8905', desc: 'High-Temperature Manifold 3D', cell: 'Additive Rig 01', target: '150 pcs', comp: '45 pcs', eff: '96.2%', status: 'In Progress' },
                      ].map((row) => (
                        <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '0.8rem 0', fontWeight: 500, color: '#000000' }}>{row.id}</td>
                          <td style={{ color: '#334155' }}>{row.desc}</td>
                          <td style={{ color: '#64748b' }}>{row.cell}</td>
                          <td>{row.target}</td>
                          <td>{row.comp}</td>
                          <td style={{ fontWeight: 500, color: '#000000' }}>{row.eff}</td>
                          <td>
                            <span style={{
                              padding: '0.2rem 0.6rem',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 500,
                              backgroundColor: row.status === 'Completed' ? '#dcfce7' : '#e0f2fe',
                              color: row.status === 'Completed' ? '#15803d' : '#0369a1',
                            }}>{row.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB VIEW 3: MACHINE MONITORING VIEW WITH SPARKLINE GRAPHS */}
            {activeNavTab === 'Machine Monitoring' && (
              <div className="fms-no-scrollbar" style={{ padding: '1.2rem', backgroundColor: '#f8fafc', overflowY: 'auto' }}>
                <div style={{ marginBottom: '1.2rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 500, color: '#000000', margin: 0 }}>CNC & Robotic Equipment Telemetry</h3>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0.2rem 0 0' }}>Live spindle speed, thermal sensors, vibration diagnostics, and tooling lifecycle meters.</p>
                </div>

                <div className="fms-grid-3col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.2rem' }}>
                  {[
                    { name: '5-Axis CNC Centre #01', spindle: '12,000 RPM', temp: '42.5°C', vibration: '0.02 mm/s', toolWear: '14%', status: 'Running', color: '#22c55e', data: [10, 11, 11.5, 12, 11.9, 12], id: 'mm-1' },
                    { name: '5-Axis CNC Centre #02', spindle: '11,800 RPM', temp: '44.1°C', vibration: '0.03 mm/s', toolWear: '22%', status: 'Running', color: '#0284c7', data: [10, 10.8, 11.2, 11.8, 11.6, 11.8], id: 'mm-2' },
                    { name: 'Laser Cutting Cell A', spindle: 'N/A (Fiber Laser)', temp: '38.0°C', vibration: '0.01 mm/s', toolWear: '8%', status: 'Running', color: '#16a34a', data: [35, 36, 37, 38, 38, 38], id: 'mm-3' },
                    { name: 'Robotic Arc Weld Cell 1', spindle: 'N/A (Robotics)', temp: '49.2°C', vibration: '0.04 mm/s', toolWear: '31%', status: 'Running', color: '#f59e0b', data: [40, 42, 45, 47, 49, 49.2], id: 'mm-4' },
                    { name: 'Industrial SLA 3D Printer', spindle: 'Heater 210°C', temp: '55.0°C', vibration: '0.00 mm/s', toolWear: '4%', status: 'Running', color: '#6366f1', data: [200, 205, 208, 210, 210, 210], id: 'mm-5' },
                    { name: 'CMM Precision Scanner', spindle: 'Calibration OK', temp: '20.1°C', vibration: '0.00 mm/s', toolWear: '0%', status: 'Standby', color: '#64748b', data: [20, 20.1, 20.1, 20.1, 20.1], id: 'mm-6' },
                  ].map((m) => (
                    <div key={m.id} style={{ backgroundColor: '#ffffff', padding: '1.2rem', borderRadius: '14px', border: '1px solid #cbd5e1' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: 500, color: '#000000' }}>{m.name}</span>
                        <span style={{ fontSize: '0.7rem', fontWeight: 500, padding: '0.2rem 0.5rem', backgroundColor: '#dcfce7', color: '#15803d', borderRadius: '4px' }}>{m.status}</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
                        <div>Spindle Speed: <span style={{ color: '#000', fontWeight: 500 }}>{m.spindle}</span></div>
                        <div>Thermal Temp: <span style={{ color: '#000', fontWeight: 500 }}>{m.temp}</span></div>
                        <div>Vibration Index: <span style={{ color: '#000', fontWeight: 500 }}>{m.vibration}</span></div>
                      </div>
                      
                      {/* Gradient Area Chart for Spindle/Thermal Telemetry */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>24h Telemetry</span>
                        <Sparkline color={m.color} data={m.data} width={100} height={28} id={m.id} />
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', marginBottom: '0.3rem' }}>
                          <span>Tool Wear Index</span>
                          <span>{m.toolWear}</span>
                        </div>
                        <div style={{ height: '4px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: m.toolWear, height: '100%', backgroundColor: '#000000' }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB VIEW 4: MES WITH ROUTING SPARKLINE CHARTS */}
            {activeNavTab === 'MES' && (
              <div className="fms-no-scrollbar" style={{ padding: '1.2rem', backgroundColor: '#f8fafc', overflowY: 'auto' }}>
                <div style={{ marginBottom: '1.2rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 500, color: '#000000', margin: 0 }}>Manufacturing Execution System (MES)</h3>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0.2rem 0 0' }}>Step-by-step routing, shop floor dispatch rules, component genealogy, and serial lot tracking.</p>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '1.2rem', borderRadius: '14px', border: '1px solid #cbd5e1' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 500, color: '#000000', marginBottom: '1rem' }}>Active Workstation Routing Execution</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    {[
                      { step: 'Step 10: Laser Sheet Metal Blanking', machine: 'Laser Cutter Cell A', duration: '4.5 min', operator: 'Auto-Feed', status: 'Completed', color: '#22c55e', data: [6, 5.2, 4.8, 4.5], id: 'mes-1' },
                      { step: 'Step 20: 5-Axis Precision Milling', machine: 'CNC Centre #01', duration: '18.2 min', operator: 'Auto-Rigging', status: 'In Progress', color: '#0284c7', data: [22, 20, 19, 18.2], id: 'mes-2' },
                      { step: 'Step 30: Automated Ultrasonic Cleaning', machine: 'Wash Tank 2', duration: '6.0 min', operator: 'AGV-489 Transfer', status: 'Queued', color: '#64748b', data: [8, 7.5, 6.8, 6.0], id: 'mes-3' },
                      { step: 'Step 40: CMM Dimensional Inspection', machine: 'Scanner Cell', duration: '3.0 min', operator: 'Quality Tech', status: 'Queued', color: '#6366f1', data: [4, 3.8, 3.2, 3.0], id: 'mes-4' },
                    ].map((s) => (
                      <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem 1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#000000' }}>{s.step}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>Machine: {s.machine} · Tech: {s.operator}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                          <Sparkline color={s.color} data={s.data} width={80} height={26} id={s.id} />
                          <span style={{ fontSize: '0.78rem', color: '#475569' }}>{s.duration}</span>
                          <span style={{ fontSize: '0.72rem', fontWeight: 500, padding: '0.2rem 0.6rem', borderRadius: '4px', backgroundColor: s.status === 'Completed' ? '#dcfce7' : s.status === 'In Progress' ? '#e0f2fe' : '#f1f5f9', color: s.status === 'Completed' ? '#15803d' : s.status === 'In Progress' ? '#0369a1' : '#64748b' }}>{s.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB VIEW 5: INVENTORY WITH STOCK TREND CHARTS */}
            {activeNavTab === 'Inventory/Warehouse' && (
              <div className="fms-no-scrollbar" style={{ padding: '1.2rem', backgroundColor: '#f8fafc', overflowY: 'auto' }}>
                <div style={{ marginBottom: '1.2rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 500, color: '#000000', margin: 0 }}>Automated Warehouse & Storage Pods (ASRS)</h3>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0.2rem 0 0' }}>8 High-density storage pods (480 storage bins), raw material stock levels, and AGV buffer inventory.</p>
                </div>

                <div className="fms-grid-4col" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.2rem' }}>
                  {[
                    { pod: 'Pod 1 (Aluminum Alloy Stock)', bins: '60/60 Bins Full', level: 100, color: '#22c55e', data: [80, 85, 90, 95, 100], id: 'inv-1' },
                    { pod: 'Pod 2 (Titanium Billets)', bins: '54/60 Bins Full', level: 90, color: '#0284c7', data: [75, 80, 82, 88, 90], id: 'inv-2' },
                    { pod: 'Pod 3 (Fasteners & Fittings)', bins: '48/60 Bins Full', level: 80, color: '#16a34a', data: [65, 70, 75, 78, 80], id: 'inv-3' },
                    { pod: 'Pod 4 (Finished Hydraulics)', bins: '58/60 Bins Full', level: 96, color: '#6366f1', data: [85, 88, 92, 94, 96], id: 'inv-4' },
                    { pod: 'Pod 5 (Electronic Sub-assemblies)', bins: '42/60 Bins Full', level: 70, color: '#f59e0b', data: [50, 55, 60, 68, 70], id: 'inv-5' },
                    { pod: 'Pod 6 (Raw Carbon Sheet)', bins: '60/60 Bins Full', level: 100, color: '#22c55e', data: [90, 92, 95, 98, 100], id: 'inv-6' },
                    { pod: 'Pod 7 (Buffer Station East)', bins: '30/60 Bins Full', level: 50, color: '#0284c7', data: [40, 42, 45, 48, 50], id: 'inv-7' },
                    { pod: 'Pod 8 (Buffer Station West)', bins: '24/60 Bins Full', level: 40, color: '#64748b', data: [30, 32, 35, 38, 40], id: 'inv-8' },
                  ].map((p) => (
                    <div key={p.id} style={{ backgroundColor: '#ffffff', padding: '1.2rem', borderRadius: '12px', border: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#000000', marginBottom: '0.4rem' }}>{p.pod}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.8rem' }}>{p.bins}</div>
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Occupancy Rate</span>
                          <Sparkline color={p.color} data={p.data} width={70} height={24} id={p.id} />
                        </div>
                        <div style={{ height: '6px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${p.level}%`, height: '100%', backgroundColor: '#000000', borderRadius: '4px' }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB VIEW 6: QUALITY MANAGEMENT WITH TREND AREA CHARTS */}
            {activeNavTab === 'Quality Management' && (
              <div className="fms-no-scrollbar" style={{ padding: '1.2rem', backgroundColor: '#f8fafc', overflowY: 'auto' }}>
                <div style={{ marginBottom: '1.2rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 500, color: '#000000', margin: 0 }}>Quality Assurance & Zero-Defect Telemetry</h3>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0.2rem 0 0' }}>Automated Optical Inspection (AOI), acoustic flaw detection, and Six-Sigma PPM tracking.</p>
                </div>

                <div className="fms-grid-3col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.4rem' }}>
                  <div style={{ backgroundColor: '#ffffff', padding: '1.4rem', borderRadius: '14px', border: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.4rem' }}>First Pass Yield (FPY)</div>
                      <div style={{ fontSize: '2rem', fontWeight: 500, color: '#000000' }}>99.94%</div>
                      <div style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '0.4rem' }}>Target &gt; 99.8%</div>
                    </div>
                    <div style={{ marginTop: '1rem' }}>
                      <Sparkline color="#22c55e" data={[99.1, 99.3, 99.5, 99.7, 99.8, 99.94]} width={200} height={45} id="qm-1" />
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#ffffff', padding: '1.4rem', borderRadius: '14px', border: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.4rem' }}>Defect Rate (PPM)</div>
                      <div style={{ fontSize: '2rem', fontWeight: 500, color: '#000000' }}>0.02 PPM</div>
                      <div style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '0.4rem' }}>World-Class Aerospace Standard</div>
                    </div>
                    <div style={{ marginTop: '1rem' }}>
                      <Sparkline color="#0284c7" data={[0.5, 0.4, 0.2, 0.1, 0.05, 0.02]} width={200} height={45} id="qm-2" />
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#ffffff', padding: '1.4rem', borderRadius: '14px', border: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.4rem' }}>CMM Calibration Accuracy</div>
                      <div style={{ fontSize: '2rem', fontWeight: 500, color: '#000000' }}>Passed</div>
                      <div style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '0.4rem' }}>NIST Traceable</div>
                    </div>
                    <div style={{ marginTop: '1rem' }}>
                      <Sparkline color="#16a34a" data={[98, 99, 99.5, 99.9, 100, 100]} width={200} height={45} id="qm-3" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB VIEW 7: MAINTENANCE WITH VIBRATION SPECTRUM CHARTS */}
            {activeNavTab === 'Maintenance' && (
              <div className="fms-no-scrollbar" style={{ padding: '1.2rem', backgroundColor: '#f8fafc', overflowY: 'auto' }}>
                <div style={{ marginBottom: '1.2rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 500, color: '#000000', margin: 0 }}>Predictive & Preventive Maintenance</h3>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0.2rem 0 0' }}>AI vibration analysis, spindle lubrication alerts, and scheduled downtime prevention.</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { task: 'CNC Centre #01 - Spindle Lubrication', due: 'In 48 Hours', status: 'Scheduled', color: '#0284c7', data: [80, 82, 85, 88, 92], id: 'mt-1' },
                    { task: 'AGV-489 - Drive Wheel Tread Inspection', due: 'In 120 Hours', status: 'Scheduled', color: '#6366f1', data: [60, 65, 70, 75, 80], id: 'mt-2' },
                    { task: 'Laser Cutter Optics Cleaning', due: 'Completed Today', status: 'Completed', color: '#22c55e', data: [90, 95, 98, 100, 100], id: 'mt-3' },
                  ].map((m) => (
                    <div key={m.id} style={{ backgroundColor: '#ffffff', padding: '1.2rem', borderRadius: '12px', border: '1px solid #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 500, color: '#000000' }}>{m.task}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>Due: {m.due}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <Sparkline color={m.color} data={m.data} width={100} height={30} id={m.id} />
                        <span style={{ padding: '0.3rem 0.8rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 500, backgroundColor: m.status === 'Completed' ? '#dcfce7' : '#f1f5f9', color: m.status === 'Completed' ? '#15803d' : '#000000' }}>{m.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB VIEW 8: WORKFORCE MANAGEMENT WITH ERGONOMIC LOAD CHARTS */}
            {activeNavTab === 'Workforce Management' && (
              <div className="fms-no-scrollbar" style={{ padding: '1.2rem', backgroundColor: '#f8fafc', overflowY: 'auto' }}>
                <div style={{ marginBottom: '1.2rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 500, color: '#000000', margin: 0 }}>Workforce & Operator Safety Management</h3>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0.2rem 0 0' }}>Operator certifications, shift scheduling, safety badge telemetry, and ergonomic load tracking.</p>
                </div>

                <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #cbd5e1', padding: '1.2rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 500, color: '#000000', marginBottom: '1rem' }}>Shift 1 Active Operators Roster (12 On Floor)</h4>
                  <div className="fms-grid-3col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    {[
                      { name: 'Sarah Jenkins', role: 'Robotics Lead', station: 'AGV Fleet Control', badge: 'Active', color: '#22c55e', data: [90, 92, 94, 96, 98], id: 'wf-1' },
                      { name: 'Michael Chen', role: 'CNC Machinist', station: 'Cell 4 (5-Axis)', badge: 'Active', color: '#0284c7', data: [85, 88, 90, 92, 95], id: 'wf-2' },
                      { name: 'Elena Rostova', role: 'Quality Inspector', station: 'CMM Scanner Cell', badge: 'Active', color: '#6366f1', data: [92, 94, 95, 98, 99], id: 'wf-3' },
                    ].map((op) => (
                      <div key={op.id} style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '0.88rem', fontWeight: 500, color: '#000000' }}>{op.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>{op.role} · {op.station}</div>
                        </div>
                        <Sparkline color={op.color} data={op.data} width={75} height={26} id={op.id} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB VIEW 9: PRODUCTION SCHEDULING WITH TIMELINE SPARKLINE CHARTS */}
            {activeNavTab === 'Production Scheduling' && (
              <div className="fms-no-scrollbar" style={{ padding: '1.2rem', backgroundColor: '#f8fafc', overflowY: 'auto' }}>
                <div style={{ marginBottom: '1.2rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 500, color: '#000000', margin: 0 }}>Production Timeline & Job Scheduling Engine</h3>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0.2rem 0 0' }}>Automated job sequencing, changeover minimization, and order priority dispatching.</p>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '1.2rem', borderRadius: '14px', border: '1px solid #cbd5e1' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 500, color: '#000000', marginBottom: '1rem' }}>Interactive Shift Schedule Matrix</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    {[
                      { job: 'Job #901 - Aerospace Flange Batch', line: 'CNC Line A', start: '08:00', end: '12:30', status: 'Active', color: '#22c55e', data: [30, 45, 60, 75, 90], id: 'ps-1' },
                      { job: 'Job #902 - AGV Chassis Welding Pack', line: 'Weld Line B', start: '10:00', end: '15:00', status: 'Active', color: '#0284c7', data: [20, 35, 50, 65, 80], id: 'ps-2' },
                      { job: 'Job #903 - Medical Manifold 3D Print', line: 'Additive Line 01', start: '13:00', end: '18:00', status: 'Scheduled', color: '#64748b', data: [0, 10, 20, 25, 30], id: 'ps-3' },
                    ].map((j) => (
                      <div key={j.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem 1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#000000' }}>{j.job}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>Line: {j.line} · Time: {j.start} - {j.end}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                          <Sparkline color={j.color} data={j.data} width={90} height={28} id={j.id} />
                          <span style={{ fontSize: '0.72rem', fontWeight: 500, padding: '0.2rem 0.6rem', borderRadius: '4px', backgroundColor: j.status === 'Active' ? '#e0f2fe' : '#f1f5f9', color: j.status === 'Active' ? '#0369a1' : '#64748b' }}>{j.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB VIEW 10: ANALYTICS & REPORTING WITH LARGE AREA TREND CHARTS */}
            {activeNavTab === 'Analytics & Reporting' && (
              <div className="fms-no-scrollbar" style={{ padding: '1.2rem', backgroundColor: '#f8fafc', overflowY: 'auto' }}>
                <div style={{ marginBottom: '1.2rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 500, color: '#000000', margin: 0 }}>OEE & Factory Analytics</h3>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0.2rem 0 0' }}>Overall Equipment Effectiveness, AGV utilization metrics, and energy efficiency analytics.</p>
                </div>

                <div className="fms-grid-3col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                  <div style={{ backgroundColor: '#ffffff', padding: '1.4rem', borderRadius: '14px', border: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.4rem' }}>Overall Equipment Effectiveness (OEE)</div>
                      <div style={{ fontSize: '2rem', fontWeight: 500, color: '#000000' }}>94.8%</div>
                      <div style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '0.4rem', fontWeight: 500 }}>+2.4% vs last month</div>
                    </div>
                    <div style={{ marginTop: '1rem' }}>
                      <Sparkline color="#22c55e" data={[88, 90, 91.5, 93, 94, 94.8]} width={200} height={45} id="ar-1" />
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#ffffff', padding: '1.4rem', borderRadius: '14px', border: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.4rem' }}>AGV Fleet Utilization</div>
                      <div style={{ fontSize: '2rem', fontWeight: 500, color: '#000000' }}>91.2%</div>
                      <div style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '0.4rem', fontWeight: 500 }}>Optimal Efficiency</div>
                    </div>
                    <div style={{ marginTop: '1rem' }}>
                      <Sparkline color="#0284c7" data={[82, 85, 87, 89, 90.5, 91.2]} width={200} height={45} id="ar-2" />
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#ffffff', padding: '1.4rem', borderRadius: '14px', border: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.4rem' }}>Energy Cost Optimization</div>
                      <div style={{ fontSize: '2rem', fontWeight: 500, color: '#000000' }}>-38.5%</div>
                      <div style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '0.4rem', fontWeight: 500 }}>AI Smart Grid Active</div>
                    </div>
                    <div style={{ marginTop: '1rem' }}>
                      <Sparkline color="#6366f1" data={[-10, -18, -25, -30, -35, -38.5]} width={200} height={45} id="ar-3" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB VIEW 11: USER & ROLE MANAGEMENT WITH API TELEMETRY SPARKLINE */}
            {activeNavTab === 'User & Role Management' && (
              <div className="fms-no-scrollbar" style={{ padding: '1.2rem', backgroundColor: '#f8fafc', overflowY: 'auto' }}>
                <div style={{ marginBottom: '1.2rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 500, color: '#000000', margin: 0 }}>Access Control & Security Roles</h3>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0.2rem 0 0' }}>Role-based access matrix, administrator privileges, and API security key control.</p>
                </div>

                <div className="fms-table-wrap fms-no-scrollbar" style={{ backgroundColor: '#ffffff', padding: '1.2rem', borderRadius: '14px', border: '1px solid #cbd5e1' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 500, color: '#000000', marginBottom: '1rem' }}>User Access Permissions Matrix</h4>
                  <table style={{ width: '100%', minWidth: '550px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                        <th style={{ padding: '0.6rem 0' }}>Role Name</th>
                        <th>Assigned Users</th>
                        <th>Floor Override</th>
                        <th>FMS Config</th>
                        <th>Security Token</th>
                        <th>Auth Telemetry</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { role: 'Administrator', count: '2 Users', override: 'Allowed', config: 'Full Access', token: 'Active RSA-4096', color: '#22c55e', data: [95, 98, 99, 100], id: 'ur-1' },
                        { role: 'Robotics Engineer', count: '4 Users', override: 'Allowed', config: 'Fleet Only', token: 'Active RSA-2048', color: '#0284c7', data: [90, 92, 95, 98], id: 'ur-2' },
                        { role: 'Shift Supervisor', count: '3 Users', override: 'Restricted', config: 'Read-Only', token: 'Active', color: '#64748b', data: [85, 88, 90, 92], id: 'ur-3' },
                        { role: 'Shop Floor Operator', count: '12 Users', override: 'Disabled', config: 'Disabled', token: 'Basic Badge', color: '#6366f1', data: [98, 99, 99, 100], id: 'ur-4' },
                      ].map((r) => (
                        <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '0.8rem 0', fontWeight: 500, color: '#000000' }}>{r.role}</td>
                          <td>{r.count}</td>
                          <td>{r.override}</td>
                          <td>{r.config}</td>
                          <td><span style={{ color: '#16a34a', fontWeight: 500 }}>{r.token}</span></td>
                          <td>
                            <Sparkline color={r.color} data={r.data} width={70} height={22} id={r.id} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB VIEW 12: ERP/PLC INTEGRATION WITH LATENCY TREND CHARTS */}
            {activeNavTab === 'ERP/PLC Integration' && (
              <div className="fms-no-scrollbar" style={{ padding: '1.2rem', backgroundColor: '#f8fafc', overflowY: 'auto' }}>
                <div style={{ marginBottom: '1.2rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 500, color: '#000000', margin: 0 }}>Enterprise ERP & OPC-UA PLC Gateways</h3>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0.2rem 0 0' }}>Sub-millisecond Industrial Ethernet sync between SAP/Oracle ERP and Siemens/Rockwell PLC gateways.</p>
                </div>

                <div className="fms-grid-3col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.2rem' }}>
                  {[
                    { name: 'SAP S/4HANA ERP Connector', protocol: 'REST / OData', latency: '12ms', status: 'Connected', color: '#0284c7', data: [18, 16, 14, 13, 12], id: 'erp-1' },
                    { name: 'Siemens S7-1500 PLC Gateway', protocol: 'OPC-UA', latency: '2ms', status: 'Connected', color: '#22c55e', data: [5, 4, 3, 2.5, 2], id: 'erp-2' },
                    { name: 'Rockwell ControlLogix PLC', protocol: 'EtherNet/IP', latency: '3ms', status: 'Connected', color: '#16a34a', data: [6, 5, 4, 3.5, 3], id: 'erp-3' },
                  ].map((g) => (
                    <div key={g.id} style={{ backgroundColor: '#ffffff', padding: '1.2rem', borderRadius: '14px', border: '1px solid #cbd5e1' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 500, color: '#000000', marginBottom: '0.4rem' }}>{g.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.8rem' }}>Protocol: {g.protocol} · Latency: {g.latency}</div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Packet Latency Trend</span>
                        <Sparkline color={g.color} data={g.data} width={90} height={26} id={g.id} />
                      </div>

                      <span style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 500, backgroundColor: '#dcfce7', color: '#15803d' }}>● {g.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}

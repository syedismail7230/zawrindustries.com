'use client';

import React, { useState } from 'react';

export default function FactoryOSMapSection() {
  const [hoveredNode, setHoveredNode] = useState<{ side: 'left' | 'right'; index: number } | null>(null);

  // 9 Left Nodes split into 2 staggered columns
  const leftNodes = [
    { title: 'PRODUCTION', desc: 'Work orders & scheduling', col: 1, row: 0 },
    { title: 'MACHINE MONITORING', desc: 'Status & downtime telemetry', col: 2, row: 0 },
    { title: 'QUALITY CONTROL', desc: 'Inspections & zero-defects', col: 1, row: 1 },
    { title: 'MAINTENANCE', desc: 'Preventive work orders', col: 2, row: 1 },
    { title: 'INVENTORY & WAREHOUSE', desc: 'Stock & material tracking', col: 1, row: 2 },
    { title: 'WORKFORCE MANAGEMENT', desc: 'Shifts & operator safety', col: 2, row: 2 },
    { title: 'EQUIPMENT & ASSETS', desc: 'Lifecycle & calibration', col: 1, row: 3 },
    { title: 'LOGISTICS & SHIPPING', desc: 'Dispatch & fleet routing', col: 2, row: 3 },
    { title: 'ENERGY MANAGEMENT', desc: 'Smart grid cost optimization', col: 1, row: 4 },
  ];

  // 9 Right Nodes split into 2 staggered columns
  const rightNodes = [
    { title: 'REAL-TIME VISIBILITY', desc: 'Live factory telemetry', col: 2, row: 0 },
    { title: 'UNIFIED DASHBOARD', desc: 'All KPIs in one view', col: 1, row: 0 },
    { title: 'SMART ALERTS', desc: 'Instant critical notifications', col: 2, row: 1 },
    { title: 'ANALYTICS & REPORTS', desc: 'Data-driven insights', col: 1, row: 1 },
    { title: 'DATA-DRIVEN DECISIONS', desc: 'Faster smart operations', col: 2, row: 2 },
    { title: 'SCALABLE & SECURE', desc: 'Enterprise security & scale', col: 1, row: 2 },
    { title: 'INTEGRATED ECOSYSTEM', desc: 'Zero silo ERP/PLC sync', col: 2, row: 3 },
    { title: 'AUTOMATED WORKFLOWS', desc: 'End-to-end efficiency', col: 1, row: 3 },
    { title: 'MAXIMUM EFFICIENCY', desc: 'Higher throughput output', col: 2, row: 4 },
  ];

  // Compact viewBox geometry (1440px width x 420px height)
  // Left Column 1 (Outer): xDot = 180, textEnd = 165
  // Left Column 2 (Inner): xDot = 440, textEnd = 425
  // Center Hub: x = 720, y = 200
  // Right Column 1 (Inner): xDot = 1000, textStart = 1015
  // Right Column 2 (Outer): xDot = 1260, textStart = 1275

  const centerHubX = 720;
  const centerHubY = 200;
  const leftAnchorX = 580;
  const rightAnchorX = 860;

  // Staggered Y calculation
  // Col 1 (Outer - 5 items): y = 35 + row * 82
  // Col 2 (Inner - 4 items): y = 76 + row * 82
  const getLeftNodePos = (col: number, row: number) => {
    const xDot = col === 1 ? 190 : 440;
    const xText = col === 1 ? 175 : 425;
    const y = col === 1 ? (35 + row * 82) : (76 + row * 82);
    return { xDot, xText, y };
  };

  const getRightNodePos = (col: number, row: number) => {
    const xDot = col === 1 ? 1000 : 1250;
    const xText = col === 1 ? 1015 : 1265;
    const y = col === 1 ? (76 + row * 82) : (35 + row * 82);
    return { xDot, xText, y };
  };

  return (
    <section style={{
      padding: 'clamp(3.5rem, 6vw, 5rem) 2%',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <style>{`
        @media (max-width: 1024px) {
          .os-map-crisscross-desktop {
            display: none !important;
          }
          .os-map-mobile-stack {
            display: flex !important;
          }
        }
        @media (min-width: 1025px) {
          .os-map-mobile-stack {
            display: none !important;
          }
        }
        .os-crisscross-group {
          cursor: pointer;
          transition: opacity 0.2s ease;
        }
      `}</style>

      <div style={{ maxWidth: '1480px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 500,
            letterSpacing: '0.16em',
            color: '#64748b',
            textTransform: 'uppercase',
            display: 'inline-block',
            marginBottom: '0.6rem',
          }}>
            UNIFIED OPERATING PLATFORM
          </span>
          
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3.8vw, 2.8rem)',
            fontWeight: 300,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            color: '#000000',
            marginBottom: '0.6rem',
          }}>
            Real-Time Visibility. Unified Control. Smarter Decisions.
          </h2>

          <p style={{ fontSize: '0.95rem', color: '#64748b', maxWidth: '680px', margin: '0 auto', fontWeight: 300 }}>
            Connect all factory sub-systems into one autonomous intelligence engine.
          </p>
        </div>

        {/* DESKTOP 2-COLUMN STAGGERED CRISSCROSS MAP (COMPACT 420px HEIGHT) */}
        <div className="os-map-crisscross-desktop" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1440 420"
            style={{ maxWidth: '1440px', height: 'auto', overflow: 'visible' }}
          >
            {/* 1. LEFT BEZIER CURVES: Connecting Staggered Left Dots to Center Anchor */}
            {leftNodes.map((node, i) => {
              const { xDot, y } = getLeftNodePos(node.col, node.row);
              const isHovered = hoveredNode?.side === 'left' && hoveredNode?.index === i;
              const isAnyHovered = hoveredNode !== null;

              // Sweep curve smoothly from staggered xDot to center anchor
              const pathD = `M ${xDot} ${y} C ${xDot + (node.col === 1 ? 180 : 80)} ${y}, ${leftAnchorX - 50} ${centerHubY}, ${leftAnchorX} ${centerHubY}`;

              return (
                <g key={`l-curve-${i}`}>
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#000000"
                    strokeWidth={isHovered ? "2.5" : "1.2"}
                    opacity={isHovered ? 1 : isAnyHovered ? 0.15 : 0.75}
                    style={{ transition: 'all 0.2s ease' }}
                  />
                  <circle r={isHovered ? "3.5" : "2.2"} fill="#000000" opacity={isAnyHovered && !isHovered ? 0.2 : 1}>
                    <animateMotion path={pathD} dur={`${3.2 + i * 0.2}s`} repeatCount="indefinite" />
                  </circle>
                </g>
              );
            })}

            {/* 2. LEFT STAGGERED TEXT NODES & CONNECTION DOTS */}
            {leftNodes.map((node, i) => {
              const { xDot, xText, y } = getLeftNodePos(node.col, node.row);
              const isHovered = hoveredNode?.side === 'left' && hoveredNode?.index === i;
              const isAnyHovered = hoveredNode !== null;

              return (
                <g
                  key={`l-node-${i}`}
                  className="os-crisscross-group"
                  onMouseEnter={() => setHoveredNode({ side: 'left', index: i })}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ opacity: isAnyHovered && !isHovered ? 0.35 : 1, transition: 'opacity 0.2s ease' }}
                >
                  {/* Title */}
                  <text
                    x={xText}
                    y={y - 4}
                    textAnchor="end"
                    fill="#000000"
                    fontSize="11.5"
                    fontWeight={isHovered ? "700" : "600"}
                    letterSpacing="0.04em"
                  >
                    {node.title}
                  </text>
                  {/* Subtitle */}
                  <text
                    x={xText}
                    y={y + 11}
                    textAnchor="end"
                    fill="#64748b"
                    fontSize="10"
                    fontWeight="300"
                  >
                    {node.desc}
                  </text>
                  {/* Connection Node Dot */}
                  <circle cx={xDot} cy={y} r={isHovered ? "4.5" : "3.2"} fill="#000000" style={{ transition: 'all 0.2s ease' }} />
                </g>
              );
            })}

            {/* 3. CENTER HUB: ZAWR FMS (Majestic Orbit Ring & Clean Typography) */}
            <g transform={`translate(${centerHubX}, ${centerHubY})`}>
              <circle cx="0" cy="0" r="55" fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="0" cy="0" r="42" fill="none" stroke="#f1f5f9" strokeWidth="1" />

              <text x="0" y="-14" textAnchor="middle" fill="#000000" fontSize="26" fontWeight="700" letterSpacing="-0.02em">
                ZAWR
              </text>
              <text x="0" y="8" textAnchor="middle" fill="#000000" fontSize="15" fontWeight="600" letterSpacing="0.1em">
                FMS
              </text>

              <line x1="-30" y1="18" x2="30" y2="18" stroke="#e2e8f0" strokeWidth="1" />

              <text x="0" y="32" textAnchor="middle" fill="#64748b" fontSize="9.5" fontWeight="300">
                One Platform.
              </text>
            </g>

            {/* Center Anchors */}
            <circle cx={leftAnchorX} cy={centerHubY} r="5" fill="#000000" />
            <circle cx={rightAnchorX} cy={centerHubY} r="5" fill="#000000" />

            {/* Center-to-Right Connector Arrow */}
            <path d={`M ${rightAnchorX} ${centerHubY} L ${rightAnchorX + 45} ${centerHubY}`} fill="none" stroke="#000000" strokeWidth="1.5" />
            <polygon points={`${rightAnchorX + 45},${centerHubY - 4} ${rightAnchorX + 53},${centerHubY} ${rightAnchorX + 45},${centerHubY + 4}`} fill="#000000" />

            {/* 4. RIGHT BEZIER CURVES: Fanning out from Arrow to Staggered Right Dots */}
            {rightNodes.map((node, i) => {
              const { xDot, y } = getRightNodePos(node.col, node.row);
              const isHovered = hoveredNode?.side === 'right' && hoveredNode?.index === i;
              const isAnyHovered = hoveredNode !== null;

              const pathD = `M ${rightAnchorX + 53} ${centerHubY} C ${rightAnchorX + 90} ${centerHubY}, ${xDot - (node.col === 1 ? 80 : 180)} ${y}, ${xDot} ${y}`;

              return (
                <g key={`r-curve-${i}`}>
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#000000"
                    strokeWidth={isHovered ? "2.5" : "1.2"}
                    opacity={isHovered ? 1 : isAnyHovered ? 0.15 : 0.75}
                    style={{ transition: 'all 0.2s ease' }}
                  />
                  <circle r={isHovered ? "3.5" : "2.2"} fill="#000000" opacity={isAnyHovered && !isHovered ? 0.2 : 1}>
                    <animateMotion path={pathD} dur={`${3.2 + i * 0.2}s`} repeatCount="indefinite" />
                  </circle>
                </g>
              );
            })}

            {/* 5. RIGHT STAGGERED TEXT NODES & CONNECTION DOTS */}
            {rightNodes.map((node, i) => {
              const { xDot, xText, y } = getRightNodePos(node.col, node.row);
              const isHovered = hoveredNode?.side === 'right' && hoveredNode?.index === i;
              const isAnyHovered = hoveredNode !== null;

              return (
                <g
                  key={`r-node-${i}`}
                  className="os-crisscross-group"
                  onMouseEnter={() => setHoveredNode({ side: 'right', index: i })}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ opacity: isAnyHovered && !isHovered ? 0.35 : 1, transition: 'opacity 0.2s ease' }}
                >
                  {/* Connection Node Dot */}
                  <circle cx={xDot} cy={y} r={isHovered ? "4.5" : "3.2"} fill="#000000" style={{ transition: 'all 0.2s ease' }} />
                  
                  {/* Title */}
                  <text
                    x={xText}
                    y={y - 4}
                    textAnchor="start"
                    fill="#000000"
                    fontSize="11.5"
                    fontWeight={isHovered ? "700" : "600"}
                    letterSpacing="0.04em"
                  >
                    {node.title}
                  </text>
                  {/* Subtitle */}
                  <text
                    x={xText}
                    y={y + 11}
                    textAnchor="start"
                    fill="#64748b"
                    fontSize="10"
                    fontWeight="300"
                  >
                    {node.desc}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* MOBILE RESPONSIVE LIST (< 1025px) */}
        <div className="os-map-mobile-stack" style={{ flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* Mobile Center Hub Text */}
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#000000', letterSpacing: '-0.02em' }}>ZAWR</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#000000', marginTop: '0.2rem', letterSpacing: '0.1em' }}>FMS</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.6rem', fontWeight: 300 }}>One Platform. Unlimited Control.</div>
          </div>

          {/* Mobile Sub-systems List */}
          <div>
            <h4 style={{ fontSize: '0.82rem', fontWeight: 600, color: '#000000', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Integrated Sub-Systems</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {leftNodes.map((n) => (
                <div key={n.title} style={{ paddingBottom: '0.5rem', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#000000' }}>{n.title}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem', fontWeight: 300 }}>{n.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Capabilities List */}
          <div>
            <h4 style={{ fontSize: '0.82rem', fontWeight: 600, color: '#000000', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Core Capabilities</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {rightNodes.map((n) => (
                <div key={n.title} style={{ paddingBottom: '0.5rem', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#000000' }}>{n.title}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem', fontWeight: 300 }}>{n.desc}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* BOTTOM CALL TO ACTION */}
        <div style={{
          textAlign: 'center',
          marginTop: '3rem',
          paddingTop: '2.5rem',
          borderTop: '1px solid #e2e8f0',
        }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 500,
            letterSpacing: '0.14em',
            color: '#64748b',
            textTransform: 'uppercase',
            display: 'inline-block',
            marginBottom: '0.8rem',
          }}>
            BUILT FOR MODERN MANUFACTURING
          </span>

          <h3 style={{
            fontSize: 'clamp(1.5rem, 3.2vw, 2.4rem)',
            fontWeight: 300,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            color: '#000000',
            marginBottom: '0.6rem',
          }}>
            One platform to run your entire factory.
          </h3>

          <p style={{
            fontSize: '0.95rem',
            color: '#64748b',
            marginBottom: '1.8rem',
            fontWeight: 300,
          }}>
            Integrate. Automate. Optimize.
          </p>

          <a
            href="/contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.85rem 2.2rem',
              borderRadius: '50px',
              backgroundColor: '#000000',
              color: '#ffffff',
              fontSize: '0.88rem',
              fontWeight: 500,
              textDecoration: 'none',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
            }}
          >
            <span>Book a demo</span>
            <span style={{ fontSize: '0.95rem' }}>→</span>
          </a>
        </div>

      </div>
    </section>
  );
}

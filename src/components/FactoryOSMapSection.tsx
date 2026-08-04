'use client';

import React, { useState } from 'react';

export default function FactoryOSMapSection() {
  const [hoveredNode, setHoveredNode] = useState<{ side: 'left' | 'right'; index: number } | null>(null);

  // 9 Left Nodes: Staggered across 2 columns (Outer at xDot=200, Inner at xDot=410)
  const leftNodes = [
    { title: 'PRODUCTION', desc: 'Work orders & scheduling', isOuter: true, y: 40 },
    { title: 'MACHINE MONITORING', desc: 'Status & downtime telemetry', isOuter: false, y: 85 },
    { title: 'QUALITY CONTROL', desc: 'Inspections & zero-defects', isOuter: true, y: 130 },
    { title: 'MAINTENANCE', desc: 'Preventive work orders', isOuter: false, y: 175 },
    { title: 'INVENTORY & WAREHOUSE', desc: 'Stock & material tracking', isOuter: true, y: 220 },
    { title: 'WORKFORCE MANAGEMENT', desc: 'Shifts & operator safety', isOuter: false, y: 265 },
    { title: 'EQUIPMENT & ASSETS', desc: 'Lifecycle & calibration', isOuter: true, y: 310 },
    { title: 'LOGISTICS & SHIPPING', desc: 'Dispatch & fleet routing', isOuter: false, y: 355 },
    { title: 'ENERGY MANAGEMENT', desc: 'Smart grid cost optimization', isOuter: true, y: 400 },
  ];

  // 9 Right Nodes: Staggered across 2 columns (Inner at xDot=970, Outer at xDot=1180)
  const rightNodes = [
    { title: 'REAL-TIME VISIBILITY', desc: 'Live factory telemetry', isOuter: true, y: 40 },
    { title: 'UNIFIED DASHBOARD', desc: 'All KPIs in one view', isOuter: false, y: 85 },
    { title: 'SMART ALERTS', desc: 'Instant critical notifications', isOuter: true, y: 130 },
    { title: 'ANALYTICS & REPORTS', desc: 'Data-driven insights', isOuter: false, y: 175 },
    { title: 'DATA-DRIVEN DECISIONS', desc: 'Faster smart operations', isOuter: true, y: 220 },
    { title: 'SCALABLE & SECURE', desc: 'Enterprise security & scale', isOuter: false, y: 265 },
    { title: 'INTEGRATED ECOSYSTEM', desc: 'Zero silo ERP/PLC sync', isOuter: true, y: 310 },
    { title: 'AUTOMATED WORKFLOWS', desc: 'End-to-end efficiency', isOuter: false, y: 355 },
    { title: 'MAXIMUM EFFICIENCY', desc: 'Higher throughput output', isOuter: true, y: 400 },
  ];

  // Canvas Geometry: 1380x440
  const centerHubX = 690;
  const centerHubY = 220;
  const leftAnchorX = 550;
  const rightAnchorX = 830;
  const arrowTipX = 865;

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
          .os-map-connected-desktop {
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
        .os-connected-group {
          cursor: pointer;
          transition: opacity 0.2s ease;
        }
      `}</style>

      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        
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

        {/* DESKTOP FULLY CONNECTED STAGGERED MAP (440px HEIGHT, ALL 18 NODES CONNECTED WITH SOLID LINES) */}
        <div className="os-map-connected-desktop" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1380 440"
            style={{ maxWidth: '1380px', height: 'auto', overflow: 'visible' }}
          >
            {/* 1. LEFT BEZIER CURVES: Connecting all 9 Left Nodes directly to Left Anchor */}
            {leftNodes.map((node, i) => {
              const xDot = node.isOuter ? 200 : 410;
              const isHovered = hoveredNode?.side === 'left' && hoveredNode?.index === i;
              const isAnyHovered = hoveredNode !== null;

              // Outer curves sweep smoothly through vertical gaps between inner text rows
              const pathD = node.isOuter
                ? `M ${xDot} ${node.y} C ${xDot + 160} ${node.y}, ${leftAnchorX - 60} ${centerHubY}, ${leftAnchorX} ${centerHubY}`
                : `M ${xDot} ${node.y} C ${xDot + 60} ${node.y}, ${leftAnchorX - 40} ${centerHubY}, ${leftAnchorX} ${centerHubY}`;

              return (
                <g key={`l-path-${i}`}>
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#000000"
                    strokeWidth={isHovered ? "2.5" : "1.3"}
                    opacity={isHovered ? 1 : isAnyHovered ? 0.15 : 0.8}
                    style={{ transition: 'all 0.2s ease' }}
                  />
                  {/* Moving signal particle along line */}
                  <circle r={isHovered ? "3.5" : "2.2"} fill="#000000" opacity={isAnyHovered && !isHovered ? 0.2 : 1}>
                    <animateMotion path={pathD} dur={`${3 + i * 0.25}s`} repeatCount="indefinite" />
                  </circle>
                </g>
              );
            })}

            {/* 2. LEFT TEXT LABELS & CONNECTION DOTS (All 9 items fully connected) */}
            {leftNodes.map((node, i) => {
              const xDot = node.isOuter ? 200 : 410;
              const xText = node.isOuter ? 185 : 395;
              const isHovered = hoveredNode?.side === 'left' && hoveredNode?.index === i;
              const isAnyHovered = hoveredNode !== null;

              return (
                <g
                  key={`l-node-${i}`}
                  className="os-connected-group"
                  onMouseEnter={() => setHoveredNode({ side: 'left', index: i })}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ opacity: isAnyHovered && !isHovered ? 0.35 : 1, transition: 'opacity 0.2s ease' }}
                >
                  {/* Connection Node Dot */}
                  <circle cx={xDot} cy={node.y} r={isHovered ? "4.5" : "3.2"} fill="#000000" style={{ transition: 'all 0.2s ease' }} />

                  {/* Title */}
                  <text
                    x={xText}
                    y={node.y - 4}
                    textAnchor="end"
                    fill="#000000"
                    fontSize="11"
                    fontWeight={isHovered ? "700" : "600"}
                    letterSpacing="0.04em"
                  >
                    {node.title}
                  </text>
                  {/* Subtitle */}
                  <text
                    x={xText}
                    y={node.y + 11}
                    textAnchor="end"
                    fill="#64748b"
                    fontSize="9.5"
                    fontWeight="300"
                  >
                    {node.desc}
                  </text>
                </g>
              );
            })}

            {/* 3. CENTER HUB: ZAWR FMS */}
            <g transform={`translate(${centerHubX}, ${centerHubY})`}>
              <circle cx="0" cy="0" r="54" fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="0" cy="0" r="42" fill="none" stroke="#f1f5f9" strokeWidth="1" />

              <text x="0" y="-12" textAnchor="middle" fill="#000000" fontSize="25" fontWeight="700" letterSpacing="-0.02em">
                ZAWR
              </text>
              <text x="0" y="8" textAnchor="middle" fill="#000000" fontSize="14" fontWeight="600" letterSpacing="0.1em">
                FMS
              </text>

              <line x1="-25" y1="17" x2="25" y2="17" stroke="#cbd5e1" strokeWidth="1" />

              <text x="0" y="30" textAnchor="middle" fill="#64748b" fontSize="9" fontWeight="300">
                One Platform.
              </text>
            </g>

            {/* Center Anchors */}
            <circle cx={leftAnchorX} cy={centerHubY} r="4.5" fill="#000000" />
            <circle cx={rightAnchorX} cy={centerHubY} r="4.5" fill="#000000" />

            {/* Center-to-Right Connector Arrow */}
            <path d={`M ${rightAnchorX} ${centerHubY} L ${arrowTipX - 8} ${centerHubY}`} fill="none" stroke="#000000" strokeWidth="1.5" />
            <polygon points={`${arrowTipX - 8},${centerHubY - 4} ${arrowTipX},${centerHubY} ${arrowTipX - 8},${centerHubY + 4}`} fill="#000000" />

            {/* 4. RIGHT BEZIER CURVES: Connecting all 9 Right Nodes directly from Arrow Tip */}
            {rightNodes.map((node, i) => {
              const xDot = node.isOuter ? 1180 : 970;
              const isHovered = hoveredNode?.side === 'right' && hoveredNode?.index === i;
              const isAnyHovered = hoveredNode !== null;

              const pathD = node.isOuter
                ? `M ${arrowTipX} ${centerHubY} C ${arrowTipX + 60} ${centerHubY}, ${xDot - 160} ${node.y}, ${xDot} ${node.y}`
                : `M ${arrowTipX} ${centerHubY} C ${arrowTipX + 40} ${centerHubY}, ${xDot - 60} ${node.y}, ${xDot} ${node.y}`;

              return (
                <g key={`r-path-${i}`}>
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#000000"
                    strokeWidth={isHovered ? "2.5" : "1.3"}
                    opacity={isHovered ? 1 : isAnyHovered ? 0.15 : 0.8}
                    style={{ transition: 'all 0.2s ease' }}
                  />
                  <circle r={isHovered ? "3.5" : "2.2"} fill="#000000" opacity={isAnyHovered && !isHovered ? 0.2 : 1}>
                    <animateMotion path={pathD} dur={`${3 + i * 0.25}s`} repeatCount="indefinite" />
                  </circle>
                </g>
              );
            })}

            {/* 5. RIGHT TEXT LABELS & CONNECTION DOTS (All 9 items fully connected) */}
            {rightNodes.map((node, i) => {
              const xDot = node.isOuter ? 1180 : 970;
              const xText = node.isOuter ? 1195 : 985;
              const isHovered = hoveredNode?.side === 'right' && hoveredNode?.index === i;
              const isAnyHovered = hoveredNode !== null;

              return (
                <g
                  key={`r-node-${i}`}
                  className="os-connected-group"
                  onMouseEnter={() => setHoveredNode({ side: 'right', index: i })}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ opacity: isAnyHovered && !isHovered ? 0.35 : 1, transition: 'opacity 0.2s ease' }}
                >
                  {/* Connection Node Dot */}
                  <circle cx={xDot} cy={node.y} r={isHovered ? "4.5" : "3.2"} fill="#000000" style={{ transition: 'all 0.2s ease' }} />

                  {/* Title */}
                  <text
                    x={xText}
                    y={node.y - 4}
                    textAnchor="start"
                    fill="#000000"
                    fontSize="11"
                    fontWeight={isHovered ? "700" : "600"}
                    letterSpacing="0.04em"
                  >
                    {node.title}
                  </text>
                  {/* Subtitle */}
                  <text
                    x={xText}
                    y={node.y + 11}
                    textAnchor="start"
                    fill="#64748b"
                    fontSize="9.5"
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
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#000000', letterSpacing: '-0.02em' }}>ZAWR</div>
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

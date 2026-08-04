'use client';

import React, { useState } from 'react';

export default function FactoryOSMapSection() {
  const [hoveredIndex, setHoveredIndex] = useState<{ side: 'left' | 'right'; index: number } | null>(null);

  const leftNodes = [
    { title: 'PRODUCTION', desc: 'Work orders & scheduling' },
    { title: 'MACHINE MONITORING', desc: 'Status & downtime telemetry' },
    { title: 'QUALITY CONTROL', desc: 'Inspections & zero-defects' },
    { title: 'MAINTENANCE', desc: 'Preventive work orders' },
    { title: 'INVENTORY & WAREHOUSE', desc: 'Stock & material tracking' },
    { title: 'WORKFORCE MANAGEMENT', desc: 'Shifts & operator safety' },
    { title: 'EQUIPMENT & ASSETS', desc: 'Lifecycle & calibration' },
    { title: 'LOGISTICS & SHIPPING', desc: 'Dispatch & fleet routing' },
    { title: 'ENERGY MANAGEMENT', desc: 'Smart grid cost optimization' },
  ];

  const rightNodes = [
    { title: 'REAL-TIME VISIBILITY', desc: 'Live factory telemetry' },
    { title: 'UNIFIED DASHBOARD', desc: 'All KPIs in one view' },
    { title: 'SMART ALERTS', desc: 'Instant critical notifications' },
    { title: 'ANALYTICS & REPORTS', desc: 'Data-driven insights' },
    { title: 'DATA-DRIVEN DECISIONS', desc: 'Faster smart operations' },
    { title: 'SCALABLE & SECURE', desc: 'Enterprise security & scale' },
    { title: 'INTEGRATED ECOSYSTEM', desc: 'Zero silo ERP/PLC sync' },
    { title: 'AUTOMATED WORKFLOWS', desc: 'End-to-end efficiency' },
    { title: 'MAXIMUM EFFICIENCY', desc: 'Higher throughput output' },
  ];

  // Compact 1280x380 SVG Canvas Geometry
  // Left Text Zone: x = 20..260
  // Left Dots: x = 275
  // Left Bezier Curves: x = 275..530 (Pure open space, zero text!)
  // Center Hub (ZAWR FMS): x = 640, y = 190
  // Right Bezier Curves: x = 750..1005 (Pure open space, zero text!)
  // Right Dots: x = 1005
  // Right Text Zone: x = 1020..1260

  const centerHubX = 640;
  const centerHubY = 190;
  const leftAnchorX = 530;
  const leftDotX = 275;
  const leftTextX = 260;
  const rightAnchorX = 750;
  const rightDotX = 1005;
  const rightTextX = 1020;

  // Y positions for the 9 compact rows (top 30px, 40px step)
  const getY = (index: number) => 30 + index * 40;

  return (
    <section style={{
      padding: 'clamp(3rem, 5vw, 4.5rem) 2%',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <style>{`
        @media (max-width: 1024px) {
          .os-map-guaranteed-desktop {
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
        .os-zero-overlap-group {
          cursor: pointer;
          transition: opacity 0.2s ease;
        }
      `}</style>

      <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.2rem' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 500,
            letterSpacing: '0.16em',
            color: '#64748b',
            textTransform: 'uppercase',
            display: 'inline-block',
            marginBottom: '0.5rem',
          }}>
            UNIFIED OPERATING PLATFORM
          </span>
          
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3.8vw, 2.7rem)',
            fontWeight: 300,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            color: '#000000',
            marginBottom: '0.5rem',
          }}>
            Real-Time Visibility. Unified Control. Smarter Decisions.
          </h2>

          <p style={{ fontSize: '0.95rem', color: '#64748b', maxWidth: '680px', margin: '0 auto', fontWeight: 300 }}>
            Connect all factory sub-systems into one autonomous intelligence engine.
          </p>
        </div>

        {/* DESKTOP ZERO-OVERLAP MAP (COMPACT 380px HEIGHT, ZERO OVERLAP GUARANTEED) */}
        <div className="os-map-guaranteed-desktop" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1280 380"
            style={{ maxWidth: '1280px', height: 'auto', overflow: 'visible' }}
          >
            {/* 1. LEFT BEZIER CURVES: Strictly bounded in open space x = 275..530 */}
            {leftNodes.map((_, i) => {
              const y = getY(i);
              const isHovered = hoveredIndex?.side === 'left' && hoveredIndex?.index === i;
              const isAnyHovered = hoveredIndex !== null;

              const pathD = `M ${leftDotX} ${y} C ${leftDotX + 110} ${y}, ${leftAnchorX - 70} ${centerHubY}, ${leftAnchorX} ${centerHubY}`;

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
                  {/* Moving signal particle */}
                  <circle r={isHovered ? "3.5" : "2.2"} fill="#000000" opacity={isAnyHovered && !isHovered ? 0.2 : 1}>
                    <animateMotion path={pathD} dur={`${3 + i * 0.25}s`} repeatCount="indefinite" />
                  </circle>
                </g>
              );
            })}

            {/* 2. LEFT TEXT LABELS & DOTS (Strictly bounded x = 20..275) */}
            {leftNodes.map((node, i) => {
              const y = getY(i);
              const isHovered = hoveredIndex?.side === 'left' && hoveredIndex?.index === i;
              const isAnyHovered = hoveredIndex !== null;

              return (
                <g
                  key={`l-node-${i}`}
                  className="os-zero-overlap-group"
                  onMouseEnter={() => setHoveredIndex({ side: 'left', index: i })}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{ opacity: isAnyHovered && !isHovered ? 0.35 : 1, transition: 'opacity 0.2s ease' }}
                >
                  {/* Node Dot */}
                  <circle cx={leftDotX} cy={y} r={isHovered ? "4.5" : "3.2"} fill="#000000" style={{ transition: 'all 0.2s ease' }} />

                  {/* Title */}
                  <text
                    x={leftTextX}
                    y={y - 3}
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
                    x={leftTextX}
                    y={y + 11}
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
              <circle cx="0" cy="0" r="52" fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="0" cy="0" r="40" fill="none" stroke="#f1f5f9" strokeWidth="1" />

              <text x="0" y="-12" textAnchor="middle" fill="#000000" fontSize="24" fontWeight="700" letterSpacing="-0.02em">
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
            <path d={`M ${rightAnchorX} ${centerHubY} L ${rightAnchorX + 35} ${centerHubY}`} fill="none" stroke="#000000" strokeWidth="1.5" />
            <polygon points={`${rightAnchorX + 35},${centerHubY - 4} ${rightAnchorX + 43},${centerHubY} ${rightAnchorX + 35},${centerHubY + 4}`} fill="#000000" />

            {/* 4. RIGHT BEZIER CURVES: Strictly bounded in open space x = 793..1005 */}
            {rightNodes.map((_, i) => {
              const y = getY(i);
              const isHovered = hoveredIndex?.side === 'right' && hoveredIndex?.index === i;
              const isAnyHovered = hoveredIndex !== null;

              const pathD = `M ${rightAnchorX + 43} ${centerHubY} C ${rightAnchorX + 90} ${centerHubY}, ${rightDotX - 110} ${y}, ${rightDotX} ${y}`;

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

            {/* 5. RIGHT TEXT LABELS & DOTS (Strictly bounded x = 1005..1260) */}
            {rightNodes.map((node, i) => {
              const y = getY(i);
              const isHovered = hoveredIndex?.side === 'right' && hoveredIndex?.index === i;
              const isAnyHovered = hoveredIndex !== null;

              return (
                <g
                  key={`r-node-${i}`}
                  className="os-zero-overlap-group"
                  onMouseEnter={() => setHoveredIndex({ side: 'right', index: i })}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{ opacity: isAnyHovered && !isHovered ? 0.35 : 1, transition: 'opacity 0.2s ease' }}
                >
                  {/* Node Dot */}
                  <circle cx={rightDotX} cy={y} r={isHovered ? "4.5" : "3.2"} fill="#000000" style={{ transition: 'all 0.2s ease' }} />

                  {/* Title */}
                  <text
                    x={rightTextX}
                    y={y - 3}
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
                    x={rightTextX}
                    y={y + 11}
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
          marginTop: '2.5rem',
          paddingTop: '2.2rem',
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

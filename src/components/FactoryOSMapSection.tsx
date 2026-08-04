'use client';

import React, { useState } from 'react';

export default function FactoryOSMapSection() {
  const [hoveredIndex, setHoveredIndex] = useState<{ type: 'left' | 'right' | null; index: number | null }>({ type: null, index: null });

  const leftNodes = [
    { title: 'PRODUCTION', desc: 'Work orders, scheduling, tracking' },
    { title: 'MACHINE MONITORING', desc: 'Machine status, performance, downtime' },
    { title: 'QUALITY CONTROL', desc: 'Inspections, defects, reports' },
    { title: 'MAINTENANCE', desc: 'Preventive maintenance, work orders' },
    { title: 'INVENTORY & WAREHOUSE', desc: 'Raw materials, stock, finished goods' },
    { title: 'WORKFORCE MANAGEMENT', desc: 'Shifts, attendance, performance' },
    { title: 'EQUIPMENT & ASSETS', desc: 'Asset tracking, calibration, lifecycle' },
    { title: 'LOGISTICS & SHIPPING', desc: 'Dispatch, delivery tracking, fleet' },
    { title: 'ENERGY MANAGEMENT', desc: 'Consumption, monitoring, efficiency' },
  ];

  const rightNodes = [
    { title: 'REAL-TIME VISIBILITY', desc: 'Live data from across the factory' },
    { title: 'UNIFIED DASHBOARD', desc: 'All KPIs. One view.' },
    { title: 'SMART ALERTS', desc: 'Critical alerts, instant notifications' },
    { title: 'ANALYTICS & REPORTS', desc: 'Insights that drive outcomes' },
    { title: 'DATA-DRIVEN DECISIONS', desc: 'Make smarter decisions, faster' },
    { title: 'SCALABLE & SECURE', desc: 'Built to scale. Secured by design.' },
    { title: 'INTEGRATED ECOSYSTEM', desc: 'Seamless integrations, no silos' },
    { title: 'AUTOMATED WORKFLOWS', desc: 'Streamline operations end-to-end' },
    { title: 'MAXIMUM EFFICIENCY', desc: 'Lower costs. Higher output.' },
  ];

  // Wide 1300x700 SVG canvas geometry
  const leftTextX = 330;     // Right-aligned text end X
  const leftDotX = 350;      // Left column node dots
  const centerLeftX = 540;   // Left anchor of center hub text
  const centerRightX = 760;  // Right anchor of center hub text
  const rightDotX = 950;     // Right column node dots
  const rightTextX = 970;    // Left-aligned text start X
  const centerY = 350;       // Center hub vertical midpoint

  // Y coordinate for each of the 9 nodes (top padding 50px, 70px step)
  const getY = (index: number) => 50 + index * 70;

  return (
    <section style={{
      padding: 'clamp(4.5rem, 8vw, 7rem) 2%',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <style>{`
        @media (max-width: 1024px) {
          .os-map-svg-desktop {
            display: none !important;
          }
          .os-map-mobile-list {
            display: flex !important;
          }
        }
        @media (min-width: 1025px) {
          .os-map-mobile-list {
            display: none !important;
          }
        }
        .os-text-group {
          cursor: pointer;
          transition: opacity 0.2s ease;
        }
        .os-text-group:hover text {
          fill: #000000 !important;
        }
      `}</style>

      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 500,
            letterSpacing: '0.16em',
            color: '#64748b',
            textTransform: 'uppercase',
            display: 'inline-block',
            marginBottom: '0.8rem',
          }}>
            UNIFIED OPERATING PLATFORM
          </span>
          
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3.8vw, 3rem)',
            fontWeight: 300,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            color: '#000000',
            marginBottom: '0.8rem',
          }}>
            Real-Time Visibility. Unified Control. Smarter Decisions.
          </h2>

          <p style={{ fontSize: '0.98rem', color: '#64748b', maxWidth: '680px', margin: '0 auto', fontWeight: 300 }}>
            Connect all factory sub-systems into one autonomous intelligence engine.
          </p>
        </div>

        {/* DESKTOP MONOCHROME INTERACTIVE SVG ARCHITECTURE MAP */}
        <div className="os-map-svg-desktop" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1300 700"
            style={{ maxWidth: '1300px', height: 'auto', overflow: 'visible' }}
          >
            {/* 1. LEFT BEZIER CURVES: Connecting Left Dots to Center Hub */}
            {leftNodes.map((_, i) => {
              const y = getY(i);
              const isHovered = hoveredIndex.type === 'left' && hoveredIndex.index === i;
              const isAnyHovered = hoveredIndex.type !== null;
              
              // Smooth S-Curve geometry with controlled control points
              const pathD = `M ${leftDotX} ${y} C ${leftDotX + 90} ${y}, ${centerLeftX - 60} ${centerY}, ${centerLeftX} ${centerY}`;
              
              return (
                <g key={`left-curve-${i}`}>
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#000000"
                    strokeWidth={isHovered ? "2.5" : "1.2"}
                    opacity={isHovered ? 1 : isAnyHovered ? 0.15 : 0.75}
                    style={{ transition: 'all 0.25s ease' }}
                  />
                  {/* Moving particle along line */}
                  <circle r={isHovered ? "3.5" : "2.2"} fill="#000000" opacity={isAnyHovered && !isHovered ? 0.2 : 1}>
                    <animateMotion path={pathD} dur={`${3.5 + i * 0.25}s`} repeatCount="indefinite" />
                  </circle>
                </g>
              );
            })}

            {/* 2. LEFT COLUMN: Connection Dots & Interactive Text Group */}
            {leftNodes.map((node, i) => {
              const y = getY(i);
              const isHovered = hoveredIndex.type === 'left' && hoveredIndex.index === i;
              const isAnyHovered = hoveredIndex.type !== null;

              return (
                <g
                  key={`left-node-${i}`}
                  className="os-text-group"
                  onMouseEnter={() => setHoveredIndex({ type: 'left', index: i })}
                  onMouseLeave={() => setHoveredIndex({ type: null, index: null })}
                  style={{ opacity: isAnyHovered && !isHovered ? 0.35 : 1, transition: 'opacity 0.2s ease' }}
                >
                  {/* Title */}
                  <text
                    x={leftTextX}
                    y={y - 5}
                    textAnchor="end"
                    fill="#000000"
                    fontSize="12.5"
                    fontWeight={isHovered ? "700" : "600"}
                    letterSpacing="0.05em"
                  >
                    {node.title}
                  </text>
                  {/* Subtitle */}
                  <text
                    x={leftTextX}
                    y={y + 11}
                    textAnchor="end"
                    fill="#64748b"
                    fontSize="11"
                    fontWeight="300"
                  >
                    {node.desc}
                  </text>
                  {/* Connection Node Dot */}
                  <circle cx={leftDotX} cy={y} r={isHovered ? "5" : "3.5"} fill="#000000" style={{ transition: 'all 0.2s ease' }} />
                </g>
              );
            })}

            {/* 3. CENTER HUB: ZAWR FMS (Majestic Center Ring + Clean Typography) */}
            <g>
              {/* Decorative Subtle Orbit Rings behind text */}
              <circle cx="650" cy={centerY} r="65" fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="650" cy={centerY} r="52" fill="none" stroke="#f1f5f9" strokeWidth="1" />

              {/* Left Anchor Dot */}
              <circle cx={centerLeftX} cy={centerY} r="5.5" fill="#000000" />

              {/* Main Title */}
              <text x="650" y={centerY - 22} textAnchor="middle" fill="#000000" fontSize="30" fontWeight="700" letterSpacing="-0.02em">
                ZAWR
              </text>
              <text x="650" y={centerY + 6} textAnchor="middle" fill="#000000" fontSize="17" fontWeight="600" letterSpacing="0.12em">
                FMS
              </text>
              
              {/* Divider Line */}
              <line x1="615" y1={centerY + 22} x2="685" y2={centerY + 22} stroke="#cbd5e1" strokeWidth="1" />
              
              {/* Tagline */}
              <text x="650" y={centerY + 42} textAnchor="middle" fill="#64748b" fontSize="11.5" fontWeight="300">
                One Platform.
              </text>
              <text x="650" y={centerY + 58} textAnchor="middle" fill="#64748b" fontSize="11.5" fontWeight="300">
                Unlimited Control.
              </text>

              {/* Right Anchor Dot */}
              <circle cx={centerRightX} cy={centerY} r="5.5" fill="#000000" />
            </g>

            {/* 4. CENTER TO RIGHT CONNECTOR ARROW */}
            <path d={`M ${centerRightX} ${centerY} L ${centerRightX + 45} ${centerY}`} fill="none" stroke="#000000" strokeWidth="1.6" />
            <polygon points={`${centerRightX + 45},${centerY - 4} ${centerRightX + 54},${centerY} ${centerRightX + 45},${centerY + 4}`} fill="#000000" />

            {/* 5. RIGHT BEZIER CURVES: Fanning out from Arrow to Right Dots */}
            {rightNodes.map((_, i) => {
              const y = getY(i);
              const isHovered = hoveredIndex.type === 'right' && hoveredIndex.index === i;
              const isAnyHovered = hoveredIndex.type !== null;

              const pathD = `M ${centerRightX + 54} ${centerY} C ${centerRightX + 110} ${centerY}, ${rightDotX - 80} ${y}, ${rightDotX} ${y}`;
              
              return (
                <g key={`right-curve-${i}`}>
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#000000"
                    strokeWidth={isHovered ? "2.5" : "1.2"}
                    opacity={isHovered ? 1 : isAnyHovered ? 0.15 : 0.75}
                    style={{ transition: 'all 0.25s ease' }}
                  />
                  <circle r={isHovered ? "3.5" : "2.2"} fill="#000000" opacity={isAnyHovered && !isHovered ? 0.2 : 1}>
                    <animateMotion path={pathD} dur={`${3.5 + i * 0.25}s`} repeatCount="indefinite" />
                  </circle>
                </g>
              );
            })}

            {/* 6. RIGHT COLUMN: Connection Dots & Interactive Text Group */}
            {rightNodes.map((node, i) => {
              const y = getY(i);
              const isHovered = hoveredIndex.type === 'right' && hoveredIndex.index === i;
              const isAnyHovered = hoveredIndex.type !== null;

              return (
                <g
                  key={`right-node-${i}`}
                  className="os-text-group"
                  onMouseEnter={() => setHoveredIndex({ type: 'right', index: i })}
                  onMouseLeave={() => setHoveredIndex({ type: null, index: null })}
                  style={{ opacity: isAnyHovered && !isHovered ? 0.35 : 1, transition: 'opacity 0.2s ease' }}
                >
                  {/* Connection Node Dot */}
                  <circle cx={rightDotX} cy={y} r={isHovered ? "5" : "3.5"} fill="#000000" style={{ transition: 'all 0.2s ease' }} />
                  
                  {/* Title */}
                  <text
                    x={rightTextX}
                    y={y - 5}
                    textAnchor="start"
                    fill="#000000"
                    fontSize="12.5"
                    fontWeight={isHovered ? "700" : "600"}
                    letterSpacing="0.05em"
                  >
                    {node.title}
                  </text>
                  {/* Subtitle */}
                  <text
                    x={rightTextX}
                    y={y + 11}
                    textAnchor="start"
                    fill="#64748b"
                    fontSize="11"
                    fontWeight="300"
                  >
                    {node.desc}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* MOBILE RESPONSIVE MONOCHROME LIST (< 1025px) */}
        <div className="os-map-mobile-list" style={{ flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* Mobile Center Hub Text */}
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#000000', letterSpacing: '-0.02em' }}>ZAWR</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#000000', marginTop: '0.2rem', letterSpacing: '0.1em' }}>FMS</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.6rem', fontWeight: 300 }}>One Platform. Unlimited Control.</div>
          </div>

          {/* Mobile Sub-systems List */}
          <div>
            <h4 style={{ fontSize: '0.82rem', fontWeight: 600, color: '#000000', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Integrated Sub-Systems</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.2rem' }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.2rem' }}>
              {rightNodes.map((n) => (
                <div key={n.title} style={{ paddingBottom: '0.5rem', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#000000' }}>{n.title}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem', fontWeight: 300 }}>{n.desc}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* BOTTOM CALL TO ACTION (Monochrome) */}
        <div style={{
          textAlign: 'center',
          marginTop: '4rem',
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

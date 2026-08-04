'use client';

import React from 'react';

export default function FactoryOSMapSection() {
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

  // SVG viewBox geometry parameters (1200px width x 680px height)
  const leftDotX = 320;      // Right edge of left cards
  const centerLeftX = 460;   // Left edge of center hub box
  const centerRightX = 740;  // Right edge of center hub box
  const rightDotX = 880;     // Left edge of right cards
  const centerY = 340;       // Y midpoint of center hub box

  // Y positions for each of the 9 cards (height 52px + 16px gap = 68px step)
  const getY = (index: number) => 68 + index * 68;

  return (
    <section style={{
      padding: 'clamp(4rem, 7vw, 6rem) 2%',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <style>{`
        @media (max-width: 1024px) {
          .os-map-desktop-container {
            display: none !important;
          }
          .os-map-mobile-container {
            display: flex !important;
          }
        }
        @media (min-width: 1025px) {
          .os-map-mobile-container {
            display: none !important;
          }
        }
      `}</style>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{
            fontSize: '0.78rem',
            fontWeight: 500,
            letterSpacing: '0.14em',
            color: '#3b82f6',
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
            color: '#0f172a',
            marginBottom: '0.8rem',
          }}>
            Real-Time Visibility. Unified Control. Smarter Decisions.
          </h2>

          <p style={{ fontSize: '0.98rem', color: '#64748b', maxWidth: '680px', margin: '0 auto', fontWeight: 300 }}>
            Connect all factory sub-systems into one autonomous intelligence engine.
          </p>
        </div>

        {/* DESKTOP INTEGRATED SVG DIAGRAM (100% Connected Lines) */}
        <div className="os-map-desktop-container" style={{ position: 'relative', width: '100%', minHeight: '680px' }}>
          
          {/* SVG Connector Layer behind nodes */}
          <svg
            width="100%"
            height="680"
            viewBox="0 0 1200 680"
            style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none', zIndex: 1 }}
          >
            {/* Left Curves: Funneling 9 Left Nodes into Center Hub Left Anchor */}
            {leftNodes.map((_, i) => {
              const y = getY(i);
              const pathD = `M ${leftDotX} ${y} C ${leftDotX + 80} ${y}, ${centerLeftX - 50} ${centerY}, ${centerLeftX} ${centerY}`;
              return (
                <g key={`l-path-${i}`}>
                  <path d={pathD} fill="none" stroke="#60a5fa" strokeWidth="1.8" opacity="0.85" />
                  {/* Subtle animated pulse along each line */}
                  <circle r="3.5" fill="#2563eb">
                    <animateMotion path={pathD} dur={`${3 + i * 0.3}s`} repeatCount="indefinite" />
                  </circle>
                </g>
              );
            })}

            {/* Center-to-Right Single Line Segment with Arrow indicator */}
            <path d={`M ${centerRightX} ${centerY} L ${centerRightX + 45} ${centerY}`} fill="none" stroke="#2563eb" strokeWidth="2" />
            <polygon points={`${centerRightX + 45},${centerY - 5} ${centerRightX + 54},${centerY} ${centerRightX + 45},${centerY + 5}`} fill="#2563eb" />

            {/* Right Curves: Fanning out from Arrow Split into 9 Right Nodes */}
            {rightNodes.map((_, i) => {
              const y = getY(i);
              const pathD = `M ${centerRightX + 54} ${centerY} C ${centerRightX + 90} ${centerY}, ${rightDotX - 80} ${y}, ${rightDotX} ${y}`;
              return (
                <g key={`r-path-${i}`}>
                  <path d={pathD} fill="none" stroke="#60a5fa" strokeWidth="1.8" opacity="0.85" />
                  <circle r="3.5" fill="#2563eb">
                    <animateMotion path={pathD} dur={`${3 + i * 0.3}s`} repeatCount="indefinite" />
                  </circle>
                </g>
              );
            })}
          </svg>

          {/* HTML DOM Node Cards Overlay (zIndex: 2) */}
          <div style={{ position: 'relative', zIndex: 2, width: '100%', height: '680px' }}>
            
            {/* LEFT CARDS COLUMN */}
            <div style={{ position: 'absolute', left: 0, top: 0, width: '320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {leftNodes.map((node) => (
                <div
                  key={node.title}
                  style={{
                    height: '52px',
                    backgroundColor: '#ffffff',
                    padding: '0.55rem 1rem',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#2563eb';
                    e.currentTarget.style.boxShadow = '0 6px 18px rgba(37, 99, 235, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.03)';
                  }}
                >
                  <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#0f172a', letterSpacing: '0.03em' }}>{node.title}</div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 400 }}>{node.desc}</div>

                  {/* Connected Blue Node Dot */}
                  <div style={{
                    position: 'absolute',
                    right: '-5px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#2563eb',
                    border: '2px solid #ffffff',
                    boxShadow: '0 0 0 1px #93c5fd',
                  }} />
                </div>
              ))}
            </div>

            {/* CENTER HUB BOX: ZAWR FACTORY OS */}
            <div style={{
              position: 'absolute',
              left: '460px',
              top: '230px',
              width: '280px',
              height: '220px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '24px',
              padding: '1.8rem 1.4rem',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(37, 99, 235, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {/* Left Connection Anchor Dot */}
              <div style={{
                position: 'absolute',
                left: '-6px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#2563eb',
                border: '2.5px solid #ffffff',
              }} />

              <div style={{
                fontSize: '2.1rem',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                color: '#0f172a',
                lineHeight: 1.1,
              }}>
                ZAWR
              </div>

              <div style={{
                fontSize: '1.2rem',
                fontWeight: 600,
                color: '#2563eb',
                letterSpacing: '0.06em',
                marginTop: '0.3rem',
                textTransform: 'uppercase',
              }}>
                FACTORY OS
              </div>

              <div style={{
                width: '60%',
                height: '1px',
                backgroundColor: '#e2e8f0',
                margin: '1.1rem 0 0.9rem',
              }} />

              <div style={{
                fontSize: '0.8rem',
                color: '#64748b',
                fontWeight: 400,
                lineHeight: 1.4,
              }}>
                One Platform.<br />
                Unlimited Control.
              </div>

              {/* Right Connection Anchor Dot */}
              <div style={{
                position: 'absolute',
                right: '-6px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#2563eb',
                border: '2.5px solid #ffffff',
              }} />
            </div>

            {/* RIGHT CARDS COLUMN */}
            <div style={{ position: 'absolute', left: '880px', top: 0, width: '320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {rightNodes.map((node) => (
                <div
                  key={node.title}
                  style={{
                    height: '52px',
                    backgroundColor: '#ffffff',
                    padding: '0.55rem 1rem',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#2563eb';
                    e.currentTarget.style.boxShadow = '0 6px 18px rgba(37, 99, 235, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.03)';
                  }}
                >
                  {/* Connected Blue Node Dot */}
                  <div style={{
                    position: 'absolute',
                    left: '-5px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#2563eb',
                    border: '2px solid #ffffff',
                    boxShadow: '0 0 0 1px #93c5fd',
                  }} />

                  <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#0f172a', letterSpacing: '0.03em' }}>{node.title}</div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 400 }}>{node.desc}</div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* MOBILE RESPONSIVE STACK CONTAINER (< 1025px) */}
        <div className="os-map-mobile-container" style={{ flexDirection: 'column', gap: '2rem' }}>
          
          {/* Mobile Center Card */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '20px',
            padding: '2rem 1.5rem',
            textAlign: 'center',
            boxShadow: '0 12px 30px rgba(0,0,0,0.06)',
          }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 600, color: '#0f172a' }}>ZAWR</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#2563eb', marginTop: '0.2rem' }}>FACTORY OS</div>
            <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.6rem' }}>One Platform. Unlimited Control.</div>
          </div>

          {/* Mobile Left Sub-systems List */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#2563eb', marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Integrated Sub-Systems</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.8rem' }}>
              {leftNodes.map((n) => (
                <div key={n.title} style={{ padding: '0.8rem 1rem', backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#0f172a' }}>{n.title}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem' }}>{n.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Right Capabilities List */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#2563eb', marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Core Capabilities</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.8rem' }}>
              {rightNodes.map((n) => (
                <div key={n.title} style={{ padding: '0.8rem 1rem', backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#0f172a' }}>{n.title}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem' }}>{n.desc}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* BOTTOM CALL TO ACTION */}
        <div style={{
          textAlign: 'center',
          marginTop: '4rem',
          paddingTop: '2.5rem',
          borderTop: '1px solid #e2e8f0',
        }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.14em',
            color: '#2563eb',
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
            color: '#0f172a',
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

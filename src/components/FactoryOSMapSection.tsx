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

  // SVG viewBox geometry parameters (1200px width x 640px height)
  const leftDotX = 320;      // Right edge of left text items
  const centerLeftX = 470;   // Left edge of center hub text
  const centerRightX = 730;  // Right edge of center hub text
  const rightDotX = 880;     // Left edge of right text items
  const centerY = 320;       // Y midpoint of center hub

  // Y positions for each of the 9 text items (height 48px + 16px gap = 64px step)
  const getY = (index: number) => 50 + index * 64;

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
          .os-map-bw-desktop {
            display: none !important;
          }
          .os-map-bw-mobile {
            display: flex !important;
          }
        }
        @media (min-width: 1025px) {
          .os-map-bw-mobile {
            display: none !important;
          }
        }
      `}</style>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Section Header (Monochrome Black & White) */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{
            fontSize: '0.78rem',
            fontWeight: 500,
            letterSpacing: '0.14em',
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

        {/* DESKTOP MONOCHROME CONNECTED DIAGRAM (NO CARDS, NO OUTLINES, PURE BLACK & WHITE) */}
        <div className="os-map-bw-desktop" style={{ position: 'relative', width: '100%', minHeight: '640px' }}>
          
          {/* SVG Connector Layer (Pure Black Lines) */}
          <svg
            width="100%"
            height="640"
            viewBox="0 0 1200 640"
            style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none', zIndex: 1 }}
          >
            {/* Left Curves: Funneling 9 Left Nodes into Center Hub Left Anchor */}
            {leftNodes.map((_, i) => {
              const y = getY(i);
              const pathD = `M ${leftDotX} ${y} C ${leftDotX + 80} ${y}, ${centerLeftX - 40} ${centerY}, ${centerLeftX} ${centerY}`;
              return (
                <g key={`l-path-${i}`}>
                  <path d={pathD} fill="none" stroke="#000000" strokeWidth="1.5" opacity="0.75" />
                  <circle r="3" fill="#000000">
                    <animateMotion path={pathD} dur={`${3 + i * 0.3}s`} repeatCount="indefinite" />
                  </circle>
                </g>
              );
            })}

            {/* Center-to-Right Single Line Segment with Arrow indicator */}
            <path d={`M ${centerRightX} ${centerY} L ${centerRightX + 45} ${centerY}`} fill="none" stroke="#000000" strokeWidth="1.8" />
            <polygon points={`${centerRightX + 45},${centerY - 4} ${centerRightX + 53},${centerY} ${centerRightX + 45},${centerY + 4}`} fill="#000000" />

            {/* Right Curves: Fanning out from Arrow Split into 9 Right Nodes */}
            {rightNodes.map((_, i) => {
              const y = getY(i);
              const pathD = `M ${centerRightX + 53} ${centerY} C ${centerRightX + 90} ${centerY}, ${rightDotX - 80} ${y}, ${rightDotX} ${y}`;
              return (
                <g key={`r-path-${i}`}>
                  <path d={pathD} fill="none" stroke="#000000" strokeWidth="1.5" opacity="0.75" />
                  <circle r="3" fill="#000000">
                    <animateMotion path={pathD} dur={`${3 + i * 0.3}s`} repeatCount="indefinite" />
                  </circle>
                </g>
              );
            })}
          </svg>

          {/* HTML DOM Node Text Overlay (NO CARDS, NO OUTLINES) */}
          <div style={{ position: 'relative', zIndex: 2, width: '100%', height: '640px' }}>
            
            {/* LEFT TEXT COLUMN */}
            <div style={{ position: 'absolute', left: 0, top: 0, width: '320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {leftNodes.map((node) => (
                <div
                  key={node.title}
                  style={{
                    height: '48px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    position: 'relative',
                    paddingRight: '1rem',
                  }}
                >
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#000000', letterSpacing: '0.04em' }}>{node.title}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 300, marginTop: '2px' }}>{node.desc}</div>

                  {/* Black Connection Dot */}
                  <div style={{
                    position: 'absolute',
                    right: '-4px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#000000',
                  }} />
                </div>
              ))}
            </div>

            {/* CENTER HUB TEXT (NO CARD BOX, NO OUTLINE) */}
            <div style={{
              position: 'absolute',
              left: '470px',
              top: '210px',
              width: '260px',
              height: '220px',
              backgroundColor: '#ffffff',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
            }}>
              {/* Left Connection Anchor Dot */}
              <div style={{
                position: 'absolute',
                left: '-5px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#000000',
              }} />

              <div style={{
                fontSize: '2.4rem',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                color: '#000000',
                lineHeight: 1.1,
              }}>
                ZAWR
              </div>

              <div style={{
                fontSize: '1.25rem',
                fontWeight: 500,
                color: '#000000',
                letterSpacing: '0.08em',
                marginTop: '0.4rem',
                textTransform: 'uppercase',
              }}>
                FACTORY OS
              </div>

              <div style={{
                width: '50%',
                height: '1px',
                backgroundColor: '#e2e8f0',
                margin: '1.2rem 0 1rem',
              }} />

              <div style={{
                fontSize: '0.82rem',
                color: '#64748b',
                fontWeight: 300,
                lineHeight: 1.4,
              }}>
                One Platform.<br />
                Unlimited Control.
              </div>

              {/* Right Connection Anchor Dot */}
              <div style={{
                position: 'absolute',
                right: '-5px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#000000',
              }} />
            </div>

            {/* RIGHT TEXT COLUMN */}
            <div style={{ position: 'absolute', left: '880px', top: 0, width: '320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {rightNodes.map((node) => (
                <div
                  key={node.title}
                  style={{
                    height: '48px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    position: 'relative',
                    paddingLeft: '1rem',
                  }}
                >
                  {/* Black Connection Dot */}
                  <div style={{
                    position: 'absolute',
                    left: '-4px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#000000',
                  }} />

                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#000000', letterSpacing: '0.04em' }}>{node.title}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 300, marginTop: '2px' }}>{node.desc}</div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* MOBILE RESPONSIVE MONOCHROME STACK CONTAINER (< 1025px) */}
        <div className="os-map-bw-mobile" style={{ flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* Mobile Center Hub Text */}
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '2rem', fontWeight: 600, color: '#000000' }}>ZAWR</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 500, color: '#000000', marginTop: '0.2rem', letterSpacing: '0.06em' }}>FACTORY OS</div>
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

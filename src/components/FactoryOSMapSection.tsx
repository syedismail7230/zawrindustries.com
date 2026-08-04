'use client';

import React, { useState, useEffect } from 'react';

export default function FactoryOSMapSection() {
  const [pulseOffset, setPulseOffset] = useState(0);

  // Animate pulses along bezier lines
  useEffect(() => {
    let animId: number;
    let start: number;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      setPulseOffset((elapsed / 15) % 1000);
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, []);

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

  // Generate Bezier curves connecting left cards to center hub
  const generateLeftPaths = () => {
    const total = leftNodes.length;
    const startX = 240;
    const endX = 460;
    const centerY = 280;

    return leftNodes.map((_, i) => {
      const startY = 40 + i * 58;
      const controlX1 = startX + 110;
      const controlX2 = endX - 80;
      const pathD = `M ${startX} ${startY} C ${controlX1} ${startY}, ${controlX2} ${centerY}, ${endX} ${centerY}`;
      return { pathD, startY };
    });
  };

  // Generate Bezier curves connecting center hub to right cards
  const generateRightPaths = () => {
    const total = rightNodes.length;
    const startX = 540;
    const endX = 760;
    const centerY = 280;

    return rightNodes.map((_, i) => {
      const endY = 40 + i * 58;
      const controlX1 = startX + 80;
      const controlX2 = endX - 110;
      const pathD = `M ${startX} ${centerY} C ${controlX1} ${centerY}, ${controlX2} ${endY}, ${endX} ${endY}`;
      return { pathD, endY };
    });
  };

  const leftPaths = generateLeftPaths();
  const rightPaths = generateRightPaths();

  return (
    <section style={{
      padding: 'clamp(4rem, 8vw, 7rem) 4%',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <style>{`
        @media (max-width: 1024px) {
          .os-map-grid {
            display: flex !important;
            flex-direction: column !important;
            gap: 2rem !important;
          }
          .os-map-svg-layer {
            display: none !important;
          }
          .os-map-col {
            width: 100% !important;
          }
        }
      `}</style>

      <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{
            fontSize: '0.78rem',
            fontWeight: 500,
            letterSpacing: '0.14em',
            color: '#64748b',
            textTransform: 'uppercase',
            display: 'inline-block',
            marginBottom: '1rem',
          }}>
            UNIFIED OPERATING PLATFORM
          </span>
          
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            fontWeight: 300,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            color: '#000000',
            marginBottom: '1rem',
          }}>
            Real-Time Visibility. Unified Control. Smarter Decisions.
          </h2>

          <p style={{ fontSize: '1rem', color: '#64748b', maxWidth: '680px', margin: '0 auto', fontWeight: 300 }}>
            Connect all factory sub-systems into one autonomous intelligence engine.
          </p>
        </div>

        {/* INTERACTIVE CONNECTOR DIAGRAM CONTAINER */}
        <div style={{ position: 'relative', width: '100%' }}>
          
          <div className="os-map-grid" style={{
            display: 'grid',
            gridTemplateColumns: '310px 1fr 310px',
            gap: '1rem',
            alignItems: 'center',
            position: 'relative',
            zIndex: 10,
          }}>
            
            {/* LEFT COLUMN: INPUT MODULES */}
            <div className="os-map-col" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {leftNodes.map((node, i) => (
                <div
                  key={node.title}
                  style={{
                    backgroundColor: '#ffffff',
                    padding: '0.85rem 1.1rem',
                    borderRadius: '14px',
                    border: '1px solid #cbd5e1',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
                    transition: 'all 0.25s ease',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#000000';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <div style={{ fontSize: '0.78rem', fontWeight: 500, color: '#000000', letterSpacing: '0.04em' }}>
                    {node.title}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem', fontWeight: 400 }}>
                    {node.desc}
                  </div>
                  
                  {/* Connection Node Point */}
                  <div style={{
                    position: 'absolute',
                    right: '-6px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#000000',
                    border: '2px solid #ffffff',
                    boxShadow: '0 0 0 1px #cbd5e1',
                  }} />
                </div>
              ))}
            </div>

            {/* CENTER HUB: ZAWR FACTORY OS */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem 1rem',
            }}>
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '24px',
                padding: '3rem 2.2rem',
                textAlign: 'center',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.03)',
                maxWidth: '300px',
                width: '100%',
                position: 'relative',
              }}>
                <div style={{
                  fontSize: '1.9rem',
                  fontWeight: 300,
                  letterSpacing: '-0.02em',
                  color: '#000000',
                  lineHeight: 1.1,
                  fontFamily: 'system-ui, sans-serif',
                }}>
                  ZAWR
                </div>
                
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: 500,
                  color: '#0284c7',
                  letterSpacing: '0.06em',
                  marginTop: '0.4rem',
                  textTransform: 'uppercase',
                }}>
                  FACTORY OS
                </div>

                <div style={{
                  height: '1px',
                  backgroundColor: '#e2e8f0',
                  margin: '1.5rem 0',
                }} />

                <div style={{
                  fontSize: '0.82rem',
                  color: '#64748b',
                  fontWeight: 400,
                  lineHeight: 1.5,
                }}>
                  One Platform.<br />
                  Unlimited Control.
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: OUTPUT CAPABILITIES */}
            <div className="os-map-col" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {rightNodes.map((node, i) => (
                <div
                  key={node.title}
                  style={{
                    backgroundColor: '#ffffff',
                    padding: '0.85rem 1.1rem',
                    borderRadius: '14px',
                    border: '1px solid #cbd5e1',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
                    transition: 'all 0.25s ease',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#000000';
                    e.currentTarget.style.transform = 'translateX(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  {/* Connection Node Point */}
                  <div style={{
                    position: 'absolute',
                    left: '-6px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#0284c7',
                    border: '2px solid #ffffff',
                    boxShadow: '0 0 0 1px #cbd5e1',
                  }} />

                  <div style={{ fontSize: '0.78rem', fontWeight: 500, color: '#000000', letterSpacing: '0.04em' }}>
                    {node.title}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem', fontWeight: 400 }}>
                    {node.desc}
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* BACKGROUND SVG BEZIER CURVE LINES LAYER */}
          <svg
            className="os-map-svg-layer"
            width="1000"
            height="560"
            viewBox="0 0 1000 560"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          >
            {/* Left-to-Center Lines */}
            {leftPaths.map((item, idx) => (
              <g key={`l-${idx}`}>
                <path
                  d={item.pathD}
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="1.5"
                />
                <path
                  d={item.pathD}
                  fill="none"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeDasharray="8 12"
                  strokeDashoffset={-pulseOffset}
                  opacity="0.8"
                />
              </g>
            ))}

            {/* Center-to-Right Lines */}
            {rightPaths.map((item, idx) => (
              <g key={`r-${idx}`}>
                <path
                  d={item.pathD}
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="1.5"
                />
                <path
                  d={item.pathD}
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="2"
                  strokeDasharray="8 12"
                  strokeDashoffset={-pulseOffset}
                  opacity="0.8"
                />
              </g>
            ))}
          </svg>

        </div>

        {/* BOTTOM CTA BLOCK */}
        <div style={{
          textAlign: 'center',
          marginTop: '5rem',
          paddingTop: '3rem',
          borderTop: '1px solid #e2e8f0',
        }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 500,
            letterSpacing: '0.14em',
            color: '#0284c7',
            textTransform: 'uppercase',
            display: 'inline-block',
            marginBottom: '1rem',
          }}>
            BUILT FOR MODERN MANUFACTURING
          </span>

          <h3 style={{
            fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)',
            fontWeight: 300,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            color: '#000000',
            marginBottom: '0.8rem',
          }}>
            One platform to run your entire factory.
          </h3>

          <p style={{
            fontSize: '0.95rem',
            color: '#64748b',
            marginBottom: '2rem',
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
              padding: '0.9rem 2.2rem',
              borderRadius: '50px',
              backgroundColor: '#000000',
              color: '#ffffff',
              fontSize: '0.9rem',
              fontWeight: 500,
              textDecoration: 'none',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
            }}
          >
            <span>Book a demo</span>
            <span style={{ fontSize: '1rem' }}>→</span>
          </a>
        </div>

      </div>
    </section>
  );
}

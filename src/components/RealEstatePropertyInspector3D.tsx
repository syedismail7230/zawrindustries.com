'use client';

import React, { useState, useEffect } from 'react';

interface BuildingFloor {
  id: string;
  name: string;
  type: string;
  occupancy: number;
  temperature: string;
  energyUsage: string;
  status: 'optimal' | 'warning' | 'maintenance';
  tenant: string;
  activeSensors: number;
  description: string;
}

export function RealEstatePropertyInspector3D() {
  const [mounted, setMounted] = useState(false);
  const [selectedFloorId, setSelectedFloorId] = useState<string>('floor-4');
  const [activeTab, setActiveTab] = useState<'telemetry' | 'hvac' | 'tenants' | 'security'>('telemetry');
  const [viewMode3D, setViewMode3D] = useState<'isometric' | 'front' | 'top'>('isometric');

  useEffect(() => {
    setMounted(true);
  }, []);

  const floors: BuildingFloor[] = [
    {
      id: 'rooftop',
      name: 'Rooftop Solar & HVAC Grid',
      type: 'Clean Energy & Infrastructure',
      occupancy: 100,
      temperature: '22.4°C',
      energyUsage: '142 kW (Solar Gen)',
      status: 'optimal',
      tenant: 'Zawr Building Infrastructure',
      activeSensors: 38,
      description: '450kW photovoltaic solar array integrated with AI-driven HVAC chiller loop and IoT weather sensors.'
    },
    {
      id: 'floor-4',
      name: 'Executive Penthouse & Suites',
      type: 'Luxury Residential / Executive',
      occupancy: 94,
      temperature: '21.8°C',
      energyUsage: '38 kW',
      status: 'optimal',
      tenant: 'Enterprise C-Suite & Private Residences',
      activeSensors: 64,
      description: 'Smart biometric access control, radiant climate zoning, automated shading, and touchless concierge integration.'
    },
    {
      id: 'floor-3',
      name: 'Commercial Tech Hub',
      type: 'Grade-A Commercial Office',
      occupancy: 88,
      temperature: '22.1°C',
      energyUsage: '65 kW',
      status: 'optimal',
      tenant: 'Global AI & Cloud Operations',
      activeSensors: 112,
      description: 'High-density smart workspace with automated IAQ (Indoor Air Quality) air filtration and adaptive LED lighting.'
    },
    {
      id: 'floor-2',
      name: 'Financial & Corporate Center',
      type: 'Commercial Office Space',
      occupancy: 96,
      temperature: '22.5°C',
      energyUsage: '58 kW',
      status: 'optimal',
      tenant: 'Institutional Investment Partners',
      activeSensors: 86,
      description: 'Secure financial trading floor infrastructure with redundant power backup and real-time occupancy monitoring.'
    },
    {
      id: 'floor-1',
      name: 'Smart Retail & Atrium',
      type: 'Commercial Retail & Public Concourse',
      occupancy: 82,
      temperature: '23.0°C',
      energyUsage: '72 kW',
      status: 'warning',
      tenant: 'Flagship PropTech Showcase & Dining',
      activeSensors: 140,
      description: 'Automated foot-traffic heatmapping, smart kiosk integration, and touchless parking valet dispatch.'
    },
    {
      id: 'basement',
      name: 'Sub-Level Smart Parking & Storage',
      type: 'Automated Parking & Logistics Hub',
      occupancy: 76,
      temperature: '19.5°C',
      energyUsage: '44 kW',
      status: 'optimal',
      tenant: 'EV Charging Grid & Automated Storage',
      activeSensors: 92,
      description: '64 Ultra-fast EV charging stations, License Plate Recognition (LPR) gates, and automated parcel lockers.'
    }
  ];

  const selectedFloor = floors.find(f => f.id === selectedFloorId) || floors[1];

  if (!mounted) return null;

  const transformStyle = 
    viewMode3D === 'isometric' 
      ? 'rotateX(52deg) rotateZ(-28deg) rotateY(4deg)'
      : viewMode3D === 'front'
      ? 'rotateX(0deg) rotateZ(0deg)'
      : 'rotateX(82deg) rotateZ(0deg)';

  return (
    <section 
      suppressHydrationWarning
      style={{
        backgroundColor: '#05070a',
        color: '#ffffff',
        padding: 'clamp(3rem, 6vw, 6rem) clamp(1rem, 5vw, 6%)',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Background Subtle Mesh */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.03) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1350px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        
        {/* Section Header */}
        <div style={{ marginBottom: '3.5rem', textAlign: 'left' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.6rem',
            padding: '0.4rem 1rem', 
            borderRadius: '999px', 
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            fontSize: '0.82rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#a1a1aa',
            marginBottom: '1.2rem'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
            Property Management &amp; Digital Twin
          </div>
          <h2 style={{
            fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)',
            fontWeight: 300,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            margin: '0 0 1rem 0',
            color: '#ffffff'
          }}>
            AI-Powered Smart Building Telemetry
          </h2>
          <p style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.2rem)',
            color: '#94a3b8',
            maxWidth: '750px',
            fontWeight: 300,
            margin: 0,
            lineHeight: 1.6
          }}>
            Real-time IoT building operating system integrating HVAC climate loops, biometric security, energy optimization, and predictive facility maintenance across commercial and residential portfolios.
          </p>
        </div>

        {/* Main Grid: Interactive 3D Building (Left) + Floor Telemetry Inspector (Right) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '2.5rem',
          alignItems: 'stretch',
        }}>
          
          {/* LEFT: 3D Isometric Building Model */}
          <div style={{
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '540px',
            backdropFilter: 'blur(12px)',
          }}>
            
            {/* View Mode Switcher Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                Interactive Building Blueprint
              </span>

              <div style={{ display: 'flex', gap: '0.4rem', backgroundColor: 'rgba(0,0,0,0.4)', padding: '4px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                {(['isometric', 'front', 'top'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setViewMode3D(mode)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: viewMode3D === mode ? '#ffffff' : 'transparent',
                      color: viewMode3D === mode ? '#000000' : '#94a3b8',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* 3D Extruded Floor Structure Container */}
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              perspective: '1200px',
              padding: '2rem 0',
            }}>
              <div style={{
                position: 'relative',
                width: '260px',
                height: '320px',
                transformStyle: 'preserve-3d',
                transform: transformStyle,
                transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              }}>
                {floors.map((fl, idx) => {
                  const isSelected = fl.id === selectedFloorId;
                  const translateY = idx * -44;

                  return (
                    <div
                      key={fl.id}
                      onClick={() => setSelectedFloorId(fl.id)}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '220px',
                        height: '140px',
                        marginLeft: '-110px',
                        marginTop: '-70px',
                        transform: `translateY(${translateY}px) ${isSelected ? 'scale(1.08) translateZ(18px)' : 'scale(1)'}`,
                        transformStyle: 'preserve-3d',
                        backgroundColor: isSelected 
                          ? 'rgba(59, 130, 246, 0.35)' 
                          : fl.status === 'warning' 
                          ? 'rgba(245, 158, 11, 0.15)' 
                          : 'rgba(255, 255, 255, 0.06)',
                        border: isSelected 
                          ? '2px solid #3b82f6' 
                          : fl.status === 'warning'
                          ? '1px solid rgba(245, 158, 11, 0.5)'
                          : '1px solid rgba(255, 255, 255, 0.18)',
                        borderRadius: '12px',
                        boxShadow: isSelected 
                          ? '0 0 24px rgba(59, 130, 246, 0.4), inset 0 0 16px rgba(59, 130, 246, 0.2)' 
                          : '0 4px 12px rgba(0,0,0,0.5)',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '12px',
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      {/* Floor Indicator Edge */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 700, 
                          color: isSelected ? '#60a5fa' : '#ffffff',
                          letterSpacing: '0.05em'
                        }}>
                          LEVEL {floors.length - idx}
                        </span>
                        <span style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: fl.status === 'warning' ? '#f59e0b' : '#10b981',
                          boxShadow: `0 0 8px ${fl.status === 'warning' ? '#f59e0b' : '#10b981'}`,
                        }} />
                      </div>

                      {/* Floor Label */}
                      <div style={{
                        fontSize: '0.78rem',
                        color: isSelected ? '#ffffff' : '#94a3b8',
                        fontWeight: isSelected ? 600 : 400,
                        lineHeight: 1.2,
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                      }}>
                        {fl.name}
                      </div>

                      {/* Bottom Floor Stats Pill */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.68rem',
                        color: isSelected ? '#bfdbfe' : '#64748b',
                        borderTop: '1px solid rgba(255,255,255,0.08)',
                        paddingTop: '6px'
                      }}>
                        <span>{fl.occupancy}% Occupied</span>
                        <span>{fl.temperature}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Instruction Tip */}
            <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#64748b', marginTop: '1rem' }}>
              💡 Click any floor level in the 3D model to inspect telemetry data
            </div>
          </div>

          {/* RIGHT: Detailed Floor Telemetry & Controls Panel */}
          <div style={{
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            backdropFilter: 'blur(12px)',
          }}>
            
            {/* Header info for selected floor */}
            <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                    {selectedFloor.type}
                  </span>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 400, margin: '0.3rem 0 0.5rem 0', color: '#ffffff' }}>
                    {selectedFloor.name}
                  </h3>
                </div>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: selectedFloor.status === 'warning' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  color: selectedFloor.status === 'warning' ? '#f59e0b' : '#34d399',
                  border: `1px solid ${selectedFloor.status === 'warning' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
                }}>
                  {selectedFloor.status === 'warning' ? '● Attention Needed' : '● Operational Normal'}
                </span>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: '0.5rem 0 0 0', lineHeight: 1.5 }}>
                {selectedFloor.description}
              </p>
            </div>

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.8rem' }}>
              {(['telemetry', 'hvac', 'tenants', 'security'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: activeTab === tab ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                    color: activeTab === tab ? '#ffffff' : '#64748b',
                    fontSize: '0.82rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              
              {/* Telemetry Metric Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '1.2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.4rem' }}>Occupancy Rate</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 600, color: '#ffffff' }}>{selectedFloor.occupancy}%</div>
                  <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '0.6rem', overflow: 'hidden' }}>
                    <div style={{ width: `${selectedFloor.occupancy}%`, height: '100%', backgroundColor: '#3b82f6' }} />
                  </div>
                </div>

                <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '1.2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.4rem' }}>Climate Temp</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 600, color: '#10b981' }}>{selectedFloor.temperature}</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.4rem' }}>Set Point: 22.0°C Target</div>
                </div>

                <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '1.2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.4rem' }}>Power Load</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#60a5fa' }}>{selectedFloor.energyUsage}</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.4rem' }}>Peak Load Balancing Active</div>
                </div>

                <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '1.2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.4rem' }}>Active IoT Sensors</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#a78bfa' }}>{selectedFloor.activeSensors} Node Mesh</div>
                  <div style={{ fontSize: '0.72rem', color: '#34d399', marginTop: '0.4rem' }}>100% Uptime Online</div>
                </div>
              </div>

              {/* Detailed Info Sub-Panel */}
              <div style={{
                backgroundColor: 'rgba(0,0,0,0.4)',
                padding: '1.2rem',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.06)',
                marginTop: 'auto'
              }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.6rem' }}>
                  Primary Tenant / Designation
                </div>
                <div style={{ fontSize: '0.95rem', color: '#cbd5e1' }}>
                  {selectedFloor.tenant}
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', paddingTop: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.78rem', color: '#64748b' }}>
                  <span>Biometric Gateways: <strong>Active</strong></span>
                  <span>Air Purification: <strong>HEPA-14 On</strong></span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

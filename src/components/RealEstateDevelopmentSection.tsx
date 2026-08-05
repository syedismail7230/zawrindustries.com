'use client';

import React, { useState } from 'react';

interface DevelopmentPhase {
  phaseNumber: string;
  name: string;
  subtitle: string;
  completion: number;
  keyDeliverables: string[];
  telemetryMetric: string;
  metricLabel: string;
  details: string;
}

export function RealEstateDevelopmentSection() {
  const phases: DevelopmentPhase[] = [
    {
      phaseNumber: '01',
      name: 'Site Acquisition & Feasibility',
      subtitle: 'GIS Mapping & Spatial Analysis',
      completion: 100,
      keyDeliverables: ['Geotechnical & Soil Profiling', 'Zoning & Municipal Approvals', 'AI Traffic & Impact Modeling'],
      telemetryMetric: '100% Verified',
      metricLabel: 'Land Title & Zoning Integrity',
      details: 'Automated satellite GIS surveying, environmental impact assessment, and AI-driven land yield optimization modeling.'
    },
    {
      phaseNumber: '02',
      name: 'Architectural & BIM Engineering',
      subtitle: 'Digital Twin & Parametric Design',
      completion: 92,
      keyDeliverables: ['7D Building Information Modeling (BIM)', 'Net-Zero Thermal Envelope Modeling', 'Structural Stress Simulations'],
      telemetryMetric: '< 2mm',
      metricLabel: 'Parametric BIM Collision Margin',
      details: 'Comprehensive 7D BIM modeling coordinating MEP (Mechanical, Electrical, Plumbing) pathways and structural resilience.'
    },
    {
      phaseNumber: '03',
      name: 'Autonomous Smart Construction',
      subtitle: 'Robotics & Pre-Fabricated Steel',
      completion: 78,
      keyDeliverables: ['Drone Aerial Quality Inspections', '3D Concrete Printing Modules', 'IoT Worker Safety & Wearables'],
      telemetryMetric: '-34% Carbon',
      metricLabel: 'Embodied Carbon Reduction',
      details: 'Modular pre-fabricated construction methods integrated with autonomous crane telemetry and robotic layout printers.'
    },
    {
      phaseNumber: '04',
      name: 'PropTech Handover & Asset Operations',
      subtitle: 'Smart Building Commissioning',
      completion: 45,
      keyDeliverables: ['IoT Building Management System (BMS)', 'Biometric Access Integration', 'Facility Operations Handover'],
      telemetryMetric: '99.9%',
      metricLabel: 'PropTech BMS Readiness',
      details: 'Full sensor calibration, HVAC air turnover verification, and digital twin onboarding for facility operations teams.'
    }
  ];

  const [activePhaseIdx, setActivePhaseIdx] = useState<number>(1);
  const activePhase = phases[activePhaseIdx];

  return (
    <section style={{
      backgroundColor: '#090d16',
      color: '#ffffff',
      padding: 'clamp(3.5rem, 6vw, 6.5rem) clamp(1rem, 5vw, 6%)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      <div style={{ maxWidth: '1350px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <div style={{ maxWidth: '850px', marginBottom: '4rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.4rem 1rem',
            borderRadius: '999px',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: '#60a5fa',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '1.2rem'
          }}>
            Smart Urban Engineering
          </div>

          <h2 style={{
            fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)',
            fontWeight: 300,
            color: '#ffffff',
            letterSpacing: '-0.03em',
            margin: '0 0 1rem 0',
            lineHeight: 1.15
          }}>
            Real Estate Development &amp; Construction Lifecycle
          </h2>

          <p style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.2rem)',
            color: '#94a3b8',
            fontWeight: 300,
            margin: 0,
            lineHeight: 1.6
          }}>
            From site acquisition to 7D BIM modeling and autonomous modular construction — delivering sustainable, tech-enabled commercial and residential developments.
          </p>
        </div>

        {/* 4-Stage Lifecycle Stepper Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.2rem',
          marginBottom: '3rem'
        }}>
          {phases.map((phase, idx) => {
            const isActive = idx === activePhaseIdx;
            return (
              <div
                key={phase.phaseNumber}
                onClick={() => setActivePhaseIdx(idx)}
                style={{
                  backgroundColor: isActive ? 'rgba(30, 41, 59, 0.9)' : 'rgba(15, 23, 42, 0.4)',
                  border: isActive ? '1px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '14px',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    backgroundColor: '#3b82f6'
                  }} />
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{
                    fontSize: '1.8rem',
                    fontWeight: 700,
                    color: isActive ? '#60a5fa' : '#475569'
                  }}>
                    {phase.phaseNumber}
                  </span>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: phase.completion === 100 ? '#34d399' : '#fbbf24',
                    backgroundColor: phase.completion === 100 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                    padding: '3px 8px',
                    borderRadius: '6px'
                  }}>
                    {phase.completion}% Complete
                  </span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 500, color: '#ffffff', margin: '0 0 0.4rem 0' }}>
                  {phase.name}
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>
                  {phase.subtitle}
                </p>
              </div>
            );
          })}
        </div>

        {/* Selected Phase Deep Dive Telemetry Box */}
        <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '2.5rem',
          backdropFilter: 'blur(12px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#60a5fa', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Phase {activePhase.phaseNumber} Deep Dive
            </div>
            <h3 style={{ fontSize: '2rem', fontWeight: 300, color: '#ffffff', margin: '0 0 1rem 0' }}>
              {activePhase.name}
            </h3>
            <p style={{ fontSize: '1rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '2rem' }}>
              {activePhase.details}
            </p>

            {/* Key Deliverables List */}
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.8rem' }}>
              Key Phase Deliverables:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {activePhase.keyDeliverables.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
                  <span style={{ color: '#3b82f6', fontWeight: 700 }}>✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Right Metrics & Progress Card */}
          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            padding: '2rem',
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.4rem' }}>{activePhase.metricLabel}</div>
              <div style={{ fontSize: '2.4rem', fontWeight: 700, color: '#34d399' }}>{activePhase.telemetryMetric}</div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
                <span>Phase Progress</span>
                <span>{activePhase.completion}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  width: `${activePhase.completion}%`,
                  height: '100%',
                  backgroundColor: '#3b82f6',
                  borderRadius: '4px',
                  transition: 'width 0.6s ease'
                }} />
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', color: '#64748b', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
              ℹ Live Construction Telemetry synced with Zawr PropTech OS
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

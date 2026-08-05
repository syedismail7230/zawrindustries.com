'use client';

import React from 'react';

export function RealEstateCapabilitiesGrid() {
  const capabilities = [
    {
      title: "Automated Lease & Contract Management",
      description: "Smart contract execution, tenant onboarding, automated rent indexing, and real-time lease expiration alerts.",
      metric: "99.8%",
      metricLabel: "Collection Efficiency"
    },
    {
      title: "IoT Environmental & Energy Telemetry",
      description: "AI-driven HVAC chiller loop control, predictive energy load balancing, and real-time indoor air quality (IAQ) monitoring.",
      metric: "-28.4%",
      metricLabel: "Energy Consumption"
    },
    {
      title: "Biometric & Touchless Access Security",
      description: "Cloud-native access control with encrypted mobile credentials, automated visitor registration, and LPR parking gates.",
      metric: "< 100ms",
      metricLabel: "Authentication Speed"
    },
    {
      title: "Predictive Facility Maintenance",
      description: "Vibration and thermal sensors on pumps, elevators, and transformers detecting mechanical anomalies before downtime.",
      metric: "-42%",
      metricLabel: "Unplanned Downtime"
    }
  ];

  return (
    <div style={{ backgroundColor: '#ffffff', padding: 'clamp(3.5rem, 6vw, 6rem) clamp(1rem, 6vw, 8%)', maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{ maxWidth: '850px', margin: '0 auto 4rem auto', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.35rem 0.9rem',
          borderRadius: '999px',
          backgroundColor: '#f1f5f9',
          border: '1px solid #cbd5e1',
          fontSize: '0.8rem',
          fontWeight: 600,
          color: '#475569',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '1.2rem'
        }}>
          PropTech Automation
        </div>
        <h2 style={{
          fontSize: 'clamp(2rem, 4vw, 3.2rem)',
          fontWeight: 300,
          color: '#000000',
          letterSpacing: '-0.02em',
          marginBottom: '1.2rem',
          lineHeight: 1.15
        }}>
          Smart Building &amp; Real Estate Platform Capabilities
        </h2>
        <p style={{
          fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
          color: '#4b5563',
          fontWeight: 300,
          lineHeight: 1.6
        }}>
          Comprehensive digital twin infrastructure unifying property management, tenant experience, asset valuation, and energy efficiency.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem'
      }}>
        {capabilities.map((cap, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
          >
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1.5rem'
              }}>
                <span style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: '#2563eb',
                  lineHeight: 1
                }}>
                  {cap.metric}
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#64748b',
                  backgroundColor: '#ffffff',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0'
                }}>
                  {cap.metricLabel}
                </span>
              </div>

              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#0f172a',
                marginBottom: '0.8rem',
                lineHeight: 1.3
              }}>
                {cap.title}
              </h3>

              <p style={{
                fontSize: '0.92rem',
                color: '#475569',
                lineHeight: 1.6,
                margin: 0
              }}>
                {cap.description}
              </p>
            </div>

            <div style={{
              marginTop: '2rem',
              paddingTop: '1rem',
              borderTop: '1px solid #e2e8f0',
              fontSize: '0.8rem',
              color: '#2563eb',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <span>Learn more</span>
              <span>→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import React from 'react';

export function MaritimeFreightSection() {
  const metrics = [
    { label: "Fleet Coverage", value: "140+ Corridors" },
    { label: "ETA Accuracy", value: "99.4%" },
    { label: "Emissions Saved", value: "14.2%" },
  ];

  return (
    <section style={{
      width: '100%',
      backgroundColor: '#ffffff',
      padding: '5rem clamp(1rem, 6vw, 8%) 6rem clamp(1rem, 6vw, 8%)',
      boxSizing: 'border-box',
      fontFamily: 'Inter, sans-serif',
      color: '#000000',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '4rem',
        alignItems: 'center',
      }}>
        {/* Left Column: Container Ship GIF matching user screenshot */}
        <div style={{
          width: '100%',
          borderRadius: '20px',
          overflow: 'hidden',
          backgroundColor: '#f8f9fa',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <img
            src="/assets/Ship.gif"
            alt="Zawr Industries Maritime Container Ship Telemetry"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              objectFit: 'cover',
            }}
          />
        </div>

        {/* Right Column: Maritime Details Content */}
        <div>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(0, 0, 0, 0.45)',
            marginBottom: '1rem',
          }}>
            Maritime Logistics Solutions
          </div>

          <h2 style={{
            fontSize: 'clamp(2rem, 3.8vw, 3rem)',
            fontWeight: 300,
            color: '#000000',
            letterSpacing: '-0.025em',
            margin: '0 0 1.5rem 0',
            lineHeight: 1.15,
          }}>
            Autonomous Ocean &amp; Maritime Telemetry
          </h2>

          <div style={{ width: '3rem', height: '1px', background: '#000000', marginBottom: '1.8rem', opacity: 0.2 }} />

          <p style={{
            fontSize: 'clamp(0.98rem, 1.2vw, 1.12rem)',
            lineHeight: 1.8,
            color: 'rgba(0, 0, 0, 0.72)',
            fontWeight: 300,
            marginBottom: '1.5rem',
          }}>
            Zawr Industries deploys advanced satellite AIS telemetry and oceanographic predictive routing across international maritime shipping lanes. Our maritime platform connects container vessels, port terminal operators, and inland freight networks into a single synchronized digital ecosystem.
          </p>

          <p style={{
            fontSize: 'clamp(0.95rem, 1.15vw, 1.05rem)',
            lineHeight: 1.75,
            color: 'rgba(0, 0, 0, 0.65)',
            fontWeight: 300,
            marginBottom: '2.5rem',
          }}>
            From automated port berth scheduling to continuous reefer container temperature logs, our systems prevent costly maritime delays, reduce vessel carbon emissions, and guarantee end-to-end cargo integrity across global trade routes.
          </p>

          {/* Key Metrics Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.5rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(0, 0, 0, 0.08)',
          }}>
            {metrics.map((m, idx) => (
              <div key={idx}>
                <div style={{
                  fontSize: 'clamp(1.2rem, 2vw, 1.6rem)',
                  fontWeight: 400,
                  color: '#000000',
                  letterSpacing: '-0.02em',
                }}>
                  {m.value}
                </div>
                <div style={{
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'rgba(0, 0, 0, 0.45)',
                  marginTop: '0.25rem',
                }}>
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

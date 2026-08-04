'use client';

import React from 'react';

export function RailFreightSection() {
  const metrics = [
    { label: "Rail Network", value: "35,000+ km" },
    { label: "On-Time Dispatch", value: "99.2%" },
    { label: "CO2 Reduction", value: "-72%" },
  ];

  return (
    <section style={{
      width: '100%',
      backgroundColor: '#ffffff',
      padding: '4rem clamp(1rem, 6vw, 8%) 6rem clamp(1rem, 6vw, 8%)',
      boxSizing: 'border-box',
      fontFamily: 'Inter, sans-serif',
      color: '#000000',
      overflow: 'hidden',
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {/* Top Image Frame with train.png matching reference screenshot */}
        <div style={{
          width: '100%',
          borderRadius: '24px',
          overflow: 'hidden',
          backgroundColor: '#f8f9fa',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.06)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          marginBottom: '3.5rem',
        }}>
          <img
            src="https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto:good,w_1600,c_limit,dpr_auto/v1785807651/zawr/assets/train.png"
            alt="Zawr Industries Intermodal Rail Freight Telemetry"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              objectFit: 'cover',
            }}
          />
        </div>

        {/* Bottom Details Content Section */}
        <div style={{ maxWidth: '850px', textAlign: 'center' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 3.8vw, 3rem)',
            fontWeight: 300,
            color: '#000000',
            letterSpacing: '-0.025em',
            margin: '0 0 1.25rem 0',
            lineHeight: 1.15,
          }}>
            Intermodal Rail &amp; Transcontinental Freight
          </h2>

          <div style={{ width: '3rem', height: '1px', background: '#000000', margin: '0 auto 1.8rem auto', opacity: 0.2 }} />

          <p style={{
            fontSize: 'clamp(0.98rem, 1.18vw, 1.08rem)',
            lineHeight: 1.8,
            color: 'rgba(0, 0, 0, 0.72)',
            fontWeight: 300,
            margin: '0 0 2.5rem 0',
          }}>
            Zawr Industries connects transcontinental rail corridors with automated inland container depots and seaport terminals through real-time telemetry and spatial AI orchestration. Our intermodal rail infrastructure continuously tracks locomotive speed, train weight distribution, and cargo temperature conditions across tens of thousands of kilometers of track network. By synchronizing rail dispatch schedules directly with ocean carriers and last-mile truck fleets, we eliminate costly yard dwell times, reduce fuel consumption by up to 72% per ton-mile compared to long-haul trucking, and accelerate cross-border trade flow with automated manifest filing.
          </p>

          {/* Key Metrics Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(0, 0, 0, 0.08)',
          }}>
            {metrics.map((m, idx) => (
              <div key={idx}>
                <div style={{
                  fontSize: 'clamp(1.3rem, 2.2vw, 1.8rem)',
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
                  marginTop: '0.35rem',
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

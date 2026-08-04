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
      padding: '4rem 0 6rem 0',
      boxSizing: 'border-box',
      fontFamily: 'Inter, sans-serif',
      color: '#000000',
      overflow: 'hidden',
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .maritime-grid {
          width: 100%;
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 3rem;
          align-items: center;
        }

        .maritime-left-img-wrapper {
          position: relative;
          width: 100%;
          height: clamp(400px, 54vh, 600px);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          background-color: #ffffff;
        }

        .maritime-ship-video {
          width: 155%;
          max-width: none;
          height: 110%;
          object-fit: cover;
          object-position: left center;
          margin-left: -24%;
          display: block;
          mix-blend-mode: multiply;
          filter: contrast(1.06) brightness(1.01);
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        .maritime-right-content {
          max-width: 620px;
          padding-right: clamp(2rem, 6vw, 8rem);
          padding-left: 1rem;
          box-sizing: border-box;
        }

        @media (max-width: 900px) {
          .maritime-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .maritime-left-img-wrapper {
            height: 340px;
          }
          .maritime-ship-video {
            width: 165%;
            margin-left: -18%;
          }
          .maritime-right-content {
            padding-right: 1.5rem;
            padding-left: 1.5rem;
          }
        }
      ` }} />

      <div className="maritime-grid">
        {/* Left Column: Zoomed-in Container Ship Video */}
        <div className="maritime-left-img-wrapper">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-label="Zawr Industries Maritime Container Ship Telemetry"
            className="maritime-ship-video"
          >
            <source src="/assets/Ship.mp4" type="video/mp4" />
            <img
              src="/assets/Ship.gif"
              alt="Zawr Industries Maritime Container Ship Telemetry"
              className="maritime-ship-video"
            />
          </video>
        </div>

        {/* Right Column: Maritime Details Content */}
        <div className="maritime-right-content">
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

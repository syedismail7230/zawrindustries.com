'use client';

import React from 'react';

export function AirFreightSection() {
  const metrics = [
    { label: "Global Hubs", value: "220+ Airports" },
    { label: "Express Transit", value: "< 24 Hours" },
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
        .air-freight-grid {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 3rem;
          align-items: center;
        }

        .air-freight-left-content {
          max-width: 600px;
          padding-left: clamp(2rem, 6vw, 8rem);
          padding-right: 1rem;
          box-sizing: border-box;
          text-align: left;
          margin-left: auto;
        }

        .air-freight-right-img-wrapper {
          position: relative;
          width: 100%;
          height: clamp(380px, 50vh, 560px);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          background-color: #ffffff;
        }

        .air-freight-right-img-wrapper img {
          width: 155%;
          max-width: none;
          height: 110%;
          object-fit: cover;
          object-position: right center;
          margin-right: -24%;
          display: block;
          mix-blend-mode: multiply;
          filter: contrast(1.06) brightness(1.01);
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        @media (max-width: 900px) {
          .air-freight-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .air-freight-left-content {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }
          .air-freight-right-img-wrapper {
            height: 320px;
          }
          .air-freight-right-img-wrapper img {
            width: 165%;
            margin-right: -18%;
          }
        }
      ` }} />

      {/* Top Centered Header for Air Freight Section */}
      <div style={{
        maxWidth: '850px',
        margin: '0 auto 3.5rem auto',
        textAlign: 'center',
        padding: '0 1.5rem',
      }}>
        <h2 style={{
          fontSize: 'clamp(2rem, 3.8vw, 3rem)',
          fontWeight: 300,
          color: '#000000',
          letterSpacing: '-0.025em',
          margin: '0 0 1.25rem 0',
          lineHeight: 1.15,
        }}>
          Next-Day Air Express &amp; Global Freighter Fleet
        </h2>
        <div style={{ width: '3rem', height: '1px', background: '#000000', margin: '0 auto', opacity: 0.2 }} />
      </div>

      <div className="air-freight-grid">
        {/* Left Column: Air Freight Technical Details */}
        <div className="air-freight-left-content">
          <p style={{
            fontSize: 'clamp(0.98rem, 1.2vw, 1.12rem)',
            lineHeight: 1.8,
            color: 'rgba(0, 0, 0, 0.72)',
            fontWeight: 300,
            marginBottom: '1.5rem',
            textAlign: 'left',
          }}>
            Zawr Industries provides high-velocity air freight charter and scheduled express cargo routing across more than 220 international airports. Operating specialized nose-loading freighter aircraft and climate-controlled ULD containers, our aviation logistics network powers time-critical supply chains for high-tech, aerospace, and pharmaceutical enterprises.
          </p>

          <p style={{
            fontSize: 'clamp(0.95rem, 1.15vw, 1.05rem)',
            lineHeight: 1.75,
            color: 'rgba(0, 0, 0, 0.65)',
            fontWeight: 300,
            marginBottom: '2.5rem',
            textAlign: 'left',
          }}>
            Our digital air cargo platform offers instant flight slot reservation, automated customs pre-clearance, and continuous altitude environmental telemetry from tarmac loading to final runway touchdown.
          </p>

          {/* Key Metrics Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(0, 0, 0, 0.08)',
            textAlign: 'left',
          }}>
            {metrics.map((m, idx) => (
              <div key={idx} style={{ textAlign: 'left' }}>
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

        {/* Right Column: plane.png flush against the right edge */}
        <div className="air-freight-right-img-wrapper">
          <img
            src="https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto:good,w_1600,c_limit,dpr_auto/v1785808162/zawr/assets/plane.png"
            alt="Zawr Industries Global Air Freighter Fleet Telemetry"
          />
        </div>
      </div>
    </section>
  );
}

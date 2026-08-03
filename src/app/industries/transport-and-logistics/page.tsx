import { Metadata } from 'next';
import React from 'react';
import { IndustriesWeServeSection } from '@/components/IndustriesWeServeSection';

export const metadata: Metadata = {
  title: "Trade & Logistics Solutions — Zawr Industries India",
  description: "Zawr Industries offers technology-enabled trade and logistics solutions across India and international markets — supply chain management, freight, and smart mobility platforms.",
};

export default function LogisticsPage() {
  const capabilities = [
    {
      title: "Smart Fleet Telemetry",
      description: "Real-time IoT sensors tracking vehicle battery health, route efficiency, fuel consumption, and predictive maintenance alerts.",
      metric: "18.5%",
      metricLabel: "Fuel Saved"
    },
    {
      title: "Automated AGV & Warehouse Routing",
      description: "Robotics orchestration and automated guided vehicles (AGV) coordinating high-density fulfillment hubs.",
      metric: "< 12ms",
      metricLabel: "AGV Latency"
    },
    {
      title: "Multi-Modal Freight Dispatch",
      description: "AI-driven route optimization algorithm matching traffic patterns, customs clearances, and multi-modal transit schedules.",
      metric: "< 2.5s",
      metricLabel: "Route Calculation"
    },
    {
      title: "End-to-End Cargo Visibility",
      description: "Tamper-evident digital bills of lading, environmental sensor logs, and real-time shipment milestone notifications.",
      metric: "99.98%",
      metricLabel: "Milestone Accuracy"
    }
  ];

  return (
    <div style={{ backgroundColor: '#000000', color: '#ffffff', minHeight: '100vh', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>
      
      {/* ── HERO BANNER — BLACK AND WHITE THEME WITH LOGISTICS-HERO.PNG ── */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        backgroundImage: 'url("https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto:good,w_1600,c_limit,dpr_auto/v1785797723/zawr/assets/logistics-hero.png"), url("/assets/logistics-hero.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'contrast(1.1)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        padding: '0 clamp(1rem, 6vw, 8%) 8vh clamp(1rem, 6vw, 8%)',
        boxSizing: 'border-box'
      }}>
        {/* Dark Vignette Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.2) 100%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '850px' }}>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: 500,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.5)',
            marginBottom: '1rem',
          }}>
            Industry Solution / Trade &amp; Logistics
          </div>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
            fontWeight: 300,
            color: '#ffffff',
            margin: 0,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            textShadow: '0 4px 20px rgba(0,0,0,0.8)',
          }}>
            Trade &amp; Logistics
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
            color: 'rgba(255, 255, 255, 0.8)',
            marginTop: '1.5rem',
            lineHeight: 1.65,
            maxWidth: '650px',
            fontWeight: 300,
            textShadow: '0 2px 10px rgba(0,0,0,0.6)',
          }}>
            Architecting intelligent supply chains, automated freight routing, and global smart mobility platforms for modern commerce.
          </p>
        </div>
      </div>

      {/* ── OVERVIEW & CAPABILITIES SECTION (MONOCHROME / BLACK & WHITE) ── */}
      <div style={{ padding: 'clamp(4rem, 8vw, 8rem) clamp(1rem, 6vw, 8%)', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ maxWidth: '850px', margin: '0 auto 6rem auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 300,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            marginBottom: '1.5rem'
          }}>
            Next-Gen Supply Chain Infrastructure
          </h2>
          <div style={{ width: '3rem', height: '1px', background: '#ffffff', margin: '0 auto 2rem auto', opacity: 0.3 }} />
          <p style={{
            fontSize: 'clamp(1rem, 1.3vw, 1.15rem)',
            lineHeight: 1.85,
            color: 'rgba(255, 255, 255, 0.7)',
            fontWeight: 300
          }}>
            Zawr Industries' Trade &amp; Logistics vertical delivers technology-driven supply chain, freight management, and smart mobility solutions to businesses operating across domestic and international corridors. Leveraging our proprietary digital infrastructure, we enable end-to-end logistics visibility, route optimization, and last-mile delivery efficiency for manufacturers, traders, and enterprise operations.
          </p>
        </div>

        {/* Capabilities Grid (Pure Black & White Cards) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2rem',
          marginBottom: '6rem'
        }}>
          {capabilities.map((cap, idx) => (
            <div key={idx} style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '2.2rem 1.8rem',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 300,
                  color: '#ffffff',
                  letterSpacing: '-0.03em',
                  marginBottom: '0.2rem'
                }}>
                  {cap.metric}
                </div>
                <div style={{
                  fontSize: '0.68rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: 'rgba(255, 255, 255, 0.4)',
                  marginBottom: '1.8rem'
                }}>
                  {cap.metricLabel}
                </div>
                <h3 style={{
                  fontSize: '1.2rem',
                  fontWeight: 400,
                  color: '#ffffff',
                  marginBottom: '0.75rem',
                  letterSpacing: '-0.01em'
                }}>
                  {cap.title}
                </h3>
                <p style={{
                  fontSize: '0.9rem',
                  lineHeight: 1.65,
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontWeight: 300,
                  margin: 0
                }}>
                  {cap.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── INDUSTRIES WE SERVE SECTION ── */}
      <IndustriesWeServeSection title="Industries Powered by Our Logistics" />

    </div>
  );
}

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
    <div style={{ backgroundColor: '#ffffff', color: '#000000', minHeight: '100vh', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>
      
      {/* ── HERO BANNER WITH LOGISTICS-HERO.PNG (NO OVERLAY / NO FADE) ── */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '90vh',
        backgroundImage: 'url("https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto:good,w_1600,c_limit,dpr_auto/v1785797723/zawr/assets/logistics-hero.png"), url("/assets/logistics-hero.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        padding: '0 clamp(1rem, 6vw, 8%) 8vh clamp(1rem, 6vw, 8%)',
        boxSizing: 'border-box'
      }}>
        <div style={{ position: 'relative', zIndex: 10, maxWidth: '850px' }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
            fontWeight: 300,
            color: '#ffffff',
            margin: 0,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            textShadow: '0 4px 24px rgba(0,0,0,0.9)',
          }}>
            Trade &amp; Logistics
          </h1>
        </div>
      </div>

      {/* ── OVERVIEW & CAPABILITIES SECTION (CLEAN WHITE BACKGROUND) ── */}
      <div style={{ backgroundColor: '#ffffff', padding: 'clamp(4rem, 6vw, 7rem) clamp(1rem, 6vw, 8%)', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ maxWidth: '850px', margin: '0 auto 5rem auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 300,
            color: '#000000',
            letterSpacing: '-0.02em',
            marginBottom: '1.5rem'
          }}>
            Next-Gen Supply Chain Infrastructure
          </h2>
          <div style={{ width: '3rem', height: '1px', background: '#000000', margin: '0 auto 2rem auto', opacity: 0.2 }} />
          <p style={{
            fontSize: 'clamp(1rem, 1.3vw, 1.15rem)',
            lineHeight: 1.85,
            color: 'rgba(0, 0, 0, 0.72)',
            fontWeight: 300
          }}>
            Zawr Industries' Trade &amp; Logistics vertical delivers technology-driven supply chain, freight management, and smart mobility solutions to businesses operating across domestic and international corridors. Leveraging our proprietary digital infrastructure, we enable end-to-end logistics visibility, route optimization, and last-mile delivery efficiency for manufacturers, traders, and enterprise operations.
          </p>
        </div>

        {/* Capabilities Grid (Minimalist White Theme Cards) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2rem',
          marginBottom: '5rem'
        }}>
          {capabilities.map((cap, idx) => (
            <div key={idx} style={{
              background: '#f8f9fa',
              border: '1px solid rgba(0, 0, 0, 0.08)',
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
                  fontWeight: 400,
                  color: '#000000',
                  letterSpacing: '-0.03em',
                  marginBottom: '0.2rem'
                }}>
                  {cap.metric}
                </div>
                <div style={{
                  fontSize: '0.68rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: 'rgba(0, 0, 0, 0.45)',
                  marginBottom: '1.8rem'
                }}>
                  {cap.metricLabel}
                </div>
                <h3 style={{
                  fontSize: '1.2rem',
                  fontWeight: 500,
                  color: '#000000',
                  marginBottom: '0.75rem',
                  letterSpacing: '-0.01em'
                }}>
                  {cap.title}
                </h3>
                <p style={{
                  fontSize: '0.9rem',
                  lineHeight: 1.65,
                  color: 'rgba(0, 0, 0, 0.65)',
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
      <div style={{ backgroundColor: '#000000', paddingTop: '2rem' }}>
        <IndustriesWeServeSection title="Industries Powered by Our Logistics" />
      </div>

    </div>
  );
}

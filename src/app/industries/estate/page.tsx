import { Metadata } from 'next';
import React from 'react';
import { RealEstatePropertyInspector3D } from '@/components/RealEstatePropertyInspector3D';
import { RealEstateInvestmentSection } from '@/components/RealEstateInvestmentSection';
import { RealEstateDevelopmentSection } from '@/components/RealEstateDevelopmentSection';
import { Capabilities3DGrid } from '@/components/Capabilities3DGrid';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Real Estate Development, Investment & PropTech — Zawr Industries",
  description: "Zawr Industries delivers technology-driven real estate solutions across Property Management, Real Estate Investment, and Smart Urban Development in India, UAE, and global markets.",
};

export default function RealEstatePage() {
  const capabilities = [
    {
      title: "Automated Lease & Tenant Platform",
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
      title: "Biometric & Touchless Access Control",
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
    <div style={{ backgroundColor: '#ffffff', color: '#000000', minHeight: '100vh', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>
      
      {/* ── HERO BANNER EXTENDING FULL 100VH DOWN THE SCREEN ── */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: '100vh',
        backgroundImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.85) 100%), url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        padding: '0 clamp(1rem, 6vw, 8%) 6rem clamp(1rem, 6vw, 8%)',
        boxSizing: 'border-box'
      }}>
        <div style={{ position: 'relative', zIndex: 10, maxWidth: '850px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.4rem 1rem',
            borderRadius: '999px',
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            fontSize: '0.82rem',
            fontWeight: 600,
            color: '#ffffff',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '1.5rem'
          }}>
            Infrastructure &amp; PropTech
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
            fontWeight: 300,
            color: '#ffffff',
            margin: 0,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            textShadow: '0 4px 24px rgba(0,0,0,0.9)',
          }}>
            Real Estate &amp; PropTech
          </h1>
          
          <p style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
            fontWeight: 300,
            color: 'rgba(255, 255, 255, 0.85)',
            margin: '1.2rem 0 0 0',
            maxWidth: '680px',
            lineHeight: 1.5,
            textShadow: '0 2px 12px rgba(0,0,0,0.8)',
          }}>
            Operating at the intersection of architectural engineering, capital advisory, and digital twin technology across commercial, residential, and industrial portfolios.
          </p>
        </div>
      </div>

      {/* ── 1. PROPERTY MANAGEMENT & DIGITAL TWIN 3D INSPECTOR ── */}
      <RealEstatePropertyInspector3D />

      {/* ── 2. REAL ESTATE INVESTMENT & ASSET MANAGEMENT ── */}
      <RealEstateInvestmentSection />

      {/* ── 3. REAL ESTATE DEVELOPMENT & CONSTRUCTION LIFECYCLE ── */}
      <RealEstateDevelopmentSection />

      {/* ── 4. OVERVIEW & CAPABILITIES SECTION (MATCHING LOGISTICS/MANUFACTURING GRID) ── */}
      <div style={{ backgroundColor: '#ffffff', padding: 'clamp(3rem, 6vw, 5rem) clamp(1rem, 6vw, 8%)', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ maxWidth: '850px', margin: '0 auto 4rem auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 300,
            color: '#000000',
            letterSpacing: '-0.02em',
            marginBottom: '1rem'
          }}>
            PropTech Platform Capabilities
          </h2>
          <p style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
            color: '#4b5563',
            fontWeight: 300
          }}>
            Unifying Property Management, Real Estate Investment &amp; Smart Urban Development
          </p>
        </div>
        <Capabilities3DGrid capabilities={capabilities} />
      </div>

    </div>
  );
}

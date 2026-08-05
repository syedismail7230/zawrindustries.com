import { Metadata } from 'next';
import React from 'react';
import dynamic from 'next/dynamic';
import { MaritimeFreightSection } from '@/components/MaritimeFreightSection';
import { RailFreightSection } from '@/components/RailFreightSection';
import { AirFreightSection } from '@/components/AirFreightSection';

const InteractiveTruckXray = dynamic(() => import('@/components/InteractiveTruckXray').then(m => m.InteractiveTruckXray), { ssr: false });
const AgvScrollSection = dynamic(() => import('@/components/AgvScrollSection').then(m => m.AgvScrollSection), { ssr: false });
const Capabilities3DGrid = dynamic(() => import('@/components/Capabilities3DGrid').then(m => m.Capabilities3DGrid), { ssr: false });

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
      
      {/* ── HERO BANNER EXTENDING FULL 100VH DOWN THE SCREEN ── */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: '100vh',
        backgroundImage: 'url("https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto:good,w_1600,c_limit,dpr_auto/v1785797723/zawr/assets/logistics-hero.png"), url("/assets/logistics-hero.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        padding: '0 clamp(1rem, 6vw, 8%) 6rem clamp(1rem, 6vw, 8%)',
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

      {/* ── INTERACTIVE TRUCK CARGO X-RAY INSPECTION (BELOW HERO) ── */}
      <InteractiveTruckXray />

      {/* ── AGV ROBOT SCROLL ANIMATION (LEFT TO RIGHT) ── */}
      <AgvScrollSection />

      {/* ── MARITIME OCEAN FREIGHT TELEMETRY (SHIP.GIF ON LEFT + DETAILS ON RIGHT) ── */}
      <MaritimeFreightSection />

      {/* ── INTERMODAL RAIL FREIGHT SECTION (TRAIN.PNG ON TOP + DETAILS BELOW) ── */}
      <RailFreightSection />

      {/* ── AIR FREIGHT & GLOBAL FREIGHTER FLEET (PLANE.PNG ON RIGHT + DETAILS ON LEFT) ── */}
      <AirFreightSection />

      {/* ── OVERVIEW & CAPABILITIES SECTION (CLEAN WHITE BACKGROUND) ── */}
      <div style={{ backgroundColor: '#ffffff', padding: 'clamp(3rem, 6vw, 5rem) clamp(1rem, 6vw, 8%)', maxWidth: '1280px', margin: '0 auto' }}>
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

        {/* 4 In-A-Row 3D Interactive Capabilities Grid */}
        <Capabilities3DGrid capabilities={capabilities} />
      </div>

    </div>
  );
}

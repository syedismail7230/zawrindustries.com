'use client';

import React, { useState } from 'react';

interface AssetClass {
  id: string;
  name: string;
  category: string;
  portfolioValue: string;
  irr: string;
  capRate: string;
  occupancy: string;
  esgScore: string;
  locations: string[];
  description: string;
  growthSparkline: number[];
}

export function RealEstateInvestmentSection() {
  const assetClasses: AssetClass[] = [
    {
      id: 'prime-office',
      name: 'Grade-A Commercial Office Portfolio',
      category: 'Commercial Infrastructure',
      portfolioValue: '$420M USD',
      irr: '14.8%',
      capRate: '6.4%',
      occupancy: '96.4%',
      esgScore: 'A+ (94/100)',
      locations: ['Bangalore Tech Hub', 'Dubai DIFC', 'London City Hub'],
      description: 'Institutional-grade prime office towers featuring net-zero carbon operations, long-term multinational enterprise leases, and automated PropTech management.',
      growthSparkline: [20, 35, 42, 58, 72, 85, 96, 110]
    },
    {
      id: 'logistics-parks',
      name: 'High-Density Automated Logistics Hubs',
      category: 'Industrial & Freight Real Estate',
      portfolioValue: '$310M USD',
      irr: '17.2%',
      capRate: '7.1%',
      occupancy: '98.8%',
      esgScore: 'A (91/100)',
      locations: ['NH-44 Logistics Corridor', 'Jebel Ali Free Zone', 'Milton Keynes UK'],
      description: 'Strategic cold-chain warehouses, robotics-ready distribution centers, and last-mile fulfillment hubs serving global e-commerce operators.',
      growthSparkline: [15, 28, 45, 62, 88, 105, 128, 142]
    },
    {
      id: 'residential-towers',
      name: 'Luxury Residential & Co-Living Assets',
      category: 'Residential Real Estate',
      portfolioValue: '$280M USD',
      irr: '13.5%',
      capRate: '5.8%',
      occupancy: '94.2%',
      esgScore: 'A (89/100)',
      locations: ['Outer Ring Road Bangalore', 'Dubai Marina', 'Kensington London'],
      description: 'High-yield residential communities equipped with IoT smart home automation, wellness amenities, and digital tenant management platforms.',
      growthSparkline: [25, 38, 48, 55, 68, 78, 88, 102]
    },
    {
      id: 'proptech-mixed-use',
      name: 'Smart PropTech Mixed-Use Developments',
      category: 'Integrated Innovation Assets',
      portfolioValue: '$210M USD',
      irr: '19.4%',
      capRate: '7.8%',
      occupancy: '92.5%',
      esgScore: 'A+ (96/100)',
      locations: ['Whitefield Innovation District', 'Abu Dhabi Global Market'],
      description: 'Next-generation urban developments integrating retail, technology incubation hubs, and residential suites with centralized energy microgrids.',
      growthSparkline: [10, 22, 40, 65, 95, 120, 145, 175]
    }
  ];

  const [selectedAssetId, setSelectedAssetId] = useState<string>('prime-office');
  const selectedAsset = assetClasses.find(a => a.id === selectedAssetId) || assetClasses[0];

  return (
    <section style={{
      backgroundColor: '#ffffff',
      color: '#000000',
      padding: 'clamp(3.5rem, 6vw, 6rem) clamp(1rem, 5vw, 6%)',
      borderBottom: '1px solid #e2e8f0'
    }}>
      <div style={{ maxWidth: '1350px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <div style={{ maxWidth: '800px', marginBottom: '3.5rem' }}>
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
            Institutional Asset Advisory
          </div>

          <h2 style={{
            fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)',
            fontWeight: 300,
            color: '#000000',
            letterSpacing: '-0.03em',
            margin: '0 0 1rem 0',
            lineHeight: 1.15
          }}>
            Real Estate Investment &amp; Asset Management
          </h2>

          <p style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.2rem)',
            color: '#475569',
            fontWeight: 300,
            margin: 0,
            lineHeight: 1.6
          }}>
            Strategic capital deployment across prime commercial, logistics, and residential portfolios — maximizing risk-adjusted returns through AI valuation algorithms and ESG compliance.
          </p>
        </div>

        {/* Asset Class Selector Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
          marginBottom: '2.5rem'
        }}>
          {assetClasses.map(asset => {
            const isSelected = asset.id === selectedAssetId;
            return (
              <div
                key={asset.id}
                onClick={() => setSelectedAssetId(asset.id)}
                style={{
                  padding: '1.25rem 1.5rem',
                  borderRadius: '12px',
                  backgroundColor: isSelected ? '#0f172a' : '#f8fafc',
                  color: isSelected ? '#ffffff' : '#000000',
                  border: isSelected ? '1px solid #0f172a' : '1px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  boxShadow: isSelected ? '0 10px 25px -5px rgba(15, 23, 42, 0.3)' : 'none',
                }}
              >
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: isSelected ? '#94a3b8' : '#64748b',
                  marginBottom: '0.4rem'
                }}>
                  {asset.category}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 600, lineHeight: 1.3 }}>
                  {asset.name}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.8rem', borderTop: isSelected ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0', fontSize: '0.82rem' }}>
                  <span style={{ color: isSelected ? '#38bdf8' : '#2563eb', fontWeight: 700 }}>{asset.irr} Targeted IRR</span>
                  <span style={{ color: isSelected ? '#cbd5e1' : '#64748b' }}>{asset.portfolioValue}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Asset Detailed Analytics Showcase */}
        <div style={{
          backgroundColor: '#f8fafc',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '2.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'center'
        }}>
          
          {/* Left Column: Asset Metrics Grid */}
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
              {selectedAsset.category} Telemetry
            </div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', margin: '0 0 1rem 0' }}>
              {selectedAsset.name}
            </h3>
            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              {selectedAsset.description}
            </p>

            {/* Key Investment Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.2rem' }}>
              <div style={{ backgroundColor: '#ffffff', padding: '1.2rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Portfolio Valuation</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0f172a', marginTop: '0.3rem' }}>{selectedAsset.portfolioValue}</div>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '1.2rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Projected IRR</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#16a34a', marginTop: '0.3rem' }}>{selectedAsset.irr}</div>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '1.2rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Net Cap Rate</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#2563eb', marginTop: '0.3rem' }}>{selectedAsset.capRate}</div>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '1.2rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>ESG &amp; Sustainability Score</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#059669', marginTop: '0.3rem' }}>{selectedAsset.esgScore}</div>
              </div>
            </div>
          </div>

          {/* Right Column: Portfolio Growth Visual & Geographic Presence */}
          <div style={{
            backgroundColor: '#ffffff',
            padding: '2rem',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>Accumulated Capital Growth</span>
              <span style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 600, backgroundColor: '#f0fdf4', padding: '3px 8px', borderRadius: '6px' }}>+24.6% YoY</span>
            </div>

            {/* Sparkline Chart SVG */}
            <div style={{ height: '140px', width: '100%', marginBottom: '1.8rem' }}>
              <svg width="100%" height="100%" viewBox="0 0 300 120" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id="assetGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d={`M 0 100 L 0 80 Q 40 60, 80 50 T 160 30 T 240 20 L 300 10 L 300 110 L 0 110 Z`}
                  fill="url(#assetGradient)"
                />
                <path
                  d={`M 0 80 Q 40 60, 80 50 T 160 30 T 240 20 L 300 10`}
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="300" cy="10" r="5" fill="#2563eb" />
              </svg>
            </div>

            {/* Target Locations List */}
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
                Active Market Corridors
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {selectedAsset.locations.map((loc, idx) => (
                  <span
                    key={idx}
                    style={{
                      backgroundColor: '#f1f5f9',
                      color: '#334155',
                      fontSize: '0.78rem',
                      fontWeight: 500,
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    📍 {loc}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

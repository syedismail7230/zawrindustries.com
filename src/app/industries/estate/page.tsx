import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import ScrollTextReveal from '@/components/ScrollTextReveal';
import EstateAnimationScrollGrid from '@/components/EstateAnimationScrollGrid';

const RealEstate3DGrassHero = dynamic(() => import('@/components/RealEstate3DGrassHero'), {
  loading: () => (
    <div style={{ height: '580px', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: 500 }}>Loading 3D Environment...</div>
    </div>
  ),
});

export const metadata: Metadata = {
  title: "Real Estate & PropTech Solutions — Zawr Industries Bangalore",
  description: "Zawr Industries operates in real estate development, property technology, and asset management — delivering smart, scalable property solutions across India and the UAE.",
};

export default function RealEstatePage() {
  return (
    <div style={{ backgroundColor: '#ffffff', color: '#111111', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* 1. Hero Image Section */}
      <RealEstate3DGrassHero />

      {/* 2. Scroll-Driven Word Reveal Statement Section */}
      <ScrollTextReveal text="Every piece of land has its own character and story. We build thoughtful spaces that feel natural to live in, blending clean modern design with enduring quality. Places built not just to impress today, but to last for generations." />

      {/* 3. Staggered Architectural Portfolio Scroll Grid */}
      <EstateAnimationScrollGrid />

      {/* 2. Core Capabilities & PropTech Matrix */}
      <section style={{ padding: '6rem 5%', maxWidth: '1300px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 4.5rem' }}>
          <div style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#2d6a4f',
            marginBottom: '0.75rem',
          }}>
            Infrastructure & Property Intelligence
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 3.2rem)', fontWeight: 800, color: '#081c15', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            Redefining Land Development with PropTech & Sustainable Design
          </h2>
          <p style={{ fontSize: '1.15rem', color: '#4b5563', marginTop: '1.25rem', lineHeight: 1.7 }}>
            Zawr Industries operates at the convergence of prime land acquisition, autonomous building management systems, and ESG-compliant sustainable development across high-growth global corridors.
          </p>
        </div>

        {/* Feature Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '2.5rem',
        }}>
          {/* Card 1 */}
          <div style={{
            backgroundColor: '#f8faf9',
            padding: '2.5rem',
            borderRadius: '24px',
            border: '1px solid #e5e7eb',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              backgroundColor: '#d8f3dc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem',
              marginBottom: '1.5rem',
              color: '#2d6a4f',
            }}>
              🛰️
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#081c15', marginBottom: '0.75rem' }}>
              GIS & AI Land Surveying
            </h3>
            <p style={{ fontSize: '1rem', color: '#4b5563', lineHeight: 1.6 }}>
              Deploying satellite telemetry, LiDAR topographical scanning, and machine learning models to identify high-yield acquisition targets and evaluate environmental viability before development.
            </p>
          </div>

          {/* Card 2 */}
          <div style={{
            backgroundColor: '#f8faf9',
            padding: '2.5rem',
            borderRadius: '24px',
            border: '1px solid #e5e7eb',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              backgroundColor: '#d8f3dc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem',
              marginBottom: '1.5rem',
              color: '#2d6a4f',
            }}>
              ⚡
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#081c15', marginBottom: '0.75rem' }}>
              Autonomous Building Systems
            </h3>
            <p style={{ fontSize: '1rem', color: '#4b5563', lineHeight: 1.6 }}>
              Integrating smart IoT sensors, predictive HVAC optimization, and computerized energy management to reduce operational expenditure across commercial and industrial estates by up to 38%.
            </p>
          </div>

          {/* Card Card 3 */}
          <div style={{
            backgroundColor: '#f8faf9',
            padding: '2.5rem',
            borderRadius: '24px',
            border: '1px solid #e5e7eb',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              backgroundColor: '#d8f3dc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem',
              marginBottom: '1.5rem',
              color: '#2d6a4f',
            }}>
              🌱
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#081c15', marginBottom: '0.75rem' }}>
              Net-Zero Sustainable Meadows
            </h3>
            <p style={{ fontSize: '1rem', color: '#4b5563', lineHeight: 1.6 }}>
              Designing zero-emission eco-estates, rainwater harvesting reservoirs, and solar microgrids that harmonize natural landscapes with modern urban infrastructure.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Global Real Estate Showcase */}
      <section style={{ backgroundColor: '#081c15', color: '#ffffff', padding: '6rem 5%' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#74c69d', marginBottom: '0.75rem' }}>
              Global Footprint
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.25rem' }}>
              Unlocking Value in Prime Global Corridors
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#b7e4c7', lineHeight: 1.7, marginBottom: '2rem' }}>
              From Bangalore's tech parks to Dubai's commercial towers, our real estate division delivers end-to-end master planning, structural engineering, and tenant platform management.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>🏢</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Commercial & Tech Hub Developments</div>
                  <div style={{ fontSize: '0.9rem', color: '#94d2bd' }}>High-density Grade-A IT parks and corporate headquarters</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>🏡</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Smart Eco-Residential Communities</div>
                  <div style={{ fontSize: '0.9rem', color: '#94d2bd' }}>Integrated residential townships with automated security and green spaces</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>🏗️</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Logistics & Industrial Parks</div>
                  <div style={{ fontSize: '0.9rem', color: '#94d2bd' }}>Automated distribution centers optimized for heavy freight and AGV robotics</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Showcase Box */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(116, 198, 157, 0.25)',
            padding: '3rem 2.5rem',
            borderRadius: '28px',
            backdropFilter: 'blur(16px)',
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#74c69d', marginBottom: '2rem' }}>
              PropTech Portfolio Performance
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff' }}>99.4%</div>
                <div style={{ fontSize: '0.9rem', color: '#b7e4c7', marginTop: '0.25rem' }}>Tenant Occupancy Rate</div>
              </div>

              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff' }}>38%</div>
                <div style={{ fontSize: '0.9rem', color: '#b7e4c7', marginTop: '0.25rem' }}>Energy Savings via AI HVAC</div>
              </div>

              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff' }}>14.5k+</div>
                <div style={{ fontSize: '0.9rem', color: '#b7e4c7', marginTop: '0.25rem' }}>Acres Developed</div>
              </div>

              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff' }}>$1.8B</div>
                <div style={{ fontSize: '0.9rem', color: '#b7e4c7', marginTop: '0.25rem' }}>Asset Valuation</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

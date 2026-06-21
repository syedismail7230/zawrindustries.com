'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import ServicesMarquee from './ServicesMarquee';

export default function ITServicesPageClient() {
  const pathname = usePathname();
  
  // Detect if we are on a details subpage sub-route
  const isDetailPage = pathname !== '/industries/it-service' && pathname !== '/industries/it-service/';

  return (
    <div style={{ backgroundColor: '#000000', color: '#ffffff', minHeight: '100vh', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>
      
      {/* ── HERO BANNER — only rendered on the main ITServices index landing page ──────────────── */}
      {!isDetailPage && (
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          backgroundImage: 'url("/assets/it-services-hero.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-start',
          padding: '0 clamp(1rem, 6vw, 8%) 8vh clamp(1rem, 6vw, 8%)',
        }}>
          {/* Sleek bottom dark vignette overlay for legibility */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0) 100%)',
            pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', zIndex: 10, maxWidth: '800px' }}>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
              fontWeight: 300,
              color: '#ffffff',
              margin: 0,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              textShadow: '0 4px 20px rgba(0,0,0,0.6)',
            }}>
              IT Services
            </h1>
            <p style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
              color: 'rgba(255,255,255,0.8)',
              marginTop: '1.5rem',
              lineHeight: 1.6,
              maxWidth: '600px',
              fontWeight: 300,
              textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            }}>
              Architecting intelligent enterprise software solutions and scalable digital infrastructure.
            </p>
          </div>
        </div>
      )}

      {/* ── SERVICES MARQUEE — always rendered (acts as details view inline on sub-pages) ─────────────── */}
      <ServicesMarquee />

      {/* ── CORE CAPABILITIES — only rendered on the main ITServices index landing page ──────────────── */}
      {!isDetailPage && (
        <div style={{ padding: 'clamp(4rem, 8vw, 8rem) clamp(1rem, 6vw, 8%) clamp(6rem, 10vw, 10rem) clamp(1rem, 6vw, 8%)', position: 'relative' }}>
          
          {/* Subtle glowing colorful blobs behind cards */}
          <div style={{
            position: 'absolute',
            top: '20%',
            right: '5%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(147, 51, 234, 0.15) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '10%',
            left: '5%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '5rem' }}>
              <span style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: '#a855f7',
              }}>
                Capabilities
              </span>
              <h2 style={{
                fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                marginTop: '1rem',
                marginBottom: '2rem',
                color: '#ffffff',
              }}>
                Engineered for Enterprise Impact
              </h2>
              <p style={{
                fontSize: '1.1rem',
                lineHeight: 1.8,
                color: 'rgba(255,255,255,0.7)',
                maxWidth: '850px',
                fontWeight: 300,
              }}>
                Zawr Industries provides end-to-end Information Technology services to startups, enterprises, 
                and government organizations globally. Powered by our proprietary <strong>Firm AI</strong> platform, 
                we deliver intelligent, scalable technology solutions that give businesses a measurable competitive advantage.
              </p>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
              .capability-card {
                background-color: #000000 !important;
                border: 1px solid rgba(255, 255, 255, 0.08) !important;
                border-radius: 2.5rem !important;
                padding: 3rem 2.5rem !important;
                min-height: 380px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                text-decoration: none;
                transition: background-color 0.3s, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
              }
              .capability-card:hover {
                background-color: #111111 !important;
                transform: translateY(-5px);
              }
              .capability-card .arrow-svg {
                transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
              }
              .capability-card:hover .arrow-svg {
                transform: translate(6px, -6px);
              }
            `}} />

            {/* Grid layout */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
              gap: '2.5rem',
              marginTop: '4rem',
            }}>
              
              {/* Card 1 */}
              <Link href="/industries/it-service/software-development" className="capability-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '2.5rem' }}>💻</span>
                  <svg className="arrow-svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 500, color: '#ffffff', marginBottom: '1rem', marginTop: '1.5rem', letterSpacing: '-0.01em' }}>
                    Custom Software & Apps
                  </h3>
                  <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, fontWeight: 300, margin: 0 }}>
                    End-to-end full stack development for complex web, desktop, and mobile architectures. Built using bleeding-edge technologies optimized for raw performance and scalability.
                  </p>
                </div>
              </Link>

              {/* Card 2 */}
              <Link href="/industries/it-service/ai-data-analytics" className="capability-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '2.5rem' }}>✨</span>
                  <svg className="arrow-svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 500, color: '#ffffff', marginBottom: '1rem', marginTop: '1.5rem', letterSpacing: '-0.01em' }}>
                    Firm AI Integrations
                  </h3>
                  <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, fontWeight: 300, margin: 0 }}>
                    Integrate intelligent predictive workflows and large language models (LLMs) into core operational pipelines to reduce latency, automate tasks, and synthesize decision logic.
                  </p>
                </div>
              </Link>

              {/* Card 3 */}
              <Link href="/industries/it-service/cloud" className="capability-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '2.5rem' }}>🛡️</span>
                  <svg className="arrow-svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 500, color: '#ffffff', marginBottom: '1rem', marginTop: '1.5rem', letterSpacing: '-0.01em' }}>
                    Cloud & Cybersecurity
                  </h3>
                  <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, fontWeight: 300, margin: 0 }}>
                    Enterprise-grade cloud migrations, system orchestration, and robust threat mitigation. We shield mission-critical data with multi-layered Zero-Trust network protocols.
                  </p>
                </div>
              </Link>

            </div>

            {/* Partner logos / network banner */}
            <div style={{
              marginTop: '8rem',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              paddingTop: '5rem',
              textAlign: 'center',
            }}>
              <p style={{
                fontSize: '0.8rem',
                fontWeight: 500,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
                marginBottom: '3rem',
              }}>
                Authorized Integration Partner
              </p>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '3.5rem',
                opacity: 0.65,
              }}>
                {['AWS', 'Google Cloud', 'Microsoft Azure', 'Nvidia', 'Salesforce', 'Anthropic'].map((partner) => (
                  <span 
                    key={partner} 
                    style={{ 
                      fontSize: '1.15rem', 
                      fontWeight: 600, 
                      color: '#ffffff', 
                      letterSpacing: '-0.02em' 
                    }}
                  >
                    {partner}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

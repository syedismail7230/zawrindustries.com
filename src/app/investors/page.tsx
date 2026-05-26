"use client";

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const PitchDeckViewer = dynamic(() => import('./PitchDeckViewer'), {
  ssr: false,
  loading: () => <div style={{ color: '#fff', fontSize: '1.25rem' }}>Loading Pitch Deck...</div>
});

// Main Page Component
export default function InvestorsPage() {
  const [isPitchDeckOpen, setIsPitchDeckOpen] = React.useState(false);
  const [hasPitchDeck, setHasPitchDeck] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('zawr_pitch_deck_uploaded') === 'true') {
        setHasPitchDeck(true);
      }
    }
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000000', color: '#ffffff', fontFamily: 'sans-serif' }}>
      
      {/* 2D Redesigned Hero Section */}
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        overflow: 'hidden',
        backgroundImage: 'url(/assets/investors-hero-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        
        {/* Dark gradient overlay to ensure text is readable, stronger on top and left */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%), linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 30%)', pointerEvents: 'none' }}></div>

        {/* Overlay Content */}
        <div style={{ position: 'relative', zIndex: 10, padding: '0 4rem', width: '100%', maxWidth: '80rem', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '100%', paddingBottom: '4rem' }}>
          
          {/* Left Side: Typography & CTA */}
          <div style={{ paddingBottom: '4rem', maxWidth: '40rem' }}>
            <h1 style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: 500, marginBottom: '1.5rem', lineHeight: 1.1, letterSpacing: '-0.02em', fontFamily: 'inherit' }}>
              Invest with confidence.<br/>
              Grow with purpose
            </h1>
            <p style={{ fontSize: '1.125rem', color: '#d1d5db', marginBottom: '3rem', fontWeight: 400 }}>
              Smart investing made personal, purposeful, and powerful.
            </p>
            <Link 
              href="/investors/interest"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem', backgroundColor: '#ffffff', color: '#000000', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.05em', border: 'none', cursor: 'pointer', transition: 'opacity 0.2s', textDecoration: 'none' }}
              onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
            >
              INVESTMENT ENQUIRY
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
            </Link>
          </div>

          {/* Right Side: Glassmorphism Card */}
          <div style={{ paddingBottom: '0rem' }}>
            <div style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.1)', 
              backdropFilter: 'blur(16px)', 
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.2)', 
              padding: '2rem', 
              width: '18rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              <span style={{ fontSize: '1rem', color: '#e5e7eb', fontWeight: 400 }}>YoY performance</span>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '4rem', fontWeight: 300, lineHeight: 1, fontFamily: 'sans-serif' }}>28%</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Container */}
      <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '6rem 1.5rem' }}>
        
        {/* Flagship Project Section */}
        <section style={{ marginBottom: '8rem', backgroundColor: '#ffffff', borderRadius: '2rem', padding: '4rem', display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'center' }}>
          <div style={{ flex: '1.2 1 500px', display: 'flex', justifyContent: 'center' }}>
            <img 
              src="/assets/firmai-dashboard.png" 
              alt="Firm AI Dashboard" 
              style={{ width: '100%', maxWidth: '1100px', height: 'auto', objectFit: 'contain', borderRadius: '1rem', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }} 
            />
          </div>
          <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ margin: '-4rem 0 -4rem -1.5rem' }}>
              <img src="/assets/firmai-logo-dark.png" alt="Firm AI" style={{ width: '100%', maxWidth: '20rem', height: 'auto', objectFit: 'contain' }} />
            </div>
            <p style={{ fontSize: '1.125rem', color: '#374151', lineHeight: 1.7, fontWeight: 500, paddingRight: '1rem' }}>
              Firm AI is Zawr Industries' current flagship project—an AI-powered Business Intelligence Orchestra designed to unify data, automate decision workflows, and orchestrate intelligent business operations through a single connected ecosystem.
            </p>
          </div>
        </section>

        {/* Managing Director Message */}
        <section style={{ marginBottom: '8rem', display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center' }}>
          <style>{`
            .md-desktop-name { display: block; }
            .md-mobile-name { display: none; }
            @media (max-width: 768px) {
              .md-desktop-name { display: none; }
              .md-mobile-name { display: block; margin-top: 1.5rem; }
            }
          `}</style>
          <div style={{ flex: '1.5 1 500px' }}>
            <div style={{ marginBottom: '2rem', color: '#ffffff' }}>
              <svg width="72" height="72" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8L24 8L24 18L14.017 18ZM0 18L0 10.609C0 4.905 3.748 1.039 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8L9.983 8L9.983 18L0 18Z" />
              </svg>
            </div>
            <p style={{ fontSize: '1.125rem', color: '#e5e7eb', lineHeight: 1.8, fontStyle: 'italic', marginBottom: '1.5rem', fontWeight: 400 }}>
              At Zawr Industries, we believe that sustainable growth is created through innovation, disciplined execution, and a long-term vision. Our mission is to build an ecosystem of businesses that not only deliver value today but create opportunities for the future through technology, intelligence, and strategic expansion.
            </p>
            <p style={{ fontSize: '1.125rem', color: '#e5e7eb', lineHeight: 1.8, fontStyle: 'italic', marginBottom: '3rem', fontWeight: 400 }}>
              As we continue our journey, our focus remains on empowering industries, creating meaningful impact, and building solutions that are scalable, reliable, and globally competitive. We thank our partners, clients, investors, and team members for being part of this vision and shaping the future together.
            </p>
            <div className="md-desktop-name">
              <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem', fontStyle: 'italic' }}>Mohammed Ahmed</h4>
              <p style={{ fontSize: '1rem', color: '#d1d5db', fontWeight: 400, fontStyle: 'italic' }}>Managing Director, Zawr Industries</p>
            </div>
          </div>
          <div style={{ flex: '1 1 450px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <img 
              src="/assets/md-portrait.png" 
              alt="Mohammed Ahmed, Managing Director" 
              style={{ width: '100%', maxWidth: '750px', height: 'auto', objectFit: 'contain' }} 
            />
            <div className="md-mobile-name" style={{ width: '100%', textAlign: 'left' }}>
              <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem', fontStyle: 'italic' }}>Mohammed Ahmed</h4>
              <p style={{ fontSize: '1rem', color: '#d1d5db', fontWeight: 400, fontStyle: 'italic' }}>Managing Director, Zawr Industries</p>
            </div>
          </div>
        </section>

      </div> {/* Close Main Content Container for full-bleed section */}

        {/* Pitch Deck Interactive Section */}
        <section 
          style={{ 
            marginBottom: '8rem', 
            width: '100%', 
            height: '100vh',
            backgroundImage: 'url(/assets/pitch-deck-bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#073840', // Fallback color
            position: 'relative', 
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' 
          }}
        >
          {/* Button that transforms into Slide 1 background */}
          <div 
            onClick={() => !isPitchDeckOpen && setIsPitchDeckOpen(true)}
            style={{ 
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: isPitchDeckOpen ? '80vw' : '280px',
              height: isPitchDeckOpen ? '70vh' : '56px',
              backgroundColor: isPitchDeckOpen ? '#f3f4f6' : '#ffffff', 
              borderRadius: isPitchDeckOpen ? '1.5rem' : '2rem', 
              opacity: isPitchDeckOpen ? 0 : 1,
              cursor: isPitchDeckOpen ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: isPitchDeckOpen 
                ? 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1), height 0.6s cubic-bezier(0.4, 0, 0.2, 1), border-radius 0.6s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.6s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0s 0.8s' 
                : 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: isPitchDeckOpen ? 'none' : '0 10px 25px -5px rgba(0,0,0,0.3)',
              zIndex: 10
            }}
          >
            <span style={{ 
              color: '#1f2937', 
              fontSize: '1.125rem', 
              fontWeight: 500,
              opacity: isPitchDeckOpen ? 0 : 1,
              transition: 'opacity 0.3s ease',
              whiteSpace: 'nowrap',
              pointerEvents: 'none'
            }}>
              Click to open pitch deck
            </span>
          </div>

          {/* Carousel Container */}
          <div 
            style={{ 
              position: 'absolute',
              inset: 0,
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'center', 
              opacity: isPitchDeckOpen ? 1 : 0,
              pointerEvents: isPitchDeckOpen ? 'auto' : 'none',
              transition: 'opacity 0.3s ease 0.5s', // Fade in right as the expansion finishes
              zIndex: 11
            }}
          >
            {hasPitchDeck ? (
              <PitchDeckViewer />
            ) : (
              <div style={{ display: 'flex', overflowX: 'auto', gap: '4rem', padding: '0 10vw', width: '100%', scrollSnapType: 'x mandatory', scrollBehavior: 'smooth', msOverflowStyle: 'none', scrollbarWidth: 'none' }} className="pitch-deck-scroll">
                <style>{`
                  .pitch-deck-scroll::-webkit-scrollbar { display: none; }
                  .placeholder-slide { width: 80vw; height: 70vh; }
                  @media (max-width: 768px) { .placeholder-slide { width: 85vw; height: 50vh; } }
                `}</style>
                {[1, 2, 3, 4, 5].map((slide) => (
                  <div key={slide} className="placeholder-slide" style={{ flexShrink: 0, backgroundColor: '#f3f4f6', borderRadius: '1.5rem', scrollSnapAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.4)' }}>
                    <p style={{ color: '#9ca3af', fontSize: '1.5rem', fontWeight: 500 }}>Slide {slide} Placeholder</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Close Button */}
          <button 
            onClick={(e) => { e.stopPropagation(); setIsPitchDeckOpen(false); }}
            style={{
              position: 'absolute',
              bottom: '2rem',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isPitchDeckOpen ? 1 : 0,
              pointerEvents: isPitchDeckOpen ? 'auto' : 'none',
              transition: 'all 0.3s ease',
              transitionDelay: isPitchDeckOpen ? '0.6s' : '0s',
              zIndex: 20
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.4)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </section>

      {/* Resume Main Content Container */}
      <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1.5rem 6rem' }}>

        {/* Financial Reports */}
        <section id="financial-reports" style={{ marginBottom: '8rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 500, color: '#ffffff' }}>Financial Reports</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', maxWidth: '750px', margin: '0 auto' }}>
            {['FY 2023', 'FY 2024', 'FY 2025', 'FY 2026'].map((report, i) => (
              <div key={i} style={{ backgroundColor: '#ffffff', borderRadius: '1rem', padding: '1.25rem', cursor: 'pointer', transition: 'transform 0.3s ease', display: 'flex', flexDirection: 'column' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-8px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ position: 'relative', width: '100%', height: '180px', borderRadius: '0.75rem', overflow: 'hidden', marginBottom: '1.5rem' }}>
                  {/* Note: I generated this custom stock chart image to match the design aesthetics */}
                  <img src="/assets/financial-chart.png" alt={report} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: '0.5rem', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
                  <span style={{ color: '#000000', fontSize: '1.6rem', fontWeight: 500 }}>{report}</span>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why Invest */}
        <section style={{ marginBottom: '8rem', display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center' }}>
          <div style={{ flex: '1 1 400px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Why Invest in Zawr?</h2>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[
                { title: 'Diversified Portfolio', desc: 'Our investments span AI, Logistics, Healthcare, and Real Estate, ensuring risk mitigation and stable returns.' },
                { title: 'Visionary Leadership', desc: 'Led by a team of serial entrepreneurs and industry veterans with a proven track record of scaling global businesses.' },
                { title: 'Innovation First', desc: 'We heavily reinvest in R&D to maintain a technological edge and disrupt traditional market models.' }
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ color: '#ffffff', marginTop: '0.25rem' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>{item.title}</h3>
                    <p style={{ color: '#9ca3af', lineHeight: 1.5 }}>{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ flex: '1 1 400px', backgroundColor: '#111111', borderRadius: '1.5rem', padding: '3rem', border: '1px solid #1f2937' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem' }}>Corporate Governance</h3>
            <p style={{ color: '#9ca3af', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              We adhere to the highest standards of corporate governance, ensuring transparency, accountability, and ethical business practices across all our subsidiaries and global operations.
            </p>
            <p style={{ color: '#9ca3af', lineHeight: 1.6 }}>
              Our board of directors brings together decades of diverse experience to oversee our strategic direction and safeguard shareholder value.
            </p>
          </div>
        </section>



      </div>
      
      {/* CSS Animation for Bounce */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0) translateX(-50%); }
          40% { transform: translateY(-20px) translateX(-50%); }
          60% { transform: translateY(-10px) translateX(-50%); }
        }
      `}} />
    </div>
  );
}

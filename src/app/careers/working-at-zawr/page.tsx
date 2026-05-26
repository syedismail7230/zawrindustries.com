"use client";

import React from 'react';
import Link from 'next/link';

export default function WorkingAtZawrPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000000', color: '#ffffff', fontFamily: 'Inter, sans-serif', paddingBottom: '8rem' }}>
      
      {/* Immersive Mockup Full-Bleed Hero Banner */}
      <section style={{ 
        position: 'relative',
        width: '100%', 
        backgroundColor: '#000000',
        borderBottom: '1px solid #1f2937',
        overflow: 'hidden'
      }}>
        {/* Responsive Image Banner displaying the full uncropped picture */}
        <img 
          src="/assets/life-at-zawr.png" 
          alt="Life at Zawr" 
          style={{ 
            width: '100%', 
            height: 'auto', 
            display: 'block' 
          }} 
        />

        {/* Subtle gradient backdrop */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.25) 50%, transparent 100%)',
          zIndex: 1,
          pointerEvents: 'none'
        }}></div>

        {/* Grouped text block — title + quote together, vertically centered */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '22%',
          transform: 'translateY(-50%)',
          zIndex: 2
        }}>
          <h1 style={{
            fontSize: 'clamp(6rem, 16.5vw, 13.5rem)',
            fontWeight: 300,
            color: '#ffffff',
            lineHeight: 1.0,
            margin: '0 0 1.25rem 0',
            letterSpacing: '-0.02em',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            whiteSpace: 'nowrap'
          }}>
            Life at<br/>Zawr
          </h1>
          <p style={{
            fontSize: 'clamp(0.85rem, 1.5vw, 1.05rem)',
            color: '#ffffff',
            lineHeight: 1.5,
            margin: 0,
            fontWeight: 400,
            opacity: 0.9,
            maxWidth: '380px',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
          }}>
            At Zawr, ideas become impact, ambition becomes opportunity, and every journey contributes to building the future together.
          </p>
        </div>
      </section>

      {/* Main Corporate Culture & Pillars */}
      <section style={{ maxWidth: '1100px', margin: '8rem auto 0 auto', padding: '0 2rem' }}>
        
        {/* Section Intro */}
        <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
          <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#9ca3af', display: 'block', marginBottom: '0.75rem' }}>Ecosystem</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>Our Cultural Pillars</h2>
          <p style={{ fontSize: '1.0625rem', color: '#9ca3af', maxWidth: '35rem', margin: '1.25rem auto 0 auto', lineHeight: 1.7 }}>
            We work at the absolute frontier of technology, designing secure global products with complete integrity and long-term vision.
          </p>
        </div>

        {/* Dynamic Pillars Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
          
          {/* Pillar 1 */}
          <div style={{ border: '1px solid #1f2937', padding: '3rem 2.5rem', borderRadius: '1.5rem', backgroundColor: '#09090b', display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#ffffff', color: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, marginBottom: '2rem' }}>01</div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 600, color: '#ffffff', margin: '0 0 1rem 0' }}>Extreme Ownership</h3>
            <p style={{ fontSize: '0.9375rem', color: '#a1a1aa', lineHeight: 1.7, margin: 0 }}>
              We delegate complete responsibility and agency to builders, enabling rapid decision-making, direct execution, and institutional speed.
            </p>
          </div>

          {/* Pillar 2 */}
          <div style={{ border: '1px solid #1f2937', padding: '3rem 2.5rem', borderRadius: '1.5rem', backgroundColor: '#09090b', display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#ffffff', color: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, marginBottom: '2rem' }}>02</div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 600, color: '#ffffff', margin: '0 0 1rem 0' }}>Stark Focus on Merit</h3>
            <p style={{ fontSize: '0.9375rem', color: '#a1a1aa', lineHeight: 1.7, margin: 0 }}>
              Careers and leadership progression at Zawr are defined strictly by capabilities, business contributions, performance metrics, and integrity.
            </p>
          </div>

          {/* Pillar 3 */}
          <div style={{ border: '1px solid #1f2937', padding: '3rem 2.5rem', borderRadius: '1.5rem', backgroundColor: '#09090b', display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#ffffff', color: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, marginBottom: '2rem' }}>03</div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 600, color: '#ffffff', margin: '0 0 1rem 0' }}>Long-Term Horizon</h3>
            <p style={{ fontSize: '0.9375rem', color: '#a1a1aa', lineHeight: 1.7, margin: 0 }}>
              We build institutional frameworks and operating structures meant to scale sustainably over decades, avoiding short-term compromises.
            </p>
          </div>

        </div>

        {/* Premium Work Perks & Benefits */}
        <div style={{ borderTop: '1px solid #1f2937', paddingTop: '8rem', marginTop: '8rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#9ca3af', display: 'block', marginBottom: '0.75rem' }}>Core Value</span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>Workforce Advantages</h2>
          </div>

          {/* Perks Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {[
              { title: "Global Workspace", desc: "Collaborate across borders with digital operating networks and leading research frameworks." },
              { title: "Inclusive Meritocracy", desc: "Equal access and support policies structured entirely around fairness and performance." },
              { title: "Professional Mobility", desc: "Move across operating platforms, joint ventures, and subsidiaries as your capabilities scale." },
              { title: "Workforce Care", desc: "Comprehensive, competitive resources structured to support wellness and continuous education." }
            ].map((perk, i) => (
              <div key={i} style={{ border: '1px solid #1f2937', padding: '2rem', borderRadius: '1.25rem', backgroundColor: '#09090b' }}>
                <h4 style={{ fontSize: '1.1rem', color: '#ffffff', margin: '0 0 0.75rem 0', fontWeight: 600 }}>{perk.title}</h4>
                <p style={{ fontSize: '0.875rem', color: '#a1a1aa', lineHeight: 1.6, margin: 0 }}>{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Global Call to Action */}
        <div style={{ 
          marginTop: '10rem', 
          border: '1px solid #ffffff', 
          borderRadius: '2rem', 
          padding: '5rem 3rem', 
          textAlign: 'center',
          backgroundColor: '#ffffff',
          color: '#000000',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <h3 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 1rem 0', lineHeight: 1.1 }}>
            Shape the Future.
          </h3>
          <p style={{ fontSize: '1.125rem', color: '#4b5563', maxWidth: '30rem', margin: '0 auto 2.5rem auto', lineHeight: 1.6, fontWeight: 550 }}>
            Join our high-performance global network and drive technological transformation at institutional scale.
          </p>
          <Link 
            href="/careers" 
            style={{ 
              padding: '1rem 2.5rem', 
              backgroundColor: '#000000', 
              color: '#ffffff', 
              borderRadius: '9999px', 
              textDecoration: 'none', 
              fontSize: '0.9375rem', 
              fontWeight: 700, 
              display: 'inline-flex',
              alignItems: 'center',
              boxShadow: '0 4px 6px rgba(0,0,0,0.15)',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Explore Open Positions
          </Link>
        </div>

      </section>

    </div>
  );
}

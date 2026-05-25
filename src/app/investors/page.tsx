"use client";

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// 3D Abstract Interactive Element
function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.2;
    meshRef.current.rotation.x = Math.sin(t * 0.1) * 0.2;
  });

  return (
    <Sphere 
      ref={meshRef}
      args={[1, 64, 64]} 
      scale={hovered ? 1.8 : 1.5}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <MeshDistortMaterial
        color={hovered ? "#10b981" : "#000000"} // Zawr colors
        attach="material"
        distort={hovered ? 0.6 : 0.4}
        speed={hovered ? 4 : 2}
        roughness={0.2}
        metalness={0.8}
        wireframe={!hovered}
      />
    </Sphere>
  );
}

// Main Page Component
export default function InvestorsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    inquiry: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulating API call for now. In a real app, send to /api/investors-inquiry
    setTimeout(() => {
      setStatus('success');
    }, 1500);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000000', color: '#ffffff', fontFamily: 'sans-serif' }}>
      
      {/* 3D Hero Section */}
      <div style={{ position: 'relative', width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', overflow: 'hidden' }}>
        
        {/* 3D Canvas Background */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, cursor: 'grab' }}>
          <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 10]} intensity={1.5} />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#ffffff" />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            
            <AnimatedSphere />
            
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
          </Canvas>
          {/* Gradient overlay to ensure text is readable */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, transparent 20%, #000000 90%)', pointerEvents: 'none' }}></div>
        </div>

        {/* Overlay Content */}
        <div style={{ position: 'relative', zIndex: 10, padding: '0 1.5rem', maxWidth: '64rem', marginTop: '4rem' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#10b981', display: 'block', marginBottom: '1rem' }}>
            Investor Relations
          </span>
          <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-0.02em', textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
            Invest in the Future.
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#d1d5db', maxWidth: '48rem', margin: '0 auto', lineHeight: 1.6, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
            Join Zawr Industries in redefining technology, infrastructure, and global innovation. Explore our financial metrics, growth strategies, and strategic partnerships.
          </p>
          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button 
              onClick={() => document.getElementById('financial-highlights')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ padding: '0.875rem 2rem', backgroundColor: '#ffffff', color: '#000000', borderRadius: '9999px', fontSize: '1rem', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Financial Highlights
            </button>
            <button 
              onClick={() => document.getElementById('contact-ir')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ padding: '0.875rem 2rem', backgroundColor: 'transparent', color: '#ffffff', borderRadius: '9999px', fontSize: '1rem', fontWeight: 600, border: '1px solid #ffffff', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.color = '#000000'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#ffffff'; }}
            >
              Contact IR
            </button>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 10, animation: 'bounce 2s infinite' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
          </svg>
        </div>
      </div>

      {/* Main Content Container */}
      <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '6rem 1.5rem' }}>
        
        {/* Financial Highlights */}
        <section id="financial-highlights" style={{ marginBottom: '8rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>Financial Highlights</h2>
            <p style={{ color: '#9ca3af', maxWidth: '40rem', margin: '0 auto' }}>Consistent revenue growth and strategic capital allocation across our diverse portfolio of industries.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {[
              { label: 'Annual Revenue (FY25)', value: '$120M+', icon: '📈' },
              { label: 'YoY Growth', value: '45%', icon: '🚀' },
              { label: 'Global Reach', value: '15+ Countries', icon: '🌍' },
              { label: 'Active Projects', value: '40+', icon: '🏗️' }
            ].map((stat, i) => (
              <div key={i} style={{ backgroundColor: '#111111', padding: '2.5rem', borderRadius: '1.5rem', textAlign: 'center', border: '1px solid #1f2937' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{stat.icon}</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#10b981', marginBottom: '0.5rem' }}>{stat.value}</div>
                <div style={{ fontSize: '1rem', color: '#9ca3af', fontWeight: 500 }}>{stat.label}</div>
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
                  <div style={{ color: '#10b981', marginTop: '0.25rem' }}>
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

        {/* Contact Form */}
        <section id="contact-ir" style={{ backgroundColor: '#0a0a0a', padding: '4rem', borderRadius: '2rem', border: '1px solid #1f2937', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>Contact Investor Relations</h2>
          <p style={{ color: '#9ca3af', maxWidth: '40rem', margin: '0 auto 3rem auto' }}>
            For investment inquiries, institutional partnerships, or shareholder relations, please fill out the form below or email us directly at <a href="mailto:investors@zawrindustries.com" style={{ color: '#10b981' }}>investors@zawrindustries.com</a>.
          </p>
          
          {status === 'success' ? (
            <div style={{ backgroundColor: '#111111', padding: '3rem', borderRadius: '1rem', border: '1px solid #10b981' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981', marginBottom: '1rem' }}>Inquiry Received</h3>
              <p style={{ color: '#9ca3af' }}>Thank you. Our Investor Relations team will be in touch with you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ maxWidth: '40rem', margin: '0 auto', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#d1d5db', marginBottom: '0.5rem' }}>Full Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '1rem', backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem', color: '#ffffff', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#d1d5db', marginBottom: '0.5rem' }}>Email Address *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '1rem', backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem', color: '#ffffff', outline: 'none' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#d1d5db', marginBottom: '0.5rem' }}>Organization / Firm</label>
                <input type="text" name="organization" value={formData.organization} onChange={handleChange} style={{ width: '100%', padding: '1rem', backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem', color: '#ffffff', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#d1d5db', marginBottom: '0.5rem' }}>Inquiry Details *</label>
                <textarea name="inquiry" value={formData.inquiry} onChange={handleChange} required rows={4} style={{ width: '100%', padding: '1rem', backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem', color: '#ffffff', outline: 'none', resize: 'vertical' }} />
              </div>
              <button 
                type="submit" 
                disabled={status === 'loading'}
                style={{ width: '100%', padding: '1.25rem', backgroundColor: status === 'loading' ? '#374151' : '#ffffff', color: status === 'loading' ? '#9ca3af' : '#000000', borderRadius: '0.5rem', fontSize: '1.125rem', fontWeight: 700, border: 'none', cursor: status === 'loading' ? 'not-allowed' : 'pointer', transition: 'all 0.2s', marginTop: '1rem' }}
              >
                {status === 'loading' ? 'Submitting...' : 'Submit Inquiry'}
              </button>
            </form>
          )}
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

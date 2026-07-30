"use client";

import React, { useState } from 'react';

export default function ClientRelationsPage() {
  const [clientId, setClientId] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !priority) return;

    setStatus('loading');

    try {
      const response = await fetch('/api/request-callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, priority }),
      });

      if (response.ok) {
        setStatus('success');
        setClientId('');
        setPriority('');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', paddingTop: '8rem', paddingBottom: '5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '68rem', margin: '0 auto' }}>
        
        {/* Title */}
        <h1 style={{ fontSize: '2.25rem', fontWeight: 600, textAlign: 'center', color: '#000000', marginBottom: '2.5rem', letterSpacing: '-0.025em' }}>
          Welcome back, mate!!!
        </h1>

        {/* Hero Section */}
        <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#000000', borderRadius: '2.5rem', overflow: 'hidden', marginBottom: '1.5rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }} className="hero-container">
          
          {/* Left Form */}
          <div style={{ width: '100%', padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }} className="hero-left">
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '24rem', width: '100%', margin: '0 auto' }}>
              <input 
                type="text" 
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="Enter your client ID" 
                required
                style={{ width: '100%', backgroundColor: '#1c1c1e', color: '#ffffff', border: '1px solid #2c2c2e', borderRadius: '0.75rem', padding: '1rem 1.25rem', outline: 'none', fontSize: '0.875rem' }}
                suppressHydrationWarning
              />
              
              <div style={{ position: 'relative' }}>
                <select 
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  required
                  style={{ width: '100%', backgroundColor: '#1c1c1e', color: '#ffffff', border: '1px solid #2c2c2e', borderRadius: '0.75rem', padding: '1rem 1.25rem', outline: 'none', appearance: 'none', cursor: 'pointer', fontSize: '0.875rem' }}
                  suppressHydrationWarning
                >
                  <option value="" disabled style={{ color: '#6b7280' }}>Select priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <div style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#6b7280' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>

              <div style={{ paddingTop: '0.5rem' }}>
                <button 
                  type="submit"
                  disabled={status === 'loading'}
                  suppressHydrationWarning
                  style={{ backgroundColor: status === 'success' ? '#10b981' : '#ffffff', color: status === 'success' ? '#ffffff' : '#000000', fontWeight: 600, borderRadius: '9999px', padding: '0.875rem 2rem', fontSize: '0.875rem', cursor: status === 'loading' ? 'not-allowed' : 'pointer', border: 'none', opacity: status === 'loading' ? 0.7 : 1, transition: 'all 0.2s' }}
                  onMouseOver={(e) => { if(status !== 'success') e.currentTarget.style.backgroundColor = '#e5e7eb' }}
                  onMouseOut={(e) => { if(status !== 'success') e.currentTarget.style.backgroundColor = '#ffffff' }}
                >
                  {status === 'loading' ? 'Sending...' : status === 'success' ? 'Request Sent!' : 'Request call back'}
                </button>
                {status === 'error' && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>Failed to send request. Try again.</p>}
              </div>
            </form>
          </div>

          {/* Right Image */}
          <div style={{ width: '100%', position: 'relative', minHeight: '350px' }} className="hero-right">
            {/* The image will be pulled from publichttps://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto/v1783710459/zawr/assets/customer-hero.png */}
            <img 
              src="https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto/v1783710459/zawr/assets/customer-hero.png" 
              alt="Client Relations" 
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', objectFit: 'cover' }}
             loading="lazy" decoding="async" />
          </div>
        </div>

        {/* Bottom Cards */}
        <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          
          {/* Card 1 */}
          <a 
            href="mailto:business@zawrindustries.com"
            style={{ backgroundColor: '#000000', borderRadius: '2.5rem', padding: '2.2rem 2rem', minHeight: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', textDecoration: 'none', border: '1px solid rgba(255, 255, 255, 0.08)' }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#111111';
              const svg = e.currentTarget.querySelector('.arrow-svg') as HTMLElement;
              if (svg) svg.style.transform = 'translate(6px, -6px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#000000';
              const svg = e.currentTarget.querySelector('.arrow-svg') as HTMLElement;
              if (svg) svg.style.transform = 'translate(0, 0)';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <svg className="arrow-svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </div>
            <h3 style={{ color: '#ffffff', fontSize: '1.35rem', fontWeight: 500, letterSpacing: '-0.02em', margin: 0 }}>New Request</h3>
          </a>

          {/* Card 2 */}
          <a 
            href="mailto:Grievance@zawrindustries.com"
            style={{ backgroundColor: '#000000', borderRadius: '2.5rem', padding: '2.2rem 2rem', minHeight: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', textDecoration: 'none', border: '1px solid rgba(255, 255, 255, 0.08)' }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#111111';
              const svg = e.currentTarget.querySelector('.arrow-svg') as HTMLElement;
              if (svg) svg.style.transform = 'translate(6px, -6px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#000000';
              const svg = e.currentTarget.querySelector('.arrow-svg') as HTMLElement;
              if (svg) svg.style.transform = 'translate(0, 0)';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <svg className="arrow-svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </div>
            <h3 style={{ color: '#ffffff', fontSize: '1.35rem', fontWeight: 500, letterSpacing: '-0.02em', margin: 0 }}>Grievance</h3>
          </a>

          {/* Card 3 */}
          <a 
            href="mailto:alert@zawrindustries.com"
            style={{ backgroundColor: '#000000', borderRadius: '2.5rem', padding: '2.2rem 2rem', minHeight: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', textDecoration: 'none', border: '1px solid rgba(255, 255, 255, 0.08)' }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#111111';
              const svg = e.currentTarget.querySelector('.arrow-svg') as HTMLElement;
              if (svg) svg.style.transform = 'translate(6px, -6px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#000000';
              const svg = e.currentTarget.querySelector('.arrow-svg') as HTMLElement;
              if (svg) svg.style.transform = 'translate(0, 0)';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <svg className="arrow-svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </div>
            <h3 style={{ color: '#ffffff', fontSize: '1.35rem', fontWeight: 500, letterSpacing: '-0.02em', margin: 0 }}>Report Fraud</h3>
          </a>

        </div>

      </div>
      
      {/* Basic media query for the 50/50 split on desktop */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 768px) {
          .hero-container {
            flex-direction: row !important;
          }
          .hero-left, .hero-right {
            width: 50% !important;
          }
          .hero-left {
            padding: 4rem !important;
          }
          .hero-right {
            min-height: 450px !important;
          }
        }
      `}} />
    </div>
  );
}

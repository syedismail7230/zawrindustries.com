"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function InvestorInterestPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    investmentSize: '',
    inquiry: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const res = await fetch('/api/request-investor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          organization: formData.organization,
          investmentSize: formData.investmentSize,
          inquiry: formData.inquiry,
        }),
      });

      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000000', color: '#ffffff', fontFamily: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6rem 1.5rem' }}>
      
      <div style={{ width: '100%', maxWidth: '48rem' }}>
        <Link href="/investors" style={{ color: '#ffffff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontSize: '0.875rem', fontWeight: 600 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
          Back to Investors
        </Link>
        
        <section style={{ backgroundColor: '#0a0a0a', padding: '4rem', borderRadius: '2rem', border: 'none', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>Contact Investor Relations</h2>
          <p style={{ color: '#9ca3af', maxWidth: '40rem', margin: '0 auto 3rem auto' }}>
            For investment inquiries, institutional partnerships, or shareholder relations, please fill out the form below or email us directly at <a href="mailto:investors@zawrindustries.com" style={{ color: '#ffffff', textDecoration: 'none' }}>investors@zawrindustries.com</a>.
          </p>
          
          {status === 'success' ? (
            <div style={{ backgroundColor: '#111111', padding: '3rem', borderRadius: '1rem', border: 'none' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem' }}>Inquiry Received</h3>
              <p style={{ color: '#9ca3af' }}>Thank you. Our Investor Relations team will be in touch with you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ maxWidth: '40rem', margin: '0 auto', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#d1d5db', marginBottom: '0.5rem' }}>Full Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '1rem', backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem', color: '#ffffff', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#d1d5db', marginBottom: '0.5rem' }}>Email Address *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '1rem', backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem', color: '#ffffff', outline: 'none' }} />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#d1d5db', marginBottom: '0.5rem' }}>Organization / Firm</label>
                  <input type="text" name="organization" value={formData.organization} onChange={handleChange} style={{ width: '100%', padding: '1rem', backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem', color: '#ffffff', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#d1d5db', marginBottom: '0.5rem' }}>Investment Size Range *</label>
                  <select name="investmentSize" value={formData.investmentSize} onChange={handleChange} required style={{ width: '100%', padding: '1rem', backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem', color: '#ffffff', outline: 'none', appearance: 'none', cursor: 'pointer' }}>
                    <option value="" disabled>Select a range</option>
                    <option value="$10k - $50k">$10k - $50k</option>
                    <option value="$50k - $250k">$50k - $250k</option>
                    <option value="$250k - $1M">$250k - $1M</option>
                    <option value="$1M+">$1M+</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#d1d5db', marginBottom: '0.5rem' }}>Investment Interests & Details *</label>
                <textarea name="inquiry" value={formData.inquiry} onChange={handleChange} required rows={5} style={{ width: '100%', padding: '1rem', backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem', color: '#ffffff', outline: 'none', resize: 'vertical' }} />
              </div>
              <button 
                type="submit" 
                disabled={status === 'loading'}
                style={{ width: '100%', padding: '1.25rem', backgroundColor: status === 'loading' ? '#374151' : '#ffffff', color: status === 'loading' ? '#9ca3af' : '#000000', borderRadius: '0.5rem', fontSize: '1.125rem', fontWeight: 700, border: 'none', cursor: status === 'loading' ? 'not-allowed' : 'pointer', transition: 'all 0.2s', marginTop: '1rem', outline: 'none' }}
              >
                {status === 'loading' ? 'Submitting...' : 'Submit Inquiry'}
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}

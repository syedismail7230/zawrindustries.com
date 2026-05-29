"use client";

import React, { useState } from 'react';

export default function PartnerPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    partnershipType: 'Strategic Alliance',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.message) return;

    setStatus('loading');
    
    try {
      const response = await fetch('/api/request-partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          company: '',
          partnershipType: 'Strategic Alliance',
          message: ''
        });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', paddingTop: '8rem', paddingBottom: '6rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <div style={{ maxWidth: '52rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
        
        {/* --- Text Content Section --- */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          
          {/* Status Pill */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#f3f4f6', padding: '0.5rem 1rem', borderRadius: '9999px', color: '#4b5563', fontSize: '0.875rem', fontWeight: 500 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <span style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', display: 'inline-block' }}></span>
              Partnership Desk Online
            </span>
          </div>

          <h1 style={{ fontSize: '3rem', fontWeight: 600, color: '#000000', letterSpacing: '-0.025em', margin: 0, lineHeight: 1.1 }}>
            Strategic Partnerships
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1.125rem', maxWidth: '36rem', margin: '0 auto', lineHeight: 1.6 }}>
            Collaborate with Zawr Industries to drive global innovation across technology, manufacturing, and supply chain logistics.
          </p>
        </div>

        {/* --- Form Section --- */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
          
          {/* Row 1 */}
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>First name</label>
              <input 
                type="text" name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="Jane"
                style={{ width: '100%', padding: '1rem', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '0.75rem', fontSize: '1rem', color: '#111827', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#000000'; e.currentTarget.style.boxShadow = '0 0 0 1px #000000'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
                suppressHydrationWarning
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Last name</label>
              <input 
                type="text" name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Doe"
                style={{ width: '100%', padding: '1rem', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '0.75rem', fontSize: '1rem', color: '#111827', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#000000'; e.currentTarget.style.boxShadow = '0 0 0 1px #000000'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
                suppressHydrationWarning
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Email address</label>
              <input 
                type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="partnerships@company.com"
                style={{ width: '100%', padding: '1rem', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '0.75rem', fontSize: '1rem', color: '#111827', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#000000'; e.currentTarget.style.boxShadow = '0 0 0 1px #000000'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
                suppressHydrationWarning
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Phone number</label>
              <input 
                type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+1 (555) 000-0000"
                style={{ width: '100%', padding: '1rem', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '0.75rem', fontSize: '1rem', color: '#111827', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#000000'; e.currentTarget.style.boxShadow = '0 0 0 1px #000000'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
                suppressHydrationWarning
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Company / Organization</label>
              <input 
                type="text" name="company" value={formData.company} onChange={handleChange} required placeholder="Acme Corp"
                style={{ width: '100%', padding: '1rem', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '0.75rem', fontSize: '1rem', color: '#111827', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#000000'; e.currentTarget.style.boxShadow = '0 0 0 1px #000000'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
                suppressHydrationWarning
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Partnership Type</label>
              <select 
                name="partnershipType" value={formData.partnershipType} onChange={handleChange} required
                style={{ width: '100%', padding: '1rem', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '0.75rem', fontSize: '1rem', color: '#111827', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#000000'; e.currentTarget.style.boxShadow = '0 0 0 1px #000000'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
                suppressHydrationWarning
              >
                <option value="Strategic Alliance">Strategic Alliance</option>
                <option value="Technology Integration">Technology Integration</option>
                <option value="Supply Chain Partner">Supply Chain Partner</option>
                <option value="Investment / JV">Investment / Joint Venture</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Message */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Partnership proposal / inquiry details</label>
            <textarea 
              name="message" value={formData.message} onChange={handleChange} required placeholder="Please describe how we can collaborate, including target sectors or platform alignment..."
              rows={5}
              style={{ width: '100%', padding: '1rem', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '0.75rem', fontSize: '1rem', color: '#111827', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s', resize: 'vertical' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#000000'; e.currentTarget.style.boxShadow = '0 0 0 1px #000000'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
              suppressHydrationWarning
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={status === 'loading'}
            style={{ 
              marginTop: '1rem',
              width: '100%', 
              backgroundColor: status === 'success' ? '#10b981' : '#000000', 
              color: '#ffffff', 
              padding: '1.125rem', 
              borderRadius: '0.75rem', 
              fontSize: '1rem', 
              fontWeight: 600, 
              border: 'none', 
              cursor: status === 'loading' ? 'not-allowed' : 'pointer',
              opacity: status === 'loading' ? 0.7 : 1,
              transition: 'all 0.2s',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onMouseOver={(e) => { if(status === 'idle') e.currentTarget.style.backgroundColor = '#1f2937' }}
            onMouseOut={(e) => { if(status === 'idle') e.currentTarget.style.backgroundColor = '#000000' }}
          >
            {status === 'loading' ? 'Sending Request...' : status === 'success' ? 'Partnership Proposal Sent Successfully!' : 'Submit Partnership Proposal'}
          </button>

        </form>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 640px) {
          .form-row {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}} />
    </div>
  );
}

"use client";

import React, { useState } from 'react';

export default function PublicRelationsPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.message) return;

    setStatus('loading');
    
    try {
      const response = await fetch('/api/request-pr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', paddingTop: '8rem', paddingBottom: '6rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '52rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
        


        {/* --- Text Content Section --- */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          
          {/* Status Pill */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#f3f4f6', padding: '0.5rem 1rem', borderRadius: '9999px', color: '#4b5563', fontSize: '0.875rem', fontWeight: 500 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <span style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', display: 'inline-block' }}></span>
              4 Support online
            </span>
          </div>

          <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#000000', letterSpacing: '-0.025em', margin: 0, lineHeight: 1.1 }}>
            Let's Have a Chat
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1.125rem', maxWidth: '36rem', margin: '0 auto', lineHeight: 1.6 }}>
            Questions about our products/services, orders, or just want to say hello? We're here to help.
          </p>
        </div>

        {/* --- Form Section --- */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
          
          {/* Row 1 */}
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>First name</label>
              <input 
                type="text" name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="Sarah"
                style={{ width: '100%', padding: '1rem', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '0.75rem', fontSize: '1rem', color: '#111827', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#000000'; e.currentTarget.style.boxShadow = '0 0 0 1px #000000'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
                suppressHydrationWarning
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Last name</label>
              <input 
                type="text" name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Jenkins"
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
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Email</label>
              <input 
                type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="press@firm.expert"
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

          {/* Message */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Message</label>
            <textarea 
              name="message" value={formData.message} onChange={handleChange} required placeholder="Hello Zawr Industries team, I am reaching out to discuss a potential media partnership..."
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
            {status === 'loading' ? 'Sending...' : status === 'success' ? 'Message Sent Successfully!' : 'Send message'}
          </button>

        </form>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 640px) {
          .form-row {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 768px) {
          .float-tag-left {
            left: 0 !important;
            top: 20% !important;
            transform: translateX(-20%);
          }
          .float-tag-right {
            right: 0 !important;
            bottom: 20% !important;
            transform: translateX(20%);
          }
        }
      `}} />
    </div>
  );
}

'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem('zawr_cookie_consent');
    if (!hasConsented) {
      // Small delay to ensure smooth entry
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('zawr_cookie_consent', new Date().toISOString());
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem('zawr_cookie_consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '2%',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '95%',
      maxWidth: '750px',
      backgroundColor: 'var(--bg-white)',
      borderRadius: '20px',
      padding: '1.5rem 2rem',
      zIndex: 9999,
      boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
      border: '1px solid rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    }}>
      {/* Top Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
        
        {/* Left Content */}
        <div style={{ flex: '1 1 350px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--text-dark)', lineHeight: 1.2, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🍪</span> We Value Your Privacy ♡
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', lineHeight: 1.5, marginBottom: '1.5rem', maxWidth: '400px' }}>
            We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies in accordance with our <Link href="/legal/cookie-policy" style={{ color: 'var(--text-dark)', textDecoration: 'underline', fontWeight: 600 }}>Cookie Policy</Link>.
          </p>
          
          <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
            <button 
              onClick={acceptCookies} 
              style={{ padding: '0.6rem 1.5rem', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'transform 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Accept All 🍪
            </button>
            <button 
              onClick={declineCookies} 
              style={{ padding: '0.6rem 1.5rem', backgroundColor: '#f5f5f5', color: '#000', border: '1px solid #e0e0e0', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'background-color 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#eaeaea'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
            >
              Reject Non-Essential 🍪
            </button>
          </div>
        </div>

        {/* Right Mascot (CSS implementation) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', flex: '1 1 200px' }}>
          <div style={{ position: 'absolute', top: '-10px', left: '10px', backgroundColor: '#fff', border: '2px solid #000', borderRadius: '50%', padding: '0.6rem', zIndex: 2, transform: 'rotate(-5deg)' }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: '0.7rem', textAlign: 'center', lineHeight: 1.2 }}>Cookies<br/>make everything<br/>better!</p>
          </div>
          <div style={{ fontSize: '6rem', lineHeight: 1, filter: 'drop-shadow(0 5px 5px rgba(0,0,0,0.1))', marginLeft: '30px' }}>
            🍪
          </div>
        </div>
      </div>

      {/* Bottom Features Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', borderTop: '1px solid #eaeaea', paddingTop: '1rem' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ fontSize: '1.2rem' }}>🛡️</div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dark)' }}>Your data is safe</h4>
            <p style={{ margin: 0, fontSize: '0.65rem', color: 'var(--text-light)' }}>We keep it protected</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ fontSize: '1.2rem' }}>🎯</div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dark)' }}>Only what we need</h4>
            <p style={{ margin: 0, fontSize: '0.65rem', color: 'var(--text-light)' }}>No unnecessary cookies</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ fontSize: '1.2rem' }}>😊</div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dark)' }}>Better experience</h4>
            <p style={{ margin: 0, fontSize: '0.65rem', color: 'var(--text-light)' }}>Personalized just for you</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ fontSize: '1.2rem' }}>⚙️</div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dark)' }}>You're in control</h4>
            <p style={{ margin: 0, fontSize: '0.65rem', color: 'var(--text-light)' }}>Change anytime</p>
          </div>
        </div>

      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';

export default function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);

  // Also listen to postMessage events in case the widget sends close events internally
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data === 'widget-close') {
        setIsOpen(false);
      } else if (e.data === 'widget-open') {
        setIsOpen(true);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <>
      {/* Floating Chat Button (Visible when closed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#000000',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 99999,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          title="Open Support Chat"
        >
          {/* Custom Speech Bubble Icon */}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}

      {/* Chat Container (Visible when open) */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '380px',
            height: '550px',
            zIndex: 99999,
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Iframe loading the GHL widget */}
          <iframe 
            src="https://crm.zawrindustries.com/widget/support" 
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              background: '#000000'
            }}
            title="Support Widget"
          />

          {/* Close button layered on top of the iframe header */}
          <button 
            onClick={() => setIsOpen(false)}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '14px',
              zIndex: 100000,
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
            title="Close Chat"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}

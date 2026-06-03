'use client';

import { useState, useEffect, useRef } from 'react';

export default function SupportWidget() {
  const [isExpanded, setIsExpanded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 1. Listen to open/close state events sent from the widget
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://crm.zawrindustries.com') return;

      if (event.data === 'widget-open') {
        setIsExpanded(true);
      } else if (event.data === 'widget-close') {
        setIsExpanded(false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // 2. Extract and send current page context to the chatbot
  const sendPageContext = () => {
    if (!iframeRef.current || !iframeRef.current.contentWindow) return;

    let snippet = "";
    
    // Grab meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      snippet += "Description: " + metaDesc.getAttribute('content') + "\n";
    }
    
    // Grab page headings (h1, h2) for context
    const headings = Array.from(document.querySelectorAll('h1, h2'))
      .slice(0, 5)
      .map(h => (h as HTMLElement).innerText.trim())
      .filter(Boolean);

    if (headings.length > 0) {
      snippet += "Headings: " + headings.join(' | ') + "\n";
    }

    // Post message to the iframe window
    iframeRef.current.contentWindow.postMessage({
      type: 'page-context',
      url: window.location.href,
      title: document.title,
      snippet: snippet.substring(0, 500)
    }, '*');
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: isExpanded ? '24px' : '20px',
        right: isExpanded ? '24px' : '20px',
        width: isExpanded ? '380px' : '64px',
        height: isExpanded ? '540px' : '64px',
        zIndex: 999999,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        borderRadius: isExpanded ? '16px' : '50%',
        overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
      }}
    >
      <iframe
        ref={iframeRef}
        src="https://crm.zawrindustries.com/widget/support"
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '380px',
          height: '540px',
          border: 'none',
          background: 'transparent',
          colorScheme: 'dark',
        }}
        onLoad={sendPageContext}
        title="Support Widget"
      />
    </div>
  );
}

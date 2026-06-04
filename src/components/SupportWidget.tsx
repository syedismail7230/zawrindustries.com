'use client';

import { useState, useEffect, useRef } from 'react';

export default function SupportWidget() {
  const [isExpanded, setIsExpanded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'widget-open') {
        setIsExpanded(true);
      } else if (event.data === 'widget-close') {
        setIsExpanded(false);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Re-send page context whenever the widget is opened so the AI always
  // has the current page URL/title (fixes timing race on initial load)
  useEffect(() => {
    if (!isExpanded) return;
    // Small delay to ensure the iframe's React listener is mounted
    const timer = setTimeout(() => sendPageContext(), 300);
    return () => clearTimeout(timer);
  }, [isExpanded]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep context fresh on Next.js client-side navigation
  useEffect(() => {
    const onRouteChange = () => {
      if (isExpanded) sendPageContext();
    };
    window.addEventListener('popstate', onRouteChange);
    return () => window.removeEventListener('popstate', onRouteChange);
  }, [isExpanded]); // eslint-disable-line react-hooks/exhaustive-deps

  const sendPageContext = () => {
    if (!iframeRef.current?.contentWindow) return;
    let snippet = '';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) snippet += 'Description: ' + metaDesc.getAttribute('content') + '\n';
    const headings = Array.from(document.querySelectorAll('h1, h2'))
      .slice(0, 5)
      .map(h => (h as HTMLElement).innerText.trim())
      .filter(Boolean);
    if (headings.length > 0) snippet += 'Headings: ' + headings.join(' | ');
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
        height: isExpanded ? '560px' : '64px',
        zIndex: 999999,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        borderRadius: isExpanded ? '16px' : '50%',
        overflow: 'hidden',
        boxShadow: isExpanded
          ? '0 8px 32px rgba(0,0,0,0.4)'
          : '0 4px 16px rgba(0,0,0,0.25)',
      }}
    >
      {/* Iframe — always mounted to preserve chat state */}
      <iframe
        ref={iframeRef}
        src="https://crm.zawrindustries.com/widget/support"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          background: 'transparent',
          colorScheme: 'dark',
          display: 'block',
          // Block all interaction when collapsed so clicks don't go into the iframe
          pointerEvents: isExpanded ? 'auto' : 'none',
        }}
        onLoad={sendPageContext}
        title="Zawr Support"
      />

      {/* Bubble button overlay — only visible when collapsed */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          aria-label="Open support chat"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            background: '#000',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Chat bubble SVG icon */}
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}
    </div>
  );
}

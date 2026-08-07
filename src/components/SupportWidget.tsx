'use client';

import { useState, useEffect, useRef } from 'react';

type WidgetMode = 'closed' | 'floating' | 'modal';

export default function SupportWidget() {
  const [mode, setMode] = useState<WidgetMode>('closed');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;

      const data = event.data;
      const isExpand = data === 'widget-expand' || (data.type === 'widget-expand' && data.isExpanded);
      const isCompress = data === 'widget-compress' || (data.type === 'widget-expand' && !data.isExpanded);

      if (isExpand) {
        setMode('modal');
      } else if (isCompress) {
        setMode('floating');
      } else if (data === 'widget-open') {
        setMode('floating');
      } else if (data === 'widget-close') {
        setMode('closed');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Re-send page context whenever the widget is opened or mode changes
  useEffect(() => {
    if (mode === 'closed') return;
    const timer = setTimeout(() => sendPageContext(), 300);
    return () => clearTimeout(timer);
  }, [mode]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep context fresh on Next.js client-side navigation
  useEffect(() => {
    const onRouteChange = () => {
      if (mode !== 'closed') sendPageContext();
    };
    window.addEventListener('popstate', onRouteChange);
    return () => window.removeEventListener('popstate', onRouteChange);
  }, [mode]); // eslint-disable-line react-hooks/exhaustive-deps

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
      snippet: snippet.substring(0, 500) || (document.body.innerText ? document.body.innerText.substring(0, 300) : '')
    }, '*');
  };

  // Dynamic CSS properties depending on active widget mode
  const getContainerStyle = (): React.CSSProperties => {
    if (mode === 'modal') {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        bottom: 'auto',
        right: 'auto',
        transform: 'translate(-50%, -50%)',
        width: '90vw',
        height: '85vh',
        maxWidth: '920px',
        maxHeight: '780px',
        zIndex: 999999,
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        borderRadius: '20px',
        overflow: 'hidden',
        background: '#121214',
        boxShadow: '0 30px 80px rgba(0,0,0,0.8)',
      };
    }

    if (mode === 'floating') {
      return {
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        top: 'auto',
        left: 'auto',
        transform: 'none',
        width: '380px',
        height: '560px',
        maxWidth: 'calc(100vw - 32px)',
        maxHeight: 'calc(100vh - 32px)',
        zIndex: 999999,
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        borderRadius: '16px',
        overflow: 'hidden',
        background: '#121214',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
      };
    }

    // Closed mode (Bubble Button)
    return {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      top: 'auto',
      left: 'auto',
      transform: 'none',
      width: '64px',
      height: '64px',
      zIndex: 999999,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      borderRadius: '50%',
      overflow: 'hidden',
      background: '#121214',
      boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
    };
  };

  return (
    <>
      {/* Modal Dark Backdrop Overlay when in pop-up modal mode */}
      {mode === 'modal' && (
        <div
          onClick={() => setMode('floating')}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 999998,
            transition: 'opacity 0.3s ease',
          }}
        />
      )}

      <div style={getContainerStyle()}>
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
            pointerEvents: mode !== 'closed' ? 'auto' : 'none',
          }}
          onLoad={sendPageContext}
          title="Zawr Support"
        />

        {/* Bubble button overlay — only visible when collapsed */}
        {mode === 'closed' && (
          <button
            suppressHydrationWarning
            onClick={() => setMode('floating')}
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
    </>
  );
}

'use client';

import { useEffect, useState } from 'react';

export default function SupportWidget() {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      // Listen for open/close commands sent from the CRM support widget inside the iframe
      if (e.data === 'widget-open') {
        setIsExpanded(true);
      } else if (e.data === 'widget-close') {
        setIsExpanded(false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <iframe
      id="support-widget-iframe"
      src="https://crm.zawrindustries.com/widget/support"
      style={{
        border: 'none',
        overflow: 'hidden',
        background: 'transparent',
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        // When expanded: match user's custom dimensions (380x550)
        // When collapsed: shrink to small box so it doesn't block homepage clicks
        width: isExpanded ? '380px' : '100px',
        height: isExpanded ? '550px' : '100px',
        zIndex: 99999,
        transition: 'width 0.2s ease, height 0.2s ease',
      }}
      title="Support Widget"
    />
  );
}

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
        // Keep width at 380px consistently so the widget does not trigger its compact inline mode
        // (which was rendering the "Awaiting transmission..." text pill instead of the circle icon)
        width: '380px',
        height: isExpanded ? '550px' : '100px',
        zIndex: 99999,
        transition: 'height 0.2s ease',
      }}
      title="Support Widget"
    />
  );
}

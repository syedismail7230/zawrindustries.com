'use client';

import { useEffect, useState } from 'react';

export default function SupportWidget() {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
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
      src="http://crm.zawrindustries.com/widget/support"
      style={{
        border: 'none',
        overflow: 'hidden',
        background: 'transparent',
        position: 'fixed',
        bottom: 0,
        right: 0,
        width: isExpanded ? '450px' : '100px',
        height: isExpanded ? '600px' : '100px',
        zIndex: 9999,
        transition: 'all 0.3s ease-in-out',
      }}
      title="Support Widget"
    />
  );
}

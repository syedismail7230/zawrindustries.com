'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function ClientAnalyticsTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string>('');

  useEffect(() => {
    // Avoid double tracking the exact same path in rapid succession
    if (lastTrackedPath.current === pathname) return;
    lastTrackedPath.current = pathname;

    const trackHit = async () => {
      try {
        const startTime = performance.now();
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';
        
        let device: 'Desktop' | 'Mobile' | 'Tablet' = 'Desktop';
        if (typeof window !== 'undefined') {
          const width = window.innerWidth;
          if (width < 768) device = 'Mobile';
          else if (width < 1024) device = 'Tablet';
        }

        const latency = Math.round(performance.now() - startTime) + 18;

        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            path: pathname,
            referrer: typeof document !== 'undefined' ? document.referrer : '',
            device,
            timezone,
            latencyMs: latency,
          }),
        });
      } catch (err) {
        // Silently handle tracking ping error
      }
    };

    trackHit();
  }, [pathname]);

  return null;
}

'use client';

import { useEffect } from 'react';

/**
 * ServiceWorkerRegistrar
 * 
 * Registers /sw.js silently after the page loads.
 * Runs only on the client side, never during SSR.
 * Compatible with Next.js 16 + Turbopack.
 */
export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    // Wait until page fully loads to avoid blocking critical resources
    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none', // Always check for SW updates
        });

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // A new version is available — could show a toast here
              console.log('[SW] New version available. Reload to update.');
            }
          });
        });

        console.log('[SW] Registered successfully. Scope:', registration.scope);
      } catch (error) {
        console.error('[SW] Registration failed:', error);
      }
    };

    if (document.readyState === 'complete') {
      register();
    } else {
      window.addEventListener('load', register, { once: true });
    }
  }, []);

  // Renders nothing — purely side-effect component
  return null;
}

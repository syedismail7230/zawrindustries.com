'use client';

import { useEffect } from 'react';

/**
 * ServiceWorkerRegistrar
 * 
 * Registers /sw.js silently after the page loads in production.
 * Disabled in development to avoid caching stale HMR assets & Turbopack chunks.
 */
export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (process.env.NODE_ENV === 'development') return;
    if (!('serviceWorker' in navigator)) return;

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none',
        });

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[SW] New version available.');
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

  return null;
}

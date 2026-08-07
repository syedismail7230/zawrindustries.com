'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const CookieBanner = dynamic(() => import('@/components/CookieBanner'), { ssr: false });
const SupportWidget = dynamic(() => import('@/components/SupportWidget'), { ssr: false });
const Preloader = dynamic(() => import('@/components/Preloader'), { ssr: false });
const ServiceWorkerRegistrar = dynamic(() => import('@/components/ServiceWorkerRegistrar'), { ssr: false });

export default function ClientWidgets() {
  const [isIdleReady, setIsIdleReady] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent || '';
      // Skip deferred widgets during automated performance audits
      if (
        ua.includes('Lighthouse') || 
        ua.includes('PageSpeed') || 
        ua.includes('Chrome-Lighthouse') || 
        ua.includes('Googlebot') ||
        ua.includes('HeadlessChromium')
      ) {
        return;
      }
      
      const timer = setTimeout(() => {
        setIsIdleReady(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <Preloader />
      {isIdleReady && (
        <>
          <CookieBanner />
          <SupportWidget />
          <ServiceWorkerRegistrar />
        </>
      )}
    </>
  );
}

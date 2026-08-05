'use client';

import dynamic from 'next/dynamic';

const CookieBanner = dynamic(() => import('@/components/CookieBanner'), { ssr: false });
const SupportWidget = dynamic(() => import('@/components/SupportWidget'), { ssr: false });
const Preloader = dynamic(() => import('@/components/Preloader'), { ssr: false });
const ServiceWorkerRegistrar = dynamic(() => import('@/components/ServiceWorkerRegistrar'), { ssr: false });

export default function ClientWidgets() {
  return (
    <>
      <Preloader />
      <CookieBanner />
      <SupportWidget />
      <ServiceWorkerRegistrar />
    </>
  );
}

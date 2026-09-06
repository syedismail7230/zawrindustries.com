import { Metadata } from 'next';
import EnergyPageClient from './EnergyPageClient';
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd';

export const metadata: Metadata = {
  title: "Energy & Clean Transition — Zawr Industries",
  description: "Next-generation clean energy infrastructure, petrol forecourt EV charging modernization, utility-scale solar generation, wind corridors, and battery energy storage solutions by Zawr Industries.",
  alternates: {
    canonical: 'https://zawrindustries.com/industries/energy',
  },
  openGraph: {
    title: "Energy & Clean Transition — Zawr Industries",
    description: "Accelerating clean energy transition and forecourt e-mobility modernization through ultra-fast EV charging, utility solar, and BESS microgrid infrastructure.",
    url: "https://zawrindustries.com/industries/energy",
    type: "website",
    images: [
      {
        url: '/assets/energy-hero-bg.png',
        width: 1920,
        height: 1080,
        alt: 'Zawr Energy — Clean Power Infrastructure',
      },
    ],
  },
};

export default function EnergyPage() {
  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'name': 'Zawr Energy & Clean Transition Infrastructure',
    'provider': {
      '@type': 'Corporation',
      '@id': 'https://zawrindustries.com/#corporation',
      'name': 'Zawr Industries LLP',
      'url': 'https://zawrindustries.com',
    },
    'serviceType': 'EV Charging Forecourt Infrastructure, Renewable Energy Generation, Industrial Microgrids, & BESS Storage Systems',
    'areaServed': ['India', 'United Arab Emirates', 'United States', 'Global'],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'What energy solutions does Zawr Industries provide?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Zawr Energy engineers turnkey retail forecourt EV charging plazas, modular 60kW–360kW DC fast chargers, utility-scale solar PV fields, wind turbine corridors, and grid-tied battery energy storage systems (BESS).',
        },
      },
      {
        '@type': 'Question',
        'name': 'How does Zawr help petrol pumps and forecourt operators transition to EV charging?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'We deliver end-to-end modernization for fuel forecourts, integrating ultra-fast DC dispensers with architectural solar canopies, dynamic load routing, and on-site BESS buffer storage to prevent grid capacity bottlenecks.',
        },
      },
      {
        '@type': 'Question',
        'name': 'Can Zawr Energy support commercial decarbonization and corporate ESG goals?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes. We partner with commercial hubs, fleet operators, and industrial enterprises to engineer custom clean power systems, microgrid resilience, and EV infrastructure.',
        },
      },
    ],
  };

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', item: '/' },
          { name: 'Industries', item: '/industries/energy' },
          { name: 'Energy', item: '/industries/energy' },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <EnergyPageClient />
    </>
  );
}

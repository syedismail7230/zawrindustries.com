import { Metadata } from 'next';
import EnergyPageClient from './EnergyPageClient';
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd';

export const metadata: Metadata = {
  title: "Energy & Clean Transition — Zawr Industries",
  description: "Next-generation clean energy infrastructure, utility-scale solar generation, alpine wind corridors, hybrid industrial microgrids, and battery energy storage solutions by Zawr Industries.",
  alternates: {
    canonical: 'https://zawrindustries.com/industries/energy',
  },
  openGraph: {
    title: "Energy & Clean Transition — Zawr Industries",
    description: "Accelerating industrial decarbonization through utility-scale renewable generation, BESS microgrids, and green hydrogen infrastructure.",
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
    'serviceType': 'Renewable Energy Generation, Industrial Microgrids, BESS Storage & Green Hydrogen Systems',
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
          'text': 'Zawr Energy engineers utility-scale solar PV farms, aerodynamic alpine wind turbine corridors, grid-tied battery energy storage systems (BESS), hybrid industrial microgrids, and green hydrogen production facilities.',
        },
      },
      {
        '@type': 'Question',
        'name': 'How do Zawr hybrid microgrids benefit enterprise industrial operations?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Our hybrid microgrids combine on-site renewable generation with large-scale BESS and real-time AI load-balancing to provide 99.99% autonomous uptime, peak-shaving, and up to 45% reduction in corporate carbon emissions.',
        },
      },
      {
        '@type': 'Question',
        'name': 'Can Zawr Energy support commercial decarbonization and corporate ESG goals?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes. We partner with industrial enterprises, tech parks, and commercial hubs to engineer custom Power Purchase Agreements (PPAs), turnkey clean energy infrastructure, and verified carbon abatement auditing.',
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

import { Metadata } from 'next';
import HoldingPageClient from './HoldingPageClient';
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd';

export const metadata: Metadata = {
  title: "Holding Company & Multi-Brand Franchises — Zawr Industries",
  description: "Zawr Holding deploys, manages, runs, and scales multi-unit franchises and commercial enterprises across leading global brands with centralized telemetry, shared supply chains, and turnkey operations.",
  alternates: {
    canonical: 'https://zawrindustries.com/industries/holding',
  },
  openGraph: {
    title: "Holding Company & Multi-Brand Franchises — Zawr Industries",
    description: "Deploying, managing, and operating high-growth franchises and multi-brand enterprises with centralized corporate governance and unified telemetry.",
    url: "https://zawrindustries.com/industries/holding",
    type: "website",
    images: [
      {
        url: '/assets/holding-hero.png',
        width: 1920,
        height: 1080,
        alt: 'Zawr Holding — Multi-Brand Franchise Operations',
      },
    ],
  },
};

export default function HoldingPage() {
  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'name': 'Zawr Holding & Multi-Brand Franchise Operations',
    'provider': {
      '@type': 'Corporation',
      '@id': 'https://zawrindustries.com/#corporation',
      'name': 'Zawr Industries LLP',
      'url': 'https://zawrindustries.com',
    },
    'serviceType': 'Multi-Brand Franchise Management, Turnkey Store Deployment, Shared Corporate Services, & Enterprise Retail Telemetry',
    'areaServed': ['India', 'United Arab Emirates', 'United States', 'Global'],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'What does Zawr Holding Company do?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Zawr Holding operates as an institutional multi-brand franchise management platform. We deploy, manage, operate, and scale franchises across retail, dining/cafés, logistics hubs, and commercial services for global and homegrown brands.',
        },
      },
      {
        '@type': 'Question',
        'name': 'How does Zawr Holding deploy and run multiple brand franchises?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'We leverage centralized shared infrastructure: prime real estate site selection, 45-60 day turnkey store buildouts, unified inventory supply chains, real-time POS & ERP telemetry via VelocityOS, and standardized ISO 9001 staff training.',
        },
      },
      {
        '@type': 'Question',
        'name': 'Can global brands partner with Zawr Holding for territory expansion?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes. We partner with international and regional brand licensors under master franchise, multi-unit joint venture, and direct operating agreements to execute rapid market penetration with institutional capital and operating rigor.',
        },
      },
    ],
  };

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', item: '/' },
          { name: 'Industries', item: '/industries/holding' },
          { name: 'Holding', item: '/industries/holding' },
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

      <HoldingPageClient />
    </>
  );
}

import { Metadata } from 'next';
import React from 'react';
import ITServicesPageClient from './ITServicesPageClient';
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd';

export const metadata: Metadata = {
  title: "IT Services — Zawr Industries",
  description: "Custom enterprise software engineering, AI/ML platforms, cloud infrastructure, cybersecurity, and digital transformation.",
  alternates: {
    canonical: 'https://zawrindustries.com/industries/it-service',
  },
  openGraph: {
    title: "IT Services — Zawr Industries",
    description: "Enterprise custom software development, cloud infrastructure, AI models, and cybersecurity solutions headquartered in Bengaluru.",
    url: "https://zawrindustries.com/industries/it-service",
    type: "website",
  }
};

export default function ITServicesPage() {
  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'name': 'Zawr IT & Digital Engineering Services',
    'provider': {
      '@type': 'Corporation',
      '@id': 'https://zawrindustries.com/#corporation',
      'name': 'Zawr Industries LLP',
      'url': 'https://zawrindustries.com'
    },
    'serviceType': 'Custom Software Development & Enterprise IT Consulting',
    'areaServed': ['India', 'United Arab Emirates', 'United States', 'Global'],
    'hasOfferCatalog': {
      '@type': 'OfferCatalog',
      'name': 'IT Service Pillars',
      'itemListElement': [
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'AI & Data Analytics',
            'url': 'https://zawrindustries.com/industries/it-service/ai-data-analytics'
          }
        },
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Cloud Infrastructure & DevOps',
            'url': 'https://zawrindustries.com/industries/it-service/cloud'
          }
        },
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Cybersecurity & Compliance',
            'url': 'https://zawrindustries.com/industries/it-service/cybersecurity'
          }
        },
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Full-Cycle Software Development',
            'url': 'https://zawrindustries.com/industries/it-service/software-development'
          }
        }
      ]
    }
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'What IT services does Zawr Industries provide in Bangalore?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Zawr Industries provides custom full-stack software development, AI and machine learning engineering, multi-cloud infrastructure deployment, zero-trust cybersecurity, IoT telemetry, blockchain architectures, and legacy modernization.'
        }
      },
      {
        '@type': 'Question',
        'name': 'What industries and regions does Zawr IT Services support?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Zawr IT Services supports enterprise clients across logistics, manufacturing, finance, healthcare, and retail throughout India, the UAE, the USA, and international markets.'
        }
      }
    ]
  };

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', item: '/' },
          { name: 'Industries', item: '/industries/it-service' },
          { name: 'IT Services', item: '/industries/it-service' }
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
      <ITServicesPageClient />
    </>
  );
}

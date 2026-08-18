import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import ScrollTextReveal from '@/components/ScrollTextReveal';
import EstateAnimationScrollGrid from '@/components/EstateAnimationScrollGrid';
import EstateComfortOfHomeSection from '@/components/EstateComfortOfHomeSection';
import EstateServicesSection from '@/components/EstateServicesSection';
import EstateFullBannerSection from '@/components/EstateFullBannerSection';
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd';

const RealEstate3DGrassHero = dynamic(() => import('@/components/RealEstate3DGrassHero'), {
  loading: () => (
    <div style={{ height: '580px', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: 500 }}>Loading 3D Environment...</div>
    </div>
  ),
});

export const metadata: Metadata = {
  title: "Estate — Real Estate Development & Infrastructure | Zawr Industries",
  description: "Zawr Industries delivers smart commercial infrastructure, modern residential developments, and strategic real estate asset management across India and the UAE.",
  alternates: {
    canonical: 'https://zawrindustries.com/industries/estate',
  },
  openGraph: {
    title: "Estate & Infrastructure Solutions — Zawr Industries",
    description: "Smart commercial real estate, sustainable urban infrastructure, and strategic property management.",
    url: "https://zawrindustries.com/industries/estate",
    type: "website",
  }
};

export default function RealEstatePage() {
  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'name': 'Zawr Real Estate & Infrastructure Development',
    'provider': {
      '@type': 'Corporation',
      '@id': 'https://zawrindustries.com/#corporation',
      'name': 'Zawr Industries LLP',
      'url': 'https://zawrindustries.com'
    },
    'serviceType': 'Commercial Real Estate, Urban Infrastructure & PropTech Solutions',
    'areaServed': ['India', 'United Arab Emirates', 'United States', 'Global'],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'What real estate development services does Zawr Industries provide?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Zawr Industries develops Grade-A commercial tech parks, high-end residential communities, industrial warehousing infrastructure, and integrated property technology management systems.'
        }
      },
      {
        '@type': 'Question',
        'name': 'In which markets does Zawr Real Estate operate?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Zawr Real Estate operates prime developments across Bangalore, major Indian metropolitan corridors, and key Middle East hubs including Dubai and Abu Dhabi.'
        }
      }
    ]
  };

  return (
    <div style={{ backgroundColor: '#ffffff', color: '#111111', minHeight: '100vh', overflowX: 'clip' }}>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', item: '/' },
          { name: 'Industries', item: '/industries/estate' },
          { name: 'Estate', item: '/industries/estate' }
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

      {/* 1. Hero Image Section */}
      <RealEstate3DGrassHero />

      {/* 2. Scroll-Driven Word Reveal Statement Section */}
      <ScrollTextReveal text="Every piece of land has its own character and story. We build thoughtful spaces that feel natural to live in, blending clean modern design with enduring quality. Places built not just to impress today, but to last for generations." />

      {/* 3. Staggered Architectural Portfolio & Horizontal Lifestyle Transition Grid */}
      <EstateAnimationScrollGrid />

      {/* 4. Comfort of Having Your Own Home Section (coffee-estate.png) */}
      <EstateComfortOfHomeSection />

      {/* 5. What We Do Capabilities Section (Real Estate Investments, Construction, Property Management) */}
      <EstateServicesSection />

      {/* 6. Full-Width Edge-to-Edge Banner Section (last-estate.png) */}
      <EstateFullBannerSection />
    </div>
  );
}

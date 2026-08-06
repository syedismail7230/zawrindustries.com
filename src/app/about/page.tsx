import { Metadata } from 'next';
import AboutHero from '@/components/about/AboutHero';
import AboutStatement from '@/components/about/AboutStatement';
import AboutLeadership from '@/components/about/AboutLeadership';
import AboutPillars from '@/components/about/AboutPillars';
import AboutCulture from '@/components/about/AboutCulture';
import AboutGlobalImpact from '@/components/about/AboutGlobalImpact';

export const metadata: Metadata = {
  title: 'About Zawr Industries LLP — Corporate Profile & Multi-Sector Expertise',
  description: 'Zawr Industries LLP is an India-based technology, software engineering, and business transformation conglomerate delivering enterprise software, AI/ML, industrial autonomy, and real estate solutions.',
  keywords: [
    'Zawr Industries LLP',
    'About Zawr Industries',
    'Software engineering company India',
    'Enterprise technology partner Bangalore',
    'AI and machine learning integrations',
    'Custom software development'
  ],
  alternates: {
    canonical: 'https://zawrindustries.com/about',
  }
};

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Corporation',
    'name': 'Zawr Industries LLP',
    'alternateName': 'Zawr Industries',
    'legalName': 'Zawr Industries LLP',
    'url': 'https://zawrindustries.com',
    'logo': 'https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto:good,w_400,c_limit/v1783710570/zawr/assets/zawr-logo.png',
    'description': 'Zawr Industries LLP is a leading Indian technology, software engineering, and business transformation company headquartered in Bangalore. The company delivers enterprise custom software development, AI/ML integrations, cloud solutions, logistics automation, and business consulting services globally.',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Old Airport Rd, HAL',
      'addressLocality': 'Bangalore',
      'addressRegion': 'Karnataka',
      'postalCode': '560017',
      'addressCountry': 'IN'
    },
    'slogan': 'Empowering organizations through innovative technology and strategic digital solutions.',
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://zawrindustries.com'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'About Us',
        'item': 'https://zawrindustries.com/about'
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', overflowX: 'clip' }}>
        {/* 1. Dark Mode Architectural Hero */}
        <AboutHero />

        {/* 2. Scroll-Driven Reveal Statement */}
        <AboutStatement />

        {/* 3. Executive Leadership & Vision (md-portrait.png) */}
        <AboutLeadership />

        {/* 4. Multi-Sector Business Divisions */}
        <AboutPillars />

        {/* 5. Culture & Philosophy (life-at-zawr.png & respect-to-talent.png) */}
        <AboutCulture />

        {/* 6. Global Reach & Enterprise Impact (world-map.svg) */}
        <AboutGlobalImpact />
      </main>
    </>
  );
}

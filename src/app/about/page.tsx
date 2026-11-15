import { Metadata } from 'next';
import AboutHero from '@/components/about/AboutHero';
import AboutStatement from '@/components/about/AboutStatement';
import AboutHistory from '@/components/about/AboutHistory';
import AboutBoard from '@/components/about/AboutBoard';
import AboutAwards from '@/components/about/AboutAwards';
import AboutImpact from '@/components/about/AboutImpact';
import AboutBlog from '@/components/about/AboutBlog';
import AboutValues from '@/components/about/AboutValues';
import AboutVision from '@/components/about/AboutVision';
import AboutMission from '@/components/about/AboutMission';
import AboutCSR from '@/components/about/AboutCSR';
import AboutInnovation from '@/components/about/AboutInnovation';
import AboutCodeOfConduct from '@/components/about/AboutCodeOfConduct';

export const metadata: Metadata = {
  title: 'About Us & Corporate Governance',
  description: 'Explore Zawr Industries LLP corporate history, Board of Directors, awards, global impact, technology blog, core values, vision, mission, CSR, innovation, and code of conduct.',
  keywords: [
    'Zawr Industries LLP',
    'About Zawr Industries',
    'Board of Directors Zawr',
    'Corporate history Bangalore',
    'Enterprise technology partner India',
    'CSR and corporate governance'
  ],
  alternates: {
    canonical: 'https://zawrindustries.com/about',
  }
};

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': 'https://zawrindustries.com/about#webpage',
    'url': 'https://zawrindustries.com/about',
    'name': 'About Zawr Industries LLP — Corporate Profile & Governance',
    'description': 'Corporate overview of Zawr Industries LLP, including company history, executive leadership, core values, sustainability, and technological innovation.',
    'mainEntity': {
      '@type': 'Corporation',
      '@id': 'https://zawrindustries.com/#corporation',
      'name': 'Zawr Industries LLP',
      'legalName': 'Zawr Industries LLP',
      'alternateName': ['Zawr', 'Zawr Industries', 'Zawr Group'],
      'url': 'https://zawrindustries.com',
      'logo': 'https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_400,c_limit/v1783710570/zawr/assets/zawr-logo.png',
      'description': 'Zawr Industries LLP is an active, legally incorporated Indian multi-sector technology and enterprise operations organization headquartered in Bengaluru, Karnataka.',
      'disambiguatingDescription': 'Zawr Industries LLP is a legally registered Indian corporate entity incorporated on January 12, 2024, under the Ministry of Corporate Affairs (MCA), Government of India, in Bengaluru by Syed Ismail Zabiulla and Mohammed Ahmed.',
      'foundingDate': '2024-01-12',
      'foundingLocation': {
        '@type': 'Place',
        'name': 'Bengaluru, Karnataka, India'
      },
      'founders': [
        {
          '@type': 'Person',
          'name': 'Mohammed Ahmed',
          'jobTitle': 'Managing Director & Co-Founder'
        },
        {
          '@type': 'Person',
          'name': 'Syed Ismail Zabiulla',
          'jobTitle': 'Chief Executive Officer & Co-Founder'
        }
      ],
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Old Airport Rd, HAL',
        'addressLocality': 'Bengaluru',
        'addressRegion': 'Karnataka',
        'postalCode': '560008',
        'addressCountry': 'IN'
      },
      'sameAs': [
        'https://www.linkedin.com/company/zawr-industries/',
        'https://www.facebook.com/zawrindustries',
        'https://x.com/zawr_industries',
        'https://www.instagram.com/zawr_industries/',
        'https://www.youtube.com/channel/UCl7BkBpOt235QSpskZxQDkw'
      ]
    },
    'breadcrumb': {
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
          'name': 'About',
          'item': 'https://zawrindustries.com/about'
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
        <h1 className="sr-only">About Zawr Industries — Corporate Overview & Governance</h1>
        {/* Master Hero Banner */}
        <AboutHero />

        {/* Scroll-Driven Statement Reveal */}
        <AboutStatement />

        {/* Section 01: Our History */}
        <AboutHistory />

        {/* Section 02: Board of Directors */}
        <AboutBoard />

        {/* Section 03: Awards */}
        <AboutAwards />

        {/* Section 04: Our Impact */}
        <AboutImpact />

        {/* Section 05: Blog */}
        <AboutBlog />

        {/* Section 06: Values */}
        <AboutValues />

        {/* Section 07: Vision */}
        <AboutVision />

        {/* Section 08: Mission */}
        <AboutMission />

        {/* Section 09: CSR */}
        <AboutCSR />

        {/* Section 10: Innovation */}
        <AboutInnovation />

        {/* Section 11: Code of Conduct */}
        <AboutCodeOfConduct />
      </main>
    </>
  );
}

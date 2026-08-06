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
  title: 'About Zawr Industries LLP — Corporate Profile & 11 Governance Pillars',
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
    '@type': 'Corporation',
    'name': 'Zawr Industries LLP',
    'alternateName': 'Zawr Industries',
    'legalName': 'Zawr Industries LLP',
    'url': 'https://zawrindustries.com',
    'logo': 'https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto:good,w_400,c_limit/v1783710570/zawr/assets/zawr-logo.png',
    'description': 'Zawr Industries LLP is a leading Indian technology, software engineering, and business transformation company headquartered in Bangalore.',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
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

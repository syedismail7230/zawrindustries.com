import { Metadata } from 'next';
import Link from 'next/link';
import TechStatementReveal from '@/components/TechStatementReveal';
import ITServiceSoftwareSection from '@/components/ITServiceSoftwareSection';
import OurProcessSection from '@/components/OurProcessSection';
import HomeNewsroomSection from '@/components/HomeNewsroomSection';
import HomeBlogsSection from '@/components/HomeBlogsSection';

export const metadata: Metadata = {
  title: 'Zawr Industries — Technology, Manufacturing & Logistics Conglomerate | Bangalore',
  description: "Zawr Industries LLP is a multi-sector industrial conglomerate delivering IT services, AI platforms, logistics, manufacturing, and real estate solutions across India, UAE, USA, and international markets.",
  keywords: [
    'Zawr Industries LLP',
    'Zawr Industries Bangalore',
    'IT Services India',
    'Enterprise AI Platforms',
    'Automated Supply Chain Logistics',
    'Precision Manufacturing India',
    'Real Estate Development Bangalore',
    'Firm AI',
    'VelocityOS'
  ],
  alternates: {
    canonical: 'https://zawrindustries.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Zawr Industries — Technology, Manufacturing & Logistics Conglomerate',
    description: "Zawr Industries LLP is a multi-sector industrial conglomerate delivering IT services, AI platforms, logistics, manufacturing, and real estate solutions.",
    url: 'https://zawrindustries.com',
    siteName: 'Zawr Industries LLP',
    images: [
      {
        url: 'https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_1200,c_limit/v1783710570/zawr/assets/zawr-logo.png',
        width: 1200,
        height: 630,
        alt: 'Zawr Industries LLP Corporate Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function Home() {
  return (
    <>
      {/* Section 1: Hero Section */}
      <section className="hero-section home-hero-wrapper" style={{ backgroundColor: '#ffffff', width: '100%', paddingTop: '80px', paddingBottom: '1.5rem', paddingLeft: '2%', paddingRight: '2%', display: 'flex', justifyContent: 'center' }}>
        <div className="home-hero-card" style={{ position: 'relative', width: '100%', maxWidth: '1680px', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 12px 48px rgba(0, 0, 0, 0.08)' }}>
          <img
            src="/assets/home-hero.png"
            alt="Zawr Industries Hero"
            className="home-hero-img"
            style={{
              width: '100%',
              height: 'clamp(550px, 83vh, 960px)',
              objectFit: 'cover',
              display: 'block',
              borderRadius: '32px'
            }}
            loading="eager"
            fetchPriority="high"
          />
          {/* Centered Overlay Headline */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '1.5rem' }}>
            <h1 className="home-hero-title" style={{ fontSize: 'clamp(2.2rem, 6vw, 5.2rem)', color: '#ffffff', fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.15, textShadow: '0 4px 30px rgba(0,0,0,0.3)' }}>
              Design to innovation
            </h1>
          </div>
        </div>
      </section>

      {/* Section 2: Animated Tech Statement Reveal */}
      <TechStatementReveal />

      {/* Section 3: IT Service & Software Conglomerate Overview */}
      <ITServiceSoftwareSection />

      {/* Section 4: Our Process 3D Horizontal Barrel Roll Carousel */}
      <OurProcessSection />

      {/* Section 5: Newsroom & Media Dispatches */}
      <HomeNewsroomSection />

      {/* Section 6: Blogs & Industry Insights */}
      <HomeBlogsSection />

      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .home-hero-wrapper {
            padding-top: 70px !important;
            padding-bottom: 1rem !important;
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
          .home-hero-card, .home-hero-img {
            border-radius: 20px !important;
          }
          .home-hero-img {
            height: clamp(380px, 68vh, 650px) !important;
          }
        }
        @media (max-width: 480px) {
          .home-hero-wrapper {
            padding-top: 65px !important;
            padding-bottom: 0.75rem !important;
            padding-left: 0.75rem !important;
            padding-right: 0.75rem !important;
          }
          .home-hero-card, .home-hero-img {
            border-radius: 18px !important;
          }
          .home-hero-img {
            height: clamp(340px, 65vh, 580px) !important;
          }
          .home-hero-title {
            font-size: clamp(1.8rem, 7.5vw, 2.8rem) !important;
          }
        }
      `}} />
    </>
  );
}


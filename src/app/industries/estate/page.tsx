import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import ScrollTextReveal from '@/components/ScrollTextReveal';
import EstateAnimationScrollGrid from '@/components/EstateAnimationScrollGrid';
import EstateLifestyleHorizontalScroll from '@/components/EstateLifestyleHorizontalScroll';

const RealEstate3DGrassHero = dynamic(() => import('@/components/RealEstate3DGrassHero'), {
  loading: () => (
    <div style={{ height: '580px', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: 500 }}>Loading 3D Environment...</div>
    </div>
  ),
});

export const metadata: Metadata = {
  title: "Real Estate & PropTech Solutions — Zawr Industries Bangalore",
  description: "Zawr Industries operates in real estate development, property technology, and asset management — delivering smart, scalable property solutions across India and the UAE.",
};

export default function RealEstatePage() {
  return (
    <div style={{ backgroundColor: '#ffffff', color: '#111111', minHeight: '100vh', overflowX: 'clip' }}>
      {/* 1. Hero Image Section */}
      <RealEstate3DGrassHero />

      {/* 2. Scroll-Driven Word Reveal Statement Section */}
      <ScrollTextReveal text="Every piece of land has its own character and story. We build thoughtful spaces that feel natural to live in, blending clean modern design with enduring quality. Places built not just to impress today, but to last for generations." />

      {/* 3. Staggered Architectural Portfolio Scroll Grid */}
      <EstateAnimationScrollGrid />

      {/* 4. Horizontal Scroll Lifestyle Showcase */}
      <EstateLifestyleHorizontalScroll />
    </div>
  );
}

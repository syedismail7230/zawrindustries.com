import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Real Estate & PropTech Solutions — Zawr Industries Bangalore",
  description: "Zawr Industries operates in real estate development, property technology, and asset management — delivering smart, scalable property solutions across India and the UAE.",
};

export default function RealEstatePage() {
  return (
    <div style={{ padding: '8rem 5% 4rem', minHeight: '60vh', color: 'var(--text-dark)', backgroundColor: 'var(--bg-light)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--primary-color)', marginBottom: '1.5rem' }}>Real Estate & PropTech</h1>
        <p style={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'var(--text-light)', textAlign: 'left' }}>
          Zawr Industries' Real Estate vertical combines property development expertise with PropTech innovation to deliver smart, efficient, and high-value real estate solutions across India and the UAE. From commercial developments and residential projects to property management platforms and asset investment advisory, our real estate division operates at the intersection of infrastructure and technology. We serve institutional investors, developers, and corporate clients seeking reliable, scalable real estate solutions in high-growth markets.
        </p>
      </div>
    </div>
  );
}

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Trade & Logistics Solutions — Zawr Industries India",
  description: "Zawr Industries offers technology-enabled trade and logistics solutions across India and international markets — supply chain management, freight, and smart mobility platforms.",
};

export default function LogisticsPage() {
  return (
    <div style={{ padding: '8rem 5% 4rem', minHeight: '60vh', color: 'var(--text-dark)', backgroundColor: 'var(--bg-light)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--primary-color)', marginBottom: '1.5rem' }}>Trade & Logistics</h1>
        <p style={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'var(--text-light)', textAlign: 'left' }}>
          Zawr Industries' Trade & Logistics vertical delivers technology-driven supply chain, freight management, and smart mobility solutions to businesses operating across domestic and international corridors. Leveraging our proprietary digital infrastructure, we enable end-to-end logistics visibility, route optimisation, and last-mile delivery efficiency for manufacturers, traders, and e-commerce businesses. With operations spanning India, the UAE, and international export markets, Zawr Industries is building the logistics backbone that modern commerce demands.
        </p>
      </div>
    </div>
  );
}

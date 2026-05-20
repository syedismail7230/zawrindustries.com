import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "FMCG & Consumer Brands — Zawr Industries India",
  description: "Zawr Industries' FMCG division builds and distributes consumer brands across India — leveraging D2C, retail, and e-commerce channels to reach millions of customers.",
};

export default function FMCGPage() {
  return (
    <div style={{ padding: '8rem 5% 4rem', minHeight: '60vh', color: 'var(--text-dark)', backgroundColor: 'var(--bg-light)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--primary-color)', marginBottom: '1.5rem' }}>FMCG & Consumer Brands</h1>
        <p style={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'var(--text-light)', textAlign: 'left' }}>
          Zawr Industries' Fast-Moving Consumer Goods division builds, launches, and scales consumer brands across India's retail, D2C, and e-commerce markets. Backed by our in-house technology, marketing, and distribution capabilities, we develop products designed for mass market adoption and long-term brand equity. Our FMCG operations leverage data-driven consumer insights, digital-first marketing, and optimised supply chains to bring quality consumer goods to households across India and international markets.
        </p>
      </div>
    </div>
  );
}

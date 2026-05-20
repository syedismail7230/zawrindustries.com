import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About Zawr Industries — India's Emerging Business Conglomerate",
  description: "Learn about Zawr Industries — a Bangalore-founded multi-sector conglomerate with operations in IT, logistics, manufacturing, real estate and FMCG across global markets.",
};

export default function AboutPage() {
  return (
    <div style={{ padding: '8rem 5% 4rem', minHeight: '60vh', color: 'var(--text-dark)', backgroundColor: 'var(--bg-light)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--primary-color)', marginBottom: '1.5rem' }}>About Zawr Industries</h1>
        <p style={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'var(--text-light)', textAlign: 'left' }}>
          Zawr Industries was founded in Bangalore, India in 2023 with a singular vision — to build a globally recognized, multi-sector conglomerate that integrates technology, manufacturing, logistics, and asset management into one unified ecosystem. Headquartered at HAL Old Airport Road, Bangalore, the company operates under a conglomerate governance framework that gives each business vertical functional autonomy while maintaining centralized strategic oversight. From serving startups and D2C brands to enterprise clients and government institutions, Zawr Industries operates at every scale of business.
        </p>
      </div>
    </div>
  );
}

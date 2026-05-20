import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Our Platforms — Firm AI, Zawr AI, Sketch Studio, Quick Dial, VelocityOS",
  description: "Explore Zawr Industries' proprietary platforms — Firm AI for business intelligence, Sketch Studio for design, Zawr AI, Quick Dial, and VelocityOS for enterprise operations.",
};

export default function PlatformsPage() {
  return (
    <div style={{ padding: '8rem 5% 4rem', minHeight: '60vh', color: 'var(--text-dark)', backgroundColor: 'var(--bg-light)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--primary-color)', marginBottom: '1.5rem' }}>Our Platforms</h1>
        <p style={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'var(--text-light)', textAlign: 'left' }}>
          Zawr Industries develops and operates a suite of proprietary technology platforms serving businesses across industries. Firm AI delivers state-of-the-art artificial intelligence solutions for enterprise decision-making and business automation. Sketch Studio is our full-service design agency platform serving brands and businesses globally. Zawr AI powers intelligent automation and data processing for enterprise clients. Quick Dial simplifies business communication infrastructure. VelocityOS provides operating system-level business management for high-growth companies. Together, these platforms form the technology backbone of the Zawr Industries ecosystem.
        </p>
      </div>
    </div>
  );
}

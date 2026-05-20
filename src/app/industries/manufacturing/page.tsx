import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Manufacturing Solutions & Industrial Services — Zawr Industries",
  description: "Zawr Industries' manufacturing vertical delivers technology-integrated industrial production, contract manufacturing, and engineering solutions across India under Make in India.",
};

export default function ManufacturingPage() {
  return (
    <div style={{ padding: '8rem 5% 4rem', minHeight: '60vh', color: 'var(--text-dark)', backgroundColor: 'var(--bg-light)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--primary-color)', marginBottom: '1.5rem' }}>Manufacturing & Industrial Services</h1>
        <p style={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'var(--text-light)', textAlign: 'left' }}>
          Zawr Industries' Manufacturing division combines industrial expertise with technology integration to deliver scalable production, contract manufacturing, and engineering services across India. Aligned with the Government of India's Make in India and Production Linked Incentive initiatives, our manufacturing operations are designed for quality, compliance, and global export readiness. We serve clients across sectors requiring precision manufacturing, industrial components, and technology-enabled production systems.
        </p>
      </div>
    </div>
  );
}

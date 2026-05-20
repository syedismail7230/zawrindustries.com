import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Careers at Zawr Industries — Join India's Growing Conglomerate",
  description: "Build your career at Zawr Industries — a fast-growing Bangalore conglomerate hiring across technology, design, logistics, operations, marketing, and business development.",
};

export default function CareersPage() {
  return (
    <div style={{ padding: '8rem 5% 4rem', minHeight: '60vh', color: 'var(--text-dark)', backgroundColor: 'var(--bg-light)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--primary-color)', marginBottom: '1.5rem' }}>Careers</h1>
        <p style={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'var(--text-light)', textAlign: 'left' }}>
          Zawr Industries is building one of India's most ambitious conglomerates — and we're looking for people who want to build with us. We hire across technology, software engineering, AI, design, logistics, operations, sales, marketing, finance, and business development. Our team works at the cutting edge of multiple industries simultaneously, giving every employee the rare opportunity to grow across sectors, not just within one. If you want to work somewhere that thinks in decades and moves with urgency, Zawr Industries is where you belong.
        </p>
      </div>
    </div>
  );
}

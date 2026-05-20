import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact Zawr Industries — Bangalore, India | UAE | USA | UK",
  description: "Get in touch with Zawr Industries for IT services, business partnerships, investor enquiries, and client relations. Offices serving India, UAE, USA and UK markets.",
};

export default function ContactPage() {
  return (
    <div style={{ padding: '8rem 5% 4rem', minHeight: '60vh', color: 'var(--text-dark)', backgroundColor: 'var(--bg-light)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--primary-color)', marginBottom: '1.5rem' }}>Contact Us</h1>
        <p style={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'var(--text-light)', textAlign: 'left' }}>
          Connect with Zawr Industries for enterprise technology solutions, logistics partnerships, manufacturing inquiries, or investor relations. Our global team operates across Bangalore, India with reach into the UAE, USA, and UK markets. We look forward to exploring strategic collaborations with your business.
        </p>
      </div>
    </div>
  );
}

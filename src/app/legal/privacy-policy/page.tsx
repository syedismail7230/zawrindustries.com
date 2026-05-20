import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div style={{ padding: '8rem 5% 4rem', minHeight: '60vh', color: 'var(--text-dark)', backgroundColor: 'var(--bg-light)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'var(--bg-white)', padding: '3rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid var(--border-color)' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '1rem' }}>Privacy Policy</h1>
        <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>Last updated: {new Date().toLocaleDateString()}</p>
        
        <div style={{ lineHeight: 1.8, color: 'var(--text-dark)' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-color)', marginTop: '2rem' }}>1. Introduction</h2>
          <p>Welcome to Zawr Industries. We respect your privacy and are committed to protecting your personal data in compliance with the General Data Protection Regulation (GDPR), the UAE Data Protection Law, and the Digital Personal Data Protection Act (DPDP) of India.</p>

          <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-color)', marginTop: '2rem' }}>2. Data Collection</h2>
          <p>We may collect, use, store and transfer different kinds of personal data about you including Identity Data, Contact Data, and Technical Data.</p>

          <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-color)', marginTop: '2rem' }}>3. How We Use Your Data</h2>
          <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data to provide services, improve our platform, and for security compliance.</p>
          
          <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-color)', marginTop: '2rem' }}>4. Contact Us</h2>
          <p>If you have any questions about this privacy policy, please contact our Data Protection Officer at <a href="mailto:privacy@zawrindustries.com" style={{ color: 'var(--secondary-color)' }}>privacy@zawrindustries.com</a>.</p>
        </div>
        
        <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <Link href="/" style={{ color: 'var(--primary-color)', textDecoration: 'underline', fontWeight: 600 }}>&larr; Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

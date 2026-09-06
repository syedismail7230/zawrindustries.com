import Link from 'next/link';

export default function TermsAndConditions() {
  return (
    <div style={{ padding: '8rem 5% 4rem', minHeight: '60vh', color: 'var(--text-dark)', backgroundColor: 'var(--bg-light)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'var(--bg-white)', padding: '3rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid var(--border-color)' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '1rem' }}>Terms & Conditions</h1>
        <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>Last updated: {new Date().toLocaleDateString()}</p>
        
        <div style={{ lineHeight: 1.8, color: 'var(--text-dark)' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-color)', marginTop: '2rem' }}>1. Acceptance of Terms</h2>
          <p>By accessing and using Zawr Industries platforms, you accept and agree to be bound by the terms and provision of this agreement.</p>

          <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-color)', marginTop: '2rem' }}>2. Intellectual Property Rights</h2>
          <p>All content, trademarks, data, and intellectual property on this site are the property of Zawr Industries and its licensors. Unauthorized use is strictly prohibited.</p>

          <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-color)', marginTop: '2rem' }}>3. Limitation of Liability</h2>
          <p>Zawr Industries shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our services.</p>
        </div>
        
        <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <Link href="/" style={{ color: 'var(--primary-color)', textDecoration: 'underline', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

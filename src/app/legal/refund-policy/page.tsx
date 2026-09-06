import Link from 'next/link';

export default function RefundPolicy() {
  return (
    <div style={{ padding: '8rem 5% 4rem', minHeight: '60vh', color: 'var(--text-dark)', backgroundColor: 'var(--bg-light)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'var(--bg-white)', padding: '3rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid var(--border-color)' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '1rem' }}>Refund & Cancellation Policy</h1>
        <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>Last updated: {new Date().toLocaleDateString()}</p>
        
        <div style={{ lineHeight: 1.8, color: 'var(--text-dark)' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-color)', marginTop: '2rem' }}>1. Subscriptions and SaaS Services</h2>
          <p>For SaaS subscriptions (including Firm AI, Zawr AI, Quick Dial), cancellations must be requested prior to the next billing cycle. We do not provide refunds for partial months of service.</p>

          <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-color)', marginTop: '2rem' }}>2. Enterprise IT Services</h2>
          <p>Refunds and cancellations for bespoke enterprise IT services are governed by the specific Service Level Agreement (SLA) or contract signed prior to project commencement.</p>
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

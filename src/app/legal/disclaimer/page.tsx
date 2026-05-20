import Link from 'next/link';

export default function Disclaimer() {
  return (
    <div style={{ padding: '8rem 5% 4rem', minHeight: '60vh', color: 'var(--text-dark)', backgroundColor: 'var(--bg-light)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'var(--bg-white)', padding: '3rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid var(--border-color)' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '1rem' }}>Disclaimer</h1>
        <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>Last updated: {new Date().toLocaleDateString()}</p>
        
        <div style={{ lineHeight: 1.8, color: 'var(--text-dark)' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-color)', marginTop: '2rem' }}>1. Investor Information</h2>
          <p>The information contained on this website is for general information purposes only. Nothing on this site constitutes investment advice or an offer to sell securities.</p>

          <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-color)', marginTop: '2rem' }}>2. Forward-Looking Statements</h2>
          <p>Certain statements on this website may constitute forward-looking statements. These are based on current expectations and involve risks and uncertainties that could cause actual results to differ materially.</p>
        </div>
        
        <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <Link href="/" style={{ color: 'var(--primary-color)', textDecoration: 'underline', fontWeight: 600 }}>&larr; Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

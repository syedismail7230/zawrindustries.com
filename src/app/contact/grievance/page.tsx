import Link from 'next/link';

export default function GrievanceRedressal() {
  return (
    <div style={{ padding: '8rem 5% 4rem', minHeight: '60vh', color: 'var(--text-dark)', backgroundColor: 'var(--bg-light)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'var(--bg-white)', padding: '3rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid var(--border-color)' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '1rem' }}>Grievance Redressal Policy</h1>
        <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>Last updated: {new Date().toLocaleDateString()}</p>
        
        <div style={{ lineHeight: 1.8, color: 'var(--text-dark)' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-color)', marginTop: '2rem' }}>1. Objective</h2>
          <p>In accordance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 of India, Zawr Industries is committed to resolving user and customer grievances in a timely and transparent manner.</p>

          <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-color)', marginTop: '2rem' }}>2. Grievance Officer Details</h2>
          <p>If you have any grievances or discrepancies, please reach out to our designated Grievance Officer:</p>
          <div style={{ backgroundColor: 'var(--bg-light)', padding: '1.5rem', borderRadius: '4px', marginTop: '1rem' }}>
            <strong>Name:</strong> [Grievance Officer Name]<br/>
            <strong>Designation:</strong> Chief Grievance Officer<br/>
            <strong>Email:</strong> grievance@zawrindustries.com<br/>
            <strong>Contact:</strong> +91-9880464078<br/>
            <strong>Address:</strong> [Bangalore Office Address]
          </div>

          <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-color)', marginTop: '2rem' }}>3. Resolution Timeframe</h2>
          <p>We acknowledge all grievances within 24 hours of receipt and aim to resolve them within 15 days, as mandated by the IT Rules, 2021.</p>
        </div>
        
        <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <Link href="/" style={{ color: 'var(--primary-color)', textDecoration: 'underline', fontWeight: 600 }}>&larr; Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

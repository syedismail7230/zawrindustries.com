import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ padding: '8rem 5% 4rem', minHeight: '60vh', color: 'var(--text-dark)', backgroundColor: 'var(--bg-light)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <h1 style={{ fontSize: '6rem', color: 'var(--primary-color)', margin: 0, lineHeight: 1 }}>404</h1>
      <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', fontWeight: 600 }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-light)', maxWidth: '500px', marginBottom: '2.5rem', lineHeight: 1.6 }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link href="/" style={{ padding: '0.8rem 2rem', backgroundColor: 'var(--primary-color)', color: 'var(--bg-white)', borderRadius: '4px', textDecoration: 'none', fontWeight: 600, transition: 'background-color 0.3s' }}>
        Return to Homepage
      </Link>
    </div>
  );
}

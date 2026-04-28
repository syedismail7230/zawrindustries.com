import Link from 'next/link';

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const query = params.q || '';
  
  return (
    <div style={{ padding: '8rem 5% 4rem', minHeight: '60vh', color: 'var(--text-dark)', backgroundColor: 'var(--bg-light)' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '2rem', color: 'var(--primary-color)' }}>Search Results</h1>
      
      {query ? (
        <div style={{ backgroundColor: 'var(--bg-white)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
            Showing results for: <strong style={{ color: 'var(--primary-color)' }}>{query}</strong>
          </p>
          <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
            <p style={{ color: 'var(--text-light)', lineHeight: 1.6 }}>
              We could not find any exact matches for your query. As Zawr Industries is currently in active expansion mode, our internal search index is still being populated.
              <br /><br />
              Please try browsing our core <Link href="/" style={{ color: 'var(--primary-color)', textDecoration: 'underline', fontWeight: 600 }}>Platforms</Link> or navigating via the header menu.
            </p>
          </div>
        </div>
      ) : (
        <div style={{ backgroundColor: 'var(--bg-white)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <p style={{ color: 'var(--text-light)' }}>Please enter a search term in the header to begin exploring Zawr Industries.</p>
        </div>
      )}
    </div>
  );
}

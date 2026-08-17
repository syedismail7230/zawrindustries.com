import { Metadata } from 'next';
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd';

export const metadata: Metadata = {
  title: "Newsroom — Latest News, Events & Press Releases | Zawr Industries",
  description: "Official press releases, media coverage, executive announcements, and international event updates from Zawr Industries LLP.",
  alternates: {
    canonical: 'https://zawrindustries.com/newsroom',
  },
  openGraph: {
    title: "Newsroom & Press Dispatches — Zawr Industries",
    description: "Breaking press releases, media kits, event schedules, and corporate announcements.",
    url: "https://zawrindustries.com/newsroom",
    type: "website",
  }
};

export default function NewsroomPage() {
  const newsroomJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': 'https://zawrindustries.com/newsroom#webpage',
    'url': 'https://zawrindustries.com/newsroom',
    'name': 'Zawr Industries Official Newsroom & Media Hub',
    'description': 'Official media center for Zawr Industries LLP press releases, event announcements, and corporate news.',
    'publisher': {
      '@type': 'Corporation',
      '@id': 'https://zawrindustries.com/#corporation',
      'name': 'Zawr Industries LLP',
      'url': 'https://zawrindustries.com'
    }
  };

  return (
    <div style={{ padding: '8rem 5% 4rem', minHeight: '60vh', color: 'var(--text-dark)', backgroundColor: 'var(--bg-light)' }}>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', item: '/' },
          { name: 'Newsroom', item: '/newsroom' }
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsroomJsonLd) }}
      />
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--primary-color)', marginBottom: '1.5rem' }}>Newsroom</h1>
        <p style={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'var(--text-light)', textAlign: 'left' }}>
          Welcome to the Zawr Industries Newsroom. Here you will find our latest press releases, media coverage, event announcements, and corporate updates across our global operations.
        </p>
      </div>
    </div>
  );
}

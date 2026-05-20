import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Newsroom — Latest News & Press Releases from Zawr Industries",
  description: "Stay updated with the latest news, press releases, media coverage, and announcements from Zawr Industries — India's multi-sector conglomerate.",
};

export default function NewsroomPage() {
  return (
    <div style={{ padding: '8rem 5% 4rem', minHeight: '60vh', color: 'var(--text-dark)', backgroundColor: 'var(--bg-light)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--primary-color)', marginBottom: '1.5rem' }}>Newsroom</h1>
        <p style={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'var(--text-light)', textAlign: 'left' }}>
          Welcome to the Zawr Industries Newsroom. Here you will find our latest press releases, media coverage, event announcements, and corporate updates across our global operations.
        </p>
      </div>
    </div>
  );
}

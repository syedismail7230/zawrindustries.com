import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Zawr Industries | Technology & Business Expansion',
  description: 'Your strategic partner in harnessing the power of technology for business expansion.',
  icons: {
    icon: [
      { media: '(prefers-color-scheme: light)', url: '/favicon-light.png' },
      { media: '(prefers-color-scheme: dark)', url: '/favicon-dark.png' }
    ]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <Header />
        <main style={{ minHeight: 'calc(100vh - 400px)' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

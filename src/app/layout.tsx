import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import SupportWidget from '@/components/SupportWidget';
import Preloader from '@/components/Preloader';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Zawr Industries | Technology & Business Expansion',
  description: 'Your strategic partner in harnessing the power of technology for business expansion. Expert solutions in AI, SaaS, IT services, and logistics.',
  metadataBase: new URL('https://zawrindustries.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Zawr Industries | Enterprise Technology Solutions',
    description: 'Empowering businesses with AI, scalable platforms, and robust infrastructure.',
    url: 'https://zawrindustries.com',
    siteName: 'Zawr Industries',
    images: [
      {
        url: '/hero_background.png',
        width: 1200,
        height: 630,
        alt: 'Zawr Industries Cover',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zawr Industries',
    description: 'Your strategic partner in harnessing the power of technology for business expansion.',
    images: ['/hero_background.png'],
  },
  icons: {
    icon: [
      { media: '(prefers-color-scheme: light)', url: '/favicon-light.png' },
      { media: '(prefers-color-scheme: dark)', url: '/favicon-dark.png' }
    ],
    apple: '/favicon-dark.png',
  }
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://translate.google.com" />
        <link rel="preconnect" href="https://translate.googleapis.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <Preloader />
        <script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "name": "Zawr Industries",
                  "url": "https://zawrindustries.com",
                  "logo": "https://zawrindustries.com/favicon-dark.png",
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+91-9880464078",
                    "contactType": "customer service"
                  },
                  "sameAs": [
                    "https://www.linkedin.com/company/zawr-industries/",
                    "https://www.facebook.com/zawrindustries",
                    "https://x.com/zawr_industries",
                    "https://www.instagram.com/zawr_industries/"
                  ]
                },
                {
                  "@type": "WebSite",
                  "name": "Zawr Industries",
                  "url": "https://zawrindustries.com",
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://zawrindustries.com/search?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                }
              ]
            })
          }}
        />
        <div id="google_translate_element" style={{ display: 'none' }}></div>
        <Script 
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" 
          strategy="afterInteractive" 
        />
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new window.google.translate.TranslateElement({pageLanguage: 'en', autoDisplay: false}, 'google_translate_element');
            }
          `}
        </Script>
        <Header />
        <main style={{ minHeight: 'calc(100vh - 400px)' }}>
          {children}
        </main>
        <Footer />
        <CookieBanner />
        <SupportWidget />
      </body>
    </html>
  );
}

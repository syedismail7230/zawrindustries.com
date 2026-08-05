import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CookieBanner = dynamic(() => import('@/components/CookieBanner'), { ssr: false });
const SupportWidget = dynamic(() => import('@/components/SupportWidget'), { ssr: false });
const Preloader = dynamic(() => import('@/components/Preloader'), { ssr: false });
const ServiceWorkerRegistrar = dynamic(() => import('@/components/ServiceWorkerRegistrar'), { ssr: false });

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Zawr Industries | Technology & Business Expansion',
  description: 'Your strategic partner in harnessing the power of technology for business expansion. Expert solutions in AI, SaaS, IT services, and logistics.',
  metadataBase: new URL('https://zawrindustries.com'),
  alternates: {
    canonical: 'https://zawrindustries.com',
  },
  keywords: [
    'Zawr Industries',
    'IT Services Bangalore',
    'AI Solutions India',
    'Enterprise SaaS Platforms',
    'Digital Transformation',
    'Custom Software Development',
    'Cloud Migration Services',
    'Logistics Automation',
    'Process Automation',
    'Technology Consulting'
  ],
  authors: [{ name: 'Zawr Industries', url: 'https://zawrindustries.com' }],
  creator: 'Zawr Industries',
  publisher: 'Zawr Industries',
  category: 'technology',
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Zawr Industries | Enterprise Technology Solutions',
    description: 'Empowering businesses with AI, scalable platforms, and robust infrastructure.',
    url: 'https://zawrindustries.com',
    siteName: 'Zawr Industries',
    images: [
      {
        url: 'https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto:good,w_1600,c_limit,dpr_auto/v1783710569/zawr/assets/zawr-industries.png',
        width: 1200,
        height: 630,
        alt: 'Zawr Industries Cover',
      }
    ],
    locale: 'en_US',
    alternateLocale: ['en_IN', 'en_GB'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zawr Industries',
    description: 'Your strategic partner in harnessing the power of technology for business expansion.',
    images: ['https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto:good,w_1600,c_limit,dpr_auto/v1783710569/zawr/assets/zawr-industries.png'],
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
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://translate.google.com" />
        <link rel="preconnect" href="https://translate.googleapis.com" crossOrigin="anonymous" />
        <link
          rel="preload"
          as="image"
          href="https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto:good,w_800,c_limit,dpr_auto/v1783710572/zawr/images/hero-bg.png"
          imageSrcSet="https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto:good,w_600,c_limit,dpr_auto/v1783710572/zawr/images/hero-bg.png 600w, https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto:good,w_1000,c_limit,dpr_auto/v1783710572/zawr/images/hero-bg.png 1000w, https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto:good,w_1600,c_limit,dpr_auto/v1783710572/zawr/images/hero-bg.png 1600w"
          fetchPriority="high"
        />
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
                  "name": "Zawr Industries LLP",
                  "legalName": "Zawr Industries LLP",
                  "description": "Zawr Industries LLP is a leading Indian technology, software engineering, and business transformation company headquartered in Bangalore. The company operates across multiple sectors delivering custom software, AI/ML integrations, cloud solutions, logistics automation, and business consulting services globally.",
                  "url": "https://zawrindustries.com",
                  "logo": "https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto:good,w_400,c_limit/v1783710570/zawr/assets/zawr-logo.png",
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
                  "name": "Zawr Industries LLP",
                  "url": "https://zawrindustries.com",
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://zawrindustries.com/search?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                },
                {
                  "@type": "ProfessionalService",
                  "@id": "https://zawrindustries.com/#service",
                  "name": "Zawr Industries LLP",
                  "url": "https://zawrindustries.com",
                  "logo": "https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto:good,w_400,c_limit/v1783710570/zawr/assets/zawr-logo.png",
                  "image": "https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto:good,w_1600,c_limit,dpr_auto/v1783710569/zawr/assets/zawr-industries.png",
                  "telephone": "+91-9880464078",
                  "priceRange": "$$$",
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Old Airport Rd, HAL",
                    "addressLocality": "Bangalore",
                    "addressRegion": "Karnataka",
                    "postalCode": "560008",
                    "addressCountry": "IN"
                  },
                  "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": 12.9600,
                    "longitude": 77.6433
                  },
                  "openingHoursSpecification": {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": [
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday"
                    ],
                    "opens": "09:00",
                    "closes": "18:00"
                  }
                }
              ]
            })
          }}
        />
        <div id="google_translate_element" style={{ display: 'none' }}></div>
        <Script 
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" 
          strategy="lazyOnload" 
        />
        <Script id="google-translate-init" strategy="lazyOnload">
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
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}

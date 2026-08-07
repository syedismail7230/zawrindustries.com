import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ClientWidgets from '@/components/ClientWidgets';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Zawr Industries — Multi-Sector Technology, Manufacturing & Logistics Conglomerate',
  description: 'Zawr Industries LLP is a leading multi-sector conglomerate delivering IT services, AI platforms, logistics automation, precision manufacturing, and real estate solutions across India, UAE, USA, and global markets.',
  metadataBase: new URL('https://zawrindustries.com'),
  alternates: {
    canonical: 'https://zawrindustries.com',
  },
  keywords: [
    'Zawr Industries LLP',
    'Zawr Industries Bangalore',
    'IT Services Bangalore',
    'Enterprise AI Platforms',
    'Automated Logistics Solutions',
    'Precision Manufacturing India',
    'Real Estate Development Bangalore',
    'Firm AI',
    'VelocityOS',
    'Sketch Studio',
    'Zawr AI',
    'Quick Dial CRM'
  ],
  authors: [{ name: 'Zawr Industries LLP', url: 'https://zawrindustries.com' }],
  creator: 'Zawr Industries LLP',
  publisher: 'Zawr Industries LLP',
  category: 'technology',
  referrer: 'origin-when-cross-origin',
  robots: {
    index: true,
    follow: true,
    nocache: false,
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
    title: 'Zawr Industries — Multi-Sector Technology, Manufacturing & Logistics Conglomerate',
    description: 'Empowering global enterprises with AI engineering, scalable software platforms, automated logistics, and sustainable industrial solutions.',
    url: 'https://zawrindustries.com',
    siteName: 'Zawr Industries LLP',
    images: [
      {
        url: 'https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto:good,w_1600,c_limit,dpr_auto/v1783710569/zawr/assets/zawr-industries.png',
        width: 1200,
        height: 630,
        alt: 'Zawr Industries Corporate Profile',
      }
    ],
    locale: 'en_US',
    alternateLocale: ['en_IN', 'en_GB', 'ar_AE'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zawr Industries LLP',
    description: 'Multi-sector conglomerate engineering AI platforms, automated logistics, and industrial technology.',
    images: ['https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto:good,w_1600,c_limit,dpr_auto/v1783710569/zawr/assets/zawr-industries.png'],
  },
  icons: {
    icon: [
      { media: '(prefers-color-scheme: light)', url: '/favicon-light.png' },
      { media: '(prefers-color-scheme: dark)', url: '/favicon-dark.png' }
    ],
    apple: '/favicon-dark.png',
  },
  other: {
    'geo.region': 'IN-KA',
    'geo.placename': 'Bengaluru',
    'geo.position': '12.9600;77.6433',
    'ICBM': '12.9600, 77.6433',
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
          href="https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_800,c_limit/v1783710572/zawr/images/hero-bg.png"
          imageSrcSet="https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_480,c_limit/v1783710572/zawr/images/hero-bg.png 480w, https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_800,c_limit/v1783710572/zawr/images/hero-bg.png 800w, https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_1400,c_limit/v1783710572/zawr/images/hero-bg.png 1400w"
          fetchPriority="high"
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <script
          id="schema-org-graph"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Corporation",
                  "@id": "https://zawrindustries.com/#corporation",
                  "name": "Zawr Industries LLP",
                  "legalName": "Zawr Industries LLP",
                  "alternateName": ["Zawr", "Zawr Industries", "Zawr Group"],
                  "url": "https://zawrindustries.com",
                  "logo": "https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto:good,w_400,c_limit/v1783710570/zawr/assets/zawr-logo.png",
                  "image": "https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto:good,w_1600,c_limit,dpr_auto/v1783710569/zawr/assets/zawr-industries.png",
                  "description": "Zawr Industries LLP is an Indian multi-sector industrial conglomerate headquartered in Bengaluru. The company delivers enterprise software, artificial intelligence platforms, cloud solutions, automated supply chain logistics, precision manufacturing, real estate, and healthcare technology globally.",
                  "foundingDate": "2024-01-12",
                  "founders": [
                    {
                      "@type": "Person",
                      "name": "Mohammed Ahmed",
                      "jobTitle": "Managing Director"
                    },
                    {
                      "@type": "Person",
                      "name": "Syed Ismail Zabiulla",
                      "jobTitle": "Chief Executive Officer & Co-Founder"
                    }
                  ],
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Old Airport Rd, HAL",
                    "addressLocality": "Bengaluru",
                    "addressRegion": "Karnataka",
                    "postalCode": "560008",
                    "addressCountry": "IN"
                  },
                  "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": 12.9600,
                    "longitude": 77.6433
                  },
                  "contactPoint": [
                    {
                      "@type": "ContactPoint",
                      "telephone": "+91-9880464078",
                      "contactType": "customer service",
                      "email": "Grievance@zawrindustries.com",
                      "availableLanguage": ["English", "Hindi", "Kannada", "Arabic"]
                    }
                  ],
                  "sameAs": [
                    "https://www.linkedin.com/company/zawr-industries/",
                    "https://www.facebook.com/zawrindustries",
                    "https://x.com/zawr_industries",
                    "https://www.instagram.com/zawr_industries/",
                    "https://www.youtube.com/channel/UCl7BkBpOt235QSpskZxQDkw"
                  ],
                  "knowsAbout": [
                    "Artificial Intelligence",
                    "Enterprise Software Engineering",
                    "Supply Chain & Automated Logistics",
                    "Precision Manufacturing & Industrial Autonomy",
                    "Real Estate Development",
                    "Healthcare Technology"
                  ],
                  "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "Zawr Industries Products & Services",
                    "itemListElement": [
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "SoftwareApplication",
                          "name": "Firm AI",
                          "url": "https://www.firm.expert/",
                          "description": "Enterprise Decision Intelligence & AI Automation Engine"
                        }
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "SoftwareApplication",
                          "name": "VelocityOS",
                          "url": "https://velocityos.in/",
                          "description": "Cloud Business Operating System & Infrastructure Orchestration"
                        }
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "SoftwareApplication",
                          "name": "Sketch Studio",
                          "url": "https://sketchstudio.dev/",
                          "description": "Enterprise UI/UX Design & Brand Prototyping Platform"
                        }
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "SoftwareApplication",
                          "name": "Zawr AI",
                          "url": "https://ai.zawrindustries.com/",
                          "description": "Multi-Modal Autonomous AI Agent Engine"
                        }
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "SoftwareApplication",
                          "name": "Quick Dial",
                          "url": "https://crm.zawrindustries.com/",
                          "description": "Intelligent Sales CRM & Communication Platform"
                        }
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "IT & Software Engineering Services",
                          "url": "https://zawrindustries.com/industries/it-service",
                          "description": "Custom Software Development, Cloud Architecture, Cybersecurity, AI/ML Integrations"
                        }
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Transport & Logistics Automation",
                          "url": "https://zawrindustries.com/industries/transport-and-logistics",
                          "description": "AI Supply Chain Routing, Fleet Management, Cold Chain Logistics"
                        }
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Precision Manufacturing & Industrial Robotics",
                          "url": "https://zawrindustries.com/industries/manufacturing",
                          "description": "Smart Factory Automation, IoT Inspection, Robotic Manufacturing"
                        }
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Real Estate Development & Asset Management",
                          "url": "https://zawrindustries.com/industries/estate",
                          "description": "Commercial Infrastructure, Smart Real Estate Development, Strategic Asset Growth"
                        }
                      }
                    ]
                  }
                },
                {
                  "@type": "WebSite",
                  "@id": "https://zawrindustries.com/#website",
                  "name": "Zawr Industries LLP",
                  "url": "https://zawrindustries.com",
                  "publisher": {
                    "@id": "https://zawrindustries.com/#corporation"
                  },
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://zawrindustries.com/search?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                },
                {
                  "@type": "FAQPage",
                  "@id": "https://zawrindustries.com/#faq",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": "What is Zawr Industries LLP?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Zawr Industries LLP is an Indian multi-sector conglomerate headquartered in Bengaluru, delivering enterprise software, AI platforms, automated logistics, precision manufacturing, real estate, and healthcare technology solutions across international markets."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Who are the executive leaders of Zawr Industries?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Zawr Industries was officially registered on 12 January 2024 by Mr. Syed Ismail Zabiulla (Chief Executive Officer) and Mr. Mohammed Ahmed (Managing Director)."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "What proprietary platforms does Zawr Industries develop?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Zawr Industries develops proprietary enterprise software platforms including Firm AI, VelocityOS, Sketch Studio, Zawr AI, and Quick Dial CRM."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "What core industries does Zawr Industries operate in?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Zawr Industries operates across five core business sectors: IT Services & AI Engineering, Transport & Logistics, Precision Manufacturing, Real Estate Development, and Healthcare Technology."
                      }
                    }
                  ]
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
        <ClientWidgets />
        <Header />
        <main style={{ minHeight: 'calc(100vh - 400px)' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}


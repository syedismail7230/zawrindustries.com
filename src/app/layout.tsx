import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ClientWidgets from '@/components/ClientWidgets';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

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
        url: 'https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_1600,c_limit,dpr_auto/v1783710569/zawr/assets/zawr-industries.png',
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
    images: ['https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_1600,c_limit,dpr_auto/v1783710569/zawr/assets/zawr-industries.png'],
  },
  icons: {
    icon: [
      { url: '/favicon-dark.png' },
      { media: '(prefers-color-scheme: light)', url: '/favicon-light.png' },
      { media: '(prefers-color-scheme: dark)', url: '/favicon-dark.png' }
    ],
    shortcut: '/favicon-dark.png',
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
                  "logo": "https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_400,c_limit/v1783710570/zawr/assets/zawr-logo.png",
                  "image": "https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_1600,c_limit,dpr_auto/v1783710569/zawr/assets/zawr-industries.png",
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
                  "areaServed": [
                    { "@type": "Country", "name": "India" },
                    { "@type": "Country", "name": "United Arab Emirates" },
                    { "@type": "Country", "name": "United States" },
                    { "@type": "AdministrativeArea", "name": "Global" }
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
                  "@type": "LocalBusiness",
                  "@id": "https://zawrindustries.com/#localbusiness",
                  "name": "Zawr Industries LLP — Global Headquarters",
                  "url": "https://zawrindustries.com",
                  "telephone": "+91-9880464078",
                  "email": "info@zawrindustries.com",
                  "priceRange": "$$$$",
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
                  "openingHoursSpecification": [
                    {
                      "@type": "OpeningHoursSpecification",
                      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                      "opens": "09:00",
                      "closes": "18:00"
                    }
                  ]
                },
                {
                  "@type": "WebSite",
                  "@id": "https://zawrindustries.com/#website",
                  "name": "Zawr Industries LLP",
                  "alternateName": ["Zawr", "Zawr Industries", "Zawr Group"],
                  "url": "https://zawrindustries.com",
                  "publisher": {
                    "@id": "https://zawrindustries.com/#corporation"
                  },
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://zawrindustries.com/search?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                  },
                  "hasPart": [
                    {
                      "@type": "WebPage",
                      "@id": "https://zawrindustries.com/industries/it-service#webpage",
                      "name": "IT Service",
                      "url": "https://zawrindustries.com/industries/it-service",
                      "description": "Custom Software Engineering, AI Platforms, Cloud Infrastructure & Cybersecurity"
                    },
                    {
                      "@type": "WebPage",
                      "@id": "https://zawrindustries.com/industries/transport-and-logistics#webpage",
                      "name": "Transport and Logistics",
                      "url": "https://zawrindustries.com/industries/transport-and-logistics",
                      "description": "Supply Chain Logistics, Fleet Telematics, AGV Warehousing & Multi-Modal Freight"
                    },
                    {
                      "@type": "WebPage",
                      "@id": "https://zawrindustries.com/industries/manufacturing#webpage",
                      "name": "Manufacturing",
                      "url": "https://zawrindustries.com/industries/manufacturing",
                      "description": "Precision CNC Machining, Industrial Robotics & Advanced Production"
                    },
                    {
                      "@type": "WebPage",
                      "@id": "https://zawrindustries.com/industries/estate#webpage",
                      "name": "Estate",
                      "url": "https://zawrindustries.com/industries/estate",
                      "description": "Commercial Real Estate Development, Urban Infrastructure & Asset Management"
                    },
                    {
                      "@type": "WebPage",
                      "@id": "https://zawrindustries.com/investors#webpage",
                      "name": "Investors",
                      "url": "https://zawrindustries.com/investors",
                      "description": "Audited Financial Statements, Shareholder Governance & Capital Growth"
                    },
                    {
                      "@type": "WebPage",
                      "@id": "https://zawrindustries.com/careers#webpage",
                      "name": "Careers",
                      "url": "https://zawrindustries.com/careers",
                      "description": "Full-Time Engineering Positions, Global Freelance Network & Career Growth"
                    },
                    {
                      "@type": "WebPage",
                      "@id": "https://zawrindustries.com/contact#webpage",
                      "name": "Contact",
                      "url": "https://zawrindustries.com/contact",
                      "description": "Executive Public Relations, Client Relations Desk & Global Inquiries"
                    }
                  ]
                },
                {
                  "@type": "ItemList",
                  "@id": "https://zawrindustries.com/#navigation",
                  "name": "Main Site Navigation",
                  "itemListElement": [
                    {
                      "@type": "SiteNavigationElement",
                      "position": 1,
                      "name": "IT Service",
                      "url": "https://zawrindustries.com/industries/it-service"
                    },
                    {
                      "@type": "SiteNavigationElement",
                      "position": 2,
                      "name": "Transport and Logistics",
                      "url": "https://zawrindustries.com/industries/transport-and-logistics"
                    },
                    {
                      "@type": "SiteNavigationElement",
                      "position": 3,
                      "name": "Manufacturing",
                      "url": "https://zawrindustries.com/industries/manufacturing"
                    },
                    {
                      "@type": "SiteNavigationElement",
                      "position": 4,
                      "name": "Estate",
                      "url": "https://zawrindustries.com/industries/estate"
                    },
                    {
                      "@type": "SiteNavigationElement",
                      "position": 5,
                      "name": "Investors",
                      "url": "https://zawrindustries.com/investors"
                    },
                    {
                      "@type": "SiteNavigationElement",
                      "position": 6,
                      "name": "Careers",
                      "url": "https://zawrindustries.com/careers"
                    },
                    {
                      "@type": "SiteNavigationElement",
                      "position": 7,
                      "name": "Contact",
                      "url": "https://zawrindustries.com/contact"
                    }
                  ]
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
                        "text": "Zawr Industries LLP is a leading Indian multi-sector industrial conglomerate headquartered in Bengaluru, Karnataka. The company engineers enterprise software, AI platforms, automated logistics, precision manufacturing, real estate, and healthcare technology solutions for clients worldwide."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Where is the global headquarters of Zawr Industries located?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Zawr Industries is headquartered at HAL Old Airport Road, Bengaluru, Karnataka 560008, India, with international operations extending across the UAE, USA, and global enterprise markets."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Who founded Zawr Industries?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Zawr Industries was founded by Mr. Syed Ismail Zabiulla (Chief Executive Officer) and Mr. Mohammed Ahmed (Managing Director), officially registered on January 12, 2024."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "What proprietary platforms are developed by Zawr Industries?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Zawr Industries develops proprietary enterprise platforms including Firm AI (Decision Intelligence), VelocityOS (Cloud Operating System), Sketch Studio (UI/UX Design), Zawr AI (Autonomous Agent Engine), and Quick Dial (Sales CRM)."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "What industrial sectors does Zawr Industries operate across?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Zawr Industries operates across five core divisions: IT Services & AI Engineering, Transport & Logistics Automation, Precision Manufacturing & Robotics, Real Estate Development, and Healthcare Technology."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "How can businesses and candidates engage with Zawr Industries?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Businesses can submit partnership or client inquiries through the public relations desk, while professionals can apply for full-time engineering careers or join the freelance creator network directly on the Zawr careers portal."
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


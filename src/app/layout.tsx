import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ClientWidgets from '@/components/ClientWidgets';
import ClientAnalyticsTracker from '@/components/ClientAnalyticsTracker';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: {
    default: 'Zawr Industries — Multi-Sector Technology & Operations',
    template: '%s | Zawr Industries',
  },
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
    title: 'Zawr Industries — Technology, Manufacturing & Logistics',
    description: 'Empowering global enterprises with AI engineering, scalable software platforms, automated logistics, and sustainable industrial solutions.',
    url: 'https://zawrindustries.com',
    siteName: 'Zawr Industries LLP',
    images: [
      {
        url: 'https://zawrindustries.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Zawr Industries — Global Technology, Manufacturing & Logistics Conglomerate',
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
    images: ['https://zawrindustries.com/og-image.png'],
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
                  "description": "Zawr Industries LLP is an active, legally incorporated Indian multi-sector technology and enterprise operations organization headquartered in Bengaluru, Karnataka. The company engineers enterprise software, AI platforms, cloud solutions, automated supply chain logistics, precision manufacturing, and real estate services globally.",
                  "disambiguatingDescription": "Zawr Industries LLP is a legally registered Indian corporate entity incorporated on January 12, 2024, under the Ministry of Corporate Affairs (MCA), Government of India, in Bengaluru by Syed Ismail Zabiulla and Mohammed Ahmed.",
                  "foundingDate": "2024-01-12",
                  "foundingLocation": {
                    "@type": "Place",
                    "name": "Bengaluru, Karnataka, India"
                  },
                  "founder": [
                    {
                      "@type": "Person",
                      "name": "Mohammed Ahmed",
                      "jobTitle": "Managing Director & Co-Founder"
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
                        "price": "0",
                        "priceCurrency": "USD",
                        "availability": "https://schema.org/InStock",
                        "itemOffered": {
                          "@type": "SoftwareApplication",
                          "name": "Firm AI",
                          "url": "https://zawrindustries.com/industries/it-service/ai-data-analytics",
                          "description": "Enterprise Decision Intelligence & AI Automation Engine"
                        }
                      },
                      {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "USD",
                        "availability": "https://schema.org/InStock",
                        "itemOffered": {
                          "@type": "SoftwareApplication",
                          "name": "VelocityOS",
                          "url": "https://velocityos.in/",
                          "description": "Cloud Business Operating System & Infrastructure Orchestration"
                        }
                      },
                      {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "USD",
                        "availability": "https://schema.org/InStock",
                        "itemOffered": {
                          "@type": "SoftwareApplication",
                          "name": "Sketch Studio",
                          "url": "https://sketchstudio.dev/",
                          "description": "Enterprise UI/UX Design & Brand Prototyping Platform"
                        }
                      },
                      {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "USD",
                        "availability": "https://schema.org/InStock",
                        "itemOffered": {
                          "@type": "SoftwareApplication",
                          "name": "Zawr AI",
                          "url": "https://ai.zawrindustries.com/",
                          "description": "Multi-Modal Autonomous AI Agent Engine"
                        }
                      },
                      {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "USD",
                        "availability": "https://schema.org/InStock",
                        "itemOffered": {
                          "@type": "SoftwareApplication",
                          "name": "Quick Dial",
                          "url": "https://crm.zawrindustries.com/",
                          "description": "Intelligent Sales CRM & Communication Platform"
                        }
                      },
                      {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "USD",
                        "availability": "https://schema.org/InStock",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "IT & Software Engineering Services",
                          "url": "https://zawrindustries.com/industries/it-service",
                          "description": "Custom Software Development, Cloud Architecture, Cybersecurity, AI/ML Integrations"
                        }
                      },
                      {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "USD",
                        "availability": "https://schema.org/InStock",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Transport & Logistics Automation",
                          "url": "https://zawrindustries.com/industries/transport-and-logistics",
                          "description": "AI Supply Chain Routing, Fleet Management, Cold Chain Logistics"
                        }
                      },
                      {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "USD",
                        "availability": "https://schema.org/InStock",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Precision Manufacturing & Industrial Robotics",
                          "url": "https://zawrindustries.com/industries/manufacturing",
                          "description": "Smart Factory Automation, IoT Inspection, Robotic Manufacturing"
                        }
                      },
                      {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "USD",
                        "availability": "https://schema.org/InStock",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Real Estate Development & Asset Management",
                          "url": "https://zawrindustries.com/industries/estate",
                          "description": "Commercial Infrastructure, Smart Real Estate Development, Strategic Asset Growth"
                        }
                      },
                      {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "USD",
                        "availability": "https://schema.org/InStock",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Clean Energy Transition & EV Forecourt Infrastructure",
                          "url": "https://zawrindustries.com/industries/energy",
                          "description": "EV Charging Forecourts, Utility Solar, Microgrid BESS Storage Systems"
                        }
                      },
                      {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "USD",
                        "availability": "https://schema.org/InStock",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Holding Company & Multi-Brand Franchise Operations",
                          "url": "https://zawrindustries.com/industries/holding",
                          "description": "Multi-Unit Enterprise Management, Centralized Shared Supply Chains, Retail Telemetry"
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
                  "image": "https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_1600,c_limit,dpr_auto/v1783710569/zawr/assets/zawr-industries.png",
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
                      "name": "IT Services",
                      "url": "https://zawrindustries.com/industries/it-service",
                      "description": "Custom Software Engineering, AI Platforms, Cloud Infrastructure & Cybersecurity"
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
                      "@id": "https://zawrindustries.com/industries/transport-and-logistics#webpage",
                      "name": "Logistics & Transport",
                      "url": "https://zawrindustries.com/industries/transport-and-logistics",
                      "description": "Supply Chain Logistics, Fleet Telematics, AGV Warehousing & Multi-Modal Freight"
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
                      "@id": "https://zawrindustries.com/industries/energy#webpage",
                      "name": "Energy",
                      "url": "https://zawrindustries.com/industries/energy",
                      "description": "Clean Energy Infrastructure, EV Forecourt Charging & Industrial Microgrids"
                    },
                    {
                      "@type": "WebPage",
                      "@id": "https://zawrindustries.com/industries/holding#webpage",
                      "name": "Holding",
                      "url": "https://zawrindustries.com/industries/holding",
                      "description": "Multi-Brand Franchise Operations, Global Capital Alliances & Turnkey Deployment"
                    },
                    {
                      "@type": "WebPage",
                      "@id": "https://zawrindustries.com/contact#webpage",
                      "name": "Contact Us",
                      "url": "https://zawrindustries.com/contact",
                      "description": "Corporate Public Relations, Client Relations Desk & Global Inquiries"
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
                      "name": "IT Services",
                      "url": "https://zawrindustries.com/industries/it-service"
                    },
                    {
                      "@type": "SiteNavigationElement",
                      "position": 2,
                      "name": "Manufacturing",
                      "url": "https://zawrindustries.com/industries/manufacturing"
                    },
                    {
                      "@type": "SiteNavigationElement",
                      "position": 3,
                      "name": "Logistics & Transport",
                      "url": "https://zawrindustries.com/industries/transport-and-logistics"
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
                      "name": "Energy",
                      "url": "https://zawrindustries.com/industries/energy"
                    },
                    {
                      "@type": "SiteNavigationElement",
                      "position": 6,
                      "name": "Holding",
                      "url": "https://zawrindustries.com/industries/holding"
                    }
                  ]
                },
                {
                  "@type": "FAQPage",
                  "@id": "https://zawrindustries.com/#faq",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": "Is Zawr Industries LLP a real and legally registered company?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Yes. Zawr Industries LLP is a legally incorporated Indian corporate entity registered on January 12, 2024, under the Ministry of Corporate Affairs (MCA), Government of India, headquartered in Bengaluru, Karnataka."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "What is Zawr Industries LLP and what does it do?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Zawr Industries LLP is an Indian multi-sector technology and enterprise operations organization headquartered in Bengaluru. The company engineers enterprise software platforms (including Firm AI, VelocityOS, Sketch Studio, Quick Dial CRM, and Zawr AI), automated logistics solutions, precision manufacturing automation, and commercial real estate development."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Where is the global headquarters of Zawr Industries located?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Zawr Industries is headquartered at HAL Old Airport Road, Bengaluru, Karnataka 560008, India, serving enterprise clients across India, the Middle East (UAE), the United States, and international global markets."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Who founded and leads Zawr Industries?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Zawr Industries was co-founded by Mr. Syed Ismail Zabiulla (Chief Executive Officer) and Mr. Mohammed Ahmed (Managing Director), officially incorporated on January 12, 2024."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "What proprietary platforms are developed and operated by Zawr Industries?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Zawr Industries develops proprietary enterprise platforms including Firm AI (Decision Intelligence at firm.expert), VelocityOS (Cloud Business OS at velocityos.in), Sketch Studio (Enterprise UI/UX at sketchstudio.dev), Zawr AI (Multi-Modal Agent Engine at ai.zawrindustries.com), and Quick Dial (Sales CRM at crm.zawrindustries.com)."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "What core business verticals does Zawr Industries operate?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Zawr Industries operates across five specialized industry divisions: IT Services & Custom Software Engineering, Transport & Automated Supply Chain Logistics, Precision Manufacturing Robotics, Commercial Real Estate Asset Management, and Artificial Intelligence."
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
        <ClientAnalyticsTracker />
        <Header />
        <main style={{ minHeight: 'calc(100vh - 400px)' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}


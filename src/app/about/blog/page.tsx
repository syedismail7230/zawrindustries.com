import React from 'react';
import { Metadata } from 'next';
import BlogIndexClient from './BlogIndexClient';

export const metadata: Metadata = {
  title: 'Corporate Blog & Insights | Zawr Industries',
  description: 'Explore the latest insights, enterprise technology trends, AI innovation, supply chain automation, and industrial perspectives from Zawr Industries leaders.',
  metadataBase: new URL('https://zawrindustries.com'),
  alternates: {
    canonical: 'https://zawrindustries.com/about/blog',
  },
  openGraph: {
    title: 'Corporate Blog & Insights | Zawr Industries',
    description: 'Explore the latest insights, enterprise technology trends, AI innovation, supply chain automation, and industrial perspectives from Zawr Industries leaders.',
    url: 'https://zawrindustries.com/about/blog',
    siteName: 'Zawr Industries',
    type: 'website',
    images: [
      {
        url: 'https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto:good,w_1600,c_limit,dpr_auto/v1783710569/zawr/assets/zawr-industries.png',
        alt: 'Zawr Industries Corporate Blog',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Corporate Blog & Insights | Zawr Industries',
    description: 'Explore the latest insights, enterprise technology trends, AI innovation, supply chain automation, and industrial perspectives from Zawr Industries leaders.',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function BlogPage() {
  return (
    <>
      <BlogIndexClient />

      {/* Schema.org Blog/CollectionPage markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            'name': 'Zawr Industries Corporate Blog & Insights',
            'url': 'https://zawrindustries.com/about/blog',
            'description': 'Explore the latest insights, enterprise technology trends, AI innovation, supply chain automation, and industrial perspectives from Zawr Industries leaders.',
            'publisher': {
              '@type': 'Organization',
              'name': 'Zawr Industries',
              'url': 'https://zawrindustries.com',
              'logo': 'https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto:good,w_400,c_limit/v1783710570/zawr/assets/zawr-logo.png'
            }
          })
        }}
      />
    </>
  );
}

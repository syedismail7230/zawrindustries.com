import React from 'react';
import { Metadata } from 'next';
import BlogIndexClient from './BlogIndexClient';
import { getExistingBlogs } from '@/lib/ai-blog-engine';

export const revalidate = 60;

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
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }
};

export default async function BlogPage() {
  const allBlogs = await getExistingBlogs();
  const publishedBlogs = allBlogs.filter(
    (b: any) => b.status !== 'draft' && b.status !== 'held' && b.status !== 'pending_approval'
  );

  return (
    <>
      <BlogIndexClient initialBlogs={publishedBlogs as any} />

      {/* Schema.org Blog/CollectionPage markup with crawlable post entities */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            '@id': 'https://zawrindustries.com/about/blog#blog',
            'name': 'Zawr Industries Corporate Blog & Insights',
            'url': 'https://zawrindustries.com/about/blog',
            'description': 'Explore the latest insights, enterprise technology trends, AI innovation, supply chain automation, and industrial perspectives from Zawr Industries leaders.',
            'publisher': {
              '@type': 'Organization',
              'name': 'Zawr Industries',
              'url': 'https://zawrindustries.com',
              'logo': 'https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto:good,w_400,c_limit/v1783710570/zawr/assets/zawr-logo.png'
            },
            'blogPost': publishedBlogs.map((b: any) => ({
              '@type': 'BlogPosting',
              'headline': b.title,
              'url': `https://zawrindustries.com/about/blog/${b.slug}`,
              'datePublished': b.createdAt || b.date,
              'description': b.summary
            }))
          })
        }}
      />
    </>
  );
}

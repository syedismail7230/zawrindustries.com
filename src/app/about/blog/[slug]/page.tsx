import React from 'react';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { Metadata } from 'next';
import BlogClient from './BlogClient';
import { getExistingBlogs } from '@/lib/ai-blog-engine';

export const revalidate = 60;

const getSafeIsoDate = (dateStr: string): string => {
  try {
    if (!dateStr) return new Date().toISOString();
    const cleanStr = dateStr.replace(/(\d+)(st|nd|rd|th)/, '$1');
    const d = new Date(cleanStr);
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  } catch (e) {
    return new Date().toISOString();
  }
};

export async function generateStaticParams() {
  try {
    const blogs = await getExistingBlogs();
    return blogs.map((b: any) => ({ slug: b.slug }));
  } catch (e) {
    console.error('Error generating static params for blogs:', e);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const blogs = await getExistingBlogs();
    const blog = blogs.find((b: any) => b.slug === slug);
    if (!blog) return {};

    const fullImageUrl = blog.image 
      ? (blog.image.startsWith('http') ? blog.image : `https://zawrindustries.com${blog.image}`) 
      : 'https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto:good,w_1600,c_limit,dpr_auto/v1783710569/zawr/assets/zawr-industries.png';

    const seoTitle = blog.title.includes('Zawr') ? blog.title : `${blog.title} | Zawr Industries Insights`;
    const metaDescription = blog.summary && blog.summary.length > 0
      ? (blog.summary.length > 158 ? `${blog.summary.slice(0, 155)}...` : blog.summary)
      : 'Strategic industrial research, enterprise engineering benchmarks, and technology leadership insights from Zawr Industries.';

    const keywordList = [
      blog.category,
      'Zawr Industries',
      'Enterprise Technology',
      'B2B Architecture',
      'Industrial Intelligence',
      ...blog.title.split(/\s+/).filter((w: string) => w.length > 4)
    ];

    return {
      title: seoTitle,
      description: metaDescription,
      keywords: keywordList,
      alternates: {
        canonical: `https://zawrindustries.com/about/blog/${slug}`,
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
      },
      openGraph: {
        title: seoTitle,
        description: metaDescription,
        url: `https://zawrindustries.com/about/blog/${slug}`,
        siteName: 'Zawr Industries',
        locale: 'en_US',
        images: [
          {
            url: fullImageUrl,
            width: 1200,
            height: 630,
            alt: blog.title,
          }
        ],
        type: 'article',
        publishedTime: getSafeIsoDate(blog.createdAt || blog.date),
        modifiedTime: getSafeIsoDate(blog.createdAt || blog.date),
        authors: [blog.author || 'Zawr Research & Editorial Desk'],
        section: blog.category,
        tags: keywordList,
      },
      twitter: {
        card: 'summary_large_image',
        title: seoTitle,
        description: metaDescription,
        images: [fullImageUrl],
        creator: '@zawrindustries',
      }
    };
  } catch (e) {
    console.error('Error generating blog metadata:', e);
    return {};
  }
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let blog: any = null;
  let relatedBlogs: any[] = [];
  let prevBlog: any = null;
  let nextBlog: any = null;

  try {
    const blogs = await getExistingBlogs();
    const idx = blogs.findIndex((b: any) => b.slug === slug);
    if (idx !== -1) {
      blog = blogs[idx];
      prevBlog = idx > 0 ? blogs[idx - 1] : null;
      nextBlog = idx < blogs.length - 1 ? blogs[idx + 1] : null;
      relatedBlogs = blogs
        .filter((b: any) => b.slug !== slug)
        .sort((a: any, b: any) => (a.category === blog.category ? -1 : 1))
        .slice(0, 3);
    }
  } catch (e) {
    console.error('Error fetching blogs for detail page:', e);
  }

  if (!blog) {
    notFound();
  }

  // Compute article stats for Schema.org
  const allText = (blog.sections || []).map((s: any) => `${s.title} ${s.body}`).join(' ');
  const wordCount = allText.split(/\s+/).length + (blog.summary ? blog.summary.split(/\s+/).length : 0);
  const minutes = parseInt(blog.readTime?.replace(/\D/g, '') || '6', 10);
  const timeRequired = `PT${minutes}M`;

  // Check for FAQ sections to generate Schema.org FAQPage Rich Snippet
  const faqSection = blog.sections?.find((s: any) => 
    s.title?.toLowerCase().includes('faq') || 
    s.title?.toLowerCase().includes('frequently asked questions')
  );

  const faqEntities: any[] = [];
  if (faqSection && faqSection.body) {
    const qaBlocks = faqSection.body.split(/\n\s*\n/).filter(Boolean);
    for (const block of qaBlocks) {
      const match = block.match(/(?:Q:|\*\*Q:|\d+\.\s*|\*\*Question:\*\*\s*)([^\n?]+\?)\s*(?:A:|\*\*A:|\n|\*\*Answer:\*\*\s*)([\s\S]+)/i);
      if (match) {
        faqEntities.push({
          '@type': 'Question',
          'name': match[1].trim(),
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': match[2].trim(),
          },
        });
      }
    }
  }

  const fullImageUrl = blog.image 
    ? (blog.image.startsWith('http') ? blog.image : `https://zawrindustries.com${blog.image}`) 
    : 'https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto:good,w_1600,c_limit,dpr_auto/v1783710569/zawr/assets/zawr-industries.png';

  return (
    <>
      <BlogClient
        blog={blog}
        relatedBlogs={relatedBlogs}
        prevBlog={prevBlog}
        nextBlog={nextBlog}
      />

      {/* Schema.org TechArticle / BlogPosting markup with E-E-A-T and Speakable */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': ['TechArticle', 'BlogPosting'],
            '@id': `https://zawrindustries.com/about/blog/${slug}#article`,
            'isPartOf': {
              '@type': 'CollectionPage',
              '@id': 'https://zawrindustries.com/about/blog',
              'name': 'Corporate Blog & Insights'
            },
            'headline': blog.title,
            'image': [fullImageUrl],
            'datePublished': getSafeIsoDate(blog.createdAt || blog.date),
            'dateModified': getSafeIsoDate(blog.createdAt || blog.date),
            'author': [
              {
                '@type': 'Person',
                'name': blog.author || 'Zawr Research & Editorial Desk',
                'url': 'https://zawrindustries.com/about/board',
                'worksFor': {
                  '@type': 'Organization',
                  'name': 'Zawr Industries'
                }
              }
            ],
            'publisher': {
              '@type': 'Organization',
              'name': 'Zawr Industries',
              'url': 'https://zawrindustries.com',
              'logo': {
                '@type': 'ImageObject',
                'url': 'https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto:good,w_400,c_limit/v1783710570/zawr/assets/zawr-logo.png'
              }
            },
            'mainEntityOfPage': {
              '@type': 'WebPage',
              '@id': `https://zawrindustries.com/about/blog/${slug}`
            },
            'inLanguage': 'en-US',
            'isAccessibleForFree': 'True',
            'articleSection': blog.category,
            'keywords': `${blog.category}, Zawr Industries, Enterprise Technology, Industrial Architecture, B2B Engineering`,
            'wordCount': wordCount,
            'timeRequired': timeRequired,
            'speakable': {
              '@type': 'SpeakableSpecification',
              'cssSelector': ['h1', '.article-body', '.blog-summary']
            },
            'description': blog.summary || ''
          })
        }}
      />

      {/* Schema.org BreadcrumbList markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': [
              {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': 'https://zawrindustries.com'
              },
              {
                '@type': 'ListItem',
                'position': 2,
                'name': 'Blog & Insights',
                'item': 'https://zawrindustries.com/about/blog'
              },
              {
                '@type': 'ListItem',
                'position': 3,
                'name': blog.title,
                'item': `https://zawrindustries.com/about/blog/${slug}`
              }
            ]
          })
        }}
      />

      {/* Schema.org FAQPage markup for Google Featured Rich Snippets */}
      {faqEntities.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              'mainEntity': faqEntities
            })
          }}
        />
      )}

      {/* Google News Reader Revenue Manager Snippet */}
      <Script
        async
        type="application/javascript"
        src="https://news.google.com/swg/js/v1/swg-basic.js"
        strategy="afterInteractive"
      />
      <Script id="google-swg-init-blog" strategy="afterInteractive">
        {`
          (self.SWG_BASIC = self.SWG_BASIC || []).push(basicSubscriptions => {
            basicSubscriptions.init({
              type: "NewsArticle",
              isPartOfType: ["Product"],
              isPartOfProductId: "CAowy4LHDA:openaccess",
              clientOptions: { theme: "light", lang: "en" },
            });
          });
        `}
      </Script>
    </>
  );
}

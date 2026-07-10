import React from 'react';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import fs from 'fs';
import path from 'path';
import { Metadata } from 'next';
import BlogClient from './BlogClient';

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
    const blogsPath = path.join(process.cwd(), 'public/data/blogs.json');
    if (!fs.existsSync(blogsPath)) return [];
    const blogs = JSON.parse(fs.readFileSync(blogsPath, 'utf8'));
    return blogs.map((b: any) => ({ slug: b.slug }));
  } catch (e) {
    console.error('Error generating static params for blogs:', e);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const blogsPath = path.join(process.cwd(), 'public/data/blogs.json');
    if (!fs.existsSync(blogsPath)) return {};
    const blogs = JSON.parse(fs.readFileSync(blogsPath, 'utf8'));
    const blog = blogs.find((b: any) => b.slug === slug);
    if (!blog) return {};

    const fullImageUrl = blog.image 
      ? (blog.image.startsWith('http') ? blog.image : `https://zawrindustries.com${blog.image}`) 
      : 'https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto/v1783710569/zawr/assets/zawr-industries.png';

    return {
      title: `${blog.title} | Zawr Industries Blog`,
      description: blog.summary,
      alternates: {
        canonical: `https://zawrindustries.com/about/blog/${slug}`,
      },
      openGraph: {
        title: blog.title,
        description: blog.summary,
        url: `https://zawrindustries.com/about/blog/${slug}`,
        siteName: 'Zawr Industries',
        images: [
          {
            url: fullImageUrl,
            alt: blog.title,
          }
        ],
        type: 'article',
        publishedTime: getSafeIsoDate(blog.date),
        authors: [blog.author],
      },
      twitter: {
        card: 'summary_large_image',
        title: blog.title,
        description: blog.summary,
        images: [fullImageUrl],
      }
    };
  } catch (e) {
    console.error('Error generating blog metadata:', e);
    return {};
  }
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const blogsPath = path.join(process.cwd(), 'public/data/blogs.json');
  if (!fs.existsSync(blogsPath)) {
    notFound();
  }
  
  let blog;
  try {
    const blogs = JSON.parse(fs.readFileSync(blogsPath, 'utf8'));
    blog = blogs.find((b: any) => b.slug === slug);
  } catch (e) {
    console.error('Error parsing blogs JSON:', e);
  }

  if (!blog) {
    notFound();
  }

  return (
    <>
      <BlogClient blog={blog} />

      {/* Schema.org BlogPosting markup for AI & Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            'headline': blog.title,
            'image': [
              blog.image ? (blog.image.startsWith('http') ? blog.image : `https://zawrindustries.com${blog.image}`) : 'https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto/v1783710569/zawr/assets/zawr-industries.png'
            ],
            'datePublished': getSafeIsoDate(blog.date),
            'dateModified': getSafeIsoDate(blog.date),
            'author': [{
              '@type': 'Person',
              'name': blog.author || 'Zawr Industries Editorial'
            }],
            'publisher': {
              '@type': 'Organization',
              'name': 'Zawr Industries',
              'logo': {
                '@type': 'ImageObject',
                'url': 'https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto/v1783710570/zawr/assets/zawr-logo.png'
              }
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
                'name': 'Blog',
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

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Script from 'next/script';

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

interface Section {
  title: string;
  body: string;
}

interface Blog {
  id: string;
  slug: string;
  title: string;
  author: string;
  authorImage: string;
  date: string;
  category: string;
  summary: string;
  image: string;
  readTime: string;
  sections: Section[];
}

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch('/api/blogs');
        if (res.ok) {
          const list = await res.json();
          const found = list.find((b: any) => b.slug === slug);
          setBlog(found || null);
        }
      } catch (e) {
        console.error('Error fetching blog:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!blog || blog.sections.length === 0) return;
      const sectionElements = blog.sections.map((_, i) => document.getElementById(`section-${i}`));
      
      const scrollPos = window.scrollY + 200;
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i];
        if (el && scrollPos >= el.offsetTop) {
          setActiveSection(i);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [blog]);

  const handleShare = (platform: string) => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = blog ? blog.title : '';
    if (platform === 'x') {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'email') {
      window.open(`mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <style dangerouslySetInnerHTML={{ __html: `
          .loading-container {
            min-height: 100vh;
            background-color: #ffffff;
            color: #000000;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: 'Inter', sans-serif;
          }
          .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(0,0,0,0.1);
            border-top: 3px solid #000000;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}} />
        <div className="spinner" />
      </div>
    );
  }

  if (!blog) {
    notFound();
  }

  return (
    <div className="blog-detail-container">
      <style dangerouslySetInnerHTML={{ __html: `
        .blog-detail-container {
          background-color: #ffffff;
          color: #111111;
          font-family: 'Inter', sans-serif;
          padding-top: 8rem;
          padding-bottom: 6rem;
        }

        .blog-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        /* Breadcrumbs */
        .breadcrumbs {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: #666666;
          margin-bottom: 2rem;
        }
        .breadcrumbs a {
          color: #666666;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .breadcrumbs a:hover {
          color: #000000;
        }

        /* Hero Split Header */
        .hero-split {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 4rem;
          align-items: center;
          margin-bottom: 5rem;
        }

        .hero-title {
          font-family: 'Georgia', serif;
          font-size: clamp(2rem, 3.8vw, 3rem);
          font-weight: 400;
          line-height: 1.18;
          letter-spacing: -0.02em;
          color: #111111;
          margin-bottom: 2rem;
        }

        .author-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .author-img {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          background-color: #eee;
        }
        .author-info {
          font-size: 0.88rem;
          color: #555555;
        }
        .author-name {
          font-weight: 500;
          color: #111111;
        }

        .featured-image-box {
          width: 100%;
          aspect-ratio: 1.45;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
        }
        .featured-image-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Article Layout Grid */
        .article-grid {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 5rem;
          margin-bottom: 6rem;
        }

        .sidebar-left {
          position: sticky;
          top: 120px;
          height: fit-content;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .sidebar-section-title {
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #111111;
          margin-bottom: 1rem;
        }

        /* Social Share Icons */
        .share-icons {
          display: flex;
          gap: 0.8rem;
        }
        .share-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1px solid #e2e8f0;
          background-color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #555555;
          transition: all 0.2s ease;
        }
        .share-btn:hover {
          background-color: #f8fafc;
          border-color: #cbd5e1;
          color: #000000;
          transform: translateY(-1px);
        }

        /* Table of Contents Card */
        .toc-card {
          background-color: #fafaf9;
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid #f2f2ee;
        }
        .toc-list {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }
        .toc-item {
          font-size: 0.88rem;
          color: #777777;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          line-height: 1.35;
        }
        .toc-item.active {
          color: #000000;
          font-weight: 500;
        }
        .toc-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background-color: #000000;
          display: inline-block;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .toc-item.active .toc-dot {
          opacity: 1;
        }

        /* Article Reading Flow */
        .reading-flow {
          max-width: 720px;
        }
        .reading-section {
          margin-bottom: 3.5rem;
          scroll-margin-top: 140px;
        }
        .reading-section h2 {
          font-family: 'Georgia', serif;
          font-size: 1.85rem;
          font-weight: 400;
          line-height: 1.3;
          margin-top: 0;
          margin-bottom: 1.2rem;
          color: #111111;
        }
        .reading-section p {
          font-size: 1.1rem;
          color: #374151;
          line-height: 1.85;
          margin: 0 0 1.5rem 0;
        }


        /* Responsive */
        @media (max-width: 968px) {
          .hero-split {
            grid-template-columns: 1fr;
            gap: 2rem;
            margin-bottom: 3.5rem;
          }
          .article-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          .sidebar-left {
            position: static;
            height: auto;
            flex-direction: row;
            justify-content: space-between;
            gap: 1.5rem;
          }
          .toc-card {
            display: none; /* Hide TOC on mobile for clean screen flow */
          }
          }
        }

        @media (max-width: 640px) {
          .blog-detail-container {
            padding-top: 6rem;
          }
          .sidebar-left {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}} />

      <div className="blog-wrapper">
        {/* Breadcrumb matches screenshot 1 layout */}
        <div className="breadcrumbs">
          <Link href="/">Home</Link>
          <span>&gt;</span>
          <Link href="/about/blog">Blog</Link>
          <span>&gt;</span>
          <Link href="/about/blog">{blog.category}</Link>
          <span>&gt;</span>
          <span style={{ fontWeight: 500, color: '#111111', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: '250px' }}>
            {blog.title}
          </span>
        </div>

        {/* Hero Split Section */}
        <div className="hero-split">
          <div className="hero-content">
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b7280' }}>
                {blog.category}
              </span>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#d1d5db' }} />
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{blog.readTime}</span>
            </div>

            <h1 className="hero-title">{blog.title}</h1>

            <div className="author-meta">
              <img className="author-img" src={blog.authorImage} alt={blog.author} />
              <div className="author-info">
                By <span className="author-name">{blog.author}</span> &bull; Last updated on {blog.date}
              </div>
            </div>
          </div>

          <div className="featured-image-box">
            <img src={blog.image} alt={blog.title} />
          </div>
        </div>

        {/* Article Layout Grid */}
        <div className="article-grid">
          {/* Left Sidebar: Share and Table of Contents */}
          <div className="sidebar-left">
            <div>
              <h4 className="sidebar-section-title">Share this Article</h4>
              <div className="share-icons">
                <button className="share-btn" aria-label="Share on X" onClick={() => handleShare('x')}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                  </svg>
                </button>
                <button className="share-btn" aria-label="Share on LinkedIn" onClick={() => handleShare('linkedin')}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                  </svg>
                </button>
                <button className="share-btn" aria-label="Share via Email" onClick={() => handleShare('email')}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </button>
              </div>
            </div>

            {blog.sections.length > 0 && (
              <div className="toc-card">
                <h4 className="sidebar-section-title">In this Article</h4>
                <div className="toc-list">
                  {blog.sections.map((sect, i) => (
                    <div
                      key={i}
                      className={`toc-item ${activeSection === i ? 'active' : ''}`}
                      onClick={() => {
                        const el = document.getElementById(`section-${i}`);
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                      <span className="toc-dot" />
                      <span>{i + 1}. {sect.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Article reading content flow */}
          <div className="reading-flow">
            {blog.sections.map((sect, i) => (
              <div key={i} id={`section-${i}`} className="reading-section">
                <h2>{sect.title}</h2>
                <p>{sect.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Schema.org NewsArticle markup for Google News */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            'headline': blog.title,
            'image': [
              blog.image ? (blog.image.startsWith('http') ? blog.image : `https://zawrindustries.com${blog.image}`) : ''
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
                'url': 'https://zawrindustries.com/assets/logo.png'
              }
            },
            'description': blog.summary || ''
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
    </div>
  );
}

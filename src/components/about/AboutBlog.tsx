'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Blog {
  id: string;
  slug: string;
  title: string;
  author: string;
  date: string;
  category: string;
  summary: string;
  image: string;
  readTime: string;
}

const fallbackBlogs: Blog[] = [
  {
    id: "BLOG-9",
    slug: "next-generation-cloud-solutions-scaling-global-it-infrastructures",
    title: "Next-Generation Cloud Solutions: Scaling Global IT Infrastructures",
    author: "Zylpha Vance",
    date: "18 June 2026",
    category: "Technology",
    summary: "Enterprise cloud migrations require robust security, high availability, and containerized microservices. Explore scalable architectures.",
    image: "https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco/v1783710431/zawr/assets/blogs/blog-BLOG-9-laptop_on_cloud_with_ERP_dashboard_in_light_gradient__color_theme___000714_and__13578c__1_.jpg",
    readTime: "6 min read"
  },
  {
    id: "BLOG-8",
    slug: "pioneering-smart-mining-technologies-safe-and-clean-extraction",
    title: "Pioneering Smart Mining Technologies: Safe and Clean Extraction",
    author: "Ondine Marrow",
    date: "15 June 2026",
    category: "Corporate",
    summary: "Mining operations are undergoing a digital transformation. Zawr Metals & Mining utilizes automated machinery and real-time safety telemetry.",
    image: "https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco/v1783710430/zawr/assets/blogs/blog-BLOG-8-pexels-gunshe-5125104.jpg",
    readTime: "8 min read"
  },
  {
    id: "BLOG-7",
    slug: "designing-the-modern-workspace-ergonomics-and-human-centric-design",
    title: "Designing the Modern Workspace: Ergonomics and Human-Centric Design",
    author: "Lina Linder",
    date: "11 June 2026",
    category: "Opinion",
    summary: "The physical workspace plays an essential role in employee productivity and well-being. Discover ergonomic theories driving office design.",
    image: "https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco/v1783710428/zawr/assets/blogs/blog-BLOG-7-pexels-huy-phan-316220-27436633.jpg",
    readTime: "5 min read"
  }
];

export default function AboutBlog() {
  const [blogs, setBlogs] = useState<Blog[]>(fallbackBlogs);

  useEffect(() => {
    async function loadBlogs() {
      try {
        const res = await fetch('/api/blogs');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setBlogs(data.slice(0, 3));
          }
        }
      } catch (e) {
        console.error('Failed to load blogs from API', e);
      }
    }
    loadBlogs();
  }, []);

  return (
    <section
      id="blog"
      style={{
        backgroundColor: '#ffffff',
        color: '#0f172a',
        padding: 'clamp(5rem, 8vw, 8rem) 1.5rem',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: 'relative',
        scrollMarginTop: '80px',
        borderTop: '1px solid #f1f5f9',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: 'clamp(2.5rem, 4vw, 4rem)',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div style={{ maxWidth: '700px' }}>
            <h2
              style={{
                fontSize: 'clamp(1.8rem, 3.8vw, 3rem)',
                fontWeight: 300,
                color: '#0f172a',
                letterSpacing: '-0.03em',
                lineHeight: 1.2,
                margin: 0,
              }}
            >
              Corporate Blog & Insights
            </h2>
          </div>
          <Link
            href="/about/blog"
            style={{
              fontSize: '0.95rem',
              fontWeight: 500,
              color: '#0f172a',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'color 0.2s ease',
            }}
          >
            Explore All Insights
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>

        {/* Bento Magazine Blogs Layout (1 Featured Left + 2 Stacked Right) */}
        {blogs.length > 0 && (
          <div className="bento-blog-layout">
            {/* Left Column: Featured Blog */}
            {blogs[0] && (
              <div
                key={blogs[0].id || blogs[0].slug}
                className="blog-card bento-featured-card"
              >
                {blogs[0].image && (
                  <div className="bento-featured-img-wrap">
                    <Link href={`/about/blog/${blogs[0].slug}`}>
                      <img
                        src={blogs[0].image}
                        alt={blogs[0].title}
                        className="blog-card-img"
                      />
                    </Link>
                  </div>
                )}

                <div className="blog-card-body bento-featured-body">
                  <div className="bento-meta-row">
                    <span className="bento-category-tag">
                      {blogs[0].category}
                    </span>
                    <span className="bento-readtime">{blogs[0].readTime}</span>
                  </div>

                  <h3 className="bento-featured-title">
                    <Link href={`/about/blog/${blogs[0].slug}`}>
                      {blogs[0].title}
                    </Link>
                  </h3>

                  <p className="bento-featured-summary">
                    {blogs[0].summary}
                  </p>

                  <div className="bento-card-action">
                    <Link
                      href={`/about/blog/${blogs[0].slug}`}
                      className="bento-read-btn"
                    >
                      Read Full Article
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Right Column: 2 Stacked Blogs */}
            <div className="bento-side-col">
              {blogs.slice(1, 3).map((blog) => (
                <div
                  key={blog.id || blog.slug}
                  className="blog-card bento-side-card"
                >
                  {blog.image && (
                    <div className="bento-side-img-wrap">
                      <Link href={`/about/blog/${blog.slug}`} style={{ display: 'block', height: '100%' }}>
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="blog-card-img"
                        />
                      </Link>
                    </div>
                  )}

                  <div className="blog-card-body bento-side-body">
                    <div className="bento-meta-row">
                      <span className="bento-category-tag">
                        {blog.category}
                      </span>
                      <span className="bento-readtime">{blog.readTime}</span>
                    </div>

                    <h3 className="bento-side-title">
                      <Link href={`/about/blog/${blog.slug}`}>
                        {blog.title}
                      </Link>
                    </h3>

                    <p className="bento-side-summary">
                      {blog.summary}
                    </p>

                    <div className="bento-card-action">
                      <Link
                        href={`/about/blog/${blog.slug}`}
                        className="bento-read-btn"
                      >
                        Read Article
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .bento-blog-layout {
          display: grid;
          grid-template-columns: 1.08fr 1fr;
          gap: 1.5rem;
          align-items: stretch;
        }

        .blog-card {
          background-color: #ffffff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .blog-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 32px rgba(15, 23, 42, 0.08);
        }

        .blog-card:hover .blog-card-img {
          transform: scale(1.04);
        }

        .blog-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }

        /* Featured Left Card */
        .bento-featured-card {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .bento-featured-img-wrap {
          width: 100%;
          height: 240px;
          overflow: hidden;
          background-color: #f1f5f9;
          flex-shrink: 0;
        }

        .bento-featured-body {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .bento-meta-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 500;
          margin-bottom: 0.65rem;
        }

        .bento-category-tag {
          text-transform: uppercase;
          color: #047857;
          background-color: #ecfdf5;
          padding: 0.2rem 0.55rem;
          border-radius: 4px;
          letter-spacing: 0.05em;
          font-weight: 600;
          font-size: 0.72rem;
        }

        .bento-readtime {
          color: #64748b;
          font-size: 0.75rem;
        }

        .bento-featured-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #0f172a;
          margin: 0 0 0.75rem 0;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .bento-featured-title a,
        .bento-side-title a {
          color: inherit;
          text-decoration: none;
        }

        .bento-featured-summary {
          font-size: 0.88rem;
          color: #64748b;
          line-height: 1.6;
          margin: 0;
          font-weight: 400;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Right Stacked Column */
        .bento-side-col {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          height: 100%;
        }

        .bento-side-card {
          display: flex;
          flex-direction: row;
          flex: 1;
          min-height: 0;
        }

        .bento-side-img-wrap {
          width: 200px;
          min-width: 170px;
          overflow: hidden;
          background-color: #f1f5f9;
          flex-shrink: 0;
        }

        .bento-side-body {
          padding: 1.25rem 1.4rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          min-width: 0;
        }

        .bento-side-title {
          font-size: 1rem;
          font-weight: 600;
          color: #0f172a;
          margin: 0 0 0.45rem 0;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .bento-side-summary {
          font-size: 0.82rem;
          color: #64748b;
          line-height: 1.5;
          margin: 0;
          font-weight: 400;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .bento-card-action {
          margin-top: auto;
          padding-top: 0.75rem;
        }

        .bento-read-btn {
          font-size: 0.84rem;
          font-weight: 600;
          color: #0f172a;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          transition: gap 0.2s ease, color 0.2s ease;
        }

        .bento-read-btn:hover {
          color: #047857;
          gap: 0.55rem;
        }

        @media (max-width: 900px) {
          .bento-blog-layout {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          .bento-side-card {
            flex-direction: column !important;
          }
          .bento-side-img-wrap {
            width: 100% !important;
            height: 180px !important;
          }
        }
      `}</style>
    </section>
  );
}


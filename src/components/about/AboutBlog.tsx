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
    image: "https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto/v1783710431/zawr/assets/blogs/blog-BLOG-9-laptop_on_cloud_with_ERP_dashboard_in_light_gradient__color_theme___000714_and__13578c__1_.jpg",
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
    image: "https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto/v1783710430/zawr/assets/blogs/blog-BLOG-8-pexels-gunshe-5125104.jpg",
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
    image: "https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto/v1783710428/zawr/assets/blogs/blog-BLOG-7-pexels-huy-phan-316220-27436633.jpg",
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

        {/* Real Blogs Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '2rem',
          }}
        >
          {blogs.map((blog) => (
            <div
              key={blog.id || blog.slug}
              style={{
                gridColumn: 'span 4',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              className="blog-card"
            >
              {/* Blog Image */}
              {blog.image && (
                <div style={{ width: '100%', aspectRatio: '16 / 10', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
                  <Link href={`/about/blog/${blog.slug}`}>
                    <img
                      src={blog.image}
                      alt={blog.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 0.5s ease',
                      }}
                      className="blog-card-img"
                    />
                  </Link>
                </div>
              )}

              <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#64748b', fontWeight: 500 }}>
                  <span style={{ textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.06em', fontWeight: 600 }}>
                    {blog.category}
                  </span>
                  <span>{blog.readTime}</span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 500, color: '#0f172a', margin: 0, lineHeight: 1.35 }}>
                  <Link href={`/about/blog/${blog.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {blog.title}
                  </Link>
                </h3>

                <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6, margin: 0, fontWeight: 400, flexGrow: 1 }}>
                  {blog.summary}
                </p>

                <div style={{ paddingTop: '0.5rem' }}>
                  <Link
                    href={`/about/blog/${blog.slug}`}
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#0f172a',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
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

      <style>{`
        .blog-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(15, 23, 42, 0.06);
        }
        .blog-card:hover .blog-card-img {
          transform: scale(1.04);
        }
        @media (max-width: 900px) {
          .blog-card {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </section>
  );
}


'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

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

export default function BlogIndexPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('/api/blogs');
        if (res.ok) {
          const data = await res.json();
          setBlogs(data);
        }
      } catch (e) {
        console.error('Error fetching blogs:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

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

  const featuredBlog = blogs[0];
  const gridBlogs = blogs.slice(1);

  return (
    <div className="blog-index-container">
      <style dangerouslySetInnerHTML={{ __html: `
        .blog-index-container {
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

        /* Featured Post Layout */
        .featured-post-section {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 3.5rem;
          align-items: center;
          margin-bottom: 5rem;
        }

        .featured-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .featured-title {
          font-family: 'Georgia', serif;
          font-size: clamp(2rem, 4vw, 3.1rem);
          font-weight: 400;
          line-height: 1.15;
          letter-spacing: -0.02em;
          color: #111111;
          margin-bottom: 2.2rem;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }
        .featured-title:hover {
          opacity: 0.8;
        }

        .author-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .author-img {
          width: 32px;
          height: 32px;
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
          box-shadow: 0 10px 30px rgba(0,0,0,0.04);
        }
        .featured-image-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .featured-image-box:hover img {
          transform: scale(1.03);
        }

        /* Secondary Articles Grid Section */
        .grid-header {
          text-align: center;
          margin-bottom: 3.5rem;
        }
        .grid-subtitle {
          font-size: 0.88rem;
          color: #777777;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          display: block;
          margin-bottom: 0.5rem;
        }
        .grid-title {
          font-family: 'Georgia', serif;
          font-size: 2.4rem;
          font-weight: 400;
          color: #111111;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .articles-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .grid-card {
          background-color: #fafaf9;
          border-radius: 20px;
          padding: 1.8rem;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 20px rgba(0,0,0,0.01);
          border: 1px solid #f2f2ee;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .grid-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.04);
        }

        .card-image-wrapper {
          width: 100%;
          aspect-ratio: 1.5;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 1.5rem;
          background-color: #eee;
        }
        .card-image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .card-meta {
          font-size: 0.78rem;
          color: #888888;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.6rem;
        }

        .card-title {
          font-family: 'Georgia', serif;
          font-size: 1.35rem;
          font-weight: 400;
          line-height: 1.3;
          margin: 0 0 1rem 0;
          color: #111111;
        }

        .card-summary {
          font-size: 0.92rem;
          color: #555555;
          line-height: 1.55;
          margin: 0 0 1.5rem 0;
          flex-grow: 1;
        }

        .card-link {
          font-size: 0.88rem;
          font-weight: 500;
          color: #000000;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          transition: gap 0.2s;
        }
        .grid-card:hover .card-link {
          gap: 0.5rem;
        }

        /* Mobile responsive adjustments */
        @media (max-width: 968px) {
          .featured-post-section {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .articles-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .newsletter-card {
            flex-direction: column;
            padding: 2.5rem 2rem;
            align-items: stretch;
            text-align: center;
          }
          .newsletter-form {
            max-width: 100%;
          }
        }

        @media (max-width: 640px) {
          .articles-grid {
            grid-template-columns: 1fr;
          }
          .blog-index-container {
            padding-top: 6rem;
          }
        }
      `}} />

      <div className="blog-wrapper">
        {/* Breadcrumb matching mockup */}
        <div className="breadcrumbs">
          <Link href="/">Home</Link>
          <span>&gt;</span>
          <span style={{ fontWeight: 500, color: '#111111' }}>Blog</span>
        </div>

        {/* Featured Post */}
        {featuredBlog ? (
          <div className="featured-post-section">
            <div className="featured-content">
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b7280' }}>
                  {featuredBlog.category}
                </span>
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#d1d5db' }} />
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{featuredBlog.readTime}</span>
              </div>
              
              <Link href={`/about/blog/${featuredBlog.slug}`} style={{ textDecoration: 'none' }}>
                <h1 className="featured-title">{featuredBlog.title}</h1>
              </Link>

              <div className="author-meta">
                <img className="author-img" src={featuredBlog.authorImage} alt={featuredBlog.author} />
                <div className="author-info">
                  By <span className="author-name">{featuredBlog.author}</span> &bull; Updated on {featuredBlog.date}
                </div>
              </div>
            </div>

            <div className="featured-image-box">
              <Link href={`/about/blog/${featuredBlog.slug}`}>
                <img src={featuredBlog.image} alt={featuredBlog.title} />
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#666' }}>
            No featured article found.
          </div>
        )}

        {/* Secondary Articles Section */}
        {gridBlogs.length > 0 && (
          <div>
            <div className="grid-header">
              <span className="grid-subtitle">Recent Stories</span>
              <h2 className="grid-title">Explore more insights</h2>
            </div>
            
            <div className="articles-grid">
              {gridBlogs.map((blog) => (
                <div key={blog.id} className="grid-card">
                  {blog.image && (
                    <div className="card-image-wrapper">
                      <Link href={`/about/blog/${blog.slug}`}>
                        <img src={blog.image} alt={blog.title} />
                      </Link>
                    </div>
                  )}
                  <div className="card-meta">
                    {blog.category} &bull; {blog.readTime}
                  </div>
                  <h3 className="card-title">
                    <Link href={`/about/blog/${blog.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {blog.title}
                    </Link>
                  </h3>
                  <p className="card-summary">{blog.summary}</p>
                  <Link href={`/about/blog/${blog.slug}`} className="card-link">
                    Read Article 
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

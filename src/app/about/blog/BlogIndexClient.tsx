'use client';

import React, { useState, useEffect, useMemo } from 'react';
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

export default function BlogIndexClient() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'readingTime'>('latest');

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMsg, setNewsletterMsg] = useState('');

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

  // Compute Categories with Article Counts
  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    blogs.forEach(b => {
      const cat = b.category || 'Insights';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    const unique = Object.keys(counts).sort();
    return [
      { name: 'All', count: blogs.length },
      ...unique.map(name => ({ name, count: counts[name] }))
    ];
  }, [blogs]);

  // Filter and Sort Blogs
  const filteredBlogs = useMemo(() => {
    let result = blogs.filter(b => {
      const matchesCat = selectedCategory === 'All' || b.category?.toLowerCase() === selectedCategory.toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery = !q || 
        b.title?.toLowerCase().includes(q) ||
        b.summary?.toLowerCase().includes(q) ||
        b.author?.toLowerCase().includes(q) ||
        b.sections?.some(s => s.title.toLowerCase().includes(q) || s.body.toLowerCase().includes(q));
      return matchesCat && matchesQuery;
    });

    if (sortBy === 'oldest') {
      result = [...result].reverse();
    } else if (sortBy === 'readingTime') {
      result = [...result].sort((a, b) => {
        const timeA = parseInt(a.readTime) || 5;
        const timeB = parseInt(b.readTime) || 5;
        return timeA - timeB;
      });
    }

    return result;
  }, [blogs, selectedCategory, searchQuery, sortBy]);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    setNewsletterStatus('loading');
    setNewsletterMsg('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail })
      });
      const data = await res.json();
      if (res.ok) {
        setNewsletterStatus('success');
        setNewsletterMsg(data.message || 'Thank you for subscribing to Zawr Industry Briefings!');
        setNewsletterEmail('');
      } else {
        setNewsletterStatus('error');
        setNewsletterMsg(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch {
      setNewsletterStatus('error');
      setNewsletterMsg('Network error. Please try again.');
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

  const featuredBlog = filteredBlogs.length > 0 ? filteredBlogs[0] : null;
  const gridBlogs = filteredBlogs.length > 1 ? filteredBlogs.slice(1) : [];

  return (
    <div className="blog-index-container">
      <style dangerouslySetInnerHTML={{ __html: `
        .blog-index-container {
          background-color: #ffffff;
          color: #111111;
          font-family: 'Inter', sans-serif;
          padding-top: 8rem;
          padding-bottom: 7rem;
        }

        .blog-wrapper {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 clamp(1.25rem, 4vw, 2.5rem);
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

        /* Page Hero Header */
        .page-header {
          margin-bottom: 3.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .page-tag {
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #6b7280;
        }
        .page-title {
          font-family: 'Georgia', serif;
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 400;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: #000000;
          margin: 0;
        }
        .page-description {
          font-size: 1.15rem;
          color: #4b5563;
          max-width: 720px;
          line-height: 1.6;
          margin: 0;
        }

        /* Filter & Search Bar */
        .filter-search-bar {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 3.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .category-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          align-items: center;
        }

        .cat-pill {
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-size: 0.85rem;
          font-weight: 500;
          border: 1px solid #e5e7eb;
          background-color: #ffffff;
          color: #4b5563;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }
        .cat-pill:hover {
          background-color: #f3f4f6;
          color: #000000;
          border-color: #d1d5db;
        }
        .cat-pill.active {
          background-color: #000000;
          color: #ffffff;
          border-color: #000000;
        }
        .cat-count {
          font-size: 0.72rem;
          opacity: 0.75;
        }

        .controls-right {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .search-box {
          position: relative;
          min-width: 260px;
        }
        .search-input {
          width: 100%;
          padding: 0.55rem 1rem 0.55rem 2.25rem;
          border: 1px solid #d1d5db;
          border-radius: 9999px;
          font-size: 0.88rem;
          color: #111827;
          outline: none;
          transition: all 0.2s ease;
          background-color: #f9fafb;
        }
        .search-input:focus {
          border-color: #000000;
          background-color: #ffffff;
          box-shadow: 0 0 0 3px rgba(0,0,0,0.05);
        }
        .search-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          pointer-events: none;
        }

        .sort-select {
          padding: 0.55rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 9999px;
          font-size: 0.85rem;
          color: #374151;
          background-color: #ffffff;
          outline: none;
          cursor: pointer;
        }

        /* Results Counter Strip */
        .results-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          font-size: 0.88rem;
          color: #6b7280;
        }
        .clear-search-btn {
          background: none;
          border: none;
          color: #000000;
          font-weight: 600;
          text-decoration: underline;
          cursor: pointer;
          padding: 0;
        }

        /* Lead Featured Editorial Card */
        .featured-card {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 3.5rem;
          align-items: center;
          margin-bottom: 5rem;
          padding: 2.5rem;
          background-color: #fcfcfc;
          border: 1px solid #f1f1f1;
          border-radius: 24px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .featured-card:hover {
          border-color: #e2e8f0;
          box-shadow: 0 16px 40px rgba(0,0,0,0.03);
        }

        .featured-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .featured-tag-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
        }
        .featured-badge {
          background-color: #000000;
          color: #ffffff;
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 0.3rem 0.75rem;
          border-radius: 9999px;
        }
        .featured-readtime {
          font-size: 0.8rem;
          color: #6b7280;
          font-weight: 500;
        }

        .featured-title {
          font-family: 'Georgia', serif;
          font-size: clamp(2rem, 3.5vw, 2.85rem);
          font-weight: 400;
          line-height: 1.2;
          letter-spacing: -0.02em;
          color: #111111;
          margin: 0 0 1.25rem 0;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .featured-title:hover {
          color: #2563eb;
        }

        .featured-summary {
          font-size: 1.05rem;
          color: #4b5563;
          line-height: 1.65;
          margin: 0 0 2rem 0;
        }

        .featured-author-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 1.5rem;
          border-top: 1px solid #ebebeb;
        }
        .author-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .author-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          background-color: #eee;
        }
        .author-details {
          display: flex;
          flex-direction: column;
        }
        .author-title-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: #111827;
        }
        .author-date {
          font-size: 0.78rem;
          color: #6b7280;
        }

        .read-article-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.9rem;
          font-weight: 600;
          color: #000000;
          text-decoration: none;
          transition: gap 0.2s ease;
        }
        .read-article-link:hover {
          gap: 0.7rem;
        }

        .featured-image-container {
          width: 100%;
          aspect-ratio: 1.45;
          border-radius: 16px;
          overflow: hidden;
          background-color: #f3f4f6;
        }
        .featured-image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .featured-card:hover .featured-image-container img {
          transform: scale(1.03);
        }

        /* Standard Articles Grid */
        .articles-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2.25rem;
          margin-bottom: 6rem;
        }

        .blog-card {
          background-color: #ffffff;
          border: 1px solid #f0f0f0;
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          text-decoration: none;
          color: inherit;
        }
        .blog-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 32px rgba(0,0,0,0.04);
          border-color: #e2e8f0;
        }

        .card-img-box {
          width: 100%;
          aspect-ratio: 1.55;
          overflow: hidden;
          background-color: #f3f4f6;
        }
        .card-img-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .blog-card:hover .card-img-box img {
          transform: scale(1.04);
        }

        .card-body {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .card-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.85rem;
        }
        .card-category {
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #4b5563;
          background-color: #f3f4f6;
          padding: 0.25rem 0.65rem;
          border-radius: 9999px;
        }
        .card-readtime {
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .card-title {
          font-family: 'Georgia', serif;
          font-size: 1.3rem;
          font-weight: 400;
          line-height: 1.35;
          color: #111827;
          margin: 0 0 0.85rem 0;
        }

        .card-summary {
          font-size: 0.9rem;
          color: #4b5563;
          line-height: 1.6;
          margin: 0 0 1.5rem 0;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .card-author-row {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding-top: 1.25rem;
          border-top: 1px solid #f3f4f6;
        }
        .card-author-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          object-fit: cover;
          background-color: #eee;
        }
        .card-author-info {
          display: flex;
          flex-direction: column;
        }
        .card-author-name {
          font-size: 0.82rem;
          font-weight: 600;
          color: #1f2937;
        }
        .card-author-date {
          font-size: 0.72rem;
          color: #9ca3af;
        }

        /* Newsletter Subscription Banner */
        .newsletter-banner {
          background-color: #000000;
          color: #ffffff;
          border-radius: 28px;
          padding: clamp(3rem, 5vw, 4.5rem) clamp(1.5rem, 5vw, 4rem);
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 3rem;
          align-items: center;
          margin-bottom: 2rem;
        }
        .newsletter-title {
          font-family: 'Georgia', serif;
          font-size: clamp(2rem, 3.5vw, 2.75rem);
          font-weight: 400;
          line-height: 1.2;
          margin: 0 0 1rem 0;
        }
        .newsletter-sub {
          font-size: 1rem;
          color: #9ca3af;
          line-height: 1.6;
          margin: 0;
        }
        .newsletter-form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .newsletter-input-group {
          display: flex;
          gap: 0.5rem;
          background-color: #18181b;
          border: 1px solid #27272a;
          border-radius: 9999px;
          padding: 0.35rem 0.35rem 0.35rem 1.25rem;
        }
        .newsletter-input {
          flex: 1;
          background: none;
          border: none;
          color: #ffffff;
          font-size: 0.9rem;
          outline: none;
        }
        .newsletter-btn {
          padding: 0.75rem 1.5rem;
          border-radius: 9999px;
          background-color: #ffffff;
          color: #000000;
          font-size: 0.85rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s ease;
          white-space: nowrap;
        }
        .newsletter-btn:hover {
          background-color: #e5e7eb;
        }
        .newsletter-privacy {
          font-size: 0.75rem;
          color: #71717a;
          padding-left: 0.75rem;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 5rem 1rem;
          background-color: #fafaf9;
          border-radius: 20px;
          border: 1px dashed #d1d5db;
          margin-bottom: 4rem;
        }
        .empty-title {
          font-family: 'Georgia', serif;
          font-size: 1.75rem;
          color: #111827;
          margin: 0 0 0.5rem 0;
        }
        .empty-sub {
          font-size: 0.95rem;
          color: #6b7280;
          margin: 0 0 1.5rem 0;
        }

        /* Responsive Layouts */
        @media (max-width: 1024px) {
          .articles-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
          }
          .featured-card {
            grid-template-columns: 1fr;
            gap: 2.5rem;
            padding: 2rem;
          }
          .newsletter-banner {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }

        @media (max-width: 640px) {
          .blog-index-container {
            padding-top: 6rem;
          }
          .articles-grid {
            grid-template-columns: 1fr;
          }
          .filter-search-bar {
            flex-direction: column;
            align-items: stretch;
          }
          .controls-right {
            width: 100%;
          }
          .search-box {
            width: 100%;
          }
          .newsletter-input-group {
            flex-direction: column;
            border-radius: 16px;
            padding: 0.75rem;
          }
          .newsletter-input {
            padding: 0.5rem 0;
          }
          .newsletter-btn {
            width: 100%;
          }
        }
      `}} />

      <div className="blog-wrapper">
        {/* Breadcrumb Bar */}
        <div className="breadcrumbs">
          <Link href="/">Home</Link>
          <span>&gt;</span>
          <Link href="/about">About</Link>
          <span>&gt;</span>
          <span style={{ color: '#000000', fontWeight: 500 }}>Insights &amp; Blog</span>
        </div>

        {/* Page Header */}
        <div className="page-header">
          <span className="page-tag">Zawr Thought Leadership</span>
          <h1 className="page-title">Corporate Insights &amp; Perspectives</h1>
          <p className="page-description">
            Explore executive analysis, AI breakthroughs, automated logistics blueprints, and industrial modernization strategies from Zawr Industries engineers and leaders.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="filter-search-bar">
          <div className="category-pills">
            {categories.map(cat => (
              <button
                key={cat.name}
                className={`cat-pill ${selectedCategory === cat.name ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.name)}
              >
                {cat.name}
                <span className="cat-count">({cat.count})</span>
              </button>
            ))}
          </div>

          <div className="controls-right">
            <div className="search-box">
              <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search insights..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="sort-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
              <option value="readingTime">Quick Reads</option>
            </select>
          </div>
        </div>

        {/* Search Results Summary (when searching or filtered) */}
        {(searchQuery || selectedCategory !== 'All') && (
          <div className="results-meta">
            <span>
              Showing <strong>{filteredBlogs.length}</strong> {filteredBlogs.length === 1 ? 'article' : 'articles'} 
              {selectedCategory !== 'All' ? ` in "${selectedCategory}"` : ''}
              {searchQuery ? ` matching "${searchQuery}"` : ''}
            </span>
            <button
              className="clear-search-btn"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredBlogs.length === 0 ? (
          <div className="empty-state">
            <h3 className="empty-title">No Insights Found</h3>
            <p className="empty-sub">We couldn&apos;t find any articles matching your selected criteria.</p>
            <button
              className="newsletter-btn"
              style={{ display: 'inline-block' }}
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
            >
              View All Articles
            </button>
          </div>
        ) : (
          <>
            {/* Featured Article Spotlight */}
            {featuredBlog && (
              <div className="featured-card">
                <div className="featured-content">
                  <div className="featured-tag-row">
                    <span className="featured-badge">{featuredBlog.category}</span>
                    <span className="featured-readtime">{featuredBlog.readTime}</span>
                  </div>

                  <Link href={`/about/blog/${featuredBlog.slug}`} className="featured-title">
                    {featuredBlog.title}
                  </Link>

                  <p className="featured-summary">{featuredBlog.summary}</p>

                  <div className="featured-author-row">
                    <div className="author-box">
                      <img
                        className="author-avatar"
                        src={featuredBlog.authorImage}
                        alt={featuredBlog.author}
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="author-details">
                        <span className="author-title-name">{featuredBlog.author}</span>
                        <span className="author-date">{featuredBlog.date}</span>
                      </div>
                    </div>

                    <Link href={`/about/blog/${featuredBlog.slug}`} className="read-article-link">
                      Read Article
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </Link>
                  </div>
                </div>

                <Link href={`/about/blog/${featuredBlog.slug}`} className="featured-image-container">
                  <img
                    src={featuredBlog.image}
                    alt={featuredBlog.title}
                    loading="lazy"
                    decoding="async"
                  />
                </Link>
              </div>
            )}

            {/* Standard Grid of Remaining Articles */}
            {gridBlogs.length > 0 && (
              <div className="articles-grid">
                {gridBlogs.map((b) => (
                  <Link key={b.id} href={`/about/blog/${b.slug}`} className="blog-card">
                    <div className="card-img-box">
                      <img src={b.image} alt={b.title} loading="lazy" decoding="async" />
                    </div>
                    <div className="card-body">
                      <div className="card-meta-row">
                        <span className="card-category">{b.category}</span>
                        <span className="card-readtime">{b.readTime}</span>
                      </div>

                      <h3 className="card-title">{b.title}</h3>
                      <p className="card-summary">{b.summary}</p>

                      <div className="card-author-row">
                        <img className="card-author-avatar" src={b.authorImage} alt={b.author} loading="lazy" decoding="async" />
                        <div className="card-author-info">
                          <span className="card-author-name">{b.author}</span>
                          <span className="card-author-date">{b.date}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {/* Integrated Executive Newsletter Banner */}
        <div className="newsletter-banner">
          <div>
            <h2 className="newsletter-title">Subscribe to Zawr Industry Briefings</h2>
            <p className="newsletter-sub">
              Receive curated executive perspectives on artificial intelligence, autonomous logistics, advanced manufacturing, and capital governance delivered weekly to your inbox.
            </p>
          </div>

          <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
            <div className="newsletter-input-group">
              <input
                type="email"
                required
                className="newsletter-input"
                placeholder="Enter your corporate email..."
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
              />
              <button
                type="submit"
                className="newsletter-btn"
                disabled={newsletterStatus === 'loading'}
              >
                {newsletterStatus === 'loading' ? 'Subscribing...' : 'Get Briefings'}
              </button>
            </div>
            {newsletterMsg && (
              <span style={{ fontSize: '0.82rem', color: newsletterStatus === 'success' ? '#4ade80' : '#f87171', paddingLeft: '0.75rem' }}>
                {newsletterMsg}
              </span>
            )}
            <span className="newsletter-privacy">
              Zero spam. Unsubscribe anytime. Verified corporate privacy protocols.
            </span>
          </form>
        </div>
      </div>
    </div>
  );
}

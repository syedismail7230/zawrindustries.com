'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import FormattedContent from '@/components/FormattedContent';

interface Section {
  title: string;
  body: string;
}

export interface Blog {
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

interface BlogClientProps {
  blog: Blog;
  relatedBlogs?: Blog[];
  prevBlog?: Blog | null;
  nextBlog?: Blog | null;
}

export default function BlogClient({
  blog,
  relatedBlogs = [],
  prevBlog = null,
  nextBlog = null,
}: BlogClientProps) {
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [feedback, setFeedback] = useState<'yes' | 'no' | null>(null);

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMsg, setNewsletterMsg] = useState('');

  // Check bookmark status on mount
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('zawr_saved_articles') || '[]');
      if (saved.includes(blog.slug)) {
        setIsBookmarked(true);
      }
    } catch {
      // ignore
    }
  }, [blog.slug]);

  const toggleBookmark = () => {
    try {
      const saved: string[] = JSON.parse(localStorage.getItem('zawr_saved_articles') || '[]');
      let updated: string[];
      if (saved.includes(blog.slug)) {
        updated = saved.filter(s => s !== blog.slug);
        setIsBookmarked(false);
      } else {
        updated = [...saved, blog.slug];
        setIsBookmarked(true);
      }
      localStorage.setItem('zawr_saved_articles', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Track active section and reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      // 1. Reading progress
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }

      // 2. Active TOC section
      if (!blog || !blog.sections || blog.sections.length === 0) return;
      const sectionElements = blog.sections.map((_, i) => document.getElementById(`section-${i}`));
      const scrollPos = window.scrollY + 220;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i];
        if (el && scrollPos >= el.offsetTop) {
          setActiveSection(i);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [blog]);

  const handleShare = (platform: string) => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = blog ? blog.title : '';

    if (platform === 'x') {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    } else if (platform === 'email') {
      window.open(`mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`);
    } else if (platform === 'copy') {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    }
  };

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
        setNewsletterMsg(data.message || 'Subscribed successfully!');
        setNewsletterEmail('');
      } else {
        setNewsletterStatus('error');
        setNewsletterMsg(data.error || 'Failed to subscribe.');
      }
    } catch {
      setNewsletterStatus('error');
      setNewsletterMsg('Network error. Please try again.');
    }
  };

  return (
    <div className="blog-detail-container">
      {/* ── TOP READING PROGRESS BAR ── */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '4px',
          width: `${scrollProgress}%`,
          backgroundColor: '#000000',
          zIndex: 9999,
          transition: 'width 0.1s ease-out',
        }}
      />

      <style dangerouslySetInnerHTML={{ __html: `
        .blog-detail-container {
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
          margin-bottom: 2.25rem;
          flex-wrap: wrap;
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
          margin-bottom: 4.5rem;
        }

        .hero-title {
          font-family: 'Georgia', serif;
          font-size: clamp(2.25rem, 4vw, 3.4rem);
          font-weight: 400;
          line-height: 1.16;
          letter-spacing: -0.025em;
          color: #111111;
          margin: 0 0 1.75rem 0;
        }

        .author-meta-row {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }
        .author-img {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
          background-color: #eee;
        }
        .author-info {
          font-size: 0.9rem;
          color: #4b5563;
        }
        .author-name {
          font-weight: 600;
          color: #111111;
        }

        .featured-image-box {
          width: 100%;
          aspect-ratio: 1.45;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 12px 35px rgba(0,0,0,0.04);
          background-color: #f3f4f6;
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
          margin-bottom: 5rem;
        }

        .sidebar-left {
          position: sticky;
          top: 110px;
          height: fit-content;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .sidebar-section-title {
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #111111;
          margin: 0 0 0.85rem 0;
        }

        /* Social Share Icons */
        .share-icons {
          display: flex;
          gap: 0.6rem;
          flex-wrap: wrap;
        }
        .share-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1px solid #e5e7eb;
          background-color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #4b5563;
          transition: all 0.2s ease;
          position: relative;
        }
        .share-btn:hover {
          background-color: #f3f4f6;
          border-color: #000000;
          color: #000000;
          transform: translateY(-2px);
        }

        .copied-tooltip {
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          background-color: #000000;
          color: #ffffff;
          font-size: 0.72rem;
          font-weight: 600;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          white-space: nowrap;
          box-shadow: 0 4px 10px rgba(0,0,0,0.15);
        }

        /* Reading Utilities Card (Font Size, Bookmark, Print) */
        .util-bar {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }
        .util-btn {
          padding: 0.35rem 0.75rem;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          background-color: #ffffff;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          color: #4b5563;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }
        .util-btn:hover {
          background-color: #f3f4f6;
          color: #000000;
          border-color: #000000;
        }
        .util-btn.active {
          background-color: #000000;
          color: #ffffff;
          border-color: #000000;
        }

        /* Table of Contents Card */
        .toc-card {
          background-color: #fcfcfc;
          border-radius: 18px;
          padding: 1.5rem;
          border: 1px solid #f0f0f0;
        }
        .toc-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .toc-item {
          font-size: 0.88rem;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          line-height: 1.35;
        }
        .toc-item:hover {
          color: #000000;
        }
        .toc-item.active {
          color: #000000;
          font-weight: 600;
        }
        .toc-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #000000;
          display: inline-block;
          opacity: 0;
          transition: opacity 0.2s;
          flex-shrink: 0;
        }
        .toc-item.active .toc-dot {
          opacity: 1;
        }

        /* Article Reading Flow */
        .reading-flow {
          max-width: 760px;
        }

        /* Key Takeaways Callout Box */
        .takeaways-box {
          background-color: #f8fafc;
          border-left: 4px solid #000000;
          border-radius: 0 16px 16px 0;
          padding: 1.75rem 2rem;
          margin-bottom: 3.5rem;
        }
        .takeaways-title {
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #000000;
          margin: 0 0 0.75rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .takeaways-text {
          font-size: 1.05rem;
          color: #334155;
          line-height: 1.65;
          margin: 0;
        }

        .reading-section {
          margin-bottom: 3.75rem;
          scroll-margin-top: 130px;
        }
        .reading-section h2 {
          font-family: 'Georgia', serif;
          font-size: 1.9rem;
          font-weight: 400;
          line-height: 1.28;
          margin-top: 0;
          margin-bottom: 1.25rem;
          color: #000000;
          letter-spacing: -0.015em;
        }
        .reading-paragraph {
          font-size: calc(1.125rem * var(--font-multiplier, 1));
          color: #374151;
          line-height: 1.9;
          margin: 0 0 1.5rem 0;
        }

        /* Tags Strip */
        .tags-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 2rem;
          margin-bottom: 3rem;
          align-items: center;
        }
        .tag-pill {
          padding: 0.35rem 0.85rem;
          border-radius: 9999px;
          background-color: #f3f4f6;
          color: #4b5563;
          font-size: 0.8rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .tag-pill:hover {
          background-color: #000000;
          color: #ffffff;
        }

        /* Article Feedback Widget */
        .feedback-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.75rem;
          background-color: #fcfcfc;
          border: 1px solid #f0f0f0;
          border-radius: 16px;
          margin-bottom: 3.5rem;
        }
        .feedback-prompt {
          font-size: 0.92rem;
          font-weight: 500;
          color: #1f2937;
        }
        .feedback-actions {
          display: flex;
          gap: 0.5rem;
        }
        .feedback-btn {
          padding: 0.4rem 0.9rem;
          border-radius: 9999px;
          border: 1px solid #e5e7eb;
          background-color: #ffffff;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .feedback-btn:hover {
          border-color: #000000;
        }
        .feedback-btn.active {
          background-color: #000000;
          color: #ffffff;
          border-color: #000000;
        }

        /* Author Credentials Footer Box */
        .author-card-box {
          display: flex;
          gap: 1.75rem;
          align-items: center;
          padding: 2.25rem;
          background-color: #fafaf9;
          border-radius: 20px;
          border: 1px solid #f1f1ee;
          margin-top: 3rem;
          margin-bottom: 4rem;
        }
        .author-card-img {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }
        .author-card-name {
          font-family: 'Georgia', serif;
          font-size: 1.35rem;
          font-weight: 400;
          color: #000000;
          margin: 0 0 0.35rem 0;
        }
        .author-card-title {
          font-size: 0.85rem;
          color: #6b7280;
          font-weight: 500;
          margin-bottom: 0.6rem;
        }
        .author-card-bio {
          font-size: 0.92rem;
          color: #4b5563;
          line-height: 1.6;
          margin: 0;
        }

        /* Prev / Next Article Navigation */
        .article-nav-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          padding: 2.5rem 0;
          border-top: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 5rem;
        }
        .nav-card {
          padding: 1.5rem;
          border-radius: 16px;
          background-color: #ffffff;
          border: 1px solid #e5e7eb;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          transition: all 0.2s ease;
        }
        .nav-card:hover {
          border-color: #000000;
          background-color: #f9fafb;
          transform: translateY(-2px);
        }
        .nav-card-label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #9ca3af;
        }
        .nav-card-title {
          font-family: 'Georgia', serif;
          font-size: 1.05rem;
          color: #111827;
          line-height: 1.4;
          font-weight: 400;
        }

        /* Related Articles Section */
        .related-section {
          margin-bottom: 5rem;
        }
        .related-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2rem;
        }
        .related-title {
          font-family: 'Georgia', serif;
          font-size: 2rem;
          font-weight: 400;
          color: #000000;
          margin: 0;
        }
        .related-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
        .related-card {
          background-color: #ffffff;
          border: 1px solid #f0f0f0;
          border-radius: 18px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
          transition: all 0.2s ease;
        }
        .related-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 30px rgba(0,0,0,0.04);
          border-color: #e2e8f0;
        }
        .related-img {
          width: 100%;
          aspect-ratio: 1.6;
          object-fit: cover;
        }
        .related-body {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .related-meta {
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #6b7280;
          margin-bottom: 0.5rem;
        }
        .related-card-title {
          font-family: 'Georgia', serif;
          font-size: 1.15rem;
          font-weight: 400;
          line-height: 1.35;
          color: #111827;
          margin: 0 0 0.5rem 0;
        }
        .related-readtime {
          font-size: 0.75rem;
          color: #9ca3af;
          margin-top: auto;
        }

        /* Article Newsletter CTA Banner */
        .article-newsletter {
          background-color: #000000;
          color: #ffffff;
          border-radius: 24px;
          padding: 3.5rem clamp(1.5rem, 5vw, 3.5rem);
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 2.5rem;
          align-items: center;
        }
        .an-title {
          font-family: 'Georgia', serif;
          font-size: clamp(1.75rem, 3vw, 2.35rem);
          font-weight: 400;
          margin: 0 0 0.75rem 0;
        }
        .an-sub {
          font-size: 0.95rem;
          color: #9ca3af;
          line-height: 1.6;
          margin: 0;
        }

        /* Print Media Styling */
        @media print {
          .sidebar-left, .article-nav-row, .related-section, .article-newsletter, .feedback-box, .breadcrumbs, .util-bar {
            display: none !important;
          }
          .article-grid {
            display: block !important;
          }
          .reading-flow {
            max-width: 100% !important;
          }
        }

        /* Responsive Layout */
        @media (max-width: 968px) {
          .hero-split {
            grid-template-columns: 1fr;
            gap: 2.5rem;
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
            display: none;
          }
          .related-grid {
            grid-template-columns: 1fr;
          }
          .article-newsletter {
            grid-template-columns: 1fr;
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
          .article-nav-row {
            grid-template-columns: 1fr;
          }
          .author-card-box {
            flex-direction: column;
            text-align: center;
          }
        }
      `}} />

      <div className="blog-wrapper" style={{ '--font-multiplier': fontSizeMultiplier } as React.CSSProperties}>
        {/* Breadcrumb Navigation */}
        <div className="breadcrumbs">
          <Link href="/">Home</Link>
          <span>&gt;</span>
          <Link href="/about">About</Link>
          <span>&gt;</span>
          <Link href="/about/blog">Insights</Link>
          <span>&gt;</span>
          <span style={{ color: '#000000', fontWeight: 500 }}>{blog.title}</span>
        </div>

        {/* Hero Split Header */}
        <div className="hero-split">
          <div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#111827',
                backgroundColor: '#f3f4f6',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px'
              }}>
                {blog.category}
              </span>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#d1d5db' }} />
              <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{blog.readTime}</span>
            </div>

            <h1 className="hero-title">{blog.title}</h1>

            <div className="author-meta-row">
              <img className="author-img" src={blog.authorImage} alt={blog.author} loading="lazy" decoding="async" />
              <div className="author-info">
                By <span className="author-name">{blog.author}</span> &bull; {blog.date}
              </div>
            </div>
          </div>

          <div className="featured-image-box">
            <img src={blog.image} alt={blog.title} loading="lazy" decoding="async" />
          </div>
        </div>

        {/* Main Article Grid */}
        <div className="article-grid">
          {/* Sticky Left Sidebar */}
          <div className="sidebar-left">
            <div>
              <h4 className="sidebar-section-title">Share Article</h4>
              <div className="share-icons">
                <button className="share-btn" aria-label="Share on X" onClick={() => handleShare('x')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </button>
                <button className="share-btn" aria-label="Share on LinkedIn" onClick={() => handleShare('linkedin')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </button>
                <button className="share-btn" aria-label="Share on WhatsApp" onClick={() => handleShare('whatsapp')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </button>
                <button className="share-btn" aria-label="Copy Link" onClick={() => handleShare('copy')}>
                  {copied && <span className="copied-tooltip">Copied!</span>}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Reading Utilities (Font Adjust, Bookmark, Print) */}
            <div>
              <h4 className="sidebar-section-title">Reading Tools</h4>
              <div className="util-bar">
                <button
                  className={`util-btn ${isBookmarked ? 'active' : ''}`}
                  onClick={toggleBookmark}
                  aria-label="Bookmark article"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                  {isBookmarked ? 'Saved' : 'Save'}
                </button>
                <button
                  className="util-btn"
                  onClick={() => setFontSizeMultiplier(prev => (prev === 1.15 ? 0.95 : prev === 0.95 ? 1 : 1.15))}
                  title="Adjust font size"
                >
                  Aa
                </button>
                <button
                  className="util-btn"
                  onClick={() => typeof window !== 'undefined' && window.print()}
                  title="Print / Save PDF"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 6 2 18 2 18 9" />
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                    <rect x="6" y="14" width="12" height="8" />
                  </svg>
                </button>
              </div>
            </div>

            {blog.sections && blog.sections.length > 0 && (
              <div className="toc-card">
                <h4 className="sidebar-section-title">Table of Contents</h4>
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
                      <span>{sect.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Article Main Flow */}
          <div className="reading-flow">
            {/* Executive Summary / Key Takeaways Box */}
            {blog.summary && (
              <div className="takeaways-box">
                <div className="takeaways-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  Executive Summary &amp; Key Insights
                </div>
                <FormattedContent content={blog.summary} className="takeaways-text" />
              </div>
            )}

            {/* Render Sections with Rich Text & Formatting Support */}
            {blog.sections && blog.sections.map((sect, i) => (
              <div key={i} id={`section-${i}`} className="reading-section">
                <h2>{sect.title}</h2>
                <FormattedContent content={sect.body} className="reading-paragraph" />
              </div>
            ))}

            {/* Article Topics & Tags Strip */}
            <div className="tags-row">
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Topics:
              </span>
              <span className="tag-pill">#{blog.category || 'Insights'}</span>
              <span className="tag-pill">#ZawrIndustries</span>
              <span className="tag-pill">#EnterpriseEngineering</span>
              <span className="tag-pill">#GlobalStrategy</span>
            </div>

            {/* Interactive Reader Feedback */}
            <div className="feedback-box">
              <span className="feedback-prompt">Was this insight helpful?</span>
              <div className="feedback-actions">
                <button
                  className={`feedback-btn ${feedback === 'yes' ? 'active' : ''}`}
                  onClick={() => setFeedback('yes')}
                >
                  👍 Yes, valuable
                </button>
                <button
                  className={`feedback-btn ${feedback === 'no' ? 'active' : ''}`}
                  onClick={() => setFeedback('no')}
                >
                  👎 Not really
                </button>
              </div>
            </div>

            {/* Author Credentials & Verification Box */}
            <div className="author-card-box">
              <img className="author-card-img" src={blog.authorImage} alt={blog.author} loading="lazy" decoding="async" />
              <div>
                <h3 className="author-card-name">{blog.author}</h3>
                <div className="author-card-title">Technology &amp; Strategy Contributor &bull; Zawr Industries</div>
                <p className="author-card-bio">
                  Authoring executive analysis and technical perspectives on scalable enterprise engineering, industrial automation, and corporate transformation across global markets.
                </p>
              </div>
            </div>

            {/* Previous & Next Article Navigation Cards */}
            {(prevBlog || nextBlog) && (
              <div className="article-nav-row">
                {prevBlog ? (
                  <Link href={`/about/blog/${prevBlog.slug}`} className="nav-card">
                    <span className="nav-card-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                      Previous Article
                    </span>
                    <span className="nav-card-title">{prevBlog.title}</span>
                  </Link>
                ) : <div />}

                {nextBlog ? (
                  <Link href={`/about/blog/${nextBlog.slug}`} className="nav-card" style={{ textAlign: 'right' }}>
                    <span className="nav-card-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                      Next Article
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>
                    </span>
                    <span className="nav-card-title">{nextBlog.title}</span>
                  </Link>
                ) : <div />}
              </div>
            )}
          </div>
        </div>

        {/* Recommended / Related Articles Section */}
        {relatedBlogs.length > 0 && (
          <div className="related-section">
            <div className="related-header">
              <h2 className="related-title">Related Insights &amp; Perspectives</h2>
              <Link href="/about/blog" style={{ color: '#000000', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span>View All Insights</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>
              </Link>
            </div>

            <div className="related-grid">
              {relatedBlogs.map((rb) => (
                <Link key={rb.id} href={`/about/blog/${rb.slug}`} className="related-card">
                  <img className="related-img" src={rb.image} alt={rb.title} loading="lazy" decoding="async" />
                  <div className="related-body">
                    <span className="related-meta">{rb.category}</span>
                    <h3 className="related-card-title">{rb.title}</h3>
                    <span className="related-readtime">{rb.readTime}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Embedded Newsletter Callout Banner */}
        <div className="article-newsletter">
          <div>
            <h3 className="an-title">Stay ahead of industry breakthroughs</h3>
            <p className="an-sub">
              Subscribe to Zawr Industry Briefings for weekly perspectives delivered straight to your corporate inbox.
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              backgroundColor: '#18181b',
              border: '1px solid #27272a',
              borderRadius: '9999px',
              padding: '0.35rem 0.35rem 0.35rem 1.25rem'
            }}>
              <input
                type="email"
                required
                placeholder="Enter corporate email..."
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                disabled={newsletterStatus === 'loading'}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '9999px',
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {newsletterStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
            {newsletterMsg && (
              <span style={{ fontSize: '0.82rem', color: newsletterStatus === 'success' ? '#4ade80' : '#f87171', paddingLeft: '0.75rem' }}>
                {newsletterMsg}
              </span>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface BlogItem {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  image: string;
  readTime: string;
}

const FEATURED_BLOGS: BlogItem[] = [
  {
    id: 'BLOG-9',
    slug: 'next-generation-cloud-solutions-scaling-global-it-infrastructures',
    title: 'Next-Generation Cloud Solutions: Scaling Global IT Infrastructures',
    date: '18 June 2026',
    category: 'Technology',
    summary: 'Enterprise cloud migrations require robust security, high availability, and containerized microservices. Explore how Zawr IT Services delivers scalable architectures.',
    image: 'https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_800,c_limit/v1783710431/zawr/assets/blogs/blog-BLOG-9-laptop_on_cloud_with_ERP_dashboard_in_light_gradient__color_theme___000714_and__13578c__1_.jpg',
    readTime: '6 min read',
  },
  {
    id: 'BLOG-8',
    slug: 'pioneering-smart-mining-technologies-safe-and-clean-extraction',
    title: 'Pioneering Smart Mining Technologies: Safe and Clean Extraction',
    date: '15 June 2026',
    category: 'Corporate',
    summary: 'Mining operations are undergoing a digital transformation with automated machinery and real-time safety telemetry minimizing environmental footprint.',
    image: 'https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_800,c_limit/v1783710430/zawr/assets/blogs/blog-BLOG-8-pexels-gunshe-5125104.jpg',
    readTime: '8 min read',
  },
  {
    id: 'BLOG-7',
    slug: 'designing-the-modern-workspace-ergonomics-and-human-centric-design',
    title: 'Designing the Modern Workspace: Ergonomics and Human-Centric Design',
    date: '11 June 2026',
    category: 'Opinion',
    summary: 'The physical workplace plays an essential role in employee well-being and productivity. Discover the ergonomic theories driving future office layouts.',
    image: 'https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_800,c_limit/v1783710428/zawr/assets/blogs/blog-BLOG-7-pexels-huy-phan-316220-27436633.jpg',
    readTime: '5 min read',
  },
  {
    id: 'BLOG-6',
    slug: 'decarbonizing-heavy-operations-zawr-s-path-to-net-zero',
    title: "Decarbonizing Heavy Operations: Zawr's Path to Net Zero",
    date: '08 June 2026',
    category: 'Corporate',
    summary: 'Heavy manufacturing and metal refinement are energy-intensive sectors. Zawr outlines its strategic roadmap to transition operations to sustainable power.',
    image: 'https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_800,c_limit/v1783710426/zawr/assets/blogs/blog-BLOG-6-pexels-nc-farm-bureau-mark-15751120.jpg',
    readTime: '9 min read',
  },
];

export default function HomeBlogsSection() {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Technology', 'Corporate', 'Opinion'];

  const filteredBlogs = activeCategory === 'All'
    ? FEATURED_BLOGS
    : FEATURED_BLOGS.filter((b) => b.category.toLowerCase() === activeCategory.toLowerCase());

  const leadBlog = filteredBlogs[0] || FEATURED_BLOGS[0];
  const sideBlogs = filteredBlogs.slice(1);

  return (
    <section
      id="blogs"
      aria-label="Blogs and Editorial Insights"
      className="home-blogs-section"
    >
      <div className="home-blogs-container">
        {/* Section Header (Centered like 'Our Process' and 'Newsroom') */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 4vh, 3.25rem)' }}>
          <h2
            style={{
              fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)',
              fontWeight: 400,
              color: '#0f172a',
              letterSpacing: '-0.03em',
              margin: 0,
            }}
          >
            Blogs
          </h2>
        </div>

        {/* Category Filter Pills (Centered) */}
        <div className="blogs-categories-bar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                type="button"
                className={`blogs-category-pill ${isActive ? 'active' : ''}`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Editorial Stories Grid (Flush Top & Bottom Alignment on Desktop, 2-in-a-row on Mobile) */}
        <div className="blogs-stories-grid">
          {/* Main Featured Lead Card */}
          <Link
            href={`/about/blog/${leadBlog.slug}`}
            className="blog-lead-card"
          >
            <div className="blog-lead-media">
              <img
                src={leadBlog.image}
                alt={leadBlog.title}
                className="blog-lead-img"
                loading="lazy"
              />
              <div className="blog-lead-badges">
                <span className="blog-badge-category">{leadBlog.category}</span>
                <span className="blog-badge-featured">Featured Article</span>
              </div>
            </div>

            <div className="blog-lead-content">
              <div className="blog-lead-meta">
                <span>{leadBlog.date}</span>
                <span>&bull;</span>
                <span>{leadBlog.readTime}</span>
              </div>

              <h3 className="blog-lead-heading">
                {leadBlog.title}
              </h3>

              <p className="blog-lead-summary">
                {leadBlog.summary}
              </p>

              <div className="blog-lead-link">
                <span className="blog-link-desktop">Read Full Article</span>
                <span className="blog-link-mobile">Read Article</span>
                <span className="blog-link-arrow">&rarr;</span>
              </div>
            </div>
          </Link>

          {/* Secondary Column: 3 Stacked Cards (Evenly Distributed) */}
          <div className="blog-secondary-column">
            {sideBlogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/about/blog/${blog.slug}`}
                className="blog-secondary-card"
              >
                <div className="blog-secondary-media">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="blog-secondary-img"
                    loading="lazy"
                  />
                </div>

                <div className="blog-secondary-content">
                  <div className="blog-secondary-meta">
                    <span className="blog-sec-category">{blog.category}</span>
                    <span className="blog-sec-dot">&bull;</span>
                    <span className="blog-sec-date">{blog.date}</span>
                  </div>

                  <h4 className="blog-secondary-heading">
                    {blog.title}
                  </h4>

                  <p className="blog-secondary-summary">
                    {blog.summary}
                  </p>

                  <div className="blog-secondary-link">
                    <span>Read Article</span>
                    <span className="blog-link-arrow">&rarr;</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Centered Explore All Link */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'clamp(2.5rem, 4.5vw, 3.75rem)' }}>
          <Link
            href="/about/blog"
            className="blogs-explore-cta"
          >
            <span>Explore All Articles</span>
            <span className="blogs-cta-arrow">&rarr;</span>
          </Link>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .home-blogs-section {
          background-color: #ffffff;
          width: 100%;
          box-sizing: border-box;
          color: #000000;
          font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          padding: clamp(4.5rem, 7vw, 7.5rem) clamp(1.5rem, 5vw, 5rem);
          display: flex;
          justifyContent: center;
          position: relative;
        }

        .home-blogs-container {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
        }

        .blogs-explore-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 13px 28px;
          border-radius: 100px;
          background-color: #000000;
          color: #ffffff;
          font-size: 0.9rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          white-space: nowrap;
        }

        .blogs-explore-cta:hover {
          background-color: #222222;
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(0, 0, 0, 0.12);
        }

        .blogs-explore-cta:hover .blogs-cta-arrow {
          transform: translateX(4px);
        }

        .blogs-cta-arrow {
          font-size: 1.1rem;
          transition: transform 0.2s ease;
        }

        /* Categories Filter Bar */
        .blogs-categories-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 2.5rem;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding-bottom: 4px;
        }

        .blogs-categories-bar::-webkit-scrollbar {
          display: none;
        }

        .blogs-category-pill {
          padding: 8px 20px;
          border-radius: 100px;
          font-size: 0.85rem;
          font-weight: 500;
          border: 1px solid #e5e5e5;
          background-color: #ffffff;
          color: #555555;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .blogs-category-pill.active {
          font-weight: 600;
          border-color: #000000;
          background-color: #000000;
          color: #ffffff;
        }

        /* Stories Grid: Flush Top and Bottom Alignment */
        .blogs-stories-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.22fr) minmax(0, 1fr);
          gap: 1.75rem;
          align-items: stretch;
          margin-bottom: 0;
        }

        /* Lead Card */
        .blog-lead-card {
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          background-color: #fafafa;
          border-radius: 24px;
          border: 1px solid #eeeeee;
          overflow: hidden;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          height: 100%;
        }

        .blog-lead-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.08);
          border-color: #d6d6d6;
        }

        .blog-lead-media {
          position: relative;
          width: 100%;
          height: clamp(220px, 24vw, 320px);
          overflow: hidden;
          background-color: #f0f0f0;
        }

        .blog-lead-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .blog-lead-card:hover .blog-lead-img {
          transform: scale(1.03);
        }

        .blog-lead-badges {
          position: absolute;
          top: 1.25rem;
          left: 1.25rem;
          display: flex;
          gap: 8px;
        }

        .blog-badge-category {
          background-color: rgba(0, 0, 0, 0.78);
          backdrop-filter: blur(8px);
          color: #ffffff;
          padding: 5px 12px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .blog-badge-featured {
          background-color: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(8px);
          color: #000000;
          padding: 5px 12px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .blog-lead-content {
          padding: clamp(1.5rem, 2.5vw, 2rem);
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .blog-lead-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.82rem;
          color: #777777;
          margin-bottom: 0.75rem;
        }

        .blog-lead-heading {
          font-size: clamp(1.3rem, 2vw, 1.75rem);
          font-weight: 500;
          letter-spacing: -0.02em;
          line-height: 1.28;
          margin: 0 0 0.75rem 0;
          color: #000000;
        }

        .blog-lead-summary {
          font-size: 0.92rem;
          line-height: 1.55;
          color: #555555;
          margin: 0 0 1.25rem 0;
          font-weight: 400;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .blog-lead-link {
          margin-top: auto;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.88rem;
          font-weight: 600;
          color: #000000;
        }

        .blog-lead-card:hover .blog-link-arrow {
          transform: translateX(5px);
        }

        .blog-link-arrow {
          transition: transform 0.2s ease;
        }

        /* Secondary Column: Flex-1 Distribution for Exact Height Alignment */
        .blog-secondary-column {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          height: 100%;
        }

        .blog-secondary-card {
          text-decoration: none;
          color: inherit;
          display: flex;
          flex: 1;
          gap: 1.25rem;
          align-items: center;
          background-color: #ffffff;
          border-radius: 20px;
          border: 1px solid #eeeeee;
          padding: 1.25rem;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-sizing: border-box;
        }

        .blog-secondary-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.06);
          border-color: #d6d6d6;
        }

        .blog-secondary-media {
          position: relative;
          width: 125px;
          min-width: 125px;
          height: 100%;
          min-height: 85px;
          border-radius: 14px;
          overflow: hidden;
          background-color: #f0f0f0;
        }

        .blog-secondary-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }

        .blog-secondary-card:hover .blog-secondary-img {
          transform: scale(1.04);
        }

        .blog-secondary-content {
          display: flex;
          flex-direction: column;
          justifyContent: center;
          flex: 1;
          min-width: 0;
        }

        .blog-secondary-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          margin-bottom: 6px;
        }

        .blog-sec-category {
          color: #000000;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .blog-sec-dot {
          color: #cccccc;
        }

        .blog-sec-date {
          color: #777777;
        }

        .blog-secondary-heading {
          font-size: clamp(0.98rem, 1.15vw, 1.12rem);
          font-weight: 500;
          letter-spacing: -0.015em;
          line-height: 1.35;
          margin: 0 0 6px 0;
          color: #000000;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .blog-secondary-summary {
          font-size: 0.84rem;
          line-height: 1.5;
          color: #666666;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .blog-secondary-link {
          display: none;
        }

        .blog-link-mobile {
          display: none;
        }

        /* Mobile & Tablet Breakpoints: 2 In A Row Cards on Mobile */
        @media (max-width: 768px) {
          .home-blogs-section {
            padding: 3rem 1rem !important;
          }

          .blogs-categories-bar {
            justify-content: flex-start;
          }

          .blogs-explore-cta {
            width: 100%;
            justify-content: center;
          }

          /* 2 In A Row Cards Grid */
          .blogs-stories-grid {
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 0.75rem !important;
            align-items: stretch !important;
          }

          .blog-secondary-column {
            display: contents !important;
          }

          /* Unified 2-in-a-row card appearance */
          .blog-lead-card,
          .blog-secondary-card {
            display: flex !important;
            flex-direction: column !important;
            border-radius: 16px !important;
            overflow: hidden !important;
            padding: 0 !important;
            background-color: #fafafa !important;
            border: 1px solid #ebebeb !important;
            height: 100% !important;
            box-sizing: border-box !important;
          }

          .blog-lead-media,
          .blog-secondary-media {
            width: 100% !important;
            min-width: 100% !important;
            height: clamp(105px, 28vw, 140px) !important;
            border-radius: 16px 16px 0 0 !important;
            overflow: hidden !important;
            position: relative !important;
          }

          .blog-lead-img,
          .blog-secondary-img {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
          }

          /* Badges */
          .blog-badge-featured {
            display: none !important;
          }

          .blog-badge-category {
            font-size: 0.62rem !important;
            padding: 3px 7px !important;
          }

          .blog-lead-badges {
            top: 0.45rem !important;
            left: 0.45rem !important;
          }

          /* Content text block inside card */
          .blog-lead-content,
          .blog-secondary-content {
            padding: 0.75rem 0.65rem 0.85rem !important;
            display: flex !important;
            flex-direction: column !important;
            flex: 1 !important;
            box-sizing: border-box !important;
          }

          .blog-lead-meta,
          .blog-secondary-meta {
            font-size: 0.68rem !important;
            gap: 5px !important;
            margin-bottom: 4px !important;
          }

          /* Headlines get full space without clutter: up to 3 lines */
          .blog-lead-heading,
          .blog-secondary-heading {
            font-size: clamp(0.82rem, 2.9vw, 0.95rem) !important;
            font-weight: 600 !important;
            line-height: 1.34 !important;
            margin: 0 0 8px 0 !important;
            display: -webkit-box !important;
            -webkit-line-clamp: 3 !important;
            -webkit-box-orient: vertical !important;
            overflow: hidden !important;
            min-height: 4em !important;
          }

          /* HIDE SUMMARIES ON MOBILE: Only headlines are displayed */
          .blog-lead-summary,
          .blog-secondary-summary {
            display: none !important;
          }

          .blog-link-desktop {
            display: none !important;
          }

          .blog-link-mobile {
            display: inline !important;
          }

          .blog-lead-link,
          .blog-secondary-link {
            font-size: 0.72rem !important;
            font-weight: 600 !important;
            margin-top: auto !important;
            display: inline-flex !important;
            align-items: center !important;
            gap: 4px !important;
            color: #000000 !important;
          }
        }
      `}} />
    </section>
  );
}

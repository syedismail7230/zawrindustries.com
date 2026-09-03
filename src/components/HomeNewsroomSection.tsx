'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface NewsItem {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  banner: string;
  readTime: string;
}

const FEATURED_NEWS: NewsItem[] = [
  {
    id: 'PR-018',
    slug: 'zawr-industries-announces-it-expansion-southeast-asia',
    title: 'Zawr Industries Announces Regional Technology Expansion Across Southeast Asia',
    date: '27 May 2026',
    category: 'Corporate',
    summary: 'Unveiling plans for regional technology hubs in Singapore and Jakarta to scale enterprise cloud infrastructure, bespoke AI systems, and cross-border logistics pipelines.',
    banner: '/assets/public-relations-hero.png',
    readTime: '3 min read',
  },
  {
    id: 'PR-017',
    slug: 'sketch-studio-launch-next-gen-ui-editor',
    title: 'Zawr Industries Rolls Out Sketch Studio — Next-Gen Collaborative Visual Engine',
    date: '27 May 2026',
    category: 'Product',
    summary: 'Bridging the gap between visual composition and frontend development with real-time multiplayer editing and AI-assisted layout generation.',
    banner: '/assets/life-at-zawr.png',
    readTime: '4 min read',
  },
  {
    id: 'PR-016',
    slug: 'zawr-industries-achieves-carbon-neutrality-milestones-2025',
    title: 'Zawr Industries Achieves 35% Emissions Reduction in Annual Sustainability Audit',
    date: '20 May 2026',
    category: 'Sustainability',
    summary: 'Record progress in green transition through fleet electrification, localized rooftop solar generation, and algorithmic freight optimization.',
    banner: '/assets/this-is-zawr.png',
    readTime: '3 min read',
  },
  {
    id: 'PR-015',
    slug: 'zawr-logistics-launches-automated-supply-chain-mumbai',
    title: 'Zawr Logistics Launches 250,000 Sq.Ft Automated Supply Chain Hub in Mumbai',
    date: '14 May 2026',
    category: 'Logistics',
    summary: 'Inauguration of a high-density automated distribution center equipped with autonomous robotic sorting and drone-assisted freight scanning.',
    banner: '/assets/careers-1.png',
    readTime: '4 min read',
  },
];

const QUICK_PORTALS = [
  {
    title: 'Press Releases',
    desc: 'Official statements, executive dispatches, and corporate milestone announcements.',
    href: '/newsroom/press-release',
    badge: '18 Releases',
  },
  {
    title: 'Notifications & Circulars',
    desc: 'Statutory disclosures, public notices, and regulatory documentation.',
    href: '/newsroom/notifications',
    badge: 'Active Notices',
  },
  {
    title: 'Global Events & Summits',
    desc: 'Industry keynotes, technology delegations, and executive summit appearances.',
    href: '/newsroom/events',
    badge: '2026 Calendar',
  },
  {
    title: 'Media Kit & Brand Assets',
    desc: 'High-resolution logo vectors, brand guidelines, and official executive portraits.',
    href: '/newsroom/media-kit',
    badge: 'Press Downloads',
  },
];

export default function HomeNewsroomSection() {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Corporate', 'Product', 'Sustainability', 'Logistics'];

  const filteredNews = activeCategory === 'All'
    ? FEATURED_NEWS
    : FEATURED_NEWS.filter((n) => n.category.toLowerCase() === activeCategory.toLowerCase());

  const leadStory = filteredNews[0] || FEATURED_NEWS[0];
  const sideStories = filteredNews.slice(1);

  return (
    <section
      id="newsroom"
      aria-label="Newsroom and Corporate Dispatches"
      className="home-newsroom-section"
      style={{
        backgroundColor: '#ffffff',
        width: '100%',
        boxSizing: 'border-box',
        color: '#000000',
        fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div className="home-newsroom-container">
        {/* Top Header Block */}
        <div className="newsroom-header-row">
          <div className="newsroom-header-copy">
            <span className="newsroom-eyebrow">
              Newsroom &amp; Dispatches
            </span>
            <h2 className="newsroom-main-title">
              Inside Zawr Industries
            </h2>
            <p className="newsroom-main-subtext">
              Official press releases, strategic technology announcements, sustainability updates, and global industrial dispatches.
            </p>
          </div>

          <div className="newsroom-header-actions">
            <Link
              href="/newsroom/press-release"
              className="newsroom-header-cta"
            >
              <span>Explore All Press Releases</span>
              <span className="cta-arrow">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Category Filter Pills (Scrollable on mobile) */}
        <div className="newsroom-categories-bar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                type="button"
                className={`newsroom-category-pill ${isActive ? 'active' : ''}`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Editorial Stories Grid */}
        <div className="newsroom-stories-grid">
          {/* Main Featured Lead Story Card */}
          <Link
            href={`/newsroom/press-release/${leadStory.slug}`}
            className="news-lead-card"
          >
            <div className="news-lead-media">
              <img
                src={leadStory.banner}
                alt={leadStory.title}
                className="news-lead-img"
                loading="lazy"
              />
              <div className="news-lead-badges">
                <span className="badge-category">{leadStory.category}</span>
                <span className="badge-featured">Featured Story</span>
              </div>
            </div>

            <div className="news-lead-content">
              <div className="news-lead-meta">
                <span>{leadStory.date}</span>
                <span>&bull;</span>
                <span>{leadStory.readTime}</span>
              </div>

              <h3 className="news-lead-heading">
                {leadStory.title}
              </h3>

              <p className="news-lead-summary">
                {leadStory.summary}
              </p>

              <div className="news-lead-link">
                <span>Read Full Press Release</span>
                <span className="link-arrow">&rarr;</span>
              </div>
            </div>
          </Link>

          {/* Secondary Stacked Stories Column */}
          <div className="news-secondary-column">
            {sideStories.map((story) => (
              <Link
                key={story.id}
                href={`/newsroom/press-release/${story.slug}`}
                className="news-secondary-card"
              >
                <div className="news-secondary-media">
                  <img
                    src={story.banner}
                    alt={story.title}
                    className="news-secondary-img"
                    loading="lazy"
                  />
                </div>

                <div className="news-secondary-content">
                  <div className="news-secondary-meta">
                    <span className="sec-category">{story.category}</span>
                    <span className="sec-dot">&bull;</span>
                    <span className="sec-date">{story.date}</span>
                  </div>

                  <h4 className="news-secondary-heading">
                    {story.title}
                  </h4>

                  <p className="news-secondary-summary">
                    {story.summary}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Four Quick Navigation Portals Strip */}
        <div className="newsroom-portals-wrapper">
          <div className="newsroom-portals-label">
            Newsroom Navigation &amp; Resources
          </div>

          <div className="newsroom-portals-grid">
            {QUICK_PORTALS.map((portal) => (
              <Link
                key={portal.title}
                href={portal.href}
                className="newsroom-portal-card"
              >
                <div className="portal-card-top">
                  <span className="portal-badge">{portal.badge}</span>
                  <span className="portal-arrow">&rarr;</span>
                </div>

                <h4 className="portal-title">{portal.title}</h4>
                <p className="portal-desc">{portal.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Media Inquiries & Press Office Contact Bar */}
        <div className="newsroom-media-bar">
          <div className="media-bar-copy">
            <span className="media-bar-eyebrow">
              Accredited Press &amp; Media Inquiries
            </span>
            <h3 className="media-bar-title">
              Connect with the Global Communications Office
            </h3>
            <p className="media-bar-desc">
              Direct pipeline for journalist inquiries, broadcast interview requests, and institutional media assets.
            </p>
          </div>

          <div className="media-bar-actions">
            <Link href="/newsroom/media-kit" className="press-btn-white">
              <span>Download Media Kit</span>
            </Link>
            <Link href="/contact/public-relations" className="press-btn-outline">
              <span>Contact PR Team &rarr;</span>
            </Link>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        /* Root container with generous, responsive side breathing room */
        .home-newsroom-section {
          padding: clamp(4.5rem, 7vw, 7.5rem) clamp(1.5rem, 5vw, 5rem);
          display: flex;
          justifyContent: center;
          position: relative;
        }

        .home-newsroom-container {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Top Header Row */
        .newsroom-header-row {
          display: flex;
          flex-direction: row;
          justifyContent: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 1.5rem;
          margin-bottom: 2.75rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #eeeeee;
        }

        .newsroom-header-copy {
          max-width: 800px;
        }

        .newsroom-eyebrow {
          display: inline-block;
          font-size: 0.76rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #777777;
          margin-bottom: 0.85rem;
        }

        .newsroom-main-title {
          font-size: clamp(2.2rem, 4.5vw, 3.6rem);
          font-weight: 300;
          letter-spacing: -0.025em;
          line-height: 1.15;
          color: #000000;
          margin: 0 0 1rem 0;
        }

        .newsroom-main-subtext {
          font-size: clamp(1rem, 1.35vw, 1.12rem);
          line-height: 1.6;
          color: #666666;
          margin: 0;
          font-weight: 400;
        }

        .newsroom-header-actions {
          display: flex;
          align-items: center;
        }

        .newsroom-header-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 13px 26px;
          border-radius: 100px;
          background-color: #000000;
          color: #ffffff;
          font-size: 0.9rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          white-space: nowrap;
        }

        .newsroom-header-cta:hover {
          background-color: #222222;
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(0, 0, 0, 0.12);
        }

        .newsroom-header-cta:hover .cta-arrow {
          transform: translateX(4px);
        }

        .cta-arrow {
          font-size: 1.1rem;
          transition: transform 0.2s ease;
        }

        /* Categories Filter Bar (Touch-friendly & horizontal scroll on small screens) */
        .newsroom-categories-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 2.5rem;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding-bottom: 4px;
        }

        .newsroom-categories-bar::-webkit-scrollbar {
          display: none;
        }

        .newsroom-category-pill {
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

        .newsroom-category-pill.active {
          font-weight: 600;
          border-color: #000000;
          background-color: #000000;
          color: #ffffff;
        }

        /* Stories Grid */
        .newsroom-stories-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
          gap: 2rem;
          margin-bottom: 4rem;
        }

        /* Lead Card */
        .news-lead-card {
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          background-color: #fafafa;
          border-radius: 24px;
          border: 1px solid #eeeeee;
          overflow: hidden;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .news-lead-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.08);
          border-color: #d6d6d6;
        }

        .news-lead-media {
          position: relative;
          width: 100%;
          height: clamp(240px, 30vw, 380px);
          overflow: hidden;
          background-color: #f0f0f0;
        }

        .news-lead-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .news-lead-card:hover .news-lead-img {
          transform: scale(1.03);
        }

        .news-lead-badges {
          position: absolute;
          top: 1.25rem;
          left: 1.25rem;
          display: flex;
          gap: 8px;
        }

        .badge-category {
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

        .badge-featured {
          background-color: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(8px);
          color: #000000;
          padding: 5px 12px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .news-lead-content {
          padding: clamp(1.5rem, 3vw, 2.25rem);
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .news-lead-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.82rem;
          color: #777777;
          margin-bottom: 0.75rem;
        }

        .news-lead-heading {
          font-size: clamp(1.35rem, 2.2vw, 1.85rem);
          font-weight: 500;
          letter-spacing: -0.02em;
          line-height: 1.28;
          margin: 0 0 0.85rem 0;
          color: #000000;
        }

        .news-lead-summary {
          font-size: 0.95rem;
          line-height: 1.6;
          color: #555555;
          margin: 0 0 1.5rem 0;
          font-weight: 400;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .news-lead-link {
          margin-top: auto;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          color: #000000;
        }

        .news-lead-card:hover .link-arrow {
          transform: translateX(5px);
        }

        .link-arrow {
          transition: transform 0.2s ease;
        }

        /* Secondary Stories Column */
        .news-secondary-column {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .news-secondary-card {
          text-decoration: none;
          color: inherit;
          display: flex;
          gap: 1.25rem;
          align-items: stretch;
          background-color: #ffffff;
          border-radius: 20px;
          border: 1px solid #eeeeee;
          padding: 1.25rem;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .news-secondary-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.06);
          border-color: #d6d6d6;
        }

        .news-secondary-media {
          position: relative;
          width: 125px;
          min-width: 125px;
          border-radius: 14px;
          overflow: hidden;
          background-color: #f0f0f0;
        }

        .news-secondary-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }

        .news-secondary-card:hover .news-secondary-img {
          transform: scale(1.04);
        }

        .news-secondary-content {
          display: flex;
          flex-direction: column;
          justifyContent: center;
          flex: 1;
          min-width: 0;
        }

        .news-secondary-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          margin-bottom: 6px;
        }

        .sec-category {
          color: #000000;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .sec-dot {
          color: #cccccc;
        }

        .sec-date {
          color: #777777;
        }

        .news-secondary-heading {
          font-size: clamp(1rem, 1.2vw, 1.15rem);
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

        .news-secondary-summary {
          font-size: 0.85rem;
          line-height: 1.5;
          color: #666666;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* 4 Portals Strip */
        .newsroom-portals-wrapper {
          margin-bottom: 3.5rem;
        }

        .newsroom-portals-label {
          font-size: 0.78rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #888888;
          margin-bottom: 1rem;
        }

        .newsroom-portals-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1.25rem;
        }

        .newsroom-portal-card {
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
          border-radius: 20px;
          background-color: #fafafa;
          border: 1px solid #eeeeee;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .newsroom-portal-card:hover {
          transform: translateY(-3px);
          background-color: #f5f5f5;
          border-color: #000000;
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06);
        }

        .portal-card-top {
          display: flex;
          justifyContent: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .portal-badge {
          font-size: 0.72rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 100px;
          background-color: #ffffff;
          border: 1px solid #e5e5e5;
          color: #444444;
        }

        .portal-arrow {
          font-size: 1.1rem;
          color: #000000;
          transition: transform 0.2s ease;
        }

        .newsroom-portal-card:hover .portal-arrow {
          transform: translate(3px, -3px);
        }

        .portal-title {
          font-size: 1.08rem;
          font-weight: 600;
          margin: 0 0 0.5rem 0;
          color: #000000;
          letter-spacing: -0.01em;
        }

        .portal-desc {
          font-size: 0.86rem;
          line-height: 1.55;
          color: #666666;
          margin: 0;
        }

        /* Media Inquiries Black Banner */
        .newsroom-media-bar {
          border-radius: 24px;
          background-color: #000000;
          color: #ffffff;
          padding: clamp(2rem, 3.5vw, 3rem);
          display: flex;
          flex-direction: row;
          justifyContent: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1.75rem;
          box-sizing: border-box;
        }

        .media-bar-copy {
          max-width: 720px;
        }

        .media-bar-eyebrow {
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #aaaaaa;
          display: block;
          margin-bottom: 0.5rem;
        }

        .media-bar-title {
          font-size: clamp(1.4rem, 2.4vw, 1.9rem);
          font-weight: 400;
          letter-spacing: -0.02em;
          line-height: 1.25;
          margin: 0 0 0.5rem 0;
          color: #ffffff;
        }

        .media-bar-desc {
          font-size: 0.95rem;
          color: #888888;
          line-height: 1.55;
          margin: 0;
        }

        .media-bar-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .press-btn-white {
          display: inline-flex;
          align-items: center;
          padding: 12px 22px;
          border-radius: 100px;
          background-color: #ffffff;
          color: #000000;
          font-size: 0.88rem;
          font-weight: 600;
          text-decoration: none;
          transition: opacity 0.2s ease;
          white-space: nowrap;
        }

        .press-btn-white:hover {
          opacity: 0.9;
        }

        .press-btn-outline {
          display: inline-flex;
          align-items: center;
          padding: 12px 22px;
          border-radius: 100px;
          background-color: rgba(255, 255, 255, 0.12);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.25);
          font-size: 0.88rem;
          font-weight: 500;
          text-decoration: none;
          transition: background-color 0.2s ease;
          white-space: nowrap;
        }

        .press-btn-outline:hover {
          background-color: rgba(255, 255, 255, 0.22);
        }

        /* Mobile & Responsive Breakpoints */
        @media (max-width: 1024px) {
          .newsroom-stories-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          .newsroom-portals-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 768px) {
          .home-newsroom-section {
            padding: 3.5rem 1.25rem !important;
          }
          .newsroom-header-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.25rem;
            margin-bottom: 2rem;
            padding-bottom: 1.5rem;
          }
          .newsroom-header-cta {
            width: 100%;
            justify-content: center;
          }
          .newsroom-header-actions {
            width: 100%;
          }
          .media-bar-actions {
            width: 100%;
            flex-direction: column;
            align-items: stretch;
          }
          .press-btn-white, .press-btn-outline {
            width: 100%;
            justify-content: center;
            box-sizing: border-box;
          }
        }

        @media (max-width: 640px) {
          .home-newsroom-section {
            padding: 3rem 1rem !important;
          }
          .newsroom-portals-grid {
            grid-template-columns: 1fr;
          }
          .news-secondary-card {
            flex-direction: column;
            padding: 1rem;
          }
          .news-secondary-media {
            width: 100%;
            min-width: 100%;
            height: 190px;
          }
        }
      `}} />
    </section>
  );
}

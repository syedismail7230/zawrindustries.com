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
      style={{
        backgroundColor: '#ffffff',
        width: '100%',
        padding: 'clamp(5rem, 8vw, 8.5rem) 2%',
        display: 'flex',
        justifyContent: 'center',
        position: 'relative',
        color: '#000000',
        fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div style={{ width: '100%', maxWidth: '1680px', margin: '0 auto' }}>
        {/* Top Header Block */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginBottom: '3rem',
            paddingBottom: '2rem',
            borderBottom: '1px solid #ebebeb',
          }}
        >
          <div style={{ maxWidth: '820px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '100px',
                backgroundColor: '#f5f5f5',
                border: '1px solid #e5e5e5',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#555555',
                marginBottom: '1rem',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#16a34a',
                  display: 'inline-block',
                }}
              />
              Newsroom &amp; Dispatches
            </div>
            <h2
              style={{
                fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
                fontWeight: 300,
                letterSpacing: '-0.025em',
                lineHeight: 1.12,
                color: '#000000',
                margin: '0 0 1rem 0',
              }}
            >
              Inside Zawr Industries
            </h2>
            <p
              style={{
                fontSize: 'clamp(1rem, 1.4vw, 1.15rem)',
                lineHeight: 1.6,
                color: '#666666',
                margin: 0,
                fontWeight: 400,
              }}
            >
              Official press releases, strategic technology announcements, sustainability updates, and global industrial dispatches.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              href="/newsroom/press-release"
              className="newsroom-header-cta"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 24px',
                borderRadius: '100px',
                backgroundColor: '#000000',
                color: '#ffffff',
                fontSize: '0.9rem',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <span>Explore All Press Releases</span>
              <span style={{ fontSize: '1.1rem', transition: 'transform 0.2s ease' }} className="cta-arrow">
                &rarr;
              </span>
            </Link>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            marginBottom: '2.5rem',
          }}
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                type="button"
                style={{
                  padding: '8px 18px',
                  borderRadius: '100px',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 600 : 500,
                  border: isActive ? '1px solid #000000' : '1px solid #e5e5e5',
                  backgroundColor: isActive ? '#000000' : '#ffffff',
                  color: isActive ? '#ffffff' : '#555555',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Editorial Stories Grid */}
        <div
          className="newsroom-stories-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 1fr)',
            gap: '2rem',
            marginBottom: '4rem',
          }}
        >
          {/* Main Featured Lead Story Card */}
          <Link
            href={`/newsroom/press-release/${leadStory.slug}`}
            className="news-lead-card"
            style={{
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#fafafa',
              borderRadius: '28px',
              border: '1px solid #ebebeb',
              overflow: 'hidden',
              transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: 'clamp(280px, 38vw, 440px)',
                overflow: 'hidden',
                backgroundColor: '#eeeeee',
              }}
            >
              <img
                src={leadStory.banner}
                alt={leadStory.title}
                className="news-lead-img"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                loading="lazy"
              />
              <div
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  left: '1.25rem',
                  display: 'flex',
                  gap: '8px',
                }}
              >
                <span
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(8px)',
                    color: '#ffffff',
                    padding: '5px 12px',
                    borderRadius: '100px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  {leadStory.category}
                </span>
                <span
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(8px)',
                    color: '#000000',
                    padding: '5px 12px',
                    borderRadius: '100px',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                  }}
                >
                  Featured Story
                </span>
              </div>
            </div>

            <div style={{ padding: 'clamp(1.5rem, 3vw, 2.5rem)', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '0.82rem',
                  color: '#777777',
                  marginBottom: '0.75rem',
                }}
              >
                <span>{leadStory.date}</span>
                <span>&bull;</span>
                <span>{leadStory.readTime}</span>
              </div>

              <h3
                className="lead-title"
                style={{
                  fontSize: 'clamp(1.4rem, 2.4vw, 2rem)',
                  fontWeight: 500,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.25,
                  margin: '0 0 1rem 0',
                  color: '#000000',
                  transition: 'color 0.2s ease',
                }}
              >
                {leadStory.title}
              </h3>

              <p
                style={{
                  fontSize: '0.98rem',
                  lineHeight: 1.6,
                  color: '#555555',
                  margin: '0 0 1.75rem 0',
                  fontWeight: 400,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {leadStory.summary}
              </p>

              <div
                style={{
                  marginTop: 'auto',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#000000',
                }}
              >
                <span>Read Full Press Release</span>
                <span style={{ transition: 'transform 0.2s ease' }} className="link-arrow">
                  &rarr;
                </span>
              </div>
            </div>
          </Link>

          {/* Secondary Stacked Stories Column */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
          >
            {sideStories.map((story) => (
              <Link
                key={story.id}
                href={`/newsroom/press-release/${story.slug}`}
                className="news-secondary-card"
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  gap: '1.25rem',
                  alignItems: 'stretch',
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  border: '1px solid #ebebeb',
                  padding: '1.25rem',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '130px',
                    minWidth: '130px',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    backgroundColor: '#f0f0f0',
                  }}
                >
                  <img
                    src={story.banner}
                    alt={story.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.5s ease',
                    }}
                    className="side-img"
                    loading="lazy"
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.75rem',
                      marginBottom: '6px',
                    }}
                  >
                    <span
                      style={{
                        color: '#000000',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {story.category}
                    </span>
                    <span style={{ color: '#cccccc' }}>&bull;</span>
                    <span style={{ color: '#777777' }}>{story.date}</span>
                  </div>

                  <h4
                    className="side-title"
                    style={{
                      fontSize: 'clamp(1rem, 1.25vw, 1.15rem)',
                      fontWeight: 500,
                      letterSpacing: '-0.015em',
                      lineHeight: 1.35,
                      margin: '0 0 6px 0',
                      color: '#000000',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      transition: 'color 0.2s ease',
                    }}
                  >
                    {story.title}
                  </h4>

                  <p
                    style={{
                      fontSize: '0.85rem',
                      lineHeight: 1.5,
                      color: '#666666',
                      margin: 0,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {story.summary}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Four Quick Navigation Portals Strip */}
        <div
          style={{
            marginBottom: '3rem',
          }}
        >
          <div
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#888888',
              marginBottom: '1rem',
            }}
          >
            Newsroom Navigation &amp; Resources
          </div>

          <div
            className="newsroom-portals-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gap: '1.25rem',
            }}
          >
            {QUICK_PORTALS.map((portal, index) => (
              <Link
                key={portal.title}
                href={portal.href}
                className="newsroom-portal-card"
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '1.5rem',
                  borderRadius: '20px',
                  backgroundColor: '#fafafa',
                  border: '1px solid #ebebeb',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: '100px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e5e5',
                      color: '#444444',
                    }}
                  >
                    {portal.badge}
                  </span>
                  <span
                    className="portal-arrow"
                    style={{
                      fontSize: '1.1rem',
                      color: '#000000',
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    &rarr;
                  </span>
                </div>

                <h4
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    margin: '0 0 0.5rem 0',
                    color: '#000000',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {portal.title}
                </h4>

                <p
                  style={{
                    fontSize: '0.86rem',
                    lineHeight: 1.55,
                    color: '#666666',
                    margin: 0,
                  }}
                >
                  {portal.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Media Inquiries & Press Office Contact Bar */}
        <div
          style={{
            borderRadius: '24px',
            backgroundColor: '#000000',
            color: '#ffffff',
            padding: 'clamp(2rem, 3.5vw, 3rem)',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.75rem',
          }}
        >
          <div style={{ maxWidth: '720px' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#aaaaaa',
                display: 'block',
                marginBottom: '0.5rem',
              }}
            >
              Accredited Press &amp; Media Inquiries
            </span>
            <h3
              style={{
                fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)',
                fontWeight: 400,
                letterSpacing: '-0.02em',
                lineHeight: 1.25,
                margin: '0 0 0.5rem 0',
                color: '#ffffff',
              }}
            >
              Connect with the Global Communications Office
            </h3>
            <p
              style={{
                fontSize: '0.95rem',
                color: '#888888',
                lineHeight: 1.55,
                margin: 0,
              }}
            >
              Direct pipeline for journalist inquiries, broadcast interview requests, and institutional media assets.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              href="/newsroom/media-kit"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 22px',
                borderRadius: '100px',
                backgroundColor: '#ffffff',
                color: '#000000',
                fontSize: '0.88rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'opacity 0.2s ease',
              }}
              className="press-btn-white"
            >
              <span>Download Media Kit</span>
            </Link>
            <Link
              href="/contact/public-relations"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 22px',
                borderRadius: '100px',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                fontSize: '0.88rem',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'background-color 0.2s ease',
              }}
              className="press-btn-outline"
            >
              <span>Contact PR Team &rarr;</span>
            </Link>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .newsroom-header-cta:hover {
          background-color: #222222 !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
        }
        .newsroom-header-cta:hover .cta-arrow {
          transform: translateX(4px);
        }

        .news-lead-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.08);
          border-color: #d0d0d0 !important;
        }
        .news-lead-card:hover .news-lead-img {
          transform: scale(1.03);
        }
        .news-lead-card:hover .lead-title {
          color: #000000;
        }
        .news-lead-card:hover .link-arrow {
          transform: translateX(5px);
        }

        .news-secondary-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.06);
          border-color: #d0d0d0 !important;
        }
        .news-secondary-card:hover .side-img {
          transform: scale(1.04);
        }
        .news-secondary-card:hover .side-title {
          color: #000000;
        }

        .newsroom-portal-card:hover {
          transform: translateY(-3px);
          background-color: #f4f4f4 !important;
          border-color: #000000 !important;
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06);
        }
        .newsroom-portal-card:hover .portal-arrow {
          transform: translate(3px, -3px);
        }

        .press-btn-white:hover {
          opacity: 0.9;
        }
        .press-btn-outline:hover {
          background-color: rgba(255, 255, 255, 0.2) !important;
        }

        @media (max-width: 1024px) {
          .newsroom-stories-grid {
            grid-template-columns: 1fr !important;
          }
          .newsroom-portals-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 640px) {
          .newsroom-portals-grid {
            grid-template-columns: 1fr !important;
          }
          .news-secondary-card {
            flex-direction: column !important;
          }
          .news-secondary-card > div:first-child {
            width: 100% !important;
            height: 180px !important;
          }
        }
      `}} />
    </section>
  );
}

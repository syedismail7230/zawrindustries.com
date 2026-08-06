'use client';

import React from 'react';

const featuredBlogs = [
  {
    title: 'Architecting Scalable Microservices for High-Frequency Enterprise SaaS',
    category: 'SOFTWARE ENGINEERING',
    date: '2026',
    desc: 'Deep dive into decoupled cloud architectures, container orchestration, and Zero-Trust protocols.',
  },
  {
    title: 'The Future of Autonomous Warehousing: AGVs & Computer Vision',
    category: 'INDUSTRIAL AUTONOMY',
    date: '2026',
    desc: 'How automated guided vehicles and real-time IoT sensors reduce factory downtime by 40%.',
  },
  {
    title: 'Biophilic Design & Sustainable Materials in Modern Estate Master-Planning',
    category: 'REAL ESTATE & PROPTECH',
    date: '2025',
    desc: 'Integrating natural topographies, carbon-neutral concrete, and smart energy grids into luxury estates.',
  },
];

export default function AboutBlog() {
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
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <div style={{ maxWidth: '750px', marginBottom: 'clamp(3rem, 5vw, 4.5rem)' }}>
          <div
            style={{
              fontSize: '0.78rem',
              textTransform: 'uppercase',
              letterSpacing: '0.22em',
              color: '#3b82f6',
              fontWeight: 600,
              marginBottom: '0.75rem',
            }}
          >
            SECTION 05
          </div>
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
            Corporate Blog & Thought Leadership
          </h2>
        </div>

        {/* Blog Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '2rem',
          }}
        >
          {featuredBlogs.map((blog, index) => (
            <div
              key={index}
              style={{
                gridColumn: 'span 4',
                padding: '2.25rem 1.75rem',
                backgroundColor: '#fafafa',
                borderRadius: '18px',
                border: '1px solid rgba(15, 23, 42, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
              className="blog-card"
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#3b82f6', letterSpacing: '0.12em' }}>
                {blog.category}
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 500, color: '#0f172a', margin: 0, lineHeight: 1.35 }}>
                {blog.title}
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, margin: 0, fontWeight: 400 }}>
                {blog.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .blog-card {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </section>
  );
}

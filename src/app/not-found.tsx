'use client';

import React from 'react';
import Link from 'next/link';

const QUICK_LINKS = [
  {
    title: 'Corporate Homepage',
    desc: 'Overview of Zawr Industries conglomerate, divisions & leadership.',
    href: '/',
    tag: 'Home',
  },
  {
    title: 'Industry Verticals',
    desc: 'IT services, automated logistics, precision robotics & energy.',
    href: '/industries/it-service',
    tag: 'Sectors',
  },
  {
    title: 'Global Newsroom',
    desc: 'Latest press announcements, quarterly statements & media kit.',
    href: '/newsroom',
    tag: 'Press',
  },
  {
    title: 'Careers & Talent',
    desc: 'Explore executive roles, open engineering positions & fellowships.',
    href: '/careers',
    tag: 'Talent',
  },
  {
    title: 'Investor Relations',
    desc: 'Shareholder notices, strategic growth & financial briefings.',
    href: '/investors',
    tag: 'Finance',
  },
  {
    title: 'Contact Executive Desk',
    desc: 'Connect with our regional offices in Bangalore, UAE, and USA.',
    href: '/contact',
    tag: 'Inquiries',
  },
];

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#000000',
        color: '#ffffff',
        fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '9.5rem 1.5rem 5rem 1.5rem',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ maxWidth: '840px', width: '100%', margin: '0 auto', textAlign: 'center' }}>
        
        {/* Big Refined 404 Display */}
        <div style={{ position: 'relative', margin: '0 auto 1.5rem auto' }}>
          <div
            style={{
              fontSize: 'clamp(5.5rem, 16vw, 10.5rem)',
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: '-0.05em',
              color: '#ffffff',
              background: 'linear-gradient(180deg, #ffffff 40%, #555555 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              userSelect: 'none',
            }}
          >
            404
          </div>
        </div>

        {/* Headline & Description */}
        <h1
          style={{
            fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
            fontWeight: 600,
            margin: '0 0 1rem 0',
            letterSpacing: '-0.02em',
            color: '#ffffff',
          }}
        >
          Page Not Located Within Zawr Ecosystem
        </h1>
        <p
          style={{
            fontSize: 'clamp(0.9rem, 1.8vw, 1.05rem)',
            color: '#999999',
            maxWidth: '580px',
            margin: '0 auto 2.5rem auto',
            lineHeight: 1.65,
          }}
        >
          The resource or URL you requested may have been archived, relocated, or is temporarily unavailable following platform updates.
        </p>

        {/* Primary Action Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '4rem',
          }}
        >
          <Link
            href="/"
            style={{
              padding: '0.85rem 1.8rem',
              backgroundColor: '#ffffff',
              color: '#000000',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: 700,
              textDecoration: 'none',
              letterSpacing: '0.01em',
              transition: 'opacity 0.2s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            Return to Homepage &rarr;
          </Link>
          <Link
            href="/contact"
            style={{
              padding: '0.85rem 1.6rem',
              backgroundColor: '#111111',
              border: '1px solid #2a2a2a',
              color: '#ffffff',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'border-color 0.2s',
            }}
          >
            Contact Support Desk
          </Link>
        </div>

        {/* Quick Directory Grid */}
        <div style={{ textAlign: 'left', marginBottom: '3rem' }}>
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#666666',
              marginBottom: '1rem',
              textAlign: 'center',
            }}
          >
            Suggested Destinations &amp; Portals
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '0.85rem',
            }}
          >
            {QUICK_LINKS.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                style={{
                  padding: '1.15rem 1.25rem',
                  backgroundColor: '#0a0a0a',
                  border: '1px solid #1c1c1c',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'border-color 0.2s, transform 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#383838';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#1c1c1c';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.4rem',
                    }}
                  >
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff' }}>
                      {link.title}
                    </span>
                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: '#777777',
                        padding: '0.15rem 0.45rem',
                        backgroundColor: '#141414',
                        borderRadius: '4px',
                        border: '1px solid #222222',
                      }}
                    >
                      {link.tag}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: '0.78rem',
                      color: '#888888',
                      margin: 0,
                      lineHeight: 1.45,
                    }}
                  >
                    {link.desc}
                  </p>
                </div>
                <div
                  style={{
                    marginTop: '0.85rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#aaaaaa',
                  }}
                >
                  Explore &rarr;
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

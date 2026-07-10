'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Script from 'next/script';

const getSafeIsoDate = (dateStr: string): string => {
  try {
    if (!dateStr) return new Date().toISOString();
    const cleanStr = dateStr.replace(/(\d+)(st|nd|rd|th)/, '$1');
    const d = new Date(cleanStr);
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  } catch (e) {
    return new Date().toISOString();
  }
};

export default function PressReleasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const [release, setRelease] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelease = async () => {
      try {
        const res = await fetch('/api/press-releases');
        if (res.ok) {
          const list = await res.json();
          const found = list.find((r: any) => r.slug === slug);
          setRelease(found || null);
        }
      } catch (e) {
        console.error('Error fetching press release:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchRelease();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', color: '#000000', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <span>Loading press release...</span>
      </div>
    );
  }

  if (!release) {
    notFound();
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', color: '#000000', paddingTop: '8rem', paddingBottom: '6rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>

        {/* Breadcrumb */}
        <div style={{ marginBottom: '2.5rem' }}>
          <Link
            href="/newsroom/press-release"
            style={{ color: '#4b5563', textDecoration: 'none', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'color 0.15s' }}
            onMouseOver={(e) => e.currentTarget.style.color = '#000000'}
            onMouseOut={(e) => e.currentTarget.style.color = '#4b5563'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"></path><path d="m12 19-7-7 7-7"></path></svg>
            Back to Press Releases
          </Link>
        </div>

        {/* Meta */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.15em', padding: '0.25rem 0.75rem',
            borderRadius: '9999px', backgroundColor: '#f3f4f6',
            color: '#4b5563', border: '1px solid #e5e7eb'
          }}>
            {release.category}
          </span>
          <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{release.date}</span>
          {release.archived && (
            <span style={{
              fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.15em', padding: '0.25rem 0.75rem',
              borderRadius: '9999px', backgroundColor: '#fff7ed',
              color: '#ea580c', border: '1px solid #ffedd5'
            }}>
              Archived
            </span>
          )}
        </div>

        {/* Title */}
        <h1 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.02em', color: '#000000', marginBottom: '2.5rem', lineHeight: 1.2 }}>
          {release.title}
        </h1>

        {/* Body text */}
        {release.body && (
          <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.85, marginBottom: '3rem', whiteSpace: 'pre-wrap' }}>
            {release.body}
          </p>
        )}

        {/* Documents Table */}
        {release.attachments && release.attachments.length > 0 && (
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '1rem', overflow: 'hidden', marginBottom: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            {/* Table Header */}
            <div style={{ backgroundColor: '#000000', padding: '0.9rem 1.75rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#ffffff' }}>Attachments</span>
            </div>
            {/* Attachment Rows */}
            {release.attachments.map((att: any, i: number) => (
              <a
                key={i}
                href={att.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '1rem 1.75rem',
                  borderBottom: i < release.attachments.length - 1 ? '1px solid #f3f4f6' : 'none',
                  textDecoration: 'none',
                  backgroundColor: '#ffffff',
                  transition: 'background-color 0.15s'
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                <span style={{ fontSize: '0.875rem', color: '#2563eb', fontWeight: 500 }}>{att.label}</span>
              </a>
            ))}
          </div>
        )}

        {/* External Links */}
        {release.links && release.links.length > 0 && (
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '1rem', overflow: 'hidden', marginBottom: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ padding: '1.25rem 1.75rem', display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', backgroundColor: '#ffffff' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', minWidth: '120px' }}>
                Related Links
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {release.links.map((lnk: any, i: number) => (
                  <a
                    key={i}
                    href={lnk.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                      padding: '0.4rem 1rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '9999px',
                      fontSize: '0.8rem',
                      color: '#000000',
                      textDecoration: 'none',
                      backgroundColor: '#f9fafb',
                      transition: 'all 0.15s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = '#000000';
                      e.currentTarget.style.backgroundColor = '#ffffff';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.backgroundColor = '#f9fafb';
                    }}
                  >
                    {lnk.label}
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb' }}>
          <Link
            href="/newsroom/press-release"
            style={{ color: '#4b5563', textDecoration: 'none', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'color 0.15s' }}
            onMouseOver={(e) => e.currentTarget.style.color = '#000000'}
            onMouseOut={(e) => e.currentTarget.style.color = '#4b5563'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"></path><path d="m12 19-7-7 7-7"></path></svg>
            All Press Releases
          </Link>
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>ID: {release.id}</span>
        </div>

      </div>

      {/* Schema.org NewsArticle markup for Google News */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            'headline': release.title,
            'image': [
              release.banner ? (release.banner.startsWith('http') ? release.banner : `https://zawrindustries.com${release.banner}`) : 'https://zawrindustries.comhttps://res.cloudinary.com/murfclni/image/upload/v1783710544/zawr/assets/public-relations-hero.png'
            ],
            'datePublished': getSafeIsoDate(release.date),
            'dateModified': getSafeIsoDate(release.date),
            'author': [{
              '@type': 'Organization',
              'name': 'Zawr Industries Public Relations'
            }],
            'publisher': {
              '@type': 'Organization',
              'name': 'Zawr Industries',
              'logo': {
                '@type': 'ImageObject',
                'url': 'https://zawrindustries.com/assets/logo.png'
              }
            },
            'description': release.summary || ''
          })
        }}
      />

      {/* Google News Reader Revenue Manager Snippet */}
      <Script
        async
        type="application/javascript"
        src="https://news.google.com/swg/js/v1/swg-basic.js"
        strategy="afterInteractive"
      />
      <Script id="google-swg-init-press" strategy="afterInteractive">
        {`
          (self.SWG_BASIC = self.SWG_BASIC || []).push(basicSubscriptions => {
            basicSubscriptions.init({
              type: "NewsArticle",
              isPartOfType: ["Product"],
              isPartOfProductId: "CAowy4LHDA:openaccess",
              clientOptions: { theme: "light", lang: "en" },
            });
          });
        `}
      </Script>
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import fs from 'fs';
import path from 'path';
import { Metadata } from 'next';

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

export async function generateStaticParams() {
  try {
    const notifPath = path.join(process.cwd(), 'public/data/notifications.json');
    if (!fs.existsSync(notifPath)) return [];
    const notifications = JSON.parse(fs.readFileSync(notifPath, 'utf8'));
    return notifications.map((n: any) => ({ slug: n.slug }));
  } catch (e) {
    console.error('Error generating static params for notifications:', e);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const notifPath = path.join(process.cwd(), 'public/data/notifications.json');
    if (!fs.existsSync(notifPath)) return {};
    const notifications = JSON.parse(fs.readFileSync(notifPath, 'utf8'));
    const notification = notifications.find((n: any) => n.slug === slug);
    if (!notification) return {};

    const fullImageUrl = 'https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto:good,w_1600,c_limit,dpr_auto/v1783710544/zawr/assets/public-relations-hero.png';

    return {
      title: `${notification.title} | Zawr Industries Corporate Notification`,
      description: notification.summary,
      alternates: {
        canonical: `https://zawrindustries.com/newsroom/notifications/${slug}`,
      },
      openGraph: {
        title: notification.title,
        description: notification.summary,
        url: `https://zawrindustries.com/newsroom/notifications/${slug}`,
        siteName: 'Zawr Industries',
        images: [
          {
            url: fullImageUrl,
            alt: notification.title,
          }
        ],
        type: 'article',
        publishedTime: getSafeIsoDate(notification.date),
      },
      twitter: {
        card: 'summary_large_image',
        title: notification.title,
        description: notification.summary,
        images: [fullImageUrl],
      }
    };
  } catch (e) {
    console.error('Error generating notification metadata:', e);
    return {};
  }
}

export default async function NotificationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const notifPath = path.join(process.cwd(), 'public/data/notifications.json');
  if (!fs.existsSync(notifPath)) {
    notFound();
  }

  let notification;
  try {
    const notifications = JSON.parse(fs.readFileSync(notifPath, 'utf8'));
    notification = notifications.find((n: any) => n.slug === slug);
  } catch (e) {
    console.error('Error parsing notifications JSON:', e);
  }

  if (!notification) {
    notFound();
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', color: '#000000', paddingTop: '8rem', paddingBottom: '6rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .back-link {
          color: #4b5563;
          text-decoration: none;
          font-size: 0.875rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: color 0.15s;
        }
        .back-link:hover {
          color: #000000;
        }
        
        .attachment-row {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 1rem 1.75rem;
          text-decoration: none;
          background-color: #ffffff;
          transition: background-color 0.15s;
        }
        .attachment-row:hover {
          background-color: #f9fafb;
        }
        
        .related-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.4rem 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 9999px;
          font-size: 0.8rem;
          color: #000000;
          text-decoration: none;
          background-color: #f9fafb;
          transition: all 0.15s;
        }
        .related-link:hover {
          border-color: #000000;
          background-color: #ffffff;
        }
      `}} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>

        {/* Breadcrumb */}
        <div style={{ marginBottom: '2.5rem' }}>
          <Link href="/newsroom/notifications" className="back-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"></path><path d="m12 19-7-7 7-7"></path></svg>
            Back to Notifications
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
            {notification.category}
          </span>
          <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{notification.date}</span>
          {notification.archived && (
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
          {notification.title}
        </h1>

        {/* Body text */}
        {notification.body && (
          <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.85, marginBottom: '3rem', whiteSpace: 'pre-wrap' }}>
            {notification.body}
          </p>
        )}

        {/* Documents Table */}
        {notification.attachments && notification.attachments.length > 0 && (
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '1rem', overflow: 'hidden', marginBottom: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            {/* Table Header */}
            <div style={{ backgroundColor: '#000000', padding: '0.9rem 1.75rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#ffffff' }}>Title</span>
            </div>
            {/* Attachment Rows */}
            {notification.attachments.map((att: any, i: number) => (
              <a
                key={i}
                href={att.url}
                target="_blank"
                rel="noopener noreferrer"
                className="attachment-row"
                style={{
                  borderBottom: i < notification.attachments.length - 1 ? '1px solid #f3f4f6' : 'none'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                <span style={{ fontSize: '0.875rem', color: '#2563eb', fontWeight: 500 }}>{att.label}</span>
              </a>
            ))}
          </div>
        )}

        {/* External Links */}
        {notification.links && notification.links.length > 0 && (
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '1rem', overflow: 'hidden', marginBottom: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ padding: '1.25rem 1.75rem', display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', backgroundColor: '#ffffff' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', minWidth: '120px' }}>
                External Links
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {notification.links.map((lnk: any, i: number) => (
                  <a
                    key={i}
                    href={lnk.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="related-link"
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
          <Link href="/newsroom/notifications" className="back-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"></path><path d="m12 19-7-7 7-7"></path></svg>
            All Notifications
          </Link>
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Notification #{notification.id}</span>
        </div>

      </div>

      {/* Schema.org NewsArticle markup for Google News */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            'headline': notification.title,
            'image': [
              'https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto:good,w_1600,c_limit,dpr_auto/v1783710544/zawr/assets/public-relations-hero.png'
            ],
            'datePublished': getSafeIsoDate(notification.date),
            'dateModified': getSafeIsoDate(notification.date),
            'author': [{
              '@type': 'Organization',
              'name': 'Zawr Industries Corporate Communications'
            }],
            'publisher': {
              '@type': 'Organization',
              'name': 'Zawr Industries',
              'logo': {
                '@type': 'ImageObject',
                'url': 'https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto:good,w_400,c_limit/v1783710570/zawr/assets/zawr-logo.png'
              }
            },
            'description': notification.summary || ''
          })
        }}
      />

      {/* Schema.org BreadcrumbList markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': [
              {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': 'https://zawrindustries.com'
              },
              {
                '@type': 'ListItem',
                'position': 2,
                'name': 'Notifications',
                'item': 'https://zawrindustries.com/newsroom/notifications'
              },
              {
                '@type': 'ListItem',
                'position': 3,
                'name': notification.title,
                'item': `https://zawrindustries.com/newsroom/notifications/${slug}`
              }
            ]
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
      <Script id="google-swg-init-notif" strategy="afterInteractive">
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

"use client";

import React, { useState } from 'react';
import FormattedContent from './FormattedContent';

interface LiveSitePreviewProps {
  activeTab: string;
  theme: {
    bg: string;
    fg: string;
    border: string;
    muted: string;
    inputBg: string;
  };
  data: {
    // Jobs
    newJob?: {
      title: string;
      location: string;
      type: string;
      reporting?: string;
      role?: string;
      responsibilities?: string[];
    };
    // Blogs
    blogTitle?: string;
    blogCategory?: string;
    blogAuthor?: string;
    blogDate?: string;
    blogReadTime?: string;
    blogSummary?: string;
    blogSections?: Array<{ title: string; body: string }>;
    blogImage?: string;
    authorImage?: string;
    // Notices
    noticeTitle?: string;
    noticeCategory?: string;
    noticeDate?: string;
    noticeSummary?: string;
    noticeBody?: string;
    noticeAttachmentName?: string;
    noticeLinkName?: string;
    noticeLinkUrl?: string;
    // Notifications
    notifTitle?: string;
    notifCategory?: string;
    notifDate?: string;
    notifSummary?: string;
    notifBody?: string;
    // Events
    eventTitle?: string;
    eventSubtitle?: string;
    eventDesc?: string;
    eventStartDate?: string;
    eventEndDate?: string;
    eventStartTime?: string;
    eventEndTime?: string;
    eventVenue?: string;
    eventSpecialNote?: string;
    eventTicketsBooked?: string;
    eventTicketsCapacity?: string;
    eventImage?: string;
    // Press Releases
    pressTitle?: string;
    pressCategory?: string;
    pressDate?: string;
    pressSummary?: string;
    pressBody?: string;
    pressAttachmentName?: string;
    pressLinkName?: string;
    pressLinkUrl?: string;
  };
}

export default function LiveSitePreview({ activeTab, theme, data }: LiveSitePreviewProps) {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [viewMode, setViewMode] = useState<'draft' | 'iframe'>('draft');
  const [copied, setCopied] = useState(false);

  // Compute mock URL for address bar
  const getSiteRoute = () => {
    switch (activeTab) {
      case 'jobs':
        return '/careers';
      case 'blogs':
        return '/about/blog';
      case 'notices':
        return '/notices';
      case 'notifications':
        return '/newsroom/notifications';
      case 'events':
        return '/newsroom/events';
      case 'financial-reports':
        return '/investors';
      case 'press-releases':
        return '/newsroom/press-release';
      default:
        return '/';
    }
  };

  const getFullDisplayUrl = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://zawrindustries.com';
    return `${origin}${getSiteRoute()}`;
  };

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(getFullDisplayUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderDraftContent = () => {
    // ── 1. JOBS / CAREERS PREVIEW (Matches src/app/careers/[role]/JobDetailClient.tsx) ──
    if (activeTab === 'jobs') {
      const job = data.newJob || {
        title: '',
        location: '',
        type: 'Full-time',
        reporting: '',
        role: '',
        responsibilities: [],
      };

      const title = job.title || 'Senior Full-Stack Engineer';
      const location = job.location || 'Bengaluru (Hybrid)';
      const type = job.type || 'Full-time';
      const reporting = job.reporting || 'Engineering Leadership';

      return (
        <div style={{ backgroundColor: '#000000', color: '#ffffff', minHeight: '100%', padding: '2rem 1.5rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
          
          {/* Top Breadcrumb & Share Suite */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '0.75rem', borderBottom: '1px solid #1f2937', paddingBottom: '1.25rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#9ca3af', fontSize: '0.8rem', fontWeight: 500 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              Back to Careers
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span style={{ fontSize: '0.7rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Share:</span>
              
              {/* LinkedIn */}
              <button style={{ background: 'none', border: 'none', color: '#9ca3af', padding: '0.2rem', display: 'flex', alignItems: 'center', cursor: 'pointer' }} title="LinkedIn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </button>

              {/* X */}
              <button style={{ background: 'none', border: 'none', color: '#9ca3af', padding: '0.2rem', display: 'flex', alignItems: 'center', cursor: 'pointer' }} title="X">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </button>

              {/* WhatsApp */}
              <button style={{ background: 'none', border: 'none', color: '#9ca3af', padding: '0.2rem', display: 'flex', alignItems: 'center', cursor: 'pointer' }} title="WhatsApp">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
              </button>

              {/* Copy */}
              <button 
                onClick={handleCopyLink}
                style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: copied ? '#ffffff' : '#18181b', border: '1px solid #27272a', color: copied ? '#000000' : '#d1d5db', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Job Title & Badges */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 1rem 0', color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              {job.title ? job.title : <span style={{ color: '#52525b', fontStyle: 'italic' }}>Job Title appears here...</span>}
            </h1>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ backgroundColor: '#1f2937', color: '#e5e7eb', padding: '0.4rem 0.85rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 500 }}>
                {location}
              </span>
              <span style={{ backgroundColor: '#1f2937', color: '#e5e7eb', padding: '0.4rem 0.85rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 500 }}>
                {type}
              </span>
            </div>
          </div>

          {/* Role Overview */}
          <div style={{ marginBottom: '2.25rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 0.85rem 0', color: '#f3f4f6' }}>Role Overview</h2>
            {job.role ? (
              <FormattedContent content={job.role} style={{ color: '#d1d5db', fontSize: '0.95rem', lineHeight: 1.65 }} />
            ) : (
              <p style={{ color: '#52525b', fontSize: '0.9rem', fontStyle: 'italic', margin: 0 }}>Start typing role overview in the editor to see formatted live preview...</p>
            )}
          </div>

          {/* Key Responsibilities */}
          <div style={{ marginBottom: '2.25rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 0.85rem 0', color: '#f3f4f6' }}>Key Responsibilities</h2>
            {job.responsibilities && job.responsibilities.length > 0 ? (
              <FormattedContent content={job.responsibilities} style={{ color: '#d1d5db', fontSize: '0.95rem', lineHeight: 1.65 }} />
            ) : (
              <p style={{ color: '#52525b', fontSize: '0.9rem', fontStyle: 'italic', margin: 0 }}>Add responsibilities in the editor...</p>
            )}
          </div>

          {/* Reporting Structure */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 0.85rem 0', color: '#f3f4f6' }}>Reporting Structure</h2>
            <p style={{ color: '#d1d5db', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
              <strong>Reporting to:</strong> {reporting}
            </p>
          </div>

          <hr style={{ borderColor: '#1f2937', margin: '2.5rem 0' }} />

          {/* Application Form Section */}
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, margin: '0 0 0.4rem 0', color: '#ffffff' }}>Submit your application</h2>
            <p style={{ color: '#9ca3af', margin: '0 0 1.75rem 0', fontSize: '0.875rem' }}>Please fill out the form below and attach your resume/CV.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.3rem' }}>First Name *</label>
                <div style={{ width: '100%', padding: '0.65rem', backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '6px', color: '#52525b', fontSize: '0.8rem' }}>John</div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.3rem' }}>Last Name *</label>
                <div style={{ width: '100%', padding: '0.65rem', backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '6px', color: '#52525b', fontSize: '0.8rem' }}>Doe</div>
              </div>
            </div>

            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.3rem' }}>Email Address *</label>
              <div style={{ width: '100%', padding: '0.65rem', backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '6px', color: '#52525b', fontSize: '0.8rem' }}>john.doe@example.com</div>
            </div>

            <div style={{ padding: '1.5rem', border: '1px dashed #27272a', borderRadius: '8px', textAlign: 'center', backgroundColor: '#09090b', color: '#9ca3af', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
              📁 Attach Resume / CV (PDF, DOCX up to 10MB)
            </div>

            <button style={{ width: '100%', padding: '0.75rem', backgroundColor: '#ffffff', color: '#000000', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
              Submit Application
            </button>
          </div>
        </div>
      );
    }

    // ── 2. BLOG ARTICLE PREVIEW (Matches src/app/about/blog/[slug]/BlogClient.tsx) ──
    if (activeTab === 'blogs') {
      const title = data.blogTitle || 'Strategic Engineering for Autonomous Systems';
      const category = data.blogCategory || 'Technology';
      const author = data.blogAuthor || 'Lina Linder';
      const date = data.blogDate || '12 January 2026';
      const readTime = data.blogReadTime || '5 min read';
      const summary = data.blogSummary || 'Exploring modern distributed systems and robotic orchestration at enterprise scale.';
      const sections = data.blogSections || [
        { title: '1. Core Architectural Pillars', body: 'Modern industrial engineering demands deep resilience, zero-latency feedback loops, and intelligent edge compute.' },
        { title: '2. Decentralized Operations', body: 'How decentralized event architectures solve traditional telemetry saturation in smart factory pipelines.' }
      ];

      return (
        <div style={{ backgroundColor: '#ffffff', color: '#111111', minHeight: '100%', padding: '2rem 1.5rem', fontFamily: 'Inter, sans-serif' }}>
          {/* Top Category & Meta */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span style={{ backgroundColor: '#000000', color: '#ffffff', fontSize: '0.65rem', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {category}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>• {readTime}</span>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>• {date}</span>
          </div>

          {/* Title */}
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#000000', lineHeight: 1.25, margin: '0 0 1.25rem 0', letterSpacing: '-0.02em' }}>
            {title}
          </h1>

          {/* Author Strip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid #f3f4f6' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#18181b', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
              {author.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111111' }}>{author}</div>
              <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>Zawr Research &amp; Insights Editorial</div>
            </div>
          </div>

          {/* Key Takeaways / Executive Summary Box */}
          {summary && (
            <div style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.25rem', marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                Executive Summary &amp; Key Insights
              </div>
              <FormattedContent content={summary} style={{ color: '#4b5563', fontSize: '0.88rem', lineHeight: 1.6 }} />
            </div>
          )}

          {/* Article Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {sections.map((sect, sIdx) => (
              <div key={sIdx}>
                {sect.title && (
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: '0 0 0.75rem 0', letterSpacing: '-0.01em' }}>
                    {sect.title}
                  </h2>
                )}
                {sect.body ? (
                  <FormattedContent content={sect.body} style={{ color: '#374151', fontSize: '0.95rem', lineHeight: 1.7 }} />
                ) : (
                  <span style={{ color: '#9ca3af', fontSize: '0.8rem', fontStyle: 'italic' }}>Write section body in the editor...</span>
                )}
              </div>
            ))}
          </div>

          {/* Article Topics Strip */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f3f4f6' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Topics:</span>
            <span style={{ backgroundColor: '#f3f4f6', color: '#4b5563', fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>#{category}</span>
            <span style={{ backgroundColor: '#f3f4f6', color: '#4b5563', fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>#ZawrIndustries</span>
          </div>
        </div>
      );
    }

    // ── 3. NOTICES PREVIEW (Matches src/app/notices/[slug]/page.tsx) ──
    if (activeTab === 'notices') {
      const noticeTitle = data.noticeTitle || 'Notice Inviting Offer — Sale of CBM';
      const category = data.noticeCategory || 'Corporate';
      const date = data.noticeDate || 'January 16, 2026';
      const body = data.noticeBody || 'Full formal notice terms, tender parameters, bidding timelines, and submission guidelines.';

      return (
        <div style={{ backgroundColor: '#ffffff', color: '#000000', minHeight: '100%', padding: '2rem 1.5rem', fontFamily: 'Inter, sans-serif' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1.25rem' }}>
            <span style={{ backgroundColor: '#f3f4f6', color: '#4b5563', border: '1px solid #e5e7eb', fontSize: '0.65rem', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: '9999px', textTransform: 'uppercase' }}>
              {category}
            </span>
            <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{date}</span>
          </div>

          <h1 style={{ fontSize: '1.65rem', fontWeight: 700, color: '#000000', margin: '0 0 1.5rem 0', lineHeight: 1.25 }}>
            {noticeTitle}
          </h1>

          <div style={{ marginBottom: '2.5rem' }}>
            <FormattedContent content={body} style={{ color: '#374151', fontSize: '0.95rem', lineHeight: 1.8 }} />
          </div>

          {/* Attachment card */}
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#000000', color: '#ffffff', padding: '0.75rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Documents &amp; Files
            </div>
            <div style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: '#2563eb' }}>
              📄 {data.noticeAttachmentName || 'Notice Tender Document.pdf'}
            </div>
          </div>
        </div>
      );
    }

    // ── 4. NOTIFICATIONS PREVIEW (Matches src/app/newsroom/notifications/[slug]/page.tsx) ──
    if (activeTab === 'notifications') {
      const notifTitle = data.notifTitle || 'Q2 2026 Earnings Call Announcement';
      const category = data.notifCategory || 'Investor';
      const date = data.notifDate || '27th May 2026';
      const body = data.notifBody || 'Zawr Industries announces the schedule and dial-in details for the upcoming investor briefing.';

      return (
        <div style={{ backgroundColor: '#ffffff', color: '#000000', minHeight: '100%', padding: '2rem 1.5rem', fontFamily: 'Inter, sans-serif' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1.25rem' }}>
            <span style={{ backgroundColor: '#f3f4f6', color: '#4b5563', border: '1px solid #e5e7eb', fontSize: '0.65rem', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: '9999px', textTransform: 'uppercase' }}>
              {category}
            </span>
            <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{date}</span>
          </div>

          <h1 style={{ fontSize: '1.65rem', fontWeight: 700, color: '#000000', margin: '0 0 1.5rem 0', lineHeight: 1.25 }}>
            {notifTitle}
          </h1>

          <div style={{ marginBottom: '2.5rem' }}>
            <FormattedContent content={body} style={{ color: '#374151', fontSize: '0.95rem', lineHeight: 1.8 }} />
          </div>
        </div>
      );
    }

    // ── 5. EVENTS PREVIEW (Matches src/app/newsroom/events/page.tsx) ──
    if (activeTab === 'events') {
      const eventTitle = data.eventTitle || 'Zawr Global Tech Summit 2026';
      const eventSubtitle = data.eventSubtitle || 'Annual AI & Robotics Innovation Showcase';
      const eventStartDate = data.eventStartDate || '2026-10-15';
      const eventVenue = data.eventVenue || 'Bangalore • Online';
      const eventSpecialNote = data.eventSpecialNote || 'Keynote registration is strictly limited to verified enterprise attendees.';
      const booked = data.eventTicketsBooked || '140';
      const capacity = data.eventTicketsCapacity || '200';
      const pct = Math.min(100, (parseInt(booked) / parseInt(capacity)) * 100) || 70;

      return (
        <div style={{ backgroundColor: '#09090b', color: '#ffffff', minHeight: '100%', padding: '2rem 1.5rem', fontFamily: 'sans-serif' }}>
          <div style={{ border: '1px solid #27272a', borderRadius: '14px', overflow: 'hidden', backgroundColor: '#000000', padding: '1.75rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
              🗓️ {eventStartDate} • {eventVenue}
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', margin: '0 0 0.4rem 0' }}>
              {eventTitle}
            </h2>
            <div style={{ fontSize: '0.88rem', color: '#a1a1aa', marginBottom: '1.5rem' }}>
              {eventSubtitle}
            </div>

            {/* Ticket Capacity Progress */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '0.4rem' }}>
                <span>Seats Booked</span>
                <span style={{ fontWeight: 600, color: '#ffffff' }}>{booked} / {capacity}</span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: '#18181b', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', backgroundColor: '#ffffff', borderRadius: '9999px' }} />
              </div>
            </div>

            {/* Special Note */}
            {eventSpecialNote && (
              <div style={{ padding: '0.85rem 1.15rem', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid #1f2937', borderRadius: '8px', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#e5e7eb', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Special Note</span>
                <FormattedContent content={eventSpecialNote} style={{ fontSize: '0.82rem', color: '#a1a1aa', lineHeight: 1.55 }} />
              </div>
            )}

            <button style={{ width: '100%', padding: '0.75rem', backgroundColor: '#ffffff', color: '#000000', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '0.9rem' }}>
              RSVP / Register Attendance
            </button>
          </div>
        </div>
      );
    }

    // ── 6. PRESS RELEASES PREVIEW (Matches src/app/newsroom/press-release/[slug]/page.tsx) ──
    if (activeTab === 'press-releases') {
      const pressTitle = data.pressTitle || 'Official announcements, company updates, and strategic developments from Zawr.';
      const category = data.pressCategory || 'Corporate';
      const date = data.pressDate || '27th May 2026';
      const body = data.pressBody || data.pressSummary || 'Official press release full statement and detailed operational disclosures.';

      return (
        <div style={{ backgroundColor: '#ffffff', color: '#000000', minHeight: '100%', padding: '2rem 1.5rem', fontFamily: 'Inter, sans-serif' }}>
          {/* Breadcrumb */}
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ color: '#4b5563', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"></path><path d="m12 19-7-7 7-7"></path></svg>
              Back to Press Releases
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1.25rem' }}>
            <span style={{ backgroundColor: '#f3f4f6', color: '#4b5563', border: '1px solid #e5e7eb', fontSize: '0.65rem', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: '9999px', textTransform: 'uppercase' }}>
              {category}
            </span>
            <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{date}</span>
          </div>

          <h1 style={{ fontSize: '1.65rem', fontWeight: 700, color: '#000000', margin: '0 0 1.5rem 0', lineHeight: 1.25 }}>
            {pressTitle}
          </h1>

          <div style={{ marginBottom: '2.5rem' }}>
            <FormattedContent content={body} style={{ color: '#374151', fontSize: '0.95rem', lineHeight: 1.8 }} />
          </div>

          {/* Attachment card */}
          {data.pressAttachmentName && (
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.5rem' }}>
              <div style={{ backgroundColor: '#000000', color: '#ffffff', padding: '0.75rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Attachments
              </div>
              <div style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: '#2563eb' }}>
                📄 {data.pressAttachmentName}
              </div>
            </div>
          )}

          {/* External Link pill */}
          {data.pressLinkName && (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280' }}>Related:</span>
              <span style={{ padding: '0.3rem 0.8rem', border: '1px solid #e5e7eb', borderRadius: '9999px', fontSize: '0.8rem', color: '#000000', backgroundColor: '#f9fafb' }}>
                🔗 {data.pressLinkName}
              </span>
            </div>
          )}
        </div>
      );
    }

    // Default Overview
    return (
      <div style={{ backgroundColor: '#000000', color: '#ffffff', minHeight: '100%', padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '54px', height: '54px', borderRadius: '50%', backgroundColor: '#18181b', border: '1px solid #27272a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', fontSize: '1.5rem' }}>
          🌐
        </div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem', color: '#ffffff' }}>Realtime Live Browser Mirror</h3>
        <p style={{ fontSize: '0.85rem', color: '#9ca3af', maxWidth: '340px', lineHeight: 1.5, margin: 0 }}>
          Select <strong>Manage Jobs</strong>, <strong>Manage Blogs</strong>, <strong>Manage Notices</strong>, or <strong>Manage Events</strong> to watch your formatted text and updates render live as you type.
        </p>
      </div>
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: theme.bg,
        borderLeft: `1px solid ${theme.border}`,
        overflow: 'hidden',
      }}
    >
      {/* Device & Mode Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.65rem 1rem',
          backgroundColor: '#09090b',
          borderBottom: `1px solid ${theme.border}`,
          flexShrink: 0,
          gap: '0.5rem',
          flexWrap: 'wrap',
        }}
      >
        {/* Browser Traffic Lights & Mode Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ display: 'flex', gap: '0.3rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }} />
          </div>

          {/* Mode Switcher: Keystroke Draft vs Real Live Route */}
          <div style={{ display: 'flex', backgroundColor: '#18181b', padding: '0.15rem', borderRadius: '6px', border: '1px solid #27272a' }}>
            <button
              type="button"
              onClick={() => setViewMode('draft')}
              style={{
                padding: '0.2rem 0.5rem',
                fontSize: '0.7rem',
                fontWeight: 600,
                borderRadius: '4px',
                border: 'none',
                backgroundColor: viewMode === 'draft' ? '#10b981' : 'transparent',
                color: viewMode === 'draft' ? '#000000' : '#9ca3af',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              ⚡ Live Keystroke Sync
            </button>
            <button
              type="button"
              onClick={() => setViewMode('iframe')}
              style={{
                padding: '0.2rem 0.5rem',
                fontSize: '0.7rem',
                fontWeight: 600,
                borderRadius: '4px',
                border: 'none',
                backgroundColor: viewMode === 'iframe' ? '#3b82f6' : 'transparent',
                color: viewMode === 'iframe' ? '#ffffff' : '#9ca3af',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              🌐 Real Website (Iframe)
            </button>
          </div>
        </div>

        {/* Viewport Toggles (Desktop / Mobile) */}
        <div style={{ display: 'flex', gap: '0.25rem', backgroundColor: '#18181b', padding: '0.15rem', borderRadius: '6px', border: '1px solid #27272a' }}>
          <button
            type="button"
            onClick={() => setDeviceMode('desktop')}
            title="Desktop View"
            style={{
              padding: '0.2rem 0.5rem',
              fontSize: '0.7rem',
              fontWeight: 600,
              borderRadius: '4px',
              border: 'none',
              backgroundColor: deviceMode === 'desktop' ? '#ffffff' : 'transparent',
              color: deviceMode === 'desktop' ? '#000000' : '#9ca3af',
              cursor: 'pointer',
            }}
          >
            🖥️ Desktop
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode('mobile')}
            title="Mobile View (375px)"
            style={{
              padding: '0.2rem 0.5rem',
              fontSize: '0.7rem',
              fontWeight: 600,
              borderRadius: '4px',
              border: 'none',
              backgroundColor: deviceMode === 'mobile' ? '#ffffff' : 'transparent',
              color: deviceMode === 'mobile' ? '#000000' : '#9ca3af',
              cursor: 'pointer',
            }}
          >
            📱 Mobile
          </button>
        </div>
      </div>

      {/* Mock Browser URL Bar */}
      <div
        style={{
          padding: '0.4rem 1rem',
          backgroundColor: '#0c0c0e',
          borderBottom: `1px solid ${theme.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: '#18181b',
            border: '1px solid #27272a',
            borderRadius: '4px',
            padding: '0.25rem 0.6rem',
            fontSize: '0.72rem',
            color: '#a1a1aa',
            fontFamily: 'monospace',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ color: '#10b981' }}>🔒</span>
          {getFullDisplayUrl()}
        </div>
      </div>

      {/* Preview Viewport Canvas */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          backgroundColor: deviceMode === 'mobile' ? '#000000' : '#050505',
          display: 'flex',
          justifyContent: 'center',
          padding: deviceMode === 'mobile' ? '1.5rem 0' : 0,
        }}
      >
        <div
          style={{
            width: deviceMode === 'mobile' ? '375px' : '100%',
            height: deviceMode === 'mobile' ? '720px' : '100%',
            minHeight: deviceMode === 'mobile' ? '720px' : '100%',
            boxShadow: deviceMode === 'mobile' ? '0 20px 40px rgba(0,0,0,0.8), 0 0 0 1px #27272a' : 'none',
            borderRadius: deviceMode === 'mobile' ? '28px' : 0,
            overflow: 'hidden',
            border: deviceMode === 'mobile' ? '8px solid #18181b' : 'none',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            alignSelf: deviceMode === 'mobile' ? 'flex-start' : 'stretch',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {viewMode === 'iframe' ? (
            <iframe
              src={getSiteRoute()}
              title="Live Website Preview"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                backgroundColor: '#000000',
                flex: 1,
              }}
            />
          ) : (
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {renderDraftContent()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

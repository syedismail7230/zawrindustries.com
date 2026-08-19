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
  };
}

export default function LiveSitePreview({ activeTab, theme, data }: LiveSitePreviewProps) {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');

  // Compute mock URL for address bar
  const getMockUrl = () => {
    switch (activeTab) {
      case 'jobs':
        return `https://zawrindustries.com/careers/${data.newJob?.title ? encodeURIComponent(data.newJob.title.toLowerCase().replace(/\s+/g, '-')) : 'preview'}`;
      case 'blogs':
        return `https://zawrindustries.com/about/blog/${data.blogTitle ? encodeURIComponent(data.blogTitle.toLowerCase().replace(/\s+/g, '-')) : 'article'}`;
      case 'notices':
        return 'https://zawrindustries.com/notices/detail-preview';
      case 'notifications':
        return 'https://zawrindustries.com/newsroom/notifications/detail-preview';
      case 'events':
        return 'https://zawrindustries.com/newsroom/events';
      default:
        return 'https://zawrindustries.com';
    }
  };

  const renderPreviewContent = () => {
    // ── 1. JOBS / CAREERS PREVIEW ──
    if (activeTab === 'jobs') {
      const job = data.newJob || {
        title: 'Lead AI Systems Engineer',
        location: 'Bengaluru (Hybrid)',
        type: 'Full-time',
        reporting: 'CTO / VP Engineering',
        role: 'Leading our autonomous robotics infrastructure and scalable cloud-edge systems.',
        responsibilities: ['Architect low-latency neural pipelines', 'Deploy edge microservices with Kubernetes', 'Collaborate with industrial engineering teams'],
      };

      const hasCustomData = !!(job.title || job.role || (job.responsibilities && job.responsibilities.length > 0));

      return (
        <div style={{ backgroundColor: '#000000', color: '#ffffff', minHeight: '100%', padding: '2rem 1.5rem', fontFamily: 'sans-serif' }}>
          {/* Header breadcrumb & top share */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem', borderBottom: '1px solid #1f2937', paddingBottom: '1rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              ← Back to Careers
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.65rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SHARE:</span>
              <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>[in]</span>
              <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>[X]</span>
              <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>[wa]</span>
              <span style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem', border: '1px solid #27272a', borderRadius: '4px', color: '#d1d5db' }}>Copy Link</span>
            </div>
          </div>

          {/* Job Header */}
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 0.75rem 0', color: '#ffffff', lineHeight: 1.2 }}>
              {job.title || <span style={{ color: '#52525b', fontStyle: 'italic' }}>Enter Job Title...</span>}
            </h1>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ backgroundColor: '#18181b', border: '1px solid #27272a', color: '#e5e7eb', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 500 }}>
                📍 {job.location || 'Location'}
              </span>
              <span style={{ backgroundColor: '#18181b', border: '1px solid #27272a', color: '#e5e7eb', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 500 }}>
                💼 {job.type || 'Full-time'}
              </span>
            </div>
          </div>

          {/* Role Overview */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f3f4f6', marginBottom: '0.5rem', borderLeft: '2px solid #ffffff', paddingLeft: '0.5rem' }}>
              Role Overview
            </h3>
            {job.role ? (
              <FormattedContent content={job.role} style={{ color: '#d1d5db', fontSize: '0.88rem', lineHeight: 1.6 }} />
            ) : (
              <p style={{ color: '#52525b', fontSize: '0.82rem', fontStyle: 'italic', margin: 0 }}>Start typing role overview in the editor to see formatted live preview...</p>
            )}
          </div>

          {/* Key Responsibilities */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f3f4f6', marginBottom: '0.5rem', borderLeft: '2px solid #ffffff', paddingLeft: '0.5rem' }}>
              Key Responsibilities
            </h3>
            {job.responsibilities && job.responsibilities.length > 0 ? (
              <FormattedContent content={job.responsibilities} style={{ color: '#d1d5db', fontSize: '0.88rem', lineHeight: 1.6 }} />
            ) : (
              <p style={{ color: '#52525b', fontSize: '0.82rem', fontStyle: 'italic', margin: 0 }}>Add responsibilities one per line...</p>
            )}
          </div>

          {/* Reporting Structure */}
          <div style={{ marginBottom: '2rem', padding: '0.75rem 1rem', backgroundColor: '#09090b', border: '1px solid #18181b', borderRadius: '6px' }}>
            <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
              <strong style={{ color: '#ffffff' }}>Reporting Structure:</strong> {job.reporting || 'Engineering Leadership'}
            </span>
          </div>

          {/* Application Form Simulation */}
          <div style={{ borderTop: '1px solid #1f2937', paddingTop: '1.5rem' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ffffff', margin: '0 0 0.35rem 0' }}>Submit your application</h4>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '0 0 1rem 0' }}>Visitor direct submission form</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '0.6rem' }}>
              <div style={{ padding: '0.5rem', backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '4px', fontSize: '0.75rem', color: '#52525b' }}>First name *</div>
              <div style={{ padding: '0.5rem', backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '4px', fontSize: '0.75rem', color: '#52525b' }}>Last name</div>
            </div>
            <div style={{ padding: '0.5rem', backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '4px', fontSize: '0.75rem', color: '#52525b', marginBottom: '0.6rem' }}>Email address *</div>
            <div style={{ padding: '1rem', border: '1px dashed #27272a', borderRadius: '6px', textAlign: 'center', fontSize: '0.72rem', color: '#9ca3af' }}>
              📎 Resume / CV Upload (PDF, DOCX)
            </div>
          </div>
        </div>
      );
    }

    // ── 2. BLOG ARTICLE PREVIEW ──
    if (activeTab === 'blogs') {
      const title = data.blogTitle || 'The Architecture of Autonomous Systems';
      const category = data.blogCategory || 'Technology';
      const author = data.blogAuthor || 'Lina Linder';
      const date = data.blogDate || '12 January 2026';
      const readTime = data.blogReadTime || '5 min read';
      const summary = data.blogSummary || 'Exploring modern distributed systems and robotic orchestration at enterprise scale.';
      const sections = data.blogSections || [
        { title: '1. Core Foundations', body: 'Modern industrial engineering demands deep resilience, zero-latency feedback loops, and intelligent edge compute.' },
        { title: '2. Scalability Bottlenecks', body: 'How decentralized event architectures solve traditional telemetry saturation in smart factory pipelines.' }
      ];

      return (
        <div style={{ backgroundColor: '#ffffff', color: '#111111', minHeight: '100%', padding: '2rem 1.5rem', fontFamily: 'Inter, sans-serif' }}>
          {/* Top category & meta */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ backgroundColor: '#000000', color: '#ffffff', fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {category}
            </span>
            <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>• {readTime}</span>
            <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>• {date}</span>
          </div>

          {/* Title */}
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#000000', lineHeight: 1.25, margin: '0 0 1rem 0', letterSpacing: '-0.02em' }}>
            {title}
          </h1>

          {/* Author Strip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #f3f4f6' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#374151' }}>
              {author.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111111' }}>{author}</div>
              <div style={{ fontSize: '0.68rem', color: '#6b7280' }}>Zawr Research &amp; Insights Editorial</div>
            </div>
          </div>

          {/* Key Takeaways Box */}
          {summary && (
            <div style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#111827', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                💡 Executive Summary &amp; Key Insights
              </div>
              <FormattedContent content={summary} style={{ color: '#4b5563', fontSize: '0.82rem', lineHeight: 1.55 }} />
            </div>
          )}

          {/* Article Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {sections.map((sect, sIdx) => (
              <div key={sIdx}>
                {sect.title && (
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#111827', margin: '0 0 0.5rem 0', letterSpacing: '-0.01em' }}>
                    {sect.title}
                  </h2>
                )}
                {sect.body ? (
                  <FormattedContent content={sect.body} style={{ color: '#374151', fontSize: '0.88rem', lineHeight: 1.65 }} />
                ) : (
                  <span style={{ color: '#9ca3af', fontSize: '0.75rem', fontStyle: 'italic' }}>Write section body...</span>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // ── 3. NOTICES PREVIEW ──
    if (activeTab === 'notices') {
      const noticeTitle = data.noticeTitle || 'Notice Inviting Offer — Sale of CBM';
      const category = data.noticeCategory || 'Corporate';
      const date = data.noticeDate || 'January 16, 2026';
      const body = data.noticeBody || 'Full formal notice terms, tender parameters, bidding timelines, and submission guidelines.';

      return (
        <div style={{ backgroundColor: '#ffffff', color: '#000000', minHeight: '100%', padding: '2rem 1.5rem', fontFamily: 'Inter, sans-serif' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ backgroundColor: '#f3f4f6', color: '#4b5563', border: '1px solid #e5e7eb', fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '9999px', textTransform: 'uppercase' }}>
              {category}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{date}</span>
          </div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#000000', margin: '0 0 1.25rem 0', lineHeight: 1.25 }}>
            {noticeTitle}
          </h1>

          <div style={{ marginBottom: '2rem' }}>
            <FormattedContent content={body} style={{ color: '#374151', fontSize: '0.88rem', lineHeight: 1.7 }} />
          </div>

          {/* Attachment card */}
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#000000', color: '#ffffff', padding: '0.6rem 1rem', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Documents &amp; Files
            </div>
            <div style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#2563eb' }}>
              📄 {data.noticeAttachmentName || 'Notice Tender Document.pdf'}
            </div>
          </div>
        </div>
      );
    }

    // ── 4. NOTIFICATIONS PREVIEW ──
    if (activeTab === 'notifications') {
      const notifTitle = data.notifTitle || 'Q2 2026 Earnings Call Announcement';
      const category = data.notifCategory || 'Investor';
      const date = data.notifDate || '27th May 2026';
      const body = data.notifBody || 'Zawr Industries announces the schedule and dial-in details for the upcoming investor briefing.';

      return (
        <div style={{ backgroundColor: '#ffffff', color: '#000000', minHeight: '100%', padding: '2rem 1.5rem', fontFamily: 'Inter, sans-serif' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ backgroundColor: '#f3f4f6', color: '#4b5563', border: '1px solid #e5e7eb', fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '9999px', textTransform: 'uppercase' }}>
              {category}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{date}</span>
          </div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#000000', margin: '0 0 1.25rem 0', lineHeight: 1.25 }}>
            {notifTitle}
          </h1>

          <div style={{ marginBottom: '2rem' }}>
            <FormattedContent content={body} style={{ color: '#374151', fontSize: '0.88rem', lineHeight: 1.7 }} />
          </div>
        </div>
      );
    }

    // ── 5. EVENTS PREVIEW ──
    if (activeTab === 'events') {
      const eventTitle = data.eventTitle || 'Zawr Global Tech Summit 2026';
      const eventSubtitle = data.eventSubtitle || 'Annual AI & Robotics Innovation Showcase';
      const eventStartDate = data.eventStartDate || '2026-10-15';
      const eventVenue = data.eventVenue || 'Online • Bangalore';
      const eventSpecialNote = data.eventSpecialNote || 'Keynote registration is strictly limited to verified enterprise attendees.';
      const booked = data.eventTicketsBooked || '140';
      const capacity = data.eventTicketsCapacity || '200';
      const pct = Math.min(100, (parseInt(booked) / parseInt(capacity)) * 100) || 70;

      return (
        <div style={{ backgroundColor: '#09090b', color: '#ffffff', minHeight: '100%', padding: '2rem 1.5rem', fontFamily: 'sans-serif' }}>
          <div style={{ border: '1px solid #27272a', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#000000', padding: '1.5rem' }}>
            <div style={{ fontSize: '0.72rem', color: '#3b82f6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
              🗓️ {eventStartDate} • {eventVenue}
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff', margin: '0 0 0.35rem 0' }}>
              {eventTitle}
            </h2>
            <div style={{ fontSize: '0.82rem', color: '#a1a1aa', marginBottom: '1.25rem' }}>
              {eventSubtitle}
            </div>

            {/* Ticket Progress */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.35rem' }}>
                <span>Seats Booked</span>
                <span style={{ fontWeight: 600, color: '#ffffff' }}>{booked} / {capacity}</span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: '#18181b', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', backgroundColor: '#ffffff', borderRadius: '9999px' }} />
              </div>
            </div>

            {/* Special note */}
            {eventSpecialNote && (
              <div style={{ padding: '0.75rem 1rem', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid #1f2937', borderRadius: '8px', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: '#e5e7eb', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Special Note</span>
                <FormattedContent content={eventSpecialNote} style={{ fontSize: '0.78rem', color: '#9ca3af', lineHeight: 1.5 }} />
              </div>
            )}

            <button style={{ width: '100%', padding: '0.65rem', backgroundColor: '#ffffff', color: '#000000', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem' }}>
              RSVP / Register Attendance
            </button>
          </div>
        </div>
      );
    }

    // Default Overview
    return (
      <div style={{ backgroundColor: '#000000', color: '#ffffff', minHeight: '100%', padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#18181b', border: '1px solid #27272a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', fontSize: '1.25rem' }}>
          🌐
        </div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#ffffff' }}>Realtime Live Browser Mirror</h3>
        <p style={{ fontSize: '0.8rem', color: '#9ca3af', maxWidth: '320px', lineHeight: 1.5, margin: 0 }}>
          Select <strong>Manage Jobs</strong>, <strong>Manage Blogs</strong>, <strong>Manage Notices</strong>, or <strong>Manage Events</strong> to watch your content render live as you type.
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
      {/* Device & Browser Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.6rem 1rem',
          backgroundColor: '#09090b',
          borderBottom: `1px solid ${theme.border}`,
          flexShrink: 0,
        }}
      >
        {/* Browser Traffic Lights & Live Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ display: 'flex', gap: '0.3rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }} />
          </div>

          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              color: '#10b981',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              padding: '0.15rem 0.5rem',
              borderRadius: '9999px',
              border: '1px solid rgba(16, 185, 129, 0.2)',
            }}
          >
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
            LIVE MIRROR
          </span>
        </div>

        {/* Viewport Toggles (Desktop / Mobile) */}
        <div style={{ display: 'flex', gap: '0.3rem', backgroundColor: '#18181b', padding: '0.2rem', borderRadius: '6px', border: '1px solid #27272a' }}>
          <button
            type="button"
            onClick={() => setDeviceMode('desktop')}
            title="Desktop View (Full Width)"
            style={{
              padding: '0.25rem 0.55rem',
              fontSize: '0.72rem',
              fontWeight: 600,
              borderRadius: '4px',
              border: 'none',
              backgroundColor: deviceMode === 'desktop' ? '#ffffff' : 'transparent',
              color: deviceMode === 'desktop' ? '#000000' : '#9ca3af',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              transition: 'all 0.15s ease',
            }}
          >
            🖥️ Desktop
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode('mobile')}
            title="Mobile View (375px)"
            style={{
              padding: '0.25rem 0.55rem',
              fontSize: '0.72rem',
              fontWeight: 600,
              borderRadius: '4px',
              border: 'none',
              backgroundColor: deviceMode === 'mobile' ? '#ffffff' : 'transparent',
              color: deviceMode === 'mobile' ? '#000000' : '#9ca3af',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              transition: 'all 0.15s ease',
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
          {getMockUrl()}
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
            minHeight: deviceMode === 'mobile' ? '667px' : '100%',
            boxShadow: deviceMode === 'mobile' ? '0 20px 40px rgba(0,0,0,0.8), 0 0 0 1px #27272a' : 'none',
            borderRadius: deviceMode === 'mobile' ? '28px' : 0,
            overflow: 'hidden',
            border: deviceMode === 'mobile' ? '8px solid #18181b' : 'none',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            alignSelf: deviceMode === 'mobile' ? 'flex-start' : 'stretch',
          }}
        >
          {renderPreviewContent()}
        </div>
      </div>
    </div>
  );
}

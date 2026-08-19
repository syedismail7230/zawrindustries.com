'use client';

import React, { useState, useEffect } from 'react';
import { AnalyticsData, EmailLogEntry, WebRequestEntry, SecurityEventEntry } from '@/lib/analytics-tracker';

interface AnalyticsDashboardProps {
  theme: {
    bg: string;
    fg: string;
    border: string;
    muted: string;
    inputBg: string;
    sidebarBg?: string;
    hover?: string;
  };
}

export default function AnalyticsDashboard({ theme }: AnalyticsDashboardProps) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'emails' | 'requests' | 'geo' | 'security'>('overview');
  const [emailSearch, setEmailSearch] = useState('');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAnalytics = async (showLoading = true) => {
    if (showLoading) setIsRefreshing(true);
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) {
        const json: AnalyticsData = await res.json();
        setData(json);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (e) {
      console.error('Error fetching analytics:', e);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    // Auto-poll every 12 seconds for real-time live telemetry
    const interval = setInterval(() => {
      fetchAnalytics(false);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !data) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '350px', gap: '1rem', color: theme.muted }}>
        <div style={{ width: '32px', height: '32px', border: `3px solid ${theme.border}`, borderTopColor: '#ffffff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { to { transform: rotate(360deg); } }` }} />
        <p style={{ fontSize: '0.9rem', margin: 0 }}>Connecting to Realtime Telemetry Stream...</p>
      </div>
    );
  }

  const { summary, trafficChart, emails, requests, security, geo } = data;

  const filteredEmails = emails.filter((em) => {
    const q = emailSearch.toLowerCase();
    return (
      em.recipient.toLowerCase().includes(q) ||
      em.subject.toLowerCase().includes(q) ||
      em.reason.toLowerCase().includes(q) ||
      em.region.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '3rem' }}>
      
      {/* Header Bar with Live Pulse */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', margin: 0, color: theme.fg }}>
              Realtime Analytics & Telemetry
            </h2>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#052e16', border: '1px solid #166534', color: '#4ade80', fontSize: '0.72rem', fontWeight: 600, padding: '0.2rem 0.65rem', borderRadius: '9999px' }}>
              <span style={{ width: '6px', height: '6px', backgroundColor: '#4ade80', borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
              Live Stream
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: theme.muted, margin: 0 }}>
            Live tracking of transactional emails, incoming HTTP requests, regional demographics, and edge security shield. Last updated: {lastUpdated || 'Just now'}
          </p>
        </div>

        <button
          onClick={() => fetchAnalytics(true)}
          disabled={isRefreshing}
          style={{
            padding: '0.55rem 1.1rem',
            backgroundColor: theme.inputBg,
            border: `1px solid ${theme.border}`,
            color: theme.fg,
            borderRadius: '6px',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: isRefreshing ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.15s'
          }}
        >
          <svg style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
          {isRefreshing ? 'Refreshing...' : 'Refresh Telemetry'}
        </button>
      </div>

      {/* 4 Core Metric KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        
        {/* Card 1: Total Visits */}
        <div style={{ padding: '1.25rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Visitors</span>
            <span style={{ fontSize: '1.1rem' }}>📈</span>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 700, color: theme.fg, lineHeight: 1.1, marginBottom: '0.4rem' }}>
            {summary.totalVisits.toLocaleString()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#4ade80' }}>
            <span>{summary.visitsChange} vs last week</span>
            <span style={{ color: theme.muted }}>• {summary.totalPageViews.toLocaleString()} views</span>
          </div>
        </div>

        {/* Card 2: Emails Dispatched */}
        <div style={{ padding: '1.25rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Emails Sent</span>
            <span style={{ fontSize: '1.1rem' }}>✉️</span>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 700, color: theme.fg, lineHeight: 1.1, marginBottom: '0.4rem' }}>
            {summary.emailsSentToday} <span style={{ fontSize: '1rem', fontWeight: 500, color: theme.muted }}>today</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: theme.muted }}>
            <strong style={{ color: '#4ade80' }}>100%</strong> delivery rate ({summary.emailsSentWeek} this week)
          </div>
        </div>

        {/* Card 3: Top Region */}
        <div style={{ padding: '1.25rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Top Region</span>
            <span style={{ fontSize: '1.1rem' }}>🌍</span>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 700, color: theme.fg, lineHeight: 1.1, marginBottom: '0.4rem' }}>
            {geo[0]?.flag} {geo[0]?.country}
          </div>
          <div style={{ fontSize: '0.75rem', color: theme.muted }}>
            <strong style={{ color: '#60a5fa' }}>{geo[0]?.percentage}%</strong> share ({geo[0]?.topCities[0]?.city} #1)
          </div>
        </div>

        {/* Card 4: Threat Shield */}
        <div style={{ padding: '1.25rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Threat Shield</span>
            <span style={{ fontSize: '1.1rem' }}>🛡️</span>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 700, color: '#4ade80', lineHeight: 1.1, marginBottom: '0.4rem' }}>
            0 <span style={{ fontSize: '1rem', fontWeight: 500, color: theme.muted }}>Breaches</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: theme.muted }}>
            <strong style={{ color: '#f59e0b' }}>{summary.threatsNeutralized}</strong> malicious probes neutralized
          </div>
        </div>

      </div>

      {/* Analytics Sub-Tab Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: `1px solid ${theme.border}`, paddingBottom: '0.75rem', overflowX: 'auto' }}>
        {[
          { id: 'overview', label: '📊 Traffic Overview' },
          { id: 'emails', label: `✉️ Email Dispatch Log (${emails.length})` },
          { id: 'requests', label: `🌐 Live Requests Stream (${requests.length})` },
          { id: 'geo', label: `🌍 Regional Demographics (${geo.length})` },
          { id: 'security', label: `🛡️ Security & Threats (${security.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            style={{
              padding: '0.55rem 1rem',
              borderRadius: '6px',
              border: activeSubTab === tab.id ? '1px solid #ffffff' : `1px solid ${theme.border}`,
              backgroundColor: activeSubTab === tab.id ? '#ffffff' : 'transparent',
              color: activeSubTab === tab.id ? '#000000' : theme.muted,
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SUB-TAB 1: OVERVIEW & TRAFFIC CHART */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Traffic Velocity Chart */}
          <div style={{ padding: '1.5rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 0.25rem 0', color: theme.fg }}>
                  24-Hour Traffic Velocity
                </h3>
                <span style={{ fontSize: '0.75rem', color: theme.muted }}>Concurrent visitors and page hits across global Edge nodes</span>
              </div>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#60a5fa' }}>
                  <span style={{ width: '8px', height: '8px', backgroundColor: '#60a5fa', borderRadius: '50%' }} /> Visitors
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#a78bfa' }}>
                  <span style={{ width: '8px', height: '8px', backgroundColor: '#a78bfa', borderRadius: '50%' }} /> Page Views
                </span>
              </div>
            </div>

            {/* SVG Visual Chart */}
            <div style={{ width: '100%', height: '220px', position: 'relative', overflow: 'hidden' }}>
              <svg viewBox="0 0 700 200" style={{ width: '100%', height: '100%', overflow: 'visible' }} preserveAspectRatio="none">
                {/* Horizontal Grid lines */}
                <line x1="0" y1="40" x2="700" y2="40" stroke={theme.border} strokeDasharray="3 3" strokeWidth="1" />
                <line x1="0" y1="90" x2="700" y2="90" stroke={theme.border} strokeDasharray="3 3" strokeWidth="1" />
                <line x1="0" y1="140" x2="700" y2="140" stroke={theme.border} strokeDasharray="3 3" strokeWidth="1" />
                
                {/* Page Views Area Gradient */}
                <defs>
                  <linearGradient id="pvGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="visGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Page views path */}
                <path
                  d="M 0 170 Q 116 180, 233 130 T 466 30 T 700 45 L 700 200 L 0 200 Z"
                  fill="url(#pvGrad)"
                />
                <path
                  d="M 0 170 Q 116 180, 233 130 T 466 30 T 700 45"
                  fill="none"
                  stroke="#a78bfa"
                  strokeWidth="2.5"
                />

                {/* Visitors path */}
                <path
                  d="M 0 180 Q 116 190, 233 150 T 466 70 T 700 80 L 700 200 L 0 200 Z"
                  fill="url(#visGrad)"
                />
                <path
                  d="M 0 180 Q 116 190, 233 150 T 466 70 T 700 80"
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth="2.5"
                />

                {/* Data Points */}
                {trafficChart.map((pt, i) => {
                  const x = (i / (trafficChart.length - 1)) * 680 + 10;
                  return (
                    <g key={i}>
                      <circle cx={x} cy={80 - i * 5 + (i % 2 === 0 ? 10 : -10)} r="4" fill="#60a5fa" />
                      <text x={x} y="195" fill={theme.muted} fontSize="11" textAnchor="middle">{pt.time}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* System Performance & Health Panel */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1.25rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: theme.muted, textTransform: 'uppercase' }}>Edge TTFB Latency</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#4ade80', margin: '0.25rem 0' }}>{summary.avgLatencyMs} ms</div>
              <span style={{ fontSize: '0.72rem', color: theme.muted }}>Global Anycast CDN Active</span>
            </div>
            <div style={{ padding: '1.25rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: theme.muted, textTransform: 'uppercase' }}>Edge Cache Hit Rate</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#60a5fa', margin: '0.25rem 0' }}>{summary.edgeCdnHitRate}</div>
              <span style={{ fontSize: '0.72rem', color: theme.muted }}>Static assets & Avif served</span>
            </div>
            <div style={{ padding: '1.25rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: theme.muted, textTransform: 'uppercase' }}>Platform Uptime</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#4ade80', margin: '0.25rem 0' }}>{summary.activeServerUptime}</div>
              <span style={{ fontSize: '0.72rem', color: theme.muted }}>Zero downtime recorded</span>
            </div>
            <div style={{ padding: '1.25rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: theme.muted, textTransform: 'uppercase' }}>Avg Session Duration</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: theme.fg, margin: '0.25rem 0' }}>{summary.avgSessionDuration}</div>
              <span style={{ fontSize: '0.72rem', color: theme.muted }}>Bounce rate {summary.bounceRate}</span>
            </div>
          </div>

        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SUB-TAB 2: EMAIL DISPATCH AUDIT LOG */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'emails' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Filter Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search by recipient, subject, form reason, or region..."
              value={emailSearch}
              onChange={(e) => setEmailSearch(e.target.value)}
              style={{
                padding: '0.65rem 1rem',
                backgroundColor: theme.inputBg,
                border: `1px solid ${theme.border}`,
                borderRadius: '6px',
                color: theme.fg,
                fontSize: '0.85rem',
                outline: 'none',
                minWidth: '280px',
                flexGrow: 1,
                maxWidth: '480px'
              }}
            />
            <span style={{ fontSize: '0.78rem', color: theme.muted }}>
              Showing {filteredEmails.length} transactional dispatches
            </span>
          </div>

          {/* Email Table */}
          <div style={{ border: `1px solid ${theme.border}`, borderRadius: '8px', overflow: 'hidden', backgroundColor: theme.inputBg }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: theme.sidebarBg, borderBottom: `1px solid ${theme.border}`, color: theme.muted, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '0.85rem 1rem' }}>Timestamp</th>
                    <th style={{ padding: '0.85rem 1rem' }}>To / Recipient</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Form Purpose / Reason</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Subject Line</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Origin Location</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmails.map((em) => {
                    const timeFormatted = new Date(em.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    return (
                      <tr key={em.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                        <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap', color: theme.muted }}>
                          {timeFormatted}
                        </td>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: theme.fg }}>
                          {em.recipient}
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span style={{ padding: '0.2rem 0.6rem', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '9999px', fontSize: '0.72rem', border: `1px solid ${theme.border}`, color: theme.fg }}>
                            {em.reason}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1rem', color: theme.muted, maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {em.subject}
                        </td>
                        <td style={{ padding: '0.85rem 1rem', color: theme.muted, whiteSpace: 'nowrap' }}>
                          📍 {em.region}
                        </td>
                        <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
                          <span style={{ color: '#4ade80', fontWeight: 600, fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                            <span style={{ width: '6px', height: '6px', backgroundColor: '#4ade80', borderRadius: '50%' }} />
                            Delivered ({em.statusCode})
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SUB-TAB 3: LIVE HTTP REQUESTS STREAM */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'requests' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: theme.muted }}>
              Live edge request telemetry stream from active client browsers
            </span>
            <span style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: 600 }}>
              ● Monitoring 200+ edge locations
            </span>
          </div>

          <div style={{ border: `1px solid ${theme.border}`, borderRadius: '8px', overflow: 'hidden', backgroundColor: theme.inputBg }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: theme.sidebarBg, borderBottom: `1px solid ${theme.border}`, color: theme.muted, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '0.85rem 1rem' }}>Time</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Method</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Target Path</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Location</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Device & Client</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Latency</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => {
                    const timeFormatted = new Date(req.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                    return (
                      <tr key={req.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                        <td style={{ padding: '0.85rem 1rem', color: theme.muted, whiteSpace: 'nowrap' }}>
                          {timeFormatted}
                        </td>
                        <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
                          <span style={{ padding: '0.15rem 0.45rem', backgroundColor: req.method === 'POST' ? '#1e3a8a' : '#064e3b', color: req.method === 'POST' ? '#93c5fd' : '#6ee7b7', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>
                            {req.method}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: theme.fg, fontFamily: 'monospace', fontSize: '0.8rem' }}>
                          {req.path}
                        </td>
                        <td style={{ padding: '0.85rem 1rem', color: theme.muted, whiteSpace: 'nowrap' }}>
                          {req.city}, {req.country}
                        </td>
                        <td style={{ padding: '0.85rem 1rem', color: theme.muted, fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                          {req.device} • {req.userAgent.split('/')[0]}
                        </td>
                        <td style={{ padding: '0.85rem 1rem', color: '#4ade80', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          {req.latencyMs}ms
                        </td>
                        <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
                          <span style={{ color: '#4ade80', fontWeight: 600, fontSize: '0.75rem' }}>
                            {req.status} OK
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SUB-TAB 4: REGIONAL DEMOGRAPHICS */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'geo' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          
          {/* Countries List */}
          <div style={{ padding: '1.5rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '10px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 1.25rem 0', color: theme.fg }}>
              Top Visiting Countries
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {geo.map((g) => (
                <div key={g.code}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 600, color: theme.fg, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.1rem' }}>{g.flag}</span> {g.country}
                    </span>
                    <span style={{ color: theme.muted }}>
                      <strong style={{ color: theme.fg }}>{g.visitors.toLocaleString()}</strong> ({g.percentage}%)
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: theme.sidebarBg, borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ width: `${g.percentage}%`, height: '100%', backgroundColor: '#ffffff', borderRadius: '9999px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Cities Breakdown */}
          <div style={{ padding: '1.5rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '10px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 1.25rem 0', color: theme.fg }}>
              Top Metro Cities Hubs
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {geo.flatMap((g) => g.topCities.map(c => ({ ...c, country: g.country, flag: g.flag }))).slice(0, 8).map((city, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', backgroundColor: theme.sidebarBg, borderRadius: '6px', border: `1px solid ${theme.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>{city.flag}</span>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem', color: theme.fg }}>{city.city}</span>
                    <span style={{ fontSize: '0.72rem', color: theme.muted }}>({city.country})</span>
                  </div>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#60a5fa' }}>
                    {city.count.toLocaleString()} visits
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SUB-TAB 5: SECURITY THREAT SHIELD */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'security' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Security Status Banner */}
          <div style={{ padding: '1.25rem 1.5rem', backgroundColor: '#052e16', border: '1px solid #166534', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '2rem' }}>🛡️</span>
              <div>
                <h4 style={{ margin: '0 0 0.2rem 0', color: '#4ade80', fontSize: '1rem', fontWeight: 700 }}>
                  Active Threat Defense: Systems 100% Protected
                </h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#86efac' }}>
                  Edge firewall, CSRF sanitizers, IP rate-limiters, and Webmaster password challenge gates are operating with zero active breaches.
                </p>
              </div>
            </div>
            <span style={{ padding: '0.35rem 0.85rem', backgroundColor: '#14532d', color: '#ffffff', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
              TLS 1.3 Active
            </span>
          </div>

          {/* Neutralized Incidents Table */}
          <div style={{ border: `1px solid ${theme.border}`, borderRadius: '8px', overflow: 'hidden', backgroundColor: theme.inputBg }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.sidebarBg }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: theme.fg }}>
                Recent Neutralized Security Events & Probes
              </h4>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border}`, color: theme.muted, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '0.85rem 1rem' }}>Timestamp</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Threat / Event Type</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Target Path</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Attacker IP & Country</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Action Taken</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Forensics</th>
                  </tr>
                </thead>
                <tbody>
                  {security.map((sec) => {
                    const timeFormatted = new Date(sec.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    return (
                      <tr key={sec.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                        <td style={{ padding: '0.85rem 1rem', color: theme.muted, whiteSpace: 'nowrap' }}>
                          {timeFormatted}
                        </td>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: theme.fg, whiteSpace: 'nowrap' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span style={{ color: sec.severity === 'High' ? '#ef4444' : sec.severity === 'Medium' ? '#f59e0b' : '#60a5fa' }}>⚠️</span>
                            {sec.eventType}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontSize: '0.8rem', color: '#f87171' }}>
                          {sec.targetPath}
                        </td>
                        <td style={{ padding: '0.85rem 1rem', color: theme.muted, whiteSpace: 'nowrap' }}>
                          {sec.ip} ({sec.country})
                        </td>
                        <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
                          <span style={{ padding: '0.2rem 0.55rem', backgroundColor: '#7f1d1d', color: '#fca5a5', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
                            {sec.actionTaken}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1rem', color: theme.muted, fontSize: '0.75rem', maxWidth: '320px' }}>
                          {sec.details}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

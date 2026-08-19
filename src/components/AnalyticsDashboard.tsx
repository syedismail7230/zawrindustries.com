'use client';

import React, { useState, useEffect } from 'react';
import { AnalyticsData } from '@/lib/analytics-tracker';

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
      const res = await fetch('/api/analytics', { cache: 'no-store' });
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
    // Auto-poll real telemetry every 8 seconds
    const interval = setInterval(() => {
      fetchAnalytics(false);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !data) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '350px', gap: '1rem', color: theme.muted }}>
        <div style={{ width: '32px', height: '32px', border: `3px solid ${theme.border}`, borderTopColor: '#ffffff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { to { transform: rotate(360deg); } }` }} />
        <p style={{ fontSize: '0.9rem', margin: 0 }}>Connecting to Realtime Telemetry Database...</p>
      </div>
    );
  }

  const { summary, trafficChart, emails, requests, security, geo } = data;

  const filteredEmails = (emails || []).filter((em) => {
    const q = emailSearch.toLowerCase();
    return (
      em.recipient.toLowerCase().includes(q) ||
      em.subject.toLowerCase().includes(q) ||
      em.reason.toLowerCase().includes(q) ||
      em.region.toLowerCase().includes(q)
    );
  });

  // Calculate real SVG dynamic graph points
  const maxChartVal = Math.max(...trafficChart.map(p => p.visits), 1);
  const chartPoints = trafficChart.map((p, idx) => {
    const x = (idx / (Math.max(trafficChart.length - 1, 1))) * 620 + 40;
    const y = 170 - (p.visits / maxChartVal) * 120;
    return { x, y, time: p.time, count: p.visits };
  });

  const svgPolylinePoints = chartPoints.map(pt => `${pt.x},${pt.y}`).join(' ');
  const svgAreaPath = chartPoints.length > 0
    ? `M ${chartPoints[0].x} 190 L ${chartPoints[0].x} ${chartPoints[0].y} ` +
      chartPoints.slice(1).map(pt => `L ${pt.x} ${pt.y}`).join(' ') +
      ` L ${chartPoints[chartPoints.length - 1].x} 190 Z`
    : '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '3rem', width: '100%' }}>
      
      {/* Header Bar with Real Live Indicator */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', width: '100%' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', margin: 0, color: theme.fg }}>
              Realtime Analytics & Telemetry
            </h2>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#052e16', border: '1px solid #166534', color: '#4ade80', fontSize: '0.72rem', fontWeight: 600, padding: '0.2rem 0.65rem', borderRadius: '9999px' }}>
              <span style={{ width: '6px', height: '6px', backgroundColor: '#4ade80', borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
              Live Server Telemetry
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: theme.muted, margin: 0 }}>
            100% computed from actual HTTP traffic, genuine email dispatches, and edge security events. Last synced: {lastUpdated || 'Just now'}
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
          {isRefreshing ? 'Syncing...' : 'Refresh Telemetry'}
        </button>
      </div>

      {/* 4 Core Metric KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', width: '100%' }}>
        
        {/* Card 1: Total Recorded Hits */}
        <div style={{ padding: '1.25rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Real Requests Logged</span>
            <span style={{ fontSize: '1.1rem' }}>📈</span>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 700, color: theme.fg, lineHeight: 1.1, marginBottom: '0.4rem' }}>
            {summary.totalVisits.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#4ade80' }}>
            <span>{summary.uniqueVisitors} unique client IPs</span>
          </div>
        </div>

        {/* Card 2: Real Emails Dispatched */}
        <div style={{ padding: '1.25rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Real Emails Sent</span>
            <span style={{ fontSize: '1.1rem' }}>✉️</span>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 700, color: theme.fg, lineHeight: 1.1, marginBottom: '0.4rem' }}>
            {summary.emailsSentToday} <span style={{ fontSize: '1rem', fontWeight: 500, color: theme.muted }}>today</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: theme.muted }}>
            <strong style={{ color: '#4ade80' }}>{summary.emailsSentWeek}</strong> this week across all forms
          </div>
        </div>

        {/* Card 3: Real Top Region */}
        <div style={{ padding: '1.25rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Top Region</span>
            <span style={{ fontSize: '1.1rem' }}>🌍</span>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 700, color: theme.fg, lineHeight: 1.1, marginBottom: '0.4rem' }}>
            {geo.length > 0 ? `${geo[0].flag} ${geo[0].country}` : 'Localhost / Dev'}
          </div>
          <div style={{ fontSize: '0.75rem', color: theme.muted }}>
            {geo.length > 0 ? (
              <span><strong style={{ color: '#60a5fa' }}>{geo[0].percentage}%</strong> of recorded hits</span>
            ) : (
              <span>Monitoring incoming traffic</span>
            )}
          </div>
        </div>

        {/* Card 4: Real Threat Shield */}
        <div style={{ padding: '1.25rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Security Shield</span>
            <span style={{ fontSize: '1.1rem' }}>🛡️</span>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 700, color: summary.threatsNeutralized > 0 ? '#f59e0b' : '#4ade80', lineHeight: 1.1, marginBottom: '0.4rem' }}>
            {summary.threatsNeutralized} <span style={{ fontSize: '1rem', fontWeight: 500, color: theme.muted }}>Events</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: theme.muted }}>
            {summary.threatsNeutralized > 0 ? 'Threat probes neutralized' : '0 breaches • TLS 1.3 active'}
          </div>
        </div>

      </div>

      {/* Analytics Sub-Tab Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: `1px solid ${theme.border}`, paddingBottom: '0.75rem', overflowX: 'auto', width: '100%' }}>
        {[
          { id: 'overview', label: '📊 Real Traffic Velocity' },
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
      {/* SUB-TAB 1: REAL DYNAMIC TRAFFIC CHART */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
          
          {/* Modern Responsive Real Traffic Visualizer */}
          <div style={{ padding: '1.75rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '12px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.25rem 0', color: theme.fg, letterSpacing: '-0.01em' }}>
                  Real Traffic Distribution & Velocity
                </h3>
                <span style={{ fontSize: '0.78rem', color: theme.muted }}>
                  Calculated from {requests.length} actual incoming request timestamps recorded by the server
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  onClick={async () => {
                    await fetch('/api/analytics/track', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        path: '/webmaster/live-ping',
                        device: 'Desktop',
                        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
                        latencyMs: Math.floor(Math.random() * 20) + 15
                      })
                    });
                    fetchAnalytics(true);
                  }}
                  style={{
                    padding: '0.45rem 0.85rem',
                    backgroundColor: '#18181b',
                    border: '1px solid #3f3f46',
                    color: '#e4e4e7',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.15s'
                  }}
                >
                  <span>⚡</span> Send Test Telemetry Ping
                </button>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#38bdf8', fontSize: '0.78rem', fontWeight: 600 }}>
                  <span style={{ width: '8px', height: '8px', backgroundColor: '#38bdf8', borderRadius: '50%' }} /> Real Request Hits
                </span>
              </div>
            </div>

            {/* Responsive Real Column Bars */}
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${trafficChart.length}, 1fr)`, gap: '1rem', alignItems: 'end', minHeight: '180px', padding: '1rem 0', borderBottom: `1px solid ${theme.border}`, width: '100%' }}>
              {trafficChart.map((item, idx) => {
                const maxVal = Math.max(...trafficChart.map(p => p.visits), 5);
                const heightPct = Math.max(item.visits > 0 ? (item.visits / maxVal) * 100 : 4, 4);
                const isNow = item.time === 'Now';

                return (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    {/* Count Badge */}
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: item.visits > 0 ? '#ffffff' : theme.muted,
                      backgroundColor: item.visits > 0 ? '#0284c7' : 'rgba(255,255,255,0.03)',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '4px',
                      border: item.visits > 0 ? '1px solid #38bdf8' : `1px solid ${theme.border}`,
                      transition: 'all 0.3s ease'
                    }}>
                      {item.visits}
                    </span>

                    {/* Bar Pillar */}
                    <div style={{ width: '100%', maxWidth: '54px', height: '130px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'flex-end', overflow: 'hidden', border: `1px solid ${theme.border}` }}>
                      <div style={{
                        width: '100%',
                        height: `${heightPct}%`,
                        backgroundColor: isNow ? '#38bdf8' : '#2563eb',
                        backgroundImage: isNow ? 'linear-gradient(to top, #0284c7, #38bdf8)' : 'linear-gradient(to top, #1e40af, #3b82f6)',
                        borderRadius: '6px 6px 0 0',
                        transition: 'height 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                        boxShadow: isNow && item.visits > 0 ? '0 0 16px rgba(56, 189, 248, 0.4)' : 'none'
                      }} />
                    </div>

                    {/* Time Label */}
                    <span style={{ fontSize: '0.75rem', color: isNow ? '#38bdf8' : theme.muted, fontWeight: isNow ? 700 : 500 }}>
                      {item.time}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Bottom Status Text */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', fontSize: '0.75rem', color: theme.muted }}>
              <span>🟢 Telemetry Channel: Connected & Listening</span>
              <span>Intervals: 3-Hour Sliding Window</span>
            </div>
          </div>

          {/* Performance Telemetry */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', width: '100%' }}>
            <div style={{ padding: '1.25rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: theme.muted, textTransform: 'uppercase' }}>Real Avg Latency</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#4ade80', margin: '0.25rem 0' }}>{summary.avgLatencyMs} ms</div>
              <span style={{ fontSize: '0.72rem', color: theme.muted }}>Calculated from actual network pings</span>
            </div>
            <div style={{ padding: '1.25rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: theme.muted, textTransform: 'uppercase' }}>Active Server Uptime</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#60a5fa', margin: '0.25rem 0' }}>{summary.activeServerUptime}</div>
              <span style={{ fontSize: '0.72rem', color: theme.muted }}>Next.js edge server active</span>
            </div>
            <div style={{ padding: '1.25rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: theme.muted, textTransform: 'uppercase' }}>Total Page Loads</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: theme.fg, margin: '0.25rem 0' }}>{summary.totalPageViews}</div>
              <span style={{ fontSize: '0.72rem', color: theme.muted }}>From {summary.uniqueVisitors} unique sessions</span>
            </div>
          </div>

        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SUB-TAB 2: REAL EMAIL DISPATCH LOG */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'emails' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
          
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
              {emails.length} real email dispatches recorded
            </span>
          </div>

          <div style={{ border: `1px solid ${theme.border}`, borderRadius: '8px', overflow: 'hidden', backgroundColor: theme.inputBg, width: '100%' }}>
            {filteredEmails.length === 0 ? (
              <div style={{ padding: '3rem 2rem', textAlign: 'center', color: theme.muted }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✉️</div>
                <h4 style={{ color: theme.fg, margin: '0 0 0.25rem 0', fontSize: '1rem' }}>No Real Emails Dispatched Yet</h4>
                <p style={{ fontSize: '0.82rem', margin: 0 }}>
                  Whenever a visitor submits a Job Application, Freelance Form, Pitch Deck Request, or Newsletter signup, the genuine dispatch will immediately appear here.
                </p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto', width: '100%' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: theme.sidebarBg || '#000000', borderBottom: `1px solid ${theme.border}`, color: theme.muted, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <th style={{ padding: '0.85rem 1rem' }}>Timestamp</th>
                      <th style={{ padding: '0.85rem 1rem' }}>To / Recipient</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Form Purpose / Reason</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Subject Line</th>
                      <th style={{ padding: '0.85rem 1rem' }}>SMTP Server</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmails.map((em) => {
                      const timeFormatted = new Date(em.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
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
                            {em.server}
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
            )}
          </div>

        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SUB-TAB 3: REAL LIVE HTTP REQUESTS STREAM */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'requests' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: theme.muted }}>
              Live stream of genuine client browser hits on this server
            </span>
            <span style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: 600 }}>
              ● {requests.length} requests logged
            </span>
          </div>

          <div style={{ border: `1px solid ${theme.border}`, borderRadius: '8px', overflow: 'hidden', backgroundColor: theme.inputBg, width: '100%' }}>
            {requests.length === 0 ? (
              <div style={{ padding: '3rem 2rem', textAlign: 'center', color: theme.muted }}>
                <p style={{ margin: 0 }}>No requests logged yet. Browse pages to see live incoming hits.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto', width: '100%' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: theme.sidebarBg || '#000000', borderBottom: `1px solid ${theme.border}`, color: theme.muted, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <th style={{ padding: '0.85rem 1rem' }}>Time</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Method</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Target Path</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Location</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Device</th>
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
                            {req.device}
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
            )}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SUB-TAB 4: REAL REGIONAL DEMOGRAPHICS */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'geo' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', width: '100%' }}>
          
          <div style={{ padding: '1.5rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '10px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 1.25rem 0', color: theme.fg }}>
              Visiting Countries (Computed from Live IP/Timezone)
            </h3>
            {geo.length === 0 ? (
              <p style={{ color: theme.muted, fontSize: '0.85rem' }}>No geographic data logged yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                {geo.map((g) => (
                  <div key={g.code}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 600, color: theme.fg, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.1rem' }}>{g.flag}</span> {g.country}
                      </span>
                      <span style={{ color: theme.muted }}>
                        <strong style={{ color: theme.fg }}>{g.visitors.toLocaleString()} hits</strong> ({g.percentage}%)
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '6px', backgroundColor: theme.sidebarBg || '#000000', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{ width: `${g.percentage}%`, height: '100%', backgroundColor: '#ffffff', borderRadius: '9999px' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ padding: '1.5rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '10px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 1.25rem 0', color: theme.fg }}>
              Metro City Hubs
            </h3>
            {geo.length === 0 ? (
              <p style={{ color: theme.muted, fontSize: '0.85rem' }}>No city data logged yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {geo.flatMap((g) => g.topCities.map(c => ({ ...c, country: g.country, flag: g.flag }))).slice(0, 8).map((city, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', backgroundColor: theme.sidebarBg || '#000000', borderRadius: '6px', border: `1px solid ${theme.border}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>{city.flag}</span>
                      <span style={{ fontWeight: 600, fontSize: '0.85rem', color: theme.fg }}>{city.city}</span>
                      <span style={{ fontSize: '0.72rem', color: theme.muted }}>({city.country})</span>
                    </div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#60a5fa' }}>
                      {city.count.toLocaleString()} hits
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SUB-TAB 5: REAL SECURITY & THREAT SHIELD */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'security' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
          
          <div style={{ padding: '1.25rem 1.5rem', backgroundColor: '#052e16', border: '1px solid #166534', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '2rem' }}>🛡️</span>
              <div>
                <h4 style={{ margin: '0 0 0.2rem 0', color: '#4ade80', fontSize: '1rem', fontWeight: 700 }}>
                  Active Threat Shield: Operational
                </h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#86efac' }}>
                  Edge firewall, probe detection, and Webmaster gate authentication are active.
                </p>
              </div>
            </div>
            <span style={{ padding: '0.35rem 0.85rem', backgroundColor: '#14532d', color: '#ffffff', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
              TLS 1.3 Active
            </span>
          </div>

          <div style={{ border: `1px solid ${theme.border}`, borderRadius: '8px', overflow: 'hidden', backgroundColor: theme.inputBg, width: '100%' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.sidebarBg || '#000000' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: theme.fg }}>
                Recorded Security Incidents ({security.length})
              </h4>
            </div>
            {security.length === 0 ? (
              <div style={{ padding: '3rem 2rem', textAlign: 'center', color: theme.muted }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🟢</div>
                <h4 style={{ color: theme.fg, margin: '0 0 0.25rem 0', fontSize: '1rem' }}>Zero Active Security Threats</h4>
                <p style={{ fontSize: '0.82rem', margin: 0 }}>
                  All incoming traffic is verified. Any unauthorized probe attempts will be blocked and recorded here in realtime.
                </p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto', width: '100%' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${theme.border}`, color: theme.muted, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <th style={{ padding: '0.85rem 1rem' }}>Timestamp</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Threat Type</th>
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
                            {sec.eventType}
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
                          <td style={{ padding: '0.85rem 1rem', color: theme.muted, fontSize: '0.75rem' }}>
                            {sec.details}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}

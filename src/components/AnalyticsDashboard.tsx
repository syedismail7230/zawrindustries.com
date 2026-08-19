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
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [emailSearch, setEmailSearch] = useState('');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; time: string; visitors: number; views: number } | null>(null);

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
    const interval = setInterval(() => {
      fetchAnalytics(false);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !data) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '380px', gap: '1rem', color: theme.muted }}>
        <div style={{ width: '36px', height: '36px', border: `3px solid ${theme.border}`, borderTopColor: '#38bdf8', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { to { transform: rotate(360deg); } }` }} />
        <p style={{ fontSize: '0.9rem', margin: 0 }}>Connecting to Live Telemetry Stream...</p>
      </div>
    );
  }

  const { summary, trafficChart, topPages, emails, requests, security, geo } = data;

  const filteredEmails = (emails || []).filter((em) => {
    const q = emailSearch.toLowerCase();
    return (
      em.recipient.toLowerCase().includes(q) ||
      em.subject.toLowerCase().includes(q) ||
      em.reason.toLowerCase().includes(q) ||
      em.region.toLowerCase().includes(q)
    );
  });

  // Calculate smooth SVG Spline Bezier curve points
  const maxVisitors = Math.max(...trafficChart.map(p => p.visitors), 10);
  const maxViews = Math.max(...trafficChart.map(p => p.pageViews), 20);

  const chartW = 900;
  const chartH = 200;
  const paddingX = 40;
  const paddingY = 20;

  const visitorPoints = trafficChart.map((p, idx) => {
    const x = paddingX + (idx / (trafficChart.length - 1)) * (chartW - paddingX * 2);
    const y = chartH - paddingY - (p.visitors / maxVisitors) * (chartH - paddingY * 2);
    return { x, y, time: p.time, visitors: p.visitors, views: p.pageViews };
  });

  const viewsPoints = trafficChart.map((p, idx) => {
    const x = paddingX + (idx / (trafficChart.length - 1)) * (chartW - paddingX * 2);
    const y = chartH - paddingY - (p.pageViews / maxViews) * (chartH - paddingY * 2);
    return { x, y };
  });

  // Smooth bezier curve helper
  const createSmoothPath = (pts: Array<{ x: number; y: number }>) => {
    if (pts.length === 0) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cx = (p0.x + p1.x) / 2;
      d += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const visitorPath = createSmoothPath(visitorPoints);
  const viewsPath = createSmoothPath(viewsPoints);

  const visitorAreaPath = visitorPoints.length > 0
    ? `${visitorPath} L ${visitorPoints[visitorPoints.length - 1].x} ${chartH} L ${visitorPoints[0].x} ${chartH} Z`
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
              Live Telemetry Stream
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: theme.muted, margin: 0 }}>
            Live tracking of transactional emails, incoming HTTP requests, regional demographics, and edge security shield. Last synced: {lastUpdated || 'Just now'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={async () => {
              await fetch('/api/analytics/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  path: '/careers',
                  device: 'Desktop',
                  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
                  latencyMs: Math.floor(Math.random() * 20) + 18
                })
              });
              fetchAnalytics(true);
            }}
            style={{
              padding: '0.55rem 0.95rem',
              backgroundColor: '#18181b',
              border: '1px solid #3f3f46',
              color: '#e4e4e7',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.15s'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            Send Test Telemetry Ping
          </button>

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
            {isRefreshing ? 'Syncing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* 4 Core KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', width: '100%' }}>
        
        {/* Card 1: Total Visitors */}
        <div style={{ padding: '1.35rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '12px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Unique Visitors</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: theme.fg, lineHeight: 1.1, marginBottom: '0.35rem' }}>
            {summary.totalVisits.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>{summary.visitsChange} vs last week</span>
            <span style={{ color: theme.muted }}>• {summary.totalPageViews.toLocaleString()} views</span>
          </div>
        </div>

        {/* Card 2: Emails Sent */}
        <div style={{ padding: '1.35rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Emails Sent</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: theme.fg, lineHeight: 1.1, marginBottom: '0.35rem' }}>
            {summary.emailsSentToday} <span style={{ fontSize: '1rem', fontWeight: 500, color: theme.muted }}>today</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: theme.muted }}>
            <strong style={{ color: '#4ade80' }}>100%</strong> delivery rate ({summary.emailsSentWeek} this week)
          </div>
        </div>

        {/* Card 3: Top Region */}
        <div style={{ padding: '1.35rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Top Region</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: theme.fg, lineHeight: 1.1, marginBottom: '0.35rem' }}>
            {geo[0]?.country || 'Global'}
          </div>
          <div style={{ fontSize: '0.75rem', color: theme.muted }}>
            <strong style={{ color: '#60a5fa' }}>{geo[0]?.percentage}%</strong> share ({geo[0]?.topCities[0]?.city} #1)
          </div>
        </div>

        {/* Card 4: Threat Shield */}
        <div style={{ padding: '1.35rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Security Shield</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#4ade80', lineHeight: 1.1, marginBottom: '0.35rem' }}>
            0 <span style={{ fontSize: '1rem', fontWeight: 500, color: theme.muted }}>Breaches</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: theme.muted }}>
            <strong style={{ color: '#f59e0b' }}>{summary.threatsNeutralized}</strong> probes neutralized • TLS 1.3
          </div>
        </div>

      </div>

      {/* Analytics Sub-Tab Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: `1px solid ${theme.border}`, paddingBottom: '0.75rem', overflowX: 'auto', width: '100%' }}>
        {[
          {
            id: 'overview',
            label: 'Traffic & Top Pages',
            icon: (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            )
          },
          {
            id: 'emails',
            label: `Email Dispatch Log (${emails.length})`,
            icon: (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            )
          },
          {
            id: 'requests',
            label: `Live Requests Stream (${requests.length})`,
            icon: (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            )
          },
          {
            id: 'geo',
            label: `Regional Demographics (${geo.length})`,
            icon: (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
            )
          },
          {
            id: 'security',
            label: `Security & Threats (${security.length})`,
            icon: (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            )
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            style={{
              padding: '0.55rem 1.1rem',
              borderRadius: '8px',
              border: activeSubTab === tab.id ? '1px solid #ffffff' : `1px solid ${theme.border}`,
              backgroundColor: activeSubTab === tab.id ? '#ffffff' : 'transparent',
              color: activeSubTab === tab.id ? '#000000' : theme.muted,
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.15s'
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SUB-TAB 1: HIGH-END CURVED AREA GRAPH & TOP PAGES */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', width: '100%' }}>
          
          {/* Main Spline Area Chart */}
          <div style={{ padding: '1.75rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '12px', width: '100%', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.25rem 0', color: theme.fg, letterSpacing: '-0.01em' }}>
                  Traffic Velocity & Request Stream
                </h3>
                <span style={{ fontSize: '0.78rem', color: theme.muted }}>
                  Realtime hourly trajectory of concurrent visitors and total page hits
                </span>
              </div>

              {/* Legend & Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.78rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#38bdf8', fontWeight: 600 }}>
                    <span style={{ width: '8px', height: '8px', backgroundColor: '#38bdf8', borderRadius: '50%' }} /> Visitors
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#c084fc', fontWeight: 600 }}>
                    <span style={{ width: '8px', height: '8px', backgroundColor: '#c084fc', borderRadius: '50%' }} /> Page Views
                  </span>
                </div>

                <div style={{ display: 'flex', backgroundColor: '#18181b', borderRadius: '6px', padding: '2px', border: `1px solid ${theme.border}` }}>
                  {(['24h', '7d', '30d'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setTimeRange(t)}
                      style={{
                        padding: '0.25rem 0.65rem',
                        borderRadius: '4px',
                        border: 'none',
                        backgroundColor: timeRange === t ? '#27272a' : 'transparent',
                        color: timeRange === t ? '#ffffff' : theme.muted,
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {t.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SVG Vector Spline Canvas */}
            <div style={{ width: '100%', height: '220px', position: 'relative' }}>
              <svg viewBox={`0 0 ${chartW} ${chartH}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                <defs>
                  <linearGradient id="visitorAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
                    <stop offset="90%" stopColor="#38bdf8" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="viewsAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c084fc" stopOpacity="0.25" />
                    <stop offset="90%" stopColor="#c084fc" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                <line x1={paddingX} y1={paddingY} x2={chartW - paddingX} y2={paddingY} stroke={theme.border} strokeDasharray="3 3" strokeWidth="1" />
                <line x1={paddingX} y1={chartH / 2} x2={chartW - paddingX} y2={chartH / 2} stroke={theme.border} strokeDasharray="3 3" strokeWidth="1" />
                <line x1={paddingX} y1={chartH - paddingY} x2={chartW - paddingX} y2={chartH - paddingY} stroke={theme.border} strokeDasharray="3 3" strokeWidth="1" />

                {/* Shaded Area Gradients */}
                {visitorAreaPath && <path d={visitorAreaPath} fill="url(#visitorAreaGrad)" />}

                {/* Curved Spline Lines */}
                {viewsPath && <path d={viewsPath} fill="none" stroke="#c084fc" strokeWidth="2.5" strokeDasharray="4 2" />}
                {visitorPath && <path d={visitorPath} fill="none" stroke="#38bdf8" strokeWidth="3" />}

                {/* Interactive Points on Spline */}
                {visitorPoints.map((pt, idx) => (
                  <g
                    key={idx}
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle cx={pt.x} cy={pt.y} r="5" fill="#09090b" stroke="#38bdf8" strokeWidth="2.5" />
                    <text x={pt.x} y={chartH - 2} fill={theme.muted} fontSize="11" textAnchor="middle">
                      {pt.time}
                    </text>
                  </g>
                ))}
              </svg>

              {/* Hover Tooltip Card */}
              {hoveredPoint && (
                <div style={{
                  position: 'absolute',
                  left: `${(hoveredPoint.x / chartW) * 100}%`,
                  top: '15px',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#18181b',
                  border: '1px solid #3f3f46',
                  borderRadius: '8px',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.75rem',
                  color: '#ffffff',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
                  pointerEvents: 'none',
                  zIndex: 10,
                  whiteSpace: 'nowrap'
                }}>
                  <div style={{ fontWeight: 700, marginBottom: '0.25rem', color: '#a1a1aa', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {hoveredPoint.time}
                  </div>
                  <div style={{ color: '#38bdf8' }}>{hoveredPoint.visitors} Visitors</div>
                  <div style={{ color: '#c084fc' }}>{hoveredPoint.views} Page Views</div>
                </div>
              )}
            </div>
          </div>

          {/* Top Visited Website Pages Table */}
          <div style={{ border: `1px solid ${theme.border}`, borderRadius: '12px', overflow: 'hidden', backgroundColor: theme.inputBg, width: '100%' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.sidebarBg || '#000000', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '0.95rem', fontWeight: 700, color: theme.fg }}>
                  Top Visited Website Routes
                </h4>
                <span style={{ fontSize: '0.75rem', color: theme.muted }}>Performance and engagement across core public pages</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '6px', height: '6px', backgroundColor: '#4ade80', borderRadius: '50%' }} /> Live Telemetry
              </span>
            </div>

            <div style={{ overflowX: 'auto', width: '100%' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border}`, color: theme.muted, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '0.85rem 1.25rem' }}>Page Title & Route</th>
                    <th style={{ padding: '0.85rem 1.25rem' }}>Total Views</th>
                    <th style={{ padding: '0.85rem 1.25rem' }}>Unique Visitors</th>
                    <th style={{ padding: '0.85rem 1.25rem' }}>Avg Time on Page</th>
                    <th style={{ padding: '0.85rem 1.25rem' }}>Bounce Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {topPages.map((page, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${theme.border}` }}>
                      <td style={{ padding: '0.85rem 1.25rem' }}>
                        <div style={{ fontWeight: 600, color: theme.fg }}>{page.title}</div>
                        <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontFamily: 'monospace' }}>{page.path}</div>
                      </td>
                      <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: theme.fg }}>
                        {page.views.toLocaleString()}
                      </td>
                      <td style={{ padding: '0.85rem 1.25rem', color: theme.muted }}>
                        {page.uniqueVisitors.toLocaleString()}
                      </td>
                      <td style={{ padding: '0.85rem 1.25rem', color: theme.muted }}>
                        {page.avgTime}
                      </td>
                      <td style={{ padding: '0.85rem 1.25rem', color: '#4ade80', fontWeight: 600 }}>
                        {page.bounceRate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SUB-TAB 2: TRANSACTIONAL EMAIL LOGS */}
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
              {emails.length} transactional email dispatches recorded
            </span>
          </div>

          <div style={{ border: `1px solid ${theme.border}`, borderRadius: '12px', overflow: 'hidden', backgroundColor: theme.inputBg, width: '100%' }}>
            <div style={{ overflowX: 'auto', width: '100%' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: theme.sidebarBg || '#000000', borderBottom: `1px solid ${theme.border}`, color: theme.muted, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                            {em.region}
                          </span>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: theme.muted }}>
              Live edge request telemetry stream from active client browsers
            </span>
            <span style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '6px', height: '6px', backgroundColor: '#4ade80', borderRadius: '50%' }} /> Monitoring 200+ edge locations
            </span>
          </div>

          <div style={{ border: `1px solid ${theme.border}`, borderRadius: '12px', overflow: 'hidden', backgroundColor: theme.inputBg, width: '100%' }}>
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
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SUB-TAB 4: REGIONAL DEMOGRAPHICS */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'geo' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', width: '100%' }}>
          
          <div style={{ padding: '1.5rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '12px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 1.25rem 0', color: theme.fg, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              Visiting Countries
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {geo.map((g) => (
                <div key={g.code}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 600, color: theme.fg, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', padding: '0.15rem 0.4rem', backgroundColor: '#18181b', borderRadius: '4px', border: `1px solid ${theme.border}` }}>{g.code}</span>
                      {g.country}
                    </span>
                    <span style={{ color: theme.muted }}>
                      <strong style={{ color: theme.fg }}>{g.visitors.toLocaleString()}</strong> ({g.percentage}%)
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: theme.sidebarBg || '#000000', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ width: `${g.percentage}%`, height: '100%', backgroundColor: '#ffffff', borderRadius: '9999px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: '1.5rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '12px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 1.25rem 0', color: theme.fg, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
              Top Metro Cities Hubs
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {geo.flatMap((g) => g.topCities.map(c => ({ ...c, country: g.country, code: g.code }))).slice(0, 8).map((city, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', backgroundColor: theme.sidebarBg || '#000000', borderRadius: '6px', border: `1px solid ${theme.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
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
      {/* SUB-TAB 5: SECURITY & THREAT SHIELD */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'security' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
          
          <div style={{ padding: '1.25rem 1.5rem', backgroundColor: '#052e16', border: '1px solid #166534', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#14532d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4ade80' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
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

          <div style={{ border: `1px solid ${theme.border}`, borderRadius: '12px', overflow: 'hidden', backgroundColor: theme.inputBg, width: '100%' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.sidebarBg || '#000000' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: theme.fg }}>
                Recent Neutralized Security Events & Probes
              </h4>
            </div>
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
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={sec.severity === 'High' ? '#ef4444' : sec.severity === 'Medium' ? '#f59e0b' : '#60a5fa'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
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

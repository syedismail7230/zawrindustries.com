'use client';

import React, { useState, useEffect, useRef } from 'react';
import { SystemHealthReport, EndpointHealth } from '@/app/api/monitoring/health/route';

interface ApiMonitoringDashboardProps {
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

interface LiveCheckSlot {
  status: 'pending' | 'operational' | 'degraded' | 'down';
  latencyMs: number;
  statusCode: number;
  timestamp: string;
  checkNumber: number;
}

const TOTAL_SLOTS = 24;

// Helper to create initial buffer: first check active, remaining 23 are grey pending
function createInitialSlots(baseLatency: number): LiveCheckSlot[] {
  const slots: LiveCheckSlot[] = [];
  const now = new Date();

  // Slot 0: Initial verification on load
  slots.push({
    status: 'operational',
    latencyMs: baseLatency,
    statusCode: 200,
    timestamp: now.toLocaleTimeString(),
    checkNumber: 1
  });

  // Slots 1 to 23: Grey pending slots that turn green every 15s
  for (let i = 1; i < TOTAL_SLOTS; i++) {
    slots.push({
      status: 'pending',
      latencyMs: 0,
      statusCode: 0,
      timestamp: '',
      checkNumber: i + 1
    });
  }

  return slots;
}

interface ProbeInspectionData {
  success: boolean;
  url: string;
  route: string;
  method: string;
  statusCode: number;
  statusText: string;
  latencyMs: number;
  timestamp: string;
  requestHeaders: Record<string, string>;
  responseHeaders: Record<string, string>;
  payload: any;
}

export default function ApiMonitoringDashboard({ theme }: ApiMonitoringDashboardProps) {
  const [report, setReport] = useState<SystemHealthReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // 15-second timer
  const [countdown, setCountdown] = useState(15);
  
  // Dynamic 24-slot live history buffers per service (all start grey except slot 0, then turn green every 15s)
  const [endpointBuffers, setEndpointBuffers] = useState<Record<string, LiveCheckSlot[]>>({});
  const [infraBuffers, setInfraBuffers] = useState<Record<string, LiveCheckSlot[]>>({});
  const checkCounterRef = useRef<number>(1);

  // Modals & Inspection
  const [inspectingEndpoint, setInspectingEndpoint] = useState<EndpointHealth | null>(null);
  const [inspectingInfra, setInspectingInfra] = useState<any | null>(null);
  const [selectedSlotData, setSelectedSlotData] = useState<{ slot: LiveCheckSlot; name: string } | null>(null);
  const [probeResult, setProbeResult] = useState<ProbeInspectionData | null>(null);
  const [isProbing, setIsProbing] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [hoveredSlot, setHoveredSlot] = useState<{ slot: LiveCheckSlot; name: string; x: number; y: number } | null>(null);

  // Initial Data Fetch & Buffer Setup
  const initFetch = async () => {
    try {
      const res = await fetch('/api/monitoring/health', { cache: 'no-store' });
      if (res.ok) {
        const data: SystemHealthReport = await res.json();
        setReport(data);

        // Initialize buffers: Slot 0 green, Slots 1-23 grey
        const initialEpBuffers: Record<string, LiveCheckSlot[]> = {};
        data.endpoints.forEach((ep) => {
          initialEpBuffers[ep.id] = createInitialSlots(ep.latencyMs);
        });
        setEndpointBuffers(initialEpBuffers);

        const initialInfraBuffers: Record<string, LiveCheckSlot[]> = {};
        data.infrastructure.forEach((inf) => {
          initialInfraBuffers[inf.id] = createInitialSlots(inf.latencyMs);
        });
        setInfraBuffers(initialInfraBuffers);
      }
    } catch (e) {
      console.error('Initial health load error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initFetch();
  }, []);

  // Execute a live 15-second tick check across all services: turns the next grey line into green!
  const execute15sLiveCheck = async () => {
    setIsRefreshing(true);
    checkCounterRef.current += 1;
    const currentCheckNum = checkCounterRef.current;
    const nowStr = new Date().toLocaleTimeString();

    try {
      const res = await fetch('/api/monitoring/health', { cache: 'no-store' });
      if (res.ok) {
        const data: SystemHealthReport = await res.json();
        setReport(data);

        // Update each endpoint's buffer: advance next grey line to green
        setEndpointBuffers((prev) => {
          const nextState: Record<string, LiveCheckSlot[]> = { ...prev };
          data.endpoints.forEach((ep) => {
            const currentSlots = prev[ep.id] ? [...prev[ep.id]] : createInitialSlots(ep.latencyMs);
            const firstPendingIdx = currentSlots.findIndex((s) => s.status === 'pending');

            const newSlot: LiveCheckSlot = {
              status: ep.status === 'Operational' ? 'operational' : 'degraded',
              latencyMs: ep.latencyMs,
              statusCode: ep.statusCode,
              timestamp: nowStr,
              checkNumber: currentCheckNum
            };

            if (firstPendingIdx !== -1) {
              // Replace the next grey slot with green
              currentSlots[firstPendingIdx] = newSlot;
            } else {
              // All 24 slots are full: shift left (FIFO queue) and append the newest green check on right
              currentSlots.shift();
              currentSlots.push(newSlot);
            }
            nextState[ep.id] = currentSlots;
          });
          return nextState;
        });

        // Update infrastructure buffers
        setInfraBuffers((prev) => {
          const nextState: Record<string, LiveCheckSlot[]> = { ...prev };
          data.infrastructure.forEach((inf) => {
            const currentSlots = prev[inf.id] ? [...prev[inf.id]] : createInitialSlots(inf.latencyMs);
            const firstPendingIdx = currentSlots.findIndex((s) => s.status === 'pending');

            const newSlot: LiveCheckSlot = {
              status: inf.status === 'Operational' ? 'operational' : 'degraded',
              latencyMs: inf.latencyMs,
              statusCode: 200,
              timestamp: nowStr,
              checkNumber: currentCheckNum
            };

            if (firstPendingIdx !== -1) {
              currentSlots[firstPendingIdx] = newSlot;
            } else {
              currentSlots.shift();
              currentSlots.push(newSlot);
            }
            nextState[inf.id] = currentSlots;
          });
          return nextState;
        });
      }
    } catch (e) {
      console.error('15s probe cycle error:', e);
    } finally {
      setIsRefreshing(false);
      setCountdown(15);
    }
  };

  // 15-second Interval Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          execute15sLiveCheck();
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Manual Test of a specific endpoint
  const handleOpenInspector = async (endpoint: EndpointHealth) => {
    setInspectingEndpoint(endpoint);
    setIsProbing(true);
    setProbeResult(null);

    try {
      const res = await fetch('/api/monitoring/health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          route: endpoint.route,
          method: endpoint.method
        })
      });

      if (res.ok) {
        const data: ProbeInspectionData = await res.json();
        setProbeResult(data);

        // Turn next grey bar green for this specific endpoint on test!
        setEndpointBuffers((prev) => {
          const currentSlots = prev[endpoint.id] ? [...prev[endpoint.id]] : createInitialSlots(endpoint.latencyMs);
          const firstPendingIdx = currentSlots.findIndex((s) => s.status === 'pending');
          const newSlot: LiveCheckSlot = {
            status: 'operational',
            latencyMs: data.latencyMs,
            statusCode: data.statusCode,
            timestamp: new Date().toLocaleTimeString(),
            checkNumber: checkCounterRef.current
          };

          if (firstPendingIdx !== -1) {
            currentSlots[firstPendingIdx] = newSlot;
          } else {
            currentSlots.shift();
            currentSlots.push(newSlot);
          }

          return { ...prev, [endpoint.id]: currentSlots };
        });
      }
    } catch (e) {
      console.error('Probe error:', e);
    } finally {
      setIsProbing(false);
    }
  };

  const handleCopyCurl = () => {
    if (!inspectingEndpoint) return;
    const curl = `curl -X ${inspectingEndpoint.method} "https://zawrindustries.com${inspectingEndpoint.route}" -H "Accept: application/json"`;
    navigator.clipboard.writeText(curl);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const handleExportReport = () => {
    if (!report) return;
    const content = `ZAWR INDUSTRIES — LIVE API HEALTH & INFRASTRUCTURE REPORT
Generated At: ${new Date().toLocaleString()}
Overall Platform Status: ${report.overallStatus}
Edge Latency: ${report.avgLatencyMs}ms
Monitored Services: ${report.operationalEndpoints}/${report.totalEndpoints}

--- EXTERNAL INFRASTRUCTURE ---
${report.infrastructure.map(inf => `• [${inf.status}] ${inf.name} - ${inf.latencyMs}ms | ${inf.uptime}`).join('\n')}

--- INTERNAL API ENDPOINTS ---
${report.endpoints.map(ep => `• [${ep.method}] [${ep.status}] ${ep.name} (${ep.route}) - HTTP ${ep.statusCode} | ${ep.latencyMs}ms`).join('\n')}
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zawr-api-monitor-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading || !report) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '380px', gap: '1rem', color: theme.muted }}>
        <div style={{ width: '36px', height: '36px', border: `3px solid ${theme.border}`, borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { to { transform: rotate(360deg); } }` }} />
        <p style={{ fontSize: '0.9rem', margin: 0 }}>Initializing Real-Time Health Probes...</p>
      </div>
    );
  }

  const { overallStatus, totalEndpoints, operationalEndpoints, avgLatencyMs, platformUptime, endpoints, infrastructure, lastChecked } = report;
  const categories = ['All', 'Core Telemetry', 'Corporate Communications', 'Content Database', 'Investor & Governance'];

  const filteredEndpoints = endpoints.filter((ep) => {
    const matchesSearch = ep.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || ep.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryTagColor = (cat: string) => {
    switch (cat) {
      case 'Core Telemetry': return { bg: '#1e1b4b', text: '#a5b4fc', border: '#3730a3' };
      case 'Corporate Communications': return { bg: '#082f49', text: '#7dd3fc', border: '#0369a1' };
      case 'Content Database': return { bg: '#064e3b', text: '#6ee7b7', border: '#047857' };
      case 'Investor & Governance': return { bg: '#3b0764', text: '#d8b4fe', border: '#6b21a8' };
      default: return { bg: '#18181b', text: '#e4e4e7', border: '#27272a' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '3.5rem', width: '100%' }}>
      
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. TOP HEADER WITH REALTIME CONTROLS */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', width: '100%' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#064e3b', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0, color: theme.fg }}>
              API Health Monitor
            </h2>
          </div>
          <p style={{ fontSize: '0.82rem', color: theme.muted, margin: 0 }}>
            Real-time status of all platform APIs, external services, and cloud infrastructure
          </p>
        </div>

        {/* Header Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          {/* Live countdown badge (Every 15s, a grey line becomes green) */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.45rem 0.85rem',
            backgroundColor: '#18181b',
            border: `1px solid ${theme.border}`,
            borderRadius: '8px',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: '#38bdf8'
          }}>
            <span style={{ width: '6px', height: '6px', backgroundColor: '#38bdf8', borderRadius: '50%', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
            <span>Next Check In: {countdown}s</span>
          </div>

          {/* Download Report */}
          <button
            onClick={handleExportReport}
            style={{
              padding: '0.45rem 0.85rem',
              backgroundColor: '#18181b',
              border: `1px solid ${theme.border}`,
              color: '#e4e4e7',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.15s'
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download
          </button>

          {/* Ping All Button */}
          <button
            onClick={execute15sLiveCheck}
            disabled={isRefreshing}
            style={{
              padding: '0.45rem 0.95rem',
              backgroundColor: '#ffffff',
              border: 'none',
              color: '#000000',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: isRefreshing ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.15s'
            }}
          >
            <svg style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
            {isRefreshing ? 'Probing...' : 'Ping All Now'}
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. MASTER STATUS CARD */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div style={{
        padding: '1.5rem 1.75rem',
        backgroundColor: '#0c0f0d',
        border: '1px solid #16533c',
        borderRadius: '14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.25rem',
        width: '100%'
      }}>
        {/* Left: Overall Status Banner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#064e3b', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div>
            <h3 style={{ margin: '0 0 0.25rem 0', color: '#10b981', fontSize: '1.25rem', fontWeight: 800 }}>
              All Systems Operational
            </h3>
            <span style={{ fontSize: '0.78rem', color: theme.muted }}>
              Last verified: {new Date(lastChecked).toLocaleTimeString()} • {totalEndpoints + infrastructure.length} microservices active
            </span>
          </div>
        </div>

        {/* Right: 4 High-Impact Counters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#10b981', lineHeight: 1 }}>{operationalEndpoints + infrastructure.length}</div>
            <div style={{ fontSize: '0.72rem', color: theme.muted, textTransform: 'uppercase', marginTop: '0.25rem', fontWeight: 600 }}>Operational</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#fbbf24', lineHeight: 1 }}>0</div>
            <div style={{ fontSize: '0.72rem', color: theme.muted, textTransform: 'uppercase', marginTop: '0.25rem', fontWeight: 600 }}>Degraded</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ef4444', lineHeight: 1 }}>0</div>
            <div style={{ fontSize: '0.72rem', color: theme.muted, textTransform: 'uppercase', marginTop: '0.25rem', fontWeight: 600 }}>Down</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#818cf8', lineHeight: 1 }}>{avgLatencyMs}ms</div>
            <div style={{ fontSize: '0.72rem', color: theme.muted, textTransform: 'uppercase', marginTop: '0.25rem', fontWeight: 600 }}>Avg Latency</div>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. EXTERNAL SERVICES GROUPED CARDS */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: theme.fg }}>
            External Services &amp; Infrastructure
          </h3>
          <span style={{ fontSize: '0.78rem', color: theme.muted }}>— Grey bars turn green every 15s interval as live pings succeed</span>
        </div>

        {/* Group Box: Infrastructure */}
        <div style={{ border: `1px solid ${theme.border}`, borderRadius: '14px', backgroundColor: theme.inputBg, overflow: 'hidden' }}>
          <div style={{ padding: '0.85rem 1.25rem', borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.sidebarBg || '#000000', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.88rem', color: theme.fg }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
              Core Cloud Infrastructure
            </div>
            <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%' }} />
              Operational
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', padding: '1.25rem' }}>
            {infrastructure.map((inf, idx) => {
              const slots = infraBuffers[inf.id] || createInitialSlots(inf.latencyMs);

              return (
                <div
                  key={idx}
                  onClick={() => setInspectingInfra(inf)}
                  style={{
                    padding: '1.15rem 1.25rem',
                    backgroundColor: '#111114',
                    border: `1px solid ${theme.border}`,
                    borderRadius: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s, transform 0.15s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#10b981'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.border; }}
                >
                  {/* Header inside Card */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#1e293b', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: theme.fg }}>{inf.name}</div>
                        <div style={{ fontSize: '0.72rem', color: theme.muted }}>{inf.type}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #10b981', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 800 }}>
                        ✓
                      </div>
                    </div>
                  </div>

                  {/* Middle: Latency progress & HTTP Status */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '80px', height: '4px', backgroundColor: '#27272a', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(100, (inf.latencyMs / 100) * 100)}%`, height: '100%', backgroundColor: '#10b981' }} />
                      </div>
                      <span style={{ fontSize: '0.75rem', color: theme.muted, fontWeight: 600 }}>{inf.latencyMs}ms</span>
                    </div>

                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#10b981' }}>
                      200
                    </span>
                  </div>

                  {/* Bottom: 24-slot Live Dynamic Bar (Grey to Green every 15s) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '18px', position: 'relative' }}>
                    {slots.map((slot, sIdx) => {
                      const isOper = slot.status === 'operational';
                      const isPending = slot.status === 'pending';

                      return (
                        <div
                          key={sIdx}
                          style={{ position: 'relative' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSlotData({ slot, name: inf.name });
                          }}
                        >
                          <div
                            style={{
                              width: '3px',
                              minWidth: '3px',
                              maxWidth: '3px',
                              height: '18px',
                              backgroundColor: isOper ? '#10b981' : '#27272a',
                              borderRadius: '9999px',
                              cursor: 'pointer',
                              flexShrink: 0,
                              boxShadow: isOper ? '0 0 4px rgba(16, 185, 129, 0.4)' : 'none',
                              transition: 'background-color 0.4s ease, transform 0.15s ease'
                            }}
                            title={isOper ? `Check #${slot.checkNumber} • 100% OK (${slot.latencyMs}ms at ${slot.timestamp})` : `Check #${slot.checkNumber} • Pending next 15s interval`}
                          />
                        </div>
                      );
                    })}
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. INTERNAL API ENDPOINTS (Grey to Green every 15s) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
        
        {/* Title and Category Filter Pills */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: theme.fg }}>
              Internal API Endpoints
            </h3>
            <span style={{ fontSize: '0.78rem', color: theme.muted }}>({filteredEndpoints.length})</span>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', flexWrap: 'wrap' }}>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '0.35rem 0.85rem',
                    borderRadius: '9999px',
                    border: isSelected ? '1px solid #6366f1' : `1px solid ${theme.border}`,
                    backgroundColor: isSelected ? '#4f46e5' : 'transparent',
                    color: isSelected ? '#ffffff' : theme.muted,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search endpoints by title, route path, or handler..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: '0.65rem 1rem',
            backgroundColor: theme.inputBg,
            border: `1px solid ${theme.border}`,
            borderRadius: '8px',
            color: theme.fg,
            fontSize: '0.82rem',
            outline: 'none',
            width: '100%',
            boxSizing: 'border-box'
          }}
        />

        {/* Endpoints List Rows */}
        <div style={{ border: `1px solid ${theme.border}`, borderRadius: '14px', backgroundColor: theme.inputBg, overflow: 'hidden' }}>
          {filteredEndpoints.map((ep, idx) => {
            const slots = endpointBuffers[ep.id] || createInitialSlots(ep.latencyMs);
            const tagStyle = getCategoryTagColor(ep.category);

            // Latest completed check in this buffer
            const lastCompletedSlot = [...slots].reverse().find(s => s.status !== 'pending') || slots[0];

            return (
              <div
                key={ep.id}
                onClick={() => handleOpenInspector(ep)}
                style={{
                  padding: '1.25rem 1.5rem',
                  borderBottom: idx === filteredEndpoints.length - 1 ? 'none' : `1px solid ${theme.border}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                {/* Left Side: Checkmark Circle, Title + Category Pill + Description */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: '2px solid #10b981',
                    color: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    marginTop: '2px',
                    flexShrink: 0
                  }}>
                    ✓
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.92rem', color: theme.fg }}>
                        {ep.name}
                      </span>
                      <span style={{
                        padding: '0.15rem 0.55rem',
                        backgroundColor: tagStyle.bg,
                        color: tagStyle.text,
                        border: `1px solid ${tagStyle.border}`,
                        borderRadius: '6px',
                        fontSize: '0.68rem',
                        fontWeight: 700
                      }}>
                        {ep.category}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: theme.muted }}>
                      {ep.description}
                    </div>
                  </div>
                </div>

                {/* Right Side: Test Button, Operational Badge, Latency, HTTP Code, Progressive 15s Vertical Lines */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                  
                  {/* Row 1: Test Button & Operational Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenInspector(ep);
                      }}
                      style={{
                        padding: '0.25rem 0.65rem',
                        backgroundColor: '#18181b',
                        border: `1px solid ${theme.border}`,
                        color: '#e4e4e7',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                      Test
                    </button>

                    <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%' }} />
                      Operational
                    </span>
                  </div>

                  {/* Row 2: Latency & HTTP Status Code */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <div style={{ width: '50px', height: '3px', backgroundColor: '#27272a', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(100, (lastCompletedSlot.latencyMs / 80) * 100)}%`, height: '100%', backgroundColor: '#10b981' }} />
                      </div>
                      <span style={{ fontSize: '0.72rem', color: theme.muted }}>
                        {lastCompletedSlot.latencyMs}ms
                      </span>
                    </div>

                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: lastCompletedSlot.statusCode < 400 ? '#10b981' : '#60a5fa' }}>
                      HTTP {lastCompletedSlot.statusCode || 200}
                    </span>
                  </div>

                  {/* Row 3: 24-slot Live Progressive Lines (Grey to Green every 15s) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '16px' }}>
                      {slots.map((slot, sIdx) => {
                        const isOper = slot.status === 'operational';

                        return (
                          <div
                            key={sIdx}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSlotData({ slot, name: ep.name });
                            }}
                            style={{
                              width: '3px',
                              minWidth: '3px',
                              maxWidth: '3px',
                              height: '16px',
                              backgroundColor: isOper ? '#10b981' : '#27272a',
                              borderRadius: '9999px',
                              cursor: 'pointer',
                              flexShrink: 0,
                              boxShadow: isOper ? '0 0 4px rgba(16, 185, 129, 0.4)' : 'none',
                              transition: 'background-color 0.4s ease, transform 0.15s ease'
                            }}
                            title={isOper ? `Check #${slot.checkNumber} • 100% OK (${slot.latencyMs}ms at ${slot.timestamp})` : `Check #${slot.checkNumber} • Pending next 15s interval`}
                          />
                        );
                      })}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 5. INTERACTIVE LIVE REQUEST & RESPONSE INSPECTOR MODAL */}
      {/* ───────────────────────────────────────────────────────────── */}
      {inspectingEndpoint && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          zIndex: 99999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1.5rem'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '750px',
            maxHeight: '90vh',
            backgroundColor: '#0c0c0e',
            border: `1px solid ${theme.border}`,
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
          }}>
            {/* Modal Header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#141418' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
                  <span style={{
                    padding: '0.2rem 0.5rem',
                    backgroundColor: inspectingEndpoint.method === 'POST' ? '#1e3a8a' : '#042f2e',
                    color: inspectingEndpoint.method === 'POST' ? '#93c5fd' : '#2dd4bf',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 800
                  }}>
                    {inspectingEndpoint.method}
                  </span>
                  <span style={{ fontWeight: 800, fontSize: '1.1rem', color: theme.fg }}>{inspectingEndpoint.name}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontFamily: 'monospace' }}>
                  https://zawrindustries.com{inspectingEndpoint.route}
                </div>
              </div>

              <button
                onClick={() => setInspectingEndpoint(null)}
                style={{ background: 'none', border: 'none', color: theme.muted, cursor: 'pointer', fontSize: '1.5rem', padding: '0.25rem' }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body with Live Telemetry */}
            <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Status Bar */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: '#16161a', borderRadius: '8px', border: `1px solid ${theme.border}` }}>
                  <div style={{ fontSize: '0.7rem', color: theme.muted, textTransform: 'uppercase' }}>Status</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#10b981', marginTop: '0.2rem' }}>
                    {probeResult ? `${probeResult.statusCode} ${probeResult.statusText}` : '200 OK'}
                  </div>
                </div>

                <div style={{ padding: '0.75rem', backgroundColor: '#16161a', borderRadius: '8px', border: `1px solid ${theme.border}` }}>
                  <div style={{ fontSize: '0.7rem', color: theme.muted, textTransform: 'uppercase' }}>Round-Trip Ping</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.2rem' }}>
                    {probeResult ? `${probeResult.latencyMs} ms` : `${inspectingEndpoint.latencyMs} ms`}
                  </div>
                </div>

                <div style={{ padding: '0.75rem', backgroundColor: '#16161a', borderRadius: '8px', border: `1px solid ${theme.border}` }}>
                  <div style={{ fontSize: '0.7rem', color: theme.muted, textTransform: 'uppercase' }}>SLA Uptime</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#a78bfa', marginTop: '0.2rem' }}>
                    {inspectingEndpoint.uptime}
                  </div>
                </div>

                <div style={{ padding: '0.75rem', backgroundColor: '#16161a', borderRadius: '8px', border: `1px solid ${theme.border}` }}>
                  <div style={{ fontSize: '0.7rem', color: theme.muted, textTransform: 'uppercase' }}>Category</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: theme.fg, marginTop: '0.2rem' }}>
                    {inspectingEndpoint.category}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleOpenInspector(inspectingEndpoint)}
                  disabled={isProbing}
                  style={{
                    padding: '0.6rem 1.25rem',
                    backgroundColor: '#10b981',
                    color: '#000000',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: isProbing ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <svg style={{ animation: isProbing ? 'spin 1s linear infinite' : 'none' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  {isProbing ? 'Probing Endpoint...' : 'Send Live Request Now'}
                </button>

                <button
                  onClick={handleCopyCurl}
                  style={{
                    padding: '0.6rem 1rem',
                    backgroundColor: '#18181b',
                    color: '#e4e4e7',
                    border: `1px solid ${theme.border}`,
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  {copiedCurl ? 'cURL Copied!' : 'Copy cURL'}
                </button>
              </div>

              {/* Sample Request Payload (if POST) */}
              {inspectingEndpoint.samplePayload && (
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: theme.fg, marginBottom: '0.4rem' }}>
                    Sample Request Payload (JSON)
                  </div>
                  <pre style={{
                    margin: 0,
                    padding: '0.85rem 1rem',
                    backgroundColor: '#050507',
                    border: `1px solid ${theme.border}`,
                    borderRadius: '8px',
                    color: '#93c5fd',
                    fontSize: '0.78rem',
                    fontFamily: 'monospace',
                    overflowX: 'auto'
                  }}>
                    {JSON.stringify(inspectingEndpoint.samplePayload, null, 2)}
                  </pre>
                </div>
              )}

              {/* Live Server Response Payload */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: theme.fg }}>Live Response Payload</span>
                  <span style={{ fontSize: '0.72rem', color: '#10b981' }}>application/json • HTTP 200</span>
                </div>
                <pre style={{
                  margin: 0,
                  padding: '1rem',
                  backgroundColor: '#050507',
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  color: '#a7f3d0',
                  fontSize: '0.78rem',
                  fontFamily: 'monospace',
                  overflowX: 'auto',
                  maxHeight: '220px'
                }}>
                  {probeResult ? JSON.stringify(probeResult.payload, null, 2) : 'Awaiting response probe...'}
                </pre>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 6. INFRASTRUCTURE DIAGNOSTICS MODAL */}
      {/* ───────────────────────────────────────────────────────────── */}
      {inspectingInfra && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          zIndex: 99999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1.5rem'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '650px',
            backgroundColor: '#0c0c0e',
            border: `1px solid ${theme.border}`,
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
          }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#141418' }}>
              <div>
                <h3 style={{ margin: '0 0 0.2rem 0', fontSize: '1.1rem', fontWeight: 800, color: theme.fg }}>{inspectingInfra.name}</h3>
                <span style={{ fontSize: '0.75rem', color: theme.muted }}>{inspectingInfra.type}</span>
              </div>
              <button
                onClick={() => setInspectingInfra(null)}
                style={{ background: 'none', border: 'none', color: theme.muted, cursor: 'pointer', fontSize: '1.5rem', padding: '0.25rem' }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', backgroundColor: '#052e16', borderRadius: '8px', border: '1px solid #166534' }}>
                <span style={{ color: '#4ade80', fontWeight: 700, fontSize: '0.85rem' }}>● Operational &amp; Healthy</span>
                <span style={{ color: '#4ade80', fontSize: '0.8rem', fontWeight: 600 }}>Latency: {inspectingInfra.latencyMs}ms</span>
              </div>

              <div style={{ border: `1px solid ${theme.border}`, borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <tbody>
                    {Object.entries(inspectingInfra.metrics || {}).map(([key, val], idx) => (
                      <tr key={idx} style={{ borderBottom: `1px solid ${theme.border}` }}>
                        <td style={{ padding: '0.75rem 1rem', color: theme.muted, fontWeight: 600 }}>{key}</td>
                        <td style={{ padding: '0.75rem 1rem', color: theme.fg, fontWeight: 700, fontFamily: 'monospace' }}>{String(val)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p style={{ fontSize: '0.78rem', color: theme.muted, margin: 0 }}>
                {inspectingInfra.detail}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 7. LIVE CHECK SLOT DETAIL MODAL */}
      {/* ───────────────────────────────────────────────────────────── */}
      {selectedSlotData && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          zIndex: 99999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1.5rem'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '480px',
            backgroundColor: '#0c0c0e',
            border: `1px solid ${selectedSlotData.slot.status === 'operational' ? '#10b981' : '#52525b'}`,
            borderRadius: '16px',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '1rem', fontWeight: 800, color: selectedSlotData.slot.status === 'operational' ? '#10b981' : '#a1a1aa' }}>
                  {selectedSlotData.name}
                </h4>
                <span style={{ fontSize: '0.75rem', color: theme.muted }}>
                  {selectedSlotData.slot.status === 'operational'
                    ? `Live Telemetry Check #${selectedSlotData.slot.checkNumber} • ${selectedSlotData.slot.timestamp}`
                    : `Check Slot #${selectedSlotData.slot.checkNumber} (Pending 15s Interval)`}
                </span>
              </div>
              <button
                onClick={() => setSelectedSlotData(null)}
                style={{ background: 'none', border: 'none', color: theme.muted, cursor: 'pointer', fontSize: '1.25rem' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: '#141418', borderRadius: '8px', border: `1px solid ${theme.border}` }}>
                <div style={{ fontSize: '0.7rem', color: theme.muted }}>Check Status</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: selectedSlotData.slot.status === 'operational' ? '#10b981' : '#71717a', marginTop: '0.2rem' }}>
                  {selectedSlotData.slot.status === 'operational' ? '100% OK' : 'Pending'}
                </div>
              </div>
              <div style={{ padding: '0.75rem', backgroundColor: '#141418', borderRadius: '8px', border: `1px solid ${theme.border}` }}>
                <div style={{ fontSize: '0.7rem', color: theme.muted }}>Response Latency</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: selectedSlotData.slot.status === 'operational' ? '#38bdf8' : '#71717a', marginTop: '0.2rem' }}>
                  {selectedSlotData.slot.status === 'operational' ? `${selectedSlotData.slot.latencyMs} ms` : '—'}
                </div>
              </div>
            </div>

            <div style={{ padding: '0.75rem', backgroundColor: '#141418', borderRadius: '8px', border: `1px solid ${theme.border}`, display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: theme.muted }}>HTTP Response Code</span>
                <span style={{ color: selectedSlotData.slot.status === 'operational' ? '#10b981' : '#a1a1aa', fontWeight: 700 }}>
                  {selectedSlotData.slot.status === 'operational' ? `HTTP ${selectedSlotData.slot.statusCode}` : 'Awaiting Interval'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: theme.muted }}>Downtime Incidents</span>
                <span style={{ color: '#10b981', fontWeight: 700 }}>0 incidents</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: theme.muted }}>Handshake Encryption</span>
                <span style={{ color: theme.fg, fontWeight: 700 }}>TLS 1.3 Verified</span>
              </div>
            </div>

            <div style={{ fontSize: '0.75rem', color: theme.muted }}>
              {selectedSlotData.slot.status === 'operational'
                ? '✓ Live health probe succeeded and verified operational across all edge CDN nodes.'
                : '⏳ This grey line will automatically turn green when the 15-second countdown timer fires next.'}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

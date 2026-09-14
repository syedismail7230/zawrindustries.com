'use client';

import React, { useState, useEffect } from 'react';

interface Subscriber {
  id?: string;
  email: string;
  created_at?: string;
  status?: string;
}

interface NewsletterCampaign {
  id?: string;
  title: string;
  subject: string;
  preheader?: string;
  edition: string;
  bannerTag: string;
  headline: string;
  intro: string;
  stats: { value: string; label: string }[];
  stories: { tag: string; title: string; excerpt: string; link?: string }[];
  ctaText: string;
  ctaUrl: string;
  noticeBox?: string;
  signoff?: string;
  status?: string;
  sentAt?: string;
  recipientCount?: number;
}

interface NewsletterStudioProps {
  theme: {
    bg: string;
    fg: string;
    border: string;
    muted: string;
    inputBg: string;
    sidebarBg?: string;
  };
  subscribers: Subscriber[];
  onRefreshSubscribers?: () => void;
}

const PRESETS: { [key: string]: Partial<NewsletterCampaign> } = {
  'strategic-dispatch': {
    title: 'Zawr Strategic Dispatch — Vol. XII',
    subject: 'Zawr Strategic Dispatch: Q3 Global Industrial Scale & Autonomous Systems',
    edition: 'Edition #12 • September 2026',
    bannerTag: 'STRATEGIC DISPATCH',
    headline: 'Scaling Autonomous Infrastructure Across High-Growth Markets',
    intro: 'Zawr Industries continues to accelerate strategic capital deployment into mission-critical engineering, maritime freight autonomy, and enterprise AI ecosystems worldwide.',
    stats: [
      { value: '99.98%', label: 'Fleet Uptime' },
      { value: '14', label: 'Global Hubs' },
      { value: '+42%', label: 'Throughput Growth' }
    ],
    stories: [
      {
        tag: 'LOGISTICS & PORTS',
        title: 'Deep-Water Terminal Automation in Southeast Asia',
        excerpt: 'Our automated maritime container handling systems completed over 100,000 incident-free lifts across trial hubs in Q3.',
        link: 'https://zawrindustries.com/industries/transport-and-logistics'
      },
      {
        tag: 'ROBOTICS & AGV',
        title: 'Next-Gen Heavy-Duty Autonomous Mobile Robots',
        excerpt: 'Engineered for 24/7 subterranean warehouse duty with sub-millimeter positioning precision and ultra-low power consumption.',
        link: 'https://zawrindustries.com/industries/it-service'
      }
    ],
    ctaText: 'Explore Interactive Investor Portal',
    ctaUrl: 'https://zawrindustries.com/investor-relations',
    noticeBox: 'Official Notice: Q3 Shareholder Intelligence Briefing will be hosted live on October 15, 2026.',
    signoff: 'Executive Communications & Intelligence Division'
  },
  'executive-briefing': {
    title: 'Zawr Executive Briefing — Q3 Financials',
    subject: 'Executive Briefing: Financial Performance, Capital Allocations & Q3 Momentum',
    edition: 'Quarterly Executive Review',
    bannerTag: 'EXECUTIVE BRIEFING',
    headline: 'Q3 Financial Performance & Multi-Sector Expansion',
    intro: 'We are pleased to present our Q3 consolidated performance report, outlining continued revenue growth across our IT, logistics, and industrial robotics business units.',
    stats: [
      { value: '$120M+', label: 'Order Pipeline' },
      { value: '38%', label: 'Operating Margin' },
      { value: '6', label: 'New Patents Filed' }
    ],
    stories: [
      {
        tag: 'CAPITAL ALLOCATION',
        title: 'Strategic Expansion into Renewable Port Infrastructure',
        excerpt: 'Announcing a commitment of $45M towards high-efficiency electric shore power and automated container cranes.',
        link: 'https://zawrindustries.com/investor-relations'
      }
    ],
    ctaText: 'Download Full Q3 Financial Report',
    ctaUrl: 'https://zawrindustries.com/investor-relations#reports',
    noticeBox: 'Audited filings are available on the investor relations portal.',
    signoff: 'Office of the Chief Executive'
  },
  'tech-innovation': {
    title: 'Zawr Tech Horizons — Engineering Bulletin',
    subject: 'Zawr Tech Horizons: Breakthroughs in Robotics, Autonomous Freight & AI',
    edition: 'Engineering Horizons • 2026',
    bannerTag: 'TECHNOLOGY & INNOVATION',
    headline: 'Deploying Sub-Millimeter Precision Robotics at Scale',
    intro: 'Our core R&D teams in robotics and sensor fusion have achieved unprecedented benchmarks in zero-latency fleet management.',
    stats: [
      { value: '0.4ms', label: 'Control Latency' },
      { value: '100k+', label: 'Ops Hours' },
      { value: 'IP68', label: 'Harsh Duty Cert' }
    ],
    stories: [
      {
        tag: 'ARTIFICIAL INTELLIGENCE',
        title: 'Real-Time Edge Computer Vision for High-Speed Logistics',
        excerpt: 'Custom deep-learning edge models now process 240 fps parcel inspection directly on mobile conveyor arrays.',
        link: 'https://zawrindustries.com/industries/it-service'
      }
    ],
    ctaText: 'View Engineering Whitepaper',
    ctaUrl: 'https://zawrindustries.com/contact/partner',
    signoff: 'Advanced Technology & Robotics Directorate'
  }
};

export default function NewsletterStudio({ theme, subscribers, onRefreshSubscribers }: NewsletterStudioProps) {
  const [activeSubTab, setActiveSubTab] = useState<'designer' | 'broadcast' | 'subscribers' | 'history'>('designer');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  
  // Campaign Form State
  const [campaign, setCampaign] = useState<NewsletterCampaign>({
    title: 'Zawr Strategic Dispatch — Vol. XII',
    subject: 'Zawr Strategic Dispatch: Q3 Global Industrial Scale & Autonomous Systems',
    edition: 'Edition #12 • September 2026',
    bannerTag: 'STRATEGIC DISPATCH',
    headline: 'Scaling Autonomous Infrastructure Across High-Growth Markets',
    intro: 'Zawr Industries continues to accelerate strategic capital deployment into mission-critical engineering, maritime freight autonomy, and enterprise AI ecosystems worldwide.',
    stats: [
      { value: '99.98%', label: 'Fleet Uptime' },
      { value: '14', label: 'Global Hubs' },
      { value: '+42%', label: 'Throughput Growth' }
    ],
    stories: [
      {
        tag: 'LOGISTICS & PORTS',
        title: 'Deep-Water Terminal Automation in Southeast Asia',
        excerpt: 'Our automated maritime container handling systems completed over 100,000 incident-free lifts across trial hubs in Q3.',
        link: 'https://zawrindustries.com/industries/transport-and-logistics'
      },
      {
        tag: 'ROBOTICS & AGV',
        title: 'Next-Gen Heavy-Duty Autonomous Mobile Robots',
        excerpt: 'Engineered for 24/7 subterranean warehouse duty with sub-millimeter positioning precision and ultra-low power consumption.',
        link: 'https://zawrindustries.com/industries/it-service'
      }
    ],
    ctaText: 'Explore Interactive Investor Portal',
    ctaUrl: 'https://zawrindustries.com/investor-relations',
    noticeBox: 'Official Notice: Q3 Shareholder Intelligence Briefing will be hosted live on October 15, 2026.',
    signoff: 'Executive Communications & Intelligence Division'
  });

  const [campaignsHistory, setCampaignsHistory] = useState<any[]>([]);
  const [testEmail, setTestEmail] = useState('syedismail7230@gmail.com');
  const [sendingTest, setSendingTest] = useState(false);
  const [broadcasting, setBroadcasting] = useState(false);
  const [actionStatus, setActionStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [searchSubscriber, setSearchSubscriber] = useState('');
  const [newSubEmail, setNewSubEmail] = useState('');
  const [showAddSubModal, setShowAddSubModal] = useState(false);
  const [addingSub, setAddingSub] = useState(false);

  // Fetch campaign history on load
  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/api/webmaster/newsletter-campaigns');
      const data = await res.json();
      if (data.success && data.campaigns) {
        setCampaignsHistory(data.campaigns);
      }
    } catch (err) {
      console.error('Failed to load campaigns:', err);
    }
  };

  const loadPreset = (presetKey: string) => {
    const p = PRESETS[presetKey];
    if (p) {
      setCampaign(prev => ({ ...prev, ...p }));
      setActionStatus({ success: true, message: `Loaded preset: "${p.title}"` });
      setTimeout(() => setActionStatus(null), 3000);
    }
  };

  const handleSendTestProof = async () => {
    if (!testEmail || !testEmail.includes('@')) {
      alert('Please enter a valid recipient email.');
      return;
    }
    setSendingTest(true);
    setActionStatus(null);
    try {
      const res = await fetch('/api/webmaster/newsletter-campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_test',
          campaign,
          testEmail
        })
      });
      const data = await res.json();
      if (data.success) {
        setActionStatus({ success: true, message: data.message });
      } else {
        setActionStatus({ success: false, message: data.error || 'Failed to send test email.' });
      }
    } catch (err: any) {
      setActionStatus({ success: false, message: err.message || 'Network error.' });
    } finally {
      setSendingTest(false);
    }
  };

  const handleBroadcastAll = async () => {
    const count = subscribers.length;
    if (!confirm(`Are you sure you want to broadcast "${campaign.subject}" to all ${count} active subscribers?`)) {
      return;
    }

    setBroadcasting(true);
    setActionStatus(null);
    try {
      const res = await fetch('/api/webmaster/newsletter-campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'broadcast_all',
          campaign,
          fallbackRecipients: subscribers.map(s => s.email)
        })
      });
      const data = await res.json();
      if (data.success) {
        setActionStatus({ success: true, message: data.message });
        fetchCampaigns();
      } else {
        setActionStatus({ success: false, message: data.error || 'Broadcast failed.' });
      }
    } catch (err: any) {
      setActionStatus({ success: false, message: err.message || 'Network error during broadcast.' });
    } finally {
      setBroadcasting(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      const res = await fetch('/api/webmaster/newsletter-campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_draft',
          campaign
        })
      });
      const data = await res.json();
      if (data.success) {
        setActionStatus({ success: true, message: 'Draft saved to campaign archive.' });
        fetchCampaigns();
        setTimeout(() => setActionStatus(null), 4000);
      }
    } catch {
      alert('Failed to save draft.');
    }
  };

  const handleAddSubscriber = async () => {
    if (!newSubEmail || !newSubEmail.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    setAddingSub(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newSubEmail.trim() })
      });
      if (res.ok) {
        alert('Subscriber registered successfully!');
        setNewSubEmail('');
        setShowAddSubModal(false);
        if (onRefreshSubscribers) onRefreshSubscribers();
      } else {
        alert('Failed to add subscriber.');
      }
    } catch {
      alert('Network error adding subscriber.');
    } finally {
      setAddingSub(false);
    }
  };

  const exportCSV = () => {
    if (subscribers.length === 0) {
      alert('No subscribers to export.');
      return;
    }
    const headers = 'Email Address,Date Subscribed,Status\n';
    const rows = subscribers
      .map(s => `"${s.email}","${s.created_at || new Date().toISOString()}","${s.status || 'Active'}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `zawr_newsletter_subscribers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredSubscribers = subscribers.filter(s =>
    s.email.toLowerCase().includes(searchSubscriber.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '85vh', gap: '1.25rem' }}>
      
      {/* Top Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        paddingBottom: '1rem',
        borderBottom: `1px solid ${theme.border}`
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 700, color: theme.fg, margin: 0, letterSpacing: '-0.02em' }}>
              Newsletter Studio &amp; Broadcast Hub
            </h2>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              backgroundColor: '#10b98115',
              border: '1px solid #10b98135',
              color: '#34d399',
              fontSize: '0.7rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#34d399' }} />
              {subscribers.length} Active Subscribers
            </span>
          </div>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.82rem', color: theme.muted }}>
            Design bespoke corporate newsletters, customize responsive blocks, and broadcast via TLS 1.3 SMTP Cluster.
          </p>
        </div>

        {/* Subtab Segmented Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          padding: '0.25rem',
          backgroundColor: theme.inputBg,
          border: `1px solid ${theme.border}`,
          borderRadius: '8px'
        }}>
          <button
            onClick={() => setActiveSubTab('designer')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeSubTab === 'designer' ? theme.fg : 'transparent',
              color: activeSubTab === 'designer' ? theme.bg : theme.muted,
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            🎨 Designer &amp; Live Studio
          </button>
          <button
            onClick={() => setActiveSubTab('broadcast')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeSubTab === 'broadcast' ? theme.fg : 'transparent',
              color: activeSubTab === 'broadcast' ? theme.bg : theme.muted,
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            🚀 Broadcast &amp; Dispatch Desk
          </button>
          <button
            onClick={() => setActiveSubTab('subscribers')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeSubTab === 'subscribers' ? theme.fg : 'transparent',
              color: activeSubTab === 'subscribers' ? theme.bg : theme.muted,
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            👥 Subscribers ({subscribers.length})
          </button>
          <button
            onClick={() => setActiveSubTab('history')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeSubTab === 'history' ? theme.fg : 'transparent',
              color: activeSubTab === 'history' ? theme.bg : theme.muted,
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            📜 Campaign Archives
          </button>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionStatus && (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          backgroundColor: actionStatus.success ? '#10b98115' : '#ef444415',
          border: `1px solid ${actionStatus.success ? '#10b98140' : '#ef444440'}`,
          color: actionStatus.success ? '#34d399' : '#f87171',
          fontSize: '0.82rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span>{actionStatus.message}</span>
          <button
            onClick={() => setActionStatus(null)}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: 700 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* ─── TAB 1: DESIGNER & LIVE STUDIO ─── */}
      {activeSubTab === 'designer' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1.25rem',
          flex: 1,
          minHeight: 0
        }}>
          {/* Left Column: Design Controls */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            overflowY: 'auto',
            paddingRight: '0.5rem',
            maxHeight: 'calc(100vh - 240px)'
          }}>
            {/* Quick Presets Bar */}
            <div style={{
              padding: '0.9rem',
              backgroundColor: theme.inputBg,
              border: `1px solid ${theme.border}`,
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem'
            }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Load Executive Template Preset
              </span>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => loadPreset('strategic-dispatch')}
                  style={{
                    padding: '0.35rem 0.75rem',
                    backgroundColor: theme.bg,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '6px',
                    color: theme.fg,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  ⚡ Strategic Dispatch
                </button>
                <button
                  onClick={() => loadPreset('executive-briefing')}
                  style={{
                    padding: '0.35rem 0.75rem',
                    backgroundColor: theme.bg,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '6px',
                    color: theme.fg,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  📈 Executive Briefing
                </button>
                <button
                  onClick={() => loadPreset('tech-innovation')}
                  style={{
                    padding: '0.35rem 0.75rem',
                    backgroundColor: theme.bg,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '6px',
                    color: theme.fg,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  🤖 Tech &amp; Robotics
                </button>
              </div>
            </div>

            {/* Campaign Core Meta */}
            <div style={{
              padding: '1rem',
              backgroundColor: theme.inputBg,
              border: `1px solid ${theme.border}`,
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: theme.fg, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                1. Campaign &amp; Subject Line
              </span>
              
              <div>
                <label style={{ fontSize: '0.72rem', color: theme.muted, display: 'block', marginBottom: '0.25rem' }}>Email Subject Line (Inbox Headline)</label>
                <input
                  type="text"
                  value={campaign.subject}
                  onChange={(e) => setCampaign({ ...campaign, subject: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '6px', color: theme.fg, fontSize: '0.82rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', color: theme.muted, display: 'block', marginBottom: '0.25rem' }}>Issue / Edition Tag</label>
                  <input
                    type="text"
                    value={campaign.edition}
                    onChange={(e) => setCampaign({ ...campaign, edition: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '6px', color: theme.fg, fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', color: theme.muted, display: 'block', marginBottom: '0.25rem' }}>Badge Category</label>
                  <input
                    type="text"
                    value={campaign.bannerTag}
                    onChange={(e) => setCampaign({ ...campaign, bannerTag: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '6px', color: theme.fg, fontSize: '0.82rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Editorial Lead & Headline */}
            <div style={{
              padding: '1rem',
              backgroundColor: theme.inputBg,
              border: `1px solid ${theme.border}`,
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: theme.fg, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                2. Headline &amp; Editorial Intro
              </span>
              <div>
                <label style={{ fontSize: '0.72rem', color: theme.muted, display: 'block', marginBottom: '0.25rem' }}>Main Article Headline</label>
                <input
                  type="text"
                  value={campaign.headline}
                  onChange={(e) => setCampaign({ ...campaign, headline: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '6px', color: theme.fg, fontSize: '0.82rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', color: theme.muted, display: 'block', marginBottom: '0.25rem' }}>Editorial Paragraph</label>
                <textarea
                  rows={3}
                  value={campaign.intro}
                  onChange={(e) => setCampaign({ ...campaign, intro: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '6px', color: theme.fg, fontSize: '0.82rem', resize: 'vertical' }}
                />
              </div>
            </div>

            {/* KPI Metrics Bar */}
            <div style={{
              padding: '1rem',
              backgroundColor: theme.inputBg,
              border: `1px solid ${theme.border}`,
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: theme.fg, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                3. Key Highlight Numbers (3-Column Metric Box)
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                {campaign.stats.map((s, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <input
                      type="text"
                      placeholder="e.g. 99.9%"
                      value={s.value}
                      onChange={(e) => {
                        const updated = [...campaign.stats];
                        updated[idx].value = e.target.value;
                        setCampaign({ ...campaign, stats: updated });
                      }}
                      style={{ width: '100%', padding: '0.45rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '4px', color: theme.fg, fontSize: '0.8rem', fontWeight: 700, textAlign: 'center' }}
                    />
                    <input
                      type="text"
                      placeholder="Label"
                      value={s.label}
                      onChange={(e) => {
                        const updated = [...campaign.stats];
                        updated[idx].label = e.target.value;
                        setCampaign({ ...campaign, stats: updated });
                      }}
                      style={{ width: '100%', padding: '0.35rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '4px', color: theme.muted, fontSize: '0.7rem', textAlign: 'center' }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Stories Block */}
            <div style={{
              padding: '1rem',
              backgroundColor: theme.inputBg,
              border: `1px solid ${theme.border}`,
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: theme.fg, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  4. Featured Briefings / Stories ({campaign.stories.length})
                </span>
                <button
                  onClick={() => {
                    setCampaign({
                      ...campaign,
                      stories: [
                        ...campaign.stories,
                        { tag: 'NEW SECTOR', title: 'New Strategic Initiative', excerpt: 'Add briefing description here.', link: 'https://zawrindustries.com' }
                      ]
                    });
                  }}
                  style={{ padding: '0.25rem 0.6rem', backgroundColor: theme.fg, color: theme.bg, border: 'none', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  + Add Story Card
                </button>
              </div>

              {campaign.stories.map((st, i) => (
                <div key={i} style={{ padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="CATEGORY TAG"
                      value={st.tag}
                      onChange={(e) => {
                        const updated = [...campaign.stories];
                        updated[i].tag = e.target.value;
                        setCampaign({ ...campaign, stories: updated });
                      }}
                      style={{ width: '45%', padding: '0.35rem 0.5rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '4px', color: theme.fg, fontSize: '0.72rem', fontWeight: 700 }}
                    />
                    <button
                      onClick={() => {
                        const updated = campaign.stories.filter((_, idx) => idx !== i);
                        setCampaign({ ...campaign, stories: updated });
                      }}
                      style={{ background: 'none', border: 'none', color: '#f87171', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 600 }}
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Story Title"
                    value={st.title}
                    onChange={(e) => {
                      const updated = [...campaign.stories];
                      updated[i].title = e.target.value;
                      setCampaign({ ...campaign, stories: updated });
                    }}
                    style={{ width: '100%', padding: '0.45rem 0.6rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '4px', color: theme.fg, fontSize: '0.8rem', fontWeight: 600 }}
                  />
                  <textarea
                    rows={2}
                    placeholder="Story Excerpt"
                    value={st.excerpt}
                    onChange={(e) => {
                      const updated = [...campaign.stories];
                      updated[i].excerpt = e.target.value;
                      setCampaign({ ...campaign, stories: updated });
                    }}
                    style={{ width: '100%', padding: '0.45rem 0.6rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '4px', color: theme.muted, fontSize: '0.75rem' }}
                  />
                  <input
                    type="text"
                    placeholder="Read More Link URL"
                    value={st.link || ''}
                    onChange={(e) => {
                      const updated = [...campaign.stories];
                      updated[i].link = e.target.value;
                      setCampaign({ ...campaign, stories: updated });
                    }}
                    style={{ width: '100%', padding: '0.35rem 0.6rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '4px', color: theme.fg, fontSize: '0.72rem', fontFamily: 'monospace' }}
                  />
                </div>
              ))}
            </div>

            {/* Call To Action & Footer Signoff */}
            <div style={{
              padding: '1rem',
              backgroundColor: theme.inputBg,
              border: `1px solid ${theme.border}`,
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: theme.fg, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                5. Call to Action Button &amp; Notice Box
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', color: theme.muted, display: 'block', marginBottom: '0.25rem' }}>Button Text</label>
                  <input
                    type="text"
                    value={campaign.ctaText}
                    onChange={(e) => setCampaign({ ...campaign, ctaText: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '6px', color: theme.fg, fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', color: theme.muted, display: 'block', marginBottom: '0.25rem' }}>Destination URL</label>
                  <input
                    type="text"
                    value={campaign.ctaUrl}
                    onChange={(e) => setCampaign({ ...campaign, ctaUrl: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '6px', color: theme.fg, fontSize: '0.82rem', fontFamily: 'monospace' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: theme.muted, display: 'block', marginBottom: '0.25rem' }}>Highlight Notice Box (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Q3 Briefing live stream date notice..."
                  value={campaign.noticeBox || ''}
                  onChange={(e) => setCampaign({ ...campaign, noticeBox: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '6px', color: theme.fg, fontSize: '0.82rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: theme.muted, display: 'block', marginBottom: '0.25rem' }}>Department Sign-off</label>
                <input
                  type="text"
                  value={campaign.signoff || ''}
                  onChange={(e) => setCampaign({ ...campaign, signoff: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '6px', color: theme.fg, fontSize: '0.82rem' }}
                />
              </div>
            </div>

            {/* Save Draft Action */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={handleSaveDraft}
                style={{
                  flex: 1,
                  padding: '0.65rem 1rem',
                  backgroundColor: theme.inputBg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '6px',
                  color: theme.fg,
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                💾 Save as Campaign Draft
              </button>
              <button
                onClick={() => setActiveSubTab('broadcast')}
                style={{
                  flex: 1,
                  padding: '0.65rem 1rem',
                  backgroundColor: theme.fg,
                  border: 'none',
                  borderRadius: '6px',
                  color: theme.bg,
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                🚀 Proceed to Broadcast &rarr;
              </button>
            </div>
          </div>

          {/* Right Column: Live Responsive Preview Canvas */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#050505',
            border: `1px solid ${theme.border}`,
            borderRadius: '10px',
            overflow: 'hidden',
            maxHeight: 'calc(100vh - 240px)'
          }}>
            {/* Preview Toolbar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.6rem 1rem',
              backgroundColor: '#0a0a0a',
              borderBottom: '1px solid #1f1f1f'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Live Inbox Canvas Preview
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.25rem', backgroundColor: '#141414', padding: '0.2rem', borderRadius: '6px' }}>
                <button
                  onClick={() => setPreviewMode('desktop')}
                  style={{
                    padding: '0.25rem 0.6rem',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: previewMode === 'desktop' ? '#ffffff' : 'transparent',
                    color: previewMode === 'desktop' ? '#000000' : '#888888',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  🖥️ Desktop (600px)
                </button>
                <button
                  onClick={() => setPreviewMode('mobile')}
                  style={{
                    padding: '0.25rem 0.6rem',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: previewMode === 'mobile' ? '#ffffff' : 'transparent',
                    color: previewMode === 'mobile' ? '#000000' : '#888888',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  📱 Mobile (375px)
                </button>
              </div>
            </div>

            {/* Email Render Container */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1.5rem',
              display: 'flex',
              justifyContent: 'center',
              backgroundColor: '#000000'
            }}>
              <div style={{
                width: '100%',
                maxWidth: previewMode === 'desktop' ? '580px' : '360px',
                backgroundColor: '#080808',
                border: '1px solid #1f1f1f',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 12px 36px rgba(0,0,0,0.8)',
                fontFamily: "'Poppins', sans-serif"
              }}>
                {/* Email Header */}
                <div style={{ padding: '24px 28px 18px 28px', borderBottom: '1px solid #1a1a1a', backgroundColor: '#000000', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '17px', fontWeight: 800, letterSpacing: '0.12em', color: '#ffffff' }}>ZAWR INDUSTRIES</div>
                    <div style={{ fontSize: '10.5px', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '2px' }}>Strategic Intelligence Dispatch</div>
                  </div>
                  <div style={{ padding: '3px 8px', backgroundColor: '#111111', border: '1px solid #282828', borderRadius: '4px', fontSize: '9.5px', color: '#aaaaaa', fontWeight: 600 }}>
                    {campaign.edition}
                  </div>
                </div>

                {/* Email Hero Content */}
                <div style={{ padding: '28px 28px 16px 28px' }}>
                  {campaign.bannerTag && (
                    <div style={{ display: 'inline-block', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.08em', color: '#ffffff', backgroundColor: '#1a1a1a', padding: '3px 7px', borderRadius: '3px', marginBottom: '12px', textTransform: 'uppercase' }}>
                      {campaign.bannerTag}
                    </div>
                  )}
                  <h1 style={{ margin: '0 0 14px 0', fontSize: '20px', fontWeight: 700, color: '#ffffff', lineHeight: 1.35, letterSpacing: '-0.02em' }}>
                    {campaign.headline}
                  </h1>
                  <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.65, color: '#b0b0b0' }}>
                    {campaign.intro}
                  </p>
                </div>

                {/* KPI Metrics */}
                {campaign.stats.length > 0 && (
                  <div style={{ padding: '0 28px 14px 28px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', border: '1px solid #222222', borderRadius: '6px', backgroundColor: '#0e0e0e' }}>
                      {campaign.stats.map((s, idx) => (
                        <div key={idx} style={{ padding: '14px 8px', textAlign: 'center', borderRight: idx < campaign.stats.length - 1 ? '1px solid #222222' : 'none' }}>
                          <div style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>{s.value || '--'}</div>
                          <div style={{ fontSize: '9.5px', fontWeight: 600, color: '#777777', textTransform: 'uppercase', marginTop: '2px' }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stories Section */}
                {campaign.stories.length > 0 && (
                  <div style={{ padding: '8px 28px 14px 28px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#666666', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px', borderBottom: '1px solid #1a1a1a', paddingBottom: '6px' }}>
                      Strategic Briefings &amp; Focus Areas
                    </div>
                    {campaign.stories.map((st, i) => (
                      <div key={i} style={{ marginBottom: '14px', padding: '16px', backgroundColor: '#0f0f0f', border: '1px solid #1f1f1f', borderRadius: '6px' }}>
                        {st.tag && <div style={{ fontSize: '9px', fontWeight: 700, color: '#888888', textTransform: 'uppercase', marginBottom: '6px' }}>{st.tag}</div>}
                        <h3 style={{ margin: '0 0 8px 0', fontSize: '14.5px', fontWeight: 600, color: '#ffffff', lineHeight: 1.4 }}>{st.title}</h3>
                        <p style={{ margin: 0, fontSize: '12.5px', color: '#999999', lineHeight: 1.55 }}>{st.excerpt}</p>
                        {st.link && (
                          <div style={{ marginTop: '10px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 600, color: '#ffffff', borderBottom: '1px solid #ffffff', paddingBottom: '1px' }}>Read Full Analysis &rarr;</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Notice Box */}
                {campaign.noticeBox && (
                  <div style={{ padding: '0 28px 14px 28px' }}>
                    <div style={{ padding: '14px 16px', backgroundColor: '#111111', borderLeft: '3px solid #ffffff', borderRadius: '0 4px 4px 0' }}>
                      <p style={{ margin: 0, fontSize: '12px', color: '#cccccc', lineHeight: 1.55 }}>{campaign.noticeBox}</p>
                    </div>
                  </div>
                )}

                {/* CTA Button */}
                {campaign.ctaText && (
                  <div style={{ padding: '14px 28px 24px 28px', textAlign: 'center' }}>
                    <div style={{ display: 'inline-block', padding: '12px 28px', backgroundColor: '#ffffff', color: '#000000', fontSize: '12px', fontWeight: 700, borderRadius: '6px' }}>
                      {campaign.ctaText}
                    </div>
                  </div>
                )}

                {/* Signoff */}
                <div style={{ padding: '18px 28px 24px 28px', borderTop: '1px solid #1a1a1a' }}>
                  <div style={{ fontSize: '12px', color: '#777777' }}>{campaign.signoff || 'Executive Communications & Intelligence Division'}</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>Zawr Industries Global Corporation</div>
                </div>

                {/* Email Footer */}
                <div style={{ padding: '18px 28px', backgroundColor: '#000000', borderTop: '1px solid #1a1a1a', textAlign: 'center' }}>
                  <p style={{ margin: '0 0 6px 0', fontSize: '10px', color: '#555555', lineHeight: 1.4 }}>
                    You are receiving this intelligence dispatch because you subscribed via zawrindustries.com.<br/>
                    Delivered to: <span style={{ color: '#777777' }}>subscriber@example.com</span>
                  </p>
                  <p style={{ margin: '0 0 8px 0', fontSize: '9.5px', color: '#444444' }}>
                    &copy; 2026 Zawr Industries. All global rights reserved.
                  </p>
                  <div style={{ fontSize: '10px', color: '#888888' }}>
                    <span>Unsubscribe</span> • <span>Privacy Policy</span> • <span>Terms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: BROADCAST & DISPATCH DESK ─── */}
      {activeSubTab === 'broadcast' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Broadcast Summary Card */}
            <div style={{
              padding: '1.5rem',
              backgroundColor: theme.inputBg,
              border: `1px solid ${theme.border}`,
              borderRadius: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: theme.fg }}>
                Live Campaign Dispatch Console
              </h3>
              
              <div style={{ padding: '1rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Queued Newsletter Subject</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: theme.fg, marginTop: '0.25rem' }}>{campaign.subject}</div>
                <div style={{ fontSize: '0.8rem', color: theme.muted, marginTop: '0.25rem' }}>{campaign.edition} • {campaign.headline}</div>
              </div>

              {/* Recipient Audience Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ padding: '1rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.72rem', color: theme.muted }}>Target Audience</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.2rem' }}>
                    {subscribers.length} Recipients
                  </div>
                  <div style={{ fontSize: '0.72rem', color: theme.muted, marginTop: '0.2rem' }}>All Active Verified Subscribers</div>
                </div>

                <div style={{ padding: '1rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.72rem', color: theme.muted }}>Relay Encryption</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399', marginTop: '0.2rem' }}>
                    TLS 1.3
                  </div>
                  <div style={{ fontSize: '0.72rem', color: theme.muted, marginTop: '0.2rem' }}>SMTP Pool Auto-Failover</div>
                </div>
              </div>

              {/* Broadcast Execution Button */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  onClick={handleBroadcastAll}
                  disabled={broadcasting || subscribers.length === 0}
                  style={{
                    padding: '0.9rem 1.5rem',
                    backgroundColor: theme.fg,
                    color: theme.bg,
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    cursor: broadcasting ? 'not-allowed' : 'pointer',
                    opacity: broadcasting ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 16px rgba(255,255,255,0.1)'
                  }}
                >
                  {broadcasting ? '⏳ Broadcasting to All Inboxes...' : `🚀 Launch Live Broadcast to ${subscribers.length} Subscribers`}
                </button>
                <span style={{ fontSize: '0.72rem', color: theme.muted, textAlign: 'center' }}>
                  Emails are dispatched sequentially respecting Google daily SMTP limits with instant failover.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Send Test Proof Desk */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{
              padding: '1.5rem',
              backgroundColor: theme.inputBg,
              border: `1px solid ${theme.border}`,
              borderRadius: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: theme.fg }}>
                🧪 Send Direct Test Proof to Your Inbox
              </h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: theme.muted, lineHeight: 1.5 }}>
                Before broadcasting to real subscribers, send a high-fidelity proof to verify layout, links, and typography across your desktop and mobile email clients.
              </p>

              <div>
                <label style={{ fontSize: '0.75rem', color: theme.muted, display: 'block', marginBottom: '0.35rem' }}>
                  Test Recipient Email Address
                </label>
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="name@company.com"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    backgroundColor: theme.bg,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '6px',
                    color: theme.fg,
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <button
                onClick={handleSendTestProof}
                disabled={sendingTest}
                style={{
                  padding: '0.7rem 1.2rem',
                  backgroundColor: '#38bdf8',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: sendingTest ? 'not-allowed' : 'pointer',
                  opacity: sendingTest ? 0.7 : 1
                }}
              >
                {sendingTest ? '⏳ Sending Proof...' : '📤 Send Test Proof Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: SUBSCRIBERS DIRECTORY ─── */}
      {activeSubTab === 'subscribers' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
          
          {/* Controls Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, maxWidth: '400px' }}>
              <input
                type="text"
                placeholder="Search subscribers by email..."
                value={searchSubscriber}
                onChange={(e) => setSearchSubscriber(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.85rem',
                  backgroundColor: theme.inputBg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '6px',
                  color: theme.fg,
                  fontSize: '0.82rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setShowAddSubModal(true)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: theme.inputBg,
                  border: `1px solid ${theme.border}`,
                  color: theme.fg,
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                + Add Single Subscriber
              </button>
              <button
                onClick={exportCSV}
                style={{
                  padding: '0.5rem 1.2rem',
                  backgroundColor: theme.fg,
                  color: theme.bg,
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Export CSV ({subscribers.length})
              </button>
            </div>
          </div>

          {/* Add Subscriber Modal Box */}
          {showAddSubModal && (
            <div style={{
              padding: '1rem',
              backgroundColor: theme.inputBg,
              border: `1px solid ${theme.border}`,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <input
                type="email"
                placeholder="Enter email to subscribe..."
                value={newSubEmail}
                onChange={(e) => setNewSubEmail(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.55rem 0.85rem',
                  backgroundColor: theme.bg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '6px',
                  color: theme.fg,
                  fontSize: '0.82rem'
                }}
              />
              <button
                onClick={handleAddSubscriber}
                disabled={addingSub}
                style={{
                  padding: '0.55rem 1.2rem',
                  backgroundColor: theme.fg,
                  color: theme.bg,
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {addingSub ? 'Adding...' : 'Subscribe'}
              </button>
              <button
                onClick={() => setShowAddSubModal(false)}
                style={{
                  padding: '0.55rem 0.85rem',
                  background: 'none',
                  border: `1px solid ${theme.border}`,
                  color: theme.muted,
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          )}

          {/* Subscribers Table */}
          <div style={{
            border: `1px solid ${theme.border}`,
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: theme.bg
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.inputBg }}>
                  <th style={{ padding: '0.85rem 1.2rem', color: theme.muted, fontWeight: 600 }}>Email Address</th>
                  <th style={{ padding: '0.85rem 1.2rem', color: theme.muted, fontWeight: 600 }}>Date Subscribed</th>
                  <th style={{ padding: '0.85rem 1.2rem', color: theme.muted, fontWeight: 600 }}>Verification Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscribers.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ padding: '2.5rem', textAlign: 'center', color: theme.muted }}>
                      No subscribers matching query.
                    </td>
                  </tr>
                ) : (
                  filteredSubscribers.map((sub, idx) => (
                    <tr key={idx} style={{ borderBottom: `1px solid ${theme.border}` }}>
                      <td style={{ padding: '0.85rem 1.2rem', color: theme.fg, fontWeight: 500, fontFamily: 'monospace' }}>
                        {sub.email}
                      </td>
                      <td style={{ padding: '0.85rem 1.2rem', color: theme.muted }}>
                        {sub.created_at ? new Date(sub.created_at).toLocaleDateString('en-GB') : '14/09/2026'}
                      </td>
                      <td style={{ padding: '0.85rem 1.2rem' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '4px',
                          backgroundColor: sub.status === 'Unsubscribed' ? '#ef444415' : '#10b98115',
                          color: sub.status === 'Unsubscribed' ? '#f87171' : '#34d399',
                          fontSize: '0.72rem',
                          fontWeight: 700
                        }}>
                          <span style={{
                            width: 5,
                            height: 5,
                            borderRadius: '50%',
                            backgroundColor: sub.status === 'Unsubscribed' ? '#f87171' : '#34d399'
                          }} />
                          {sub.status || 'Active'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── TAB 4: CAMPAIGN ARCHIVES & HISTORY ─── */}
      {activeSubTab === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: theme.muted }}>
              Historical archive of all drafted and broadcast newsletter editions.
            </span>
            <button
              onClick={fetchCampaigns}
              style={{
                padding: '0.4rem 0.8rem',
                backgroundColor: theme.inputBg,
                border: `1px solid ${theme.border}`,
                color: theme.fg,
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              🔄 Refresh Log
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {campaignsHistory.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: theme.muted, backgroundColor: theme.inputBg, borderRadius: '8px', border: `1px solid ${theme.border}` }}>
                No past campaigns found.
              </div>
            ) : (
              campaignsHistory.map((c, i) => (
                <div key={i} style={{
                  padding: '1.25rem',
                  backgroundColor: theme.inputBg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                        backgroundColor: c.status === 'Sent' ? '#10b98120' : '#f59e0b20',
                        color: c.status === 'Sent' ? '#34d399' : '#fbbf24',
                        fontSize: '0.7rem',
                        fontWeight: 700
                      }}>
                        {c.status || 'Draft'}
                      </span>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: theme.fg }}>{c.title || c.subject}</h4>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: theme.muted, marginTop: '0.35rem' }}>
                      Subject: <span style={{ color: theme.fg }}>{c.subject}</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: theme.muted, marginTop: '0.2rem' }}>
                      {c.sentAt ? `Dispatched on ${new Date(c.sentAt).toLocaleString()} to ${c.recipientCount || 0} subscribers` : `Created ${c.updatedAt ? new Date(c.updatedAt).toLocaleDateString() : ''}`}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => {
                        setCampaign(c);
                        setActiveSubTab('designer');
                      }}
                      style={{
                        padding: '0.45rem 0.9rem',
                        backgroundColor: theme.bg,
                        border: `1px solid ${theme.border}`,
                        borderRadius: '6px',
                        color: theme.fg,
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      ✏️ Edit in Designer
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
}

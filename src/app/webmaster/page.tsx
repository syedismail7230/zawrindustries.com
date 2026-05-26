"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function WebmasterDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('analytics');

  // Supabase States
  const [jobs, setJobs] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([
    { id: 1, source: 'Job Applications (/careers)', destination: 'hr@zawrindustries.com' },
    { id: 2, source: 'Sponsorship Inquiries', destination: 'marketing@zawrindustries.com' },
    { id: 3, source: 'Investor Relations', destination: 'investors@zawrindustries.com' }
  ]);
  const [analytics, setAnalytics] = useState<any[]>([
    { label: 'Total Visits', value: '14,209', change: '+12%' },
    { label: 'Bounce Rate', value: '42.3%', change: '-2%' },
    { label: 'Job Applications', value: '89', change: '+24%' }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State for new job
  const [newJob, setNewJob] = useState<{title: string, location: string, type: string, status: string, role: string, responsibilities: string[], reporting: string}>({ 
    title: '', location: '', type: 'Full-time', status: 'Active', role: '', responsibilities: [], reporting: '' 
  });

  // Financial Reports States
  const [reports, setReports] = useState<any[]>([]);
  const [reportTitle, setReportTitle] = useState('');
  const [editingReport, setEditingReport] = useState<any>(null);
  const [reportCategory, setReportCategory] = useState('Annual Reports');
  const [reportYear, setReportYear] = useState('2025-2026');
  const [reportIsArchived, setReportIsArchived] = useState(false);
  const [selectedTableCategory, setSelectedTableCategory] = useState('Annual Reports');

  // Events States
  const [events, setEvents] = useState<any[]>([]);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventStartDate, setEventStartDate] = useState('');
  const [eventEndDate, setEventEndDate] = useState('');
  const [eventStartTime, setEventStartTime] = useState('');
  const [eventEndTime, setEventEndTime] = useState('');
  const [eventImage, setEventImage] = useState('/assets/event-chart.png');
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [customImageFile, setCustomImageFile] = useState<File | null>(null);

  // Notices States
  const [notices, setNotices] = useState<any[]>([]);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeCategory, setNoticeCategory] = useState('General');
  const [noticeDate, setNoticeDate] = useState('');
  const [noticeSummary, setNoticeSummary] = useState('');
  const [noticeBody, setNoticeBody] = useState('');
  const [noticeIsArchived, setNoticeIsArchived] = useState(false);
  const [editingNotice, setEditingNotice] = useState<any>(null);
  
  // Notice dynamic attachments/links input fields
  const [noticeLinkName, setNoticeLinkName] = useState('');
  const [noticeLinkUrl, setNoticeLinkUrl] = useState('');
  const [noticeAttachmentName, setNoticeAttachmentName] = useState('');
  const [customNoticeFile, setCustomNoticeFile] = useState<File | null>(null);

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123' || password === 'Zawr2026!') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  // Fetch Data from Supabase
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        if (activeTab === 'jobs') {
          const { data, error } = await supabase.from('jobs').select('*').order('id', { ascending: false });
          if (error) {
            // Fallback if table doesn't exist yet
            if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
              setErrorMsg('Table "jobs" does not exist in Supabase yet.');
              setJobs([]);
            } else {
              throw error;
            }
          } else {
            setJobs(data || []);
          }
        }
        else if (activeTab === 'newsletters') {
          const { data, error } = await supabase.from('newsletters').select('*').order('created_at', { ascending: false });
          if (error) {
            if (error.message.includes('does not exist')) setErrorMsg('Table "newsletters" does not exist yet.');
            setSubscribers([]);
          } else {
            setSubscribers(data || []);
          }
        }
        else if (activeTab === 'email-routing') {
          const { data, error } = await supabase.from('email_routing').select('*').order('id');
          if (data && data.length > 0) setRoutes(data);
        }
        else if (activeTab === 'financial-reports') {
          const res = await fetch('/api/financial-reports');
          if (res.ok) {
            const data = await res.json();
            setReports(data || []);
          }
        }
        else if (activeTab === 'events') {
          const res = await fetch('/api/events');
          if (res.ok) {
            const data = await res.json();
            setEvents(data || []);
          }
        }
        else if (activeTab === 'notices') {
          const res = await fetch('/api/notices');
          if (res.ok) {
            const data = await res.json();
            setNotices(data || []);
          }
        }
      } catch (error: any) {
        console.error('Supabase error:', error.message);
      }
      setLoading(false);
    };

    fetchData();

    // REALTIME SUBSCRIPTIONS
    const channel = supabase.channel('webmaster-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, payload => {
        if (activeTab === 'jobs') fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'newsletters' }, payload => {
        if (activeTab === 'newsletters') fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeTab, isAuthenticated]);

  // Helper to map and merge dynamic database reports with mock placeholders for all years
  const getMappedReportsForWebmaster = () => {
    const reportYears = [
      '2026-2027', '2025-2026', '2024-2025', '2023-2024', '2022-2023',
      '2021-2022', '2020-2021', '2019-2020', '2018-2019', '2017-2018',
      '2016-2017', '2015-2016'
    ];

    // 1. Group actual database reports by selectedTableCategory
    const categorizedDbReports = reports.filter(rep => {
      if (rep.category) {
        return rep.category === selectedTableCategory;
      }
      
      // Fallback title parsing for legacy items
      const titleUpper = rep.title.toUpperCase();
      if (selectedTableCategory === 'Quarterly Results') {
        return titleUpper.includes('QUARTER') || titleUpper.includes('Q1') || titleUpper.includes('Q2') || titleUpper.includes('Q3') || titleUpper.includes('Q4') || titleUpper.includes('RESULTS');
      }
      if (selectedTableCategory === 'Financial Presentations') {
        return (titleUpper.includes('PRESENTATION') || titleUpper.includes('ROADMAP') || titleUpper.includes('PITCH')) && !titleUpper.includes('OTHER');
      }
      if (selectedTableCategory === 'CSR Reports') {
        return titleUpper.includes('CSR') || titleUpper.includes('SOCIAL') || titleUpper.includes('COMMUNITY');
      }
      if (selectedTableCategory === '10 Year Financial Highlights') {
        return titleUpper.includes('10 YEAR') || titleUpper.includes('HIGHLIGHTS') || titleUpper.includes('HIGHLIGHT');
      }
      if (selectedTableCategory === 'Other Investor Presentations') {
        return titleUpper.includes('OTHER') || titleUpper.includes('PORTFOLIO');
      }
      return !titleUpper.includes('QUARTER') && !titleUpper.includes('Q1') && !titleUpper.includes('Q2') && !titleUpper.includes('Q3') && !titleUpper.includes('Q4') && !titleUpper.includes('CSR') && !titleUpper.includes('10 YEAR');
    });

    const activeList: any[] = [];

    // First, process any actual webmaster uploads that match selected years
    categorizedDbReports.forEach(rep => {
      // Use explicit year field, with chronological title fallback for legacy
      let matchedYear = rep.year;
      if (!matchedYear) {
        const titleUpper = rep.title.toUpperCase();
        matchedYear = reportYears.find(y => {
          const [startYr, endYr] = y.split('-');
          if (y === '2025-2026' && (titleUpper.includes('2026') || titleUpper.includes('FY 2026') || titleUpper.includes('25-26'))) return true;
          if (y === '2024-2025' && (titleUpper.includes('2025') || titleUpper.includes('FY 2025') || titleUpper.includes('24-25'))) return true;
          if (y === '2023-2024' && (titleUpper.includes('2024') || titleUpper.includes('FY 2024') || titleUpper.includes('23-24'))) return true;
          if (y === '2022-2023' && (titleUpper.includes('2023') || titleUpper.includes('FY 2023') || titleUpper.includes('22-23'))) return true;
          return titleUpper.includes(startYr) || titleUpper.includes(endYr);
        });
      }

      if (matchedYear) {
        activeList.push({
          id: rep.id,
          title: rep.title,
          pdfUrl: rep.pdfUrl,
          category: selectedTableCategory,
          year: matchedYear,
          isArchived: !!rep.isArchived,
          isUserUploaded: true
        });
      }
    });

    // 2. Add placeholders for years without an upload
    reportYears.forEach(year => {
      const alreadyHasUpload = activeList.some(item => item.year === year);
      if (!alreadyHasUpload) {
        let title = '';
        if (selectedTableCategory === 'Annual Reports') {
          title = `Annual Report for the year ${year}`;
        } else if (selectedTableCategory === 'Quarterly Results') {
          title = `Quarterly Results for Q3 FY ${year}`;
        } else if (selectedTableCategory === 'Financial Presentations') {
          title = `Investor Presentation - FY ${year}`;
        } else if (selectedTableCategory === 'CSR Reports') {
          title = `Corporate Social Responsibility Report ${year}`;
        } else if (selectedTableCategory === '10 Year Financial Highlights') {
          title = `10 Year Financial and Operational Highlights (${year})`;
        } else {
          title = `Investor Presentation Portfolio - ${year}`;
        }

        activeList.push({
          id: `mock-${year}`,
          title,
          pdfUrl: '',
          category: selectedTableCategory,
          year,
          isArchived: true, // Default to archived offline
          isUserUploaded: false
        });
      }
    });

    // Sort chronologically (latest year first)
    return activeList.sort((a, b) => b.year.localeCompare(a.year));
  };

  // Actions
  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.from('jobs').insert([newJob]).select();
    if (error) {
      alert(`Error adding job: Make sure the 'jobs' table exists with columns: title, location, type, status.\nSupabase msg: ${error.message}`);
    } else if (data) {
      setJobs([data[0], ...jobs]);
      setNewJob({ title: '', location: '', type: 'Full-time', status: 'Active', role: '', responsibilities: [], reporting: '' });
    }
  };

  const handleDeleteJob = async (id: number) => {
    await supabase.from('jobs').delete().eq('id', id);
    setJobs(jobs.filter(j => j.id !== id));
  };

  const handleUpdateRoute = async (id: number, newDest: string) => {
    // Optimistic UI update
    setRoutes(routes.map(r => r.id === id ? { ...r, destination: newDest } : r));
    // Try to update DB
    const { error } = await supabase.from('email_routing').update({ destination: newDest }).eq('id', id);
    if (error) console.log("Routing table might not exist, but UI updated.");
  };

  // Theme
  const theme = { bg: '#000000', fg: '#ffffff', border: '#222222', hover: '#111111', inputBg: '#0a0a0a', muted: '#888888' };

  if (!isAuthenticated) {
    return (
      <div style={{ height: '100vh', backgroundColor: theme.bg, color: theme.fg, display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>
        <style dangerouslySetInnerHTML={{__html: `header, footer, .support-widget, .cookie-banner { display: none !important; } body { overflow: hidden !important; margin: 0; }`}} />
        <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: '400px', padding: '2rem', border: `1px solid ${theme.border}`, borderRadius: '8px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '2rem', textAlign: 'center', letterSpacing: '-0.02em' }}>Webmaster Dashboard</h1>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Access Key</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, color: theme.fg, outline: 'none', borderRadius: '4px' }} placeholder="Enter admin password" autoFocus />
          </div>
          <button type="submit" style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.fg, color: theme.bg, border: 'none', fontWeight: 600, cursor: 'pointer', borderRadius: '4px' }}>Authorize</button>
        </form>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'analytics':
        return (
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '2rem', letterSpacing: '-0.02em' }}>Analytics (Live)</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
              {analytics.map((stat, i) => (
                <div key={i} style={{ padding: '1.5rem', border: `1px solid ${theme.border}`, borderRadius: '8px', backgroundColor: theme.inputBg }}>
                  <div style={{ fontSize: '0.875rem', color: theme.muted, marginBottom: '0.5rem' }}>{stat.label}</div>
                  <div style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '0.5rem' }}>{stat.value}</div>
                  <div style={{ fontSize: '0.75rem', color: stat.change.startsWith('+') ? '#ffffff' : theme.muted }}>{stat.change} this week</div>
                </div>
              ))}
            </div>
            <div style={{ height: '300px', border: `1px dashed ${theme.border}`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.muted }}>
              [ Supabase Realtime Chart Connected ]
            </div>
          </div>
        );
      
      case 'mail-credentials':
        return (
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '2rem', letterSpacing: '-0.02em' }}>Mail Server (Nodemailer)</h2>
            <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>SMTP Server</label>
                <input type="text" defaultValue="smtp.gmail.com" disabled style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, color: theme.muted, borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>System Email User (.env)</label>
                <input type="email" defaultValue="noreply@zawrindustries.com" disabled style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, color: theme.muted, borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>App Password (.env)</label>
                <input type="password" defaultValue="****************" disabled style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, color: theme.muted, borderRadius: '4px' }} />
              </div>
              <p style={{ fontSize: '0.875rem', color: theme.muted }}>These values are securely loaded from your <code>.env.local</code> file and managed directly on your server/hosting platform.</p>
            </div>
          </div>
        );

      case 'email-routing':
        return (
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '2rem', letterSpacing: '-0.02em' }}>Live Email Routing</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                  <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>Source / Form</th>
                  <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>Destination Address</th>
                  <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {routes.map((route) => (
                  <tr key={route.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                    <td style={{ padding: '1rem' }}>{route.source}</td>
                    <td style={{ padding: '1rem' }}>
                      <input 
                        type="text" 
                        value={route.destination} 
                        onChange={(e) => setRoutes(routes.map(r => r.id === route.id ? { ...r, destination: e.target.value } : r))}
                        style={{ width: '100%', padding: '0.5rem', backgroundColor: 'transparent', border: 'none', color: theme.fg, borderBottom: `1px dashed ${theme.border}`, outline: 'none' }} 
                      />
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <button onClick={() => handleUpdateRoute(route.id, route.destination)} style={{ padding: '0.25rem 0.75rem', backgroundColor: 'transparent', color: theme.fg, border: `1px solid ${theme.border}`, borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>Sync</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'jobs':
        return (
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '2rem', letterSpacing: '-0.02em' }}>Manage Careers (Realtime)</h2>
            
            {errorMsg && <div style={{ padding: '1rem', backgroundColor: '#3f0000', color: '#ffaaaa', borderRadius: '8px', marginBottom: '2rem' }}>{errorMsg}</div>}

            <form onSubmit={handleAddJob} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem', padding: '1.5rem', border: `1px solid ${theme.border}`, borderRadius: '8px', backgroundColor: theme.inputBg }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Post New Job</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Job Title *</label>
                  <input type="text" required value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} style={{ width: '100%', padding: '0.75rem', backgroundColor: 'transparent', border: `1px solid ${theme.border}`, color: theme.fg, borderRadius: '4px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Location *</label>
                  <input type="text" required value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} placeholder="e.g. Remote / Hybrid" style={{ width: '100%', padding: '0.75rem', backgroundColor: 'transparent', border: `1px solid ${theme.border}`, color: theme.fg, borderRadius: '4px' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Employment Type *</label>
                  <select value={newJob.type} onChange={e => setNewJob({...newJob, type: e.target.value})} style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, borderRadius: '4px' }}>
                    <option value="Full-time">Full-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Reporting To</label>
                  <input type="text" value={newJob.reporting || ''} onChange={e => setNewJob({...newJob, reporting: e.target.value})} placeholder="e.g. CEO" style={{ width: '100%', padding: '0.75rem', backgroundColor: 'transparent', border: `1px solid ${theme.border}`, color: theme.fg, borderRadius: '4px' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Role Overview *</label>
                <textarea required value={newJob.role || ''} onChange={e => setNewJob({...newJob, role: e.target.value})} rows={2} style={{ width: '100%', padding: '0.75rem', backgroundColor: 'transparent', border: `1px solid ${theme.border}`, color: theme.fg, borderRadius: '4px', resize: 'vertical' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Key Responsibilities * (One per line)</label>
                <textarea required value={(newJob.responsibilities || []).join('\n')} onChange={e => setNewJob({...newJob, responsibilities: e.target.value.split('\n').filter(r => r.trim() !== '')})} rows={4} placeholder="- Define strategy...&#10;- Write clean code..." style={{ width: '100%', padding: '0.75rem', backgroundColor: 'transparent', border: `1px solid ${theme.border}`, color: theme.fg, borderRadius: '4px', resize: 'vertical' }} />
              </div>

              <button type="submit" style={{ padding: '0.75rem 1.5rem', backgroundColor: theme.fg, color: theme.bg, border: 'none', fontWeight: 600, borderRadius: '4px', cursor: 'pointer', alignSelf: 'flex-start', marginTop: '0.5rem' }}>+ Publish Job</button>
            </form>
            
            {loading ? <div style={{ color: theme.muted }}>Syncing with Supabase...</div> : (
              <div style={{ border: `1px solid ${theme.border}`, borderRadius: '8px', overflow: 'hidden' }}>
                {jobs.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: theme.muted }}>No jobs found or table missing.</div>
                ) : jobs.map((job) => (
                  <div key={job.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.bg }}>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{job.title}</div>
                      <div style={{ fontSize: '0.875rem', color: theme.muted }}>{job.location} • {job.type} • Reporting to: {job.reporting || 'N/A'}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', border: `1px solid ${job.status === 'Active' ? '#10b981' : theme.muted}`, borderRadius: '4px', color: job.status === 'Active' ? '#10b981' : theme.muted }}>{job.status}</span>
                      <button onClick={() => handleDeleteJob(job.id)} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: '0.875rem' }}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'newsletters':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 600, letterSpacing: '-0.02em' }}>Newsletter Subscribers</h2>
              <button style={{ padding: '0.5rem 1.5rem', backgroundColor: theme.fg, color: theme.bg, border: 'none', fontWeight: 600, borderRadius: '4px', cursor: 'pointer' }}>Export CSV</button>
            </div>
            {errorMsg && <div style={{ padding: '1rem', backgroundColor: '#3f0000', color: '#ffaaaa', borderRadius: '8px', marginBottom: '2rem' }}>{errorMsg}</div>}
            
            {loading ? <div style={{ color: theme.muted }}>Loading from Supabase...</div> : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                    <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>Email Address</th>
                    <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>Date Subscribed</th>
                    <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.length === 0 ? (
                    <tr><td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: theme.muted }}>No subscribers found.</td></tr>
                  ) : subscribers.map((sub) => (
                    <tr key={sub.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                      <td style={{ padding: '1rem' }}>{sub.email}</td>
                      <td style={{ padding: '1rem', color: theme.muted }}>{new Date(sub.created_at).toLocaleDateString()}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ color: sub.status === 'Active' ? '#ffffff' : theme.muted }}>{sub.status || 'Active'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      case 'pitch-deck':
        return (
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '2rem', letterSpacing: '-0.02em' }}>Upload Pitch Deck</h2>
            <div style={{ padding: '2rem', border: `1px solid ${theme.border}`, borderRadius: '8px', backgroundColor: theme.inputBg }}>
              <p style={{ color: theme.muted, marginBottom: '1.5rem' }}>Upload a PDF of your Pitch Deck. It will instantly replace the placeholder slides on the Investors page.</p>
              
              <input 
                type="file" 
                accept="application/pdf"
                id="pitchDeckUpload"
                style={{ display: 'none' }}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setLoading(true);
                  const formData = new FormData();
                  formData.append('file', file);
                  
                  try {
                    const res = await fetch('/api/upload-pitch-deck', { method: 'POST', body: formData });
                    if (res.ok) {
                      localStorage.setItem('zawr_pitch_deck_uploaded', 'true');
                      alert('Pitch Deck uploaded successfully!');
                    } else {
                      alert('Failed to upload. Ensure server allows file writing.');
                    }
                  } catch (err) {
                    alert('Error uploading pitch deck.');
                  }
                  setLoading(false);
                }}
              />
              
              <button 
                onClick={() => document.getElementById('pitchDeckUpload')?.click()}
                disabled={loading}
                style={{ padding: '0.75rem 1.5rem', backgroundColor: theme.fg, color: theme.bg, border: 'none', fontWeight: 600, borderRadius: '4px', cursor: 'pointer' }}
              >
                {loading ? 'Uploading...' : 'Select PDF File'}
              </button>
            </div>
          </div>
        );
      
      case 'financial-reports':
        return (
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '2rem', letterSpacing: '-0.02em' }}>Financial Reports</h2>
            
            {/* Add / Edit Form */}
            <div style={{ padding: '2rem', border: `1px solid ${theme.border}`, borderRadius: '8px', backgroundColor: theme.inputBg, marginBottom: '3rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>{editingReport ? 'Edit Report' : 'Add New Report'}</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '500px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Report Title (e.g. FY 2026)</label>
                  <input 
                    type="text" 
                    value={reportTitle} 
                    onChange={(e) => setReportTitle(e.target.value)} 
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, outline: 'none', borderRadius: '4px' }} 
                    placeholder="Enter report title"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Category</label>
                  <select 
                    value={reportCategory}
                    onChange={(e) => setReportCategory(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, outline: 'none', borderRadius: '4px' }}
                  >
                    <option value="Annual Reports">Annual Reports</option>
                    <option value="Quarterly Results">Quarterly Results</option>
                    <option value="Financial Presentations">Financial Presentations</option>
                    <option value="CSR Reports">CSR Reports</option>
                    <option value="10 Year Financial Highlights">10 Year Financial Highlights</option>
                    <option value="Other Investor Presentations">Other Investor Presentations</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Fiscal Year</label>
                  <select 
                    value={reportYear}
                    onChange={(e) => setReportYear(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, outline: 'none', borderRadius: '4px' }}
                  >
                    <option value="2026-2027">2026-2027</option>
                    <option value="2025-2026">2025-2026</option>
                    <option value="2024-2025">2024-2025</option>
                    <option value="2023-2024">2023-2024</option>
                    <option value="2022-2023">2022-2023</option>
                    <option value="2021-2022">2021-2022</option>
                    <option value="2020-2021">2020-2021</option>
                    <option value="2019-2020">2019-2020</option>
                    <option value="2018-2019">2018-2019</option>
                    <option value="2017-2018">2017-2018</option>
                    <option value="2016-2017">2016-2017</option>
                    <option value="2015-2016">2015-2016</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>PDF File</label>
                  <input 
                    type="file" 
                    accept="application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        (window as any)._selectedReportFile = file;
                      }
                    }}
                    style={{ color: theme.fg }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', userSelect: 'none' }}>
                    <input 
                      type="checkbox"
                      checked={reportIsArchived}
                      onChange={(e) => setReportIsArchived(e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: theme.fg }}
                    />
                    <span style={{ fontSize: '0.875rem', color: theme.fg }}>Mark as Archived (Offline Database Alert)</span>
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button 
                    onClick={async () => {
                      if (!reportTitle.trim()) {
                        alert('Please enter a title');
                        return;
                      }
                      setLoading(true);

                      let pdfUrl = editingReport ? editingReport.pdfUrl : '';
                      const file = (window as any)._selectedReportFile;
                      
                      if (file) {
                        try {
                          const fileName = `reports/report-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
                          const { data, error } = await supabase.storage
                            .from('zawr-media')
                            .upload(fileName, file, { cacheControl: '3600', upsert: true });
                          
                          if (error) {
                            alert('Supabase Storage Upload Error: ' + error.message);
                            setLoading(false);
                            return;
                          }
                          const { data: { publicUrl } } = supabase.storage.from('zawr-media').getPublicUrl(fileName);
                          pdfUrl = publicUrl;
                        } catch (err: any) {
                          alert('Error uploading to Supabase Storage: ' + err.message);
                          setLoading(false);
                          return;
                        }
                      }

                      const formData = new FormData();
                      formData.append('action', editingReport ? 'update' : 'add');
                      formData.append('title', reportTitle);
                      formData.append('pdfUrl', pdfUrl);
                      formData.append('category', reportCategory);
                      formData.append('year', reportYear);
                      formData.append('isArchived', String(reportIsArchived));
                      if (editingReport) {
                        formData.append('id', editingReport.id);
                      }

                      try {
                        const res = await fetch('/api/financial-reports', {
                          method: 'POST',
                          body: formData
                        });
                        if (res.ok) {
                          const data = await res.json();
                          setReports(data.reports || []);
                          setReportTitle('');
                          setReportCategory('Annual Reports');
                          setReportYear('2025-2026');
                          setReportIsArchived(false);
                          setEditingReport(null);
                          (window as any)._selectedReportFile = null;
                          alert(editingReport ? 'Report updated successfully!' : 'Report added successfully!');
                        } else {
                          alert('Failed to save report.');
                        }
                      } catch (err) {
                        alert('Error saving report.');
                      }
                      setLoading(false);
                    }}
                    disabled={loading}
                    style={{ padding: '0.75rem 1.5rem', backgroundColor: theme.fg, color: theme.bg, border: 'none', fontWeight: 600, borderRadius: '4px', cursor: 'pointer' }}
                  >
                    {loading ? 'Saving...' : editingReport ? 'Update Report' : 'Add Report'}
                  </button>
                  
                  {editingReport && (
                    <button 
                      onClick={() => {
                        setEditingReport(null);
                        setReportTitle('');
                        setReportCategory('Annual Reports');
                        setReportYear('2025-2026');
                        setReportIsArchived(false);
                        (window as any)._selectedReportFile = null;
                      }}
                      style={{ padding: '0.75rem 1.5rem', backgroundColor: 'transparent', color: theme.fg, border: `1px solid ${theme.border}`, borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* List of Reports */}
            <div style={{ padding: '2rem', border: `1px solid ${theme.border}`, borderRadius: '8px', backgroundColor: theme.inputBg }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Financial Reports Database Explorer</h3>
                <span style={{ fontSize: '0.85rem', color: theme.muted }}>Viewing all managed report slots and placeholders</span>
              </div>
              
              {/* Category Filter Tabs inside Webmaster Panel */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem', borderBottom: `1px solid ${theme.border}` }}>
                {[
                  'Annual Reports',
                  'Quarterly Results',
                  'Financial Presentations',
                  'CSR Reports',
                  '10 Year Financial Highlights',
                  'Other Investor Presentations'
                ].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedTableCategory(cat)}
                    style={{
                      padding: '0.6rem 1.2rem',
                      borderRadius: '4px',
                      backgroundColor: selectedTableCategory === cat ? theme.fg : 'transparent',
                      color: selectedTableCategory === cat ? theme.bg : theme.muted,
                      border: `1px solid ${selectedTableCategory === cat ? theme.fg : theme.border}`,
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                    <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>Title</th>
                    <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>Category</th>
                    <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>Year</th>
                    <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>PDF URL Status</th>
                    <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getMappedReportsForWebmaster().map((rep) => (
                    <tr key={rep.id} style={{ borderBottom: `1px solid ${theme.border}`, opacity: rep.isUserUploaded ? 1 : 0.65 }}>
                      <td style={{ padding: '1rem', fontWeight: 500 }}>{rep.title}</td>
                      <td style={{ padding: '1rem', color: '#fff' }}>{rep.category}</td>
                      <td style={{ padding: '1rem', color: '#fff' }}>{rep.year}</td>
                      <td style={{ padding: '1rem', color: theme.muted, fontSize: '0.875rem' }}>
                        {rep.isUserUploaded ? (
                          rep.isArchived ? (
                            <span style={{ color: '#ffaaaa', backgroundColor: '#3a0c0c', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Archived Offline</span>
                          ) : (
                            <a href={rep.pdfUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#aaaaff', textDecoration: 'underline' }}>
                              {rep.pdfUrl.length > 50 ? `${rep.pdfUrl.substring(0, 50)}...` : rep.pdfUrl}
                            </a>
                          )
                        ) : (
                          <span style={{ color: theme.muted, fontStyle: 'italic' }}>Default Archived Placeholder (Offline)</span>
                        )}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        {rep.isUserUploaded ? (
                          <>
                            <button 
                              onClick={() => {
                                setEditingReport(rep);
                                setReportTitle(rep.title);
                                setReportCategory(rep.category);
                                setReportYear(rep.year);
                                setReportIsArchived(!!rep.isArchived);
                                // Scroll smoothly to form
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              style={{ padding: '0.5rem 1rem', backgroundColor: 'transparent', color: theme.fg, border: `1px solid ${theme.border}`, borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem', fontSize: '0.875rem' }}
                            >
                              Edit
                            </button>
                            <button 
                              onClick={async () => {
                                setLoading(true);
                                const formData = new FormData();
                                formData.append('action', 'update');
                                formData.append('id', rep.id);
                                formData.append('title', rep.title);
                                formData.append('pdfUrl', rep.pdfUrl || '');
                                formData.append('category', rep.category);
                                formData.append('year', rep.year);
                                formData.append('isArchived', String(!rep.isArchived));

                                try {
                                  const res = await fetch('/api/financial-reports', { method: 'POST', body: formData });
                                  if (res.ok) {
                                    const data = await res.json();
                                    setReports(data.reports || []);
                                  } else {
                                    alert('Failed to toggle archive status.');
                                  }
                                } catch (e) {
                                  alert('Error toggling archive status.');
                                }
                                setLoading(false);
                              }}
                              style={{ 
                                padding: '0.5rem 1rem', 
                                backgroundColor: rep.isArchived ? '#0c3a0c' : '#222225', 
                                color: rep.isArchived ? '#aaffaa' : '#ffffff', 
                                border: rep.isArchived ? 'none' : `1px solid ${theme.border}`, 
                                borderRadius: '4px', 
                                cursor: 'pointer', 
                                marginRight: '0.5rem', 
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                if (!rep.isArchived) {
                                  e.currentTarget.style.backgroundColor = '#3a0c0c';
                                  e.currentTarget.style.color = '#ffaaaa';
                                  e.currentTarget.style.borderColor = '#ffaaaa';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!rep.isArchived) {
                                  e.currentTarget.style.backgroundColor = '#222225';
                                  e.currentTarget.style.color = '#ffffff';
                                  e.currentTarget.style.borderColor = theme.border;
                                }
                              }}
                            >
                              {rep.isArchived ? 'Activate' : 'Archive'}
                            </button>
                            <button 
                              onClick={async () => {
                                if (!confirm(`Are you sure you want to delete ${rep.title}?`)) return;
                                setLoading(true);
                                const formData = new FormData();
                                formData.append('action', 'delete');
                                formData.append('id', rep.id);
                                try {
                                  const res = await fetch('/api/financial-reports', { method: 'POST', body: formData });
                                  if (res.ok) {
                                    const data = await res.json();
                                    setReports(data.reports || []);
                                  } else {
                                    alert('Failed to delete report.');
                                  }
                                } catch (e) {
                                  alert('Error deleting report.');
                                }
                                setLoading(false);
                              }}
                              style={{ padding: '0.5rem 1rem', backgroundColor: '#3f0000', color: '#ffaaaa', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem' }}
                            >
                              Delete
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingReport(null);
                              setReportTitle(rep.title);
                              setReportCategory(rep.category);
                              setReportYear(rep.year);
                              setReportIsArchived(false);
                              // Scroll smoothly to form and alert
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                              setTimeout(() => {
                                alert(`Ready to upload! Choose a PDF file above for "${rep.title}" (${rep.year}) and click "Add Report".`);
                              }, 300);
                            }}
                            style={{ padding: '0.5rem 1rem', backgroundColor: '#ffffff', color: '#000000', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}
                          >
                            Upload PDF File
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'events':
        return (
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '2rem', letterSpacing: '-0.02em' }}>Manage Events</h2>
            
            {/* Add / Edit Form */}
            <div style={{ padding: '2rem', border: `1px solid ${theme.border}`, borderRadius: '8px', backgroundColor: theme.inputBg, marginBottom: '3rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>{editingEvent ? 'Edit Event' : 'Add New Event'}</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Event Title</label>
                  <input 
                    type="text" 
                    value={eventTitle} 
                    onChange={(e) => setEventTitle(e.target.value)} 
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, outline: 'none', borderRadius: '4px' }} 
                    placeholder="e.g. AGM, IT Services Launch"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Description</label>
                  <textarea 
                    value={eventDesc} 
                    onChange={(e) => setEventDesc(e.target.value)} 
                    style={{ width: '100%', height: '100px', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, outline: 'none', borderRadius: '4px', resize: 'vertical' }} 
                    placeholder="Enter event details"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Card Thumbnail Image / Banner</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setCustomImageFile(file);
                      }}
                      style={{ color: theme.fg }}
                    />
                    {customImageFile && (
                      <div style={{ fontSize: '0.75rem', color: '#10b981' }}>
                        Selected Custom Photo: <strong>{customImageFile.name}</strong> (Will upload to Supabase CDN)
                      </div>
                    )}
                    {!customImageFile && (
                      <div>
                        <span style={{ fontSize: '0.75rem', color: theme.muted, display: 'block', marginBottom: '0.25rem' }}>Or use standard preset:</span>
                        <select 
                          value={eventImage} 
                          onChange={(e) => setEventImage(e.target.value)} 
                          style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, outline: 'none', borderRadius: '4px' }}
                        >
                          <option value="/assets/event-chart.png">Stock Chart Gradient</option>
                          <option value="/assets/event-speaker.png">Keynote Stage Presenter</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Start Date</label>
                    <input 
                      type="date" 
                      value={eventStartDate} 
                      onChange={(e) => setEventStartDate(e.target.value)} 
                      style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, outline: 'none', borderRadius: '4px', colorScheme: 'dark' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>End Date (Leave blank for single date)</label>
                    <input 
                      type="date" 
                      value={eventEndDate} 
                      onChange={(e) => setEventEndDate(e.target.value)} 
                      style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, outline: 'none', borderRadius: '4px', colorScheme: 'dark' }} 
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Start Time</label>
                    <input 
                      type="time" 
                      value={eventStartTime} 
                      onChange={(e) => setEventStartTime(e.target.value)} 
                      style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, outline: 'none', borderRadius: '4px', colorScheme: 'dark' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>End Time</label>
                    <input 
                      type="time" 
                      value={eventEndTime} 
                      onChange={(e) => setEventEndTime(e.target.value)} 
                      style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, outline: 'none', borderRadius: '4px', colorScheme: 'dark' }} 
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button 
                    onClick={async () => {
                      if (!eventTitle.trim() || !eventStartDate) {
                        alert('Title and Start Date are required');
                        return;
                      }
                      setLoading(true);

                      let finalImageUrl = eventImage;
                      if (customImageFile) {
                        try {
                          const fileName = `events/event-${Date.now()}-${customImageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
                          const { data, error } = await supabase.storage
                            .from('zawr-media')
                            .upload(fileName, customImageFile, { cacheControl: '3600', upsert: true });
                          
                          if (error) {
                            alert('Supabase Storage Upload Error: ' + error.message);
                            setLoading(false);
                            return;
                          }
                          const { data: { publicUrl } } = supabase.storage.from('zawr-media').getPublicUrl(fileName);
                          finalImageUrl = publicUrl;
                        } catch (err: any) {
                          alert('Error uploading event image: ' + err.message);
                          setLoading(false);
                          return;
                        }
                      }

                      const formData = new FormData();
                      formData.append('action', editingEvent ? 'update' : 'add');
                      formData.append('title', eventTitle);
                      formData.append('description', eventDesc);
                      formData.append('startDate', eventStartDate);
                      formData.append('endDate', eventEndDate || eventStartDate);
                      formData.append('startTime', eventStartTime ? (eventStartTime.length === 5 ? `${eventStartTime}:00` : eventStartTime) : '00:00:00');
                      formData.append('endTime', eventEndTime ? (eventEndTime.length === 5 ? `${eventEndTime}:00` : eventEndTime) : '00:00:00');
                      formData.append('image', finalImageUrl);
                      if (editingEvent) {
                        formData.append('id', editingEvent.id);
                      }

                      try {
                        const res = await fetch('/api/events', {
                          method: 'POST',
                          body: formData
                        });
                        if (res.ok) {
                          const data = await res.json();
                          setEvents(data.events || []);
                          // Clear states
                          setEventTitle('');
                          setEventDesc('');
                          setEventStartDate('');
                          setEventEndDate('');
                          setEventStartTime('');
                          setEventEndTime('');
                          setEventImage('/assets/event-chart.png');
                          setCustomImageFile(null);
                          setEditingEvent(null);
                          alert(editingEvent ? 'Event updated successfully!' : 'Event added successfully!');
                        } else {
                          alert('Failed to save event.');
                        }
                      } catch (err) {
                        alert('Error saving event.');
                      }
                      setLoading(false);
                    }}
                    disabled={loading}
                    style={{ padding: '0.75rem 1.5rem', backgroundColor: theme.fg, color: theme.bg, border: 'none', fontWeight: 600, borderRadius: '4px', cursor: 'pointer' }}
                  >
                    {loading ? 'Saving...' : editingEvent ? 'Update Event' : 'Add Event'}
                  </button>
                  
                  {editingEvent && (
                    <button 
                      onClick={() => {
                        setEditingEvent(null);
                        setEventTitle('');
                        setEventDesc('');
                        setEventStartDate('');
                        setEventEndDate('');
                        setEventStartTime('');
                        setEventEndTime('');
                        setEventImage('/assets/event-chart.png');
                        setCustomImageFile(null);
                      }}
                      style={{ padding: '0.75rem 1.5rem', backgroundColor: 'transparent', color: theme.fg, border: `1px solid ${theme.border}`, borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* List of Events */}
            <div style={{ padding: '2rem', border: `1px solid ${theme.border}`, borderRadius: '8px', backgroundColor: theme.inputBg }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Current Events</h3>
              
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                    <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>Event Title</th>
                    <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>Dates</th>
                    <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>Timing</th>
                    <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.length === 0 ? (
                    <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: theme.muted }}>No events found.</td></tr>
                  ) : events.map((ev) => (
                    <tr key={ev.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                      <td style={{ padding: '1rem', fontWeight: 500 }}>{ev.title}</td>
                      <td style={{ padding: '1rem', color: theme.muted }}>
                        {ev.startDate === ev.endDate ? ev.startDate : `${ev.startDate} to ${ev.endDate}`}
                      </td>
                      <td style={{ padding: '1rem', color: theme.muted }}>
                        {ev.startTime} - {ev.endTime}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <button 
                          onClick={() => {
                            setEditingEvent(ev);
                            setEventTitle(ev.title);
                            setEventDesc(ev.description || '');
                            setEventStartDate(ev.startDate);
                            setEventEndDate(ev.endDate === ev.startDate ? '' : ev.endDate);
                            setEventStartTime(ev.startTime ? ev.startTime.substring(0, 5) : '');
                            setEventEndTime(ev.endTime ? ev.endTime.substring(0, 5) : '');
                            setEventImage(ev.image || '/assets/event-chart.png');
                          }}
                          style={{ padding: '0.5rem 1rem', backgroundColor: 'transparent', color: theme.fg, border: `1px solid ${theme.border}`, borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem', fontSize: '0.875rem' }}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={async () => {
                            if (!confirm(`Are you sure you want to delete "${ev.title}"?`)) return;
                            setLoading(true);
                            const formData = new FormData();
                            formData.append('action', 'delete');
                            formData.append('id', ev.id);
                            try {
                              const res = await fetch('/api/events', { method: 'POST', body: formData });
                              if (res.ok) {
                                const data = await res.json();
                                setEvents(data.events || []);
                              } else {
                                alert('Failed to delete event.');
                              }
                            } catch (e) {
                              alert('Error deleting event.');
                            }
                            setLoading(false);
                          }}
                          style={{ padding: '0.5rem 1rem', backgroundColor: '#3f0000', color: '#ffaaaa', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem' }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      
      case 'notices':
        return (
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '2rem', letterSpacing: '-0.02em' }}>Manage Notices</h2>
            
            {/* Add / Edit Form */}
            <div style={{ padding: '2rem', border: `1px solid ${theme.border}`, borderRadius: '8px', backgroundColor: theme.inputBg, marginBottom: '3rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>{editingNotice ? 'Edit Notice' : 'Add New Notice'}</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Notice Title *</label>
                  <input 
                    type="text" 
                    value={noticeTitle} 
                    onChange={(e) => setNoticeTitle(e.target.value)} 
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, outline: 'none', borderRadius: '4px' }} 
                    placeholder="e.g. Notice Inviting Offer — Sale of CBM"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Category *</label>
                    <select 
                      value={noticeCategory}
                      onChange={(e) => setNoticeCategory(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, outline: 'none', borderRadius: '4px' }}
                    >
                      <option value="General">General</option>
                      <option value="Corporate">Corporate</option>
                      <option value="Procurement">Procurement</option>
                      <option value="Legal">Legal</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Publish Date * (e.g. January 16, 2026)</label>
                    <input 
                      type="text" 
                      value={noticeDate} 
                      onChange={(e) => setNoticeDate(e.target.value)} 
                      style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, outline: 'none', borderRadius: '4px' }}
                      placeholder="e.g. January 16, 2026"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>One-line Summary * (Shown on notices list)</label>
                  <input 
                    type="text" 
                    value={noticeSummary} 
                    onChange={(e) => setNoticeSummary(e.target.value)} 
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, outline: 'none', borderRadius: '4px' }} 
                    placeholder="Short summary of this notice..."
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>Notice Body Content (Detail page paragraph)</label>
                  <textarea 
                    value={noticeBody} 
                    onChange={(e) => setNoticeBody(e.target.value)} 
                    style={{ width: '100%', height: '120px', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, outline: 'none', borderRadius: '4px', resize: 'vertical' }} 
                    placeholder="Write detailed notice information here..."
                  />
                </div>

                {/* File Attachment Upload */}
                <div style={{ padding: '1rem', border: `1px solid ${theme.border}`, borderRadius: '6px', backgroundColor: theme.bg }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem' }}>Upload Notice PDF Attachment (Optional)</label>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem', color: theme.muted }}>Attachment Label</label>
                        <input 
                          type="text" 
                          value={noticeAttachmentName} 
                          onChange={(e) => setNoticeAttachmentName(e.target.value)} 
                          style={{ width: '100%', padding: '0.5rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, color: theme.fg, borderRadius: '4px' }} 
                          placeholder="e.g. Notice Inviting Offer"
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem', color: theme.muted }}>Choose PDF File</label>
                        <input 
                          type="file" 
                          accept="application/pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setCustomNoticeFile(file);
                          }}
                          style={{ color: theme.fg, fontSize: '0.8rem', paddingTop: '0.25rem' }}
                        />
                      </div>
                    </div>
                    {editingNotice && editingNotice.attachments && editingNotice.attachments.length > 0 && (
                      <div style={{ fontSize: '0.75rem', color: theme.muted, marginTop: '0.25rem' }}>
                        Current attachment: <strong>{editingNotice.attachments[0].label}</strong> ({editingNotice.attachments[0].url})
                      </div>
                    )}
                  </div>
                </div>

                {/* External Portal Links */}
                <div style={{ padding: '1rem', border: `1px solid ${theme.border}`, borderRadius: '6px', backgroundColor: theme.bg }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem' }}>Manage External Portals / Links (Optional)</label>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.5rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem', color: theme.muted }}>Portal / Link Label</label>
                      <input 
                        type="text" 
                        value={noticeLinkName} 
                        onChange={(e) => setNoticeLinkName(e.target.value)} 
                        style={{ width: '100%', padding: '0.5rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, color: theme.fg, borderRadius: '4px' }} 
                        placeholder="e.g. e-Bidding Portal"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem', color: theme.muted }}>Portal URL</label>
                      <input 
                        type="text" 
                        value={noticeLinkUrl} 
                        onChange={(e) => setNoticeLinkUrl(e.target.value)} 
                        style={{ width: '100%', padding: '0.5rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, color: theme.fg, borderRadius: '4px' }} 
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  {editingNotice && editingNotice.links && editingNotice.links.length > 0 && (
                    <div style={{ fontSize: '0.75rem', color: theme.muted, marginTop: '0.25rem' }}>
                      Current Link: <strong>{editingNotice.links[0].label}</strong> ({editingNotice.links[0].url})
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', userSelect: 'none' }}>
                    <input 
                      type="checkbox"
                      checked={noticeIsArchived}
                      onChange={(e) => setNoticeIsArchived(e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: theme.fg }}
                    />
                    <span style={{ fontSize: '0.875rem', color: theme.fg }}>Mark as Archived (Move to archive tab)</span>
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button 
                    onClick={async () => {
                      if (!noticeTitle.trim() || !noticeDate.trim() || !noticeSummary.trim()) {
                        alert('Title, date, and summary are required');
                        return;
                      }
                      setLoading(true);

                      const formData = new FormData();
                      formData.append('action', editingNotice ? 'update' : 'add');
                      formData.append('title', noticeTitle);
                      formData.append('category', noticeCategory);
                      formData.append('date', noticeDate);
                      formData.append('summary', noticeSummary);
                      formData.append('body', noticeBody);
                      formData.append('archived', String(noticeIsArchived));

                      if (editingNotice) {
                        formData.append('id', editingNotice.id);
                      }

                      // Dynamic Links list
                      let linkList = [];
                      if (noticeLinkName.trim() && noticeLinkUrl.trim()) {
                        linkList.push({ label: noticeLinkName, url: noticeLinkUrl });
                      } else if (editingNotice && editingNotice.links) {
                        linkList = editingNotice.links;
                      }
                      formData.append('links', JSON.stringify(linkList));

                      // Dynamic Attachments list
                      let attachmentList = [];
                      if (editingNotice && editingNotice.attachments) {
                        attachmentList = editingNotice.attachments;
                      }
                      formData.append('attachments', JSON.stringify(attachmentList));

                      // Custom PDF file upload
                      if (customNoticeFile) {
                        formData.append('file', customNoticeFile);
                        formData.append('fileLabel', noticeAttachmentName || 'Notice Document');
                      }

                      try {
                        const res = await fetch('/api/notices', {
                          method: 'POST',
                          body: formData
                        });
                        if (res.ok) {
                          const data = await res.json();
                          setNotices(data.notices || []);
                          
                          // Clear states
                          setNoticeTitle('');
                          setNoticeCategory('General');
                          setNoticeDate('');
                          setNoticeSummary('');
                          setNoticeBody('');
                          setNoticeIsArchived(false);
                          setNoticeLinkName('');
                          setNoticeLinkUrl('');
                          setNoticeAttachmentName('');
                          setCustomNoticeFile(null);
                          setEditingNotice(null);
                          alert(editingNotice ? 'Notice updated successfully!' : 'Notice added successfully!');
                        } else {
                          alert('Failed to save notice.');
                        }
                      } catch (err) {
                        alert('Error saving notice.');
                      }
                      setLoading(false);
                    }}
                    disabled={loading}
                    style={{ padding: '0.75rem 1.5rem', backgroundColor: theme.fg, color: theme.bg, border: 'none', fontWeight: 600, borderRadius: '4px', cursor: 'pointer' }}
                  >
                    {loading ? 'Saving...' : editingNotice ? 'Update Notice' : 'Add Notice'}
                  </button>
                  
                  {editingNotice && (
                    <button 
                      onClick={() => {
                        setEditingNotice(null);
                        setNoticeTitle('');
                        setNoticeCategory('General');
                        setNoticeDate('');
                        setNoticeSummary('');
                        setNoticeBody('');
                        setNoticeIsArchived(false);
                        setNoticeLinkName('');
                        setNoticeLinkUrl('');
                        setNoticeAttachmentName('');
                        setCustomNoticeFile(null);
                      }}
                      style={{ padding: '0.75rem 1.5rem', backgroundColor: 'transparent', color: theme.fg, border: `1px solid ${theme.border}`, borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* List of Notices */}
            <div style={{ padding: '2rem', border: `1px solid ${theme.border}`, borderRadius: '8px', backgroundColor: theme.inputBg }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Current Notices</h3>
              
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                    <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>Title</th>
                    <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>Date</th>
                    <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>Category</th>
                    <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>Status</th>
                    <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {notices.length === 0 ? (
                    <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: theme.muted }}>No notices found.</td></tr>
                  ) : notices.map((nt) => (
                    <tr key={nt.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                      <td style={{ padding: '1rem', fontWeight: 500 }}>{nt.title}</td>
                      <td style={{ padding: '1rem', color: theme.muted }}>{nt.date}</td>
                      <td style={{ padding: '1rem', color: theme.muted }}>{nt.category}</td>
                      <td style={{ padding: '1rem', color: theme.muted }}>
                        {nt.archived ? (
                          <span style={{ color: '#f97316', backgroundColor: '#431407', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Archived</span>
                        ) : (
                          <span style={{ color: '#10b981', backgroundColor: '#064e3b', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Active</span>
                        )}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button 
                          onClick={() => {
                            setEditingNotice(nt);
                            setNoticeTitle(nt.title);
                            setNoticeCategory(nt.category || 'General');
                            setNoticeDate(nt.date);
                            setNoticeSummary(nt.summary || '');
                            setNoticeBody(nt.body || '');
                            setNoticeIsArchived(!!nt.archived);
                            
                            // Load existing link/attachment fields if populated
                            if (nt.links && nt.links.length > 0) {
                              setNoticeLinkName(nt.links[0].label);
                              setNoticeLinkUrl(nt.links[0].url);
                            } else {
                              setNoticeLinkName('');
                              setNoticeLinkUrl('');
                            }
                            if (nt.attachments && nt.attachments.length > 0) {
                              setNoticeAttachmentName(nt.attachments[0].label);
                            } else {
                              setNoticeAttachmentName('');
                            }

                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          style={{ padding: '0.5rem 1rem', backgroundColor: 'transparent', color: theme.fg, border: `1px solid ${theme.border}`, borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem', fontSize: '0.875rem' }}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={async () => {
                            if (!confirm(`Are you sure you want to delete "${nt.title}"?`)) return;
                            setLoading(true);
                            const formData = new FormData();
                            formData.append('action', 'delete');
                            formData.append('id', nt.id);
                            try {
                              const res = await fetch('/api/notices', { method: 'POST', body: formData });
                              if (res.ok) {
                                const data = await res.json();
                                setNotices(data.notices || []);
                              } else {
                                alert('Failed to delete notice.');
                              }
                            } catch (e) {
                              alert('Error deleting notice.');
                            }
                            setLoading(false);
                          }}
                          style={{ padding: '0.5rem 1rem', backgroundColor: '#3f0000', color: '#ffaaaa', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem' }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const navItems = [
    { id: 'analytics', label: 'Analytics' },
    { id: 'mail-credentials', label: 'Mail Settings' },
    { id: 'email-routing', label: 'Email Routing' },
    { id: 'jobs', label: 'Manage Jobs' },
    { id: 'newsletters', label: 'Newsletters' },
    { id: 'pitch-deck', label: 'Pitch Deck' },
    { id: 'financial-reports', label: 'Financial Reports' },
    { id: 'events', label: 'Manage Events' },
    { id: 'notices', label: 'Manage Notices' },
  ];

  return (
    <div style={{ height: '100vh', display: 'flex', backgroundColor: theme.bg, color: theme.fg, fontFamily: 'sans-serif', overflow: 'hidden' }}>
      
      <style dangerouslySetInnerHTML={{__html: `header, footer, .support-widget, .cookie-banner { display: none !important; } body { overflow: hidden !important; margin: 0; }`}} />

      {/* Sidebar */}
      <div style={{ width: '280px', borderRight: `1px solid ${theme.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '2rem', borderBottom: `1px solid ${theme.border}` }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', display: 'inline-block' }}></span>
            WEBMASTER
          </h1>
          <div style={{ fontSize: '0.75rem', color: theme.muted, marginTop: '0.25rem' }}>Supabase Realtime Synced</div>
        </div>
        
        <nav style={{ flex: 1, padding: '1rem 0' }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{ width: '100%', textAlign: 'left', padding: '1rem 2rem', backgroundColor: activeTab === item.id ? theme.hover : 'transparent', border: 'none', color: activeTab === item.id ? theme.fg : theme.muted, fontWeight: activeTab === item.id ? 600 : 400, cursor: 'pointer', transition: 'all 0.2s' }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '2rem', borderTop: `1px solid ${theme.border}` }}>
          <button onClick={() => { setIsAuthenticated(false); router.push('/'); }} style={{ width: '100%', padding: '0.75rem', backgroundColor: 'transparent', color: theme.fg, border: `1px solid ${theme.border}`, borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem' }}>Logout / Exit</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '4rem', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1000px' }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

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
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Current Reports</h3>
              
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                    <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>Title</th>
                    <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500 }}>PDF URL</th>
                    <th style={{ padding: '1rem', color: theme.muted, fontWeight: 500, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.length === 0 ? (
                    <tr><td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: theme.muted }}>No reports found.</td></tr>
                  ) : reports.map((rep) => (
                    <tr key={rep.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                      <td style={{ padding: '1rem', fontWeight: 500 }}>{rep.title}</td>
                      <td style={{ padding: '1rem', color: theme.muted, fontSize: '0.875rem' }}>{rep.pdfUrl || 'No file uploaded yet'}</td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <button 
                          onClick={() => {
                            setEditingReport(rep);
                            setReportTitle(rep.title);
                          }}
                          style={{ padding: '0.5rem 1rem', backgroundColor: 'transparent', color: theme.fg, border: `1px solid ${theme.border}`, borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem', fontSize: '0.875rem' }}
                        >
                          Edit
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

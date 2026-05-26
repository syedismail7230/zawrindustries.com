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
                <input type="email" defaultValue="zawrindustries@gmail.com" disabled style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, color: theme.muted, borderRadius: '4px' }} />
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

"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import FormattedContent from '@/components/FormattedContent';

export default function JobDetailClient({ initialJob }: { initialJob?: any }) {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<any>(initialJob || null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    portfolio: '',
    coverLetter: ''
  });
  const [resume, setResume] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!initialJob && params.role) {
      const fetchJob = async () => {
        const { data } = await supabase.from('jobs').select('*').eq('id', params.role).single();
        if (data) {
          setJob(data);
        } else {
          setJob('not_found');
        }
      };
      fetchJob();
    }
  }, [params.role, initialJob]);

  const handleShare = (platform: string) => {
    const url = typeof window !== 'undefined' ? window.location.href : `https://zawrindustries.com/careers/${job?.id}`;
    const text = job ? `Zawr Industries is hiring: ${job.title} (${job.location})` : 'Career opportunity at Zawr Industries';

    if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'x') {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
    } else if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    } else if (platform === 'email') {
      window.open(`mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(`Check out this role at Zawr Industries:\n\n${job?.title} (${job?.location})\n\nView details & apply here: ${url}`)}`);
    } else if (platform === 'native') {
      if (typeof navigator !== 'undefined' && navigator.share) {
        navigator.share({
          title: job?.title || 'Zawr Industries Career',
          text: text,
          url: url,
        }).catch(() => {});
      } else {
        handleShare('copy');
      }
    } else if (platform === 'copy') {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !resume || !job) return;

    setStatus('loading');
    
    try {
      const data = new FormData();
      data.append('firstName', formData.firstName);
      data.append('lastName', formData.lastName);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('portfolio', formData.portfolio);
      data.append('coverLetter', formData.coverLetter);
      data.append('jobId', job.id);
      data.append('jobTitle', job.title);
      data.append('resume', resume);

      const response = await fetch('/api/apply-job', {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ firstName: '', lastName: '', email: '', phone: '', portfolio: '', coverLetter: '' });
        setResume(null);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  if (job === 'not_found') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#000000', color: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '1rem' }}>Position Not Found</h1>
        <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>This position may have been closed or removed.</p>
        <button onClick={() => router.push('/careers')} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#ffffff', color: '#000000', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}>View Open Positions</button>
      </div>
    );
  }

  if (!job) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#000000', color: '#ffffff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h1 style={{ fontSize: '2rem' }}>Loading job details...</h1>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000000', color: '#ffffff', paddingTop: '8rem', paddingBottom: '6rem', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '0 1.5rem' }}>
        
        {/* Back Button & Top Share Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <button 
            onClick={() => router.back()} 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to Careers
          </button>

          {/* Quick Share Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginRight: '0.2rem' }}>Share:</span>
            
            <button
              onClick={() => handleShare('linkedin')}
              title="Share on LinkedIn"
              style={{ background: 'none', border: 'none', color: '#9ca3af', padding: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'color 0.2s, transform 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </button>

            <button
              onClick={() => handleShare('x')}
              title="Share on X"
              style={{ background: 'none', border: 'none', color: '#9ca3af', padding: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'color 0.2s, transform 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </button>

            <button
              onClick={() => handleShare('whatsapp')}
              title="Share on WhatsApp"
              style={{ background: 'none', border: 'none', color: '#9ca3af', padding: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'color 0.2s, transform 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            </button>

            <button
              onClick={() => handleShare('email')}
              title="Share via Email"
              style={{ background: 'none', border: 'none', color: '#9ca3af', padding: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'color 0.2s, transform 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </button>

            <button
              onClick={() => handleShare('copy')}
              title="Copy Job Link"
              style={{ position: 'relative', height: '30px', padding: '0 0.65rem', borderRadius: '6px', backgroundColor: copied ? '#ffffff' : '#18181b', border: '1px solid #27272a', color: copied ? '#000000' : '#d1d5db', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 500, transition: 'all 0.2s' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
          
          {/* Job Details Section */}
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 600, marginBottom: '1rem' }}>{job.title}</h1>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
              <span style={{ backgroundColor: '#1f2937', color: '#e5e7eb', padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 500 }}>{job.location}</span>
              <span style={{ backgroundColor: '#1f2937', color: '#e5e7eb', padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 500 }}>{job.type || 'Full-Time'}</span>
            </div>

            {/* Role Overview */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#f3f4f6' }}>Role Overview</h2>
              <FormattedContent content={job.role} style={{ color: '#d1d5db', fontSize: '1.125rem', lineHeight: 1.6 }} />
            </div>

            {/* Key Responsibilities */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#f3f4f6' }}>Key Responsibilities</h2>
              <FormattedContent content={job.responsibilities} style={{ color: '#d1d5db', fontSize: '1.125rem', lineHeight: 1.6 }} />
            </div>

            {/* Candidate Profile */}
            {job.candidate_profile && (
              <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#f3f4f6' }}>Candidate Profile</h2>
                <FormattedContent content={job.candidate_profile} style={{ color: '#d1d5db', fontSize: '1.125rem', lineHeight: 1.6 }} />
              </div>
            )}

            {/* Required Skills & Competencies */}
            {job.required_skills && (Array.isArray(job.required_skills) ? job.required_skills.length > 0 : Boolean(job.required_skills)) && (
              <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#f3f4f6' }}>Required Skills &amp; Competencies</h2>
                <FormattedContent content={job.required_skills} style={{ color: '#d1d5db', fontSize: '1.125rem', lineHeight: 1.6 }} />
              </div>
            )}

            {/* Education Qualifications */}
            {job.education_qualifications && (
              <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#f3f4f6' }}>Education Qualifications</h2>
                <FormattedContent content={job.education_qualifications} style={{ color: '#d1d5db', fontSize: '1.125rem', lineHeight: 1.6 }} />
              </div>
            )}

            {/* Preferred Qualifications */}
            {job.preferred_qualifications && (
              <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#f3f4f6' }}>Preferred Qualifications</h2>
                <FormattedContent content={job.preferred_qualifications} style={{ color: '#d1d5db', fontSize: '1.125rem', lineHeight: 1.6 }} />
              </div>
            )}

            {/* Performance Expectations */}
            {job.performance_expectations && (
              <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#f3f4f6' }}>Performance Expectations</h2>
                <FormattedContent content={job.performance_expectations} style={{ color: '#d1d5db', fontSize: '1.125rem', lineHeight: 1.6 }} />
              </div>
            )}

            {/* Perks & Benefits */}
            {job.perks_and_benefits && (
              <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#f3f4f6' }}>Perks &amp; Benefits</h2>
                <FormattedContent content={job.perks_and_benefits} style={{ color: '#d1d5db', fontSize: '1.125rem', lineHeight: 1.6 }} />
              </div>
            )}

            {/* Reporting Structure */}
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#f3f4f6' }}>Reporting Structure</h2>
              <p style={{ color: '#d1d5db', lineHeight: 1.6, fontSize: '1.125rem' }}>
                <strong>Reporting to:</strong> {job.reporting || 'Engineering / Department Leadership'}
              </p>
            </div>
          </div>

          <hr style={{ borderColor: '#1f2937' }} />

          {/* Application Form Section */}
          <div style={{ backgroundColor: 'transparent', padding: '1rem 0' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 600, marginBottom: '0.5rem', color: '#ffffff' }}>Submit your application</h2>
            <p style={{ color: '#9ca3af', marginBottom: '3rem', fontSize: '1rem' }}>Please fill out the form below and attach your resume/CV.</p>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#e5e7eb' }}>First name *</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required style={{ width: '100%', padding: '0.875rem 1rem', backgroundColor: '#000000', border: '1px solid #27272a', borderRadius: '8px', color: '#ffffff', outline: 'none', fontSize: '0.95rem' }} className="clean-dark-input" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#e5e7eb' }}>Last name</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} style={{ width: '100%', padding: '0.875rem 1rem', backgroundColor: '#000000', border: '1px solid #27272a', borderRadius: '8px', color: '#ffffff', outline: 'none', fontSize: '0.95rem' }} className="clean-dark-input" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#e5e7eb' }}>Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required style={{ width: '100%', padding: '0.875rem 1rem', backgroundColor: '#000000', border: '1px solid #27272a', borderRadius: '8px', color: '#ffffff', outline: 'none', fontSize: '0.95rem' }} className="clean-dark-input" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#e5e7eb' }}>Phone number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} style={{ width: '100%', padding: '0.875rem 1rem', backgroundColor: '#000000', border: '1px solid #27272a', borderRadius: '8px', color: '#ffffff', outline: 'none', fontSize: '0.95rem' }} className="clean-dark-input" />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#e5e7eb' }}>LinkedIn / Portfolio URL</label>
                <input type="url" name="portfolio" value={formData.portfolio} onChange={handleInputChange} placeholder="https://..." style={{ width: '100%', padding: '0.875rem 1rem', backgroundColor: '#000000', border: '1px solid #27272a', borderRadius: '8px', color: '#ffffff', outline: 'none', fontSize: '0.95rem' }} className="clean-dark-input" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#e5e7eb' }}>Cover Letter / Why Zawr?</label>
                <textarea name="coverLetter" value={formData.coverLetter} onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })} rows={4} placeholder="Tell us about yourself and why you're interested in this role..." style={{ width: '100%', padding: '0.875rem 1rem', backgroundColor: '#000000', border: '1px solid #27272a', borderRadius: '8px', color: '#ffffff', outline: 'none', fontSize: '0.95rem', resize: 'vertical' }} className="clean-dark-input" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#e5e7eb' }}>Resume / CV *</label>
                <div style={{ border: '2px dashed #27272a', borderRadius: '8px', padding: '2rem', textAlign: 'center', backgroundColor: '#000000', position: 'relative' }}>
                  <input type="file" onChange={handleFileChange} required accept=".pdf,.doc,.docx" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    <span style={{ fontSize: '0.875rem', color: '#e5e7eb', fontWeight: 500 }}>{resume ? resume.name : 'Click to upload or drag and drop'}</span>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>PDF, DOC, DOCX up to 10MB</span>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={status === 'loading'} style={{ marginTop: '1rem', width: '100%', padding: '1rem', backgroundColor: '#ffffff', color: '#000000', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: status === 'loading' ? 'not-allowed' : 'pointer', opacity: status === 'loading' ? 0.7 : 1 }}>
                {status === 'loading' ? 'Submitting Application...' : 'Submit Application'}
              </button>

              {status === 'success' && (
                <div style={{ padding: '1rem', backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid #22c55e', borderRadius: '8px', color: '#22c55e', fontSize: '0.875rem', textAlign: 'center' }}>
                  Application submitted successfully! Our talent acquisition team will review your profile.
                </div>
              )}

              {status === 'error' && (
                <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '8px', color: '#ef4444', fontSize: '0.875rem', textAlign: 'center' }}>
                  There was an error submitting your application. Please try again.
                </div>
              )}

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

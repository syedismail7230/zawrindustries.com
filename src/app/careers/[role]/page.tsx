"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// Maps DB employment type → Google Jobs schema enum
function toGoogleEmploymentType(type: string): string {
  const t = (type || '').toLowerCase();
  if (t.includes('full')) return 'FULL_TIME';
  if (t.includes('part')) return 'PART_TIME';
  if (t.includes('contract')) return 'CONTRACTOR';
  if (t.includes('intern')) return 'INTERN';
  if (t.includes('temp')) return 'TEMPORARY';
  return 'FULL_TIME';
}

// Build the JobPosting JSON-LD object from a job record
function buildJobPostingSchema(job: any): object {
  const datePosted = job.created_at
    ? new Date(job.created_at).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];

  const validThrough = new Date(
    new Date(datePosted).getTime() + 90 * 24 * 60 * 60 * 1000
  ).toISOString().split('T')[0];

  const isRemote = /remote/i.test(job.location || '');

  const description = [
    job.role,
    job.responsibilities?.length
      ? `Key Responsibilities:\n${(job.responsibilities as string[]).map(r => `• ${r}`).join('\n')}`
      : '',
    job.reporting ? `Reporting to: ${job.reporting}` : ''
  ].filter(Boolean).join('\n\n');

  const schema: any = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    title: job.title,
    description,
    datePosted,
    validThrough,
    employmentType: toGoogleEmploymentType(job.type),
    hiringOrganization: {
      '@type': 'Organization',
      name: 'Zawr Industries',
      sameAs: 'https://zawrindustries.com',
      logo: 'https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto:good,w_400,c_limit/v1783710570/zawr/assets/zawr-logo.png',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location,
        addressCountry: 'IN',
      },
    },
    directApply: true,
  };

  if (isRemote) {
    schema.jobLocationType = 'TELECOMMUTE';
    schema.applicantLocationRequirements = {
      '@type': 'Country',
      name: 'India',
    };
  }

  return schema;
}

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  
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

  useEffect(() => {
    const fetchJob = async () => {
      if (params.role) {
        const { data, error } = await supabase.from('jobs').select('*').eq('id', params.role).single();
        if (data) {
          setJob(data);
        } else {
          setJob('not_found');
        }
      }
    };
    fetchJob();
  }, [params.role]);

  const [copied, setCopied] = useState(false);

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
      if (navigator.share) {
        navigator.share({
          title: job?.title || 'Zawr Industries Career',
          text: text,
          url: url,
        }).catch(() => {});
      } else {
        handleShare('copy');
      }
    } else if (platform === 'copy') {
      if (navigator.clipboard) {
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
        body: data, // No Content-Type header so browser sets multipart/form-data with boundary
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
      {/* Google Jobs Structured Data — JobPosting schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJobPostingSchema(job)) }}
      />
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginRight: '0.25rem' }}>Share:</span>
            
            <button
              onClick={() => handleShare('linkedin')}
              title="Share on LinkedIn"
              style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: '#18181b', border: '1px solid #27272a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </button>

            <button
              onClick={() => handleShare('x')}
              title="Share on X"
              style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: '#18181b', border: '1px solid #27272a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </button>

            <button
              onClick={() => handleShare('whatsapp')}
              title="Share on WhatsApp"
              style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: '#18181b', border: '1px solid #27272a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            </button>

            <button
              onClick={() => handleShare('email')}
              title="Share via Email"
              style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: '#18181b', border: '1px solid #27272a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </button>

            <button
              onClick={() => handleShare('copy')}
              title="Copy Job Link"
              style={{ position: 'relative', height: '34px', padding: '0 0.75rem', borderRadius: '9999px', backgroundColor: copied ? '#ffffff' : '#18181b', border: '1px solid #27272a', color: copied ? '#000000' : '#ffffff', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, transition: 'all 0.2s' }}
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

            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#f3f4f6' }}>Role Overview</h2>
              <p style={{ color: '#d1d5db', lineHeight: 1.6, fontSize: '1.125rem' }}>{job.role}</p>
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#f3f4f6' }}>Key Responsibilities</h2>
              <ul style={{ color: '#d1d5db', lineHeight: 1.6, fontSize: '1.125rem', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {job.responsibilities && Array.isArray(job.responsibilities) && job.responsibilities.map((resp: string, idx: number) => (
                  <li key={idx}>{resp}</li>
                ))}
              </ul>
            </div>

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
                <input type="url" name="portfolio" value={formData.portfolio} onChange={handleInputChange} placeholder="https://" style={{ width: '100%', padding: '0.875rem 1rem', backgroundColor: '#000000', border: '1px solid #27272a', borderRadius: '8px', color: '#ffffff', outline: 'none', fontSize: '0.95rem' }} className="clean-dark-input" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#e5e7eb' }}>What makes you the best fit for this role? *</label>
                <textarea name="coverLetter" value={formData.coverLetter} onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })} required rows={5} placeholder="Tell us about your experience and why you'd be a great addition to the team..." style={{ width: '100%', padding: '0.875rem 1rem', backgroundColor: '#000000', border: '1px solid #27272a', borderRadius: '8px', color: '#ffffff', outline: 'none', resize: 'vertical', fontSize: '0.95rem' }} className="clean-dark-input" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#e5e7eb' }}>Resume/CV *</label>
                <div
                  onClick={() => document.getElementById('role-resume-file-input')?.click()}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      setResume(e.dataTransfer.files[0]);
                    }
                  }}
                  style={{
                    border: '1.5px dashed #3f3f46',
                    borderRadius: '12px',
                    backgroundColor: '#09090b',
                    padding: '1.75rem 1.5rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.625rem',
                  }}
                  className="file-dropzone-hover"
                >
                  <input
                    id="role-resume-file-input"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    required={!resume}
                    style={{ display: 'none' }}
                  />

                  {resume ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#18181b', border: '1px solid #27272a', padding: '0.625rem 1rem', borderRadius: '8px', width: '100%', maxWidth: '420px', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', overflow: 'hidden' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                          <polyline points="14 2 14 8 20 8"/>
                        </svg>
                        <div style={{ textAlign: 'left', overflow: 'hidden' }}>
                          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ffffff', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{resume.name}</p>
                          <p style={{ fontSize: '0.75rem', color: '#71717a', margin: 0 }}>{(resume.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setResume(null);
                        }}
                        style={{ backgroundColor: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1rem', padding: '0.25rem' }}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <>
                      <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#18181b', border: '1px solid #27272a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="17 8 12 3 7 8"/>
                          <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.925rem', fontWeight: 600, color: '#ffffff', margin: '0 0 0.25rem 0' }}>
                          Click to upload <span style={{ fontWeight: 400, color: '#71717a' }}>or drag and drop</span>
                        </p>
                        <p style={{ fontSize: '0.78rem', color: '#71717a', margin: 0 }}>
                          PDF, DOC, or DOCX (Max 5MB)
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <button 
                type="submit"
                disabled={status === 'loading'}
                style={{ 
                  marginTop: '1rem',
                  width: '100%', 
                  backgroundColor: '#ffffff', 
                  color: '#000000', 
                  padding: '1rem 1.5rem', 
                  borderRadius: '9999px', 
                  fontSize: '1rem', 
                  fontWeight: 600, 
                  border: 'none', 
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  opacity: status === 'loading' ? 0.7 : 1,
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                {status === 'loading' ? 'Submitting...' : status === 'success' ? 'Application Received ✓' : 'Submit Application'}
              </button>

              {status === 'error' && (
                <p style={{ color: '#ef4444', textAlign: 'center', marginTop: '0.5rem', fontSize: '0.875rem' }}>Failed to submit application. Please try again.</p>
              )}
            </form>

            <style>{`
              .clean-dark-input:focus {
                border-color: #52525b !important;
              }
            `}</style>
          </div>

        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function CareersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("All");
  const [selectedWorkMode, setSelectedWorkMode] = useState("All");
  const [countryQuery, setCountryQuery] = useState("");
  const [stateQuery, setStateQuery] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  
  const [dbJobs, setDbJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Freelance Modal State
  const [isFreelanceModalOpen, setIsFreelanceModalOpen] = useState(false);
  const [freelanceSubmitting, setFreelanceSubmitting] = useState(false);
  const [freelanceSuccess, setFreelanceSuccess] = useState(false);
  const [freelanceError, setFreelanceError] = useState('');
  const [freelanceForm, setFreelanceForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    skill: '',
    portfolio: '',
    coverLetter: '',
  });
  const [freelanceResume, setFreelanceResume] = useState<File | null>(null);

  const jobsPerPage = 20;

  useEffect(() => {
    const fetchJobs = async () => {
      const { data } = await supabase.from('jobs').select('*').eq('status', 'Active');
      if (data) {
        setDbJobs(data);
      }
      setIsLoading(false);
    };
    fetchJobs();
  }, []);

  // Discriminator helpers to prevent Cities & Work Setups from bleeding into State suggestions
  const KNOWN_CITIES = useMemo(() => new Set([
    'bangalore', 'bengaluru', 'mumbai', 'delhi', 'new delhi', 'dubai', 'abu dhabi',
    'london', 'san francisco', 'new york', 'singapore', 'toronto', 'riyadh',
    'berlin', 'tokyo', 'sydney', 'chicago', 'seattle', 'boston', 'austin'
  ]), []);

  const isWorkSetup = (val: string) => {
    if (!val) return true;
    const l = val.toLowerCase().trim();
    return /^(field|hybrid|field\s*[\/\-]\s*hybrid|on-site|onsite|on-site\s*[\/\-]\s*hybrid|remote|remote\s*[\/\-]\s*hybrid|full-time|contract|part-time|internship)$/i.test(l);
  };

  const parsedJobs = useMemo(() => {
    return dbJobs.map(job => {
      const raw = (job.location || '').trim();
      const typeRaw = (job.type || '').trim();

      // Detect work mode (On-site, Hybrid, Remote, Field)
      let workMode = 'Full-time';
      const combo = `${typeRaw} ${raw}`.toLowerCase();
      if (combo.includes('remote')) workMode = 'Remote';
      else if (combo.includes('hybrid')) workMode = 'Hybrid';
      else if (combo.includes('field')) workMode = 'Field';
      else if (combo.includes('on-site') || combo.includes('onsite') || combo.includes('office')) workMode = 'On-site';
      else if (typeRaw) workMode = typeRaw;

      let city = '';
      let state = '';
      let country = '';

      if (!isWorkSetup(raw)) {
        const parts = raw.split(',').map((s: string) => s.trim()).filter(Boolean);
        if (parts.length >= 3) {
          city = parts[0];
          state = parts[1];
          country = parts[parts.length - 1];
        } else if (parts.length === 2) {
          city = parts[0];
          // Only assign to state if parts[0] is not a known city
          if (!KNOWN_CITIES.has(parts[0].toLowerCase())) {
            state = parts[0];
          }
          country = parts[1];
        } else if (parts.length === 1 && !isWorkSetup(parts[0])) {
          if (KNOWN_CITIES.has(parts[0].toLowerCase())) {
            city = parts[0];
          } else {
            country = parts[0];
          }
        }
      }

      return {
        ...job,
        parsedLoc: { city, state, country, workMode, raw }
      };
    });
  }, [dbJobs, KNOWN_CITIES]);

  const uniqueTeams = useMemo(() => {
    const teams = new Set<string>();
    dbJobs.forEach(j => {
      const teamVal = j.team || j.department || j.category;
      if (teamVal) teams.add(teamVal.trim());
    });
    return Array.from(teams).sort();
  }, [dbJobs]);

  const uniqueWorkModes = useMemo(() => {
    const modes = new Set<string>();
    parsedJobs.forEach(j => {
      if (j.parsedLoc.workMode) modes.add(j.parsedLoc.workMode);
    });
    return Array.from(modes).sort();
  }, [parsedJobs]);

  // Clean, strictly validated location suggestions for autocomplete
  const globalCountries = useMemo(() => {
    const setC = new Set<string>(['Australia', 'Canada', 'Germany', 'India', 'Saudi Arabia', 'Singapore', 'United Arab Emirates', 'United Kingdom', 'United States']);
    parsedJobs.forEach(j => {
      if (j.parsedLoc.country && !isWorkSetup(j.parsedLoc.country) && !KNOWN_CITIES.has(j.parsedLoc.country.toLowerCase())) {
        setC.add(j.parsedLoc.country);
      }
    });
    return Array.from(setC).sort();
  }, [parsedJobs, KNOWN_CITIES]);

  const globalStates = useMemo(() => {
    const setS = new Set<string>(['California', 'Dubai', 'Greater London', 'Karnataka', 'Maharashtra', 'New York State', 'Ontario', 'Riyadh Region', 'Texas']);
    parsedJobs.forEach(j => {
      if (j.parsedLoc.state && !isWorkSetup(j.parsedLoc.state) && !KNOWN_CITIES.has(j.parsedLoc.state.toLowerCase())) {
        setS.add(j.parsedLoc.state);
      }
    });
    return Array.from(setS).sort();
  }, [parsedJobs, KNOWN_CITIES]);

  const globalCities = useMemo(() => {
    const setCt = new Set<string>(['Abu Dhabi', 'Bangalore', 'Delhi', 'Dubai', 'London', 'Mumbai', 'New York', 'Riyadh', 'San Francisco', 'Singapore', 'Toronto']);
    parsedJobs.forEach(j => {
      if (j.parsedLoc.city && !isWorkSetup(j.parsedLoc.city)) {
        setCt.add(j.parsedLoc.city);
      }
    });
    return Array.from(setCt).sort();
  }, [parsedJobs]);

  const filteredJobs = useMemo(() => {
    return parsedJobs.filter(job => {
      const query = searchQuery.toLowerCase().trim();
      const matchSearch = !query || 
        (job.title && job.title.toLowerCase().includes(query)) ||
        (job.type && job.type.toLowerCase().includes(query)) ||
        (job.location && job.location.toLowerCase().includes(query)) ||
        (job.role && job.role.toLowerCase().includes(query));

      const jobTeam = (job.team || job.department || job.category || '').trim();
      const matchTeam = selectedTeam === 'All' || jobTeam.toLowerCase() === selectedTeam.toLowerCase();

      const matchWorkMode = selectedWorkMode === 'All' || job.parsedLoc.workMode.toLowerCase().includes(selectedWorkMode.toLowerCase());
      
      const cQ = countryQuery.toLowerCase().trim();
      const matchCountry = !cQ || (job.location && job.location.toLowerCase().includes(cQ)) || job.parsedLoc.country.toLowerCase().includes(cQ);

      const sQ = stateQuery.toLowerCase().trim();
      const matchState = !sQ || (job.location && job.location.toLowerCase().includes(sQ)) || job.parsedLoc.state.toLowerCase().includes(sQ);

      const ctQ = cityQuery.toLowerCase().trim();
      const matchCity = !ctQ || (job.location && job.location.toLowerCase().includes(ctQ)) || job.parsedLoc.city.toLowerCase().includes(ctQ);

      return matchSearch && matchTeam && matchWorkMode && matchCountry && matchState && matchCity;
    });
  }, [parsedJobs, searchQuery, selectedTeam, selectedWorkMode, countryQuery, stateQuery, cityQuery]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedTeam, selectedWorkMode, countryQuery, stateQuery, cityQuery]);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage) || 1;
  
  const currentJobs = useMemo(() => {
    const start = (currentPage - 1) * jobsPerPage;
    return filteredJobs.slice(start, start + jobsPerPage);
  }, [filteredJobs, currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };

  const handleFreelanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFreelanceSubmitting(true);
    setFreelanceError('');

    try {
      const data = new FormData();
      data.append('fullName', freelanceForm.fullName);
      data.append('email', freelanceForm.email);
      data.append('phone', freelanceForm.phone);
      data.append('skill', freelanceForm.skill);
      data.append('portfolio', freelanceForm.portfolio);
      data.append('coverLetter', freelanceForm.coverLetter);
      if (freelanceResume) {
        data.append('resume', freelanceResume);
      }

      const res = await fetch('/api/apply-freelance', {
        method: 'POST',
        body: data,
      });

      if (res.ok) {
        setFreelanceSuccess(true);
      } else {
        const err = await res.json();
        setFreelanceError(err.error || 'Failed to submit application. Please try again.');
      }
    } catch (err) {
      setFreelanceError('An unexpected error occurred. Please try again.');
    } finally {
      setFreelanceSubmitting(false);
    }
  };

  const allImages = [
    'https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_1200,c_limit/v1783710436/zawr/assets/careers-1.png', 'https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_1200,c_limit/v1783710441/zawr/assets/careers-2.png', 'https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_1200,c_limit/v1783710443/zawr/assets/careers-3.png',
    'https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_1200,c_limit/v1783710445/zawr/assets/careers-4.png', 'https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_1200,c_limit/v1783710446/zawr/assets/careers-5.png', 'https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_1200,c_limit/v1783710447/zawr/assets/careers-6.png',
    'https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_1200,c_limit/v1783710448/zawr/assets/careers-7.png', 'https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_1200,c_limit/v1783710449/zawr/assets/careers-8.png', 'https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_1200,c_limit/v1783710450/zawr/assets/careers-9.png',
    'https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_1200,c_limit/v1783710437/zawr/assets/careers-10.png', 'https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_1200,c_limit/v1783710438/zawr/assets/careers-11.png', 'https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_1200,c_limit/v1783710439/zawr/assets/careers-12.png',
    'https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_1200,c_limit/v1783710440/zawr/assets/careers-13.png'
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000000', color: '#ffffff', paddingTop: '8rem', overflow: 'hidden', fontFamily: 'sans-serif' }}>
      
      {/* Top Header Section */}
      <div style={{ textAlign: 'center', padding: '0 1.5rem', marginBottom: '4rem', zIndex: 10, position: 'relative' }}>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 600, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          Careers at Zawr industries
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#d1d5db', maxWidth: '40rem', margin: '0 auto 2rem auto', lineHeight: 1.5, fontWeight: 500 }}>
          Work alongside experienced leaders, visionary innovators,<br/>
          creative builders, and passionate professionals.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => document.getElementById('open-positions')?.scrollIntoView({ behavior: 'smooth' })}
            style={{ padding: '0.75rem 1.5rem', backgroundColor: '#ffffff', color: '#000000', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            See Open Positions
          </button>

          <button 
            onClick={() => document.getElementById('freelance-section')?.scrollIntoView({ behavior: 'smooth' })}
            style={{ padding: '0.75rem 1.5rem', backgroundColor: 'transparent', color: '#ffffff', border: '1px solid #3f3f46', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease' }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = '#ffffff'; e.currentTarget.style.backgroundColor = '#18181b'; e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = '#3f3f46'; e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            Join as Freelance
          </button>
        </div>
      </div>

      {/* Horizontal Marquee Photo Grid */}
      <div style={{ position: 'relative', width: '100%', height: '500px', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '150px', background: 'linear-gradient(to right, #000000, transparent)', zIndex: 5, pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: '150px', background: 'linear-gradient(to left, #000000, transparent)', zIndex: 5, pointerEvents: 'none' }}></div>

        <div className="marquee-horizontal">
          {[...allImages, ...allImages, ...allImages].map((src, index) => {
            const isEven = index % 2 === 0;
            const staggerOffset = isEven ? '-30px' : '30px'; 

            return (
              <div key={index} style={{ width: '300px', height: '400px', flexShrink: 0, borderRadius: '1.5rem', overflow: 'hidden', backgroundColor: '#1f2937', transform: `translateY(${staggerOffset})`, transition: 'transform 0.3s' }}>
                <img 
                  src={src} 
                  alt="Zawr Culture" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  onError={(e) => { e.currentTarget.style.display = 'none'; }} 
                  loading="lazy" decoding="async" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Life & Culture Pillars Section */}
      <section
        style={{
          backgroundColor: '#000000',
          color: '#ffffff',
          padding: 'clamp(5rem, 8vw, 7rem) 1.5rem',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          position: 'relative',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ maxWidth: '750px', marginBottom: 'clamp(3rem, 5vw, 4.5rem)' }}>
            <h2
              style={{
                fontSize: 'clamp(1.8rem, 3.8vw, 3rem)',
                fontWeight: 300,
                color: '#ffffff',
                letterSpacing: '-0.03em',
                lineHeight: 1.2,
                margin: 0,
              }}
            >
              Life &amp; Culture at Zawr Industries
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gap: '2rem',
            }}
          >
            {/* Card 1: Working at Zawr */}
            <Link
              href="/careers/working-at-zawr"
              style={{
                gridColumn: 'span 6',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                textDecoration: 'none',
                color: 'inherit',
              }}
              className="career-pillar-card"
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16 / 10',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  backgroundColor: '#111827',
                }}
              >
                <img
                  src="https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_1200,c_limit/v1783710521/zawr/assets/life-at-zawr.png"
                  alt="Working at Zawr Industries"
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.5s ease',
                  }}
                  className="career-pillar-img"
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    backgroundColor: 'rgba(0, 0, 0, 0.65)',
                    backdropFilter: 'blur(8px)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.35rem 0.85rem',
                    borderRadius: '20px',
                    letterSpacing: '0.05em',
                  }}
                >
                  Work Culture
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      color: '#ffffff',
                      margin: '0 0 0.4rem 0',
                      lineHeight: 1.3,
                    }}
                  >
                    Working at Zawr Industries
                  </h3>
                  <p style={{ fontSize: '0.92rem', color: '#9ca3af', lineHeight: 1.6, margin: 0, fontWeight: 400 }}>
                    Discover our global work culture, innovation principles, career development pathways, and employee impact across international offices.
                  </p>
                </div>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="square" strokeLinejoin="miter" style={{ transition: 'transform 0.2s', flexShrink: 0 }} className="career-pillar-arrow">
                  <line x1="6" y1="18" x2="18" y2="6"></line>
                  <polyline points="7 6 18 6 18 17"></polyline>
                </svg>
              </div>
            </Link>

            {/* Card 2: Equal Opportunity Policy */}
            <Link
              href="/careers/equal-opportunity"
              style={{
                gridColumn: 'span 6',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                textDecoration: 'none',
                color: 'inherit',
              }}
              className="career-pillar-card"
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16 / 10',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  backgroundColor: '#111827',
                }}
              >
                <img
                  src="https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_1200,c_limit/v1783710447/zawr/assets/careers-6.png"
                  alt="Equal Opportunity Policy"
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.5s ease',
                  }}
                  className="career-pillar-img"
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    backgroundColor: 'rgba(0, 0, 0, 0.65)',
                    backdropFilter: 'blur(8px)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.35rem 0.85rem',
                    borderRadius: '20px',
                    letterSpacing: '0.05em',
                  }}
                >
                  Governance &amp; Policy
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      color: '#ffffff',
                      margin: '0 0 0.4rem 0',
                      lineHeight: 1.3,
                    }}
                  >
                    Equal Opportunity Policy
                  </h3>
                  <p style={{ fontSize: '0.92rem', color: '#9ca3af', lineHeight: 1.6, margin: 0, fontWeight: 400 }}>
                    Read our commitment to workplace diversity, equity, inclusion, anti-harassment, and creating an empowered environment for all.
                  </p>
                </div>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="square" strokeLinejoin="miter" style={{ transition: 'transform 0.2s', flexShrink: 0 }} className="career-pillar-arrow">
                  <line x1="6" y1="18" x2="18" y2="6"></line>
                  <polyline points="7 6 18 6 18 17"></polyline>
                </svg>
              </div>
            </Link>
          </div>
        </div>

        <style>{`
          .career-pillar-card:hover .career-pillar-img {
            transform: scale(1.05);
          }
          .career-pillar-card:hover .career-pillar-arrow {
            transform: translate(3px, -3px);
          }
          @media (max-width: 900px) {
            .career-pillar-card {
              grid-column: span 12 !important;
            }
          }
        `}</style>
      </section>

      {/* Open Positions Section */}
      <div id="open-positions" style={{ maxWidth: '64rem', margin: '6rem auto 4rem', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9ca3af' }}>Openings</span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginTop: '0.5rem', marginBottom: '2.5rem' }}>Open Positions</h2>
          
          {/* Filters & Search */}
          <div style={{ maxWidth: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Top Row: Search Input */}
            <div style={{ width: '100%' }}>
              <div style={{ position: 'relative', width: '100%' }}>
                <input 
                  type="text" 
                  placeholder="Search for a role, skill, or keyword..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%', backgroundColor: '#000000', border: '1px solid #27272a', color: '#ffffff', padding: '0.85rem 1rem 0.85rem 2.75rem', borderRadius: '8px', outline: 'none', fontSize: '0.925rem' }} 
                />
                <svg style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
            </div>

            {/* Bottom Row: 5 Distinct Dropdowns */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'end' }}>
              
              {/* 1. Team Dropdown */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.4rem', width: '100%' }}>
                <label style={{ fontSize: '0.72rem', fontWeight: 600, color: '#9ca3af', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Team</label>
                <div style={{ position: 'relative', width: '100%' }}>
                  <select 
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                    style={{ backgroundColor: '#000000', border: '1px solid #27272a', color: '#ffffff', padding: '0.7rem 2.25rem 0.7rem 0.85rem', borderRadius: '8px', width: '100%', appearance: 'none', outline: 'none', fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    <option value="All">All Teams</option>
                    {uniqueTeams.map(team => (
                      <option key={team} value={team}>{team}</option>
                    ))}
                  </select>
                  <svg style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>

              {/* 2. Work Setup Dropdown */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.4rem', width: '100%' }}>
                <label style={{ fontSize: '0.72rem', fontWeight: 600, color: '#9ca3af', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Work Setup</label>
                <div style={{ position: 'relative', width: '100%' }}>
                  <select 
                    value={selectedWorkMode}
                    onChange={(e) => setSelectedWorkMode(e.target.value)}
                    style={{ backgroundColor: '#000000', border: '1px solid #27272a', color: '#ffffff', padding: '0.7rem 2.25rem 0.7rem 0.85rem', borderRadius: '8px', width: '100%', appearance: 'none', outline: 'none', fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    <option value="All">All Setups</option>
                    {uniqueWorkModes.map(mode => (
                      <option key={mode} value={mode}>{mode}</option>
                    ))}
                  </select>
                  <svg style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>

              {/* 3. Country Typeable Input */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.4rem', width: '100%' }}>
                <label style={{ fontSize: '0.72rem', fontWeight: 600, color: '#9ca3af', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Country</label>
                <div style={{ position: 'relative', width: '100%' }}>
                  <input 
                    type="text" 
                    list="country-suggestions"
                    placeholder="e.g. India, UAE, USA..." 
                    value={countryQuery}
                    onChange={(e) => setCountryQuery(e.target.value)}
                    style={{ backgroundColor: '#000000', border: '1px solid #27272a', color: '#ffffff', padding: '0.7rem 0.85rem', borderRadius: '8px', width: '100%', outline: 'none', fontSize: '0.85rem' }} 
                  />
                  <datalist id="country-suggestions">
                    {globalCountries.map(c => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* 4. State / Region Typeable Input */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.4rem', width: '100%' }}>
                <label style={{ fontSize: '0.72rem', fontWeight: 600, color: '#9ca3af', letterSpacing: '0.05em', textTransform: 'uppercase' }}>State / Region</label>
                <div style={{ position: 'relative', width: '100%' }}>
                  <input 
                    type="text" 
                    list="state-suggestions"
                    placeholder="e.g. Karnataka, Dubai..." 
                    value={stateQuery}
                    onChange={(e) => setStateQuery(e.target.value)}
                    style={{ backgroundColor: '#000000', border: '1px solid #27272a', color: '#ffffff', padding: '0.7rem 0.85rem', borderRadius: '8px', width: '100%', outline: 'none', fontSize: '0.85rem' }} 
                  />
                  <datalist id="state-suggestions">
                    {globalStates.map(s => (
                      <option key={s} value={s} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* 5. City Typeable Input */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.4rem', width: '100%' }}>
                <label style={{ fontSize: '0.72rem', fontWeight: 600, color: '#9ca3af', letterSpacing: '0.05em', textTransform: 'uppercase' }}>City</label>
                <div style={{ position: 'relative', width: '100%' }}>
                  <input 
                    type="text" 
                    list="city-suggestions"
                    placeholder="e.g. Bangalore, London..." 
                    value={cityQuery}
                    onChange={(e) => setCityQuery(e.target.value)}
                    style={{ backgroundColor: '#000000', border: '1px solid #27272a', color: '#ffffff', padding: '0.7rem 0.85rem', borderRadius: '8px', width: '100%', outline: 'none', fontSize: '0.85rem' }} 
                  />
                  <datalist id="city-suggestions">
                    {globalCities.map(ct => (
                      <option key={ct} value={ct} />
                    ))}
                  </datalist>
                </div>
              </div>

            </div>

            {/* Clear Active Filters Bar if active */}
            {(searchQuery !== '' || selectedTeam !== 'All' || selectedWorkMode !== 'All' || countryQuery !== '' || stateQuery !== '' || cityQuery !== '') && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
                <span style={{ fontSize: '0.82rem', color: '#9ca3af' }}>
                  Showing <strong>{filteredJobs.length}</strong> {filteredJobs.length === 1 ? 'position' : 'positions'}
                </span>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedTeam('All');
                    setSelectedWorkMode('All');
                    setCountryQuery('');
                    setStateQuery('');
                    setCityQuery('');
                  }}
                  style={{ backgroundColor: 'transparent', border: 'none', color: '#ffffff', textDecoration: 'underline', fontSize: '0.82rem', cursor: 'pointer' }}
                >
                  Clear all filters ✕
                </button>
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#9ca3af' }}>Loading open positions...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {currentJobs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: '#9ca3af' }}>No positions found matching your criteria.</div>
            ) : currentJobs.map((job, j) => (
              <Link 
                href={`/careers/${job.id}`}
                key={j} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '1.75rem 0.5rem', 
                  borderBottom: '1px solid #1f2937', 
                  backgroundColor: 'transparent',
                  cursor: 'pointer', 
                  transition: 'all 0.2s ease',
                  textDecoration: 'none',
                  color: 'inherit'
                }} 
                className="job-list-row"
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.35rem', color: '#ffffff' }}>{job.title}</div>
                  <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>{job.type}</div>
                </div>
                <span style={{ fontSize: '0.875rem', color: '#9ca3af', flex: 1, textAlign: 'center' }}>{job.location}</span>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="square" strokeLinejoin="miter" style={{ transition: 'transform 0.2s', flexShrink: 0 }} className="job-row-arrow">
                    <line x1="6" y1="18" x2="18" y2="6"></line>
                    <polyline points="7 6 18 6 18 17"></polyline>
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}

        <style>{`
          .job-list-row:hover .job-row-arrow {
            transform: translate(4px, -4px);
          }
          .job-list-row:hover {
            border-bottom-color: #ffffff !important;
          }
        `}</style>

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4rem', padding: '1rem 0', borderTop: '1px solid #1f2937' }}>
            <button 
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              style={{ 
                padding: '0.75rem 1.5rem', 
                backgroundColor: currentPage === 1 ? 'transparent' : '#1f2937', 
                color: currentPage === 1 ? '#4b5563' : '#ffffff', 
                border: '1px solid', 
                borderColor: currentPage === 1 ? '#374151' : '#1f2937',
                borderRadius: '0.375rem', 
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Previous
            </button>
            <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              style={{ 
                padding: '0.75rem 1.5rem', 
                backgroundColor: currentPage === totalPages ? 'transparent' : '#1f2937', 
                color: currentPage === totalPages ? '#4b5563' : '#ffffff', 
                border: '1px solid', 
                borderColor: currentPage === totalPages ? '#374151' : '#1f2937',
                borderRadius: '0.375rem', 
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* ── Looking for Freelance Section (At the very end of Careers page) ── */}
      <section
        id="freelance-section"
        style={{
          backgroundColor: '#000000',
          color: '#ffffff',
          padding: 'clamp(4rem, 7vw, 6rem) 1.5rem',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          borderTop: '1px solid #1f2937',
        }}
      >
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '2.5rem',
          }}
        >
          {/* Freelance Image Container */}
          <div
            style={{
              width: '100%',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 12px 30px -5px rgba(0,0,0,0.5)',
              backgroundColor: '#111827',
            }}
          >
            <img
              src="/assets/freelance.png"
              alt="Looking for freelance opportunities at Zawr Industries"
              loading="lazy"
              decoding="async"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                maxHeight: '520px',
                objectFit: 'cover',
              }}
            />
          </div>

          {/* Content & Apply Button */}
          <div style={{ maxWidth: '850px' }}>
            <h2
              style={{
                fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                fontWeight: 500,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                marginBottom: '1.25rem',
                lineHeight: 1.15,
              }}
            >
              Looking for freelance?
            </h2>
            <p
              style={{
                fontSize: '1.05rem',
                color: '#d1d5db',
                lineHeight: 1.7,
                marginBottom: '2rem',
                fontWeight: 400,
              }}
            >
              We actively hire freelancers for industry-grade projects based on project availability and skill requirements. Apply here, and if your profile matches our requirements, we will contact you regarding suitable opportunities.
            </p>
            <button
              onClick={() => {
                setIsFreelanceModalOpen(true);
                setFreelanceSuccess(false);
                setFreelanceError('');
              }}
              style={{
                padding: '0.85rem 2rem',
                backgroundColor: '#ffffff',
                color: '#000000',
                borderRadius: '10px',
                fontSize: '0.95rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(255,255,255,0.12)',
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Apply for Freelance Opportunities
            </button>
          </div>
        </div>
      </section>

      {/* ── Freelance Application Modal ── */}
      {isFreelanceModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            backgroundColor: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setIsFreelanceModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#0a0a0a',
              color: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #27272a',
              padding: '2.25rem',
              maxWidth: '560px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsFreelanceModalOpen(false)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                backgroundColor: '#18181b',
                border: '1px solid #27272a',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#a1a1aa',
              }}
            >
              ✕
            </button>

            {freelanceSuccess ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#ffffff', color: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  ✓
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.75rem' }}>Application Submitted!</h3>
                <p style={{ fontSize: '0.95rem', color: '#9ca3af', lineHeight: 1.6, marginBottom: '2rem' }}>
                  Your freelance application has been sent directly to <strong>hr@zawrindustries.com</strong>. Our HR team will review your profile and reach out for suitable project opportunities.
                </p>
                <button
                  onClick={() => setIsFreelanceModalOpen(false)}
                  style={{
                    padding: '0.75rem 1.75rem',
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    borderRadius: '9999px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Close Window
                </button>
              </div>
            ) : (
              <div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.5rem' }}>
                  Apply for Freelance Projects
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#9ca3af', marginBottom: '1.75rem' }}>
                  Submissions are delivered directly to <strong>hr@zawrindustries.com</strong> for project evaluation.
                </p>

                {freelanceError && (
                  <div style={{ backgroundColor: '#450a0a', border: '1px solid #7f1d1d', color: '#fca5a5', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                    {freelanceError}
                  </div>
                )}

                <form onSubmit={handleFreelanceSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#e5e7eb', marginBottom: '0.35rem' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={freelanceForm.fullName}
                      onChange={(e) => setFreelanceForm({ ...freelanceForm, fullName: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', backgroundColor: '#000000', border: '1px solid #27272a', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', color: '#ffffff' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#e5e7eb', marginBottom: '0.35rem' }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="alex@example.com"
                        value={freelanceForm.email}
                        onChange={(e) => setFreelanceForm({ ...freelanceForm, email: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem 0.85rem', backgroundColor: '#000000', border: '1px solid #27272a', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', color: '#ffffff' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#e5e7eb', marginBottom: '0.35rem' }}>
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 9876543210"
                        value={freelanceForm.phone}
                        onChange={(e) => setFreelanceForm({ ...freelanceForm, phone: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem 0.85rem', backgroundColor: '#000000', border: '1px solid #27272a', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', color: '#ffffff' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#e5e7eb', marginBottom: '0.35rem' }}>
                      Primary Skill / Expertise Domain *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Full Stack React/Node, UI/UX Design, DevOps, AI Engineer"
                      value={freelanceForm.skill}
                      onChange={(e) => setFreelanceForm({ ...freelanceForm, skill: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', backgroundColor: '#000000', border: '1px solid #27272a', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', color: '#ffffff' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#e5e7eb', marginBottom: '0.35rem' }}>
                      Portfolio / GitHub / LinkedIn Link
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/alex"
                      value={freelanceForm.portfolio}
                      onChange={(e) => setFreelanceForm({ ...freelanceForm, portfolio: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', backgroundColor: '#000000', border: '1px solid #27272a', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', color: '#ffffff' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#e5e7eb', marginBottom: '0.35rem' }}>
                      Resume / CV File (PDF / Word, Max 5MB)
                    </label>
                    <div
                      onClick={() => document.getElementById('freelance-resume-file-input')?.click()}
                      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          setFreelanceResume(e.dataTransfer.files[0]);
                        }
                      }}
                      style={{
                        border: '1.5px dashed #3f3f46',
                        borderRadius: '10px',
                        backgroundColor: '#000000',
                        padding: '1.25rem 1rem',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                      }}
                      className="file-dropzone-hover"
                    >
                      <input
                        id="freelance-resume-file-input"
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={(e) => setFreelanceResume(e.target.files ? e.target.files[0] : null)}
                        style={{ display: 'none' }}
                      />

                      {freelanceResume ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#18181b', border: '1px solid #27272a', padding: '0.5rem 0.75rem', borderRadius: '6px', width: '100%', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                              <polyline points="14 2 14 8 20 8"/>
                            </svg>
                            <div style={{ textAlign: 'left', overflow: 'hidden' }}>
                              <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#ffffff', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{freelanceResume.name}</p>
                              <p style={{ fontSize: '0.72rem', color: '#71717a', margin: 0 }}>{(freelanceResume.size / (1024 * 1024)).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFreelanceResume(null);
                            }}
                            style={{ backgroundColor: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.9rem' }}
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#18181b', border: '1px solid #27272a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                              <polyline points="17 8 12 3 7 8"/>
                              <line x1="12" y1="3" x2="12" y2="15"/>
                            </svg>
                          </div>
                          <div>
                            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', margin: '0 0 0.15rem 0' }}>
                              Click to upload <span style={{ fontWeight: 400, color: '#71717a' }}>or drag and drop</span>
                            </p>
                            <p style={{ fontSize: '0.72rem', color: '#71717a', margin: 0 }}>
                              PDF, DOC, DOCX up to 5MB
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#e5e7eb', marginBottom: '0.35rem' }}>
                      Brief Introduction / Key Highlights
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Tell us about your experience and availability..."
                      value={freelanceForm.coverLetter}
                      onChange={(e) => setFreelanceForm({ ...freelanceForm, coverLetter: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', backgroundColor: '#000000', border: '1px solid #27272a', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', resize: 'vertical', color: '#ffffff' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={freelanceSubmitting}
                    style={{
                      marginTop: '0.5rem',
                      padding: '0.85rem',
                      backgroundColor: '#ffffff',
                      color: '#000000',
                      borderRadius: '9999px',
                      fontWeight: 600,
                      fontSize: '0.92rem',
                      border: 'none',
                      cursor: freelanceSubmitting ? 'not-allowed' : 'pointer',
                      opacity: freelanceSubmitting ? 0.7 : 1,
                    }}
                  >
                    {freelanceSubmitting ? 'Submitting Application...' : 'Send Application to HR'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .marquee-horizontal {
          display: flex;
          gap: 2rem;
          padding: 0 1rem;
          width: fit-content;
          animation: scrollLeft 40s linear infinite;
        }
        .file-dropzone-hover:hover {
          border-color: #71717a !important;
          background-color: #121215 !important;
        }
      `}} />
    </div>
  );
}

"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function CareersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  
  const [dbJobs, setDbJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const jobsPerPage = 20;

  useEffect(() => {
    const fetchJobs = async () => {
      // Only fetch active jobs for the public careers page
      const { data, error } = await supabase.from('jobs').select('*').eq('status', 'Active');
      if (data) {
        setDbJobs(data);
      }
      setIsLoading(false);
    };
    fetchJobs();
  }, []);

  // Compute unique locations for the dropdown
  const uniqueLocations = useMemo(() => {
    const locations = new Set<string>();
    dbJobs.forEach(j => locations.add(j.location));
    return Array.from(locations).sort();
  }, [dbJobs]);

  // Compute unique categories (Assuming we might map 'type' or just use 'Department' if available, but for now we will just use generic team categories or omit if not in DB. Let's assume all jobs in DB are the team)
  // For now, since 'category' was in the hardcoded data but not in DB, we will just use "All" for team.
  const uniqueTeams = ["All"]; 

  // Filter jobs based on search and dropdowns
  const filteredJobs = useMemo(() => {
    return dbJobs.filter(job => {
      const matchSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchLocation = selectedLocation === "All" || job.location === selectedLocation;
      return matchSearch && matchLocation;
    });
  }, [dbJobs, searchQuery, selectedLocation]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedTeam, selectedLocation]);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage) || 1;
  
  // Get jobs for current page from FILTERED jobs
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
        <button 
          onClick={() => document.getElementById('open-positions')?.scrollIntoView({ behavior: 'smooth' })}
          style={{ padding: '0.75rem 1.5rem', backgroundColor: '#ffffff', color: '#000000', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          See Open Positions
        </button>
      </div>

      {/* Horizontal Marquee Photo Grid */}
      <div style={{ position: 'relative', width: '100%', height: '500px', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        
        {/* Gradient Masks to fade the left and right edges */}
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '150px', background: 'linear-gradient(to right, #000000, transparent)', zIndex: 5, pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: '150px', background: 'linear-gradient(to left, #000000, transparent)', zIndex: 5, pointerEvents: 'none' }}></div>

        {/* Scrolling Track */}
        <div className="marquee-horizontal">
          {/* Duplicate the array to create a seamless infinite loop */}
          {[...allImages, ...allImages, ...allImages].map((src, index) => {
            // Alternate up and down stagger
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

      {/* Open Positions Section */}
      <div id="open-positions" style={{ maxWidth: '64rem', margin: '8rem auto', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9ca3af' }}>Openings</span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginTop: '0.5rem', marginBottom: '2.5rem' }}>Open Positions</h2>
          
          {/* Filters & Search */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            {/* Search Bar */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem', width: '100%', maxWidth: '495px' }}>
              <label style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Search</label>
              <div style={{ position: 'relative', width: '100%' }}>
                <input 
                  type="text" 
                  placeholder="Search for a role..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%', backgroundColor: 'transparent', border: '1px solid #374151', color: '#ffffff', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.375rem', outline: 'none', fontSize: '0.875rem' }} 
                />
                <svg style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
            </div>

            {/* Team Dropdown */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Team</label>
              <div style={{ position: 'relative' }}>
                <select 
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  style={{ backgroundColor: '#000000', border: '1px solid #374151', color: '#ffffff', padding: '0.75rem 2.5rem 0.75rem 1rem', borderRadius: '0.375rem', width: '240px', appearance: 'none', outline: 'none', fontSize: '0.875rem' }}
                >
                  <option value="All">All Teams</option>
                  {uniqueTeams.map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
                <svg style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>

            {/* Location Dropdown */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Location</label>
              <div style={{ position: 'relative' }}>
                <select 
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  style={{ backgroundColor: '#000000', border: '1px solid #374151', color: '#ffffff', padding: '0.75rem 2.5rem 0.75rem 1rem', borderRadius: '0.375rem', width: '240px', appearance: 'none', outline: 'none', fontSize: '0.875rem' }}
                >
                  <option value="All">All Locations</option>
                  {uniqueLocations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
                <svg style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#9ca3af' }}>Loading open positions...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                  padding: '1.5rem', 
                  border: '1px solid #1f2937', 
                  backgroundColor: '#0f0f0f',
                  borderRadius: '0.5rem',
                  cursor: 'pointer', 
                  transition: 'background-color 0.2s',
                  textDecoration: 'none',
                  color: 'inherit'
                }} 
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'} 
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0f0f0f'}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{job.title}</div>
                  <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>{job.type}</div>
                </div>
                <span style={{ fontSize: '0.875rem', color: '#9ca3af', flex: 1, textAlign: 'center' }}>{job.location}</span>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
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

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); } /* Since we duplicated array 3 times */
        }
        .marquee-horizontal {
          display: flex;
          gap: 2rem;
          padding: 0 1rem;
          width: fit-content;
          animation: scrollLeft 40s linear infinite;
        }
        .marquee-horizontal:hover {
          animation-play-state: paused;
        }
      `}} />
    </div>
  );
}

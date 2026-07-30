'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function PressReleasesPage() {
  const [showArchive, setShowArchive] = useState(false);
  const [releases, setReleases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'alphabetical'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        const res = await fetch('/api/press-releases');
        if (res.ok) {
          const data = await res.json();
          setReleases(data || []);
        }
      } catch (e) {
        console.error('Error fetching press releases:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchReleases();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, showArchive]);

  // 1. Filter by archive status
  const statusFiltered = releases.filter((r: any) => !r.archived === !showArchive);

  // 2. Filter by search term
  const searched = statusFiltered.filter((r: any) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      r.title.toLowerCase().includes(term) ||
      (r.summary && r.summary.toLowerCase().includes(term)) ||
      r.category.toLowerCase().includes(term)
    );
  });

  // 3. Sort by criteria
  const displayed = [...searched].sort((a: any, b: any) => {
    if (sortBy === 'newest') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    if (sortBy === 'oldest') {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    if (sortBy === 'alphabetical') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  const totalPages = Math.ceil(displayed.length / itemsPerPage);
  const paginated = displayed.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', color: '#000000', paddingTop: '8rem', paddingBottom: '6rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 900px) {
          .press-releases-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (min-width: 600px) and (max-width: 899px) {
          .press-releases-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 599px) {
          .press-releases-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}} />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>

        {/* Header */}
        <header style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '2.5rem', marginBottom: '3rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#6b7280', display: 'block', marginBottom: '0.75rem' }}>
            Newsroom
          </span>
          <h1 style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', fontWeight: 700, letterSpacing: '-0.02em', color: '#000000', margin: 0, lineHeight: 1.1 }}>
            Press Releases
          </h1>
        </header>

        {/* Controls Row */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          gap: '1rem', 
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          {/* Active / Archive Toggle */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => setShowArchive(false)}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '9999px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600,
                backgroundColor: !showArchive ? '#000000' : '#f3f4f6',
                color: !showArchive ? '#ffffff' : '#4b5563',
                transition: 'all 0.2s'
              }}
            >
              Active Releases
            </button>
            <button
              onClick={() => setShowArchive(true)}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '9999px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600,
                backgroundColor: showArchive ? '#000000' : '#f3f4f6',
                color: showArchive ? '#ffffff' : '#4b5563',
                transition: 'all 0.2s'
              }}
            >
              Archive
            </button>
          </div>

          {/* Search and Sort Group */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', flexGrow: 1, justifyContent: 'flex-end' }}>
            
            {/* Search Input Box */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '240px' }}>
              <svg 
                style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text"
                placeholder="Search releases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.45rem 1rem 0.45rem 2.2rem',
                  borderRadius: '9999px',
                  border: '1px solid #e5e7eb',
                  fontSize: '0.8rem',
                  outline: 'none',
                  transition: 'all 0.15s',
                  backgroundColor: '#ffffff',
                  color: '#000000'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#000000'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
              />
            </div>

            {/* Sort Select */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sort</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                style={{
                  padding: '0.45rem 1.75rem 0.45rem 0.85rem',
                  borderRadius: '9999px',
                  border: '1px solid #e5e7eb',
                  fontSize: '0.8rem',
                  outline: 'none',
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  cursor: 'pointer',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234b5563' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center',
                  backgroundSize: '11px',
                  minWidth: '125px',
                  transition: 'border-color 0.15s'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#000000'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="alphabetical">Title A-Z</option>
              </select>
            </div>

          </div>
        </div>

        {/* Card Grid Layout */}
        {loading ? (
          <div style={{ padding: '5rem 0', textAlign: 'center', color: '#6b7280', fontSize: '0.95rem' }}>
            Loading press releases...
          </div>
        ) : paginated.length === 0 ? (
          <div style={{ padding: '5rem 0', textAlign: 'center', color: '#6b7280', fontSize: '0.95rem', border: '1px dashed #e5e7eb', borderRadius: '1.25rem' }}>
            No press releases found.
          </div>
        ) : (
          <div>
            <div 
              className="press-releases-grid"
              style={{
                display: 'grid',
                gap: '1.5rem',
                marginTop: '1rem'
              }}
            >
              {paginated.map((release) => (
                <Link
                  key={release.id}
                  href={`/newsroom/press-release/${release.slug}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div
                    style={{
                      backgroundColor: '#000000',
                      borderRadius: '1.25rem',
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      minHeight: '390px',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-6px)';
                      e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                      const arrowEl = e.currentTarget.querySelector('.arrow-icon');
                      if (arrowEl) (arrowEl as HTMLElement).style.transform = 'translate(3px, -3px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                      const arrowEl = e.currentTarget.querySelector('.arrow-icon');
                      if (arrowEl) (arrowEl as HTMLElement).style.transform = 'translate(0, 0)';
                    }}
                  >
                    {/* Banner Image Container */}
                    <div style={{
                      width: '100%',
                      aspectRatio: '16/10',
                      borderRadius: '0.75rem',
                      overflow: 'hidden',
                      marginBottom: '1.25rem',
                      backgroundColor: '#1f2937',
                      position: 'relative'
                    }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={release.banner || 'https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto/v1783710544/zawr/assets/public-relations-hero.png'} 
                        alt={release.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                       loading="lazy" decoding="async" />
                    </div>

                    {/* Title Box */}
                    <h3 style={{
                      fontSize: '1rem',
                      color: '#ffffff',
                      fontWeight: 500,
                      lineHeight: '1.45',
                      margin: '0 0 2rem 0',
                      flexGrow: 1,
                      letterSpacing: '-0.01em',
                      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                    }}>
                      {release.title}
                    </h3>

                    {/* Bottom Footer Row */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 'auto'
                    }}>
                      {/* Date */}
                      <span style={{
                        fontSize: '0.75rem',
                        color: '#9ca3af',
                        fontWeight: 500
                      }}>
                        {release.date}
                      </span>

                      {/* Elegant Diagonal Arrow */}
                      <span 
                        className="arrow-icon"
                        style={{
                          color: '#ffffff',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="7" y1="17" x2="17" y2="7"></line>
                          <polyline points="7 7 17 7 17 17"></polyline>
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '3.5rem' }}>
                {/* Previous Page */}
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '50%',
                    border: '1px solid #e5e7eb',
                    backgroundColor: '#ffffff',
                    color: currentPage === 1 ? '#9ca3af' : '#000000',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    opacity: currentPage === 1 ? 0.5 : 1,
                    transition: 'all 0.2s',
                    outline: 'none'
                  }}
                  onMouseOver={(e) => {
                    if (currentPage !== 1) e.currentTarget.style.borderColor = '#000000';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>

                {/* Page Indices */}
                {Array.from({ length: totalPages }, (_, i) => {
                  const pageNum = i + 1;
                  const isSelected = pageNum === currentPage;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '2.5rem',
                        height: '2.5rem',
                        borderRadius: '50%',
                        border: isSelected ? 'none' : '1px solid #e5e7eb',
                        backgroundColor: isSelected ? '#000000' : '#ffffff',
                        color: isSelected ? '#ffffff' : '#000000',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        outline: 'none'
                      }}
                      onMouseOver={(e) => {
                        if (!isSelected) e.currentTarget.style.borderColor = '#000000';
                      }}
                      onMouseOut={(e) => {
                        if (!isSelected) e.currentTarget.style.borderColor = '#e5e7eb';
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {/* Next Page */}
                <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '50%',
                    border: '1px solid #e5e7eb',
                    backgroundColor: '#ffffff',
                    color: currentPage === totalPages ? '#9ca3af' : '#000000',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    opacity: currentPage === totalPages ? 0.5 : 1,
                    transition: 'all 0.2s',
                    outline: 'none'
                  }}
                  onMouseOver={(e) => {
                    if (currentPage !== totalPages) e.currentTarget.style.borderColor = '#000000';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}

        {!loading && (
          <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '2rem', textAlign: 'right' }}>
            Showing {paginated.length} of {displayed.length} {showArchive ? 'archived' : 'active'} release{displayed.length !== 1 ? 's' : ''}
          </p>
        )}

      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const PitchDeckViewer = dynamic(() => import('../PitchDeckViewer'), { ssr: false });

function FinancialReportContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idParam = searchParams.get('id');

  // Dashboard state
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Annual Reports');
  const [selectedYears, setSelectedYears] = useState<string[]>([]); // Empty means all selected
  const [activePdfUrl, setActivePdfUrl] = useState<string | null>(null);
  const [activePdfTitle, setActivePdfTitle] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  const tabs = [
    'Annual Reports',
    'Quarterly Results',
    'Financial Presentations',
    'CSR Reports',
    '10 Year Financial Highlights',
    'Other Investor Presentations'
  ];

  const years = [
    '2026-2027', '2025-2026', '2024-2025', '2023-2024', '2022-2023',
    '2021-2022', '2020-2021', '2019-2020', '2018-2019', '2017-2018',
    '2016-2017', '2015-2016'
  ];

  // Fetch dynamic reports from Supabase/JSON backend
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch(`/api/financial-reports?t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          setReports(data || []);
          
          // Direct deep link check
          if (idParam) {
            const found = data.find((r: any) => r.id === idParam);
            if (found && found.pdfUrl) {
              setActivePdfUrl(found.pdfUrl);
              setActivePdfTitle(found.title);
            }
          }
        }
      } catch (e) {
        console.error('Error fetching reports:', e);
      }
      setLoading(false);
    };

    fetchReports();
  }, [idParam]);

  // Sync years filters
  const handleToggleYear = (year: string) => {
    if (selectedYears.includes(year)) {
      setSelectedYears(selectedYears.filter(y => y !== year));
    } else {
      setSelectedYears([...selectedYears, year]);
    }
    setCurrentPage(1);
  };

  const handleSelectAllYears = () => {
    if (selectedYears.length === 0) {
      setSelectedYears(years); // Toggle
    } else {
      setSelectedYears([]); // Empty means "Select All"
    }
    setCurrentPage(1);
  };

  // Helper to categorize dynamic webmaster reports
  const getMappedReports = () => {
    const activeYears = selectedYears.length === 0 ? years : selectedYears;

    // 1. Group webmaster reports by active category (or fallback to title parsing for legacy records)
    const categorizedDbReports = reports.filter(rep => {
      if (rep.category) {
        return rep.category === activeTab;
      }
      
      // Fallback title parsing for legacy items
      const titleUpper = rep.title.toUpperCase();
      if (activeTab === 'Quarterly Results') {
        return titleUpper.includes('QUARTER') || titleUpper.includes('Q1') || titleUpper.includes('Q2') || titleUpper.includes('Q3') || titleUpper.includes('Q4') || titleUpper.includes('RESULTS');
      }
      if (activeTab === 'Financial Presentations') {
        return (titleUpper.includes('PRESENTATION') || titleUpper.includes('ROADMAP') || titleUpper.includes('PITCH')) && !titleUpper.includes('OTHER');
      }
      if (activeTab === 'CSR Reports') {
        return titleUpper.includes('CSR') || titleUpper.includes('SOCIAL') || titleUpper.includes('COMMUNITY');
      }
      if (activeTab === '10 Year Financial Highlights') {
        return titleUpper.includes('10 YEAR') || titleUpper.includes('HIGHLIGHTS') || titleUpper.includes('HIGHLIGHT');
      }
      if (activeTab === 'Other Investor Presentations') {
        return titleUpper.includes('OTHER') || titleUpper.includes('PORTFOLIO');
      }
      return !titleUpper.includes('QUARTER') && !titleUpper.includes('Q1') && !titleUpper.includes('Q2') && !titleUpper.includes('Q3') && !titleUpper.includes('Q4') && !titleUpper.includes('CSR') && !titleUpper.includes('10 YEAR');
    });

    // 2. Map categorized webmaster reports to selected years
    const activeList: any[] = [];
    
    categorizedDbReports.forEach(rep => {
      // Use explicit year field, with chronological title fallback for legacy
      let matchedYear = rep.year;
      if (!matchedYear) {
        const titleUpper = rep.title.toUpperCase();
        matchedYear = years.find(y => {
          const [startYr, endYr] = y.split('-');
          if (y === '2025-2026' && (titleUpper.includes('2026') || titleUpper.includes('FY 2026') || titleUpper.includes('25-26'))) return true;
          if (y === '2024-2025' && (titleUpper.includes('2025') || titleUpper.includes('FY 2025') || titleUpper.includes('24-25'))) return true;
          if (y === '2023-2024' && (titleUpper.includes('2024') || titleUpper.includes('FY 2024') || titleUpper.includes('23-24'))) return true;
          if (y === '2022-2023' && (titleUpper.includes('2023') || titleUpper.includes('FY 2023') || titleUpper.includes('22-23'))) return true;
          return titleUpper.includes(startYr) || titleUpper.includes(endYr);
        });
      }

      if (matchedYear && activeYears.includes(matchedYear)) {
        activeList.push({
          id: rep.id,
          title: rep.title,
          pdfUrl: rep.isArchived ? null : rep.pdfUrl,
          year: matchedYear,
          isUserUploaded: true
        });
      }
    });

    // 3. For any years that don't have a dynamic upload, add a gorgeous archived mock row (exactly like the screenshot)
    activeYears.forEach(year => {
      const alreadyHasUpload = activeList.some(item => item.year === year);
      if (!alreadyHasUpload) {
        let title = '';
        if (activeTab === 'Annual Reports') {
          title = `Annual Report for the year ${year}`;
        } else if (activeTab === 'Quarterly Results') {
          title = `Quarterly Results for Q3 FY ${year}`;
        } else if (activeTab === 'Financial Presentations') {
          title = `Investor Presentation - FY ${year}`;
        } else if (activeTab === 'CSR Reports') {
          title = `Corporate Social Responsibility Report ${year}`;
        } else if (activeTab === '10 Year Financial Highlights') {
          title = `10 Year Financial and Operational Highlights (${year})`;
        } else {
          title = `Investor Presentation Portfolio - ${year}`;
        }

        activeList.push({
          id: `mock-${year}`,
          title,
          pdfUrl: null,
          year,
          isUserUploaded: false
        });
      }
    });

    // Sort chronologically (latest year first)
    return activeList.sort((a, b) => b.year.localeCompare(a.year));
  };

  const displayedReports = getMappedReports();

  // Pagination calculations (8 items per page)
  const itemsPerPage = 8;
  const totalPages = Math.ceil(displayedReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReports = displayedReports.slice(startIndex, startIndex + itemsPerPage);

  // Style Tokens
  const theme = {
    bg: '#000000',
    fg: '#ffffff',
    gold: '#ffffff',
    goldHover: '#f3f4f6',
    cardBg: '#131315',
    cardBgAlt: '#0b0b0c',
    border: '#222225',
    borderLight: '#2a2a2e',
    textMuted: '#88888b'
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.bg, color: theme.fg, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <title>Financial Reports & Filings | Zawr Industries</title>
      <meta name="description" content="Official repository of financial reports, quarterly filings, audit balance statements, and investor disclosures for Zawr Industries LLP." />
      
      {/* Immersive Fullscreen PDF Viewer Modal Overlay */}
      {activePdfUrl && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.98)',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ padding: '1.5rem 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${theme.border}`, backgroundColor: '#000' }}>
            <button 
              onClick={() => {
                setActivePdfUrl(null);
                setActivePdfTitle(null);
                router.replace('/investors/financial-report');
              }}
              style={{
                backgroundColor: 'transparent',
                color: theme.fg,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '1rem',
                fontWeight: 500
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Close Document
            </button>
            <div role="heading" aria-level={2} style={{ fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-0.02em', margin: 0, color: '#fff' }}>
              {activePdfTitle || 'Financial Document'}
            </div>
            <div style={{ width: '100px' }}></div>
          </div>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' }}>
            <PitchDeckViewer fileUrl={activePdfUrl} />
          </div>
        </div>
      )}

      {/* Info Alert Modal */}
      {alertMsg && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}>
          <div style={{
            backgroundColor: '#16161a',
            border: `1px solid ${theme.border}`,
            borderRadius: '1.5rem',
            padding: '2.5rem',
            maxWidth: '500px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📂</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: theme.fg }}>Archived Document</h3>
            <p style={{ color: theme.textMuted, lineHeight: 1.6, marginBottom: '2rem', fontSize: '0.95rem' }}>
              {alertMsg}
            </p>
            <button 
              onClick={() => setAlertMsg(null)}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: theme.gold,
                color: '#000000',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.goldHover}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.gold}
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}

      {/* Main Content Container - Clears Fixed Global Navigation Header */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '120px 2rem 6rem 2rem' }}>
        
        {/* Navigation Breadcrumb & Back Link */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', borderBottom: `1px solid ${theme.border}`, paddingBottom: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 500, letterSpacing: '-0.03em', margin: 0, color: theme.fg }}>
              Financial Reports Database
            </h1>
          </div>
          
          <Link href="/investors" style={{ 
            color: theme.fg, 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            textDecoration: 'none', 
            fontWeight: 600, 
            fontSize: '0.9rem',
            border: `1px solid ${theme.border}`,
            padding: '0.6rem 1.25rem',
            borderRadius: '2rem',
            backgroundColor: '#0a0a0a',
            transition: 'all 0.2s' 
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = theme.fg;
            e.currentTarget.style.color = theme.fg;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = theme.border;
            e.currentTarget.style.color = theme.fg;
          }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Investors
          </Link>
        </div>

        {/* Horizontal Navigation Tabs */}
        <div style={{ 
          display: 'flex', 
          overflowX: 'auto', 
          gap: '0.75rem', 
          marginBottom: '3rem', 
          paddingBottom: '0.5rem',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }} className="no-scrollbar">
          <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
                style={{
                  flexShrink: 0,
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: isActive ? `1px solid ${theme.fg}` : `1px solid ${theme.border}`,
                  backgroundColor: isActive ? theme.fg : 'transparent',
                  color: isActive ? '#000000' : theme.textMuted,
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.borderColor = '#ffffff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = theme.textMuted;
                    e.currentTarget.style.borderColor = theme.border;
                  }
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Filters Checklist and Table Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '4rem', alignItems: 'start' }} className="responsive-grid">
          
          {/* Left Column: Filters Sidebar */}
          <div style={{
            backgroundColor: '#0a0a0a',
            border: `1px solid ${theme.border}`,
            borderRadius: '1.25rem',
            padding: '2rem',
            position: 'sticky',
            top: '120px'
          }}>
            <h3 style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: theme.fg, fontWeight: 700, marginBottom: '1.25rem' }}>Filters</h3>
            
            <button 
              onClick={handleSelectAllYears}
              style={{
                background: 'none',
                border: 'none',
                color: theme.fg,
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '0 0 1rem 0',
                display: 'block',
                textAlign: 'left'
              }}
            >
              {selectedYears.length === 0 ? 'Deselect All' : 'Select All'}
            </button>

            {/* Custom styled Scrollable Checklist */}
            <div style={{
              maxHeight: '320px',
              overflowY: 'auto',
              paddingRight: '0.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }} className="custom-scrollbar">
              <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                  width: 5px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                  background: #000; 
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background: #222; 
                  border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                  background: #444; 
                }
              `}</style>
              {years.map((year) => {
                const isChecked = selectedYears.length === 0 || selectedYears.includes(year);
                return (
                  <label 
                    key={year} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.75rem', 
                      fontSize: '0.9rem', 
                      color: isChecked ? theme.fg : theme.textMuted,
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                  >
                    <input 
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleYear(year)}
                      style={{
                        accentColor: theme.fg,
                        cursor: 'pointer',
                        width: '15px',
                        height: '15px',
                        borderRadius: '3px'
                      }}
                    />
                    {year}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Right Column: Reports Table List */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            
            {/* Table wrapper */}
            <div style={{
              border: `1px solid ${theme.border}`,
              borderRadius: '1.25rem',
              overflow: 'hidden',
              backgroundColor: '#050505'
            }}>
              
              {/* Table Header */}
              <div style={{ 
                backgroundColor: theme.fg, 
                padding: '1.25rem 2rem', 
                color: '#000000', 
                fontWeight: 600, 
                fontSize: '0.85rem', 
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}>
                Title
              </div>

              {/* Table Body Rows */}
              {loading ? (
                <div style={{ padding: '4rem 2rem', textAlign: 'center', color: theme.textMuted }}>
                  Loading financial records database...
                </div>
              ) : paginatedReports.length === 0 ? (
                <div style={{ padding: '4rem 2rem', textAlign: 'center', color: theme.textMuted }}>
                  No reports available matching the filters.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {paginatedReports.map((item, index) => {
                    const isEven = index % 2 === 0;
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          if (item.pdfUrl) {
                            setActivePdfUrl(item.pdfUrl);
                            setActivePdfTitle(item.title);
                          } else {
                            setAlertMsg(`The digital report for ${item.year} is currently archived in our secure offline database. To request a copy, please contact investor-relations@zawrindustries.com.`);
                          }
                        }}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '1.25rem 2rem',
                          backgroundColor: isEven ? theme.cardBg : theme.cardBgAlt,
                          borderBottom: index === paginatedReports.length - 1 ? 'none' : `1px solid ${theme.border}`,
                          cursor: 'pointer',
                          transition: 'all 0.25s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                          e.currentTarget.style.paddingLeft = '2.25rem';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = isEven ? theme.cardBg : theme.cardBgAlt;
                          e.currentTarget.style.paddingLeft = '2rem';
                        }}
                      >
                        <span style={{ fontSize: '0.95rem', color: theme.fg, fontWeight: 500 }}>
                          {item.title}
                        </span>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: theme.fg }}>
                          {!item.pdfUrl && (
                            <span style={{ fontSize: '0.75rem', color: theme.textMuted, marginRight: '0.5rem', backgroundColor: '#222', padding: '0.2rem 0.5rem', borderRadius: '3px' }}>
                              Archived
                            </span>
                          )}
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="7" y1="17" x2="17" y2="7"></line>
                            <polyline points="7 7 17 7 17 17"></polyline>
                          </svg>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', marginTop: '2.5rem' }}>
                <span style={{ fontSize: '0.9rem', color: theme.textMuted }}>
                  Page {currentPage} of {totalPages}
                </span>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    style={{
                      padding: '0.5rem 1.25rem',
                      borderRadius: '2rem',
                      border: `1px solid ${theme.border}`,
                      backgroundColor: 'transparent',
                      color: currentPage === 1 ? theme.textMuted : theme.fg,
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage !== 1) e.currentTarget.style.borderColor = theme.fg;
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== 1) e.currentTarget.style.borderColor = theme.border;
                    }}
                  >
                    &lt; Prev
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    style={{
                      padding: '0.5rem 1.25rem',
                      borderRadius: '2rem',
                      border: `1px solid ${theme.border}`,
                      backgroundColor: 'transparent',
                      color: currentPage === totalPages ? theme.textMuted : theme.fg,
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage !== totalPages) e.currentTarget.style.borderColor = theme.fg;
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== totalPages) e.currentTarget.style.borderColor = theme.border;
                    }}
                  >
                    Next &gt;
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 991px) {
          .responsive-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .responsive-grid > div:first-child {
            position: relative !important;
            top: 0 !important;
          }
        }
      `}} />
    </div>
  );
}

export default function FinancialReportPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', backgroundColor: '#000000', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 400 }}>Loading Portal...</h2>
      </div>
    }>
      <Suspense fallback={null}>
        <FinancialReportContent />
      </Suspense>
    </Suspense>
  );
}

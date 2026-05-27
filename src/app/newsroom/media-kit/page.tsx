'use client';

import React, { useState, useMemo } from 'react';

// Brand Types
interface Brand {
  id: string;
  name: string;
  description: string;
  category: string;
  color: string;
  borderColor: string;
  svgIcon: React.ReactNode;
  logoUrl?: string;
}

export default function MediaKitPage() {
  const [activeTab, setActiveTab] = useState<'media-kit' | 'videos' | 'publications'>('media-kit');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'alphabetical-asc' | 'alphabetical-desc' | 'category'>('alphabetical-asc');
  
  // Modal states
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    purpose: '',
  });
  const [selectedResources, setSelectedResources] = useState<string[]>([]);

  // 6 Sleek Zawr Platform Brands
  const brands: Brand[] = useMemo(() => [
    {
      id: 'zawr-industries',
      name: 'Zawr Industries',
      description: 'India\'s multi-sector conglomerate driving global investments, corporate strategies, and large-scale industrial infrastructure.',
      category: 'Corporate',
      color: '#000000',
      borderColor: '#e5e7eb',
      logoUrl: '/logos/zawr-industries.png',
      svgIcon: (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '50%', height: '50%' }}>
          <path d="M15 20H85L30 80H85" stroke="#000000" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="50" cy="50" r="10" fill="#b45309"/>
        </svg>
      )
    },
    {
      id: 'velocityos',
      name: 'VelocityOS',
      description: 'A revolutionary next-generation web operating system designed for business productivity, sandboxed executions, and workspace virtualization.',
      category: 'Platform',
      color: '#10b981',
      borderColor: '#a7f3d0',
      logoUrl: '/logos/velocityos.png',
      svgIcon: (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '50%', height: '50%' }}>
          <rect x="15" y="15" width="70" height="70" rx="12" stroke="#10b981" strokeWidth="8"/>
          <path d="M35 60L50 35L65 60" stroke="#10b981" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="50" cy="35" r="4" fill="#047857"/>
        </svg>
      )
    },
    {
      id: 'sketchstudio',
      name: 'Sketch Studio',
      description: 'An advanced web-based digital design workbench and vector engine enabling frictionless team collaboration, prototyping, and UI drawing.',
      category: 'Creative Suite',
      color: '#ec4899',
      borderColor: '#fbcfe8',
      logoUrl: '/logos/sketchstudio.png',
      svgIcon: (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '50%', height: '50%' }}>
          <path d="M30 20L70 20L85 45L50 85L15 45L30 20Z" stroke="#ec4899" strokeWidth="8" strokeLinejoin="round"/>
          <path d="M15 45H85" stroke="#ec4899" strokeWidth="4"/>
          <path d="M30 20L50 85L70 20" stroke="#ec4899" strokeWidth="4"/>
        </svg>
      )
    },
    {
      id: 'firm-ai',
      name: 'Firm AI',
      description: 'An enterprise-grade financial analytics and real-time risk intelligence suite featuring custom predictive models and dashboard charts.',
      category: 'Analytics',
      color: '#3b82f6',
      borderColor: '#bfdbfe',
      logoUrl: '/logos/firm-ai.png',
      svgIcon: (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '50%', height: '50%' }}>
          <rect x="20" y="55" width="12" height="25" rx="2" fill="#3b82f6"/>
          <rect x="44" y="35" width="12" height="45" rx="2" fill="#3b82f6"/>
          <rect x="68" y="15" width="12" height="65" rx="2" fill="#2563eb"/>
          <path d="M15 65L38 45L62 25L85 10" stroke="#1d4ed8" strokeWidth="6" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      id: 'zawr-ai',
      name: 'Zawr AI',
      description: 'Pioneering artificial intelligence systems, custom large language models, automated content workflows, and visual semantic agents.',
      category: 'Intelligence',
      color: '#8b5cf6',
      borderColor: '#ddd6fe',
      logoUrl: '/logos/zawr-ai.png',
      svgIcon: (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '50%', height: '50%' }}>
          <path d="M50 15L80 32.5V67.5L50 85L20 67.5V32.5L50 15Z" stroke="#8b5cf6" strokeWidth="8" strokeLinejoin="round"/>
          <circle cx="50" cy="50" r="14" stroke="#6d28d9" strokeWidth="6"/>
          <circle cx="50" cy="50" r="4" fill="#6d28d9"/>
        </svg>
      )
    },
    {
      id: 'quick-dial',
      name: 'Quick Dial',
      description: 'A lightning-fast customer relationship management system and telecommunication pipeline connecting agents and leads instantly.',
      category: 'Enterprise CRM',
      color: '#f59e0b',
      borderColor: '#fde68a',
      logoUrl: '/logos/quick-dial.png',
      svgIcon: (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '50%', height: '50%' }}>
          <circle cx="50" cy="50" r="35" stroke="#f59e0b" strokeWidth="8"/>
          <path d="M35 50C35 41.7 41.7 35 50 35V65C41.7 65 35 58.3 35 50Z" fill="#f59e0b"/>
          <path d="M65 40L75 30" stroke="#d97706" strokeWidth="6" strokeLinecap="round"/>
          <path d="M65 60L75 70" stroke="#d97706" strokeWidth="6" strokeLinecap="round"/>
        </svg>
      )
    }
  ], []);

  // Filter & Sort brands
  const filteredBrands = useMemo(() => {
    let result = [...brands];
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b => 
        b.name.toLowerCase().includes(q) || 
        b.description.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'alphabetical-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'alphabetical-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === 'category') {
      result.sort((a, b) => a.category.localeCompare(b.category));
    }

    return result;
  }, [brands, searchQuery, sortBy]);

  // Handle Resource checkboxes
  const handleResourceToggle = (res: string) => {
    if (selectedResources.includes(res)) {
      setSelectedResources(prev => prev.filter(r => r !== res));
    } else {
      setSelectedResources(prev => [...prev, res]);
    }
  };

  // Submit media request to media@zawrindustries.com
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBrand) return;

    if (!formData.name || !formData.email || !formData.purpose) {
      alert('Please fill in name, email, and purpose.');
      return;
    }

    if (selectedResources.length === 0) {
      alert('Please select at least one resource requested.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/request-media-kit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: selectedBrand.name,
          name: formData.name,
          email: formData.email,
          organization: formData.organization,
          purpose: formData.purpose,
          resources: selectedResources
        })
      });

      if (res.ok) {
        setRequestSubmitted(true);
      } else {
        alert('Failed to submit request. Please try again.');
      }
    } catch (err) {
      alert('An error occurred. Please try again.');
    }
    setSubmitting(false);
  };

  // Resources checkboxes templates
  const availableResources = [
    'High-Resolution Vector SVG Logo (Primary Branding)',
    'Transparent High-Resolution PNG Logo (Digital Use)',
    'Corporate Colors & Typography Brand Guidelines PDF',
    'Official Executive Profiles & Representative Headshots',
    'Zawr Subsidiary Facts & Annual Performance Summary Brochure'
  ];

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', color: '#111111', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Top Banner Navigation */}
      <div style={{ borderBottom: '1px solid #eaeaea', padding: '1.5rem 5%' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#666666' }}>
            <a href="/" style={{ color: '#666666', textDecoration: 'none' }}>Home</a>
            <span>/</span>
            <a href="/newsroom" style={{ color: '#666666', textDecoration: 'none' }}>Newsroom</a>
            <span>/</span>
            <span style={{ color: '#111111', fontWeight: 600 }}>Media Kit</span>
          </div>
          <a href="/newsroom" style={{ fontSize: '0.875rem', color: '#000', fontWeight: 600, textDecoration: 'none', borderBottom: '1px solid #000' }}>← Back to Newsroom</a>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 5% 6rem' }}>
        
        {/* Header Block */}
        <div style={{ marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1.25rem', color: '#000000' }}>Media & Brand Assets</h1>
          <p style={{ fontSize: '1.125rem', color: '#4b5563', lineHeight: 1.7, maxWidth: '800px' }}>
            Access certified corporate logos, brand guidelines, color palettes, and official media statements across Zawr Industries' corporate holding and operational subsidiaries.
          </p>
        </div>

        {/* Tab Selection */}
        <div style={{ display: 'flex', borderBottom: '2px solid #f3f4f6', marginBottom: '3rem' }}>
          <button 
            onClick={() => setActiveTab('media-kit')}
            style={{ 
              padding: '1rem 2rem', 
              backgroundColor: 'transparent', 
              border: 'none', 
              borderBottom: activeTab === 'media-kit' ? '3px solid #b45309' : '3px solid transparent',
              color: activeTab === 'media-kit' ? '#b45309' : '#6b7280', 
              fontWeight: 600, 
              fontSize: '1rem', 
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginRight: '1rem'
            }}
          >
            Media Kit
          </button>
          <button 
            onClick={() => setActiveTab('videos')}
            style={{ 
              padding: '1rem 2rem', 
              backgroundColor: 'transparent', 
              border: 'none', 
              borderBottom: activeTab === 'videos' ? '3px solid #b45309' : '3px solid transparent',
              color: activeTab === 'videos' ? '#b45309' : '#6b7280', 
              fontWeight: 600, 
              fontSize: '1rem', 
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginRight: '1rem'
            }}
          >
            Videos
          </button>
          <button 
            onClick={() => setActiveTab('publications')}
            style={{ 
              padding: '1rem 2rem', 
              backgroundColor: 'transparent', 
              border: 'none', 
              borderBottom: activeTab === 'publications' ? '3px solid #b45309' : '3px solid transparent',
              color: activeTab === 'publications' ? '#b45309' : '#6b7280', 
              fontWeight: 600, 
              fontSize: '1rem', 
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Publications & Brochures
          </button>
        </div>

        {activeTab === 'media-kit' && (
          <div>
            {/* Search and Filters Bar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem', padding: '1.5rem 0', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: 500 }}>
                Showing 1 - {filteredBrands.length} of {brands.length} Brands
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {/* Search Bar */}
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search brand logos..."
                    style={{ 
                      padding: '0.625rem 1rem 0.625rem 2.5rem', 
                      fontSize: '0.875rem', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '9999px', 
                      width: '240px',
                      outline: 'none',
                      color: '#000000',
                      transition: 'border-color 0.2s'
                    }}
                  />
                  <svg style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* Sort dropdown */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Sort by:</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    style={{ 
                      padding: '0.625rem 1.5rem 0.625rem 1rem', 
                      fontSize: '0.875rem', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '9999px',
                      outline: 'none',
                      color: '#000',
                      backgroundColor: '#ffffff',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="alphabetical-asc">Date (Newest)</option>
                    <option value="alphabetical-desc">Date (Oldest)</option>
                    <option value="category">Category</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Brand Logo Grid */}
            {filteredBrands.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '6rem 0', color: '#6b7280' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>No brand logos matched your search</h3>
                <p style={{ fontSize: '0.95rem' }}>Try refining your keywords or clearing the search query.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '2.5rem' }}>
                {filteredBrands.map((b) => (
                  <div 
                    key={b.id}
                    onClick={() => {
                      setSelectedBrand(b);
                      setRequestSubmitted(false);
                      setFormData({ name: '', email: '', organization: '', purpose: '' });
                      setSelectedResources([]);
                    }}
                    style={{ 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '12px', 
                      overflow: 'hidden', 
                      cursor: 'pointer', 
                      backgroundColor: '#ffffff',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                    }}
                    className="brand-card-hover"
                  >
                    {/* SVG Logo display panel */}
                    <div style={{ 
                      height: '220px', 
                      backgroundColor: '#f9fafb', 
                      borderBottom: '1px solid #f3f4f6', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      position: 'relative'
                    }}>
                      {b.svgIcon}
                      <span style={{ 
                        position: 'absolute', 
                        top: '1rem', 
                        right: '1rem', 
                        fontSize: '0.75rem', 
                        fontWeight: 600, 
                        color: b.color, 
                        backgroundColor: `${b.color}15`, 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '9999px',
                        border: `1px solid ${b.borderColor}`
                      }}>
                        {b.category}
                      </span>
                    </div>

                    {/* Brand Card Info */}
                    <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: '#111111' }}>{b.name}</h3>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.6, marginBottom: '1.5rem' }}>{b.description}</p>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button 
                          style={{ 
                            padding: '0.5rem 1.75rem', 
                            fontSize: '0.875rem', 
                            fontWeight: 600, 
                            color: '#111111', 
                            border: '1px solid #111111', 
                            borderRadius: '9999px', 
                            backgroundColor: 'transparent',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.2s'
                          }}
                        >
                          view →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Videos Tab View */}
        {activeTab === 'videos' && (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Executive Broadcasts & Corporate Videos</h3>
            <p style={{ color: '#6b7280', maxWidth: '600px', margin: '0 auto 3rem', fontSize: '1rem' }}>
              Explore official launch video clips, press statements, and project walkthrough recordings from our corporate operations.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '2.5rem', maxWidth: '1000px', margin: '0 auto' }}>
              {[
                { title: 'Zawr Logistics Center Launch Ceremony', duration: '2:45', date: 'May 2026', bg: '#1e293b' },
                { title: 'Zawr Real Estate Smart City Vision Walkthrough', duration: '3:20', date: 'April 2026', bg: '#0f172a' },
                { title: 'Strategic IT AI Expansion - Chairman Address', duration: '5:10', date: 'Feb 2026', bg: '#064e3b' }
              ].map((v, i) => (
                <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', textAlign: 'left', backgroundColor: '#fff' }}>
                  <div style={{ height: '200px', backgroundColor: v.bg, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <button style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: '4px' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M8 5V19L19 12L8 5Z" fill="#111"/></svg>
                    </button>
                    <span style={{ position: 'absolute', bottom: '1rem', right: '1rem', color: '#fff', backgroundColor: 'rgba(0,0,0,0.6)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>{v.duration}</span>
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 600 }}>{v.date}</span>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '0.5rem 0' }}>{v.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Publications Tab View */}
        {activeTab === 'publications' && (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Corporate Broadsheets & Factsheets</h3>
            <p style={{ color: '#6b7280', maxWidth: '600px', margin: '0 auto 3rem', fontSize: '1rem' }}>
              View and download annual reports, ESG files, operational statements, and quarterly fact check sheets.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
              {[
                { title: 'Zawr Corporate Brochure 2026', pages: '32 Pages', file: 'PDF (4.8MB)' },
                { title: 'Zawr Technologies AI Capability Factsheet', pages: '8 Pages', file: 'PDF (1.2MB)' },
                { title: 'Zawr Annual ESG Statement 2025', pages: '45 Pages', file: 'PDF (6.5MB)' }
              ].map((p, i) => (
                <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', textAlign: 'left' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.25rem' }}>{p.title}</h4>
                    <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{p.pages} • {p.file}</span>
                  </div>
                  <button style={{ padding: '0.4rem 1rem', border: '1px solid #111', borderRadius: '4px', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Download</button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Asset Request Modal (Overlay Form) */}
      {selectedBrand && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh', 
          backgroundColor: 'rgba(0,0,0,0.4)', 
          backdropFilter: 'blur(8px)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          zIndex: 99999,
          padding: '1.5rem'
        }}>
          
          <div style={{ 
            backgroundColor: '#ffffff', 
            borderRadius: '16px', 
            width: '100%', 
            maxWidth: '640px', 
            maxHeight: '90vh', 
            overflowY: 'auto', 
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #eaeaea',
            position: 'relative'
          }}>
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedBrand(null)}
              style={{ 
                position: 'absolute', 
                top: '1.5rem', 
                right: '1.5rem', 
                backgroundColor: '#f3f4f6', 
                border: 'none', 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontWeight: 'bold',
                color: '#6b7280',
                transition: 'background-color 0.2s'
              }}
            >
              ✕
            </button>

            {/* Modal Header Panel */}
            <div style={{ padding: '2.5rem 2.5rem 1.5rem', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '8px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
                {selectedBrand.svgIcon}
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: selectedBrand.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Asset Request Portal</span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111111', margin: '0.25rem 0 0' }}>{selectedBrand.name}</h2>
              </div>
            </div>

            {/* Request Resource Form */}
            {!requestSubmitted ? (
              <form onSubmit={handleSubmit} style={{ padding: '2.5rem' }}>
                
                <p style={{ fontSize: '0.9rem', color: '#6b7280', lineHeight: 1.5, marginBottom: '2rem' }}>
                  Please fill out the corporate authorization form below to submit a formal request for <strong>{selectedBrand.name}</strong> digital media kit resources. Authorized assets will be dispatched to your address by <a href="mailto:media@zawrindustries.com" style={{ color: '#b45309', fontWeight: 600, textDecoration: 'none' }}>media@zawrindustries.com</a>.
                </p>

                {/* Checklist of Resources */}
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#111111', marginBottom: '1rem' }}>Requested Resources *</label>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {availableResources.map((res) => (
                      <label 
                        key={res} 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'flex-start', 
                          gap: '0.75rem', 
                          fontSize: '0.875rem', 
                          color: '#374151',
                          cursor: 'pointer',
                          userSelect: 'none'
                        }}
                      >
                        <input 
                          type="checkbox"
                          checked={selectedResources.includes(res)}
                          onChange={() => handleResourceToggle(res)}
                          style={{ marginTop: '0.2rem', width: '16px', height: '16px', accentColor: selectedBrand.color }}
                        />
                        <span>{res}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Requester Contact Details */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#111111', marginBottom: '0.5rem' }}>Your Full Name *</label>
                    <input 
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Sandra Sterling"
                      style={{ 
                        width: '100%', 
                        padding: '0.75rem 1rem', 
                        fontSize: '0.875rem', 
                        border: '1px solid #d1d5db', 
                        borderRadius: '6px',
                        outline: 'none',
                        color: '#000'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#111111', marginBottom: '0.5rem' }}>Business Email *</label>
                    <input 
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="sandra@agency.com"
                      style={{ 
                        width: '100%', 
                        padding: '0.75rem 1rem', 
                        fontSize: '0.875rem', 
                        border: '1px solid #d1d5db', 
                        borderRadius: '6px',
                        outline: 'none',
                        color: '#000'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#111111', marginBottom: '0.5rem' }}>Company / Publication Agency Name</label>
                  <input 
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                    placeholder="e.g. Associated Press India"
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem 1rem', 
                      fontSize: '0.875rem', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '6px',
                      outline: 'none',
                      color: '#000'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '2.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#111111', marginBottom: '0.5rem' }}>Intended Purpose & Usage Description *</label>
                  <textarea 
                    required
                    value={formData.purpose}
                    onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                    placeholder="Please explain how you plan to feature the Zawr brand resources in your broadcast, article, or portal..."
                    style={{ 
                      width: '100%', 
                      height: '100px',
                      padding: '0.75rem 1rem', 
                      fontSize: '0.875rem', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '6px',
                      outline: 'none',
                      color: '#000',
                      resize: 'none'
                    }}
                  />
                </div>

                {/* Submission CTA */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                  <button 
                    type="button"
                    onClick={() => setSelectedBrand(null)}
                    style={{ 
                      padding: '0.75rem 1.5rem', 
                      fontSize: '0.875rem', 
                      fontWeight: 600, 
                      color: '#4b5563', 
                      border: '1px solid #d1d5db',
                      backgroundColor: 'transparent',
                      borderRadius: '6px', 
                      cursor: 'pointer' 
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={submitting}
                    style={{ 
                      padding: '0.75rem 2rem', 
                      fontSize: '0.875rem', 
                      fontWeight: 600, 
                      color: '#ffffff', 
                      backgroundColor: selectedBrand.color,
                      border: 'none',
                      borderRadius: '6px', 
                      cursor: 'pointer',
                      boxShadow: `0 4px 6px -1px ${selectedBrand.color}40`,
                      opacity: submitting ? 0.7 : 1
                    }}
                  >
                    {submitting ? 'Submitting Request...' : 'Submit Resource Request'}
                  </button>
                </div>

              </form>
            ) : (
              // Success Screen inside the Modal
              <div style={{ padding: '4rem 2.5rem', textAlign: 'center' }}>
                <div style={{ 
                  width: '64px', 
                  height: '64px', 
                  borderRadius: '50%', 
                  backgroundColor: '#ecfdf5', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  border: '2px solid #10b981'
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17L4 12" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem', color: '#111111' }}>Asset Request Submitted</h3>
                <p style={{ fontSize: '0.95rem', color: '#6b7280', lineHeight: 1.6, maxWidth: '440px', margin: '0 auto 2.5rem' }}>
                  Thank you! Your authorized assets request has been logged successfully. The Zawr Corporate Public Relations team will process your verification and reach out to you from <strong style={{ color: '#111' }}>media@zawrindustries.com</strong>.
                </p>

                <button 
                  onClick={() => setSelectedBrand(null)}
                  style={{ 
                    padding: '0.75rem 2rem', 
                    fontSize: '0.875rem', 
                    fontWeight: 600, 
                    color: '#ffffff', 
                    backgroundColor: '#111111',
                    border: 'none',
                    borderRadius: '6px', 
                    cursor: 'pointer' 
                  }}
                >
                  Done
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Embedded CSS Hover Trick */}
      <style jsx global>{`
        .brand-card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 20px -3px rgba(0, 0, 0, 0.04), 0 4px 6px -2px rgba(0, 0, 0, 0.02) !important;
          border-color: #111111 !important;
        }
      `}</style>

    </div>
  );
}

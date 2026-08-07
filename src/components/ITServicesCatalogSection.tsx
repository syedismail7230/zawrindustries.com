'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import catalogData from '@/data/services_catalog.json';

export default function ITServicesCatalogSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredServices = catalogData.filter((item) => {
    const matchesSearch =
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subServices.some((sub) => sub.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeFilter === 'all') return true;
    if (activeFilter === 'high-demand') return item.highDemand;
    if (activeFilter === 'ai-data') return item.id === 'ai-machine-learning' || item.id === 'data-science-analytics' || item.id === 'emerging-technologies';
    if (activeFilter === 'cloud-devops') return item.id === 'cloud-services' || item.id === 'devops-automation' || item.id === 'it-infrastructure';
    if (activeFilter === 'enterprise') return item.id === 'erp-solutions' || item.id === 'crm-solutions' || item.id === 'digital-transformation' || item.id === 'business-solutions';
    if (activeFilter === 'security') return item.id === 'cybersecurity' || item.id === 'managed-it-services' || item.id === 'quality-assurance-testing';

    return true;
  });

  return (
    <section style={{ backgroundColor: '#090d16', color: '#ffffff', padding: '6rem 5%', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
        
        {/* Header Block */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'inline-block', marginBottom: '0.75rem' }}>
            Comprehensive Service Directory
          </span>
          <h2 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '1.2rem' }}>
            30 Core IT Service Domains & Enterprise Solutions
          </h2>
          <p style={{ fontSize: 'clamp(1rem, 1.8vw, 1.2rem)', color: 'rgba(255,255,255,0.7)', maxWidth: '780px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Explore Zawr Industries&apos; full portfolio of custom software engineering, AI automation, cloud architecture, cybersecurity, and digital transformation capabilities.
          </p>

          {/* Search Bar */}
          <div style={{ maxWidth: '600px', margin: '0 auto 2rem', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search 30+ service categories or specific solutions (e.g., AI Agents, Cloud, React, SAP)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                borderRadius: '9999px',
                border: '1px solid rgba(255,255,255,0.2)',
                backgroundColor: 'rgba(255,255,255,0.05)',
                color: '#ffffff',
                fontSize: '0.95rem',
                outline: 'none',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                transition: 'all 0.2s ease'
              }}
            />
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All 30 Categories' },
              { id: 'high-demand', label: '🔥 High Demand 2026' },
              { id: 'ai-data', label: 'AI & Data Science' },
              { id: 'cloud-devops', label: 'Cloud & DevOps' },
              { id: 'enterprise', label: 'Enterprise & ERP/CRM' },
              { id: 'security', label: 'Cybersecurity & Support' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                style={{
                  padding: '0.6rem 1.2rem',
                  borderRadius: '9999px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: activeFilter === tab.id ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.12)',
                  backgroundColor: activeFilter === tab.id ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255,255,255,0.03)',
                  color: activeFilter === tab.id ? '#38bdf8' : 'rgba(255,255,255,0.8)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
          {filteredServices.map((service, index) => (
            <div
              key={service.id}
              style={{
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: service.highDemand ? '1px solid rgba(56,189,248,0.3)' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                transition: 'all 0.3s ease',
              }}
            >
              <div>
                {/* Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)' }}>
                    #{String(index + 1).padStart(2, '0')}
                  </span>
                  {service.highDemand && (
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', backgroundColor: 'rgba(56,189,248,0.12)', padding: '0.25rem 0.75rem', borderRadius: '9999px', letterSpacing: '0.05em' }}>
                      🔥 High Demand 2026
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.6rem', lineHeight: 1.3 }}>
                  {service.category}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '1.4rem' }}>
                  {service.description}
                </p>

                {/* Sub-services Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '1.8rem' }}>
                  {service.subServices.map((sub, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '0.78rem',
                        color: 'rgba(255,255,255,0.85)',
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        padding: '0.3rem 0.65rem',
                        borderRadius: '6px'
                      }}
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div style={{ paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link
                  href="/contact"
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: '#38bdf8',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  Request Proposal →
                </Link>
                <a
                  href="tel:+919880464078"
                  style={{
                    fontSize: '0.8rem',
                    color: 'rgba(255,255,255,0.5)',
                    textDecoration: 'none'
                  }}
                >
                  Call +91 9880464078
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'rgba(255,255,255,0.6)' }}>
            No service categories matched your search term &quot;{searchQuery}&quot;. Please try another keyword.
          </div>
        )}
      </div>
    </section>
  );
}

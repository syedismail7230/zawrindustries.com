'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface IndustryItem {
  id: string;
  title: string;
  eyebrow: string;
  image: string;
  href: string;
  summary: string[];
}

const INDUSTRIES_DATA: IndustryItem[] = [
  {
    id: 'it-services',
    title: 'IT Services',
    eyebrow: 'DIGITAL INFRASTRUCTURE & AI',
    image: '/assets/it-services-44.png',
    href: '/industries/it-service',
    summary: [
      'Zawr Industries engineers enterprise-grade software architectures, cognitive AI platforms, and secure multi-cloud environments.',
      'We partner with global enterprises to modernize legacy systems, deploy low-latency transactional ledgers, and automate mission-critical operations at planetary scale.',
      'From custom SaaS and fintech platforms to proprietary neural intelligence engines like Firm AI and VelocityOS, our solutions deliver unmatched performance, security, and measurable ROI.'
    ]
  },
  {
    id: 'manufacturing',
    title: 'Manufacturing',
    eyebrow: 'PRECISION ENGINEERING & AUTONOMY',
    image: '/assets/manufacturing-44.png',
    href: '/industries/manufacturing',
    summary: [
      'Our advanced manufacturing division integrates 5-axis precision CNC machining, smart factory IoT telemetry, and autonomous industrial robotics.',
      'We produce mission-critical aerospace, defense, and industrial components with sub-micron tolerances and 24/7 adaptive automation.',
      'By fusing autonomous guided vehicles (AGVs) with real-time operational telemetry, Zawr Manufacturing creates resilient, high-throughput production ecosystems.'
    ]
  },
  {
    id: 'logistics',
    title: 'Logistics and Transport',
    eyebrow: 'GLOBAL MULTIMODAL FREIGHT',
    image: '/assets/logistics-44.png',
    href: '/industries/transport-and-logistics',
    summary: [
      'Operating across maritime freight lanes, air cargo networks, rail corridors, and smart warehousing, Zawr Logistics connects global trade routes.',
      'We streamline international supply chains with predictive route optimization, real-time container telematics, and automated customs compliance.',
      'Our intelligent logistics network provides complete end-to-end cargo visibility, ensuring rapid, dependable, and sustainable freight movement worldwide.'
    ]
  },
  {
    id: 'estate',
    title: 'Real Estate',
    eyebrow: 'SUSTAINABLE ESTATES & PROPTECH',
    image: '/assets/real-estate-44.png',
    href: '/industries/estate',
    summary: [
      'Zawr Real Estate develops biophilic urban residences, eco-resort corridors, and next-generation commercial business hubs.',
      'We incorporate smart microgrid energy management, graywater recycling, and fractional digital ownership into every master development.',
      'Our architectural philosophy balances sustainable environmental stewardship with timeless aesthetics and cutting-edge building automation.'
    ]
  }
];

export default function OurIndustriesSection() {
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryItem | null>(null);

  const handleCardClick = (item: IndustryItem) => {
    setSelectedIndustry(item);
  };

  const handleBackToGrid = () => {
    setSelectedIndustry(null);
  };

  return (
    <section
      id="our-industries"
      style={{
        backgroundColor: '#ffffff',
        color: '#000000',
        padding: 'clamp(5rem, 8vh, 7rem) 1.5rem',
        borderTop: '1px solid #f1f5f9',
        borderBottom: '1px solid #f1f5f9',
        position: 'relative',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 4vh, 3.5rem)' }}>
          <h2
            style={{
              fontSize: 'clamp(2.4rem, 5.5vw, 4rem)',
              fontWeight: 400,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              color: '#000000',
              margin: 0,
            }}
          >
            Industries
          </h2>
        </div>

        {/* ── CONDITIONAL VIEW: 2x2 GRID vs DETAIL SPLIT VIEW ── */}
        {!selectedIndustry ? (
          /* ── 2x2 CLEAN GRID VIEW (No outer card boxes, pure floating models on white canvas) ── */
          <div
            className="industries-grid-pure"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              columnGap: 'clamp(6rem, 18vw, 15rem)',
              rowGap: 'clamp(6rem, 14vh, 11rem)',
              maxWidth: '1100px',
              margin: '0 auto',
              padding: '2rem 0',
            }}
          >
            {INDUSTRIES_DATA.map((item) => (
              <div
                key={item.id}
                onClick={() => handleCardClick(item)}
                role="button"
                tabIndex={0}
                aria-label={`View ${item.title}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(item);
                  }
                }}
                className="industry-pure-item"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  outline: 'none',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  width: '100%',
                  maxWidth: '260px',
                  margin: '0 auto',
                  transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {/* 3D Model Image */}
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '1 / 1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      maxWidth: '240px',
                      maxHeight: '240px',
                      objectFit: 'contain',
                      transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s ease',
                      filter: 'drop-shadow(0 8px 20px rgba(0, 0, 0, 0.04))',
                    }}
                    className="industry-pure-img"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                {/* Industry Title */}
                <h3
                  className="industry-pure-title"
                  style={{
                    margin: '1.25rem 0 0 0',
                    fontSize: 'clamp(1.15rem, 1.8vw, 1.4rem)',
                    fontWeight: 500,
                    letterSpacing: '-0.02em',
                    color: '#0f172a',
                    textAlign: 'center',
                    transition: 'color 0.25s ease',
                  }}
                >
                  {item.title}
                </h3>
              </div>
            ))}
          </div>
        ) : (
          /* ── DETAIL SPLIT VIEW (Direct on page, no outer card box, no container border) ── */
          <div
            className="industry-detail-pure"
            style={{
              maxWidth: '1100px',
              margin: '0 auto',
              animation: 'fadeInPure 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          >
            {/* Top Minimal Navigation Bar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'clamp(2rem, 4vh, 3rem)',
                paddingBottom: '1rem',
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              <button
                type="button"
                onClick={handleBackToGrid}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'none',
                  border: 'none',
                  fontSize: '0.92rem',
                  fontWeight: 500,
                  color: '#475569',
                  cursor: 'pointer',
                  padding: '6px 0',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#000000')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                <span>All Industries</span>
              </button>

              {/* Minimalist Switcher Pills */}
              <div
                className="industry-tab-pills"
                style={{
                  display: 'flex',
                  gap: '6px',
                  flexWrap: 'wrap',
                }}
              >
                {INDUSTRIES_DATA.map((tab) => {
                  const isActive = tab.id === selectedIndustry.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setSelectedIndustry(tab)}
                      style={{
                        padding: '6px 14px',
                        fontSize: '0.8rem',
                        fontWeight: isActive ? 600 : 400,
                        borderRadius: '100px',
                        border: '1px solid',
                        borderColor: isActive ? '#000000' : '#e2e8f0',
                        backgroundColor: isActive ? '#000000' : '#ffffff',
                        color: isActive ? '#ffffff' : '#64748b',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {tab.title}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pure Split Layout: Left Model, Right Typography & CTA */}
            <div
              className="industry-split-pure"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: 'clamp(2rem, 6vw, 5rem)',
                alignItems: 'center',
              }}
            >
              {/* Left Column: Pure 3D Render (no card wrapper) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  background: 'none',
                }}
              >
                <img
                  src={selectedIndustry.image}
                  alt={selectedIndustry.title}
                  style={{
                    width: '100%',
                    maxWidth: '460px',
                    height: 'auto',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 20px 35px rgba(0, 0, 0, 0.08))',
                  }}
                  loading="eager"
                  decoding="async"
                />
              </div>

              {/* Right Column: Industry Content & Know More Button */}
              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                <h3
                  style={{
                    fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
                    fontWeight: 400,
                    letterSpacing: '-0.03em',
                    color: '#000000',
                    margin: '0 0 1.75rem 0',
                    lineHeight: 1.12,
                  }}
                >
                  {selectedIndustry.title}
                </h3>

                {/* Paragraph Copy */}
                <div
                  style={{
                    fontSize: 'clamp(0.95rem, 1.4vw, 1.05rem)',
                    color: '#1e293b',
                    lineHeight: 1.8,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.15rem',
                    marginBottom: '2.5rem',
                  }}
                >
                  {selectedIndustry.summary.map((para, i) => (
                    <p key={i} style={{ margin: 0 }}>
                      {para}
                    </p>
                  ))}
                </div>

                {/* Pill Button: Know more ↗ */}
                <div>
                  <Link
                    href={selectedIndustry.href}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      backgroundColor: '#000000',
                      color: '#ffffff',
                      padding: '12px 30px',
                      borderRadius: '100px',
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      textDecoration: 'none',
                      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#1e293b';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.18)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#000000';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.12)';
                    }}
                  >
                    <span>Know more</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInPure {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .industry-pure-item:hover .industry-pure-img {
          transform: scale(1.06);
          filter: drop-shadow(0 20px 35px rgba(0, 0, 0, 0.08)) !important;
        }

        @media (max-width: 768px) {
          .industries-grid-pure {
            grid-template-columns: repeat(2, 1fr) !important;
            column-gap: 1.75rem !important;
            row-gap: 2.75rem !important;
            padding: 1rem 0 !important;
          }
          .industry-pure-item {
            max-width: 100% !important;
          }
          .industry-pure-img {
            max-width: 160px !important;
            max-height: 160px !important;
          }
          .industry-pure-title {
            font-size: 1.05rem !important;
            margin-top: 0.85rem !important;
          }
          .industry-tab-pills {
            display: none !important;
          }
          .industry-split-pure {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }

        @media (max-width: 480px) {
          .industries-grid-pure {
            grid-template-columns: repeat(2, 1fr) !important;
            column-gap: 1rem !important;
            row-gap: 2.25rem !important;
            padding: 0.5rem 0 !important;
          }
          .industry-pure-img {
            max-width: 135px !important;
            max-height: 135px !important;
          }
          .industry-pure-title {
            font-size: 0.92rem !important;
            margin-top: 0.75rem !important;
          }
        }
      ` }} />
    </section>
  );
}

'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

interface SitemapLink {
  label: string;
  href: string;
  description: string;
  isExternal?: boolean;
}

interface SitemapSection {
  title: string;
  count: number;
  description: string;
  links: SitemapLink[];
}

const sitemapData: SitemapSection[] = [
  {
    title: 'Corporate & About',
    count: 13,
    description: 'Learn about our corporate journey, history, leadership team, and operational frameworks.',
    links: [
      { label: 'Home Page', href: '/', description: 'The central hub of Zawr Industries global operations and conglomerate segments.' },
      { label: 'About Zawr Industries', href: '/about', description: 'Core overview, corporate governance, and functional business structure.' },
      { label: 'Our History & Timeline', href: '/about/history', description: 'Our founding journey in Bangalore (2023) and major corporate milestones.' },
      { label: 'Board of Directors', href: '/about/board', description: 'Meet our executive leadership, operational board, and strategic advisors.' },
      { label: 'Awards & Recognition', href: '/about/awards', description: 'External honors, corporate ratings, and industry-wide milestones.' },
      { label: 'Our Global Impact', href: '/about/impact', description: 'Global economic contributions, employee metrics, and community welfare details.' },
      { label: 'Corporate Blog', href: '/about/blog', description: 'Thought leadership, technology research papers, and industrial insights.' },
      { label: 'Core Values', href: '/about/values', description: 'Integrity, continuous innovation, scalability, and long-term transformation.' },
      { label: 'Our Vision', href: '/about/vision', description: 'Integrating technologies, smart logistics, and asset management globally.' },
      { label: 'Our Mission', href: '/about/mission', description: 'Empowering scale, driving workspace automation, and creating shareholder value.' },
      { label: 'CSR Initiatives', href: '/about/csr', description: 'Social contribution efforts, charity work, and local welfare programs.' },
      { label: 'Innovation & Research', href: '/about/innovation', description: 'R&D focuses on custom artificial intelligence and smart supply chain systems.' },
      { label: 'Code of Conduct & Ethics', href: '/about/code-of-conduct', description: 'Standard operating procedures, professional ethics, and compliance policies.' },
    ],
  },
  {
    title: 'IT Services & Solutions',
    count: 23,
    description: 'Detailed pathways for our specialized IT, artificial intelligence, software engineering, and operations services.',
    links: [
      { label: 'AI & Data Analytics', href: '/industries/it-service/ai-data-analytics', description: 'High-accuracy intelligence, business predictive reporting, and big data.' },
      { label: 'Cloud Solutions', href: '/industries/it-service/cloud', description: 'Seamless cloud migrations, hybrid ecosystems, and optimized web servers.' },
      { label: 'Cognitive Business Operations', href: '/industries/it-service/cognitive-business-operations', description: 'Smart operational analytics, cognitive workflows, and administrative tech.' },
      { label: 'Cybersecurity', href: '/industries/it-service/cybersecurity', description: 'Enterprise threat protection, digital assets safeguarding, and active security firewalls.' },
      { label: 'Network Solutions', href: '/industries/it-service/network-solutions', description: 'Scalable infrastructure routing, high-performance local configurations, and load balancing.' },
      { label: 'Industrial Autonomy & Engineering', href: '/industries/it-service/industrial-autonomy-and-engineering', description: 'Heavy automation controls, hardware integrations, and smart monitoring lines.' },
      { label: 'Enterprise Solutions', href: '/industries/it-service/enterprise-solutions', description: 'Custom ERP frameworks, workflow software engines, and organization-wide tools.' },
      { label: 'Tech Consulting', href: '/industries/it-service/consulting', description: 'Actionable technology planning, stack audits, and transformation advising.' },
      { label: 'Software Development', href: '/industries/it-service/software-development', description: 'Fully tailored web backend and native client solutions built for heavy workloads.' },
      { label: 'Web Development', href: '/industries/it-service/web-development', description: 'Modern, fluid user interfaces, visual design structures, and responsive coding.' },
      { label: 'Application Development', href: '/industries/it-service/application-development', description: 'Cross-platform mobile and desktop product creation and ecosystem setups.' },
      { label: 'Startup MVP', href: '/industries/it-service/startup-mvp', description: 'Fast prototype designs, core feature verification, and initial release pipelines.' },
      { label: 'CRM Solutions', href: '/industries/it-service/crm-solution', description: 'High-power customer relations panels, database management, and conversion paths.' },
      { label: 'CXM Solutions', href: '/industries/it-service/cxm-solution', description: 'Modern client experience portals, communications engines, and satisfaction loops.' },
      { label: 'Digital Marketing', href: '/industries/it-service/digital-marketing', description: 'Search optimization, target campaigns, dynamic content tracking, and visual assets.' },
      { label: 'Blockchain Systems', href: '/industries/it-service/blockchain', description: 'Distributed record registers, secure transactions, and custom smart contract designs.' },
      { label: 'Internet of Things (IoT)', href: '/industries/it-service/iot', description: 'Embedded device setups, real-time diagnostic reporting, and network control hubs.' },
      { label: 'DevOps & CI/CD', href: '/industries/it-service/devops', description: 'Deployment pipelines automation, server monitoring, and speed diagnostics.' },
      { label: 'Unit Testing', href: '/industries/it-service/unit-test', description: 'Rigorous codebase unit verification, coverage setups, and bug prevention pipelines.' },
      { label: 'Quality Assurance (QA)', href: '/industries/it-service/quality-assurance', description: 'End-to-end user path verifications, load audits, and usability certifications.' },
      { label: 'Workplace Transformation', href: '/industries/it-service/workplace-transformation', description: 'Smart work environments, remote cooperation setups, and tool optimizations.' },
      { label: 'Process Automation', href: '/industries/it-service/process-automation', description: 'Robotic process automation, routine data parsing, and time saving workflows.' },
      { label: 'Business Process Management', href: '/industries/it-service/business-process-management', description: 'High-level workflow reviews, bottleneck removals, and organizational tuning.' },
    ],
  },
  {
    title: 'Other Conglomerate Industries',
    count: 5,
    description: 'Explore our multi-sector operations, infrastructure services, and commercial frameworks.',
    links: [
      { label: 'IT Services Overview', href: '/industries/it-service', description: 'Central showcase page for all our 23 IT and automation service verticals.' },
      { label: 'Transport & Logistics', href: '/industries/transport-and-logistics', description: 'Full-stack supply chain systems, shipping networks, and dynamic scheduling.' },
      { label: 'Manufacturing & Tech', href: '/industries/manufacturing', description: 'Advanced hardware assembly, automated parts production, and equipment design.' },
      { label: 'Estate & Infrastructure', href: '/industries/estate', description: 'Smart commercial properties, tech parks, and next-gen storage facilities.' },
      { label: 'Healthcare & Biotech', href: '/industries/healthcare', description: 'Clinical tech applications, healthcare access portals, and biotech operations.' },
      { label: 'FMCG Division', href: '/industries/fmcg', description: 'High-quality consumer retail systems and global distribution lines.' },
    ],
  },
  {
    title: 'Digital Platforms',
    count: 5,
    description: 'Access our custom proprietary enterprise software engines and online portals.',
    links: [
      { label: 'Firm AI Platform', href: '/industries/it-service/ai-data-analytics', description: 'High-accuracy AI auditing, compliance audits, and business intelligence.' },
      { label: 'Sketch Studio Portal', href: 'https://sketchstudio.dev/', description: 'Interactive real-time graphic tools, design libraries, and creative boards.', isExternal: true },
      { label: 'Zawr AI Hub', href: 'https://ai.zawrindustries.com/', description: 'Universal generative AI applications and specialized machine learning pipelines.', isExternal: true },
      { label: 'Quick Dial CRM', href: 'https://crm.zawrindustries.com/', description: 'Sales workflow automation, calling systems, and client database panels.', isExternal: true },
      { label: 'VelocityOS Systems', href: 'https://velocityos.in/', description: 'High-speed specialized operating kernels and real-time execution environments.', isExternal: true },
    ],
  },
  {
    title: 'Sustainability',
    count: 4,
    description: 'Our core commitment to ecological balance, societal empowerment, and education.',
    links: [
      { label: 'Environmental Conservation', href: '/sustainability/environment', description: 'Carbon-neutral architectures, clean energy, and waste-reduction models.' },
      { label: 'Societal Empowerment', href: '/sustainability/empowerment', description: 'Micro-enterprise backing, digital literacy, and skill enablement portals.' },
      { label: 'Healthcare Accessibility', href: '/sustainability/health', description: 'Medical drives, free clinical solutions, and rural health accessibility apps.' },
      { label: 'Educational Foundations', href: '/sustainability/education', description: 'Academic scholarships, tech learning centers, and professional training.' },
    ],
  },
  {
    title: 'Investors Desk',
    count: 8,
    description: 'Financial reports, subsidiaries data, shareholder announcements, and corporate metrics.',
    links: [
      { label: 'Investors Center', href: '/investors', description: 'Consolidated corporate disclosures, investor resources, and shareholder relations.' },
      { label: 'Financial Reporting', href: '/investors/financial-report', description: 'Quarterly financial reports, audit filings, and corporate balances.' },
      { label: 'Investment Interests Gateway', href: '/investors/interest', description: 'Registration form for institutional investors and strategic fund inquiries.' },
      { label: 'Subsidiaries & Associates', href: '/investors#subsidiaries-associates', description: 'Detailed visual roadmap and list of wholly-owned subsidiaries globally.' },
      { label: 'Shareholder Inquiries', href: '/contact/client-relations', description: 'Dedicated communication desk for shareholder questions and investor feedback.' },
      { label: 'Events & Presentations', href: '/investors#events-presentations', description: 'Official corporate pitch decks, investor slideshows, and documents download.' },
      { label: 'Regulatory Notices', href: '/notices', description: 'Crucial shareholder notifications and regulatory compliance declarations.' },
    ],
  },
  {
    title: 'Newsroom & Media',
    count: 6,
    description: 'Latest official press releases, corporate notifications, media kits, and events list.',
    links: [
      { label: 'Newsroom Home', href: '/newsroom', description: 'Central base for all public statements, press coverages, and media announcements.' },
      { label: 'Official Press Releases', href: '/newsroom/press-release', description: 'Press circulars, strategic partnerships, and new business expansions.' },
      { label: 'Corporate Notifications', href: '/newsroom/notifications', description: 'Regulatory disclosures, operational updates, and investor advisories.' },
      { label: 'Press & Media Kit', href: '/newsroom/media-kit', description: 'Brand assets, high-res corporate logos, typography, and authorized images.' },
      { label: 'Events Calendar', href: '/newsroom/events', description: 'Stakeholder meets, webinars, global industrial summits, and tech launches.' },
      { label: 'General Bulletins', href: '/notices', description: 'Public notices, announcements, and compliance releases.' },
    ],
  },
  {
    title: 'Careers Hub',
    count: 4,
    description: 'Explore opportunities to join our team, view policies, and search active roles.',
    links: [
      { label: 'Careers Center', href: '/careers', description: 'General career pathways, culture highlights, and application processes.' },
      { label: 'Working at Zawr', href: '/careers/working-at-zawr', description: 'Overview of engineering-first collaborative culture, work perks, and benefits.' },
      { label: 'Equal Opportunity Policy', href: '/careers/equal-opportunity', description: 'Commitment to workspace equality, fair hiring, and support mechanisms.' },
      { label: 'Active Job Openings', href: '/careers', description: 'Search and apply for current roles in IT, manufacturing, estate, and logistics.' },
    ],
  },
  {
    title: 'Contact & Support',
    count: 7,
    description: 'Reach out to our relations desks, request sponsorships, or report fraud actions.',
    links: [
      { label: 'Contact Directory', href: '/contact', description: 'Direct contact addresses, emails, telephone numbers, and secure message forms.' },
      { label: 'Client Relations Desk', href: '/contact/client-relations', description: 'Dedicated enterprise customer onboarding, billing, and system queries.' },
      { label: 'Public Relations Desk', href: '/contact/public-relations', description: 'Media contact requests, speaker profiles, and official statements.' },
      { label: 'Sponsorship Requests', href: '/contact/sponsorship', description: 'Submit proposals for charity sponsorship, corporate events, or innovation backing.' },
      { label: 'Partner Registration Portal', href: '/contact/partner', description: 'Merchant registration, creator collaborations, and supplier integrations.' },
      { label: 'Fraud & Safety Alert Center', href: '/fraud-alert', description: 'Report suspicious links, fraud offers, fake hiring mails, or brand cloning.' },
      { label: 'Customer Relations Desk', href: '/customer-relations', description: 'Direct feedback portal for general consumer complaints and inquiries.' },
    ],
  },
  {
    title: 'Legal, Compliance & Policies',
    count: 7,
    description: 'Key legal declarations, privacy regulations, cookie usage, and refund policies.',
    links: [
      { label: 'Privacy Policy', href: '/legal/privacy-policy', description: 'User data protection protocols, corporate data governance, and regulatory safety compliance.' },
      { label: 'Terms of Service', href: '/legal/terms', description: 'Binding user terms of service for all platforms and websites.' },
      { label: 'Cookie Policy', href: '/legal/cookie-policy', description: 'Detailed summary of tracking tools, analytics cookies, and consent controls.' },
      { label: 'Legal Disclaimer (General)', href: '/legal-disclaimer', description: 'General declarations of liabilities, warranties, and information boundaries.' },
      { label: 'Legal Disclaimer (Corporate)', href: '/legal/disclaimer', description: 'Explicit legal and financial limitations, advice disclaimers, and local compliance.' },
      { label: 'Refund Policy', href: '/legal/refund-policy', description: 'Billing adjustments, transaction rules, and cancellation procedures.' },
      { label: 'Equal Opportunity (Fair Hiring)', href: '/legal/equal-opportunity-policy', description: 'Legal compliance framework for fair recruitment and workplace safety standards.' },
    ],
  },
];

export default function SitemapPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = useMemo(() => {
    return ['All', ...sitemapData.map(section => section.title)];
  }, []);

  // Filter links based on query and selected category
  const filteredData = useMemo(() => {
    return sitemapData
      .map(section => {
        // If category is not "All" and does not match section title, skip links
        if (activeCategory !== 'All' && section.title !== activeCategory) {
          return null;
        }

        const matchedLinks = section.links.filter(link => 
          link.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          link.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          link.href.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (matchedLinks.length === 0) return null;

        return {
          ...section,
          links: matchedLinks
        };
      })
      .filter((section): section is SitemapSection => section !== null);
  }, [searchQuery, activeCategory]);

  const totalLinkCount = useMemo(() => {
    return sitemapData.reduce((acc, curr) => acc + curr.links.length, 0);
  }, []);

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#000000', color: '#ffffff', paddingTop: '9rem', paddingBottom: '6rem', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 2rem' }}>
        
        {/* Header Section */}
        <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '3rem', marginBottom: '3rem' }}>
          <span style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#888888', fontWeight: 600 }}>Directory Roadmap</span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300, margin: '1rem 0 1.5rem 0', letterSpacing: '-0.03em', color: '#ffffff', lineHeight: 1.1 }}>
            Conglomerate Sitemap
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 1.5vw, 1.2rem)', color: '#aaaaaa', fontWeight: 300, maxWidth: '45rem', lineHeight: 1.6, margin: '0 0 2rem 0' }}>
            A fully indexed breakdown of our global properties, services, external SaaS portals, regulatory disclosures, and corporate departments. Tracked {totalLinkCount} active endpoints.
          </p>

          {/* Search Box & Category Filters */}
          <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '32rem' }}>
              <input 
                type="text" 
                placeholder="Search pages, platforms, or IT services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1rem 1.25rem',
                  fontSize: '1rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  color: '#ffffff',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'; e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'; }}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '1.25rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#888888',
                    cursor: 'pointer',
                    fontSize: '1.1rem'
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '0.85rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: activeCategory === cat ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.08)',
                    backgroundColor: activeCategory === cat ? '#ffffff' : 'transparent',
                    color: activeCategory === cat ? '#000000' : '#888888',
                    fontWeight: activeCategory === cat ? 500 : 300,
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Grid Layout */}
        {filteredData.length === 0 ? (
          <div style={{ padding: '4rem 0', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '8px' }}>
            <p style={{ color: '#666666', fontSize: '1.1rem', fontWeight: 300 }}>
              No routes or descriptions match "{searchQuery}".
            </p>
            <button 
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
              style={{ marginTop: '1rem', background: 'none', border: '1px solid rgba(255,255,255,0.2)', padding: '0.5rem 1.2rem', borderRadius: '4px', color: '#ffffff', cursor: 'pointer' }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(22rem, 1fr))', gap: '3rem' }}>
            {filteredData.map((section, idx) => (
              <div 
                key={idx} 
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.02)', 
                  border: '1px solid rgba(255, 255, 255, 0.05)', 
                  borderRadius: '8px', 
                  padding: '2.5rem',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start'
                }}
                className="sitemap-card"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 400, margin: 0, color: '#ffffff', letterSpacing: '-0.01em' }}>
                    {section.title}
                  </h2>
                  <span style={{ fontSize: '0.85rem', color: '#666666', border: '1px solid rgba(255,255,255,0.05)', padding: '0.1rem 0.5rem', borderRadius: '3px' }}>
                    {section.links.length} routes
                  </span>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#888888', fontWeight: 300, lineHeight: 1.5, margin: '0 0 2rem 0' }}>
                  {section.description}
                </p>
                
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {section.links.map((link, lIdx) => {
                    return (
                      <li key={lIdx} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {link.isExternal ? (
                            <a 
                              href={link.href} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              style={{ 
                                fontSize: '0.95rem', 
                                color: '#ffffff', 
                                textDecoration: 'none', 
                                transition: 'color 0.2s ease',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                fontWeight: 500
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.color = '#80b5ff'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.transform = 'translateX(0)'; }}
                            >
                              {link.label}
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                              </svg>
                            </a>
                          ) : (
                            <Link 
                              href={link.href}
                              style={{ 
                                fontSize: '0.95rem', 
                                color: '#ffffff', 
                                textDecoration: 'none', 
                                transition: 'all 0.2s ease',
                                fontWeight: 500,
                                display: 'inline-flex',
                                alignItems: 'center'
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.color = '#80b5ff'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.transform = 'translateX(0)'; }}
                            >
                              {link.label}
                            </Link>
                          )}
                        </div>
                        <span style={{ fontSize: '0.82rem', color: '#666666', fontWeight: 300, lineHeight: 1.4 }}>
                          {link.description}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Embedded interactive stylesheet triggers */}
      <style jsx global>{`
        .sitemap-card:hover {
          background-color: rgba(255, 255, 255, 0.04) !important;
          border-color: rgba(255, 255, 255, 0.12) !important;
          transform: translateY(-4px);
        }
      `}</style>
    </main>
  );
}

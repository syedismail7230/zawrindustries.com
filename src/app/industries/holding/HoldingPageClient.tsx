'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import ScrollTextReveal from '@/components/ScrollTextReveal';

interface StackedStepItem {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

const STACKED_SECTORS: StackedStepItem[] = [
  {
    number: '01',
    title: 'Commercial Flagship Retail',
    subtitle: 'Luxury Concourse & Multi-Brand Boutiques',
    description: 'Engineering turnkey physical store rollouts for international fashion, luxury accessories, electronics, and lifestyle brands in prime commercial retail concourses.',
    image: '/assets/holding/holding-flagship.jpg',
  },
  {
    number: '02',
    title: 'Hospitality & Dining Franchises',
    subtitle: 'Artisanal Coffee Lounges, Bakeries & QSR Networks',
    description: 'Deploying and operating multi-unit culinary concepts, specialty café lounges, and quick-service restaurant networks with standardized culinary SOPs and automated ordering.',
    image: '/assets/holding/holding-hospitality.jpg',
  },
  {
    number: '03',
    title: 'Centralized Operations Command',
    subtitle: 'Multi-Store Telemetry & Enterprise POS Command',
    description: 'Real-time multi-brand command center monitoring store footfall, live POS transactional flows, shift scheduling, inventory replenishment, and security telemetry.',
    image: '/assets/holding/holding-operations.jpg',
  },
  {
    number: '04',
    title: 'Franchise Supply Chain & Fulfillment',
    subtitle: 'Just-in-Time Micro-Fulfillment & Bulk Supply',
    description: 'Operating integrated warehousing and automated fulfillment centers that service multi-brand stores with just-in-time inventory and bulk purchasing volume leverage.',
    image: '/assets/holding/holding-logistics.jpg',
  },
];

const FRANCHISE_FOLDERS = [
  {
    id: 'luxury-retail',
    name: '/LuxuryRetail',
    subtitle: 'High-Concourse Boutiques & Flagship Stores',
    body: 'Turnkey architectural fit-outs, visual merchandising compliance, and high-touch VIP customer service protocols for international luxury and premium lifestyle brands.',
    achievements: [
      'Turnkey Rollout: Stores launched from site handover in 45–60 days.',
      'Concourse Prime Sites: Located in Tier-1 high-footfall luxury hubs.',
      'Brand Fidelity: 100% adherence to global architectural millwork guidelines.'
    ],
    metrics: [
      { val: '45–60 D', label: 'Store Rollout' },
      { val: 'Tier-1', label: 'Concourse Sites' },
      { val: '100%', label: 'Brand Audit' },
      { val: 'ISO 9001', label: 'Certified SOP' }
    ],
    tech: ['VelocityOS', 'RFID Tracking', 'Footfall Heatmaps', 'Firm AI', 'SAP ERP']
  },
  {
    id: 'specialty-dining',
    name: '/SpecialtyDining',
    subtitle: 'Artisanal Coffee, Bakeries & QSR Chains',
    body: 'Multi-unit culinary franchise management featuring standardized ingredient prep, digital self-order kiosks, and centralized cold-chain replenishment.',
    achievements: [
      'Zero-Waste Kitchen SOPs: Automated ingredient portioning and shelf-life tracking.',
      'Digital Ordering: Contactless self-serve kiosks integrated with kitchen display systems.',
      'Supply Integrity: Centralized temperature-controlled daily batch deliveries.'
    ],
    metrics: [
      { val: '< 90s', label: 'Order Dispatch' },
      { val: '100%', label: 'FSSAI / Health' },
      { val: '30%+', label: 'COGS Margin' },
      { val: '99.4%', label: 'Order Precision' }
    ],
    tech: ['VelocityOS POS', 'Kitchen Display KDS', 'Cold-Chain IoT', 'Cloud Kitchen ERP']
  },
  {
    id: 'operations-hub',
    name: '/OperationsHub',
    subtitle: 'Centralized Multi-Unit Telemetry Command',
    body: 'Command center synchronizing live transactional data, automated cash reconciliation, fraud prevention, and workforce scheduling across all active store locations.',
    achievements: [
      'Live Telemetry: Real-time transactional telemetry aggregated across all brands.',
      'Automated Audit: Continuous automated cash and inventory reconciliation.',
      'Predictive Roster: AI-assisted workforce scheduling matched to footfall peaks.'
    ],
    metrics: [
      { val: '0s Delay', label: 'POS Telemetry' },
      { val: '100%', label: 'Cash Reconciled' },
      { val: '24/7', label: 'Store Monitoring' },
      { val: '98.5%', label: 'Staff Efficiency' }
    ],
    tech: ['VelocityOS', 'InfluxDB', 'Kafka', 'PostgreSQL', 'Firm AI', 'Grafana']
  },
  {
    id: 'micro-logistics',
    name: '/MicroLogistics',
    subtitle: 'Automated Franchise Supply & Hub Delivery',
    body: 'Automated urban micro-fulfillment centers operating temperature-controlled dry and cold storage to deliver just-in-time replenishment directly to store network shelves.',
    achievements: [
      'JIT Fulfillment: Same-day inventory restock triggers preventing out-of-stock events.',
      'Bulk Purchasing: Consolidated master purchase orders cutting wholesale procurement cost.',
      'Batch Tracking: End-to-end QR code lot tracing for food and consumer safety.'
    ],
    metrics: [
      { val: '99.8%', label: 'Stock Accuracy' },
      { val: '< 4 Hrs', label: 'Store Delivery' },
      { val: '30%', label: 'Bulk Discount' },
      { val: 'Zero', label: 'Stockout Rate' }
    ],
    tech: ['Automated WMS', 'Fleet Telematics', 'IoT Sensors', 'Barcode / QR API']
  },
  {
    id: 'urban-franchises',
    name: '/UrbanFranchises',
    subtitle: 'High-Street Commercial Multi-Unit Networks',
    body: 'Master franchise operations across prime high-street commercial corridors with shared municipal licensing, local marketing power, and cross-brand customer loyalty.',
    achievements: [
      'Multi-Brand Loyalty: Cross-brand promotional network driving repeat foot traffic.',
      'Fast Licensing: Accelerated municipal and fire safety approvals via shared legal desk.',
      'Performance Scale: Rapid cluster expansion across key city shopping districts.'
    ],
    metrics: [
      { val: 'Multi-City', label: 'Territory Rights' },
      { val: '40%+', label: 'Repeat Footfall' },
      { val: '100%', label: 'Legal Clear' },
      { val: 'Shared', label: 'Admin Synergy' }
    ],
    tech: ['VelocityOS', 'CRM Loyalty', 'Geo-Targeting Ads', 'Regulatory Desk']
  },
  {
    id: 'transit-hubs',
    name: '/TransitHubs',
    subtitle: 'Airport & Terminal Concourse Franchise Stores',
    body: 'High-velocity retail and express dining outlets engineered for international airport departures, transit stations, and duty-free passenger concourses.',
    achievements: [
      'High-Throughput Checkout: Sub-30-second checkout designed for passenger flight schedules.',
      'Airport Security Compliance: Airside security clearance and certified workforce.',
      '24/7 Continuous Trading: Uninterrupted operations aligned with international flight banks.'
    ],
    metrics: [
      { val: '< 30s', label: 'Checkout Speed' },
      { val: '24/7/365', label: 'Uptime Trading' },
      { val: 'Airside', label: 'Security Pass' },
      { val: '100%', label: 'Passenger Flow' }
    ],
    tech: ['High-Speed POS', 'Duty-Free Sync', 'Passenger Telemetry', 'VelocityOS']
  }
];

const OPERATING_PILLARS = [
  {
    phase: '01 / DEPLOY',
    title: 'Turnkey Store Rollout',
    desc: 'From prime high-footfall real estate acquisition and lease negotiation to strict architectural brand guidelines execution, we take stores from zero to opening in 45–60 days.',
    highlights: ['Prime Concourse Site Selection', 'Architectural Fit-Out & Millwork', 'Vendor & Regulatory Licensing', 'Grand Opening Marketing Campaigns']
  },
  {
    phase: '02 / MANAGE',
    title: 'Centralized Governance',
    desc: 'Shared administrative infrastructure eliminating redundant back-office overhead. We handle enterprise accounting, legal compliance, standardized training, and master vendor bulk contracts.',
    highlights: ['Shared Corporate & Legal Services', 'Centralized Bulk Purchasing', 'ISO 9001 Standard Operating Procedures', 'Franchise Transparency Reporting']
  },
  {
    phase: '03 / RUN',
    title: 'High-Fidelity Daily Operations',
    desc: 'Managing unit-level store performance with military precision. Live cash reconciliation, staff attendance, customer satisfaction metrics, and instant restock triggers.',
    highlights: ['Multi-Unit Store Leadership', 'Real-Time POS & Revenue Auditing', 'Quality Control & Mystery Shopper Audits', 'Predictive Workforce Shift Planning']
  },
  {
    phase: '04 / SCALE',
    title: 'Territorial Expansion',
    desc: 'Replicating proven unit economics across major metropolitan centers, airports, and commercial lifestyle hubs with shared logistics and localized marketing power.',
    highlights: ['Multi-City Master Franchise Scaling', 'Cross-Brand Concourse Synergies', 'Omnichannel & Local Delivery Integration', 'Institutional Capital Allocation']
  }
];

const COMPARISON_ROWS = [
  {
    criteria: 'Store Setup & Turnkey Launch',
    traditional: '6–9 months of delayed vendor negotiations and fit-out disputes',
    zawr: '45–60 days rapid turnkey rollout with in-house architectural teams',
  },
  {
    criteria: 'Supply Chain & Procurement',
    traditional: 'Fragmented local buying with minimal volume discounts',
    zawr: 'Centralized bulk procurement cutting inventory COGS by up to 30%',
  },
  {
    criteria: 'Point-of-Sale & Operations Tech',
    traditional: 'Disparate off-the-shelf POS software with manual spreadsheet auditing',
    zawr: 'Unified VelocityOS telemetry with live automated revenue and inventory audits',
  },
  {
    criteria: 'Workforce Onboarding & Retention',
    traditional: 'High frontline churn with inconsistent store customer service',
    zawr: 'Continuous certified training academy with structured career ladders',
  },
  {
    criteria: 'Expansion & Capital Scalability',
    traditional: 'Limited individual borrowing capacity slowing multi-unit growth',
    zawr: 'Institutional holding capital & shared corporate service scalability',
  },
];

const FAQ_ITEMS = [
  {
    q: 'How does Zawr Holding partner with franchise brands?',
    a: 'We operate flexible institutional models including Master Franchise Agreements, Area Development Partnerships, Joint-Venture Operating Models, and Direct Turnkey Management. We provide the capital, commercial real estate, operational workforce, and tech infrastructure while upholding strict brand guidelines.',
  },
  {
    q: 'What business verticals does Zawr Holding operate in?',
    a: 'Our multi-brand holding portfolio spans luxury commercial retail, specialty coffee and artisanal culinary concepts, quick-service dining (QSR), convenience hubs, and integrated micro-fulfillment logistics centers.',
  },
  {
    q: 'How does Zawr maintain brand standards across multiple franchise locations?',
    a: 'Every brand operated under Zawr Holding is managed via strict Standard Operating Procedures (SOPs), real-time VelocityOS POS telemetry, secret-shopper quality audits, and centralized staff certification at our in-house training academy.',
  },
  {
    q: 'Can global brands or property developers partner with Zawr Holding?',
    a: 'Yes. We welcome conversations with international brand owners seeking rapid territory expansion, as well as institutional real estate developers seeking anchor multi-brand franchise operators for prime commercial concourses.',
  },
];

export default function HoldingPageClient() {
  // Pinned Process Animation State
  const spacerRef = useRef<HTMLDivElement>(null);
  const [pinState, setPinState] = useState<'before' | 'pinned' | 'after'>('before');
  const [progress, setProgress] = useState(0);

  // Folder Modal State
  const [selectedFolder, setSelectedFolder] = useState<typeof FRANCHISE_FOLDERS[0] | null>(null);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const spacer = spacerRef.current;
      if (!spacer) return;

      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      const top = spacer.offsetTop;
      const height = spacer.offsetHeight;

      const pinStart = top;
      const pinEnd = top + height - vh;

      if (scrollY <= pinStart) {
        setPinState('before');
        setProgress(0);
      } else if (scrollY >= pinEnd) {
        setPinState('after');
        setProgress(1);
      } else {
        setPinState('pinned');
        setProgress((scrollY - pinStart) / (pinEnd - pinStart));
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const numTransitions = STACKED_SECTORS.length - 1;
  const sliceSize = 1 / numTransitions;

  const handleFolderClick = (folder: typeof FRANCHISE_FOLDERS[0]) => {
    setSelectedFolder(folder);
    setIsFolderModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsFolderModalOpen(false);
    setTimeout(() => {
      setSelectedFolder(null);
    }, 400);
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        color: '#111111',
        minHeight: '100vh',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflowX: 'clip',
      }}
    >
      {/* ─────────────────────────────────────────────────────────────
          1. HERO BANNER (Full-Bleed Cinematic Hero matching ITServices/Estate)
      ───────────────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          backgroundImage: 'url("/assets/holding-hero.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-start',
          padding: '0 clamp(1rem, 6vw, 8%) 8vh clamp(1rem, 6vw, 8%)',
          boxSizing: 'border-box',
        }}
      >
        {/* Sleek bottom dark vignette overlay for legibility */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.15) 100%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '840px' }}>
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
              fontWeight: 300,
              color: '#ffffff',
              margin: 0,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              textShadow: '0 4px 20px rgba(0,0,0,0.6)',
            }}
          >
            Holding
          </h1>
          <p
            style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
              color: 'rgba(255,255,255,0.85)',
              marginTop: '1.5rem',
              lineHeight: 1.6,
              maxWidth: '640px',
              fontWeight: 300,
              textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            }}
          >
            Deploying, managing, and operating high-growth franchises and multi-unit businesses across world-class global brands.
          </p>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. SCROLL-DRIVEN WORD REVEAL STATEMENT
      ───────────────────────────────────────────────────────────── */}
      <ScrollTextReveal
        text="We deploy, manage, and scale high-growth franchises and multi-unit businesses across leading global brands. By combining prime real estate, centralized supply chains, and real-time operations telemetry, Zawr Holding transforms multi-brand expansion into an institutional standard."
      />

      {/* ─────────────────────────────────────────────────────────────
          3. ARCHITECTURAL GRID BADGES (Core Institutional Metrics)
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: '0 1.5rem clamp(3rem, 6vh, 5rem)',
          backgroundColor: '#ffffff',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1.5rem',
            maxWidth: '1020px',
            width: '100%',
          }}
        >
          {[
            { metric: '45–60 Days', label: 'Turnkey Store Launch' },
            { metric: '30%+ COGS', label: 'Bulk Volume Savings' },
            { metric: 'VelocityOS', label: 'Live POS Telemetry' },
            { metric: 'ISO 9001', label: 'Certified Store SOPs' },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '130px',
                backgroundImage: `
                  linear-gradient(to right, rgba(0, 0, 0, 0.07) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(0, 0, 0, 0.07) 1px, transparent 1px)
                `,
                backgroundSize: '24px 24px',
                backgroundPosition: 'center center',
                textAlign: 'center',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
              }}
            >
              <div
                style={{
                  fontSize: 'clamp(1.2rem, 2vw, 1.45rem)',
                  fontWeight: 600,
                  color: '#000000',
                  marginBottom: '0.2rem',
                  letterSpacing: '-0.02em',
                  backgroundColor: '#ffffff',
                  padding: '0 0.5rem',
                }}
              >
                {item.metric}
              </div>
              <div
                style={{
                  fontSize: '0.8rem',
                  color: '#64748b',
                  fontWeight: 400,
                  backgroundColor: '#ffffff',
                  padding: '0 0.5rem',
                }}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. STACKED CARD DECK ANIMATION (Our Process Signature Style)
      ───────────────────────────────────────────────────────────── */}
      <section
        ref={spacerRef}
        style={{
          position: 'relative',
          height: `${(STACKED_SECTORS.length - 1) * 110 + 40}vh`,
          backgroundColor: '#ffffff',
          borderTop: '1px solid #f1f5f9',
          borderBottom: '1px solid #f1f5f9',
        }}
      >
        <div
          style={
            pinState === 'pinned'
              ? { position: 'fixed', top: 0, left: 0, right: 0, height: '100vh', zIndex: 10, backgroundColor: '#ffffff' }
              : pinState === 'after'
              ? { position: 'absolute', bottom: 0, left: 0, right: 0, height: '100vh', zIndex: 1, backgroundColor: '#ffffff' }
              : { position: 'absolute', top: 0, left: 0, right: 0, height: '100vh', zIndex: 1, backgroundColor: '#ffffff' }
          }
        >
          {/* Section Header */}
          <div style={{ position: 'absolute', top: 'clamp(2.5rem, 5vh, 4rem)', left: 0, right: 0, textAlign: 'center', zIndex: 10 }}>
            <h2
              style={{
                fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)',
                fontWeight: 400,
                color: '#0f172a',
                letterSpacing: '-0.03em',
                margin: 0,
              }}
            >
              Franchise Portfolio
            </h2>
          </div>

          {/* Stacked Full-Image Cards Stage */}
          <div
            style={{
              position: 'absolute',
              top: '54%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              maxWidth: '1020px',
              height: 'clamp(380px, 58vh, 580px)',
            }}
          >
            {STACKED_SECTORS.map((item, index) => {
              let translateY = 0;
              let opacity = 1;

              if (index === 0) {
                translateY = 0;
                opacity = 1;
              } else {
                const cardStart = (index - 1) * sliceSize;
                const cardEnd = index * sliceSize;

                if (progress <= cardStart) {
                  translateY = 100;
                  opacity = 0;
                } else if (progress >= cardEnd) {
                  translateY = 0;
                  opacity = 1;
                } else {
                  const cardProgress = (progress - cardStart) / sliceSize;
                  translateY = (1 - cardProgress) * 100;
                  opacity = cardProgress > 0.02 ? 1 : 0;
                }
              }

              // Calculate stacking effects from cards landed above
              let effectiveCardsOnTop = 0;
              for (let k = index + 1; k < STACKED_SECTORS.length; k++) {
                const kStart = (k - 1) * sliceSize;
                const kEnd = k * sliceSize;
                if (progress >= kEnd) {
                  effectiveCardsOnTop += 1;
                } else if (progress > kStart) {
                  effectiveCardsOnTop += (progress - kStart) / sliceSize;
                }
              }

              const scale = Math.max(0.88, 1 - effectiveCardsOnTop * 0.034);
              const stackShift = -effectiveCardsOnTop * 14;

              return (
                <div
                  key={item.number}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '28px',
                    overflow: 'hidden',
                    backgroundColor: '#111111',
                    zIndex: index + 1,
                    opacity,
                    transform: `translateY(calc(${translateY}% + ${stackShift}px)) scale(${scale})`,
                    transformOrigin: 'center bottom',
                    willChange: 'transform, opacity',
                    transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease',
                    boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  {/* Full Card Image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />

                  {/* Bottom Gradient & Text Overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0) 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      padding: 'clamp(2rem, 4vw, 3.5rem)',
                      boxSizing: 'border-box',
                    }}
                  >
                    <h3
                      style={{
                        fontSize: 'clamp(1.8rem, 3.5vw, 3.2rem)',
                        fontWeight: 400,
                        color: '#ffffff',
                        letterSpacing: '-0.02em',
                        margin: 0,
                        marginBottom: '0.35rem',
                      }}
                    >
                      {item.title}
                    </h3>

                    <p
                      style={{
                        fontSize: 'clamp(1rem, 1.5vw, 1.35rem)',
                        fontWeight: 400,
                        fontStyle: 'italic',
                        color: 'rgba(255, 255, 255, 0.9)',
                        margin: 0,
                      }}
                    >
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. INTERACTIVE FRANCHISE FOLDERS (IT Services signature style)
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: 'clamp(5rem, 9vh, 8rem) 1.5rem',
          backgroundColor: '#000000',
          color: '#ffffff',
          position: 'relative',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2
            style={{
              fontSize: 'clamp(2rem, 4.5vw, 3rem)',
              fontWeight: 300,
              color: '#ffffff',
              marginBottom: '4rem',
              letterSpacing: '-0.02em',
              opacity: 0.9,
            }}
          >
            Operating Verticals
          </h2>

          <style
            dangerouslySetInnerHTML={{
              __html: `
              .holding-folders-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 4rem 2rem;
                max-width: 960px;
                margin: 0 auto;
              }
              @media (max-width: 768px) {
                .holding-folders-grid {
                  grid-template-columns: repeat(2, 1fr);
                  gap: 3rem 1.5rem;
                }
              }
              @media (max-width: 480px) {
                .holding-folders-grid {
                  grid-template-columns: 1fr;
                  gap: 3rem;
                }
              }
              .holding-folder-card {
                display: flex;
                flex-direction: column;
                align-items: center;
                cursor: pointer;
              }
              .folder-img-container {
                position: relative;
                width: 180px;
                height: 180px;
                margin-bottom: 1.5rem;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .folder-img {
                width: 100%;
                height: 100%;
                object-fit: contain;
                transition: opacity 0.2s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
              }
              .folder-img.open-img {
                position: absolute;
                top: 0;
                left: 0;
                opacity: 0;
              }
              .holding-folder-card:hover .folder-img.closed-img {
                opacity: 0;
              }
              .holding-folder-card:hover .folder-img.open-img {
                opacity: 1;
                transform: scale(1.05);
              }
              .holding-folder-name {
                font-size: 1.1rem;
                font-weight: 400;
                color: rgba(255, 255, 255, 0.85);
                letter-spacing: -0.01em;
                transition: color 0.2s ease;
              }
              .holding-folder-card:hover .holding-folder-name {
                color: #ffffff;
              }

              .mac-modal-overlay {
                position: fixed;
                inset: 0;
                background-color: rgba(0, 0, 0, 0.75);
                backdrop-filter: blur(10px);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1.5rem;
                box-sizing: border-box;
              }
              .mac-modal-window {
                width: 100%;
                max-width: 750px;
                max-height: 560px;
                background: rgba(12, 16, 26, 0.95);
                border: 1px solid rgba(255, 255, 255, 0.15);
                box-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.9);
                border-radius: 16px;
                overflow: hidden;
                color: #ffffff;
                display: flex;
                flex-direction: column;
                animation: popIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              }
              @keyframes popIn {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
              }
              .mac-titlebar {
                height: 42px;
                background: rgba(255, 255, 255, 0.05);
                border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                display: flex;
                align-items: center;
                padding: 0 16px;
                position: relative;
                flex-shrink: 0;
              }
              .mac-lights {
                display: flex;
                gap: 8px;
              }
              .mac-light {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                display: inline-block;
              }
              .mac-light.close { background-color: #ff5f56; cursor: pointer; }
              .mac-light.minimize { background-color: #ffbd2e; }
              .mac-light.maximize { background-color: #27c93f; }
              .mac-title {
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                font-size: 0.85rem;
                font-weight: 500;
                color: rgba(255, 255, 255, 0.6);
              }
              .mac-content {
                padding: 2.2rem;
                flex-grow: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                overflow-y: auto;
              }
              @media (max-width: 768px) {
                .mac-content {
                  padding: 1.25rem;
                }
              }
            `,
            }}
          />

          <div className="holding-folders-grid">
            {FRANCHISE_FOLDERS.map((folder) => (
              <div
                key={folder.id}
                className="holding-folder-card"
                onClick={() => handleFolderClick(folder)}
              >
                <div className="folder-img-container">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_1200,c_limit/v1783710489/zawr/assets/folder.png"
                    alt="Closed Folder"
                    className="folder-img closed-img"
                    loading="lazy"
                    decoding="async"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_1200,c_limit/v1783710488/zawr/assets/folder-open.png"
                    alt="Open Folder"
                    className="folder-img open-img"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="holding-folder-name">{folder.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Window Popup */}
        {isFolderModalOpen && selectedFolder && (
          <div className="mac-modal-overlay" onClick={handleCloseModal}>
            <div className="mac-modal-window" onClick={(e) => e.stopPropagation()}>
              <div className="mac-titlebar">
                <div className="mac-lights">
                  <span className="mac-light close" onClick={handleCloseModal} />
                  <span className="mac-light minimize" />
                  <span className="mac-light maximize" />
                </div>
                <span className="mac-title">{selectedFolder.name} — Zawr Holding</span>
              </div>

              <div className="mac-content">
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#ffffff', margin: '0 0 0.5rem 0' }}>
                    {selectedFolder.subtitle}
                  </h3>
                  <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, margin: '0 0 1.5rem 0' }}>
                    {selectedFolder.body}
                  </p>

                  {/* Highlights */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                      Operational Deliverables
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {selectedFolder.achievements.map((ach, i) => (
                        <li key={i} style={{ fontSize: '0.85rem', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#f59e0b', flexShrink: 0 }} />
                          <span>{ach}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Metrics Grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '0.75rem',
                      padding: '1rem',
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      marginBottom: '1.5rem',
                    }}
                  >
                    {selectedFolder.metrics.map((m, i) => (
                      <div key={i} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>{m.val}</div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>{m.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Tech Stack Pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {selectedFolder.tech.map((t, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '0.75rem',
                          padding: '3px 10px',
                          borderRadius: '100px',
                          backgroundColor: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          color: '#cbd5e1',
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <Link
                    href="/contact/partner"
                    onClick={handleCloseModal}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: '#ffffff',
                      color: '#000000',
                      padding: '8px 20px',
                      borderRadius: '100px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    <span>Partner on this Sector</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. THE OPERATING BLUEPRINT: DEPLOY · MANAGE · RUN · SCALE
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: 'clamp(5rem, 9vh, 8rem) 1.5rem',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto clamp(3rem, 6vh, 4.5rem)' }}>
            <h2
              style={{
                fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
                fontWeight: 400,
                letterSpacing: '-0.03em',
                color: '#0f172a',
                margin: '0 0 1rem 0',
              }}
            >
              The Operating Blueprint
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
              An institutional end-to-end framework removing operational friction, safeguarding brand integrity, and accelerating multi-unit expansion.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {OPERATING_PILLARS.map((p, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: '20px',
                  padding: '2rem',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.06)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    color: '#f59e0b',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    marginBottom: '0.75rem',
                  }}
                >
                  {p.phase}
                </div>

                <h3 style={{ fontSize: '1.3rem', fontWeight: 600, color: '#0f172a', margin: '0 0 0.85rem 0' }}>
                  {p.title}
                </h3>

                <p style={{ fontSize: '0.92rem', color: '#64748b', lineHeight: 1.6, margin: '0 0 1.5rem 0', flexGrow: 1 }}>
                  {p.desc}
                </p>

                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    {p.highlights.map((hl, i) => (
                      <li key={i} style={{ fontSize: '0.82rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#0f172a', flexShrink: 0 }} />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. VALUE COMPARISON MATRIX (Standalone vs Zawr Holding)
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: 'clamp(4.5rem, 9vh, 7rem) 1.5rem',
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto clamp(2.5rem, 5vh, 4rem)' }}>
            <h2
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 400,
                letterSpacing: '-0.03em',
                color: '#0f172a',
                margin: '0 0 1rem 0',
              }}
            >
              Why Brands Partner With Zawr Holding
            </h2>
            <p style={{ fontSize: '1.02rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
              The operational advantage of scaling franchises with an institutional multi-brand engine.
            </p>
          </div>

          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 4px 25px rgba(0, 0, 0, 0.04)',
            }}
          >
            {/* Table Header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(180px, 1.2fr) minmax(220px, 1.8fr) minmax(220px, 2fr)',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                padding: '1.25rem 1.5rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              <div>Operational Dimension</div>
              <div style={{ color: '#94a3b8' }}>Standalone Franchisee</div>
              <div style={{ color: '#f59e0b' }}>Zawr Holding Platform</div>
            </div>

            {/* Table Rows */}
            {COMPARISON_ROWS.map((row, rIdx) => (
              <div
                key={rIdx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(180px, 1.2fr) minmax(220px, 1.8fr) minmax(220px, 2fr)',
                  padding: '1.25rem 1.5rem',
                  borderTop: '1px solid #f1f5f9',
                  backgroundColor: rIdx % 2 === 0 ? '#ffffff' : '#fafafa',
                  fontSize: '0.9rem',
                  lineHeight: 1.55,
                  alignItems: 'center',
                }}
              >
                <div style={{ fontWeight: 600, color: '#0f172a' }}>{row.criteria}</div>
                <div style={{ color: '#64748b', paddingRight: '1rem' }}>{row.traditional}</div>
                <div style={{ color: '#0f172a', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span>
                  <span>{row.zawr}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. FULL-WIDTH EDGE-TO-EDGE BANNER SECTION (Estate signature style)
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          width: '100%',
          backgroundColor: '#ffffff',
          padding: '0',
          overflow: 'hidden',
        }}
      >
        <div style={{ width: '100%', maxWidth: '100%', position: 'relative', overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/holding/holding-hospitality.jpg"
            alt="Zawr Holding - Scaling Global Brands Across Commercial Corridors"
            style={{
              width: '100%',
              height: 'auto',
              minHeight: '380px',
              maxHeight: '85vh',
              objectFit: 'cover',
              display: 'block',
            }}
          />

          {/* Soft Dark Gradient Scrim overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '60%',
              background: 'linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.35) 60%, rgba(0, 0, 0, 0) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Bottom Left Text Overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: 'clamp(1.5rem, 5vw, 4rem)',
              left: 'clamp(1.25rem, 4vw, 4vw)',
              right: '1.25rem',
              maxWidth: '680px',
              color: '#ffffff',
              zIndex: 10,
            }}
          >
            <h3
              style={{
                fontSize: 'clamp(1.4rem, 4vw, 2.75rem)',
                fontWeight: 300,
                letterSpacing: '-0.025em',
                lineHeight: 1.2,
                margin: 0,
                color: '#ffffff',
              }}
            >
              Empowering World-Class Brands to Scale Across Leading Corridors
            </h3>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. FREQUENTLY ASKED QUESTIONS
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: 'clamp(4.5rem, 9vh, 7rem) 1.5rem',
          backgroundColor: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 5vh, 3.5rem)' }}>
            <h2
              style={{
                fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                fontWeight: 400,
                letterSpacing: '-0.03em',
                color: '#0f172a',
                margin: 0,
              }}
            >
              Frequently Asked Questions
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {FAQ_ITEMS.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '1.35rem 1.5rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '1.05rem',
                      fontWeight: 500,
                      color: '#0f172a',
                    }}
                  >
                    <span>{faq.q}</span>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.25s ease',
                        color: '#64748b',
                        flexShrink: 0,
                        marginLeft: '1rem',
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {isOpen && (
                    <div
                      style={{
                        padding: '0 1.5rem 1.35rem',
                        fontSize: '0.95rem',
                        lineHeight: 1.65,
                        color: '#475569',
                        borderTop: '1px solid #f1f5f9',
                        paddingTop: '1rem',
                      }}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          10. HIGH-IMPACT BOTTOM CTA BANNER (Footer Signature)
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          backgroundColor: '#000000',
          color: '#ffffff',
          padding: 'clamp(5rem, 10vh, 8rem) 1.5rem',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              fontWeight: 300,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              margin: '0 0 1.25rem 0',
              color: '#ffffff',
            }}
          >
            Ready to Deploy or Expand Your Brand Franchise?
          </h2>
          <p
            style={{
              fontSize: 'clamp(1rem, 1.6vw, 1.2rem)',
              color: 'rgba(255,255,255,0.75)',
              lineHeight: 1.6,
              maxWidth: '640px',
              margin: '0 auto 2.5rem',
              fontWeight: 300,
            }}
          >
            Partner with Zawr Holding Company for institutional capital, turnkey commercial fit-outs, centralized supply chains, and master multi-unit territory expansion.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', alignItems: 'center' }}>
            <Link
              href="/contact/partner"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 32px',
                backgroundColor: '#ffffff',
                color: '#000000',
                borderRadius: '100px',
                fontSize: '0.95rem',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>Explore Partnership</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </Link>

            <Link
              href="/contact/client-relations"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 28px',
                backgroundColor: 'transparent',
                color: '#ffffff',
                borderRadius: '100px',
                fontSize: '0.95rem',
                fontWeight: 400,
                textDecoration: 'none',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <span>Client Relations</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

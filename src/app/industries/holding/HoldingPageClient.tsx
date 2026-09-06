'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import ScrollTextReveal from '@/components/ScrollTextReveal';

interface OperatingVertical {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  body: string;
  achievements: string[];
  metrics: { val: string; label: string }[];
  tech: string[];
}

const OPERATING_VERTICALS: OperatingVertical[] = [
  {
    id: 'luxury-retail',
    title: 'Commercial Retail',
    slug: '/LuxuryRetail',
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
    title: 'Hospitality & Dining',
    slug: '/SpecialtyDining',
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
    title: 'Operations Command',
    slug: '/OperationsHub',
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
    title: 'Franchise Logistics',
    slug: '/MicroLogistics',
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
    title: 'Urban Networks',
    slug: '/UrbanFranchises',
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
    title: 'Transit Hubs',
    slug: '/TransitHubs',
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

export interface BlueprintShelfItem {
  id: string;
  bayIndex: number; // 0: DEPLOY, 1: MANAGE, 2: RUN, 3: SCALE
  shelfIndex: number; // 0 to 3
  bayTitle: string;
  bayPhase: string;
  shelfTitle: string;
  sopCode: string;
  timelineOrSla: string;
  books: string[];
  summary: string;
  deliverables: string[];
  // Bounding box percentages on holding-bp.png (1536x1024)
  x: number;
  y: number;
  w: number;
  h: number;
}

const BLUEPRINT_BAYS = [
  { phase: '01 / DEPLOY', title: 'Turnkey Store Rollout', subtitle: '45–60 Day Rapid Commissioning' },
  { phase: '02 / MANAGE', title: 'Centralized Governance', subtitle: 'Shared Enterprise Infrastructure' },
  { phase: '03 / RUN', title: 'High-Fidelity Daily Operations', subtitle: 'Real-Time Telemetry & SLAs' },
  { phase: '04 / SCALE', title: 'Territorial Expansion', subtitle: 'Multi-City Franchise Replication' }
];

const BLUEPRINT_SHELVES: BlueprintShelfItem[] = [
  // ──────────────────────────── BAY 0: 01 / DEPLOY ────────────────────────────
  {
    id: 'deploy-s1',
    bayIndex: 0,
    shelfIndex: 0,
    bayPhase: '01 / DEPLOY',
    bayTitle: 'Turnkey Store Rollout',
    shelfTitle: 'Site Selection & Real Estate Acquisition',
    sopCode: 'SOP-DEP-01',
    timelineOrSla: 'Days 1–15',
    books: ['Real Estate Acquisition', 'Site Selection', 'Lease Negotiation', 'Architectural Fit-Out'],
    summary: 'High-density commercial demographic analysis, pedestrian footfall modeling (>15k daily traffic), master landlord negotiations, and structural MEP feasibility checks.',
    deliverables: [
      'Footfall density & demographic heat-map validation',
      'Exclusive territory & non-compete lease covenants',
      'Architectural structural load, HVAC & power audits'
    ],
    x: 14.6,
    y: 33.8,
    w: 15.6,
    h: 12.4
  },
  {
    id: 'deploy-s2',
    bayIndex: 0,
    shelfIndex: 1,
    bayPhase: '01 / DEPLOY',
    bayTitle: 'Turnkey Store Rollout',
    shelfTitle: 'Construction Management & Millwork',
    sopCode: 'SOP-DEP-02',
    timelineOrSla: 'Days 15–38',
    books: ['Construction Management', 'Millwork & Fixtures', 'Brand Design Compliance'],
    summary: 'Prefabricated modular store fixtures, high-spec bespoke architectural millwork, and strict brand identity compliance under turnkey master contracts.',
    deliverables: [
      'Class-A storefront facade & illuminated signage installation',
      'UL/CE-certified electrical, plumbing & HVAC engineering',
      'Custom millwork fabrication with luxury stone & wood finishes'
    ],
    x: 14.6,
    y: 48.3,
    w: 15.6,
    h: 12.4
  },
  {
    id: 'deploy-s3',
    bayIndex: 0,
    shelfIndex: 2,
    bayPhase: '01 / DEPLOY',
    bayTitle: 'Turnkey Store Rollout',
    shelfTitle: 'Licensing, Brand Guidelines & Launch Marketing',
    sopCode: 'SOP-DEP-03',
    timelineOrSla: 'Days 30–48',
    books: ['Vendor Management', 'Regulatory Licensing', 'Brand Guidelines', 'Marketing Campaigns', 'Grand Opening'],
    summary: 'Expedited commercial health and fire safety clearance, food/retail municipal trade permits, and hyper-local geo-targeted PR launch blitzes.',
    deliverables: [
      'Civil defense, health & municipal trade license approvals',
      'Omnichannel influencer & social PR grand launch campaigns',
      'Franchise global brand audit certification checklist'
    ],
    x: 14.6,
    y: 62.6,
    w: 15.6,
    h: 12.4
  },
  {
    id: 'deploy-s4',
    bayIndex: 0,
    shelfIndex: 3,
    bayPhase: '01 / DEPLOY',
    bayTitle: 'Turnkey Store Rollout',
    shelfTitle: 'Store Commissioning & Pilot Handover',
    sopCode: 'SOP-DEP-04',
    timelineOrSla: 'Days 45–60 (Live)',
    books: ['From Vision to Opening', 'Store Commissioning', 'POS Live Cutover', 'Handover Protocols'],
    summary: 'Final punch-list sign-off, full inventory dry-run restock, POS gateway live cutover, and seamless operational handover to the daily management squad.',
    deliverables: [
      'Zero-defect architectural sign-off checklist',
      'Live payment gateway, POS & register stress testing',
      'Formal operational handover to unit General Manager'
    ],
    x: 14.6,
    y: 76.8,
    w: 15.6,
    h: 12.6
  },

  // ──────────────────────────── BAY 1: 02 / MANAGE ────────────────────────────
  {
    id: 'manage-s1',
    bayIndex: 1,
    shelfIndex: 0,
    bayPhase: '02 / MANAGE',
    bayTitle: 'Centralized Governance',
    shelfTitle: 'Corporate Governance & Legal Master Contracts',
    sopCode: 'SOP-MNG-01',
    timelineOrSla: 'Continuous SLA',
    books: ['Corporate Governance', 'Legal Compliance', 'Enterprise Accounting', 'Vendor Contracts'],
    summary: 'Unified holding legal frameworks, master franchise agreement safeguards, centralized enterprise GAAP bookkeeping, and automated tax compliance.',
    deliverables: [
      'Centralized multi-entity corporate & tax filings',
      'Master brand trademark and licensing compliance audits',
      'Standardized master vendor agreements (Net 60 terms)'
    ],
    x: 32.9,
    y: 33.8,
    w: 15.6,
    h: 12.4
  },
  {
    id: 'manage-s2',
    bayIndex: 1,
    shelfIndex: 1,
    bayPhase: '02 / MANAGE',
    bayTitle: 'Centralized Governance',
    shelfTitle: 'Centralized Purchasing & ISO 9001 Standards',
    sopCode: 'SOP-MNG-02',
    timelineOrSla: 'Volume Tier-1',
    books: ['Bulk Purchasing', 'Supplier Management', 'Cost Optimization', 'ISO 9001 Standards'],
    summary: 'Aggregated holding purchasing power securing Tier-1 factory-direct pricing on packaging, ingredients, consumables, and uniform inventory.',
    deliverables: [
      '20% to 30% reduction in unit COGS via centralized buying',
      'ISO 9001 certified quality control supplier verification',
      'Automated purchase order dispatch on safety stock triggers'
    ],
    x: 32.9,
    y: 48.3,
    w: 15.6,
    h: 12.4
  },
  {
    id: 'manage-s3',
    bayIndex: 1,
    shelfIndex: 2,
    bayPhase: '02 / MANAGE',
    bayTitle: 'Centralized Governance',
    shelfTitle: 'Training Academy & Franchise Transparency',
    sopCode: 'SOP-MNG-03',
    timelineOrSla: 'Weekly Audited',
    books: ['Training Development', 'Franchise Transparency', 'Reporting & Analytics'],
    summary: 'In-house certified employee training programs, secret guest scorecards, and live stakeholder financial reporting dashboards.',
    deliverables: [
      'Mandatory 40-hour brand certification for store staff',
      'Real-time investor reporting portal with EBITDA tracking',
      'Zero-tolerance cleanliness & hospitality scorecards'
    ],
    x: 32.9,
    y: 62.6,
    w: 15.6,
    h: 12.4
  },
  {
    id: 'manage-s4',
    bayIndex: 1,
    shelfIndex: 3,
    bayPhase: '02 / MANAGE',
    bayTitle: 'Centralized Governance',
    shelfTitle: 'Financial Controls & Standard Operating Procedures',
    sopCode: 'SOP-MNG-04',
    timelineOrSla: '100% Audit Ready',
    books: ['Financial Controls', 'Risk Management', 'Standard Operating Procedures (SOPs)', 'Vault Controls'],
    summary: 'Strict segregation of duties, automated daily bank reconciliation, comprehensive multi-risk commercial insurance, and disaster recovery plans.',
    deliverables: [
      'Daily automated bank vs POS cash audit matching',
      'Comprehensive third-party liability & property insurance',
      'Rigid internal audit routines conducted every 14 days'
    ],
    x: 32.9,
    y: 76.8,
    w: 15.6,
    h: 12.6
  },

  // ──────────────────────────── BAY 2: 03 / RUN ────────────────────────────
  {
    id: 'run-s1',
    bayIndex: 2,
    shelfIndex: 0,
    bayPhase: '03 / RUN',
    bayTitle: 'High-Fidelity Daily Operations',
    shelfTitle: 'Store Operations & Real-Time POS Telemetry',
    sopCode: 'SOP-RUN-01',
    timelineOrSla: 'Sub-Second Sync',
    books: ['Store Operations', 'POS Systems', 'Inventory Management', 'Staff Attendance'],
    summary: 'Enterprise cloud point-of-sale infrastructure syncing every SKU transaction, shift clock-in, and inventory burn-rate directly to holding telemetry.',
    deliverables: [
      'Sub-second register transaction sync with cloud telemetry',
      'Biometric employee clock-in with geo-fencing checks',
      'Real-time SKU-level inventory depletion calculations'
    ],
    x: 51.2,
    y: 33.8,
    w: 15.6,
    h: 12.4
  },
  {
    id: 'run-s2',
    bayIndex: 2,
    shelfIndex: 1,
    bayPhase: '03 / RUN',
    bayTitle: 'High-Fidelity Daily Operations',
    shelfTitle: 'Store Leadership & Mystery Shopper Audits',
    sopCode: 'SOP-RUN-02',
    timelineOrSla: '98.6% Target Score',
    books: ['Store Leadership', 'Performance Metrics', 'Quality Control', 'Mystery Shopper Audits'],
    summary: 'On-the-ground store general managers driven by quantitative SLAs, bi-weekly unannounced mystery shopper audits, and customer NPS telemetry.',
    deliverables: [
      'Bi-weekly third-party mystery customer scoring audits',
      'Live customer review aggregation & instant complaint escalation',
      'Shift leader performance incentive bonus structures'
    ],
    x: 51.2,
    y: 48.3,
    w: 15.6,
    h: 12.4
  },
  {
    id: 'run-s3',
    bayIndex: 2,
    shelfIndex: 2,
    bayPhase: '03 / RUN',
    bayTitle: 'High-Fidelity Daily Operations',
    shelfTitle: 'Cash Reconciliation & Restock Triggers',
    sopCode: 'SOP-RUN-03',
    timelineOrSla: '< 0.01% Variance',
    books: ['Cash Reconciliation', 'Revenue Auditing', 'Restock Triggers', 'Workforce Planning'],
    summary: 'Automated end-of-day register closure, armored vault pickup dispatch, dynamic automated vendor restock orders, and algorithmic shift scheduling.',
    deliverables: [
      'Zero-variance nightly digital drawer reconciliation',
      'Predictive demand-based workforce shift scheduling',
      'Automated replenishment dispatch before stockouts'
    ],
    x: 51.2,
    y: 62.6,
    w: 15.6,
    h: 12.4
  },
  {
    id: 'run-s4',
    bayIndex: 2,
    shelfIndex: 3,
    bayPhase: '03 / RUN',
    bayTitle: 'High-Fidelity Daily Operations',
    shelfTitle: 'Data Analytics & Loss Prevention Audits',
    sopCode: 'SOP-RUN-04',
    timelineOrSla: 'Operations Excellence',
    books: ['Data Analytics', 'Predictive Planning', 'Loss Prevention', 'Store Audits', 'Operations Excellence'],
    summary: 'Advanced POS fraud anomaly detection, smart sensor shrinkage monitoring, yield loss reduction, and executive store performance leaderboards.',
    deliverables: [
      'Algorithmic anomaly detection for voids and discounts',
      'Shrinkage & waste minimized to below 0.4% of turnover',
      'Automated weekly unit profitability scorecards'
    ],
    x: 51.2,
    y: 76.8,
    w: 15.6,
    h: 12.6
  },

  // ──────────────────────────── BAY 3: 04 / SCALE ────────────────────────────
  {
    id: 'scale-s1',
    bayIndex: 3,
    shelfIndex: 0,
    bayPhase: '04 / SCALE',
    bayTitle: 'Territorial Expansion',
    shelfTitle: 'Territorial Planning & Concourse Targeting',
    sopCode: 'SOP-SCL-01',
    timelineOrSla: 'Multi-City Scope',
    books: ['Market Research', 'Territorial Planning', 'Metropolitan Centers', 'Commercial Lifestyle Hubs'],
    summary: 'Macro demographic modeling, master commercial developer relationships, airport concourse bids, and territorial density optimization.',
    deliverables: [
      'Pipeline of verified high-conversion retail locations',
      'Master developer pre-lease agreements across shopping districts',
      'Airport authority RFP submission blueprints'
    ],
    x: 69.5,
    y: 33.8,
    w: 15.6,
    h: 12.4
  },
  {
    id: 'scale-s2',
    bayIndex: 3,
    shelfIndex: 1,
    bayPhase: '04 / SCALE',
    bayTitle: 'Territorial Expansion',
    shelfTitle: 'Cross-Brand Synergies & Omnichannel Logistics',
    sopCode: 'SOP-SCL-02',
    timelineOrSla: '+40% Unit Margin',
    books: ['Franchise Scaling', 'Cross-Brand Synergies', 'Omnichannel Integration', 'Local Delivery Logistics'],
    summary: 'Leveraging adjacent store locations for shared micro-warehousing, pooled delivery driver dispatch, cross-brand loyalty rewards, and joint promotions.',
    deliverables: [
      'Shared localized fulfillment hubs reducing last-mile delivery costs',
      'Unified customer loyalty program driving multi-brand cross-selling',
      'Shared district supervisory management reducing overhead'
    ],
    x: 69.5,
    y: 48.3,
    w: 15.6,
    h: 12.4
  },
  {
    id: 'scale-s3',
    bayIndex: 3,
    shelfIndex: 2,
    bayPhase: '04 / SCALE',
    bayTitle: 'Territorial Expansion',
    shelfTitle: 'Institutional Capital & Master Franchising',
    sopCode: 'SOP-SCL-03',
    timelineOrSla: 'Institutional Tier',
    books: ['Market Entry Strategy', 'Institutional Capital', 'Partnerships', 'International Expansion'],
    summary: 'Master territory rights acquisition, institutional equity syndication, sovereign wealth / private equity partnerships, and international brand franchising.',
    deliverables: [
      'Institutional capitalization models for 10+ store rollouts',
      'Master franchise territorial exclusivity agreements',
      'Structured risk-weighted joint venture equity vehicles'
    ],
    x: 69.5,
    y: 62.6,
    w: 15.6,
    h: 12.4
  },
  {
    id: 'scale-s4',
    bayIndex: 3,
    shelfIndex: 3,
    bayPhase: '04 / SCALE',
    bayTitle: 'Territorial Expansion',
    shelfTitle: 'Global Expansion Playbook & Master Blueprints',
    sopCode: 'SOP-SCL-04',
    timelineOrSla: 'Global Reach',
    books: ['Growth Strategy', 'New Markets', 'Global Retail', 'Master Blueprints'],
    summary: 'Codified expansion playbooks enabling rapid market entry in new metropolitan regions in under 60 days with proven unit economics.',
    deliverables: [
      'Comprehensive turnkey market entry documentation',
      'Localized supply chain vendor pre-qualification matrices',
      'Global brand standard assurance and long-term asset value'
    ],
    x: 69.5,
    y: 76.8,
    w: 15.6,
    h: 12.6
  }
];

const PARTNER_BENEFITS = [
  {
    id: 'turnkey',
    title: 'Rapid Turnkey Deployment',
    summary: 'Accelerated 45–60 day store opening cycles supported by in-house architectural teams, master contractor networks, and permit clearance.',
    metric: '45–60 Days',
    metricLabel: 'From Lease to Grand Opening',
  },
  {
    id: 'procurement',
    title: 'Centralized Tier-1 Purchasing',
    summary: 'Aggregated volume contracts delivering 20% to 30% reduction in packaging, raw ingredients, and operating equipment unit COGS.',
    metric: '20%–30%',
    metricLabel: 'Unit COGS Reduction',
  },
  {
    id: 'telemetry',
    title: 'Real-Time Cloud POS Telemetry',
    summary: 'Cloud-native point-of-sale telemetry with sub-second digital cash auditing, automated replenishment triggers, and live EBITDA scorecards.',
    metric: '99.98%',
    metricLabel: 'Cash & Inventory Audit Accuracy',
  },
  {
    id: 'workforce',
    title: 'Certified Workforce Academy',
    summary: 'Standardized employee onboarding with mandatory 40-hour brand certification, mystery shopper quality audits, and clear career ladders.',
    metric: '40 Hours',
    metricLabel: 'Mandatory Staff Certification',
  },
  {
    id: 'capital',
    title: 'Institutional Capital & Scale',
    summary: 'Private equity-backed growth syndication combined with centralized corporate legal, HR management, tax auditing, and territorial governance.',
    metric: '10+ Locations',
    metricLabel: 'Concurrent Expansion Capacity',
  },
];

const FAQ_OPEN_IMAGES = [
  '/assets/h-faq1.png',
  '/assets/h-faq2.png',
  '/assets/h-faq3.png',
  '/assets/h-faq4.png',
];

const FAQ_ITEMS = [
  {
    volume: 'Volume I',
    tag: 'Partnership Models',
    q: 'How does Zawr Holding partner with franchise brands?',
    a: 'We operate flexible institutional models including Master Franchise Agreements, Area Development Partnerships, Joint-Venture Operating Models, and Direct Turnkey Management. We provide the capital, commercial real estate, operational workforce, and tech infrastructure while upholding strict brand guidelines.',
  },
  {
    volume: 'Volume II',
    tag: 'Operating Verticals',
    q: 'What business verticals does Zawr Holding operate in?',
    a: 'Our multi-brand holding portfolio spans luxury commercial retail, specialty coffee and artisanal culinary concepts, quick-service dining (QSR), convenience hubs, and integrated micro-fulfillment logistics centers.',
  },
  {
    volume: 'Volume III',
    tag: 'Standards & SOPs',
    q: 'How does Zawr maintain brand standards across multiple franchise locations?',
    a: 'Every brand operated under Zawr Holding is managed via strict Standard Operating Procedures (SOPs), real-time cloud POS telemetry, secret-shopper quality audits, and centralized staff certification at our in-house training academy.',
  },
  {
    volume: 'Volume IV',
    tag: 'Global Expansion',
    q: 'Can global brands or property developers partner with Zawr Holding?',
    a: 'Yes. We welcome conversations with international brand owners seeking rapid territory expansion, as well as institutional real estate developers seeking anchor multi-brand franchise operators for prime commercial concourses.',
  },
];

export default function HoldingPageClient() {
  // Folder Modal State
  const [selectedVertical, setSelectedVertical] = useState<OperatingVertical | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number>(0);
  const [hoveredBook, setHoveredBook] = useState<number | null>(null);
  const [activeBenefit, setActiveBenefit] = useState<number>(2);

  // 3D Barrel Roll Infinite Loop & Wheel Listener
  const barrelRef = useRef<HTMLDivElement>(null);
  const lastScrollTime = useRef<number>(0);
  const [isBarrelHovered, setIsBarrelHovered] = useState(false);

  // Auto-rotation loop
  useEffect(() => {
    if (isBarrelHovered) return;
    const timer = setInterval(() => {
      setActiveBenefit((prev) => (prev + 1) % PARTNER_BENEFITS.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [isBarrelHovered]);

  // Non-passive wheel event listener for smooth infinite scrolling
  useEffect(() => {
    const el = barrelRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const now = Date.now();
      if (now - lastScrollTime.current < 150) return;

      if (Math.abs(e.deltaY) > 6) {
        lastScrollTime.current = now;
        if (e.deltaY > 0) {
          // Roll Down -> Next
          setActiveBenefit((prev) => (prev + 1) % PARTNER_BENEFITS.length);
        } else {
          // Roll Up -> Previous (Infinite Loop)
          setActiveBenefit((prev) => (prev - 1 + PARTNER_BENEFITS.length) % PARTNER_BENEFITS.length);
        }
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Operating Blueprint Dual-Wing & Mobile State
  const [leftShelfId, setLeftShelfId] = useState<string>('deploy-s1');
  const [rightShelfId, setRightShelfId] = useState<string>('run-s1');
  const [mobileShelfId, setMobileShelfId] = useState<string>('deploy-s1');
  const [activeMobileBay, setActiveMobileBay] = useState<number>(0);
  const [hoveredShelfId, setHoveredShelfId] = useState<string | null>(null);
  const [activeLeftBay, setActiveLeftBay] = useState<number>(0);
  const [activeRightBay, setActiveRightBay] = useState<number>(2);

  // Derive active items
  const activeLeftShelf =
    BLUEPRINT_SHELVES.find((s) => s.id === (hoveredShelfId && (BLUEPRINT_SHELVES.find((x) => x.id === hoveredShelfId)?.bayIndex === 0 || BLUEPRINT_SHELVES.find((x) => x.id === hoveredShelfId)?.bayIndex === 1) ? hoveredShelfId : leftShelfId)) ||
    BLUEPRINT_SHELVES[0];

  const activeRightShelf =
    BLUEPRINT_SHELVES.find((s) => s.id === (hoveredShelfId && (BLUEPRINT_SHELVES.find((x) => x.id === hoveredShelfId)?.bayIndex === 2 || BLUEPRINT_SHELVES.find((x) => x.id === hoveredShelfId)?.bayIndex === 3) ? hoveredShelfId : rightShelfId)) ||
    BLUEPRINT_SHELVES[8];

  const activeMobileShelf =
    BLUEPRINT_SHELVES.find((s) => s.id === mobileShelfId) ||
    BLUEPRINT_SHELVES[0];

  // Touch Swipe Handlers for Section 5 (Why Brands Partner)
  const touchStartY = useRef<number>(0);
  const touchStartX = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].clientX;
    const diffY = touchStartY.current - touchEndY;
    const diffX = touchStartX.current - touchEndX;

    if (Math.abs(diffY) > 25 || Math.abs(diffX) > 25) {
      if (Math.abs(diffY) >= Math.abs(diffX)) {
        if (diffY > 0) {
          setActiveBenefit((prev) => (prev + 1) % PARTNER_BENEFITS.length);
        } else {
          setActiveBenefit((prev) => (prev - 1 + PARTNER_BENEFITS.length) % PARTNER_BENEFITS.length);
        }
      } else {
        if (diffX > 0) {
          setActiveBenefit((prev) => (prev + 1) % PARTNER_BENEFITS.length);
        } else {
          setActiveBenefit((prev) => (prev - 1 + PARTNER_BENEFITS.length) % PARTNER_BENEFITS.length);
        }
      }
    }
  };

  const handleVerticalClick = (vertical: OperatingVertical) => {
    setSelectedVertical(vertical);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedVertical(null);
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
          minHeight: '560px',
          backgroundImage: 'url("/assets/holding-hero.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-start',
          padding: '0 clamp(1.25rem, 6vw, 8%) clamp(3rem, 8vh, 6rem) clamp(1.25rem, 6vw, 8%)',
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
              fontSize: 'clamp(2.5rem, 6.5vw, 5.5rem)',
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
              marginTop: '1.25rem',
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
          3. OPERATING VERTICALS (Pillars Grid matching screenshot)
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: 'clamp(4rem, 8vh, 8rem) clamp(1rem, 4vw, 2rem)',
          backgroundColor: '#ffffff',
          color: '#0f172a',
          position: 'relative',
          borderTop: '1px solid #f1f5f9',
          borderBottom: '1px solid #f1f5f9',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <h2
            style={{
              fontSize: 'clamp(2rem, 4.5vw, 3.6rem)',
              fontWeight: 400,
              color: '#0f172a',
              marginBottom: '0.85rem',
              letterSpacing: '-0.03em',
            }}
          >
            Operating Verticals
          </h2>
          <p
            style={{
              fontSize: 'clamp(0.95rem, 1.5vw, 1.15rem)',
              color: '#64748b',
              maxWidth: '640px',
              margin: '0 auto clamp(2.5rem, 6vh, 5rem)',
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            Six core institutional pillars powering multi-brand deployment, centralized telemetry, and franchise expansion.
          </p>

          <style
            dangerouslySetInnerHTML={{
              __html: `
              .holding-pillars-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                column-gap: clamp(1.5rem, 4vw, 4.5rem);
                row-gap: clamp(2.5rem, 6vh, 5.5rem);
                max-width: 1040px;
                margin: 0 auto;
              }
              @media (max-width: 860px) {
                .holding-pillars-grid {
                  grid-template-columns: repeat(2, 1fr);
                  column-gap: 1.5rem;
                  row-gap: 3rem;
                }
              }
              @media (max-width: 520px) {
                .holding-pillars-grid {
                  grid-template-columns: repeat(2, 1fr);
                  column-gap: 1rem;
                  row-gap: 2.25rem;
                }
              }
              .holding-pillar-card {
                display: flex;
                flex-direction: column;
                align-items: center;
                cursor: pointer;
                outline: none;
                background: none;
                border: none;
                padding: 0;
              }
              .pillar-img-container {
                position: relative;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .pillar-img {
                width: 100%;
                max-width: 180px;
                height: clamp(200px, 30vh, 360px);
                object-fit: contain;
                transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s ease;
                filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.05));
              }
              @media (max-width: 520px) {
                .pillar-img {
                  max-width: 135px;
                  height: 180px;
                }
              }
              .holding-pillar-card:hover .pillar-img {
                transform: translateY(-8px) scale(1.02);
                filter: drop-shadow(0 20px 35px rgba(0, 0, 0, 0.12));
              }
              .pillar-title {
                font-size: clamp(1rem, 1.8vw, 1.35rem);
                font-weight: 500;
                color: #0f172a;
                margin-top: 1.25rem;
                letter-spacing: -0.02em;
                transition: color 0.2s ease;
              }
              @media (max-width: 520px) {
                .pillar-title {
                  margin-top: 0.75rem;
                  font-size: 0.95rem;
                }
              }
              .holding-pillar-card:hover .pillar-title {
                color: #000000;
              }
              .pillar-slug {
                font-size: 0.84rem;
                color: '#64748b';
                margin-top: 0.25rem;
                font-weight: 400;
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
                padding: clamp(1rem, 3vw, 1.5rem);
                box-sizing: border-box;
              }
              .mac-modal-window {
                width: 100%;
                max-width: min(750px, 94vw);
                max-height: 88vh;
                background: rgba(12, 16, 26, 0.96);
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
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 60%;
              }
              .mac-content {
                padding: clamp(1.25rem, 3vw, 2.2rem);
                flex-grow: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                overflow-y: auto;
              }
            `,
            }}
          />

          <div className="holding-pillars-grid">
            {OPERATING_VERTICALS.map((vertical) => (
              <div
                key={vertical.id}
                className="holding-pillar-card"
                onClick={() => handleVerticalClick(vertical)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleVerticalClick(vertical);
                  }
                }}
              >
                <div className="pillar-img-container">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/holding-pillar.png"
                    alt={vertical.title}
                    className="pillar-img"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="pillar-title">{vertical.title}</div>
                <div className="pillar-slug" style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '0.25rem', fontWeight: 400 }}>{vertical.slug}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Window Popup */}
        {isModalOpen && selectedVertical && (
          <div className="mac-modal-overlay" onClick={handleCloseModal}>
            <div className="mac-modal-window" onClick={(e) => e.stopPropagation()}>
              <div className="mac-titlebar">
                <div className="mac-lights">
                  <span className="mac-light close" onClick={handleCloseModal} />
                  <span className="mac-light minimize" />
                  <span className="mac-light maximize" />
                </div>
                <span className="mac-title">{selectedVertical.slug} — Zawr Holding</span>
              </div>

              <div className="mac-content">
                <div>
                  <h3 style={{ fontSize: 'clamp(1.15rem, 3vw, 1.4rem)', fontWeight: 600, color: '#ffffff', margin: '0 0 0.5rem 0' }}>
                    {selectedVertical.subtitle}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, margin: '0 0 1.5rem 0' }}>
                    {selectedVertical.body}
                  </p>

                  {/* Highlights */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                      Operational Deliverables
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {selectedVertical.achievements.map((ach, i) => (
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
                      gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                      gap: '0.65rem',
                      padding: '0.85rem',
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      marginBottom: '1.25rem',
                    }}
                  >
                    {selectedVertical.metrics.map((m, i) => (
                      <div key={i} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>{m.val}</div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>{m.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Tech Stack Pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {selectedVertical.tech.map((t, i) => (
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
          4. THE OPERATING BLUEPRINT: DEPLOY · MANAGE · RUN · SCALE
             Minimalist Editorial Layout with Direct Bookcase (Desktop + Mobile)
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: 'clamp(3.5rem, 7vh, 6.5rem) clamp(1rem, 3.5vw, 3rem)',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #f1f5f9',
          position: 'relative',
        }}
      >
        <div style={{ maxWidth: '1680px', margin: '0 auto' }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto clamp(2rem, 4vh, 3.5rem)' }}>
            <h2
              style={{
                fontSize: 'clamp(2rem, 4.2vw, 3.4rem)',
                fontWeight: 400,
                letterSpacing: '-0.03em',
                color: '#0f172a',
                margin: '0 0 0.85rem 0',
              }}
            >
              The Operating Blueprint
            </h2>
            <p style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.05rem)', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
              An institutional end-to-end framework removing operational friction, safeguarding brand integrity, and accelerating multi-unit expansion.
            </p>
          </div>

          <style
            dangerouslySetInnerHTML={{
              __html: `
              /* Desktop 3-Column Triptych */
              .blueprint-desktop-grid {
                display: grid;
                grid-template-columns: minmax(280px, 340px) minmax(500px, 1fr) minmax(280px, 340px);
                gap: clamp(1.5rem, 3vw, 3.5rem);
                align-items: center;
                max-width: 1600px;
                margin: 0 auto;
              }
              .blueprint-mobile-container {
                display: none;
              }
              @media (max-width: 1024px) {
                .blueprint-desktop-grid {
                  display: none;
                }
                .blueprint-mobile-container {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  gap: 1.75rem;
                  max-width: 640px;
                  margin: 0 auto;
                }
              }

              .blueprint-minimal-side {
                display: flex;
                flex-direction: column;
                justify-content: center;
                transition: opacity 0.3s ease;
              }

              .bookcase-direct-canvas {
                position: relative;
                width: 100%;
                max-width: 880px;
                margin: 0 auto;
              }
              .bookcase-direct-img {
                width: 100%;
                height: auto;
                display: block;
                user-select: none;
              }

              .shelf-minimal-hotspot {
                position: absolute;
                cursor: pointer;
                transition: all 0.25s ease;
                border: none;
                outline: none;
                background: transparent;
                box-sizing: border-box;
                z-index: 20;
              }
              .shelf-minimal-hotspot:hover, .shelf-minimal-hotspot.active {
                background: radial-gradient(ellipse at center, rgba(245, 158, 11, 0.16) 0%, rgba(245, 158, 11, 0.03) 60%, transparent 80%);
                border: none;
                outline: none;
              }

              .blueprint-mobile-card {
                width: 100%;
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 14px;
                padding: clamp(1.25rem, 4vw, 1.75rem);
                box-sizing: border-box;
                text-align: left;
                transition: all 0.3s ease;
              }

              .blueprint-bay-tab-btn {
                padding: 8px 14px;
                border-radius: 100px;
                font-size: 0.8rem;
                font-weight: 500;
                letter-spacing: 0.04em;
                cursor: pointer;
                border: 1px solid #e2e8f0;
                background: #ffffff;
                color: #64748b;
                transition: all 0.25s ease;
                white-space: nowrap;
              }
              .blueprint-bay-tab-btn.active {
                background: #0f172a;
                color: #ffffff;
                border-color: #0f172a;
                box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
              }
            `,
            }}
          />

          {/* ───────────────── DESKTOP 3-COLUMN TRIPTYCH (min-width: 1025px) ───────────────── */}
          <div className="blueprint-desktop-grid">
            {/* LEFT MINIMALIST PANEL (Bays 01 & 02) */}
            <div className="blueprint-minimal-side">
              <div
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  color: '#f59e0b',
                  textTransform: 'uppercase',
                  marginBottom: '0.6rem',
                }}
              >
                {activeLeftShelf.bayPhase}
              </div>

              <h3
                style={{
                  fontSize: 'clamp(1.4rem, 2vw, 1.85rem)',
                  fontWeight: 400,
                  color: '#0f172a',
                  margin: '0 0 1rem 0',
                  lineHeight: 1.25,
                  letterSpacing: '-0.02em',
                }}
              >
                {activeLeftShelf.shelfTitle}
              </h3>

              <p
                style={{
                  fontSize: '0.94rem',
                  color: '#64748b',
                  lineHeight: 1.7,
                  margin: '0 0 1.5rem 0',
                }}
              >
                {activeLeftShelf.summary}
              </p>

              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                }}
              >
                {activeLeftShelf.deliverables.map((deliv, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: '0.86rem',
                      color: '#475569',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      lineHeight: 1.5,
                    }}
                  >
                    <span
                      style={{
                        color: '#f59e0b',
                        fontSize: '0.9rem',
                        lineHeight: '1.2rem',
                        flexShrink: 0,
                      }}
                    >
                      •
                    </span>
                    <span>{deliv}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CENTER BOOKCASE IMAGE */}
            <div className="bookcase-direct-canvas">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/holding-bp.png"
                alt="Zawr Holding Operating Blueprint Classical Library"
                className="bookcase-direct-img"
                loading="lazy"
                decoding="async"
              />

              {/* 16 Interactive Hotspots */}
              {BLUEPRINT_SHELVES.map((item) => {
                const isHovered = hoveredShelfId === item.id;
                const isLeftSelected = activeLeftShelf.id === item.id;
                const isRightSelected = activeRightShelf.id === item.id;
                const isActive = isHovered || isLeftSelected || isRightSelected;

                return (
                  <div
                    key={item.id}
                    className={`shelf-minimal-hotspot ${isActive ? 'active' : ''}`}
                    style={{
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                      width: `${item.w}%`,
                      height: `${item.h}%`,
                    }}
                    onMouseEnter={() => {
                      setHoveredShelfId(item.id);
                      if (item.bayIndex === 0 || item.bayIndex === 1) {
                        setLeftShelfId(item.id);
                        setActiveLeftBay(item.bayIndex);
                      } else {
                        setRightShelfId(item.id);
                        setActiveRightBay(item.bayIndex);
                      }
                      setMobileShelfId(item.id);
                      setActiveMobileBay(item.bayIndex);
                    }}
                    onMouseLeave={() => setHoveredShelfId(null)}
                    onClick={() => {
                      if (item.bayIndex === 0 || item.bayIndex === 1) {
                        setLeftShelfId(item.id);
                        setActiveLeftBay(item.bayIndex);
                      } else {
                        setRightShelfId(item.id);
                        setActiveRightBay(item.bayIndex);
                      }
                      setMobileShelfId(item.id);
                      setActiveMobileBay(item.bayIndex);
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`${item.bayPhase}: ${item.shelfTitle}`}
                    title={`${item.bayPhase}: ${item.shelfTitle}`}
                  />
                );
              })}
            </div>

            {/* RIGHT MINIMALIST PANEL (Bays 03 & 04) */}
            <div className="blueprint-minimal-side">
              <div
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  color: '#f59e0b',
                  textTransform: 'uppercase',
                  marginBottom: '0.6rem',
                }}
              >
                {activeRightShelf.bayPhase}
              </div>

              <h3
                style={{
                  fontSize: 'clamp(1.4rem, 2vw, 1.85rem)',
                  fontWeight: 400,
                  color: '#0f172a',
                  margin: '0 0 1rem 0',
                  lineHeight: 1.25,
                  letterSpacing: '-0.02em',
                }}
              >
                {activeRightShelf.shelfTitle}
              </h3>

              <p
                style={{
                  fontSize: '0.94rem',
                  color: '#64748b',
                  lineHeight: 1.7,
                  margin: '0 0 1.5rem 0',
                }}
              >
                {activeRightShelf.summary}
              </p>

              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                }}
              >
                {activeRightShelf.deliverables.map((deliv, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: '0.86rem',
                      color: '#475569',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      lineHeight: 1.5,
                    }}
                  >
                    <span
                      style={{
                        color: '#f59e0b',
                        fontSize: '0.9rem',
                        lineHeight: '1.2rem',
                        flexShrink: 0,
                      }}
                    >
                      •
                    </span>
                    <span>{deliv}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ───────────────── MOBILE UNIFIED BLUEPRINT EXPLORER (max-width: 1024px) ───────────────── */}
          <div className="blueprint-mobile-container">
            {/* Bay Selector Pill Tabs */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              {BLUEPRINT_BAYS.map((bay, idx) => {
                const isActive = activeMobileBay === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    className={`blueprint-bay-tab-btn ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setActiveMobileBay(idx);
                      const defaultShelfForBay = BLUEPRINT_SHELVES.find((s) => s.bayIndex === idx);
                      if (defaultShelfForBay) setMobileShelfId(defaultShelfForBay.id);
                    }}
                  >
                    {bay.phase}
                  </button>
                );
              })}
            </div>

            {/* Interactive Bookcase Canvas */}
            <div className="bookcase-direct-canvas">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/holding-bp.png"
                alt="Zawr Holding Operating Blueprint Classical Library"
                className="bookcase-direct-img"
                loading="lazy"
                decoding="async"
              />

              {/* 16 Interactive Hotspots */}
              {BLUEPRINT_SHELVES.map((item) => {
                const isActive = activeMobileShelf.id === item.id;
                return (
                  <div
                    key={item.id}
                    className={`shelf-minimal-hotspot ${isActive ? 'active' : ''}`}
                    style={{
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                      width: `${item.w}%`,
                      height: `${item.h}%`,
                    }}
                    onClick={() => {
                      setMobileShelfId(item.id);
                      setActiveMobileBay(item.bayIndex);
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`${item.bayPhase}: ${item.shelfTitle}`}
                  />
                );
              })}
            </div>

            {/* Active Shelf Details Card */}
            <div className="blueprint-mobile-card">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem',
                }}
              >
                <span
                  style={{
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: '#f59e0b',
                    textTransform: 'uppercase',
                  }}
                >
                  {activeMobileShelf.bayPhase}
                </span>
                <span
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: 500,
                    color: '#64748b',
                    backgroundColor: '#ffffff',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  {activeMobileShelf.timelineOrSla}
                </span>
              </div>

              <h3
                style={{
                  fontSize: 'clamp(1.15rem, 4vw, 1.45rem)',
                  fontWeight: 500,
                  color: '#0f172a',
                  margin: '0 0 0.65rem 0',
                  lineHeight: 1.3,
                }}
              >
                {activeMobileShelf.shelfTitle}
              </h3>

              <p
                style={{
                  fontSize: '0.9rem',
                  color: '#64748b',
                  lineHeight: 1.6,
                  margin: '0 0 1rem 0',
                }}
              >
                {activeMobileShelf.summary}
              </p>

              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                {activeMobileShelf.deliverables.map((deliv, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: '0.84rem',
                      color: '#475569',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      lineHeight: 1.45,
                    }}
                  >
                    <span style={{ color: '#f59e0b', fontSize: '0.85rem', lineHeight: '1.2rem', flexShrink: 0 }}>•</span>
                    <span>{deliv}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. WHY BRANDS PARTNER WITH ZAWR HOLDING (Classical Triptych)
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: 'clamp(4rem, 7vh, 7rem) clamp(1rem, 4vw, 4rem)',
          backgroundColor: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid #f1f5f9',
        }}
      >
        <div style={{ maxWidth: '1840px', margin: '0 auto', width: '100%' }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto clamp(2rem, 4vh, 3.5rem)' }}>
            <h2
              style={{
                fontSize: 'clamp(2rem, 4.2vw, 3.4rem)',
                fontWeight: 400,
                letterSpacing: '-0.03em',
                color: '#0f172a',
                margin: '0 0 0.85rem 0',
              }}
            >
              Why Brands Partner With Zawr Holding
            </h2>
            <p style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.05rem)', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
              The operational advantage of scaling franchises with an institutional multi-brand engine.
            </p>
          </div>

          <style
            dangerouslySetInnerHTML={{
              __html: `
              .holding-benefits-triptych {
                display: grid;
                grid-template-columns: minmax(280px, 440px) minmax(520px, 1fr) minmax(280px, 440px);
                gap: clamp(1.5rem, 4vw, 7rem);
                align-items: center;
                justify-content: space-between;
                max-width: 1840px;
                width: 100%;
                margin: 0 auto;
              }
              .statue-col {
                display: flex;
                align-items: flex-start;
                height: clamp(520px, 60vh, 700px);
                overflow: hidden;
                user-select: none;
                position: relative;
                pointer-events: none;
              }
              .statue-col.left-statue {
                justify-content: flex-start;
              }
              .statue-col.right-statue {
                justify-content: flex-end;
              }
              .statue-col-img {
                width: 100%;
                max-width: 460px;
                height: auto;
                display: block;
                object-fit: contain;
                transform: none;
                filter: drop-shadow(0 20px 35px rgba(15, 23, 42, 0.06));
                transition: transform 0.4s ease;
              }
              .barrel-roll-stage {
                perspective: 1400px;
                perspective-origin: 50% 50%;
                transform-style: preserve-3d;
                height: 600px;
                min-height: 600px;
                max-height: 600px;
                width: 100%;
                max-width: 780px;
                margin: 0 auto;
                position: relative;
                overflow: visible;
                user-select: none;
                cursor: grab;
                touch-action: pan-y;
                -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
                mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
              }
              .barrel-roll-stage:active {
                cursor: grabbing;
              }
              .barrel-item {
                position: absolute;
                top: 50%;
                left: 0;
                right: 0;
                margin: 0 auto;
                width: 100%;
                max-width: 720px;
                cursor: pointer;
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
                transform-style: preserve-3d;
                will-change: transform, opacity, filter;
                transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1),
                            opacity 0.55s ease,
                            filter 0.55s ease;
                padding: 0.75rem 1.25rem;
                background: transparent;
                border: none;
                outline: none;
                box-sizing: border-box;
              }
              .barrel-item-title {
                font-size: clamp(1.1rem, 1.6vw, 1.45rem);
                font-weight: 300;
                color: #94a3b8;
                letter-spacing: -0.01em;
                transition: color 0.35s ease, font-size 0.35s ease;
                line-height: 1.3;
                white-space: nowrap;
              }
              .barrel-item:hover .barrel-item-title {
                color: #475569;
              }
              .barrel-item.active .barrel-item-title {
                font-size: clamp(1.8rem, 4.5vw, 3.25rem);
                font-weight: 300;
                color: #0f172a;
                letter-spacing: -0.035em;
                line-height: 1.15;
                white-space: normal;
                max-width: 640px;
              }
              .barrel-item-detail {
                margin-top: 1rem;
                animation: barrelReveal 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                display: flex;
                flex-direction: column;
                align-items: center;
              }
              @keyframes barrelReveal {
                from {
                  opacity: 0;
                  transform: translateY(12px) scale(0.97);
                }
                to {
                  opacity: 1;
                  transform: translateY(0) scale(1);
                }
              }
              .barrel-item-summary {
                font-size: clamp(0.92rem, 1.4vw, 1.05rem);
                color: #64748b;
                line-height: 1.65;
                margin: 0 0 1rem 0;
                max-width: 560px;
                text-align: center;
                font-weight: 300;
              }
              .barrel-item-badge {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                font-size: 0.92rem;
                background: transparent;
                border: none;
                padding: 0;
                margin-top: 0.25rem;
              }
              .barrel-mobile-nav {
                display: none;
              }
              @media (max-width: 1024px) {
                .holding-benefits-triptych {
                  grid-template-columns: 1fr;
                  gap: 1.5rem;
                }
                .statue-col {
                  display: none;
                }
                .barrel-roll-stage {
                  height: clamp(380px, 50vh, 520px);
                  min-height: 380px;
                  max-height: 520px;
                }
                .barrel-item-title {
                  white-space: normal;
                }
                .barrel-mobile-nav {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  gap: 12px;
                  margin-top: 1rem;
                }
                .barrel-nav-btn {
                  display: inline-flex;
                  align-items: center;
                  justify-content: center;
                  width: 36px;
                  height: 36px;
                  border-radius: 50%;
                  background: #f1f5f9;
                  border: 1px solid #e2e8f0;
                  color: #0f172a;
                  cursor: pointer;
                  transition: all 0.2s ease;
                }
                .barrel-nav-btn:hover {
                  background: #0f172a;
                  color: #ffffff;
                }
              }
            `,
            }}
          />

          <div className="holding-benefits-triptych">
            {/* Left Roman Statue */}
            <div className="statue-col left-statue">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/hch-1.png"
                alt="Classical Pillar of Strength — Zawr Holding"
                className="statue-col-img"
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* Center 3D Barrel Roll Benefits List */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                ref={barrelRef}
                className="barrel-roll-stage"
                onMouseEnter={() => setIsBarrelHovered(true)}
                onMouseLeave={() => setIsBarrelHovered(false)}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {PARTNER_BENEFITS.map((benefit, idx) => {
                  const isActive = activeBenefit === idx;
                  const N = PARTNER_BENEFITS.length;
                  let offset = idx - activeBenefit;
                  // Infinite modular wrap to shortest cylindrical path [-2, 2]
                  if (offset > Math.floor(N / 2)) offset -= N;
                  if (offset < -Math.floor(N / 2)) offset += N;

                  // 3D Geometry with complete clutter elimination & generous breathing room
                  let transformStyle = '';
                  let opacityStyle = 0;
                  let blurStyle = 0;
                  let pointerEventsStyle: 'auto' | 'none' = 'none';

                  if (offset === 0) {
                    transformStyle = 'translateY(-50%) rotateX(0deg) translateZ(190px) scale(1)';
                    opacityStyle = 1;
                    blurStyle = 0;
                    pointerEventsStyle = 'auto';
                  } else if (offset === -1) {
                    transformStyle = 'translateY(calc(-50% - 215px)) rotateX(26deg) translateZ(60px) scale(0.85)';
                    opacityStyle = 0.35;
                    blurStyle = 0.3;
                    pointerEventsStyle = 'auto';
                  } else if (offset === 1) {
                    transformStyle = 'translateY(calc(-50% + 215px)) rotateX(-26deg) translateZ(60px) scale(0.85)';
                    opacityStyle = 0.35;
                    blurStyle = 0.3;
                    pointerEventsStyle = 'auto';
                  } else {
                    transformStyle = offset < 0
                      ? 'translateY(calc(-50% - 320px)) rotateX(45deg) translateZ(0px) scale(0.65)'
                      : 'translateY(calc(-50% + 320px)) rotateX(-45deg) translateZ(0px) scale(0.65)';
                    opacityStyle = 0;
                    blurStyle = 2;
                    pointerEventsStyle = 'none';
                  }

                  return (
                    <div
                      key={benefit.id}
                      className={`barrel-item ${isActive ? 'active' : ''}`}
                      style={{
                        transform: transformStyle,
                        opacity: opacityStyle,
                        filter: blurStyle > 0 ? `blur(${blurStyle}px)` : 'none',
                        zIndex: isActive ? 10 : 5 - Math.abs(offset),
                        pointerEvents: pointerEventsStyle,
                        visibility: Math.abs(offset) >= 2 ? 'hidden' : 'visible',
                      }}
                      onMouseEnter={() => setActiveBenefit(idx)}
                      onClick={() => setActiveBenefit(idx)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setActiveBenefit(idx);
                        }
                      }}
                    >
                      <div className="barrel-item-title">{benefit.title}</div>
                      {isActive && (
                        <div className="barrel-item-detail">
                          <p className="barrel-item-summary">{benefit.summary}</p>
                          <div className="barrel-item-badge">
                            <span style={{ fontWeight: 400, color: '#d97706' }}>{benefit.metric}</span>
                            <span style={{ color: '#cbd5e1' }}>•</span>
                            <span style={{ color: '#64748b', fontWeight: 300 }}>{benefit.metricLabel}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Mobile Quick Pagination Controls */}
              <div className="barrel-mobile-nav">
                <button
                  type="button"
                  aria-label="Previous Benefit"
                  className="barrel-nav-btn"
                  onClick={() => setActiveBenefit((prev) => (prev - 1 + PARTNER_BENEFITS.length) % PARTNER_BENEFITS.length)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500 }}>
                  {activeBenefit + 1} / {PARTNER_BENEFITS.length}
                </span>
                <button
                  type="button"
                  aria-label="Next Benefit"
                  className="barrel-nav-btn"
                  onClick={() => setActiveBenefit((prev) => (prev + 1) % PARTNER_BENEFITS.length)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right Classical Muse Statue */}
            <div className="statue-col right-statue">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/hch-2.png"
                alt="Classical Pillar of Wisdom — Zawr Holding"
                className="statue-col-img"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. ARCHITECTURAL PERMANENCE SHOWCASE (hch-4.png)
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          width: '100%',
          backgroundColor: '#ffffff',
          padding: '0',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <div style={{ width: '100%', maxWidth: '100%', position: 'relative', overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/hch-4.png"
            alt="The Architecture of Enduring Enterprise — Zawr Holding"
            style={{
              width: '100%',
              height: 'auto',
              minHeight: 'clamp(380px, 55vh, 680px)',
              maxHeight: '82vh',
              objectFit: 'cover',
              objectPosition: 'center 42%',
              display: 'block',
            }}
          />

          {/* Soft Dark Gradient Scrim overlay for legibility */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0, 0, 0, 0.88) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.08) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Bottom Left Editorial Overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: 'clamp(1.5rem, 4vw, 4.5rem)',
              left: 'clamp(1.25rem, 5vw, 6vw)',
              right: 'clamp(1.25rem, 5vw, 2rem)',
              maxWidth: '780px',
              color: '#ffffff',
              zIndex: 10,
            }}
          >
            <div
              style={{
                fontSize: '0.8rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#f59e0b',
                fontWeight: 500,
                marginBottom: '0.65rem',
              }}
            >
              Institutional Permanence
            </div>
            <h3
              style={{
                fontSize: 'clamp(1.5rem, 4vw, 3.2rem)',
                fontWeight: 300,
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                margin: '0 0 0.85rem 0',
                color: '#ffffff',
                textShadow: '0 2px 12px rgba(0,0,0,0.5)',
              }}
            >
              The Architecture of Enduring Enterprise
            </h3>
            <p
              style={{
                fontSize: 'clamp(0.92rem, 1.4vw, 1.15rem)',
                fontWeight: 300,
                color: 'rgba(255, 255, 255, 0.85)',
                lineHeight: 1.6,
                margin: 0,
                maxWidth: '640px',
                textShadow: '0 1px 8px rgba(0,0,0,0.5)',
              }}
            >
              Combining prime commercial real estate concourses, centralized Tier-1 supply chains, and enterprise telemetry to operate world-class franchise brands at institutional scale.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. FREQUENTLY ASKED QUESTIONS (Interactive Classical Codex)
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: 'clamp(3.5rem, 7vh, 7.5rem) clamp(1rem, 3.5vw, 2rem)',
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          borderBottom: '1px solid #e2e8f0',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '980px', margin: '0 auto', textAlign: 'center' }}>
          {/* Section Header */}
          <h2
            style={{
              fontSize: 'clamp(2rem, 4.2vw, 3.2rem)',
              fontWeight: 400,
              letterSpacing: '-0.03em',
              color: '#0f172a',
              margin: '0 auto clamp(2rem, 4vh, 3.5rem)',
            }}
          >
            Frequently Asked Questions
          </h2>

          <style
            dangerouslySetInnerHTML={{
              __html: `
              .faq-books-stand {
                position: relative;
                width: 100%;
                max-width: clamp(260px, 80vw, 480px);
                margin: 0 auto;
                user-select: none;
                z-index: 1;
              }
              .faq-standing-img {
                width: 100%;
                height: auto;
                display: block;
                filter: drop-shadow(0 15px 25px rgba(15, 23, 42, 0.08));
              }
              .faq-book-spine-btn {
                position: absolute;
                cursor: pointer;
                border-radius: 8px;
                border: none;
                outline: none;
                transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
                background: transparent;
                z-index: 5;
              }
              .faq-book-spine-btn:hover {
                background: rgba(245, 158, 11, 0.16);
                box-shadow: 0 0 25px rgba(245, 158, 11, 0.35);
                transform: translateY(-2px);
              }
              .faq-book-spine-btn.active {
                background: rgba(245, 158, 11, 0.22);
                box-shadow: 0 0 30px rgba(245, 158, 11, 0.45);
              }
              .faq-open-book-wrap {
                position: relative;
                width: 100%;
                max-width: clamp(300px, 94vw, 680px);
                margin: -30px auto 0;
                z-index: 2;
                user-select: none;
                cursor: pointer;
                display: grid;
                grid-template-columns: 1fr;
                grid-template-rows: 1fr;
                align-items: center;
                justify-items: center;
              }
              .faq-open-book-layer {
                grid-column: 1 / -1;
                grid-row: 1 / -1;
                width: 100%;
                height: auto;
                display: block;
                filter: drop-shadow(0 25px 45px rgba(15, 23, 42, 0.12));
                opacity: 0;
                transform: scale(0.985) translateY(6px);
                pointer-events: none;
                transition: opacity 0.5s cubic-bezier(0.25, 1, 0.5, 1),
                            transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
                will-change: opacity, transform;
              }
              .faq-open-book-layer.active {
                opacity: 1;
                transform: scale(1) translateY(0);
                pointer-events: auto;
                z-index: 3;
              }
              @media (max-width: 640px) {
                .faq-books-stand {
                  max-width: 300px;
                }
                .faq-open-book-wrap {
                  margin-top: -18px;
                }
              }
            `,
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Standing Books Shelf (h-faq.png) */}
            <div className="faq-books-stand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/h-faq.png"
                alt="Frequently Asked Questions — Standing Volumes"
                className="faq-standing-img"
                loading="lazy"
                decoding="async"
              />

              {/* Hotspot 1: FAQ 1 */}
              <button
                type="button"
                aria-label="Open FAQ 1"
                className={`faq-book-spine-btn ${activeFaq === 0 ? 'active' : ''}`}
                style={{
                  left: '8.5%',
                  top: '4%',
                  width: '17%',
                  height: '92%',
                }}
                onClick={() => setActiveFaq(0)}
              />

              {/* Hotspot 2: FAQ 2 */}
              <button
                type="button"
                aria-label="Open FAQ 2"
                className={`faq-book-spine-btn ${activeFaq === 1 ? 'active' : ''}`}
                style={{
                  left: '26.5%',
                  top: '6%',
                  width: '17%',
                  height: '90%',
                }}
                onClick={() => setActiveFaq(1)}
              />

              {/* Hotspot 3: FAQ 3 */}
              <button
                type="button"
                aria-label="Open FAQ 3"
                className={`faq-book-spine-btn ${activeFaq === 2 ? 'active' : ''}`}
                style={{
                  left: '45%',
                  top: '11%',
                  width: '25%',
                  height: '86%',
                }}
                onClick={() => setActiveFaq(2)}
              />

              {/* Hotspot 4: FAQ 4 */}
              <button
                type="button"
                aria-label="Open FAQ 4"
                className={`faq-book-spine-btn ${activeFaq === 3 ? 'active' : ''}`}
                style={{
                  left: '71.5%',
                  top: '11%',
                  width: '18.5%',
                  height: '88%',
                }}
                onClick={() => setActiveFaq(3)}
              />
            </div>

            {/* Smooth Layered Open Book Display (h-faq1.png ... h-faq4.png) */}
            <div
              className="faq-open-book-wrap"
              onClick={() => setActiveFaq((prev) => (prev + 1) % 4)}
              title="Click to turn to the next volume"
            >
              {FAQ_OPEN_IMAGES.map((imgSrc, idx) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={idx}
                  src={imgSrc}
                  alt={`Frequently Asked Questions Volume ${idx + 1}`}
                  className={`faq-open-book-layer ${activeFaq === idx ? 'active' : ''}`}
                  draggable={false}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. INSTITUTIONAL PARTNERSHIP CTA (Holding Page Signature)
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          backgroundColor: '#ffffff',
          backgroundImage: 'radial-gradient(ellipse at 50% 120%, rgba(245, 158, 11, 0.07) 0%, rgba(255, 255, 255, 0.98) 65%, #ffffff 100%)',
          color: '#0f172a',
          padding: 'clamp(5rem, 10vh, 8.5rem) clamp(1.25rem, 4vw, 2.5rem)',
          textAlign: 'center',
          borderTop: '1px solid #f1f5f9',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '880px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          {/* Classical Overline Ornament */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '1.25rem',
            }}
          >
            <span style={{ width: '28px', height: '1px', backgroundColor: '#e2e8f0' }} />
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#d97706',
              }}
            >
              Institutional Partnership
            </span>
            <span style={{ width: '28px', height: '1px', backgroundColor: '#e2e8f0' }} />
          </div>

          {/* Main Title */}
          <h2
            style={{
              fontSize: 'clamp(2.2rem, 4.8vw, 3.8rem)',
              fontWeight: 300,
              letterSpacing: '-0.035em',
              lineHeight: 1.15,
              margin: '0 0 1.25rem 0',
              color: '#0f172a',
            }}
          >
            Ready to Deploy or Expand Your Brand Franchise?
          </h2>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 'clamp(1rem, 1.5vw, 1.18rem)',
              color: '#64748b',
              lineHeight: 1.7,
              maxWidth: '680px',
              margin: '0 auto clamp(2.25rem, 5vh, 3.25rem)',
              fontWeight: 300,
            }}
          >
            Partner with Zawr Holding Company for institutional capital, turnkey commercial fit-outs, centralized supply chains, and master multi-unit territory expansion.
          </p>

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '2.5rem',
            }}
          >
            <Link
              href="/contact/partner"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '15px 34px',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                borderRadius: '100px',
                fontSize: '0.95rem',
                fontWeight: 500,
                textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(15, 23, 42, 0.12)',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                flex: '1 1 auto',
                maxWidth: '260px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1e293b';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(15, 23, 42, 0.18)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#0f172a';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(15, 23, 42, 0.12)';
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
                justifyContent: 'center',
                gap: '10px',
                padding: '15px 30px',
                backgroundColor: '#ffffff',
                color: '#0f172a',
                borderRadius: '100px',
                fontSize: '0.95rem',
                fontWeight: 400,
                textDecoration: 'none',
                border: '1px solid #cbd5e1',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                flex: '1 1 auto',
                maxWidth: '240px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#94a3b8';
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>Client Relations</span>
            </Link>
          </div>

          {/* Institutional Assurance Strip */}
          <div
            style={{
              display: 'inline-flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px 18px',
              fontSize: '0.82rem',
              color: '#64748b',
              fontWeight: 400,
              padding: '8px 18px',
              borderRadius: '100px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
            }}
          >
            <span>Turnkey 45–60D Rollout</span>
            <span style={{ color: '#d97706' }}>•</span>
            <span>Tier-1 Concourse Sites</span>
            <span style={{ color: '#d97706' }}>•</span>
            <span>Institutional Capital Scale</span>
          </div>
        </div>
      </section>
    </div>
  );
}

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import ServicesMarquee from './ServicesMarquee';

export default function ITServicesPageClient() {
  const pathname = usePathname();
  
  // Detect if we are on a details subpage sub-route
  const isDetailPage = pathname !== '/industries/it-service' && pathname !== '/industries/it-service/';

  const [selectedProject, setSelectedProject] = useState<{
    id: string;
    name: string;
    subtitle: string;
    body: string;
    tech: string[];
    achievements: string[];
    metrics: { val: string; label: string }[];
    startX: number;
    startY: number;
    startScaleX: number;
    startScaleY: number;
  } | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const stickyContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;
    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        if (!stickyContainerRef.current) return;
        const rect = stickyContainerRef.current.getBoundingClientRect();
        const vh = window.innerHeight;
        // Track element center as it moves from 90% down the viewport (just entering) to 10% (fully read)
        const elementCenter = rect.top + rect.height / 2;
        const startAt = vh * 0.85; // animation starts when center is near bottom
        const endAt   = vh * 0.15; // animation ends when center is near top
        const progress = Math.min(1, Math.max(0, (startAt - elementCenter) / (startAt - endAt)));
        setScrollProgress(progress);
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const projectsList = [
    {
      id: 'fintech',
      name: '/Fintech',
      subtitle: 'Global Remittance & Decentralized Ledgers',
      body: 'Designed and implemented a secure, low-latency cross-border transaction ledger that manages real-time transfers with instant settlement confirmation.',
      achievements: [
        'Automated Compliance: AML/KYC checks resolved in under 80ms.',
        'Multi-Signature Vaults: Hardware-level cryptographic security layers.',
        'Consolidated Ledger: Zero-copy real-time transaction reconciliation.'
      ],
      metrics: [
        { val: '< 60ms', label: 'Latency' },
        { val: '$2.4B+', label: 'Annual Vol' },
        { val: 'SOC2 / PCI', label: 'Compliance' },
        { val: '99.999%', label: 'Resiliency' }
      ],
      tech: ['Next.js', 'Rust', 'PostgreSQL', 'Solidity', 'Firm AI', 'Kafka']
    },
    {
      id: 'healthtech',
      name: '/HealthTech',
      subtitle: 'Neural Diagnostics & HIPAA EHR Systems',
      body: 'Developed a HIPAA-compliant medical records platform featuring neural-assisted image processing to support radiologists with predictive diagnostic overlays.',
      achievements: [
        'Neural Processing: Accelerated real-time MRI/CT scan inference.',
        'Zero-Knowledge EHR: Distributed data shielded by end-to-end encryption.',
        'HL7/FHIR Sync: Fast, bi-directional integration with legacy databases.'
      ],
      metrics: [
        { val: '120ms', label: 'Inference' },
        { val: '1.8M+', label: 'Patients' },
        { val: 'HIPAA', label: 'Compliance' },
        { val: '98.6%', label: 'Accuracy' }
      ],
      tech: ['React Native', 'Python', 'TensorFlow', 'AWS GovCloud', 'Node.js', 'FHIR']
    },
    {
      id: 'autotech',
      name: '/AutoTech',
      subtitle: 'Autonomous Simulators & Fleet Telemetry',
      body: 'Engineered a web-based autonomous vehicle simulation engine combined with real-time IoT battery diagnostic telemetry for large-scale fleets.',
      achievements: [
        'WebGL Simulator: High-fidelity virtual rendering of city road layouts.',
        'Battery Telemetry: Tracked cell voltages, temperatures, and depletion curves.',
        'Predictive Maintenance: Failure alerts sent 48 hours prior to hardware downtime.'
      ],
      metrics: [
        { val: '15k/sec', label: 'Stream Rate' },
        { val: '99.2%', label: 'Precision' },
        { val: '8,500+', label: 'Active Cars' },
        { val: '100ms', label: 'Update Int' }
      ],
      tech: ['C++', 'WebGL', 'Three.js', 'Go', 'InfluxDB', 'IoT Hub', 'Docker']
    },
    {
      id: 'datatech',
      name: '/DataTech',
      subtitle: 'Multi-Modal Knowledge Graphs & Semantics',
      body: 'Constructed a federated knowledge graph platform that unifies unstructured documents, databases, and chats into a single queryable index.',
      achievements: [
        'Semantic Parsing: NLP pipelines instantly structure text from files.',
        'Graph Traversal: Real-time relationship analysis of enterprise entities.',
        'Access Control: Dynamic row-level security policies guarding metadata.'
      ],
      metrics: [
        { val: '10k/min', label: 'Pages Indexed' },
        { val: '< 40ms', label: 'Search' },
        { val: 'Row ACL', label: 'Security' },
        { val: '42M+', label: 'Graph Nodes' }
      ],
      tech: ['Neo4j', 'Python', 'Pinecone', 'ElasticSearch', 'FastAPI', 'LlamaIndex']
    },
    {
      id: 'logisticstech',
      name: '/LogisticsTech',
      subtitle: 'Fleet Dispatch & AGV Coordination',
      body: 'Designed an automated fleet routing system that optimizes long-haul delivery schedules and coordinates robotic warehouses.',
      achievements: [
        'Route Optimization: Pathfinding matching fuel usage and traffic patterns.',
        'Robotic Sorting: Coordinated automated guided vehicles in cargo hubs.',
        'Dynamic Rescheduling: Instantly reroutes vehicles during port delays.'
      ],
      metrics: [
        { val: '18.5%', label: 'Fuel Saved' },
        { val: '< 2.5s', label: 'Route Calc' },
        { val: '12,000+', label: 'Fleets' },
        { val: '12ms', label: 'AGV Latency' }
      ],
      tech: ['Python (Or-Tools)', 'React', 'Node.js', 'GraphQL', 'Kubernetes', 'gRPC']
    },
    {
      id: 'proptech',
      name: '/PropTech',
      subtitle: 'Smart Buildings & Fractional Asset Management',
      body: 'Built an integrated platform for fractional real estate ownership ledgers and automated building environmental management systems.',
      achievements: [
        'Asset Tokenization: Solidity contracts for transparent fractional shares.',
        'Climate Optimization: occupancy-based thermostat and HVAC adjustments.',
        'Automated Leases: Lease drafting, digital signatures, and payout triggers.'
      ],
      metrics: [
        { val: '22%', label: 'HVAC Saved' },
        { val: '450+', label: 'Ledger TPS' },
        { val: '4.5M+', label: 'Active Sq Ft' },
        { val: '< 10s', label: 'Lease Processing' }
      ],
      tech: ['Next.js', 'Solidity', 'Python', 'AWS IoT', 'PostgreSQL', 'Hardhat']
    }
  ];

  const handleProjectClick = (e: React.MouseEvent<HTMLDivElement>, proj: typeof projectsList[0]) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const isMobile = window.innerWidth <= 768;
    const modalWidth = isMobile ? window.innerWidth * 0.92 : 750;
    const modalHeight = isMobile ? window.innerHeight * 0.85 : 520;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    const folderX = rect.left + rect.width / 2;
    const folderY = rect.top + rect.height / 2;
    
    const startX = folderX - centerX;
    const startY = folderY - centerY;
    
    const startScaleX = rect.width / modalWidth;
    const startScaleY = rect.height / modalHeight;

    setSelectedProject({
      ...proj,
      startX,
      startY,
      startScaleX,
      startScaleY
    });
    setIsOpen(false);

    // Double requestAnimationFrame ensures that the browser registers the initial closed style state first,
    // and then triggers the transition to open.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsOpen(true);
      });
    });
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setTimeout(() => {
      setSelectedProject(null);
    }, 550); // Wait for the transition to finish
  };

  return (
    <div style={{ backgroundColor: '#000000', color: '#ffffff', minHeight: '100vh', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>
      
      {/* ── HERO BANNER — only rendered on the main ITServices index landing page ──────────────── */}
      {!isDetailPage && (
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          backgroundImage: 'url("https://res.cloudinary.com/murfclni/image/upload/v1783710520/zawr/https://res.cloudinary.com/murfclni/image/upload/v1783710520/zawr/assets/it-services-hero.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-start',
          padding: '0 clamp(1rem, 6vw, 8%) 8vh clamp(1rem, 6vw, 8%)',
        }}>
          {/* Sleek bottom dark vignette overlay for legibility */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0) 100%)',
            pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', zIndex: 10, maxWidth: '800px' }}>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
              fontWeight: 300,
              color: '#ffffff',
              margin: 0,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              textShadow: '0 4px 20px rgba(0,0,0,0.6)',
            }}>
              IT Services
            </h1>
            <p style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
              color: 'rgba(255,255,255,0.8)',
              marginTop: '1.5rem',
              lineHeight: 1.6,
              maxWidth: '600px',
              fontWeight: 300,
              textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            }}>
              Architecting intelligent enterprise software solutions and scalable digital infrastructure.
            </p>
          </div>
        </div>
      )}

      {/* ── SERVICES MARQUEE — always rendered (acts as details view inline on sub-pages) ─────────────── */}
      <ServicesMarquee />

      {/* ── CORE CAPABILITIES — only rendered on the main ITServices index landing page ──────────────── */}
      {!isDetailPage && (
        <div style={{ padding: 'clamp(4rem, 8vw, 8rem) clamp(1rem, 6vw, 8%) clamp(6rem, 10vw, 10rem) clamp(1rem, 6vw, 8%)', position: 'relative' }}>
          
          {/* ── OUR PROJECTS SECTION ── */}
          <div style={{ maxWidth: '1200px', margin: '0 auto 8rem auto', textAlign: 'center' }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 4.5vw, 3rem)',
              fontWeight: 300,
              color: '#ffffff',
              marginBottom: '4rem',
              letterSpacing: '-0.02em',
              fontFamily: 'Inter, sans-serif',
              opacity: 0.85
            }}>
              Our Projects
            </h2>

            <style dangerouslySetInnerHTML={{__html: `
              .projects-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 4rem 2rem;
                max-width: 900px;
                margin: 0 auto;
              }
              @media (max-width: 768px) {
                .projects-grid {
                  grid-template-columns: repeat(2, 1fr);
                  gap: 3rem 1.5rem;
                }
              }
              @media (max-width: 480px) {
                .projects-grid {
                  grid-template-columns: 1fr;
                  gap: 3rem;
                }
              }
              .project-folder-card {
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
              .project-folder-card:hover .folder-img.closed-img {
                opacity: 0;
              }
              .project-folder-card:hover .folder-img.open-img {
                opacity: 1;
                transform: scale(1.05);
              }
              .project-folder-name {
                font-size: 1.1rem;
                font-weight: 400;
                color: rgba(255, 255, 255, 0.85);
                letter-spacing: -0.01em;
                transition: color 0.2s ease;
              }
              .project-folder-card:hover .project-folder-name {
                color: #ffffff;
              }
              .more-projects-label {
                margin-top: 5rem;
                font-size: 1rem;
                color: rgba(255, 255, 255, 0.35);
                font-weight: 400;
                letter-spacing: 0.05em;
              }

              .mac-modal-overlay {
                position: fixed;
                inset: 0;
                background-color: rgba(0, 0, 0, 0.65);
                backdrop-filter: blur(8px);
                z-index: 10000;
              }

               .mac-modal-window {
                position: fixed;
                top: 50%;
                left: 50%;
                width: 92vw;
                max-width: 750px;
                height: 85vh;
                max-height: 560px;
                background: rgba(10, 10, 15, 0.88);
                border: 1px solid rgba(168, 85, 247, 0.28);
                box-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.9), 0 0 50px rgba(168, 85, 247, 0.18);
                border-radius: 16px;
                z-index: 10001;
                overflow: hidden;
                transform-origin: center center;
                color: #ffffff;
                backdrop-filter: blur(25px);
                display: flex;
                flex-direction: column;
              }

              .mac-titlebar {
                height: 42px;
                background: rgba(255, 255, 255, 0.04);
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
                letter-spacing: -0.01em;
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

              .mac-grid-layout {
                display: grid;
                grid-template-columns: 1.55fr 1fr;
                gap: 2rem;
              }
              @media (max-width: 768px) {
                .mac-grid-layout {
                  grid-template-columns: 1fr;
                  gap: 1.5rem;
                }
              }

              .mac-bullet-list {
                margin: 1rem 0;
                padding-left: 1.2rem;
                color: rgba(255, 255, 255, 0.7);
                font-size: 0.88rem;
                line-height: 1.6;
              }

              .mac-bullet-item {
                margin-bottom: 0.65rem;
              }

              .mac-bullet-bold {
                color: #ffffff;
                font-weight: 500;
              }

              .mac-metrics-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 0.75rem;
                margin-bottom: 1.5rem;
              }
              
              .mac-metric-card {
                background: rgba(255, 255, 255, 0.02);
                border: 1px solid rgba(255, 255, 255, 0.06);
                border-radius: 8px;
                padding: 0.65rem;
                text-align: center;
                transition: border-color 0.2s ease;
              }

              .mac-metric-card:hover {
                border-color: rgba(168, 85, 247, 0.3);
              }
              
              .mac-metric-val {
                font-size: 0.95rem;
                font-weight: 600;
                color: #3b82f6;
                margin-bottom: 0.15rem;
                background: linear-gradient(90deg, #a855f7 0%, #3b82f6 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
              }
              
              .mac-metric-label {
                font-size: 0.65rem;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                color: rgba(255,255,255,0.4);
              }

              .mac-tech-pill {
                background-color: rgba(168, 85, 247, 0.06);
                border: 1px solid rgba(168, 85, 247, 0.2);
                color: #c084fc;
                font-size: 0.75rem;
                padding: 0.25rem 0.65rem;
                border-radius: 9999px;
                font-family: monospace;
                transition: all 0.2s ease;
              }

              .mac-tech-pill:hover {
                border-color: rgba(168, 85, 247, 0.55);
                background-color: rgba(168, 85, 247, 0.12);
              }

              .partners-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                justify-items: center;
                align-items: center;
                gap: 3rem 4rem;
                padding: 0 2rem;
                max-width: 1200px;
                margin: 0 auto;
                width: 100%;
                box-sizing: border-box;
              }
              @media (max-width: 1024px) {
                .partners-grid {
                  grid-template-columns: repeat(3, 1fr);
                  gap: 3rem 4rem;
                }
              }
              @media (max-width: 768px) {
                .partners-grid {
                  grid-template-columns: repeat(2, 1fr);
                  gap: 2.5rem 3rem;
                }
              }
              @media (max-width: 480px) {
                .partners-grid {
                  grid-template-columns: 1fr;
                  gap: 2rem;
                }
              }
            `}} />

            <div className="projects-grid">
              {projectsList.map((proj) => (
                <div key={proj.id} className="project-folder-card" onClick={(e) => handleProjectClick(e, proj)}>
                  <div className="folder-img-container">
                    <img 
                      src="https://res.cloudinary.com/murfclni/image/upload/v1783710489/zawr/https://res.cloudinary.com/murfclni/image/upload/v1783710489/zawr/assets/folder.png" 
                      alt="Closed Folder" 
                      className="folder-img closed-img"
                    />
                    <img 
                      src="https://res.cloudinary.com/murfclni/image/upload/v1783710488/zawr/https://res.cloudinary.com/murfclni/image/upload/v1783710488/zawr/assets/folder-open.png" 
                      alt="Open Folder" 
                      className="folder-img open-img"
                    />
                  </div>
                  <div className="project-folder-name">
                    {proj.name}
                  </div>
                </div>
              ))}
            </div>

            <div className="more-projects-label">
              500+ more
            </div>
          </div>

          {/* ── OUR PARTNERS SECTION ── */}
          <div style={{ maxWidth: '1200px', margin: '0 auto 8rem auto', textAlign: 'center' }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 4.5vw, 3rem)',
              fontWeight: 300,
              color: '#ffffff',
              marginBottom: '4rem',
              letterSpacing: '-0.02em',
              fontFamily: 'Inter, sans-serif',
              opacity: 0.85
            }}>
              Our Partners
            </h2>
            <div className="partners-grid">
              {[
                { name: 'Salesforce', src: 'https://res.cloudinary.com/murfclni/image/upload/v1783710537/zawr/https://res.cloudinary.com/murfclni/image/upload/v1783710537/zawr/assets/partner/salesforce-removebg-preview.png' },
                { name: 'Razorpay', src: 'https://res.cloudinary.com/murfclni/image/upload/v1783710536/zawr/https://res.cloudinary.com/murfclni/image/upload/v1783710536/zawr/assets/partner/razorpay-removebg-preview.png' },
                { name: 'Nvidia', src: 'https://res.cloudinary.com/murfclni/image/upload/v1783710535/zawr/https://res.cloudinary.com/murfclni/image/upload/v1783710535/zawr/assets/partner/nvidia-removebg-preview.png' },
                { name: 'Google', src: 'https://res.cloudinary.com/murfclni/image/upload/v1783710531/zawr/https://res.cloudinary.com/murfclni/image/upload/v1783710531/zawr/assets/partner/google-removebg-preview.png' },
                { name: 'Microsoft', src: 'https://res.cloudinary.com/murfclni/image/upload/v1783710534/zawr/https://res.cloudinary.com/murfclni/image/upload/v1783710534/zawr/assets/partner/microsoft-removebg-preview.png' },
                { name: 'AWS', src: 'https://res.cloudinary.com/murfclni/image/upload/v1783710530/zawr/https://res.cloudinary.com/murfclni/image/upload/v1783710530/zawr/assets/partner/aws-removebg-preview.png' },
                { name: 'Anthropic', src: 'https://res.cloudinary.com/murfclni/image/upload/v1783710528/zawr/https://res.cloudinary.com/murfclni/image/upload/v1783710528/zawr/assets/partner/anthropic-removebg-preview.png' },
                { name: 'Apple', src: 'https://res.cloudinary.com/murfclni/image/upload/v1783710529/zawr/https://res.cloudinary.com/murfclni/image/upload/v1783710529/zawr/assets/partner/apple-removebg-preview.png' },
                { name: 'Intel', src: 'https://res.cloudinary.com/murfclni/image/upload/v1783710532/zawr/https://res.cloudinary.com/murfclni/image/upload/v1783710532/zawr/assets/partner/intel-removebg-preview.png' },
                { name: 'Meta', src: 'https://res.cloudinary.com/murfclni/image/upload/v1783710533/zawr/https://res.cloudinary.com/murfclni/image/upload/v1783710533/zawr/assets/partner/meta-removebg-preview.png' },
                { name: 'Shopify', src: 'https://res.cloudinary.com/murfclni/image/upload/v1783710538/zawr/https://res.cloudinary.com/murfclni/image/upload/v1783710538/zawr/assets/partner/shopify-removebg-preview.png' },
                { name: 'Zoho', src: 'https://res.cloudinary.com/murfclni/image/upload/v1783710539/zawr/https://res.cloudinary.com/murfclni/image/upload/v1783710539/zawr/assets/partner/zoho-removebg-preview.png' },
              ].map((partner) => (
                <div 
                  key={partner.name}
                  style={{
                    height: '110px',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img 
                    src={partner.src} 
                    alt={`${partner.name} logo`}
                    style={{
                      maxHeight: '100%',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      opacity: 0.65,
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.transform = 'scale(1.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0.65';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ── SCROLL TEXT HIGHLIGHT SECTION ── */}
          {(() => {
            const text = "We\u2019re here to build something meaningful together, turning ideas into impactful digital experiences that create lasting value and drive real growth.";
            const words = text.split(' ');
            const totalWords = words.length;
            return (
              <div
                ref={stickyContainerRef}
                style={{
                  maxWidth: '900px',
                  margin: '0 auto 10rem auto',
                  textAlign: 'center',
                  padding: '0 2rem',
                }}
              >
                <p style={{
                  fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)',
                  fontWeight: 300,
                  lineHeight: 1.55,
                  letterSpacing: '-0.02em',
                  margin: 0,
                }}>
                  {words.map((word, i) => {
                    const sliceSize = 1 / totalWords;
                    const wordStart = i * sliceSize;
                    const litAmount = Math.min(1, Math.max(0, (scrollProgress - wordStart) / sliceSize));
                    const wordMid = wordStart + sliceSize * 0.5;
                    const distFromMid = Math.abs(scrollProgress - wordMid);
                    const glowRadius = sliceSize * 2;
                    const glowIntensity = Math.max(0, 1 - distFromMid / glowRadius);
                    const opacity = 0.12 + 0.88 * litAmount;
                    const glow = glowIntensity > 0.02
                      ? `0 0 ${Math.round(20 * glowIntensity)}px rgba(255,255,255,${(0.9 * glowIntensity).toFixed(2)}), 0 0 ${Math.round(50 * glowIntensity)}px rgba(255,255,255,${(0.35 * glowIntensity).toFixed(2)})`
                      : 'none';
                    return (
                      <span
                        key={i}
                        style={{
                          color: `rgba(255,255,255,${opacity.toFixed(3)})`,
                          textShadow: glow,
                          display: 'inline',
                        }}
                      >
                        {word}{' '}
                      </span>
                    );
                  })}
                </p>
              </div>
            );
          })()}

          {/* Subtle glowing colorful blobs behind cards */}
          <div style={{
            position: 'absolute',
            top: '20%',
            right: '5%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(147, 51, 234, 0.15) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '10%',
            left: '5%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '5rem' }}>
              <span style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: '#a855f7',
              }}>
                Capabilities
              </span>
              <h2 style={{
                fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                marginTop: '1rem',
                marginBottom: '2rem',
                color: '#ffffff',
              }}>
                Engineered for Enterprise Impact
              </h2>
              <p style={{
                fontSize: '1.1rem',
                lineHeight: 1.8,
                color: 'rgba(255,255,255,0.7)',
                maxWidth: '850px',
                fontWeight: 300,
              }}>
                Zawr Industries provides end-to-end Information Technology services to startups, enterprises, 
                and government organizations globally. Powered by our proprietary <strong>Firm AI</strong> platform, 
                we deliver intelligent, scalable technology solutions that give businesses a measurable competitive advantage.
              </p>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
              .capability-card {
                background-color: #000000 !important;
                border: 1px solid rgba(255, 255, 255, 0.08) !important;
                border-radius: 2.5rem !important;
                padding: 3rem 2.5rem !important;
                min-height: 380px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                text-decoration: none;
                transition: background-color 0.3s, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
              }
              .capability-card:hover {
                background-color: #111111 !important;
                transform: translateY(-5px);
              }
              .capability-card .arrow-svg {
                transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
              }
              .capability-card:hover .arrow-svg {
                transform: translate(6px, -6px);
              }
            `}} />

            {/* Grid layout */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
              gap: '2.5rem',
              marginTop: '4rem',
            }}>
              
              {/* Card 1 */}
              <Link href="/industries/it-service/software-development" className="capability-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '2.5rem' }}>💻</span>
                  <svg className="arrow-svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 500, color: '#ffffff', marginBottom: '1rem', marginTop: '1.5rem', letterSpacing: '-0.01em' }}>
                    Custom Software & Apps
                  </h3>
                  <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, fontWeight: 300, margin: 0 }}>
                    End-to-end full stack development for complex web, desktop, and mobile architectures. Built using bleeding-edge technologies optimized for raw performance and scalability.
                  </p>
                </div>
              </Link>

              {/* Card 2 */}
              <Link href="/industries/it-service/ai-data-analytics" className="capability-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '2.5rem' }}>✨</span>
                  <svg className="arrow-svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 500, color: '#ffffff', marginBottom: '1rem', marginTop: '1.5rem', letterSpacing: '-0.01em' }}>
                    Firm AI Integrations
                  </h3>
                  <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, fontWeight: 300, margin: 0 }}>
                    Integrate intelligent predictive workflows and large language models (LLMs) into core operational pipelines to reduce latency, automate tasks, and synthesize decision logic.
                  </p>
                </div>
              </Link>

              {/* Card 3 */}
              <Link href="/industries/it-service/cloud" className="capability-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '2.5rem' }}>🛡️</span>
                  <svg className="arrow-svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 500, color: '#ffffff', marginBottom: '1rem', marginTop: '1.5rem', letterSpacing: '-0.01em' }}>
                    Cloud & Cybersecurity
                  </h3>
                  <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, fontWeight: 300, margin: 0 }}>
                    Enterprise-grade cloud migrations, system orchestration, and robust threat mitigation. We shield mission-critical data with multi-layered Zero-Trust network protocols.
                  </p>
                </div>
              </Link>

            </div>


          </div>
        </div>
      )}

      {selectedProject && (
        <>
          <div 
            className="mac-modal-overlay"
            style={{
              opacity: isOpen ? 1 : 0,
              pointerEvents: isOpen ? 'auto' : 'none',
              transition: 'opacity 0.45s ease',
            }}
            onClick={handleCloseModal}
          />
          <div 
            className="mac-modal-window"
            style={{
              transform: isOpen 
                ? 'translate(-50%, -50%) scale(1) skewX(0deg)' 
                : `translate(-50%, -50%) translate(${selectedProject.startX}px, ${selectedProject.startY}px) scale(${selectedProject.startScaleX}, ${selectedProject.startScaleY}) skewX(12deg)`,
              opacity: isOpen ? 1 : 0,
              filter: isOpen ? 'blur(0px)' : 'blur(8px)',
              borderRadius: isOpen ? '16px' : '40px',
              transition: 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease, filter 0.45s ease, border-radius 0.55s ease',
              pointerEvents: isOpen ? 'auto' : 'none',
            }}
          >
            <div className="mac-titlebar">
              <div className="mac-lights">
                <span className="mac-light close" onClick={handleCloseModal} />
                <span className="mac-light minimize" />
                <span className="mac-light maximize" />
              </div>
              <div className="mac-title">Project Details — {selectedProject.name}</div>
            </div>
            <div className="mac-content">
              <div className="mac-grid-layout">
                {/* Left column: overview, subtitle, bullet achievements */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: 'clamp(1.4rem, 4.5vw, 1.9rem)', fontWeight: 600, color: '#ffffff', marginBottom: '0.3rem', letterSpacing: '-0.02em' }}>
                      {selectedProject.name}
                    </h3>
                    <h4 style={{ 
                      fontSize: 'clamp(0.9rem, 2.5vw, 1.05rem)', 
                      fontWeight: 500, 
                      marginBottom: '1.4rem', 
                      letterSpacing: '-0.01em',
                      background: 'linear-gradient(90deg, #c084fc 0%, #60a5fa 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      display: 'inline-block'
                    }}>
                      {selectedProject.subtitle}
                    </h4>
                    <p style={{ fontSize: '0.92rem', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.6, fontWeight: 300, margin: '0 0 1.2rem 0' }}>
                      {selectedProject.body}
                    </p>

                    <span style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', display: 'block' }}>
                      Key Architectural Achievements
                    </span>
                    <ul className="mac-bullet-list">
                      {selectedProject.achievements.map((ach, idx) => {
                        const parts = ach.split(':');
                        return (
                          <li key={idx} className="mac-bullet-item">
                            <span className="mac-bullet-bold">{parts[0]}:</span>{parts[1]}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>

                {/* Right column: metrics panel, tech badges, close button */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '0.75rem' }}>
                      Performance Metrics
                    </span>
                    <div className="mac-metrics-grid">
                      {selectedProject.metrics.map((m, idx) => (
                        <div key={idx} className="mac-metric-card">
                          <div className="mac-metric-val">{m.val}</div>
                          <div className="mac-metric-label">{m.label}</div>
                        </div>
                      ))}
                    </div>

                    <span style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '0.75rem' }}>
                      Technology Stack
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {selectedProject.tech.map((t) => (
                        <span key={t} className="mac-tech-pill">{t}</span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                    <button 
                      onClick={handleCloseModal}
                      style={{
                        background: 'rgba(168, 85, 247, 0.1)',
                        border: '1px solid rgba(168, 85, 247, 0.3)',
                        borderRadius: '8px',
                        color: '#c084fc',
                        padding: '0.6rem 1.4rem',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(168, 85, 247, 0.2)';
                        e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.5)';
                        e.currentTarget.style.color = '#ffffff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(168, 85, 247, 0.1)';
                        e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.3)';
                        e.currentTarget.style.color = '#c084fc';
                      }}
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}

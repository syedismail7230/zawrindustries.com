import { Metadata } from 'next';
import Link from 'next/link';
import ManufacturingRobot3D from '@/components/ManufacturingRobot3D';
import { Capabilities3DGrid } from '@/components/Capabilities3DGrid';

export const metadata: Metadata = {
  title: "AI Powered Precision Manufacturing — Zawr Industries",
  description: "Zawr Industries delivers AI-powered precision manufacturing, 3D robotics, contract production, and advanced engineering solutions under Make in India.",
};

const manufacturingCapabilities = [
  {
    title: "Precision CNC & Metallurgy",
    description: "Multi-axis CNC milling, turning, and high-tolerance metallurgy engineered for aerospace, defense, and heavy machinery components.",
    metric: "±0.005 mm",
    metricLabel: "Precision Tolerance",
  },
  {
    title: "Automated Robotic Assembly",
    description: "Multi-axis articulated industrial robotic arms with integrated vision telemetry, laser arc welding, and autonomous pick-and-place routing.",
    metric: "<12 ms",
    metricLabel: "Control Response Latency",
  },
  {
    title: "Contract Manufacturing",
    description: "End-to-end turnkey contract manufacturing aligned with India's Production Linked Incentive (PLI) scheme for global export compliance.",
    metric: "100%",
    metricLabel: "Export Ready Compliance",
  },
  {
    title: "AI Quality Inspection",
    description: "Computer-vision automated defect detection and non-destructive acoustic/laser inspection delivering zero-defect production runs.",
    metric: "99.98%",
    metricLabel: "Quality Pass Rate",
  },
];

interface MetricBadgeProps {
  metric: string;
  label: string;
}

function ArchitecturalGridBadge({ metric, label }: MetricBadgeProps) {
  return (
    <div style={{
      position: 'relative',
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '180px',
      height: '140px',
      backgroundImage: `
        linear-gradient(to right, rgba(0, 0, 0, 0.07) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(0, 0, 0, 0.07) 1px, transparent 1px)
      `,
      backgroundSize: '24px 24px',
      backgroundPosition: 'center center',
      textAlign: 'center',
      zIndex: 20,
    }}>
      <div style={{
        fontSize: '1.45rem',
        fontWeight: 500,
        color: '#000000',
        marginBottom: '0.15rem',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        letterSpacing: '-0.02em',
        backgroundColor: '#ffffff',
        padding: '0 0.4rem',
      }}>
        {metric}
      </div>
      <div style={{
        fontSize: '0.95rem',
        color: '#94a3b8',
        fontWeight: 400,
        backgroundColor: '#ffffff',
        padding: '0 0.4rem',
      }}>
        {label}
      </div>
    </div>
  );
}

export default function ManufacturingPage() {
  return (
    <div style={{ backgroundColor: '#ffffff', color: '#111111', minHeight: '100vh', overflowX: 'hidden' }}>
      
      {/* 1. Hero Section with 3D Robot Arm overlapping Text */}
      <section style={{
        position: 'relative',
        padding: '6rem 5% 4rem',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        minHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflow: 'hidden',
      }}>
        
        {/* Centered Headline positioned BEHIND the 3D Canvas (zIndex: 1) */}
        <div style={{
          textAlign: 'center',
          zIndex: 1,
          position: 'relative',
          maxWidth: '950px',
          margin: '0 auto',
          paddingTop: '1rem',
          pointerEvents: 'none',
        }}>
          <h1 style={{
            fontSize: 'clamp(3.5rem, 7.5vw, 6rem)',
            fontWeight: 400,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            color: '#000000',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}>
            AI powered<br />
            precision manufacturing
          </h1>
        </div>

        {/* 3D Robot Arm & Flanking Badges (zIndex: 10 - Overlapping Text) */}
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1200px',
          height: '560px',
          marginTop: '-12rem', // Pulls the 3D robot canvas UP so it overlaps over the headline text
          margin: '-12rem auto 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
        }}>

          {/* FLOATING METRIC BADGE 1: Top Left */}
          <div style={{ position: 'absolute', top: '25%', left: '6%', zIndex: 20 }}>
            <ArchitecturalGridBadge metric="±0.005mm" label="Tolerance" />
          </div>

          {/* FLOATING METRIC BADGE 2: Bottom Left */}
          <div style={{ position: 'absolute', bottom: '15%', left: '12%', zIndex: 20 }}>
            <ArchitecturalGridBadge metric="6-Axis" label="Robotics Sync" />
          </div>

          {/* FLOATING METRIC BADGE 3: Top Right */}
          <div style={{ position: 'absolute', top: '25%', right: '6%', zIndex: 20 }}>
            <ArchitecturalGridBadge metric="99.98%" label="Factory Uptime" />
          </div>

          {/* FLOATING METRIC BADGE 4: Bottom Right */}
          <div style={{ position: 'absolute', bottom: '15%', right: '12%', zIndex: 20 }}>
            <ArchitecturalGridBadge metric="±0.005mm" label="Tolerance" />
          </div>

          {/* CENTER 3D ROBOT CANVAS OVERLAY */}
          <div style={{ width: '100%', height: '100%', position: 'relative', zIndex: 15 }}>
            <ManufacturingRobot3D />
          </div>

        </div>

        {/* Action CTAs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.2rem', marginTop: '1rem', zIndex: 20 }}>
          <Link 
            href="/contact"
            style={{
              padding: '1rem 2.2rem',
              borderRadius: '50px',
              backgroundColor: '#000000',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.95rem',
              textDecoration: 'none',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.3s ease',
            }}
          >
            Schedule Technical Audit
          </Link>
          <Link 
            href="/contact/client-relations"
            style={{
              padding: '1rem 2.2rem',
              borderRadius: '50px',
              backgroundColor: '#ffffff',
              border: '1px solid #000000',
              color: '#000000',
              fontWeight: 600,
              fontSize: '0.95rem',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
            }}
          >
            Contract Manufacturing
          </Link>
        </div>

      </section>

      {/* 2. Capabilities Section */}
      <section style={{ padding: '6rem 5%', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, marginBottom: '1rem', color: '#000000' }}>
              Industrial Engineering Capabilities
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#64748b', maxWidth: '640px', margin: '0 auto' }}>
              End-to-end industrial manufacturing capabilities, from automated CNC component fabrication to intelligent 3D robotic assembly.
            </p>
          </div>

          <Capabilities3DGrid capabilities={manufacturingCapabilities} />
        </div>
      </section>

      {/* 3. Tech Architecture & Make in India Compliance */}
      <section style={{ padding: '6rem 5%', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
          <div>
            <span style={{ color: '#000000', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.08em' }}>GOVERNMENT INITIATIVE COMPLIANCE</span>
            <h3 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '1rem 0 1.5rem', lineHeight: 1.2, color: '#000000' }}>
              Make in India & Production-Linked Incentives (PLI)
            </h3>
            <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              Our manufacturing infrastructures are fully certified under ISO 9001:2015, ISO 14001, and Indian Directorate General of Foreign Trade (DGFT) standards. We help international companies establish localized production hubs with full regulatory compliance and supply-chain resilience.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.9rem', color: '#1e293b', fontSize: '0.95rem', fontWeight: 500 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: '#000000', fontWeight: 'bold' }}>✓</span> PLI Scheme Financial Incentive Optimization
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: '#000000', fontWeight: 'bold' }}>✓</span> Turnkey Factory Floor Automation & 3D Digital Twins
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: '#000000', fontWeight: 'bold' }}>✓</span> Export-Quality Metallurgy & Quality Assurance Documentation
              </li>
            </ul>
          </div>

          <div style={{
            backgroundColor: '#000000',
            color: '#ffffff',
            borderRadius: '24px',
            padding: '3rem 2.5rem',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)',
          }}>
            <h4 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.8rem', color: '#ffffff' }}>Production Operational Metrics</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <span>Robotic Arc Welding Precision</span>
                  <span style={{ color: '#ffffff', fontWeight: 'bold' }}>99.94%</span>
                </div>
                <div style={{ height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '99.94%', height: '100%', backgroundColor: '#ffffff' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <span>PLI Export Compliance Readiness</span>
                  <span style={{ color: '#ffffff', fontWeight: 'bold' }}>100%</span>
                </div>
                <div style={{ height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '100%', height: '100%', backgroundColor: '#ffffff' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <span>Cycle Time Reduction</span>
                  <span style={{ color: '#ffffff', fontWeight: 'bold' }}>-42.5%</span>
                </div>
                <div style={{ height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '85%', height: '100%', backgroundColor: '#ffffff' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

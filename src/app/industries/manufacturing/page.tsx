import { Metadata } from 'next';
import Link from 'next/link';
import IndustrialRobot3D from '@/components/IndustrialRobot3D';
import { Capabilities3DGrid } from '@/components/Capabilities3DGrid';

export const metadata: Metadata = {
  title: "Precision Manufacturing & 3D Industrial Robotics — Zawr Industries",
  description: "Zawr Industries delivers precision industrial manufacturing, 3D robotics, contract production, and advanced engineering solutions under Make in India.",
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

export default function ManufacturingPage() {
  return (
    <div style={{ backgroundColor: '#ffffff', color: '#111111', minHeight: '100vh', overflowX: 'hidden' }}>
      
      {/* 1. Black & White Hero Section with 3D Interactive GLB Robot */}
      <section style={{
        position: 'relative',
        padding: '8rem 5% 5rem',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3.5rem',
          alignItems: 'center',
        }}>
          
          {/* Left Column: Hero Text & CTAs */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.4rem 1rem',
              borderRadius: '30px',
              backgroundColor: '#f1f5f9',
              border: '1px solid #cbd5e1',
              color: '#0f172a',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '1.8rem',
              letterSpacing: '0.05em',
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#000000' }}></span>
              MAKE IN INDIA // 3D INDUSTRIAL ROBOTICS
            </div>

            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              marginBottom: '1.5rem',
              color: '#000000',
            }}>
              Precision Industrial Manufacturing & 3D Robotics
            </h1>

            <p style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.2rem)',
              lineHeight: 1.7,
              color: '#475569',
              marginBottom: '2.2rem',
              maxWidth: '580px',
            }}>
              Zawr Industries' Manufacturing division delivers high-precision metallurgy, multi-axis autonomous 3D industrial robotics, and contract production lines engineered for global scale and quality compliance.
            </p>

            {/* Quick Metrics Bar */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              marginBottom: '2.5rem',
              padding: '1.2rem',
              backgroundColor: '#f8fafc',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
            }}>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#000000' }}>±0.005mm</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>Tolerance</div>
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#000000' }}>6-Axis</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>Robotics Sync</div>
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#000000' }}>99.98%</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>Factory Uptime</div>
              </div>
            </div>

            {/* Action CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <Link 
                href="/contact"
                style={{
                  padding: '1rem 2rem',
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
                  padding: '1rem 2rem',
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
          </div>

          {/* Right Column: 3D Interactive GLB Robot Canvas */}
          <div style={{ width: '100%', height: '560px', minHeight: '450px' }}>
            <IndustrialRobot3D />
          </div>

        </div>
      </section>

      {/* 2. 3D Capabilities Section */}
      <section style={{ padding: '6rem 5%', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, marginBottom: '1rem', color: '#000000' }}>
              3D Interactive Engineering Capabilities
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

import { Metadata } from 'next';
import Link from 'next/link';
import IndustrialRobot3D from '@/components/IndustrialRobot3D';
import { Capabilities3DGrid } from '@/components/Capabilities3DGrid';

export const metadata: Metadata = {
  title: "Manufacturing Solutions & 3D Robotics — Zawr Industries",
  description: "Zawr Industries delivers precision industrial manufacturing, automated 3D robotics, contract production, and advanced engineering solutions under Make in India.",
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
    description: "6-Axis articulated industrial robotic arms with integrated vision telemetry, laser arc welding, and autonomous pick-and-place routing.",
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
    <div style={{ backgroundColor: '#0a0d12', color: '#ffffff', minHeight: '100vh', overflowX: 'hidden' }}>
      
      {/* 1. Hero Section with 3D Industrial Robot */}
      <section style={{
        position: 'relative',
        padding: '8rem 5% 5rem',
        background: 'radial-gradient(ellipse at 70% 20%, rgba(230, 81, 0, 0.12) 0%, rgba(10, 13, 18, 1) 70%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
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
              background: 'rgba(230, 81, 0, 0.12)',
              border: '1px solid rgba(230, 81, 0, 0.3)',
              color: '#ff9800',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '1.8rem',
              letterSpacing: '0.05em',
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ff9800' }}></span>
              MAKE IN INDIA // ADVANCED INDUSTRIAL ROBOTICS
            </div>

            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, #ffffff 0%, #a0aec0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Smart Manufacturing & 3D Precision Robotics
            </h1>

            <p style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.2rem)',
              lineHeight: 1.7,
              color: 'rgba(255, 255, 255, 0.75)',
              marginBottom: '2.2rem',
              maxWidth: '580px',
            }}>
              Zawr Industries' Manufacturing Vertical combines high-precision metallurgy, 6-axis autonomous 3D industrial robotics, and AI computer-vision inspection to engineer scalable production lines for global enterprises.
            </p>

            {/* Quick Metrics Bar */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              marginBottom: '2.5rem',
              padding: '1.2rem',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ff9800' }}>±0.005mm</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>Tolerance</div>
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#00e5ff' }}>6-Axis</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>Robotic Sync</div>
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#00ff66' }}>99.98%</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>Factory Uptime</div>
              </div>
            </div>

            {/* Action CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <Link 
                href="/contact"
                style={{
                  padding: '1rem 2rem',
                  borderRadius: '50px',
                  background: 'linear-gradient(135deg, #e65100 0%, #f57c00 100%)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  boxShadow: '0 10px 25px rgba(230, 81, 0, 0.4)',
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
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
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

          {/* Right Column: 3D Interactive Industrial Robot */}
          <div style={{ width: '100%', height: '520px', minHeight: '420px' }}>
            <IndustrialRobot3D />
          </div>

        </div>
      </section>

      {/* 2. Capabilities Section */}
      <section style={{ padding: '6rem 5%', background: '#07090d' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 700, marginBottom: '1rem', color: '#ffffff' }}>
              Industrial Engineering Capabilities
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.65)', maxWidth: '640px', margin: '0 auto' }}>
              End-to-end industrial manufacturing capabilities, from automated CNC component fabrication to intelligent robotic assembly.
            </p>
          </div>

          <Capabilities3DGrid capabilities={manufacturingCapabilities} />
        </div>
      </section>

      {/* 3. Tech Architecture & Make in India Compliance */}
      <section style={{ padding: '6rem 5%', background: '#0a0d12', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div>
            <span style={{ color: '#e65100', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '0.05em' }}>GOVERNMENT INITIATIVE COMPLIANCE</span>
            <h3 style={{ fontSize: '2.2rem', fontWeight: 700, margin: '1rem 0 1.5rem', lineHeight: 1.2 }}>
              Make in India & Production-Linked Incentives (PLI)
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              Our manufacturing infrastructures are fully certified under ISO 9001:2015, ISO 14001, and Indian Directorate General of Foreign Trade (DGFT) standards. We help international companies establish localized production hubs with full regulatory compliance and supply-chain resilience.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem', color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.95rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: '#00ff66', fontWeight: 'bold' }}>✓</span> PLI Scheme Financial Incentive Optimization
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: '#00ff66', fontWeight: 'bold' }}>✓</span> Turnkey Factory Floor Automation & 3D Digital Twins
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: '#00ff66', fontWeight: 'bold' }}>✓</span> Export-Quality Metallurgy & Quality Assurance Documentation
              </li>
            </ul>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(230, 81, 0, 0.1) 0%, rgba(0, 229, 255, 0.05) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '3rem 2.5rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          }}>
            <h4 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', color: '#ffffff' }}>Production Operational Metrics</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <span>Robotic Welding Precision</span>
                  <span style={{ color: '#00e5ff', fontWeight: 'bold' }}>99.94%</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '99.94%', height: '100%', background: '#00e5ff' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <span>PLI Export Compliance Readiness</span>
                  <span style={{ color: '#00ff66', fontWeight: 'bold' }}>100%</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '100%', height: '100%', background: '#00ff66' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <span>Cycle Time Reduction</span>
                  <span style={{ color: '#ff9800', fontWeight: 'bold' }}>-42.5%</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '85%', height: '100%', background: '#ff9800' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

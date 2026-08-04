import { Metadata } from 'next';
import Link from 'next/link';
import ManufacturingHeroClient from '@/components/ManufacturingHeroClient';
import { Capabilities3DGrid } from '@/components/Capabilities3DGrid';
import FactoryDashboardInteractive from '@/components/FactoryDashboardInteractive';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
      width: '160px',
      height: '120px',
      backgroundImage: `
        linear-gradient(to right, rgba(0, 0, 0, 0.07) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(0, 0, 0, 0.07) 1px, transparent 1px)
      `,
      backgroundSize: '24px 24px',
      backgroundPosition: 'center center',
      textAlign: 'center',
      zIndex: 5,
    }}>
      <div style={{
        fontSize: '1.3rem',
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
        fontSize: '0.8rem',
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
      
      {/* Responsive styles injected via a style tag */}
      <style>{`
        .mfg-hero {
          position: relative;
          padding: 5rem 4% 3rem;
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          min-height: 85vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          overflow: hidden;
        }

        .mfg-headline {
          text-align: center;
          z-index: 1;
          position: relative;
          max-width: 1100px;
          margin: 0 auto;
          padding-top: 1rem;
          pointer-events: none;
        }

        .mfg-headline h1 {
          font-size: clamp(2.2rem, 6vw, 5.2rem);
          font-weight: 400;
          line-height: 1.15;
          letter-spacing: -0.03em;
          color: #000000;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          white-space: nowrap;
        }

        .mfg-robot-stage {
          position: relative;
          width: 100%;
          max-width: 1400px;
          height: 600px;
          margin: -10rem auto 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mfg-badge {
          position: absolute;
          z-index: 5;
        }

        .mfg-badge--tl { top: 25%; left: 1%; }
        .mfg-badge--bl { bottom: 12%; left: 3%; }
        .mfg-badge--tr { top: 25%; right: 1%; }
        .mfg-badge--br { bottom: 12%; right: 3%; }

        .mfg-canvas-wrap {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 15;
        }

        .mfg-ctas {
          display: flex;
          flex-wrap: wrap;
          gap: 1.2rem;
          margin-top: 0.5rem;
          z-index: 20;
          justify-content: center;
        }

        .mfg-cta-primary {
          padding: 1rem 2.2rem;
          border-radius: 50px;
          background: #000000;
          color: #ffffff;
          font-weight: 600;
          font-size: 0.95rem;
          text-decoration: none;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          transition: all 0.3s ease;
        }

        .mfg-cta-secondary {
          padding: 1rem 2.2rem;
          border-radius: 50px;
          background: #ffffff;
          border: 1px solid #000000;
          color: #000000;
          font-weight: 600;
          font-size: 0.95rem;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        /* ─── Mobile ≤ 768px — same layout as desktop, just scaled ─── */
        @media (max-width: 768px) {
          .mfg-hero {
            padding: 5rem 1% 3rem;
          }

          /* Scale headline down so it stays on one line without overflow */
          .mfg-headline h1 {
            font-size: clamp(1rem, 5.2vw, 5.2rem);
            white-space: nowrap;
          }

          /* Same 600px stage & negative overlap as desktop */
          .mfg-robot-stage {
            height: 600px;
            margin: -10rem auto 0;
          }

          /* Badges visible — hug the very edge on narrow screens */
          .mfg-badge--tl { top: 25%; left: -1%; }
          .mfg-badge--bl { bottom: 12%; left: -1%; }
          .mfg-badge--tr { top: 25%; right: -1%; }
          .mfg-badge--br { bottom: 12%; right: -1%; }

          /* CTAs stay in a row, slightly smaller */
          .mfg-ctas {
            flex-direction: row;
            justify-content: center;
            gap: 0.7rem;
          }

          .mfg-cta-primary,
          .mfg-cta-secondary {
            padding: 0.8rem 1.1rem;
            font-size: 0.82rem;
          }
        }

        /* ─── Small tablet 769–1024px ─── */
        @media (min-width: 769px) and (max-width: 1024px) {
          .mfg-hero {
            padding: 5rem 4% 3rem;
          }

          .mfg-robot-stage {
            height: 480px;
            margin: -7rem auto 0;
          }

          .mfg-badge--tl { top: 20%; left: 0%; }
          .mfg-badge--bl { bottom: 10%; left: 1%; }
          .mfg-badge--tr { top: 20%; right: 0%; }
          .mfg-badge--br { bottom: 10%; right: 1%; }
        }
      `}</style>

      {/* 1. Hero Section with 3D Robot Arm in FRONT of Text and Badges */}
      <section className="mfg-hero">
        
        {/* Centered Headline positioned BEHIND everything (zIndex: 1) */}
        <div className="mfg-headline">
          <h1>
            AI powered<br />
            <span style={{ whiteSpace: 'nowrap' }}>precision manufacturing</span>
          </h1>
        </div>

        {/* 3D Robot Arm & Flanking Badges Container */}
        <div className="mfg-robot-stage">

          {/* FLOATING METRIC BADGES (hidden on mobile via CSS) */}
          <div className="mfg-badge mfg-badge--tl">
            <ArchitecturalGridBadge metric="±0.005mm" label="Tolerance" />
          </div>

          <div className="mfg-badge mfg-badge--bl">
            <ArchitecturalGridBadge metric="6-Axis" label="Robotics Sync" />
          </div>

          <div className="mfg-badge mfg-badge--tr">
            <ArchitecturalGridBadge metric="99.98%" label="Factory Uptime" />
          </div>

          <div className="mfg-badge mfg-badge--br">
            <ArchitecturalGridBadge metric="100%" label="Export Ready Compliance" />
          </div>

          {/* CENTER 3D ROBOT CANVAS (zIndex: 15) */}
          <div className="mfg-canvas-wrap">
            <ManufacturingHeroClient />
          </div>

        </div>

        {/* Action CTAs */}
        <div className="mfg-ctas">
          <Link href="/contact" className="mfg-cta-primary">
            Schedule Technical Audit
          </Link>
          <Link href="/contact/client-relations" className="mfg-cta-secondary">
            Contract Manufacturing
          </Link>
        </div>

      </section>


      {/* CNC Machine Feature Section */}
      <section style={{
        padding: '0',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        overflow: 'hidden',
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          minHeight: '540px',
          alignItems: 'stretch',
        }}>
          {/* Image Panel — left side */}
          <div style={{
            backgroundColor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            overflow: 'hidden',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/cnc.png"
              alt="Zawr CNC Machining Centre — multi-axis precision CNC milling machine"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'center',
                display: 'block',
                padding: '2rem',
              }}
            />
          </div>

          {/* Text Panel — right side */}
          <div style={{
            padding: 'clamp(3rem, 6vw, 5rem) clamp(2rem, 5vw, 5rem)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
          }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3.4rem)',
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: '#000000',
              marginBottom: '1.6rem',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}>
              Precision CNC<br />
              <span style={{ color: '#64748b', fontWeight: 300 }}>Multi-Axis<br />Machining Centre</span>
            </h2>

            <p style={{
              fontSize: '1rem',
              color: '#475569',
              lineHeight: 1.8,
              marginBottom: '2.4rem',
              maxWidth: '420px',
            }}>
              The Zawr CNC Machining Centre delivers micron-level accuracy across aerospace, defence, and heavy-industry components. Equipped with a multi-axis spindle, intelligent tool-change carousel, and integrated CNC controller, it runs 24/7 adaptive machining programs with zero operator intervention.
            </p>

            {/* Spec items */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '2.4rem' }}>
              {[
                { label: 'Tolerance', value: '±0.005 mm' },
                { label: 'Axes', value: '5-Axis' },
                { label: 'Spindle Speed', value: '12,000 rpm' },
                { label: 'Table Load', value: '800 kg' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 500, color: '#000000', letterSpacing: '-0.03em' }}>{value}</span>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.1rem' }}>{label}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="/contact" style={{
                display: 'inline-block',
                padding: '0.9rem 2rem',
                borderRadius: '50px',
                backgroundColor: '#000000',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.88rem',
                textDecoration: 'none',
              }}>
                Request CNC Quote
              </a>
              <a href="/contact/client-relations" style={{
                display: 'inline-block',
                padding: '0.9rem 2rem',
                borderRadius: '50px',
                backgroundColor: '#ffffff',
                color: '#000000',
                border: '1px solid #000000',
                fontWeight: 600,
                fontSize: '0.88rem',
                textDecoration: 'none',
              }}>
                View Capabilities
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. AGV-2 Autonomous Guided Vehicle Feature Section */}

      <section style={{
        padding: '0',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        overflow: 'hidden',
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          minHeight: '540px',
          alignItems: 'stretch',
        }}>
          {/* Text Panel */}
          <div style={{
            padding: 'clamp(3rem, 6vw, 5rem) clamp(2rem, 5vw, 5rem)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
          }}>

            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3.4rem)',
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: '#000000',
              marginBottom: '1.6rem',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}>
              AGV-2<br />
              <span style={{ color: '#64748b', fontWeight: 300 }}>Autonomous Guided<br />Vehicle</span>
            </h2>

            <p style={{
              fontSize: '1rem',
              color: '#475569',
              lineHeight: 1.8,
              marginBottom: '2.4rem',
              maxWidth: '420px',
            }}>
              The Zawr AGV-2 is a next-generation autonomous guided vehicle engineered for high-throughput factory floors and warehouse environments. With sub-centimetre navigation precision and a 500 kg payload capacity, it operates around the clock in dynamic, human-shared spaces — eliminating inefficiency from internal logistics.
            </p>

            {/* Spec items — no borders, plain text */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '2.4rem' }}>
              {[
                { label: 'Payload', value: '500 kg' },
                { label: 'Speed', value: '1.8 m/s' },
                { label: 'Nav Accuracy', value: '±5 mm' },
                { label: 'Battery', value: '10 hr' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 500, color: '#000000', letterSpacing: '-0.03em' }}>{value}</span>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.1rem' }}>{label}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="/contact" style={{
                display: 'inline-block',
                padding: '0.9rem 2rem',
                borderRadius: '50px',
                backgroundColor: '#000000',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.88rem',
                textDecoration: 'none',
              }}>
                Request AGV Demo
              </a>
              <a href="/contact/client-relations" style={{
                display: 'inline-block',
                padding: '0.9rem 2rem',
                borderRadius: '50px',
                backgroundColor: '#ffffff',
                color: '#000000',
                border: '1px solid #000000',
                fontWeight: 600,
                fontSize: '0.88rem',
                textDecoration: 'none',
              }}>
                Fleet Integration
              </a>
            </div>
          </div>

          {/* Image Panel — plain white bg */}
          <div style={{
            position: 'relative',
            overflow: 'hidden',
            minHeight: '400px',
            backgroundColor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/AGV-2.png"
              alt="Zawr AGV-2 Autonomous Guided Vehicle"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'center',
                display: 'block',
                padding: '2rem',
              }}
            />
          </div>
        </div>
      </section>

      {/* CNC-2 & 3D Print Showcase Cards Section */}
      <section style={{
        padding: 'clamp(3rem, 6vw, 5rem) 5%',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '3rem',
          alignItems: 'start',
        }}>
          {/* CNC-2 Card Block */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{
              borderRadius: '24px',
              overflow: 'hidden',
              backgroundColor: '#ffffff',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.06)',
              aspectRatio: '4 / 3',
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/cnc-2.png"
                alt="High-Precision Multi-Axis CNC Milling Spindle"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
            <div>
              <h3 style={{
                fontSize: '1.4rem',
                fontWeight: 600,
                color: '#000000',
                marginBottom: '0.5rem',
                letterSpacing: '-0.02em',
              }}>
                Multi-Axis CNC Milling & Metallurgy
              </h3>
              <p style={{
                fontSize: '0.95rem',
                color: '#64748b',
                lineHeight: 1.65,
                fontWeight: 300,
                margin: 0,
              }}>
                Sub-micron precision CNC component fabrication engineered for aerospace, defense, and high-spec industrial machinery.
              </p>
            </div>
          </div>

          {/* 3D Print Card Block */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{
              borderRadius: '24px',
              overflow: 'hidden',
              backgroundColor: '#ffffff',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.06)',
              aspectRatio: '4 / 3',
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/3d-print.png"
                alt="Industrial Additive Manufacturing 3D Printer"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
            <div>
              <h3 style={{
                fontSize: '1.4rem',
                fontWeight: 600,
                color: '#000000',
                marginBottom: '0.5rem',
                letterSpacing: '-0.02em',
              }}>
                Industrial Additive 3D Printing
              </h3>
              <p style={{
                fontSize: '0.95rem',
                color: '#64748b',
                lineHeight: 1.65,
                fontWeight: 300,
                margin: 0,
              }}>
                High-resolution additive manufacturing for rapid functional prototyping and end-use production components.
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* 5. Factory Management System (FMS) Telemetry Dashboard */}
      <FactoryDashboardInteractive />

      {/* 6. Full-Size Autonomous Factory View Showcase */}
      <section style={{
        padding: 'clamp(3rem, 6vw, 6rem) 4%',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e2e8f0',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.14em',
              color: '#64748b',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '0.8rem',
            }}>
              SMART FACTORY INFRASTRUCTURE
            </span>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              fontWeight: 400,
              color: '#000000',
              letterSpacing: '-0.03em',
              margin: '0 0 1rem',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}>
              Autonomous High-Throughput Manufacturing Floor
            </h2>
            <p style={{
              fontSize: '1rem',
              color: '#475569',
              maxWidth: '720px',
              margin: '0 auto',
              lineHeight: 1.75,
              fontWeight: 300,
            }}>
              State-of-the-art multi-axis CNC cells, automated AGV logistics corridors, and 24/7 robotic assembly stages operating under unified AI floor orchestration.
            </p>
          </div>

          <div style={{
            position: 'relative',
            width: '100%',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04)',
            border: '1px solid #cbd5e1',
            backgroundColor: '#f8fafc',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/factory-dashboard.png"
              alt="Zawr Autonomous Factory Floor Overview"
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '800px',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
        </div>
      </section>

    </div>
  );
}

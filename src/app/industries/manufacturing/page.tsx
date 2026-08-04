import { Metadata } from 'next';
import Link from 'next/link';
import ManufacturingHeroClient from '@/components/ManufacturingHeroClient';
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
    <div
      className="mfg-badge"
      style={{
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
        zIndex: 5,
      }}
    >
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

      {/* ─── Mobile-responsive hero styles ─── */}
      <style>{`
        /* ── Hero Section ── */
        .mfg-hero {
          position: relative;
          padding: 6rem 3% 4rem;
          background-color: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          min-height: 85vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          overflow: hidden;
        }

        /* ── Headline ── */
        .mfg-headline h1 {
          font-size: clamp(2.8rem, 6vw, 5.2rem);
          font-weight: 400;
          line-height: 1.15;
          letter-spacing: -0.03em;
          color: #000000;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        /* ── Robot + Badges Container ── */
        .mfg-robot-container {
          position: relative;
          width: 100%;
          max-width: 1400px;
          height: 600px;
          margin: -10rem auto 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ── Floating badges ── */
        .mfg-badge-tl { position: absolute; top: 25%; left: 1%;  z-index: 5; }
        .mfg-badge-bl { position: absolute; bottom: 12%; left: 3%; z-index: 5; }
        .mfg-badge-tr { position: absolute; top: 25%; right: 1%; z-index: 5; }
        .mfg-badge-br { position: absolute; bottom: 12%; right: 3%; z-index: 5; }

        /* ── 3D canvas wrapper ── */
        .mfg-canvas-wrap {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 15;
        }

        /* ── CTA buttons ── */
        .mfg-ctas {
          display: flex;
          flex-wrap: wrap;
          gap: 1.2rem;
          margin-top: 0.5rem;
          z-index: 20;
          justify-content: center;
        }

        /* ════════════════════════════════
           TABLET  (≤ 900px)
        ════════════════════════════════ */
        @media (max-width: 900px) {
          .mfg-hero {
            padding: 5rem 4% 3rem;
            min-height: auto;
          }

          .mfg-robot-container {
            height: 420px;
            margin: -7rem auto 0;
          }

          .mfg-badge { width: 140px; height: 110px; }
          .mfg-badge-tl { left: 0;   top: 18%; }
          .mfg-badge-bl { left: 0;   bottom: 8%; }
          .mfg-badge-tr { right: 0;  top: 18%; }
          .mfg-badge-br { right: 0;  bottom: 8%; }
        }

        /* ════════════════════════════════
           MOBILE  (≤ 600px)
        ════════════════════════════════ */
        @media (max-width: 600px) {
          .mfg-hero {
            padding: 4rem 5% 2.5rem;
            min-height: auto;
          }

          .mfg-headline h1 {
            font-size: clamp(2rem, 8vw, 2.8rem) !important;
            white-space: normal !important;
          }

          /* On mobile the robot goes below headline — no overlap */
          .mfg-robot-container {
            height: 320px;
            margin: 0 auto;
            max-width: 100%;
          }

          /* Hide side badges on mobile — they overlap the robot badly */
          .mfg-badge-tl,
          .mfg-badge-bl,
          .mfg-badge-tr,
          .mfg-badge-br {
            display: none;
          }

          /* Show a 2-column badge row BELOW the robot instead */
          .mfg-mobile-badges {
            display: grid !important;
            grid-template-columns: 1fr 1fr;
            gap: 0.75rem;
            width: 100%;
            max-width: 400px;
            margin: 1rem auto 0;
          }

          .mfg-mobile-badge {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 0.85rem 0.5rem;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            text-align: center;
          }
          .mfg-mobile-badge-metric {
            font-size: 1.1rem;
            font-weight: 600;
            color: #000;
            letter-spacing: -0.02em;
          }
          .mfg-mobile-badge-label {
            font-size: 0.75rem;
            color: #94a3b8;
            margin-top: 0.15rem;
          }

          .mfg-ctas {
            flex-direction: column;
            align-items: stretch;
            gap: 0.85rem;
            width: 100%;
            max-width: 340px;
          }

          .mfg-cta-btn {
            text-align: center !important;
          }
        }
      `}</style>

      {/* ─── 1. Hero Section ─── */}
      <section className="mfg-hero">

        {/* Centered Headline (behind 3D) */}
        <div
          className="mfg-headline"
          style={{
            textAlign: 'center',
            zIndex: 1,
            position: 'relative',
            maxWidth: '1200px',
            margin: '0 auto',
            paddingTop: '1rem',
            pointerEvents: 'none',
          }}
        >
          <h1>
            AI powered<br />
            <span style={{ whiteSpace: 'nowrap' }}>precision manufacturing</span>
          </h1>
        </div>

        {/* 3D Robot Arm + Flanking Badges */}
        <div className="mfg-robot-container">

          {/* Floating badges — hidden on mobile, shown on tablet/desktop */}
          <div className="mfg-badge-tl">
            <ArchitecturalGridBadge metric="±0.005mm" label="Tolerance" />
          </div>
          <div className="mfg-badge-bl">
            <ArchitecturalGridBadge metric="6-Axis" label="Robotics Sync" />
          </div>
          <div className="mfg-badge-tr">
            <ArchitecturalGridBadge metric="99.98%" label="Factory Uptime" />
          </div>
          <div className="mfg-badge-br">
            <ArchitecturalGridBadge metric="±0.005mm" label="Tolerance" />
          </div>

          {/* CENTER 3D ROBOT CANVAS */}
          <div className="mfg-canvas-wrap">
            <ManufacturingHeroClient />
          </div>

        </div>

        {/* Mobile-only badge grid (shown below robot on small screens) */}
        <div className="mfg-mobile-badges" style={{ display: 'none' }}>
          {[
            { metric: '±0.005mm', label: 'Tolerance' },
            { metric: '6-Axis',   label: 'Robotics Sync' },
            { metric: '99.98%',   label: 'Factory Uptime' },
            { metric: '<12 ms',   label: 'Latency' },
          ].map((b) => (
            <div key={b.metric} className="mfg-mobile-badge">
              <span className="mfg-mobile-badge-metric">{b.metric}</span>
              <span className="mfg-mobile-badge-label">{b.label}</span>
            </div>
          ))}
        </div>

        {/* Action CTAs */}
        <div className="mfg-ctas">
          <Link
            href="/contact"
            className="mfg-cta-btn"
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
            className="mfg-cta-btn"
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

      {/* ─── 2. Capabilities Section ─── */}
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

      {/* ─── 3. Tech Architecture & Make in India Compliance ─── */}
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
              {[
                { label: 'Robotic Arc Welding Precision',    value: '99.94%', pct: '99.94%' },
                { label: 'PLI Export Compliance Readiness',  value: '100%',   pct: '100%'   },
                { label: 'Cycle Time Reduction',             value: '-42.5%', pct: '85%'    },
              ].map((row) => (
                <div key={row.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    <span>{row.label}</span>
                    <span style={{ color: '#ffffff', fontWeight: 'bold' }}>{row.value}</span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: row.pct, height: '100%', backgroundColor: '#ffffff' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

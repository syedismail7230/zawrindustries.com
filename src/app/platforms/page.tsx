import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Enterprise Platforms & Solutions — Firm AI, VelocityOS, Sketch Studio, Zawr AI, Quick Dial",
  description: "Explore Zawr Industries' flagship technology platforms — Firm AI, VelocityOS, Sketch Studio, Zawr AI, and Quick Dial CRM. Driving digital transformation and enterprise efficiency.",
  keywords: [
    'Firm AI',
    'VelocityOS',
    'Sketch Studio',
    'Zawr AI',
    'Quick Dial CRM',
    'Enterprise Software Platforms',
    'Zawr Industries Products'
  ],
  alternates: {
    canonical: 'https://zawrindustries.com/platforms',
  },
};

const platforms = [
  {
    id: 'firm-ai',
    name: 'Firm AI',
    tagline: 'Enterprise Decision Intelligence & AI Automation',
    description: 'Firm AI empowers enterprise leaders with automated predictive analytics, autonomous decision workflows, and custom LLM integrations tailored for enterprise data ecosystem optimization.',
    badge: 'Artificial Intelligence',
    link: 'https://www.firm.expert/',
    highlights: ['Predictive Analytics', 'Autonomous Workflow Engine', 'Custom LLM Integrations', 'Real-time Intelligence']
  },
  {
    id: 'velocity-os',
    name: 'VelocityOS',
    tagline: 'Cloud Business Operating System & Infrastructure',
    description: 'A high-speed cloud operating ecosystem engineered to unify enterprise operations, streamline multi-tenant cloud infrastructure, and automate complex business processes at scale.',
    badge: 'Cloud Infrastructure',
    link: 'https://velocityos.in/',
    highlights: ['Multi-Cloud Management', 'Process Orchestration', 'Zero-Trust Security', 'High-Speed Execution']
  },
  {
    id: 'sketch-studio',
    name: 'Sketch Studio',
    tagline: 'Enterprise UI/UX Design & Product Studio',
    description: 'Sketch Studio is our flagship design engine delivering world-class UI/UX design, rapid interactive prototyping, brand systems, and front-end engineering for global digital products.',
    badge: 'Design & Prototyping',
    link: 'https://sketchstudio.dev/',
    highlights: ['Product Interface Design', 'Interactive Prototypes', 'Brand Design Systems', 'UX Architecture']
  },
  {
    id: 'zawr-ai',
    name: 'Zawr AI',
    tagline: 'Multi-Modal Autonomous AI Agent Engine',
    description: 'Zawr AI provides autonomous AI agents that handle multi-lingual customer engagements, complex document analysis, automated data extraction, and intelligent task execution.',
    badge: 'Autonomous Agents',
    link: 'https://ai.zawrindustries.com/',
    highlights: ['Multi-Modal AI Agents', 'Document Intelligence', 'Omni-Channel Voice/Text', 'Enterprise APIs']
  },
  {
    id: 'quick-dial',
    name: 'Quick Dial',
    tagline: 'Intelligent Sales CRM & Communication Suite',
    description: 'Quick Dial is a high-velocity CRM platform engineered to streamline sales outreach, lead management, automated call tracking, and customer relationship analytics.',
    badge: 'Sales CRM & Comms',
    link: 'https://crm.zawrindustries.com/',
    highlights: ['Lead Pipeline Management', 'Automated Dialer & Comms', 'Sales Analytics', 'Team Collaboration']
  }
];

const services = [
  { title: 'IT & Software Engineering', href: '/industries/it-service', desc: 'Custom software development, cloud architecture, cybersecurity, and enterprise AI integrations.' },
  { title: 'Transport & Logistics', href: '/industries/transport-and-logistics', desc: 'Autonomous fleet management, AI supply chain routing, and cold chain tracking.' },
  { title: 'Precision Manufacturing', href: '/industries/manufacturing', desc: 'Smart factory automation, IoT visual inspection, and robotic manufacturing systems.' },
  { title: 'Real Estate & Infrastructure', href: '/industries/estate', desc: 'Commercial smart building developments, sustainable master planning, and asset management.' }
];

export default function PlatformsPage() {
  return (
    <div style={{ backgroundColor: '#090d16', color: '#ffffff', minHeight: '100vh', padding: '6rem 0 4rem' }}>
      
      {/* Schema.org Product Graph */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Zawr Industries Flagship Platforms",
            "itemListElement": platforms.map((p, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "SoftwareApplication",
                "name": p.name,
                "description": p.description,
                "url": p.link,
                "applicationCategory": p.badge,
                "operatingSystem": "All Cloud & Web Platforms"
              }
            }))
          })
        }}
      />

      {/* Hero Section */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 5% 4rem', textAlign: 'center' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'inline-block', marginBottom: '1rem' }}>
          Ecosystem & Products
        </span>
        <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: '1.5rem', color: '#ffffff' }}>
          Proprietary Platforms Built for Enterprise Excellence
        </h1>
        <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'rgba(255,255,255,0.75)', maxWidth: '780px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
          Zawr Industries engineers state-of-the-art software platforms that power artificial intelligence, cloud operating systems, brand design, autonomous agents, and sales CRM infrastructures globally.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/contact"
            style={{
              backgroundColor: '#38bdf8',
              color: '#090d16',
              padding: '0.9rem 2rem',
              borderRadius: '9999px',
              fontWeight: 600,
              fontSize: '1rem',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 14px rgba(56, 189, 248, 0.3)'
            }}
          >
            Request Enterprise Demo
          </Link>
          <a
            href="tel:+919880464078"
            style={{
              backgroundColor: 'transparent',
              color: '#ffffff',
              padding: '0.9rem 2rem',
              borderRadius: '9999px',
              fontWeight: 500,
              fontSize: '1rem',
              border: '1px solid rgba(255,255,255,0.2)',
              textDecoration: 'none'
            }}
          >
            Speak to Sales (+91 9880464078)
          </a>
        </div>
      </section>

      {/* Platforms Grid */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 5% 5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
          {platforms.map((platform) => (
            <div
              key={platform.id}
              style={{
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '2.2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.3s ease',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#38bdf8', backgroundColor: 'rgba(56,189,248,0.1)', padding: '0.3rem 0.8rem', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {platform.badge}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.4rem' }}>
                  {platform.name}
                </h3>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 500, color: 'rgba(255,255,255,0.6)', marginBottom: '1.2rem' }}>
                  {platform.tagline}
                </h4>
                <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.65, marginBottom: '1.5rem' }}>
                  {platform.description}
                </p>
                
                {/* Feature Highlights */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
                  {platform.highlights.map((h, i) => (
                    <span key={i} style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)', backgroundColor: 'rgba(255,255,255,0.06)', padding: '0.3rem 0.6rem', borderRadius: '6px' }}>
                      ✓ {h}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Link */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <a
                  href={platform.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: '#ffffff',
                    padding: '0.65rem 1.2rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    textDecoration: 'none',
                    transition: 'background 0.2s'
                  }}
                >
                  Visit Platform ↗
                </a>
                <Link
                  href="/contact"
                  style={{
                    color: '#38bdf8',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    textDecoration: 'none'
                  }}
                >
                  Request Quote →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Sector Overview */}
      <section style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '5rem 5%' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              Core Industrial Verticals
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 700, color: '#ffffff', marginTop: '0.5rem' }}>
              Full-Spectrum Enterprise Services
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {services.map((s, i) => (
              <Link
                key={i}
                href={s.href}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  padding: '1.8rem',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.25s ease'
                }}
              >
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.6rem' }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, marginBottom: '1.2rem' }}>
                  {s.desc}
                </p>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#38bdf8' }}>
                  Explore Sector →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section style={{ maxWidth: '1000px', margin: '5rem auto 2rem', padding: '0 5%', textAlign: 'center' }}>
        <div style={{ backgroundColor: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: '24px', padding: '3.5rem 2rem' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700, color: '#ffffff', marginBottom: '1rem' }}>
            Ready to Accelerate Your Enterprise with Zawr Industries?
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.75)', maxWidth: '650px', margin: '0 auto 2rem' }}>
            Connect directly with our solutions engineering team to build, deploy, and scale tailored AI, software, logistics, or manufacturing systems.
          </p>
          <Link
            href="/contact"
            style={{
              backgroundColor: '#38bdf8',
              color: '#090d16',
              padding: '1rem 2.5rem',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '1.05rem',
              textDecoration: 'none',
              display: 'inline-block',
              boxShadow: '0 6px 20px rgba(56,189,248,0.35)'
            }}
          >
            Get a Custom Proposal
          </Link>
        </div>
      </section>

    </div>
  );
}

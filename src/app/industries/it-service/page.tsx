import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: "IT Services & Custom Software Development — Zawr Industries Bangalore",
  description: "Zawr Industries delivers custom software development, AI solutions, cloud services, cybersecurity, SEO, and managed IT services to businesses across India, UAE and USA.",
};

export default function ITServicesPage() {
  return (
    <div style={{ backgroundColor: '#000000', color: '#ffffff', minHeight: '100vh', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>
      
      {/* ── HERO BANNER — matching the reference mockup perfectly ──────────────── */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        backgroundImage: 'url("/assets/it-services-hero.png")',
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

      {/* ── OUR SERVICES — Parallel horizontal scrolling marquee ─────────────── */}
      <div style={{
        backgroundColor: '#000000',
        padding: '8rem 0 6rem 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
      }}>
        {/* Style injection for horizontal marquee animations */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes scrollRowLeft {
            0% { transform: translateX(0); }
            100% { transform: translateX(-25%); }
          }
          @keyframes scrollRowRight {
            0% { transform: translateX(-25%); }
            100% { transform: translateX(0); }
          }
          .marquee-track {
            display: flex;
            width: max-content;
          }
          .scroll-row-left {
            animation: scrollRowLeft var(--duration, 25s) linear infinite;
          }
          .scroll-row-right {
            animation: scrollRowRight var(--duration, 25s) linear infinite;
          }
          .marquee-group {
            display: flex;
            flex-shrink: 0;
            align-items: center;
            justify-content: space-around;
            gap: 1.5rem;
            padding-right: 1.5rem; /* transition gap matches marquee gap perfectly */
          }
          .service-pill {
            flex-shrink: 0;
            padding: 0.9rem 1.8rem;
            background: linear-gradient(#000000, #000000) padding-box,
                        linear-gradient(135deg, #3b82f6, #ec4899) border-box;
            border: 2px solid transparent;
            border-radius: 100px;
            font-size: 0.95rem;
            font-weight: 500;
            color: #ffffff;
            text-align: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.5);
            white-space: nowrap;
            display: inline-block;
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
          }
          .service-pill:hover {
            transform: scale(1.05);
            box-shadow: 0 8px 25px rgba(236, 72, 153, 0.35);
          }
        `}} />

        <div style={{ maxWidth: '1200px', width: '100%', padding: '0 8%', textAlign: 'center', marginBottom: '4rem', zIndex: 10 }}>
          <span style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: '#a855f7',
          }}>
            Portfolio
          </span>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            marginTop: '1rem',
            color: '#ffffff',
          }}>
            Our Services
          </h2>
        </div>

        {/* Edge-to-edge Horizontal Marquee Container */}
        <div style={{
          position: 'relative',
          width: '100vw',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.75rem',
          zIndex: 8,
        }}>
          {/* Left and Right Fade Vignettes to blend scrolling edges perfectly */}
          <div style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: 'clamp(40px, 12vw, 150px)',
            background: 'linear-gradient(to right, #000000 0%, transparent 100%)',
            zIndex: 15,
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            width: 'clamp(40px, 12vw, 150px)',
            background: 'linear-gradient(to left, #000000 0%, transparent 100%)',
            zIndex: 15,
            pointerEvents: 'none',
          }} />

          {/* Row 1: Left */}
          <div style={{ overflow: 'hidden', width: '100%' }}>
            <div className="marquee-track scroll-row-left" style={{ '--duration': '22s' } as React.CSSProperties}>
              <div className="marquee-group">
                {[
                  "AI & Data Analytics",
                  "Cloud",
                  "Cognitive Business Operations",
                  "Cybersecurity",
                  "Network Solutions",
                  "Industrial Autonomy and Engineering"
                ].map((item, idx) => (
                  <div key={idx} className="service-pill">{item}</div>
                ))}
              </div>
              <div className="marquee-group" aria-hidden="true">
                {[
                  "AI & Data Analytics",
                  "Cloud",
                  "Cognitive Business Operations",
                  "Cybersecurity",
                  "Network Solutions",
                  "Industrial Autonomy and Engineering"
                ].map((item, idx) => (
                  <div key={`dup1-1-${idx}`} className="service-pill">{item}</div>
                ))}
              </div>
              <div className="marquee-group" aria-hidden="true">
                {[
                  "AI & Data Analytics",
                  "Cloud",
                  "Cognitive Business Operations",
                  "Cybersecurity",
                  "Network Solutions",
                  "Industrial Autonomy and Engineering"
                ].map((item, idx) => (
                  <div key={`dup1-2-${idx}`} className="service-pill">{item}</div>
                ))}
              </div>
              <div className="marquee-group" aria-hidden="true">
                {[
                  "AI & Data Analytics",
                  "Cloud",
                  "Cognitive Business Operations",
                  "Cybersecurity",
                  "Network Solutions",
                  "Industrial Autonomy and Engineering"
                ].map((item, idx) => (
                  <div key={`dup1-3-${idx}`} className="service-pill">{item}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Right */}
          <div style={{ overflow: 'hidden', width: '100%' }}>
            <div className="marquee-track scroll-row-right" style={{ '--duration': '25s' } as React.CSSProperties}>
              <div className="marquee-group">
                {[
                  "Enterprise Solutions",
                  "Consulting",
                  "Software Development",
                  "Web Development",
                  "Application Development",
                  "Startup MVP"
                ].map((item, idx) => (
                  <div key={idx} className="service-pill">{item}</div>
                ))}
              </div>
              <div className="marquee-group" aria-hidden="true">
                {[
                  "Enterprise Solutions",
                  "Consulting",
                  "Software Development",
                  "Web Development",
                  "Application Development",
                  "Startup MVP"
                ].map((item, idx) => (
                  <div key={`dup2-1-${idx}`} className="service-pill">{item}</div>
                ))}
              </div>
              <div className="marquee-group" aria-hidden="true">
                {[
                  "Enterprise Solutions",
                  "Consulting",
                  "Software Development",
                  "Web Development",
                  "Application Development",
                  "Startup MVP"
                ].map((item, idx) => (
                  <div key={`dup2-2-${idx}`} className="service-pill">{item}</div>
                ))}
              </div>
              <div className="marquee-group" aria-hidden="true">
                {[
                  "Enterprise Solutions",
                  "Consulting",
                  "Software Development",
                  "Web Development",
                  "Application Development",
                  "Startup MVP"
                ].map((item, idx) => (
                  <div key={`dup2-3-${idx}`} className="service-pill">{item}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 3: Left */}
          <div style={{ overflow: 'hidden', width: '100%' }}>
            <div className="marquee-track scroll-row-left" style={{ '--duration': '20s' } as React.CSSProperties}>
              <div className="marquee-group">
                {[
                  "CRM Solution",
                  "CXM Solution",
                  "Digital Marketing",
                  "Blockchain",
                  "IoT",
                  "DevOps"
                ].map((item, idx) => (
                  <div key={idx} className="service-pill">{item}</div>
                ))}
              </div>
              <div className="marquee-group" aria-hidden="true">
                {[
                  "CRM Solution",
                  "CXM Solution",
                  "Digital Marketing",
                  "Blockchain",
                  "IoT",
                  "DevOps"
                ].map((item, idx) => (
                  <div key={`dup3-1-${idx}`} className="service-pill">{item}</div>
                ))}
              </div>
              <div className="marquee-group" aria-hidden="true">
                {[
                  "CRM Solution",
                  "CXM Solution",
                  "Digital Marketing",
                  "Blockchain",
                  "IoT",
                  "DevOps"
                ].map((item, idx) => (
                  <div key={`dup3-2-${idx}`} className="service-pill">{item}</div>
                ))}
              </div>
              <div className="marquee-group" aria-hidden="true">
                {[
                  "CRM Solution",
                  "CXM Solution",
                  "Digital Marketing",
                  "Blockchain",
                  "IoT",
                  "DevOps"
                ].map((item, idx) => (
                  <div key={`dup3-3-${idx}`} className="service-pill">{item}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 4: Right */}
          <div style={{ overflow: 'hidden', width: '100%' }}>
            <div className="marquee-track scroll-row-right" style={{ '--duration': '28s' } as React.CSSProperties}>
              <div className="marquee-group">
                {[
                  "Unit test",
                  "Quality Assurance",
                  "Workplace Transformation",
                  "Process Automation",
                  "Business Process Management"
                ].map((item, idx) => (
                  <div key={idx} className="service-pill">{item}</div>
                ))}
              </div>
              <div className="marquee-group" aria-hidden="true">
                {[
                  "Unit test",
                  "Quality Assurance",
                  "Workplace Transformation",
                  "Process Automation",
                  "Business Process Management"
                ].map((item, idx) => (
                  <div key={`dup4-1-${idx}`} className="service-pill">{item}</div>
                ))}
              </div>
              <div className="marquee-group" aria-hidden="true">
                {[
                  "Unit test",
                  "Quality Assurance",
                  "Workplace Transformation",
                  "Process Automation",
                  "Business Process Management"
                ].map((item, idx) => (
                  <div key={`dup4-2-${idx}`} className="service-pill">{item}</div>
                ))}
              </div>
              <div className="marquee-group" aria-hidden="true">
                {[
                  "Unit test",
                  "Quality Assurance",
                  "Workplace Transformation",
                  "Process Automation",
                  "Business Process Management"
                ].map((item, idx) => (
                  <div key={`dup4-3-${idx}`} className="service-pill">{item}</div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── CORE CAPABILITIES — editorial glassmorphic section ──────────────── */}
      <div style={{ padding: 'clamp(4rem, 8vw, 8rem) clamp(1rem, 6vw, 8%) clamp(6rem, 10vw, 10rem) clamp(1rem, 6vw, 8%)', position: 'relative' }}>
        
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

          {/* Grid layout */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: '2.5rem',
            marginTop: '4rem',
          }}>
            
            {/* Card 1 */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '16px',
              padding: '3rem 2.5rem',
              backdropFilter: 'blur(10px)',
              transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease',
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>💻</div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#ffffff', marginBottom: '1rem' }}>
                Custom Software & Apps
              </h3>
              <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, fontWeight: 300 }}>
                End-to-end full stack development for complex web, desktop, and mobile architectures. Built using bleeding-edge technologies optimized for raw performance and scalability.
              </p>
            </div>

            {/* Card 2 */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '16px',
              padding: '3rem 2.5rem',
              backdropFilter: 'blur(10px)',
              transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease',
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>✨</div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#ffffff', marginBottom: '1rem' }}>
                Firm AI Integrations
              </h3>
              <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, fontWeight: 300 }}>
                Integrate intelligent predictive workflows and large language models (LLMs) into core operational pipelines to reduce latency, automate tasks, and synthesize decision logic.
              </p>
            </div>

            {/* Card 3 */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '16px',
              padding: '3rem 2.5rem',
              backdropFilter: 'blur(10px)',
              transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease',
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>🛡️</div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#ffffff', marginBottom: '1rem' }}>
                Cloud & Cybersecurity
              </h3>
              <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, fontWeight: 300 }}>
                Enterprise-grade cloud migrations, system orchestration, and robust threat mitigation. We shield mission-critical data with multi-layered Zero-Trust network protocols.
              </p>
            </div>

          </div>

          {/* Partner logos / network banner */}
          <div style={{
            marginTop: '8rem',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '5rem',
            textAlign: 'center',
          }}>
            <p style={{
              fontSize: '0.8rem',
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
              marginBottom: '3rem',
            }}>
              Authorized Integration Partner
            </p>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '3.5rem',
              opacity: 0.65,
            }}>
              {['AWS', 'Google Cloud', 'Microsoft Azure', 'Nvidia', 'Salesforce', 'Anthropic'].map((partner) => (
                <span 
                  key={partner} 
                  style={{ 
                    fontSize: '1.15rem', 
                    fontWeight: 600, 
                    color: '#ffffff', 
                    letterSpacing: '-0.02em' 
                  }}
                >
                  {partner}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

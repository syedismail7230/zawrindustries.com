import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Zawr Industries — Technology, Manufacturing & Logistics Conglomerate | Bangalore',
  description: "Zawr Industries is India's multi-sector conglomerate delivering IT services, AI platforms, logistics, manufacturing, and real estate solutions across India, UAE, USA and UK.",
};

export default function Home() {
  return (
    <>
      {/* Section 1: Hero Background */}
      <section className="hero-section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="hero-bg" style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, zIndex: 0 }}>
          <img
            src="https://res.cloudinary.com/murfclni/image/upload/v1783710572/zawr/images/hero-bg.png"
            alt="Zawr Industries Technology Background"
            style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', top: 0, left: 0 }}
          />
          <div className="hero-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 100%)' }}></div>
        </div>
        
        {/* Subtle Hero Branding */}
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 2rem' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.03em', marginBottom: '1rem', lineHeight: 1.1 }}>
            ZAWR INDUSTRIES
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'rgba(255,255,255,0.8)', fontWeight: 300, maxWidth: '600px', margin: '0 auto' }}>
            Innovating the future of enterprise technology, manufacturing, and global logistics.
          </p>
        </div>
      </section>

      {/* Section 2: Under Reconstruction Info (Matching Mockup precisely with premium styling) */}
      <section style={{ backgroundColor: '#ffffff', color: '#111111', padding: '7rem 5%', minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          
          {/* Left Column: Construction Illustration */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <img 
              src="https://res.cloudinary.com/murfclni/image/upload/v1783710573/zawr/images/reconstruction.png" 
              alt="Website Under Reconstruction" 
              style={{ width: '100%', maxWidth: '460px', height: 'auto', objectFit: 'contain' }}
            />
          </div>

          {/* Right Column: Reconstruction Text & Action Links */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            
            {/* Typography Header Block */}
            <div style={{ marginBottom: '3.5rem' }}>
              <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.3rem)', fontWeight: 500, color: '#111111', marginBottom: '0.75rem', lineHeight: 1.25, letterSpacing: '-0.02em' }}>
                The website is currently under reconstruction
              </h2>
              <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.2rem)', color: '#4b5563', fontWeight: 400 }}>
                You can use these pages meanwhile
              </p>
            </div>

            {/* Links Navigation Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem 1.5rem' }}>
              
              {/* Col 1: Industries */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Industries
                </span>
                <Link 
                  href="/industries/it-service"
                  className="reconstruction-pill"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.75rem 1rem',
                    border: '1px solid #111111',
                    borderRadius: '9999px',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: '#111111',
                    textAlign: 'center',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    backgroundColor: 'transparent'
                  }}
                >
                  IT Services
                </Link>
                <Link 
                  href="/investors"
                  className="reconstruction-pill"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.75rem 1rem',
                    border: '1px solid #111111',
                    borderRadius: '9999px',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: '#111111',
                    textAlign: 'center',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    backgroundColor: 'transparent'
                  }}
                >
                  Investors
                </Link>
              </div>

              {/* Col 2: Our Platforms */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Our Platforms
                </span>
                <Link 
                  href="/platforms"
                  className="reconstruction-pill"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.75rem 1rem',
                    border: '1px solid #111111',
                    borderRadius: '9999px',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: '#111111',
                    textAlign: 'center',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    backgroundColor: 'transparent'
                  }}
                >
                  Platforms
                </Link>
                <Link 
                  href="/careers"
                  className="reconstruction-pill"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.75rem 1rem',
                    border: '1px solid #111111',
                    borderRadius: '9999px',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: '#111111',
                    textAlign: 'center',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    backgroundColor: 'transparent'
                  }}
                >
                  Careers
                </Link>
              </div>

              {/* Col 3: News */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  News
                </span>
                <Link 
                  href="/newsroom/press-release"
                  className="reconstruction-pill"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.75rem 1rem',
                    border: '1px solid #111111',
                    borderRadius: '9999px',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: '#111111',
                    textAlign: 'center',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    backgroundColor: 'transparent'
                  }}
                >
                  Newsroom
                </Link>
                <Link 
                  href="/contact"
                  className="reconstruction-pill"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.75rem 1rem',
                    border: '1px solid #111111',
                    borderRadius: '9999px',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: '#111111',
                    textAlign: 'center',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    backgroundColor: 'transparent'
                  }}
                >
                  Contact
                </Link>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Global CSS Inject for Hover Effects on Pills & Layout Responsiveness */}
      <style dangerouslySetInnerHTML={{__html: `
        .reconstruction-pill:hover {
          background-color: #111111 !important;
          color: #ffffff !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .reconstruction-pill:active {
          transform: translateY(0);
        }
        @media (max-width: 640px) {
          div[style*="gridTemplateColumns: repeat(3, 1fr)"] {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
        }
      `}} />
    </>
  );
}


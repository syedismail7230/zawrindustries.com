'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Footer() {
  const pathname = usePathname() || '';
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'already'>('idle');

  const getFooterBrand = () => {
    if (pathname.startsWith('/industries/it-service')) {
      return { main: 'ZAWR', sub: 'TECHNOLOGIES' };
    }
    if (pathname.startsWith('/industries/transport-and-logistics')) {
      return { main: 'ZAWR', sub: 'LOGISTICS' };
    }
    if (pathname.startsWith('/industries/manufacturing')) {
      return { main: 'ZAWR', sub: 'MANUFACTURING' };
    }
    if (pathname.startsWith('/industries/estate')) {
      return { main: 'ZAWR', sub: 'ESTATE' };
    }
    if (pathname.startsWith('/industries/energy')) {
      return { main: 'ZAWR', sub: 'ENERGY' };
    }
    if (pathname.startsWith('/industries/holding')) {
      return { main: 'ZAWR', sub: 'HOLDING' };
    }
    if (pathname.startsWith('/industries/healthcare')) {
      return { main: 'ZAWR', sub: 'HEALTH CARE' };
    }
    return { main: 'ZAWR', sub: 'INDUSTRIES' };
  };

  const brand = getFooterBrand();

  // Dynamic clamp sizing to prevent horizontal overflow for longer industry names (like MANUFACTURING)
  const subLength = brand.sub.length;
  let fontSizeClamp = 'clamp(2.5rem, 8.5vw, 160px)';
  let registeredClamp = 'clamp(1rem, 3vw, 50px)';
  
  if (subLength >= 13) {
    // For e.g. MANUFACTURING
    fontSizeClamp = 'clamp(1.8rem, 6.2vw, 115px)';
    registeredClamp = 'clamp(0.7rem, 2.2vw, 36px)';
  } else if (subLength >= 11) {
    // For e.g. TECHNOLOGIES, HEALTH CARE
    fontSizeClamp = 'clamp(2rem, 6.8vw, 130px)';
    registeredClamp = 'clamp(0.8rem, 2.4vw, 42px)';
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setStatus('idle');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();

      if (data.status === 'already') {
        setStatus('already');
      } else if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error('Subscription error:', err);
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="footer">
      {/* Panda Peek — only on /sustainability/environment */}
      {pathname === '/sustainability/environment' && (
        <div style={{
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)',
          marginTop: '-6rem',
          marginBottom: '-1px',
          lineHeight: 0,
          overflow: 'hidden',
          backgroundColor: '#000000',
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://res.cloudinary.com/murfclni/image/upload/f_png,q_auto:best/v1783710527/zawr/assets/panda.png"
            alt="Panda peeking over Zawr Industries"
            className="panda-img"
            style={{
              display: 'block',
            }}
            loading="lazy"
            decoding="async"
          />
        </div>
      )}

      {/* Giant Footer Logo Banner */}
      <div style={{ width: '100%', borderBottom: '1px solid var(--border-color)', paddingBottom: '3rem', marginBottom: '3rem', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', overflow: 'hidden', paddingLeft: '1.5rem', paddingRight: '1.5rem', boxSizing: 'border-box' }}>
        <h2 style={{ fontSize: fontSizeClamp, margin: 0, lineHeight: 0.85, letterSpacing: '-0.02em', color: 'var(--text-dark)', display: 'flex', whiteSpace: 'nowrap' }}>
          <span style={{ fontWeight: 800 }}>{brand.main}</span>
          <span style={{ fontWeight: 400, marginLeft: '1.5vw' }}>{brand.sub}</span>
        </h2>
        <span style={{ fontSize: registeredClamp, fontWeight: 400, color: 'var(--text-dark)', marginTop: '0', marginLeft: '0.5rem' }}>®</span>
      </div>

      {/* Top Section: Subscribe & Socials */}
      <div className="footer-top-bar">
        <div className="footer-subscribe">
          <h4>Subscribe for news Alerts</h4>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <input 
              type="email" 
              placeholder={submitting ? "Subscribing..." : "Enter your email address..."} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              disabled={submitting}
              suppressHydrationWarning 
            />
            <button type="submit" disabled={submitting} suppressHydrationWarning style={{ opacity: submitting ? 0.7 : 1 }}>
              {submitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
          
          {/* Visual Feedback Messages */}
          {status === 'success' && (
            <p style={{ color: '#16a34a', fontSize: '0.8rem', marginTop: '0.75rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              ✓ Thank you! You have successfully subscribed to our newsletter alerts.
            </p>
          )}
          {status === 'already' && (
            <p style={{ color: '#4b5563', fontSize: '0.8rem', marginTop: '0.75rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              ✓ You are already subscribed to our newsletter alerts!
            </p>
          )}
          {status === 'error' && (
            <p style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.75rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              ✕ Something went wrong. Please try again later.
            </p>
          )}
        </div>
        <div className="footer-socials">
          <h4>Social links</h4>
          <div className="social-links">
            <a href="https://www.facebook.com/zawrindustries" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="https://www.instagram.com/zawr_industries/" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="https://x.com/zawr_industries" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="X (Twitter)">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"></path></svg>
            </a>
            <a href="https://www.linkedin.com/company/zawr-industries/" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
            <a href="https://www.youtube.com/channel/UCl7BkBpOt235QSpskZxQDkw" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="YouTube">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#1a1a1a"></polygon></svg>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sitemap Grid */}
      <div className="footer-sitemap">
        {/* Column 1 */}
        <div className="footer-col">
          <h4>About</h4>
          <ul className="footer-links">
            <li><Link href="/about#history">Our History</Link></li>
            <li><Link href="/about#board">Board of directors</Link></li>
            <li><Link href="/about#awards">Awards</Link></li>
            <li><Link href="/about#impact">Our Impact</Link></li>
            <li><Link href="/about/blog">Blog</Link></li>
            <li><Link href="/about#values">Values</Link></li>
            <li><Link href="/about#vision">Vision</Link></li>
            <li><Link href="/about#mission">Mission</Link></li>
            <li><Link href="/about#csr">CSR</Link></li>
            <li><Link href="/about#innovation">Innovation</Link></li>
            <li><Link href="/about#code-of-conduct">Code of conduct</Link></li>
            <li><Link href="/pronunciation">Pronunciation</Link></li>
          </ul>
        </div>

        {/* Column 2 */}
        <div className="footer-col">
          <h4>Sustainability</h4>
          <ul className="footer-links">
            <li><Link href="/sustainability/environment">Environment</Link></li>
            <li><Link href="/sustainability/empowerment">Empowerment</Link></li>
            <li><Link href="/sustainability/health">Health</Link></li>
            <li><Link href="/sustainability/education">Education</Link></li>
          </ul>

          <h4 className="mt-8">Industries</h4>
          <ul className="footer-links">
            <li><Link href="/industries/it-service">IT Services</Link></li>
            <li><Link href="/industries/manufacturing">Manufacturing</Link></li>
            <li><Link href="/industries/transport-and-logistics">Logistics and Transport</Link></li>
            <li><Link href="/industries/estate">Estate</Link></li>
            <li><Link href="/industries/energy">Energy</Link></li>
            <li><Link href="/industries/holding">Holding</Link></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div className="footer-col">
          <h4>Platforms</h4>
          <ul className="footer-links">
            <li><a href="https://www.firm.expert/" target="_blank" rel="noopener noreferrer">Firm AI</a></li>
            <li><a href="https://sketchstudio.dev/" target="_blank" rel="noopener noreferrer">Sketch Studio</a></li>
            <li><a href="https://ai.zawrindustries.com/" target="_blank" rel="noopener noreferrer">Zawr AI</a></li>
            <li><a href="https://crm.zawrindustries.com/" target="_blank" rel="noopener noreferrer">Quick Dial</a></li>
            <li><a href="https://velocityos.in/" target="_blank" rel="noopener noreferrer">VelocityOS</a></li>
          </ul>

          <h4 className="mt-8">Careers</h4>
          <ul className="footer-links">
            <li><Link href="/careers/working-at-zawr">Working at Zawr Industries</Link></li>
            <li><Link href="/careers/equal-opportunity">Equal Opportunity Policy</Link></li>
            <li><Link href="/careers">Search and Apply</Link></li>
            <li><Link href="/careers">Jobs</Link></li>
          </ul>
        </div>

        {/* Column 4 */}
        <div className="footer-col">
          <h4>Newsroom</h4>
          <ul className="footer-links">
            <li><Link href="/newsroom/press-release">Press Release</Link></li>
            <li><Link href="/newsroom/notifications">Notifications</Link></li>
            <li><Link href="/newsroom/media-kit">Media Kit</Link></li>
            <li><Link href="/newsroom/events">Events</Link></li>
          </ul>

          <h4 className="mt-8">Contact</h4>
          <ul className="footer-links">
            <li><Link href="/contact">Contact Us</Link></li>
            <li><Link href="/contact/client-relations">Client Relations</Link></li>
            <li><Link href="/contact/sponsorship">Sponsorship</Link></li>
            <li><Link href="/contact/partner">Partner</Link></li>
            <li><a href="mailto:Grievance@zawrindustries.com">Grievance</a></li>
          </ul>
        </div>

        {/* Column 5: Investors */}
        <div className="footer-col">
          <h4>Investors</h4>
          <ul className="footer-links">
            <li><Link href="/investors/financial-report">Financial Reporting</Link></li>
            <li><Link href="/investors/shares">Shares</Link></li>
            <li><Link href="/investors#events-presentations">Events & Presentations</Link></li>
            <li><Link href="/investors/subsidiaries">Subsidiaries & Associates</Link></li>
            <li><Link href="/investors/shareholders-info">Shareholders' Information</Link></li>
            <li><Link href="/investors/resource-centre">Resource Center</Link></li>
            <li><Link href="/investors/notice-of-forfeiture">Notice Of Forfeiture</Link></li>
          </ul>
        </div>

        {/* Column 6 */}
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><a href="https://www.firm.expert/" target="_blank" rel="noopener noreferrer">Firm AI</a></li>
            <li><a href="https://sketchstudio.dev/" target="_blank" rel="noopener noreferrer">Sketch Studio</a></li>
            <li><a href="https://ai.zawrindustries.com/" target="_blank" rel="noopener noreferrer">Zawr AI</a></li>
            <li><a href="https://crm.zawrindustries.com/" target="_blank" rel="noopener noreferrer">Quick Dial</a></li>
            <li><a href="https://velocityos.in/" target="_blank" rel="noopener noreferrer">VelocityOS</a></li>
            <li><Link href="/sitemap">Sitemap</Link></li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom Meta Links */}
      <div className="footer-meta">
        <div className="meta-left">
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/legal-disclaimer">Legal Disclaimer</Link>
          <Link href="/notices">Notices</Link>
        </div>
        <div className="meta-right">
          <Link href="/contact">Contact Us</Link>
          <Link href="/fraud-alert">Fraud Alert</Link>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-copyright">
        {new Date().getFullYear()} &copy; Zawr Industries LLP. All rights reserved.
      </div>
    </footer>
  );
}

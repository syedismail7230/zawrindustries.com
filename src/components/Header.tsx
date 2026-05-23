'use client';

import Link from 'next/link';
import { Poppins } from 'next/font/google';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import ISO6391 from 'iso-639-1';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '700'] });

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [langQuery, setLangQuery] = useState('');
  const [searchError, setSearchError] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > window.innerHeight - 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredLangs = ISO6391.getAllCodes().filter(code => 
    ISO6391.getNativeName(code).toLowerCase().includes(langQuery.toLowerCase()) || 
    ISO6391.getName(code).toLowerCase().includes(langQuery.toLowerCase())
  );

  const handleLanguageSwitch = (code: string) => {
    if (code === 'en') {
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    } else {
      document.cookie = `googtrans=/en/${code}; path=/; domain=${window.location.hostname};`;
      document.cookie = `googtrans=/en/${code}; path=/;`;
    }
    window.location.reload();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;

    // Smart navigation dictionary
    const routes: Record<string, string> = {
      'firm': 'https://www.firm.expert/',
      'firm ai': 'https://www.firm.expert/',
      'sketch': 'https://sketchstudio.dev/',
      'sketch studio': 'https://sketchstudio.dev/',
      'zawr ai': 'https://ai.zawrindustries.com/',
      'ai': 'https://ai.zawrindustries.com/',
      'quick dial': 'https://crm.zawrindustries.com/',
      'crm': 'https://crm.zawrindustries.com/',
      'velocity': 'https://velocityos.in/',
      'velocityos': 'https://velocityos.in/',
      'about': '/#about',
      'contact': '/#contact',
      'industries': '/#industries',
      'platforms': '/#platforms',
      'newsroom': '/#newsroom',
      'news': '/#newsroom',
      'investors': '/#investors',
      'home': '/'
    };

    let matchedRoute = '';

    // Find best match
    if (routes[q]) {
      matchedRoute = routes[q];
    } else {
      for (const [key, route] of Object.entries(routes)) {
        if (key.includes(q) || q.includes(key)) {
          matchedRoute = route;
          break;
        }
      }
    }

    if (matchedRoute) {
      if (matchedRoute.startsWith('http')) {
        window.open(matchedRoute, '_blank', 'noopener,noreferrer');
      } else {
        router.push(matchedRoute);
      }
      setIsSearchOpen(false);
      setSearchQuery('');
      setSearchError('');
    } else {
      // Show error directly in the overlay
      setSearchError(`We could not find any exact matches for "${searchQuery.trim()}". As our platform is expanding, please try navigating via the header menu.`);
    }
  };

  return (
    <>
    <header className={`header ${isScrolled || pathname.startsWith('/contact') ? 'scrolled' : ''} ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
      <div className={`logo-container ${poppins.className}`}>
        <Link href="/">
          <span className="logo-bold">ZAWR</span>
          <span className="logo-regular">INDUSTRIES</span>
        </Link>
      </div>

      <nav className={`nav-links ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
        <Link href="/" className="nav-item">Home</Link>
        <div className="nav-item">
          About
          <div className="dropdown">
            <Link href="/about/blog">Blog</Link>
            <Link href="/about/values">Values</Link>
            <Link href="/about/vision">Vision</Link>
            <Link href="/about/mission">Mission</Link>
          </div>
        </div>
        <div className="nav-item">
          Industries
          <div className="dropdown">
            <Link href="/industries/it-service">IT Service</Link>
            <Link href="/industries/transport-and-logistics">Transport and Logistics</Link>
            <Link href="/industries/manufacturing">Manufacturing</Link>
            <Link href="/industries/estate">Estate</Link>
            <Link href="/industries/healthcare">Healthcare</Link>
          </div>
        </div>
        <div className="nav-item">
          Platforms
          <div className="dropdown">
            <a href="https://www.firm.expert/" target="_blank" rel="noopener noreferrer">Firm AI</a>
            <a href="https://sketchstudio.dev/" target="_blank" rel="noopener noreferrer">Sketch Studio</a>
            <a href="https://ai.zawrindustries.com/" target="_blank" rel="noopener noreferrer">Zawr AI</a>
            <a href="https://crm.zawrindustries.com/" target="_blank" rel="noopener noreferrer">Quick Dial</a>
            <a href="https://velocityos.in/" target="_blank" rel="noopener noreferrer">VelocityOS</a>
          </div>
        </div>
        <div className="nav-item">
          Newsroom
          <div className="dropdown">
            <Link href="/newsroom/news-media">News & Media</Link>
            <Link href="/newsroom/press-release">Press Release</Link>
            <Link href="/newsroom/notifications">Notifications</Link>
            <Link href="/newsroom/media-kit">Media Kit</Link>
          </div>
        </div>
        <Link href="/contact/investors" className="nav-item">Investors</Link>
        <Link href="/contact/careers" className="nav-item">Careers</Link>
        <div className="nav-item">
          <Link href="/contact" style={{ color: 'inherit', textDecoration: 'none' }}>Contact</Link>
          <div className="dropdown">
            <Link href="/contact/client-relations">Client Relations</Link>
            <Link href="/contact/public-relations">Public Relations</Link>
          </div>
        </div>
      </nav>

      <div className={`header-actions ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
        <button className="icon-btn" aria-label="Search" onClick={() => setIsSearchOpen(!isSearchOpen)} suppressHydrationWarning>
          <svg viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
        <div className="nav-item" style={{ padding: 0 }}>
          <button className="icon-btn" aria-label="Language" style={{ pointerEvents: 'none' }} suppressHydrationWarning>
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
          </button>
          <div className="dropdown" style={{ left: 'auto', right: '-1rem', minWidth: '180px', paddingTop: '1.5rem' }}>
            <div style={{ marginBottom: '10px' }}>
              <input 
                type="text" 
                placeholder="Search language..." 
                value={langQuery}
                onChange={(e) => setLangQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'var(--primary-color)', color: 'var(--bg-white)', outline: 'none', fontSize: '0.85rem' }}
              />
            </div>
            <div className="custom-scrollbar" style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '5px', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {filteredLangs.map((code) => (
                <a 
                  key={code} 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); handleLanguageSwitch(code); }}
                >
                  {ISO6391.getNativeName(code)}
                </a>
              ))}
            </div>
          </div>
        </div>
        <a href="tel:+919880464078" className="icon-btn" aria-label="Phone">
          <svg viewBox="0 0 24 24">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
        </a>
      </div>

      <button className="mobile-menu-btn" aria-label="Menu" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} suppressHydrationWarning>
        {isMobileMenuOpen ? '✕' : '☰'}
      </button>

    </header>
      {/* Full Screen Search Overlay */}
      {isSearchOpen && (
        <div className="search-overlay">
          <button className="search-close" onClick={() => { setIsSearchOpen(false); setSearchError(''); }}>×</button>
          <form className="search-form" onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Search Zawr Industries..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setSearchError(''); }}
              autoFocus
            />
            <button type="submit">Search</button>
            {searchError && (
              <div style={{ position: 'absolute', top: 'calc(100% + 2rem)', left: 0, right: 0, textAlign: 'center', color: 'var(--bg-white)', opacity: 0.9, fontSize: '1rem', fontWeight: 300 }}>
                {searchError}
              </div>
            )}
          </form>
        </div>
      )}
    </>
  );
}

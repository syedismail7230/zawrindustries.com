'use client';

import Link from 'next/link';
import { Poppins } from 'next/font/google';
import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import ISO6391 from 'iso-639-1';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' });

function ChevronDownIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
        opacity: 0.7,
      }}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMobileSubmenu, setActiveMobileSubmenu] = useState<string | null>(null);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [langQuery, setLangQuery] = useState('');
  const [searchError, setSearchError] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  const langDropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    fetch('/api/notifications')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) {
          setNotifications(data.filter((n: any) => !n.archived));
        }
      })
      .catch((err) => console.error('Failed to load header notifications', err));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (isMobileMenuOpen) return;
      setIsScrolled(window.scrollY > window.innerHeight - 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileMenuOpen]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target as Node)) {
        setIsNotifDropdownOpen(false);
      }
    };
    if (isLangDropdownOpen || isNotifDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLangDropdownOpen, isNotifDropdownOpen]);

  // Close mobile menu and reset scroll state on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveMobileSubmenu(null);
    setIsLangDropdownOpen(false);
    setIsNotifDropdownOpen(false);
    setIsScrolled(false);
  }, [pathname]);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setActiveMobileSubmenu(null);
    setIsLangDropdownOpen(false);
    setIsNotifDropdownOpen(false);
  };

  const toggleMobileSubmenu = (menuName: string) => {
    setActiveMobileSubmenu(prev => prev === menuName ? null : menuName);
  };

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
      setSearchError(`We could not find any exact matches for "${searchQuery.trim()}". As our platform is expanding, please try navigating via the header menu.`);
    }
  };

  const isDarkPage = isMounted && (pathname.startsWith('/about') || pathname.startsWith('/careers') || pathname.startsWith('/contact/client-relations') || pathname.startsWith('/contact/sponsorship') || pathname.startsWith('/investors') || pathname.startsWith('/newsroom/events') || pathname.startsWith('/industries/it-service') || pathname === '/contact/partner/creator-partner');
  const isLightPage = isMounted && (pathname === '/' || pathname === '/sustainability/empowerment' || pathname === '/sustainability/health' || pathname === '/sustainability/education' || pathname.startsWith('/industries/transport-and-logistics') || pathname.startsWith('/industries/manufacturing'));

  return (
    <header className={`header ${!isMobileMenuOpen && (isScrolled || (pathname.startsWith('/contact') && !isDarkPage)) ? 'scrolled' : ''} ${isMobileMenuOpen ? 'mobile-open' : ''} ${isDarkPage ? 'dark-page-header' : ''} ${isLightPage ? 'light-page-header' : ''}`} suppressHydrationWarning>
      <div className={`logo-container ${poppins.className}`}>
        <Link href="/" onClick={closeMobileMenu}>
          <span className="logo-bold">ZAWR</span>
          <span className="logo-regular">INDUSTRIES</span>
        </Link>
      </div>

      <nav className={`nav-links ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
        <Link href="/" className="nav-item" onClick={closeMobileMenu}>Home</Link>

        {/* About */}
        <div className="nav-item">
          <div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
          >
            <Link href="/about" onClick={closeMobileMenu} style={{ color: 'inherit', textDecoration: 'none', flexGrow: 1 }}>
              About
            </Link>
            <span
              style={{ display: isMobileMenuOpen ? 'inline-flex' : 'none', alignItems: 'center', paddingLeft: '0.5rem' }}
              onClick={(e) => {
                e.stopPropagation();
                toggleMobileSubmenu('about');
              }}
            >
              <ChevronDownIcon isOpen={activeMobileSubmenu === 'about'} />
            </span>
          </div>
          <div className={`dropdown ${activeMobileSubmenu === 'about' ? 'mobile-submenu-open' : ''}`}>
            <Link href="/about" onClick={closeMobileMenu}>About Us</Link>
            <Link href="/about#history" onClick={closeMobileMenu}>Our History</Link>
            <Link href="/about#board" onClick={closeMobileMenu}>Board of Directors</Link>
            <Link href="/about#impact" onClick={closeMobileMenu}>Our Impact</Link>
            <Link href="/about/blog" onClick={closeMobileMenu}>Blog</Link>
            <Link href="/about#values" onClick={closeMobileMenu}>Values</Link>
            <Link href="/about#vision" onClick={closeMobileMenu}>Vision</Link>
            <Link href="/about#mission" onClick={closeMobileMenu}>Mission</Link>
            <Link href="/about#innovation" onClick={closeMobileMenu}>Innovation</Link>
            <Link href="/about#code-of-conduct" onClick={closeMobileMenu}>Code of Conduct</Link>
          </div>
        </div>

        {/* Industries */}
        <div className="nav-item">
          <div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => toggleMobileSubmenu('industries')}
          >
            <span>Industries</span>
            <span style={{ display: isMobileMenuOpen ? 'inline-flex' : 'none', alignItems: 'center' }}>
              <ChevronDownIcon isOpen={activeMobileSubmenu === 'industries'} />
            </span>
          </div>
          <div className={`dropdown ${activeMobileSubmenu === 'industries' ? 'mobile-submenu-open' : ''}`}>
            <Link href="/industries/it-service" onClick={closeMobileMenu}>IT Services</Link>
            <Link href="/industries/manufacturing" onClick={closeMobileMenu}>Manufacturing</Link>
            <Link href="/industries/transport-and-logistics" onClick={closeMobileMenu}>Logistics and Transport</Link>
            <Link href="/industries/estate" onClick={closeMobileMenu}>Estate</Link>
          </div>
        </div>

        {/* Platforms */}
        <div className="nav-item">
          <div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => toggleMobileSubmenu('platforms')}
          >
            <span>Platforms</span>
            <span style={{ display: isMobileMenuOpen ? 'inline-flex' : 'none', alignItems: 'center' }}>
              <ChevronDownIcon isOpen={activeMobileSubmenu === 'platforms'} />
            </span>
          </div>
          <div className={`dropdown ${activeMobileSubmenu === 'platforms' ? 'mobile-submenu-open' : ''}`}>
            <a href="https://www.firm.expert/" target="_blank" rel="noopener noreferrer" onClick={closeMobileMenu}>Firm AI</a>
            <a href="https://sketchstudio.dev/" target="_blank" rel="noopener noreferrer" onClick={closeMobileMenu}>Sketch Studio</a>
            <a href="https://ai.zawrindustries.com/" target="_blank" rel="noopener noreferrer" onClick={closeMobileMenu}>Zawr AI</a>
            <a href="https://crm.zawrindustries.com/" target="_blank" rel="noopener noreferrer" onClick={closeMobileMenu}>Quick Dial</a>
            <a href="https://velocityos.in/" target="_blank" rel="noopener noreferrer" onClick={closeMobileMenu}>VelocityOS</a>
          </div>
        </div>

        {/* Newsroom */}
        <div className="nav-item">
          <div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => toggleMobileSubmenu('newsroom')}
          >
            <Link href="/newsroom/press-release" style={{ color: 'inherit', textDecoration: 'none' }} onClick={closeMobileMenu}>Newsroom</Link>
            <span style={{ display: isMobileMenuOpen ? 'inline-flex' : 'none', alignItems: 'center' }}>
              <ChevronDownIcon isOpen={activeMobileSubmenu === 'newsroom'} />
            </span>
          </div>
          <div className={`dropdown ${activeMobileSubmenu === 'newsroom' ? 'mobile-submenu-open' : ''}`}>
            <Link href="/newsroom/press-release" onClick={closeMobileMenu}>Press Release</Link>
            <Link href="/newsroom/notifications" onClick={closeMobileMenu}>Notifications</Link>
            <Link href="/newsroom/media-kit" onClick={closeMobileMenu}>Media Kit</Link>
          </div>
        </div>

        <Link href="/investors" className="nav-item" onClick={closeMobileMenu}>Investors</Link>
        <Link href="/careers" className="nav-item" onClick={closeMobileMenu}>Careers</Link>

        {/* Contact */}
        <div className="nav-item">
          <div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => toggleMobileSubmenu('contact')}
          >
            <Link href="/contact" style={{ color: 'inherit', textDecoration: 'none' }} onClick={closeMobileMenu}>Contact</Link>
            <span style={{ display: isMobileMenuOpen ? 'inline-flex' : 'none', alignItems: 'center' }}>
              <ChevronDownIcon isOpen={activeMobileSubmenu === 'contact'} />
            </span>
          </div>
          <div className={`dropdown ${activeMobileSubmenu === 'contact' ? 'mobile-submenu-open' : ''}`}>
            <Link href="/contact/client-relations" onClick={closeMobileMenu}>Client Relations</Link>
            <Link href="/contact/public-relations" onClick={closeMobileMenu}>Public Relations</Link>
            <Link href="/contact/partner" onClick={closeMobileMenu}>Partner</Link>
          </div>
        </div>
      </nav>

      {/* Header Action Buttons (Search, Language, Call) */}
      <div className={`header-actions ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
        {/* Search Button */}
        <button className="icon-btn" aria-label="Search" onClick={() => setIsSearchOpen(!isSearchOpen)} suppressHydrationWarning>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>

        {/* Notifications Button & Dropdown */}
        <div ref={notifDropdownRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <button
            className="icon-btn notif-btn"
            aria-label="Notifications"
            onClick={() => {
              setIsNotifDropdownOpen((prev) => !prev);
              setIsLangDropdownOpen(false);
            }}
            suppressHydrationWarning
            style={{ position: 'relative' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </button>

          {isNotifDropdownOpen && (
            <div
              className="notif-dropdown-panel"
              style={{
                position: 'absolute',
                top: 'calc(100% + 0.75rem)',
                right: isMobileMenuOpen ? 'auto' : 0,
                left: isMobileMenuOpen ? 0 : 'auto',
                width: 'clamp(290px, 86vw, 360px)',
                display: 'flex',
                flexDirection: 'column',
                opacity: 1,
                visibility: 'visible',
                pointerEvents: 'auto',
                transform: 'translateY(0)',
                zIndex: 1000,
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0 20px 45px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.05)',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                color: '#0f172a',
              }}
            >
              {/* Dropdown Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.9rem 1.15rem',
                  borderBottom: '1px solid #f1f5f9',
                  backgroundColor: '#f8fafc',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }}>Notifications</span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      backgroundColor: '#e2e8f0',
                      color: '#334155',
                      padding: '2px 8px',
                      borderRadius: '100px',
                    }}
                  >
                    {notifications.length} Active
                  </span>
                </div>
                <Link
                  href="/newsroom/notifications"
                  onClick={closeMobileMenu}
                  style={{ fontSize: '0.78rem', color: '#64748b', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}
                >
                  View Page
                </Link>
              </div>

              {/* Notifications List */}
              <div
                className="custom-scrollbar"
                style={{
                  maxHeight: '320px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: '#ffffff',
                }}
              >
                {notifications.length === 0 ? (
                  <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                    No active notifications.
                  </div>
                ) : (
                  notifications.map((item) => (
                    <Link
                      key={item.id}
                      href={`/newsroom/notifications/${item.slug}`}
                      onClick={closeMobileMenu}
                      style={{
                        padding: '0.95rem 1.15rem',
                        borderBottom: '1px solid #f1f5f9',
                        textDecoration: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '5px',
                        backgroundColor: '#ffffff',
                        transition: 'background-color 0.2s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem' }}>
                        <span
                          style={{
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                            fontSize: '0.68rem',
                            color: item.category === 'Investor' ? '#1d4ed8' : item.category === 'Operations' ? '#15803d' : '#b45309',
                          }}
                        >
                          {item.category || 'General'}
                        </span>
                        <span style={{ color: '#94a3b8', fontSize: '0.72rem' }}>{item.date}</span>
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', lineHeight: 1.35 }}>
                        {item.title}
                      </div>
                      <div
                        style={{
                          fontSize: '0.78rem',
                          color: '#64748b',
                          lineHeight: 1.45,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {item.summary}
                      </div>
                    </Link>
                  ))
                )}
              </div>

              {/* Dropdown Footer */}
              <div
                style={{
                  padding: '0.75rem 1.15rem',
                  borderTop: '1px solid #f1f5f9',
                  backgroundColor: '#f8fafc',
                  textAlign: 'center',
                }}
              >
                <Link
                  href="/newsroom/notifications"
                  onClick={closeMobileMenu}
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: '#0f172a',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'opacity 0.2s',
                  }}
                >
                  <span>See All Notifications</span>
                  <span style={{ fontSize: '1rem' }}>&rarr;</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Language Button & Dropdown */}
        <div ref={langDropdownRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <button
            className="icon-btn"
            aria-label="Language"
            onClick={() => setIsLangDropdownOpen(prev => !prev)}
            suppressHydrationWarning
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
              <path d="M2 12h20"></path>
            </svg>
          </button>

          {isLangDropdownOpen && (
            <div
              className="dropdown lang-dropdown"
              style={{
                position: 'absolute',
                top: 'calc(100% + 0.75rem)',
                right: isMobileMenuOpen ? 'auto' : 0,
                left: isMobileMenuOpen ? 0 : 'auto',
                minWidth: '200px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                opacity: 1,
                visibility: 'visible',
                pointerEvents: 'auto',
                transform: 'translateY(0)',
                zIndex: 1000,
                backgroundColor: 'var(--primary-color, #0f172a)',
                borderRadius: '8px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
              }}
            >
              <div style={{ marginBottom: '10px' }}>
                <input
                  suppressHydrationWarning
                  type="text"
                  placeholder="Search language..."
                  value={langQuery}
                  onChange={(e) => setLangQuery(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.08)', color: '#ffffff', outline: 'none', fontSize: '0.85rem' }}
                />
              </div>
              <div className="custom-scrollbar" style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '5px', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {filteredLangs.map((code) => (
                  <a
                    key={code}
                    href="#"
                    onClick={(e) => { e.preventDefault(); handleLanguageSwitch(code); closeMobileMenu(); }}
                    style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.9rem', padding: '0.2rem 0', transition: 'color 0.2s' }}
                  >
                    {ISO6391.getNativeName(code)}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Phone Call Link */}
        <a href="tel:+919880464078" className="icon-btn" aria-label="Phone">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
        </a>
      </div>

      <button className="mobile-menu-btn" aria-label="Menu" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} suppressHydrationWarning>
        {isMobileMenuOpen ? '✕' : '☰'}
      </button>

      {/* Full Screen Search Overlay */}
      {isSearchOpen && (
        <div className="search-overlay">
          <button className="search-close" onClick={() => { setIsSearchOpen(false); setSearchError(''); }}>×</button>
          <form className="search-form" onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
            <input
              suppressHydrationWarning
              type="text"
              placeholder="Search Zawr Industries..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setSearchError(''); }}
              autoFocus
            />
            <button suppressHydrationWarning type="submit">Search</button>
            {searchError && (
              <div style={{ position: 'absolute', top: 'calc(100% + 2rem)', left: 0, right: 0, textAlign: 'center', color: 'var(--bg-white)', opacity: 0.9, fontSize: '1rem', fontWeight: 300 }}>
                {searchError}
              </div>
            )}
          </form>
        </div>
      )}
    </header>
  );
}

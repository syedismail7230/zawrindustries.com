'use client';

import Link from 'next/link';
import { Poppins } from 'next/font/google';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import ISO6391 from 'iso-639-1';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '700'] });

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
  const [searchQuery, setSearchQuery] = useState('');
  const [langQuery, setLangQuery] = useState('');
  const [searchError, setSearchError] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  const langDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
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
    };
    if (isLangDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLangDropdownOpen]);

  // Close mobile menu and reset scroll state on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveMobileSubmenu(null);
    setIsLangDropdownOpen(false);
    setIsScrolled(false);
  }, [pathname]);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setActiveMobileSubmenu(null);
    setIsLangDropdownOpen(false);
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

const SEARCH_INDEX = [
  // Platforms
  { title: 'Firm AI', category: 'Platform', description: 'Autonomous Enterprise AI Agents & Workflow Automation', url: 'https://www.firm.expert/', external: true, keywords: ['firm', 'ai', 'agents', 'automation', 'enterprise'] },
  { title: 'Sketch Studio', category: 'Platform', description: 'AI-Powered Web & App Design Studio', url: 'https://sketchstudio.dev/', external: true, keywords: ['sketch', 'studio', 'design', 'web', 'app', 'ui', 'ux'] },
  { title: 'Zawr AI Desk', category: 'Platform', description: 'Generative Intelligence & Machine Learning Desk', url: 'https://ai.zawrindustries.com/', external: true, keywords: ['zawr ai', 'machine learning', 'llm', 'generative ai', 'ai desk'] },
  { title: 'Quick Dial CRM', category: 'Platform', description: 'AI CRM, Voice Telephony & Customer Desk', url: 'https://crm.zawrindustries.com/', external: true, keywords: ['quick dial', 'crm', 'telephony', 'voice', 'sales'] },
  { title: 'VelocityOS', category: 'Platform', description: 'Enterprise Cloud Operating System', url: 'https://velocityos.in/', external: true, keywords: ['velocity', 'velocityos', 'cloud os', 'operating platform'] },

  // Industries
  { title: 'IT Services & Cloud Solutions', category: 'Industry', description: 'Enterprise software, Cloud infrastructure & Cyber security', url: '/industries/it-service', external: false, keywords: ['it', 'services', 'cloud', 'software', 'technology', 'cyber security', 'devops'] },
  { title: 'Transport & Logistics', category: 'Industry', description: 'Global freight, supply chain & fleet operations', url: '/industries/transport-and-logistics', external: false, keywords: ['transport', 'logistics', 'freight', 'supply chain', 'cargo', 'shipping'] },
  { title: 'Advanced Manufacturing', category: 'Industry', description: 'Smart manufacturing, robotics & industrial systems', url: '/industries/manufacturing', external: false, keywords: ['manufacturing', 'industrial', 'robotics', 'factory', 'production'] },
  { title: 'Real Estate & Infrastructure', category: 'Industry', description: 'Commercial real estate & smart infrastructure development', url: '/industries/estate', external: false, keywords: ['real estate', 'estate', 'property', 'infrastructure', 'building'] },

  // Company / About
  { title: 'About Zawr Industries', category: 'Company', description: 'Learn about our history, board, and global vision', url: '/about', external: false, keywords: ['about', 'company', 'history', 'who we are', 'zawr'] },
  { title: 'Board of Directors', category: 'Governance', description: 'Executive leadership team and directors', url: '/about#board', external: false, keywords: ['board', 'directors', 'leadership', 'executives', 'management'] },
  { title: 'Our History', category: 'Company', description: 'Our origins and milestone journey', url: '/about#history', external: false, keywords: ['history', 'origins', 'milestones', 'timeline'] },
  { title: 'Our Impact & CSR', category: 'Impact', description: 'Corporate social responsibility & community initiatives', url: '/about#impact', external: false, keywords: ['impact', 'csr', 'social responsibility', 'community'] },
  { title: 'Zawr Blog & Insights', category: 'Publications', description: 'Latest articles, insights, and tech leadership stories', url: '/about/blog', external: false, keywords: ['blog', 'articles', 'insights', 'news', 'stories', 'publications'] },
  { title: 'Vision & Mission', category: 'Company', description: 'Our core philosophy and long-term vision', url: '/about#vision', external: false, keywords: ['vision', 'mission', 'values', 'philosophy'] },
  { title: 'Code of Conduct', category: 'Governance', description: 'Ethical guidelines and enterprise policies', url: '/about#code-of-conduct', external: false, keywords: ['code of conduct', 'ethics', 'compliance', 'governance'] },

  // Careers & Jobs
  { title: 'Careers & Open Positions', category: 'Careers', description: 'Explore open job listings and join our team', url: '/careers', external: false, keywords: ['careers', 'jobs', 'hiring', 'work', 'openings', 'vacancies', 'apply', 'roles'] },
  { title: 'Working at Zawr', category: 'Culture', description: 'Life, benefits, and culture at Zawr Industries', url: '/careers/working-at-zawr', external: false, keywords: ['working at zawr', 'culture', 'benefits', 'life at zawr'] },
  { title: 'Equal Opportunity Policy', category: 'Careers', description: 'Our commitment to diversity, equity & inclusion', url: '/careers/equal-opportunity', external: false, keywords: ['equal opportunity', 'diversity', 'inclusion', 'equity'] },
  { title: 'Freelance Talent Network', category: 'Careers', description: 'Join our global freelance and consultant roster', url: '/careers#freelance-section', external: false, keywords: ['freelance', 'contractor', 'consultant', 'gig', 'freelancer'] },

  // Newsroom
  { title: 'Newsroom & Press Releases', category: 'Newsroom', description: 'Official announcements and corporate news', url: '/newsroom/press-release', external: false, keywords: ['newsroom', 'press', 'announcements', 'media'] },
  { title: 'Corporate Notifications', category: 'Newsroom', description: 'Official corporate updates and circulars', url: '/newsroom/notifications', external: false, keywords: ['notifications', 'updates', 'circulars', 'notices'] },
  { title: 'Media Kit', category: 'Newsroom', description: 'Brand assets, logos, and executive photos', url: '/newsroom/media-kit', external: false, keywords: ['media kit', 'logo', 'brand assets', 'photos', 'press kit'] },

  // Investors
  { title: 'Investor Relations', category: 'Investors', description: 'Financial performance, governance & disclosures', url: '/investors', external: false, keywords: ['investors', 'financials', 'stocks', 'shareholders', 'reports', 'finance'] },

  // Sustainability
  { title: 'Empowerment & Women Leadership', category: 'Sustainability', description: 'Empowerment programs and leadership initiatives', url: '/sustainability/empowerment', external: false, keywords: ['empowerment', 'women', 'sustainability', 'esg'] },
  { title: 'Healthcare Access Program', category: 'Sustainability', description: 'Global healthcare initiatives & community wellness', url: '/sustainability/health', external: false, keywords: ['health', 'healthcare', 'wellness', 'medical'] },
  { title: 'Education & Skill Upliftment', category: 'Sustainability', description: 'Educational scholarships & technical skill building', url: '/sustainability/education', external: false, keywords: ['education', 'skills', 'scholarships', 'training'] },

  // Contact
  { title: 'Contact & Global Directory', category: 'Contact', description: 'Get in touch with department desks around the world', url: '/contact', external: false, keywords: ['contact', 'email', 'phone', 'reach us', 'support', 'help', 'address'] },
  { title: 'Client Relations Desk', category: 'Contact', description: 'Dedicated support for enterprise clients', url: '/contact/client-relations', external: false, keywords: ['client relations', 'client support', 'customer service'] },
  { title: 'Public Relations Desk', category: 'Contact', description: 'Media inquiries & communications desk', url: '/contact/public-relations', external: false, keywords: ['public relations', 'pr', 'media contact'] },
  { title: 'Partner & Creator Network', category: 'Contact', description: 'Partner with Zawr Industries ecosystem', url: '/contact/partner', external: false, keywords: ['partner', 'creators', 'affiliate', 'collaboration'] },
];

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const categoriesList = ['All', 'Platform', 'Industry', 'Careers', 'Newsroom', 'Contact', 'Company'];

  const filteredIndex = useMemo(() => {
    let items = SEARCH_INDEX;
    if (selectedCategory !== 'All') {
      items = items.filter(i => {
        if (selectedCategory === 'Company') {
          return i.category === 'Company' || i.category === 'Governance' || i.category === 'Impact' || i.category === 'Publications';
        }
        return i.category === selectedCategory;
      });
    }

    const q = searchQuery.toLowerCase().trim();
    if (!q) return items;

    return items.filter(item => {
      return item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.keywords.some(k => k.includes(q) || q.includes(k));
    });
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery, selectedCategory]);

  const groupedSections = useMemo(() => {
    const map = new Map<string, typeof SEARCH_INDEX>();
    filteredIndex.forEach(item => {
      let label = item.category;
      if (label === 'Governance' || label === 'Impact' || label === 'Publications') label = 'Company';
      if (!map.has(label)) map.set(label, []);
      map.get(label)!.push(item);
    });
    return map;
  }, [filteredIndex]);

  const navigateToResult = (item: typeof SEARCH_INDEX[0]) => {
    if (item.external) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    } else {
      router.push(item.url);
    }
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchError('');
  };

  const handleKeyDownInSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredIndex.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredIndex.length) % Math.max(1, filteredIndex.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredIndex[selectedIndex]) {
        navigateToResult(filteredIndex[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredIndex[selectedIndex]) {
      navigateToResult(filteredIndex[selectedIndex]);
    }
  };

  const isDarkPage = isMounted && (pathname.startsWith('/about') || pathname.startsWith('/careers') || pathname.startsWith('/contact/client-relations') || pathname.startsWith('/contact/sponsorship') || pathname.startsWith('/investors') || pathname.startsWith('/newsroom/events') || pathname.startsWith('/industries/it-service') || pathname === '/contact/partner/creator-partner');
  const isLightPage = isMounted && (pathname === '/sustainability/empowerment' || pathname === '/sustainability/health' || pathname === '/sustainability/education' || pathname.startsWith('/industries/transport-and-logistics') || pathname.startsWith('/industries/manufacturing'));

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
            <Link href="/industries/it-service" onClick={closeMobileMenu}>IT Service</Link>
            <Link href="/industries/transport-and-logistics" onClick={closeMobileMenu}>Transport and Logistics</Link>
            <Link href="/industries/manufacturing" onClick={closeMobileMenu}>Manufacturing</Link>
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

      {/* Full Screen Search Overlay with Previous UI/UX + Categorized Structured Results */}
      {isSearchOpen && (
        <div className="search-overlay" onClick={() => setIsSearchOpen(false)}>
          <button className="search-close" onClick={() => { setIsSearchOpen(false); setSearchError(''); }}>×</button>
          
          <div 
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDownInSearch}
            style={{ 
              width: '90%', 
              maxWidth: '850px', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1.5rem', 
              maxHeight: '88vh',
              position: 'relative'
            }}
          >
            {/* Original Large Underlined Search Input */}
            <form className="search-form" onSubmit={handleSearchSubmit} style={{ position: 'relative', width: '100%', borderBottom: '2px solid #ffffff', display: 'flex', alignItems: 'center' }}>
              <input 
                suppressHydrationWarning
                type="text" 
                placeholder="Search Zawr Industries..." 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setSearchError(''); }}
                autoFocus
                style={{ flex: 1, background: 'transparent', border: 'none', color: '#ffffff', fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)', padding: '1rem 0', outline: 'none', fontWeight: 300 }}
              />
              <button 
                suppressHydrationWarning 
                type="submit" 
                style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '1.125rem', fontWeight: 600, padding: '0 1rem' }}
              >
                Search
              </button>
            </form>

            {/* Filter Tags ("SEARCHING FOR") */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a1a1aa', marginRight: '0.25rem' }}>
                Searching For:
              </span>
              {categoriesList.map(cat => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '0.35rem 0.95rem',
                      borderRadius: '9999px',
                      fontSize: '0.825rem',
                      fontWeight: isActive ? 600 : 400,
                      backgroundColor: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.08)',
                      color: isActive ? '#000000' : '#d4d4d8',
                      border: '1px solid',
                      borderColor: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.15)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Scrollable Results Section (Clean minimal rows: NO cards, NO outlines, NO emojis) */}
            <div className="custom-scrollbar" style={{ maxHeight: '55vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2rem', paddingRight: '0.5rem' }}>
              {filteredIndex.length === 0 ? (
                <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#71717a', fontSize: '0.95rem' }}>
                  No results found matching &quot;{searchQuery}&quot;.
                </div>
              ) : (
                Array.from(groupedSections.entries()).map(([sectionLabel, sectionItems]) => (
                  <div key={sectionLabel} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {/* Section Header - Plain uppercase text, NO emojis */}
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#71717a', marginBottom: '0.25rem' }}>
                      {sectionLabel === 'Platform' && 'Platforms & Products'}
                      {sectionLabel === 'Industry' && 'Industries & Solutions'}
                      {sectionLabel === 'Careers' && 'Careers & Talent'}
                      {sectionLabel === 'Newsroom' && 'Newsroom & Publications'}
                      {sectionLabel === 'Contact' && 'Contact & Directory'}
                      {sectionLabel === 'Company' && 'Governance & Company'}
                      {sectionLabel === 'Investors' && 'Investors'}
                      {sectionLabel === 'Sustainability' && 'Sustainability'}
                    </div>

                    {/* Section Item Rows - NO cards, NO outlines */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {sectionItems.map(item => {
                        const itemGlobalIdx = filteredIndex.indexOf(item);
                        const isSelected = itemGlobalIdx === selectedIndex;

                        return (
                          <div
                            key={item.title}
                            onClick={() => navigateToResult(item)}
                            onMouseEnter={() => setSelectedIndex(itemGlobalIdx)}
                            style={{
                              padding: '0.85rem 0',
                              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '1rem',
                              transition: 'opacity 0.15s ease',
                              opacity: isSelected ? 1 : 0.75
                            }}
                          >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                              <div style={{ fontSize: '1.05rem', fontWeight: 500, color: '#ffffff' }}>
                                {item.title}
                              </div>
                              <div style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>
                                {item.description}
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, color: '#ffffff', fontSize: '0.85rem', fontWeight: 500, opacity: isSelected ? 1 : 0.45, transition: 'all 0.2s' }}>
                              <span>{item.external ? 'External' : 'Navigate'}</span>
                              <svg 
                                width="18" 
                                height="18" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="1.6" 
                                strokeLinecap="square" 
                                strokeLinejoin="miter"
                                style={{ transform: isSelected ? 'translate(2px, -2px)' : 'none', transition: 'transform 0.2s' }}
                              >
                                <line x1="6" y1="18" x2="18" y2="6"></line>
                                <polyline points="7 6 18 6 18 17"></polyline>
                              </svg>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Keyboard Shortcut Footer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#a1a1aa', padding: '0 0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <kbd style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '4px', padding: '0.1rem 0.4rem', color: '#ffffff' }}>↓</kbd>
                  <kbd style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '4px', padding: '0.1rem 0.4rem', color: '#ffffff' }}>↑</kbd>
                  <span>Move</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <kbd style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '4px', padding: '0.1rem 0.4rem', color: '#ffffff' }}>↵</kbd>
                  <span>Select</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <kbd style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '4px', padding: '0.1rem 0.4rem', color: '#ffffff' }}>ESC</kbd>
                  <span>Quit</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

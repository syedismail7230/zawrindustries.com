'use client';

import Link from 'next/link';
import { Poppins } from 'next/font/google';
import { useState } from 'react';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '700'] });

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`Search functionality will be integrated here for: ${searchQuery}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="header">
      <div className={`logo-container ${poppins.className}`}>
        <Link href="/">
          <span className="logo-bold">ZAWR</span>
          <span className="logo-regular">INDUSTRIES</span>
        </Link>
      </div>

      <nav className="nav-links">
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
        <div className="nav-item">
          Contact
          <div className="dropdown">
            <Link href="/contact/careers">Careers</Link>
            <Link href="/contact/investors">Investors</Link>
            <Link href="/contact/client-relations">Client Relations</Link>
            <Link href="/contact/public-relations">Public Relations</Link>
          </div>
        </div>
      </nav>

      <div className="header-actions">
        <button className="icon-btn" aria-label="Search" onClick={() => setIsSearchOpen(!isSearchOpen)}>
          <svg viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
        <a href="tel:+919880464078" className="icon-btn" aria-label="Phone">
          <svg viewBox="0 0 24 24">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
        </a>
      </div>

      <button className="mobile-menu-btn" aria-label="Menu">
        ☰
      </button>

      {/* Full Screen Search Overlay */}
      {isSearchOpen && (
        <div className="search-overlay">
          <button className="search-close" onClick={() => setIsSearchOpen(false)}>×</button>
          <form className="search-form" onSubmit={handleSearchSubmit}>
            <input 
              type="text" 
              placeholder="Search Zawr Industries..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button type="submit">Search</button>
          </form>
        </div>
      )}
    </header>
  );
}

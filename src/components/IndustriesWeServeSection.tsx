'use client';

import React, { useState } from 'react';

interface IndustryItem {
  id: string;
  name: string;
  category?: string;
  image: string;
}

const defaultIndustries: IndustryItem[] = [
  {
    id: 'luxury',
    name: 'Luxury & Retail',
    category: 'Digital Commerce & Portals',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'corporate',
    name: 'Corporate & Finance',
    category: 'Enterprise & Banking Systems',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'mobile-tech',
    name: 'Smart Devices & Mobile',
    category: 'Consumer Hardware & Apps',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'semiconductors',
    name: 'AI & Semiconductors',
    category: 'Neural Processors & Hardware',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce & Logistics',
    category: 'Order Dispatch & Tracking',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'hospitality',
    name: 'FMCG & Hospitality',
    category: 'Food, Beverage & Outlets',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'maritime',
    name: 'Maritime & Freight',
    category: 'Global Fleet Telemetry',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'warehousing',
    name: 'Industrial Warehousing',
    category: 'Robotics & AGV Systems',
    image: 'https://images.unsplash.com/photo-1586528116493-a029325540fa?q=80&w=800&auto=format&fit=crop',
  },
];

export function IndustriesWeServeSection({
  industries = defaultIndustries,
  title = "Industries we serve",
}: {
  industries?: IndustryItem[];
  title?: string;
}) {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const handleAiConsultantClick = () => {
    // Open SupportWidget AI chat iframe
    window.postMessage('widget-open', '*');
  };

  return (
    <section className="iws-container">
      <style dangerouslySetInnerHTML={{ __html: `
        .iws-container {
          position: relative;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 2rem 0 2rem;
          box-sizing: border-box;
          background-color: #000000;
          color: #ffffff;
          font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow: visible;
        }

        .iws-heading {
          font-size: clamp(2rem, 4.5vw, 3rem);
          font-weight: 300;
          color: #ffffff;
          margin-bottom: 4rem;
          letter-spacing: -0.02em;
          font-family: Inter, sans-serif;
          opacity: 0.85;
          text-align: center;
        }

        /* Vertical Accordion Gallery */
        .iws-accordion {
          display: flex;
          gap: 0.6rem;
          width: 100%;
          max-width: 1000px;
          height: clamp(340px, 42vh, 460px);
          justify-content: center;
          align-items: stretch;
          margin-bottom: 4.5rem;
          position: relative;
          z-index: 10;
        }

        .iws-card {
          position: relative;
          flex: 1 1 52px;
          min-width: 44px;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          transition: flex 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background-color: #0f0f15;
        }

        .iws-card.iws-active {
          flex: 4.5 1 260px;
          border-color: rgba(168, 85, 247, 0.4);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(168, 85, 247, 0.2);
        }

        .iws-card-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.5s ease;
          filter: brightness(0.5) contrast(1.05) saturate(0.8);
        }

        .iws-card.iws-active .iws-card-bg {
          filter: brightness(0.82) contrast(1.1) saturate(1.1);
          transform: scale(1.04);
        }

        .iws-card-vignette {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.25) 55%, rgba(0, 0, 0, 0.1) 100%);
          pointer-events: none;
        }

        /* Collapsed Vertical Label */
        .iws-vertical-label {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 12;
          pointer-events: none;
          transition: opacity 0.25s ease;
        }

        .iws-vertical-label span {
          writing-mode: vertical-rl;
          transform: rotate(180deg);
          font-size: clamp(0.78rem, 1.1vw, 0.95rem);
          font-weight: 400;
          letter-spacing: 0.04em;
          color: rgba(255, 255, 255, 0.85);
          white-space: nowrap;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.9);
          font-family: Inter, sans-serif;
        }

        .iws-card.iws-active .iws-vertical-label {
          opacity: 0;
        }

        /* Active Card Info Badge */
        .iws-card-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 1.6rem 1.4rem;
          z-index: 15;
          pointer-events: none;
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.35s ease 0.1s, transform 0.35s ease 0.1s;
        }

        .iws-card.iws-active .iws-card-content {
          opacity: 1;
          transform: translateY(0);
        }

        .iws-card-title {
          font-size: clamp(1.05rem, 1.7vw, 1.4rem);
          font-weight: 500;
          color: #ffffff;
          margin: 0 0 0.35rem 0;
          line-height: 1.2;
          letter-spacing: -0.02em;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.9);
          font-family: Inter, sans-serif;
        }

        .iws-card-category {
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(192, 132, 252, 0.9);
          margin: 0;
          font-weight: 500;
        }

        /* AI Consultant Pill Search Button Overlapping Dome Top Apex */
        .iws-button-wrapper {
          position: relative;
          z-index: 30;
          margin-bottom: -22px; /* Overlaps top curve of dome */
        }

        .iws-ai-pill {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.9rem 2.4rem;
          border-radius: 9999px;
          background: rgba(10, 10, 15, 0.92);
          backdrop-filter: blur(20px);
          color: rgba(255, 255, 255, 0.8);
          font-size: clamp(0.9rem, 1.2vw, 1.05rem);
          font-weight: 400;
          cursor: pointer;
          outline: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1.5px solid transparent;
          background-image: linear-gradient(rgba(10, 10, 15, 0.94), rgba(10, 10, 15, 0.94)), 
                            linear-gradient(135deg, #a855f7 0%, #3b82f6 50%, #ec4899 100%);
          background-origin: border-box;
          background-clip: padding-box, border-box;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8), 0 0 30px rgba(168, 85, 247, 0.3);
          font-family: Inter, sans-serif;
        }

        .iws-ai-pill:hover {
          color: #ffffff;
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.9), 0 0 45px rgba(168, 85, 247, 0.5), 0 0 25px rgba(59, 130, 246, 0.4);
        }

        .iws-search-icon {
          width: 19px;
          height: 19px;
          stroke: #c084fc;
          stroke-width: 2.2;
          fill: none;
          flex-shrink: 0;
          transition: transform 0.3s ease;
        }

        .iws-ai-pill:hover .iws-search-icon {
          transform: scale(1.15) rotate(-6deg);
        }

        .iws-sparkle {
          font-size: 1.15rem;
          background: linear-gradient(135deg, #c084fc 0%, #60a5fa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline-block;
          animation: iws-sparkle-glow 2.5s infinite ease-in-out;
        }

        @keyframes iws-sparkle-glow {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.85; }
          50% { transform: scale(1.25) rotate(14deg); opacity: 1; }
        }

        /* ── 100VW FULL-BLEED PERFECT CURVED NEON DOME ARC ── */
        .iws-dome-fullbleed-wrapper {
          position: relative;
          width: 100vw;
          left: 50%;
          right: 50%;
          margin-left: -50vw;
          margin-right: -50vw;
          height: clamp(340px, 45vh, 480px);
          z-index: 10;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          overflow: hidden;
          pointer-events: none;
        }

        .iws-dome-full-svg {
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        @media (max-width: 768px) {
          .iws-container {
            padding: 1rem 1rem 0 1rem;
          }
          .iws-accordion {
            flex-wrap: wrap;
            height: auto;
            gap: 0.5rem;
          }
          .iws-card {
            flex: 1 1 calc(50% - 0.5rem);
            height: 190px;
            min-width: 130px;
          }
          .iws-card.iws-active {
            flex: 1 1 100%;
            height: 250px;
          }
          .iws-vertical-label {
            display: none;
          }
          .iws-card-content {
            opacity: 1;
            transform: translateY(0);
          }
          .iws-dome-fullbleed-wrapper {
            height: 260px;
          }
        }
      ` }} />

      {/* Section Heading matching IT Services typography */}
      <h2 className="iws-heading">{title}</h2>

      {/* Vertical Accordion Cards Gallery */}
      <div className="iws-accordion">
        {industries.map((ind, i) => (
          <div
            key={ind.id || i}
            className={`iws-card ${activeIndex === i ? 'iws-active' : ''}`}
            onMouseEnter={() => setActiveIndex(i)}
            onClick={() => setActiveIndex(i)}
          >
            {/* Background Image */}
            <div
              className="iws-card-bg"
              style={{ backgroundImage: `url('${ind.image}')` }}
            />
            
            {/* Dark Vignette Overlay */}
            <div className="iws-card-vignette" />

            {/* Collapsed Vertical Label */}
            <div className="iws-vertical-label">
              <span>{ind.name}</span>
            </div>

            {/* Active Card Info */}
            <div className="iws-card-content">
              <h3 className="iws-card-title">{ind.name}</h3>
              {ind.category && <p className="iws-card-category">{ind.category}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* AI Consultant Pill Search Button (Centered & Overlapping Top Arc Apex) */}
      <div className="iws-button-wrapper">
        <button
          className="iws-ai-pill"
          onClick={handleAiConsultantClick}
          aria-label="Ask our AI consultant"
        >
          <svg className="iws-search-icon" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <span>Still got doubt? Ask our AI consultant</span>
          <span className="iws-sparkle">✨</span>
        </button>
      </div>

      {/* ── 100VW FULL-BLEED PERFECT CURVED NEON DOME ARC ── */}
      <div className="iws-dome-fullbleed-wrapper">
        <svg viewBox="0 0 1400 450" preserveAspectRatio="none" className="iws-dome-full-svg">
          <defs>
            {/* Rich Radial Dome Glow Gradient */}
            <radialGradient id="vividDomeGlow" cx="50%" cy="0%" r="85%">
              <stop offset="0%" stopColor="#4338ca" stopOpacity="0.95" />
              <stop offset="25%" stopColor="#2563eb" stopOpacity="0.82" />
              <stop offset="55%" stopColor="#1e1b4b" stopOpacity="0.55" />
              <stop offset="85%" stopColor="#090a0f" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>

            {/* Neon Glowing Edge Gradient */}
            <linearGradient id="domeRimGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
              <stop offset="15%" stopColor="#60a5fa" stopOpacity="0.75" />
              <stop offset="50%" stopColor="#c084fc" stopOpacity="1" />
              <stop offset="85%" stopColor="#ec4899" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>

            <filter id="softDomeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="12" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Smooth Curved Dome Arc Fill */}
          <path d="M -100 450 Q 700 8 1500 450 Z" fill="url(#vividDomeGlow)" />

          {/* Neon Rim Line along top curve */}
          <path d="M -100 450 Q 700 8 1500 450" fill="none" stroke="url(#domeRimGlow)" strokeWidth="3.5" filter="url(#softDomeGlow)" />
        </svg>
      </div>
    </section>
  );
}

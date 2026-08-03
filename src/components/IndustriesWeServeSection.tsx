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
    category: 'Fashion & E-Commerce',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'corporate',
    name: 'Corporate & Finance',
    category: 'Enterprise & Banking',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'mobile-tech',
    name: 'Smart Devices & Mobile',
    category: 'Consumer Electronics',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'semiconductors',
    name: 'AI & Semiconductors',
    category: 'Hardware & Microchips',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce & Logistics',
    category: 'Supply Chain & Delivery',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'hospitality',
    name: 'FMCG & Hospitality',
    category: 'Food, Beverage & Retail',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'maritime',
    name: 'Maritime & Logistics',
    category: 'Global Freight & Port Tech',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'warehousing',
    name: 'Industrial Warehousing',
    category: 'Robotics & Automation',
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
    // Post message to open SupportWidget AI Chat
    window.postMessage('widget-open', '*');
  };

  return (
    <section className="iws-section">
      <style dangerouslySetInnerHTML={{ __html: `
        .iws-section {
          position: relative;
          background-color: #000000;
          color: #ffffff;
          padding: 6rem 1.5rem 12rem 1.5rem;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: var(--font-plus-jakarta), Inter, -apple-system, sans-serif;
        }

        .iws-title {
          font-size: clamp(2rem, 4vw, 3.2rem);
          font-weight: 300;
          letter-spacing: -0.03em;
          color: #ffffff;
          margin: 0 0 3.5rem 0;
          text-align: center;
        }

        /* Gallery Container */
        .iws-gallery {
          display: flex;
          gap: 0.75rem;
          width: 100%;
          max-width: 1080px;
          height: clamp(340px, 45vh, 460px);
          justify-content: center;
          align-items: stretch;
          margin-bottom: 4rem;
          position: relative;
          z-index: 10;
        }

        /* Individual Vertical Card */
        .iws-card {
          position: relative;
          flex: 1 1 54px;
          min-width: 48px;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: flex 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s ease, filter 0.3s ease;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .iws-card.iws-active {
          flex: 4 1 240px;
          border-color: rgba(255, 255, 255, 0.25);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(168, 85, 247, 0.15);
        }

        .iws-card-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.5s ease;
          filter: brightness(0.55) contrast(1.05) saturate(0.85);
        }

        .iws-card.iws-active .iws-card-bg {
          filter: brightness(0.85) contrast(1.1) saturate(1.1);
          transform: scale(1.04);
        }

        .iws-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.2) 60%, rgba(0, 0, 0, 0.1) 100%);
          pointer-events: none;
        }

        /* Vertical Collapsed Label */
        .iws-vertical-label {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 12;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }

        .iws-vertical-label span {
          writing-mode: vertical-rl;
          transform: rotate(180deg);
          font-size: clamp(0.75rem, 1.1vw, 0.95rem);
          font-weight: 400;
          letter-spacing: 0.05em;
          color: rgba(255, 255, 255, 0.85);
          white-space: nowrap;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.9);
        }

        .iws-card.iws-active .iws-vertical-label {
          opacity: 0;
        }

        /* Active Card Content */
        .iws-card-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 1.5rem 1.25rem;
          z-index: 15;
          pointer-events: none;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.35s ease 0.1s, transform 0.35s ease 0.1s;
        }

        .iws-card.iws-active .iws-card-content {
          opacity: 1;
          transform: translateY(0);
        }

        .iws-card-title {
          font-size: clamp(1rem, 1.6vw, 1.35rem);
          font-weight: 500;
          color: #ffffff;
          margin: 0 0 0.35rem 0;
          line-height: 1.2;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.9);
        }

        .iws-card-category {
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(255, 255, 255, 0.65);
          margin: 0;
        }

        /* Pill AI Consultant Button */
        .iws-ai-button-wrapper {
          position: relative;
          z-index: 20;
          margin-bottom: 2rem;
        }

        .iws-ai-button {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.85rem 2rem;
          border-radius: 9999px;
          background: rgba(13, 10, 24, 0.85);
          backdrop-filter: blur(16px);
          color: rgba(255, 255, 255, 0.7);
          font-size: clamp(0.9rem, 1.2vw, 1.05rem);
          font-weight: 400;
          cursor: pointer;
          outline: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1.5px solid transparent;
          background-image: linear-gradient(rgba(13, 10, 24, 0.9), rgba(13, 10, 24, 0.9)), 
                            linear-gradient(135deg, #e056fd 0%, #38ef7d 50%, #8a2be2 100%);
          background-origin: border-box;
          background-clip: padding-box, border-box;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(224, 86, 253, 0.15);
        }

        .iws-ai-button:hover {
          color: #ffffff;
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6), 0 0 35px rgba(224, 86, 253, 0.35), 0 0 20px rgba(56, 239, 125, 0.25);
        }

        .iws-search-icon {
          width: 18px;
          height: 18px;
          stroke: #c084fc;
          stroke-width: 2;
          fill: none;
          flex-shrink: 0;
          transition: transform 0.3s ease;
        }

        .iws-ai-button:hover .iws-search-icon {
          transform: scale(1.15) rotate(-5deg);
        }

        .iws-sparkle-icon {
          font-size: 1.1rem;
          background: linear-gradient(135deg, #f472b6 0%, #a855f7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline-block;
          animation: iws-pulse-sparkle 2.5s infinite ease-in-out;
        }

        @keyframes iws-pulse-sparkle {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.8; }
          50% { transform: scale(1.25) rotate(12deg); opacity: 1; }
        }

        /* Glowing Neon Gradient Dome Arc at Bottom */
        .iws-bottom-dome-container {
          position: absolute;
          bottom: -40px;
          left: 50%;
          transform: translateX(-50%);
          width: 140vw;
          max-width: 1600px;
          height: 280px;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: flex-end;
        }

        .iws-bottom-dome {
          width: 100%;
          height: 480px;
          border-radius: 50% 50% 0 0 / 100% 100% 0 0;
          background: radial-gradient(circle at 50% 0%, 
            rgba(168, 85, 247, 0.75) 0%, 
            rgba(99, 102, 241, 0.65) 25%, 
            rgba(37, 99, 235, 0.45) 50%, 
            rgba(15, 23, 42, 0) 80%);
          filter: blur(25px);
          opacity: 0.85;
        }

        .iws-bottom-dome-line {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(56, 189, 248, 0.6) 20%, 
            rgba(168, 85, 247, 0.9) 50%, 
            rgba(244, 114, 182, 0.6) 80%, 
            transparent 100%);
          box-shadow: 0 0 15px #a855f7, 0 0 30px #38bdf8;
        }

        @media (max-width: 768px) {
          .iws-gallery {
            flex-wrap: wrap;
            height: auto;
            gap: 0.5rem;
          }
          .iws-card {
            flex: 1 1 calc(50% - 0.5rem);
            height: 180px;
            min-width: 130px;
          }
          .iws-card.iws-active {
            flex: 1 1 100%;
            height: 240px;
          }
          .iws-vertical-label {
            display: none;
          }
          .iws-card-content {
            opacity: 1;
            transform: translateY(0);
          }
          .iws-bottom-dome-container {
            height: 200px;
            width: 180vw;
          }
        }
      ` }} />

      {/* Section Heading */}
      <h2 className="iws-title">{title}</h2>

      {/* Vertical Accordion Gallery */}
      <div className="iws-gallery">
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
            <div className="iws-card-overlay" />

            {/* Vertical Label (visible when collapsed on desktop) */}
            <div className="iws-vertical-label">
              <span>{ind.name}</span>
            </div>

            {/* Expanded Active Card Info */}
            <div className="iws-card-content">
              <h3 className="iws-card-title">{ind.name}</h3>
              {ind.category && <p className="iws-card-category">{ind.category}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* AI Consultant Pill Search Button */}
      <div className="iws-ai-button-wrapper">
        <button
          className="iws-ai-button"
          onClick={handleAiConsultantClick}
          aria-label="Ask our AI consultant"
        >
          <svg className="iws-search-icon" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <span>Still got doubt? Ask our AI consultant</span>
          <span className="iws-sparkle-icon">✨</span>
        </button>
      </div>

      {/* Glowing Neon Gradient Dome Arc at Bottom */}
      <div className="iws-bottom-dome-container">
        <div className="iws-bottom-dome">
          <div className="iws-bottom-dome-line" />
        </div>
      </div>
    </section>
  );
}

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { MethodologySection, PhaseDetail } from '@/components/MethodologySection';
import { IndustriesSection } from '@/components/IndustriesSection';
import { FAQSection } from '@/components/FAQSection';

interface Offering {
  title: string;
  description: string;
  deliverables: string[];
}

interface FAQ {
  q: string;
  a: string;
}

interface Industry {
  name: string;
  image: string;
  projectName?: string;
  projectDescription?: string;
}

interface ServiceDetail {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  challenges: string[];
  offerings: Offering[];
  methodology: PhaseDetail[];
  industries: Industry[];
  faqs: FAQ[];
}

function ChallengesSection({ challenges }: { challenges: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const barrelRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const isHovered = useRef(false);

  const targetIndex = useRef(0);
  const currentIndex = useRef(0);

  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const itemSpacing = 35; 
  const radius = 180; 
  const centerIdx = 2; 

  useEffect(() => {
    let animationFrameId: number;

    const tick = () => {
      const easing = 0.08;
      currentIndex.current += (targetIndex.current - currentIndex.current) * easing;

      const currentRotation = (currentIndex.current - centerIdx) * itemSpacing;

      if (barrelRef.current) {
        barrelRef.current.style.transform = `translateZ(-${radius}px) rotateX(${-currentRotation}deg)`;

        const items = barrelRef.current.querySelectorAll('.barrel-item');
        let closestIndex = 0;
        let minDistance = Infinity;

        items.forEach((item, index) => {
          const itemAngle = (index - centerIdx) * itemSpacing;
          const diff = itemAngle - currentRotation;

          const cosVal = Math.max(0, Math.cos((diff * Math.PI) / 180));
          const opacity = Math.max(0.18, Math.pow(cosVal, 2.8));
          
          const element = item as HTMLElement;
          element.style.opacity = `${opacity}`;

          const activeFraction = Math.max(0, 1 - Math.abs(diff / itemSpacing));
          element.style.color = `rgba(255, 255, 255, ${0.18 + activeFraction * 0.82})`;

          const dist = Math.abs(diff);
          if (dist < minDistance) {
            minDistance = dist;
            closestIndex = index;
          }

          if (dist < itemSpacing / 2) {
            element.classList.add('active-item');
          } else {
            element.classList.remove('active-item');
          }
        });

        if (closestIndex !== activeIndexRef.current) {
          activeIndexRef.current = closestIndex;
          setActiveIndex(closestIndex);
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    const handleScroll = () => {
      if (isHovered.current) return;

      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const elementHeight = rect.height;
      const elementTop = rect.top;
      const elementCenter = elementTop + elementHeight / 2;

      const startPoint = viewportHeight * 0.82;
      const endPoint = viewportHeight * 0.18;
      const progress = (elementCenter - startPoint) / (endPoint - startPoint);
      const boundedProgress = Math.max(0, Math.min(1, progress));

      targetIndex.current = boundedProgress * (challenges.length - 1);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const viewport = viewportRef.current;
    const handleNativeWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetIndex.current += e.deltaY * 0.0035;
      targetIndex.current = Math.min(challenges.length - 1, Math.max(0, targetIndex.current));
    };

    if (viewport) {
      viewport.addEventListener('wheel', handleNativeWheel, { passive: false });
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleScroll);
      if (viewport) {
        viewport.removeEventListener('wheel', handleNativeWheel);
      }
    };
  }, [challenges.length]);

  return (
    <div 
      ref={containerRef}
      style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '11rem 6%', 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '4rem',
        alignItems: 'center',
        position: 'relative',
        borderTop: '1px solid rgba(255, 255, 255, 0.04)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.04)'
      }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        .barrel-viewport {
          position: relative;
          perspective: 1200px;
          height: 380px;
          width: 100%;
          overflow: visible;
          display: flex;
          align-items: center;
        }
        .barrel-cylinder {
          transform-style: preserve-3d;
          position: relative;
          width: 100%;
          height: 60px;
          will-change: transform;
        }
        .barrel-item {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          height: 100%;
          display: flex;
          align-items: center;
          font-size: clamp(1.4rem, 2.8vw, 2.2rem);
          color: rgba(255, 255, 255, 0.18);
          font-weight: 400;
          transform-style: preserve-3d;
          backface-visibility: hidden;
          cursor: pointer;
          user-select: none;
          transition: font-weight 0.4s ease, text-shadow 0.4s ease;
        }
        .barrel-item.active-item {
          font-weight: 600;
          color: #ffffff;
          text-shadow: 0 0 25px rgba(255, 255, 255, 0.4), 0 0 10px rgba(59, 130, 246, 0.3);
        }
      `}} />

      {/* Left Column: Sticky Title Stack */}
      <div style={{ 
        flex: '1 1 350px', 
        position: 'sticky', 
        top: '35vh', 
        height: 'fit-content',
        zIndex: 5
      }}>
        <h2 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
          fontWeight: 400,
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          margin: 0,
          background: 'linear-gradient(135deg, #3b82f6 0%, #ec4899 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Business<br />
          Challenges<br />
          We Solve
        </h2>
      </div>

      {/* Right Column: 3D Cylindrical Barrel Roll list */}
      <div style={{ flex: '1 1 500px', display: 'flex', alignItems: 'center', position: 'relative' }}>
        <div 
          ref={viewportRef}
          className="barrel-viewport"
          onMouseEnter={() => { isHovered.current = true; }}
          onMouseLeave={() => { isHovered.current = false; }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '25%',
            background: 'linear-gradient(to bottom, #000000 0%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 10
          }} />

          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '25%',
            background: 'linear-gradient(to top, #000000 0%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 10
          }} />

          <div ref={barrelRef} className="barrel-cylinder">
            {challenges.map((challenge, idx) => {
              const itemAngle = (idx - centerIdx) * itemSpacing;
              return (
                <div 
                  key={idx}
                  className="barrel-item"
                  style={{
                    transform: `rotateX(${itemAngle}deg) translateZ(${radius}px)`,
                  }}
                  onClick={() => {
                    targetIndex.current = idx;
                  }}
                >
                  {challenge}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function OfferingsSection({ serviceName, offerings }: { serviceName: string; offerings: Offering[] }) {
  const [flippedCards, setFlippedCards] = useState<boolean[]>([]);

  useEffect(() => {
    if (offerings) {
      setFlippedCards(new Array(offerings.length).fill(false));
    }
  }, [offerings]);

  const toggleFlip = (idx: number) => {
    setFlippedCards(prev => {
      const copy = [...prev];
      copy[idx] = !copy[idx];
      return copy;
    });
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 6% 8rem 6%' }}>
      <style dangerouslySetInnerHTML={{__html: `
        .offerings-section-title {
          font-size: clamp(2rem, 4.5vw, 3.2rem);
          font-weight: 400;
          text-align: center;
          color: #ffffff;
          margin-bottom: 4.5rem;
          letter-spacing: -0.02em;
        }
        .offerings-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 2rem;
          width: 100%;
        }
        @media (min-width: 640px) {
          .offerings-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .offerings-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .flip-card-container {
          perspective: 1200px;
          height: 440px;
          width: 100%;
        }
        .flip-card {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .flip-card.flipped {
          transform: rotateY(180deg);
        }
        .flip-card-front, .flip-card-back {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }
        .flip-card-front {
          background: linear-gradient(135deg, #072a6b 0%, #211c4f 45%, #5a1161 100%);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 2.8rem 2.4rem;
          justify-content: space-between;
          cursor: pointer;
        }
        .flip-card-back {
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.06);
          color: #000000;
          padding: 2.2rem 2rem;
          transform: rotateY(180deg);
          justify-content: flex-start;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
          cursor: pointer;
          overflow-y: auto;
        }
        .offering-title {
          font-size: clamp(1.5rem, 2vw, 1.85rem);
          font-weight: 300;
          color: #ffffff;
          line-height: 1.25;
          letter-spacing: -0.015em;
          font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
        }
        .offering-arrow {
          align-self: flex-end;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          opacity: 0.95;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
        }
        .flip-card-container:hover .offering-arrow {
          transform: translate(6px, -6px);
          opacity: 1;
        }
        .back-desc {
          font-size: 0.95rem;
          line-height: 1.55;
          color: #222222;
          font-weight: 400;
          margin: 0 0 1rem 0;
        }
        .back-subtitle {
          font-size: 1.02rem;
          font-weight: 700;
          color: #000000;
          margin: 0 0 0.65rem 0;
        }
        .back-list {
          list-style-type: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }
        .back-list-item {
          font-size: 0.9rem;
          line-height: 1.45;
          color: #333333;
          position: relative;
          padding-left: 1.25rem;
        }
        .back-list-item::before {
          content: "•";
          position: absolute;
          left: 0;
          top: 0;
          color: #000000;
          font-size: 1rem;
        }
      `}} />

      <h2 className="offerings-section-title">
        {serviceName} Offerings
      </h2>

      <div className="offerings-grid">
        {offerings.map((offering, idx) => (
          <div key={idx} className="flip-card-container" onClick={() => toggleFlip(idx)}>
            <div className={`flip-card ${flippedCards[idx] ? 'flipped' : ''}`}>
              
              {/* Front Side */}
              <div className="flip-card-front">
                <div className="offering-title">
                  {offering.title}
                </div>
                <div className="offering-arrow">
                  <svg 
                    width="60" 
                    height="60" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </div>
              </div>

              {/* Back Side */}
              <div className="flip-card-back">
                <p className="back-desc">
                  {offering.description}
                </p>
                {offering.deliverables && offering.deliverables.length > 0 && (
                  <>
                    <div className="back-subtitle">
                      Deliverables
                    </div>
                    <ul className="back-list">
                      {offering.deliverables.map((item, itemIdx) => (
                        <li key={itemIdx} className="back-list-item">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ServicePageClient({ service, slug }: { service: ServiceDetail; slug: string }) {
  const [heroSrc, setHeroSrc] = useState(`/assets/${slug}-hero.png`);

  useEffect(() => {
    if (slug) {
      setHeroSrc(`/assets/${slug}-hero.png`);
    }
  }, [slug]);

  return (
    <div style={{ backgroundColor: '#000000', color: '#ffffff', fontFamily: 'Inter, sans-serif', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* Hidden image element to detect fallback error automatically */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src={heroSrc} 
        alt="hidden-fallback-detector" 
        style={{ display: 'none' }}
        onError={() => setHeroSrc('/assets/cloud-services-hero.png')}
      />

      <style dangerouslySetInnerHTML={{__html: `
        .neon-btn {
          background: #000000;
          color: #ffffff;
          border: 2px solid transparent;
          background-image: linear-gradient(#000000, #000000), linear-gradient(135deg, #3b82f6, #ec4899);
          background-origin: border-box;
          background-clip: padding-box, border-box;
          border-radius: 100px;
          padding: 0.85rem 2.2rem;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
          display: inline-block;
          text-align: center;
        }
        .neon-btn:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.5), 0 0 25px rgba(236, 72, 153, 0.4);
          background-image: linear-gradient(#111111, #111111), linear-gradient(135deg, #ec4899, #3b82f6);
        }
      `}} />

      {/* Hero section */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        backgroundImage: `url("${heroSrc}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        padding: '0 clamp(1rem, 6vw, 8%) 8vh clamp(1rem, 6vw, 8%)',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0) 100%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '800px' }}>
          <h1 style={{
            fontSize: 'clamp(2.3rem, 5.5vw, 5rem)',
            fontWeight: 300,
            color: '#ffffff',
            margin: 0,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            textShadow: '0 4px 20px rgba(0,0,0,0.6)',
          }}>
            {service.name}
          </h1>
          <div style={{ marginTop: '2rem' }}>
            <a
              href={`https://wa.me/919880464078?text=${encodeURIComponent(`Hi, I would like to know more about your ${service.name} services.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <button className="neon-btn" suppressHydrationWarning>
                Talk to Expert
              </button>
            </a>
          </div>
        </div>
      </div>

      {/* Tagline / Intro section */}
      <div style={{ maxWidth: '850px', margin: '0 auto', padding: '7rem 6% 3rem 6%', textAlign: 'center', position: 'relative' }}>
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none',
          zIndex: 1
        }} />

        <h2 style={{
          fontSize: 'clamp(1.6rem, 3vw, 2.5rem)',
          fontWeight: 400,
          lineHeight: 1.25,
          letterSpacing: '-0.02em',
          marginTop: '0.5rem',
          marginBottom: '2.5rem',
          color: '#ffffff',
        }}>
          {service.tagline}
        </h2>
        <p style={{
          fontSize: '1rem',
          lineHeight: 1.75,
          color: 'rgba(255, 255, 255, 0.8)',
          fontWeight: 300,
          marginBottom: '1.5rem',
        }}>
          {service.description}
        </p>
      </div>

      {/* Challenges Section */}
      {service.challenges && service.challenges.length > 0 && (
        <ChallengesSection challenges={service.challenges} />
      )}

      {/* Offerings Section */}
      {service.offerings && service.offerings.length > 0 && (
        <OfferingsSection serviceName={service.name} offerings={service.offerings} />
      )}

      {/* Methodology Section */}
      {service.methodology && service.methodology.length > 0 && (
        <MethodologySection methodology={service.methodology} />
      )}

      {/* Industries Section */}
      {service.industries && service.industries.length > 0 && (
        <IndustriesSection industries={service.industries} />
      )}

      {/* FAQs Section */}
      {service.faqs && service.faqs.length > 0 && (
        <FAQSection faqs={service.faqs} serviceName={service.name} />
      )}

    </div>
  );
}

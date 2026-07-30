"use client";

import React, { useRef, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import ServicePageClient from './[slug]/ServicePageClient';
import servicesData from '@/data/services_data.json';

// Define Interfaces matching data structure
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
  methodology: any[];
  industries: Industry[];
  faqs: FAQ[];
}

const typedServicesData = servicesData as Record<string, ServiceDetail>;

const SERVICES_DATA = [
  { name: "AI & Data Analytics", slug: "ai-data-analytics" },
  { name: "Cloud Services", slug: "cloud" },
  { name: "Cybersecurity", slug: "cybersecurity" },
  { name: "Network Solutions", slug: "network-solutions" },
  { name: "Industrial Autonomy", slug: "industrial-autonomy-and-engineering" },
  { name: "Enterprise Solutions", slug: "enterprise-solutions" },
  { name: "Tech Consulting", slug: "consulting" },
  { name: "Software Development", slug: "software-development" },
  { name: "Cognitive Operations", slug: "cognitive-business-operations" },
  { name: "Web Development", slug: "web-development" },
  { name: "App Development", slug: "application-development" },
  { name: "Startup MVP", slug: "startup-mvp" },
  { name: "CRM Solutions", slug: "crm-solution" },
  { name: "CXM Solutions", slug: "cxm-solution" },
  { name: "Digital Marketing", slug: "digital-marketing" },
  { name: "Blockchain Solutions", slug: "blockchain" },
  { name: "IoT Solutions", slug: "iot" },
  { name: "DevOps Automation", slug: "devops" },
  { name: "Unit Testing", slug: "unit-test" },
  { name: "Quality Assurance", slug: "quality-assurance" },
  { name: "Workplace Platform", slug: "workplace-transformation" },
  { name: "Process Automation", slug: "process-automation" },
  { name: "Business Process Management", slug: "business-process-management" }
];

export default function ServicesMarquee() {
  const [rotation, setRotation] = useState(0);
  const [zoomedIndex, setZoomedIndex] = useState<number | null>(null);
  const [isZooming, setIsZooming] = useState(false);
  
  // Shared Layout Morph states
  const [morphActive, setMorphActive] = useState(false);
  const [morphExpanded, setMorphExpanded] = useState(false);
  
  // Virtual Dynamic Overlay routing state (Buttery smooth details page)
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  
  const router = useRouter();
  const pathname = usePathname();
  const sectionRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  
  // Ref tracking for LERP physics
  const rotationRef = useRef(0);
  const targetRotationRef = useRef(0);
  const animationFrameId = useRef<number | null>(null);
  
  // Drag states
  const isDragging = useRef(false);
  const hasDragged = useRef(false); 
  const startX = useRef(0);
  const startRotation = useRef(0);

  // Track hover state on rotating cards to toggle vertical vs horizontal scroll
  const isHoveringCardRef = useRef(false);

  const [cardWidth, setCardWidth] = useState(300);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 480) {
        setCardWidth(180);
      } else if (w < 768) {
        setCardWidth(240);
      } else {
        setCardWidth(300);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const N = SERVICES_DATA.length;
  const cardAngle = 360 / N;

  // Calculate dynamic cylinder radius + 22% gap multiplier to completely eliminate card-intersection clipping
  const baseRadius = cardWidth / (2 * Math.sin(Math.PI / N));
  const radius = baseRadius * 1.22;

  // Smooth LERP loop for high-fidelity physics feel
  const tick = () => {
    const diff = targetRotationRef.current - rotationRef.current;
    if (Math.abs(diff) > 0.01) {
      rotationRef.current += diff * 0.12; 
      setRotation(rotationRef.current);
      animationFrameId.current = requestAnimationFrame(tick);
    } else {
      rotationRef.current = targetRotationRef.current;
      setRotation(rotationRef.current);
      animationFrameId.current = null;
    }
  };

  const updateTargetRotation = (newVal: number) => {
    targetRotationRef.current = newVal;
    if (animationFrameId.current === null) {
      animationFrameId.current = requestAnimationFrame(tick);
    }
  };

  // Drag handlers on the scene container
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isZooming) return;
    isDragging.current = true;
    hasDragged.current = false; 
    startX.current = e.clientX;
    startRotation.current = targetRotationRef.current;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > 5) {
      hasDragged.current = true; 
    }
    const newRotation = startRotation.current + (dx / window.innerWidth) * 160;
    updateTargetRotation(newRotation);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isZooming) return;
    isDragging.current = true;
    hasDragged.current = false;
    startX.current = e.touches[0].clientX;
    startRotation.current = targetRotationRef.current;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const dx = e.touches[0].clientX - startX.current;
    if (Math.abs(dx) > 5) {
      hasDragged.current = true;
    }
    const newRotation = startRotation.current + (dx / window.innerWidth) * 160;
    updateTargetRotation(newRotation);
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  // Click card snap & Morph Zoom sequence
  const handleCardClick = (e: React.MouseEvent, slug: string, index: number) => {
    e.preventDefault();
    
    if (hasDragged.current) return;
    if (isZooming) return;

    setIsZooming(true);
    setZoomedIndex(index);

    // 1. Snap cylinder to face this card forward
    const currentRot = targetRotationRef.current;
    const targetRot = -index * cardAngle;

    const diff = targetRot - (currentRot % 360);
    let adjustedTarget = currentRot + diff;
    if (diff > 180) adjustedTarget -= 360;
    if (diff < -180) adjustedTarget += 360;

    updateTargetRotation(adjustedTarget);

    // 2. Trigger FLIP Morph Animation overlay
    setMorphActive(true);
    setTimeout(() => {
      setMorphExpanded(true);
    }, 40);

    // 3. Mount overlay and update URL dynamically
    setTimeout(() => {
      setActiveSlug(slug);
      setMorphActive(false); // Hide the morph image wrapper so the subpage details underneath are visible
      window.history.pushState(null, '', `/industries/it-service/${slug}`);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 500);
  };

  // Handle closing virtual overlay
  const handleCloseOverlay = () => {
    setZoomedIndex(null);
    setIsZooming(false);
    setMorphActive(false);
    setMorphExpanded(false);
    setActiveSlug(null);
    window.history.pushState(null, '', '/industries/it-service');
    
    // Smoothly scroll the window back to center the 3D cylinder
    setTimeout(() => {
      if (sectionRef.current) {
        sectionRef.current.scrollIntoView({ behavior: 'instant', block: 'center' });
      }
    }, 50);
  };

  // Capture browser back/forward buttons (popstate events)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/industries/it-service' || path === '/industries/it-service/') {
        setZoomedIndex(null);
        setIsZooming(false);
        setMorphActive(false);
        setMorphExpanded(false);
        setActiveSlug(null);
        setTimeout(() => {
          if (sectionRef.current) {
            sectionRef.current.scrollIntoView({ behavior: 'instant', block: 'center' });
          }
        }, 50);
      } else {
        const match = path.match(/\/industries\/it-service\/([^/]+)$/);
        if (match) {
          const slug = match[1];
          const index = SERVICES_DATA.findIndex(s => s.slug === slug);
          if (index !== -1) {
            setZoomedIndex(index);
            setIsZooming(true);
            setMorphActive(true);
            setMorphExpanded(true);
            setActiveSlug(slug);
            window.scrollTo({ top: 0, behavior: 'instant' });
          }
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Monitor pathname changes (e.g. clicking links in persistent Header)
  useEffect(() => {
    if (pathname === '/industries/it-service' || pathname === '/industries/it-service/') {
      setZoomedIndex(null);
      setIsZooming(false);
      setMorphActive(false);
      setMorphExpanded(false);
      setActiveSlug(null);
    }
  }, [pathname]);

  // Reset overlay scroll position when changing between services
  useEffect(() => {
    if (activeSlug) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [activeSlug]);

  // Native wheel event listener bound to the parent section to ensure 100% scroll capture even on card surfaces
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleNativeWheel = (e: WheelEvent) => {
      if (isZooming) return;

      // Only scroll horizontally if the user's cursor is hovering directly over one of the cylinder cards
      if (!isHoveringCardRef.current) return;

      // Prevent default page vertical scroll action
      e.preventDefault();

      // Get delta direction
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const scrollSpeed = 0.08;
      const newRotation = targetRotationRef.current - delta * scrollSpeed;
      updateTargetRotation(newRotation);
    };

    section.addEventListener('wheel', handleNativeWheel, { passive: false });

    return () => {
      section.removeEventListener('wheel', handleNativeWheel);
    };
  }, [isZooming, cardAngle]);

  useEffect(() => {
    updateTargetRotation(0);

    // Prefetch all service page routes in the background to ensure instantaneous Next.js client-side mounting
    SERVICES_DATA.forEach((service) => {
      router.prefetch(`/industries/it-service/${service.slug}`);
    });

    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div ref={sectionRef} className="services-section" style={activeSlug ? { padding: 0, overflow: 'visible' } : {}}>
      {/* 3D Scene style injection - matching the user mockup perfectly */}
      <style dangerouslySetInnerHTML={{ __html: `
        body {
          background-color: #000000 !important;
        }
        .services-section {
          background-color: #000000;
          padding: 6rem 0 4rem 0; 
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          overflow: hidden;
          width: 100vw;
          user-select: none;
        }
        @media (max-width: 768px) {
          .services-section {
            padding: 3rem 0 2rem 0 !important;
          }
        }

        /* 3D Scene Viewport */
        .scene-container {
          position: relative;
          width: 100%;
          height: 540px;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1500px; 
          z-index: 8;
          cursor: grab;
          transition: opacity 0.8s ease;
        }
        .scene-container:active {
          cursor: grabbing;
        }
        @media (max-width: 768px) {
          .scene-container {
            height: 380px !important;
            perspective: 1000px !important;
          }
        }

        /* Cylinder Ring */
        .cylinder-ring {
          position: relative;
          width: ${cardWidth}px;
          height: 400px;
          transform-style: preserve-3d;
          will-change: transform;
        }
        @media (max-width: 768px) {
          .cylinder-ring {
            height: 280px !important;
          }
        }

        /* 3D Card Item - Styled exactly like the user mockup */
        .cylinder-card {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          backface-visibility: hidden;
          
          /* Mockup card gradient and border decoration */
          background: linear-gradient(180deg, #110d29 0%, #4c116c 100%) padding-box,
                      linear-gradient(135deg, #3b82f6, #ec4899) border-box;
          border: 2px solid transparent;
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 14px 40px rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(16px);
          cursor: pointer;
          
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1), 
                      opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), 
                      box-shadow 0.4s ease,
                      background 0.4s ease;
          will-change: transform, opacity;
        }
        @media (max-width: 768px) {
          .cylinder-card {
            border-radius: 16px !important;
            padding: 14px !important;
          }
        }
        
        .cylinder-card:hover {
          background: linear-gradient(180deg, #110d29 0%, #4c116c 100%) padding-box,
                      linear-gradient(135deg, #60a5fa, #f472b6) border-box;
          box-shadow: 0 0 30px rgba(139, 92, 246, 0.65), 0 14px 40px rgba(0, 0, 0, 0.6);
        }

        .card-image-box {
          width: 100%;
          aspect-ratio: 1.6;
          background-color: #000000;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.08);
          position: relative;
        }
        @media (max-width: 768px) {
          .card-image-box {
            border-radius: 10px !important;
          }
        }
        
        .card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cylinder-card:hover .card-img {
          transform: scale(1.08);
        }

        /* Card Title */
        .card-title {
          font-size: 1.38rem;
          font-weight: 500;
          color: #ffffff;
          margin: 1.5rem 0 0 0;
          line-height: 1.3;
          font-family: 'Inter', sans-serif;
          letter-spacing: -0.01em;
          text-align: left;
          flex-grow: 1;
          word-wrap: break-word;
        }
        @media (max-width: 768px) {
          .card-title {
            font-size: 0.95rem !important;
            margin: 0.75rem 0 0 0 !important;
          }
        }

        /* Diagonal Arrow matching the mockup */
        .card-arrow-container {
          position: absolute;
          bottom: 24px;
          right: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          transition: transform 0.3s ease;
        }
        .cylinder-card:hover .card-arrow-container {
          transform: translate(3px, -3px);
        }
        @media (max-width: 768px) {
          .card-arrow-container {
            bottom: 14px !important;
            right: 14px !important;
          }
          .card-arrow-container svg {
            width: 16px !important;
            height: 16px !important;
          }
        }
      ` }} />

      {/* Premium Section Title */}
      <h2 style={{
        display: activeSlug ? 'none' : 'block',
        fontSize: 'clamp(2rem, 4.5vw, 3rem)',
        fontWeight: 300,
        color: '#ffffff',
        marginBottom: '2rem',
        fontFamily: 'Inter, sans-serif',
        letterSpacing: '-0.02em',
        textAlign: 'center',
        opacity: isZooming ? 0 : 0.85,
        transition: 'opacity 0.5s ease',
        zIndex: 10,
      }}>
        Our Services
      </h2>

      <div 
        className="scene-container"
        onMouseEnter={() => { isHoveringCardRef.current = true; }}
        onMouseLeave={() => { isHoveringCardRef.current = false; }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ display: activeSlug ? 'none' : 'flex', opacity: isZooming ? 0.3 : 1 }}
      >
        {/* 3D Cylinder Ring - Translated backwards in Z by exactly radius to prevent camera overlaps */}
        <div 
          className="cylinder-ring"
          style={{ 
            transform: `translateZ(-${radius}px) rotateY(${rotation}deg)`,
          }}
        >
          {SERVICES_DATA.map((service, index) => {
            const isZoomedCard = zoomedIndex === index;

            // Calculate card position Y-rotation angle
            const relativeAngle = ((index * cardAngle + rotation) % 360 + 540) % 360 - 180;
            const isFacingAway = Math.abs(relativeAngle) > 85;

            // Opacity decay - center is fully visible, side cards fade, back is hidden
            const cardOpacity = isZooming 
              ? 0 
              : (isFacingAway ? 0 : 1 - Math.min(1, Math.abs(relativeAngle) / 85) * 0.75);

            return (
              <div
                key={service.slug}
                className="cylinder-card"
                onClick={(e) => handleCardClick(e, service.slug, index)}
                style={{
                  transform: `rotateY(${index * cardAngle}deg) translateZ(${radius}px)`,
                  opacity: cardOpacity,
                  visibility: isFacingAway && !isZooming ? 'hidden' : 'visible',
                  pointerEvents: isZooming ? 'none' : 'auto',
                }}
              >
                {/* Related service hero image inside card */}
                <div className="card-image-box">
                  <img 
                    src={`/assets/${service.slug}-hero.png`} 
                    alt={service.name} 
                    className="card-img"
                   loading="lazy" decoding="async" />
                </div>

                {/* Service Name exactly matching mockup styling */}
                <h3 className="card-title">
                  {service.name}
                </h3>

                {/* Diagonal Arrow Icon matching mockup directly */}
                <div className="card-arrow-container">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shared Layout Morph Overlay Image */}
      {morphActive && zoomedIndex !== null && (
        <div 
          style={{
            position: 'fixed',
            zIndex: 99999,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            
            // Morphs from the size/aspect ratio of the card image to the full viewport dimensions
            width: morphExpanded ? '100vw' : '252px', 
            height: morphExpanded ? '100vh' : '157px',
            borderRadius: morphExpanded ? '0px' : '16px',
            
            overflow: 'hidden',
            pointerEvents: 'none',
            transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: morphExpanded ? 'none' : '0 10px 40px rgba(0,0,0,0.6)',
          }}
        >
          <img 
            src={`/assets/${SERVICES_DATA[zoomedIndex].slug}-hero.png`} 
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
           loading="lazy" decoding="async" />
          {/* Subtle gradient vignette overlay when morphing to fullscreen */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0) 100%)',
            opacity: morphExpanded ? 1 : 0,
            transition: 'opacity 0.5s ease',
            zIndex: 2,
          }} />
        </div>
      )}      {/* Virtual SPA dynamic subpage details (rendered inline in normal document flow) */}
      {activeSlug && typedServicesData[activeSlug] && (
        <div
          style={{
            position: 'relative',
            width: '100%',
            backgroundColor: '#000000',
            animation: 'fadeInOverlay 0.4s ease-out forwards',
          }}
        >
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes fadeInOverlay {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            .back-to-services-btn {
              position: fixed;
              top: 90px;
              left: 5%;
              z-index: 1005;
              background-color: rgba(0, 0, 0, 0.75);
              border: 1px solid rgba(255, 255, 255, 0.18);
              border-radius: 50px;
              color: #ffffff;
              padding: 0.65rem 1.45rem;
              font-size: 0.88rem;
              cursor: pointer;
              backdrop-filter: blur(12px);
              display: flex;
              align-items: center;
              gap: 0.5rem;
              transition: all 0.3s ease;
              box-shadow: 0 4px 15px rgba(0,0,0,0.4);
            }
            .back-to-services-btn:hover {
              background-color: rgba(255, 255, 255, 0.1);
              border-color: rgba(255, 255, 255, 0.4);
            }
            @media (max-width: 768px) {
              .back-to-services-btn {
                top: 75px !important;
                left: 15px !important;
                padding: 0.5rem 1rem !important;
                font-size: 0.75rem !important;
              }
            }
          `}} />

          {/* Render target page details inline - zero network fetches, zero reloading! */}
          <div style={{ position: 'relative', width: '100%' }}>
            <ServicePageClient 
              service={typedServicesData[activeSlug]} 
              slug={activeSlug} 
              heroSrc={`/assets/${activeSlug}-hero.png`} 
            />
          </div>

          {/* Floating Back to Services Button */}
          <button
            onClick={handleCloseOverlay}
            className="back-to-services-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Services
          </button>
        </div>
      )}
    </div>
  );
}

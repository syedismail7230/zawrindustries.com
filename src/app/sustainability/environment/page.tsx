'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';


interface ScrollSection {
  id: number;
  text: string;
  subText: string;
  alignment: 'left' | 'right';
  top: string;
  left?: string;
  right?: string;
}

export default function SustainabilityEnvironmentPage() {
  const [scrollY, setScrollY] = useState(0);
  const [visibleItems, setVisibleItems] = useState<Record<number, boolean>>({});

  const sections: ScrollSection[] = [
    {
      id: 1,
      text: 'Nature',
      subText: 'The foundational architecture of our operating ecosystem.',
      alignment: 'left',
      top: '12%',
      left: '8vw',
    },
    {
      id: 2,
      text: 'Part of life',
      subText: 'An unbroken thread connecting industrial growth to natural equilibrium.',
      alignment: 'right',
      top: '35%',
      right: '8vw',
    },
    {
      id: 3,
      text: 'Anything gained',
      subText: 'Every resource harvested, every efficiency claimed, every asset built.',
      alignment: 'left',
      top: '60%',
      left: '8vw',
    },
    {
      id: 4,
      text: 'Must be returned',
      subText: 'A circular promise of restoration, replenishment, and absolute responsibility.',
      alignment: 'right',
      top: '83%',
      right: '8vw',
    },
  ];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });

    const observers: IntersectionObserver[] = [];
    sections.forEach((sec) => {
      const el = document.getElementById(`scroll-sec-${sec.id}`);
      if (el) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setVisibleItems((prev) => ({ ...prev, [sec.id]: true }));
            }
          },
          { threshold: 0.1 }
        );
        observer.observe(el);
        observers.push(observer);
      }
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  return (
    <div
      style={{
        backgroundColor: '#000000',
        color: '#ffffff',
        fontFamily: 'Inter, sans-serif',
        overflowX: 'hidden',
      }}
    >
      {/* ── IMAGE SECTION ────────────────────────────────────────────── */}
      {/* Single position:relative wrapper — image sets the height, text sits on top */}
      <div style={{ position: 'relative', width: '100%' }}>

        {/* The actual image — full width, auto height, scrolls with page */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/sustainability-environment.png"
          alt="Canyon river gorge — Nature, Part of life, Anything gained, Must be returned"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />

        {/* Vignette overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 15%, rgba(0,0,0,0.1) 85%, rgba(0,0,0,0.65) 100%), radial-gradient(circle, rgba(0,0,0,0) 30%, rgba(0,0,0,0.45) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Scroll-down indicator — visible at top, fades as you scroll */}
        <div
          style={{
            position: 'absolute',
            bottom: '4%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            opacity: scrollY > 300 ? 0 : 0.8,
            transition: 'opacity 0.5s ease',
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              fontSize: '0.65rem',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: '#a1a1aa',
            }}
          >
            Scroll Down
          </span>
          <div
            style={{
              width: '1px',
              height: '36px',
              backgroundColor: 'rgba(255,255,255,0.25)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '50%',
                backgroundColor: '#ffffff',
                animation: 'scrollLine 2s infinite',
              }}
            />
          </div>
        </div>

        {/* Text overlays — positioned % relative to the image wrapper */}
        {sections.map((sec) => {
          const isVisible = visibleItems[sec.id];
          return (
            <div
              key={sec.id}
              id={`scroll-sec-${sec.id}`}
              style={{
                position: 'absolute',
                top: sec.top,
                left: sec.left ?? 'auto',
                right: sec.right ?? 'auto',
                maxWidth: '380px',
                zIndex: 5,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(32px)',
                transition:
                  'opacity 1.1s cubic-bezier(0.16,1,0.3,1), transform 1.1s cubic-bezier(0.16,1,0.3,1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
                textAlign: sec.alignment === 'right' ? 'right' : 'left',
              }}
            >
              <h2
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3.4rem)',
                  fontWeight: 300,
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                  margin: 0,
                  lineHeight: 1.1,
                  textShadow: '0 3px 18px rgba(0,0,0,0.85)',
                }}
              >
                {sec.text}
              </h2>
              <p
                style={{
                  fontSize: 'clamp(0.8rem, 1.2vw, 1rem)',
                  color: '#e5e7eb',
                  fontWeight: 400,
                  lineHeight: 1.5,
                  margin: 0,
                  textShadow: '0 2px 10px rgba(0,0,0,0.95)',
                }}
              >
                {sec.subText}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── CTA SECTION — flows naturally after the image ─────────────── */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8rem 2rem',
          backgroundColor: '#000000',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <span
          style={{
            fontSize: '0.78rem',
            fontWeight: 500,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#71717a',
            marginBottom: '1.5rem',
          }}
        >
          Our Ecological Pledge
        </span>
        <h3
          style={{
            fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
            fontWeight: 300,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            textAlign: 'center',
            maxWidth: '620px',
            margin: '0 0 1.5rem 0',
            lineHeight: 1.25,
          }}
        >
          Pioneering a sustainable frontier for industrial operations.
        </h3>
        <p
          style={{
            fontSize: '0.95rem',
            color: '#71717a',
            textAlign: 'center',
            maxWidth: '500px',
            lineHeight: 1.65,
            margin: '0 0 3rem 0',
          }}
        >
          At Zawr Industries, environmental stewardship is not an afterthought. We build circular
          architectures into all manufacturing, FMCG, and transportation logistics frameworks from
          day one.
        </p>
        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link
            href="/"
            style={{
              padding: '0.8rem 2rem',
              backgroundColor: '#ffffff',
              color: '#000000',
              borderRadius: '100px',
              fontSize: '0.85rem',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            Return Home
          </Link>
          <Link
            href="/newsroom"
            style={{
              padding: '0.8rem 2rem',
              backgroundColor: 'transparent',
              color: '#ffffff',
              borderRadius: '100px',
              fontSize: '0.85rem',
              fontWeight: 500,
              textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            Explore Newsroom
          </Link>
        </div>
      </div>


      <style
        dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
            @keyframes scrollLine {
              0%   { transform: translateY(-100%); }
              100% { transform: translateY(200%);  }
            }
          `,
        }}
      />
    </div>
  );
}

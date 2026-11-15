'use client';

import React from 'react';
import { Schoolbell } from 'next/font/google';

const schoolbell = Schoolbell({
  subsets: ['latin'],
  weight: ['400'],
});

export default function SustainabilityEducationPage() {
  return (
    <div className={schoolbell.className} style={{ backgroundColor: '#ffffff', color: '#111111' }}>

      {/* ── HERO — text left, image right ─────────────────────────────── */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: 'clamp(9.5rem, 12vw, 11rem) 5% 5rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '3rem',
      }}>
        {/* Text */}
        <div style={{ flex: '1 1 380px' }}>
          <p style={{
            fontSize: '0.78rem',
            fontWeight: 500,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#71717a',
            marginBottom: '1.25rem',
          }}>
            Education &amp; Learning
          </p>
          <h1 style={{
            fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
            fontWeight: 700,
            color: '#111111',
            lineHeight: 1.1,
            margin: 0,
            letterSpacing: '-0.03em',
          }}>
            Building Futures Through Curiosity, Capability and Continuous Learning
          </h1>
        </div>
        {/* Hero Image */}
        <div style={{ flex: '1 1 320px', borderRadius: '16px', overflow: 'hidden', lineHeight: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_1600,c_limit,dpr_auto/v1783710465/zawr/assets/edu-hero.png"
            alt="Students celebrating learning at Zawr Industries"
            style={{ width: '100%', height: 'auto', display: 'block' }}
           loading="lazy" decoding="async" />
        </div>
      </div>

      {/* ── THREE ICON FEATURES ────────────────────────────────────────── */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '3rem 5% 5rem',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '3rem',
      }}>
      {[
          { icon: 'https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_400,c_limit/v1783710465/zawr/assets/edu-icon-curiosity.png', label: 'Curiosity Driven\nLearning' },
          { icon: 'https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_400,c_limit/v1783710467/zawr/assets/edu-icon-skills.png',    label: 'Future Ready\nSkills' },
          { icon: 'https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_400,c_limit/v1783710466/zawr/assets/edu-icon-knowledge.png', label: 'Knowledge\nEcosystems' },
        ].map(({ icon, label }) => (
          <div key={label} style={{
            flex: '1 1 160px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            textAlign: 'center',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={icon}
              alt={label}
              style={{ width: '120px', height: '120px', objectFit: 'contain', display: 'block' }}
             loading="lazy" decoding="async" />
            <p style={{
              fontSize: '0.88rem',
              fontWeight: 500,
              color: '#111111',
              lineHeight: 1.4,
              margin: 0,
              whiteSpace: 'pre-line',
            }}>
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* ── DIVIDER ────────────────────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid #e5e7eb', maxWidth: '1100px', margin: '0 auto' }} />

      {/* ── CENTERED PHILOSOPHY TEXT ───────────────────────────────────── */}
      <div style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: '5rem 5%',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '1rem', color: '#374151', lineHeight: 1.95, margin: '0 0 1rem 0' }}>
          At Zawr Industries, we believe education is not limited to classrooms, certifications, or formal
          systems. Education is the infrastructure behind innovation.
        </p>
        <p style={{ fontSize: '1rem', color: '#374151', lineHeight: 1.95, margin: '0 0 1rem 0' }}>
          It shapes how societies adapt, how businesses evolve, and how individuals transform ideas into
          measurable impact.
        </p>
        <p style={{ fontSize: '1rem', color: '#374151', lineHeight: 1.95, margin: '0 0 1rem 0' }}>
          As industries undergo rapid transformation through artificial intelligence, automation, digital
          systems, and emerging technologies, the ability to continuously learn becomes one of the most
          important sustainability challenges of our time.
        </p>
        <p style={{ fontSize: '1rem', color: '#374151', lineHeight: 1.95, margin: 0 }}>
          Accordingly, we view education as a long-term investment in resilience, opportunity, and future
          readiness.
        </p>
      </div>

      {/* ── DIVIDER ────────────────────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid #e5e7eb', maxWidth: '1100px', margin: '0 auto' }} />

      {/* ── SPLIT — origami left, text right ──────────────────────────── */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '6rem 5%',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '4rem',
      }}>
        {/* Origami Image */}
        <div style={{ flex: '1 1 300px', lineHeight: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_1200,c_limit/v1783710468/zawr/assets/edu-origami.png"
            alt="Origami crane — continuous learning at Zawr"
            style={{ width: '100%', maxWidth: '380px', height: 'auto', display: 'block' }}
           loading="lazy" decoding="async" />
        </div>
        {/* Text */}
        <div style={{ flex: '1 1 340px' }}>
          <h2 style={{
            fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
            fontWeight: 400,
            lineHeight: 1.35,
            margin: '0 0 1.5rem 0',
            letterSpacing: '-0.01em',
            color: '#111111',
          }}>
            From digital literacy to emerging technologies, we believe sustainable growth depends upon
            developing adaptable skills that empower individuals to create impact in changing markets.
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#374151', lineHeight: 1.85, margin: '0 0 0.75rem 0' }}>
            We seek to support educational access, skill development, and learning cultures across our
            operations, partnerships, and communities.
          </p>
          <p style={{ fontSize: '0.92rem', color: '#374151', lineHeight: 1.85, margin: 0 }}>
            Because the ability to continuously learn is the most enduring competitive advantage of all.
          </p>
        </div>
      </div>

      {/* ── PHILOSOPHY FOOTER ─────────────────────────────────────────── */}
      <div style={{
        backgroundColor: '#fafafa',
        borderTop: '1px solid #e5e7eb',
        padding: '6rem 5%',
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: '0.78rem',
          fontWeight: 500,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#71717a',
          marginBottom: '1.5rem',
        }}>
          Our Philosophy
        </p>
        <p style={{
          fontSize: 'clamp(1rem, 1.8vw, 1.2rem)',
          color: '#374151',
          lineHeight: 1.85,
          maxWidth: '620px',
          margin: '0 auto 1.5rem',
        }}>
          Education is not an event. It is a continuous process of growth, adaptation, and curiosity — one
          that shapes individuals, organizations, and societies alike.
        </p>
        <p style={{
          fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
          fontWeight: 500,
          color: '#111111',
          maxWidth: '600px',
          margin: '0 auto',
        }}>
          Curious minds build capable organizations. Capable organizations create lasting futures.
        </p>
      </div>

    </div>
  );
}

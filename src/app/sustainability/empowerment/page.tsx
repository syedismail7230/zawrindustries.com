'use client';

import React from 'react';
import Link from 'next/link';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  style: ['italic'],
  weight: ['400'],
});

export default function SustainabilityEmpowermentPage() {
  return (
    <div style={{ backgroundColor: '#ffffff', color: '#111111', fontFamily: 'Inter, sans-serif' }}>

      {/* ── HERO IMAGE — curved corners, below header ─────────────────── */}
      <div style={{ padding: '6rem 1.5rem 0', backgroundColor: '#ffffff' }}>
        <div style={{ borderRadius: '20px', overflow: 'hidden', lineHeight: 0, maxHeight: '85vh' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto/v1783710472/zawr/assets/emp-hero.png"
            alt="Empowerment at Zawr Industries"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
      </div>

      {/* ── SECTION WRAPPER ────────────────────────────────────────────── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 5%' }}>

        {/* ── EMPOWERING PEOPLE — text left, image right ─────────────── */}
        <section style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '4rem',
          padding: '6rem 0',
          borderBottom: '1px solid #e5e7eb',
        }}>
          {/* Text */}
          <div style={{ flex: '1 1 360px' }}>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
              fontWeight: 700,
              color: '#111111',
              lineHeight: 1.15,
              margin: '0 0 0.5rem 0',
              letterSpacing: '-0.02em',
            }}>
              Empowering People
            </h2>
            <h3 className={playfair.className} style={{
              fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
              fontWeight: 400,
              lineHeight: 1.3,
              margin: '0 0 1.5rem 0',
              letterSpacing: '-0.01em',
              color: '#111111',
            }}>
              We believe extraordinary outcomes begin with empowered individuals.
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#374151', lineHeight: 1.8, margin: '0 0 0.75rem 0' }}>
              Our approach focuses on creating environments where people are encouraged to take ownership,
              challenge assumptions, develop new skills, and contribute with confidence.
            </p>
            <p style={{ fontSize: '0.92rem', color: '#374151', lineHeight: 1.8, margin: '0 0 0.5rem 0' }}>
              We seek to build workplaces where:
            </p>
            <ul style={{ fontSize: '0.92rem', color: '#374151', lineHeight: 2, paddingLeft: '1.4rem', margin: '0 0 0.75rem 0' }}>
              <li>ideas are welcomed;</li>
              <li>initiative is encouraged;</li>
              <li>learning becomes continuous;</li>
              <li>leadership is accessible;</li>
              <li>experimentation is respected;</li>
              <li>growth remains merit-driven.</li>
            </ul>
            <p style={{ fontSize: '0.92rem', color: '#374151', lineHeight: 1.8, margin: 0 }}>
              Empowerment means giving people the ability to create — not simply execute.
            </p>
          </div>
          {/* Image */}
          <div style={{ flex: '1 1 320px', borderRadius: '12px', overflow: 'hidden', lineHeight: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto/v1783710474/zawr/assets/emp-people.png"
              alt="Empowering People at Zawr"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        </section>

        {/* ── EMPOWERING COMMUNITIES — image left, text right ────────── */}
        <section style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '4rem',
          padding: '6rem 0',
          borderBottom: '1px solid #e5e7eb',
        }}>
          {/* Image */}
          <div style={{ flex: '1 1 320px', borderRadius: '12px', overflow: 'hidden', lineHeight: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto/v1783710471/zawr/assets/emp-communities.png"
              alt="Empowering Communities at Zawr"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
          {/* Text */}
          <div style={{ flex: '1 1 360px' }}>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
              fontWeight: 700,
              color: '#111111',
              lineHeight: 1.15,
              margin: '0 0 0.5rem 0',
              letterSpacing: '-0.02em',
            }}>
              Empowering Communities
            </h2>
            <h3 className={playfair.className} style={{
              fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
              fontWeight: 400,
              lineHeight: 1.3,
              margin: '0 0 1.5rem 0',
              letterSpacing: '-0.01em',
              color: '#111111',
            }}>
              Growth becomes meaningful when it creates broader opportunity.
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#374151', lineHeight: 1.8, margin: '0 0 0.75rem 0' }}>
              At Zawr, we recognise that true impact starts well beyond the office. Our community
              programmes have supported local organisations, small suppliers, and education initiatives,
              creating networks of shared opportunity across every generation.
            </p>
            <p style={{ fontSize: '0.92rem', color: '#374151', lineHeight: 1.8, margin: 0 }}>
              We believe organisations have the power to transform communities — and an equal obligation to do so.
            </p>
          </div>
        </section>

        {/* ── EMPOWERING INNOVATION — text left, image right ─────────── */}
        <section style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '4rem',
          padding: '6rem 0',
          borderBottom: '1px solid #e5e7eb',
        }}>
          {/* Text */}
          <div style={{ flex: '1 1 360px' }}>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
              fontWeight: 700,
              color: '#111111',
              lineHeight: 1.15,
              margin: '0 0 0.5rem 0',
              letterSpacing: '-0.02em',
            }}>
              Empowering Innovation
            </h2>
            <h3 className={playfair.className} style={{
              fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
              fontWeight: 400,
              lineHeight: 1.3,
              margin: '0 0 1.5rem 0',
              letterSpacing: '-0.01em',
              color: '#111111',
            }}>
              Innovation thrives where curiosity meets opportunity.
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#374151', lineHeight: 1.8, margin: '0 0 0.75rem 0' }}>
              We aim to support innovators within our organisation, where:
            </p>
            <ul style={{ fontSize: '0.92rem', color: '#374151', lineHeight: 2, paddingLeft: '1.4rem', margin: '0 0 0.75rem 0' }}>
              <li>technology solves meaningful problems;</li>
              <li>ideas are empowered to grow by depth;</li>
              <li>sustainability and scale coexist.</li>
            </ul>
            <p style={{ fontSize: '0.92rem', color: '#374151', lineHeight: 1.8, margin: 0 }}>
              By enabling people and systems, we move faster and turn bold ideas into measurable value.
            </p>
          </div>
          {/* Image */}
          <div style={{ flex: '1 1 320px', borderRadius: '12px', overflow: 'hidden', lineHeight: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto/v1783710473/zawr/assets/emp-innovation.png"
              alt="Empowering Innovation at Zawr"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        </section>

        {/* ── EMPOWERING BUSINESSES — image left, text right ─────────── */}
        <section style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '4rem',
          padding: '6rem 0',
          borderBottom: '1px solid #e5e7eb',
        }}>
          {/* Image */}
          <div style={{ flex: '1 1 320px', borderRadius: '12px', overflow: 'hidden', lineHeight: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto/v1783710470/zawr/assets/emp-businesses.png"
              alt="Empowering Businesses at Zawr"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
          {/* Text */}
          <div style={{ flex: '1 1 360px' }}>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
              fontWeight: 700,
              color: '#111111',
              lineHeight: 1.15,
              margin: '0 0 0.5rem 0',
              letterSpacing: '-0.02em',
            }}>
              Empowering Businesses
            </h2>
            <h3 className={playfair.className} style={{
              fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
              fontWeight: 400,
              lineHeight: 1.3,
              margin: '0 0 1.5rem 0',
              letterSpacing: '-0.01em',
              color: '#111111',
            }}>
              Our focus extends beyond delivering solutions — we aim to create capabilities.
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#374151', lineHeight: 1.8, margin: '0 0 0.75rem 0' }}>
              This means helping organisations:
            </p>
            <ul style={{ fontSize: '0.92rem', color: '#374151', lineHeight: 2, paddingLeft: '1.4rem', margin: '0 0 0.75rem 0' }}>
              <li>build internal competency;</li>
              <li>identify untapped potential;</li>
              <li>create independent growth;</li>
              <li>scale responsibly.</li>
            </ul>
            <p style={{ fontSize: '0.92rem', color: '#374151', lineHeight: 1.8, margin: 0 }}>
              We believe empowering businesses creates resilience and long-term growth.
            </p>
          </div>
        </section>

        {/* ── OUR PHILOSOPHY ─────────────────────────────────────────── */}
        <section style={{
          padding: '7rem 0',
          textAlign: 'center',
          maxWidth: '680px',
          margin: '0 auto',
        }}>
          <p style={{
            fontSize: '0.78rem',
            fontWeight: 500,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#71717a',
            marginBottom: '2rem',
          }}>
            Our Philosophy
          </p>
          <p style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
            color: '#374151',
            lineHeight: 1.85,
            margin: '0 0 1.5rem 0',
            fontWeight: 400,
          }}>
            Empowerment is not about providing answers. It is about creating the confidence, tools,
            opportunities, and freedom for people to build their own.
          </p>
          <p style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
            color: '#374151',
            lineHeight: 1.85,
            margin: '0 0 2.5rem 0',
          }}>
            At Zawr Industries LLP, we continue to invest in environments where ambition is supported,
            ideas are accelerated, and potential is transformed into measurable outcomes.
          </p>
          <p style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
            fontWeight: 500,
            fontStyle: 'italic',
            fontFamily: 'Georgia, serif',
            color: '#111111',
            margin: 0,
          }}>
            Empowering people to build what comes next.
          </p>

        </section>

      </div>
    </div>
  );
}

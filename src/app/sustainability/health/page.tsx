'use client';

import React from 'react';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  style: ['italic'],
  weight: ['400'],
});

export default function SustainabilityHealthPage() {
  return (
    <div style={{ backgroundColor: '#ffffff', color: '#111111', fontFamily: 'Inter, sans-serif' }}>

      {/* ── HERO IMAGE — curved corners, below header ─────────────────── */}
      <div style={{ padding: '6rem 1.5rem 0', backgroundColor: '#ffffff' }}>
        <div style={{ borderRadius: '20px', overflow: 'hidden', lineHeight: 0, maxHeight: '85vh' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/health-hero.png"
            alt="Health and Wellbeing at Zawr Industries"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
      </div>

      {/* ── INTRO ──────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '5rem 5% 0', textAlign: 'center' }}>
        <h1 style={{
          fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
          fontWeight: 700,
          color: '#111111',
          lineHeight: 1.15,
          margin: '0 0 0.5rem 0',
          letterSpacing: '-0.02em',
        }}>
          Health &amp; Wellbeing
        </h1>
        <h2 className={playfair.className} style={{
          fontSize: 'clamp(1.2rem, 2vw, 1.6rem)',
          fontWeight: 400,
          lineHeight: 1.4,
          margin: '0 0 2rem 0',
          letterSpacing: '-0.01em',
          color: '#111111',
        }}>
          Building Sustainable Growth Through Healthy People and Communities.
        </h2>
        <p style={{ fontSize: '0.95rem', color: '#374151', lineHeight: 1.85, margin: '0 0 1rem 0' }}>
          At Zawr Industries LLP, sustainability extends beyond environmental responsibility and operational
          efficiency. We recognize that long-term progress depends equally upon the health, wellbeing, safety,
          and resilience of people.
        </p>
        <p style={{ fontSize: '0.95rem', color: '#374151', lineHeight: 1.85, margin: '0 0 1rem 0' }}>
          Accordingly, our approach to health is centered around creating environments that support physical
          wellbeing, psychological safety, responsible workplace practices, and healthier communities.
        </p>
        <p style={{ fontSize: '0.95rem', color: '#374151', lineHeight: 1.85, margin: 0 }}>
          We believe sustainable organizations are built by healthy individuals, supported teams, and
          responsible systems.
        </p>
      </div>

      {/* ── SECTION WRAPPER ────────────────────────────────────────────── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 5%' }}>

        {/* ── OUR COMMITMENT TO WELLBEING — text left, image right ─────── */}
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
              Our Commitment to Wellbeing
            </h2>
            <h3 className={playfair.className} style={{
              fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
              fontWeight: 400,
              lineHeight: 1.3,
              margin: '0 0 1.5rem 0',
              letterSpacing: '-0.01em',
              color: '#111111',
            }}>
              Health is a broader responsibility that shapes how we work and grow.
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#374151', lineHeight: 1.8, margin: '0 0 0.75rem 0' }}>
              Our commitment is focused on fostering environments that encourage:
            </p>
            <ul style={{ fontSize: '0.92rem', color: '#374151', lineHeight: 2, paddingLeft: '1.4rem', margin: 0 }}>
              <li>safer workplaces;</li>
              <li>healthy work practices;</li>
              <li>mental wellbeing;</li>
              <li>work-life balance;</li>
              <li>accessible support systems;</li>
              <li>long-term employee wellbeing.</li>
            </ul>
          </div>
          {/* Image */}
          <div style={{ flex: '1 1 320px', borderRadius: '12px', overflow: 'hidden', lineHeight: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/health-commitment.png"
              alt="Wellbeing commitment at Zawr"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        </section>

        {/* ── WORKPLACE HEALTH AND SAFETY — image left, text right ─────── */}
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
              src="/assets/health-safety.png"
              alt="Workplace health and safety at Zawr"
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
              Workplace Health and Safety
            </h2>
            <h3 className={playfair.className} style={{
              fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
              fontWeight: 400,
              lineHeight: 1.3,
              margin: '0 0 1.5rem 0',
              letterSpacing: '-0.01em',
              color: '#111111',
            }}>
              Safety is a shared responsibility across every team and function.
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#374151', lineHeight: 1.8, margin: '0 0 0.75rem 0' }}>
              We are committed to maintaining workplaces that prioritize health, safety, and preparedness.
              Our approach seeks to reduce avoidable risks through:
            </p>
            <ul style={{ fontSize: '0.92rem', color: '#374151', lineHeight: 2, paddingLeft: '1.4rem', margin: '0 0 0.75rem 0' }}>
              <li>safety-first thinking;</li>
              <li>awareness initiatives;</li>
              <li>operational safeguards;</li>
              <li>responsible workplace practices;</li>
              <li>risk identification and mitigation;</li>
              <li>continuous improvement.</li>
            </ul>
          </div>
        </section>

        {/* ── MENTAL HEALTH — text left, image right ───────────────────── */}
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
              Mental Health &amp; Psychological Wellbeing
            </h2>
            <h3 className={playfair.className} style={{
              fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
              fontWeight: 400,
              lineHeight: 1.3,
              margin: '0 0 1.5rem 0',
              letterSpacing: '-0.01em',
              color: '#111111',
            }}>
              Sustainable performance requires psychological wellbeing alongside physical health.
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#374151', lineHeight: 1.8, margin: '0 0 0.75rem 0' }}>
              We seek to foster cultures where:
            </p>
            <ul style={{ fontSize: '0.92rem', color: '#374151', lineHeight: 2, paddingLeft: '1.4rem', margin: '0 0 0.75rem 0' }}>
              <li>respectful communication is encouraged;</li>
              <li>burnout risks are reduced;</li>
              <li>collaboration is supported;</li>
              <li>individuals feel safe expressing concerns;</li>
              <li>healthy working practices are promoted.</li>
            </ul>
            <p style={{ fontSize: '0.92rem', color: '#374151', lineHeight: 1.8, margin: 0 }}>
              Creating environments that support wellbeing contributes to stronger teams and healthier
              organizations.
            </p>
          </div>
          {/* Image */}
          <div style={{ flex: '1 1 320px', borderRadius: '12px', overflow: 'hidden', lineHeight: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/health-mental.png"
              alt="Mental health and wellbeing at Zawr"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        </section>

        {/* ── COMMUNITY HEALTH — image left, text right ────────────────── */}
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
              src="/assets/health-community.png"
              alt="Community health at Zawr"
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
              Community Health &amp; Social Responsibility
            </h2>
            <h3 className={playfair.className} style={{
              fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
              fontWeight: 400,
              lineHeight: 1.3,
              margin: '0 0 1.5rem 0',
              letterSpacing: '-0.01em',
              color: '#111111',
            }}>
              Organizational responsibility extends well beyond internal operations.
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#374151', lineHeight: 1.8, margin: '0 0 0.75rem 0' }}>
              As part of our broader sustainability efforts, we aspire to contribute toward healthier
              communities by supporting initiatives that encourage awareness, education, accessibility,
              and responsible growth.
            </p>
            <p style={{ fontSize: '0.92rem', color: '#374151', lineHeight: 1.8, margin: '0 0 0.75rem 0' }}>
              We also encourage sustainable working practices — not unsustainable workloads:
            </p>
            <ul style={{ fontSize: '0.92rem', color: '#374151', lineHeight: 2, paddingLeft: '1.4rem', margin: 0 }}>
              <li>balanced work habits;</li>
              <li>healthy collaboration practices;</li>
              <li>flexibility where operationally practical;</li>
              <li>wellbeing-focused workplace behaviors.</li>
            </ul>
          </div>
        </section>

        {/* ── OUR PHILOSOPHY ─────────────────────────────────────────────── */}
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
          }}>
            At Zawr Industries LLP, health is not treated as a separate initiative. It is embedded into
            how we build workplaces, support people, manage growth, and pursue long-term sustainability.
          </p>
          <p style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
            color: '#374151',
            lineHeight: 1.85,
            margin: '0 0 2rem 0',
          }}>
            Health challenges evolve alongside workplaces, technologies, and industries. Accordingly, we
            seek to continuously review and improve health-related practices as our organization scales.
          </p>
          <p style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
            fontWeight: 500,
            fontStyle: 'italic',
            fontFamily: 'Georgia, serif',
            color: '#111111',
            margin: 0,
          }}>
            Healthy people create resilient organizations. Resilient organizations create sustainable
            futures.
          </p>
        </section>

      </div>
    </div>
  );
}

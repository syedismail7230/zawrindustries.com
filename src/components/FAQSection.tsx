'use client';

import React, { useState } from 'react';

interface FAQ {
  q: string;
  a: string;
}

const ICONS = [
  <path key={0} d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />,
  <path key={1} d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8v4l3 3" />,
  <path key={2} d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />,
  <path key={3} d="M16 18l6-6-6-6M8 6l-6 6 6 6" />,
  <path key={4} d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />,
  <path key={5} d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8" />,
];

export function FAQSection({ faqs, serviceName }: { faqs: FAQ[]; serviceName: string }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      style={{
        background: '#000',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        padding: 'clamp(4rem,8vh,6rem) clamp(1rem,5vw,5%)',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .faq-header { text-align: center; margin-bottom: clamp(2.5rem,5vh,4rem); }
        .faq-eyebrow {
          font-size: 0.75rem; font-weight: 600; letter-spacing: 0.18em;
          text-transform: uppercase; color: rgba(255,255,255,0.35);
          font-family: var(--font-plus-jakarta), Inter, sans-serif;
          margin-bottom: 0.75rem;
        }
        .faq-title {
          font-size: clamp(1.8rem,3.5vw,3rem); font-weight: 300;
          letter-spacing: -0.03em; color: #fff; margin: 0;
          font-family: var(--font-plus-jakarta), Inter, sans-serif;
        }
        .faq-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
          gap: 1px;
          background: rgba(255,255,255,0.06);
          border-radius: 16px;
          overflow: hidden;
          max-width: 1100px;
          margin: 0 auto;
        }
        .faq-item {
          background: #0a0a0a;
          padding: 1.75rem;
          display: flex;
          gap: 1.1rem;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .faq-item:hover { background: #111; }
        .faq-icon-wrap {
          width: 40px; height: 40px; flex-shrink: 0;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.5);
          background: rgba(255,255,255,0.03);
        }
        .faq-q {
          font-size: 0.95rem; font-weight: 500; color: #fff;
          margin: 0 0 0.5rem 0; line-height: 1.4;
          font-family: var(--font-plus-jakarta), Inter, sans-serif;
        }
        .faq-a {
          font-size: 0.85rem; line-height: 1.7;
          color: rgba(255,255,255,0.5);
          font-family: var(--font-plus-jakarta), Inter, sans-serif;
          font-weight: 300; margin: 0;
          max-height: 0; overflow: hidden;
          transition: max-height 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease;
          opacity: 0;
        }
        .faq-a.faq-open { max-height: 200px; opacity: 1; }
        .faq-cta {
          max-width: 1100px; margin: 2.5rem auto 0;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 1.5rem 2rem;
          display: flex; align-items: center;
          justify-content: space-between; flex-wrap: wrap; gap: 1.5rem;
          background: rgba(255,255,255,0.02);
        }
        .faq-cta-text { font-size: 1rem; font-weight: 300; color: rgba(255,255,255,0.7); font-family: var(--font-plus-jakarta), Inter, sans-serif; margin: 0; }
        .faq-cta-text strong { color: #fff; font-weight: 500; }
        .faq-cta-btn {
          background: #000;
          color: #fff;
          border: 2px solid transparent;
          background-image: linear-gradient(#000, #000), linear-gradient(135deg, #3b82f6, #ec4899);
          background-origin: border-box;
          background-clip: padding-box, border-box;
          border-radius: 100px;
          padding: 0.75rem 2rem;
          font-weight: 500;
          font-size: 0.9rem;
          text-decoration: none;
          font-family: var(--font-plus-jakarta), Inter, sans-serif;
          display: inline-block;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 15px rgba(0,0,0,0.4);
          white-space: nowrap;
          cursor: pointer;
        }
        .faq-cta-btn:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 0 15px rgba(59,130,246,0.5), 0 0 25px rgba(236,72,153,0.4);
          background-image: linear-gradient(#111, #111), linear-gradient(135deg, #ec4899, #3b82f6);
        }
      ` }} />

      <div className="faq-header">
        <p className="faq-eyebrow">Support</p>
        <h2 className="faq-title">Frequently Asked Questions</h2>
      </div>

      <div className="faq-grid">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="faq-item"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <div className="faq-icon-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {ICONS[i % ICONS.length]}
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <h4 className="faq-q">{faq.q}</h4>
              <p className={`faq-a${open === i ? ' faq-open' : ''}`}>{faq.a}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="faq-cta">
        <p className="faq-cta-text">
          <strong>Still have questions?</strong> Our {serviceName} specialists are ready to help.
        </p>
        <a
          href={`https://wa.me/919880464078?text=${encodeURIComponent(`Hi, I have a question about your ${serviceName} services.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="faq-cta-btn"
        >
          Talk to an Expert
        </a>
      </div>
    </section>
  );
}

'use client';

import React from 'react';

interface Capability {
  title: string;
  description: string;
  metric: string;
  metricLabel: string;
}

export function Capabilities3DGrid({ capabilities }: { capabilities: Capability[] }) {
  return (
    <div style={{ width: '100%', marginBottom: '2rem' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .cap-flat-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
        }

        .cap-flat-item {
          padding: 2rem 2rem 2rem 0;
          border-left: 1px solid #e2e8f0;
          padding-left: 2rem;
        }

        .cap-flat-item:first-child {
          border-left: none;
          padding-left: 0;
        }

        .cap-flat-metric {
          font-size: clamp(1.8rem, 2.8vw, 2.6rem);
          font-weight: 400;
          color: #000000;
          letter-spacing: -0.04em;
          line-height: 1;
          display: block;
          margin-bottom: 0.5rem;
        }

        .cap-flat-title {
          font-size: 0.85rem;
          color: #94a3b8;
          font-weight: 400;
          display: block;
        }

        @media (max-width: 768px) {
          .cap-flat-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem 0;
          }
          .cap-flat-item {
            border-left: 1px solid #e2e8f0;
            padding-left: 1.5rem;
          }
          .cap-flat-item:first-child,
          .cap-flat-item:nth-child(3) {
            border-left: none;
            padding-left: 0;
          }
        }

        @media (max-width: 480px) {
          .cap-flat-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}} />

      <div className="cap-flat-grid">
        {capabilities.map((cap, idx) => (
          <div key={idx} className="cap-flat-item">
            <span className="cap-flat-metric">{cap.metric}</span>
            <span className="cap-flat-title">{cap.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

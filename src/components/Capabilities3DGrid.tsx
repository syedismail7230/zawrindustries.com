'use client';

import React, { useState } from 'react';

interface Capability {
  title: string;
  description: string;
  metric: string;
  metricLabel: string;
}

export function Capabilities3DGrid({ capabilities }: { capabilities: Capability[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div style={{ width: '100%', marginBottom: '2rem' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .bento-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: auto auto;
          gap: 1px;
          background: #e2e8f0;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          overflow: hidden;
        }

        .bento-cell {
          background: #ffffff;
          padding: 3rem 2.8rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 280px;
          position: relative;
          overflow: hidden;
          transition: background 0.25s ease;
        }

        .bento-cell:hover {
          background: #f8fafc;
        }

        .bento-metric-bg {
          position: absolute;
          bottom: -0.5rem;
          right: 1rem;
          font-size: clamp(5rem, 10vw, 9rem);
          font-weight: 800;
          color: rgba(0,0,0,0.04);
          letter-spacing: -0.06em;
          line-height: 1;
          pointer-events: none;
          user-select: none;
          transition: color 0.25s ease;
          white-space: nowrap;
        }

        .bento-cell:hover .bento-metric-bg {
          color: rgba(0,0,0,0.07);
        }

        .bento-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #94a3b8;
          margin-bottom: 0.6rem;
        }

        .bento-metric-display {
          font-size: clamp(2.2rem, 4vw, 3.2rem);
          font-weight: 400;
          color: #000000;
          letter-spacing: -0.04em;
          line-height: 1;
          margin-bottom: 2rem;
        }

        .bento-title {
          font-size: 1rem;
          font-weight: 600;
          color: #000000;
          margin-bottom: 0.5rem;
          letter-spacing: -0.01em;
        }

        .bento-desc {
          font-size: 0.875rem;
          color: #64748b;
          line-height: 1.7;
          font-weight: 300;
          max-width: 340px;
        }

        @media (max-width: 768px) {
          .bento-grid {
            grid-template-columns: 1fr;
            border-radius: 12px;
          }
          .bento-cell {
            min-height: 220px;
            padding: 2rem 1.8rem;
          }
          .bento-metric-bg {
            font-size: clamp(4rem, 18vw, 7rem);
          }
        }
      `}} />

      <div className="bento-grid">
        {capabilities.map((cap, idx) => (
          <div
            key={idx}
            className="bento-cell"
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Ghost watermark metric */}
            <span className="bento-metric-bg" aria-hidden="true">{cap.metric}</span>

            {/* Top: label + metric */}
            <div>
              <div className="bento-label">{cap.metricLabel}</div>
              <div className="bento-metric-display">{cap.metric}</div>
            </div>

            {/* Bottom: title + description */}
            <div>
              <div className="bento-title">{cap.title}</div>
              <div className="bento-desc">{cap.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import React from 'react';

interface FormattedContentProps {
  content: string | string[];
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Parses inline markdown-like syntax:
 * - **bold** or __bold__ -> <strong>
 * - *italic* or _italic_ -> <em>
 * - <u>underline</u> -> <u>
 * - `code` -> <code>
 * - [text](url) -> <a>
 */
function parseInline(text: string): React.ReactNode[] {
  if (!text) return [];

  // Match bold, italic, underline, inline code, and links
  const regex = /(\*\*.*?\*\*|__.*?__|<u>.*?<\/u>|\*.*?\*|_.*?_|`.*?`|\[.*?\]\(.*?\))/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Bold (**text** or __text__)
    if ((part.startsWith('**') && part.endsWith('**') && part.length >= 4) ||
        (part.startsWith('__') && part.endsWith('__') && part.length >= 4)) {
      return <strong key={index} style={{ fontWeight: 600, color: 'inherit' }}>{parseInline(part.slice(2, -2))}</strong>;
    }

    // Underline (<u>text</u>)
    if (part.startsWith('<u>') && part.endsWith('</u>') && part.length >= 7) {
      return <u key={index}>{parseInline(part.slice(3, -4))}</u>;
    }

    // Italic (*text* or _text_)
    if ((part.startsWith('*') && part.endsWith('*') && part.length >= 2) ||
        (part.startsWith('_') && part.endsWith('_') && part.length >= 2)) {
      return <em key={index} style={{ fontStyle: 'italic' }}>{parseInline(part.slice(1, -1))}</em>;
    }

    // Inline Code (`code`)
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code
          key={index}
          style={{
            fontFamily: 'monospace',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: '0.15rem 0.35rem',
            borderRadius: '4px',
            fontSize: '0.9em',
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Link [text](url)
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      const [, linkText, href] = linkMatch;
      return (
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#60a5fa',
            textDecoration: 'underline',
            textUnderlineOffset: '2px',
          }}
        >
          {parseInline(linkText)}
        </a>
      );
    }

    return part;
  }).filter(Boolean);
}

/**
 * Universal content formatter supporting headings, lists, quotes, and paragraphs.
 */
export default function FormattedContent({ content, className = '', style = {} }: FormattedContentProps) {
  if (!content) return null;

  // If array of strings (e.g. key responsibilities), render as clean list
  if (Array.isArray(content)) {
    return (
      <ul className={className} style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', ...style }}>
        {content.map((item, idx) => (
          <li key={idx} style={{ lineHeight: 1.65 }}>
            {parseInline(item.replace(/^[•\-*]\s*/, ''))}
          </li>
        ))}
      </ul>
    );
  }

  const rawText = String(content);
  // Split raw text into block units by double newline
  const blocks = rawText.split(/\n{2,}/);

  return (
    <div className={`formatted-content-root ${className}`} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', ...style }}>
      {blocks.map((block, bIdx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        const lines = trimmed.split('\n');

        // Heading 2 (## Heading)
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={bIdx} style={{ fontSize: '1.4rem', fontWeight: 600, marginTop: '1rem', marginBottom: '0.25rem' }}>
              {parseInline(trimmed.replace(/^##\s+/, ''))}
            </h2>
          );
        }

        // Heading 3 (### Heading)
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={bIdx} style={{ fontSize: '1.2rem', fontWeight: 600, marginTop: '0.75rem', marginBottom: '0.25rem' }}>
              {parseInline(trimmed.replace(/^###\s+/, ''))}
            </h3>
          );
        }

        // Blockquote (> Quote)
        if (trimmed.startsWith('> ') || lines.every(l => l.startsWith('> '))) {
          const quoteText = lines.map(l => l.replace(/^>\s*/, '')).join(' ');
          return (
            <blockquote
              key={bIdx}
              style={{
                margin: '0.5rem 0',
                padding: '0.75rem 1.25rem',
                borderLeft: '3px solid #3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.05)',
                borderRadius: '0 8px 8px 0',
                fontStyle: 'italic',
                color: 'inherit',
                opacity: 0.95,
              }}
            >
              {parseInline(quoteText)}
            </blockquote>
          );
        }

        // Unordered List (- item or * item or • item)
        const isBulletList = lines.every(l => /^[•\-*]\s+/.test(l.trim()));
        if (isBulletList) {
          return (
            <ul key={bIdx} style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {lines.map((l, lIdx) => (
                <li key={lIdx} style={{ lineHeight: 1.65 }}>
                  {parseInline(l.trim().replace(/^[•\-*]\s+/, ''))}
                </li>
              ))}
            </ul>
          );
        }

        // Ordered List (1. item, 2. item)
        const isNumberedList = lines.every(l => /^\d+\.\s+/.test(l.trim()));
        if (isNumberedList) {
          return (
            <ol key={bIdx} style={{ margin: 0, paddingLeft: '1.35rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {lines.map((l, lIdx) => (
                <li key={lIdx} style={{ lineHeight: 1.65 }}>
                  {parseInline(l.trim().replace(/^\d+\.\s+/, ''))}
                </li>
              ))}
            </ol>
          );
        }

        // Regular Paragraph with inline breaks
        return (
          <p key={bIdx} style={{ margin: 0, lineHeight: 1.7 }}>
            {lines.map((line, lIdx) => (
              <React.Fragment key={lIdx}>
                {parseInline(line)}
                {lIdx < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

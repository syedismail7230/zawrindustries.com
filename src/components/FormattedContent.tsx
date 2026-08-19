import React from 'react';

interface FormattedContentProps {
  content: string | string[] | undefined | null;
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
export function parseInline(text: string): React.ReactNode[] {
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

type BlockType = 
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'h4'; text: string }
  | { type: 'quote'; lines: string[] }
  | { type: 'bullet-list'; items: string[] }
  | { type: 'number-list'; items: string[] }
  | { type: 'paragraph'; lines: string[] };

/**
 * Universal content formatter supporting headings, lists, quotes, and paragraphs.
 */
export default function FormattedContent({ content, className = '', style = {} }: FormattedContentProps) {
  if (!content) return null;

  // Flatten any array or string into raw lines
  let rawLines: string[] = [];
  if (Array.isArray(content)) {
    rawLines = content.flatMap(item => String(item || '').split('\n'));
  } else {
    rawLines = String(content || '').split('\n');
  }

  // Filter out excessive trailing empties but preserve paragraph breaks
  const blocks: BlockType[] = [];
  let currentParagraph: string[] = [];
  let currentQuote: string[] = [];
  let currentBulletList: string[] = [];
  let currentNumberList: string[] = [];

  const flush = () => {
    if (currentParagraph.length > 0) {
      blocks.push({ type: 'paragraph', lines: [...currentParagraph] });
      currentParagraph = [];
    }
    if (currentQuote.length > 0) {
      blocks.push({ type: 'quote', lines: [...currentQuote] });
      currentQuote = [];
    }
    if (currentBulletList.length > 0) {
      blocks.push({ type: 'bullet-list', items: [...currentBulletList] });
      currentBulletList = [];
    }
    if (currentNumberList.length > 0) {
      blocks.push({ type: 'number-list', items: [...currentNumberList] });
      currentNumberList = [];
    }
  };

  for (let i = 0; i < rawLines.length; i++) {
    const rawLine = rawLines[i];
    const trimmed = rawLine.trim();

    // Empty line -> paragraph separator
    if (!trimmed) {
      flush();
      continue;
    }

    // Heading 2: `## Heading`
    if (/^##\s+/.test(trimmed)) {
      flush();
      blocks.push({ type: 'h2', text: trimmed.replace(/^##\s+/, '') });
      continue;
    }

    // Heading 3: `### Heading` or `###`
    if (/^###(?:\s+|$)/.test(trimmed)) {
      flush();
      const headingText = trimmed.replace(/^###\s*/, '').trim();
      if (headingText) {
        blocks.push({ type: 'h3', text: headingText });
      }
      continue;
    }

    // Heading 4: `#### Heading`
    if (/^####(?:\s+|$)/.test(trimmed)) {
      flush();
      const headingText = trimmed.replace(/^####\s*/, '').trim();
      if (headingText) {
        blocks.push({ type: 'h4', text: headingText });
      }
      continue;
    }

    // Blockquote: `> Quote text` or `>`
    if (/^>(?:\s+|$)/.test(trimmed)) {
      if (currentParagraph.length > 0) flush();
      if (currentBulletList.length > 0) flush();
      if (currentNumberList.length > 0) flush();
      const quoteText = trimmed.replace(/^>\s*/, '').trim();
      if (quoteText) {
        currentQuote.push(quoteText);
      }
      continue;
    }

    // Bullet list item: `- item`, `* item`, `• item`, `+ item`
    if (/^[•\-*+]\s+/.test(trimmed)) {
      if (currentParagraph.length > 0) flush();
      if (currentQuote.length > 0) flush();
      if (currentNumberList.length > 0) flush();
      currentBulletList.push(trimmed.replace(/^[•\-*+]\s+/, ''));
      continue;
    }

    // Numbered list item: `1. item`, `2. item`
    if (/^\d+\.\s+/.test(trimmed)) {
      if (currentParagraph.length > 0) flush();
      if (currentQuote.length > 0) flush();
      if (currentBulletList.length > 0) flush();
      currentNumberList.push(trimmed.replace(/^\d+\.\s+/, ''));
      continue;
    }

    // Regular line -> belongs to current active list or paragraph
    if (currentQuote.length > 0) {
      currentQuote.push(trimmed);
    } else if (currentBulletList.length > 0) {
      // If continuing bullet list item
      currentBulletList.push(trimmed);
    } else if (currentNumberList.length > 0) {
      currentNumberList.push(trimmed);
    } else {
      currentParagraph.push(rawLine);
    }
  }

  flush();

  return (
    <div className={`formatted-content-root ${className}`} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', ...style }}>
      {blocks.map((block, bIdx) => {
        switch (block.type) {
          case 'h2':
            return (
              <h2 key={bIdx} style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0.75rem 0 0.25rem 0', color: 'inherit' }}>
                {parseInline(block.text)}
              </h2>
            );
          case 'h3':
            return (
              <h3 key={bIdx} style={{ fontSize: '1.15rem', fontWeight: 600, margin: '0.5rem 0 0.2rem 0', color: 'inherit' }}>
                {parseInline(block.text)}
              </h3>
            );
          case 'h4':
            return (
              <h4 key={bIdx} style={{ fontSize: '1rem', fontWeight: 600, margin: '0.4rem 0 0.15rem 0', color: 'inherit' }}>
                {parseInline(block.text)}
              </h4>
            );
          case 'quote':
            return (
              <blockquote
                key={bIdx}
                style={{
                  margin: '0.5rem 0',
                  padding: '0.75rem 1.25rem',
                  borderLeft: '3px solid #3b82f6',
                  backgroundColor: 'rgba(59, 130, 246, 0.08)',
                  borderRadius: '0 8px 8px 0',
                  fontStyle: 'italic',
                  color: 'inherit',
                  opacity: 0.95,
                }}
              >
                {block.lines.map((l, lIdx) => (
                  <p key={lIdx} style={{ margin: 0, lineHeight: 1.6 }}>
                    {parseInline(l)}
                  </p>
                ))}
              </blockquote>
            );
          case 'bullet-list':
            return (
              <ul key={bIdx} style={{ margin: 0, paddingLeft: '1.35rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {block.items.map((item, iIdx) => (
                  <li key={iIdx} style={{ lineHeight: 1.65 }}>
                    {parseInline(item)}
                  </li>
                ))}
              </ul>
            );
          case 'number-list':
            return (
              <ol key={bIdx} style={{ margin: 0, paddingLeft: '1.35rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {block.items.map((item, iIdx) => (
                  <li key={iIdx} style={{ lineHeight: 1.65 }}>
                    {parseInline(item)}
                  </li>
                ))}
              </ol>
            );
          case 'paragraph':
            return (
              <p key={bIdx} style={{ margin: 0, lineHeight: 1.7 }}>
                {block.lines.map((line, lIdx) => (
                  <React.Fragment key={lIdx}>
                    {parseInline(line)}
                    {lIdx < block.lines.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </p>
            );
        }
      })}
    </div>
  );
}

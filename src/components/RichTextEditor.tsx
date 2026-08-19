"use client";

import React, { useRef, useState } from 'react';
import FormattedContent from './FormattedContent';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
  label?: string;
  required?: boolean;
  theme?: {
    bg: string;
    fg: string;
    border: string;
    muted: string;
    inputBg: string;
  };
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write content here...',
  rows = 5,
  label,
  required = false,
  theme = {
    bg: '#000000',
    fg: '#ffffff',
    border: '#27272a',
    muted: '#9ca3af',
    inputBg: '#09090b',
  },
}: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  const insertFormatting = (prefix: string, suffix: string = '', defaultText: string = 'text') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = value || '';

    const selectedText = currentVal.substring(start, end) || defaultText;
    const replacement = `${prefix}${selectedText}${suffix}`;

    const updated = currentVal.substring(0, start) + replacement + currentVal.substring(end);
    onChange(updated);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 10);
  };

  const handleBold = () => insertFormatting('**', '**', 'bold text');
  const handleItalic = () => insertFormatting('*', '*', 'italic text');
  const handleUnderline = () => insertFormatting('<u>', '</u>', 'underlined text');
  const handleH2 = () => insertFormatting('\n## ', '', 'Heading');
  const handleH3 = () => insertFormatting('\n### ', '', 'Subheading');
  const handleBulletList = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = value || '';
    const selected = currentVal.substring(start, end);

    if (selected && selected.includes('\n')) {
      const formattedLines = selected.split('\n').map(l => l.startsWith('- ') ? l : `- ${l}`).join('\n');
      const updated = currentVal.substring(0, start) + formattedLines + currentVal.substring(end);
      onChange(updated);
    } else {
      insertFormatting('\n- ', '', 'List item');
    }
  };
  const handleNumberedList = () => {
    insertFormatting('\n1. ', '', 'Step item');
  };
  const handleQuote = () => insertFormatting('\n> ', '', 'Quote or highlight text');
  const handleLink = () => {
    const url = prompt('Enter link URL (e.g. https://zawrindustries.com):', 'https://');
    if (url) {
      insertFormatting('[', `](${url})`, 'Link Title');
    }
  };

  const toolBtnStyle: React.CSSProperties = {
    padding: '0.35rem 0.65rem',
    backgroundColor: 'transparent',
    border: '1px solid transparent',
    color: theme.fg,
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.78rem',
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.25rem',
    transition: 'all 0.15s ease',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%' }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontSize: '0.875rem', color: theme.muted, fontWeight: 500 }}>
            {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
          </label>
          <span style={{ fontSize: '0.72rem', color: theme.muted }}>Supports Markdown &amp; Rich Formatting</span>
        </div>
      )}

      <div
        style={{
          border: `1px solid ${theme.border}`,
          borderRadius: '6px',
          backgroundColor: theme.bg,
          overflow: 'hidden',
        }}
      >
        {/* Formatting Toolbar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.4rem 0.6rem',
            backgroundColor: theme.inputBg,
            borderBottom: `1px solid ${theme.border}`,
            flexWrap: 'wrap',
            gap: '0.4rem',
          }}
        >
          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleBold}
              title="Bold (**text**)"
              style={toolBtnStyle}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <strong>B</strong>
            </button>
            <button
              type="button"
              onClick={handleItalic}
              title="Italic (*text*)"
              style={toolBtnStyle}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <em>I</em>
            </button>
            <button
              type="button"
              onClick={handleUnderline}
              title="Underline (<u>text</u>)"
              style={toolBtnStyle}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <u>U</u>
            </button>

            <span style={{ height: '14px', width: '1px', backgroundColor: theme.border, margin: '0 0.2rem' }} />

            <button
              type="button"
              onClick={handleH2}
              title="Heading 2 (## Heading)"
              style={toolBtnStyle}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              H2
            </button>
            <button
              type="button"
              onClick={handleH3}
              title="Heading 3 (### Subheading)"
              style={toolBtnStyle}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              H3
            </button>

            <span style={{ height: '14px', width: '1px', backgroundColor: theme.border, margin: '0 0.2rem' }} />

            <button
              type="button"
              onClick={handleBulletList}
              title="Bullet List (- item)"
              style={toolBtnStyle}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              • List
            </button>
            <button
              type="button"
              onClick={handleNumberedList}
              title="Numbered List (1. item)"
              style={toolBtnStyle}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              1. List
            </button>

            <span style={{ height: '14px', width: '1px', backgroundColor: theme.border, margin: '0 0.2rem' }} />

            <button
              type="button"
              onClick={handleQuote}
              title="Blockquote (> Quote)"
              style={toolBtnStyle}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              ❝ Quote
            </button>
            <button
              type="button"
              onClick={handleLink}
              title="Insert Link ([Text](URL))"
              style={toolBtnStyle}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              🔗 Link
            </button>
          </div>

          {/* Write / Preview Tab Switcher */}
          <div style={{ display: 'flex', gap: '0.25rem', backgroundColor: theme.bg, padding: '0.2rem', borderRadius: '4px', border: `1px solid ${theme.border}` }}>
            <button
              type="button"
              onClick={() => setActiveTab('write')}
              style={{
                padding: '0.25rem 0.6rem',
                fontSize: '0.72rem',
                fontWeight: 600,
                borderRadius: '3px',
                border: 'none',
                backgroundColor: activeTab === 'write' ? theme.fg : 'transparent',
                color: activeTab === 'write' ? theme.bg : theme.muted,
                cursor: 'pointer',
              }}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              style={{
                padding: '0.25rem 0.6rem',
                fontSize: '0.72rem',
                fontWeight: 600,
                borderRadius: '3px',
                border: 'none',
                backgroundColor: activeTab === 'preview' ? theme.fg : 'transparent',
                color: activeTab === 'preview' ? theme.bg : theme.muted,
                cursor: 'pointer',
              }}
            >
              👁️ Preview
            </button>
          </div>
        </div>

        {/* Editor Body */}
        {activeTab === 'write' ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            required={required}
            style={{
              width: '100%',
              padding: '0.85rem',
              backgroundColor: 'transparent',
              border: 'none',
              color: theme.fg,
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit',
              fontSize: '0.92rem',
              lineHeight: 1.6,
              minHeight: `${rows * 24}px`,
            }}
          />
        ) : (
          <div
            style={{
              padding: '0.85rem',
              minHeight: `${rows * 24}px`,
              backgroundColor: 'transparent',
              color: theme.fg,
              fontSize: '0.92rem',
            }}
          >
            {value ? (
              <FormattedContent content={value} />
            ) : (
              <span style={{ color: theme.muted, fontStyle: 'italic' }}>Nothing to preview yet. Switch to Write tab to add content.</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Poppins, Inter } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export interface LanguagePronunciation {
  id: string;
  name: string;
  nativeName: string;
  phonetic: string;
  guide: string;
  ipa: string;
  locale: string;
  speechText: string;
  dir?: 'ltr' | 'rtl';
}

export const PRONUNCIATION_LANGUAGES: LanguagePronunciation[] = [
  {
    id: 'en',
    name: 'English',
    nativeName: 'English',
    phonetic: 'ZA-VAR',
    guide: 'Zah - Vahr',
    ipa: '/ˈzɑːvɑːr/',
    locale: 'en-US',
    speechText: 'Zah-vahr',
    dir: 'ltr',
  },
  {
    id: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    phonetic: 'ज़ा-वर',
    guide: 'Za - Var',
    ipa: '/ˈzɑːʋəɾ/',
    locale: 'hi-IN',
    speechText: 'ज़ावर',
    dir: 'ltr',
  },
  {
    id: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    phonetic: 'زاور',
    guide: 'Zā-war',
    ipa: '/ˈzaːwaɾ/',
    locale: 'ar-SA',
    speechText: 'زَاوَرْ',
    dir: 'rtl',
  },
  {
    id: 'fr',
    name: 'French',
    nativeName: 'Français',
    phonetic: 'ZA-VAR',
    guide: 'Za - Var',
    ipa: '/za.vaʁ/',
    locale: 'fr-FR',
    speechText: 'Za-var',
    dir: 'ltr',
  },
  {
    id: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    phonetic: 'ZA-VAR',
    guide: 'Sah - Vahr',
    ipa: '/ˈtsaːfaːɐ̯/',
    locale: 'de-DE',
    speechText: 'Za-var',
    dir: 'ltr',
  },
  {
    id: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    phonetic: 'ZA-VAR',
    guide: 'Za - Var',
    ipa: '/θaˈβaɾ/',
    locale: 'es-ES',
    speechText: 'Za-var',
    dir: 'ltr',
  },
  {
    id: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    phonetic: '扎-瓦尔',
    guide: 'Zhā - Wǎ-ěr',
    ipa: '/ʈʂa˥.wa˨˩˦.aɻ/',
    locale: 'zh-CN',
    speechText: '扎瓦尔',
    dir: 'ltr',
  },
];

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'How do you pronounce ZAWR correctly?',
    answer:
      'ZAWR is officially pronounced as "ZA-VAR" (phonetic IPA: /ˈzɑːvɑːr/). It consists of two distinct syllables: "ZAH" (rhyming with father) and "VAHR" (rhyming with star or bazaar). The accent is balanced with an authoritative, open vocal cadence.',
  },
  {
    question: 'Why is ZAWR spelled with a W but pronounced as ZA-VAR?',
    answer:
      'The orthography of ZAWR reflects classical international etymology where the consonant "W" produces a resonant "V" vocal transition ("ZA-VAR"). This provides a memorable acoustic resonance that translates effortlessly across English, Hindi, Arabic, European, and Asian languages.',
  },
  {
    question: 'Are "Zawar", "Zavar", "Zaur", and "Zaver" the same as Zawr Industries?',
    answer:
      'Yes. Users searching for phonetic variations like "Zawar Industries", "Zavar", "Zaur", "Zaver Industries", or "Zohar" are directed to Zawr Industries LLP (zawrindustries.com), the multi-sector technology, manufacturing, energy, and logistics enterprise.',
  },
  {
    question: 'What are the most common mispronunciations of Zawr?',
    answer:
      'The two most frequent mispronunciations are "Zore" (rhyming with door) or "Zow-er" (rhyming with sour). Both are incorrect. The official pronunciation is "ZA-VAR" (/ˈzɑːvɑːr/).',
  },
  {
    question: 'What does the brand name ZAWR mean and represent?',
    answer:
      'ZAWR represents industrial autonomy, architectural permanence, and technological momentum across enterprise software, precision robotics manufacturing, clean energy microgrids, global freight logistics, sustainable real estate, and multi-brand franchise operations.',
  },
];

export default function PronunciationClient() {
  const [selectedLangId, setSelectedLangId] = useState<string>('en');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentLang =
    PRONUNCIATION_LANGUAGES.find((lang) => lang.id === selectedLangId) ||
    PRONUNCIATION_LANGUAGES[0];

  // Preload speech synthesis voices on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      const onVoicesChanged = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.onvoiceschanged = onVoicesChanged;
    }
  }, []);

  // Close mobile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Clean up any ongoing audio on unmount
  useEffect(() => {
    return () => {
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleLanguageChange = (langId: string) => {
    if (langId === selectedLangId) {
      setIsDropdownOpen(false);
      return;
    }

    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current);
    }

    if (isPlaying) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
    }

    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedLangId(langId);
      setIsTransitioning(false);
      setIsDropdownOpen(false);
    }, 180);
  };

  // Web Audio Harmonic Voice Fallback (human formant resonance synthesis for "Zah-Var")
  const playWebAudioFallback = useCallback(() => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) {
        setIsPlaying(false);
        return;
      }

      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new AudioCtx();
      }

      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const duration = 1.35;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, now);
      masterGain.gain.linearRampToValueAtTime(0.28, now + 0.08);
      masterGain.gain.setValueAtTime(0.28, now + duration - 0.2);
      masterGain.gain.linearRampToValueAtTime(0, now + duration);
      masterGain.connect(ctx.destination);

      // Syllable 1: "ZAH"
      const osc1 = ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(128, now);
      osc1.frequency.exponentialRampToValueAtTime(118, now + 0.5);

      const filter1 = ctx.createBiquadFilter();
      filter1.type = 'bandpass';
      filter1.frequency.setValueAtTime(730, now);
      filter1.Q.setValueAtTime(4.5, now);

      // Syllable 2: "VAHR"
      const osc2 = ctx.createOscillator();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(132, now + 0.55);
      osc2.frequency.exponentialRampToValueAtTime(105, now + duration);

      const filter2 = ctx.createBiquadFilter();
      filter2.type = 'bandpass';
      filter2.frequency.setValueAtTime(780, now + 0.55);
      filter2.Q.setValueAtTime(4.0, now + 0.55);

      osc1.connect(filter1);
      filter1.connect(masterGain);

      osc2.connect(filter2);
      filter2.connect(masterGain);

      osc1.start(now);
      osc1.stop(now + 0.52);

      osc2.start(now + 0.55);
      osc2.stop(now + duration);

      setTimeout(() => {
        setIsPlaying(false);
      }, duration * 1000);
    } catch {
      setIsPlaying(false);
    }
  }, []);

  const playAudio = useCallback(
    (customLang?: LanguagePronunciation) => {
      const targetLang = customLang || currentLang;

      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
      }

      if (isPlaying) {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        setIsPlaying(false);
        return;
      }

      setIsPlaying(true);

      safetyTimeoutRef.current = setTimeout(() => {
        setIsPlaying(false);
      }, 2200);

      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();

          const voices = window.speechSynthesis.getVoices();
          const langPrefix = targetLang.locale.slice(0, 2).toLowerCase();
          const matchVoice = voices.find(
            (v) =>
              v.lang.toLowerCase().startsWith(langPrefix) ||
              v.lang.toLowerCase() === targetLang.locale.toLowerCase()
          );

          let textToSpeak = targetLang.speechText;
          let langCode = targetLang.locale;

          if (!matchVoice) {
            if (targetLang.id === 'ar' || targetLang.id === 'zh') {
              textToSpeak = 'Za-war';
              langCode = 'en-US';
            } else if (targetLang.id === 'hi') {
              textToSpeak = 'Zah-var';
              langCode = 'en-US';
            } else {
              textToSpeak = 'Zah-vahr';
              langCode = 'en-US';
            }
          }

          const utterance = new SpeechSynthesisUtterance(textToSpeak);
          utterance.lang = langCode;
          if (matchVoice) {
            utterance.voice = matchVoice;
          }

          const baseRate =
            targetLang.id === 'hi' || targetLang.id === 'zh' ? 0.82 : 0.88;
          utterance.rate = baseRate;
          utterance.pitch = 0.95;

          utterance.onend = () => {
            if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
            setIsPlaying(false);
          };

          utterance.onerror = () => {
            if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
            playWebAudioFallback();
          };

          window.speechSynthesis.speak(utterance);
        } catch {
          if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
          playWebAudioFallback();
        }
      } else {
        if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
        playWebAudioFallback();
      }
    },
    [isPlaying, currentLang, playWebAudioFallback]
  );

  return (
    <main
      className={`pronunciation-page-container ${inter.className}`}
      style={{
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        color: '#0f172a',
        padding: 'clamp(6.5rem, 12vh, 9.5rem) 1.5rem clamp(4rem, 8vh, 6rem) 1.5rem',
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      {/* ─────────────────────────────────────────────────────────────
          1. MINIMALIST PRONUNCIATION HERO (Iconic Wordmark & Audio)
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          width: '100%',
          maxWidth: '1160px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Top Minimal Eyebrow */}
        <div
          className="pronunciation-top-eyebrow"
          style={{
            fontSize: 'clamp(0.72rem, 1.2vw, 0.82rem)',
            fontWeight: 600,
            letterSpacing: '0.36em',
            textTransform: 'uppercase',
            color: '#475569',
            marginBottom: 'clamp(1.25rem, 2.5vh, 2rem)',
            userSelect: 'none',
          }}
        >
          PRONUNCIATION
        </div>

        {/* Primary Brand Wordmark in Clean Poppins Bold */}
        <h1
          className={`pronunciation-wordmark ${poppins.className}`}
          style={{
            fontSize: 'clamp(4.2rem, 11.5vw, 8.8rem)',
            lineHeight: 0.96,
            fontWeight: 700,
            letterSpacing: '0.02em',
            color: '#000000',
            margin: 0,
            marginBottom: 'clamp(1.75rem, 4vh, 2.75rem)',
            userSelect: 'none',
          }}
        >
          ZAWR
        </h1>

        {/* Secondary Subtitle */}
        <div
          className="pronunciation-sub-eyebrow"
          style={{
            fontSize: 'clamp(0.72rem, 1.1vw, 0.84rem)',
            fontWeight: 600,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: '#64748b',
            marginBottom: 'clamp(0.4rem, 1vh, 0.75rem)',
            userSelect: 'none',
          }}
        >
          PRONOUNCED
        </div>

        {/* Dynamic Phonetic Representation */}
        <div
          className="pronunciation-phonetic-stage"
          style={{
            minHeight: 'clamp(3.5rem, 7.5vw, 5.5rem)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 'clamp(1.5rem, 3vh, 2.25rem)',
          }}
        >
          <div
            className={`pronunciation-phonetic-text ${poppins.className}`}
            style={{
              fontSize: 'clamp(2.4rem, 5.8vw, 4.5rem)',
              lineHeight: 1.1,
              fontWeight: 600,
              letterSpacing:
                currentLang.id === 'ar' || currentLang.id === 'zh' || currentLang.id === 'hi'
                  ? '0.02em'
                  : '0.08em',
              color: '#0f172a',
              opacity: isTransitioning ? 0 : 1,
              transform: isTransitioning ? 'translateY(6px)' : 'translateY(0)',
              transition:
                'opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            dir={currentLang.dir || 'ltr'}
          >
            {currentLang.phonetic}
          </div>
        </div>

        {/* Audio Control (Iconic Circular Button + Minimalist HEAR IT Label) */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 'clamp(2.5rem, 5vh, 3.75rem)',
          }}
        >
          <div
            className="pronunciation-audio-bar"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              cursor: 'pointer',
              userSelect: 'none',
            }}
            onClick={() => playAudio()}
            role="button"
            tabIndex={0}
            aria-label={
              isPlaying
                ? 'Pause pronunciation'
                : `Play ZAWR pronunciation in ${currentLang.name}`
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                playAudio();
              }
            }}
          >
            {/* Circular Button */}
            <div
              className={`pronunciation-play-circle ${isPlaying ? 'is-playing' : ''}`}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                border: '1.5px solid #000000',
                backgroundColor: isPlaying ? '#000000' : 'transparent',
                color: isPlaying ? '#ffffff' : '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: isPlaying ? '0 0 0 6px rgba(0, 0, 0, 0.06)' : 'none',
              }}
            >
              {isPlaying && (
                <span
                  style={{
                    position: 'absolute',
                    inset: '-8px',
                    borderRadius: '50%',
                    border: '1.5px solid rgba(0, 0, 0, 0.22)',
                    animation: 'subtlePulse 1.4s infinite cubic-bezier(0.25, 1, 0.5, 1)',
                    pointerEvents: 'none',
                  }}
                />
              )}

              {isPlaying ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '3px' }}>
                  <polygon points="6 4 20 12 6 20 6 4" />
                </svg>
              )}
            </div>

            {/* Label */}
            <span
              className={poppins.className}
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#000000',
              }}
            >
              {isPlaying ? 'PLAYING...' : 'HEAR IT'}
            </span>
          </div>
        </div>

        {/* Minimal Vertical Divider */}
        <div
          style={{
            width: '1px',
            height: '28px',
            backgroundColor: '#cbd5e1',
            margin: '0 auto clamp(1.25rem, 2.5vh, 1.75rem) auto',
          }}
        />

        {/* Subtle Tagline */}
        <div
          className="pronunciation-tagline"
          style={{
            fontSize: 'clamp(0.68rem, 1vw, 0.78rem)',
            fontWeight: 500,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: '#64748b',
            marginBottom: 'clamp(2rem, 4vh, 3rem)',
            userSelect: 'none',
          }}
        >
          SAME NAME. A GLOBAL CONVERSATION.
        </div>

        {/* Multilingual Selector: Desktop Minimalist Line Bar */}
        <div
          className="pronunciation-desktop-langs"
          style={{
            width: '100%',
            maxWidth: '980px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'stretch',
            borderTop: '1px solid #f1f5f9',
            paddingTop: '1.75rem',
            marginBottom: 'clamp(4.5rem, 9vh, 6.5rem)',
          }}
        >
          {PRONUNCIATION_LANGUAGES.map((lang, index) => {
            const isSelected = lang.id === selectedLangId;
            const isLast = index === PRONUNCIATION_LANGUAGES.length - 1;

            return (
              <button
                key={lang.id}
                type="button"
                onClick={() => handleLanguageChange(lang.id)}
                aria-pressed={isSelected}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'none',
                  border: 'none',
                  borderRight: isLast ? 'none' : '1px solid #e2e8f0',
                  padding: '0.75rem 0.9rem',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'opacity 0.2s ease, transform 0.2s ease',
                  outline: 'none',
                }}
              >
                <div
                  className={poppins.className}
                  style={{
                    fontSize: '0.98rem',
                    fontWeight: isSelected ? 700 : 500,
                    color: isSelected ? '#000000' : '#475569',
                    marginBottom: '4px',
                  }}
                >
                  {lang.nativeName}
                </div>
                <div
                  style={{
                    width: '22px',
                    height: '2px',
                    backgroundColor: isSelected ? '#000000' : 'transparent',
                    marginBottom: '5px',
                    transition: 'background-color 0.25s ease',
                  }}
                />
                <div
                  className={poppins.className}
                  style={{
                    fontSize: '0.84rem',
                    fontWeight: isSelected ? 600 : 400,
                    color: isSelected ? '#0f172a' : '#64748b',
                  }}
                  dir={lang.dir || 'ltr'}
                >
                  {lang.phonetic}
                </div>
              </button>
            );
          })}
        </div>

        {/* Multilingual Selector: Mobile Dropdown */}
        <div
          ref={mobileDropdownRef}
          className="pronunciation-mobile-dropdown-wrapper"
          style={{
            position: 'relative',
            display: 'none',
            marginBottom: '4rem',
            width: '100%',
            maxWidth: '300px',
          }}
        >
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-expanded={isDropdownOpen}
            aria-haspopup="listbox"
            className={poppins.className}
            style={{
              width: '100%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '11px 22px',
              borderRadius: '999px',
              border: '1.5px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#0f172a',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            }}
          >
            <span>{currentLang.nativeName} ({currentLang.phonetic})</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                marginLeft: '4px',
                transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {isDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: 0,
                right: 0,
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.12)',
                padding: '8px',
                zIndex: 50,
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                maxHeight: '320px',
                overflowY: 'auto',
              }}
              role="listbox"
            >
              {PRONUNCIATION_LANGUAGES.map((lang) => {
                const isSelected = lang.id === selectedLangId;
                return (
                  <button
                    key={lang.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleLanguageChange(lang.id)}
                    className={poppins.className}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: isSelected ? '#f8fafc' : 'transparent',
                      color: isSelected ? '#000000' : '#475569',
                      cursor: 'pointer',
                      fontSize: '0.88rem',
                      fontWeight: isSelected ? 700 : 500,
                      width: '100%',
                      textAlign: 'left',
                    }}
                  >
                    <span>{lang.nativeName}</span>
                    <span style={{ fontSize: '0.85rem', color: isSelected ? '#000000' : '#64748b' }}>
                      {lang.phonetic}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. MINIMALIST PHONETIC SPECIFICATION (No Clunky Boxes)
      ───────────────────────────────────────────────────────────── */}
      <section
        className="pronunciation-ipa-guide"
        style={{
          width: '100%',
          maxWidth: '1000px',
          margin: '0 auto clamp(4rem, 8vh, 6rem) auto',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 4vh, 3rem)' }}>
          <span
            style={{
              fontSize: '0.74rem',
              fontWeight: 600,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: '#64748b',
            }}
          >
            PHONETIC SPECIFICATION
          </span>
          <h2
            style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
              fontWeight: 400,
              letterSpacing: '-0.03em',
              color: '#000000',
              margin: '0.4rem 0 0 0',
            }}
          >
            Anatomy of the Name
          </h2>
        </div>

        {/* 3 Pure Typographic Columns with Subtle Dividers */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'clamp(1.5rem, 3vw, 3rem)',
            borderTop: '1px solid #f1f5f9',
            borderBottom: '1px solid #f1f5f9',
            padding: '2.5rem 0',
            marginBottom: 'clamp(2.5rem, 5vh, 3.5rem)',
          }}
        >
          {/* Col 1: IPA */}
          <div style={{ textAlign: 'center', padding: '0 1rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#94a3b8' }}>
              IPA NOTATION
            </span>
            <div
              className={poppins.className}
              style={{ fontSize: 'clamp(1.7rem, 2.5vw, 2.1rem)', fontWeight: 600, color: '#000000', margin: '0.6rem 0 0.4rem 0' }}
            >
              /ˈzɑː.vɑːr/
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
              International Phonetic Alphabet standard.
            </p>
          </div>

          {/* Col 2: Syllable Breakdown */}
          <div style={{ textAlign: 'center', padding: '0 1rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#94a3b8' }}>
              SYLLABLE CADENCE
            </span>
            <div
              className={poppins.className}
              style={{ fontSize: 'clamp(1.7rem, 2.5vw, 2.1rem)', fontWeight: 600, color: '#000000', margin: '0.6rem 0 0.4rem 0' }}
            >
              ZAH · VAHR
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
              Two balanced, resonant syllables with equal weight.
            </p>
          </div>

          {/* Col 3: Rhyme Anchors */}
          <div style={{ textAlign: 'center', padding: '0 1rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#94a3b8' }}>
              RHYMING ANCHORS
            </span>
            <div
              className={poppins.className}
              style={{ fontSize: 'clamp(1.7rem, 2.5vw, 2.1rem)', fontWeight: 600, color: '#000000', margin: '0.6rem 0 0.4rem 0' }}
            >
              Bazaar, Star
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
              Ending in an open, sonorous vocal resonance.
            </p>
          </div>
        </div>

        {/* Minimalist Speech Acoustics Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.5rem',
            textAlign: 'left',
          }}
        >
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>1. Initial &quot;Z&quot;</div>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5 }}>
              Voiced alveolar fricative: gentle vibration behind upper teeth.
            </p>
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>2. Open &quot;AH&quot;</div>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5 }}>
              Open back unrounded: deep, clear &quot;ah&quot; as in <em>father</em>.
            </p>
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>3. Resonant &quot;V&quot;</div>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5 }}>
              Voiced labiodental: soft contact with lower lip.
            </p>
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>4. Final &quot;AHR&quot;</div>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5 }}>
              Alveolar resonant: open release as in <em>bazaar</em>.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. MINIMALIST SEARCH MISSPELLINGS & PHONETIC TYPINGS RESOLVER
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          width: '100%',
          maxWidth: '1000px',
          margin: '0 auto clamp(4rem, 8vh, 6rem) auto',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span
            style={{
              fontSize: '0.74rem',
              fontWeight: 600,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: '#64748b',
            }}
          >
            SEARCH INTENT REFERENCE
          </span>
          <h2
            style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
              fontWeight: 400,
              letterSpacing: '-0.03em',
              color: '#000000',
              margin: '0.4rem 0 0.5rem 0',
            }}
          >
            Phonetic Transliterations &amp; Queries
          </h2>
          <p
            style={{
              fontSize: '0.92rem',
              color: '#64748b',
              maxWidth: '620px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            If you entered any of these common phonetic variations, you have reached <strong>Zawr Industries LLP</strong>.
          </p>
        </div>

        {/* Minimalist 2-Column Split */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'clamp(1.5rem, 3vw, 3rem)',
          }}
        >
          {/* Column 1: Recognized Search Queries */}
          <div
            style={{
              borderTop: '1px solid #000000',
              paddingTop: '1.25rem',
            }}
          >
            <div style={{ fontSize: '0.76rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#64748b', marginBottom: '1rem' }}>
              Recognized Search Queries
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { query: 'Zawar Industries', resolution: 'Zawr Industries (Official Spelling)' },
                { query: 'Zavar / Zavar Industries', resolution: 'Zawr (Pronounced ZA-VAR)' },
                { query: 'Zaur / Zaur Industries', resolution: 'Zawr Industries' },
                { query: 'Zaver / Zaver Industries', resolution: 'Zawr Industries' },
                { query: 'Zohar / Zohar Industries', resolution: 'Zawr Industries' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid #f1f5f9',
                    fontSize: '0.86rem',
                  }}
                >
                  <span style={{ color: '#0f172a', fontWeight: 500 }}>&ldquo;{item.query}&rdquo;</span>
                  <span style={{ color: '#64748b' }}>➔ {item.resolution}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Phonetic Distinctions */}
          <div
            style={{
              borderTop: '1px solid #000000',
              paddingTop: '1.25rem',
            }}
          >
            <div style={{ fontSize: '0.76rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#64748b', marginBottom: '1rem' }}>
              Phonetic Distinctions
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div
                style={{
                  padding: '10px 0',
                  borderBottom: '1px solid #f1f5f9',
                  fontSize: '0.86rem',
                }}
              >
                <div style={{ fontWeight: 600, color: '#475569', marginBottom: '2px' }}>
                  Avoid: &quot;Zore&quot; (rhymes with door)
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  The &apos;W&apos; does not create a monosyllabic &apos;or&apos; sound.
                </div>
              </div>

              <div
                style={{
                  padding: '10px 0',
                  borderBottom: '1px solid #f1f5f9',
                  fontSize: '0.86rem',
                }}
              >
                <div style={{ fontWeight: 600, color: '#475569', marginBottom: '2px' }}>
                  Avoid: &quot;Zow-er&quot; (rhymes with sour)
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  The vowel is an open &quot;ah&quot; rather than a diphthong &quot;ow&quot;.
                </div>
              </div>

              <div
                style={{
                  padding: '10px 0',
                  fontSize: '0.86rem',
                }}
              >
                <div style={{ fontWeight: 600, color: '#000000', marginBottom: '2px' }}>
                  Correct: &quot;ZA-VAR&quot; (/ˈzɑːvɑːr/)
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  The standardized pronunciation across all global communication.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. MINIMALIST GLOBAL TRANSLITERATION TABLE
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          width: '100%',
          maxWidth: '1000px',
          margin: '0 auto clamp(4rem, 8vh, 6rem) auto',
        }}
      >
        <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
          <span
            style={{
              fontSize: '0.74rem',
              fontWeight: 600,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: '#64748b',
            }}
          >
            MULTILINGUAL REFERENCE
          </span>
          <h2
            style={{
              fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
              fontWeight: 400,
              letterSpacing: '-0.03em',
              color: '#000000',
              margin: '0.35rem 0 0 0',
            }}
          >
            International Scripts
          </h2>
        </div>

        <div style={{ overflowX: 'auto', borderTop: '1px solid #000000' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px 14px', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Language</th>
                <th style={{ padding: '12px 14px', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Native Script</th>
                <th style={{ padding: '12px 14px', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Phonetic</th>
                <th style={{ padding: '12px 14px', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>IPA</th>
                <th style={{ padding: '12px 14px', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'right' }}>Audio</th>
              </tr>
            </thead>
            <tbody>
              {PRONUNCIATION_LANGUAGES.map((lang) => (
                <tr
                  key={lang.id}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fafafa')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '14px', fontWeight: 500, color: '#0f172a', fontSize: '0.9rem' }}>
                    {lang.name}
                  </td>
                  <td style={{ padding: '14px', color: '#000000', fontWeight: 500, fontSize: '0.96rem' }} dir={lang.dir || 'ltr'}>
                    {lang.nativeName}
                  </td>
                  <td style={{ padding: '14px', fontWeight: 500, color: '#0f172a', fontSize: '0.88rem' }}>
                    {lang.phonetic}
                  </td>
                  <td style={{ padding: '14px', color: '#64748b', fontSize: '0.84rem' }}>
                    {lang.ipa}
                  </td>
                  <td style={{ padding: '14px', textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedLangId(lang.id);
                        playAudio(lang);
                      }}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '100px',
                        border: '1px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                        color: '#0f172a',
                        fontSize: '0.74rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#000000';
                        e.currentTarget.style.backgroundColor = '#000000';
                        e.currentTarget.style.color = '#ffffff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#cbd5e1';
                        e.currentTarget.style.backgroundColor = '#ffffff';
                        e.currentTarget.style.color = '#0f172a';
                      }}
                    >
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="6 4 20 12 6 20 6 4" />
                      </svg>
                      <span>Listen</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. MINIMALIST FAQ SECTION (Clean Hairline Accordions)
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          width: '100%',
          maxWidth: '1000px',
          margin: '0 auto clamp(4rem, 8vh, 6rem) auto',
        }}
      >
        <div style={{ textAlign: 'left', marginBottom: '1.75rem' }}>
          <span
            style={{
              fontSize: '0.74rem',
              fontWeight: 600,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: '#64748b',
            }}
          >
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2
            style={{
              fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
              fontWeight: 400,
              letterSpacing: '-0.03em',
              color: '#000000',
              margin: '0.35rem 0 0 0',
            }}
          >
            Questions &amp; Answers
          </h2>
        </div>

        <div style={{ borderTop: '1px solid #000000' }}>
          {FAQ_ITEMS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                style={{
                  borderBottom: '1px solid #e2e8f0',
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.25rem 0',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: '#0f172a',
                    fontSize: '0.98rem',
                    fontWeight: 500,
                  }}
                >
                  <span>{faq.question}</span>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      fontWeight: 300,
                      color: '#64748b',
                      marginLeft: '1rem',
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <div
                    className="pronunciation-faq-answer"
                    style={{
                      padding: '0 0 1.25rem 0',
                      fontSize: '0.9rem',
                      color: '#475569',
                      lineHeight: 1.7,
                    }}
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. BRAND DIRECTORY NAVIGATION (Minimalist)
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          width: '100%',
          maxWidth: '1000px',
          margin: '0 auto',
          textAlign: 'center',
          borderTop: '1px solid #f1f5f9',
          paddingTop: '3.5rem',
        }}
      >
        <span
          style={{
            fontSize: '0.74rem',
            fontWeight: 600,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: '#64748b',
          }}
        >
          EXPLORE OUR ENTERPRISE
        </span>
        <h2
          style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
            fontWeight: 400,
            letterSpacing: '-0.03em',
            color: '#000000',
            margin: '0.35rem 0 1rem 0',
          }}
        >
          Zawr Industries Ecosystem
        </h2>
        <p
          style={{
            fontSize: '0.9rem',
            color: '#64748b',
            maxWidth: '560px',
            margin: '0 auto 2rem auto',
            lineHeight: 1.6,
          }}
        >
          Learn more about our technology platforms, advanced manufacturing, energy, logistics, and multi-brand franchise divisions.
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          {[
            { label: 'IT Services', href: '/industries/it-service' },
            { label: 'Manufacturing', href: '/industries/manufacturing' },
            { label: 'Logistics and Transport', href: '/industries/transport-and-logistics' },
            { label: 'Real Estate', href: '/industries/estate' },
            { label: 'Energy', href: '/industries/energy' },
            { label: 'Holding', href: '/industries/holding' },
            { label: 'About', href: '/about' },
            { label: 'Contact', href: '/contact' },
          ].map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              style={{
                padding: '8px 18px',
                borderRadius: '100px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                color: '#0f172a',
                fontSize: '0.84rem',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#000000';
                e.currentTarget.style.backgroundColor = '#000000';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.color = '#0f172a';
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>

      <style jsx global>{`
        @keyframes subtlePulse {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.22);
            opacity: 0.2;
          }
          100% {
            transform: scale(1.38);
            opacity: 0;
          }
        }

        @media (max-width: 768px) {
          .pronunciation-desktop-langs {
            display: none !important;
          }
          .pronunciation-mobile-dropdown-wrapper {
            display: block !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .pronunciation-play-circle,
          .pronunciation-phonetic-text {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </main>
  );
}

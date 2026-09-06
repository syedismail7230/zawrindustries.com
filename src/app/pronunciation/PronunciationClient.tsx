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
  description: string;
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
    description: 'Two equal syllables: "ZAH" (rhymes with father) followed by "VAHR" (rhymes with star).',
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
    description: 'स्पष्ट "ज़ा" और "वर" ध्वनि — जैसे ज़ावर इंडस्ट्रीज।',
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
    description: 'نطق فصيح يبدأ بحرف الزاي المفتوح مع مد خفيف ثم الواو والراء الساكنة.',
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
    description: 'Prononciation fluide en deux temps: "ZA" puis "VAR" avec un R doux.',
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
    description: 'Klare phonetische Betonung auf ZA und VAR.',
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
    description: 'Dos sílabas equilibradas: "ZA" y "VAR" con cadencia nítida.',
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
    description: '标准音节发音：扎 (zhā) - 瓦尔 (wǎ ěr)。',
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
      'ZAWR is officially pronounced as "ZA-VAR" (phonetic IPA: /ˈzɑːvɑːr/). It consists of two distinct syllables: "ZAH" (rhyming with father or spa) and "VAHR" (rhyming with star or bazaar). The accent falls smoothly across both syllables with an authoritative, open cadence.',
  },
  {
    question: 'Why is ZAWR spelled with a W but pronounced as ZA-VAR?',
    answer:
      'The orthography of ZAWR reflects classical international etymology where the consonant "W" produces a resonant, sonorous "V" vocal transition ("ZA-VAR"). This delivers a memorable, global brand resonance that translates seamlessly across English, Hindi, Arabic, European, and Asian languages.',
  },
  {
    question: 'Are "Zawar", "Zavar", "Zaur", and "Zaver" the same as Zawr Industries?',
    answer:
      'Yes. Many users search for phonetic transliterations like "Zawar Industries", "Zavar", "Zaur", "Zaver Industries", or "Zohar". All of these phonetic spellings refer to Zawr Industries LLP (zawrindustries.com), the multi-sector technology, manufacturing, energy, and logistics enterprise.',
  },
  {
    question: 'What are the most common mispronunciations of Zawr?',
    answer:
      'The two most frequent mispronunciations are saying "Zore" (rhyming with door) or "Zow-er" (rhyming with sour/power). Both are incorrect. The correct and official pronunciation is always "ZA-VAR" (/ˈzɑːvɑːr/).',
  },
  {
    question: 'What does the brand name ZAWR mean and represent?',
    answer:
      'ZAWR represents industrial autonomy, architectural permanence, and technological momentum. It is the corporate identity of Zawr Industries LLP, uniting enterprise IT services, precision robotics manufacturing, clean energy microgrids, global freight logistics, sustainable real estate, and multi-brand franchise holdings.',
  },
];

export default function PronunciationClient() {
  const [selectedLangId, setSelectedLangId] = useState<string>('en');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
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
      const baseDuration = 1.35;
      const speedMultiplier = playbackSpeed === 0.75 ? 1.35 : 1.0;
      const duration = baseDuration * speedMultiplier;

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
      osc1.frequency.exponentialRampToValueAtTime(118, now + 0.5 * speedMultiplier);

      const filter1 = ctx.createBiquadFilter();
      filter1.type = 'bandpass';
      filter1.frequency.setValueAtTime(730, now);
      filter1.Q.setValueAtTime(4.5, now);

      // Syllable 2: "VAHR"
      const osc2 = ctx.createOscillator();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(132, now + 0.55 * speedMultiplier);
      osc2.frequency.exponentialRampToValueAtTime(105, now + duration);

      const filter2 = ctx.createBiquadFilter();
      filter2.type = 'bandpass';
      filter2.frequency.setValueAtTime(780, now + 0.55 * speedMultiplier);
      filter2.Q.setValueAtTime(4.0, now + 0.55 * speedMultiplier);

      osc1.connect(filter1);
      filter1.connect(masterGain);

      osc2.connect(filter2);
      filter2.connect(masterGain);

      osc1.start(now);
      osc1.stop(now + 0.52 * speedMultiplier);

      osc2.start(now + 0.55 * speedMultiplier);
      osc2.stop(now + duration);

      setTimeout(() => {
        setIsPlaying(false);
      }, duration * 1000);
    } catch {
      setIsPlaying(false);
    }
  }, [playbackSpeed]);

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

      const maxWait = playbackSpeed === 0.75 ? 3200 : 2200;
      safetyTimeoutRef.current = setTimeout(() => {
        setIsPlaying(false);
      }, maxWait);

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
          utterance.rate = playbackSpeed === 0.75 ? baseRate * 0.78 : baseRate;
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
    [isPlaying, currentLang, playbackSpeed, playWebAudioFallback]
  );

  return (
    <main
      className={`pronunciation-page-container ${inter.className}`}
      style={{
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        color: '#0f172a',
        padding: 'clamp(6.5rem, 12vh, 8.5rem) 1.5rem clamp(4rem, 8vh, 6rem) 1.5rem',
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      {/* ─────────────────────────────────────────────────────────────
          1. GOOGLE PRONUNCIATION STUDIO HERO (Interactive Audio Stage)
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
        {/* Top Google Search Badge */}
        <div
          className="pronunciation-top-eyebrow"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: 'clamp(0.72rem, 1.2vw, 0.82rem)',
            fontWeight: 600,
            letterSpacing: '0.36em',
            textTransform: 'uppercase',
            color: '#475569',
            marginBottom: 'clamp(1.25rem, 2.5vh, 2rem)',
            userSelect: 'none',
          }}
        >
          <span>OFFICIAL PRONUNCIATION GUIDE</span>
        </div>

        {/* Primary Brand Wordmark in Website Poppins Bold */}
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

        {/* Audio Control Row (Play Button + Speed Control) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px',
            marginBottom: 'clamp(2rem, 4vh, 3rem)',
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
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                border: '1.5px solid #000000',
                backgroundColor: isPlaying ? '#000000' : 'transparent',
                color: isPlaying ? '#ffffff' : '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: isPlaying ? '0 0 0 8px rgba(0, 0, 0, 0.06)' : '0 4px 14px rgba(0, 0, 0, 0.06)',
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
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '3px' }}>
                  <polygon points="6 4 20 12 6 20 6 4" />
                </svg>
              )}
            </div>

            {/* Label */}
            <span
              className={poppins.className}
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#000000',
              }}
            >
              {isPlaying ? 'PLAYING AUDIO...' : 'HEAR PRONUNCIATION'}
            </span>
          </div>

          {/* Speed Toggle */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 8px',
              borderRadius: '100px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              fontSize: '0.76rem',
              color: '#64748b',
            }}
          >
            <span>Speed:</span>
            <button
              type="button"
              onClick={() => setPlaybackSpeed(1.0)}
              style={{
                background: playbackSpeed === 1.0 ? '#000000' : 'none',
                color: playbackSpeed === 1.0 ? '#ffffff' : '#475569',
                border: 'none',
                padding: '3px 9px',
                borderRadius: '100px',
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Normal (1.0x)
            </button>
            <button
              type="button"
              onClick={() => setPlaybackSpeed(0.75)}
              style={{
                background: playbackSpeed === 0.75 ? '#000000' : 'none',
                color: playbackSpeed === 0.75 ? '#ffffff' : '#475569',
                border: 'none',
                padding: '3px 9px',
                borderRadius: '100px',
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Slow (0.75x)
            </button>
          </div>
        </div>

        {/* Minimal Vertical Divider */}
        <div
          style={{
            width: '1px',
            height: '24px',
            backgroundColor: '#cbd5e1',
            margin: '0 auto 1.25rem auto',
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
            marginBottom: 'clamp(1.75rem, 3.5vh, 2.5rem)',
            userSelect: 'none',
          }}
        >
          SAME NAME. A GLOBAL CONVERSATION.
        </div>

        {/* Multilingual Selector: Desktop Horizontal Bar */}
        <div
          className="pronunciation-desktop-langs"
          style={{
            width: '100%',
            maxWidth: '980px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'stretch',
            borderTop: '1px solid #f1f5f9',
            borderBottom: '1px solid #f1f5f9',
            padding: '1.25rem 0',
            marginBottom: 'clamp(3.5rem, 7vh, 5.5rem)',
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
                  padding: '0.65rem 0.8rem',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'opacity 0.2s ease, transform 0.2s ease',
                  outline: 'none',
                }}
              >
                <div
                  className={poppins.className}
                  style={{
                    fontSize: '0.96rem',
                    fontWeight: isSelected ? 700 : 500,
                    color: isSelected ? '#000000' : '#475569',
                    marginBottom: '4px',
                  }}
                >
                  {lang.nativeName}
                </div>
                <div
                  style={{
                    width: '20px',
                    height: '2px',
                    backgroundColor: isSelected ? '#000000' : 'transparent',
                    marginBottom: '5px',
                    transition: 'background-color 0.25s ease',
                  }}
                />
                <div
                  className={poppins.className}
                  style={{
                    fontSize: '0.82rem',
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

        {/* Multilingual Selector: Mobile Minimalist Dropdown */}
        <div
          ref={mobileDropdownRef}
          className="pronunciation-mobile-dropdown-wrapper"
          style={{
            position: 'relative',
            display: 'none',
            marginBottom: '3rem',
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
          2. GOOGLE DICTIONARY & PHONETIC ONEBOX (Rich Search Engine Result)
      ───────────────────────────────────────────────────────────── */}
      <section
        className="pronunciation-ipa-guide"
        style={{
          width: '100%',
          maxWidth: '1080px',
          margin: '0 auto clamp(4rem, 8vh, 6rem) auto',
        }}
      >
        <div
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '24px',
            padding: 'clamp(2rem, 4vw, 3.5rem)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 600,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#64748b',
              }}
            >
              DICTIONARY PHONETIC SPECIFICATION
            </span>
            <h2
              style={{
                fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                fontWeight: 500,
                letterSpacing: '-0.02em',
                color: '#0f172a',
                margin: '0.5rem 0 0 0',
              }}
            >
              Phonetic Anatomy of ZAWR
            </h2>
          </div>

          {/* 3 Metric Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2.5rem',
            }}
          >
            {/* Card 1: IPA */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '1.5rem',
                textAlign: 'left',
              }}
            >
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500, marginBottom: '6px' }}>
                IPA TRANSCRIPTION
              </div>
              <div
                className={poppins.className}
                style={{ fontSize: '1.8rem', fontWeight: 600, color: '#000000', marginBottom: '6px' }}
              >
                /ˈzɑː.vɑːr/
              </div>
              <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
                Standard International Phonetic Alphabet representation for international speech models.
              </div>
            </div>

            {/* Card 2: Syllable Stress */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '1.5rem',
                textAlign: 'left',
              }}
            >
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500, marginBottom: '6px' }}>
                SYLLABLE BREAKDOWN
              </div>
              <div
                className={poppins.className}
                style={{ fontSize: '1.8rem', fontWeight: 600, color: '#000000', marginBottom: '6px' }}
              >
                ZAH · VAHR
              </div>
              <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
                Two equal, resonant syllables with primary vocal stress balanced across both parts.
              </div>
            </div>

            {/* Card 3: Rhyme Reference */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '1.5rem',
                textAlign: 'left',
              }}
            >
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500, marginBottom: '6px' }}>
                RHYME ANCHORS
              </div>
              <div
                className={poppins.className}
                style={{ fontSize: '1.8rem', fontWeight: 600, color: '#000000', marginBottom: '6px' }}
              >
                Bazaar, Star
              </div>
              <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
                The second syllable &quot;VAR&quot; rhymes with &quot;bazaar&quot;, &quot;avatar&quot;, or &quot;star&quot;.
              </div>
            </div>
          </div>

          {/* Mouth & Tongue Articulation Guide */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '1.75rem',
              textAlign: 'left',
            }}
          >
            <h3
              style={{
                fontSize: '1.15rem',
                fontWeight: 600,
                color: '#0f172a',
                margin: '0 0 1rem 0',
              }}
            >
              How to Speak &quot;ZAWR&quot; (Acoustic Articulation Guide)
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.25rem',
              }}
            >
              <div>
                <span style={{ fontWeight: 700, color: '#000000' }}>1. Initial &quot;Z&quot;</span>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.86rem', color: '#475569', lineHeight: 1.5 }}>
                  Voiced alveolar fricative: Place the tongue behind upper teeth and voice a soft, vibrating &quot;z&quot;.
                </p>
              </div>
              <div>
                <span style={{ fontWeight: 700, color: '#000000' }}>2. Open &quot;AH&quot;</span>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.86rem', color: '#475569', lineHeight: 1.5 }}>
                  Open back unrounded vowel: Drop jaw slightly for a clear &quot;ah&quot; as in <em>father</em> or <em>calm</em>.
                </p>
              </div>
              <div>
                <span style={{ fontWeight: 700, color: '#000000' }}>3. Resonant &quot;V&quot;</span>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.86rem', color: '#475569', lineHeight: 1.5 }}>
                  Voiced labiodental: Lightly touch top teeth to lower lip, vocalizing the &quot;v&quot; transition.
                </p>
              </div>
              <div>
                <span style={{ fontWeight: 700, color: '#000000' }}>4. Final &quot;AHR&quot;</span>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.86rem', color: '#475569', lineHeight: 1.5 }}>
                  Alveolar resonant: Complete with an open &quot;ahr&quot; cadence as in <em>star</em> or <em>radar</em>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. COMMON SEARCH MISSPELLINGS & PHONETIC TYPING RESOLVER
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          width: '100%',
          maxWidth: '1080px',
          margin: '0 auto clamp(4rem, 8vh, 6rem) auto',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span
            style={{
              fontSize: '0.78rem',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#64748b',
            }}
          >
            SEARCH ENGINE INTENT CLARIFICATION
          </span>
          <h2
            style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
              fontWeight: 500,
              letterSpacing: '-0.02em',
              color: '#0f172a',
              margin: '0.5rem 0 0.75rem 0',
            }}
          >
            Common Misspellings &amp; Search Queries
          </h2>
          <p
            style={{
              fontSize: '0.95rem',
              color: '#64748b',
              maxWidth: '680px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            If you entered any of the following phonetic variations into Google or voice search, you have reached the official home of <strong>Zawr Industries LLP</strong>.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {/* Card: Common Phonetic Search Queries */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                }}
              >
                🔍
              </div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 600, color: '#0f172a' }}>
                Phonetic Search Variations
              </h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6, marginBottom: '1rem' }}>
              People searching for these phonetic terms are seeking <strong>Zawr Industries</strong>:
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { typed: 'Zawar Industries', match: 'Zawr Industries (Official Name)' },
                { typed: 'Zavar / Zavar Industries', match: 'Zawr (Official Pronunciation: ZA-VAR)' },
                { typed: 'Zaur / Zaur Industries', match: 'Zawr Industries' },
                { typed: 'Zaver / Zaver Industries', match: 'Zawr Industries' },
                { typed: 'Zohar / Zohar Industries', match: 'Zawr Industries' },
              ].map((item, idx) => (
                <li
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: '#f8fafc',
                    fontSize: '0.85rem',
                  }}
                >
                  <span style={{ color: '#475569', fontFamily: 'monospace', fontWeight: 600 }}>&ldquo;{item.typed}&rdquo;</span>
                  <span style={{ color: '#000000', fontWeight: 500 }}>➔ {item.match}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card: Mispronunciations to Avoid */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#fef2f2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#dc2626',
                  fontWeight: 700,
                }}
              >
                ✕
              </div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 600, color: '#0f172a' }}>
                Mispronunciations to Avoid
              </h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6, marginBottom: '1rem' }}>
              Common phonetic mistakes made by first-time readers:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ padding: '10px 14px', borderRadius: '10px', backgroundColor: '#fef2f2', border: '1px solid #fee2e2' }}>
                <span style={{ fontWeight: 700, color: '#dc2626' }}>❌ &quot;Zore&quot; (Rhymes with door)</span>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.82rem', color: '#7f1d1d' }}>
                  Incorrect. The letter &apos;W&apos; does not blend into an &apos;or&apos; sound.
                </p>
              </div>
              <div style={{ padding: '10px 14px', borderRadius: '10px', backgroundColor: '#fef2f2', border: '1px solid #fee2e2' }}>
                <span style={{ fontWeight: 700, color: '#dc2626' }}>❌ &quot;Zow-er&quot; (Rhymes with sour)</span>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.82rem', color: '#7f1d1d' }}>
                  Incorrect. The vocalization is two distinct, open syllables: <strong>ZA-VAR</strong>.
                </p>
              </div>
              <div style={{ padding: '10px 14px', borderRadius: '10px', backgroundColor: '#f0fdf4', border: '1px solid #dcfce7' }}>
                <span style={{ fontWeight: 700, color: '#16a34a' }}>✅ &quot;ZA-VAR&quot; (/ˈzɑːvɑːr/)</span>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.82rem', color: '#14532d' }}>
                  Official and accurate across all global enterprise communication.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. GLOBAL PHONETIC MATRIX (All 7 Languages with Audio)
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          width: '100%',
          maxWidth: '1080px',
          margin: '0 auto clamp(4rem, 8vh, 6rem) auto',
        }}
      >
        <div style={{ textAlign: 'left', marginBottom: '1.75rem' }}>
          <span
            style={{
              fontSize: '0.78rem',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#64748b',
            }}
          >
            INTERNATIONAL PHONETIC REFERENCE
          </span>
          <h2
            style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
              fontWeight: 500,
              letterSpacing: '-0.02em',
              color: '#0f172a',
              margin: '0.5rem 0 0 0',
            }}
          >
            Global Transliteration Guide
          </h2>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Language</th>
                  <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Native Script</th>
                  <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Phonetic Respell</th>
                  <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>IPA</th>
                  <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'right' }}>Audio</th>
                </tr>
              </thead>
              <tbody>
                {PRONUNCIATION_LANGUAGES.map((lang, idx) => (
                  <tr
                    key={lang.id}
                    style={{
                      borderBottom: idx === PRONUNCIATION_LANGUAGES.length - 1 ? 'none' : '1px solid #f1f5f9',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '16px 18px', fontWeight: 600, color: '#0f172a', fontSize: '0.92rem' }}>
                      {lang.name}
                    </td>
                    <td style={{ padding: '16px 18px', color: '#000000', fontWeight: 500, fontSize: '1rem' }} dir={lang.dir || 'ltr'}>
                      {lang.nativeName}
                    </td>
                    <td style={{ padding: '16px 18px', fontFamily: 'monospace', fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>
                      {lang.phonetic}
                    </td>
                    <td style={{ padding: '16px 18px', color: '#64748b', fontSize: '0.88rem' }}>
                      {lang.ipa}
                    </td>
                    <td style={{ padding: '16px 18px', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedLangId(lang.id);
                          playAudio(lang);
                        }}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '100px',
                          border: '1px solid #e2e8f0',
                          backgroundColor: '#ffffff',
                          color: '#0f172a',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
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
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
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
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. SEARCH ENGINE FAQ ACCORDION (Matches Google FAQ Schema)
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          width: '100%',
          maxWidth: '1080px',
          margin: '0 auto clamp(4rem, 8vh, 6rem) auto',
        }}
      >
        <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
          <span
            style={{
              fontSize: '0.78rem',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#64748b',
            }}
          >
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2
            style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
              fontWeight: 500,
              letterSpacing: '-0.02em',
              color: '#0f172a',
              margin: '0.5rem 0 0 0',
            }}
          >
            Everything About the Name ZAWR
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {FAQ_ITEMS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  boxShadow: isOpen ? '0 4px 18px rgba(0,0,0,0.04)' : 'none',
                  borderColor: isOpen ? '#cbd5e1' : '#e2e8f0',
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
                    padding: '1.25rem 1.5rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: '#0f172a',
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  <span>{faq.question}</span>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: '#f8fafc',
                      marginLeft: '1rem',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.25s ease',
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </button>
                {isOpen && (
                  <div
                    className="pronunciation-faq-answer"
                    style={{
                      padding: '0 1.5rem 1.35rem 1.5rem',
                      fontSize: '0.92rem',
                      color: '#475569',
                      lineHeight: 1.7,
                      borderTop: '1px solid #f1f5f9',
                      paddingTop: '1rem',
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
          6. EXPLORE ZAWR INDUSTRIES (Brand Directory)
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          width: '100%',
          maxWidth: '1080px',
          margin: '0 auto',
          textAlign: 'center',
          borderTop: '1px solid #f1f5f9',
          paddingTop: '4rem',
        }}
      >
        <span
          style={{
            fontSize: '0.78rem',
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#64748b',
          }}
        >
          DISCOVER OUR OPERATING SECTORS
        </span>
        <h2
          style={{
            fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
            fontWeight: 400,
            letterSpacing: '-0.02em',
            color: '#0f172a',
            margin: '0.5rem 0 1.25rem 0',
          }}
        >
          Explore Zawr Industries
        </h2>
        <p
          style={{
            fontSize: '0.95rem',
            color: '#64748b',
            maxWidth: '600px',
            margin: '0 auto 2.5rem auto',
            lineHeight: 1.6,
          }}
        >
          Discover how Zawr Industries accelerates technology, manufacturing, energy, freight, and multi-brand franchise ecosystems worldwide.
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '12px',
          }}
        >
          {[
            { label: 'IT Services', href: '/industries/it-service' },
            { label: 'Manufacturing', href: '/industries/manufacturing' },
            { label: 'Logistics and Transport', href: '/industries/transport-and-logistics' },
            { label: 'Real Estate', href: '/industries/estate' },
            { label: 'Energy & Microgrids', href: '/industries/energy' },
            { label: 'Holding Franchises', href: '/industries/holding' },
            { label: 'About Us', href: '/about' },
            { label: 'Contact', href: '/contact' },
          ].map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              style={{
                padding: '10px 22px',
                borderRadius: '100px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                color: '#0f172a',
                fontSize: '0.88rem',
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

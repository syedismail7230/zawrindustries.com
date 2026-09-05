'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
    locale: 'ar-SA',
    speechText: 'زاور',
    dir: 'rtl',
  },
  {
    id: 'fr',
    name: 'French',
    nativeName: 'Français',
    phonetic: 'ZA-VAR',
    guide: 'Za - Var',
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
    locale: 'zh-CN',
    speechText: '扎瓦尔',
    dir: 'ltr',
  },
];

export default function PronunciationClient() {
  const [selectedLangId, setSelectedLangId] = useState<string>('en');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const currentLang =
    PRONUNCIATION_LANGUAGES.find((lang) => lang.id === selectedLangId) ||
    PRONUNCIATION_LANGUAGES[0];

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

  const playAudio = useCallback(() => {
    if (isPlaying) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(currentLang.speechText);
      utterance.lang = currentLang.locale;
      utterance.rate =
        currentLang.locale.startsWith('hi') || currentLang.locale.startsWith('zh')
          ? 0.82
          : 0.88;
      utterance.pitch = 0.95;

      const voices = window.speechSynthesis.getVoices();
      const matchVoice = voices.find(
        (v) =>
          v.lang.toLowerCase() === currentLang.locale.toLowerCase() ||
          v.lang.toLowerCase().startsWith(currentLang.locale.slice(0, 2).toLowerCase())
      );
      if (matchVoice) {
        utterance.voice = matchVoice;
      }

      utterance.onend = () => {
        setIsPlaying(false);
      };

      utterance.onerror = () => {
        playWebAudioFallback();
      };

      try {
        window.speechSynthesis.speak(utterance);
      } catch {
        playWebAudioFallback();
      }
    } else {
      playWebAudioFallback();
    }
  }, [isPlaying, currentLang, playWebAudioFallback]);

  return (
    <main
      className={`pronunciation-page-container ${inter.className}`}
      style={{
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        color: '#0f172a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(7.5rem, 15vh, 10.5rem) 1.5rem clamp(4.5rem, 9vh, 6.5rem) 1.5rem',
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      <div
        className="pronunciation-content-wrapper"
        style={{
          width: '100%',
          maxWidth: '1160px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          margin: '0 auto',
        }}
      >
        {/* Top Eyebrow */}
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
            marginBottom: 'clamp(2rem, 4.5vh, 3.25rem)',
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
            marginBottom: 'clamp(0.5rem, 1.2vh, 0.9rem)',
            userSelect: 'none',
          }}
        >
          PRONOUNCED
        </div>

        {/* Dynamic Phonetic Representation in Website Poppins / Clean Sans Typography */}
        <div
          className="pronunciation-phonetic-stage"
          style={{
            minHeight: 'clamp(3.5rem, 7.5vw, 5.5rem)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 'clamp(1.5rem, 3.2vh, 2.25rem)',
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

        {/* Audio Control Row (Circular Play Button + HEAR IT Label) */}
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
          onClick={playAudio}
          role="button"
          tabIndex={0}
          aria-label={isPlaying ? 'Pause pronunciation' : `Play ZAWR pronunciation in ${currentLang.name}`}
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
            {/* Subtle Pulse Animation Wave while playing */}
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
              // Pause / Stop Icon
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="none"
                style={{ marginLeft: 0 }}
              >
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              // Play Triangle Icon
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="none"
                style={{ marginLeft: '3px' }}
              >
                <polygon points="6 4 20 12 6 20 6 4" />
              </svg>
            )}
          </div>

          {/* HEAR IT Text Label in Website Theme */}
          <span
            className={poppins.className}
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#000000',
              transition: 'color 0.2s ease',
            }}
          >
            {isPlaying ? 'PLAYING...' : 'HEAR IT'}
          </span>
        </div>

        {/* Minimal Vertical Divider */}
        <div
          style={{
            width: '1px',
            height: '30px',
            backgroundColor: '#cbd5e1',
            margin: 'clamp(2.25rem, 4vh, 3.25rem) auto clamp(1.25rem, 2.2vh, 1.75rem) auto',
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
            marginBottom: 'clamp(2.5rem, 5vh, 4rem)',
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
            paddingTop: '2rem',
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
                  padding: '0.75rem 1rem',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'opacity 0.2s ease, transform 0.2s ease',
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.opacity = '0.7';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                {/* Language Name */}
                <div
                  className={poppins.className}
                  style={{
                    fontSize: '1rem',
                    fontWeight: isSelected ? 700 : 500,
                    color: isSelected ? '#000000' : '#475569',
                    marginBottom: '4px',
                    letterSpacing: '0.01em',
                  }}
                >
                  {lang.nativeName}
                </div>

                {/* Subtle active underline indicator */}
                <div
                  style={{
                    width: '24px',
                    height: '2.5px',
                    backgroundColor: isSelected ? '#000000' : 'transparent',
                    marginBottom: '6px',
                    transition: 'background-color 0.25s ease',
                  }}
                />

                {/* Phonetic Representation */}
                <div
                  className={poppins.className}
                  style={{
                    fontSize: '0.84rem',
                    fontWeight: isSelected ? 600 : 400,
                    letterSpacing:
                      lang.id === 'ar' || lang.id === 'zh' || lang.id === 'hi'
                        ? '0.02em'
                        : '0.06em',
                    color: isSelected ? '#0f172a' : '#64748b',
                    transition: 'color 0.2s ease',
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
            marginTop: '0.5rem',
            width: '100%',
            maxWidth: '290px',
          }}
        >
          {/* Minimalist Pill Dropdown Button */}
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
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
          >
            {/* Globe Icon */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: '#475569' }}
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>

            <span>{currentLang.nativeName} ({currentLang.phonetic})</span>

            {/* Chevron */}
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

          {/* Floating Dropdown Menu */}
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
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.12), 0 4px 10px rgba(0, 0, 0, 0.04)',
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
                      transition: 'background-color 0.15s ease',
                      width: '100%',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = '#f1f5f9';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <span>{lang.nativeName}</span>
                    <span
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: isSelected ? 600 : 400,
                        color: isSelected ? '#000000' : '#64748b',
                        letterSpacing:
                          lang.id === 'ar' || lang.id === 'zh' || lang.id === 'hi'
                            ? '0.02em'
                            : '0.06em',
                      }}
                      dir={lang.dir || 'ltr'}
                    >
                      {lang.phonetic}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

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

import type { Metadata } from 'next';
import PronunciationClient from './PronunciationClient';

export const metadata: Metadata = {
  title: 'How to Pronounce ZAWR (ZA-VAR) — Official Brand Pronunciation & Phonetic Guide | Zawr Industries',
  description:
    'The official pronunciation of ZAWR is "ZA-VAR" (/zɑːvɑːr/). Explore our audio guide in 7 languages, phonetic breakdown, IPA spelling, and syllable acoustics for Zawr Industries.',
  keywords: [
    'How to pronounce ZAWR',
    'How to pronounce Zawr Industries',
    'ZAWR pronunciation',
    'ZAWR pronounced',
    'ZA-VAR',
    'how to say ZAWR',
    'Zawr phonetic spelling',
    'Zawr pronunciation guide',
    'ZAWR audio pronunciation',
    'Zawr pronunciation audio',
    'Zawr spoken audio',
    'Zawr name meaning',
    'Zawr name origin',
    'Zawr transliteration',
    'Zawr IPA spelling',
    'Zawr syllable breakdown',
    'Zawr Industries official pronunciation',
  ],
  alternates: {
    canonical: 'https://zawrindustries.com/pronunciation',
  },
  openGraph: {
    title: 'How to Pronounce ZAWR (ZA-VAR) — Official Brand Pronunciation Guide',
    description:
      'The official pronunciation of ZAWR is "ZA-VAR" (/zɑːvɑːr/). Listen to audio pronunciations across English, Hindi, Arabic, French, German, Spanish, and Mandarin.',
    url: 'https://zawrindustries.com/pronunciation',
    siteName: 'Zawr Industries LLP',
    type: 'website',
    images: [
      {
        url: 'https://zawrindustries.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ZAWR Pronunciation Guide — Pronounced ZA-VAR',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Pronounce ZAWR (ZA-VAR) — Official Brand Pronunciation Guide',
    description:
      'The official pronunciation of ZAWR is "ZA-VAR" (/zɑːvɑːr/). Discover our multilingual audio guide and phonetic respellings.',
    images: ['https://zawrindustries.com/og-image.png'],
  },
};

export default function PronunciationPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://zawrindustries.com/pronunciation#webpage',
        url: 'https://zawrindustries.com/pronunciation',
        name: 'How to Pronounce ZAWR (ZA-VAR) — Official Brand Pronunciation Guide',
        description:
          'Official brand pronunciation and phonetic guide for ZAWR (pronounced ZA-VAR /zɑːvɑːr/) by Zawr Industries LLP, with audio playback across 7 global languages.',
        isPartOf: {
          '@type': 'WebSite',
          '@id': 'https://zawrindustries.com/#website',
          name: 'Zawr Industries',
          url: 'https://zawrindustries.com',
        },
        publisher: {
          '@type': 'Organization',
          '@id': 'https://zawrindustries.com/#corporation',
          name: 'Zawr Industries LLP',
          url: 'https://zawrindustries.com',
          logo: 'https://zawrindustries.com/assets/logo-black.png',
        },
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: [
            '.pronunciation-wordmark',
            '.pronunciation-phonetic-text',
            '.pronunciation-ipa-guide',
            '.pronunciation-faq-answer',
          ],
        },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://zawrindustries.com',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Pronunciation Guide',
              item: 'https://zawrindustries.com/pronunciation',
            },
          ],
        },
      },
      {
        '@type': 'DefinedTerm',
        '@id': 'https://zawrindustries.com/pronunciation#term-zawr',
        name: 'ZAWR',
        termCode: 'ZAWR',
        description:
          'ZAWR is a name built to represent strength, ambition, and forward movement. It is the global brand name of Zawr Industries LLP, pronounced "ZA-VAR" (/zɑːvɑːr/).',
        inDefinedTermSet: {
          '@type': 'DefinedTermSet',
          name: 'Zawr Industries Brand Lexicon',
        },
      },
      {
        '@type': 'PronounceableText',
        textValue: 'ZAWR',
        phoneticText: '/zɑːvɑːr/',
        speechToTextMarkup: 'ZA-VAR',
        inLanguage: ['en', 'hi', 'ar', 'fr', 'de', 'es', 'zh'],
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://zawrindustries.com/pronunciation#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How do you pronounce ZAWR?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'ZAWR is officially pronounced as "ZA-VAR" (phonetically: /ˈzɑːvɑːr/). The first syllable is "ZAH" (with an open vowel as in father), and the second syllable is "VAHR" (with an open, resonant vocal cadence).',
            },
          },
          {
            '@type': 'Question',
            name: 'Why is ZAWR spelled with a W but pronounced as ZA-VAR?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The spelling ZAWR reflects the classical global orthography where the consonant "W" functions with a resonant "V" vocal transition ("ZA-VAR"), creating an authoritative acoustic cadence across international languages.',
            },
          },
          {
            '@type': 'Question',
            name: 'How do the syllables in ZAWR transition?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The brand name transitions smoothly in two syllables: "ZAH" followed by "VAHR" (/ˈzɑːvɑːr/). The letter "W" is vocalized as a resonant "V" sound, providing acoustic clarity and effortless pronunciation across all languages.',
            },
          },
          {
            '@type': 'Question',
            name: 'What does the brand name ZAWR mean and represent?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'A name built to represent strength, ambition, and forward movement.',
            },
          },
          {
            '@type': 'Question',
            name: 'How is ZAWR pronounced in Hindi, Arabic, and other languages?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'In Hindi, it is written as ज़ा-वर (Za-var); in Arabic as زاور (Zā-war); in French, German, and Spanish as ZA-VAR; and in Mandarin Chinese as 扎-瓦尔 (Zhā-wǎ-ěr).',
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PronunciationClient />
    </>
  );
}

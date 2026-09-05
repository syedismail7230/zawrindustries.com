import type { Metadata } from 'next';
import PronunciationClient from './PronunciationClient';

export const metadata: Metadata = {
  title: 'How to Pronounce ZAWR — Official Brand Pronunciation Guide (ZA-VAR)',
  description:
    'The official pronunciation of ZAWR is "ZA-VAR". Explore the phonetic guide, native script pronunciations, and authentic audio pronunciation across English, Hindi, Arabic, French, German, Spanish, and Mandarin.',
  keywords: [
    'How to pronounce ZAWR',
    'ZAWR pronunciation',
    'ZA-VAR',
    'Zawr Industries pronunciation',
    'Zawr name meaning and pronunciation',
    'ZAWR audio pronunciation',
  ],
  alternates: {
    canonical: 'https://zawrindustries.com/pronunciation',
  },
  openGraph: {
    title: 'How to Pronounce ZAWR — Official Brand Pronunciation Guide (ZA-VAR)',
    description:
      'The official pronunciation of ZAWR is "ZA-VAR". Discover our multilingual phonetic guide and audio playback.',
    url: 'https://zawrindustries.com/pronunciation',
    siteName: 'Zawr Industries LLP',
    images: [
      {
        url: 'https://zawrindustries.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ZAWR Pronunciation Guide — ZA-VAR',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Pronounce ZAWR — Official Brand Pronunciation Guide (ZA-VAR)',
    description:
      'The official pronunciation of ZAWR is "ZA-VAR". Discover our multilingual phonetic guide and audio playback.',
    images: ['https://zawrindustries.com/og-image.png'],
  },
};

export default function PronunciationPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'How to Pronounce ZAWR — Official Brand Pronunciation Guide',
    description:
      'Official brand pronunciation guide for ZAWR (pronounced ZA-VAR) with audio and multilingual phonetic representations.',
    url: 'https://zawrindustries.com/pronunciation',
    publisher: {
      '@type': 'Organization',
      name: 'Zawr Industries LLP',
      url: 'https://zawrindustries.com',
      logo: 'https://zawrindustries.com/assets/logo-black.png',
    },
    mainEntity: {
      '@type': 'PronounceableText',
      textValue: 'ZAWR',
      phoneticText: 'ZA-VAR',
      speechToTextMarkup: 'ZA-VAR',
      inLanguage: ['en', 'hi', 'ar', 'fr', 'de', 'es', 'zh'],
    },
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

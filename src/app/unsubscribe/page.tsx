import type { Metadata } from 'next';
import UnsubscribeClient from './UnsubscribeClient';

export const metadata: Metadata = {
  title: 'Unsubscribe & Communication Preferences — Zawr Industries',
  description: 'Manage your email subscription preferences or unsubscribe from Zawr Industries news alerts, executive briefings, and corporate announcements.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: 'https://zawrindustries.com/unsubscribe',
  },
};

export default function UnsubscribePage() {
  return <UnsubscribeClient />;
}

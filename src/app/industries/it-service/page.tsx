import { Metadata } from 'next';
import React from 'react';
import ITServicesPageClient from './ITServicesPageClient';

export const metadata: Metadata = {
  title: "IT Services & Custom Software Development — Zawr Industries Bangalore",
  description: "Zawr Industries delivers custom software development, AI solutions, cloud services, cybersecurity, SEO, and managed IT services to businesses across India, UAE and USA.",
};

export default function ITServicesPage() {
  return <ITServicesPageClient />;
}

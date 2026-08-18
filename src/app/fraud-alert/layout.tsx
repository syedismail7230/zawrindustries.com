import { Metadata } from 'next';
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd';

export const metadata: Metadata = {
  title: "Fraud Alert & Security Notice — Official Verification | Zawr Industries",
  description: "Official advisory regarding unauthorized recruitment solicitations, fraudulent communications, and verified corporate contact channels for Zawr Industries LLP.",
  alternates: {
    canonical: 'https://zawrindustries.com/fraud-alert',
  }
};

export default function FraudAlertLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', item: '/' },
          { name: 'Notices', item: '/notices' },
          { name: 'Fraud Alert', item: '/fraud-alert' }
        ]}
      />
      {children}
    </>
  );
}

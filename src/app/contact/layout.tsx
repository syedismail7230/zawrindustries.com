import { Metadata } from 'next';
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd';

export const metadata: Metadata = {
  title: "Contact — Corporate Headquarters & Direct Inquiries | Zawr Industries",
  description: "Get in touch with Zawr Industries LLP. Contact our executive public relations desk, global client relations, technology desks, or Bengaluru headquarters directly.",
  alternates: {
    canonical: 'https://zawrindustries.com/contact',
  },
  openGraph: {
    title: "Contact Zawr Industries — Global Headquarters & Executive Desks",
    description: "Direct email directories, public relations desk, partnership channels, and headquarters contact details.",
    url: "https://zawrindustries.com/contact",
    type: "website",
  }
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', item: '/' },
          { name: 'Contact', item: '/contact' }
        ]}
      />
      {children}
    </>
  );
}

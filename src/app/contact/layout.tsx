import { Metadata } from 'next';
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd';

export const metadata: Metadata = {
  title: "Contact Us — Zawr Industries",
  description: "Get in touch with Zawr Industries LLP. Corporate inquiries, executive relations desk, and global headquarters.",
  alternates: {
    canonical: 'https://zawrindustries.com/contact',
  },
  openGraph: {
    title: "Contact Us — Zawr Industries",
    description: "Corporate inquiries, executive desks, and global headquarters in Bengaluru, India.",
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

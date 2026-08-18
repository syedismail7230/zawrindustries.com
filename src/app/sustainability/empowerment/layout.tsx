import { Metadata } from 'next';
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd';

export const metadata: Metadata = {
  title: "Empowerment & Human Capital — ESG Sustainability | Zawr Industries",
  description: "Empowering communities and developing workforce skills through inclusive growth, education programs, and sustainable human capital initiatives at Zawr Industries.",
  alternates: {
    canonical: 'https://zawrindustries.com/sustainability/empowerment',
  }
};

export default function EmpowermentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', item: '/' },
          { name: 'Sustainability', item: '/sustainability/environment' },
          { name: 'Empowerment', item: '/sustainability/empowerment' }
        ]}
      />
      {children}
    </>
  );
}

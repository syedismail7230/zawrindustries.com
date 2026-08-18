import { Metadata } from 'next';
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd';

export const metadata: Metadata = {
  title: "Media Kit & Brand Assets — Press Kit | Zawr Industries",
  description: "Official media kit, brand guidelines, executive photography, and certified company logos for press and media outlets.",
  alternates: {
    canonical: 'https://zawrindustries.com/newsroom/media-kit',
  }
};

export default function MediaKitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', item: '/' },
          { name: 'Newsroom', item: '/newsroom' },
          { name: 'Media Kit', item: '/newsroom/media-kit' }
        ]}
      />
      {children}
    </>
  );
}

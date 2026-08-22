import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Media & Brand Assets — Newsroom | Zawr Industries",
  description: "Official logos, brand guidelines, executive photography, and press kits for Zawr Industries.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function MediaKitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Public Relations Desk — Contact | Zawr Industries",
  description: "Official press contact, media relations, and corporate communications desk for Zawr Industries.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function PublicRelationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

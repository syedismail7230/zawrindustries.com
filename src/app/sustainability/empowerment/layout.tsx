import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Empowerment & Inclusion — Sustainability | Zawr Industries",
  description: "Zawr Industries empowerment programs, skill development, community upliftment, and gender equality initiatives.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function EmpowermentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

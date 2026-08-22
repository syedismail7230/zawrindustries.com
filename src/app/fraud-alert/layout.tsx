import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Fraud Alert & Security Advisory — Zawr Industries",
  description: "Official security advisory and fraud prevention warnings from Zawr Industries LLP.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function FraudAlertLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

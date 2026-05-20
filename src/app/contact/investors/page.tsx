import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Investor Relations — Zawr Industries LLP",
  description: "Investor relations information for Zawr Industries — financial reporting, subsidiaries, shareholder information, and strategic growth updates for the Zawr Industries group.",
};

export default function InvestorsPage() {
  return (
    <div style={{ padding: '8rem 5% 4rem', minHeight: '60vh', color: 'var(--text-dark)', backgroundColor: 'var(--bg-light)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--primary-color)', marginBottom: '1.5rem' }}>Investor Relations</h1>
        <p style={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'var(--text-light)', textAlign: 'left' }}>
          Zawr Industries is committed to transparent financial reporting and sustained value creation for our stakeholders. This portal provides access to our financial reports, subsidiary updates, shareholder information, and strategic growth presentations across all our operating verticals.
        </p>
      </div>
    </div>
  );
}

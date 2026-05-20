import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "IT Services & Custom Software Development — Zawr Industries Bangalore",
  description: "Zawr Industries delivers custom software development, AI solutions, cloud services, cybersecurity, SEO, and managed IT services to businesses across India, UAE and USA.",
};

export default function ITServicesPage() {
  return (
    <div style={{ padding: '8rem 5% 4rem', minHeight: '60vh', color: 'var(--text-dark)', backgroundColor: 'var(--bg-light)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--primary-color)', marginBottom: '1.5rem' }}>IT Services & Solutions</h1>
        <p style={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'var(--text-light)', textAlign: 'left' }}>
          Zawr Industries provides end-to-end Information Technology services to startups, enterprises, and government organisations across India and international markets. Our IT division specialises in custom software development, mobile and web application development, AI and machine learning integration, cloud infrastructure, cybersecurity, SEO monitoring, managed IT services, business intelligence, and digital transformation consulting. Powered by our proprietary Firm AI platform, we deliver intelligent, scalable technology solutions that give businesses a measurable competitive advantage. We are an authorised partner of AWS, Google Cloud, Microsoft Azure, Nvidia, Salesforce, and Anthropic.
        </p>
      </div>
    </div>
  );
}

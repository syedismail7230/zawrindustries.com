'use client';

import Link from 'next/link';

export default function FraudAlertPage() {
  const cardStyle: React.CSSProperties = {
    backgroundColor: '#000000',
    border: 'none',
    borderRadius: '1rem',
    padding: '1.75rem',
    color: '#ffffff'
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', color: '#000000', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Hero */}
      <section style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        {/* Full natural-size image */}
        <img
          src="https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto/v1783710490/zawr/assets/fraud-alert-hero.png"
          alt="Fraud Alert"
          style={{ width: '100%', height: 'auto', display: 'block' }}
         loading="lazy" decoding="async" />
        {/* Dark overlay */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.35) 60%, transparent 100%)',
          zIndex: 1
        }}></div>
        {/* Text overlay */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '6%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          maxWidth: '700px'
        }}>
          <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.25em', color: '#ef4444', display: 'block', marginBottom: '1.25rem' }}>
            ⚠ Fraud Alert
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 300, margin: '0 0 1.25rem 0', letterSpacing: '-0.03em', lineHeight: 1.05, color: '#ffffff' }}>
            Protect Yourself Against Impersonation, Recruitment Scams and Unauthorized Communications
          </h1>
          <p style={{ fontSize: 'clamp(0.9rem, 1.6vw, 1.1rem)', color: '#e5e7eb', maxWidth: '560px', lineHeight: 1.7, margin: 0, fontWeight: 400 }}>
            Stay Alert. Verify Before You Act.
          </p>
        </div>
      </section>

      {/* Intro Block */}
      <section style={{ padding: '5rem 6%', borderBottom: '1px solid #e5e7eb', maxWidth: '900px', margin: '0 auto' }}>
        <p style={{ fontSize: '1rem', color: '#374151', lineHeight: 1.9, marginBottom: '1.5rem' }}>
          We have become aware that individuals or organizations may falsely represent themselves as Zawr Industries LLP, our brands, our representatives, our employees, our recruiters, our business partners, or affiliated entities in an attempt to obtain money, confidential information, business access, employment fees, banking details, investments, credentials, or other unauthorized benefits.
        </p>
        <p style={{ fontSize: '1rem', color: '#374151', lineHeight: 1.9, marginBottom: '1.5rem' }}>
          This page has been created to help visitors, candidates, clients, vendors, partners, and members of the public identify and report potentially fraudulent activity.
        </p>
        <div style={{ ...cardStyle, padding: '1.75rem 2rem' }}>
          <p style={{ fontSize: '1rem', color: '#fca5a5', lineHeight: 1.8, margin: 0, fontWeight: 500 }}>
            If you receive suspicious communication claiming association with Zawr Industries LLP, <strong style={{ color: '#ffffff' }}>do not respond, do not transfer funds</strong>, and verify authenticity through official channels.
          </p>
        </div>
      </section>

      {/* Fraud Warning Notice */}
      <section style={{ padding: '5rem 6%', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 600, margin: '0 0 2rem 0', letterSpacing: '-0.02em', color: '#000000' }}>Fraud Warning Notice</h2>
          <p style={{ fontSize: '1rem', color: '#374151', lineHeight: 1.8, marginBottom: '1.5rem' }}>
            Zawr Industries LLP and its affiliated operations do not authorize fraudulent activity of any kind. You should exercise caution if any individual or organization:
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
            {[
              'requests money in exchange for employment',
              'requests recruitment or onboarding fees',
              'requests training deposits',
              'promises guaranteed employment',
              'requests confidential business information',
              'sends invoices through unofficial channels',
              'requests payment into personal accounts',
              'offers investment opportunities without verification',
              'impersonates employees or executives',
              'creates fake websites or social media profiles',
              'requests passwords, OTPs, access credentials, or banking details',
              'claims urgent action without official verification'
            ].map((item, i) => (
              <li key={i} style={{ ...cardStyle, display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem 1.25rem' }}>
                <span style={{ color: '#ef4444', fontWeight: 700, marginTop: '0.1rem', flexShrink: 0 }}>✕</span>
                <span style={{ fontSize: '0.9rem', color: '#d1d5db', lineHeight: 1.6 }}>{item}</span>
              </li>
            ))}
          </ul>
          <p style={{ fontSize: '0.9rem', color: '#6b7280', lineHeight: 1.8, marginTop: '2rem' }}>
            Unauthorized use of the Company's name, trademarks, branding, communications, domains, or identity may constitute fraud, impersonation, misrepresentation, or other unlawful conduct.
          </p>
        </div>
      </section>

      {/* Common Fraud Scenarios */}
      <section style={{ padding: '5rem 6%', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 600, margin: '0 0 3rem 0', letterSpacing: '-0.02em', color: '#000000' }}>Common Fraud Scenarios</h2>

          {/* Recruitment Fraud */}
          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 1rem 0', color: '#111827' }}>Recruitment and Job Offer Fraud</h3>
            <p style={{ fontSize: '1rem', color: '#374151', lineHeight: 1.8, marginBottom: '1rem' }}>
              Fraudsters may falsely claim to recruit on behalf of Zawr Industries LLP and may attempt to collect:
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0' }}>
              {['application fees', 'interview charges', 'placement fees', 'processing fees', 'onboarding payments', 'security deposits', 'training charges', 'visa processing payments'].map((item, i) => (
                <li key={i} style={{ fontSize: '0.9rem', color: '#374151', padding: '0.4rem 0', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ color: '#d1d5db' }}>—</span> {item}
                </li>
              ))}
            </ul>

            {/* Green notice */}
            <div style={{ ...cardStyle, padding: '2rem', marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#4ade80', margin: '0 0 1.25rem 0' }}>Important Notice</h4>
              {[
                'Never asks candidates to transfer money to obtain employment.',
                'Never charges recruitment or application fees.',
                'Never requests onboarding deposits.',
                'Never asks candidates to make payments to personal bank accounts.',
                'Never guarantees employment in exchange for payment.'
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <span style={{ color: '#4ade80', fontWeight: 700, flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: '0.9rem', color: '#d1d5db' }}>Zawr Industries LLP {item}</span>
                </div>
              ))}
            </div>

            <div style={{ ...cardStyle, padding: '1.5rem 2rem' }}>
              <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#9ca3af', margin: '0 0 0.75rem 0' }}>Official Recruitment Statement</h4>
              <p style={{ fontSize: '0.9rem', color: '#d1d5db', lineHeight: 1.8, margin: 0 }}>
                Zawr Industries LLP does not authorize any third-party individual, agency, recruiter, consultant, intermediary, contractor, or external representative to collect money, security deposits, onboarding fees, training fees, recruitment fees, placement charges, or any financial consideration on behalf of the Company. Any such request should be treated as suspicious until independently verified.
              </p>
            </div>
          </div>

          {/* Fake Invoice */}
          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 1rem 0', color: '#111827' }}>Fake Invoice and Payment Fraud</h3>
            <p style={{ fontSize: '1rem', color: '#374151', lineHeight: 1.8, marginBottom: '1rem' }}>
              Fraudsters may impersonate Company representatives and attempt to redirect invoices or request payment modifications. Before making any payment:
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1rem 0' }}>
              {['verify email domains', 'validate account details', 'confirm invoice authenticity', 'contact official Company channels', 'avoid acting solely on email instructions'].map((item, i) => (
                <li key={i} style={{ fontSize: '0.9rem', color: '#374151', padding: '0.4rem 0', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ color: '#d1d5db' }}>—</span> {item}
                </li>
              ))}
            </ul>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.8 }}>The Company does not request business payments through unofficial communication channels.</p>
          </div>

          {/* Fake Partnership */}
          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 1rem 0', color: '#111827' }}>Fake Partnership and Investment Offers</h3>
            <p style={{ fontSize: '1rem', color: '#374151', lineHeight: 1.8, marginBottom: '1rem' }}>
              Unauthorized individuals may claim to represent Zawr Industries LLP in:
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1rem 0' }}>
              {['investments', 'fundraising', 'strategic partnerships', 'procurement opportunities', 'franchise proposals', 'sponsorship programs'].map((item, i) => (
                <li key={i} style={{ fontSize: '0.9rem', color: '#374151', padding: '0.4rem 0', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ color: '#d1d5db' }}>—</span> {item}
                </li>
              ))}
            </ul>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.8 }}>You should independently verify all commercial proposals directly with official Company contacts.</p>
          </div>

          {/* Fake Websites */}
          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 1rem 0', color: '#111827' }}>Fake Websites and Domain Impersonation</h3>
            <p style={{ fontSize: '1rem', color: '#374151', lineHeight: 1.8, marginBottom: '1rem' }}>
              Official domains currently recognized by Zawr Industries LLP:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {['zawrindustries.com', 'zawr.org', 'firm.expert', 'authai.pro', 'sketchstudio.dev'].map((domain, i) => (
                <span key={i} style={{ backgroundColor: '#000000', border: 'none', borderRadius: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.875rem', color: '#ffffff', fontFamily: 'monospace' }}>
                  {domain}
                </span>
              ))}
            </div>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.8 }}>
              Any variation, misspelling, imitation, or impersonating domain should be treated cautiously. Always check the domain carefully before sharing information.
            </p>
          </div>

          {/* Fake Social Media */}
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 1rem 0', color: '#111827' }}>Fake Social Media and Identity Impersonation</h3>
            <p style={{ fontSize: '1rem', color: '#374151', lineHeight: 1.8, marginBottom: '1rem' }}>Official social channels:</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1rem 0' }}>
              {[
                { label: 'LinkedIn', handle: 'Zawr Industries', href: 'https://www.linkedin.com/company/zawr-industries/' },
                { label: 'Facebook', handle: 'Zawr Industries', href: 'https://www.facebook.com/zawrindustries' },
                { label: 'Instagram', handle: '@zawr_industries', href: 'https://www.instagram.com/zawr_industries/' },
                { label: 'X', handle: '@zawr_industries', href: 'https://x.com/zawr_industries' },
                { label: 'YouTube', handle: 'Zawr Industries', href: 'https://www.youtube.com/channel/UCl7BkBpOt235QSpskZxQDkw' },
              ].map((s, i) => (
                <li key={i} style={{ fontSize: '0.9rem', padding: '0.6rem 0', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ color: '#9ca3af', minWidth: '80px' }}>{s.label}</span>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'none' }}>{s.handle}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How to Verify */}
      <section style={{ padding: '5rem 6%', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 600, margin: '0 0 3rem 0', letterSpacing: '-0.02em', color: '#000000' }}>How to Verify a Communication</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {[
              { step: '01', title: 'Check the Email Domain', desc: 'Verify the email originates from an official Company domain.' },
              { step: '02', title: 'Verify the Sender Identity', desc: 'Confirm whether the sender appears on official platforms.' },
              { step: '03', title: 'Confirm Payment Instructions', desc: 'Independently verify any payment instructions before acting.' },
              { step: '04', title: 'Do Not Share Credentials', desc: 'Never share passwords, OTPs, financial credentials, or confidential documents.' },
              { step: '05', title: 'Contact Official Channels', desc: 'When in doubt, contact official Company channels directly.' },
            ].map((item, i) => (
              <div key={i} style={cardStyle}>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#6b7280', display: 'block', marginBottom: '0.75rem' }}>Step {item.step}</span>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#ffffff', margin: '0 0 0.5rem 0' }}>{item.title}</h4>
                <p style={{ fontSize: '0.875rem', color: '#9ca3af', lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Report Section */}
      <section style={{ padding: '5rem 6%', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 600, margin: '0 0 1rem 0', letterSpacing: '-0.02em', color: '#000000' }}>Report Suspicious Activity</h2>
          <p style={{ fontSize: '1rem', color: '#374151', lineHeight: 1.8, marginBottom: '3rem' }}>
            If you believe you have received fraudulent communication, please report it immediately.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
            {[
              { icon: '📧', label: 'Legal Department', value: 'legal@zawrindustries.com', href: 'mailto:legal@zawrindustries.com' },
              { icon: '📧', label: 'Grievance Desk', value: 'grievance@zawrindustries.com', href: 'mailto:grievance@zawrindustries.com' },
              { icon: '📞', label: 'Contact Number', value: '+91 9880464078', href: 'tel:+919880464078' },
            ].map((contact, i) => (
              <div key={i} style={{ ...cardStyle, textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{contact.icon}</div>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#6b7280', marginBottom: '0.5rem' }}>{contact.label}</div>
                <a href={contact.href} style={{ fontSize: '0.85rem', color: '#60a5fa', textDecoration: 'none', wordBreak: 'break-all' }}>{contact.value}</a>
              </div>
            ))}
          </div>
          <div style={{ ...cardStyle, padding: '2rem' }}>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#6b7280', margin: '0 0 1rem 0' }}>When reporting an incident, include:</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
              {['date and time', 'sender details', 'screenshots', 'website links', 'email headers', 'payment requests', 'transaction references (if applicable)', 'description of communication'].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#d1d5db' }}>
                  <span style={{ color: '#4b5563' }}>—</span> {item}
                </div>
              ))}
            </div>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '1.25rem', marginBottom: 0, fontStyle: 'italic' }}>
              Do not delete evidence until reporting is completed.
            </p>
          </div>
        </div>
      </section>

      {/* Legal Notice */}
      <section style={{ padding: '5rem 6%', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 600, margin: '0 0 1.5rem 0', letterSpacing: '-0.02em', color: '#000000' }}>Legal Notice</h2>
          <p style={{ fontSize: '0.95rem', color: '#374151', lineHeight: 1.9 }}>
            Zawr Industries LLP reserves all rights in relation to unauthorized use of its name, trademarks, identity, domains, branding, communications, intellectual property, employee identity, business representation, and associated assets. The Company may pursue legal, regulatory, civil, criminal, contractual, technological, and administrative remedies where necessary to protect its stakeholders and organizational interests.
          </p>
        </div>
      </section>

      {/* Final Reminder */}
      <section style={{ padding: '5rem 6%' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ ...cardStyle, borderRadius: '1.5rem', padding: '3.5rem 2.5rem' }}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '1.25rem' }}>🛡</span>
            <h3 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 600, margin: '0 0 1rem 0', letterSpacing: '-0.02em', color: '#ffffff' }}>Final Reminder</h3>
            <p style={{ fontSize: '1rem', color: '#9ca3af', lineHeight: 1.8, margin: '0 0 1rem 0', maxWidth: '540px', marginLeft: 'auto', marginRight: 'auto' }}>
              If something feels unusual, urgent, secretive, or requests payment — <strong style={{ color: '#ffffff' }}>pause and verify through official channels first.</strong>
            </p>
            <p style={{ fontSize: '0.9rem', color: '#6b7280', lineHeight: 1.8, margin: 0 }}>
              Your awareness helps protect our community, our partners, and our ecosystem.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}

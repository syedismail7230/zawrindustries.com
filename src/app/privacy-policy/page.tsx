"use client";

import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000000', color: '#ffffff', paddingTop: '8rem', paddingBottom: '6rem', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem' }}>

        {/* Breadcrumb */}
        <div style={{ marginBottom: '2.5rem' }}>
          <Link
            href="/"
            style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'color 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.color = '#ffffff'}
            onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"></path><path d="m12 19-7-7 7-7"></path></svg>
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <header style={{ borderBottom: '1px solid #222225', paddingBottom: '2.5rem', marginBottom: '3rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#ffffff', display: 'block', marginBottom: '0.75rem' }}>
            Legal &amp; Compliance
          </span>
          <h1 style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', fontWeight: 700, letterSpacing: '-0.02em', color: '#ffffff', marginBottom: '1.25rem', lineHeight: 1.15 }}>
            Privacy Policy
          </h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', fontSize: '0.875rem', color: '#9ca3af' }}>
            <span>Zawr Industries LLP</span>
          </div>
        </header>

        {/* Content */}
        <article style={{ lineHeight: 1.85, fontSize: '1.0625rem', color: '#d1d5db' }}>

          <p style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '2rem', fontWeight: 400, lineHeight: 1.7 }}>
            Welcome to the digital ecosystem of Zawr Industries LLP.
          </p>

          <p style={{ marginBottom: '1.75rem' }}>
            Zawr Industries LLP ("Zawr", "Company", "we", "our", or "us") recognizes that privacy, responsible data practices, and information governance are essential components of trust, long-term business relationships, digital participation, and sustainable organizational growth.
          </p>

          <p style={{ marginBottom: '1.75rem' }}>
            This Privacy Policy explains how information may be collected, used, processed, stored, protected, transferred, disclosed, retained, and otherwise managed across the Zawr Industries ecosystem.
          </p>

          <p style={{ marginBottom: '1.75rem' }}>
            This Privacy Policy applies broadly across the Zawr Industries ecosystem including official websites, digital platforms, products, software environments, account systems, authentication services, career portals, business communications, forms, customer interactions, support channels, recruitment activities, analytics environments, and related services operated or administered by Zawr Industries LLP.
          </p>

          {/* Official Domains */}
          <div style={{ backgroundColor: '#131315', border: '1px solid #222225', borderRadius: '1.25rem', padding: '2.25rem', marginBottom: '2.5rem' }}>
            <h3 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 600, marginTop: 0, marginBottom: '1rem' }}>
              Official websites currently include:
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {['zawrindustries.com', 'zawr.org'].map((d, i) => (
                <li key={i} style={{ fontSize: '0.9rem', color: '#a1a1aa', padding: '0.35rem 0', borderBottom: i < 1 ? '1px solid #222225' : 'none', fontFamily: 'monospace' }}>
                  {d}
                </li>
              ))}
            </ul>
          </div>

          <p style={{ marginBottom: '3rem' }}>
            By accessing, browsing, creating accounts, communicating with us, submitting information, applying for opportunities, using our services, or otherwise interacting with our ecosystem, users acknowledge this Privacy Policy.
          </p>

          {/* Section 1 */}
          <h2 style={{ color: '#ffffff', fontSize: '1.75rem', fontWeight: 600, marginTop: '3.5rem', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>
            1. Our Approach to Privacy
          </h2>
          <p style={{ marginBottom: '1.75rem' }}>
            At Zawr Industries LLP, privacy is treated as an ongoing organizational responsibility rather than a one-time compliance activity.
          </p>
          <p style={{ marginBottom: '1.75rem' }}>
            We understand that users interact with our platforms with the expectation that information provided will be handled responsibly, used appropriately, protected through reasonable safeguards, and processed only for legitimate purposes connected to business operations and service delivery.
          </p>
          <p style={{ marginBottom: '3rem' }}>
            We aim to process information in a manner that supports transparency, proportionality, accountability, and trust while recognizing that digital ecosystems operate across multiple jurisdictions, technologies, and service environments.
          </p>

          {/* Section 2 */}
          <h2 style={{ color: '#ffffff', fontSize: '1.75rem', fontWeight: 600, marginTop: '3.5rem', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>
            2. Information We May Collect
          </h2>
          <p style={{ marginBottom: '1.75rem' }}>
            The information collected through our ecosystem may vary depending upon the nature of interaction, services accessed, account activity, communications, recruitment participation, and business relationships.
          </p>
          <p style={{ marginBottom: '1.75rem' }}>
            Information may be provided directly by users, generated automatically through system interaction, received through integrated services, obtained through operational processes, or collected from authorized external sources.
          </p>
          <p style={{ marginBottom: '1.75rem' }}>
            Information collected may include identity information such as names, email addresses, telephone numbers, professional details, organizational affiliation, profile information, account preferences, and communication details.
          </p>
          <p style={{ marginBottom: '1.75rem' }}>
            Where users engage with recruitment activities, information may include resumes, qualifications, employment history, portfolio materials, assessment information, application records, and professional documents.
          </p>
          <p style={{ marginBottom: '1rem' }}>Users may also provide information through:</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0' }}>
            {['inquiry forms', 'support requests', 'uploaded documents', 'customer communications', 'feedback submissions', 'account updates', 'business discussions'].map((item, i) => (
              <li key={i} style={{ fontSize: '0.95rem', color: '#a1a1aa', padding: '0.35rem 0', borderBottom: '1px solid #1a1a1d', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: '#374151' }}>—</span> {item}
              </li>
            ))}
          </ul>
          <p style={{ marginBottom: '3rem' }}>
            The Company does not intend to collect information unnecessarily and seeks to limit collection to purposes reasonably connected with legitimate business requirements.
          </p>

          {/* Section 3 */}
          <h2 style={{ color: '#ffffff', fontSize: '1.75rem', fontWeight: 600, marginTop: '3.5rem', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>
            3. How Information May Be Used
          </h2>
          <p style={{ marginBottom: '1.75rem' }}>
            Information collected through our ecosystem may be used to support operation and administration of our business and digital services.
          </p>
          <p style={{ marginBottom: '1.75rem' }}>
            Depending upon circumstances, information may be processed to provide services, establish and maintain accounts, respond to communications, process requests, deliver support, improve functionality, administer recruitment processes, maintain security, perform analytics, communicate updates, and support operational management.
          </p>
          <p style={{ marginBottom: '3rem' }}>
            Information is not intended to be processed for purposes incompatible with the context in which it was collected unless otherwise permitted or communicated.
          </p>

          {/* Section 4 */}
          <h2 style={{ color: '#ffffff', fontSize: '1.75rem', fontWeight: 600, marginTop: '3.5rem', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>
            4. Cookies, Analytics and Digital Technologies
          </h2>
          <p style={{ marginBottom: '1.75rem' }}>
            To improve service quality and support digital operations, Zawr Industries LLP may use cookies and related technologies. These technologies help maintain website functionality, improve performance, preserve sessions, enhance security, understand engagement, support analytics, personalize interactions, and improve operational efficiency.
          </p>
          <p style={{ marginBottom: '1.75rem' }}>
            Our ecosystem may utilize analytics and measurement technologies intended to provide insights regarding website traffic, usage patterns, feature interaction, technical performance, conversion behavior, engagement indicators, and service optimization.
          </p>
          <p style={{ marginBottom: '3rem' }}>
            Users may manage certain browser-level controls; however, restricting technologies may affect availability of features and functionality.
          </p>

          {/* Section 5 */}
          <h2 style={{ color: '#ffffff', fontSize: '1.75rem', fontWeight: 600, marginTop: '3.5rem', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>
            5. Accounts, Authentication and User Responsibility
          </h2>
          <p style={{ marginBottom: '1.75rem' }}>
            Certain services within the Zawr ecosystem may require account registration, authentication, profile creation, credential management, or identity verification.
          </p>
          <p style={{ marginBottom: '1.75rem' }}>
            Users are responsible for maintaining accurate information and protecting access credentials. Users should exercise appropriate care to prevent unauthorized access and notify the Company where account misuse is suspected.
          </p>
          <p style={{ marginBottom: '3rem' }}>
            Account access may be modified, restricted, suspended, reviewed, or terminated where necessary to maintain platform security, investigate misuse, enforce policies, support legal obligations, or preserve business continuity.
          </p>

          {/* Section 6 */}
          <h2 style={{ color: '#ffffff', fontSize: '1.75rem', fontWeight: 600, marginTop: '3.5rem', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>
            6. Sharing and Disclosure of Information
          </h2>
          <div style={{ backgroundColor: '#131315', border: '1px solid #222225', borderRadius: '1.25rem', padding: '2.25rem', marginBottom: '2rem' }}>
            <p style={{ margin: 0, fontSize: '0.975rem', lineHeight: 1.7, color: '#a1a1aa' }}>
              Zawr Industries LLP does not sell personal information as a business model.
            </p>
          </div>
          <p style={{ marginBottom: '1.75rem' }}>
            However, information may be shared where reasonably necessary to support operation of the ecosystem, including with service providers, infrastructure providers, hosting environments, analytics providers, recruitment systems, communications platforms, payment support services, professional advisors, and authorities where required.
          </p>
          <p style={{ marginBottom: '1rem' }}>The Company may also disclose information where reasonably necessary to:</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 3rem 0' }}>
            {['protect users', 'enforce agreements', 'respond to legal processes', 'investigate misconduct', 'maintain security', 'protect rights and operations'].map((item, i) => (
              <li key={i} style={{ fontSize: '0.95rem', color: '#a1a1aa', padding: '0.35rem 0', borderBottom: '1px solid #1a1a1d', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: '#374151' }}>—</span> {item}
              </li>
            ))}
          </ul>

          {/* Section 7 */}
          <h2 style={{ color: '#ffffff', fontSize: '1.75rem', fontWeight: 600, marginTop: '3.5rem', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>
            7. International Processing and Cross-Border Transfers
          </h2>
          <p style={{ marginBottom: '1.75rem' }}>
            Because Zawr Industries LLP operates in environments that may involve international collaboration and global service delivery, information may be processed, transferred, accessed, or stored across jurisdictions.
          </p>
          <p style={{ marginBottom: '3rem' }}>
            Where international processing occurs, the Company seeks to apply reasonable safeguards appropriate to operational realities and legal requirements. Users acknowledge that privacy standards may vary across jurisdictions.
          </p>

          {/* Section 8 */}
          <h2 style={{ color: '#ffffff', fontSize: '1.75rem', fontWeight: 600, marginTop: '3.5rem', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>
            8. Data Retention
          </h2>
          <p style={{ marginBottom: '1.75rem' }}>
            Information is retained only for periods reasonably necessary to support legitimate business purposes. Retention decisions may consider operational requirements, legal obligations, security considerations, business continuity, dispute resolution needs, user expectations, record management standards, and organizational interests.
          </p>
          <p style={{ marginBottom: '3rem' }}>
            Once information is no longer reasonably necessary, the Company may archive, anonymize, restrict, delete, or securely dispose of information in accordance with applicable practices. Retention under this Policy follows the principle of business necessity.
          </p>

          {/* Section 9 */}
          <h2 style={{ color: '#ffffff', fontSize: '1.75rem', fontWeight: 600, marginTop: '3.5rem', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>
            9. Security and Protection of Information
          </h2>
          <p style={{ marginBottom: '1.75rem' }}>
            Zawr Industries LLP recognizes that protection of information is essential to maintaining trust. Accordingly, the Company seeks to maintain reasonable technical, administrative, and organizational safeguards intended to reduce risks associated with unauthorized access, disclosure, misuse, destruction, alteration, or loss.
          </p>
          <p style={{ marginBottom: '3rem' }}>
            Despite these efforts, users acknowledge that no digital environment can guarantee absolute security. Users also share responsibility for maintaining secure practices.
          </p>

          {/* Section 10 */}
          <h2 style={{ color: '#ffffff', fontSize: '1.75rem', fontWeight: 600, marginTop: '3.5rem', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>
            10. User Rights and Privacy Choices
          </h2>
          <p style={{ marginBottom: '1.75rem' }}>
            Depending upon applicable requirements and circumstances, users may request access to information, correction of records, deletion requests, restriction of processing, withdrawal of consent where applicable, export of available information, or objection to certain processing activities.
          </p>
          <p style={{ marginBottom: '3rem' }}>
            Requests may require verification and may be reviewed in accordance with legal obligations, security requirements, operational limitations, and business necessity. The Company seeks to respond reasonably while preserving organizational responsibilities.
          </p>

          {/* Section 11 */}
          <h2 style={{ color: '#ffffff', fontSize: '1.75rem', fontWeight: 600, marginTop: '3.5rem', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>
            11. Third-Party Services and External Platforms
          </h2>
          <p style={{ marginBottom: '1.75rem' }}>
            Our ecosystem may contain integrations, references, embedded technologies, or links to third-party platforms. This Privacy Policy applies only to information practices controlled by Zawr Industries LLP.
          </p>
          <p style={{ marginBottom: '3rem' }}>
            Third-party environments operate independently and users should review their separate privacy practices. The Company is not responsible for external privacy practices outside its operational control.
          </p>

          {/* Section 12 */}
          <h2 style={{ color: '#ffffff', fontSize: '1.75rem', fontWeight: 600, marginTop: '3.5rem', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>
            12. Changes to this Privacy Policy
          </h2>
          <p style={{ marginBottom: '3rem' }}>
            Zawr Industries LLP reserves the right to revise, expand, amend, replace, update, suspend, or modify this Privacy Policy at any time. Changes may occur due to business developments, technology evolution, legal requirements, operational improvements, service expansion, or governance enhancements. Updated versions become effective upon publication unless otherwise specified. Continued use of services following updates constitutes acknowledgement of revised practices.
          </p>

          {/* Contact */}
          <h2 style={{ color: '#ffffff', fontSize: '1.75rem', fontWeight: 600, marginTop: '3.5rem', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>
            Contact Us
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            For privacy requests, data concerns, privacy questions, or information governance matters:
          </p>

          <div style={{ backgroundColor: '#131315', border: '1px solid #222225', borderRadius: '1.25rem', padding: '2.25rem' }}>
            <p style={{ margin: '0 0 0.4rem 0', color: '#ffffff', fontWeight: 600 }}>Zawr Industries LLP</p>
            <p style={{ margin: '0 0 0.4rem 0', color: '#a1a1aa', fontSize: '0.95rem' }}>Oxford Towers, HAL Old Airport Road</p>
            <p style={{ margin: '0 0 0.4rem 0', color: '#a1a1aa', fontSize: '0.95rem' }}>Kodihalli, Bengaluru – 560008</p>
            <p style={{ margin: '0 0 1.5rem 0', color: '#a1a1aa', fontSize: '0.95rem' }}>India</p>

            {/* Phone */}
            <a href="tel:+919880464078" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.12 6.12l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              +91 9880464078
            </a>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.25rem' }}>
              {/* General Email */}
              <a href="mailto:legal@zawrindustries.com" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                Legal — legal@zawrindustries.com
              </a>
              {/* Grievance */}
              <a href="mailto:grievance@zawrindustries.com" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                Grievance — grievance@zawrindustries.com
              </a>
            </div>
          </div>

        </article>
      </div>
    </div>
  );
}

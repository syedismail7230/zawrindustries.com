"use client";

import React from 'react';
import Link from 'next/link';

export default function LegalDisclaimerPage() {
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
            Legal Disclaimer
          </h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', fontSize: '0.875rem', color: '#9ca3af' }}>
            <span>Zawr Industries LLP</span>
          </div>
        </header>

        {/* Content */}
        <article style={{ lineHeight: 1.85, fontSize: '1.0625rem', color: '#d1d5db' }}>

          <p style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '2rem', fontWeight: 400, lineHeight: 1.7 }}>
            Welcome to the official digital properties of Zawr Industries LLP.
          </p>

          <p style={{ marginBottom: '2rem' }}>
            This Legal Disclaimer is intended to explain the nature, purpose, limitations, and conditions associated with information, materials, content, communications, technology descriptions, services information, career information, business representations, and other materials made available through official websites and digital platforms operated by Zawr Industries LLP.
          </p>

          {/* Official Domains */}
          <div style={{ backgroundColor: '#131315', border: '1px solid #222225', borderRadius: '1.25rem', padding: '2.25rem', marginBottom: '2.5rem' }}>
            <h3 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 600, marginTop: 0, marginBottom: '1rem' }}>
              Official digital properties currently include:
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {['zawrindustries.com', 'zawr.org'].map((d, i) => (
                <li key={i} style={{ fontSize: '0.9rem', color: '#a1a1aa', padding: '0.35rem 0', borderBottom: i < 1 ? '1px solid #222225' : 'none', fontFamily: 'monospace' }}>
                  {d}
                </li>
              ))}
            </ul>
          </div>

          <p style={{ marginBottom: '2rem' }}>
            By accessing, browsing, interacting with, submitting information through, relying upon, or otherwise using these websites, users acknowledge that they understand this Disclaimer and agree that use of the website shall remain subject to the limitations and conditions described below.
          </p>

          <p style={{ marginBottom: '3rem' }}>
            This Disclaimer has been created to ensure clarity regarding the intended use of website content, reduce misunderstanding regarding legal obligations, establish boundaries of responsibility, and protect both visitors and the Company in connection with digital interactions.
          </p>

          {/* Section 1 */}
          <h2 style={{ color: '#ffffff', fontSize: '1.75rem', fontWeight: 600, marginTop: '3.5rem', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>
            Nature and Purpose of Website Content
          </h2>
          <p style={{ marginBottom: '1.75rem' }}>
            The information published on official Zawr Industries LLP websites is intended to provide general information regarding the Company, its activities, business operations, services, technologies, initiatives, products, opportunities, organizational developments, capabilities, brand communications, and other related matters.
          </p>
          <p style={{ marginBottom: '1.75rem' }}>
            Website content is designed to support awareness, communication, business visibility, education, recruitment information, and stakeholder engagement.
          </p>
          <p style={{ marginBottom: '1.75rem' }}>
            Although the Company seeks to present information responsibly and in good faith, website content is prepared for general informational purposes and should not be interpreted as individualized guidance or relied upon as the sole basis for making important decisions.
          </p>
          <p style={{ marginBottom: '3rem' }}>
            Accordingly, users should understand that website content is not intended to replace independent evaluation, professional consultation, formal due diligence, or legally binding documentation.
          </p>

          {/* Section 2 */}
          <h2 style={{ color: '#ffffff', fontSize: '1.75rem', fontWeight: 600, marginTop: '3.5rem', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>
            No Professional Advice and No Reliance Relationship
          </h2>
          <p style={{ marginBottom: '1.75rem' }}>
            Nothing appearing on the websites of Zawr Industries LLP shall be interpreted as creating a professional advisory relationship between the Company and any visitor.
          </p>
          <p style={{ marginBottom: '1.75rem' }}>
            Unless expressly agreed in writing through authorized contractual arrangements, information made available by the Company does not constitute legal advice, financial advice, tax advice, investment advice, technical certification, engineering advice, procurement guidance, business consulting, regulatory interpretation, or any other professional advisory service.
          </p>
          <p style={{ marginBottom: '1.75rem' }}>
            Users remain solely responsible for assessing whether information is appropriate for their own circumstances.
          </p>
          <p style={{ marginBottom: '3rem' }}>
            Use of website content shall not create reliance obligations upon the Company.
          </p>

          {/* Section 3 */}
          <h2 style={{ color: '#ffffff', fontSize: '1.75rem', fontWeight: 600, marginTop: '3.5rem', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>
            No Offer, No Commitment and No Contractual Relationship
          </h2>
          <p style={{ marginBottom: '1.75rem' }}>
            Publication of information through official Company websites shall not constitute an offer, proposal, acceptance, guarantee, commitment, solicitation, or legally enforceable promise.
          </p>
          <p style={{ marginBottom: '1.75rem' }}>
            Submission of forms, inquiries, resumes, applications, expressions of interest, requests for information, participation in discussions, attendance at events, or engagement with Company communications shall not independently establish contractual obligations or create entitlement to services, employment, partnerships, investment access, procurement participation, or commercial engagement.
          </p>

          <div style={{ backgroundColor: '#131315', border: '1px solid #222225', borderRadius: '1.25rem', padding: '2.25rem', marginBottom: '2.5rem' }}>
            <h3 style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: 600, marginTop: 0, marginBottom: '0.75rem' }}>Formal Agreement Required</h3>
            <p style={{ margin: 0, fontSize: '0.975rem', lineHeight: 1.7, color: '#a1a1aa' }}>
              A legally enforceable relationship with Zawr Industries LLP shall arise only through formal written agreements executed by appropriately authorized representatives of the Company. Where executed agreements exist, such agreements shall prevail over website materials.
            </p>
          </div>

          {/* Section 4 */}
          <h2 style={{ color: '#ffffff', fontSize: '1.75rem', fontWeight: 600, marginTop: '3.5rem', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>
            Accuracy, Availability and Limitation of Information
          </h2>
          <p style={{ marginBottom: '1.75rem' }}>
            Zawr Industries LLP makes reasonable efforts to maintain website content in a manner intended to be useful, relevant, and responsibly presented. However, the Company does not guarantee that information available through its websites will always remain complete, current, uninterrupted, error-free, technically available, accurate, suitable for every purpose, or free from omissions.
          </p>
          <p style={{ marginBottom: '1rem' }}>Website content may change over time due to:</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0' }}>
            {['business developments', 'operational changes', 'product evolution', 'strategic decisions', 'legal requirements', 'technology improvements', 'organizational priorities'].map((item, i) => (
              <li key={i} style={{ fontSize: '0.95rem', color: '#a1a1aa', padding: '0.35rem 0', borderBottom: '1px solid #1a1a1d', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: '#374151' }}>—</span> {item}
              </li>
            ))}
          </ul>
          <p style={{ marginBottom: '3rem' }}>
            Users are encouraged to independently validate information that may materially affect decisions.
          </p>

          {/* Section 5 */}
          <h2 style={{ color: '#ffffff', fontSize: '1.75rem', fontWeight: 600, marginTop: '3.5rem', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>
            Forward-Looking Statements and Business Representations
          </h2>
          <p style={{ marginBottom: '1.75rem' }}>
            From time to time, Company websites may contain statements regarding future initiatives, strategic goals, product direction, innovation efforts, growth opportunities, market expansion, business plans, research activity, anticipated capabilities, or organizational ambitions.
          </p>
          <p style={{ marginBottom: '1.75rem' }}>
            Such statements reflect intentions, expectations, assumptions, estimates, beliefs, or preliminary planning and should not be interpreted as guarantees of future performance.
          </p>
          <p style={{ marginBottom: '3rem' }}>
            Accordingly, actual outcomes may differ significantly from information appearing on the website. Nothing contained on Company websites shall create expectations of guaranteed results.
          </p>

          {/* Section 6 */}
          <h2 style={{ color: '#ffffff', fontSize: '1.75rem', fontWeight: 600, marginTop: '3.5rem', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>
            Technology, Product and Innovation Disclaimer
          </h2>
          <p style={{ marginBottom: '1.75rem' }}>
            Descriptions of technologies, digital platforms, software capabilities, artificial intelligence systems, prototypes, concepts, architecture, demonstrations, product visuals, future features, technical illustrations, innovation programs, and research initiatives are presented for informational and communication purposes.
          </p>
          <p style={{ marginBottom: '1rem' }}>The Company reserves full discretion to:</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0' }}>
            {['modify capabilities', 'redesign products', 'delay releases', 'discontinue initiatives', 'alter specifications', 'replace technologies'].map((item, i) => (
              <li key={i} style={{ fontSize: '0.95rem', color: '#a1a1aa', padding: '0.35rem 0', borderBottom: '1px solid #1a1a1d', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: '#374151' }}>—</span> {item}
              </li>
            ))}
          </ul>

          {/* Section 7 */}
          <h2 style={{ color: '#ffffff', fontSize: '1.75rem', fontWeight: 600, marginTop: '3.5rem', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>
            Recruitment and Career Information Disclaimer
          </h2>
          <p style={{ marginBottom: '1.75rem' }}>
            Information relating to employment opportunities, hiring activities, careers, workplace culture, development opportunities, or recruitment initiatives is intended to provide general awareness.
          </p>
          <p style={{ marginBottom: '1.75rem' }}>
            Participation in recruitment processes, interviews, assessments, discussions, communication exchanges, talent programs, or application submissions does not guarantee employment or create contractual rights.
          </p>
          <p style={{ marginBottom: '1.75rem' }}>
            Employment relationships arise only after completion of internal approval processes and issuance of formal documentation by authorized Company representatives.
          </p>
          <div style={{ backgroundColor: '#131315', border: '1px solid #222225', borderRadius: '1.25rem', padding: '2.25rem', marginBottom: '3rem' }}>
            <p style={{ margin: 0, fontSize: '0.975rem', lineHeight: 1.7, color: '#a1a1aa' }}>
              Zawr Industries LLP does not request recruitment fees, application charges, onboarding deposits, placement payments, training charges, or payments into personal accounts as a condition of employment. Users should independently verify suspicious communications.
            </p>
          </div>

          {/* Section 8 */}
          <h2 style={{ color: '#ffffff', fontSize: '1.75rem', fontWeight: 600, marginTop: '3.5rem', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>
            Intellectual Property and Content Ownership
          </h2>
          <p style={{ marginBottom: '1.75rem' }}>
            Unless expressly stated otherwise, all original content appearing on official Company websites remains protected and owned, controlled, licensed, administered, or otherwise legally protected in favor of Zawr Industries LLP.
          </p>
          <p style={{ marginBottom: '1.75rem' }}>
            Protected materials include original website content, branding assets, logos, trademarks, product names, source code, interfaces, layouts, original videos, original images created by the Company, databases, AI systems, documentation, methodologies, and related proprietary materials.
          </p>
          <p style={{ marginBottom: '3rem' }}>
            Unauthorized use, extraction, copying, replication, republication, training of external AI systems, or commercial exploitation may result in enforcement action.
          </p>

          {/* Section 9 */}
          <h2 style={{ color: '#ffffff', fontSize: '1.75rem', fontWeight: 600, marginTop: '3.5rem', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>
            Third-Party Information and External References
          </h2>
          <p style={{ marginBottom: '1.75rem' }}>
            Company websites may contain references to external technologies, platforms, organizations, websites, tools, integrations, or third-party resources. Such references are provided for convenience and informational purposes only.
          </p>
          <p style={{ marginBottom: '3rem' }}>
            Unless expressly stated otherwise, references shall not be interpreted as endorsement, approval, sponsorship, affiliation, partnership, ownership, or representation. Users access third-party resources independently.
          </p>

          {/* Section 10 */}
          <h2 style={{ color: '#ffffff', fontSize: '1.75rem', fontWeight: 600, marginTop: '3.5rem', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>
            Limitation of Liability
          </h2>
          <p style={{ marginBottom: '1.75rem' }}>
            To the maximum extent permitted under applicable law, Zawr Industries LLP shall not be responsible for losses, damages, liabilities, interruptions, delays, inaccuracies, technical failures, business impacts, data issues, opportunity costs, or consequences arising directly or indirectly from access to or reliance upon website content.
          </p>
          <p style={{ marginBottom: '3rem' }}>
            Users access websites voluntarily and accept responsibility for evaluating information before acting upon it. Nothing within this Disclaimer excludes liability where exclusion is prohibited by applicable law.
          </p>

          {/* Section 11 */}
          <h2 style={{ color: '#ffffff', fontSize: '1.75rem', fontWeight: 600, marginTop: '3.5rem', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>
            Cybersecurity and Communication Protection
          </h2>
          <p style={{ marginBottom: '1.75rem' }}>
            While Zawr Industries LLP undertakes reasonable measures to protect official digital environments, the Company cannot guarantee that websites, communications, or transmissions will remain continuously secure or free from unauthorized interference.
          </p>
          <p style={{ marginBottom: '3rem' }}>
            The Company shall not be responsible for losses resulting from phishing attempts, fraudulent websites, impersonation, unofficial communications, spoofing activities, unauthorized third-party representations, or misuse of Company identity.
          </p>

          {/* Section 12 */}
          <h2 style={{ color: '#ffffff', fontSize: '1.75rem', fontWeight: 600, marginTop: '3.5rem', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>
            Changes to This Disclaimer
          </h2>
          <p style={{ marginBottom: '3rem' }}>
            Zawr Industries LLP reserves the right to revise, amend, update, replace, expand, suspend, or withdraw this Legal Disclaimer at any time without prior notice. Updated versions become effective upon publication unless otherwise specified. Continued use of Company websites constitutes acceptance of revised terms.
          </p>

          {/* Contact Block */}
          <h2 style={{ color: '#ffffff', fontSize: '1.75rem', fontWeight: 600, marginTop: '3.5rem', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>
            Contact Information
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            For legal clarification, formal notices, compliance matters, or questions relating to this Disclaimer:
          </p>

          <div style={{ backgroundColor: '#131315', border: '1px solid #222225', borderRadius: '1.25rem', padding: '2.25rem' }}>
            <p style={{ margin: '0 0 0.4rem 0', color: '#ffffff', fontWeight: 600 }}>Zawr Industries LLP</p>
            <p style={{ margin: '0 0 0.4rem 0', color: '#a1a1aa', fontSize: '0.95rem' }}>Oxford Towers, HAL Old Airport Road</p>
            <p style={{ margin: '0 0 0.4rem 0', color: '#a1a1aa', fontSize: '0.95rem' }}>Kodihalli, Bengaluru – 560008</p>
            <p style={{ margin: '0 0 1.25rem 0', color: '#a1a1aa', fontSize: '0.95rem' }}>India</p>
            <a href="tel:+919880464078" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.12 6.12l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              +91 9880464078
            </a>
          </div>

        </article>
      </div>
    </div>
  );
}

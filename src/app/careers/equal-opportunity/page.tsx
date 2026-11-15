"use client";

import React from 'react';
import Link from 'next/link';

export default function EqualOpportunityPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000000', color: '#ffffff', paddingTop: '8rem', paddingBottom: '6rem', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem' }}>
        
        {/* Breadcrumb Navigation */}
        <div style={{ marginBottom: '2.5rem' }}>
          <Link 
            href="/careers" 
            style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'color 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.color = '#ffffff'}
            onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"></path><path d="m12 19-7-7 7-7"></path></svg>
            Back to Careers
          </Link>
        </div>

        {/* Header Block */}
        <header style={{ borderBottom: '1px solid #222225', paddingBottom: '2.5rem', marginBottom: '3rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#ffffff', display: 'block', marginBottom: '0.75rem' }}>
            Corporate Governance &amp; Policy
          </span>
          <h1 style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', fontWeight: 700, letterSpacing: '-0.02em', color: '#ffffff', marginBottom: '1.25rem', lineHeight: 1.15 }}>
            Equal Opportunity Policy
          </h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', fontSize: '0.875rem', color: '#9ca3af' }}>
            <span>Zawr Industries LLP</span>
          </div>
        </header>

        {/* Content Body */}
        <article style={{ lineHeight: 1.85, fontSize: '1.0625rem', color: '#d1d5db' }}>
          
          <p style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '2rem', fontWeight: 400, lineHeight: 1.7 }}>
            Zawr Industries LLP is committed to maintaining a professional environment in which every individual is provided an equal opportunity to participate, contribute, develop, and advance based upon merit, capability, performance, integrity, and legitimate business requirements.
          </p>

          <p style={{ marginBottom: '2rem' }}>
            The Organization recognizes that sustainable growth, innovation, institutional excellence, and long-term business success are strengthened when opportunities remain accessible and workplace decisions are governed by fairness, objectivity, and respect rather than by personal characteristics unrelated to professional contribution.
          </p>

          <p style={{ marginBottom: '2rem' }}>
            Accordingly, Zawr Industries LLP adopts this Equal Opportunity Policy as a formal organizational commitment to promote equitable access to employment, development, participation, leadership opportunities, and professional advancement across all global operations.
          </p>

          <p style={{ marginBottom: '2.5rem' }}>
            This Policy reflects the Company’s belief that equal opportunity is not limited to recruitment alone but extends throughout the complete professional lifecycle and includes every stage of engagement with the Organization.
          </p>

          {/* Key Principle Block */}
          <div style={{ backgroundColor: '#131315', border: '1px solid #222225', borderRadius: '1.25rem', padding: '2.25rem', marginBottom: '3rem', marginTop: '2.5rem' }}>
            <h3 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 600, marginTop: 0, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
              Lifecycle Objective
            </h3>
            <p style={{ margin: 0, fontSize: '0.975rem', lineHeight: 1.7, color: '#a1a1aa' }}>
              Under this Policy, employment-related decisions shall seek to be based primarily upon objective and business-relevant considerations including qualifications, demonstrated capability, professional experience, performance outcomes, skills, leadership potential, professional conduct, business contribution, operational requirements, and future growth capability.
            </p>
          </div>

          <p style={{ marginBottom: '2rem' }}>
            Zawr Industries LLP shall seek to ensure that individuals are not denied opportunity, restricted from participation, excluded from development, disadvantaged in decision-making, subjected to unequal treatment, or prevented from accessing professional growth because of factors unrelated to legitimate business requirements.
          </p>

          <p style={{ marginBottom: '2rem' }}>
            The Organization further recognizes that unequal outcomes may arise not only through intentional actions but also through unconscious assumptions, inaccessible systems, procedural barriers, historical limitations, operational practices, communication methods, or organizational structures that unintentionally reduce participation.
          </p>

          <p style={{ marginBottom: '3rem' }}>
            Accordingly, the Company commits to identifying and reducing unnecessary barriers that may affect equal access to opportunity and to strengthening systems that support fair and meaningful participation.
          </p>

          <h2 style={{ color: '#ffffff', fontSize: '1.75rem', fontWeight: 600, marginTop: '3.5rem', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>
            Scope of Application
          </h2>
          <p style={{ marginBottom: '2rem' }}>
            This Equal Opportunity Policy applies globally across all operations of Zawr Industries LLP and extends to all covered individuals including employees, applicants, interns, consultants, contractors, temporary workforce, directors, managers, executives, business representatives, and other individuals engaged in Company operations, except owners acting solely in ownership capacity.
          </p>

          <p style={{ marginBottom: '3rem' }}>
            The principles established under this Policy apply across all employment and workforce activities including recruitment, candidate selection, onboarding, role allocation, performance evaluation, learning and development, compensation administration, recognition, promotion, leadership opportunities, internal mobility, accessibility measures, disciplinary processes, workplace participation, and separation decisions.
          </p>

          <h2 style={{ color: '#ffffff', fontSize: '1.75rem', fontWeight: 600, marginTop: '3.5rem', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>
            Workforce Protections &amp; Inclusion
          </h2>
          <p style={{ marginBottom: '2.5rem' }}>
            Zawr Industries LLP maintains that professional opportunities shall not be adversely influenced by personal characteristics unrelated to performance and business requirements. Accordingly, the Organization prohibits unfair treatment, discrimination, exclusion, and unequal opportunity based upon characteristics including, but not limited to:
          </p>

          {/* Characteristics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '3.5rem' }}>
            {[
              "Age", "Disability", "Accessibility requirements", "Gender",
              "Gender identity", "Sexual orientation", "Marital or family status",
              "Pregnancy", "Nationality", "Language", "Social background",
              "Religion", "Belief systems", "Cultural identity", "Neurodiversity",
              "Veteran status", "Work arrangements", "Personal circumstances"
            ].map((item, idx) => (
              <div key={idx} style={{ border: '1px solid #222225', backgroundColor: '#09090b', padding: '1rem 1.25rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ffffff' }}></span>
                <span style={{ fontSize: '0.9375rem', color: '#ffffff', fontWeight: 500 }}>{item}</span>
              </div>
            ))}
          </div>

          <p style={{ marginBottom: '2rem' }}>
            The Company recognizes that equal opportunity does not require identical treatment in every circumstance and that differences in outcomes may occur where supported by objective, proportionate, documented, and legitimate business considerations.
          </p>

          <p style={{ marginBottom: '2.5rem' }}>
            At the same time, the Organization acknowledges that equitable opportunity may require reasonable adjustments, accessibility measures, inclusive practices, and supportive processes intended to enable individuals to participate effectively.
          </p>

          {/* Merit + Inclusion Block */}
          <div style={{ border: '1px solid #312e81', borderRadius: '1.25rem', padding: '2.25rem', marginBottom: '3.5rem', backgroundColor: '#111019' }}>
            <h3 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 600, marginTop: 0, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
              Merit + Inclusion Approach
            </h3>
            <p style={{ margin: 0, fontSize: '0.975rem', lineHeight: 1.7, color: '#c7d2fe' }}>
              Zawr Industries LLP adopts a Merit + Inclusion approach under which professional excellence remains the foundation of decision-making while inclusion initiatives are used to remove unnecessary barriers and improve access to opportunity.
            </p>
          </div>

          <p style={{ marginBottom: '2rem' }}>
            The Company is committed to maintaining workplaces and business environments that are accessible, respectful, inclusive, and supportive of professional participation.
          </p>

          <p style={{ marginBottom: '2rem' }}>
            Reasonable accommodation and accessibility measures may be considered where appropriate to support meaningful participation and enable individuals to perform responsibilities effectively. Such measures are intended to support equitable participation and shall not be interpreted as reducing standards of performance or professional accountability.
          </p>

          <p style={{ marginBottom: '3rem' }}>
            The Organization further expects all individuals exercising managerial, hiring, leadership, or decision-making authority to administer opportunities responsibly and maintain practices consistent with fairness, professional dignity, and organizational values. Managers and leaders are expected to avoid assumptions, promote objective evaluation, support equitable participation, and create environments in which employees can engage professionally and pursue growth opportunities.
          </p>

          <h2 style={{ color: '#ffffff', fontSize: '1.75rem', fontWeight: 600, marginTop: '3.5rem', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>
            Accountability &amp; Governance
          </h2>
          <p style={{ marginBottom: '2rem' }}>
            Zawr Industries LLP adopts a strict zero-tolerance approach toward discrimination, exclusion, harassment, retaliatory conduct, misuse of authority, and practices that undermine equal opportunity.
          </p>

          <p style={{ marginBottom: '2rem' }}>
            Individuals covered under this Policy are encouraged to raise concerns relating to unequal treatment, accessibility barriers, exclusion, inappropriate conduct, or failures in implementation through designated reporting mechanisms. The Company commits to addressing concerns through processes intended to remain fair, proportionate, confidential, and accountable.
          </p>

          <p style={{ marginBottom: '2.5rem' }}>
            No individual shall be subjected to retaliation solely because they raised concerns in good faith, requested accommodation, participated in a review process, or supported implementation of this Policy.
          </p>

          <p style={{ marginBottom: '3.5rem' }}>
            The Organization further recognizes that equal opportunity requires continuous improvement and therefore may periodically review workplace practices, participation patterns, accessibility measures, employee experience, and governance mechanisms to strengthen implementation and maintain alignment with evolving business requirements.
          </p>

          {/* Form Declaration Block */}
          <footer style={{ borderTop: '1px solid #222225', paddingTop: '2.5rem', marginTop: '4rem' }}>
            <p style={{ fontSize: '0.95rem', color: '#9ca3af', fontStyle: 'italic', lineHeight: 1.7, margin: 0 }}>
              Through this Equal Opportunity Policy, Zawr Industries LLP formally declares its commitment to building an organization where opportunity is created through merit, participation is enabled through inclusion, accessibility supports contribution, professional dignity is protected, and organizational growth is achieved through responsible leadership, institutional accountability, and equitable business practices.
            </p>
          </footer>

        </article>

      </div>
    </div>
  );
}

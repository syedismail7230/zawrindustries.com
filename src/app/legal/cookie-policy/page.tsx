import Link from 'next/link';

export default function CookiePolicy() {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div style={{ padding: '8rem 5% 4rem', minHeight: '60vh', color: 'var(--text-dark)', backgroundColor: 'var(--bg-light)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: 'var(--bg-white)', padding: '3rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid var(--border-color)' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '1rem' }}>COOKIE POLICY</h1>
        <div style={{ color: 'var(--text-light)', marginBottom: '2rem', lineHeight: 1.6 }}>
          <strong>Zawr Industries LLP</strong><br/>
          Website: zawrindustries.com<br/>
          Effective Date: {currentDate}<br/>
          Version: 1.0
        </div>
        
        <div style={{ lineHeight: 1.8, color: 'var(--text-dark)' }}>
          <p>This Cookie Policy explains how Zawr Industries LLP (“Zawr Industries,” “we,” “us,” “our”) uses cookies and similar technologies when you visit, access, interact with, or use zawrindustries.com and any related webpages, portals, applications, dashboards, forms, or digital services operated by us (collectively, the “Website” or “Platform”).</p>
          <p>This Cookie Policy should be read together with our Privacy Policy, Terms of Use, and any other policies or notices made available on the Website. By continuing to use the Platform, you acknowledge that certain cookies and related technologies may be used in accordance with this Policy and your selected preferences, where applicable.</p>

          <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-color)', marginTop: '2.5rem', marginBottom: '1rem' }}>1. PURPOSE OF THIS COOKIE POLICY</h2>
          <p>Zawr Industries LLP uses cookies and related tracking technologies to support the secure operation of the Website, improve user experience, remember preferences, understand how visitors interact with our pages, measure performance, support communications, and enable future functionality. In a modern digital environment, cookies play a functional role in maintaining continuity between pages, storing consent choices, protecting forms, enabling sign-in sessions, and allowing analytics systems to help us improve performance and usability.</p>
          <p>This Policy is intended to provide a transparent explanation of what cookies are, why we use them, what types of cookies may be placed on your device, how you may manage your preferences, and how you may contact us regarding any questions about our use of cookies.</p>

          <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-color)', marginTop: '2.5rem', marginBottom: '1rem' }}>2. WHAT ARE COOKIES AND SIMILAR TECHNOLOGIES?</h2>
          <p>Cookies are small text files or data fragments that are stored on your browser, device, or application environment when you visit a website. They allow a website to recognize your device, retain information about your activity, remember selections, and help the website function properly.</p>
          <p>In addition to cookies, we may use similar technologies that perform comparable functions, such as:</p>
          <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
            <li>pixels or tags;</li>
            <li>browser storage objects;</li>
            <li>session identifiers;</li>
            <li>local storage and similar client-side storage;</li>
            <li>SDKs within mobile or web-based applications;</li>
            <li>tracking scripts or embedded tools;</li>
            <li>server-side measurement tools where applicable.</li>
          </ul>
          <p>These technologies may operate together to support authentication, analytics, preference storage, security, and performance measurement.</p>

          <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-color)', marginTop: '2.5rem', marginBottom: '1rem' }}>3. WHY WE USE COOKIES</h2>
          <p>We use cookies for several operational, functional, analytical, and business purposes, including the following:</p>
          <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
            <li>to make the Website operate securely and reliably;</li>
            <li>to maintain your session when you log in or move between pages;</li>
            <li>to remember your preferences and settings;</li>
            <li>to improve navigation and usability;</li>
            <li>to analyze how the Website is used and identify areas for improvement;</li>
            <li>to detect technical issues, errors, or security anomalies;</li>
            <li>to support customer support, communication, and account continuity;</li>
            <li>to understand the effectiveness of campaigns, outreach, and content;</li>
            <li>to personalize content and user experience where permitted;</li>
            <li>to enable future product features and third-party integrations;</li>
            <li>to comply with legal, security, and operational requirements.</li>
          </ul>
          <p>Without some cookies, certain parts of the Website may not function as intended. Other cookies are optional and may be accepted or rejected through the preferences banner or settings panel.</p>

          <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-color)', marginTop: '2.5rem', marginBottom: '1rem' }}>4. TYPES OF COOKIES WE MAY USE</h2>
          <p>We organize our cookies into categories so that users may make informed choices. Some cookies are strictly necessary and cannot be disabled, while others are optional and can be controlled through your consent preferences.</p>

          <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-color)', marginTop: '1.5rem' }}>4.1 Strictly Necessary Cookies</h3>
          <p>Strictly necessary cookies are essential for the operation of the Website. They enable core functionality that users reasonably expect and that cannot be delivered without these cookies.</p>

          <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-color)', marginTop: '1.5rem' }}>4.2 Functional Cookies</h3>
          <p>Functional cookies enhance usability and remember user choices that improve the experience.</p>

          <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-color)', marginTop: '1.5rem' }}>4.3 Analytics Cookies</h3>
          <p>Analytics cookies help us understand how users engage with the Website so we can measure performance and improve content, structure, and functionality.</p>

          <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-color)', marginTop: '1.5rem' }}>4.4 Marketing Cookies</h3>
          <p>Marketing cookies are used to measure the effectiveness of promotional activities and to support more relevant communications and advertising experiences.</p>

          <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-color)', marginTop: '1.5rem' }}>4.5 Customer Experience Cookies</h3>
          <p>Customer experience cookies may be used to support support tools, chat systems, feedback features, and engagement continuity.</p>

          <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-color)', marginTop: '1.5rem' }}>4.6 Preference Cookies</h3>
          <p>Preference cookies store choices you make so the Website can remember them on future visits.</p>

          <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-color)', marginTop: '2.5rem', marginBottom: '1rem' }}>5. CONSENT AND COOKIE BANNER</h2>
          <p>When you first access the Website, we may display a cookie consent banner immediately. This banner is intended to inform you about the use of cookies and to allow you to manage your preferences before non-essential cookies are activated.</p>

          <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-color)', marginTop: '2.5rem', marginBottom: '1rem' }}>6. HOW TO MANAGE OR WITHDRAW CONSENT</h2>
          <p>You may manage your cookie preferences in several ways, depending on the tools made available on the Website and the browser or device you use. You may adjust your selections through the cookie preference center, reject non-essential cookies through the banner, or clear cookies using your browser settings.</p>

          <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-color)', marginTop: '2.5rem', marginBottom: '1rem' }}>7. CONTACT US</h2>
          <p>If you have any questions, concerns, complaints, or requests regarding this Cookie Policy or our use of cookies, please contact us:</p>
          <div style={{ backgroundColor: 'var(--bg-light)', padding: '1.5rem', borderRadius: '4px', marginTop: '1rem' }}>
            <strong>Zawr Industries LLP</strong><br/>
            Website: zawrindustries.com<br/>
            Email: <a href="mailto:privacy@zawrindustries.com" style={{ color: 'var(--primary-color)' }}>privacy@zawrindustries.com</a>
          </div>
        </div>
        
        <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <Link href="/" style={{ color: 'var(--primary-color)', textDecoration: 'underline', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

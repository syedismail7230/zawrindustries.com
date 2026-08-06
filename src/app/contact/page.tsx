'use client';

import Link from 'next/link';
import { useState } from 'react';

const faqs = [

  {
    question: "Can I change my plan later?",
    answer: "Of course. Our pricing scales with your company. Chat to our friendly team to find a solution that works for you as you grow.",
    icon: <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM4 10h16" />
  },

  {
    question: "Can other info be added to an invoice?",
    answer: "At the moment, the only way to add additional information to invoices is to add the information to the workspace's name manually.",
    icon: <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8" />
  },

  {
    question: "What industries do you operate in?",
    answer: "We operate across 5 core sectors: IT Services, Transport & Logistics, Manufacturing, Real Estate, and Healthcare, providing end-to-end enterprise solutions.",
    icon: <><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></>
  },
  {
    question: "How can we partner with you?",
    answer: "We are always open to strategic partnerships. You can chat with our sales team directly to find a collaboration model that works for both of us.",
    icon: <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm14 14v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  },
  {
    question: "Where are your offices located?",
    answer: "Our global headquarters are located in Bangalore, India, with expanding operations and reach across the UAE, USA, and UK markets.",
    icon: <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
  },
  {
    question: "Do you provide custom IT solutions?",
    answer: "Yes, our Technology division specializes in building custom SaaS platforms, AI integrations, and digital infrastructures tailored to your needs.",
    icon: <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
  },
  {
    question: "Does Zawr Industries work with startups, SMEs, and large enterprises?",
    answer: "Yes. Zawr Industries is structured to support businesses at every stage of growth — from early-stage startups to enterprise-scale organizations. Our engagement model is designed to provide scalable solutions, dedicated technical teams, strategic consultation, product engineering, operational support, and long-term technology partnerships aligned with organizational objectives and market expansion goals.",
    icon: <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  },
  {
    question: "How does Zawr Industries manage projects and ensure delivery quality?",
    answer: "Zawr Industries follows a structured delivery framework that combines requirement analysis, strategic planning, agile execution, quality assurance, deployment governance, and post-launch support. Every engagement is managed through defined milestones, periodic reporting, transparent communication, and continuous monitoring to ensure performance, scalability, security, and business alignment.",
    icon: <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
  },
  {
    question: "Does Zawr Industries work only with IT clients?",
    answer: "No. As a conglomerate, Zawr Industries supports multiple industries and business segments beyond technology. We collaborate with startups, SMEs, enterprises, and organizations across sectors by delivering technology enablement, business solutions, operational support, and scalable growth initiatives tailored to each industry's requirements.",
    icon: <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8v4l3 3" />
  },
  {
    question: "What makes Zawr Industries different from other IT companies?",
    answer: "Zawr Industries combines the agility of a modern technology company with the strategic vision of a multi-sector conglomerate. Rather than offering isolated development services, the company focuses on building integrated ecosystems that align technology, operations, scalability, automation, and business growth under a unified framework. Our approach emphasizes innovation, execution capability, intellectual property development, and sustainable long-term value creation.",
    icon: <><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></>
  }
];

export default function ContactPage() {
  const [visibleFaqs, setVisibleFaqs] = useState(6);
  const [activePin, setActivePin] = useState<string | null>('india');

  const locations = [
    { id: 'usa', title: 'New York, USA', top: '24%', left: '25%', line1: '123 Business Rd', line2: 'New York, NY 10001' },
    { id: 'russia', title: 'Moscow, Russia', top: '17%', left: '58%', line1: '45 Tverskaya St', line2: 'Moscow, 125009' },
    { id: 'uae', title: 'Dubai, UAE', top: '38%', left: '61.5%', line1: 'Sheikh Zayed Rd', line2: 'Dubai, UAE' },
    { id: 'india', title: 'Bengaluru, India', top: '41%', left: '69%', line1: 'Oxford Towers, HAL Old Airport Road,', line2: 'Kodihalli, Bengaluru 560008' },
    { id: 'africa', title: 'Cape Town, South Africa', top: '64%', left: '54%', line1: '1 Long St, Cape Town', line2: '8001, South Africa' },
    { id: 'australia', title: 'Sydney, Australia', top: '61%', left: '83%', line1: 'George St', line2: 'Sydney NSW 2000' }
  ];

  const handleLoadMore = () => {
    setVisibleFaqs(prev => Math.min(prev + 4, faqs.length));
  };

  const handleOpenChat = (e: React.MouseEvent) => {
    e.preventDefault();
    // Assuming standard Tawk.to or similar chat widget API
    if (typeof window !== 'undefined' && (window as any).Tawk_API) {
      (window as any).Tawk_API.toggle();
    } else {
      alert("Chat widget is initializing...");
    }
  };

  return (
    <div style={{ backgroundColor: '#ffffff', color: '#101828', paddingBottom: '6rem', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {/* Hero Section */}
      <section style={{ 
        padding: '6rem 5% 0', 
        textAlign: 'center',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Background Grid Pattern */}
        <div style={{ 
          position: 'absolute', 
          top: 0, left: 0, right: 0, height: '400px',
          backgroundImage: 'linear-gradient(to right, #f2f4f7 1px, transparent 1px), linear-gradient(to bottom, #f2f4f7 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 100%)',
          zIndex: 0
        }} />
        
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#000000', marginBottom: '0.75rem' }}>Contact us</p>
          <h1 style={{ fontSize: '3rem', fontWeight: 600, marginBottom: '1.25rem', letterSpacing: '-0.02em', color: '#101828' }}>
            Get in touch with our team
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#475467', maxWidth: '600px', margin: '0 auto 4rem' }}>
            We have the team and know-how to help you scale 10X faster.
          </p>
        </div>

        {/* World Map Area */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '1000px', aspectRatio: '4378 / 2434', margin: '0 auto', zIndex: 1, borderBottom: '1px solid transparent' }}>
          
          {/* Dotted World Map Graphic */}
          <div style={{ 
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(#98a2b3 2px, transparent 2px)', 
            backgroundSize: '8px 8px',
            maskImage: 'url("https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto:good,w_1200,c_limit/v1783710563/zawr/assets/world-map.svg")',
            WebkitMaskImage: 'url("https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto:good,w_1200,c_limit/v1783710563/zawr/assets/world-map.svg")',
            maskSize: '100% 100%',
            WebkitMaskSize: '100% 100%',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            opacity: 0.8
          }} />
          
          {/* Interactive Map Pins */}
          {locations.map((loc) => {
            const isActive = activePin === loc.id;
            return (
              <div 
                key={loc.id}
                onClick={() => setActivePin(loc.id)}
                style={{ 
                  position: 'absolute', top: loc.top, left: loc.left, 
                  width: '12px', height: '12px', backgroundColor: '#000000', 
                  borderRadius: '50%', boxShadow: isActive ? '0 0 0 6px rgba(0,0,0,0.15)' : '0 0 0 4px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transform: 'translate(-50%, -50%)',
                  transition: 'all 0.2s ease-in-out',
                  zIndex: isActive ? 10 : 2
                }} 
                title={loc.title}
              >
                {/* The Tooltip */}
                {isActive && (
                  <div 
                    style={{ 
                      position: 'absolute', 
                      bottom: '100%', 
                      left: '50%', 
                      transform: parseFloat(loc.left) > 75 ? 'translate(-85%, -12px)' : (parseFloat(loc.left) < 30 ? 'translate(-15%, -12px)' : 'translate(-50%, -12px)'), 
                      backgroundColor: '#101828', 
                      color: '#fff', 
                      padding: '1rem', 
                      borderRadius: '12px', 
                      fontSize: '0.85rem', 
                      textAlign: 'center', 
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', 
                      width: 'max-content',
                      minWidth: '200px',
                      maxWidth: '80vw',
                      cursor: 'default',
                      whiteSpace: 'normal',
                      zIndex: 20
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <p style={{ fontWeight: 700, margin: '0 0 0.4rem', fontSize: '0.95rem' }}>{loc.title}</p>
                    <p style={{ margin: '0 0 0.2rem', color: '#D0D5DD' }}>{loc.line1}</p>
                    <p style={{ margin: 0, color: '#D0D5DD' }}>{loc.line2}</p>
                    <div style={{ position: 'absolute', bottom: '-5px', left: parseFloat(loc.left) > 75 ? '85%' : (parseFloat(loc.left) < 30 ? '15%' : '50%'), transform: 'translateX(-50%) rotate(45deg)', width: '10px', height: '10px', backgroundColor: '#101828' }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Contact Cards Grid */}
      <section style={{ padding: '0 5%', maxWidth: '1200px', margin: '40px auto 6rem', position: 'relative', zIndex: 2 }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1.5rem' 
        }}>
          
          {/* Card 1 */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #EAECF0', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', boxShadow: '0 12px 24px -4px rgba(16,24,40,0.08)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1px solid #EAECF0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', color: '#475467', boxShadow: '0 1px 2px rgba(16,24,40,0.05)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.25rem', color: '#101828' }}>Chat to sales</h3>
            <p style={{ color: '#475467', fontSize: '0.875rem', marginBottom: '1.5rem', flex: 1 }}>Speak to our friendly team.</p>
            <a href="mailto:sales@zawrindustries.com" style={{ display: 'inline-block', alignSelf: 'flex-start', padding: '0.625rem 1rem', backgroundColor: '#000000', color: '#fff', borderRadius: '8px', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', boxShadow: '0 1px 2px rgba(16,24,40,0.05)', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title="sales@zawrindustries.com">
              sales@zawrindustries.com
            </a>
          </div>

          {/* Card 2 */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #EAECF0', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', boxShadow: '0 1px 3px rgba(16,24,40,0.05)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1px solid #EAECF0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', color: '#475467', boxShadow: '0 1px 2px rgba(16,24,40,0.05)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.25rem', color: '#101828' }}>Chat to support</h3>
            <p style={{ color: '#475467', fontSize: '0.875rem', marginBottom: '1.5rem', flex: 1 }}>We're here to help.</p>
            <a href="mailto:support@zawrindustries.com" style={{ display: 'inline-block', alignSelf: 'flex-start', padding: '0.625rem 1rem', backgroundColor: '#ffffff', color: '#344054', border: '1px solid #D0D5DD', borderRadius: '8px', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', boxShadow: '0 1px 2px rgba(16,24,40,0.05)', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title="support@zawrindustries.com">
              support@zawrindustries.com
            </a>
          </div>

          {/* Card 3 */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #EAECF0', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', boxShadow: '0 1px 3px rgba(16,24,40,0.05)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1px solid #EAECF0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', color: '#475467', boxShadow: '0 1px 2px rgba(16,24,40,0.05)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.25rem', color: '#101828' }}>Visit us</h3>
            <p style={{ color: '#475467', fontSize: '0.875rem', marginBottom: '1.5rem', flex: 1 }}>Visit our office HQ.</p>
            <a href="https://maps.app.goo.gl/pe7QAsM2J5BtJyyS" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', alignSelf: 'flex-start', padding: '0.625rem 1rem', backgroundColor: '#ffffff', color: '#344054', border: '1px solid #D0D5DD', borderRadius: '8px', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', boxShadow: '0 1px 2px rgba(16,24,40,0.05)' }}>
              View on Google Maps
            </a>
          </div>

          {/* Card 4 */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #EAECF0', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', boxShadow: '0 1px 3px rgba(16,24,40,0.05)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1px solid #EAECF0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', color: '#475467', boxShadow: '0 1px 2px rgba(16,24,40,0.05)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.25rem', color: '#101828' }}>Call us</h3>
            <p style={{ color: '#475467', fontSize: '0.875rem', marginBottom: '1.5rem', flex: 1 }}>Mon-Fri from 8am to 5pm.</p>
            <a href="tel:+919880464078" style={{ display: 'inline-block', alignSelf: 'flex-start', padding: '0.625rem 1rem', backgroundColor: '#ffffff', color: '#344054', border: '1px solid #D0D5DD', borderRadius: '8px', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', boxShadow: '0 1px 2px rgba(16,24,40,0.05)' }}>
              +91 9880464078
            </a>
          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ padding: '0 5% 4rem', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 600, textAlign: 'center', marginBottom: '4rem', letterSpacing: '-0.02em', color: '#101828' }}>
          Frequently asked questions
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem 2rem' }}>
          {faqs.slice(0, visibleFaqs).map((faq, index) => (
            <div key={index} style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '10px', border: '1px solid #EAECF0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#475467' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {faq.icon}
                </svg>
              </div>
              <div>
                <h4 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem', color: '#101828' }}>{faq.question}</h4>
                <p style={{ color: '#475467', fontSize: '1rem', lineHeight: 1.5 }}>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
        
        {visibleFaqs < faqs.length && (
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button onClick={handleLoadMore} style={{ padding: '0.625rem 1rem', backgroundColor: '#fff', border: '1px solid #D0D5DD', color: '#344054', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', boxShadow: '0 1px 2px rgba(16,24,40,0.05)' }}>
              Load more
            </button>
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <section style={{ padding: '0 5%', maxWidth: '1000px', margin: '2rem auto 0' }}>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #EAECF0', borderRadius: '16px', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem', boxShadow: '0 4px 6px -1px rgba(16,24,40,0.05)' }}>
          
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            {/* Single Avatar */}
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#f2f4f7', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150" alt="Support Staff" style={{ width: '100%', height: '100%', objectFit: 'cover' }}  loading="lazy" decoding="async" />
            </div>
            
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.25rem', color: '#101828' }}>Still have questions?</h3>
              <p style={{ color: '#475467', fontSize: '1rem', margin: 0 }}>Can't find the answer you're looking for? Please <a href="#" onClick={handleOpenChat} style={{ color: '#475467', textDecoration: 'underline', cursor: 'pointer' }}>chat to our friendly team</a>.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link href="tel:+919880464078" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1rem', backgroundColor: '#fff', color: '#344054', border: '1px solid #D0D5DD', borderRadius: '8px', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', boxShadow: '0 1px 2px rgba(16,24,40,0.05)' }}>
              Call us
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </Link>
            <Link href="https://wa.me/919880464078" target="_blank" rel="noopener noreferrer" style={{ padding: '0.625rem 1rem', backgroundColor: '#000000', color: '#fff', border: '1px solid #000000', borderRadius: '8px', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', boxShadow: '0 1px 2px rgba(16,24,40,0.05)' }}>
              Get in touch
            </Link>
          </div>
          
        </div>
      </section>

    </div>
  );
}

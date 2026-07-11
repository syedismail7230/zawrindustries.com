import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Zawr Industries LLP — Corporate Profile & Expertise',
  description: 'Zawr Industries LLP is a leading India-based technology, software engineering, and business transformation partner delivering custom software, AI/ML integrations, cloud solutions, and IT consulting.',
  keywords: [
    'Zawr Industries LLP',
    'About Zawr Industries',
    'Software engineering company India',
    'Enterprise technology partner Bangalore',
    'AI and machine learning integrations',
    'Custom software development'
  ],
  alternates: {
    canonical: 'https://zawrindustries.com/about',
  }
};

export default function AboutPage() {
  const coreExpertise = [
    { title: 'Custom Software & Apps', desc: 'End-to-end full stack development for complex web, desktop, and mobile architectures.' },
    { title: 'Enterprise Applications', desc: 'Robust, secure, and scalable legacy system modernization and custom ERP/CRM building.' },
    { title: 'Artificial Intelligence & ML', desc: 'Integrating intelligent predictive workflows, large language models (LLMs), and automated decision logic.' },
    { title: 'Cloud & Infrastructure', desc: 'Enterprise-grade cloud migrations, AWS/Azure setup, and system orchestration.' },
    { title: 'SaaS Product Development', desc: 'Ideating, architecting, and launching secure multi-tenant software-as-a-service platforms.' },
    { title: 'Cybersecurity & DevOps', desc: 'Implementation of Zero-Trust network protocols, automated CI/CD pipelines, and threat mitigation.' },
    { title: 'UI/UX Design', desc: 'Human-centric user interface prototyping and premium experience design.' },
    { title: 'Data Analytics', desc: 'Unifying operational databases into clean dashboard analytics for data-driven decisions.' },
    { title: 'IT Consulting & Advisory', desc: 'Strategic technology roadmapping, digital transformation advisory, and process optimization.' },
    { title: 'Digital Marketing & SEO', desc: 'Advanced search engine optimization, performance marketing, and branding strategies.' }
  ];

  const industriesServed = [
    'Manufacturing', 'Retail & E-commerce', 'Healthcare', 'Education',
    'Finance', 'Logistics & Transport', 'Automotive', 'Real Estate & Hospitality', 'Professional Services'
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Corporation',
    'name': 'Zawr Industries LLP',
    'alternateName': 'Zawr Industries',
    'legalName': 'Zawr Industries LLP',
    'url': 'https://zawrindustries.com',
    'logo': 'https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto/v1783710570/zawr/assets/zawr-logo.png',
    'description': 'Zawr Industries LLP is a leading Indian technology, software engineering, and business transformation company headquartered in Bangalore. The company delivers enterprise custom software development, AI/ML integrations, cloud solutions, logistics automation, and business consulting services globally.',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Old Airport Rd, HAL',
      'addressLocality': 'Bangalore',
      'addressRegion': 'Karnataka',
      'postalCode': '560017',
      'addressCountry': 'IN'
    },
    'slogan': 'Empowering organizations through innovative technology and strategic digital solutions.',
    'knowsAbout': [
      'Custom Software Development',
      'Enterprise Application Development',
      'Web & Mobile App Development',
      'Artificial Intelligence (AI)',
      'Machine Learning (ML)',
      'Cloud Solutions',
      'SaaS Product Development',
      'DevOps & Cybersecurity',
      'Digital Transformation',
      'Business Automation',
      'UI/UX Design',
      'Data Analytics',
      'IT Consulting',
      'Search Engine Optimization (SEO)',
      'Digital Marketing'
    ]
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://zawrindustries.com'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'About Us',
        'item': 'https://zawrindustries.com/about'
      }
    ]
  };

  return (
    <>
      {/* Schema.org Organization Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Schema.org BreadcrumbList Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div style={{ backgroundColor: '#000000', color: '#ffffff', minHeight: '100vh', fontFamily: 'Inter, sans-serif', paddingBottom: '6rem' }}>
        
        {/* Section 1: Hero Banner */}
        <section style={{ 
          position: 'relative', 
          width: '100%', 
          height: '45vh', 
          backgroundImage: 'url("https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto/v1783710569/zawr/assets/zawr-industries.png")', 
          backgroundSize: 'cover', 
          backgroundPosition: 'center', 
          display: 'flex', 
          alignItems: 'flex-end', 
          justifyContent: 'flex-start',
          padding: '0 clamp(1rem, 6vw, 8%) 6vh clamp(1rem, 6vw, 8%)'
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.2) 100%)',
            pointerEvents: 'none'
          }} />
          <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px' }}>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 700, margin: 0, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Corporate Profile
            </h1>
            <p style={{ fontSize: 'clamp(1rem, 1.8vw, 1.25rem)', color: 'rgba(255,255,255,0.7)', marginTop: '0.75rem', fontWeight: 300 }}>
              Zawr Industries LLP — Technology, Software Engineering & Business Transformation Partner.
            </p>
          </div>
        </section>

        {/* Section 2: Core Description */}
        <section style={{ padding: '6rem 5% 4rem 5%', backgroundColor: '#ffffff', color: '#111111' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '2.5rem', color: '#000000' }}>
              About Zawr Industries LLP
            </h2>
            <div style={{ fontSize: '1.1rem', lineHeight: 1.85, color: '#2d3748', fontWeight: 400, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <p>
                <strong>Zawr Industries LLP</strong> is an India-based technology, software engineering, and business transformation company dedicated to helping startups, small and medium-sized businesses (SMEs), enterprises, and organizations leverage technology to accelerate growth, improve operational efficiency, and drive digital innovation. We combine advanced software engineering, artificial intelligence, cloud computing, automation, and strategic business consulting to deliver scalable, secure, and future-ready digital solutions for clients across multiple industries.
              </p>
              <p>
                At Zawr Industries, we believe technology should solve real business challenges. Our team works closely with organizations to understand their objectives, design customized solutions, and develop products that enhance productivity, improve customer experiences, and create sustainable competitive advantages. Every solution is built with a focus on performance, scalability, security, and long-term maintainability.
              </p>
              <p>
                Beyond technology implementation, Zawr Industries acts as a strategic technology partner. We help organizations identify opportunities for digital transformation, optimize business processes, automate repetitive workflows, improve decision-making through data-driven insights, and build scalable digital ecosystems that support long-term business growth.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Core Expertise Grid */}
        <section style={{ padding: '6rem 5%', backgroundColor: '#0b0b0b' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#a855f7' }}>
                Expertise
              </span>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 600, marginTop: '0.5rem', color: '#ffffff' }}>
                Our Core Expertise
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              {coreExpertise.map((exp, index) => (
                <div 
                  key={index}
                  style={{
                    backgroundColor: '#121212',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '1.25rem',
                    padding: '2.5rem 2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.75rem' }}>
                    {exp.title}
                  </h3>
                  <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: 0, fontWeight: 300 }}>
                    {exp.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Industries Served */}
        <section style={{ padding: '6rem 5%', backgroundColor: '#ffffff', color: '#111111' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '1.5rem', color: '#000000' }}>
              Sectors We Serve
            </h2>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.75, color: '#4b5563', maxWidth: '800px', margin: '0 auto 3.5rem auto', fontWeight: 300 }}>
              Zawr Industries serves businesses across a wide range of sectors. Our solutions support organizations of every size—from early-stage startups building their first product to established enterprises modernizing legacy systems and implementing next-generation technologies.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', maxWidth: '900px', margin: '0 auto' }}>
              {industriesServed.map((ind, i) => (
                <span 
                  key={i} 
                  style={{
                    padding: '0.8rem 1.5rem',
                    borderRadius: '9999px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    backgroundColor: '#f8fafc',
                    color: '#334155'
                  }}
                >
                  {ind}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: Innovation & Philosophy */}
        <section style={{ padding: '6rem 5%', backgroundColor: '#000000', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#ffffff', marginBottom: '1.5rem' }}>
                  Future-Ready Innovation
                </h3>
                <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.7)', fontWeight: 300 }}>
                  Innovation is at the core of our approach. We continuously explore emerging technologies such as artificial intelligence, generative AI, intelligent automation, cloud-native architectures, IoT, predictive analytics, and modern software engineering practices to create solutions that prepare businesses for the future. Our development methodology emphasizes agile delivery, transparent communication, quality assurance, security best practices, and continuous improvement throughout the software lifecycle.
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#ffffff', marginBottom: '1.5rem' }}>
                  Our Commitment
                </h3>
                <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.7)', fontWeight: 300 }}>
                  Whether developing custom enterprise software, launching a SaaS platform, integrating AI into business operations, modernizing digital infrastructure, or executing end-to-end digital transformation initiatives, Zawr Industries LLP is committed to delivering high-quality solutions that help businesses innovate, compete, and grow with confidence in the global digital economy.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Mission & Vision */}
        <section style={{ padding: '6rem 5%', backgroundColor: '#ffffff', color: '#111111', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
            <div style={{ borderLeft: '4px solid #a855f7', paddingLeft: '1.5rem' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#000000', marginBottom: '1rem' }}>
                Our Mission
              </h3>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.75, color: '#4b5563', margin: 0, fontWeight: 300 }}>
                To empower organizations through innovative technology, reliable engineering, and strategic digital solutions that create measurable business value.
              </p>
            </div>
            <div style={{ borderLeft: '4px solid #3b82f6', paddingLeft: '1.5rem' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#000000', marginBottom: '1rem' }}>
                Our Vision
              </h3>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.75, color: '#4b5563', margin: 0, fontWeight: 300 }}>
                To become a globally recognized technology company known for delivering world-class software products, transformative digital experiences, and intelligent business solutions that enable organizations to thrive in an increasingly connected and technology-driven world.
              </p>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}

import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import servicesData from '@/data/services_data.json';
import ServicePageClient from './ServicePageClient';

interface Offering {
  title: string;
  description: string;
  deliverables: string[];
}

interface FAQ {
  q: string;
  a: string;
}

interface Industry {
  name: string;
  image: string;
  projectName?: string;
  projectDescription?: string;
}

interface ServiceDetail {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  challenges: string[];
  offerings: Offering[];
  methodology: any[];
  industries: Industry[];
  faqs: FAQ[];
}

const typedServicesData = servicesData as Record<string, ServiceDetail>;

// Pre-define metadata maps to create premium rich keyword titles & decs
const seoKeywords: Record<string, { title: string; keywords: string }> = {
  'ai-data-analytics': {
    title: 'Enterprise AI & Predictive Data Analytics Services',
    keywords: 'enterprise ai solutions, predictive analytics, custom artificial intelligence, data warehouse, business analytics, Bangalore AI firm'
  },
  'cloud': {
    title: 'Hybrid Cloud Migration & Scalable Cloud Infrastructure',
    keywords: 'hybrid cloud solutions, AWS consulting, GCP solutions, cloud automation, high performance compute, cloud setup Bangalore'
  },
  'cognitive-business-operations': {
    title: 'Cognitive Workflows & Business Process Automation',
    keywords: 'cognitive automation, business workflows, backend operation automation, smart workflow analytics, AI-led administrative tools'
  },
  'cybersecurity': {
    title: 'Zero-Trust Cybersecurity & Corporate threat Protection',
    keywords: 'corporate security solutions, threat analytics, network firewalls, zero trust consulting, penetration testing, compliance audits'
  },
  'network-solutions': {
    title: 'High-Performance Enterprise Routing & Network Solutions',
    keywords: 'network load balancing, smart routing configurations, local area configurations, datacenter networking solutions'
  },
  'industrial-autonomy-and-engineering': {
    title: 'Industrial Automation & Hardware Autonomy Engineering',
    keywords: 'robotics automation, manufacturing controller programming, hardware monitoring systems, custom industrial pipelines'
  },
  'enterprise-solutions': {
    title: 'Custom ERP Architectures & Enterprise software Engines',
    keywords: 'custom ERP systems, enterprise database management, workforce automation software, custom business tools'
  },
  'consulting': {
    title: 'Advanced Technology Stack Consulting & R&D Audits',
    keywords: 'tech stack consulting, corporate R&D audits, engineering architecture blueprints, tech consulting firm Bangalore'
  },
  'software-development': {
    title: 'Native Custom Software Engineering & Scaling Backend Systems',
    keywords: 'high performance custom backend, custom software development company, scalable server engineering, dynamic native platforms'
  },
  'web-development': {
    title: 'Ultra-Modern Visual Web Development & Responsive Interfaces',
    keywords: 'premium web applications, custom frontend engineering, visual design development, React NextJS development Bangalore'
  },
  'application-development': {
    title: 'Cross-Platform Mobile & Desktop Product Development',
    keywords: 'mobile application developers, cross platform development, iOS Android enterprise applications, custom application build'
  },
  'startup-mvp': {
    title: 'Rapid Startup MVP Prototyping & Product Release Pipelines',
    keywords: 'MVP development Bangalore, rapid prototyping, startup product builder, agile MVP build, software proof of concept'
  },
  'crm-solution': {
    title: 'Next-Gen Sales CRM Workflow & Dynamic Lead Management',
    keywords: 'custom CRM builders, pipeline automation platforms, lead capture tools, sales workflow integration'
  },
  'cxm-solution': {
    title: 'Enterprise Customer Experience (CXM) Portals & Feedback Systems',
    keywords: 'custom CXM software, feedback systems, client portal design, interaction tracking dashboards'
  },
  'digital-marketing': {
    title: 'Advanced Search Engine Optimization (SEO) & Marketing Campaigns',
    keywords: 'advanced SEO services, search optimization Bangalore, performance marketing, content indexing strategies'
  },
  'blockchain': {
    title: 'Decentralized Blockchain Systems & Custom Smart Contracts',
    keywords: 'custom smart contract audit, hyperledger applications, custom blockchain solution, corporate ledger systems'
  },
  'iot': {
    title: 'Embedded IoT Device Networks & Real-Time Telemetry Systems',
    keywords: 'embedded devices engineering, IoT telemetry platforms, hardware telemetry dashboard, real-time diagnostic systems'
  },
  'devops': {
    title: 'Continuous Integration & Continuous Deployment (CI/CD) Automation',
    keywords: 'automated deployment pipelines, server health diagnostics, Kubernetes configurations, CI CD setup'
  },
  'unit-test': {
    title: 'Rigorous Code Unit Testing & Automated Coverage Audits',
    keywords: 'code unit testing, dynamic automated test coverage, regression checks, software quality testing'
  },
  'quality-assurance': {
    title: 'Full-Stack Software Quality Assurance & Usability Audits',
    keywords: 'software QA audits, load testing services, performance validation, user flow verification'
  },
  'workplace-transformation': {
    title: 'Workspace Digital Transformation & Collaboration Tools Setup',
    keywords: 'digital transformation, hybrid workplace tools, smart office configurations, tool optimization'
  },
  'process-automation': {
    title: 'Robotic Process Automation (RPA) & Workflow Optimizers',
    keywords: 'robotic process automation, custom RPA pipelines, business routine automation, data scraping workflows'
  },
  'business-process-management': {
    title: 'Strategic Business Process Management & Efficiency Audits',
    keywords: 'business process analytics, operational bottleneck removal, corporate efficiency strategy, resource orchestration'
  }
};

// Next.js dynamic metadata generator
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = typedServicesData[slug];
  
  if (!service) {
    return {
      title: 'Service Not Found | Zawr Industries',
    };
  }

  const seo = seoKeywords[slug] || {
    title: `${service.name} Services`,
    keywords: `${service.name}, custom solutions, software engineering, Bangalore, Zawr Industries`
  };

  const pageTitle = `${seo.title} | Zawr Industries`;
  const pageDescription = `Get premium, enterprise-grade ${service.name} services from Zawr Industries. ${service.description.substring(0, 160)}...`;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: seo.keywords,
    alternates: {
      canonical: `https://zawrindustries.com/industries/it-service/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `https://zawrindustries.com/industries/it-service/${slug}`,
      siteName: 'Zawr Industries',
      locale: 'en_IN',
      type: 'website',
      images: [
        {
          url: `https://zawrindustries.com/assets/${slug}-hero.png`,
          width: 1200,
          height: 630,
          alt: service.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [`https://zawrindustries.com/assets/${slug}-hero.png`],
    },
  };
}

// Generate static routes for all 23 services at build time
export async function generateStaticParams() {
  return [
    { slug: 'ai-data-analytics' },
    { slug: 'cloud' },
    { slug: 'cognitive-business-operations' },
    { slug: 'cybersecurity' },
    { slug: 'network-solutions' },
    { slug: 'industrial-autonomy-and-engineering' },
    { slug: 'enterprise-solutions' },
    { slug: 'consulting' },
    { slug: 'software-development' },
    { slug: 'web-development' },
    { slug: 'application-development' },
    { slug: 'startup-mvp' },
    { slug: 'crm-solution' },
    { slug: 'cxm-solution' },
    { slug: 'digital-marketing' },
    { slug: 'blockchain' },
    { slug: 'iot' },
    { slug: 'devops' },
    { slug: 'unit-test' },
    { slug: 'quality-assurance' },
    { slug: 'workplace-transformation' },
    { slug: 'process-automation' },
    { slug: 'business-process-management' }
  ];
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = typedServicesData[slug];

  if (!service) {
    notFound();
  }

  // Create Schema.org JSON-LD Service Data
  const jsonLdServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'name': service.name,
    'description': service.description,
    'serviceType': service.name,
    'areaServed': [
      {
        '@type': 'Country',
        'name': 'India'
      },
      {
        '@type': 'Country',
        'name': 'Global'
      }
    ],
    'provider': {
      '@type': 'Organization',
      'name': 'Zawr Industries',
      'url': 'https://zawrindustries.com',
      'logo': 'https://zawrindustries.com/logo.png',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': 'Bangalore',
        'addressRegion': 'Karnataka',
        'addressCountry': 'IN'
      }
    },
    'offers': {
      '@type': 'Offer',
      'priceCurrency': 'INR',
      'price': 'Contact for pricing'
    }
  };

  // Create Schema.org FAQPage Schema if FAQs are present
  const jsonLdFaqSchema = service.faqs && service.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': service.faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.q,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.a
      }
    }))
  } : null;

  return (
    <>
      {/* Dynamic structural schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdServiceSchema) }}
      />
      
      {jsonLdFaqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaqSchema) }}
        />
      )}

      <ServicePageClient service={service} slug={slug} />
    </>
  );
}

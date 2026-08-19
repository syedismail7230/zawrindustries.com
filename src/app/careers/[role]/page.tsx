import React from 'react';
import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import JobDetailClient from './JobDetailClient';

// Maps DB employment type → Google Jobs schema enum
function toGoogleEmploymentType(type: string): string {
  const t = (type || '').toLowerCase();
  if (t.includes('full')) return 'FULL_TIME';
  if (t.includes('part')) return 'PART_TIME';
  if (t.includes('contract')) return 'CONTRACTOR';
  if (t.includes('intern')) return 'INTERN';
  if (t.includes('temp')) return 'TEMPORARY';
  return 'FULL_TIME';
}

function buildJobPostingSchema(job: any): object {
  const datePosted = job.created_at
    ? new Date(job.created_at).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];

  const validThrough = new Date(
    new Date(datePosted).getTime() + 90 * 24 * 60 * 60 * 1000
  ).toISOString().split('T')[0];

  const isRemote = /remote/i.test(job.location || '');

  const description = [
    job.role,
    job.responsibilities?.length
      ? `Key Responsibilities:\n${(job.responsibilities as string[]).map(r => `• ${r}`).join('\n')}`
      : '',
    job.reporting ? `Reporting to: ${job.reporting}` : ''
  ].filter(Boolean).join('\n\n');

  const schema: any = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    title: job.title,
    description,
    datePosted,
    validThrough,
    employmentType: toGoogleEmploymentType(job.type),
    hiringOrganization: {
      '@type': 'Organization',
      name: 'Zawr Industries',
      sameAs: 'https://zawrindustries.com',
      logo: 'https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto:good,w_400,c_limit/v1783710570/zawr/assets/zawr-logo.png',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location,
        addressCountry: 'IN',
      },
    },
    directApply: true,
  };

  if (isRemote) {
    schema.jobLocationType = 'TELECOMMUTE';
    schema.applicantLocationRequirements = {
      '@type': 'Country',
      name: 'India',
    };
  }

  return schema;
}

export async function generateMetadata({ params }: { params: Promise<{ role: string }> }): Promise<Metadata> {
  const { role } = await params;
  try {
    const { data: job } = await supabase.from('jobs').select('*').eq('id', role).single();
    
    if (!job) {
      return {
        title: 'Career Opportunity | Zawr Industries',
        description: 'Explore engineering, logistics, and technology careers at Zawr Industries.',
      };
    }

    const title = `${job.title} — Career Opportunity | Zawr Industries`;
    const description = `We're hiring: ${job.title} (${job.location} • ${job.type || 'Full-Time'}). Explore responsibilities and submit your application to Zawr Industries.`;
    const url = `https://zawrindustries.com/careers/${role}`;
    const ogImage = 'https://zawrindustries.com/og-image.png';

    return {
      title,
      description,
      alternates: {
        canonical: url,
      },
      openGraph: {
        title: `We're Hiring: ${job.title} | Zawr Industries`,
        description,
        url,
        siteName: 'Zawr Industries Careers',
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: `${job.title} — Careers at Zawr Industries`,
          }
        ],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `We're Hiring: ${job.title} | Zawr Industries`,
        description,
        images: [ogImage],
      }
    };
  } catch {
    return {
      title: 'Careers & Opportunities | Zawr Industries',
      description: 'Explore career opportunities at Zawr Industries.',
    };
  }
}

export default async function JobDetailPage({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params;
  let job = null;

  try {
    const { data } = await supabase.from('jobs').select('*').eq('id', role).single();
    job = data;
  } catch (e) {
    console.error('Error fetching job on server:', e);
  }

  return (
    <>
      {job && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJobPostingSchema(job)) }}
        />
      )}
      <JobDetailClient initialJob={job} />
    </>
  );
}

"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const PitchDeckViewer = dynamic(() => import('../PitchDeckViewer'), { ssr: false });

function FinancialReportContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch('/api/financial-reports');
        if (res.ok) {
          const data = await res.json();
          const found = data.find((r: any) => r.id === id);
          setReport(found || null);
        }
      } catch (e) {
        console.error('Error fetching report:', e);
      }
      setLoading(false);
    };

    if (id) {
      fetchReport();
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#000000', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 400 }}>Loading Report...</h2>
      </div>
    );
  }

  if (!report) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#000000', color: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 600 }}>Report Not Found</h2>
        <p style={{ color: '#888888' }}>The requested financial report could not be found or has not been uploaded yet.</p>
        <Link href="/investors" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#ffffff', color: '#000000', fontWeight: 600, borderRadius: '4px', textDecoration: 'none' }}>
          Back to Investors Portal
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000000', color: '#ffffff', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '2rem 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222222' }}>
        <Link href="/investors" style={{ color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', fontWeight: 500 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back
        </Link>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>{report.title} Financial Report</h1>
        <div style={{ width: '60px' }}></div> {/* Spacer to keep title centered */}
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 0' }}>
        {report.pdfUrl ? (
          <PitchDeckViewer fileUrl={report.pdfUrl} />
        ) : (
          <div style={{ textAlign: 'center', color: '#888888' }}>
            <p style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>No PDF document has been uploaded for this report yet.</p>
            <Link href="/investors" style={{ color: '#ffffff', textDecoration: 'underline' }}>Back to Investors Portal</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function FinancialReportPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', backgroundColor: '#000000', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 400 }}>Loading Portal...</h2>
      </div>
    }>
      <FinancialReportContent />
    </Suspense>
  );
}

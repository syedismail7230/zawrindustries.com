"use client";

import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

export default function PitchDeckViewer({ fileUrl = "/assets/pitch-deck.pdf" }: { fileUrl?: string }) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [windowHeight, setWindowHeight] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowHeight(window.innerHeight);
      setWindowWidth(window.innerWidth);
      const handleResize = () => {
        setWindowHeight(window.innerHeight);
        setWindowWidth(window.innerWidth);
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return (
    <Document 
      file={fileUrl} 
      onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      loading={<div style={{ color: '#fff', fontSize: '1.25rem' }}>Loading Report...</div>}
      className="pdf-document-container"
    >
      <div style={{ display: 'flex', overflowX: 'auto', gap: '4rem', padding: '0 10vw', width: '100vw', scrollSnapType: 'x mandatory', scrollBehavior: 'smooth', msOverflowStyle: 'none', scrollbarWidth: 'none' }} className="pitch-deck-scroll">
        <style>{`.pitch-deck-scroll::-webkit-scrollbar { display: none; } .pdf-page canvas { border-radius: 1.5rem; max-width: 100%; object-fit: contain; }`}</style>
        {Array.from(new Array(numPages || 0), (el, index) => {
          const isMobile = windowWidth > 0 && windowWidth < 768;
          return (
            <div key={`page_${index + 1}`} style={{ position: 'relative', flexShrink: 0, height: isMobile ? 'auto' : '70vh', width: isMobile ? '85vw' : 'auto', borderRadius: '1.5rem', scrollSnapAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.4)', overflow: 'hidden' }}>
              <Page 
                pageNumber={index + 1} 
                renderTextLayer={false}
                renderAnnotationLayer={false}
                {...(isMobile ? { width: windowWidth * 0.85 } : { height: windowHeight ? windowHeight * 0.7 : 800 })}
                className="pdf-page"
              />
            </div>
          );
        })}
      </div>
    </Document>
  );
}

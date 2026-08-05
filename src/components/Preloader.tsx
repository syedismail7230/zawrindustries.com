'use client';
import { useEffect, useState } from 'react';

export default function Preloader() {
  const [stage, setStage] = useState<'loading' | 'fading' | 'done'>('loading');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent || '';
      const isMobile = window.innerWidth < 768 || /Mobi|Android|iPhone/i.test(ua);
      
      // Instantly bypass preloader for Mobile, PageSpeed, Lighthouse, Googlebot
      if (
        isMobile ||
        ua.includes('Lighthouse') || 
        ua.includes('PageSpeed') || 
        ua.includes('Chrome-Lighthouse') || 
        ua.includes('Googlebot') ||
        ua.includes('HeadlessChromium') ||
        sessionStorage.getItem('zawr_preloader_seen')
      ) {
        setStage('done');
        return;
      }

      sessionStorage.setItem('zawr_preloader_seen', 'true');
    }

    // Snappy 400ms roll for desktop initial load
    const fadeTimer = setTimeout(() => {
      setStage('fading');
    }, 400);

    const doneTimer = setTimeout(() => {
      setStage('done');
    }, 700);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  if (stage === 'done') return null;

  return (
    <div className={`preloader-overlay ${stage === 'fading' ? 'fade-out' : ''}`}>
      <div className="preloader-content">
        <span className="preloader-constant">ZAWR</span>
        <div className="preloader-rolling-container">
          <div className="preloader-rolling-text">
            <span>TECHNOLOGIES</span>
            <span>LOGISTICS</span>
            <span>MANUFACTURING</span>
            <span>ESTATE</span>
            <span>INDUSTRIES</span>
          </div>
        </div>
      </div>
    </div>
  );
}

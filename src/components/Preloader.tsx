'use client';
import { useEffect, useState } from 'react';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ 
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function Preloader() {
  const [stage, setStage] = useState<'loading' | 'fading' | 'done'>('loading');

  useEffect(() => {
    // The rolling animation takes 2.4 seconds
    const fadeTimer = setTimeout(() => {
      setStage('fading');
    }, 2800); // Hold on INDUSTRIES for a moment before fading

    const doneTimer = setTimeout(() => {
      setStage('done');
    }, 3400); // 0.6s fade out duration

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  if (stage === 'done') return null;

  return (
    <div className={`preloader-overlay ${stage === 'fading' ? 'fade-out' : ''} ${poppins.className}`}>
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

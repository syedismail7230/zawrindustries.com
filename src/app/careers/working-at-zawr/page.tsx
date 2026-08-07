"use client";

import React from 'react';
import Link from 'next/link';

export default function WorkingAtZawrPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000000', color: '#ffffff', fontFamily: 'Inter, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');`}</style>
      
      {/* Immersive Mockup Full-Bleed Hero Banner */}
      <section style={{ 
        position: 'relative',
        width: '100%', 
        backgroundColor: '#000000',
        borderBottom: '1px solid #1f2937',
        overflow: 'hidden'
      }}>
        {/* Responsive Image Banner displaying the full uncropped picture */}
        <img 
          src="https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_1200,c_limit/v1783710521/zawr/assets/life-at-zawr.png" 
          alt="Life at Zawr" 
          style={{ 
            width: '100%', 
            height: 'auto', 
            display: 'block' 
          }} 
         loading="lazy" decoding="async" />

        {/* Subtle gradient backdrop */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.25) 50%, transparent 100%)',
          zIndex: 1,
          pointerEvents: 'none'
        }}></div>

        {/* Grouped text block — title + quote together, vertically centered */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '22%',
          transform: 'translateY(-50%)',
          zIndex: 2
        }}>
          <h1 style={{
            fontSize: 'clamp(6rem, 16.5vw, 13.5rem)',
            fontWeight: 300,
            color: '#ffffff',
            lineHeight: 1.0,
            margin: '0 0 1.25rem 0',
            letterSpacing: '-0.02em',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            whiteSpace: 'nowrap'
          }}>
            Life at<br/>Zawr
          </h1>
          <p style={{
            fontSize: 'clamp(0.85rem, 1.5vw, 1.05rem)',
            color: '#ffffff',
            lineHeight: 1.5,
            margin: 0,
            fontWeight: 400,
            opacity: 0.9,
            maxWidth: '380px',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
          }}>
            At Zawr, ideas become impact, ambition becomes opportunity, and every journey contributes to building the future together.
          </p>
        </div>
      </section>

      {/* Shift the Resistance Section */}
      <section style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        backgroundColor: '#ffffff',
        minHeight: '340px'
      }}>
        {/* Left: Office Image */}
        <div style={{
          flex: '1 1 55%',
          minHeight: '300px',
          overflow: 'hidden'
        }}>
          <img
            src="https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_1200,c_limit/v1783710548/zawr/assets/shift-resistance.png"
            alt="Zawr office environment"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
           loading="lazy" decoding="async" />
        </div>

        {/* Right: Text */}
        <div style={{
          flex: '1 1 45%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '3rem 5%',
          backgroundColor: '#ffffff'
        }}>
          <div>
            <p style={{
              fontSize: 'clamp(3.75rem, 7.5vw, 6rem)',
              fontWeight: 400,
              color: '#000000',
              lineHeight: 1.1,
              margin: 0,
              fontFamily: 'Inter, system-ui, sans-serif',
              letterSpacing: '-0.02em'
            }}>
              Shift<br />in<span style={{
                display: 'block',
                fontFamily: "'Great Vibes', cursive",
                fontWeight: 400,
                fontStyle: 'normal',
                letterSpacing: '0.01em'
              }}>resistance</span>
            </p>
          </div>
        </div>
      </section>

      {/* Elevated Lifestyle Section */}
      <section style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        backgroundColor: '#ffffff',
        minHeight: '340px'
      }}>
        {/* Left: Text */}
        <div style={{
          flex: '1 1 45%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '3rem 5%',
          backgroundColor: '#ffffff'
        }}>
          <div>
            <p style={{
              fontSize: 'clamp(3.75rem, 7.5vw, 6rem)',
              fontWeight: 400,
              color: '#000000',
              lineHeight: 1.1,
              margin: 0,
              fontFamily: 'Inter, system-ui, sans-serif',
              letterSpacing: '-0.02em'
            }}>
              Elevated<span style={{
                display: 'block',
                fontFamily: "'Great Vibes', cursive",
                fontWeight: 400,
                fontStyle: 'normal',
                letterSpacing: '0.01em'
              }}>lifestyle</span>
            </p>
          </div>
        </div>

        {/* Right: Office/Atrium Image */}
        <div style={{
          flex: '1 1 55%',
          minHeight: '300px',
          overflow: 'hidden'
        }}>
          <img
            src="https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_1200,c_limit/v1783710469/zawr/assets/elevated-lifestyle.png"
            alt="Elevated lifestyle at Zawr"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
           loading="lazy" decoding="async" />
        </div>
      </section>

      {/* Respect to Talent Section */}
      <section style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        backgroundColor: '#ffffff',
        minHeight: '340px'
      }}>
        {/* Left: Image */}
        <div style={{
          flex: '1 1 55%',
          minHeight: '300px',
          overflow: 'hidden'
        }}>
          <img
            src="https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_1200,c_limit/v1783710547/zawr/assets/respect-to-talent.png"
            alt="Respect to Talent at Zawr"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
           loading="lazy" decoding="async" />
        </div>

        {/* Right: Text */}
        <div style={{
          flex: '1 1 45%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '3rem 5%',
          backgroundColor: '#ffffff'
        }}>
          <div>
            <p style={{
              fontSize: 'clamp(3.75rem, 7.5vw, 6rem)',
              fontWeight: 400,
              color: '#000000',
              lineHeight: 1.1,
              margin: 0,
              fontFamily: 'Inter, system-ui, sans-serif',
              letterSpacing: '-0.02em'
            }}>
              Respect to<span style={{
                display: 'block',
                fontFamily: "'Great Vibes', cursive",
                fontWeight: 400,
                fontStyle: 'normal',
                letterSpacing: '0.01em'
              }}>Talent</span>
            </p>
          </div>
        </div>
      </section>

      {/* Equal Growth Section */}
      <section style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        backgroundColor: '#ffffff',
        minHeight: '340px'
      }}>
        {/* Left: Text */}
        <div style={{
          flex: '1 1 45%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '3rem 5%',
          backgroundColor: '#ffffff'
        }}>
          <div>
            <p style={{
              fontSize: 'clamp(3.75rem, 7.5vw, 6rem)',
              fontWeight: 400,
              color: '#000000',
              lineHeight: 1.1,
              margin: 0,
              fontFamily: 'Inter, system-ui, sans-serif',
              letterSpacing: '-0.02em'
            }}>
              Equal<span style={{
                display: 'block',
                fontFamily: "'Great Vibes', cursive",
                fontWeight: 400,
                fontStyle: 'normal',
                letterSpacing: '0.01em'
              }}>Growth</span>
            </p>
          </div>
        </div>

        {/* Right: Image */}
        <div style={{
          flex: '1 1 55%',
          minHeight: '300px',
          overflow: 'hidden'
        }}>
          <img
            src="https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_1200,c_limit/v1783710476/zawr/assets/equal-growth.png"
            alt="Equal Growth at Zawr"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
           loading="lazy" decoding="async" />
        </div>
      </section>

      {/* This is Zawr — Full Width Banner */}
      <section style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden'
      }}>
        {/* Full natural-size image — no cropping */}
        <img
          src="https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_1200,c_limit/v1783710557/zawr/assets/this-is-zawr.png"
          alt="This is Zawr"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block'
          }}
         loading="lazy" decoding="async" />
        {/* Dark overlay */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.25)',
          zIndex: 1
        }}></div>
        {/* Centered Text */}
        <div style={{
          position: 'absolute',
          top: '25%',
          left: '50%',
          transform: 'translate(-50%, -25%)',
          zIndex: 2,
          textAlign: 'center',
          width: '100%',
          padding: '0 2rem'
        }}>
          <h2 style={{
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            fontWeight: 400,
            color: '#ffffff',
            margin: '0 0 1rem 0',
            letterSpacing: '-0.02em',
            fontFamily: 'Inter, system-ui, sans-serif',
            lineHeight: 1.05
          }}>
            This is Zawr
          </h2>
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.35rem)',
            color: '#ffffff',
            margin: 0,
            fontWeight: 300,
            fontFamily: 'Inter, system-ui, sans-serif',
            opacity: 0.95,
            lineHeight: 1.5
          }}>
            Place where curiosity driven creatures come to work.
          </p>
        </div>
      </section>

    </div>
  );
}

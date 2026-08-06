'use client';

import React from 'react';

export default function AboutHero() {
  return (
    <section
      style={{
        width: '100%',
        position: 'relative',
        height: 'clamp(500px, 80vh, 850px)',
        backgroundColor: '#090d16',
        overflow: 'hidden',
      }}
    >
      {/* Full Hero Edge-to-Edge Image */}
      <img
        src="/assets/aboutus-hero.png"
        alt="Zawr Industries Corporate Headquarters"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />
    </section>
  );
}

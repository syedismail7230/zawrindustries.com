'use client';

import React from 'react';

export default function RealEstate3DGrassHero() {
  return (
    <section style={{
      position: 'relative',
      width: '100vw',
      left: '50%',
      right: '50%',
      marginLeft: '-50vw',
      marginRight: '-50vw',
      height: 'clamp(450px, 60vw, 850px)',
      backgroundColor: '#000000',
      overflow: 'hidden',
    }}>
      <img
        src="/assets/estate-hero.png"
        alt="Real Estate Hero"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          display: 'block',
        }}
        loading="eager"
        fetchPriority="high"
      />
    </section>
  );
}

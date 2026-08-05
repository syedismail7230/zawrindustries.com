'use client';

import React, { useState } from 'react';

export default function RealEstate3DGrassHero() {
  const [imgSrc, setImgSrc] = useState(
    'https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto:good,w_1600,c_limit,dpr_auto/v1783710572/zawr/images/estate-hero.png'
  );

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
        src={imgSrc}
        srcSet="https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto:good,w_600,c_limit,dpr_auto/v1783710572/zawr/images/estate-hero.png 600w, https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto:good,w_1000,c_limit,dpr_auto/v1783710572/zawr/images/estate-hero.png 1000w, https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto:good,w_1600,c_limit,dpr_auto/v1783710572/zawr/images/estate-hero.png 1600w"
        sizes="100vw"
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
        onError={() => {
          // Fallback to local image path if Cloudinary variant fails
          setImgSrc('/images/estate-hero.png');
        }}
      />
    </section>
  );
}

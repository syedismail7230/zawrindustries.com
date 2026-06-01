import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable Brotli / Gzip compression of text assets
  compress: true,

  // Disable X-Powered-By header for improved security & performance
  poweredByHeader: false,

  // Support serving JS/CSS static chunks directly from a CDN if desired
  assetPrefix: process.env.NEXT_PUBLIC_CDN_URL || undefined,

  // Premium Next.js Image CDN Optimizations
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // Instructs CDN & browser to cache optimized images for 1 year
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Setup aggressive Edge CDN & client browser caching for all public media/assets
  async headers() {
    return [
      {
        // Matches all static media, images, video formats, PDFs, and webfonts
        source: '/:all*(svg|png|jpg|jpeg|webp|avif|ico|gif|woff2|woff|ttf|otf|mp4|webm|pdf)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=60, immutable',
          },
        ],
      },
      {
        // Specific caching fallback rule for dedicated assets or docs directories
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, s-maxage=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

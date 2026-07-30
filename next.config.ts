import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Silence the Turbopack root warning
  turbopack: {},

  // Enable Brotli / Gzip compression of text assets
  compress: true,

  // Disable X-Powered-By header for improved security & performance
  poweredByHeader: false,

  // Support serving JS/CSS static chunks directly from a CDN if desired
  assetPrefix: process.env.NEXT_PUBLIC_CDN_URL || undefined,

  // Premium Next.js Image CDN Optimizations
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 year
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      }
    ],
  },

  // Aggressive Edge CDN & browser caching headers
  async headers() {
    return [
      {
        source: '/:all*(svg|png|jpg|jpeg|webp|avif|ico|gif|woff2|woff|ttf|otf|mp4|webm|pdf)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=60, immutable',
          },
        ],
      },
      {
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, s-maxage=31536000, immutable',
          },
        ],
      },
      {
        // Service Worker must never be cached by the browser
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

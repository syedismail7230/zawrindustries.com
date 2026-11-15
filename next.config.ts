import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Fix: Tell Next.js/Turbopack the exact workspace root to avoid
  // picking up the wrong package-lock.json from C:\Users\syedi\
  turbopack: {
    root: path.resolve(__dirname),
  },


  // Exclude heavy media, 3D models, and raw assets from serverless function bundles
  outputFileTracingExcludes: {
    '*': [
      './public/assets/**/*',
      './public/Blog-assets/**/*',
      './Blog-assets/**/*',
      './blog-assets/**/*',
      './**/*.glb',
      './**/*.gif',
      './**/*.mp4',
    ],
  },

  // Strict URL canonicalization: enforce non-trailing slash across all pages
  trailingSlash: false,

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
        source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: blob: https:; font-src 'self' data: https:; connect-src 'self' blob: data: https: wss: ws:; frame-src 'self' https: blob: data:; worker-src 'self' blob:; frame-ancestors 'self' https:;",
          },
        ],
      },
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

  async redirects() {
    return [
      {
        source: '/newsroom/press-releases',
        destination: '/newsroom/press-release',
        permanent: true,
      },
      {
        source: '/newsroom/press-releases/:slug*',
        destination: '/newsroom/press-release/:slug*',
        permanent: true,
      },
      {
        source: '/investors/shares',
        destination: '/investors',
        permanent: true,
      },
      {
        source: '/investors/subsidiaries',
        destination: '/investors#subsidiaries-associates',
        permanent: true,
      },
      {
        source: '/investors/shareholders-info',
        destination: '/contact/client-relations',
        permanent: true,
      },
      {
        source: '/investors/resource-centre',
        destination: '/investors#events-presentations',
        permanent: true,
      },
      {
        source: '/investors/notice-of-forfeiture',
        destination: '/notices',
        permanent: true,
      },
      {
        source: '/platforms',
        destination: '/industries/it-service',
        permanent: true,
      },
      {
        source: '/privacy-policy',
        destination: '/legal/privacy-policy',
        permanent: true,
      },
      {
        source: '/terms',
        destination: '/legal/terms',
        permanent: true,
      },
      {
        source: '/terms-of-service',
        destination: '/legal/terms',
        permanent: true,
      },
      {
        source: '/terms-and-conditions',
        destination: '/legal/terms',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

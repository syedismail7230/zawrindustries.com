import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/private/'],
      },
      {
        userAgent: ['Googlebot', 'Bingbot', 'Yandex', 'Baiduspider', 'DuckDuckBot', 'Slurp'],
        allow: '/',
      }
    ],
    sitemap: [
      'https://zawrindustries.com/sitemap.xml',
    ],
    host: 'https://zawrindustries.com',
  };
}


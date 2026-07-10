import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: ['*', 'GPTBot', 'ClaudeBot', 'Google-Extended', 'PerplexityBot', 'Applebot-Extended', 'cohere-ai'],
        allow: '/',
        disallow: ['/private/', '/api/'],
      }
    ],
    sitemap: [
      'https://zawrindustries.com/sitemap.xml',
      'https://zawrindustries.com/sitemap-news.xml'
    ],
  };
}

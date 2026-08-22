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
        // Traditional Search Engine Crawlers
        userAgent: [
          'Googlebot',
          'Bingbot',
          'Applebot',
          'Yandex',
          'Baiduspider',
          'DuckDuckBot',
          'Slurp',
          'facebookexternalhit',
          'LinkedInBot',
        ],
        allow: '/',
        disallow: ['/api/', '/_next/', '/private/'],
      },
      {
        // Generative Engine & AI LLM Crawlers (GEO / AEO)
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'PerplexityBot',
          'ClaudeBot',
          'Claude-Web',
          'anthropic-ai',
          'Google-Extended',
          'GoogleOther',
          'Applebot-Extended',
          'Amazonbot',
          'Cohere-ai',
          'Meta-ExternalAgent',
          'Bytespider',
          'OAI-SearchBot',
          'Diffbot'
        ],
        allow: '/',
        disallow: ['/api/', '/_next/', '/private/'],
      },
    ],
    sitemap: [
      'https://zawrindustries.com/sitemap.xml',
    ],
    host: 'https://zawrindustries.com',
  };
}

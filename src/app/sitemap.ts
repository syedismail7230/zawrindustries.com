import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://zawrindustries.com';
  
  // Base routes that always exist
  const routes = [
    '',
    '/about/history',
    '/about/board',
    '/about/awards',
    '/about/impact',
    '/about/blog',
    '/about/values',
    '/about/vision',
    '/about/mission',
    '/about/csr',
    '/about/innovation',
    '/about/code-of-conduct',
    '/sustainability/environment',
    '/sustainability/empowerment',
    '/sustainability/health',
    '/sustainability/education',
    '/industries/it-service',
    '/industries/transport-and-logistics',
    '/industries/manufacturing',
    '/industries/estate',
    '/industries/healthcare',
    '/careers/working-at-zawr',
    '/careers/equal-opportunity',
    '/careers',
    '/newsroom/news-media',
    '/newsroom/press-release',
    '/newsroom/notifications',
    '/newsroom/media-kit',
    '/newsroom/events',
    '/investors/financial-reporting',
    '/investors/shares',
    '/investors/events',
    '/investors/subsidiaries',
    '/investors/shareholders-info',
    '/investors/resource-centre',
    '/investors/notice-of-forfeiture',
    '/contact/client-relations',
    '/contact/sponsorship',
    '/contact/public-relations',
    '/legal/privacy-policy',
    '/legal/terms',
    '/legal/cookie-policy',
    '/legal/disclaimer',
    '/legal/refund-policy',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
}

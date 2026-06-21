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
    '/industries/it-service/ai-data-analytics',
    '/industries/it-service/cloud',
    '/industries/it-service/cybersecurity',
    '/industries/it-service/network-solutions',
    '/industries/it-service/industrial-autonomy-and-engineering',
    '/industries/it-service/enterprise-solutions',
    '/industries/it-service/consulting',
    '/industries/it-service/software-development',
    '/industries/it-service/cognitive-business-operations',
    '/industries/it-service/web-development',
    '/industries/it-service/application-development',
    '/industries/it-service/startup-mvp',
    '/industries/it-service/crm-solution',
    '/industries/it-service/cxm-solution',
    '/industries/it-service/digital-marketing',
    '/industries/it-service/blockchain',
    '/industries/it-service/iot',
    '/industries/it-service/devops',
    '/industries/it-service/unit-test',
    '/industries/it-service/quality-assurance',
    '/industries/it-service/workplace-transformation',
    '/industries/it-service/process-automation',
    '/industries/it-service/business-process-management',
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

  // Dynamically append blog articles
  let blogRoutes: any[] = [];
  try {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(process.cwd(), 'public/data/blogs.json');
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf8');
      const blogs = JSON.parse(fileData);
      blogRoutes = blogs.map((b: any) => ({
        url: `${baseUrl}/about/blog/${b.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));
    }
  } catch (e) {
    console.error('Error appending blogs to sitemap:', e);
  }

  return [...routes, ...blogRoutes];
}

import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://zawrindustries.com';
  
  // Base routes that always exist
  const routes = [
    '',
    '/about',
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
    '/pronunciation',
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
    '/industries/energy',
    '/industries/holding',
    '/industries/healthcare',
    '/industries/fmcg',
    '/careers',
    '/careers/working-at-zawr',
    '/careers/equal-opportunity',
    '/newsroom',
    '/newsroom/press-release',
    '/newsroom/notifications',
    '/newsroom/media-kit',
    '/newsroom/events',
    '/contact',
    '/contact/client-relations',
    '/contact/partner',
    '/contact/public-relations',
    '/contact/sponsorship',
    '/customer-relations',
    '/investors',
    '/investors/financial-report',
    '/investors/interest',
    '/legal/privacy-policy',
    '/legal-disclaimer',
    '/notices',
    '/fraud-alert',
    '/sitemap',
    '/legal/terms',
    '/legal/cookie-policy',
    '/legal/refund-policy',
  ].map((route) => {
    let priority = 0.7;
    let changeFrequency: 'daily' | 'weekly' | 'monthly' = 'weekly';

    if (route === '') {
      priority = 1.0;
      changeFrequency = 'daily';
    } else if (['/industries/it-service', '/industries/manufacturing', '/industries/transport-and-logistics', '/industries/estate', '/industries/energy', '/industries/holding'].includes(route)) {
      priority = 0.99;
      changeFrequency = 'daily';
    } else if (['/about', '/platforms', '/careers', '/investors', '/newsroom', '/contact'].includes(route)) {
      priority = 0.8;
      changeFrequency = 'weekly';
    } else if (['/pronunciation'].includes(route)) {
      priority = 0.7;
      changeFrequency = 'monthly';
    } else if (['/sustainability/empowerment', '/sustainability/health', '/sustainability/education', '/sustainability/environment', '/newsroom/media-kit', '/fraud-alert', '/notices', '/contact/public-relations', '/contact/sponsorship', '/contact/partner', '/contact/client-relations'].includes(route)) {
      priority = 0.25;
      changeFrequency = 'monthly';
    }
    
    return {
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    };
  });

  // Dynamically append blog, press release, notification, and notice articles
  let dynamicRoutes: any[] = [];
  try {
    const fs = require('fs');
    const path = require('path');

    // Helper to parse dates safely
    const parseSafeDate = (dateVal: any): Date => {
      if (!dateVal) return new Date();
      if (typeof dateVal === 'string') {
        const cleanStr = dateVal.replace(/(\d+)(st|nd|rd|th)/, '$1');
        const parsed = new Date(cleanStr);
        return isNaN(parsed.getTime()) ? new Date() : parsed;
      }
      return new Date(dateVal);
    };

    // 1. Appending blogs (Published only, with authoritative lastmod and high priority)
    const blogsPath = path.join(process.cwd(), 'public/data/blogs.json');
    if (fs.existsSync(blogsPath)) {
      const fileData = fs.readFileSync(blogsPath, 'utf8');
      const blogs = JSON.parse(fileData);
      const publishedBlogs = blogs.filter((b: any) => b.status !== 'draft' && b.status !== 'held' && b.status !== 'pending_approval');
      dynamicRoutes = [...dynamicRoutes, ...publishedBlogs.map((b: any) => ({
        url: `${baseUrl}/about/blog/${b.slug}`,
        lastModified: parseSafeDate(b.createdAt || b.date),
        changeFrequency: 'weekly' as const,
        priority: 0.85,
      }))];
    }

    // 2. Appending press releases
    const pressPath = path.join(process.cwd(), 'public/data/press-releases.json');
    if (fs.existsSync(pressPath)) {
      const fileData = fs.readFileSync(pressPath, 'utf8');
      const releases = JSON.parse(fileData);
      dynamicRoutes = [...dynamicRoutes, ...releases.map((r: any) => ({
        url: `${baseUrl}/newsroom/press-release/${r.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))];
    }

    // 3. Appending notifications
    const notifPath = path.join(process.cwd(), 'public/data/notifications.json');
    if (fs.existsSync(notifPath)) {
      const fileData = fs.readFileSync(notifPath, 'utf8');
      const notifications = JSON.parse(fileData);
      dynamicRoutes = [...dynamicRoutes, ...notifications.map((n: any) => ({
        url: `${baseUrl}/newsroom/notifications/${n.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))];
    }

    // 4. Appending public notices
    const noticesPath = path.join(process.cwd(), 'public/data/notices.json');
    if (fs.existsSync(noticesPath)) {
      const fileData = fs.readFileSync(noticesPath, 'utf8');
      const notices = JSON.parse(fileData);
      dynamicRoutes = [...dynamicRoutes, ...notices.map((n: any) => ({
        url: `${baseUrl}/notices/${n.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))];
    }

  } catch (e) {
    console.error('Error appending dynamic routes to sitemap:', e);
  }

  return [...routes, ...dynamicRoutes];
}


import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const baseUrl = 'https://zawrindustries.com';
  let articles: any[] = [];

  // Helper to parse date containing ordinals like "27th May"
  const parseCleanDate = (dateStr: string): Date => {
    if (!dateStr) return new Date();
    const cleanStr = dateStr.replace(/(\d+)(st|nd|rd|th)/, '$1');
    const d = new Date(cleanStr);
    return isNaN(d.getTime()) ? new Date() : d;
  };

  // 1. Fetch articles from press-releases.json (Newsroom Press Releases)
  try {
    const filePath = path.join(process.cwd(), 'public/data/press-releases.json');
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf8');
      const releases = JSON.parse(fileData);
      articles = [...articles, ...releases.map((r: any) => ({
        url: `${baseUrl}/newsroom/press-release/${r.slug}`,
        title: r.title,
        dateParsed: parseCleanDate(r.date),
        dateRaw: r.date,
        source: 'Press Release'
      }))];
    }
  } catch (e) {
    console.error('Error reading press releases for sitemap:', e);
  }

  // 2. Fetch articles from notifications.json (Newsroom Announcements)
  try {
    const filePath = path.join(process.cwd(), 'public/data/notifications.json');
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf8');
      const notifications = JSON.parse(fileData);
      articles = [...articles, ...notifications.map((n: any) => ({
        url: `${baseUrl}/newsroom/notifications/${n.slug}`,
        title: n.title,
        dateParsed: parseCleanDate(n.date),
        dateRaw: n.date,
        source: 'Announcement'
      }))];
    }
  } catch (e) {
    console.error('Error reading notifications for sitemap:', e);
  }

  // 3. Fetch articles from blogs.json (Blogs)
  try {
    const filePath = path.join(process.cwd(), 'public/data/blogs.json');
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf8');
      const blogs = JSON.parse(fileData);
      articles = [...articles, ...blogs.map((b: any) => ({
        url: `${baseUrl}/about/blog/${b.slug}`,
        title: b.title,
        dateParsed: parseCleanDate(b.date),
        dateRaw: b.date,
        source: 'Blog'
      }))];
    }
  } catch (e) {
    console.error('Error reading blogs for news sitemap:', e);
  }

  // Sort articles: newest first
  articles.sort((a, b) => b.dateParsed.getTime() - a.dateParsed.getTime());

  // Filter to show latest 20 articles
  const recentArticles = articles.slice(0, 20);

  // Build the XML response
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${recentArticles.map(art => `
  <url>
    <loc>${escapeXml(art.url)}</loc>
    <news:news>
      <news:publication>
        <news:name>Zawr Industries Newsroom</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${art.dateParsed.toISOString()}</news:publication_date>
      <news:title>${escapeXml(art.title)}</news:title>
    </news:news>
  </url>
  `).join('')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  });
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const baseUrl = 'https://zawrindustries.com';
  let articles: any[] = [];

  // 1. Fetch articles from blogs.json
  try {
    const filePath = path.join(process.cwd(), 'public/data/blogs.json');
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf8');
      const blogs = JSON.parse(fileData);
      articles = [...articles, ...blogs.map((b: any) => ({
        url: `${baseUrl}/about/blog/${b.slug}`,
        title: b.title,
        date: b.date || new Date().toISOString(),
        category: b.category || 'News'
      }))];
    }
  } catch (e) {
    console.error('Error reading blogs for news sitemap:', e);
  }

  // 2. Fetch press releases or other recent news if available
  // We can add them here as well.

  // Filter or sort to show latest articles (Google News prefers recent 48 hours, but we list recent articles to guarantee coverage)
  const recentArticles = articles.slice(0, 10);

  // Build the XML response
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${recentArticles.map(art => `
  <url>
    <loc>${escapeXml(art.url)}</loc>
    <news:news>
      <news:publication>
        <news:name>Zawr Industries</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${formatIsoDate(art.date)}</news:publication_date>
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

function formatIsoDate(dateStr: string): string {
  try {
    // Check if it is a formatted string like "12 January 2025" or ISO
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }
  } catch (e) {}
  return new Date().toISOString();
}

import { NextResponse } from 'next/server';
import { getExistingBlogs } from '@/lib/ai-blog-engine';
import { notifySearchEngines, submitAllPublishedBlogsToIndexNow, INDEXNOW_KEY, SITE_HOST } from '@/lib/search-indexing';

export async function GET() {
  const blogs = await getExistingBlogs();
  const publishedSlugs = blogs.filter((b) => b.status !== 'draft' && b.status !== 'held' && b.status !== 'pending_approval').map((b) => b.slug);

  return NextResponse.json({
    status: 'active',
    host: SITE_HOST,
    indexNowKey: INDEXNOW_KEY,
    keyVerificationUrl: `https://${SITE_HOST}/${INDEXNOW_KEY}.txt`,
    publishedBlogsCount: publishedSlugs.length,
    sitemaps: [
      `https://${SITE_HOST}/sitemap.xml`,
      `https://${SITE_HOST}/sitemap-news.xml`,
    ],
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const blogs = await getExistingBlogs();
    const published = blogs.filter((b) => b.status !== 'draft' && b.status !== 'held' && b.status !== 'pending_approval');

    if (body.slug) {
      const blogUrl = `https://${SITE_HOST}/about/blog/${body.slug}`;
      const results = await notifySearchEngines(blogUrl, body.slug);
      return NextResponse.json({ success: true, target: blogUrl, results });
    }

    // Submit all published blogs
    const slugs = published.map((b) => b.slug);
    const result = await submitAllPublishedBlogsToIndexNow(slugs);

    return NextResponse.json({
      success: true,
      publishedCount: slugs.length,
      result,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

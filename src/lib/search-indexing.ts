/**
 * Search Engine Instant Auto-Indexing & Ping Engine
 * Supports:
 * 1. IndexNow API Protocol (Microsoft Bing, Yandex, Seznam, Naver)
 * 2. Google Sitemap Ping API
 * 3. Bing Sitemap Ping API
 * 4. Google News Sitemap Ping API
 */

export const INDEXNOW_KEY = '8f4b2c1e9a7d3b5e8c1a2b3c4d5e6f7a';
export const SITE_HOST = 'www.zawrindustries.com';
export const BASE_URL = `https://${SITE_HOST}`;

export interface IndexingResult {
  engine: string;
  success: boolean;
  statusCode?: number;
  message?: string;
}

/**
 * Pings all major search engines (Google, Bing, IndexNow network) immediately upon blog publication.
 */
export async function notifySearchEngines(blogUrl: string, slug?: string): Promise<IndexingResult[]> {
  const results: IndexingResult[] = [];
  const targetUrls = Array.from(
    new Set([
      blogUrl,
      `${BASE_URL}/about/blog`,
      `${BASE_URL}/sitemap.xml`,
      `${BASE_URL}/sitemap-news.xml`,
    ])
  );

  // 1. Submit to IndexNow (Bing, Yandex, Seznam, Naver)
  const indexNowPayload = {
    host: SITE_HOST,
    key: INDEXNOW_KEY,
    keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: targetUrls,
  };

  const indexNowEndpoints = [
    { name: 'IndexNow Global', url: 'https://api.indexnow.org/indexnow' },
    { name: 'Bing IndexNow', url: 'https://www.bing.com/indexnow' },
    { name: 'Yandex IndexNow', url: 'https://yandex.com/indexnow' },
  ];

  for (const ep of indexNowEndpoints) {
    try {
      const res = await fetch(ep.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(indexNowPayload),
        signal: AbortSignal.timeout(8000),
      });

      // 200 = OK, 202 = Accepted
      const ok = res.status === 200 || res.status === 202;
      results.push({
        engine: ep.name,
        success: ok,
        statusCode: res.status,
        message: ok ? 'Submitted successfully to index queue' : `Returned status ${res.status}`,
      });
    } catch (err: any) {
      results.push({
        engine: ep.name,
        success: false,
        message: err.message || 'Timeout / network error',
      });
    }
  }

  // 2. Google Sitemap Pings
  const sitemapsToPing = [
    `${BASE_URL}/sitemap.xml`,
    `${BASE_URL}/sitemap-news.xml`,
  ];

  for (const sm of sitemapsToPing) {
    try {
      const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sm)}`;
      const res = await fetch(googlePingUrl, {
        method: 'GET',
        signal: AbortSignal.timeout(8000),
      });

      results.push({
        engine: `Google Ping (${sm.includes('news') ? 'News' : 'Standard'})`,
        success: res.ok,
        statusCode: res.status,
        message: res.ok ? 'Sitemap ping acknowledged by Google' : `Status ${res.status}`,
      });
    } catch (err: any) {
      results.push({
        engine: `Google Ping (${sm.includes('news') ? 'News' : 'Standard'})`,
        success: false,
        message: err.message || 'Network error',
      });
    }
  }

  // 3. Bing Sitemap Ping
  try {
    const bingPingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(`${BASE_URL}/sitemap.xml`)}`;
    const res = await fetch(bingPingUrl, {
      method: 'GET',
      signal: AbortSignal.timeout(8000),
    });

    results.push({
      engine: 'Bing Sitemap Ping',
      success: res.ok,
      statusCode: res.status,
      message: res.ok ? 'Sitemap ping acknowledged by Bing' : `Status ${res.status}`,
    });
  } catch (err: any) {
    results.push({
      engine: 'Bing Sitemap Ping',
      success: false,
      message: err.message || 'Network error',
    });
  }

  console.log(`[Search Indexing] Auto-ping executed for ${blogUrl}:`, results.map(r => `${r.engine}: ${r.success ? 'OK' : 'FAIL'}`).join(' | '));
  return results;
}

/**
 * Batch indexing for all live published blogs
 */
export async function submitAllPublishedBlogsToIndexNow(slugs: string[]): Promise<IndexingResult> {
  const urlList = [
    `${BASE_URL}/about/blog`,
    `${BASE_URL}/sitemap.xml`,
    `${BASE_URL}/sitemap-news.xml`,
    ...slugs.map((s) => `${BASE_URL}/about/blog/${s}`),
  ];

  const payload = {
    host: SITE_HOST,
    key: INDEXNOW_KEY,
    keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
    urlList,
  };

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    });

    const ok = res.status === 200 || res.status === 202;
    return {
      engine: 'IndexNow Batch Submission',
      success: ok,
      statusCode: res.status,
      message: ok ? `Successfully submitted ${urlList.length} URLs` : `Status ${res.status}`,
    };
  } catch (err: any) {
    return {
      engine: 'IndexNow Batch Submission',
      success: false,
      message: err.message || 'Network error',
    };
  }
}

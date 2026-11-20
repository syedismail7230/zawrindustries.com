import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { spawn } from 'child_process';
import http from 'http';

const PORT = 3005;
const BASE_URL = `http://localhost:${PORT}`;

const testResults = [];

function recordTest(name, passed, details = '') {
  testResults.push({ name, passed, details });
  const mark = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${mark} - ${name} ${details ? '(' + details + ')' : ''}`);
}

async function fetchUrl(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, options);
  const text = await res.text();
  return { status: res.status, headers: res.headers, text };
}

async function waitForServer(retries = 30) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(`${BASE_URL}/robots.txt`);
      if (res.ok) return true;
    } catch (e) {
      // server not ready yet
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

async function runUnitAndIntegrationSuite() {
  console.log('====================================================');
  console.log('   ZAWR INDUSTRIES - FULL QA & UNIT TEST SUITE      ');
  console.log('====================================================\n');

  // 1. UNIT TEST: Supabase Client & Database Connection
  try {
    const { getSupabase } = await import('../src/lib/supabase.ts');
    const sb = getSupabase();
    if (!sb) {
      recordTest('UT-01: Supabase Client Initialization', false, 'Missing or placeholder credentials');
    } else {
      const { data, error } = await sb.from('blogs').select('id, slug, title, status').limit(5);
      if (error) {
        recordTest('UT-01: Supabase Database Query', false, error.message);
      } else {
        recordTest('UT-01: Supabase Database Connection & Query', true, `Retrieved ${data.length} blogs from public.blogs`);
      }
    }
  } catch (err) {
    recordTest('UT-01: Supabase Database Connection', false, err.message);
  }

  // 2. UNIT TEST: Blog Engine getExistingBlogs()
  try {
    const { getExistingBlogs } = await import('../src/lib/ai-blog-engine.ts');
    const blogs = await getExistingBlogs();
    if (blogs && blogs.length > 0) {
      recordTest('UT-02: Blog Engine getExistingBlogs()', true, `Loaded ${blogs.length} dispatches seamlessly`);
    } else {
      recordTest('UT-02: Blog Engine getExistingBlogs()', false, 'Returned 0 blogs');
    }
  } catch (err) {
    recordTest('UT-02: Blog Engine getExistingBlogs()', false, err.message);
  }

  // 3. UNIT TEST: Search Indexing Key Verification
  try {
    const { INDEXNOW_KEY, SITE_HOST } = await import('../src/lib/search-indexing.ts');
    const valid = INDEXNOW_KEY === '8f4b2c1e9a7d3b5e8c1a2b3c4d5e6f7a' && SITE_HOST === 'www.zawrindustries.com';
    recordTest('UT-03: Search Indexing Configuration Constants', valid, `Key: ${INDEXNOW_KEY.slice(0, 8)}... | Host: ${SITE_HOST}`);
  } catch (err) {
    recordTest('UT-03: Search Indexing Configuration Constants', false, err.message);
  }

  console.log('\n--- Starting Production Test Server on Port ' + PORT + ' ---');
  const serverProcess = spawn('npx', ['next', 'start', '-p', String(PORT)], {
    stdio: 'ignore',
    shell: true,
  });

  const serverReady = await waitForServer();
  if (!serverReady) {
    console.error('❌ Failed to start Next.js test server on port ' + PORT);
    serverProcess.kill();
    process.exit(1);
  }
  console.log('✅ Next.js production test server is healthy on ' + BASE_URL + '\n');

  try {
    // 4. QA TEST: IndexNow Key Verification Endpoints
    const keyRes1 = await fetchUrl('/8f4b2c1e9a7d3b5e8c1a2b3c4d5e6f7a.txt');
    recordTest(
      'QA-01: /8f4b2c1e9a7d3b5e8c1a2b3c4d5e6f7a.txt Endpoint',
      keyRes1.status === 200 && keyRes1.text.trim() === '8f4b2c1e9a7d3b5e8c1a2b3c4d5e6f7a',
      `Status: ${keyRes1.status}, Key: ${keyRes1.text.trim().slice(0, 8)}...`
    );

    const keyRes2 = await fetchUrl('/indexnow-key.txt');
    recordTest(
      'QA-02: /indexnow-key.txt Endpoint',
      keyRes2.status === 200 && keyRes2.text.trim() === '8f4b2c1e9a7d3b5e8c1a2b3c4d5e6f7a',
      `Status: ${keyRes2.status}`
    );

    // 5. QA TEST: robots.txt Configuration
    const robotsRes = await fetchUrl('/robots.txt');
    const hasSitemap = robotsRes.text.includes('https://zawrindustries.com/sitemap.xml');
    const hasNewsSitemap = robotsRes.text.includes('https://zawrindustries.com/sitemap-news.xml');
    const hasDisallow = robotsRes.text.includes('Disallow: /api/');
    recordTest(
      'QA-03: robots.txt Crawler Governance & Sitemaps',
      robotsRes.status === 200 && hasSitemap && hasNewsSitemap && hasDisallow,
      `Status: ${robotsRes.status}, Standard Sitemap: ${hasSitemap ? 'Yes' : 'No'}, News Sitemap: ${hasNewsSitemap ? 'Yes' : 'No'}`
    );

    // 6. QA TEST: Dynamic XML Sitemap (/sitemap.xml)
    const sitemapRes = await fetchUrl('/sitemap.xml');
    const hasBlogUrls = sitemapRes.text.includes('/about/blog/');
    const hasLastMod = sitemapRes.text.includes('<lastmod>');
    recordTest(
      'QA-04: /sitemap.xml Dynamic Blog Discovery',
      sitemapRes.status === 200 && hasBlogUrls && hasLastMod,
      `Status: ${sitemapRes.status}, Includes /about/blog/*: ${hasBlogUrls ? 'Yes' : 'No'}`
    );

    // 7. QA TEST: Google News XML Sitemap (/sitemap-news.xml)
    const newsSitemapRes = await fetchUrl('/sitemap-news.xml');
    const hasNewsTag = newsSitemapRes.text.includes('<news:news>');
    const hasNewsTitle = newsSitemapRes.text.includes('<news:title>');
    recordTest(
      'QA-05: /sitemap-news.xml Google News Schema',
      newsSitemapRes.status === 200 && hasNewsTag && hasNewsTitle,
      `Status: ${newsSitemapRes.status}, Google News Tags: ${hasNewsTag ? 'Yes' : 'No'}`
    );

    // 8. QA TEST: Server-Side Rendered (SSR) Blog Listing (/about/blog)
    const blogIndexRes = await fetchUrl('/about/blog');
    const hasServerLinks = blogIndexRes.text.includes('href="/about/blog/');
    const hasJsonLdBlog = blogIndexRes.text.includes('"@type":"Blog"');
    recordTest(
      'QA-06: /about/blog Full Server-Side Rendering (SSR)',
      blogIndexRes.status === 200 && hasServerLinks && hasJsonLdBlog,
      `Status: ${blogIndexRes.status}, Raw Server Links Present: ${hasServerLinks ? 'Yes' : 'No'}, Schema.org Graph: ${hasJsonLdBlog ? 'Yes' : 'No'}`
    );

    // 9. QA TEST: Blog Detail Page & Deep Structured Data (/about/blog/[slug])
    const blogDetailRes = await fetchUrl('/about/blog/strategic-cloud-engineering-enterprise-it');
    const hasTitle = blogDetailRes.text.includes('<title>Strategic Cloud Engineering');
    const hasCanonical = blogDetailRes.text.includes('rel="canonical"') && blogDetailRes.text.includes('/about/blog/strategic-cloud-engineering-enterprise-it');
    const hasTechArticleSchema = blogDetailRes.text.includes('TechArticle') || blogDetailRes.text.includes('BlogPosting');
    const hasBreadcrumbSchema = blogDetailRes.text.includes('BreadcrumbList');
    recordTest(
      'QA-07: /about/blog/[slug] On-Page SEO & Rich Snippets',
      blogDetailRes.status === 200 && hasTitle && hasCanonical && hasTechArticleSchema && hasBreadcrumbSchema,
      `Status: ${blogDetailRes.status}, Canonical: ${hasCanonical ? 'OK' : 'FAIL'}, Schema.org: ${hasTechArticleSchema ? 'OK' : 'FAIL'}`
    );

    // 10. QA TEST: /api/blogs JSON Endpoint
    const apiBlogsRes = await fetchUrl('/api/blogs');
    let blogList = [];
    try { blogList = JSON.parse(apiBlogsRes.text); } catch (e) {}
    recordTest(
      'QA-08: /api/blogs JSON Pipeline Endpoint',
      apiBlogsRes.status === 200 && Array.isArray(blogList) && blogList.length > 0,
      `Status: ${apiBlogsRes.status}, Dispatches: ${blogList.length}`
    );

    // 11. QA TEST: /api/blogs/feedback Voting & Read-Only Protection
    const feedbackGetRes = await fetchUrl('/api/blogs/feedback?slug=strategic-cloud-engineering-enterprise-it');
    const hasVotes = feedbackGetRes.text.includes('helpfulness');
    recordTest(
      'QA-09: /api/blogs/feedback Read Telemetry',
      feedbackGetRes.status === 200 && hasVotes,
      `Status: ${feedbackGetRes.status}, Returned helpfulness object: ${hasVotes ? 'Yes' : 'No'}`
    );

    const feedbackPostRes = await fetchUrl('/api/blogs/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: 'strategic-cloud-engineering-enterprise-it',
        vote: 'yes',
      }),
    });
    recordTest(
      'QA-10: /api/blogs/feedback Live Vote Mutation (No EROFS crash)',
      feedbackPostRes.status === 200,
      `Status: ${feedbackPostRes.status}`
    );

    // 12. QA TEST: Webmaster Indexing API
    const indexingGetRes = await fetchUrl('/api/webmaster/indexing');
    const hasIndexNowHost = indexingGetRes.text.includes('zawrindustries.com');
    recordTest(
      'QA-11: /api/webmaster/indexing Configuration Health',
      indexingGetRes.status === 200 && hasIndexNowHost,
      `Status: ${indexingGetRes.status}`
    );

  } catch (err) {
    console.error('QA Execution Exception:', err);
  } finally {
    // Cleanly terminate the Next.js test server
    console.log('\n--- Shutting down test server ---');
    try {
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', String(serverProcess.pid), '/f', '/t'], { stdio: 'ignore' });
      } else {
        serverProcess.kill('SIGTERM');
      }
    } catch (e) {}
  }

  // Summary Report
  console.log('\n====================================================');
  console.log('              FINAL QA TEST RESULTS                 ');
  console.log('====================================================');
  const total = testResults.length;
  const passedCount = testResults.filter(t => t.passed).length;
  const failedCount = total - passedCount;

  console.log(`TOTAL TESTS: ${total} | PASSED: ${passedCount} | FAILED: ${failedCount}`);
  if (failedCount === 0) {
    console.log('\n🎉 ALL SYSTEMS FULLY OPERATIONAL AND VERIFIED!');
  } else {
    console.log(`\n⚠️ ${failedCount} tests failed. Please review errors above.`);
  }
}

runUnitAndIntegrationSuite();

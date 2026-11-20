import { NextResponse } from 'next/server';
import {
  runAutonomousBlogPipeline,
  getExistingBlogs,
  saveBlogs,
  broadcastBlogNewsletter,
  ZAWR_INDUSTRIES,
  GeneratedBlog,
  getRandomBlogAssetImage
} from '@/lib/ai-blog-engine';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { verifyWebmasterAuth } from '@/lib/webmaster-security';
import { notifySearchEngines } from '@/lib/search-indexing';

// GET handler handles both JSON queries and 1-Click Approval Links from the Email
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const id = searchParams.get('id');
  const token = searchParams.get('token');

  // Handle 1-Click Action Links from the Webmaster Email
  if (action && id && token) {
    const blogs = await getExistingBlogs();
    const blogIndex = blogs.findIndex((b) => b.id === id);

    if (blogIndex === -1) {
      return new Response(generateActionFeedbackHTML('Article Not Found', 'The requested blog article ID does not exist or was deleted.', '#ef4444'), {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    const blog = blogs[blogIndex];

    // Validate Token
    if (blog.approvalToken && blog.approvalToken !== token) {
      return new Response(generateActionFeedbackHTML('Security Token Invalid', 'The authorization token for this action link has expired or is invalid.', '#ef4444'), {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    // 1. APPROVE WITH DEFAULT IMAGE
    if (action === 'approve_default') {
      blog.image = getRandomBlogAssetImage();
      blog.status = 'published';
      blogs[blogIndex] = blog;
      await saveBlogs(blogs);

      // Auto-broadcast newsletter
      try {
        await broadcastBlogNewsletter(blog);
      } catch (err) {
        console.error('Error broadcasting newsletter:', err);
      }

      // Auto-ping Search Engines
      try {
        notifySearchEngines(`https://www.zawrindustries.com/about/blog/${blog.slug}`, blog.slug).catch(console.error);
      } catch (err) {
        console.error('Error pinging search engines:', err);
      }

      return new Response(
        generateActionFeedbackHTML(
          'Approved & Published with Default Banner',
          `"${blog.title}" is now LIVE on the website, submitted to search engines for indexing, and queued to active subscribers.`,
          '#10b981',
          `https://www.zawrindustries.com/about/blog/${blog.slug}`
        ),
        { headers: { 'Content-Type': 'text/html' } }
      );
    }

    // 2. APPROVE AS IS
    if (action === 'approve') {
      if (!blog.image || blog.image.includes('application-development-hero.png')) {
        blog.image = getRandomBlogAssetImage();
      }
      blog.status = 'published';
      blogs[blogIndex] = blog;
      await saveBlogs(blogs);

      try {
        await broadcastBlogNewsletter(blog);
      } catch (err) {
        console.error('Error broadcasting newsletter:', err);
      }

      // Auto-ping Search Engines
      try {
        notifySearchEngines(`https://www.zawrindustries.com/about/blog/${blog.slug}`, blog.slug).catch(console.error);
      } catch (err) {
        console.error('Error pinging search engines:', err);
      }

      return new Response(
        generateActionFeedbackHTML(
          'Approved & Published',
          `"${blog.title}" has been published to /about/blog, submitted to search engines, and queued for newsletter dispatch.`,
          '#10b981',
          `https://www.zawrindustries.com/about/blog/${blog.slug}`
        ),
        { headers: { 'Content-Type': 'text/html' } }
      );
    }

    // 3. HOLD ARTICLE
    if (action === 'hold') {
      blog.status = 'held';
      blogs[blogIndex] = blog;
      await saveBlogs(blogs);

      return new Response(
        generateActionFeedbackHTML(
          'Article Held on Editorial Queue',
          `"${blog.title}" is marked as HELD. It will not be published or sent in newsletters until manually reopened.`,
          '#f59e0b'
        ),
        { headers: { 'Content-Type': 'text/html' } }
      );
    }
  }

  // Standard JSON response of drafts
  const blogs = await getExistingBlogs();
  const drafts = blogs.filter((b) => b.status === 'pending_approval' || b.status === 'draft' || b.status === 'held');
  return NextResponse.json({
    total: blogs.length,
    drafts,
    industries: ZAWR_INDUSTRIES.map((i) => ({ name: i.name, category: i.category })),
  });
}

// POST handler handles Webmaster AI Blog Studio operations
export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let action = '';
    let body: any = {};
    let formData: FormData | null = null;

    if (contentType.includes('multipart/form-data')) {
      formData = await request.formData();
      action = (formData.get('action') as string) || '';
    } else {
      body = await request.json();
      action = body.action || '';
    }

    // 1. GENERATE AUTONOMOUS AI BLOG
    if (action === 'generate') {
      const topic = body.topic || '';
      const category = body.category || '';
      const forceApprove = Boolean(body.forceApprove);
      const requireApproval = Boolean(body.requireApproval);

      const result = await runAutonomousBlogPipeline({
        customTopic: topic,
        targetCategory: category,
        forceApprove,
        requireApproval,
      });

      return NextResponse.json({
        success: true,
        actionTaken: result.actionTaken,
        blog: result.blog,
      });
    }

    // 2. UPLOAD CUSTOM TOPIC IMAGE & APPROVE
    if (action === 'upload_image_and_publish' && formData) {
      const blogId = formData.get('blogId') as string;
      const file = formData.get('image') as File;

      if (!blogId || !file) {
        return NextResponse.json({ error: 'Blog ID and image file are required' }, { status: 400 });
      }

      const blogs = await getExistingBlogs();
      const blogIndex = blogs.findIndex((b) => b.id === blogId);
      if (blogIndex === -1) {
        return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
      }

      // Upload to Cloudinary
      const secureUrl = await uploadToCloudinary(file, 'zawr/blogs');

      const blog = blogs[blogIndex];
      blog.image = secureUrl;
      blog.status = 'published';
      blogs[blogIndex] = blog;
      await saveBlogs(blogs);

      // Auto-broadcast newsletter with the custom uploaded image
      let broadcastStatus = null;
      try {
        broadcastStatus = await broadcastBlogNewsletter(blog);
      } catch (e: any) {
        console.error('Newsletter broadcast error:', e);
      }

      // Auto-ping Search Engines
      try {
        notifySearchEngines(`https://www.zawrindustries.com/about/blog/${blog.slug}`, blog.slug).catch(console.error);
      } catch (err) {
        console.error('Error pinging search engines:', err);
      }

      return NextResponse.json({
        success: true,
        message: 'Custom image uploaded to Cloudinary, article published, and newsletter broadcasted.',
        blog,
        broadcast: broadcastStatus,
      });
    }

    // 3. SEND TEST NEWSLETTER TO ME (PREVIEW)
    if (action === 'test_newsletter') {
      const blogId = body.blogId;
      const testEmail = body.testEmail || process.env.GMAIL_USER || 'zawrindustries.mails@gmail.com';

      const blogs = await getExistingBlogs();
      const blog = blogs.find((b) => b.id === blogId);
      if (!blog) {
        return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
      }

      const result = await broadcastBlogNewsletter(blog, testEmail);
      return NextResponse.json({
        success: true,
        message: `Test newsletter sent to ${testEmail}`,
        result,
      });
    }

    // 4. BROADCAST NEWSLETTER TO ALL SUBSCRIBERS
    if (action === 'broadcast_newsletter') {
      const blogId = body.blogId;
      const blogs = await getExistingBlogs();
      const blog = blogs.find((b) => b.id === blogId);
      if (!blog) {
        return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
      }

      const result = await broadcastBlogNewsletter(blog);
      return NextResponse.json({
        success: true,
        message: `Newsletter broadcasted to ${(result as any).count ?? 0} active subscribers.`,
        result,
      });
    }

    // 5. MANUAL APPROVE
    if (action === 'approve') {
      const blogId = body.blogId;
      const blogs = await getExistingBlogs();
      const blogIndex = blogs.findIndex((b) => b.id === blogId);
      if (blogIndex === -1) {
        return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
      }

      blogs[blogIndex].status = 'published';
      await saveBlogs(blogs);

      // Auto-ping Search Engines
      try {
        notifySearchEngines(`https://www.zawrindustries.com/about/blog/${blogs[blogIndex].slug}`, blogs[blogIndex].slug).catch(console.error);
      } catch (err) {
        console.error('Error pinging search engines:', err);
      }

      return NextResponse.json({
        success: true,
        blog: blogs[blogIndex],
      });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    console.error('AI Blog Studio Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

function generateActionFeedbackHTML(title: string, message: string, accentColor: string, liveUrl?: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title} — Zawr Industries</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; background-color: #000000; color: #ffffff; font-family: -apple-system, system-ui, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .card { background-color: #0c0c0c; border: 1px solid #222222; border-radius: 16px; padding: 48px; max-width: 540px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.8); }
    h1 { font-size: 24px; font-weight: 600; margin: 0 0 16px 0; color: ${accentColor}; }
    p { font-size: 15px; color: #9ca3af; line-height: 1.6; margin: 0 0 28px 0; }
    .btn { display: inline-block; padding: 12px 28px; background-color: #ffffff; color: #000000; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 9999px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${title}</h1>
    <p>${message}</p>
    ${liveUrl ? `<a href="${liveUrl}" class="btn" target="_blank">View Live Article</a>` : `<a href="https://zawrindustries.com/webmaster" class="btn">Open Webmaster Console</a>`}
  </div>
</body>
</html>
  `.trim();
}

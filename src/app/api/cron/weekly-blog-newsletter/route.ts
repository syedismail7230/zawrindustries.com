import { NextResponse } from 'next/server';
import { runAutonomousBlogPipeline } from '@/lib/ai-blog-engine';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    // Optional cron secret protection if configured
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[Weekly Blog Cron] Executing autonomous AI blog generation & newsletter pipeline...');
    const result = await runAutonomousBlogPipeline();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      actionTaken: result.actionTaken,
      blogTitle: result.blog.title,
      isSensitive: result.blog.sensitive,
    });
  } catch (error: any) {
    console.error('[Weekly Blog Cron] Error in execution:', error);
    return NextResponse.json({ error: error.message || 'Cron execution failed' }, { status: 500 });
  }
}

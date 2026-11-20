import { NextResponse } from 'next/server';
import { sendDailyReportToWebmaster, generateDailyReportData } from '@/lib/webmaster-report';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Optional verification if CRON_SECRET is configured
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      const url = new URL(req.url);
      const queryKey = url.searchParams.get('key');
      if (queryKey !== cronSecret) {
        return NextResponse.json({ error: 'Unauthorized cron request' }, { status: 401 });
      }
    }

    // 1. Weekly Blog Autonomous Dispatch Check (Mon, Wed, Fri)
    let aiBlogExecution: any = null;
    const dayOfWeek = new Date().getUTCDay(); // 1 = Monday, 3 = Wednesday, 5 = Friday
    const isBlogScheduledDay = dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5;

    if (isBlogScheduledDay && process.env.GEMINI_API_KEY) {
      try {
        console.log('[Daily Cron] Scheduled AI Blog cadence active today. Executing pipeline...');
        const { runAutonomousBlogPipeline } = await import('@/lib/ai-blog-engine');
        aiBlogExecution = await runAutonomousBlogPipeline();
      } catch (blogErr: any) {
        console.error('[Daily Cron] AI Blog pipeline execution error:', blogErr.message);
        aiBlogExecution = { error: blogErr.message };
      }
    }

    const result = await sendDailyReportToWebmaster('Automated Cron Service');
    const summary = await generateDailyReportData();

    return NextResponse.json({
      success: result.success,
      timestamp: new Date().toISOString(),
      aiBlogExecution: aiBlogExecution ? {
        actionTaken: aiBlogExecution.actionTaken,
        title: aiBlogExecution.blog?.title,
        error: aiBlogExecution.error
      } : 'Not scheduled for today',
      recipient: summary.recipient,
      totalPageViews: summary.performance.totalPageViews24h,
      emailsDispatched: summary.emailsSummary.totalDispatched24h,
      newsletterDispatched24h: summary.newsletterSummary.totalSent24h,
      newsletterDispatchedAllTime: summary.newsletterSummary.totalSentAllTime,
      activeSubscribersCount: summary.newsletterSummary.activeSubscribersCount,
      publishingCadence: summary.newsletterSummary.scheduledCadence,
      applicationsCount: summary.applicationsSummary.totalApplications24h,
      messageId: result.messageId,
      error: result.error
    });
  } catch (error: any) {
    console.error('Error in daily report cron endpoint:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  return GET(req);
}

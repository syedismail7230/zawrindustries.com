import { NextResponse } from 'next/server';
import { sendDailyReportToWebmaster, generateDailyReportData, generateDailyReportEmailHtml } from '@/lib/webmaster-report';
import { verifySessionToken } from '@/lib/webmaster-security';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    const user = token ? verifySessionToken(token) : null;

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Administrator authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'json';

    const reportData = await generateDailyReportData();

    if (format === 'html') {
      const html = generateDailyReportEmailHtml(reportData);
      return new NextResponse(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    return NextResponse.json({
      success: true,
      report: reportData
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    const user = token ? verifySessionToken(token) : null;

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Administrator privileges required' }, { status: 401 });
    }

    const result = await sendDailyReportToWebmaster(`Manual Trigger by ${user.name} (${user.email})`);

    return NextResponse.json({
      success: result.success,
      timestamp: new Date().toISOString(),
      recipient: process.env.WEBMASTER_REPORT_EMAIL || 'webmaster@zawrindustries.com',
      messageId: result.messageId,
      error: result.error
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

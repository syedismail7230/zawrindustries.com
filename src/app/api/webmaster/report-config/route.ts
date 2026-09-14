import { NextResponse } from 'next/server';
import {
  getWebmasterReportConfig,
  saveWebmasterReportConfig,
  sendDailyReportToWebmaster,
  WebmasterReportConfig,
  WebmasterReportRecipient
} from '@/lib/webmaster-report';
import { verifySessionToken } from '@/lib/webmaster-security';

export const dynamic = 'force-dynamic';

// ── GET: Load report configuration and recipients ──
export async function GET(req: Request) {
  try {
    const config = getWebmasterReportConfig();
    return NextResponse.json({ success: true, config }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching report config:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ── POST: Save report configuration and recipients ──
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { config } = body as { config: WebmasterReportConfig };

    if (!config || !Array.isArray(config.recipients)) {
      return NextResponse.json({ success: false, error: 'Invalid configuration payload' }, { status: 400 });
    }

    const saved = saveWebmasterReportConfig(config);
    if (!saved) {
      return NextResponse.json({ success: false, error: 'Failed to write configuration file' }, { status: 500 });
    }

    return NextResponse.json({ success: true, config }, { status: 200 });
  } catch (error: any) {
    console.error('Error saving report config:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ── PUT: Trigger instant manual report dispatch ──
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { triggeredBy, customRecipient } = body;

    const result = await sendDailyReportToWebmaster(
      triggeredBy || 'Webmaster Executive Panel',
      customRecipient
    );

    return NextResponse.json({
      success: result.success,
      messageId: result.messageId,
      recipientsCount: result.recipientsCount,
      recipients: result.recipients,
      error: result.error,
      timestamp: new Date().toISOString()
    }, { status: result.success ? 200 : 500 });

  } catch (error: any) {
    console.error('Error dispatching report:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

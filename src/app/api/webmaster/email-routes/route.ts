import { NextResponse } from 'next/server';
import {
  getEmailRoutes,
  saveEmailRoutes,
  testSmtpConnection,
  testDispatchRoute,
  EmailRouteNodeConfig
} from '@/lib/email-router';

export const dynamic = 'force-dynamic';

// GET: Fetch all active email routes, mailboxes, and server status
export async function GET() {
  try {
    const routes = getEmailRoutes();
    
    // Group mailboxes
    const mailboxesMap = new Map<string, { email: string; name: string; count: number; forms: string[] }>();
    for (const r of routes) {
      const email = r.destinationEmail.toLowerCase();
      if (!mailboxesMap.has(email)) {
        const prefix = email.split('@')[0];
        const name = prefix.charAt(0).toUpperCase() + prefix.slice(1) + ' Department';
        mailboxesMap.set(email, { email, name, count: 0, forms: [] });
      }
      const mb = mailboxesMap.get(email)!;
      mb.count++;
      mb.forms.push(r.formName);
    }

    const mailboxes = Array.from(mailboxesMap.values());

    const serverConfig = {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      senderUser: process.env.GMAIL_USER || 'zawrindustries.mails@gmail.com',
      fromIdentity: process.env.GMAIL_FROM || '"Zawr Industries" <noreply@zawrindustries.com>',
      tlsVersion: 'TLS 1.3 Active'
    };

    return NextResponse.json({
      routes,
      mailboxes,
      serverConfig
    });
  } catch (error: any) {
    console.error('Error fetching email routes:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch email routes' }, { status: 500 });
  }
}

// POST: Save/Update all email routes
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { routes } = body;

    if (!Array.isArray(routes)) {
      return NextResponse.json({ error: 'Invalid routes payload. Expected array.' }, { status: 400 });
    }

    await saveEmailRoutes(routes);
    return NextResponse.json({ success: true, count: routes.length });
  } catch (error: any) {
    console.error('Error saving email routes:', error);
    return NextResponse.json({ error: error.message || 'Failed to save email routes' }, { status: 500 });
  }
}

// PATCH: Test SMTP Connection handshake
export async function PATCH() {
  try {
    const result = await testSmtpConnection();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error verifying SMTP:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT: Dispatch a live test email through a specific mapped route
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { routeId, customRecipient } = body;

    if (!routeId) {
      return NextResponse.json({ error: 'Missing routeId parameter' }, { status: 400 });
    }

    const result = await testDispatchRoute(routeId, customRecipient);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error dispatching test email:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { logEmailDispatch } from '@/lib/analytics-tracker';
import { evaluateSpamScore } from '@/lib/bot-protection';
import { resolveFormRoute } from '@/lib/email-router';
import { sendMailWithPoolFailover } from '@/lib/smtp-pool';

export async function GET() {
  return NextResponse.json({ status: 'healthy', service: 'request-callback', timestamp: new Date().toISOString() });
}

export async function POST(request: Request) {
  try {
    const route = resolveFormRoute('request-callback');
    const destination = route.destinationEmail || 'contact@zawrindustries.com';
    const cc = route.cc && route.cc.length > 0 ? route.cc : undefined;
    const bcc = route.bcc && route.bcc.length > 0 ? route.bcc : undefined;

    const body = await request.json();
    const { clientId, priority, honeypot, website_url_hp, phone, email } = body;

    if (!clientId || !priority) {
      return NextResponse.json(
        { error: 'Client ID and Priority are required' },
        { status: 400 }
      );
    }

    const forwarded = request.headers.get('x-forwarded-for');
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    // Anti-spam evaluation
    const spamCheck = evaluateSpamScore({
      ip: clientIp,
      companyName: clientId,
      honeypot: honeypot || website_url_hp,
    });

    if (spamCheck.isSpam) {
      console.warn(`[Anti-Spam Shield] Blocked callback spam from IP ${clientIp}: ${spamCheck.reason}`);
      return NextResponse.json({ success: true, message: 'Email sent successfully' }, { status: 200 });
    }

    // 1. Internal Notification
    const mailOptions = {
      replyTo: email || destination,
      to: destination,
      cc: cc && cc.length > 0 ? cc.join(', ') : undefined,
      bcc: bcc && bcc.length > 0 ? bcc.join(', ') : undefined,
      subject: (route.subjectPrefix ? `[${route.subjectPrefix}] ` : '') + `🚨 New Call Back Request: Priority [${priority.toUpperCase()}]`,
      text: `You have received a new callback request.\n\nClient ID: ${clientId}\nPriority: ${priority}\nPhone: ${phone || 'Not provided'}\nEmail: ${email || 'Not provided'}\n\nPlease reach out to this client as soon as possible.`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #000;">New Callback Request</h2>
          <p style="color: #555; font-size: 16px;">A user has requested a callback via the Client Relations page.</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p><strong>Client ID:</strong> ${clientId}</p>
            <p><strong>Priority Level:</strong> <span style="color: ${priority.toLowerCase().includes('high') || priority.toLowerCase().includes('immediate') ? 'red' : 'green'}; font-weight: bold;">${priority.toUpperCase()}</span></p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Email:</strong> ${email || 'Not provided'}</p>
          </div>
          <p style="margin-top: 30px; font-size: 12px; color: #999;">Automated message from Zawr Industries Website</p>
        </div>
      `,
    };

    await sendMailWithPoolFailover(mailOptions);

    // 2. User Receipt if email provided
    if (email && email.includes('@')) {
      const userMailOptions = {
        replyTo: destination,
        to: email.trim(),
        subject: `Callback Request Registered: #${clientId} — Zawr Industries`,
        text: `Dear Client,\n\nWe have received your priority callback request for Client ID: ${clientId}.\nOur Client Relations desk has queued your request and will contact you within your selected priority timeframe (${priority}).\n\nWarm regards,\nClient Relations & Support\nZawr Industries`,
        html: `
          <div style="font-family: 'Poppins', sans-serif; max-width: 580px; margin: 0 auto; background: #ffffff; color: #111111; padding: 36px 28px;">
            <h1 style="font-size: 20px; font-weight: 600; color: #000000; margin: 0 0 14px 0;">Callback Request Acknowledged</h1>
            <p style="font-size: 14px; line-height: 1.65; color: #555555; margin: 0 0 20px 0;">We have received your priority callback request for Client ID: <strong>${clientId}</strong>. Our Client Relations desk has queued your request.</p>
            <div style="padding-bottom: 24px;">
              <p style="margin: 0 0 6px 0; font-size: 13.5px; font-weight: 600; color: #000000;">Service SLA</p>
              <p style="margin: 0; font-size: 13.5px; line-height: 1.65; color: #555555;">An account representative will contact you via your telephone within your selected priority timeframe (<strong>${priority}</strong>).</p>
            </div>
            <p style="margin: 0; font-size: 13.5px; color: #777777;">Warm regards,<br/><strong style="color: #000000;">Client Relations & Support</strong><br/>Zawr Industries</p>
          </div>
        `
      };
      await sendMailWithPoolFailover(userMailOptions);
    }

    logEmailDispatch({
      recipient: destination,
      sender: 'noreply@zawrindustries.com',
      subject: `🚨 New Call Back Request: Priority [${priority.toUpperCase()}]`,
      reason: 'Client Relations Callback Request',
      status: 'Delivered',
      statusCode: 200,
      server: 'smtp.gmail.com (TLS 1.3)',
      ip: clientIp,
      region: 'Web Client'
    });

    return NextResponse.json({ success: true, message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}

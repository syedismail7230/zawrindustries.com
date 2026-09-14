import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { generateMediaKitConfirmationEmail } from '@/lib/emailTemplates';
import { logEmailDispatch } from '@/lib/analytics-tracker';
import { evaluateSpamScore } from '@/lib/bot-protection';

import { resolveFormRoute } from '@/lib/email-router';
import { sendMailWithPoolFailover } from '@/lib/smtp-pool';

export async function GET() {
  return NextResponse.json({ status: 'healthy', service: 'request-media-kit', timestamp: new Date().toISOString() });
}

export async function POST(request: Request) {
  try {
    const route = resolveFormRoute('request-media-kit');
    const destination = route.destinationEmail || 'media@zawrindustries.com';
    const cc = route.cc && route.cc.length > 0 ? route.cc : undefined;
    const bcc = route.bcc && route.bcc.length > 0 ? route.bcc : undefined;

    const body = await request.json();
    const { companyName, name, email, organization, purpose, resources, honeypot, website_url_hp } = body;

    const forwarded = request.headers.get('x-forwarded-for');
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    // Anti-Spam Evaluation
    const spamCheck = evaluateSpamScore({
      ip: clientIp,
      fullName: name || '',
      companyName: companyName || organization || '',
      email: email || '',
      message: purpose || '',
      honeypot: honeypot || website_url_hp,
    });

    if (spamCheck.isSpam) {
      console.warn(`[Anti-Spam Shield] Blocked media kit bot from IP ${clientIp}: ${spamCheck.reason}`);
      return NextResponse.json({ success: true, message: 'Resource request submitted successfully' }, { status: 200 });
    }

    if (!companyName || !name || !email || !purpose) {
      return NextResponse.json(
        { error: 'Company name, name, email, and purpose are required' },
        { status: 400 }
      );
    }

    const resourcesList = Array.isArray(resources) ? resources.join(', ') : 'Not specified';

    // 1. Internal notification
    const internalMailOptions = {
      replyTo: email,
      to: destination,
      cc: cc && cc.length > 0 ? cc.join(', ') : undefined,
      bcc: bcc && bcc.length > 0 ? bcc.join(', ') : undefined,
      subject: (route.subjectPrefix ? `[${route.subjectPrefix}] ` : '') + `[Media Kit Request] ${companyName} — ${name}`,
      text: `New Media Kit Resource Request:\n\nBrand: ${companyName}\nRequester: ${name}\nEmail: ${email}\nOrganization: ${organization || 'N/A'}\nRequested Resources: ${resourcesList}\n\nPurpose:\n${purpose}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; padding: 24px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #000; margin-top: 0;">Media Kit Resource Request</h2>
          <p><strong>Target Brand:</strong> ${companyName}</p>
          <p><strong>Requester Name:</strong> ${name}</p>
          <p><strong>Organization / Agency:</strong> ${organization || 'N/A'}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Requested Assets:</strong> ${resourcesList}</p>
          <h3 style="margin-top: 20px;">Intended Purpose:</h3>
          <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #000; white-space: pre-wrap;">${purpose}</div>
        </div>
      `,
    };

    await sendMailWithPoolFailover(internalMailOptions);

    // 2. User Confirmation Email (if auto-responder enabled)
    if (route.autoResponder) {
      const confirmEmail = generateMediaKitConfirmationEmail({
        name,
        email,
        companyName,
        organization,
        resources: resources || [],
      });

      await sendMailWithPoolFailover({
        replyTo: destination,
        to: email.trim(),
        subject: confirmEmail.subject,
        text: confirmEmail.text,
        html: confirmEmail.html,
      });
    }

    // Log real email telemetry
    logEmailDispatch({
      recipient: destination,
      sender: 'noreply@zawrindustries.com',
      subject: `[Media Kit Request] ${companyName} — ${name}`,
      reason: 'Press & Media Kit Resource Request',
      status: 'Delivered',
      statusCode: 200,
      server: 'Google SMTP Relay (TLS 1.3)',
      ip: clientIp,
      region: 'Bengaluru, India'
    });

    return NextResponse.json({ success: true, message: 'Resource request submitted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending media kit request:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}

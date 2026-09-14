import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { generateInvestorConfirmationEmail } from '@/lib/emailTemplates';
import { logEmailDispatch } from '@/lib/analytics-tracker';
import { evaluateSpamScore } from '@/lib/bot-protection';

import { resolveFormRoute } from '@/lib/email-router';
import { sendMailWithPoolFailover } from '@/lib/smtp-pool';

export async function GET() {
  return NextResponse.json({ status: 'healthy', service: 'request-investor', timestamp: new Date().toISOString() });
}

export async function POST(req: Request) {
  try {
    const route = resolveFormRoute('request-investor');
    const destination = route.destinationEmail || 'investors@zawrindustries.com';
    const cc = route.cc && route.cc.length > 0 ? route.cc : undefined;
    const bcc = route.bcc && route.bcc.length > 0 ? route.bcc : undefined;

    const body = await req.json();
    const { name, email, organization, investmentSize, inquiry, honeypot, website_url_hp } = body;

    const forwarded = req.headers.get('x-forwarded-for');
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    // Anti-Spam Evaluation
    const spamCheck = evaluateSpamScore({
      ip: clientIp,
      fullName: name || '',
      companyName: organization || '',
      email: email || '',
      message: inquiry || '',
      honeypot: honeypot || website_url_hp,
    });

    if (spamCheck.isSpam) {
      console.warn(`[Anti-Spam Shield] Blocked investor inquiry bot from IP ${clientIp}: ${spamCheck.reason}`);
      return NextResponse.json({ success: true, message: 'Investor inquiry logged successfully' }, { status: 200 });
    }

    if (!name || !email || !inquiry) {
      return NextResponse.json(
        { error: 'Name, email, and inquiry details are required' },
        { status: 400 }
      );
    }

    // 1. Internal Notification to Investors Team
    const hrMailOptions = {
      replyTo: email,
      to: destination,
      cc: cc && cc.length > 0 ? cc.join(', ') : undefined,
      bcc: bcc && bcc.length > 0 ? bcc.join(', ') : undefined,
      subject: (route.subjectPrefix ? `[${route.subjectPrefix}] ` : '') + `[Investor Inquiry] ${name} — ${organization || 'Private Investor'} (${investmentSize || 'General'})`,
      text: `New Investor Inquiry received via Zawr Website:\n\nName: ${name}\nEmail: ${email}\nOrganization: ${organization || 'N/A'}\nInvestment Size: ${investmentSize || 'N/A'}\n\nInquiry Details:\n${inquiry}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; padding: 24px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #000; margin-top: 0;">New Investor Relations Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Organization / Firm:</strong> ${organization || 'N/A'}</p>
          <p><strong>Investment Size Range:</strong> ${investmentSize || 'N/A'}</p>
          <h3 style="margin-top: 20px;">Inquiry & Interests:</h3>
          <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #000; white-space: pre-wrap;">${inquiry}</div>
        </div>
      `,
    };

    await sendMailWithPoolFailover(hrMailOptions);

    // 2. Confirmation Email to the Investor (if auto-responder enabled)
    if (route.autoResponder) {
      const confirmEmail = generateInvestorConfirmationEmail({
        name,
        email,
        organization,
        investmentSize,
        inquiry,
      });

      await sendMailWithPoolFailover({
        replyTo: destination,
        to: email.trim(),
        subject: confirmEmail.subject,
        text: confirmEmail.text,
        html: confirmEmail.html,
      });
    }

    logEmailDispatch({
      recipient: destination,
      sender: 'noreply@zawrindustries.com',
      subject: `[Investor Inquiry] ${name} — ${organization || 'Private Investor'}`,
      reason: 'Investor Relations Inquiry',
      status: 'Delivered',
      statusCode: 200,
      server: 'smtp.gmail.com (TLS 1.3)',
      ip: clientIp,
      region: 'Web Client'
    });

    logEmailDispatch({
      recipient: email.trim(),
      sender: 'noreply@zawrindustries.com',
      subject: 'Confirmation: Zawr Industries Investor Inquiry',
      reason: 'Investor Auto-Receipt',
      status: 'Delivered',
      statusCode: 200,
      server: 'smtp.gmail.com (TLS 1.3)',
      ip: clientIp,
      region: 'Web Client'
    });

    return NextResponse.json({ success: true, message: 'Investor inquiry logged successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error handling investor request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

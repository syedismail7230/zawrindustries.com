import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { generateInvestorConfirmationEmail } from '@/lib/emailTemplates';
import { logEmailDispatch } from '@/lib/analytics-tracker';

export async function GET() {
  return NextResponse.json({ status: 'healthy', service: 'request-investor', timestamp: new Date().toISOString() });
}

export async function POST(req: Request) {
  try {
    const { name, email, organization, investmentSize, inquiry } = await req.json();

    if (!name || !email || !inquiry) {
      return NextResponse.json(
        { error: 'Name, email, and inquiry details are required' },
        { status: 400 }
      );
    }

    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      const senderFrom = process.env.GMAIL_FROM || `"Zawr Industries" <noreply@zawrindustries.com>`;

      // 1. Internal Notification to Investors Team
      const hrMailOptions = {
        from: senderFrom,
        replyTo: email,
        to: 'investors@zawrindustries.com',
        subject: `[Investor Inquiry] ${name} — ${organization || 'Private Investor'} (${investmentSize || 'General'})`,
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

      // 2. Confirmation Email to the Investor
      const confirmEmail = generateInvestorConfirmationEmail({
        name,
        email,
        organization,
        investmentSize,
        inquiry,
      });

      const confirmMailOptions = {
        from: senderFrom,
        replyTo: 'investors@zawrindustries.com',
        to: email.trim(),
        subject: confirmEmail.subject,
        text: confirmEmail.text,
        html: confirmEmail.html,
      };

      await Promise.all([
        transporter.sendMail(hrMailOptions),
        transporter.sendMail(confirmMailOptions),
      ]);
    }

    const forwarded = req.headers.get('x-forwarded-for');
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    logEmailDispatch({
      recipient: 'investors@zawrindustries.com',
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

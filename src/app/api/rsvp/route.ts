import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { generateRSVPConfirmationEmail } from '@/lib/emailTemplates';
import { logEmailDispatch } from '@/lib/analytics-tracker';
import { evaluateSpamScore } from '@/lib/bot-protection';
import { resolveFormRoute } from '@/lib/email-router';
import { sendMailWithPoolFailover } from '@/lib/smtp-pool';

export async function GET() {
  return NextResponse.json({ status: 'healthy', service: 'rsvp', timestamp: new Date().toISOString() });
}

export async function POST(req: Request) {
  try {
    const route = resolveFormRoute('rsvp');
    const destination = route.destinationEmail || 'events@zawrindustries.com';
    const cc = route.cc && route.cc.length > 0 ? route.cc : undefined;
    const bcc = route.bcc && route.bcc.length > 0 ? route.bcc : undefined;

    const body = await req.json();
    const { name, email, phone, company, designation, eventId, eventTitle, honeypot, website_url_hp } = body;

    const forwarded = req.headers.get('x-forwarded-for');
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    // Anti-Spam Evaluation
    const spamCheck = evaluateSpamScore({
      ip: clientIp,
      fullName: name || '',
      companyName: company || '',
      email: email || '',
      phone: phone || '',
      honeypot: honeypot || website_url_hp,
    });

    if (spamCheck.isSpam) {
      console.warn(`[Anti-Spam Shield] Blocked RSVP bot from IP ${clientIp}: ${spamCheck.reason}`);
      return NextResponse.json({ success: true, message: 'RSVP booking request logged successfully' }, { status: 200 });
    }

    if (!name || !email || !eventTitle) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Internal Notification
    const internalMailOptions = {
      replyTo: email || destination,
      to: destination,
      cc: cc && cc.length > 0 ? cc.join(', ') : undefined,
      bcc: bcc && bcc.length > 0 ? bcc.join(', ') : undefined,
      subject: (route.subjectPrefix ? `[${route.subjectPrefix}] ` : '') + `[RSVP Request] ${name} — ${eventTitle}`,
      text: `New RSVP Access Pass Request:\n\nEvent: ${eventTitle}\nGuest: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nCompany: ${company || 'N/A'}\nDesignation: ${designation || 'N/A'}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; padding: 24px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #000; margin-top: 0;">New Event Access Pass Request</h2>
          <p><strong>Event:</strong> ${eventTitle}</p>
          <p><strong>Guest Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Company:</strong> ${company || 'Not provided'}</p>
          <p><strong>Designation:</strong> ${designation || 'Not provided'}</p>
        </div>
      `,
    };

    await sendMailWithPoolFailover(internalMailOptions);

    // 2. User Confirmation Email
    if (route.autoResponder) {
      const confirmEmail = generateRSVPConfirmationEmail({
        name,
        email,
        eventTitle,
        company,
        designation,
      });

      const userMailOptions = {
        replyTo: destination,
        to: email.trim(),
        subject: confirmEmail.subject,
        text: confirmEmail.text,
        html: confirmEmail.html,
      };

      await sendMailWithPoolFailover(userMailOptions);
    }

    logEmailDispatch({
      recipient: 'events@zawrindustries.com',
      sender: 'noreply@zawrindustries.com',
      subject: `[RSVP Request] ${name} — ${eventTitle}`,
      reason: 'Event Access Pass Request',
      status: 'Delivered',
      statusCode: 200,
      server: 'smtp.gmail.com (TLS 1.3)',
      ip: clientIp,
      region: 'Web Client'
    });

    logEmailDispatch({
      recipient: email.trim(),
      sender: 'noreply@zawrindustries.com',
      subject: `Confirmed: Access Pass for ${eventTitle}`,
      reason: 'Attendee RSVP Confirmation',
      status: 'Delivered',
      statusCode: 200,
      server: 'smtp.gmail.com (TLS 1.3)',
      ip: clientIp,
      region: 'Web Client'
    });

    return NextResponse.json({ success: true, message: 'RSVP booking request logged successfully' });

  } catch (error: any) {
    console.error('Error handling RSVP request:', error);
    return NextResponse.json({ error: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}

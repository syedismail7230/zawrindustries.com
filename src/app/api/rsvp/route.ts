import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { generateRSVPConfirmationEmail } from '@/lib/emailTemplates';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, company, designation, eventId, eventTitle } = body;

    if (!name || !email || !eventTitle) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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

      // 1. Internal Notification
      const internalMailOptions = {
        from: senderFrom,
        replyTo: email || 'events@zawrindustries.com',
        to: 'events@zawrindustries.com',
        subject: `[RSVP Request] ${name} — ${eventTitle}`,
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

      // 2. User Confirmation Email
      const confirmEmail = generateRSVPConfirmationEmail({
        name,
        email,
        eventTitle,
        company,
        designation,
      });

      const userMailOptions = {
        from: senderFrom,
        replyTo: 'events@zawrindustries.com',
        to: email.trim(),
        subject: confirmEmail.subject,
        text: confirmEmail.text,
        html: confirmEmail.html,
      };

      await Promise.all([
        transporter.sendMail(internalMailOptions),
        transporter.sendMail(userMailOptions),
      ]);
    }

    return NextResponse.json({ success: true, message: 'RSVP booking request logged successfully' });

  } catch (error: any) {
    console.error('Error handling RSVP request:', error);
    return NextResponse.json({ error: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, company, designation, eventId, eventTitle } = body;

    if (!name || !email || !eventTitle) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Setup Nodemailer transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Email options for Booking Confirmation
    const mailOptions = {
      from: `"Zawr Events" <noreply@zawrindustries.com>`,
      to: 'events@zawrindustries.com',
      subject: `New RSVP Booking Request: ${name} for ${eventTitle}`,
      text: `
Hello Zawr Events Management,

A new corporate guest has requested an RSVP booking confirmation.

Event Requested:
--------------------------------------------------
- Event Title: ${eventTitle}
- Event ID: ${eventId || 'N/A'}

Attendee Personal & Corporate Details:
--------------------------------------------------
- Full Name: ${name}
- Email Address: ${email}
- Phone Number: ${phone || 'N/A'}
- Company: ${company || 'N/A'}
- Designation / Title: ${designation || 'N/A'}

Please review this booking and issue a confirmation or e-tickets accordingly.

Best regards,
Zawr Webmaster System
      `,
    };

    // Dispatch email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'RSVP booking request logged successfully' });

  } catch (error: any) {
    console.error('Error handling RSVP request:', error);
    return NextResponse.json({ error: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}

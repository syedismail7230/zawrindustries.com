import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { generateContactConfirmationEmail } from '@/lib/emailTemplates';

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, phone, message } = await request.json();

    if (!firstName || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
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
      const fullName = `${firstName} ${lastName || ''}`.trim();

      // 1. Internal Notification
      const internalMailOptions = {
        from: senderFrom,
        replyTo: email,
        to: 'public-relations@zawrindustries.com', 
        subject: `[Contact & PR Inquiry] ${fullName}`,
        text: `New contact inquiry received:\n\nName: ${fullName}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\n\nMessage:\n${message}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; padding: 24px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #000; margin-top: 0;">New Contact Inquiry</h2>
            <p><strong>Name:</strong> ${fullName}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <h3 style="margin-top: 20px;">Message:</h3>
            <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #000; white-space: pre-wrap;">${message}</div>
          </div>
        `,
      };

      // 2. User Confirmation Email
      const confirmEmail = generateContactConfirmationEmail({
        firstName,
        lastName,
        email,
        phone,
        message,
      });

      const userMailOptions = {
        from: senderFrom,
        replyTo: 'public-relations@zawrindustries.com',
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

    return NextResponse.json({ success: true, message: 'Inquiry submitted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}

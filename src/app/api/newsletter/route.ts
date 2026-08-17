import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { supabase } from '@/lib/supabase';
import { generateNewsletterConfirmationEmail } from '@/lib/emailTemplates';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email address is required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if email already exists in Supabase if configured
    try {
      if (supabase) {
        const { data: existing } = await supabase
          .from('newsletters')
          .select('id')
          .eq('email', cleanEmail)
          .maybeSingle();

        if (existing) {
          return NextResponse.json({ status: 'already', message: 'Already subscribed' }, { status: 200 });
        }

        await supabase
          .from('newsletters')
          .insert([{ email: cleanEmail, status: 'Active' }]);
      }
    } catch (dbErr) {
      console.warn('Database logging error for newsletter:', dbErr);
    }

    // Send confirmation email to subscriber via Nodemailer
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      const senderFrom = process.env.GMAIL_FROM || `"Zawr Industries" <noreply@zawrindustries.com>`;

      // 1. Confirmation Email to Subscriber
      const confirmEmail = generateNewsletterConfirmationEmail({ email: cleanEmail });

      const subscriberMailOptions = {
        from: senderFrom,
        replyTo: 'media@zawrindustries.com',
        to: cleanEmail,
        subject: confirmEmail.subject,
        text: confirmEmail.text,
        html: confirmEmail.html,
      };

      // 2. Internal alert to Newsroom Team
      const internalMailOptions = {
        from: senderFrom,
        to: 'media@zawrindustries.com',
        subject: `[New Newsletter Subscriber] ${cleanEmail}`,
        text: `New subscriber registered for Zawr News Alerts:\n\nEmail: ${cleanEmail}\nTimestamp: ${new Date().toISOString()}`,
      };

      await Promise.all([
        transporter.sendMail(subscriberMailOptions),
        transporter.sendMail(internalMailOptions).catch(() => {}),
      ]);
    }

    return NextResponse.json({ status: 'success', message: 'Subscribed successfully' }, { status: 200 });

  } catch (error: any) {
    console.error('Newsletter error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

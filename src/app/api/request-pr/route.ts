import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, phone, message } = await request.json();

    if (!firstName || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Configure the transporter with Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, 
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Construct the email
    const mailOptions = {
      from: `"Zawr Website Bot" <${process.env.GMAIL_USER}>`, 
      to: 'public-relations@zawrindustries.com', 
      subject: `🚨 New PR Inquiry from ${firstName} ${lastName}`,
      text: `You have received a new Public Relations inquiry.\n\nName: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #000;">New PR Inquiry</h2>
          <p style="color: #555; font-size: 16px;">A user has submitted a message via the Public Relations page.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p style="margin: 0 0 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p style="margin: 0 0 10px 0;"><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          </div>

          <h3 style="margin-top: 25px; color: #333;">Message:</h3>
          <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #000; color: #444; line-height: 1.6;">
            ${message.replace(/\n/g, '<br/>')}
          </div>

          <p style="margin-top: 30px; font-size: 12px; color: #999;">Automated message from Zawr Industries Website</p>
        </div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}

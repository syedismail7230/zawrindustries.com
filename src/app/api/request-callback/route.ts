import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { clientId, priority } = await request.json();

    if (!clientId || !priority) {
      return NextResponse.json(
        { error: 'Client ID and Priority are required' },
        { status: 400 }
      );
    }

    // Configure the transporter with Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // e.g. zawrorganization@gmail.com
        pass: process.env.GMAIL_APP_PASSWORD, // 16-character App Password
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_FROM || `"Zawr Industries" <noreply@zawrindustries.com>`,
      replyTo: 'client-relations@zawrindustries.com',
      to: 'client-relations@zawrindustries.com',
      subject: `🚨 New Call Back Request: Priority [${priority.toUpperCase()}]`,
      text: `You have received a new callback request.\n\nClient ID: ${clientId}\nPriority: ${priority}\n\nPlease reach out to this client as soon as possible.`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #000;">New Callback Request</h2>
          <p style="color: #555; font-size: 16px;">A user has requested a callback via the Client Relations page.</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p><strong>Client ID:</strong> ${clientId}</p>
            <p><strong>Priority Level:</strong> <span style="color: ${priority === 'high' ? 'red' : priority === 'medium' ? 'orange' : 'green'};">${priority.toUpperCase()}</span></p>
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

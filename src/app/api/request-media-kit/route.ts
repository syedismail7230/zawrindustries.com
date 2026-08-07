import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { companyName, name, email, organization, purpose, resources } = await request.json();

    if (!companyName || !name || !email || !purpose) {
      return NextResponse.json(
        { error: 'Company name, name, email, and purpose are required' },
        { status: 400 }
      );
    }

    // Configure the transporter with Gmail SMTP using env vars
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, 
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const resourcesList = Array.isArray(resources) ? resources.join(', ') : 'Not specified';

    const mailOptions = {
      from: process.env.GMAIL_FROM || `"Zawr Media" <${process.env.GMAIL_USER}>`,
      replyTo: email || 'media@zawrindustries.com',
      to: 'media@zawrindustries.com', 
      subject: `🚨 Media Kit Resource Request: ${companyName} - ${name}`,
      text: `You have received a new Media Kit Resource Request.\n\nTarget Brand: ${companyName}\nRequester Name: ${name}\nEmail: ${email}\nOrganization: ${organization || 'Not provided'}\nRequested Resources: ${resourcesList}\n\nPurpose:\n${purpose}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #000; border-bottom: 2px solid #eaeaea; padding-bottom: 10px;">Media Kit Asset Request</h2>
          <p style="color: #555; font-size: 16px;">A media partner has submitted a resource request for <strong>${companyName}</strong>.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p style="margin: 0 0 10px 0;"><strong>Target Company:</strong> <span style="font-size: 1.1rem; color: #1d4ed8; font-weight: bold;">${companyName}</span></p>
            <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 0 0 10px 0;"><strong>Organization:</strong> ${organization || 'Not provided'}</p>
            <p style="margin: 0 0 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p style="margin: 0 0 10px 0;"><strong>Requested Assets:</strong> ${resourcesList}</p>
          </div>

          <h3 style="margin-top: 25px; color: #333;">Purpose / Intended Use:</h3>
          <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #f59e0b; color: #444; line-height: 1.6; border: 1px solid #f3f4f6; border-radius: 4px;">
            ${purpose.replace(/\n/g, '<br/>')}
          </div>

          <p style="margin-top: 30px; font-size: 12px; color: #999;">Automated message from Zawr Industries Website (Media Kit Portal)</p>
        </div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Resource request submitted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending media kit request:', error);
    return NextResponse.json(
      { error: 'Failed to submit resource request' },
      { status: 500 }
    );
  }
}

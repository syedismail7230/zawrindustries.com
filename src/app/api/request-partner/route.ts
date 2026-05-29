import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, phone, company, partnershipType, message } = await request.json();

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
      from: `"Zawr Partnerships" <noreply@zawrindustries.com>`, 
      to: 'partnerships@zawrindustries.com', 
      subject: `🤝 New Strategic Partnership Inquiry: ${company}`,
      text: `You have received a new Strategic Partnership Inquiry.\n\nName: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone}\nCompany: ${company}\nPartnership Type: ${partnershipType}\n\nProposal Details:\n${message}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #000; border-bottom: 2px solid #000; padding-bottom: 10px;">New Partnership Inquiry</h2>
          <p style="color: #555; font-size: 16px;">A strategic partner proposal has been submitted via the Zawr website.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p style="margin: 0 0 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p style="margin: 0 0 10px 0;"><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p style="margin: 0 0 10px 0;"><strong>Company:</strong> ${company || 'Not provided'}</p>
            <p style="margin: 0 0 0 0;"><strong>Partnership Type:</strong> <span style="background-color: #000; color: #fff; padding: 3px 8px; border-radius: 4px; font-size: 0.85em; font-weight: bold;">${partnershipType}</span></p>
          </div>

          <h3 style="margin-top: 25px; color: #333;">Proposal & Details:</h3>
          <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #000; color: #444; line-height: 1.6;">
            ${message.replace(/\n/g, '<br/>')}
          </div>

          <p style="margin-top: 30px; font-size: 12px; color: #999;">Automated partnership request from Zawr Industries Website</p>
        </div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Partnership request sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending partnership email:', error);
    return NextResponse.json(
      { error: 'Failed to send partnership request' },
      { status: 500 }
    );
  }
}

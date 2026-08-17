import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { generateSponsorshipConfirmationEmail } from '@/lib/emailTemplates';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    // Extracted Fields Map
    const fields: { [key: string]: string } = {};
    const attachments: any[] = [];
    
    // Iterate over FormData
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        if (value.size > 0 && value.name !== 'undefined') {
          const arrayBuffer = await value.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          attachments.push({
            filename: value.name,
            content: buffer,
            contentType: value.type,
          });
        }
      } else {
        fields[key] = value.toString();
      }
    }

    // Required check
    if (!fields.companyName || !fields.fullName || !fields.email) {
      return NextResponse.json({ error: 'Missing core mandatory fields' }, { status: 400 });
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

      // Formatting Deliverables
      let deliverablesText = 'None selected';
      if (fields.deliverables) {
        try {
          const delArr = JSON.parse(fields.deliverables);
          if (Array.isArray(delArr) && delArr.length > 0) {
            deliverablesText = delArr.join(', ');
          }
        } catch (e) {
          deliverablesText = fields.deliverables;
        }
      }

      // 1. Internal Notification
      const internalMailOptions = {
        from: senderFrom,
        replyTo: fields.email,
        to: 'partnerships@zawrindustries.com', 
        subject: `[Sponsorship Request] ${fields.companyName} — ${fields.fullName}`,
        text: `New Corporate Sponsorship Inquiry:\n\nCompany: ${fields.companyName}\nRepresentative: ${fields.fullName}\nEmail: ${fields.email}\nPhone: ${fields.phone || 'N/A'}\nType: ${fields.sponsorshipType || 'N/A'}\nBudget: ${fields.budget || 'N/A'}\nDeliverables: ${deliverablesText}\n\nObjectives:\n${fields.objectives || 'N/A'}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; padding: 24px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #000; margin-top: 0;">New Sponsorship & Partner Proposal</h2>
            <p><strong>Company:</strong> ${fields.companyName}</p>
            <p><strong>Representative:</strong> ${fields.fullName}</p>
            <p><strong>Email:</strong> <a href="mailto:${fields.email}">${fields.email}</a></p>
            <p><strong>Phone:</strong> ${fields.phone || 'N/A'}</p>
            <p><strong>Sponsorship Type:</strong> ${fields.sponsorshipType || 'N/A'}</p>
            <p><strong>Proposed Budget:</strong> ${fields.budget || 'N/A'}</p>
            <p><strong>Requested Deliverables:</strong> ${deliverablesText}</p>
            <h3 style="margin-top: 20px;">Objectives & Scope:</h3>
            <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #000; white-space: pre-wrap;">${fields.objectives || 'N/A'}</div>
          </div>
        `,
        attachments,
      };

      // 2. User Confirmation Email
      const confirmEmail = generateSponsorshipConfirmationEmail({
        fullName: fields.fullName,
        companyName: fields.companyName,
        email: fields.email,
        sponsorshipType: fields.sponsorshipType,
      });

      const userMailOptions = {
        from: senderFrom,
        replyTo: 'partnerships@zawrindustries.com',
        to: fields.email.trim(),
        subject: confirmEmail.subject,
        text: confirmEmail.text,
        html: confirmEmail.html,
      };

      await Promise.all([
        transporter.sendMail(internalMailOptions),
        transporter.sendMail(userMailOptions),
      ]);
    }

    return NextResponse.json({ success: true, message: 'Sponsorship application processed successfully' }, { status: 200 });

  } catch (error: any) {
    console.error('Error submitting sponsorship request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

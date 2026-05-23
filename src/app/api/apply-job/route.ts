import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const portfolio = formData.get('portfolio') as string;
    const coverLetter = formData.get('coverLetter') as string;
    const jobId = formData.get('jobId') as string;
    const jobTitle = formData.get('jobTitle') as string;
    const resumeFile = formData.get('resume') as File | null;

    if (!firstName || !email || !resumeFile || !jobTitle || !coverLetter) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Convert the File object to a Buffer for Nodemailer attachment
    const arrayBuffer = await resumeFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Setup Nodemailer transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Email to HR Team
    const hrMailOptions = {
      from: process.env.GMAIL_USER,
      to: 'hr@zawrindustries.com', // As requested by user
      subject: `New Job Application: ${firstName} ${lastName || ''} for ${jobTitle}`,
      text: `
A new candidate has applied for the ${jobTitle} position.

Candidate Details:
- Name: ${firstName} ${lastName || ''}
- Email: ${email}
- Phone: ${phone || 'N/A'}
- Portfolio/LinkedIn: ${portfolio || 'N/A'}

Cover Letter / Fit for Role:
--------------------------------------------------
${coverLetter}
--------------------------------------------------

The candidate's Resume/CV is attached to this email.
      `,
      attachments: [
        {
          filename: resumeFile.name,
          content: buffer,
          contentType: resumeFile.type,
        }
      ]
    };

    // Send the email
    await transporter.sendMail(hrMailOptions);

    return NextResponse.json({ message: 'Application submitted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

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

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ error: 'Invalid email address format' }, { status: 400 });
    }

    // Strict File Validation (Max 5MB, PDF/DOC/DOCX/TXT only)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_MIME_TYPES = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];

    if (resumeFile.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 5MB limit' }, { status: 400 });
    }

    if (resumeFile.type && !ALLOWED_MIME_TYPES.includes(resumeFile.type.toLowerCase())) {
      return NextResponse.json({ error: 'Invalid file type. Please upload a PDF or Word document.' }, { status: 400 });
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
      from: `"Zawr Careers" <noreply@zawrindustries.com>`,
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

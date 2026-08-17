import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const skill = formData.get('skill') as string;
    const portfolio = formData.get('portfolio') as string;
    const coverLetter = formData.get('coverLetter') as string;
    const resumeFile = formData.get('resume') as File | null;

    if (!fullName || !email || !skill) {
      return NextResponse.json({ error: 'Missing required fields (Full Name, Email, Primary Skill)' }, { status: 400 });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ error: 'Invalid email address format' }, { status: 400 });
    }

    let attachments: Array<{ filename: string; content: Buffer; contentType?: string }> = [];

    // If resume file is provided, validate and buffer it
    if (resumeFile && resumeFile.size > 0) {
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

      const arrayBuffer = await resumeFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      attachments.push({
        filename: resumeFile.name,
        content: buffer,
        contentType: resumeFile.type,
      });
    }

    // Setup Nodemailer transporter using Gmail SMTP if credentials exist
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      const hrMailOptions = {
        from: process.env.GMAIL_FROM || `"Zawr Industries" <noreply@zawrindustries.com>`,
        replyTo: email || 'noreply@zawrindustries.com',
        to: 'hr@zawrindustries.com',
        subject: `New Freelance Project Application: ${fullName} - ${skill}`,
        text: `
A new applicant has submitted a freelance application.

Applicant Details:
- Full Name: ${fullName}
- Email: ${email}
- Phone: ${phone || 'N/A'}
- Primary Skill / Domain: ${skill}
- Portfolio / LinkedIn: ${portfolio || 'N/A'}

Brief Introduction / Cover Letter:
--------------------------------------------------
${coverLetter || 'N/A'}
--------------------------------------------------

${attachments.length > 0 ? "The applicant's Resume/CV is attached to this email." : "No resume was attached."}
        `,
        attachments,
      };

      await transporter.sendMail(hrMailOptions);
    } else {
      console.log('Freelance application received (mock/dev):', {
        fullName,
        email,
        phone,
        skill,
        portfolio,
        coverLetter,
        hasResume: attachments.length > 0,
      });
    }

    return NextResponse.json({ message: 'Freelance application submitted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Error submitting freelance application:', error);
    return NextResponse.json({ error: 'Internal Server Error. Please try again later.' }, { status: 500 });
  }
}

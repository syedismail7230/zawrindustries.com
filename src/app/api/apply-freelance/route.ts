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
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ error: 'Invalid email address format' }, { status: 400 });
    }

    let attachments = [];

    // Optional File Attachment Validation if provided
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

    // Setup Nodemailer transporter using Gmail SMTP
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
      subject: `New Freelance Application: ${fullName} (${skill})`,
      text: `
A new candidate has submitted a Freelance Application on Zawr Industries Careers.

Candidate Details:
- Name: ${fullName}
- Email: ${email}
- Phone: ${phone || 'N/A'}
- Primary Skill / Domain: ${skill}
- Portfolio / LinkedIn: ${portfolio || 'N/A'}

Cover Note / Profile Brief:
--------------------------------------------------
${coverLetter || 'N/A'}
--------------------------------------------------

${attachments.length > 0 ? "The candidate's Resume/CV is attached to this email." : "No resume file attached."}
      `,
      attachments,
    };

    // Send the email
    await transporter.sendMail(hrMailOptions);

    return NextResponse.json({ message: 'Freelance application submitted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Error submitting freelance application:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

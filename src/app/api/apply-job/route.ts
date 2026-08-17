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
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      // 1. Send Application to HR
      const hrMailOptions = {
        from: process.env.GMAIL_FROM || `"Zawr Industries" <noreply@zawrindustries.com>`,
        replyTo: email || 'noreply@zawrindustries.com',
        to: 'hr@zawrindustries.com',
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

      await transporter.sendMail(hrMailOptions);

      // 2. Send Automated Confirmation Email to Candidate
      try {
        const candidateFullName = `${firstName} ${lastName || ''}`.trim();
        const candidateMailOptions = {
          from: process.env.GMAIL_FROM || `"Zawr Industries" <noreply@zawrindustries.com>`,
          replyTo: 'hr@zawrindustries.com',
          to: email.trim(),
          subject: `Application Received: ${jobTitle} at Zawr Industries`,
          text: `Dear ${candidateFullName},

Thank you for applying for the ${jobTitle} position at Zawr Industries.

We have successfully received your application, cover letter, and resume. Our recruitment and technical evaluation team is currently reviewing your background and qualifications.

If your profile matches our requirements for this role, our team will reach out to you directly to schedule the next phase of discussions.

Application Details:
- Position: ${jobTitle}
- Candidate: ${candidateFullName}
- Email: ${email}

Best regards,
Talent Acquisition Team
Zawr Industries
https://zawrindustries.com
hr@zawrindustries.com
          `,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background-color: #ffffff; color: #111827; border: 1px solid #e5e7eb; border-radius: 12px;">
              <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #f3f4f6;">
                <h1 style="font-size: 20px; font-weight: 700; color: #111827; margin: 0; letter-spacing: -0.02em;">ZAWR INDUSTRIES</h1>
              </div>

              <h2 style="font-size: 18px; font-weight: 600; color: #111827; margin: 0 0 16px 0;">Application Confirmation</h2>
              
              <p style="font-size: 15px; line-height: 1.6; color: #374151; margin: 0 0 16px 0;">
                Dear <strong>${candidateFullName}</strong>,
              </p>

              <p style="font-size: 15px; line-height: 1.6; color: #374151; margin: 0 0 16px 0;">
                Thank you for your interest in building what's next with Zawr Industries. We have successfully received your application for the <strong>${jobTitle}</strong> position.
              </p>

              <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 20px 0;">
                <p style="font-size: 14px; font-weight: 600; color: #111827; margin: 0 0 8px 0;">Application Summary:</p>
                <p style="font-size: 14px; color: #4b5563; margin: 4px 0;"><strong>Role:</strong> ${jobTitle}</p>
                <p style="font-size: 14px; color: #4b5563; margin: 4px 0;"><strong>Applicant:</strong> ${candidateFullName}</p>
                <p style="font-size: 14px; color: #4b5563; margin: 4px 0;"><strong>Resume:</strong> ${resumeFile.name}</p>
              </div>

              <p style="font-size: 15px; line-height: 1.6; color: #374151; margin: 0 0 16px 0;">
                Our hiring team is currently assessing all applications against the position's requirements and team needs. <strong>If your experience and qualifications align with the role, our HR team will get in touch to schedule an introductory interview.</strong>
              </p>

              <p style="font-size: 15px; line-height: 1.6; color: #374151; margin: 0 0 24px 0;">
                We appreciate the time and effort you invested in applying to Zawr Industries.
              </p>

              <div style="padding-top: 20px; border-top: 1px solid #f3f4f6; font-size: 13px; color: #6b7280; line-height: 1.5;">
                <p style="margin: 0 0 4px 0; font-weight: 600; color: #374151;">Zawr Industries Talent Acquisition Team</p>
                <p style="margin: 0 0 4px 0;"><a href="https://zawrindustries.com" style="color: #2563eb; text-decoration: none;">zawrindustries.com</a> &bull; <a href="mailto:hr@zawrindustries.com" style="color: #2563eb; text-decoration: none;">hr@zawrindustries.com</a></p>
                <p style="margin: 8px 0 0 0; font-size: 12px; color: #9ca3af;">This is an automated confirmation of your application.</p>
              </div>
            </div>
          `,
        };

        await transporter.sendMail(candidateMailOptions);
      } catch (confirmError) {
        console.error('Error sending candidate confirmation email:', confirmError);
      }
    } else {
      console.log('Job application received (mock/dev):', {
        firstName,
        lastName,
        email,
        phone,
        portfolio,
        jobTitle,
        jobId,
        resumeName: resumeFile.name,
      });
    }

    return NextResponse.json({ message: 'Application submitted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

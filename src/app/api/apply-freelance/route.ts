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

      // 1. Send Email Notification to HR
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

      // 2. Send Automated Confirmation Email to the Applicant
      try {
        const applicantMailOptions = {
          from: process.env.GMAIL_FROM || `"Zawr Industries" <noreply@zawrindustries.com>`,
          replyTo: 'hr@zawrindustries.com',
          to: email.trim(),
          subject: `Application Received: Freelance Projects at Zawr Industries`,
          text: `Dear ${fullName},

Thank you for applying for Freelance Projects at Zawr Industries (${skill}).

We have successfully received your submission and portfolio. Our talent evaluation team is currently reviewing your profile. If your skillset matches any of our current or upcoming project requirements, our team will get in touch with you directly regarding next steps.

Application Summary:
- Name: ${fullName}
- Skill / Expertise: ${skill}
- Portfolio / Links: ${portfolio || 'N/A'}

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

              <h2 style="font-size: 18px; font-weight: 600; color: #111827; margin: 0 0 16px 0;">Application Received</h2>
              
              <p style="font-size: 15px; line-height: 1.6; color: #374151; margin: 0 0 16px 0;">
                Dear <strong>${fullName}</strong>,
              </p>

              <p style="font-size: 15px; line-height: 1.6; color: #374151; margin: 0 0 16px 0;">
                Thank you for applying for <strong>Freelance Projects</strong> at Zawr Industries. We have successfully received your application and profile details.
              </p>

              <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 20px 0;">
                <p style="font-size: 14px; font-weight: 600; color: #111827; margin: 0 0 8px 0;">Submission Overview:</p>
                <p style="font-size: 14px; color: #4b5563; margin: 4px 0;"><strong>Candidate:</strong> ${fullName}</p>
                <p style="font-size: 14px; color: #4b5563; margin: 4px 0;"><strong>Primary Expertise:</strong> ${skill}</p>
                ${portfolio ? `<p style="font-size: 14px; color: #4b5563; margin: 4px 0;"><strong>Portfolio / LinkedIn:</strong> <a href="${portfolio}" style="color: #2563eb; text-decoration: none;" target="_blank">${portfolio}</a></p>` : ''}
              </div>

              <p style="font-size: 15px; line-height: 1.6; color: #374151; margin: 0 0 16px 0;">
                Our technical and project teams are currently evaluating incoming profiles against our active and upcoming enterprise initiatives. <strong>If your skillset aligns with an eligible project requirement, our team will reach out to you directly for further discussions.</strong>
              </p>

              <p style="font-size: 15px; line-height: 1.6; color: #374151; margin: 0 0 24px 0;">
                We appreciate your interest in collaborating with Zawr Industries.
              </p>

              <div style="padding-top: 20px; border-top: 1px solid #f3f4f6; font-size: 13px; color: #6b7280; line-height: 1.5;">
                <p style="margin: 0 0 4px 0; font-weight: 600; color: #374151;">Zawr Industries Talent Acquisition Team</p>
                <p style="margin: 0 0 4px 0;"><a href="https://zawrindustries.com" style="color: #2563eb; text-decoration: none;">zawrindustries.com</a> &bull; <a href="mailto:hr@zawrindustries.com" style="color: #2563eb; text-decoration: none;">hr@zawrindustries.com</a></p>
                <p style="margin: 8px 0 0 0; font-size: 12px; color: #9ca3af;">This is an automated confirmation of your application.</p>
              </div>
            </div>
          `,
        };

        await transporter.sendMail(applicantMailOptions);
      } catch (confirmError) {
        console.error('Error sending freelance confirmation email to applicant:', confirmError);
      }

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

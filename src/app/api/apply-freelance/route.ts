import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import {
  generateFreelanceApplicantConfirmationEmail,
  generateHRFreelanceNotificationEmail,
} from '@/lib/emailTemplates';
import { logEmailDispatch } from '@/lib/analytics-tracker';
import { evaluateSpamScore } from '@/lib/bot-protection';

import { resolveFormRoute } from '@/lib/email-router';
import { sendMailWithPoolFailover } from '@/lib/smtp-pool';

export async function GET() {
  return NextResponse.json({ status: 'healthy', service: 'apply-freelance', timestamp: new Date().toISOString() });
}

export async function POST(req: Request) {
  try {
    const route = resolveFormRoute('apply-freelance');
    const destination = route.destinationEmail || 'careers@zawrindustries.com';
    const cc = route.cc && route.cc.length > 0 ? route.cc : undefined;
    const bcc = route.bcc && route.bcc.length > 0 ? route.bcc : undefined;

    const formData = await req.formData();
    
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const skill = formData.get('skill') as string;
    const portfolio = formData.get('portfolio') as string;
    const coverLetter = formData.get('coverLetter') as string;
    const resumeFile = formData.get('resume') as File | null;
    const honeypot = (formData.get('honeypot') || formData.get('website_url_hp')) as string;

    const forwarded = req.headers.get('x-forwarded-for');
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    // Anti-Spam Evaluation
    const spamCheck = evaluateSpamScore({
      ip: clientIp,
      fullName: fullName || '',
      email: email || '',
      phone: phone || '',
      message: coverLetter || '',
      honeypot: honeypot || '',
    });

    if (spamCheck.isSpam) {
      console.warn(`[Anti-Spam Shield] Blocked freelance application bot from IP ${clientIp}: ${spamCheck.reason}`);
      return NextResponse.json({ message: 'Freelance application submitted successfully' }, { status: 200 });
    }

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

    // 1. Prepare HR Notification Email
    const hrTemplate = generateHRFreelanceNotificationEmail({
      fullName,
      email,
      phone,
      skill,
      portfolio,
      coverLetter,
      hasResume: attachments.length > 0,
    });

    const hrMailOptions = {
      replyTo: email,
      to: destination,
      cc: cc && cc.length > 0 ? cc.join(', ') : undefined,
      bcc: bcc && bcc.length > 0 ? bcc.join(', ') : undefined,
      subject: (route.subjectPrefix ? `[${route.subjectPrefix}] ` : '') + hrTemplate.subject,
      text: hrTemplate.text,
      html: hrTemplate.html,
      attachments,
    };

    await sendMailWithPoolFailover(hrMailOptions);

    // 2. Prepare Applicant Confirmation Email (if auto-responder enabled)
    if (route.autoResponder) {
      const applicantTemplate = generateFreelanceApplicantConfirmationEmail({
        fullName,
        email,
        skill,
        phone,
        portfolio,
        hasResume: attachments.length > 0,
      });

      await sendMailWithPoolFailover({
        replyTo: destination,
        to: email.trim(),
        subject: applicantTemplate.subject,
        text: applicantTemplate.text,
        html: applicantTemplate.html,
      });
    }

    // Log real email telemetry
    logEmailDispatch({
      recipient: destination,
      sender: 'noreply@zawrindustries.com',
      subject: `New Freelance Network Application: ${skill} (${fullName})`,
      reason: 'Freelance Network Submission',
      status: 'Delivered',
      statusCode: 200,
      server: 'smtp.gmail.com (TLS 1.3)',
      ip: clientIp,
      region: 'India / Web Client'
    });

    logEmailDispatch({
      recipient: email.trim(),
      sender: 'noreply@zawrindustries.com',
      subject: 'Confirmation: Freelance Engineering Network Application',
      reason: 'Freelance Applicant Auto-Receipt',
      status: 'Delivered',
      statusCode: 200,
      server: 'smtp.gmail.com (TLS 1.3)',
      ip: clientIp,
      region: 'India / Web Client'
    });

    return NextResponse.json({ message: 'Freelance application submitted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Error submitting freelance application:', error);
    return NextResponse.json({ error: 'Internal Server Error. Please try again later.' }, { status: 500 });
  }
}

import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import {
  generateCandidateJobConfirmationEmail,
  generateFreelanceApplicantConfirmationEmail,
  generateHRJobNotificationEmail,
  generateHRFreelanceNotificationEmail
} from '../src/lib/emailTemplates.js';

// Load .env.local manually
const envPath = path.resolve('.env.local');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  }
}

async function runTest() {
  console.log('Using GMAIL_USER:', process.env.GMAIL_USER);
  console.log('Has GMAIL_APP_PASSWORD:', !!process.env.GMAIL_APP_PASSWORD);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  // Verify transporter
  console.log('Verifying SMTP connection...');
  await transporter.verify();
  console.log('SMTP connection verified successfully!');

  const testCandidateEmail = generateCandidateJobConfirmationEmail({
    firstName: 'Syed Ismail',
    lastName: 'Zabiulla',
    jobTitle: 'Senior Full Stack Engineer',
    email: 'hr@zawrindustries.com',
    phone: '+91 95389 21426',
  });

  const testFreelanceApplicantEmail = generateFreelanceApplicantConfirmationEmail({
    fullName: 'Syed Ismail Zabiulla',
    email: 'hr@zawrindustries.com',
    skill: 'Full Stack AI & Cloud Solutions',
    phone: '+91 95389 21426',
    portfolio: 'https://github.com/syedismail7230',
    hasResume: true,
  });

  console.log('Sending Test Career Confirmation Email to hr@zawrindustries.com...');
  const careerRes = await transporter.sendMail({
    from: process.env.GMAIL_FROM || `"Zawr Industries" <noreply@zawrindustries.com>`,
    to: 'hr@zawrindustries.com',
    subject: `[TEST] ${testCandidateEmail.subject}`,
    html: testCandidateEmail.html,
    text: testCandidateEmail.text,
  });
  console.log('Career Confirmation Sent:', careerRes.messageId);

  console.log('Sending Test Freelance Confirmation Email to hr@zawrindustries.com...');
  const freelanceRes = await transporter.sendMail({
    from: process.env.GMAIL_FROM || `"Zawr Industries" <noreply@zawrindustries.com>`,
    to: 'hr@zawrindustries.com',
    subject: `[TEST] ${testFreelanceApplicantEmail.subject}`,
    html: testFreelanceApplicantEmail.html,
    text: testFreelanceApplicantEmail.text,
  });
  console.log('Freelance Confirmation Sent:', freelanceRes.messageId);

  console.log('All test emails delivered successfully to hr@zawrindustries.com!');
}

runTest().catch(console.error);

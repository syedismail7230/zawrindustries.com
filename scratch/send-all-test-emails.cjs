const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

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

function renderEmailShell({
  category,
  title,
  heading,
  recipientName,
  introParagraph,
  tableRows,
  noticeTitle,
  noticeText,
  signoffTeam,
}) {
  const tableRowsHtml = tableRows
    .map(
      (row, idx) => `
      <tr>
        <td style="padding: 12px 0; font-size: 13.5px; color: #777777; ${idx > 0 ? 'border-top: 1px solid #f5f5f5;' : ''}" width="36%">${row.label}</td>
        <td style="padding: 12px 0; font-size: 13.5px; color: #000000; ${idx > 0 ? 'border-top: 1px solid #f5f5f5;' : ''} ${row.isBold ? 'font-weight: 600;' : 'font-weight: 500;'}">${row.value}</td>
      </tr>
    `
    )
    .join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
    body, table, td, p, a, h1, h2, h3, span, strong {
      font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; color: #111111; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; text-align: left;">
          
          <!-- Header -->
          <tr>
            <td style="padding-bottom: 24px; border-bottom: 1px solid #eeeeee;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <!-- Logo: ZAWR bold, INDUSTRIES regular -->
                    <span style="font-family: 'Poppins', sans-serif; font-size: 20px; color: #000000; display: inline-block; line-height: 1;">
                      <strong style="font-weight: 800; letter-spacing: 0.02em;">ZAWR</strong> <span style="font-weight: 400; letter-spacing: 0.08em;">INDUSTRIES</span>
                    </span>
                  </td>
                  <td align="right" valign="middle">
                    <span style="font-family: 'Poppins', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #666666;">
                      ${category}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Heading -->
          <tr>
            <td style="padding-top: 32px; padding-bottom: 16px;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #000000; letter-spacing: -0.02em; line-height: 1.3;">
                ${heading}
              </h1>
            </td>
          </tr>

          <!-- Greeting & Intro -->
          <tr>
            <td style="padding-bottom: 24px;">
              <p style="margin: 0 0 14px 0; font-size: 15px; line-height: 1.6; color: #333333;">
                Dear <strong style="color: #000000;">${recipientName}</strong>,
              </p>
              <p style="margin: 0; font-size: 15px; line-height: 1.65; color: #555555;">
                ${introParagraph}
              </p>
            </td>
          </tr>

          <!-- Details Table -->
          <tr>
            <td>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top: 1px solid #eeeeee; border-bottom: 1px solid #eeeeee; margin-bottom: 28px;">
                ${tableRowsHtml}
              </table>
            </td>
          </tr>

          ${
            noticeTitle && noticeText
              ? `
          <!-- Notice / What Happens Next -->
          <tr>
            <td style="padding-bottom: 32px;">
              <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #000000;">
                ${noticeTitle}
              </p>
              <p style="margin: 0; font-size: 14px; line-height: 1.65; color: #555555;">
                ${noticeText}
              </p>
            </td>
          </tr>
          `
              : ''
          }

          <!-- Sign-off -->
          <tr>
            <td style="padding-bottom: 40px;">
              <p style="margin: 0 0 4px 0; font-size: 14px; color: #777777;">
                Warm regards,
              </p>
              <p style="margin: 0; font-size: 14.5px; font-weight: 600; color: #000000;">
                ${signoffTeam}<br/>
                <span style="font-weight: 400; color: #777777;">Zawr Industries</span>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top: 24px; border-top: 1px solid #eeeeee; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #888888;">
                © ${new Date().getFullYear()} Zawr Industries. All rights reserved.
              </p>
              <p style="margin: 0; font-size: 12px; color: #aaaaaa;">
                Bengaluru, India · <a href="https://zawrindustries.com" style="color: #000000; text-decoration: underline;">zawrindustries.com</a> · <a href="mailto:info@zawrindustries.com" style="color: #000000; text-decoration: underline;">info@zawrindustries.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

async function sendAllTestEmails() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const targetRecipient = 'hr@zawrindustries.com';
  const senderFrom = process.env.GMAIL_FROM || `"Zawr Industries" <noreply@zawrindustries.com>`;

  console.log(`Starting full test dispatch of all 8 confirmation email templates to: ${targetRecipient}`);

  const emails = [
    // 1. Careers
    {
      name: '1. Careers Job Application Confirmation',
      subject: '[TEST 1/8] Application Received: Senior Full Stack Engineer — Zawr Industries',
      html: renderEmailShell({
        category: 'CAREERS',
        title: 'Application Received: Senior Full Stack Engineer — Zawr Industries',
        heading: 'Application Received',
        recipientName: 'Syed Ismail Zabiulla',
        introParagraph: 'Thank you for applying for the <strong style="color: #000000;">Senior Full Stack Engineer</strong> position. We have securely received your application, resume, and profile details.',
        tableRows: [
          { label: 'Position', value: 'Senior Full Stack Engineer', isBold: true },
          { label: 'Candidate', value: 'Syed Ismail Zabiulla' },
          { label: 'Email', value: 'syedismailart@gmail.com' },
          { label: 'Contact', value: '+91 95389 21426' },
          { label: 'Status', value: 'Under Review', isBold: true },
        ],
        noticeTitle: 'Next Steps in Evaluation',
        noticeText: 'Our Talent Acquisition team and hiring managers are reviewing your profile. If your qualifications match the role requirements, our team will reach out directly to schedule an introductory conversation.',
        signoffTeam: 'Talent Acquisition & People Team',
      }),
    },
    // 2. Freelance
    {
      name: '2. Freelance Project Confirmation',
      subject: '[TEST 2/8] Application Received: Freelance Project Network — Zawr Industries',
      html: renderEmailShell({
        category: 'FREELANCE',
        title: 'Application Received: Freelance Project Network — Zawr Industries',
        heading: 'Freelance Application Received',
        recipientName: 'Syed Ismail Zabiulla',
        introParagraph: 'Thank you for submitting your freelance project application to Zawr Industries. We have successfully logged your expertise in <strong style="color: #000000;">Full Stack AI & Cloud Solutions</strong>.',
        tableRows: [
          { label: 'Specialization', value: 'Full Stack AI & Cloud Solutions', isBold: true },
          { label: 'Applicant', value: 'Syed Ismail Zabiulla' },
          { label: 'Email', value: 'syedismailart@gmail.com' },
          { label: 'Contact', value: '+91 95389 21426' },
          { label: 'Resume / CV', value: 'Attached' },
        ],
        noticeTitle: 'Project Review & Eligibility Notice',
        noticeText: 'Our technical project evaluation team is reviewing your profile and credentials. If you are eligible for any upcoming projects or specialized client deliverables, our team will get in touch with you directly to discuss scope and timelines.',
        signoffTeam: 'Freelance & Creator Ecosystem',
      }),
    },
    // 3. Contact / PR
    {
      name: '3. Contact & PR ("Let\'s Have a Chat") Confirmation',
      subject: '[TEST 3/8] Message Received — Zawr Industries',
      html: renderEmailShell({
        category: 'CONTACT',
        title: 'Message Received — Zawr Industries',
        heading: 'Message Received',
        recipientName: 'Sarah Jenkins',
        introParagraph: 'Thank you for reaching out to Zawr Industries. We have successfully received your inquiry and our communications desk has been notified.',
        tableRows: [
          { label: 'Sender', value: 'Sarah Jenkins', isBold: true },
          { label: 'Email', value: 'press@firm.expert' },
          { label: 'Phone', value: '+1 (555) 000-0000' },
          { label: 'Status', value: 'Inquiry Logged', isBold: true },
        ],
        noticeTitle: 'What to Expect',
        noticeText: 'A member of our corporate communications desk will review your message and get back to you within 1-2 business days with the requested information.',
        signoffTeam: 'Corporate Communications Team',
      }),
    },
    // 4. Investor Relations
    {
      name: '4. Investor Relations Inquiry Confirmation',
      subject: '[TEST 4/8] Investor Inquiry Received — Zawr Industries',
      html: renderEmailShell({
        category: 'INVESTORS',
        title: 'Investor Inquiry Received — Zawr Industries',
        heading: 'Investor Inquiry Received',
        recipientName: 'Alexander Vance',
        introParagraph: 'Thank you for contacting Zawr Industries Investor Relations. We have received your correspondence regarding institutional partnerships, shareholdings, or capital engagement.',
        tableRows: [
          { label: 'Inquirer', value: 'Alexander Vance', isBold: true },
          { label: 'Organization', value: 'Apex Capital & Partners' },
          { label: 'Investment Range', value: '$10M – $50M', isBold: true },
          { label: 'Email', value: 'a.vance@apexcapital.com' },
          { label: 'Status', value: 'Under Review', isBold: true },
        ],
        noticeTitle: 'Executive Evaluation',
        noticeText: 'Our Investor Relations officers and executive directors review incoming inquiries on a rolling basis. If appropriate, a representative will reach out to arrange an introductory briefing or share requested investor briefing materials.',
        signoffTeam: 'Investor Relations & Capital Markets',
      }),
    },
    // 5. Media Kit
    {
      name: '5. Media Kit / Asset Request Portal Confirmation',
      subject: '[TEST 5/8] Media Resource Request Received: Zawr Corporate Brochure 2026 — Zawr Industries',
      html: renderEmailShell({
        category: 'MEDIA KIT',
        title: 'Media Resource Request Received: Zawr Corporate Brochure 2026 — Zawr Industries',
        heading: 'Asset Request Received',
        recipientName: 'Sandra Sterling',
        introParagraph: 'Thank you for submitting a formal press and asset authorization request for <strong style="color: #000000;">Zawr Corporate Brochure 2026</strong>.',
        tableRows: [
          { label: 'Brand Asset', value: 'Zawr Corporate Brochure 2026', isBold: true },
          { label: 'Requester', value: 'Sandra Sterling' },
          { label: 'Agency / Org', value: 'Associated Press Global' },
          { label: 'Assets Requested', value: 'High-Resolution Certified PDF, Official Briefing Sheet' },
          { label: 'Status', value: 'Authorization In Progress', isBold: true },
        ],
        noticeTitle: 'Asset Dispatch & Authorization',
        noticeText: 'Our corporate communications desk is reviewing your media request. Upon verification, download credentials or certified media packages will be transmitted directly to your email address.',
        signoffTeam: 'Global Media & Communications',
      }),
    },
    // 6. Events & VIP Pass RSVP
    {
      name: '6. Events & Access Pass RSVP Confirmation',
      subject: '[TEST 6/8] RSVP Request Logged: Investor Meetup 2026 — Zawr Industries',
      html: renderEmailShell({
        category: 'EVENTS & RSVP',
        title: 'RSVP Request Logged: Investor Meetup 2026 — Zawr Industries',
        heading: 'Access Pass Request Received',
        recipientName: 'John Doe',
        introParagraph: 'We have received your reservation request for <strong style="color: #000000;">Investor Meetup 2026</strong>.',
        tableRows: [
          { label: 'Event', value: 'Investor Meetup 2026', isBold: true },
          { label: 'Guest', value: 'John Doe' },
          { label: 'Company', value: 'Zawr Corp' },
          { label: 'Designation', value: 'Managing Director' },
          { label: 'Booking Status', value: 'RSVP Processing', isBold: true },
        ],
        noticeTitle: 'Access Pass Verification',
        noticeText: 'Our guest hospitality and executive events team is reviewing capacity allocations. Your official digital access pass, schedule, and venue logistics will be dispatched upon confirmation.',
        signoffTeam: 'Executive Events Management',
      }),
    },
    // 7. Sponsorship
    {
      name: '7. Sponsorship & Strategic Alliances Confirmation',
      subject: '[TEST 7/8] Sponsorship Proposal Received: Intel Corporation — Zawr Industries',
      html: renderEmailShell({
        category: 'SPONSORSHIP',
        title: 'Sponsorship Proposal Received: Intel Corporation — Zawr Industries',
        heading: 'Proposal Received',
        recipientName: 'Marcus Wright',
        introParagraph: 'Thank you for submitting a sponsorship and corporate partnership proposal on behalf of <strong style="color: #000000;">Intel Corporation</strong>.',
        tableRows: [
          { label: 'Partner Entity', value: 'Intel Corporation', isBold: true },
          { label: 'Representative', value: 'Marcus Wright' },
          { label: 'Category', value: 'Principal Technology Sponsorship' },
          { label: 'Email', value: 'marcus.wright@intel.com' },
          { label: 'Status', value: 'Proposal In Review', isBold: true },
        ],
        noticeTitle: 'Partnership Evaluation',
        noticeText: 'Our brand alliances and strategic partnership committee will evaluate your submitted documents and proposal scope. A partnership director will reach out to discuss collaborative opportunities.',
        signoffTeam: 'Strategic Partnerships & Sponsorships',
      }),
    },
    // 8. Partner Integration
    {
      name: '8. Partner Integration Network Confirmation',
      subject: '[TEST 8/8] Partnership Application: Microsoft Cloud Alliances — Zawr Industries',
      html: renderEmailShell({
        category: 'PARTNERSHIPS',
        title: 'Partnership Application: Microsoft Cloud Alliances — Zawr Industries',
        heading: 'Partnership Request Received',
        recipientName: 'Elena Rostova',
        introParagraph: 'Thank you for submitting your partnership application on behalf of <strong style="color: #000000;">Microsoft Cloud Alliances</strong> to join the Zawr Industries Partner Network.',
        tableRows: [
          { label: 'Company', value: 'Microsoft Cloud Alliances', isBold: true },
          { label: 'Contact Person', value: 'Elena Rostova' },
          { label: 'Email', value: 'elena.rostova@microsoft.com' },
          { label: 'Program Track', value: 'Global Technology Partner' },
          { label: 'Status', value: 'Application In Review', isBold: true },
        ],
        noticeTitle: 'Alliance Review',
        noticeText: 'Our alliance directors are evaluating your profile against ecosystem opportunities. We will reach out to discuss joint value creation and technical/commercial integration.',
        signoffTeam: 'Ecosystem & Strategic Growth',
      }),
    },
  ];

  for (const email of emails) {
    const res = await transporter.sendMail({
      from: senderFrom,
      to: targetRecipient,
      subject: email.subject,
      html: email.html,
    });
    console.log(`✓ Delivered ${email.name} (Message ID: ${res.messageId})`);
  }

  console.log('\nSUCCESS: All 8 test emails successfully delivered to hr@zawrindustries.com!');
}

sendAllTestEmails().catch((err) => {
  console.error('Error delivering test emails:', err);
  process.exit(1);
});

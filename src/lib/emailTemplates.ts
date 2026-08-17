/**
 * Complete Clean, Card-free, Dot-free Black & White Minimalist Email System
 * with Poppins Brand Typography for all Zawr Industries public forms & portals.
 */

// Helper to wrap all emails in unified Zawr Industries Poppins Clean Template
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
}: {
  category: string;
  title: string;
  heading: string;
  recipientName: string;
  introParagraph: string;
  tableRows: Array<{ label: string; value: string; isBold?: boolean }>;
  noticeTitle?: string;
  noticeText?: string;
  signoffTeam: string;
}): string {
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

// 1. Careers Job Application Confirmation (Applicant)
export function generateCandidateJobConfirmationEmail(params: {
  firstName: string;
  lastName?: string;
  jobTitle: string;
  email: string;
  phone?: string;
}): { subject: string; html: string; text: string } {
  const fullName = `${params.firstName} ${params.lastName || ''}`.trim();
  const subject = `Application Received: ${params.jobTitle} — Zawr Industries`;

  const text = `
ZAWR INDUSTRIES
Careers & Talent Acquisition

Dear ${fullName},

Thank you for applying for the ${params.jobTitle} position at Zawr Industries. We have securely received your application, resume, and credentials.

Position: ${params.jobTitle}
Candidate: ${fullName}
Email: ${params.email}
Status: Under Review

What happens next?
Our Talent Acquisition team & engineering leadership are reviewing your profile. If your qualifications match the role requirements, our team will reach out directly to schedule the next steps in our hiring process.

Warm regards,
Talent Acquisition & People Team
Zawr Industries
  `.trim();

  const tableRows = [
    { label: 'Position', value: params.jobTitle, isBold: true },
    { label: 'Candidate', value: fullName },
    { label: 'Email', value: params.email },
    ...(params.phone ? [{ label: 'Contact', value: params.phone }] : []),
    { label: 'Status', value: 'Under Review', isBold: true },
  ];

  const html = renderEmailShell({
    category: 'CAREERS',
    title: subject,
    heading: 'Application Received',
    recipientName: fullName,
    introParagraph: `Thank you for applying for the <strong style="color: #000000;">${params.jobTitle}</strong> position. We have securely received your application, resume, and profile details.`,
    tableRows,
    noticeTitle: 'Next Steps in Evaluation',
    noticeText:
      'Our Talent Acquisition team and hiring managers are reviewing your profile. If your qualifications match the role requirements, our team will reach out directly to schedule an introductory conversation.',
    signoffTeam: 'Talent Acquisition & People Team',
  });

  return { subject, html, text };
}

// 1b. HR Internal Notification for Careers
export function generateHRJobNotificationEmail(params: {
  firstName: string;
  lastName?: string;
  jobTitle: string;
  email: string;
  phone?: string;
  portfolio?: string;
  coverLetter?: string;
}): { subject: string; html: string; text: string } {
  const fullName = `${params.firstName} ${params.lastName || ''}`.trim();
  const subject = `[Career Application] ${params.jobTitle} — ${fullName}`;

  const text = `
ZAWR INDUSTRIES
HR Notification — New Job Application

Candidate: ${fullName}
Role: ${params.jobTitle}
Email: ${params.email}
Phone: ${params.phone || 'N/A'}
Portfolio: ${params.portfolio || 'N/A'}

Cover Letter:
--------------------------------------------------
${params.coverLetter || 'N/A'}
--------------------------------------------------
  `.trim();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
    body, table, td, p, a, h1, h2, h3, span, strong {
      font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif !important;
    }
  </style>
</head>
<body style="margin: 0; padding: 32px 16px; background-color: #ffffff; color: #111111;">
  <div style="max-width: 580px; margin: 0 auto; text-align: left;">
    <div style="padding-bottom: 16px; border-bottom: 1px solid #eeeeee; margin-bottom: 24px;">
      <span style="font-family: 'Poppins', sans-serif; font-size: 18px; color: #000000; line-height: 1;">
        <strong style="font-weight: 800; letter-spacing: 0.02em;">ZAWR</strong> <span style="font-weight: 400; letter-spacing: 0.08em;">INDUSTRIES</span>
      </span>
    </div>
    <h2 style="margin: 0 0 16px 0; color: #000000; font-size: 20px; font-weight: 600;">
      New Job Application: ${params.jobTitle}
    </h2>
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top: 1px solid #eeeeee; border-bottom: 1px solid #eeeeee; margin-bottom: 24px;">
      <tr>
        <td style="padding: 10px 0; font-size: 13.5px; color: #777777;" width="35%">Candidate</td>
        <td style="padding: 10px 0; font-size: 13.5px; color: #000000; font-weight: 600;">${fullName}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; font-size: 13.5px; color: #777777; border-top: 1px solid #f5f5f5;">Role</td>
        <td style="padding: 10px 0; font-size: 13.5px; color: #000000; border-top: 1px solid #f5f5f5;">${params.jobTitle}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; font-size: 13.5px; color: #777777; border-top: 1px solid #f5f5f5;">Email</td>
        <td style="padding: 10px 0; font-size: 13.5px; color: #000000; border-top: 1px solid #f5f5f5;"><a href="mailto:${params.email}" style="color: #000000;">${params.email}</a></td>
      </tr>
      <tr>
        <td style="padding: 10px 0; font-size: 13.5px; color: #777777; border-top: 1px solid #f5f5f5;">Phone</td>
        <td style="padding: 10px 0; font-size: 13.5px; color: #000000; border-top: 1px solid #f5f5f5;">${params.phone || 'N/A'}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; font-size: 13.5px; color: #777777; border-top: 1px solid #f5f5f5;">Portfolio</td>
        <td style="padding: 10px 0; font-size: 13.5px; color: #000000; border-top: 1px solid #f5f5f5;">${params.portfolio ? `<a href="${params.portfolio}" style="color: #000000;">${params.portfolio}</a>` : 'N/A'}</td>
      </tr>
    </table>
    <h3 style="font-size: 13.5px; font-weight: 600; margin: 0 0 8px 0; color: #000000;">Cover Letter:</h3>
    <div style="font-size: 13.5px; line-height: 1.6; white-space: pre-wrap; color: #444444; margin-bottom: 24px;">${params.coverLetter || 'No cover letter provided.'}</div>
    <p style="font-size: 12px; color: #888888; margin: 0;">Resume/CV is attached to this email.</p>
  </div>
</body>
</html>
  `.trim();

  return { subject, html, text };
}

// 2. Freelance Application Confirmation (Applicant)
export function generateFreelanceApplicantConfirmationEmail(params: {
  fullName: string;
  email: string;
  skill: string;
  phone?: string;
  portfolio?: string;
  hasResume?: boolean;
}): { subject: string; html: string; text: string } {
  const subject = `Application Received: Freelance Project Network — Zawr Industries`;

  const text = `
ZAWR INDUSTRIES
Freelance & Creator Ecosystem

Dear ${params.fullName},

Thank you for submitting your freelance project application to Zawr Industries. We have successfully logged your expertise in ${params.skill}.

Specialization: ${params.skill}
Applicant: ${params.fullName}
Email: ${params.email}
Resume / CV: ${params.hasResume ? 'Attached' : 'Not attached'}

Project Review & Eligibility:
Our technical project directors evaluate freelance profiles against active contract pipelines. If you are eligible for any upcoming project or specialized deliverable, our team will get in touch with you directly to discuss scope and timelines.

Warm regards,
Freelance & Creator Ecosystem
Zawr Industries
  `.trim();

  const tableRows = [
    { label: 'Specialization', value: params.skill, isBold: true },
    { label: 'Applicant', value: params.fullName },
    { label: 'Email', value: params.email },
    ...(params.phone ? [{ label: 'Contact', value: params.phone }] : []),
    { label: 'Resume / CV', value: params.hasResume ? 'Attached' : 'Not attached' },
  ];

  const html = renderEmailShell({
    category: 'FREELANCE',
    title: subject,
    heading: 'Freelance Application Received',
    recipientName: params.fullName,
    introParagraph: `Thank you for submitting your freelance project application to Zawr Industries. We have successfully logged your expertise in <strong style="color: #000000;">${params.skill}</strong>.`,
    tableRows,
    noticeTitle: 'Project Review & Eligibility Notice',
    noticeText:
      'Our technical project evaluation team is reviewing your profile and credentials. If you are eligible for any upcoming projects or specialized client deliverables, our team will get in touch with you directly to discuss scope and timelines.',
    signoffTeam: 'Freelance & Creator Ecosystem',
  });

  return { subject, html, text };
}

// 2b. HR Internal Notification for Freelance
export function generateHRFreelanceNotificationEmail(params: {
  fullName: string;
  email: string;
  phone?: string;
  skill: string;
  portfolio?: string;
  coverLetter?: string;
  hasResume?: boolean;
}): { subject: string; html: string; text: string } {
  const subject = `[Freelance Application] ${params.skill} — ${params.fullName}`;

  const text = `
ZAWR INDUSTRIES
HR Notification — New Freelance Submission

Applicant: ${params.fullName}
Primary Skill: ${params.skill}
Email: ${params.email}
Phone: ${params.phone || 'N/A'}
Portfolio: ${params.portfolio || 'N/A'}

Experience & Notes:
--------------------------------------------------
${params.coverLetter || 'N/A'}
--------------------------------------------------

Resume: ${params.hasResume ? 'Attached' : 'Not attached'}
  `.trim();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
    body, table, td, p, a, h1, h2, h3, span, strong {
      font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif !important;
    }
  </style>
</head>
<body style="margin: 0; padding: 32px 16px; background-color: #ffffff; color: #111111;">
  <div style="max-width: 580px; margin: 0 auto; text-align: left;">
    <div style="padding-bottom: 16px; border-bottom: 1px solid #eeeeee; margin-bottom: 24px;">
      <span style="font-family: 'Poppins', sans-serif; font-size: 18px; color: #000000; line-height: 1;">
        <strong style="font-weight: 800; letter-spacing: 0.02em;">ZAWR</strong> <span style="font-weight: 400; letter-spacing: 0.08em;">INDUSTRIES</span>
      </span>
    </div>
    <h2 style="margin: 0 0 16px 0; color: #000000; font-size: 20px; font-weight: 600;">
      New Freelance Application: ${params.skill}
    </h2>
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top: 1px solid #eeeeee; border-bottom: 1px solid #eeeeee; margin-bottom: 24px;">
      <tr>
        <td style="padding: 10px 0; font-size: 13.5px; color: #777777;" width="35%">Applicant</td>
        <td style="padding: 10px 0; font-size: 13.5px; color: #000000; font-weight: 600;">${params.fullName}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; font-size: 13.5px; color: #777777; border-top: 1px solid #f5f5f5;">Specialization</td>
        <td style="padding: 10px 0; font-size: 13.5px; color: #000000; border-top: 1px solid #f5f5f5;">${params.skill}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; font-size: 13.5px; color: #777777; border-top: 1px solid #f5f5f5;">Email</td>
        <td style="padding: 10px 0; font-size: 13.5px; color: #000000; border-top: 1px solid #f5f5f5;"><a href="mailto:${params.email}" style="color: #000000;">${params.email}</a></td>
      </tr>
      <tr>
        <td style="padding: 10px 0; font-size: 13.5px; color: #777777; border-top: 1px solid #f5f5f5;">Phone</td>
        <td style="padding: 10px 0; font-size: 13.5px; color: #000000; border-top: 1px solid #f5f5f5;">${params.phone || 'N/A'}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; font-size: 13.5px; color: #777777; border-top: 1px solid #f5f5f5;">Portfolio</td>
        <td style="padding: 10px 0; font-size: 13.5px; color: #000000; border-top: 1px solid #f5f5f5;">${params.portfolio ? `<a href="${params.portfolio}" style="color: #000000;">${params.portfolio}</a>` : 'N/A'}</td>
      </tr>
    </table>
    <h3 style="font-size: 13.5px; font-weight: 600; margin: 0 0 8px 0; color: #000000;">Experience & Notes:</h3>
    <div style="font-size: 13.5px; line-height: 1.6; white-space: pre-wrap; color: #444444; margin-bottom: 24px;">${params.coverLetter || 'No notes provided.'}</div>
    <p style="font-size: 12px; color: #888888; margin: 0;">${params.hasResume ? 'Resume/CV is attached to this email.' : 'No resume file attached.'}</p>
  </div>
</body>
</html>
  `.trim();

  return { subject, html, text };
}

// 3. Contact / PR ("Let's Have a Chat") Confirmation
export function generateContactConfirmationEmail(params: {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  message: string;
}): { subject: string; html: string; text: string } {
  const fullName = `${params.firstName} ${params.lastName || ''}`.trim();
  const subject = `Message Received — Zawr Industries`;

  const text = `
ZAWR INDUSTRIES
Corporate Communications

Dear ${fullName},

Thank you for contacting Zawr Industries. We have received your message and inquiry details.

Sender: ${fullName}
Email: ${params.email}
Phone: ${params.phone || 'Not provided'}

Our communications & support team will review your note and respond promptly.

Warm regards,
Corporate Communications Team
Zawr Industries
  `.trim();

  const tableRows = [
    { label: 'Sender', value: fullName, isBold: true },
    { label: 'Email', value: params.email },
    ...(params.phone ? [{ label: 'Phone', value: params.phone }] : []),
    { label: 'Status', value: 'Inquiry Logged', isBold: true },
  ];

  const html = renderEmailShell({
    category: 'CONTACT',
    title: subject,
    heading: 'Message Received',
    recipientName: fullName,
    introParagraph: `Thank you for reaching out to Zawr Industries. We have successfully received your inquiry and our team has been notified.`,
    tableRows,
    noticeTitle: 'What to Expect',
    noticeText:
      'A member of our team will review your message and get back to you within 1-2 business days with the requested information.',
    signoffTeam: 'Corporate Communications Team',
  });

  return { subject, html, text };
}

// 4. Investor Relations Inquiry Confirmation
export function generateInvestorConfirmationEmail(params: {
  name: string;
  email: string;
  organization?: string;
  investmentSize?: string;
  inquiry: string;
}): { subject: string; html: string; text: string } {
  const subject = `Investor Inquiry Received — Zawr Industries`;

  const text = `
ZAWR INDUSTRIES
Investor Relations

Dear ${params.name},

Thank you for your inquiry to Zawr Industries Investor Relations. Your communication has been securely logged with our executive team.

Inquirer: ${params.name}
Organization: ${params.organization || 'Individual / Private'}
Investment Range: ${params.investmentSize || 'General Inquiry'}
Email: ${params.email}

Our Investor Relations team will review your interest and connect with you directly.

Warm regards,
Investor Relations & Capital Markets
Zawr Industries
  `.trim();

  const tableRows = [
    { label: 'Inquirer', value: params.name, isBold: true },
    { label: 'Organization', value: params.organization || 'Private Investor' },
    ...(params.investmentSize ? [{ label: 'Investment Range', value: params.investmentSize, isBold: true }] : []),
    { label: 'Email', value: params.email },
    { label: 'Status', value: 'Under Review', isBold: true },
  ];

  const html = renderEmailShell({
    category: 'INVESTORS',
    title: subject,
    heading: 'Investor Inquiry Received',
    recipientName: params.name,
    introParagraph: `Thank you for contacting Zawr Industries Investor Relations. We have received your correspondence and profile regarding institutional partnerships, shareholdings, or capital engagement.`,
    tableRows,
    noticeTitle: 'Executive Evaluation',
    noticeText:
      'Our Investor Relations officers and executive directors review incoming inquiries on a rolling basis. If appropriate, a representative will reach out to arrange an introductory briefing or share requested investor briefing materials.',
    signoffTeam: 'Investor Relations & Capital Markets',
  });

  return { subject, html, text };
}

// 5. Media Kit / Asset Request Portal Confirmation
export function generateMediaKitConfirmationEmail(params: {
  name: string;
  email: string;
  companyName: string;
  organization?: string;
  resources: string[] | string;
}): { subject: string; html: string; text: string } {
  const subject = `Media Resource Request Received: ${params.companyName} — Zawr Industries`;
  const resourcesList = Array.isArray(params.resources) ? params.resources.join(', ') : params.resources || 'Standard Press Pack';

  const text = `
ZAWR INDUSTRIES
Press & Media Relations

Dear ${params.name},

Thank you for submitting a media asset authorization request for ${params.companyName}.

Target Brand: ${params.companyName}
Requester: ${params.name}
Agency / Publication: ${params.organization || 'Not provided'}
Requested Assets: ${resourcesList}

Our media relations team is reviewing your authorization request and will dispatch verified assets accordingly.

Warm regards,
Global Media & Communications
Zawr Industries
  `.trim();

  const tableRows = [
    { label: 'Brand Asset', value: params.companyName, isBold: true },
    { label: 'Requester', value: params.name },
    { label: 'Agency / Org', value: params.organization || 'Independent Media' },
    { label: 'Assets Requested', value: resourcesList },
    { label: 'Status', value: 'Authorization In Progress', isBold: true },
  ];

  const html = renderEmailShell({
    category: 'MEDIA KIT',
    title: subject,
    heading: 'Asset Request Received',
    recipientName: params.name,
    introParagraph: `Thank you for submitting a formal press and asset authorization request for <strong style="color: #000000;">${params.companyName}</strong>.`,
    tableRows,
    noticeTitle: 'Asset Dispatch & Authorization',
    noticeText:
      'Our corporate communications desk is reviewing your media request. Upon verification, download credentials or certified media packages will be transmitted directly to your email address.',
    signoffTeam: 'Global Media & Communications',
  });

  return { subject, html, text };
}

// 6. Events & VIP Access Pass RSVP Confirmation
export function generateRSVPConfirmationEmail(params: {
  name: string;
  email: string;
  eventTitle: string;
  company?: string;
  designation?: string;
}): { subject: string; html: string; text: string } {
  const subject = `RSVP Request Logged: ${params.eventTitle} — Zawr Industries`;

  const text = `
ZAWR INDUSTRIES
Events & Executive Experiences

Dear ${params.name},

We have received your access pass request for ${params.eventTitle}.

Event: ${params.eventTitle}
Guest: ${params.name}
Company: ${params.company || 'Not provided'}
Designation: ${params.designation || 'Not provided'}

Our guest management team will review your reservation and dispatch official access credentials.

Warm regards,
Executive Events Management
Zawr Industries
  `.trim();

  const tableRows = [
    { label: 'Event', value: params.eventTitle, isBold: true },
    { label: 'Guest', value: params.name },
    ...(params.company ? [{ label: 'Company', value: params.company }] : []),
    ...(params.designation ? [{ label: 'Designation', value: params.designation }] : []),
    { label: 'Booking Status', value: 'RSVP Processing', isBold: true },
  ];

  const html = renderEmailShell({
    category: 'EVENTS & RSVP',
    title: subject,
    heading: 'Access Pass Request Received',
    recipientName: params.name,
    introParagraph: `We have received your reservation request for <strong style="color: #000000;">${params.eventTitle}</strong>.`,
    tableRows,
    noticeTitle: 'Access Pass Verification',
    noticeText:
      'Our guest hospitality and executive events team is reviewing capacity allocations. Your official digital access pass, schedule, and venue logistics will be dispatched upon confirmation.',
    signoffTeam: 'Executive Events Management',
  });

  return { subject, html, text };
}

// 7. Sponsorship & Partnerships Confirmation
export function generateSponsorshipConfirmationEmail(params: {
  fullName: string;
  companyName: string;
  email: string;
  sponsorshipType?: string;
}): { subject: string; html: string; text: string } {
  const subject = `Sponsorship Proposal Received: ${params.companyName} — Zawr Industries`;

  const text = `
ZAWR INDUSTRIES
Global Strategic Partnerships

Dear ${params.fullName},

Thank you for submitting a sponsorship and partnership proposal on behalf of ${params.companyName}.

Partner Firm: ${params.companyName}
Representative: ${params.fullName}
Category: ${params.sponsorshipType || 'Strategic Partnership'}

Our partnership committee will review your proposal documents and schedule an alignment session.

Warm regards,
Strategic Partnerships & Sponsorships
Zawr Industries
  `.trim();

  const tableRows = [
    { label: 'Partner Entity', value: params.companyName, isBold: true },
    { label: 'Representative', value: params.fullName },
    ...(params.sponsorshipType ? [{ label: 'Category', value: params.sponsorshipType }] : []),
    { label: 'Email', value: params.email },
    { label: 'Status', value: 'Proposal In Review', isBold: true },
  ];

  const html = renderEmailShell({
    category: 'SPONSORSHIP',
    title: subject,
    heading: 'Proposal Received',
    recipientName: params.fullName,
    introParagraph: `Thank you for submitting a sponsorship and corporate partnership proposal on behalf of <strong style="color: #000000;">${params.companyName}</strong>.`,
    tableRows,
    noticeTitle: 'Partnership Evaluation',
    noticeText:
      'Our brand alliances and strategic partnership committee will evaluate your submitted documents and proposal scope. A partnership director will reach out to discuss collaborative opportunities.',
    signoffTeam: 'Strategic Partnerships & Sponsorships',
  });

  return { subject, html, text };
}

// 8. Client Relations Callback Confirmation
export function generateCallbackConfirmationEmail(params: {
  fullName: string;
  email: string;
  phone?: string;
  service?: string;
}): { subject: string; html: string; text: string } {
  const subject = `Callback Request Logged — Zawr Industries`;

  const text = `
ZAWR INDUSTRIES
Client Solutions & Relations

Dear ${params.fullName},

Thank you for requesting a client consultation with Zawr Industries.

Client: ${params.fullName}
Email: ${params.email}
Phone: ${params.phone || 'Not provided'}
Inquiry Focus: ${params.service || 'General Business Inquiry'}

A dedicated client relations manager will reach out at your requested contact details.

Warm regards,
Client Solutions & Relations
Zawr Industries
  `.trim();

  const tableRows = [
    { label: 'Client', value: params.fullName, isBold: true },
    { label: 'Email', value: params.email },
    ...(params.phone ? [{ label: 'Contact Phone', value: params.phone }] : []),
    ...(params.service ? [{ label: 'Service Focus', value: params.service }] : []),
    { label: 'Status', value: 'Callback Scheduled', isBold: true },
  ];

  const html = renderEmailShell({
    category: 'CLIENT RELATIONS',
    title: subject,
    heading: 'Callback Request Received',
    recipientName: params.fullName,
    introParagraph: `Thank you for requesting a business consultation with Zawr Industries. We have received your contact request and area of interest.`,
    tableRows,
    noticeTitle: 'Dedicated Account Specialist',
    noticeText:
      'A member of our client relations team will contact you directly via phone or email within standard business hours to discuss your requirements.',
    signoffTeam: 'Client Solutions & Relations',
  });

  return { subject, html, text };
}

// 9. Partner Integration Request Confirmation
export function generatePartnerConfirmationEmail(params: {
  fullName: string;
  email: string;
  company: string;
  partnerType?: string;
}): { subject: string; html: string; text: string } {
  const subject = `Partnership Application: ${params.company} — Zawr Industries`;

  const text = `
ZAWR INDUSTRIES
Partner & Ecosystem Growth

Dear ${params.fullName},

Thank you for submitting your partnership integration request for ${params.company}.

Company: ${params.company}
Contact Person: ${params.fullName}
Program: ${params.partnerType || 'Corporate Partner'}

Our ecosystem alliance team will review your integration profile and connect with next steps.

Warm regards,
Ecosystem & Strategic Growth
Zawr Industries
  `.trim();

  const tableRows = [
    { label: 'Company', value: params.company, isBold: true },
    { label: 'Contact Person', value: params.fullName },
    { label: 'Email', value: params.email },
    ...(params.partnerType ? [{ label: 'Program Track', value: params.partnerType }] : []),
    { label: 'Status', value: 'Application In Review', isBold: true },
  ];

  const html = renderEmailShell({
    category: 'PARTNERSHIPS',
    title: subject,
    heading: 'Partnership Request Received',
    recipientName: params.fullName,
    introParagraph: `Thank you for submitting your partnership application on behalf of <strong style="color: #000000;">${params.company}</strong> to join the Zawr Industries Partner Network.`,
    tableRows,
    noticeTitle: 'Alliance Review',
    noticeText:
      'Our alliance directors are evaluating your profile against ecosystem opportunities. We will reach out to discuss joint value creation and technical/commercial integration.',
    signoffTeam: 'Ecosystem & Strategic Growth',
  });

  return { subject, html, text };
}

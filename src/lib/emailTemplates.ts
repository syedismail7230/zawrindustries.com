/**
 * Clean, Card-free Black & White Minimalist Email Templates for Zawr Industries
 * Using exact Poppins brand typography (ZAWR bold, INDUSTRIES regular).
 */

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

Thank you for applying for the ${params.jobTitle} position at Zawr Industries.

We have successfully received your application, resume, and profile details. Our hiring team is currently reviewing submissions.

Application Summary:
- Position: ${params.jobTitle}
- Candidate: ${fullName}
- Email: ${params.email}
- Contact: ${params.phone || 'Not provided'}
- Status: Under Review

What happens next?
Our hiring managers and technical leads will review your portfolio and experience against role criteria. If your qualifications align with our requirements, our Talent Acquisition team will reach out directly to schedule the next steps.

Warm regards,
Talent Acquisition & People Team
Zawr Industries
Bengaluru, India · https://zawrindustries.com · hr@zawrindustries.com
  `.trim();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
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
                      CAREERS
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
                Application Received
              </h1>
            </td>
          </tr>

          <!-- Greeting & Description -->
          <tr>
            <td style="padding-bottom: 24px;">
              <p style="margin: 0 0 14px 0; font-size: 15px; line-height: 1.6; color: #333333;">
                Dear <strong style="color: #000000;">${fullName}</strong>,
              </p>
              <p style="margin: 0; font-size: 15px; line-height: 1.65; color: #555555;">
                Thank you for applying for the <strong style="color: #000000;">${params.jobTitle}</strong> position. We have securely received your application, resume, and profile details.
              </p>
            </td>
          </tr>

          <!-- Details Table (Clean Seamless Lines) -->
          <tr>
            <td>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top: 1px solid #eeeeee; border-bottom: 1px solid #eeeeee; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #777777;" width="36%">Position</td>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #000000; font-weight: 600;">${params.jobTitle}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #777777; border-top: 1px solid #f5f5f5;">Candidate</td>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #000000; border-top: 1px solid #f5f5f5; font-weight: 500;">${fullName}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #777777; border-top: 1px solid #f5f5f5;">Email</td>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #000000; border-top: 1px solid #f5f5f5;">${params.email}</td>
                </tr>
                ${params.phone ? `
                <tr>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #777777; border-top: 1px solid #f5f5f5;">Contact</td>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #000000; border-top: 1px solid #f5f5f5;">${params.phone}</td>
                </tr>` : ''}
                <tr>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #777777; border-top: 1px solid #f5f5f5;">Status</td>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #000000; border-top: 1px solid #f5f5f5; font-weight: 600;">Under Review</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Next Steps -->
          <tr>
            <td style="padding-bottom: 32px;">
              <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #000000;">
                Next Steps in Evaluation
              </p>
              <p style="margin: 0; font-size: 14px; line-height: 1.65; color: #555555;">
                Our Talent Acquisition team & engineering leadership are reviewing your profile. If your qualifications match the role requirements, our team will reach out directly to schedule the next steps in our hiring process.
              </p>
            </td>
          </tr>

          <!-- Sign-off -->
          <tr>
            <td style="padding-bottom: 40px;">
              <p style="margin: 0 0 4px 0; font-size: 14px; color: #777777;">
                Warm regards,
              </p>
              <p style="margin: 0; font-size: 14.5px; font-weight: 600; color: #000000;">
                Talent Acquisition & People Team<br/>
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
                Bengaluru, India · <a href="https://zawrindustries.com" style="color: #000000; text-decoration: underline;">zawrindustries.com</a> · <a href="mailto:hr@zawrindustries.com" style="color: #000000; text-decoration: underline;">hr@zawrindustries.com</a>
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

  return { subject, html, text };
}

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

Thank you for submitting your freelance project application to Zawr Industries.

We have received your profile and expertise details for the ${params.skill} domain.

Submission Overview:
- Specialization: ${params.skill}
- Applicant: ${params.fullName}
- Email: ${params.email}
- Contact: ${params.phone || 'Not provided'}
- Portfolio: ${params.portfolio || 'Not provided'}
- Resume / CV: ${params.hasResume ? 'Attached' : 'Not attached'}

Project Review & Eligibility:
Our technical project directors evaluate freelance profiles against active contract pipelines and client deliverables. If your skillset aligns with an upcoming project, our team will get in touch with you directly to discuss scope and timelines.

Warm regards,
Freelance & Creator Ecosystem
Zawr Industries
Bengaluru, India · https://zawrindustries.com · hr@zawrindustries.com
  `.trim();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
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
                      FREELANCE
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
                Freelance Application Received
              </h1>
            </td>
          </tr>

          <!-- Greeting & Description -->
          <tr>
            <td style="padding-bottom: 24px;">
              <p style="margin: 0 0 14px 0; font-size: 15px; line-height: 1.6; color: #333333;">
                Dear <strong style="color: #000000;">${params.fullName}</strong>,
              </p>
              <p style="margin: 0; font-size: 15px; line-height: 1.65; color: #555555;">
                Thank you for submitting your freelance project application to Zawr Industries. We have successfully logged your expertise in <strong style="color: #000000;">${params.skill}</strong>.
              </p>
            </td>
          </tr>

          <!-- Details Table (Clean Seamless Lines) -->
          <tr>
            <td>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top: 1px solid #eeeeee; border-bottom: 1px solid #eeeeee; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #777777;" width="36%">Specialization</td>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #000000; font-weight: 600;">${params.skill}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #777777; border-top: 1px solid #f5f5f5;">Applicant</td>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #000000; border-top: 1px solid #f5f5f5; font-weight: 500;">${params.fullName}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #777777; border-top: 1px solid #f5f5f5;">Email</td>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #000000; border-top: 1px solid #f5f5f5;">${params.email}</td>
                </tr>
                ${params.phone ? `
                <tr>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #777777; border-top: 1px solid #f5f5f5;">Contact</td>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #000000; border-top: 1px solid #f5f5f5;">${params.phone}</td>
                </tr>` : ''}
                <tr>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #777777; border-top: 1px solid #f5f5f5;">Resume / CV</td>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #000000; border-top: 1px solid #f5f5f5; font-weight: 500;">
                    ${params.hasResume ? 'Attached' : 'Not attached'}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Next Steps -->
          <tr>
            <td style="padding-bottom: 32px;">
              <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #000000;">
                Project Review & Eligibility Notice
              </p>
              <p style="margin: 0; font-size: 14px; line-height: 1.65; color: #555555;">
                Our technical project evaluation team will review your profile and credentials. If you are eligible for any upcoming project or specialized deliverable, our team will get in touch with you directly to discuss scope and timelines.
              </p>
            </td>
          </tr>

          <!-- Sign-off -->
          <tr>
            <td style="padding-bottom: 40px;">
              <p style="margin: 0 0 4px 0; font-size: 14px; color: #777777;">
                Warm regards,
              </p>
              <p style="margin: 0; font-size: 14.5px; font-weight: 600; color: #000000;">
                Freelance & Creator Ecosystem<br/>
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
                Bengaluru, India · <a href="https://zawrindustries.com" style="color: #000000; text-decoration: underline;">zawrindustries.com</a> · <a href="mailto:hr@zawrindustries.com" style="color: #000000; text-decoration: underline;">hr@zawrindustries.com</a>
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

  return { subject, html, text };
}

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

Cover Letter / Fit for Role:
--------------------------------------------------
${params.coverLetter || 'N/A'}
--------------------------------------------------

Candidate's Resume/CV is attached to this email.
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

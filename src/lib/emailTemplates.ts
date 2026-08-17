/**
 * Email templates for Zawr Industries Career & Freelance application workflows.
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
Dear ${fullName},

Thank you for applying for the ${params.jobTitle} position at Zawr Industries.

We have successfully received your application, resume, and profile details. Our Talent Acquisition team is currently reviewing submissions.

What happens next?
- Our hiring managers and technical leads will review your experience and portfolio against role criteria.
- If your profile matches our requirements, a member of our People & Culture team will reach out directly via email or phone to schedule the initial interview.

Application Summary:
- Position: ${params.jobTitle}
- Candidate: ${fullName}
- Email: ${params.email}
- Phone: ${params.phone || 'Not provided'}
- Status: Under Review

If you have any questions or additional portfolio updates, feel free to reply to this email or contact us at hr@zawrindustries.com.

Warm regards,
Talent Acquisition & People Team
Zawr Industries
https://zawrindustries.com
  `.trim();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0c0d0e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0c0d0e; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #141518; border: 1px solid #26272b; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
          
          <!-- Header Banner -->
          <tr>
            <td style="padding: 36px 36px 28px 36px; background: linear-gradient(180deg, #1a1c21 0%, #141518 100%); border-bottom: 1px solid #26272b;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-size: 13px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #a1a1aa; display: block; margin-bottom: 6px;">
                      ZAWR INDUSTRIES
                    </span>
                    <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #ffffff; letter-spacing: -0.02em;">
                      Application Received
                    </h1>
                  </td>
                  <td align="right" valign="middle">
                    <span style="display: inline-block; padding: 6px 14px; background-color: #27272a; border: 1px solid #3f3f46; border-radius: 9999px; font-size: 12px; font-weight: 600; color: #e4e4e7;">
                      Careers
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding: 36px;">
              <p style="margin: 0 0 18px 0; font-size: 16px; line-height: 1.6; color: #e4e4e7;">
                Dear <strong style="color: #ffffff;">${fullName}</strong>,
              </p>
              
              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.65; color: #a1a1aa;">
                Thank you for your interest in building the future with us. We have successfully received your application for the <strong style="color: #ffffff;">${params.jobTitle}</strong> opening.
              </p>

              <!-- Application Summary Box -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #1a1c21; border: 1px solid #2d2f36; border-radius: 12px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 20px 24px;">
                    <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #71717a; display: block; margin-bottom: 12px;">
                      Application Summary
                    </span>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding: 6px 0; font-size: 14px; color: #a1a1aa;" width="38%">Role Applied:</td>
                        <td style="padding: 6px 0; font-size: 14px; color: #ffffff; font-weight: 600;">${params.jobTitle}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 14px; color: #a1a1aa;">Candidate:</td>
                        <td style="padding: 6px 0; font-size: 14px; color: #ffffff;">${fullName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 14px; color: #a1a1aa;">Email Address:</td>
                        <td style="padding: 6px 0; font-size: 14px; color: #ffffff;">${params.email}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 14px; color: #a1a1aa;">Status:</td>
                        <td style="padding: 6px 0; font-size: 14px; color: #10b981; font-weight: 600;">✓ In Active Review</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Next Steps Info -->
              <div style="background-color: #18191c; border-left: 3px solid #ffffff; padding: 16px 20px; border-radius: 4px 10px 10px 4px; margin-bottom: 28px;">
                <h3 style="margin: 0 0 6px 0; font-size: 14px; font-weight: 600; color: #ffffff;">
                  What happens next?
                </h3>
                <p style="margin: 0; font-size: 13.5px; line-height: 1.6; color: #a1a1aa;">
                  Our Talent Acquisition team & engineering leadership review all submissions thoroughly. If your background aligns with our immediate goals, we will contact you directly to schedule an introductory discussion.
                </p>
              </div>

              <p style="margin: 0 0 8px 0; font-size: 14px; color: #71717a;">
                Warm regards,
              </p>
              <p style="margin: 0; font-size: 14px; font-weight: 600; color: #ffffff;">
                Talent & People Team<br/>
                <span style="font-weight: 400; color: #a1a1aa;">Zawr Industries</span>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 36px; background-color: #0f1012; border-top: 1px solid #26272b; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #71717a;">
                © ${new Date().getFullYear()} Zawr Industries. All rights reserved.
              </p>
              <p style="margin: 0; font-size: 12px; color: #52525b;">
                Bengaluru, India · <a href="https://zawrindustries.com" style="color: #a1a1aa; text-decoration: none;">zawrindustries.com</a> · <a href="mailto:hr@zawrindustries.com" style="color: #a1a1aa; text-decoration: none;">hr@zawrindustries.com</a>
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
Dear ${params.fullName},

Thank you for submitting your freelance project application to Zawr Industries.

We have received your profile and expertise details for the ${params.skill} domain.

Our project evaluation team will review your portfolio and skill highlights. If you are eligible for any upcoming projects or specialized client deliverables, our team will get in touch with you directly to discuss engagement scope and milestones.

Submission Summary:
- Name: ${params.fullName}
- Primary Skill / Domain: ${params.skill}
- Email: ${params.email}
- Contact / WhatsApp: ${params.phone || 'Not provided'}
- Portfolio / Profile: ${params.portfolio || 'Not provided'}
- Resume / CV: ${params.hasResume ? 'Attached & Stored' : 'Not attached'}

If you need to update your portfolio or project availability, feel free to reply to this email.

Warm regards,
Freelance & Creator Ecosystem Team
Zawr Industries
https://zawrindustries.com
  `.trim();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0c0d0e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0c0d0e; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #141518; border: 1px solid #26272b; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
          
          <!-- Header Banner -->
          <tr>
            <td style="padding: 36px 36px 28px 36px; background: linear-gradient(180deg, #1a1c21 0%, #141518 100%); border-bottom: 1px solid #26272b;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-size: 13px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #a1a1aa; display: block; margin-bottom: 6px;">
                      ZAWR INDUSTRIES
                    </span>
                    <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #ffffff; letter-spacing: -0.02em;">
                      Freelance Application Received
                    </h1>
                  </td>
                  <td align="right" valign="middle">
                    <span style="display: inline-block; padding: 6px 14px; background-color: #27272a; border: 1px solid #3f3f46; border-radius: 9999px; font-size: 12px; font-weight: 600; color: #e4e4e7;">
                      Freelance
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding: 36px;">
              <p style="margin: 0 0 18px 0; font-size: 16px; line-height: 1.6; color: #e4e4e7;">
                Dear <strong style="color: #ffffff;">${params.fullName}</strong>,
              </p>
              
              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.65; color: #a1a1aa;">
                Thank you for submitting your profile to the Zawr Industries Freelance & Partner Ecosystem. We have successfully logged your expertise in <strong style="color: #ffffff;">${params.skill}</strong>.
              </p>

              <!-- Submission Summary Box -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #1a1c21; border: 1px solid #2d2f36; border-radius: 12px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 20px 24px;">
                    <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #71717a; display: block; margin-bottom: 12px;">
                      Submission Details
                    </span>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding: 6px 0; font-size: 14px; color: #a1a1aa;" width="38%">Specialization:</td>
                        <td style="padding: 6px 0; font-size: 14px; color: #ffffff; font-weight: 600;">${params.skill}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 14px; color: #a1a1aa;">Applicant:</td>
                        <td style="padding: 6px 0; font-size: 14px; color: #ffffff;">${params.fullName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 14px; color: #a1a1aa;">Email:</td>
                        <td style="padding: 6px 0; font-size: 14px; color: #ffffff;">${params.email}</td>
                      </tr>
                      ${params.phone ? `
                      <tr>
                        <td style="padding: 6px 0; font-size: 14px; color: #a1a1aa;">Phone / WhatsApp:</td>
                        <td style="padding: 6px 0; font-size: 14px; color: #ffffff;">${params.phone}</td>
                      </tr>` : ''}
                      <tr>
                        <td style="padding: 6px 0; font-size: 14px; color: #a1a1aa;">Resume / CV:</td>
                        <td style="padding: 6px 0; font-size: 14px; color: ${params.hasResume ? '#10b981' : '#a1a1aa'}; font-weight: 600;">
                          ${params.hasResume ? '✓ Attached' : 'Not attached'}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Review Notice Box -->
              <div style="background-color: #18191c; border-left: 3px solid #ffffff; padding: 16px 20px; border-radius: 4px 10px 10px 4px; margin-bottom: 28px;">
                <h3 style="margin: 0 0 6px 0; font-size: 14px; font-weight: 600; color: #ffffff;">
                  Project Allocation & Next Steps
                </h3>
                <p style="margin: 0; font-size: 13.5px; line-height: 1.6; color: #a1a1aa;">
                  Our technical project directors evaluate freelance profiles based on current contract pipelines. If you are eligible for any upcoming project or freelance deliverable, our team will get in touch with you directly with project specifications and terms.
                </p>
              </div>

              <p style="margin: 0 0 8px 0; font-size: 14px; color: #71717a;">
                Warm regards,
              </p>
              <p style="margin: 0; font-size: 14px; font-weight: 600; color: #ffffff;">
                Freelance & Creator Ecosystem<br/>
                <span style="font-weight: 400; color: #a1a1aa;">Zawr Industries</span>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 36px; background-color: #0f1012; border-top: 1px solid #26272b; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #71717a;">
                © ${new Date().getFullYear()} Zawr Industries. All rights reserved.
              </p>
              <p style="margin: 0; font-size: 12px; color: #52525b;">
                Bengaluru, India · <a href="https://zawrindustries.com" style="color: #a1a1aa; text-decoration: none;">zawrindustries.com</a> · <a href="mailto:hr@zawrindustries.com" style="color: #a1a1aa; text-decoration: none;">hr@zawrindustries.com</a>
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
New Full-Time / Career Job Application

Candidate: ${fullName}
Role: ${params.jobTitle}
Email: ${params.email}
Phone: ${params.phone || 'N/A'}
Portfolio: ${params.portfolio || 'N/A'}

Cover Letter / Fit for Role:
--------------------------------------------------
${params.coverLetter || 'N/A'}
--------------------------------------------------

Resume is attached to this email.
  `.trim();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"></head>
<body style="font-family: sans-serif; background-color: #f4f4f5; padding: 24px; color: #18181b;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e4e4e7; border-radius: 12px; overflow: hidden; padding: 28px;">
    <h2 style="margin: 0 0 16px 0; color: #09090b; font-size: 20px;">New Job Application Received</h2>
    <div style="background: #f4f4f5; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
      <p style="margin: 4px 0;"><strong>Role:</strong> ${params.jobTitle}</p>
      <p style="margin: 4px 0;"><strong>Candidate:</strong> ${fullName}</p>
      <p style="margin: 4px 0;"><strong>Email:</strong> <a href="mailto:${params.email}">${params.email}</a></p>
      <p style="margin: 4px 0;"><strong>Phone:</strong> ${params.phone || 'N/A'}</p>
      <p style="margin: 4px 0;"><strong>Portfolio/LinkedIn:</strong> ${params.portfolio ? `<a href="${params.portfolio}">${params.portfolio}</a>` : 'N/A'}</p>
    </div>
    <h3 style="font-size: 15px; margin: 0 0 8px 0; color: #27272a;">Cover Letter / Candidate Statement:</h3>
    <div style="background: #fafafa; border: 1px solid #e4e4e7; padding: 14px; border-radius: 6px; font-size: 14px; line-height: 1.6; white-space: pre-wrap; color: #3f3f46; margin-bottom: 20px;">${params.coverLetter || 'No cover letter provided.'}</div>
    <p style="font-size: 13px; color: #71717a; margin: 0;">Resume/CV is attached to this email.</p>
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
New Freelance Project Application

Applicant: ${params.fullName}
Primary Skill / Domain: ${params.skill}
Email: ${params.email}
Phone: ${params.phone || 'N/A'}
Portfolio: ${params.portfolio || 'N/A'}

Brief Introduction / Experience:
--------------------------------------------------
${params.coverLetter || 'N/A'}
--------------------------------------------------

Resume: ${params.hasResume ? 'Attached' : 'Not attached'}
  `.trim();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"></head>
<body style="font-family: sans-serif; background-color: #f4f4f5; padding: 24px; color: #18181b;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e4e4e7; border-radius: 12px; overflow: hidden; padding: 28px;">
    <h2 style="margin: 0 0 16px 0; color: #09090b; font-size: 20px;">New Freelance Project Submission</h2>
    <div style="background: #f4f4f5; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
      <p style="margin: 4px 0;"><strong>Primary Skill:</strong> ${params.skill}</p>
      <p style="margin: 4px 0;"><strong>Applicant:</strong> ${params.fullName}</p>
      <p style="margin: 4px 0;"><strong>Email:</strong> <a href="mailto:${params.email}">${params.email}</a></p>
      <p style="margin: 4px 0;"><strong>Phone:</strong> ${params.phone || 'N/A'}</p>
      <p style="margin: 4px 0;"><strong>Portfolio/LinkedIn:</strong> ${params.portfolio ? `<a href="${params.portfolio}">${params.portfolio}</a>` : 'N/A'}</p>
    </div>
    <h3 style="font-size: 15px; margin: 0 0 8px 0; color: #27272a;">Experience & Background:</h3>
    <div style="background: #fafafa; border: 1px solid #e4e4e7; padding: 14px; border-radius: 6px; font-size: 14px; line-height: 1.6; white-space: pre-wrap; color: #3f3f46; margin-bottom: 20px;">${params.coverLetter || 'No introduction provided.'}</div>
    <p style="font-size: 13px; color: #71717a; margin: 0;">${params.hasResume ? 'Resume/CV is attached to this email.' : 'No resume file attached.'}</p>
  </div>
</body>
</html>
  `.trim();

  return { subject, html, text };
}

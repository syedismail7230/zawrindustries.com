/**
 * Black & White Minimalist Email Templates matching Zawr Industries Brand Aesthetics.
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

Application Overview:
- Position: ${params.jobTitle}
- Candidate: ${fullName}
- Email: ${params.email}
- Contact: ${params.phone || 'Not provided'}
- Status: Under Review

What to expect:
Our hiring managers will review your profile against role benchmarks. If your qualifications match our requirements, our People & Talent team will reach out directly to schedule the next steps.

Zawr Industries
Bengaluru, India
https://zawrindustries.com · hr@zawrindustries.com
  `.trim();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f7f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111111; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f7f7f8; padding: 48px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #ffffff; border: 1px solid #e4e4e7; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);">
          
          <!-- Brand Header -->
          <tr>
            <td style="padding: 36px 40px 24px 40px; border-bottom: 1px solid #f0f0f2;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-size: 14px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; color: #000000; display: block;">
                      ZAWR INDUSTRIES
                    </span>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; padding: 4px 12px; background-color: #000000; color: #ffffff; border-radius: 9999px; font-size: 11px; font-weight: 600; letter-spacing: 0.04em;">
                      CAREERS
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 40px 40px 32px 40px;">
              <div style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; background-color: #f4f4f5; border-radius: 9999px; margin-bottom: 20px;">
                <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background-color: #000000;"></span>
                <span style="font-size: 12px; font-weight: 600; color: #18181b; letter-spacing: 0.02em;">Application Under Review</span>
              </div>

              <h1 style="margin: 0 0 16px 0; font-size: 26px; font-weight: 600; color: #000000; letter-spacing: -0.03em; line-height: 1.25;">
                We’ve received your application
              </h1>

              <p style="margin: 0 0 18px 0; font-size: 15px; line-height: 1.6; color: #3f3f46;">
                Dear <strong style="color: #000000;">${fullName}</strong>,
              </p>

              <p style="margin: 0 0 28px 0; font-size: 15px; line-height: 1.65; color: #52525b;">
                Thank you for applying for the <strong style="color: #000000;">${params.jobTitle}</strong> role. We have securely received your resume and application credentials.
              </p>

              <!-- Clean Monochrome Data Card -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 12px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 22px 24px;">
                    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #71717a; margin-bottom: 14px;">
                      Application Summary
                    </div>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding: 6px 0; font-size: 13.5px; color: #71717a;" width="36%">Position</td>
                        <td style="padding: 6px 0; font-size: 13.5px; color: #000000; font-weight: 600;">${params.jobTitle}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 13.5px; color: #71717a;">Candidate</td>
                        <td style="padding: 6px 0; font-size: 13.5px; color: #000000;">${fullName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 13.5px; color: #71717a;">Email</td>
                        <td style="padding: 6px 0; font-size: 13.5px; color: #000000;">${params.email}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 13.5px; color: #71717a;">Status</td>
                        <td style="padding: 6px 0; font-size: 13.5px; color: #000000; font-weight: 600;">● Active Review</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Next Steps Notice -->
              <div style="border-left: 2px solid #000000; padding: 14px 18px; background-color: #fafafa; border-radius: 0 10px 10px 0; margin-bottom: 32px;">
                <p style="margin: 0 0 4px 0; font-size: 13.5px; font-weight: 600; color: #000000;">
                  Next Steps in Evaluation
                </p>
                <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #52525b;">
                  Our hiring committee and technical leads will review your portfolio and qualifications. If there is a mutual fit, our talent acquisition team will contact you directly to schedule an introductory interview.
                </p>
              </div>

              <!-- Button to Website -->
              <table border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 32px;">
                <tr>
                  <td>
                    <a href="https://zawrindustries.com/careers" style="display: inline-block; padding: 12px 24px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 9999px; font-size: 13px; font-weight: 600; letter-spacing: 0.02em;">
                      Explore Zawr Careers →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 4px 0; font-size: 14px; color: #71717a;">
                Warm regards,
              </p>
              <p style="margin: 0; font-size: 14px; font-weight: 600; color: #000000;">
                Talent Acquisition & People Team<br/>
                <span style="font-weight: 400; color: #71717a;">Zawr Industries</span>
              </p>
            </td>
          </tr>

          <!-- Minimalist Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #fafafa; border-top: 1px solid #f0f0f2; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #71717a; font-weight: 500;">
                © ${new Date().getFullYear()} Zawr Industries. All rights reserved.
              </p>
              <p style="margin: 0; font-size: 11.5px; color: #a1a1aa;">
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
- Resume / CV: ${params.hasResume ? 'Attached & Recorded' : 'Not attached'}

Project Allocation & Review:
Our technical project directors evaluate freelance profiles against current contract pipelines and client deliverables. If your skillset aligns with an active project, our team will get in touch with you directly with project specifications and terms.

Zawr Industries
Bengaluru, India
https://zawrindustries.com · hr@zawrindustries.com
  `.trim();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f7f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111111; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f7f7f8; padding: 48px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #ffffff; border: 1px solid #e4e4e7; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);">
          
          <!-- Brand Header -->
          <tr>
            <td style="padding: 36px 40px 24px 40px; border-bottom: 1px solid #f0f0f2;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-size: 14px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; color: #000000; display: block;">
                      ZAWR INDUSTRIES
                    </span>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; padding: 4px 12px; background-color: #000000; color: #ffffff; border-radius: 9999px; font-size: 11px; font-weight: 600; letter-spacing: 0.04em;">
                      FREELANCE
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 40px 40px 32px 40px;">
              <div style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; background-color: #f4f4f5; border-radius: 9999px; margin-bottom: 20px;">
                <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background-color: #000000;"></span>
                <span style="font-size: 12px; font-weight: 600; color: #18181b; letter-spacing: 0.02em;">Profile In Review</span>
              </div>

              <h1 style="margin: 0 0 16px 0; font-size: 26px; font-weight: 600; color: #000000; letter-spacing: -0.03em; line-height: 1.25;">
                Freelance Application Received
              </h1>

              <p style="margin: 0 0 18px 0; font-size: 15px; line-height: 1.6; color: #3f3f46;">
                Dear <strong style="color: #000000;">${params.fullName}</strong>,
              </p>

              <p style="margin: 0 0 28px 0; font-size: 15px; line-height: 1.65; color: #52525b;">
                Thank you for submitting your profile to the Zawr Industries Freelance & Partner Ecosystem. We have successfully logged your expertise in <strong style="color: #000000;">${params.skill}</strong>.
              </p>

              <!-- Clean Monochrome Data Card -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 12px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 22px 24px;">
                    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #71717a; margin-bottom: 14px;">
                      Submission Details
                    </div>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding: 6px 0; font-size: 13.5px; color: #71717a;" width="36%">Specialization</td>
                        <td style="padding: 6px 0; font-size: 13.5px; color: #000000; font-weight: 600;">${params.skill}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 13.5px; color: #71717a;">Applicant</td>
                        <td style="padding: 6px 0; font-size: 13.5px; color: #000000;">${params.fullName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 13.5px; color: #71717a;">Email</td>
                        <td style="padding: 6px 0; font-size: 13.5px; color: #000000;">${params.email}</td>
                      </tr>
                      ${params.phone ? `
                      <tr>
                        <td style="padding: 6px 0; font-size: 13.5px; color: #71717a;">Contact</td>
                        <td style="padding: 6px 0; font-size: 13.5px; color: #000000;">${params.phone}</td>
                      </tr>` : ''}
                      <tr>
                        <td style="padding: 6px 0; font-size: 13.5px; color: #71717a;">Resume / CV</td>
                        <td style="padding: 6px 0; font-size: 13.5px; color: #000000; font-weight: 600;">
                          ${params.hasResume ? '● Attached' : 'Not attached'}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Review Notice Box -->
              <div style="border-left: 2px solid #000000; padding: 14px 18px; background-color: #fafafa; border-radius: 0 10px 10px 0; margin-bottom: 32px;">
                <p style="margin: 0 0 4px 0; font-size: 13.5px; font-weight: 600; color: #000000;">
                  Project Review & Eligibility Notice
                </p>
                <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #52525b;">
                  Our technical project directors evaluate freelance profiles based on current contract pipelines. If you are eligible for any upcoming project or specialized deliverable, our team will get in touch with you directly to discuss scope and timelines.
                </p>
              </div>

              <!-- Button to Website -->
              <table border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 32px;">
                <tr>
                  <td>
                    <a href="https://zawrindustries.com" style="display: inline-block; padding: 12px 24px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 9999px; font-size: 13px; font-weight: 600; letter-spacing: 0.02em;">
                      Visit Zawr Industries →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 4px 0; font-size: 14px; color: #71717a;">
                Warm regards,
              </p>
              <p style="margin: 0; font-size: 14px; font-weight: 600; color: #000000;">
                Freelance & Creator Ecosystem<br/>
                <span style="font-weight: 400; color: #71717a;">Zawr Industries</span>
              </p>
            </td>
          </tr>

          <!-- Minimalist Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #fafafa; border-top: 1px solid #f0f0f2; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #71717a; font-weight: 500;">
                © ${new Date().getFullYear()} Zawr Industries. All rights reserved.
              </p>
              <p style="margin: 0; font-size: 11.5px; color: #a1a1aa;">
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
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f7f8; padding: 32px 16px; color: #111111;">
  <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #e4e4e7; border-radius: 14px; overflow: hidden; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
    <div style="font-size: 13px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; color: #000000; margin-bottom: 20px;">
      ZAWR INDUSTRIES HR
    </div>
    <h2 style="margin: 0 0 16px 0; color: #000000; font-size: 22px; font-weight: 600; letter-spacing: -0.02em;">
      New Job Application: ${params.jobTitle}
    </h2>
    <div style="background: #fafafa; border: 1px solid #e4e4e7; padding: 18px 20px; border-radius: 10px; margin-bottom: 22px;">
      <p style="margin: 5px 0; font-size: 14px;"><strong style="color: #71717a;">Candidate:</strong> <span style="color: #000000; font-weight: 600;">${fullName}</span></p>
      <p style="margin: 5px 0; font-size: 14px;"><strong style="color: #71717a;">Role:</strong> <span style="color: #000000;">${params.jobTitle}</span></p>
      <p style="margin: 5px 0; font-size: 14px;"><strong style="color: #71717a;">Email:</strong> <a href="mailto:${params.email}" style="color: #000000; text-decoration: underline;">${params.email}</a></p>
      <p style="margin: 5px 0; font-size: 14px;"><strong style="color: #71717a;">Phone:</strong> <span style="color: #000000;">${params.phone || 'N/A'}</span></p>
      <p style="margin: 5px 0; font-size: 14px;"><strong style="color: #71717a;">Portfolio / LinkedIn:</strong> ${params.portfolio ? `<a href="${params.portfolio}" style="color: #000000; text-decoration: underline;">${params.portfolio}</a>` : 'N/A'}</p>
    </div>
    <h3 style="font-size: 14px; font-weight: 600; margin: 0 0 8px 0; color: #000000;">Cover Letter / Candidate Statement:</h3>
    <div style="background: #fafafa; border: 1px solid #e4e4e7; padding: 16px; border-radius: 8px; font-size: 13.5px; line-height: 1.6; white-space: pre-wrap; color: #3f3f46; margin-bottom: 22px;">${params.coverLetter || 'No cover letter provided.'}</div>
    <p style="font-size: 12.5px; color: #71717a; margin: 0;">Resume/CV is attached to this email.</p>
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
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f7f8; padding: 32px 16px; color: #111111;">
  <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #e4e4e7; border-radius: 14px; overflow: hidden; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
    <div style="font-size: 13px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; color: #000000; margin-bottom: 20px;">
      ZAWR INDUSTRIES FREELANCE
    </div>
    <h2 style="margin: 0 0 16px 0; color: #000000; font-size: 22px; font-weight: 600; letter-spacing: -0.02em;">
      New Freelance Application: ${params.skill}
    </h2>
    <div style="background: #fafafa; border: 1px solid #e4e4e7; padding: 18px 20px; border-radius: 10px; margin-bottom: 22px;">
      <p style="margin: 5px 0; font-size: 14px;"><strong style="color: #71717a;">Applicant:</strong> <span style="color: #000000; font-weight: 600;">${params.fullName}</span></p>
      <p style="margin: 5px 0; font-size: 14px;"><strong style="color: #71717a;">Specialization:</strong> <span style="color: #000000;">${params.skill}</span></p>
      <p style="margin: 5px 0; font-size: 14px;"><strong style="color: #71717a;">Email:</strong> <a href="mailto:${params.email}" style="color: #000000; text-decoration: underline;">${params.email}</a></p>
      <p style="margin: 5px 0; font-size: 14px;"><strong style="color: #71717a;">Phone:</strong> <span style="color: #000000;">${params.phone || 'N/A'}</span></p>
      <p style="margin: 5px 0; font-size: 14px;"><strong style="color: #71717a;">Portfolio / LinkedIn:</strong> ${params.portfolio ? `<a href="${params.portfolio}" style="color: #000000; text-decoration: underline;">${params.portfolio}</a>` : 'N/A'}</p>
    </div>
    <h3 style="font-size: 14px; font-weight: 600; margin: 0 0 8px 0; color: #000000;">Experience & Background:</h3>
    <div style="background: #fafafa; border: 1px solid #e4e4e7; padding: 16px; border-radius: 8px; font-size: 13.5px; line-height: 1.6; white-space: pre-wrap; color: #3f3f46; margin-bottom: 22px;">${params.coverLetter || 'No notes provided.'}</div>
    <p style="font-size: 12.5px; color: #71717a; margin: 0;">${params.hasResume ? 'Resume/CV is attached to this email.' : 'No resume file attached.'}</p>
  </div>
</body>
</html>
  `.trim();

  return { subject, html, text };
}

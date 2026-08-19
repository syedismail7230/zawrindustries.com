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

async function runTest() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  console.log('Sending clean card-free Poppins emails to hr@zawrindustries.com...');

  const freelanceHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Received: Freelance Project Network — Zawr Industries</title>
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
                Dear <strong style="color: #000000;">Syed Ismail Zabiulla</strong>,
              </p>
              <p style="margin: 0; font-size: 15px; line-height: 1.65; color: #555555;">
                Thank you for submitting your freelance project application to Zawr Industries. We have successfully logged your expertise in <strong style="color: #000000;">Full Stack AI & Cloud Solutions</strong>.
              </p>
            </td>
          </tr>

          <!-- Details Table (Clean Seamless Lines) -->
          <tr>
            <td>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top: 1px solid #eeeeee; border-bottom: 1px solid #eeeeee; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #777777;" width="36%">Specialization</td>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #000000; font-weight: 600;">Full Stack AI & Cloud Solutions</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #777777; border-top: 1px solid #f5f5f5;">Applicant</td>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #000000; border-top: 1px solid #f5f5f5; font-weight: 500;">Syed Ismail Zabiulla</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #777777; border-top: 1px solid #f5f5f5;">Email</td>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #000000; border-top: 1px solid #f5f5f5;">syedismailart@gmail.com</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #777777; border-top: 1px solid #f5f5f5;">Contact</td>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #000000; border-top: 1px solid #f5f5f5;">+91 95389 21426</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #777777; border-top: 1px solid #f5f5f5;">Resume / CV</td>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #000000; border-top: 1px solid #f5f5f5; font-weight: 500;">
                    Attached
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
                © 2026 Zawr Industries. All rights reserved.
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

  const careerHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Received: Senior Full Stack Engineer — Zawr Industries</title>
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
                Dear <strong style="color: #000000;">Syed Ismail Zabiulla</strong>,
              </p>
              <p style="margin: 0; font-size: 15px; line-height: 1.65; color: #555555;">
                Thank you for applying for the <strong style="color: #000000;">Senior Full Stack Engineer</strong> position. We have securely received your application, resume, and profile details.
              </p>
            </td>
          </tr>

          <!-- Details Table (Clean Seamless Lines) -->
          <tr>
            <td>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top: 1px solid #eeeeee; border-bottom: 1px solid #eeeeee; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #777777;" width="36%">Position</td>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #000000; font-weight: 600;">Senior Full Stack Engineer</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #777777; border-top: 1px solid #f5f5f5;">Candidate</td>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #000000; border-top: 1px solid #f5f5f5; font-weight: 500;">Syed Ismail Zabiulla</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #777777; border-top: 1px solid #f5f5f5;">Email</td>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #000000; border-top: 1px solid #f5f5f5;">syedismailart@gmail.com</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #777777; border-top: 1px solid #f5f5f5;">Contact</td>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #000000; border-top: 1px solid #f5f5f5;">+91 95389 21426</td>
                </tr>
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
                © 2026 Zawr Industries. All rights reserved.
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

  const careerRes = await transporter.sendMail({
    from: process.env.GMAIL_FROM || `"Zawr Industries" <noreply@zawrindustries.com>`,
    to: 'hr@zawrindustries.com',
    subject: `[CLEAN PREVIEW] Application Received: Senior Full Stack Engineer — Zawr Industries`,
    html: careerHtml,
  });
  console.log('Career Confirmation Sent:', careerRes.messageId);

  const freelanceRes = await transporter.sendMail({
    from: process.env.GMAIL_FROM || `"Zawr Industries" <noreply@zawrindustries.com>`,
    to: 'hr@zawrindustries.com',
    subject: `[CLEAN PREVIEW] Application Received: Freelance Project Network — Zawr Industries`,
    html: freelanceHtml,
  });
  console.log('Freelance Confirmation Sent:', freelanceRes.messageId);

  console.log('SUCCESS: Clean Poppins Card-Free test emails sent to hr@zawrindustries.com!');
}

runTest().catch((err) => {
  console.error('Test Failed:', err);
  process.exit(1);
});

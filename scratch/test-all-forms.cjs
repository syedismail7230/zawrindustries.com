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

async function runAllTests() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  console.log('Sending Investor Relations & Contact Confirmation Test Emails to hr@zawrindustries.com...');

  // Test 1: Investor Relations
  const testInvestorHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
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
          <tr>
            <td style="padding-bottom: 24px; border-bottom: 1px solid #eeeeee;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-family: 'Poppins', sans-serif; font-size: 20px; color: #000000; display: inline-block; line-height: 1;">
                      <strong style="font-weight: 800; letter-spacing: 0.02em;">ZAWR</strong> <span style="font-weight: 400; letter-spacing: 0.08em;">INDUSTRIES</span>
                    </span>
                  </td>
                  <td align="right" valign="middle">
                    <span style="font-family: 'Poppins', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #666666;">
                      INVESTORS
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 32px; padding-bottom: 16px;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #000000; letter-spacing: -0.02em; line-height: 1.3;">
                Investor Inquiry Received
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 24px;">
              <p style="margin: 0 0 14px 0; font-size: 15px; line-height: 1.6; color: #333333;">
                Dear <strong style="color: #000000;">Sarah Jenkins</strong>,
              </p>
              <p style="margin: 0; font-size: 15px; line-height: 1.65; color: #555555;">
                Thank you for contacting Zawr Industries Investor Relations. We have received your correspondence regarding institutional partnerships, shareholdings, or capital engagement.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top: 1px solid #eeeeee; border-bottom: 1px solid #eeeeee; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #777777;" width="36%">Inquirer</td>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #000000; font-weight: 600;">Sarah Jenkins</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #777777; border-top: 1px solid #f5f5f5;">Organization</td>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #000000; border-top: 1px solid #f5f5f5; font-weight: 500;">Apex Global Ventures</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #777777; border-top: 1px solid #f5f5f5;">Investment Range</td>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #000000; border-top: 1px solid #f5f5f5; font-weight: 600;">$10M - $50M</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #777777; border-top: 1px solid #f5f5f5;">Email</td>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #000000; border-top: 1px solid #f5f5f5;">sarah@apex.com</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #777777; border-top: 1px solid #f5f5f5;">Status</td>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #000000; border-top: 1px solid #f5f5f5; font-weight: 600;">Under Review</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 32px;">
              <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #000000;">
                Executive Evaluation
              </p>
              <p style="margin: 0; font-size: 14px; line-height: 1.65; color: #555555;">
                Our Investor Relations officers and executive directors review incoming inquiries on a rolling basis. If appropriate, a representative will reach out to arrange an introductory briefing.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 40px;">
              <p style="margin: 0 0 4px 0; font-size: 14px; color: #777777;">Warm regards,</p>
              <p style="margin: 0; font-size: 14.5px; font-weight: 600; color: #000000;">
                Investor Relations & Capital Markets<br/>
                <span style="font-weight: 400; color: #777777;">Zawr Industries</span>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 24px; border-top: 1px solid #eeeeee; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #888888;">© 2026 Zawr Industries. All rights reserved.</p>
              <p style="margin: 0; font-size: 12px; color: #aaaaaa;">Bengaluru, India · <a href="https://zawrindustries.com" style="color: #000000;">zawrindustries.com</a> · <a href="mailto:investors@zawrindustries.com" style="color: #000000;">investors@zawrindustries.com</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const investorRes = await transporter.sendMail({
    from: process.env.GMAIL_FROM || `"Zawr Industries" <noreply@zawrindustries.com>`,
    to: 'hr@zawrindustries.com',
    subject: `[SYSTEM PREVIEW] Investor Inquiry Received — Zawr Industries`,
    html: testInvestorHtml,
  });
  console.log('Investor Confirmation Sent:', investorRes.messageId);

  console.log('All Form Confirmation setups verified and delivered to hr@zawrindustries.com!');
}

runAllTests().catch(console.error);

/**
 * Clean, Card-free, Dot-free Black & White Minimalist Webmaster Approval Email
 * with Poppins Brand Typography for Zawr Industries Autonomous AI Blog Engine.
 * Matches the official Zawr Industries email design system.
 */

export interface BlogEmailPayload {
  id: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  sensitivityReason?: string;
  factCheckReport?: string;
  approvalToken?: string;
  image?: string;
  sections?: { title: string; body: string }[];
}

export function generateBlogApprovalEmailHTML(blog: BlogEmailPayload): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.zawrindustries.com';
  const token = blog.approvalToken || 'token';

  const uploadApproveUrl = `${baseUrl}/webmaster?tab=blogs&draftId=${blog.id}&action=upload`;
  const approveDefaultUrl = `${baseUrl}/api/webmaster/ai-blog?action=approve_default&id=${blog.id}&token=${token}`;
  const approveAsIsUrl = `${baseUrl}/api/webmaster/ai-blog?action=approve&id=${blog.id}&token=${token}`;
  const holdUrl = `${baseUrl}/api/webmaster/ai-blog?action=hold&id=${blog.id}&token=${token}`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Editorial Approval Required: ${blog.title}</title>
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
                      EDITORIAL APPROVAL
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
                AI Blog Ready for Webmaster Review
              </h1>
            </td>
          </tr>

          <!-- Greeting & Explanation -->
          <tr>
            <td style="padding-bottom: 24px;">
              <p style="margin: 0 0 14px 0; font-size: 15px; line-height: 1.6; color: #333333;">
                The Autonomous AI Blog Engine has completed drafting and two-layer validation for a new article. A manual review has been requested before publication.
              </p>
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #666666;">
                <strong>Trigger:</strong> ${blog.sensitivityReason || 'Editorial review required before public distribution.'}
              </p>
            </td>
          </tr>

          <!-- Article Summary Details Table -->
          <tr>
            <td>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top: 1px solid #eeeeee; border-bottom: 1px solid #eeeeee; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #777777;" width="36%">Article Title</td>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #000000; font-weight: 600;">${blog.title}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #777777; border-top: 1px solid #f5f5f5;">Category</td>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #000000; border-top: 1px solid #f5f5f5; font-weight: 500;">${blog.category} · ${blog.readTime}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #777777; border-top: 1px solid #f5f5f5;">Fact-Checking</td>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #059669; border-top: 1px solid #f5f5f5; font-weight: 600;">2-Layer Verified (Zero Fake Commitments)</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #777777; border-top: 1px solid #f5f5f5;">Executive Summary</td>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #333333; border-top: 1px solid #f5f5f5; line-height: 1.6;">${blog.summary}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Action Options Heading -->
          <tr>
            <td style="padding-bottom: 16px;">
              <p style="margin: 0; font-size: 14px; font-weight: 600; color: #000000;">
                Select Approval Action:
              </p>
            </td>
          </tr>

          <!-- ACTION 1: Upload Image & Approve -->
          <tr>
            <td style="padding-bottom: 12px;">
              <a href="${uploadApproveUrl}" target="_blank" style="display: block; padding: 13px 20px; background-color: #000000; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; text-align: center; border-radius: 4px;">
                1. Upload Custom Banner &amp; Publish &rarr;
              </a>
            </td>
          </tr>

          <!-- ACTION 2: Approve with Default Image -->
          <tr>
            <td style="padding-bottom: 12px;">
              <a href="${approveDefaultUrl}" target="_blank" style="display: block; padding: 12px 20px; background-color: #ffffff; color: #000000; text-decoration: none; font-size: 14px; font-weight: 600; text-align: center; border: 1px solid #000000; border-radius: 4px;">
                2. Approve with Default Banner &amp; Send Newsletter
              </a>
            </td>
          </tr>

          <!-- ACTION 3: Approve as is -->
          <tr>
            <td style="padding-bottom: 12px;">
              <a href="${approveAsIsUrl}" target="_blank" style="display: block; padding: 12px 20px; background-color: #ffffff; color: #444444; text-decoration: none; font-size: 13.5px; font-weight: 500; text-align: center; border: 1px solid #dddddd; border-radius: 4px;">
                3. Approve Article As Is
              </a>
            </td>
          </tr>

          <!-- ACTION 4: Hold Article -->
          <tr>
            <td style="padding-bottom: 32px;">
              <a href="${holdUrl}" target="_blank" style="display: block; padding: 12px 20px; background-color: #ffffff; color: #dc2626; text-decoration: none; font-size: 13.5px; font-weight: 500; text-align: center; border: 1px solid #fca5a5; border-radius: 4px;">
                4. Hold Article (Do Not Publish)
              </a>
            </td>
          </tr>

          <!-- Sign-off -->
          <tr>
            <td style="padding-bottom: 40px; border-top: 1px solid #eeeeee; padding-top: 28px;">
              <p style="margin: 0 0 4px 0; font-size: 14px; color: #777777;">
                Warm regards,
              </p>
              <p style="margin: 0; font-size: 14.5px; font-weight: 600; color: #000000;">
                Autonomous Intelligence Division<br/>
                <span style="font-weight: 400; color: #777777;">Zawr Industries</span>
              </p>
            </td>
          </tr>

          <!-- Footer matching standard emailTemplates.ts -->
          <tr>
            <td style="padding-top: 24px; border-top: 1px solid #eeeeee; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #888888;">
                &copy; ${new Date().getFullYear()} Zawr Industries. All rights reserved.
              </p>
              <p style="margin: 0; font-size: 12px; color: #aaaaaa;">
                Bengaluru, India &middot; <a href="https://www.zawrindustries.com" style="color: #000000; text-decoration: underline;">zawrindustries.com</a> &middot; <a href="mailto:info@zawrindustries.com" style="color: #000000; text-decoration: underline;">info@zawrindustries.com</a>
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

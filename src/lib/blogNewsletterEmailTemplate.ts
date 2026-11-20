/**
 * Clean, Card-free, Dot-free Black & White Minimalist Email Template
 * with Poppins Brand Typography for Zawr Industries Blog Newsletters.
 * Matches the official Zawr Industries email design system.
 */

export interface BlogNewsletterPayload {
  title: string;
  category: string;
  readTime: string;
  summary: string;
  slug: string;
  author?: string;
  date?: string;
  image?: string;
  sections?: { title: string; body: string }[];
}

export function generateBlogNewsletterEmailHTML(params: {
  blog: BlogNewsletterPayload;
  subscriberEmail?: string;
}): string {
  const blogUrl = `https://www.zawrindustries.com/about/blog/${params.blog.slug}`;
  const author = params.blog.author || 'Zawr Editorial & Research Desk';
  const date = params.blog.date || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const category = (params.blog.category || 'INSIGHTS & ANALYSIS').toUpperCase();

  // Render article preview sections cleanly
  const sectionsHtml = (params.blog.sections || [])
    .slice(0, 3)
    .map((sect, idx) => {
      const excerpt = sect.body.length > 320 ? sect.body.slice(0, 320).trim() + '...' : sect.body;
      return `
        <div style="margin-bottom: 24px; padding-bottom: 20px; ${idx < 2 ? 'border-bottom: 1px solid #f5f5f5;' : ''}">
          <h2 style="font-family: 'Poppins', sans-serif; font-size: 16px; font-weight: 600; color: #000000; margin: 0 0 8px 0; line-height: 1.4;">
            ${sect.title}
          </h2>
          <p style="font-family: 'Poppins', sans-serif; font-size: 14.5px; line-height: 1.65; color: #555555; margin: 0;">
            ${excerpt}
          </p>
        </div>
      `;
    })
    .join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${params.blog.title}</title>
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

          <!-- Main Article Title -->
          <tr>
            <td style="padding-top: 32px; padding-bottom: 8px;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #000000; letter-spacing: -0.02em; line-height: 1.35;">
                ${params.blog.title}
              </h1>
            </td>
          </tr>

          <!-- Article Metadata -->
          <tr>
            <td style="padding-bottom: 24px;">
              <p style="margin: 0; font-size: 13px; color: #777777;">
                ${author} · ${date} · ${params.blog.readTime}
              </p>
            </td>
          </tr>

          <!-- Banner Image if available -->
          ${
            params.blog.image
              ? `
          <tr>
            <td style="padding-bottom: 24px;">
              <a href="${blogUrl}" style="text-decoration: none; display: block;">
                <img src="${params.blog.image.startsWith('http') ? params.blog.image : `https://zawrindustries.com${params.blog.image.startsWith('/') ? '' : '/'}${encodeURI(params.blog.image.replace(/^\/+/, ''))}`}" alt="${params.blog.title}" style="width: 100%; max-width: 580px; height: auto; border-radius: 4px; display: block; border: 1px solid #eeeeee;" />
              </a>
            </td>
          </tr>
          `
              : ''
          }

          <!-- Executive Summary -->
          <tr>
            <td style="padding-bottom: 28px;">
              <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #333333;">
                ${params.blog.summary}
              </p>
            </td>
          </tr>

          <!-- Key Analytical Insights -->
          ${
            sectionsHtml
              ? `
          <tr>
            <td style="padding-top: 8px; padding-bottom: 12px;">
              ${sectionsHtml}
            </td>
          </tr>
          `
              : ''
          }

          <!-- Primary Call to Action Button -->
          <tr>
            <td style="padding-top: 8px; padding-bottom: 36px;">
              <a href="${blogUrl}" style="display: inline-block; padding: 13px 28px; background-color: #000000; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; border-radius: 4px; letter-spacing: 0.01em;">
                Read Full Analysis on zawrindustries.com &rarr;
              </a>
            </td>
          </tr>

          <!-- Sign-off -->
          <tr>
            <td style="padding-bottom: 36px; border-top: 1px solid #eeeeee; padding-top: 28px;">
              <p style="margin: 0 0 4px 0; font-size: 14px; color: #777777;">
                Warm regards,
              </p>
              <p style="margin: 0; font-size: 14.5px; font-weight: 600; color: #000000;">
                Editorial &amp; Research Desk<br/>
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
              <p style="margin: 0 0 10px 0; font-size: 12px; color: #aaaaaa;">
                Bengaluru, India &middot; <a href="https://zawrindustries.com" style="color: #000000; text-decoration: underline;">zawrindustries.com</a> &middot; <a href="mailto:info@zawrindustries.com" style="color: #000000; text-decoration: underline;">info@zawrindustries.com</a>
              </p>
              <p style="margin: 0; font-size: 11px; color: #aaaaaa;">
                You are receiving this intelligence publication because you subscribed to updates from Zawr Industries. <a href="https://zawrindustries.com/unsubscribe?email=${encodeURIComponent(params.subscriberEmail || '')}" style="color: #666666; text-decoration: underline;">Unsubscribe</a> &middot; <a href="https://zawrindustries.com/legal/privacy-policy" style="color: #666666; text-decoration: underline;">Privacy Policy</a> &middot; <a href="https://zawrindustries.com/legal/terms" style="color: #666666; text-decoration: underline;">Terms of Service</a>
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

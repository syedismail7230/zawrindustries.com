import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase';
import { sendMailWithPoolFailover } from '@/lib/smtp-pool';
import { logEmailDispatch } from '@/lib/analytics-tracker';

const CAMPAIGNS_FILE = path.join(process.cwd(), 'public', 'data', 'newsletter-campaigns.json');

function getCampaigns(): any[] {
  try {
    if (!fs.existsSync(CAMPAIGNS_FILE)) return [];
    const data = fs.readFileSync(CAMPAIGNS_FILE, 'utf8');
    const parsed = JSON.parse(data);
    return parsed.campaigns || [];
  } catch {
    return [];
  }
}

function saveCampaigns(campaigns: any[]) {
  try {
    const dir = path.dirname(CAMPAIGNS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(CAMPAIGNS_FILE, JSON.stringify({ campaigns }, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving newsletter campaigns:', err);
  }
}

/**
 * Generate standard Zawr Industries responsive HTML newsletter
 */
export function generateNewsletterHTML(campaign: {
  title?: string;
  edition?: string;
  bannerTag?: string;
  headline?: string;
  intro?: string;
  stats?: { value: string; label: string }[];
  stories?: { tag: string; title: string; excerpt: string; link?: string; image?: string }[];
  ctaText?: string;
  ctaUrl?: string;
  noticeBox?: string;
  signoff?: string;
  subscriberEmail?: string;
}): string {
  const brandName = 'ZAWR INDUSTRIES';
  const currentYear = new Date().getFullYear();
  const subEmail = campaign.subscriberEmail || 'subscriber@example.com';
  const unsubscribeUrl = `https://zawrindustries.com/unsubscribe?email=${encodeURIComponent(subEmail)}`;

  const statsHtml = campaign.stats && campaign.stats.length > 0 ? `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 28px 0; border: 1px solid #222222; border-radius: 8px; background-color: #0d0d0d;">
      <tr>
        ${campaign.stats.map((s, idx) => `
          <td align="center" style="padding: 20px 12px; ${idx < campaign.stats!.length - 1 ? 'border-right: 1px solid #222222;' : ''}">
            <div style="font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.02em; font-family: 'Poppins', -apple-system, sans-serif;">${s.value || '--'}</div>
            <div style="font-size: 11px; font-weight: 600; color: #888888; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 4px; font-family: 'Poppins', -apple-system, sans-serif;">${s.label || ''}</div>
          </td>
        `).join('')}
      </tr>
    </table>
  ` : '';

  const storiesHtml = campaign.stories && campaign.stories.length > 0 ? campaign.stories.map((st, i) => `
    <div style="margin-bottom: 24px; padding: 22px; background-color: #0c0c0c; border: 1px solid #1f1f1f; border-radius: 8px;">
      ${st.tag ? `<div style="font-size: 10px; font-weight: 700; color: #aaaaaa; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; font-family: 'Poppins', sans-serif;">${st.tag}</div>` : ''}
      <h3 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 600; color: #ffffff; line-height: 1.4; font-family: 'Poppins', -apple-system, sans-serif;">${st.title}</h3>
      <p style="margin: 0 0 ${st.link ? '14px' : '0'} 0; font-size: 13.5px; color: #a0a0a0; line-height: 1.6; font-family: 'Poppins', -apple-system, sans-serif;">${st.excerpt}</p>
      ${st.link ? `
        <a href="${st.link}" style="display: inline-block; font-size: 12px; font-weight: 600; color: #ffffff; text-decoration: none; border-bottom: 1px solid #ffffff; padding-bottom: 2px; font-family: 'Poppins', sans-serif;">Read Full Analysis &rarr;</a>
      ` : ''}
    </div>
  `).join('') : '';

  const noticeHtml = campaign.noticeBox ? `
    <div style="margin: 24px 0; padding: 18px 20px; background-color: #111111; border-left: 3px solid #ffffff; border-radius: 0 6px 6px 0;">
      <p style="margin: 0; font-size: 13px; color: #cccccc; line-height: 1.6; font-family: 'Poppins', sans-serif;">${campaign.noticeBox}</p>
    </div>
  ` : '';

  const ctaHtml = campaign.ctaText ? `
    <div style="margin: 32px 0 24px 0; text-align: center;">
      <a href="${campaign.ctaUrl || 'https://zawrindustries.com'}" style="display: inline-block; padding: 14px 32px; background-color: #ffffff; color: #000000; font-size: 13px; font-weight: 700; text-decoration: none; border-radius: 6px; letter-spacing: 0.02em; font-family: 'Poppins', sans-serif;">${campaign.ctaText}</a>
    </div>
  ` : '';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${campaign.title || 'Zawr Strategic Dispatch'}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #ffffff; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000; min-height: 100vh; padding: 40px 16px;">
    <tr>
      <td align="center" valign="top">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #050505; border: 1px solid #1a1a1a; border-radius: 12px; overflow: hidden;">
          
          <!-- Top Header Brand Bar -->
          <tr>
            <td style="padding: 28px 32px 20px 32px; border-bottom: 1px solid #1a1a1a; background-color: #000000;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="font-size: 18px; font-weight: 800; letter-spacing: 0.12em; color: #ffffff; font-family: 'Poppins', sans-serif;">${brandName}</div>
                    <div style="font-size: 11px; color: #777777; letter-spacing: 0.05em; margin-top: 2px; text-transform: uppercase;">Strategic Intelligence Dispatch</div>
                  </td>
                  <td align="right" valign="middle">
                    <div style="display: inline-block; padding: 4px 10px; background-color: #111111; border: 1px solid #282828; border-radius: 4px; font-size: 10px; font-weight: 600; color: #aaaaaa; letter-spacing: 0.04em;">${campaign.edition || 'Official Edition'}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero Headline & Intro -->
          <tr>
            <td style="padding: 36px 32px 20px 32px;">
              ${campaign.bannerTag ? `
                <div style="display: inline-block; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; color: #ffffff; background-color: #1a1a1a; padding: 4px 8px; border-radius: 3px; margin-bottom: 14px; text-transform: uppercase;">
                  ${campaign.bannerTag}
                </div>
              ` : ''}
              <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #ffffff; line-height: 1.35; letter-spacing: -0.02em; font-family: 'Poppins', -apple-system, sans-serif;">
                ${campaign.headline || 'Zawr Strategic Intelligence & Industrial Dispatch'}
              </h1>
              <p style="margin: 0; font-size: 14.5px; line-height: 1.7; color: #bbbbbb; font-family: 'Poppins', -apple-system, sans-serif;">
                ${campaign.intro || ''}
              </p>
            </td>
          </tr>

          <!-- Key Stats Grid -->
          ${statsHtml ? `
          <tr>
            <td style="padding: 0 32px;">
              ${statsHtml}
            </td>
          </tr>
          ` : ''}

          <!-- Featured Articles / Stories Section -->
          ${storiesHtml ? `
          <tr>
            <td style="padding: 10px 32px 20px 32px;">
              <div style="font-size: 11px; font-weight: 700; color: #666666; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 16px; border-bottom: 1px solid #1a1a1a; padding-bottom: 8px;">
                Strategic Briefings & Focus Areas
              </div>
              ${storiesHtml}
            </td>
          </tr>
          ` : ''}

          <!-- Notice Box -->
          ${noticeHtml ? `
          <tr>
            <td style="padding: 0 32px 10px 32px;">
              ${noticeHtml}
            </td>
          </tr>
          ` : ''}

          <!-- Call to Action -->
          ${ctaHtml ? `
          <tr>
            <td style="padding: 0 32px 20px 32px;">
              ${ctaHtml}
            </td>
          </tr>
          ` : ''}

          <!-- Sign-off Note -->
          <tr>
            <td style="padding: 20px 32px 36px 32px; border-top: 1px solid #1a1a1a;">
              <p style="margin: 0 0 4px 0; font-size: 13.5px; color: #888888; font-family: 'Poppins', sans-serif;">
                ${campaign.signoff || 'Executive Communications & Intelligence Division'}
              </p>
              <p style="margin: 0; font-size: 14px; font-weight: 700; color: #ffffff; font-family: 'Poppins', sans-serif;">
                Zawr Industries Global Corporation
              </p>
            </td>
          </tr>

          <!-- Footer Compliance & Unsubscribe -->
          <tr>
            <td style="padding: 24px 32px; background-color: #000000; border-top: 1px solid #1a1a1a; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 11px; color: #555555; line-height: 1.5; font-family: 'Poppins', sans-serif;">
                You are receiving this intelligence dispatch because you subscribed via <a href="https://zawrindustries.com" style="color: #777777; text-decoration: underline;">zawrindustries.com</a>.<br/>
                Delivered to: <span style="color: #777777;">${subEmail}</span>
              </p>
              <p style="margin: 0 0 12px 0; font-size: 10.5px; color: #444444; font-family: 'Poppins', sans-serif;">
                &copy; ${currentYear} Zawr Industries. All global rights reserved. Confidential & Proprietary.
              </p>
              <div>
                <a href="${unsubscribeUrl}" style="font-size: 11px; color: #888888; text-decoration: underline; margin: 0 10px; font-family: 'Poppins', sans-serif;">Unsubscribe</a>
                <span style="color: #333333;">•</span>
                <a href="https://zawrindustries.com/legal/privacy-policy" style="font-size: 11px; color: #888888; text-decoration: underline; margin: 0 10px; font-family: 'Poppins', sans-serif;">Privacy Policy</a>
                <span style="color: #333333;">•</span>
                <a href="https://zawrindustries.com/legal/terms" style="font-size: 11px; color: #888888; text-decoration: underline; margin: 0 10px; font-family: 'Poppins', sans-serif;">Terms of Service</a>
              </div>
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

export async function GET() {
  try {
    const campaigns = getCampaigns();
    
    // Also fetch subscribers from Supabase or fallback
    let subscribersCount = 0;
    let subscriberEmails: string[] = [];

    if (supabase) {
      const { data } = await supabase.from('newsletters').select('email, status, created_at');
      if (data) {
        subscribersCount = data.length;
        subscriberEmails = data.map(d => d.email).filter(Boolean);
      }
    }

    return NextResponse.json({
      success: true,
      campaigns,
      subscribersCount,
      subscriberEmails
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, campaign, testEmail } = body;

    if (action === 'save_draft') {
      const campaigns = getCampaigns();
      const existingIdx = campaigns.findIndex(c => c.id === campaign.id);
      
      const newCamp = {
        ...campaign,
        id: campaign.id || `camp-${Date.now()}`,
        updatedAt: new Date().toISOString(),
        status: campaign.status || 'Draft'
      };

      if (existingIdx >= 0) {
        campaigns[existingIdx] = newCamp;
      } else {
        campaigns.unshift(newCamp);
      }

      saveCampaigns(campaigns);
      return NextResponse.json({ success: true, campaign: newCamp });
    }

    if (action === 'send_test') {
      if (!testEmail || !testEmail.includes('@')) {
        return NextResponse.json({ error: 'Valid test recipient email is required' }, { status: 400 });
      }

      const htmlContent = generateNewsletterHTML({
        ...campaign,
        subscriberEmail: testEmail.trim()
      });

      const subject = `[PROOFER TEST] ${campaign.subject || 'Zawr Strategic Dispatch'}`;

      const res = await sendMailWithPoolFailover({
        to: testEmail.trim(),
        subject,
        html: htmlContent,
        text: `${campaign.headline}\n\n${campaign.intro}`
      });

      logEmailDispatch({
        recipient: testEmail.trim(),
        sender: res.from,
        subject,
        reason: 'Newsletter Campaign Test Proof',
        status: 'Delivered',
        statusCode: 200,
        server: res.gateway.host,
        ip: '127.0.0.1',
        region: 'Webmaster Studio'
      });

      return NextResponse.json({
        success: true,
        message: `Test email successfully delivered to ${testEmail} via ${res.gateway.name}`,
        gateway: res.gateway.name
      });
    }

    if (action === 'broadcast_all') {
      // Gather active subscribers
      let recipients: string[] = [];

      if (supabase) {
        const { data } = await supabase.from('newsletters').select('email, status');
        if (data && data.length > 0) {
          recipients = data.filter(d => d.status !== 'Unsubscribed').map(d => d.email.trim());
        }
      }

      // If no recipients in database, allow fallback provided in request
      if (recipients.length === 0 && body.fallbackRecipients) {
        recipients = body.fallbackRecipients;
      }

      if (recipients.length === 0) {
        return NextResponse.json({ error: 'No active subscribers found to broadcast to.' }, { status: 400 });
      }

      // Deduplicate
      recipients = Array.from(new Set(recipients));

      let sentCount = 0;
      let failCount = 0;

      for (const email of recipients) {
        try {
          const htmlContent = generateNewsletterHTML({
            ...campaign,
            subscriberEmail: email
          });

          await sendMailWithPoolFailover({
            to: email,
            subject: campaign.subject || 'Zawr Strategic Intelligence Dispatch',
            html: htmlContent,
            text: `${campaign.headline}\n\n${campaign.intro}`
          });

          sentCount++;
        } catch (err) {
          console.error(`Failed to send newsletter to ${email}:`, err);
          failCount++;
        }
      }

      // Record in campaigns archive
      const campaigns = getCampaigns();
      const sentCampaign = {
        ...campaign,
        id: campaign.id || `camp-${Date.now()}`,
        sentAt: new Date().toISOString(),
        recipientCount: sentCount,
        status: 'Sent'
      };

      const existingIdx = campaigns.findIndex(c => c.id === sentCampaign.id);
      if (existingIdx >= 0) {
        campaigns[existingIdx] = sentCampaign;
      } else {
        campaigns.unshift(sentCampaign);
      }
      saveCampaigns(campaigns);

      return NextResponse.json({
        success: true,
        message: `Broadcast complete: ${sentCount} delivered successfully (${failCount} failed).`,
        sentCount,
        failCount
      });
    }

    return NextResponse.json({ error: 'Invalid action specified' }, { status: 400 });
  } catch (err: any) {
    console.error('Error handling newsletter campaign action:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing campaign id' }, { status: 400 });

    let campaigns = getCampaigns();
    campaigns = campaigns.filter(c => c.id !== id);
    saveCampaigns(campaigns);

    return NextResponse.json({ success: true, message: 'Campaign deleted' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { logEmailDispatch } from '@/lib/analytics-tracker';
import { sendMailWithPoolFailover, recordGatewayDispatch } from '@/lib/smtp-pool';

const templatesFilePath = path.join(process.cwd(), 'public', 'data', 'email-templates.json');

export interface EmailTemplateConfig {
  id: string;
  name: string;
  category: string;
  targetForm: string;
  subject: string;
  heading: string;
  introParagraph: string;
  noticeTitle?: string;
  noticeText?: string;
  signoffTeam: string;
  accentColor: string;
  variables: string[];
}

function readTemplates(): EmailTemplateConfig[] {
  try {
    if (fs.existsSync(templatesFilePath)) {
      const content = fs.readFileSync(templatesFilePath, 'utf8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed.templates)) return parsed.templates;
    }
  } catch (err) {
    console.error('Error reading email-templates.json:', err);
  }
  return [];
}

function writeTemplates(templates: EmailTemplateConfig[]) {
  const dir = path.dirname(templatesFilePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(templatesFilePath, JSON.stringify({ templates }, null, 2), 'utf8');
}

// ── GET: List all editable email templates ──
export async function GET() {
  const templates = readTemplates();
  return NextResponse.json({ success: true, templates }, { status: 200 });
}

// ── POST: Update template content ──
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { templates } = body;

    if (!Array.isArray(templates)) {
      return NextResponse.json({ success: false, error: 'Expected templates array' }, { status: 400 });
    }

    writeTemplates(templates);
    return NextResponse.json({ success: true, count: templates.length }, { status: 200 });
  } catch (error: any) {
    console.error('Error saving templates:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ── PUT: Send a real live test dispatch of the edited template ──
export async function PUT(req: Request) {
  const t0 = performance.now();
  try {
    const body = await req.json();
    const { templateId, recipientEmail, sampleData } = body;

    const templates = readTemplates();
    const tpl = templates.find(t => t.id === templateId) || templates[0];

    if (!tpl) {
      return NextResponse.json({ success: false, error: 'Template not found' }, { status: 404 });
    }

    const targetEmail = recipientEmail || 'admin@zawrindustries.com';

    // Sample interpolation data
    const sample = {
      firstName: sampleData?.firstName || 'Syed',
      lastName: sampleData?.lastName || 'Ismail',
      fullName: sampleData?.fullName || 'Syed Ismail',
      name: sampleData?.name || 'Syed Ismail',
      jobTitle: sampleData?.jobTitle || 'Principal AI Systems Architect',
      email: sampleData?.email || targetEmail,
      phone: sampleData?.phone || '+91 98765 43210',
      company: sampleData?.company || 'Zawr Tech Ventures',
      companyName: sampleData?.companyName || 'Zawr Tech Ventures',
      organization: sampleData?.organization || 'Zawr Tech Ventures',
      skill: sampleData?.skill || 'Distributed Systems & Robotics',
      portfolio: sampleData?.portfolio || 'https://github.com/syedismail',
      investmentSize: sampleData?.investmentSize || '$50,000,000 - $100,000,000',
      inquiry: sampleData?.inquiry || 'Strategic industrial holding inquiries and technology joint venture exploration.',
      clientId: sampleData?.clientId || 'ZR-CLIENT-8842',
      priority: sampleData?.priority || 'Critical SLA',
      eventName: sampleData?.eventName || 'Zawr Global Industrial Summit 2026',
      partnershipType: sampleData?.partnershipType || 'Enterprise Co-Development',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    };

    // Interpolate variables
    let renderedSubject = tpl.subject;
    let renderedHeading = tpl.heading;
    let renderedIntro = tpl.introParagraph;
    let renderedNoticeText = tpl.noticeText || '';

    Object.entries(sample).forEach(([key, val]) => {
      const reg = new RegExp(`{{${key}}}`, 'g');
      renderedSubject = renderedSubject.replace(reg, String(val));
      renderedHeading = renderedHeading.replace(reg, String(val));
      renderedIntro = renderedIntro.replace(reg, String(val));
      renderedNoticeText = renderedNoticeText.replace(reg, String(val));
    });

    // Generate Poppins Clean HTML Shell
    const renderedHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${renderedSubject}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
    body, table, td, p, a, h1, h2, h3, span, strong {
      font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
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
                    <span style="font-family: 'Poppins', sans-serif; font-size: 20px; color: #000000; display: inline-block; line-height: 1;">
                      <strong style="font-weight: 800; letter-spacing: 0.02em;">ZAWR</strong> <span style="font-weight: 400; letter-spacing: 0.08em;">INDUSTRIES</span>
                    </span>
                  </td>
                  <td align="right" valign="middle">
                    <span style="font-family: 'Poppins', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #666666;">
                      ${tpl.category}
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
                ${renderedHeading}
              </h1>
            </td>
          </tr>

          <!-- Greeting & Intro -->
          <tr>
            <td style="padding-bottom: 24px;">
              <p style="margin: 0 0 14px 0; font-size: 15px; line-height: 1.6; color: #333333;">
                Dear <strong style="color: #000000;">${sample.name}</strong>,
              </p>
              <p style="margin: 0; font-size: 15px; line-height: 1.65; color: #555555;">
                ${renderedIntro}
              </p>
            </td>
          </tr>

          <!-- Details Table -->
          <tr>
            <td>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top: 1px solid #eeeeee; border-bottom: 1px solid #eeeeee; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #777777;" width="36%">Reference Identifier</td>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #000000; font-weight: 600;">#ZWR-${Date.now().toString(36).toUpperCase()}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #777777; border-top: 1px solid #f5f5f5;" width="36%">Registered Email</td>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #000000; border-top: 1px solid #f5f5f5; font-weight: 500;">${sample.email}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #777777; border-top: 1px solid #f5f5f5;" width="36%">Submission Timestamp</td>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #000000; border-top: 1px solid #f5f5f5; font-weight: 500;">${sample.date} (Live Synced)</td>
                </tr>
              </table>
            </td>
          </tr>

          ${tpl.noticeTitle && renderedNoticeText ? `
          <!-- Notice / What Happens Next -->
          <tr>
            <td style="padding-bottom: 32px;">
              <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #000000;">
                ${tpl.noticeTitle}
              </p>
              <p style="margin: 0; font-size: 14px; line-height: 1.65; color: #555555;">
                ${renderedNoticeText}
              </p>
            </td>
          </tr>
          ` : ''}

          <!-- Sign-off -->
          <tr>
            <td style="padding-bottom: 40px;">
              <p style="margin: 0 0 4px 0; font-size: 14px; color: #777777;">
                Warm regards,
              </p>
              <p style="margin: 0; font-size: 14.5px; font-weight: 600; color: #000000;">
                ${tpl.signoffTeam}<br/>
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
    `;

    // Dispatch real email via SMTP Pool Failover Cluster
    const { info, gateway, from: senderFrom } = await sendMailWithPoolFailover({
      to: targetEmail,
      subject: `[LIVE TEMPLATE TEST] ${renderedSubject}`,
      html: renderedHtml
    });

    const latencyMs = Math.round(performance.now() - t0);

    logEmailDispatch({
      recipient: targetEmail,
      sender: senderFrom,
      subject: `[LIVE TEMPLATE TEST] ${renderedSubject}`,
      reason: `Template Studio Test: ${tpl.name}`,
      status: 'Delivered',
      statusCode: 200,
      server: `${gateway.host} (${gateway.name})`,
      ip: '127.0.0.1 (Webmaster Studio)',
      region: 'Webmaster Template Studio'
    });

    return NextResponse.json({
      success: true,
      latencyMs,
      messageId: info.messageId,
      gatewayName: gateway.name,
      gatewayUser: gateway.user,
      details: `Template preview email successfully delivered to ${targetEmail} via ${gateway.name} (${gateway.user}) in ${latencyMs}ms (Message ID: ${info.messageId})`
    });
  } catch (error: any) {
    console.error('Failed to dispatch template test email:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to dispatch test email' },
      { status: 500 }
    );
  }
}

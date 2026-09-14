import nodemailer from 'nodemailer';
import { logSecurityEvent, logEmailDispatch } from '@/lib/analytics-tracker';

interface PortalAccessDetails {
  userName: string;
  userEmail: string;
  userRole: string;
  accessMethod: string;
  ip?: string;
  userAgent?: string;
  location?: string;
  screenResolution?: string;
  timezone?: string;
  isFreshLogin?: boolean;
}

// In-memory debounce cache to prevent duplicate alerts on rapid page refreshes
const accessAlertCache = new Map<string, number>();
const DEBOUNCE_WINDOW_MS = 5 * 60 * 1000; // 5 minutes cooldown for identical user + IP session

export function parseDeviceAndBrowser(userAgent: string = ''): { device: string; browser: string; os: string } {
  if (!userAgent || userAgent === 'Unknown') {
    return { device: 'Unknown Device', browser: 'Standard Web Client', os: 'Unknown OS' };
  }

  const ua = userAgent.toLowerCase();

  // Detect Device Type
  let device = 'Desktop PC / Workstation';
  if (/mobile|iphone|ipod|android.*mobile|windows phone/i.test(ua)) {
    device = 'Mobile Smartphone';
  } else if (/ipad|tablet|android(?!.*mobile)/i.test(ua)) {
    device = 'Tablet Device';
  }

  // Detect Operating System
  let os = 'Unknown OS';
  if (ua.includes('windows nt 10.0') || ua.includes('windows 11') || ua.includes('windows 10')) {
    os = 'Windows 11 / 10';
  } else if (ua.includes('windows nt 6.3')) {
    os = 'Windows 8.1';
  } else if (ua.includes('windows')) {
    os = 'Windows';
  } else if (ua.includes('macintosh') || ua.includes('mac os x')) {
    const match = ua.match(/mac os x ([\d_]+)/);
    os = match ? `macOS ${match[1].replace(/_/g, '.')}` : 'macOS';
  } else if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) {
    const match = ua.match(/os ([\d_]+)/);
    os = match ? `iOS ${match[1].replace(/_/g, '.')}` : 'iOS';
  } else if (ua.includes('android')) {
    const match = ua.match(/android ([\d.]+)/);
    os = match ? `Android ${match[1]}` : 'Android';
  } else if (ua.includes('linux')) {
    os = 'Linux / Unix';
  }

  // Detect Browser
  let browser = 'Web Browser';
  if (ua.includes('edg/')) {
    const match = ua.match(/edg\/([\d.]+)/);
    browser = `Microsoft Edge ${match ? match[1].split('.')[0] : ''}`.trim();
  } else if (ua.includes('chrome/') && !ua.includes('edg/')) {
    const match = ua.match(/chrome\/([\d.]+)/);
    browser = `Google Chrome ${match ? match[1].split('.')[0] : ''}`.trim();
  } else if (ua.includes('safari/') && !ua.includes('chrome/')) {
    const match = ua.match(/version\/([\d.]+)/);
    browser = `Apple Safari ${match ? match[1].split('.')[0] : ''}`.trim();
  } else if (ua.includes('firefox/')) {
    const match = ua.match(/firefox\/([\d.]+)/);
    browser = `Mozilla Firefox ${match ? match[1].split('.')[0] : ''}`.trim();
  } else if (ua.includes('opera') || ua.includes('opr/')) {
    browser = 'Opera';
  }

  return { device, browser, os };
}

export function extractClientIp(headers: Headers): string {
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    const first = forwardedFor.split(',')[0].trim();
    if (first) return first;
  }
  const realIp = headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  const cfIp = headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();

  const vercelIp = headers.get('x-vercel-forwarded-for');
  if (vercelIp) return vercelIp.split(',')[0].trim();

  return '127.0.0.1';
}

export function extractLocationFromHeaders(headers: Headers): string {
  const country = headers.get('x-vercel-ip-country') || headers.get('cf-ipcountry') || '';
  const city = headers.get('x-vercel-ip-city') || headers.get('cf-ipcity') || '';
  const region = headers.get('x-vercel-ip-country-region') || '';

  const parts = [city, region, country].filter(Boolean);
  if (parts.length > 0) {
    return parts.join(', ');
  }
  return 'Local / Secure Gateway';
}

export async function sendAdminPortalAccessAlert(details: PortalAccessDetails): Promise<{ success: boolean; skipped?: boolean; error?: string }> {
  try {
    const {
      userName,
      userEmail,
      userRole,
      accessMethod,
      ip = '127.0.0.1',
      userAgent = '',
      location = 'Local / Secure Gateway',
      screenResolution = 'N/A',
      timezone = 'Asia/Kolkata (IST)',
      isFreshLogin = false,
    } = details;

    const cacheKey = `${userEmail.toLowerCase()}_${ip}`;
    const lastSent = accessAlertCache.get(cacheKey) || 0;
    const now = Date.now();

    // If not a fresh login and sent within debounce window, skip sending duplicate email
    if (!isFreshLogin && now - lastSent < DEBOUNCE_WINDOW_MS) {
      return { success: true, skipped: true };
    }

    // Update debounce timestamp
    accessAlertCache.set(cacheKey, now);

    const { device, browser, os } = parseDeviceAndBrowser(userAgent);

    // Primary admin recipient: priority order
    const recipient = process.env.WEBMASTER_ALERT_EMAIL || 
                      process.env.WEBMASTER_REPORT_EMAIL || 
                      process.env.GMAIL_USER || 
                      'info@zawrindustries.com';

    const senderFrom = process.env.GMAIL_FROM || `"Zawr Security Alert" <security@zawrindustries.com>`;
    
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    }).format(new Date());

    const subject = `[SECURITY NOTICE] Webmaster Portal Accessed by ${userName} (${userRole})`;

    // Log security telemetry
    logSecurityEvent({
      eventType: 'Webmaster Portal Access',
      severity: userRole === 'Super Administrator' ? 'Low' : 'Medium',
      targetPath: '/webmaster',
      ip,
      country: location,
      actionTaken: 'Admin Notification Dispatched',
      details: `User "${userName}" (${userEmail}, Role: ${userRole}) accessed Webmaster Console via ${accessMethod}. Device: ${device} (${os} / ${browser}). IP: ${ip}.`
    });

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.warn('[SECURITY] GMAIL credentials missing in environment. Portal access logged locally.');
      return { success: true };
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Zawr Industries — Webmaster Portal Access Alert</title>
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
          
          <!-- Top Header -->
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
                    <span style="font-family: 'Poppins', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #10b981;">
                      PORTAL ACCESS AUDIT
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Heading -->
          <tr>
            <td style="padding-top: 32px; padding-bottom: 16px;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #000000; letter-spacing: -0.02em; line-height: 1.3;">
                Webmaster Console Accessed
              </h1>
            </td>
          </tr>

          <!-- Intro Paragraph -->
          <tr>
            <td style="padding-bottom: 24px;">
              <p style="margin: 0 0 14px 0; font-size: 15px; line-height: 1.6; color: #333333;">
                Dear <strong style="color: #000000;">Administrator</strong>,
              </p>
              <p style="margin: 0; font-size: 15px; line-height: 1.65; color: #555555;">
                An authorized administrative session has been established for the <strong>Zawr Webmaster &amp; Control Hub</strong>. Authentication telemetry and device details are recorded below for your security records.
              </p>
            </td>
          </tr>

          <!-- Telemetry Table -->
          <tr>
            <td style="padding-bottom: 28px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top: 1px solid #eeeeee; border-bottom: 1px solid #eeeeee;">
                <tr>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #777777; border-bottom: 1px solid #f5f5f5;" width="36%">Authenticated User</td>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #000000; font-weight: 600; border-bottom: 1px solid #f5f5f5;">${userName}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #777777; border-bottom: 1px solid #f5f5f5;">Role &amp; Privilege</td>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #000000; font-weight: 500; border-bottom: 1px solid #f5f5f5;">${userRole}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #777777; border-bottom: 1px solid #f5f5f5;">Email Identifier</td>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #000000; font-weight: 500; border-bottom: 1px solid #f5f5f5;">${userEmail}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #777777; border-bottom: 1px solid #f5f5f5;">Access Method</td>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #000000; font-weight: 500; border-bottom: 1px solid #f5f5f5;">${accessMethod}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #777777; border-bottom: 1px solid #f5f5f5;">IP Address</td>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #000000; font-weight: 600; border-bottom: 1px solid #f5f5f5;">${ip}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #777777; border-bottom: 1px solid #f5f5f5;">Estimated Location</td>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #000000; font-weight: 500; border-bottom: 1px solid #f5f5f5;">${location}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #777777; border-bottom: 1px solid #f5f5f5;">Device &amp; OS</td>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #000000; font-weight: 500; border-bottom: 1px solid #f5f5f5;">${device} &bull; ${os}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #777777; border-bottom: 1px solid #f5f5f5;">Browser Engine</td>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #000000; font-weight: 500; border-bottom: 1px solid #f5f5f5;">${browser}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #777777; border-bottom: 1px solid #f5f5f5;">Access Timestamp</td>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #000000; font-weight: 500; border-bottom: 1px solid #f5f5f5;">${formattedDate} (IST)</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #777777;">Screen &amp; Timezone</td>
                  <td style="padding: 12px 0; font-size: 13.5px; color: #000000; font-weight: 500;">${screenResolution} &bull; ${timezone}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Security Note Box -->
          <tr>
            <td style="padding-bottom: 32px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fafafa; border-left: 3px solid #111111; padding: 16px 20px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 6px 0; font-size: 13.5px; font-weight: 600; color: #000000;">
                      Security Verification:
                    </p>
                    <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #666666;">
                      If this session was not initiated by you or an authorized employee, please log in immediately to the Webmaster Security settings to revoke active tokens and rotate the Master Access Key.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Button -->
          <tr>
            <td style="padding-bottom: 36px; text-align: left;">
              <table border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="border-radius: 4px; background-color: #000000;">
                    <a href="https://zawrindustries.com/webmaster" target="_blank" style="font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 4px; display: inline-block;">
                      Open Webmaster Console &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Sign-off -->
          <tr>
            <td style="padding-bottom: 40px;">
              <p style="margin: 0 0 4px 0; font-size: 14px; color: #777777;">
                Warm regards,
              </p>
              <p style="margin: 0; font-size: 14.5px; font-weight: 600; color: #000000;">
                Zawr Perimeter Security Gateway<br/>
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
                Bengaluru, India &bull; <a href="https://zawrindustries.com" style="color: #000000; text-decoration: underline;">zawrindustries.com</a> &bull; <a href="https://zawrindustries.com/webmaster" style="color: #000000; text-decoration: underline;">security console</a>
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

    await transporter.sendMail({
      from: senderFrom,
      to: recipient,
      subject,
      html,
      text: `SECURITY ALERT: Webmaster console accessed by ${userName} (${userRole})\n\nEmail: ${userEmail}\nIP Address: ${ip}\nLocation: ${location}\nDevice: ${device} (${os})\nBrowser: ${browser}\nTimestamp: ${formattedDate}\n\nReview active sessions at https://zawrindustries.com/webmaster`
    });

    logEmailDispatch({
      recipient,
      sender: 'security@zawrindustries.com',
      subject,
      reason: `Webmaster Access Alert (${userName})`,
      status: 'Delivered',
      statusCode: 200,
      server: 'smtp.gmail.com (TLS 1.3)',
      ip,
      region: location
    });

    return { success: true };
  } catch (error: any) {
    console.error('[SECURITY] Error sending admin portal access alert:', error);
    return { success: false, error: error.message };
  }
}

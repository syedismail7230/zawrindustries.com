import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { logEmailDispatch } from './analytics-tracker';

export interface EmailRouteNodeConfig {
  id: string;
  formId: string;
  formName: string;
  formPath: string;
  category: string;
  destinationEmail: string;
  transport: 'nodemailer' | 'cloudflare' | 'resend';
  autoResponder: boolean;
  subjectPrefix: string;
  cc?: string[];
  bcc?: string[];
  status: 'active' | 'paused';
}

export interface MailboxNode {
  email: string;
  name: string;
  description: string;
  mappedFormsCount: number;
}

const routesFilePath = path.join(process.cwd(), 'public', 'data', 'email-routes.json');
const tmpRoutesFilePath = path.join('/tmp', 'email-routes.json');

let inMemoryRoutes: EmailRouteNodeConfig[] | null = null;

const DEFAULT_ROUTES: EmailRouteNodeConfig[] = [
  {
    id: 'route-careers',
    formId: 'careers',
    formName: 'Job Applications',
    formPath: '/careers',
    category: 'Talent & Recruitment',
    destinationEmail: 'hr@zawrindustries.com',
    transport: 'nodemailer',
    autoResponder: true,
    subjectPrefix: '[CAREERS-APPLICATION]',
    cc: ['careers@zawrindustries.com'],
    status: 'active'
  },
  {
    id: 'route-freelance',
    formId: 'freelance',
    formName: 'Freelance Contractor Applications',
    formPath: '/apply/freelance',
    category: 'Talent & Recruitment',
    destinationEmail: 'hr@zawrindustries.com',
    transport: 'nodemailer',
    autoResponder: true,
    subjectPrefix: '[FREELANCE-APPLICATION]',
    cc: [],
    status: 'active'
  },
  {
    id: 'route-callback',
    formId: 'callback',
    formName: 'Request a Callback',
    formPath: '/contact/callback',
    category: 'Customer & Support',
    destinationEmail: 'contact@zawrindustries.com',
    transport: 'nodemailer',
    autoResponder: true,
    subjectPrefix: '[CALLBACK-REQUEST]',
    cc: [],
    status: 'active'
  },
  {
    id: 'route-investor',
    formId: 'investor',
    formName: 'Investor Relations & Pitch Decks',
    formPath: '/investors',
    category: 'Finance & Capital',
    destinationEmail: 'investors@zawrindustries.com',
    transport: 'nodemailer',
    autoResponder: true,
    subjectPrefix: '[INVESTOR-RELATIONS]',
    cc: ['ceo@zawrindustries.com'],
    status: 'active'
  },
  {
    id: 'route-media-kit',
    formId: 'media-kit',
    formName: 'Media Kit & Asset Requests',
    formPath: '/newsroom/media-kit',
    category: 'Press & Communications',
    destinationEmail: 'media@zawrindustries.com',
    transport: 'nodemailer',
    autoResponder: true,
    subjectPrefix: '[MEDIA-KIT-REQUEST]',
    cc: [],
    status: 'active'
  },
  {
    id: 'route-pr',
    formId: 'pr',
    formName: 'Press Releases & Journalist Inquiries',
    formPath: '/newsroom',
    category: 'Press & Communications',
    destinationEmail: 'pr@zawrindustries.com',
    transport: 'nodemailer',
    autoResponder: true,
    subjectPrefix: '[PRESS-INQUIRY]',
    cc: ['media@zawrindustries.com'],
    status: 'active'
  },
  {
    id: 'route-partner',
    formId: 'partner',
    formName: 'Corporate & Ecosystem Partnerships',
    formPath: '/contact/partner',
    category: 'Business & Strategy',
    destinationEmail: 'partners@zawrindustries.com',
    transport: 'nodemailer',
    autoResponder: true,
    subjectPrefix: '[PARTNERSHIP-INQUIRY]',
    cc: ['investors@zawrindustries.com'],
    status: 'active'
  },
  {
    id: 'route-rsvp',
    formId: 'rsvp',
    formName: 'Event & Summit RSVPs',
    formPath: '/events',
    category: 'Events & Community',
    destinationEmail: 'events@zawrindustries.com',
    transport: 'nodemailer',
    autoResponder: true,
    subjectPrefix: '[EVENT-RSVP]',
    cc: [],
    status: 'active'
  },
  {
    id: 'route-sponsorship',
    formId: 'sponsorship',
    formName: 'Sponsorship & Grant Inquiries',
    formPath: '/sponsorship',
    category: 'Business & Strategy',
    destinationEmail: 'marketing@zawrindustries.com',
    transport: 'nodemailer',
    autoResponder: true,
    subjectPrefix: '[SPONSORSHIP-INQUIRY]',
    cc: [],
    status: 'active'
  },
  {
    id: 'route-newsletter',
    formId: 'newsletter',
    formName: 'Newsletter Subscriptions',
    formPath: '/newsletter',
    category: 'Marketing & Audience',
    destinationEmail: 'newsletter@zawrindustries.com',
    transport: 'nodemailer',
    autoResponder: true,
    subjectPrefix: '[NEWSLETTER-OPTIN]',
    cc: [],
    status: 'active'
  },
  {
    id: 'route-general',
    formId: 'contact',
    formName: 'General Inquiries & Contact',
    formPath: '/contact',
    category: 'Customer & Support',
    destinationEmail: 'contact@zawrindustries.com',
    transport: 'nodemailer',
    autoResponder: true,
    subjectPrefix: '[GENERAL-INQUIRY]',
    cc: [],
    status: 'active'
  }
];

export function getEmailRoutes(): EmailRouteNodeConfig[] {
  if (inMemoryRoutes && inMemoryRoutes.length > 0) {
    return inMemoryRoutes;
  }

  try {
    if (fs.existsSync(routesFilePath)) {
      const data = fs.readFileSync(routesFilePath, 'utf8');
      inMemoryRoutes = JSON.parse(data);
      return inMemoryRoutes!;
    }
  } catch (e) {
    try {
      if (fs.existsSync(tmpRoutesFilePath)) {
        const data = fs.readFileSync(tmpRoutesFilePath, 'utf8');
        inMemoryRoutes = JSON.parse(data);
        return inMemoryRoutes!;
      }
    } catch (_) {}
  }

  inMemoryRoutes = DEFAULT_ROUTES;
  saveEmailRoutes(DEFAULT_ROUTES).catch(() => {});
  return DEFAULT_ROUTES;
}

export async function saveEmailRoutes(routes: EmailRouteNodeConfig[]): Promise<void> {
  inMemoryRoutes = routes;
  const jsonStr = JSON.stringify(routes, null, 2);

  try {
    fs.writeFileSync(routesFilePath, jsonStr, 'utf8');
  } catch (e) {
    try {
      fs.writeFileSync(tmpRoutesFilePath, jsonStr, 'utf8');
    } catch (_) {}
  }
}

/**
 * Dynamically resolves the configured destination address and metadata for any form submission
 */
export function resolveFormRoute(formIdOrPath: string): {
  destinationEmail: string;
  cc: string[];
  bcc: string[];
  transport: 'nodemailer' | 'cloudflare' | 'resend';
  autoResponder: boolean;
  subjectPrefix: string;
} {
  const routes = getEmailRoutes();
  const rawKey = formIdOrPath.toLowerCase().trim();
  const normalizedKey = rawKey.replace(/^(\/api\/|\/)/, '').replace(/[\/\-_]/g, '');

  // Alias dictionary for canonical form mapping across endpoints & visual node graph
  const ALIAS_MAP: Record<string, string[]> = {
    'careers': ['applyjob', 'job', 'jobs', 'careers', 'career', 'recruitment'],
    'freelance': ['applyfreelance', 'freelance', 'contractor', 'consultant'],
    'callback': ['requestcallback', 'callback', 'call'],
    'investor': ['requestinvestor', 'investor', 'investors', 'pitchdeck', 'capital'],
    'media-kit': ['requestmediakit', 'mediakit', 'presskit', 'assets'],
    'pr': ['requestpr', 'pr', 'pressrelease', 'pressinquiry', 'journalist'],
    'partner': ['requestpartner', 'partner', 'partners', 'partnership', 'alliances'],
    'rsvp': ['rsvp', 'event', 'events', 'summit'],
    'sponsorship': ['sponsorship', 'grant', 'sponsor'],
    'newsletter': ['newsletter', 'subscribe', 'blognewsletter', 'dispatch'],
    'contact': ['contact', 'general', 'inquiry', 'support']
  };

  const matched = routes.find(r => {
    if (r.status === 'paused') return false;
    const rId = r.id.toLowerCase();
    const rFormId = r.formId.toLowerCase().replace(/[\/\-_]/g, '');
    const rPath = r.formPath.toLowerCase().replace(/[\/\-_]/g, '');

    if (rFormId === normalizedKey || rPath === normalizedKey || rId.includes(normalizedKey)) {
      return true;
    }

    // Check canonical alias map
    for (const [canonical, aliases] of Object.entries(ALIAS_MAP)) {
      if (aliases.includes(normalizedKey) && (r.formId.toLowerCase() === canonical || r.id.toLowerCase().includes(canonical))) {
        return true;
      }
    }

    return false;
  });

  if (matched && matched.status === 'active') {
    return {
      destinationEmail: matched.destinationEmail,
      cc: matched.cc || [],
      bcc: matched.bcc || [],
      transport: matched.transport || 'nodemailer',
      autoResponder: matched.autoResponder,
      subjectPrefix: matched.subjectPrefix || `[${matched.formName.toUpperCase()}]`
    };
  }

  return {
    destinationEmail: 'contact@zawrindustries.com',
    cc: [],
    bcc: [],
    transport: 'nodemailer',
    autoResponder: true,
    subjectPrefix: '[INQUIRY]'
  };
}

import { resolvePoolTransporter, sendMailWithPoolFailover, recordGatewayDispatch, getSmtpPoolConfig, testGatewayHandshake, SmtpGatewayConfig } from './smtp-pool';

/**
 * Creates Nodemailer Transporter using the dynamic Multi-SMTP pool
 * Automatically handles 500 mails/day quota per gateway, failover, and load balancing
 */
export function getMailTransporter() {
  const { transporter } = resolvePoolTransporter();
  return transporter;
}

/**
 * Gets the active transporter along with selected gateway metadata
 */
export function getActivePoolTransporter() {
  return resolvePoolTransporter();
}

/**
 * Tests live SMTP Connection Handshake across the active pool
 */
export async function testSmtpConnection(): Promise<{
  success: boolean;
  latencyMs: number;
  host: string;
  port: number;
  sender: string;
  details: string;
}> {
  const pool = getSmtpPoolConfig();
  const primary = pool.gateways.find(g => g.enabled) || pool.gateways[0];

  if (!primary) {
    return {
      success: false,
      latencyMs: 0,
      host: 'none',
      port: 0,
      sender: 'none',
      details: 'No active SMTP gateways configured in pool.'
    };
  }

  const res = await testGatewayHandshake(primary);
  return {
    success: res.success,
    latencyMs: res.latencyMs,
    host: primary.host,
    port: primary.port,
    sender: primary.senderEmail,
    details: res.details
  };
}

/**
 * Executes a Real Live Test Email Dispatch through a specific mapped route
 */
export async function testDispatchRoute(
  routeId: string,
  recipientEmail?: string
): Promise<{
  success: boolean;
  latencyMs: number;
  messageId?: string;
  details: string;
}> {
  const t0 = performance.now();
  const routes = getEmailRoutes();
  const route = routes.find(r => r.id === routeId) || routes[0];
  const targetRecipient = recipientEmail || route.destinationEmail;
  const subject = `${route.subjectPrefix || '[NODE-ROUTER-TEST]'} Live Routing Test Beacon (${new Date().toLocaleTimeString()})`;

  try {
    const { info, gateway, from } = await sendMailWithPoolFailover({
      to: targetRecipient,
      cc: route.cc && route.cc.length > 0 ? route.cc.join(', ') : undefined,
      subject,
      html: `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #090d15; color: #ffffff; border-radius: 12px; border: 1px solid #1e293b;">
      <div style="border-bottom: 1px solid #334155; padding-bottom: 16px; margin-bottom: 20px;">
        <h2 style="color: #38bdf8; margin: 0 0 6px 0; font-size: 20px;">⚡ Zawr Industries Mail Node Test</h2>
        <p style="color: #94a3b8; margin: 0; font-size: 13px;">Automated route verification from Webmaster Central Hub</p>
      </div>
      
      <div style="background-color: #111827; padding: 16px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #1f2937;">
        <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Form Origin:</strong> <span style="color: #60a5fa;">${route.formName} (${route.formPath})</span></p>
        <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Destination Node:</strong> <span style="color: #4ade80;">${targetRecipient}</span></p>
        <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Auto-Responder Status:</strong> <span style="color: ${route.autoResponder ? '#4ade80' : '#94a3b8'};">${route.autoResponder ? 'Enabled' : 'Disabled'}</span></p>
      </div>

      <p style="color: #cbd5e1; font-size: 13px; line-height: 1.5; margin: 0;">
        This test confirms that messages submitted on your public platform via <strong>${route.formName}</strong> are dynamically mapped and routed to <strong>${targetRecipient}</strong> with zero latency bottlenecks.
      </p>
    </div>
  `
    });

    const latencyMs = Math.round(performance.now() - t0);

    // Log to active telemetry feed
    logEmailDispatch({
      recipient: targetRecipient,
      sender: from,
      subject,
      reason: `Node Route Test: ${route.formName}`,
      status: 'Delivered',
      statusCode: 200,
      server: `${gateway.host} (${gateway.name})`,
      ip: '127.0.0.1 (Webmaster)',
      region: 'Webmaster Node Engine'
    });

    return {
      success: true,
      latencyMs,
      messageId: info.messageId,
      details: `Delivered to ${targetRecipient} in ${latencyMs}ms via ${gateway.name} (${gateway.user}) [Quota: ${gateway.sentToday}/${gateway.dailyLimit}]`
    };
  } catch (error: any) {
    const latencyMs = Math.round(performance.now() - t0);
    return {
      success: false,
      latencyMs,
      details: `Delivery failed across cluster: ${error.message}`
    };
  }
}

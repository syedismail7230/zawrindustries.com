import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

export interface SmtpGatewayConfig {
  id: string;
  name: string;
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  senderName: string;
  senderEmail: string;
  dailyLimit: number; // default: 500
  sentToday: number;
  lastResetDate: string; // YYYY-MM-DD
  priority: number; // 1 (highest)
  enabled: boolean;
  status: 'online' | 'degraded' | 'offline' | 'quota_exceeded';
  lastLatencyMs?: number;
  lastTestedAt?: string;
  lastError?: string;
  createdAt?: string;
}

export type SmtpRoutingStrategy = 'sequential' | 'round-robin' | 'lowest-usage';

export interface SmtpPoolConfig {
  strategy: SmtpRoutingStrategy;
  autoFailover: boolean;
  gateways: SmtpGatewayConfig[];
  updatedAt: string;
}

const DATA_FILE_PATH = path.join(process.cwd(), 'public', 'data', 'smtp-gateways.json');

function getTodayString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

/**
 * Default fallback gateway from environment variables
 */
function getDefaultEnvGateway(): SmtpGatewayConfig {
  const user = process.env.GMAIL_USER || process.env.EMAIL_USER || 'zawrorganization@gmail.com';
  const pass = (process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASS || '').replace(/\s+/g, '');
  const today = getTodayString();

  return {
    id: 'gw-primary-google',
    name: 'Primary Google SMTP Relay',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    user,
    pass,
    senderName: 'Zawr Industries',
    senderEmail: 'noreply@zawrindustries.com',
    dailyLimit: 500,
    sentToday: 0,
    lastResetDate: today,
    priority: 1,
    enabled: true,
    status: 'online',
    lastLatencyMs: 14,
    lastTestedAt: new Date().toISOString()
  };
}

/**
 * Load all SMTP Gateways with daily 500 quota auto-reset check
 */
export function getSmtpPoolConfig(): SmtpPoolConfig {
  const today = getTodayString();

  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const raw = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
      const config: SmtpPoolConfig = JSON.parse(raw);

      let needsSave = false;
      if (Array.isArray(config.gateways)) {
        config.gateways = config.gateways.map(gw => {
          if (gw.lastResetDate !== today) {
            needsSave = true;
            return {
              ...gw,
              sentToday: 0,
              lastResetDate: today,
              status: gw.status === 'quota_exceeded' ? 'online' : gw.status
            };
          }
          return gw;
        });

        if (needsSave) {
          saveSmtpPoolConfig(config);
        }
        return config;
      }
    }
  } catch (err) {
    console.error('Failed to read smtp-gateways.json, falling back to default:', err);
  }

  // If file doesn't exist or is invalid, create with default
  const defaultConfig: SmtpPoolConfig = {
    strategy: 'sequential',
    autoFailover: true,
    gateways: [getDefaultEnvGateway()],
    updatedAt: new Date().toISOString()
  };

  saveSmtpPoolConfig(defaultConfig);
  return defaultConfig;
}

/**
 * Save SMTP Pool Configuration
 */
export function saveSmtpPoolConfig(config: SmtpPoolConfig): boolean {
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(config, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Failed to save smtp-gateways.json:', err);
    return false;
  }
}

/**
 * Resolve the best active transporter from the pool respecting the 500 daily quota
 */
export function resolvePoolTransporter(): {
  transporter: nodemailer.Transporter;
  gateway: SmtpGatewayConfig;
  from: string;
} {
  const pool = getSmtpPoolConfig();
  const activeGateways = pool.gateways.filter(gw => gw.enabled);

  if (activeGateways.length === 0) {
    // Fallback to default
    const fallback = getDefaultEnvGateway();
    return {
      transporter: createNodemailerTransporter(fallback),
      gateway: fallback,
      from: `"${fallback.senderName}" <${fallback.senderEmail}>`
    };
  }

  // Filter gateways that are enabled, not quota exceeded, and not degraded
  let availableGateways = activeGateways.filter(
    gw => gw.sentToday < gw.dailyLimit && gw.status !== 'quota_exceeded' && gw.status !== 'degraded'
  );

  // If all non-degraded are exhausted, try any gateway under quota
  if (availableGateways.length === 0) {
    availableGateways = activeGateways.filter(gw => gw.sentToday < gw.dailyLimit);
  }

  let selectedGateway: SmtpGatewayConfig;

  if (availableGateways.length === 0) {
    // All gateways exceeded quota! Fall back to highest priority one as emergency
    console.warn('[SMTP Pool] All gateways reached daily quota! Falling back to primary gateway.');
    selectedGateway = [...activeGateways].sort((a, b) => a.priority - b.priority)[0];
  } else if (pool.strategy === 'lowest-usage') {
    // Pick gateway with lowest usage percentage
    selectedGateway = [...availableGateways].sort((a, b) => (a.sentToday / a.dailyLimit) - (b.sentToday / b.dailyLimit))[0];
  } else if (pool.strategy === 'round-robin') {
    // Pick random available gateway to balance load evenly
    selectedGateway = availableGateways[Math.floor(Math.random() * availableGateways.length)];
  } else {
    // 'sequential' priority routing: only ONE gateway is active at a time (Priority 1 -> Priority 2 -> Priority 3...)
    selectedGateway = [...availableGateways].sort((a, b) => a.priority - b.priority)[0];
  }

  const transporter = createNodemailerTransporter(selectedGateway);
  const from = `"${selectedGateway.senderName || 'Zawr Industries'}" <${selectedGateway.senderEmail || selectedGateway.user}>`;

  return {
    transporter,
    gateway: selectedGateway,
    from
  };
}

/**
 * Create Nodemailer Transporter instance for a specific gateway configuration
 */
export function createNodemailerTransporter(gw: SmtpGatewayConfig): nodemailer.Transporter {
  return nodemailer.createTransport({
    host: gw.host,
    port: gw.port,
    secure: gw.secure || gw.port === 465,
    pool: true,
    maxConnections: 3,
    maxMessages: 100,
    rateDelta: 1000,
    rateLimit: 5,
    auth: {
      user: gw.user,
      pass: gw.pass.replace(/\s+/g, '')
    },
    tls: {
      rejectUnauthorized: false
    }
  });
}

/**
 * Increment the sent counter and update gateway metrics after a dispatch
 */
export function recordGatewayDispatch(gatewayId: string, success: boolean, latencyMs?: number, error?: string): void {
  try {
    const pool = getSmtpPoolConfig();
    const today = getTodayString();

    pool.gateways = pool.gateways.map(gw => {
      if (gw.id === gatewayId) {
        const sentToday = (gw.lastResetDate === today ? gw.sentToday : 0) + (success ? 1 : 0);
        const isExceeded = sentToday >= gw.dailyLimit;

        return {
          ...gw,
          sentToday,
          lastResetDate: today,
          status: isExceeded ? 'quota_exceeded' : (success ? 'online' : 'degraded'),
          lastLatencyMs: latencyMs !== undefined ? latencyMs : gw.lastLatencyMs,
          lastTestedAt: new Date().toISOString(),
          lastError: error || (success ? undefined : gw.lastError)
        };
      }
      return gw;
    });

    saveSmtpPoolConfig(pool);
  } catch (err) {
    console.error('Failed to record gateway dispatch:', err);
  }
}

/**
 * Perform a live Handshake Verification test on a specific gateway
 */
export async function testGatewayHandshake(gw: SmtpGatewayConfig): Promise<{
  success: boolean;
  latencyMs: number;
  details: string;
  error?: string;
}> {
  const t0 = performance.now();
  try {
    const transporter = createNodemailerTransporter(gw);
    await transporter.verify();
    const latencyMs = Math.round(performance.now() - t0);

    // Update in config
    const pool = getSmtpPoolConfig();
    pool.gateways = pool.gateways.map(g => g.id === gw.id ? {
      ...g,
      status: g.sentToday >= g.dailyLimit ? 'quota_exceeded' : 'online',
      lastLatencyMs: latencyMs,
      lastTestedAt: new Date().toISOString(),
      lastError: undefined
    } : g);
    saveSmtpPoolConfig(pool);

    return {
      success: true,
      latencyMs,
      details: `Authenticated via ${gw.host} (Port ${gw.port}) • Handshake: ${latencyMs}ms`
    };
  } catch (err: any) {
    const latencyMs = Math.round(performance.now() - t0);
    return {
      success: false,
      latencyMs,
      details: `Connection failed: ${err.message || 'SMTP Authentication Error'}`,
      error: err.message
    };
  }
}

/**
 * Send an email with automatic live fallback across all configured gateways in priority order.
 * If Priority 1 hits Google's daily quota or fails, it immediately sends through Priority 2, 3...
 */
export async function sendMailWithPoolFailover(mailOptions: nodemailer.SendMailOptions): Promise<{
  info: any;
  gateway: SmtpGatewayConfig;
  from: string;
}> {
  const pool = getSmtpPoolConfig();
  const activeGateways = pool.gateways.filter(gw => gw.enabled);

  if (activeGateways.length === 0) {
    const fallback = getDefaultEnvGateway();
    const transporter = createNodemailerTransporter(fallback);
    const from = `"${fallback.senderName}" <${fallback.senderEmail}>`;
    const replyTo = mailOptions.replyTo || `"${fallback.senderName}" <noreply@zawrindustries.com>`;
    const info = await transporter.sendMail({
      ...mailOptions,
      from: mailOptions.from || from,
      replyTo,
      headers: {
        'List-Unsubscribe': '<https://zawrindustries.com/unsubscribe>, <mailto:noreply@zawrindustries.com?subject=unsubscribe>',
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        ...(mailOptions.headers || {})
      }
    });
    return { info, gateway: fallback, from };
  }

  // Sort gateways according to priority (1, 2, 3...)
  const sortedGateways = [...activeGateways].sort((a, b) => a.priority - b.priority);

  let lastError: Error | null = null;

  for (const gw of sortedGateways) {
    // If gateway already exceeded quota today or degraded with quota error, skip to next priority gateway
    if (gw.sentToday >= gw.dailyLimit || gw.status === 'quota_exceeded' || (gw.lastError && gw.lastError.includes('550'))) {
      continue;
    }

    try {
      const t0 = performance.now();
      const transporter = createNodemailerTransporter(gw);
      
      // Sender address strictly set to corporate domain
      const senderAddress = gw.senderEmail || 'noreply@zawrindustries.com';
      const from = `"${gw.senderName || 'Zawr Industries'}" <${senderAddress}>`;
      const replyTo = mailOptions.replyTo || `"${gw.senderName || 'Zawr Industries'}" <noreply@zawrindustries.com>`;

      // Deliverability Headers
      const antiSpamHeaders = {
        'List-Unsubscribe': '<https://zawrindustries.com/unsubscribe>, <mailto:noreply@zawrindustries.com?subject=unsubscribe>',
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        'X-Entity-Ref-ID': `zawr-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        'X-Auto-Response-Suppress': 'OOF, AutoReply',
        ...(mailOptions.headers || {})
      };

      const info = await transporter.sendMail({
        ...mailOptions,
        from: mailOptions.from || from,
        replyTo,
        headers: antiSpamHeaders,
      });

      const latencyMs = Math.round(performance.now() - t0);
      recordGatewayDispatch(gw.id, true, latencyMs);

      return {
        info,
        gateway: gw,
        from
      };
    } catch (err: any) {
      console.warn(`[SMTP Cluster Failover] Gateway ${gw.name} (${gw.user}) failed:`, err.message);
      recordGatewayDispatch(gw.id, false, undefined, err.message);
      lastError = err;
      // Continue loop to next priority gateway in cluster!
    }
  }

  // If all non-exceeded gateways failed, try any enabled gateway as final fallback
  for (const gw of sortedGateways) {
    try {
      const transporter = createNodemailerTransporter(gw);
      const from = `"${gw.senderName || 'Zawr Industries'}" <${gw.senderEmail || gw.user}>`;
      const info = await transporter.sendMail({
        ...mailOptions,
        from: mailOptions.from || from
      });
      recordGatewayDispatch(gw.id, true);
      return { info, gateway: gw, from };
    } catch (err: any) {
      lastError = err;
    }
  }

  throw lastError || new Error('All SMTP gateways in cluster failed to dispatch email.');
}


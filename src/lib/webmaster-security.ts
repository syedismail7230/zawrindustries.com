import crypto from 'crypto';

export type UserPermission = 
  | '*'
  | 'analytics'
  | 'api-monitoring'
  | 'mail-credentials'
  | 'email-routing'
  | 'jobs'
  | 'newsletters'
  | 'pitch-deck'
  | 'financial-reports'
  | 'events'
  | 'notices'
  | 'notifications'
  | 'press-releases'
  | 'blogs'
  | 'user-management';

export interface WebmasterUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  loginKey: string;
  role: string;
  permissions: UserPermission[];
  status: 'active' | 'suspended';
  lastLogin: string | null;
  createdAt: string;
  createdBy: string;
}

/**
 * Generates a cryptographically random unique login key for employee profile login links.
 */
export function generateLoginKey(): string {
  return 'zwr_' + crypto.randomBytes(24).toString('hex');
}

export interface SessionTokenPayload {
  userId: string;
  name: string;
  email: string;
  role: string;
  permissions: UserPermission[];
  issuedAt: number;
  expiresAt: number;
}

const SECRET_KEY = process.env.WEBMASTER_SECRET_KEY || 'zawr-super-secure-hmac-master-secret-key-2026!#$';
const PBKDF2_ITERATIONS = 100000;
const PBKDF2_KEYLEN = 64;
const PBKDF2_DIGEST = 'sha512';

// ── In-Memory Rate Limiting for Brute-force Protection ──
interface RateLimitRecord {
  attempts: number;
  lockUntil: number;
}

const loginAttemptsMap = new Map<string, RateLimitRecord>();

/**
 * Checks and updates failed login attempts for brute-force prevention.
 * Maximum 5 failed attempts locks out for 15 minutes.
 */
export function checkRateLimit(identifier: string): { allowed: boolean; remainingMinutes?: number } {
  const now = Date.now();
  const record = loginAttemptsMap.get(identifier);

  if (record) {
    if (record.lockUntil > now) {
      const remainingMinutes = Math.ceil((record.lockUntil - now) / 60000);
      return { allowed: false, remainingMinutes };
    }
    if (record.lockUntil <= now && record.attempts >= 15) {
      // Lock expired, reset
      loginAttemptsMap.delete(identifier);
    }
  }

  return { allowed: true };
}

export function recordFailedAttempt(identifier: string): { locked: boolean; attemptsLeft: number } {
  const now = Date.now();
  const record = loginAttemptsMap.get(identifier) || { attempts: 0, lockUntil: 0 };
  
  record.attempts += 1;
  if (record.attempts >= 15) {
    record.lockUntil = now + 5 * 60 * 1000; // 5 minutes lock
    loginAttemptsMap.set(identifier, record);
    return { locked: true, attemptsLeft: 0 };
  }

  loginAttemptsMap.set(identifier, record);
  return { locked: false, attemptsLeft: 15 - record.attempts };
}

export function clearRateLimit(identifier: string): void {
  loginAttemptsMap.delete(identifier);
}

/**
 * Generates a cryptographically random 32-byte hexadecimal salt.
 */
export function generateSalt(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Hashes a plaintext password using PBKDF2 with HMAC-SHA512.
 */
export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, PBKDF2_KEYLEN, PBKDF2_DIGEST).toString('hex');
}

/**
 * Securely verifies a password using timing-safe comparison.
 */
export function verifyPassword(password: string, storedHash: string, salt: string): boolean {
  try {
    const computedHash = hashPassword(password, salt);
    const a = Buffer.from(computedHash, 'hex');
    const b = Buffer.from(storedHash, 'hex');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * Creates an HMAC-SHA256 signed session token.
 */
export function createSessionToken(user: Omit<WebmasterUser, 'passwordHash' | 'salt'>, durationHours = 8): string {
  const now = Date.now();
  const payload: SessionTokenPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    permissions: user.permissions,
    issuedAt: now,
    expiresAt: now + durationHours * 60 * 60 * 1000
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(payloadB64)
    .digest('base64url');

  return `${payloadB64}.${signature}`;
}

/**
 * Verifies an HMAC-SHA256 session token and returns the payload if valid and not expired.
 */
export function verifySessionToken(token: string): SessionTokenPayload | null {
  try {
    if (!token || !token.includes('.')) return null;
    const [payloadB64, signature] = token.split('.');
    
    const expectedSignature = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(payloadB64)
      .digest('base64url');

    const a = Buffer.from(signature);
    const b = Buffer.from(expectedSignature);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return null;
    }

    const payload: SessionTokenPayload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    if (Date.now() > payload.expiresAt) {
      return null; // Expired token
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Universal authorization guard for Next.js API route handlers.
 * Checks Session Token (JWT/HMAC) or Master Access Key from Headers, Body, or FormData.
 */
export async function verifyWebmasterAuth(
  request: Request,
  requiredPermission?: UserPermission,
  formData?: FormData
): Promise<{ authorized: boolean; error?: string; user?: any }> {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const masterKeyHeader = request.headers.get('x-master-key') || '';
    
    let token = authHeader.startsWith('Bearer ') ? authHeader.substring(7).trim() : '';
    let masterKey = masterKeyHeader.trim();

    if (!token && formData) {
      token = (formData.get('sessionToken') || formData.get('token') || '') as string;
    }
    if (!masterKey && formData) {
      masterKey = (formData.get('masterKey') || formData.get('accessKey') || '') as string;
    }

    const envMasterKey = process.env.WEBMASTER_ACCESS_KEY || process.env.NEXT_PUBLIC_WEBMASTER_ACCESS_KEY;

    // Check Master Access Key first
    if (envMasterKey && masterKey && masterKey === envMasterKey) {
      return {
        authorized: true,
        user: { id: 'master', name: 'Super Administrator', role: 'Super Administrator', permissions: ['*'] }
      };
    }

    // Check Session Token
    if (token) {
      const payload = verifySessionToken(token);
      if (payload) {
        if (!requiredPermission || payload.permissions.includes('*') || payload.permissions.includes(requiredPermission)) {
          return { authorized: true, user: payload };
        } else {
          return { authorized: false, error: `Forbidden: Missing required permission "${requiredPermission}"` };
        }
      }
    }

    return { authorized: false, error: 'Unauthorized: Valid administrator credentials or active session required' };
  } catch (err: any) {
    return { authorized: false, error: err.message || 'Authentication error' };
  }
}

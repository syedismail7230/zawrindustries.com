import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  WebmasterUser,
  UserPermission,
  generateSalt,
  generateLoginKey,
  hashPassword,
  verifyPassword,
  createSessionToken,
  verifySessionToken,
  checkRateLimit,
  recordFailedAttempt,
  clearRateLimit
} from '@/lib/webmaster-security';
import { supabase } from '@/lib/supabase';
import { sendCriticalAlertToWebmaster } from '@/lib/webmaster-report';

import os from 'os';

const LOCAL_USERS_FILE = path.join(process.cwd(), 'data', 'webmaster-users.json');
const TMP_USERS_FILE = path.join(os.tmpdir(), 'webmaster-users.json');

// In-memory cache across warm lambdas
let memoryUsersCache: WebmasterUser[] | null = null;

function getWritableUsersFilePath(): string {
  try {
    const dir = path.dirname(LOCAL_USERS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    return LOCAL_USERS_FILE;
  } catch (e) {
    return TMP_USERS_FILE;
  }
}

// Default initial Master Administrator profile if no database file exists yet
function getInitialUsers(): WebmasterUser[] {
  const masterSalt = generateSalt();
  const masterHash = hashPassword(process.env.WEBMASTER_DEFAULT_ADMIN_PASS || 'ZawrAdmin#2026', masterSalt);

  return [
    {
      id: 'usr-master-001',
      name: 'Super Administrator',
      email: (process.env.WEBMASTER_DEFAULT_ADMIN_EMAIL || 'admin@zawrindustries.com').toLowerCase(),
      passwordHash: masterHash,
      salt: masterSalt,
      loginKey: generateLoginKey(),
      role: 'Super Administrator',
      permissions: ['*'],
      status: 'active',
      lastLogin: null,
      createdAt: new Date().toISOString(),
      createdBy: 'System Bootstrap'
    }
  ];
}

// ── Persistent File & Database Operations ──
function loadUsersFromFile(): WebmasterUser[] {
  if (memoryUsersCache && memoryUsersCache.length > 0) {
    return memoryUsersCache;
  }

  try {
    // Check local file first, then tmp file
    let filePathToRead = LOCAL_USERS_FILE;
    if (!fs.existsSync(LOCAL_USERS_FILE) && fs.existsSync(TMP_USERS_FILE)) {
      filePathToRead = TMP_USERS_FILE;
    } else if (!fs.existsSync(LOCAL_USERS_FILE) && !fs.existsSync(TMP_USERS_FILE)) {
      const initial = getInitialUsers();
      saveUsersToFile(initial);
      memoryUsersCache = initial;
      return initial;
    }

    const data = fs.readFileSync(filePathToRead, 'utf-8');
    const parsed: WebmasterUser[] = JSON.parse(data);
    let dirty = false;
    for (const u of parsed) {
      if (!u.loginKey) {
        u.loginKey = generateLoginKey();
        dirty = true;
      }
    }
    if (dirty) {
      saveUsersToFile(parsed);
    }
    memoryUsersCache = parsed;
    return parsed;
  } catch (error) {
    console.error('Failed to read users file:', error);
    if (fs.existsSync(TMP_USERS_FILE)) {
      try {
        const tmpData = fs.readFileSync(TMP_USERS_FILE, 'utf-8');
        const parsed: WebmasterUser[] = JSON.parse(tmpData);
        memoryUsersCache = parsed;
        return parsed;
      } catch (err2) {}
    }
    const initial = getInitialUsers();
    memoryUsersCache = initial;
    return initial;
  }
}

function saveUsersToFile(users: WebmasterUser[]): void {
  memoryUsersCache = [...users];

  // Try writing to local data file
  try {
    const dir = path.dirname(LOCAL_USERS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (error) {
    // Local directory read-only on serverless, write to /tmp
  }

  // Always write to /tmp as well for serverless safety
  try {
    fs.writeFileSync(TMP_USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (tmpErr) {
    console.error('Failed to save to tmp users file:', tmpErr);
  }
}

// Safe user representation (strip hash & salt)
function sanitizeUser(user: WebmasterUser) {
  const { passwordHash, salt, ...safe } = user;
  return safe;
}

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'webmaster-rbac-auth',
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown-ip';

    // ─────────────────────────────────────────────────────────────
    // 1. VALIDATE UNIQUE PROFILE LOGIN KEY (UNAUTHENTICATED)
    // ─────────────────────────────────────────────────────────────
    if (action === 'validate-login-key') {
      const { authKey } = body;
      if (!authKey) {
        return NextResponse.json({ success: false, error: 'Authentication link key is missing' }, { status: 400 });
      }

      const users = loadUsersFromFile();
      const user = users.find(u => u.loginKey === authKey.trim());

      if (!user) {
        return NextResponse.json({ success: false, error: 'Invalid or expired unique login link.' }, { status: 404 });
      }

      if (user.status === 'suspended') {
        return NextResponse.json({
          success: false,
          error: 'This profile is currently suspended by management. Please contact administrator.'
        }, { status: 403 });
      }

      return NextResponse.json({
        success: true,
        profile: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          permissions: user.permissions,
          status: user.status
        }
      });
    }

    // ─────────────────────────────────────────────────────────────
    // 2. STAFF LOGIN (EMAIL or UNIQUE AUTHKEY + PASSWORD)
    // ─────────────────────────────────────────────────────────────
    if (action === 'login') {
      const { email, authKey, password } = body;

      if ((!email && !authKey) || !password) {
        return NextResponse.json({ success: false, error: 'Email/Login link and password are required' }, { status: 400 });
      }

      const users = loadUsersFromFile();
      let user: WebmasterUser | undefined;

      if (authKey) {
        user = users.find(u => u.loginKey === authKey.trim());
      }
      if (!user && email) {
        const normalizedEmail = email.trim().toLowerCase();
        user = users.find(u => u.email.toLowerCase() === normalizedEmail);
      }

      const rateLimitIdentifier = user ? user.email : (email || authKey || 'unknown');
      const rateLimitKey = `${clientIp}:${rateLimitIdentifier}`;

      // Check brute-force rate limit
      const rateCheck = checkRateLimit(rateLimitKey);
      if (!rateCheck.allowed) {
        return NextResponse.json({
          success: false,
          error: `Too many failed attempts. Access locked for ${rateCheck.remainingMinutes} more minutes.`
        }, { status: 429 });
      }

      if (!user) {
        const attempt = recordFailedAttempt(rateLimitKey);
        if (attempt.locked) {
          sendCriticalAlertToWebmaster({
            title: 'Multiple Failed Login Attempts (Account Locked)',
            details: `Failed authentication attempts exceeded threshold for identifier: "${rateLimitIdentifier}". Access has been locked for 5 minutes.`,
            severity: 'High',
            ip: clientIp
          }).catch(console.error);
        }
        return NextResponse.json({
          success: false,
          error: attempt.locked 
            ? 'Account locked for 5 minutes due to repeated failed attempts.' 
            : `User account not found for this link or email. (${attempt.attemptsLeft} attempts remaining)`
        }, { status: 401 });
      }

      if (user.status === 'suspended') {
        return NextResponse.json({
          success: false,
          error: 'Your account has been suspended by the Super Administrator. Please contact management.'
        }, { status: 403 });
      }

      let isMatch = verifyPassword(password, user.passwordHash, user.salt);
      if (!isMatch && typeof password === 'string') {
        isMatch = verifyPassword(password.trim(), user.passwordHash, user.salt);
      }

      // SuperAdmin master key fallback verification (env-driven only)
      if (!isMatch && user.role === 'Super Administrator') {
        const masterPass = process.env.WEBMASTER_DEFAULT_ADMIN_PASS;
        const masterKey = process.env.WEBMASTER_ACCESS_KEY || process.env.NEXT_PUBLIC_WEBMASTER_ACCESS_KEY;
        if ((masterPass && (password === masterPass || password.trim() === masterPass)) ||
            (masterKey && (password === masterKey || password.trim() === masterKey))) {
          isMatch = true;
        }
      }

      if (!isMatch) {
        const attempt = recordFailedAttempt(rateLimitKey);
        if (attempt.locked) {
          sendCriticalAlertToWebmaster({
            title: 'Account Locked Due to Repeated Invalid Passwords',
            details: `Account "${user.name}" (${user.email}) has been locked for 5 minutes following repeated invalid password attempts.`,
            severity: 'High',
            ip: clientIp
          }).catch(console.error);
        }
        return NextResponse.json({
          success: false,
          error: attempt.locked 
            ? 'Account locked for 5 minutes due to repeated failed attempts.' 
            : `Incorrect password. (${attempt.attemptsLeft} attempts remaining)`
        }, { status: 401 });
      }

      // Password is correct! Clear rate limiter and update last login
      clearRateLimit(rateLimitKey);
      user.lastLogin = new Date().toISOString();
      saveUsersToFile(users);

      const safeUser = sanitizeUser(user);
      const token = createSessionToken(safeUser, 8); // 8-hour session

      return NextResponse.json({
        success: true,
        token,
        user: safeUser
      });
    }

    // ─────────────────────────────────────────────────────────────
    // 3. VERIFY ACTIVE SESSION TOKEN
    // ─────────────────────────────────────────────────────────────
    if (action === 'verify-session') {
      const { token } = body;
      const payload = verifySessionToken(token);

      if (!payload) {
        return NextResponse.json({ success: false, error: 'Invalid or expired session' }, { status: 401 });
      }

      const users = loadUsersFromFile();
      const user = users.find(u => u.id === payload.userId);

      if (!user || user.status === 'suspended') {
        return NextResponse.json({ success: false, error: 'User profile inactive or suspended' }, { status: 403 });
      }

      return NextResponse.json({
        success: true,
        user: sanitizeUser(user)
      });
    }

    // ── All subsequent actions require SuperAdmin or user-management authorization ──
    const authHeader = request.headers.get('authorization') || '';
    const callerToken = body.sessionToken || (authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null);
    const serverMasterKey = process.env.WEBMASTER_ACCESS_KEY || process.env.NEXT_PUBLIC_WEBMASTER_ACCESS_KEY;
    
    let isSuperAdmin = false;
    if (serverMasterKey && body.masterKey && body.masterKey === serverMasterKey) {
      isSuperAdmin = true;
    } else if (callerToken) {
      const callerPayload = verifySessionToken(callerToken);
      if (callerPayload && (callerPayload.permissions.includes('*') || callerPayload.permissions.includes('user-management'))) {
        isSuperAdmin = true;
      }
    }

    if (!isSuperAdmin) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized: Administrator privileges required.'
      }, { status: 403 });
    }

    const users = loadUsersFromFile();

    // ─────────────────────────────────────────────────────────────
    // 4. LIST ALL USER PROFILES
    // ─────────────────────────────────────────────────────────────
    if (action === 'list-users') {
      return NextResponse.json({
        success: true,
        users: users.map(sanitizeUser)
      });
    }

    // ─────────────────────────────────────────────────────────────
    // 5. CREATE NEW STAFF PROFILE (WITH UNIQUE LOGIN LINK)
    // ─────────────────────────────────────────────────────────────
    if (action === 'create-user') {
      const { name, email, password, role, permissions, status } = body;

      if (!name || !email || !password) {
        return NextResponse.json({ success: false, error: 'Name, email, and password are required' }, { status: 400 });
      }

      const normalizedEmail = email.trim().toLowerCase();
      if (users.some(u => u.email.toLowerCase() === normalizedEmail)) {
        return NextResponse.json({ success: false, error: 'A profile with this email address already exists' }, { status: 409 });
      }

      if (password.length < 6) {
        return NextResponse.json({ success: false, error: 'Password must be at least 6 characters' }, { status: 400 });
      }

      const salt = generateSalt();
      const passwordHash = hashPassword(password, salt);
      const loginKey = generateLoginKey();

      const newUser: WebmasterUser = {
        id: `usr-${crypto.randomUUID().substring(0, 8)}`,
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        salt,
        loginKey,
        role: role?.trim() || 'Staff Contributor',
        permissions: Array.isArray(permissions) && permissions.length > 0 ? permissions : ['blogs'],
        status: status === 'suspended' ? 'suspended' : 'active',
        lastLogin: null,
        createdAt: new Date().toISOString(),
        createdBy: body.callerName || 'SuperAdmin'
      };

      users.push(newUser);
      saveUsersToFile(users);

      return NextResponse.json({
        success: true,
        user: sanitizeUser(newUser),
        loginKey,
        message: `Profile for ${newUser.name} created successfully.`
      });
    }

    // ─────────────────────────────────────────────────────────────
    // 5. UPDATE EXISTING PROFILE & PERMISSIONS
    // ─────────────────────────────────────────────────────────────
    if (action === 'update-user') {
      const { id, name, role, permissions, status } = body;

      const userIndex = users.findIndex(u => u.id === id);
      if (userIndex === -1) {
        return NextResponse.json({ success: false, error: 'User profile not found' }, { status: 404 });
      }

      if (name) users[userIndex].name = name.trim();
      if (role) users[userIndex].role = role.trim();
      if (Array.isArray(permissions)) users[userIndex].permissions = permissions;
      if (status) users[userIndex].status = status === 'suspended' ? 'suspended' : 'active';

      saveUsersToFile(users);

      return NextResponse.json({
        success: true,
        user: sanitizeUser(users[userIndex]),
        message: 'Profile updated successfully.'
      });
    }

    // ─────────────────────────────────────────────────────────────
    // 6. RESET USER PASSWORD
    // ─────────────────────────────────────────────────────────────
    if (action === 'reset-password') {
      const { id, newPassword } = body;

      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json({ success: false, error: 'New password must be at least 6 characters' }, { status: 400 });
      }

      const userIndex = users.findIndex(u => u.id === id);
      if (userIndex === -1) {
        return NextResponse.json({ success: false, error: 'User profile not found' }, { status: 404 });
      }

      const newSalt = generateSalt();
      users[userIndex].salt = newSalt;
      users[userIndex].passwordHash = hashPassword(newPassword, newSalt);

      saveUsersToFile(users);

      return NextResponse.json({
        success: true,
        message: `Password for ${users[userIndex].name} reset successfully.`
      });
    }

    // ─────────────────────────────────────────────────────────────
    // 7. REGENERATE UNIQUE LOGIN KEY / LINK
    // ─────────────────────────────────────────────────────────────
    if (action === 'regenerate-login-key') {
      const { id } = body;

      const userIndex = users.findIndex(u => u.id === id);
      if (userIndex === -1) {
        return NextResponse.json({ success: false, error: 'User profile not found' }, { status: 404 });
      }

      const newLoginKey = generateLoginKey();
      users[userIndex].loginKey = newLoginKey;
      saveUsersToFile(users);

      return NextResponse.json({
        success: true,
        loginKey: newLoginKey,
        user: sanitizeUser(users[userIndex]),
        message: `New unique login link generated for ${users[userIndex].name}. Previous link is now revoked.`
      });
    }

    // ─────────────────────────────────────────────────────────────
    // 8. DELETE USER PROFILE
    // ─────────────────────────────────────────────────────────────
    if (action === 'delete-user') {
      const { id } = body;

      const user = users.find(u => u.id === id);
      if (!user) {
        return NextResponse.json({ success: false, error: 'User profile not found' }, { status: 404 });
      }

      // Safeguard: Do not allow deleting the last SuperAdmin
      const superAdmins = users.filter(u => u.permissions.includes('*'));
      if (user.permissions.includes('*') && superAdmins.length <= 1) {
        return NextResponse.json({ success: false, error: 'Cannot delete the only remaining Super Administrator profile.' }, { status: 400 });
      }

      const filtered = users.filter(u => u.id !== id);
      saveUsersToFile(filtered);

      return NextResponse.json({
        success: true,
        message: `Profile ${user.name} deleted.`
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Webmaster RBAC API Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { logWebRequest, logSecurityEvent } from '@/lib/analytics-tracker';

export const dynamic = 'force-dynamic';

// Map common IANA timezones to Country and City
function parseLocationFromTimezone(tz: string): { country: string; city: string; code: string; flag: string } {
  if (!tz) return { country: 'Local / Direct', city: 'Localhost', code: 'LOC', flag: '🌐' };

  if (tz.includes('Kolkata') || tz.includes('Calcutta') || tz.includes('India')) {
    return { country: 'India', city: 'Bengaluru', code: 'IN', flag: '🇮🇳' };
  }
  if (tz.includes('Dubai') || tz.includes('Muscat')) {
    return { country: 'United Arab Emirates', city: 'Dubai', code: 'AE', flag: '🇦🇪' };
  }
  if (tz.includes('New_York') || tz.includes('Detroit') || tz.includes('Toronto')) {
    return { country: 'United States', city: 'New York', code: 'US', flag: '🇺🇸' };
  }
  if (tz.includes('Los_Angeles') || tz.includes('San_Francisco') || tz.includes('Pacific')) {
    return { country: 'United States', city: 'San Francisco', code: 'US', flag: '🇺🇸' };
  }
  if (tz.includes('Chicago') || tz.includes('Central')) {
    return { country: 'United States', city: 'Chicago', code: 'US', flag: '🇺🇸' };
  }
  if (tz.includes('London') || tz.includes('GB')) {
    return { country: 'United Kingdom', city: 'London', code: 'GB', flag: '🇬🇧' };
  }
  if (tz.includes('Singapore')) {
    return { country: 'Singapore', city: 'Singapore', code: 'SG', flag: '🇸🇬' };
  }
  if (tz.includes('Riyadh') || tz.includes('Saudi')) {
    return { country: 'Saudi Arabia', city: 'Riyadh', code: 'SA', flag: '🇸🇦' };
  }
  if (tz.includes('Berlin') || tz.includes('Frankfurt')) {
    return { country: 'Germany', city: 'Frankfurt', code: 'DE', flag: '🇩🇪' };
  }
  if (tz.includes('Tokyo')) {
    return { country: 'Japan', city: 'Tokyo', code: 'JP', flag: '🇯🇵' };
  }
  return { country: 'India', city: 'Bengaluru', code: 'IN', flag: '🇮🇳' };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { path: pagePath, referrer, device, timezone, latencyMs } = body;

    // Extract real client IP prioritizing Cloudflare header
    const cfIp = req.headers.get('cf-connecting-ip');
    const forwarded = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const ip = cfIp ? cfIp.trim() : (forwarded ? forwarded.split(',')[0].trim() : (realIp || '127.0.0.1'));
    const userAgent = req.headers.get('user-agent') || 'Browser Client';
    
    // Country / city identification via Cloudflare edge headers & timezone fallback
    const cfCountryCode = req.headers.get('cf-ipcountry') || req.headers.get('x-vercel-ip-country');
    const cfCity = req.headers.get('cf-ipcity') || req.headers.get('x-vercel-ip-city');
    
    const COUNTRY_CODE_MAP: Record<string, string> = {
      'US': 'United States',
      'NL': 'Netherlands',
      'HK': 'Hong Kong',
      'TW': 'Taiwan',
      'IN': 'India',
      'AE': 'United Arab Emirates',
      'GB': 'United Kingdom',
      'SG': 'Singapore',
      'DE': 'Germany',
      'CA': 'Canada',
      'SA': 'Saudi Arabia',
      'AU': 'Australia',
      'JP': 'Japan',
      'FR': 'France',
      'CH': 'Switzerland'
    };

    const location = parseLocationFromTimezone(timezone || '');
    const finalCountry = (cfCountryCode && COUNTRY_CODE_MAP[cfCountryCode.toUpperCase()]) || cfCountryCode || location.country;
    const finalCity = cfCity ? decodeURIComponent(cfCity) : location.city;

    // Check for suspicious probe paths
    const suspiciousTokens = ['wp-admin', 'wp-login', '.env', 'phpmyadmin', 'eval-stdin', 'xmlrpc.php', 'cgi-bin'];
    const isSuspicious = suspiciousTokens.some(tok => (pagePath || '').toLowerCase().includes(tok));

    if (isSuspicious) {
      logSecurityEvent({
        eventType: 'Unauthorized Gate Probe',
        severity: 'High',
        targetPath: pagePath,
        ip,
        country: finalCountry,
        actionTaken: 'Blocked 403',
        details: `Realtime probe detection: Unauthorized request targeted protected path '${pagePath}'. Blocked at edge.`
      });
      return NextResponse.json({ status: 'blocked', threatDetected: true });
    }

    // Log the real web request
    logWebRequest({
      path: pagePath || '/',
      method: 'GET',
      status: 200,
      latencyMs: typeof latencyMs === 'number' ? Math.round(latencyMs) : 24,
      ip,
      country: finalCountry,
      city: finalCity,
      device: (device as any) || 'Desktop',
      userAgent
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking analytics request:', error);
    return NextResponse.json({ error: 'Tracking failed' }, { status: 500 });
  }
}

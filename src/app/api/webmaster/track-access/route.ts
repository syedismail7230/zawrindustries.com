import { NextResponse } from 'next/server';
import { 
  sendAdminPortalAccessAlert, 
  extractClientIp, 
  extractLocationFromHeaders 
} from '@/lib/webmaster-access-alert';
import { verifySessionToken } from '@/lib/webmaster-security';

export async function POST(request: Request) {
  try {
    const headers = request.headers;
    const clientIp = extractClientIp(headers);
    const location = extractLocationFromHeaders(headers);
    const userAgent = headers.get('user-agent') || 'Unknown Browser';

    const body = await request.json().catch(() => ({}));
    const { 
      sessionToken, 
      userName, 
      userEmail, 
      userRole, 
      accessMethod, 
      screenResolution, 
      timezone,
      isFreshLogin 
    } = body;

    let finalName = userName || 'Super Administrator';
    let finalEmail = userEmail || process.env.WEBMASTER_DEFAULT_ADMIN_EMAIL || 'admin@zawrindustries.com';
    let finalRole = userRole || 'Super Administrator';

    // If sessionToken is provided, verify against cryptographic token
    if (sessionToken) {
      const payload = verifySessionToken(sessionToken);
      if (payload) {
        finalName = payload.name || finalName;
        finalEmail = payload.email || finalEmail;
        finalRole = payload.role || finalRole;
      }
    }

    const alertResult = await sendAdminPortalAccessAlert({
      userName: finalName,
      userEmail: finalEmail,
      userRole: finalRole,
      accessMethod: accessMethod || (sessionToken ? 'Active Session Restored' : 'Direct Dashboard Access'),
      ip: clientIp,
      userAgent,
      location,
      screenResolution: screenResolution || 'Standard Display',
      timezone: timezone || 'Asia/Kolkata (IST)',
      isFreshLogin: Boolean(isFreshLogin)
    });

    return NextResponse.json({
      success: true,
      alertSent: alertResult.success && !alertResult.skipped,
      skipped: Boolean(alertResult.skipped)
    });
  } catch (error: any) {
    console.error('Track access API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

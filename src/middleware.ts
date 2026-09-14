import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Known malicious scanner URL patterns
const MALICIOUS_PATH_PATTERNS = [
  /\.env($|\/|\.)/i,
  /\.git($|\/|\.)/i,
  /\.aws($|\/|\.)/i,
  /\.config($|\/|\.)/i,
  /wp-admin/i,
  /wp-login\.php/i,
  /wp-content/i,
  /wp-includes/i,
  /xmlrpc\.php/i,
  /phpmyadmin/i,
  /pma/i,
  /\.php$/i,
  /eval-stdin\.php/i,
  /alfa\.php/i,
  /shell\.php/i,
  /wso\.php/i,
  /cgi-bin/i,
  /setup\.php/i,
  /vendor\/phpunit/i,
  /\/\.\.\//, // Path traversal attempt
];

// Malicious scanner User-Agent signatures
const MALICIOUS_USER_AGENTS = [
  /sqlmap/i,
  /nikto/i,
  /masscan/i,
  /zgrab/i,
  /acunetix/i,
  /dirbuster/i,
  /nmap/i,
  /havij/i,
  /wprecon/i,
  /whatweb/i,
  /nuclei/i,
];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const userAgent = request.headers.get('user-agent') || '';

  // 1. Block known scanner user agents
  if (MALICIOUS_USER_AGENTS.some((pattern) => pattern.test(userAgent))) {
    return new NextResponse('Access Denied', {
      status: 403,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  // 2. Block malicious scanner paths immediately with 404/403
  if (MALICIOUS_PATH_PATTERNS.some((pattern) => pattern.test(pathname))) {
    return new NextResponse('Not Found', {
      status: 404,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  // 3. Forward request and attach comprehensive security headers
  const response = NextResponse.next();

  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assets/ (public assets)
     */
    '/((?!_next/static|_next/image|favicon.ico|assets/).*)',
  ],
};

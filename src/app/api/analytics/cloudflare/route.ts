import { NextResponse } from 'next/server';
import { fetchCloudflareMetrics } from '@/lib/cloudflare-analytics';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const timeRangeParam = (searchParams.get('timeRange') || '24h').toLowerCase();
    const timeRange = (timeRangeParam === '7d' || timeRangeParam === '30d') ? timeRangeParam : '24h';
    const customToken = searchParams.get('token') || undefined;
    const customZoneId = searchParams.get('zoneId') || undefined;

    const data = await fetchCloudflareMetrics(timeRange as '24h' | '7d' | '30d', customToken, customZoneId);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching Cloudflare telemetry:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch Cloudflare telemetry' }, { status: 500 });
  }
}

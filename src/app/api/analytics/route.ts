import { NextResponse } from 'next/server';
import { getTelemetryData } from '@/lib/analytics-tracker';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const timeRangeParam = (searchParams.get('timeRange') || '24h').toLowerCase();
    const timeRange = (timeRangeParam === '7d' || timeRangeParam === '30d') ? timeRangeParam : '24h';

    const data = getTelemetryData(timeRange as '24h' | '7d' | '30d');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching analytics telemetry:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getTelemetryData } from '@/lib/analytics-tracker';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = getTelemetryData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching analytics telemetry:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}

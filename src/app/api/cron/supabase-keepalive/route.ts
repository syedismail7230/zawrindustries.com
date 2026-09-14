import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const start = Date.now();
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      const url = new URL(req.url);
      if (url.searchParams.get('key') !== cronSecret) {
        return NextResponse.json({ error: 'Unauthorized cron request' }, { status: 401 });
      }
    }

    // Execute active keep-alive query against Supabase
    const { data, error, count } = await supabase
      .from('jobs')
      .select('id, status', { count: 'exact', head: false })
      .limit(1);

    const latencyMs = Date.now() - start;

    if (error) {
      console.warn('[Supabase Keep-Alive] Query warning:', error.message);
      return NextResponse.json({
        success: false,
        service: 'supabase-keepalive',
        database: 'Supabase PostgreSQL',
        status: 'Degraded',
        latencyMs,
        error: error.message,
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      service: 'supabase-keepalive',
      database: 'Supabase PostgreSQL',
      status: 'Active & Operational',
      latencyMs,
      inactivityTimerReset: true,
      timestamp: new Date().toISOString(),
      details: 'Automatic pausing prevention ping successful.'
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      service: 'supabase-keepalive',
      status: 'Error',
      error: err.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  return GET(req);
}

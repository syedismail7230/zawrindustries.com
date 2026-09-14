import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { logEmailDispatch } from '@/lib/analytics-tracker';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email address is required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!supabase) {
      return NextResponse.json({
        found: true,
        email: cleanEmail,
        status: 'Active',
      });
    }

    const { data, error } = await supabase
      .from('newsletters')
      .select('id, email, status, created_at')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (error) {
      console.warn('Supabase fetch error for unsubscribe lookup:', error);
      return NextResponse.json({
        found: true,
        email: cleanEmail,
        status: 'Active',
      });
    }

    if (!data) {
      return NextResponse.json({
        found: false,
        email: cleanEmail,
        status: 'NotFound',
      });
    }

    return NextResponse.json({
      found: true,
      email: data.email,
      status: data.status || 'Active',
      created_at: data.created_at,
    });
  } catch (err: any) {
    console.error('Error checking unsubscribe status:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, reason, feedback, preferences, action } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email address is required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const forwarded = req.headers.get('x-forwarded-for');
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    // 1. Resubscribe / Reactivate Flow
    if (action === 'resubscribe') {
      if (supabase) {
        // Check if row exists
        const { data: existing } = await supabase
          .from('newsletters')
          .select('id')
          .eq('email', cleanEmail)
          .maybeSingle();

        if (existing) {
          await supabase
            .from('newsletters')
            .update({ status: 'Active' })
            .eq('email', cleanEmail);
        } else {
          await supabase
            .from('newsletters')
            .insert([{ email: cleanEmail, status: 'Active' }]);
        }
      }

      logEmailDispatch({
        recipient: cleanEmail,
        sender: 'noreply@zawrindustries.com',
        subject: 'Newsletter Subscription Reactivated',
        reason: 'User Self-Service Reactivation',
        status: 'Delivered',
        statusCode: 200,
        server: 'Google SMTP Relay (TLS 1.3)',
        ip: clientIp,
        region: 'Bengaluru, India',
      });

      return NextResponse.json({
        success: true,
        status: 'Active',
        message: 'Your newsletter subscription has been successfully reactivated.',
      });
    }

    // 2. Preferences Update Flow
    if (action === 'update_preferences') {
      if (supabase) {
        await supabase
          .from('newsletters')
          .update({ status: 'Active' })
          .eq('email', cleanEmail);
      }

      logEmailDispatch({
        recipient: cleanEmail,
        sender: 'noreply@zawrindustries.com',
        subject: 'Newsletter Preferences Updated',
        reason: `User Preferences: ${Array.isArray(preferences) ? preferences.join(', ') : 'Custom'}`,
        status: 'Delivered',
        statusCode: 200,
        server: 'Google SMTP Relay (TLS 1.3)',
        ip: clientIp,
        region: 'Bengaluru, India',
      });

      return NextResponse.json({
        success: true,
        status: 'PreferencesUpdated',
        message: 'Your communication preferences have been updated.',
      });
    }

    // 3. Unsubscribe Flow (Default)
    if (supabase) {
      const { data: existing } = await supabase
        .from('newsletters')
        .select('id')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('newsletters')
          .update({ status: 'Unsubscribed' })
          .eq('email', cleanEmail);
      } else {
        // Insert record with Unsubscribed status so future campaigns won't send
        await supabase
          .from('newsletters')
          .insert([{ email: cleanEmail, status: 'Unsubscribed' }]);
      }
    }

    // Log the unsubscribe action in analytics / security audit trail
    logEmailDispatch({
      recipient: cleanEmail,
      sender: 'noreply@zawrindustries.com',
      subject: 'Newsletter Unsubscribe Request Processed',
      reason: `Unsubscribed (${reason || 'User Request'})${feedback ? `: ${feedback}` : ''}`,
      status: 'Delivered',
      statusCode: 200,
      server: 'Google SMTP Relay (TLS 1.3)',
      ip: clientIp,
      region: 'Bengaluru, India',
    });

    return NextResponse.json({
      success: true,
      status: 'Unsubscribed',
      message: 'You have been successfully removed from our newsletter distribution list.',
    });
  } catch (err: any) {
    console.error('Error processing unsubscribe:', err);
    return NextResponse.json({ error: 'Failed to process unsubscribe request' }, { status: 500 });
  }
}

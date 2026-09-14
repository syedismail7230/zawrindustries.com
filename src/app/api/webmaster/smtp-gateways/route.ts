import { NextResponse } from 'next/server';
import {
  getSmtpPoolConfig,
  saveSmtpPoolConfig,
  testGatewayHandshake,
  SmtpGatewayConfig,
  SmtpRoutingStrategy
} from '@/lib/smtp-pool';

/**
 * GET /api/webmaster/smtp-gateways
 * Fetch all SMTP gateways and aggregate pool capacity metrics
 */
export async function GET() {
  try {
    const pool = getSmtpPoolConfig();

    const totalGateways = pool.gateways.length;
    const activeGateways = pool.gateways.filter(g => g.enabled);
    const totalDailyCapacity = activeGateways.reduce((sum, g) => sum + g.dailyLimit, 0);
    const totalSentToday = activeGateways.reduce((sum, g) => sum + g.sentToday, 0);
    const remainingQuota = Math.max(0, totalDailyCapacity - totalSentToday);
    const usagePercentage = totalDailyCapacity > 0 ? Math.round((totalSentToday / totalDailyCapacity) * 100) : 0;

    return NextResponse.json({
      success: true,
      pool: {
        ...pool,
        metrics: {
          totalGateways,
          activeCount: activeGateways.length,
          totalDailyCapacity,
          totalSentToday,
          remainingQuota,
          usagePercentage,
          poolHealth: activeGateways.every(g => g.status === 'online') ? 'healthy' : 'attention_needed'
        }
      }
    });
  } catch (err: any) {
    console.error('Error fetching SMTP gateways:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/**
 * POST /api/webmaster/smtp-gateways
 * Add a new SMTP gateway or update an existing one
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { gateway } = body;

    if (!gateway || !gateway.host || !gateway.user || !gateway.pass) {
      return NextResponse.json(
        { success: false, error: 'Host, username, and password are required fields.' },
        { status: 400 }
      );
    }

    const pool = getSmtpPoolConfig();
    const today = new Date().toISOString().split('T')[0];

    const gatewayToSave: SmtpGatewayConfig = {
      id: gateway.id || `gw-${Date.now()}`,
      name: gateway.name || `${gateway.host} Relay`,
      host: gateway.host.trim(),
      port: Number(gateway.port) || 465,
      secure: gateway.secure !== undefined ? Boolean(gateway.secure) : (Number(gateway.port) === 465),
      user: gateway.user.trim(),
      pass: gateway.pass.trim(),
      senderName: gateway.senderName?.trim() || 'Zawr Industries System',
      senderEmail: gateway.senderEmail?.trim() || gateway.user.trim(),
      dailyLimit: Number(gateway.dailyLimit) || 500,
      sentToday: Number(gateway.sentToday) || 0,
      lastResetDate: gateway.lastResetDate || today,
      priority: Number(gateway.priority) || (pool.gateways.length + 1),
      enabled: gateway.enabled !== undefined ? Boolean(gateway.enabled) : true,
      status: 'online',
      lastLatencyMs: gateway.lastLatencyMs,
      lastTestedAt: gateway.lastTestedAt,
      createdAt: gateway.createdAt || new Date().toISOString()
    };

    const existingIndex = pool.gateways.findIndex(g => g.id === gatewayToSave.id);
    if (existingIndex >= 0) {
      pool.gateways[existingIndex] = {
        ...pool.gateways[existingIndex],
        ...gatewayToSave
      };
    } else {
      pool.gateways.push(gatewayToSave);
    }

    pool.updatedAt = new Date().toISOString();
    saveSmtpPoolConfig(pool);

    return NextResponse.json({
      success: true,
      message: 'SMTP Gateway saved successfully.',
      gateway: gatewayToSave,
      pool
    });
  } catch (err: any) {
    console.error('Error saving SMTP gateway:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/**
 * PUT /api/webmaster/smtp-gateways
 * Handle gateway actions (test handshake, toggle, strategy change, reset quota)
 */
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { action, gatewayId, gatewayConfig, strategy, autoFailover } = body;
    const pool = getSmtpPoolConfig();

    if (action === 'test_handshake') {
      const targetGw = gatewayConfig || pool.gateways.find(g => g.id === gatewayId);
      if (!targetGw) {
        return NextResponse.json({ success: false, error: 'Gateway not found.' }, { status: 404 });
      }

      const testResult = await testGatewayHandshake(targetGw);
      return NextResponse.json({
        success: testResult.success,
        latencyMs: testResult.latencyMs,
        details: testResult.details,
        error: testResult.error
      });
    }

    if (action === 'test_all') {
      const results: Record<string, any> = {};
      for (const gw of pool.gateways) {
        results[gw.id] = await testGatewayHandshake(gw);
      }
      return NextResponse.json({
        success: true,
        results
      });
    }

    if (action === 'update_strategy') {
      if (strategy) pool.strategy = strategy as SmtpRoutingStrategy;
      if (autoFailover !== undefined) pool.autoFailover = Boolean(autoFailover);
      pool.updatedAt = new Date().toISOString();
      saveSmtpPoolConfig(pool);
      return NextResponse.json({ success: true, pool });
    }

    if (action === 'toggle_enabled') {
      pool.gateways = pool.gateways.map(g => g.id === gatewayId ? { ...g, enabled: !g.enabled } : g);
      pool.updatedAt = new Date().toISOString();
      saveSmtpPoolConfig(pool);
      return NextResponse.json({ success: true, pool });
    }

    if (action === 'set_primary') {
      if (!gatewayId) {
        return NextResponse.json({ success: false, error: 'Gateway ID is required.' }, { status: 400 });
      }
      
      const target = pool.gateways.find(g => g.id === gatewayId);
      if (!target) {
        return NextResponse.json({ success: false, error: 'Gateway not found.' }, { status: 404 });
      }

      const others = pool.gateways.filter(g => g.id !== gatewayId);
      // Target becomes priority 1
      target.priority = 1;
      // Others get priority 2, 3...
      others.forEach((g, idx) => {
        g.priority = idx + 2;
      });

      pool.gateways = [target, ...others];
      pool.updatedAt = new Date().toISOString();
      saveSmtpPoolConfig(pool);
      return NextResponse.json({ success: true, message: `${target.name} is now the Primary Relay (Priority 1).`, pool });
    }

    if (action === 'reset_quota') {
      const today = new Date().toISOString().split('T')[0];
      pool.gateways = pool.gateways.map(g => {
        if (!gatewayId || g.id === gatewayId) {
          return {
            ...g,
            sentToday: 0,
            lastResetDate: today,
            status: g.status === 'quota_exceeded' ? 'online' : g.status
          };
        }
        return g;
      });
      pool.updatedAt = new Date().toISOString();
      saveSmtpPoolConfig(pool);
      return NextResponse.json({ success: true, pool });
    }

    return NextResponse.json({ success: false, error: 'Invalid action provided.' }, { status: 400 });
  } catch (err: any) {
    console.error('Error handling SMTP action:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/**
 * DELETE /api/webmaster/smtp-gateways
 * Delete an SMTP gateway by ID
 */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Gateway ID is required.' }, { status: 400 });
    }

    const pool = getSmtpPoolConfig();
    if (pool.gateways.length <= 1) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete the only active SMTP gateway in the pool.' },
        { status: 400 }
      );
    }

    pool.gateways = pool.gateways.filter(g => g.id !== id);
    pool.updatedAt = new Date().toISOString();
    saveSmtpPoolConfig(pool);

    return NextResponse.json({
      success: true,
      message: 'SMTP Gateway deleted successfully.',
      pool
    });
  } catch (err: any) {
    console.error('Error deleting SMTP gateway:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

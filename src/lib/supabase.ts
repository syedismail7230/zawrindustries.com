import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Polyfill WebSocket in server-side Node.js environment if missing
if (typeof window === 'undefined' && typeof (globalThis as any).WebSocket === 'undefined') {
  try {
    const ws = require('ws');
    (globalThis as any).WebSocket = ws.WebSocket || ws;
  } catch {
    // ignore
  }
}

let clientInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
    return null;
  }
  if (!clientInstance) {
    clientInstance = createClient(supabaseUrl, supabaseKey);
  }
  return clientInstance;
};

// Proxy export ensures dynamic runtime initialization from process.env
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabase();
    if (!client) {
      const fallback = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'placeholder-anon-key'
      );
      return (fallback as any)[prop];
    }
    return (client as any)[prop];
  }
});

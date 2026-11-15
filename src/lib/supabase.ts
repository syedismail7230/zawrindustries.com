import { createClient } from '@supabase/supabase-js';

// Polyfill WebSocket in server-side Node.js environment if missing
if (typeof window === 'undefined' && typeof (globalThis as any).WebSocket === 'undefined') {
  try {
    const ws = require('ws');
    (globalThis as any).WebSocket = ws.WebSocket || ws;
  } catch {
    // ignore
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

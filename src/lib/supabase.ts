import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url     = import.meta.env.VITE_SUPABASE_URL  as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseConfigured = Boolean(url && anonKey);

if (!supabaseConfigured) {
  // eslint-disable-next-line no-console
  console.warn(
    '[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. ' +
    'Copy .env.example to .env.local and fill in your Supabase project values.',
  );
}

// Use safe placeholder URL when not configured so createClient does not throw.
// All auth/db calls will fail gracefully and the AuthProvider treats the app
// as "not configured" (shows a setup banner on the LoginScreen).
export const supabase: SupabaseClient = createClient(
  supabaseConfigured ? url! : 'https://placeholder.supabase.co',
  supabaseConfigured ? anonKey! : 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  },
);

import { createBrowserClient } from '@supabase/ssr';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'default_supabase_url';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'default_supabase_key';

export function createClient() {
    return createBrowserClient(
      supabaseUrl,
        supabaseKey
    )
  }
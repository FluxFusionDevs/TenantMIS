import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'default_supabase_url';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'default_supabase_key';

export const supabase = createClient(supabaseUrl, supabaseKey);
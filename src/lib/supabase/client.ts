import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Debug logging
console.log('Supabase Configuration:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  url: supabaseUrl ? `${supabaseUrl.substring(0, 8)}...` : 'missing',
});

// Check if Supabase credentials are available
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;

// Create Supabase client only if credentials are available
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper function to check if Supabase is configured
export const isSupabaseAvailable = () => {
  const available = !!isSupabaseConfigured;
  console.log('Supabase availability check:', available);
  return available;
}; 
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = (import.meta.env.PUBLIC_SUPABASE_URL as string)
  || (import.meta.env.VITE_SUPABASE_URL as string)
  || "https://dkdakwyrqyfdkyukqmqs.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = (import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY as string)
  || (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string)
  || "";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { storage: typeof window !== 'undefined' ? localStorage : undefined, persistSession: true, autoRefreshToken: true },
});

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL || "https://dkdakwyrqyfdkyukqmqs.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";

export const supabase = SUPABASE_PUBLISHABLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
  : null;

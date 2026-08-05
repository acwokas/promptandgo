// Supabase browser client.
// Configured via Vite env vars so we can swap projects without code changes.
//
// Required env vars (set in .env.local for dev, in Cloudflare Pages for prod):
//   VITE_SUPABASE_URL              e.g. https://xxxxx.supabase.co
//   VITE_SUPABASE_PUBLISHABLE_KEY  the anon/publishable key
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env
  .VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  throw new Error(
    "Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env.local (dev) or your hosting provider env (prod)."
  );
}

// CDN-resilience: this is a client-side SPA, so there is no server page to
// keep from hanging - the risk here is every supabase.from()/auth/rpc call
// in the app sharing this one client, and a Supabase outage leaving any of
// them spinning forever with no feedback. A custom fetch on the client
// bounds every underlying HTTP call at 5s and rejects with a clear timeout
// error instead, which existing react-query call sites already surface as
// an error/retry state rather than an infinite loading spinner.
const SUPABASE_FETCH_TIMEOUT_MS = 5000;

function fetchWithTimeout(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SUPABASE_FETCH_TIMEOUT_MS);
  // Respect a caller-supplied signal too (supabase-js passes one for some
  // calls): abort ours if theirs fires, and vice versa.
  if (init?.signal) {
    init.signal.addEventListener("abort", () => controller.abort());
  }
  return fetch(input, { ...init, signal: controller.signal }).finally(() =>
    clearTimeout(timeout)
  );
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      fetch: fetchWithTimeout,
    },
  }
);

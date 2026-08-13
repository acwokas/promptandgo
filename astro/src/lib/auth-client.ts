import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const URL = (import.meta.env.PUBLIC_SUPABASE_URL as string) || "https://dkdakwyrqyfdkyukqmqs.supabase.co";
const KEY = (import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY as string) || "";

let client: SupabaseClient | null = null;
export function sb(): SupabaseClient {
  if (!client) {
    client = createClient(URL, KEY, {
      auth: {
        storage: typeof window !== "undefined" ? localStorage : undefined,
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return client;
}

export type Entitlement = {
  loggedIn: boolean;
  email?: string;
  isSubscribed: boolean;
  ownedPackIds: Set<string>;
  ownedPromptIds: Set<string>;
};

export async function getEntitlement(): Promise<Entitlement> {
  const c = sb();
  const { data: { user } } = await c.auth.getUser();
  const result: Entitlement = {
    loggedIn: !!user,
    email: user?.email,
    isSubscribed: false,
    ownedPackIds: new Set(),
    ownedPromptIds: new Set(),
  };
  if (!user) return result;

  const [{ data: subs }, { data: packs }, { data: prompts }] = await Promise.all([
    c.from("subscribers").select("subscribed,subscription_end").eq("user_id", user.id).maybeSingle(),
    c.from("pack_access").select("pack_id").eq("user_id", user.id),
    c.from("prompt_access").select("prompt_id").eq("user_id", user.id),
  ]);

  if (subs?.subscribed && (!subs.subscription_end || new Date(subs.subscription_end) > new Date())) {
    result.isSubscribed = true;
  }
  for (const p of packs ?? []) result.ownedPackIds.add(p.pack_id);
  for (const p of prompts ?? []) result.ownedPromptIds.add(p.prompt_id);
  return result;
}

export function canAccessPrompt(ent: Entitlement, prompt: { id: string; is_pro: boolean }, pack_ids: string[] = []): boolean {
  if (!prompt.is_pro) return true;
  if (!ent.loggedIn) return false;
  if (ent.isSubscribed) return true;
  if (ent.ownedPromptIds.has(prompt.id)) return true;
  return pack_ids.some(p => ent.ownedPackIds.has(p));
}

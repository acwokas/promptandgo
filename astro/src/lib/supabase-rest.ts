const URL = (import.meta.env.PUBLIC_SUPABASE_URL as string) || "https://dkdakwyrqyfdkyukqmqs.supabase.co";
const KEY = (import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY as string) || "";

// Called from page frontmatter at build time (output: 'static'), so a hang
// here stalls the whole build/deploy rather than a live visitor - still
// worth bounding so a bad Supabase day doesn't hang CI indefinitely.
export async function sbFetch<T = any>(path: string): Promise<T[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(`${URL}${path}`, {
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`supabase ${path}: ${res.status} ${await res.text()}`);
    return res.json();
  } finally {
    clearTimeout(timeout);
  }
}

export async function sbSelect<T = any>(
  table: string,
  options: { select?: string; filter?: string; order?: string; limit?: number } = {}
): Promise<T[]> {
  const params = new URLSearchParams();
  if (options.select) params.set("select", options.select);
  if (options.filter) {
    for (const f of options.filter.split("&")) {
      const [k, v] = f.split("=");
      if (k && v) params.set(k, v);
    }
  }
  if (options.order) params.set("order", options.order);
  if (options.limit) params.set("limit", String(options.limit));
  return sbFetch<T>(`/rest/v1/${table}?${params.toString()}`);
}

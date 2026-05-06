const URL = (import.meta.env.PUBLIC_SUPABASE_URL as string) || "https://dkdakwyrqyfdkyukqmqs.supabase.co";
const KEY = (import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY as string) || "";

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
  const res = await fetch(`${URL}/rest/v1/${table}?${params.toString()}`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  });
  if (!res.ok) throw new Error(`supabase ${table}: ${res.status} ${await res.text()}`);
  return res.json();
}

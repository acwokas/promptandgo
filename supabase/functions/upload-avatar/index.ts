import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_BYTES = 4 * 1024 * 1024;

// Magic-byte signatures for the only formats we accept. Filename/declared
// Content-Type are attacker-controlled and are NOT trusted for this check.
const SIGNATURES: Array<{ ext: string; mime: string; check: (b: Uint8Array) => boolean }> = [
  { ext: "jpg", mime: "image/jpeg", check: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  {
    ext: "png",
    mime: "image/png",
    check: (b) =>
      b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 &&
      b[4] === 0x0d && b[5] === 0x0a && b[6] === 0x1a && b[7] === 0x0a,
  },
  {
    ext: "gif",
    mime: "image/gif",
    check: (b) =>
      b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38 && (b[4] === 0x37 || b[4] === 0x39) && b[5] === 0x61,
  },
  {
    ext: "webp",
    mime: "image/webp",
    check: (b) =>
      b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
      b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50,
  },
];

// Explicit deny-list for markup that could execute as HTML/SVG/script, checked
// against the leading bytes even if a signature above also happens to match
// (defensive against polyglot files).
const FORBIDDEN_MARKERS = ["<svg", "<?xml", "<script", "<!doctype html", "<html"];

function sniffMarkup(head: string): boolean {
  const lower = head.toLowerCase();
  return FORBIDDEN_MARKERS.some((m) => lower.includes(m));
}

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

const checkRateLimit = async (key: string, limit = 10, windowMs = 3600000): Promise<boolean> => {
  const now = new Date();
  const windowStart = new Date(now.getTime() - windowMs);
  try {
    await admin.from("rate_limits").delete().lt("window_start", windowStart.toISOString());
    const { data: existing } = await admin
      .from("rate_limits")
      .select("count, window_start")
      .eq("key", key)
      .gte("window_start", windowStart.toISOString())
      .single();
    if (!existing) {
      await admin.from("rate_limits").insert({ key, count: 1, window_start: now.toISOString() });
      return true;
    }
    if (existing.count >= limit) return false;
    await admin.from("rate_limits").update({ count: existing.count + 1 }).eq("key", key).eq("window_start", existing.window_start);
    return true;
  } catch (error) {
    console.error("Rate limit check failed:", error);
    return true;
  }
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await admin.auth.getUser(token);
    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: "Invalid session" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const user = userData.user;

    if (!(await checkRateLimit(`avatar_upload_${user.id}`))) {
      return new Response(JSON.stringify({ error: "Too many uploads. Try again later." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return new Response(JSON.stringify({ error: "No file provided" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (file.size === 0 || file.size > MAX_BYTES) {
      return new Response(JSON.stringify({ error: "Image must be under 4 MB." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    const head = new TextDecoder("utf-8", { fatal: false }).decode(bytes.slice(0, 512));
    if (sniffMarkup(head)) {
      return new Response(JSON.stringify({ error: "Unsupported file type." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const match = SIGNATURES.find((sig) => sig.check(bytes));
    if (!match) {
      return new Response(JSON.stringify({ error: "Unsupported file type. Use JPEG, PNG, WEBP or GIF." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const path = `${user.id}/avatar-${Date.now()}.${match.ext}`;
    const { error: upErr } = await admin.storage.from("avatars").upload(path, bytes, { upsert: true, contentType: match.mime });
    if (upErr) throw upErr;

    const { data: pub } = admin.storage.from("avatars").getPublicUrl(path);
    const { error: metaErr } = await admin.auth.admin.updateUserById(user.id, { user_metadata: { ...user.user_metadata, avatar_url: pub.publicUrl } });
    if (metaErr) throw metaErr;

    return new Response(JSON.stringify({ url: pub.publicUrl }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("upload-avatar error:", error);
    return new Response(JSON.stringify({ error: "Upload failed." }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

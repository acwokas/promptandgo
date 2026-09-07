import { useEffect, useRef, useState } from "react";
import { sb } from "../lib/auth-client";

// Avatars are served from a public bucket, so an uploaded SVG is a script that runs on
// whatever origin serves it. Only raster formats are accepted, and the stored extension
// comes from this map rather than the user-supplied filename.
const SAFE_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
const SAFE_ACCEPT = Object.keys(SAFE_IMAGE_TYPES).join(",");

// f.type is browser-reported and trivially spoofed, so also check the leading bytes.
// Markup signatures are rejected outright; otherwise require a known raster magic number.
async function looksLikeRasterImage(f: File): Promise<boolean> {
  const head = new Uint8Array(await f.slice(0, 64).arrayBuffer());
  const text = new TextDecoder("utf-8", { fatal: false }).decode(head).trimStart().toLowerCase();
  if (text.startsWith("<svg") || text.startsWith("<?xml") || text.startsWith("<!doctype") || text.startsWith("<script") || text.startsWith("<html")) {
    return false;
  }
  const b = head;
  const jpeg = b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
  const png = b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47;
  const gif = b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38;
  const webp = b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
               b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50;
  return jpeg || png || gif || webp;
}

export default function AccountProfile() {
  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    sb().auth.getUser().then(({ data: { user } }) => {
      if (!user) { window.location.href = "/auth?next=/account/profile"; return; }
      setUser(user);
      setFullName(user.user_metadata?.full_name || user.user_metadata?.name || "");
      setAvatarUrl(user.user_metadata?.avatar_url || "");
    });
  }, []);

  async function save() {
    setBusy(true); setErr(null); setMsg(null);
    try {
      const { error } = await sb().auth.updateUser({
        data: { full_name: fullName.trim(), avatar_url: avatarUrl },
      });
      if (error) throw error;
      setMsg("Saved.");
    } catch (e: any) {
      setErr(e?.message || "Save failed.");
    } finally { setBusy(false); }
  }

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f || !user) return;
    if (f.size > 4 * 1024 * 1024) { setErr("Image must be under 4 MB."); return; }
    setBusy(true); setErr(null); setMsg(null);
    try {
      // Extension and content type are derived from a whitelist, never from f.name or f.type.
      // SVG is excluded: it is an executable document, and the bucket serves public URLs.
      const ext = SAFE_IMAGE_TYPES[f.type];
      if (!ext) { setErr("Please use a JPEG, PNG, WebP or GIF image."); return; }
      if (!(await looksLikeRasterImage(f))) {
        setErr("That file's contents don't match its image type.");
        return;
      }
      const path = `${user.id}/avatar-${Date.now()}.${ext}`;
      const { error: upErr } = await sb().storage.from("avatars").upload(path, f, { upsert: true, contentType: f.type });
      if (upErr) throw upErr;
      const { data } = sb().storage.from("avatars").getPublicUrl(path);
      const url = data.publicUrl;
      setAvatarUrl(url);
      const { error } = await sb().auth.updateUser({ data: { avatar_url: url } });
      if (error) throw error;
      setMsg("Avatar updated.");
    } catch (e: any) {
      setErr(e?.message || "Upload failed.");
    } finally { setBusy(false); }
  }

  if (!user) {
    return <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">Loading…</div>;
  }

  const initials = (fullName || user.email || "??").slice(0, 2).toUpperCase();

  return (
    <div className="rounded-3xl border border-border/60 bg-card p-6 md:p-8">
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <div className="relative shrink-0">
          {avatarUrl
            ? <img src={avatarUrl} alt="" className="w-24 h-24 rounded-full object-cover border-4 border-background shadow-md" referrerPolicy="no-referrer" />
            : <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground inline-flex items-center justify-center text-2xl font-bold shadow-md">{initials}</div>
          }
          <input ref={fileRef} type="file" accept={SAFE_ACCEPT} onChange={onPickFile} className="hidden" />
          <button type="button" onClick={() => fileRef.current?.click()} disabled={busy}
                  className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-primary text-primary-foreground border-2 border-background inline-flex items-center justify-center hover:bg-primary/90 disabled:opacity-50">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          </button>
        </div>
        <div className="flex-1 w-full">
          <h2 className="text-xl font-bold">{fullName || user.email}</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Display name</label>
          <input value={fullName} onChange={e => setFullName(e.target.value)}
                 className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 h-11 text-sm" />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</label>
          <input value={user.email || ""} disabled
                 className="mt-1.5 w-full rounded-xl border border-border bg-secondary/50 px-3 h-11 text-sm cursor-not-allowed" />
          <p className="mt-1 text-xs text-muted-foreground">To change your email, sign out and create a new account, or contact support.</p>
        </div>
      </div>

      {err && <p className="mt-4 text-sm text-destructive">{err}</p>}
      {msg && <p className="mt-4 text-sm text-primary font-semibold">{msg}</p>}

      <div className="mt-6 flex gap-3">
        <button onClick={save} disabled={busy}
                className="inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground px-6 h-11 font-semibold hover:bg-primary/90 disabled:opacity-50">
          {busy ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}

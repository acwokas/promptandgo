import { useEffect, useState } from "react";
import { sb } from "@astro/lib/auth-client";

interface Props { promptId: string; size?: "sm" | "md" }

export default function FavouriteButton({ promptId, size = "md" }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [fav, setFav] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const c = sb();
      const { data: { user } } = await c.auth.getUser();
      if (!user) {
        setLoaded(true); return;
      }
      setLoggedIn(true);
      const { data } = await c.from("favorites").select("id").eq("user_id", user.id).eq("prompt_id", promptId).maybeSingle();
      setFav(!!data);
      setLoaded(true);
    })();
  }, [promptId]);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault(); e.stopPropagation();
    const c = sb();
    const { data: { user } } = await c.auth.getUser();
    if (!user) {
      window.location.href = `/auth?action=signup&next=${encodeURIComponent(window.location.pathname)}`;
      return;
    }
    setBusy(true);
    if (fav) {
      await c.from("favorites").delete().eq("user_id", user.id).eq("prompt_id", promptId);
      setFav(false);
    } else {
      await c.from("favorites").insert({ user_id: user.id, prompt_id: promptId });
      setFav(true);
    }
    setBusy(false);
  }

  const cls = size === "sm"
    ? "w-8 h-8"
    : "w-10 h-10";
  return (
    <button onClick={toggle} disabled={busy || !loaded}
      aria-label={fav ? "Remove from saved" : "Save prompt"}
      title={fav ? "Saved · click to remove" : (loggedIn ? "Save prompt" : "Sign in to save")}
      className={`inline-flex items-center justify-center rounded-lg ${cls} border border-border bg-background hover:border-primary/40 hover:bg-secondary transition-colors disabled:opacity-50`}>
      {fav ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-primary"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground/70"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
      )}
    </button>
  );
}

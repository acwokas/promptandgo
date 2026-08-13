import { useState } from "react";
import { sb } from "@astro/lib/auth-client";

const SUPA_URL = (import.meta as any).env?.PUBLIC_SUPABASE_URL || "https://dkdakwyrqyfdkyukqmqs.supabase.co";

interface Props {
  type: "pack" | "prompt" | "subscription_monthly" | "subscription_annual";
  itemId?: string;
  title?: string;
  amountCents?: number;
  className?: string;
  children?: React.ReactNode;
  variant?: "primary" | "secondary";
}

export default function BuyButton({ type, itemId, title, amountCents, className = "", children, variant = "primary" }: Props) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handle() {
    setErr(null);
    setBusy(true);
    try {
      const c = sb();
      const { data: { session } } = await c.auth.getSession();
      if (!session) {
        const next = encodeURIComponent(window.location.pathname + window.location.search);
        const buyParam = type === "pack" ? `&buy_pack=${itemId}` : type === "prompt" ? `&buy_prompt=${itemId}` : `&plan=${type.replace("subscription_","")}`;
        window.location.href = `/auth?action=signup&next=${next}${buyParam}`;
        return;
      }

      const fnPath = type.startsWith("subscription") ? "create-checkout" : "create-payment";
      const body: any = type === "subscription_annual"
        ? { plan: "annual" }
        : type === "subscription_monthly"
        ? { plan: "monthly" }
        : { items: [{ id: itemId, type: type === "pack" ? "pack" : "prompt", title, unitAmountCents: amountCents }] };

      const res = await fetch(`${SUPA_URL}/functions/v1/${fnPath}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `Checkout failed (${res.status})`);
      }
      const j = await res.json();
      if (j.url) window.location.href = j.url;
      else throw new Error("No checkout URL returned");
    } catch (e: any) {
      setErr(e.message || "Checkout failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const baseCls = variant === "primary"
    ? "bg-primary text-primary-foreground hover:bg-primary/90"
    : "border-2 border-primary/40 bg-primary/5 text-primary hover:bg-primary/10";

  return (
    <div>
      <button onClick={handle} disabled={busy} className={`block w-full text-center rounded-xl ${baseCls} px-5 h-11 leading-[2.75rem] font-semibold transition-colors disabled:opacity-50 ${className}`}>
        {busy ? "Loading…" : children}
      </button>
      {err && <p className="mt-2 text-sm text-destructive">{err}</p>}
    </div>
  );
}

import { useEffect, useState } from "react";
import { getEntitlement, type Entitlement } from "@astro/lib/auth-client";
import BuyButton from "./BuyButton";

interface Props {
  promptId: string;
  promptBody: string;
  imagePrompt?: string | null;
  isPro: boolean;
  packIds: string[];   // packs that contain this prompt
  cheapestPack?: { id: string; slug: string; name: string; price_cents: number };
  promptTitle: string;
}

export default function PromptLock({ promptId, promptBody, imagePrompt, isPro, packIds, cheapestPack, promptTitle }: Props) {
  const [ent, setEnt] = useState<Entitlement | null>(null);

  useEffect(() => {
    getEntitlement().then(setEnt);
  }, []);

  const access = !isPro
    ? true
    : ent === null
    ? null
    : ent.isSubscribed || ent.ownedPromptIds.has(promptId) || packIds.some(p => ent.ownedPackIds.has(p));

  // Free or fully entitled — show full content
  if (access === true) {
    return (
      <>
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-3 bg-secondary/40">
            <span className="text-xs font-semibold uppercase tracking-wider text-foreground/60">Prompt</span>
            <CopyButton text={promptBody} />
          </div>
          <pre className="p-5 md:p-6 text-sm md:text-base whitespace-pre-wrap font-sans leading-relaxed text-foreground bg-card">{promptBody}</pre>
        </div>
        {imagePrompt && (
          <div className="mt-5 rounded-2xl border border-border bg-secondary/40 p-5 md:p-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-foreground/60 mb-2">For image models</div>
            <pre className="text-sm whitespace-pre-wrap font-mono leading-relaxed text-foreground">{imagePrompt}</pre>
          </div>
        )}
      </>
    );
  }

  // Loading entitlement
  if (access === null) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 animate-pulse">
        <div className="h-4 bg-secondary rounded w-1/3 mb-3"></div>
        <div className="h-3 bg-secondary rounded mb-2"></div>
        <div className="h-3 bg-secondary rounded mb-2 w-5/6"></div>
        <div className="h-3 bg-secondary rounded w-2/3"></div>
      </div>
    );
  }

  // Locked — show preview + unlock options
  const preview = (promptBody || "").split("\n").slice(0, 2).join("\n");
  return (
    <div className="rounded-2xl border-2 border-primary/30 bg-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-5 py-3 bg-gradient-to-r from-amber-500/10 to-amber-500/5">
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1l3 7h7l-5.5 4.5L18 20l-6-4-6 4 1.5-7.5L2 8h7z"/></svg>
          Premium prompt
        </span>
      </div>
      <div className="p-5 md:p-6">
        <p className="text-sm md:text-base text-foreground/70 italic leading-relaxed">{preview}…</p>
        <div className="mt-5 rounded-xl border border-border bg-secondary/40 p-5">
          <h3 className="font-bold text-base">Unlock this prompt</h3>
          <p className="mt-1 text-sm text-foreground/75">Three ways to access — pick what fits.</p>
          <div className="mt-4 grid sm:grid-cols-3 gap-2.5">
            <BuyButton type="prompt" itemId={promptId} title={promptTitle} amountCents={199}>
              Just this — $1.99
            </BuyButton>
            {cheapestPack && (
              <BuyButton type="pack" itemId={cheapestPack.id} title={cheapestPack.name} amountCents={cheapestPack.price_cents}>
                Pack — ${(cheapestPack.price_cents / 100).toFixed(2)}
              </BuyButton>
            )}
            <BuyButton type="subscription_monthly" variant="secondary">
              Subscribe — $12/mo
            </BuyButton>
          </div>
          {!ent?.loggedIn && (
            <p className="mt-3 text-xs text-foreground/55">You'll be asked to sign in/sign up at checkout.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="inline-flex items-center gap-1.5 rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-xs font-semibold hover:bg-primary/90 transition-colors">
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

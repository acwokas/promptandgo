import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { CheckCircle2, XCircle, Pencil, Clock, RotateCcw, Filter } from "lucide-react";

type Status = "pending" | "approved" | "needs_edit" | "rejected";

interface PromptRow {
  id: string;
  title: string;
  what_for: string | null;
  prompt: string;
  excerpt: string | null;
  category_id: string;
  subcategory_id: string | null;
  review_status: Status;
  review_notes: string | null;
  reviewed_at: string | null;
  created_at: string;
}

interface Cat { id: string; name: string; slug: string }
interface Sub { id: string; name: string; slug: string; category_id: string }

const STATUSES: { v: Status; label: string; icon: any; color: string }[] = [
  { v: "pending", label: "Pending", icon: Clock, color: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30" },
  { v: "approved", label: "Approved", icon: CheckCircle2, color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30" },
  { v: "needs_edit", label: "Needs edit", icon: Pencil, color: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30" },
  { v: "rejected", label: "Rejected", icon: XCircle, color: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30" },
];

export default function AdminPromptReview() {
  const { user, loading: authLoading } = useSupabaseAuth();
  const { isAdmin, loading: adminLoading } = useIsAdmin();

  const [prompts, setPrompts] = useState<PromptRow[]>([]);
  const [cats, setCats] = useState<Cat[]>([]);
  const [subs, setSubs] = useState<Sub[]>([]);
  const [counts, setCounts] = useState<Record<Status, number>>({ pending: 0, approved: 0, needs_edit: 0, rejected: 0 });

  const [filterStatus, setFilterStatus] = useState<Status>("pending");
  const [filterCat, setFilterCat] = useState<string>("all");
  const [filterSub, setFilterSub] = useState<string>("all");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Record<string, Partial<PromptRow>>>({});
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());

  // Counts (independent of filters)
  async function loadCounts() {
    const { data } = await supabase
      .from("prompts")
      .select("review_status", { count: "exact" });
    if (!data) return;
    const next: Record<Status, number> = { pending: 0, approved: 0, needs_edit: 0, rejected: 0 };
    for (const r of data as any[]) next[r.review_status as Status] = (next[r.review_status as Status] ?? 0) + 1;
    setCounts(next);
  }

  async function loadPrompts() {
    setLoading(true);
    let q = supabase
      .from("prompts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (filterStatus !== ("all" as any)) q = q.eq("review_status", filterStatus);
    if (filterCat !== "all") q = q.eq("category_id", filterCat);
    if (filterSub !== "all") q = q.eq("subcategory_id", filterSub);
    if (search.trim()) q = q.or(`title.ilike.%${search}%,prompt.ilike.%${search}%`);
    const { data, error } = await q;
    if (error) toast({ title: "Load failed", description: error.message });
    setPrompts((data as PromptRow[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    (async () => {
      const [{ data: c }, { data: s }] = await Promise.all([
        supabase.from("categories").select("*").order("name"),
        supabase.from("subcategories").select("*").order("name"),
      ]);
      setCats((c as Cat[]) ?? []);
      setSubs((s as Sub[]) ?? []);
      await loadCounts();
    })();
  }, []);

  useEffect(() => {
    if (!authLoading && !adminLoading && isAdmin) loadPrompts();
  }, [filterStatus, filterCat, filterSub, search, authLoading, adminLoading, isAdmin]);

  const filteredSubs = useMemo(
    () => (filterCat === "all" ? subs : subs.filter(s => s.category_id === filterCat)),
    [subs, filterCat]
  );

  async function setStatus(id: string, status: Status) {
    setSavingIds(s => new Set(s).add(id));
    const e = editing[id] ?? {};
    const update: any = {
      review_status: status,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user?.id ?? null,
    };
    if (e.title !== undefined) update.title = e.title;
    if (e.what_for !== undefined) update.what_for = e.what_for;
    if (e.prompt !== undefined) update.prompt = e.prompt;
    if (e.excerpt !== undefined) update.excerpt = e.excerpt;
    if (e.review_notes !== undefined) update.review_notes = e.review_notes;
    const { error } = await supabase.from("prompts").update(update).eq("id", id);
    setSavingIds(s => { const n = new Set(s); n.delete(id); return n; });
    if (error) {
      toast({ title: "Save failed", description: error.message });
      return;
    }
    setEditing(({ [id]: _, ...rest }) => rest);
    toast({ title: `Marked ${status.replace("_", " ")}` });
    await Promise.all([loadPrompts(), loadCounts()]);
  }

  async function bulkApprovePending() {
    if (!confirm(`Approve all ${counts.pending} pending prompts? Use only after a quality spot-check.`)) return;
    const { error } = await supabase
      .from("prompts")
      .update({ review_status: "approved", reviewed_at: new Date().toISOString(), reviewed_by: user?.id ?? null })
      .eq("review_status", "pending");
    if (error) {
      toast({ title: "Bulk approve failed", description: error.message });
      return;
    }
    toast({ title: "Bulk approve queued" });
    await Promise.all([loadPrompts(), loadCounts()]);
  }

  if (authLoading || adminLoading) return <Skeleton className="m-8 h-64" />;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <>
      <SEO title="Prompt Review Queue — Admin | PromptAndGo" description="Review and approve AI-generated prompts before they appear in the public library." noindex />
      <AdminBreadcrumb items={[{ label: "Admin", href: "/admin" }, { label: "Prompt Review" }]} />
      <PageHero title="Prompt Review Queue" description="Approve, edit, or reject AI-generated prompts. Only approved prompts show in the public library." />

      <div className="container max-w-7xl mb-10">
        {/* Counts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {STATUSES.map(s => {
            const Icon = s.icon;
            const active = filterStatus === s.v;
            return (
              <button
                key={s.v}
                onClick={() => setFilterStatus(s.v)}
                className={`rounded-2xl border p-4 text-left transition-colors ${active ? "border-primary/50 ring-1 ring-primary/30 bg-card" : "border-border/60 bg-card hover:border-primary/30"}`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">{s.label}</span>
                </div>
                <div className="mt-2 text-3xl font-extrabold">{counts[s.v] ?? 0}</div>
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <Label>Category</Label>
                <Select value={filterCat} onValueChange={(v) => { setFilterCat(v); setFilterSub("all"); }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {cats.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Subcategory</Label>
                <Select value={filterSub} onValueChange={setFilterSub}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All subcategories</SelectItem>
                    {filteredSubs.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Search title or body</Label>
                <Input placeholder="filter by keyword..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
            {filterStatus === "pending" && counts.pending > 0 && (
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" onClick={bulkApprovePending}>
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  Approve all {counts.pending} pending (use carefully)
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* List */}
        {loading ? (
          <div className="grid gap-3">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-40" />)}
          </div>
        ) : prompts.length === 0 ? (
          <Card className="p-10 text-center text-muted-foreground">
            No prompts match these filters.
          </Card>
        ) : (
          <div className="grid gap-4">
            {prompts.map(p => {
              const e = editing[p.id] ?? {};
              const cat = cats.find(c => c.id === p.category_id);
              const sub = subs.find(s => s.id === p.subcategory_id);
              const saving = savingIds.has(p.id);
              const dirty = Object.keys(e).length > 0;
              const statusInfo = STATUSES.find(s => s.v === p.review_status)!;
              const StatusIcon = statusInfo.icon;
              return (
                <Card key={p.id} className="overflow-hidden">
                  <CardHeader className="pb-3 flex-row items-start justify-between gap-4 space-y-0">
                    <div className="flex-1 min-w-0">
                      <Input
                        value={e.title ?? p.title}
                        onChange={ev => setEditing(s => ({ ...s, [p.id]: { ...s[p.id], title: ev.target.value } }))}
                        className="font-semibold text-base h-9"
                      />
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {cat && <Badge variant="outline">{cat.name}</Badge>}
                        {sub && <Badge variant="outline">{sub.name}</Badge>}
                        <Badge className={statusInfo.color}><StatusIcon className="w-3 h-3 mr-1" />{statusInfo.label}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-xs">What for</Label>
                      <Input
                        value={e.what_for ?? p.what_for ?? ""}
                        onChange={ev => setEditing(s => ({ ...s, [p.id]: { ...s[p.id], what_for: ev.target.value } }))}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Prompt body</Label>
                      <Textarea
                        rows={6}
                        value={e.prompt ?? p.prompt}
                        onChange={ev => setEditing(s => ({ ...s, [p.id]: { ...s[p.id], prompt: ev.target.value } }))}
                        className="font-mono text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Review notes (optional)</Label>
                      <Input
                        placeholder="Why was this rejected / what needs editing?"
                        value={e.review_notes ?? p.review_notes ?? ""}
                        onChange={ev => setEditing(s => ({ ...s, [p.id]: { ...s[p.id], review_notes: ev.target.value } }))}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button size="sm" variant="default" disabled={saving} onClick={() => setStatus(p.id, "approved")} className="bg-emerald-600 hover:bg-emerald-700">
                        <CheckCircle2 className="w-4 h-4 mr-1.5" />Approve{dirty ? " + save" : ""}
                      </Button>
                      <Button size="sm" variant="outline" disabled={saving} onClick={() => setStatus(p.id, "needs_edit")}>
                        <Pencil className="w-4 h-4 mr-1.5" />Needs edit
                      </Button>
                      <Button size="sm" variant="outline" disabled={saving} onClick={() => setStatus(p.id, "rejected")} className="text-rose-700 dark:text-rose-300">
                        <XCircle className="w-4 h-4 mr-1.5" />Reject
                      </Button>
                      {p.review_status !== "pending" && (
                        <Button size="sm" variant="ghost" disabled={saving} onClick={() => setStatus(p.id, "pending")}>
                          <RotateCcw className="w-4 h-4 mr-1.5" />Reset to pending
                        </Button>
                      )}
                      {dirty && <span className="text-xs text-muted-foreground self-center">unsaved changes</span>}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={`block text-sm font-medium mb-1.5 ${className ?? ""}`}>{children}</label>;
}

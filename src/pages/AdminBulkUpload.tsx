import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import Papa from "papaparse";

// Expected JSON formats:
// categories: [{ name: string, slug: string }]
// subcategories: [{ category_slug: string, name: string, slug: string }]
// tags: [{ name: string }]
// prompts: [{ title: string, what_for?: string, prompt: string, image_prompt?: string, excerpt?: string, category_slug: string, subcategory_slug?: string, tags?: string[] }]

const samples: Record<string, string> = {
  categories: `[
  { "name": "Marketing", "slug": "marketing" },
  { "name": "Productivity", "slug": "productivity" }
]`,
  subcategories: `[
  { "category_slug": "marketing", "name": "Email", "slug": "email" },
  { "category_slug": "productivity", "name": "Writing", "slug": "writing" }
]`,
  tags: `[
  { "name": "email" },
  { "name": "newsletter" },
  { "name": "copywriting" }
]`,
  prompts: `[
  {
    "title": "Newsletter Outline Generator",
    "what_for": "Create a weekly newsletter outline",
    "prompt": "You are an expert newsletter editor...",
    "excerpt": "Generate a clear, repeatable email structure in seconds.",
    "category_slug": "marketing",
    "subcategory_slug": "email",
    "tags": ["newsletter", "email"]
  }
]`,
};

const AdminBulkUpload = () => {
  const [entity, setEntity] = useState<"categories" | "subcategories" | "tags" | "prompts">("categories");
  const [jsonText, setJsonText] = useState("");
  const [loading, setLoading] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const placeholder = useMemo(() => samples[entity], [entity]);

  const parseInput = () => {
    try {
      const data = JSON.parse(jsonText || placeholder);
      if (!Array.isArray(data)) throw new Error("JSON must be an array");
      return data;
    } catch (e: any) {
      toast({ title: "Invalid JSON", description: e.message, variant: "destructive" });
      return null;
    }
  };

  const uploadCategories = async (rows: any[]) => {
    // Deduplicate by slug to avoid ON CONFLICT affecting the same row twice
    const seen = new Set<string>();
    const payload = rows
      .map((r) => ({ name: r.name, slug: r.slug }))
      .filter((r) => r.name && r.slug && !seen.has(r.slug) && (seen.add(r.slug), true));
    if (payload.length === 0) return { inserted: 0 };
    const { error } = await supabase.from("categories").upsert(payload, { onConflict: "slug" });
    if (error) throw error;
    return { inserted: payload.length };
  };

  const uploadSubcategories = async (rows: any[]) => {
    const neededSlugs = Array.from(new Set(rows.map((r) => r.category_slug).filter(Boolean)));
    const { data: cats, error: catErr } = await supabase.from("categories").select("id,slug").in("slug", neededSlugs);
    if (catErr) throw catErr;
    const catMap = new Map<string, string>((cats || []).map((c: any) => [c.slug, c.id]));

    const raw = rows
      .map((r) => ({ category_id: catMap.get(r.category_slug), name: r.name, slug: r.slug }))
      .filter((r) => r.category_id && r.name && r.slug);

    // Deduplicate by composite key category_id + slug
    const byKey = new Map<string, { category_id: string; name: string; slug: string }>();
    raw.forEach((r) => {
      const key = `${r.category_id}:${r.slug}`;
      if (!byKey.has(key)) byKey.set(key, r);
    });
    const payload = Array.from(byKey.values());

    if (payload.length === 0) return { inserted: 0 };
    const { error } = await supabase.from("subcategories").upsert(payload, { onConflict: "category_id,slug" });
    if (error) throw error;
    return { inserted: payload.length };
  };

  const ensureTags = async (names: string[]) => {
    const unique = Array.from(new Set(names)).filter(Boolean);
    if (unique.length === 0) return new Map<string, string>();
    const { error: upErr } = await supabase.from("tags").upsert(unique.map((n) => ({ name: n })), { onConflict: "name" });
    if (upErr) throw upErr;
    const { data: tagRows, error } = await supabase.from("tags").select("id,name").in("name", unique);
    if (error) throw error;
    return new Map<string, string>((tagRows || []).map((t: any) => [t.name, t.id]));
  };

  const uploadPrompts = async (rows: any[]) => {
    // Resolve categories/subcategories
    const catSlugs = Array.from(new Set(rows.map((r) => r.category_slug).filter(Boolean)));
    const subSlugs = Array.from(new Set(rows.map((r) => r.subcategory_slug).filter(Boolean)));

    const [{ data: cats, error: catErr }, { data: subs, error: subErr }] = await Promise.all([
      supabase.from("categories").select("id,slug").in("slug", catSlugs),
      supabase.from("subcategories").select("id,slug,category_id").in("slug", subSlugs),
    ]);
    if (catErr) throw catErr;
    if (subErr) throw subErr;

    const catMap = new Map<string, string>((cats || []).map((c: any) => [c.slug, c.id]));
    // group subs by slug but we can't disambiguate same slug across categories in this MVP
    const subMap = new Map<string, string>((subs || []).map((s: any) => [s.slug, s.id]));

    // Gather all tags
    const allTagNames = rows.flatMap((r) => r.tags || []);
    const tagMap = await ensureTags(allTagNames);

    const toInsert = rows
      .map((r) => ({
        category_id: catMap.get(r.category_slug),
        subcategory_id: r.subcategory_slug ? subMap.get(r.subcategory_slug) : null,
        title: r.title,
        what_for: r.what_for ?? null,
        prompt: r.prompt,
        image_prompt: r.image_prompt ?? null,
        excerpt: r.excerpt ?? null,
        _tag_names: r.tags || [],
      }))
      .filter((r) => r.category_id && r.title && r.prompt);

    if (toInsert.length === 0) return { inserted: 0 };

    const insertPayload = toInsert.map(({ _tag_names, ...p }) => p);
    const { data: inserted, error } = await supabase.from("prompts").insert(insertPayload).select("id");
    if (error) throw error;

    const promptIds = (inserted || []).map((r: any) => r.id);

    // Map tag links while de-duplicating any repeated tags per prompt
    const tagLinks: { prompt_id: string; tag_id: string }[] = [];
    toInsert.forEach((p, idx) => {
      const pid = promptIds[idx];
      if (!pid) return;
      const seenTagIds = new Set<string>();
      p._tag_names.forEach((name: string) => {
        const tagId = tagMap.get(name);
        if (tagId && !seenTagIds.has(tagId)) {
          seenTagIds.add(tagId);
          tagLinks.push({ prompt_id: pid, tag_id: tagId });
        }
      });
    });

    if (tagLinks.length > 0) {
      const { error: linkErr } = await supabase.from("prompt_tags").insert(tagLinks);
      if (linkErr) throw linkErr;
    }

    return { inserted: toInsert.length };
  };

  const uploadTags = async (rows: any[]) => {
    const seen = new Set<string>();
    const payload = rows
      .map((r) => ({ name: r.name }))
      .filter((r) => r.name && !seen.has(r.name) && (seen.add(r.name), true));
    if (payload.length === 0) return { inserted: 0 };
    const { error } = await supabase.from("tags").upsert(payload, { onConflict: "name" });
    if (error) throw error;
    return { inserted: payload.length };
  };

  const handleUpload = async () => {
    const rows = parseInput();
    if (!rows) return;
    setLoading(true);
    try {
      let res;
      if (entity === "categories") res = await uploadCategories(rows);
      if (entity === "subcategories") res = await uploadSubcategories(rows);
      if (entity === "tags") res = await uploadTags(rows);
      if (entity === "prompts") res = await uploadPrompts(rows);
      toast({ title: "Upload complete", description: `${res?.inserted || 0} ${entity} processed.` });
    } catch (e: any) {
      console.error(e);
      toast({ title: "Upload failed", description: e.message || String(e), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleUploadCsv = async () => {
    if (!csvFile) {
      toast({ title: "No file selected", description: "Please choose a CSV file.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const rows = await new Promise<any[]>((resolve, reject) => {
        Papa.parse(csvFile, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => resolve(results.data as any[]),
          error: (err) => reject(err),
        });
      });

      let data: any[] = [];
      const splitTags = (val: any) => {
        if (Array.isArray(val)) return val;
        if (typeof val === "string") {
          return val.split(/[,;]+/).map((t) => t.trim()).filter(Boolean);
        }
        return [];
      };

      switch (entity) {
        case "categories":
          data = rows.map((r) => ({ name: String(r.name ?? "").trim(), slug: String(r.slug ?? "").trim() }));
          break;
        case "subcategories":
          data = rows.map((r) => ({
            category_slug: String(r.category_slug ?? r.category ?? "").trim(),
            name: String(r.name ?? "").trim(),
            slug: String(r.slug ?? "").trim(),
          }));
          break;
        case "tags":
          data = rows.map((r) => ({ name: String(r.name ?? "").trim() }));
          break;
        case "prompts":
          data = rows.map((r) => ({
            title: String(r.title ?? "").trim(),
            what_for: r.what_for ? String(r.what_for).trim() : undefined,
            prompt: String(r.prompt ?? "").trim(),
            image_prompt: r.image_prompt ? String(r.image_prompt).trim() : undefined,
            excerpt: r.excerpt ? String(r.excerpt).trim() : undefined,
            category_slug: String(r.category_slug ?? "").trim(),
            subcategory_slug: r.subcategory_slug ? String(r.subcategory_slug).trim() : undefined,
            tags: splitTags(r.tags),
          }));
          break;
      }

      let res;
      if (entity === "categories") res = await uploadCategories(data);
      if (entity === "subcategories") res = await uploadSubcategories(data);
      if (entity === "tags") res = await uploadTags(data);
      if (entity === "prompts") {
        // Auto-create categories and subcategories from CSV when names are provided
        const catMapInput = new Map<string, { slug: string; name: string }>();
        rows.forEach((r) => {
          const slug = String(r.category_slug ?? "").trim();
          if (!slug) return;
          const name = String((r.category_name ?? slug)).trim();
          if (!catMapInput.has(slug)) catMapInput.set(slug, { slug, name });
        });
        const catPayload = Array.from(catMapInput.values()).filter((c) => c.slug);
        if (catPayload.length) {
          const { error: catUpErr } = await supabase.from("categories").upsert(catPayload, { onConflict: "slug" });
          if (catUpErr) throw catUpErr;
        }

        // Fetch category ids for subcategory linkage
        const catSlugs = Array.from(catMapInput.keys());
        const { data: cats, error: catSelErr } = await supabase.from("categories").select("id,slug").in("slug", catSlugs);
        if (catSelErr) throw catSelErr;
        const catIdBySlug = new Map<string, string>((cats || []).map((c: any) => [c.slug, c.id]));

        // Prepare and upsert subcategories
        const rawSubs = rows
          .map((r) => {
            const cslug = String(r.category_slug ?? "").trim();
            const sslug = String(r.subcategory_slug ?? "").trim();
            if (!cslug || !sslug) return null;
            const category_id = catIdBySlug.get(cslug);
            if (!category_id) return null;
            return {
              category_id,
              slug: sslug,
              name: String((r.subcategory_name ?? sslug)).trim(),
            };
          })
          .filter(Boolean) as { category_id: string; slug: string; name: string }[];

        // Deduplicate by composite key category_id + slug
        const subKeyed = new Map<string, { category_id: string; slug: string; name: string }>();
        rawSubs.forEach((s) => {
          const key = `${s.category_id}:${s.slug}`;
          if (!subKeyed.has(key)) subKeyed.set(key, s);
        });
        const subPayload = Array.from(subKeyed.values());

        if (subPayload.length) {
          const { error: subUpErr } = await supabase
            .from("subcategories")
            .upsert(subPayload, { onConflict: "category_id,slug" });
          if (subUpErr) throw subUpErr;
        }

        // Now insert prompts and link tags
        res = await uploadPrompts(data);
      }

      toast({ title: "CSV upload complete", description: `${res?.inserted || 0} ${entity} processed.` });
    } catch (e: any) {
      console.error(e);
      toast({ title: "CSV upload failed", description: e.message || String(e), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndImportCsv = async () => {
    if (entity !== "prompts") {
      toast({ title: "Reset requires Prompts CSV", description: "Switch entity to Prompts and select your CSV.", variant: "destructive" });
      return;
    }
    if (!csvFile) {
      toast({ title: "No file selected", description: "Please choose a CSV file.", variant: "destructive" });
      return;
    }
    const confirmed = window.confirm(
      "This will DELETE all categories, subcategories, prompts and their links, then re-import from this CSV. Continue?"
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      // Parse CSV rows
      const rows = await new Promise<any[]>((resolve, reject) => {
        Papa.parse(csvFile, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => resolve(results.data as any[]),
          error: (err) => reject(err),
        });
      });

      // Map to prompts data shape
      const splitTags = (val: any) => {
        if (Array.isArray(val)) return val;
        if (typeof val === "string") return val.split(/[,;]+/).map((t) => t.trim()).filter(Boolean);
        return [];
      };
      const data = rows.map((r) => ({
        title: String(r.title ?? "").trim(),
        what_for: r.what_for ? String(r.what_for).trim() : undefined,
        prompt: String(r.prompt ?? "").trim(),
        image_prompt: r.image_prompt ? String(r.image_prompt).trim() : undefined,
        excerpt: r.excerpt ? String(r.excerpt).trim() : undefined,
        category_slug: String(r.category_slug ?? "").trim(),
        subcategory_slug: r.subcategory_slug ? String(r.subcategory_slug).trim() : undefined,
        tags: splitTags(r.tags),
      }));

      // DELETE in dependency order
      await supabase.from("prompt_tags").delete().not("prompt_id", "is", null);
      await supabase.from("prompts").delete().not("id", "is", null);
      await supabase.from("subcategories").delete().not("id", "is", null);
      await supabase.from("categories").delete().not("id", "is", null);

      // Recreate categories and subcategories from CSV using provided names when present
      const catMapInput = new Map<string, { slug: string; name: string }>();
      rows.forEach((r) => {
        const slug = String(r.category_slug ?? "").trim();
        if (!slug) return;
        const name = String((r.category_name ?? slug)).trim();
        if (!catMapInput.has(slug)) catMapInput.set(slug, { slug, name });
      });
      const catPayload = Array.from(catMapInput.values()).filter((c) => c.slug);
      if (catPayload.length) {
        const { error: catUpErr } = await supabase.from("categories").upsert(catPayload, { onConflict: "slug" });
        if (catUpErr) throw catUpErr;
      }

      const catSlugs = Array.from(catMapInput.keys());
      const { data: cats, error: catSelErr } = await supabase.from("categories").select("id,slug").in("slug", catSlugs);
      if (catSelErr) throw catSelErr;
      const catIdBySlug = new Map<string, string>((cats || []).map((c: any) => [c.slug, c.id]));

      const subPayload = rows
        .map((r) => {
          const cslug = String(r.category_slug ?? "").trim();
          const sslug = String(r.subcategory_slug ?? "").trim();
          if (!cslug || !sslug) return null;
          const category_id = catIdBySlug.get(cslug);
          if (!category_id) return null;
          return { category_id, slug: sslug, name: String((r.subcategory_name ?? sslug)).trim() };
        })
        .filter(Boolean) as { category_id: string; slug: string; name: string }[];

      if (subPayload.length) {
        const { error: subUpErr } = await supabase.from("subcategories").upsert(subPayload, { onConflict: "category_id,slug" });
        if (subUpErr) throw subUpErr;
      }

      // Insert prompts and link tags
      const res = await uploadPrompts(data);
      toast({ title: "Reset complete", description: `${res?.inserted || 0} prompts imported from CSV.` });
    } catch (e: any) {
      console.error(e);
      toast({ title: "Reset failed", description: e.message || String(e), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHero
        title={<><span className="text-gradient-brand">Admin</span> Bulk Upload</>}
        subtitle={<>Paste JSON arrays and upload categories, subcategories, tags, and prompts.</>}
      />
      <main className="container py-10">
        <SEO
          title="Bulk Upload – Admin"
          description="Upload categories, subcategories, tags, and prompts in bulk via JSON."
        />

        <section className="max-w-3xl space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Entity</label>
            <Select value={entity} onValueChange={(v) => setEntity(v as any)}>
              <SelectTrigger aria-label="Entity type"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="categories">Categories</SelectItem>
                <SelectItem value="subcategories">Subcategories</SelectItem>
                <SelectItem value="tags">Tags</SelectItem>
                <SelectItem value="prompts">Prompts</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">JSON Data</label>
            <Textarea
              rows={16}
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              placeholder={placeholder}
              aria-label="JSON input"
            />
            <p className="text-xs text-muted-foreground">
              Tip: If left empty, we will use the sample template shown as a placeholder for quick testing.
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setJsonText(samples[entity])}>Load sample</Button>
            <Button onClick={handleUpload} disabled={loading}>{loading ? "Uploading..." : "Upload"}</Button>
          </div>

          <div className="grid gap-2 pt-6">
            <label className="text-sm font-medium">CSV File</label>
            <Input type="file" accept=".csv" onChange={(e) => setCsvFile(e.target.files?.[0] ?? null)} aria-label="CSV file input" />
            <p className="text-xs text-muted-foreground">
              CSV headers should match the selected entity. For prompts: title, prompt, category_slug, [subcategory_slug], [tags]
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleUploadCsv} disabled={loading || !csvFile}>{loading ? "Uploading..." : "Upload CSV"}</Button>
          </div>
          <div className="pt-4">
            <h3 className="text-sm font-medium text-destructive">Danger zone</h3>
            <p className="text-xs text-muted-foreground">Deletes all categories, subcategories, prompts, then imports from the selected CSV.</p>
            <div className="mt-2">
              <Button variant="destructive" onClick={handleResetAndImportCsv} disabled={loading || !csvFile}>
                {loading ? "Resetting..." : "Reset and Import from CSV"}
              </Button>
            </div>
          </div>

          <aside className="text-sm text-muted-foreground">
            Notes:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Categories/subcategories are upserted by slug; tags by name.</li>
              <li>Prompts are inserted; ensure you don’t duplicate unless intended.</li>
              <li>Prompts accept category_slug and optional subcategory_slug; tags can be provided as an array of names.</li>
              <li>Only admins can write; if you see a permission error, ensure your user has the admin role.</li>
            </ul>
          </aside>
        </section>
      </main>
    </>
  );
};

export default AdminBulkUpload;

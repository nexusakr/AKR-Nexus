import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { savePageContent, deletePageContent } from "@/lib/actions/admin-misc";
import type { PageContent } from "@/types/database";

const input =
  "w-full rounded-md border border-border px-3 py-2 text-sm focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200";

const PAGE_KEYS = ["home", "about", "services", "customer-programs", "nri"];

export default async function AdminContentPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("page_content")
    .select("*")
    .order("page_key");
  const blocks = (data as PageContent[]) ?? [];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="rounded-xl border border-border bg-white p-6">
        <h2 className="font-serif text-lg text-navy-900">Add / Update Content Block</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Editable text blocks for marketing pages. Value can be plain text or
          JSON (e.g. {`{"heading":"…","body":"…"}`}).
        </p>
        <form action={savePageContent} className="mt-4 space-y-3">
          <div>
            <label className="text-sm font-medium text-navy-800">Page</label>
            <select name="page_key" className={input}>
              {PAGE_KEYS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-navy-800">Section key</label>
            <input name="section_key" placeholder="e.g. hero_heading" required className={input} />
          </div>
          <div>
            <label className="text-sm font-medium text-navy-800">Value</label>
            <textarea name="value" rows={5} placeholder='Plain text or JSON' className={`${input} font-mono`} />
          </div>
          <button className="rounded-md bg-gold-500 px-5 py-2 text-sm font-semibold text-navy-950 hover:bg-gold-600">
            Save Block
          </button>
        </form>
      </div>

      <div className="lg:col-span-2 space-y-3">
        <h1 className="font-serif text-2xl text-navy-900">Content Blocks</h1>
        <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-white">
          {blocks.length ? (
            blocks.map((b) => (
              <div key={b.id} className="flex items-start justify-between gap-4 p-4">
                <div className="min-w-0">
                  <p className="font-medium text-navy-900">
                    {b.page_key} · {b.section_key}
                  </p>
                  <pre className="mt-1 max-w-xl overflow-x-auto whitespace-pre-wrap text-xs text-muted-foreground">
                    {JSON.stringify(b.value, null, 2)}
                  </pre>
                </div>
                <form action={deletePageContent}>
                  <input type="hidden" name="id" value={b.id} />
                  <button className="rounded border border-red-200 p-1 text-red-600 hover:bg-red-50">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
            ))
          ) : (
            <p className="p-10 text-center text-muted-foreground">
              No content blocks yet. Pages use sensible defaults until you add
              overrides here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

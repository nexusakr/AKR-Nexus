import Link from "next/link";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { saveProgram, deleteProgram } from "@/lib/actions/admin-misc";
import type { CustomerProgram } from "@/types/database";

const input =
  "w-full rounded-md border border-border px-3 py-2 text-sm focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200";

export default async function AdminProgramsPage({
  searchParams,
}: PageProps<"/admin/programs">) {
  const sp = await searchParams;
  const editId = typeof sp.edit === "string" ? sp.edit : null;

  const supabase = await createClient();
  const { data } = await supabase.from("customer_programs").select("*").order("sort_order");
  const programs = (data as CustomerProgram[]) ?? [];
  const editing = editId ? programs.find((p) => p.id === editId) ?? null : null;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="rounded-xl border border-border bg-white p-6">
        <h2 className="font-serif text-lg text-navy-900">
          {editing ? "Edit Program" : "Add Program"}
        </h2>
        <form action={saveProgram} className="mt-4 space-y-3" key={editing?.id || "new"}>
          {editing && <input type="hidden" name="id" value={editing.id} />}
          <input name="name" placeholder="Program name *" required defaultValue={editing?.name} className={input} />
          <input name="segment" placeholder="Segment (e.g. Women)" defaultValue={editing?.segment || ""} className={input} />
          <textarea name="summary" rows={3} placeholder="Summary" defaultValue={editing?.summary || ""} className={input} />
          <textarea name="body" rows={5} placeholder="Full description (Markdown)" defaultValue={editing?.body || ""} className={`${input} font-mono`} />
          <select name="status" defaultValue={editing?.status || "published"} className={input}>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <div className="flex gap-2">
            <button className="rounded-md bg-gold-500 px-5 py-2 text-sm font-semibold text-navy-950 hover:bg-gold-600">
              {editing ? "Update" : "Add"} Program
            </button>
            {editing && (
              <Link href="/admin/programs" className="rounded-md border border-border px-4 py-2 text-sm text-navy-700 hover:bg-muted">
                Cancel
              </Link>
            )}
          </div>
        </form>
      </div>

      <div className="lg:col-span-2 space-y-3">
        <h1 className="font-serif text-2xl text-navy-900">Customer Programs</h1>
        <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-white">
          {programs.length ? (
            programs.map((p) => (
              <div key={p.id} className="flex items-start justify-between p-4 hover:bg-muted">
                <div>
                  <Link href={`/admin/programs?edit=${p.id}`} className="font-medium text-navy-900 hover:text-gold-700">
                    {p.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">{p.segment}</p>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{p.summary}</p>
                </div>
                <form action={deleteProgram}>
                  <input type="hidden" name="id" value={p.id} />
                  <button className="rounded border border-red-200 p-1 text-red-600 hover:bg-red-50">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
            ))
          ) : (
            <p className="p-10 text-center text-muted-foreground">No programs yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

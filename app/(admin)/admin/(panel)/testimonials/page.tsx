import Link from "next/link";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ImageUpload } from "@/components/admin/image-upload";
import { saveTestimonial, deleteTestimonial } from "@/lib/actions/admin-cms";
import type { Testimonial } from "@/types/database";

const input =
  "w-full rounded-md border border-border px-3 py-2 text-sm focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200";

export default async function AdminTestimonialsPage({
  searchParams,
}: PageProps<"/admin/testimonials">) {
  const sp = await searchParams;
  const editId = typeof sp.edit === "string" ? sp.edit : null;
  const supabase = await createClient();
  const { data } = await supabase.from("testimonials").select("*").order("sort_order");
  const items = (data as Testimonial[]) ?? [];
  const editing = editId ? items.find((t) => t.id === editId) ?? null : null;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="rounded-xl border border-border bg-white p-6">
        <h2 className="font-serif text-lg text-navy-900">{editing ? "Edit" : "Add"} Testimonial</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Only add real, consented testimonials. Shown publicly when published.
        </p>
        <form action={saveTestimonial} className="mt-4 space-y-3" key={editing?.id || "new"}>
          {editing && <input type="hidden" name="id" value={editing.id} />}
          <input name="author_name" placeholder="Author name *" required defaultValue={editing?.author_name} className={input} />
          <input name="author_role" placeholder="Role / location (e.g. Home-buyer, Deoghar)" defaultValue={editing?.author_role || ""} className={input} />
          <textarea name="quote" rows={4} placeholder="Testimonial quote *" required defaultValue={editing?.quote} className={input} />
          <input name="sort_order" type="number" placeholder="Sort order" defaultValue={editing?.sort_order ?? 0} className={input} />
          <ImageUpload name="photo_url" bucket="media" defaultUrl={editing?.photo_url || ""} label="Photo (optional)" />
          <select name="status" defaultValue={editing?.status || "draft"} className={input}>
            <option value="draft">Draft (hidden)</option>
            <option value="published">Published</option>
          </select>
          <div className="flex gap-2">
            <button className="rounded-md bg-gold-500 px-5 py-2 text-sm font-semibold text-navy-950 hover:bg-gold-600">
              {editing ? "Update" : "Add"}
            </button>
            {editing && (
              <Link href="/admin/testimonials" className="rounded-md border border-border px-4 py-2 text-sm text-navy-700 hover:bg-muted">
                Cancel
              </Link>
            )}
          </div>
        </form>
      </div>

      <div className="lg:col-span-2 space-y-3">
        <h1 className="font-serif text-2xl text-navy-900">Testimonials</h1>
        <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-white">
          {items.length ? (
            items.map((t) => (
              <div key={t.id} className="flex items-start justify-between gap-4 p-4 hover:bg-muted">
                <div>
                  <Link href={`/admin/testimonials?edit=${t.id}`} className="font-medium text-navy-900 hover:text-gold-700">
                    {t.author_name}
                  </Link>
                  <span className={t.status === "published" ? "ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800" : "ml-2 rounded-full bg-navy-100 px-2 py-0.5 text-xs text-navy-700"}>
                    {t.status}
                  </span>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">“{t.quote}”</p>
                </div>
                <form action={deleteTestimonial}>
                  <input type="hidden" name="id" value={t.id} />
                  <button className="rounded border border-red-200 p-1 text-red-600 hover:bg-red-50">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
            ))
          ) : (
            <p className="p-10 text-center text-muted-foreground">No testimonials yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

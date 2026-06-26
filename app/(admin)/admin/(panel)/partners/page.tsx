import Link from "next/link";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ImageUpload } from "@/components/admin/image-upload";
import { savePartner, togglePartner, deletePartner } from "@/lib/actions/admin-misc";
import type { Partner } from "@/types/database";

const input =
  "w-full rounded-md border border-border px-3 py-2 text-sm focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200";

export default async function AdminPartnersPage({
  searchParams,
}: PageProps<"/admin/partners">) {
  const sp = await searchParams;
  const editId = typeof sp.edit === "string" ? sp.edit : null;

  const supabase = await createClient();
  const { data } = await supabase.from("partners").select("*").order("sort_order");
  const partners = (data as Partner[]) ?? [];
  const editing = editId ? partners.find((p) => p.id === editId) ?? null : null;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Form */}
      <div className="rounded-xl border border-border bg-white p-6">
        <h2 className="font-serif text-lg text-navy-900">
          {editing ? "Edit Partner" : "Add Partner"}
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Logos only appear on the website once published.
        </p>
        <form action={savePartner} className="mt-4 space-y-3" key={editing?.id || "new"}>
          {editing && <input type="hidden" name="id" value={editing.id} />}
          <input name="name" placeholder="Partner name *" required defaultValue={editing?.name} className={input} />
          <select name="partner_type" defaultValue={editing?.partner_type || "other"} className={input}>
            <option value="developer">Developer</option>
            <option value="bank">Bank / Lender</option>
            <option value="legal">Legal / Registration</option>
            <option value="other">Other</option>
          </select>
          <input name="website" placeholder="Website URL" defaultValue={editing?.website || ""} className={input} />
          <textarea name="description" rows={2} placeholder="Short description" defaultValue={editing?.description || ""} className={input} />
          <ImageUpload name="logo_url" bucket="partners" defaultUrl={editing?.logo_url || ""} label="Logo" />
          <select name="status" defaultValue={editing?.status || "draft"} className={input}>
            <option value="draft">Draft (hidden)</option>
            <option value="published">Published</option>
          </select>
          <div className="flex gap-2">
            <button className="rounded-md bg-gold-500 px-5 py-2 text-sm font-semibold text-navy-950 hover:bg-gold-600">
              {editing ? "Update" : "Add"} Partner
            </button>
            {editing && (
              <Link href="/admin/partners" className="rounded-md border border-border px-4 py-2 text-sm text-navy-700 hover:bg-muted">
                Cancel
              </Link>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      <div className="lg:col-span-2 space-y-3">
        <h1 className="font-serif text-2xl text-navy-900">Partners</h1>
        <div className="overflow-hidden rounded-xl border border-border bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3">Logo</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {partners.length ? (
                partners.map((p) => (
                  <tr key={p.id} className="hover:bg-muted">
                    <td className="px-4 py-3">
                      {p.logo_url ? (
                        <div className="relative h-8 w-16">
                          <Image src={p.logo_url} alt={p.name} fill className="object-contain" sizes="64px" />
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/partners?edit=${p.id}`} className="font-medium text-navy-900 hover:text-gold-700">
                        {p.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-navy-700">{p.partner_type}</td>
                    <td className="px-4 py-3">
                      <span className={p.status === "published" ? "rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800" : "rounded-full bg-navy-100 px-2 py-0.5 text-xs text-navy-700"}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <form action={togglePartner}>
                          <input type="hidden" name="id" value={p.id} />
                          <input type="hidden" name="next" value={p.status === "published" ? "draft" : "published"} />
                          <button className="rounded border border-border px-2 py-1 text-xs text-navy-700 hover:bg-navy-50">
                            {p.status === "published" ? "Unpublish" : "Publish"}
                          </button>
                        </form>
                        <form action={deletePartner}>
                          <input type="hidden" name="id" value={p.id} />
                          <button className="rounded border border-red-200 p-1 text-red-600 hover:bg-red-50">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                    No partners yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

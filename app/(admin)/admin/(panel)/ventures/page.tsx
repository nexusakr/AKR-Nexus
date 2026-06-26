import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { toggleVenturePublish, deleteVenture } from "@/lib/actions/admin-ventures";
import type { Venture } from "@/types/database";

export default async function AdminVenturesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("ventures")
    .select("*")
    .order("created_at", { ascending: false });
  const ventures = (data as Venture[]) ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-navy-900">Ventures</h1>
        <Link
          href="/admin/ventures/new"
          className="inline-flex items-center gap-2 rounded-md bg-gold-500 px-4 py-2 text-sm font-semibold text-navy-950 hover:bg-gold-600"
        >
          <Plus className="h-4 w-4" /> New Venture
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Project</th>
              <th className="px-4 py-3">Publish</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {ventures.length ? (
              ventures.map((v) => (
                <tr key={v.id} className="hover:bg-muted">
                  <td className="px-4 py-3">
                    <Link href={`/admin/ventures/${v.id}`} className="font-medium text-navy-900 hover:text-gold-700">
                      {v.title}
                    </Link>
                    {v.is_featured && (
                      <span className="ml-2 rounded-full bg-gold-100 px-2 py-0.5 text-xs text-gold-800">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-navy-700">{v.venture_status.replace(/_/g, " ")}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        v.status === "published"
                          ? "rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800"
                          : "rounded-full bg-navy-100 px-2 py-0.5 text-xs font-medium text-navy-700"
                      }
                    >
                      {v.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <form action={toggleVenturePublish}>
                        <input type="hidden" name="id" value={v.id} />
                        <input type="hidden" name="next" value={v.status === "published" ? "draft" : "published"} />
                        <button className="rounded border border-border px-2 py-1 text-xs text-navy-700 hover:bg-navy-50">
                          {v.status === "published" ? "Unpublish" : "Publish"}
                        </button>
                      </form>
                      <form action={deleteVenture}>
                        <input type="hidden" name="id" value={v.id} />
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
                <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                  No ventures yet. Add your first Dham Developers project.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

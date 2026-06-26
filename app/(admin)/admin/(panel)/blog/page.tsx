import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import {
  togglePostPublish,
  deletePost,
  createCategory,
  deleteCategory,
} from "@/lib/actions/admin-blog";
import type { BlogCategory, BlogPost } from "@/types/database";

export default async function AdminBlogPage() {
  const supabase = await createClient();
  const [{ data: posts }, { data: categories }] = await Promise.all([
    supabase.from("blog_posts").select("*").order("created_at", { ascending: false }),
    supabase.from("blog_categories").select("*").order("sort_order"),
  ]);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-2xl text-navy-900">Blog</h1>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 rounded-md bg-gold-500 px-4 py-2 text-sm font-semibold text-navy-950 hover:bg-gold-600"
          >
            <Plus className="h-4 w-4" /> New Post
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(posts as BlogPost[] | null)?.length ? (
                (posts as BlogPost[]).map((p) => (
                  <tr key={p.id} className="hover:bg-muted">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/blog/${p.id}`}
                        className="font-medium text-navy-900 hover:text-gold-700"
                      >
                        {p.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          p.status === "published"
                            ? "rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800"
                            : "rounded-full bg-navy-100 px-2 py-0.5 text-xs font-medium text-navy-700"
                        }
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(p.published_at || p.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <form action={togglePostPublish}>
                          <input type="hidden" name="id" value={p.id} />
                          <input
                            type="hidden"
                            name="next"
                            value={p.status === "published" ? "draft" : "published"}
                          />
                          <button className="rounded border border-border px-2 py-1 text-xs text-navy-700 hover:bg-navy-50">
                            {p.status === "published" ? "Unpublish" : "Publish"}
                          </button>
                        </form>
                        <form action={deletePost}>
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
                  <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                    No posts yet. Create your first article.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <div className="rounded-xl border border-border bg-white p-6">
          <h2 className="font-serif text-lg text-navy-900">Categories</h2>
          <form action={createCategory} className="mt-3 flex gap-2">
            <input
              name="name"
              placeholder="New category"
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200"
            />
            <button className="rounded-md bg-navy-900 px-3 py-2 text-sm text-white hover:bg-navy-800">
              Add
            </button>
          </form>
          <ul className="mt-4 space-y-2">
            {(categories as BlogCategory[] | null)?.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between rounded-md bg-muted px-3 py-2 text-sm"
              >
                <span className="text-navy-800">{c.name}</span>
                <form action={deleteCategory}>
                  <input type="hidden" name="id" value={c.id} />
                  <button className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

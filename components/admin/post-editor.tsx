"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { savePost } from "@/lib/actions/admin-blog";
import { ImageUpload } from "@/components/admin/image-upload";
import { slugify } from "@/lib/utils";
import type { BlogCategory, BlogPost } from "@/types/database";

const input =
  "w-full rounded-md border border-border px-3 py-2 text-sm focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200";

function Save() {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="rounded-md bg-gold-500 px-6 py-2.5 text-sm font-semibold text-navy-950 hover:bg-gold-600 disabled:opacity-60"
    >
      {pending ? "Saving…" : "Save Post"}
    </button>
  );
}

export function PostEditor({
  post,
  categories,
}: {
  post: BlogPost | null;
  categories: BlogCategory[];
}) {
  const [slug, setSlug] = useState(post?.slug || "");

  return (
    <form action={savePost} className="grid gap-6 lg:grid-cols-3">
      {post?.id && <input type="hidden" name="id" value={post.id} />}

      <div className="space-y-4 lg:col-span-2">
        <div className="rounded-xl border border-border bg-white p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-navy-800">Title *</label>
            <input
              name="title"
              required
              defaultValue={post?.title}
              onChange={(e) => {
                if (!post?.id) setSlug(slugify(e.target.value));
              }}
              className={input}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-navy-800">Slug</label>
            <input
              name="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className={input}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-navy-800">Excerpt</label>
            <textarea name="excerpt" rows={2} defaultValue={post?.excerpt || ""} className={input} />
          </div>
          <div>
            <label className="text-sm font-medium text-navy-800">
              Body (Markdown)
            </label>
            <textarea
              name="body"
              rows={16}
              defaultValue={post?.body || ""}
              className={`${input} font-mono`}
              placeholder={"## Heading\n\nWrite your article in Markdown…"}
            />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white p-6 space-y-4">
          <h2 className="font-serif text-lg text-navy-900">SEO</h2>
          <div>
            <label className="text-sm font-medium text-navy-800">SEO title</label>
            <input name="seo_title" defaultValue={post?.seo_title || ""} className={input} />
          </div>
          <div>
            <label className="text-sm font-medium text-navy-800">
              Meta description
            </label>
            <textarea
              name="seo_description"
              rows={2}
              defaultValue={post?.seo_description || ""}
              className={input}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl border border-border bg-white p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-navy-800">Status</label>
            <select name="status" defaultValue={post?.status || "draft"} className={input}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-navy-800">Category</label>
            <select
              name="category_id"
              defaultValue={post?.category_id || ""}
              className={input}
            >
              <option value="">— None —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-navy-800">Author</label>
            <input name="author_name" defaultValue={post?.author_name || ""} className={input} />
          </div>
          <ImageUpload
            name="cover_image"
            bucket="blog"
            defaultUrl={post?.cover_image || ""}
            label="Cover image"
          />
          <Save />
        </div>
      </div>
    </form>
  );
}

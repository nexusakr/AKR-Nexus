"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { saveVenture } from "@/lib/actions/admin-ventures";
import { ImageUpload } from "@/components/admin/image-upload";
import { FileUpload } from "@/components/admin/file-upload";
import { slugify } from "@/lib/utils";
import type { Venture } from "@/types/database";

const input =
  "w-full rounded-md border border-border px-3 py-2 text-sm focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200";

function Save() {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="rounded-md bg-gold-500 px-6 py-2.5 text-sm font-semibold text-navy-950 hover:bg-gold-600 disabled:opacity-60"
    >
      {pending ? "Saving…" : "Save Venture"}
    </button>
  );
}

export function VentureEditor({ venture }: { venture: Venture | null }) {
  const [slug, setSlug] = useState(venture?.slug || "");

  return (
    <form action={saveVenture} className="grid gap-6 lg:grid-cols-3">
      {venture?.id && <input type="hidden" name="id" value={venture.id} />}

      <div className="space-y-4 lg:col-span-2">
        <div className="rounded-xl border border-border bg-white p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-navy-800">Title *</label>
            <input
              name="title"
              required
              defaultValue={venture?.title}
              onChange={(e) => {
                if (!venture?.id) setSlug(slugify(e.target.value));
              }}
              className={input}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-navy-800">Slug</label>
              <input name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} className={input} />
            </div>
            <div>
              <label className="text-sm font-medium text-navy-800">Location</label>
              <input name="location" defaultValue={venture?.location || ""} className={input} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-navy-800">Summary</label>
            <textarea name="summary" rows={2} defaultValue={venture?.summary || ""} className={input} />
          </div>
          <div>
            <label className="text-sm font-medium text-navy-800">Body (Markdown)</label>
            <textarea name="body" rows={12} defaultValue={venture?.body || ""} className={`${input} font-mono`} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl border border-border bg-white p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-navy-800">Publish status</label>
            <select name="status" defaultValue={venture?.status || "draft"} className={input}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-navy-800">Project status</label>
            <select name="venture_status" defaultValue={venture?.venture_status || "upcoming"} className={input}>
              <option value="coming_soon">Coming Soon</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-navy-800">Brand</label>
            <input name="brand" defaultValue={venture?.brand || "Dham Developers"} className={input} />
          </div>
          <label className="flex items-center gap-2 text-sm text-navy-800">
            <input type="checkbox" name="is_featured" defaultChecked={venture?.is_featured} />
            Feature on homepage
          </label>
          <ImageUpload name="cover_image" bucket="ventures" defaultUrl={venture?.cover_image || ""} label="Cover image" />
          <FileUpload name="brochure_url" bucket="brochures" defaultUrl={venture?.brochure_url || ""} label="Brochure (PDF)" />
          <Save />
        </div>
      </div>
    </form>
  );
}

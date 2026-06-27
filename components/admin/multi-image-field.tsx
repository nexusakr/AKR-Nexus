"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";

/**
 * Manages an array of image URLs (e.g. floor plans). Uploads to a Supabase
 * bucket and submits the list as a JSON string in a hidden input.
 */
export function MultiImageField({
  name,
  bucket,
  label,
  defaultUrls = [],
}: {
  name: string;
  bucket: string;
  label: string;
  defaultUrls?: string[];
}) {
  const [urls, setUrls] = useState<string[]>(defaultUrls);
  const [busy, setBusy] = useState(false);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setBusy(true);
    const supabase = createClient();
    const added: string[] = [];
    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}.${ext}`;
        const { error } = await supabase.storage.from(bucket).upload(path, file);
        if (error) continue;
        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        added.push(data.publicUrl);
      }
      setUrls((prev) => [...prev, ...added]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label className="text-sm font-medium text-navy-800">{label}</label>
      <input type="hidden" name={name} value={JSON.stringify(urls)} />
      <div className="mt-1 flex flex-wrap items-center gap-3">
        {urls.map((u, i) => (
          <div key={i} className="relative h-16 w-24 overflow-hidden rounded-md border border-border bg-muted">
            <Image src={u} alt="" fill className="object-cover" sizes="96px" />
            <button
              type="button"
              onClick={() => setUrls((prev) => prev.filter((_, idx) => idx !== i))}
              className="absolute right-0 top-0 bg-black/60 p-0.5 text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-navy-800 hover:bg-muted">
          <Upload className="h-4 w-4" />
          {busy ? "Uploading…" : "Add"}
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} disabled={busy} />
        </label>
      </div>
    </div>
  );
}

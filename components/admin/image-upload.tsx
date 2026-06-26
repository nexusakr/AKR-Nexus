"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";

/**
 * Uploads an image to a Supabase Storage bucket and returns its public URL.
 * Renders a hidden input named `name` so the URL submits with the parent form.
 */
export function ImageUpload({
  name,
  bucket,
  defaultUrl = "",
  label = "Image",
}: {
  name: string;
  bucket: string;
  defaultUrl?: string;
  label?: string;
}) {
  const [url, setUrl] = useState(defaultUrl);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: false });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      setUrl(data.publicUrl);
      // Track in media library (best-effort).
      await supabase.from("media_assets").insert({
        bucket,
        path,
        url: data.publicUrl,
        folder: bucket,
        mime_type: file.type,
        size_bytes: file.size,
      });
    } catch (err) {
      console.error(err);
      setError("Upload failed. Check you are signed in as staff.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label className="text-sm font-medium text-navy-800">{label}</label>
      <input type="hidden" name={name} value={url} />
      <div className="mt-1 flex items-center gap-3">
        {url ? (
          <div className="relative h-16 w-24 overflow-hidden rounded-md border border-border bg-muted">
            <Image src={url} alt="" fill className="object-cover" sizes="96px" />
            <button
              type="button"
              onClick={() => setUrl("")}
              className="absolute right-0 top-0 bg-black/60 p-0.5 text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : null}
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-navy-800 hover:bg-muted">
          <Upload className="h-4 w-4" />
          {busy ? "Uploading…" : url ? "Replace" : "Upload"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
            disabled={busy}
          />
        </label>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

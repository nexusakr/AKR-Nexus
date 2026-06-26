"use client";

import { useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";

/** Generic file upload (e.g. PDF brochures) → returns public URL in a hidden input. */
export function FileUpload({
  name,
  bucket,
  defaultUrl = "",
  label = "File",
  accept = "application/pdf",
}: {
  name: string;
  bucket: string;
  defaultUrl?: string;
  label?: string;
  accept?: string;
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
      const ext = file.name.split(".").pop() || "pdf";
      const path = `${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}.${ext}`;
      const { error: upErr } = await supabase.storage.from(bucket).upload(path, file);
      if (upErr) throw upErr;
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      setUrl(data.publicUrl);
    } catch (err) {
      console.error(err);
      setError("Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label className="text-sm font-medium text-navy-800">{label}</label>
      <input type="hidden" name={name} value={url} />
      <div className="mt-1 flex items-center gap-3">
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-gold-700 hover:underline"
          >
            <FileText className="h-4 w-4" /> View
            <button type="button" onClick={() => setUrl("")} className="ml-1 text-red-600">
              <X className="h-3 w-3" />
            </button>
          </a>
        )}
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-navy-800 hover:bg-muted">
          <Upload className="h-4 w-4" />
          {busy ? "Uploading…" : url ? "Replace" : "Upload"}
          <input type="file" accept={accept} className="hidden" onChange={handleFile} disabled={busy} />
        </label>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

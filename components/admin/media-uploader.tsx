"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";

export function MediaUploader() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setBusy(true);
    const supabase = createClient();
    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}.${ext}`;
        const { error } = await supabase.storage.from("media").upload(path, file);
        if (error) continue;
        const { data } = supabase.storage.from("media").getPublicUrl(path);
        await supabase.from("media_assets").insert({
          bucket: "media",
          path,
          url: data.publicUrl,
          folder: "general",
          mime_type: file.type,
          size_bytes: file.size,
        });
      }
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-gold-500 px-4 py-2 text-sm font-semibold text-navy-950 hover:bg-gold-600">
      <Upload className="h-4 w-4" />
      {busy ? "Uploading…" : "Upload Images"}
      <input type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} disabled={busy} />
    </label>
  );
}

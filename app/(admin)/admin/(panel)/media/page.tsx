import Image from "next/image";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { MediaUploader } from "@/components/admin/media-uploader";
import { deleteMedia } from "@/lib/actions/admin-misc";
import { formatDate } from "@/lib/utils";
import type { MediaAsset } from "@/types/database";

export default async function AdminMediaPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("media_assets")
    .select("*")
    .order("created_at", { ascending: false });
  const assets = (data as MediaAsset[]) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl text-navy-900">Media Library</h1>
          <p className="text-sm text-muted-foreground">
            Upload and manage images. Click an image URL to copy it into content.
          </p>
        </div>
        <MediaUploader />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {assets.length ? (
          assets.map((a) => (
            <div key={a.id} className="overflow-hidden rounded-xl border border-border bg-white">
              <div className="relative aspect-square bg-muted">
                {a.mime_type?.startsWith("image") ? (
                  <Image src={a.url} alt={a.alt || ""} fill className="object-cover" sizes="200px" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                    {a.mime_type || "file"}
                  </div>
                )}
              </div>
              <div className="p-2">
                <a href={a.url} target="_blank" rel="noopener noreferrer" className="block truncate text-xs text-gold-700 hover:underline">
                  {a.path}
                </a>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">{formatDate(a.created_at)}</span>
                  <form action={deleteMedia}>
                    <input type="hidden" name="id" value={a.id} />
                    <input type="hidden" name="bucket" value={a.bucket} />
                    <input type="hidden" name="path" value={a.path} />
                    <button className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full rounded-xl border border-dashed border-border bg-muted p-10 text-center text-muted-foreground">
            No media yet. Upload your first image.
          </p>
        )}
      </div>
    </div>
  );
}

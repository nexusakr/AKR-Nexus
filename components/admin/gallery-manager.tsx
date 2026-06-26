"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import { ImageUpload } from "@/components/admin/image-upload";
import { addVentureImage, deleteVentureImage } from "@/lib/actions/admin-ventures";
import type { VentureImage } from "@/types/database";

export function GalleryManager({
  ventureId,
  images,
}: {
  ventureId: string;
  images: VentureImage[];
}) {
  return (
    <div className="rounded-xl border border-border bg-white p-6">
      <h2 className="font-serif text-lg text-navy-900">Gallery</h2>

      <form action={addVentureImage} className="mt-4 flex flex-wrap items-end gap-3">
        <input type="hidden" name="venture_id" value={ventureId} />
        <ImageUpload name="image_url" bucket="ventures" label="Add image" />
        <input
          name="caption"
          placeholder="Caption (optional)"
          className="rounded-md border border-border px-3 py-2 text-sm focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200"
        />
        <button className="rounded-md bg-navy-900 px-4 py-2 text-sm text-white hover:bg-navy-800">
          Add to gallery
        </button>
      </form>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {images.map((img) => (
          <div key={img.id} className="relative aspect-[4/3] overflow-hidden rounded-md border border-border bg-muted">
            <Image src={img.image_url} alt={img.caption || ""} fill className="object-cover" sizes="160px" />
            <form action={deleteVentureImage} className="absolute right-1 top-1">
              <input type="hidden" name="id" value={img.id} />
              <input type="hidden" name="venture_id" value={ventureId} />
              <button className="rounded bg-black/60 p-1 text-white hover:bg-red-600">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        ))}
        {images.length === 0 && (
          <p className="col-span-full text-sm text-muted-foreground">
            No gallery images yet.
          </p>
        )}
      </div>
    </div>
  );
}

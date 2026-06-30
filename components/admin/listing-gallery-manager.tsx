"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { ImageUpload } from "@/components/admin/image-upload";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { useToast } from "@/components/admin/toast";
import { addListingImage, deleteListingImage } from "@/lib/actions/admin-listings";
import type { ListingImage } from "@/types/database";

export function ListingGalleryManager({
  listingId,
  images,
}: {
  listingId: string;
  images: ListingImage[];
}) {
  const toast = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  // Bump to remount the add form (clears the upload + caption) after success.
  const [formKey, setFormKey] = useState(0);

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const url = String(fd.get("image_url") || "").trim();
    const caption = String(fd.get("caption") || "");
    if (!url) {
      toast("error", "Please upload a photo first.");
      return;
    }
    startTransition(async () => {
      const res = await addListingImage(listingId, url, caption);
      if (res.ok) {
        toast("success", "Photo added to gallery.");
        setFormKey((k) => k + 1);
        router.refresh();
      } else {
        toast("error", res.error || "Could not add photo.");
      }
    });
  }

  return (
    <div className="rounded-xl border border-border bg-white p-6">
      <h2 className="font-serif text-lg text-navy-900">Photo Gallery</h2>
      <form
        key={formKey}
        onSubmit={handleAdd}
        className="mt-4 flex flex-wrap items-end gap-3"
      >
        <ImageUpload name="image_url" bucket="listings" label="Add photo" />
        <input
          name="caption"
          placeholder="Caption (optional)"
          className="rounded-md border border-border px-3 py-2 text-sm focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200"
        />
        <button
          disabled={isPending}
          className="rounded-md bg-navy-900 px-4 py-2 text-sm text-white hover:bg-navy-800 disabled:opacity-60"
        >
          {isPending ? "Adding…" : "Add to gallery"}
        </button>
      </form>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {images.map((img) => (
          <div
            key={img.id}
            className="relative aspect-[4/3] overflow-hidden rounded-md border border-border bg-muted"
          >
            <Image src={img.image_url} alt={img.caption || ""} fill className="object-cover" sizes="160px" />
            <ConfirmButton
              title="Delete photo?"
              message="This photo will be removed from the gallery. This action cannot be undone."
              successMessage="Photo deleted."
              ariaLabel="Delete photo"
              onConfirm={() => deleteListingImage(img.id, listingId)}
              className="absolute right-1 top-1 rounded bg-black/60 p-1 text-white hover:bg-red-600"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </ConfirmButton>
          </div>
        ))}
        {images.length === 0 && (
          <p className="col-span-full text-sm text-muted-foreground">No photos yet.</p>
        )}
      </div>
    </div>
  );
}

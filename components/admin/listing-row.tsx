"use client";

import Link from "next/link";
import Image from "next/image";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Star } from "lucide-react";
import { formatPrice } from "@/components/site/listing-card";
import { useToast } from "@/components/admin/toast";
import { ConfirmButton } from "@/components/admin/confirm-button";
import {
  toggleListingPublish,
  toggleListingFeatured,
  deleteListing,
} from "@/lib/actions/admin-listings";
import type { Listing } from "@/types/database";

export function ListingRow({ listing: l }: { listing: Listing }) {
  const toast = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function onFeatured() {
    startTransition(async () => {
      const res = await toggleListingFeatured(l.id, !l.is_featured);
      if (res.ok) {
        toast("success", l.is_featured ? "Removed from featured." : "Marked as featured.");
        router.refresh();
      } else {
        toast("error", res.error || "Could not update featured.");
      }
    });
  }

  function onPublish() {
    const next = l.status === "published" ? "draft" : "published";
    startTransition(async () => {
      const res = await toggleListingPublish(l.id, next);
      if (res.ok) {
        toast("success", next === "published" ? "Property published." : "Property unpublished.");
        router.refresh();
      } else {
        toast("error", res.error || "Could not update status.");
      }
    });
  }

  return (
    <tr className="hover:bg-muted">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded bg-navy-100">
            {l.cover_image && (
              <Image src={l.cover_image} alt="" fill className="object-cover" sizes="56px" />
            )}
          </div>
          <Link
            href={`/admin/listings/${l.id}`}
            className="font-medium text-navy-900 hover:text-gold-700"
          >
            {l.title}
          </Link>
        </div>
      </td>
      <td className="px-4 py-3 capitalize text-navy-700">
        {l.listing_type} · {l.property_type}
      </td>
      <td className="px-4 py-3 text-navy-700">{formatPrice(l)}</td>
      <td className="px-4 py-3">
        <button
          type="button"
          onClick={onFeatured}
          disabled={isPending}
          title="Toggle featured"
          className={
            (l.is_featured ? "text-gold-500" : "text-muted-foreground hover:text-gold-500") +
            " disabled:opacity-50"
          }
        >
          <Star className="h-4 w-4" fill={l.is_featured ? "currentColor" : "none"} />
        </button>
      </td>
      <td className="px-4 py-3">
        <span
          className={
            l.status === "published"
              ? "rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800"
              : "rounded-full bg-navy-100 px-2 py-0.5 text-xs font-medium text-navy-700"
          }
        >
          {l.status}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onPublish}
            disabled={isPending}
            className="rounded border border-border px-2 py-1 text-xs text-navy-700 hover:bg-navy-50 disabled:opacity-50"
          >
            {l.status === "published" ? "Unpublish" : "Publish"}
          </button>
          <ConfirmButton
            title="Delete property?"
            message={`This will permanently delete “${l.title}”. This action cannot be undone.`}
            successMessage="Property deleted."
            ariaLabel="Delete property"
            onConfirm={() => deleteListing(l.id)}
            className="rounded border border-red-200 p-1 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </ConfirmButton>
        </div>
      </td>
    </tr>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ListingEditor } from "@/components/admin/listing-editor";
import { ListingGalleryManager } from "@/components/admin/listing-gallery-manager";
import type { Listing, ListingImage } from "@/types/database";

export default async function EditListingPage({
  params,
}: PageProps<"/admin/listings/[id]">) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: listing } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!listing) notFound();

  const { data: images } = await supabase
    .from("listing_images")
    .select("*")
    .eq("listing_id", id)
    .order("sort_order");

  return (
    <div className="space-y-6">
      <Link href="/admin/listings" className="text-sm text-gold-700 hover:underline">
        ← Back to properties
      </Link>
      <h1 className="font-serif text-2xl text-navy-900">Edit Property</h1>
      <ListingEditor listing={listing as Listing} />
      <ListingGalleryManager listingId={id} images={(images as ListingImage[]) ?? []} />
    </div>
  );
}

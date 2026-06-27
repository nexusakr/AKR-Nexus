import Link from "next/link";
import Image from "next/image";
import { Plus, Trash2, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/components/site/listing-card";
import {
  toggleListingPublish,
  toggleListingFeatured,
  deleteListing,
} from "@/lib/actions/admin-listings";
import type { Listing } from "@/types/database";

export default async function AdminListingsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false });
  const listings = (data as Listing[]) ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-navy-900">Properties</h1>
          <p className="text-sm text-muted-foreground">{listings.length} listing(s)</p>
        </div>
        <Link
          href="/admin/listings/new"
          className="inline-flex items-center gap-2 rounded-md bg-gold-500 px-4 py-2 text-sm font-semibold text-navy-950 hover:bg-gold-600"
        >
          <Plus className="h-4 w-4" /> New Property
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3">Property</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {listings.length ? (
              listings.map((l) => (
                <tr key={l.id} className="hover:bg-muted">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded bg-navy-100">
                        {l.cover_image && (
                          <Image src={l.cover_image} alt="" fill className="object-cover" sizes="56px" />
                        )}
                      </div>
                      <Link href={`/admin/listings/${l.id}`} className="font-medium text-navy-900 hover:text-gold-700">
                        {l.title}
                      </Link>
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize text-navy-700">
                    {l.listing_type} · {l.property_type}
                  </td>
                  <td className="px-4 py-3 text-navy-700">{formatPrice(l)}</td>
                  <td className="px-4 py-3">
                    <form action={toggleListingFeatured}>
                      <input type="hidden" name="id" value={l.id} />
                      <input type="hidden" name="next" value={(!l.is_featured).toString()} />
                      <button title="Toggle featured" className={l.is_featured ? "text-gold-500" : "text-muted-foreground hover:text-gold-500"}>
                        <Star className="h-4 w-4" fill={l.is_featured ? "currentColor" : "none"} />
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <span className={l.status === "published" ? "rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800" : "rounded-full bg-navy-100 px-2 py-0.5 text-xs font-medium text-navy-700"}>
                      {l.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <form action={toggleListingPublish}>
                        <input type="hidden" name="id" value={l.id} />
                        <input type="hidden" name="next" value={l.status === "published" ? "draft" : "published"} />
                        <button className="rounded border border-border px-2 py-1 text-xs text-navy-700 hover:bg-navy-50">
                          {l.status === "published" ? "Unpublish" : "Publish"}
                        </button>
                      </form>
                      <form action={deleteListing}>
                        <input type="hidden" name="id" value={l.id} />
                        <button className="rounded border border-red-200 p-1 text-red-600 hover:bg-red-50">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  No properties yet. Add your first listing.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

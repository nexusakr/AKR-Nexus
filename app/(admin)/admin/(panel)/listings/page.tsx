import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ListingRow } from "@/components/admin/listing-row";
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
              listings.map((l) => <ListingRow key={l.id} listing={l} />)
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

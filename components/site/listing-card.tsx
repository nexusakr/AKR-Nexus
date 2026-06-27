import Link from "next/link";
import Image from "next/image";
import { MapPin, BedDouble, Bath, Maximize } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Listing } from "@/types/database";

export function formatPrice(listing: Pick<Listing, "price" | "price_label">): string {
  if (listing.price_label) return listing.price_label;
  if (listing.price == null) return "Price on request";
  const n = Number(listing.price);
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2).replace(/\.00$/, "")} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2).replace(/\.00$/, "")} Lakh`;
  return `₹${n.toLocaleString("en-IN")}`;
}

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      href={`/listings/${listing.slug}`}
      className="group overflow-hidden rounded-xl border border-border bg-white transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] bg-navy-100">
        {listing.cover_image && (
          <Image
            src={listing.cover_image}
            alt={listing.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width:768px) 100vw, 33vw"
          />
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge variant={listing.listing_type === "rent" ? "default" : "gold"}>
            {listing.listing_type === "rent" ? "For Rent" : "For Sale"}
          </Badge>
          {listing.is_featured && <Badge variant="gold">Featured</Badge>}
        </div>
      </div>
      <div className="p-5">
        <p className="font-serif text-lg font-semibold text-gold-700">
          {formatPrice(listing)}
        </p>
        <h3 className="mt-1 font-serif text-lg text-navy-900 line-clamp-1">
          {listing.title}
        </h3>
        {listing.location && (
          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" /> {listing.location}
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-navy-700">
          {listing.bedrooms != null && (
            <span className="flex items-center gap-1">
              <BedDouble className="h-4 w-4 text-gold-600" /> {listing.bedrooms}
            </span>
          )}
          {listing.bathrooms != null && (
            <span className="flex items-center gap-1">
              <Bath className="h-4 w-4 text-gold-600" /> {listing.bathrooms}
            </span>
          )}
          {listing.area_value != null && (
            <span className="flex items-center gap-1">
              <Maximize className="h-4 w-4 text-gold-600" /> {listing.area_value}{" "}
              {listing.area_unit}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

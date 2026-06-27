import Link from "next/link";
import { ListingEditor } from "@/components/admin/listing-editor";

export default function NewListingPage() {
  return (
    <div className="space-y-6">
      <Link href="/admin/listings" className="text-sm text-gold-700 hover:underline">
        ← Back to properties
      </Link>
      <h1 className="font-serif text-2xl text-navy-900">New Property</h1>
      <p className="text-sm text-muted-foreground">
        Save the property first, then add gallery photos on the edit screen.
      </p>
      <ListingEditor listing={null} />
    </div>
  );
}

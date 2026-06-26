import Link from "next/link";
import { VentureEditor } from "@/components/admin/venture-editor";

export default function NewVenturePage() {
  return (
    <div className="space-y-6">
      <Link href="/admin/ventures" className="text-sm text-gold-700 hover:underline">
        ← Back to ventures
      </Link>
      <h1 className="font-serif text-2xl text-navy-900">New Venture</h1>
      <p className="text-sm text-muted-foreground">
        Save the venture first, then add gallery images on the edit screen.
      </p>
      <VentureEditor venture={null} />
    </div>
  );
}

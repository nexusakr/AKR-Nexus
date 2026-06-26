import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { VentureEditor } from "@/components/admin/venture-editor";
import { GalleryManager } from "@/components/admin/gallery-manager";
import type { Venture, VentureImage } from "@/types/database";

export default async function EditVenturePage({
  params,
}: PageProps<"/admin/ventures/[id]">) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: venture } = await supabase
    .from("ventures")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!venture) notFound();

  const { data: images } = await supabase
    .from("venture_images")
    .select("*")
    .eq("venture_id", id)
    .order("sort_order");

  return (
    <div className="space-y-6">
      <Link href="/admin/ventures" className="text-sm text-gold-700 hover:underline">
        ← Back to ventures
      </Link>
      <h1 className="font-serif text-2xl text-navy-900">Edit Venture</h1>
      <VentureEditor venture={venture as Venture} />
      <GalleryManager ventureId={id} images={(images as VentureImage[]) ?? []} />
    </div>
  );
}

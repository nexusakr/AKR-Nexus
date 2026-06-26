"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import type { PublishStatus, VentureStatus } from "@/types/database";

export async function saveVenture(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();

  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  if (!title) return;

  const payload = {
    title,
    slug: String(formData.get("slug") || "").trim() || slugify(title),
    brand: String(formData.get("brand") || "Dham Developers").trim(),
    venture_status: String(formData.get("venture_status") || "upcoming") as VentureStatus,
    location: String(formData.get("location") || "").trim() || null,
    summary: String(formData.get("summary") || "").trim() || null,
    body: String(formData.get("body") || "") || null,
    cover_image: String(formData.get("cover_image") || "").trim() || null,
    brochure_url: String(formData.get("brochure_url") || "").trim() || null,
    is_featured: formData.get("is_featured") === "on",
    status: String(formData.get("status") || "draft") as PublishStatus,
  };

  let ventureId = id;
  if (id) {
    await supabase.from("ventures").update(payload).eq("id", id);
  } else {
    const { data } = await supabase.from("ventures").insert(payload).select("id").single();
    ventureId = data?.id ?? "";
  }

  revalidatePath("/admin/ventures");
  revalidatePath("/ventures");
  if (ventureId) redirect(`/admin/ventures/${ventureId}`);
  redirect("/admin/ventures");
}

export async function toggleVenturePublish(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  const next = String(formData.get("next") || "draft") as PublishStatus;
  if (!id) return;
  await supabase.from("ventures").update({ status: next }).eq("id", id);
  revalidatePath("/admin/ventures");
  revalidatePath("/ventures");
}

export async function deleteVenture(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await supabase.from("ventures").delete().eq("id", id);
  revalidatePath("/admin/ventures");
  revalidatePath("/ventures");
}

export async function addVentureImage(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();
  const ventureId = String(formData.get("venture_id") || "");
  const url = String(formData.get("image_url") || "").trim();
  if (!ventureId || !url) return;
  await supabase.from("venture_images").insert({
    venture_id: ventureId,
    image_url: url,
    caption: String(formData.get("caption") || "").trim() || null,
  });
  revalidatePath(`/admin/ventures/${ventureId}`);
  revalidatePath("/ventures");
}

export async function deleteVentureImage(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  const ventureId = String(formData.get("venture_id") || "");
  if (!id) return;
  await supabase.from("venture_images").delete().eq("id", id);
  revalidatePath(`/admin/ventures/${ventureId}`);
  revalidatePath("/ventures");
}

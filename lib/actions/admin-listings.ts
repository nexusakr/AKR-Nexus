"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, requireStaff } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import type { ListingType, PublishStatus } from "@/types/database";

function num(v: FormDataEntryValue | null): number | null {
  if (v == null) return null;
  const s = String(v).trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function intOrNull(v: FormDataEntryValue | null): number | null {
  const n = num(v);
  return n == null ? null : Math.trunc(n);
}

export async function saveListing(formData: FormData) {
  await requireStaff();
  const { userId } = await getCurrentUser();
  const supabase = await createClient();

  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  if (!title) return;

  // Amenities: checkbox values + comma-separated extras.
  const amenities = new Set<string>(
    formData.getAll("amenities").map((a) => String(a).trim()).filter(Boolean)
  );
  String(formData.get("amenities_custom") || "")
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean)
    .forEach((a) => amenities.add(a));

  let floorPlans: string[] = [];
  try {
    floorPlans = JSON.parse(String(formData.get("floor_plans") || "[]"));
    if (!Array.isArray(floorPlans)) floorPlans = [];
  } catch {
    floorPlans = [];
  }

  const payload = {
    title,
    slug: String(formData.get("slug") || "").trim() || slugify(title),
    description: String(formData.get("description") || "") || null,
    listing_type: (String(formData.get("listing_type") || "sale") as ListingType),
    property_type: String(formData.get("property_type") || "plot"),
    price: num(formData.get("price")),
    price_label: String(formData.get("price_label") || "").trim() || null,
    area_value: num(formData.get("area_value")),
    area_unit: String(formData.get("area_unit") || "sqft"),
    bedrooms: intOrNull(formData.get("bedrooms")),
    bathrooms: intOrNull(formData.get("bathrooms")),
    location: String(formData.get("location") || "").trim() || null,
    address: String(formData.get("address") || "").trim() || null,
    latitude: num(formData.get("latitude")),
    longitude: num(formData.get("longitude")),
    amenities: Array.from(amenities),
    cover_image: String(formData.get("cover_image") || "").trim() || null,
    video_url: String(formData.get("video_url") || "").trim() || null,
    floor_plans: floorPlans,
    brochure_url: String(formData.get("brochure_url") || "").trim() || null,
    is_featured: formData.get("is_featured") === "on",
    status: (String(formData.get("status") || "draft") as PublishStatus),
    seo_title: String(formData.get("seo_title") || "").trim() || null,
    seo_description: String(formData.get("seo_description") || "").trim() || null,
  };

  let listingId = id;
  if (id) {
    await supabase.from("listings").update(payload).eq("id", id);
  } else {
    const { data } = await supabase
      .from("listings")
      .insert({ ...payload, created_by: userId })
      .select("id")
      .single();
    listingId = data?.id ?? "";
  }

  revalidatePath("/admin/listings");
  revalidatePath("/listings");
  if (listingId) redirect(`/admin/listings/${listingId}`);
  redirect("/admin/listings");
}

export async function toggleListingPublish(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  const next = String(formData.get("next") || "draft") as PublishStatus;
  if (!id) return;
  await supabase.from("listings").update({ status: next }).eq("id", id);
  revalidatePath("/admin/listings");
  revalidatePath("/listings");
}

export async function toggleListingFeatured(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  const next = String(formData.get("next") || "false") === "true";
  if (!id) return;
  await supabase.from("listings").update({ is_featured: next }).eq("id", id);
  revalidatePath("/admin/listings");
  revalidatePath("/listings");
  revalidatePath("/");
}

export async function deleteListing(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await supabase.from("listings").delete().eq("id", id);
  revalidatePath("/admin/listings");
  revalidatePath("/listings");
}

export async function addListingImage(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();
  const listingId = String(formData.get("listing_id") || "");
  const url = String(formData.get("image_url") || "").trim();
  if (!listingId || !url) return;
  await supabase.from("listing_images").insert({
    listing_id: listingId,
    image_url: url,
    caption: String(formData.get("caption") || "").trim() || null,
  });
  revalidatePath(`/admin/listings/${listingId}`);
  revalidatePath("/listings");
}

export async function deleteListingImage(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  const listingId = String(formData.get("listing_id") || "");
  if (!id) return;
  await supabase.from("listing_images").delete().eq("id", id);
  revalidatePath(`/admin/listings/${listingId}`);
  revalidatePath("/listings");
}

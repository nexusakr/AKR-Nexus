"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, requireStaff } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import type { ListingType, PublishStatus } from "@/types/database";

export type ListingActionResult = { ok: boolean; error?: string; id?: string };

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

/** Turn a Supabase error into a friendly admin message. */
function friendly(error: { code?: string; message: string }): string {
  if (error.code === "23505") {
    return "That slug is already used by another property. Please choose a different slug.";
  }
  return error.message || "Something went wrong. Please try again.";
}

function revalidateListings(id?: string) {
  revalidatePath("/admin/listings");
  if (id) revalidatePath(`/admin/listings/${id}`);
  revalidatePath("/listings");
  revalidatePath("/");
}

export async function saveListing(formData: FormData): Promise<ListingActionResult> {
  await requireStaff();
  const { userId } = await getCurrentUser();
  const supabase = await createClient();

  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  if (!title) return { ok: false, error: "Title is required." };

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

  if (id) {
    const { error } = await supabase.from("listings").update(payload).eq("id", id);
    if (error) return { ok: false, error: friendly(error) };
    revalidateListings(id);
    return { ok: true, id };
  }

  const { data, error } = await supabase
    .from("listings")
    .insert({ ...payload, created_by: userId })
    .select("id")
    .single();
  if (error) return { ok: false, error: friendly(error) };
  revalidateListings(data?.id);
  return { ok: true, id: data?.id };
}

export async function toggleListingPublish(
  id: string,
  next: PublishStatus
): Promise<ListingActionResult> {
  await requireStaff();
  if (!id) return { ok: false, error: "Missing listing id." };
  const supabase = await createClient();
  const { error } = await supabase
    .from("listings")
    .update({ status: next })
    .eq("id", id);
  if (error) return { ok: false, error: friendly(error) };
  revalidateListings(id);
  return { ok: true };
}

export async function toggleListingFeatured(
  id: string,
  next: boolean
): Promise<ListingActionResult> {
  await requireStaff();
  if (!id) return { ok: false, error: "Missing listing id." };
  const supabase = await createClient();
  const { error } = await supabase
    .from("listings")
    .update({ is_featured: next })
    .eq("id", id);
  if (error) return { ok: false, error: friendly(error) };
  revalidateListings(id);
  return { ok: true };
}

export async function deleteListing(id: string): Promise<ListingActionResult> {
  await requireStaff();
  if (!id) return { ok: false, error: "Missing listing id." };
  const supabase = await createClient();
  const { error } = await supabase.from("listings").delete().eq("id", id);
  if (error) return { ok: false, error: friendly(error) };
  revalidateListings();
  return { ok: true };
}

export async function addListingImage(
  listingId: string,
  url: string,
  caption?: string
): Promise<ListingActionResult> {
  await requireStaff();
  if (!listingId || !url) return { ok: false, error: "Missing image details." };
  const supabase = await createClient();
  const { error } = await supabase.from("listing_images").insert({
    listing_id: listingId,
    image_url: url,
    caption: caption?.trim() || null,
  });
  if (error) return { ok: false, error: friendly(error) };
  revalidatePath(`/admin/listings/${listingId}`);
  revalidatePath("/listings");
  return { ok: true };
}

export async function deleteListingImage(
  id: string,
  listingId: string
): Promise<ListingActionResult> {
  await requireStaff();
  if (!id) return { ok: false, error: "Missing image id." };
  const supabase = await createClient();
  const { error } = await supabase.from("listing_images").delete().eq("id", id);
  if (error) return { ok: false, error: friendly(error) };
  revalidatePath(`/admin/listings/${listingId}`);
  revalidatePath("/listings");
  return { ok: true };
}

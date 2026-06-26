"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import type { PartnerTypeValue, PublishStatus } from "@/types/database";

/* ── Partners ──────────────────────────────────────────────── */
export async function savePartner(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  if (!name) return;
  const payload = {
    name,
    partner_type: String(formData.get("partner_type") || "other") as PartnerTypeValue,
    website: String(formData.get("website") || "").trim() || null,
    logo_url: String(formData.get("logo_url") || "").trim() || null,
    description: String(formData.get("description") || "").trim() || null,
    status: String(formData.get("status") || "draft") as PublishStatus,
  };
  if (id) await supabase.from("partners").update(payload).eq("id", id);
  else await supabase.from("partners").insert(payload);
  revalidatePath("/admin/partners");
  revalidatePath("/");
  redirect("/admin/partners");
}

export async function togglePartner(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  const next = String(formData.get("next") || "draft") as PublishStatus;
  if (!id) return;
  await supabase.from("partners").update({ status: next }).eq("id", id);
  revalidatePath("/admin/partners");
  revalidatePath("/");
}

export async function deletePartner(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await supabase.from("partners").delete().eq("id", id);
  revalidatePath("/admin/partners");
  revalidatePath("/");
}

/* ── Customer Programs ─────────────────────────────────────── */
export async function saveProgram(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  if (!name) return;
  const payload = {
    name,
    slug: String(formData.get("slug") || "").trim() || slugify(name),
    segment: String(formData.get("segment") || "").trim() || null,
    summary: String(formData.get("summary") || "").trim() || null,
    body: String(formData.get("body") || "") || null,
    status: String(formData.get("status") || "published") as PublishStatus,
  };
  if (id) await supabase.from("customer_programs").update(payload).eq("id", id);
  else await supabase.from("customer_programs").insert(payload);
  revalidatePath("/admin/programs");
  revalidatePath("/customer-programs");
  redirect("/admin/programs");
}

export async function deleteProgram(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await supabase.from("customer_programs").delete().eq("id", id);
  revalidatePath("/admin/programs");
  revalidatePath("/customer-programs");
}

/* ── Media library ─────────────────────────────────────────── */
export async function deleteMedia(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  const bucket = String(formData.get("bucket") || "");
  const path = String(formData.get("path") || "");
  if (!id) return;
  if (bucket && path) await supabase.storage.from(bucket).remove([path]);
  await supabase.from("media_assets").delete().eq("id", id);
  revalidatePath("/admin/media");
}

/* ── Page content ──────────────────────────────────────────── */
export async function savePageContent(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();
  const page_key = String(formData.get("page_key") || "").trim();
  const section_key = String(formData.get("section_key") || "").trim();
  const raw = String(formData.get("value") || "").trim();
  if (!page_key || !section_key) return;

  let value: Record<string, unknown>;
  try {
    value = raw ? JSON.parse(raw) : {};
  } catch {
    value = { text: raw };
  }

  await supabase
    .from("page_content")
    .upsert({ page_key, section_key, value }, { onConflict: "page_key,section_key" });
  revalidatePath("/admin/content");
  revalidatePath("/", "layout");
}

export async function deletePageContent(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await supabase.from("page_content").delete().eq("id", id);
  revalidatePath("/admin/content");
}

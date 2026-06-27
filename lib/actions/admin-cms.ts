"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";
import type { PublishStatus } from "@/types/database";

/* ── Team members ──────────────────────────────────────────── */
export async function saveTeamMember(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  if (!name) return;
  const payload = {
    name,
    role: String(formData.get("role") || "").trim() || null,
    bio: String(formData.get("bio") || "").trim() || null,
    email: String(formData.get("email") || "").trim() || null,
    linkedin_url: String(formData.get("linkedin_url") || "").trim() || null,
    photo_url: String(formData.get("photo_url") || "").trim() || null,
    sort_order: Number(formData.get("sort_order") || 0) || 0,
    status: String(formData.get("status") || "published") as PublishStatus,
  };
  if (id) await supabase.from("team_members").update(payload).eq("id", id);
  else await supabase.from("team_members").insert(payload);
  revalidatePath("/admin/team");
  revalidatePath("/about");
}

export async function deleteTeamMember(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await supabase.from("team_members").delete().eq("id", id);
  revalidatePath("/admin/team");
  revalidatePath("/about");
}

/* ── Testimonials ──────────────────────────────────────────── */
export async function saveTestimonial(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  const author_name = String(formData.get("author_name") || "").trim();
  const quote = String(formData.get("quote") || "").trim();
  if (!author_name || !quote) return;
  const payload = {
    author_name,
    quote,
    author_role: String(formData.get("author_role") || "").trim() || null,
    photo_url: String(formData.get("photo_url") || "").trim() || null,
    sort_order: Number(formData.get("sort_order") || 0) || 0,
    status: String(formData.get("status") || "draft") as PublishStatus,
  };
  if (id) await supabase.from("testimonials").update(payload).eq("id", id);
  else await supabase.from("testimonials").insert(payload);
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export async function deleteTestimonial(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await supabase.from("testimonials").delete().eq("id", id);
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

/* ── Hero sections ─────────────────────────────────────────── */
export async function saveHero(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  const payload = {
    page_key: String(formData.get("page_key") || "home").trim() || "home",
    eyebrow: String(formData.get("eyebrow") || "").trim() || null,
    heading: String(formData.get("heading") || "").trim() || null,
    subtitle: String(formData.get("subtitle") || "").trim() || null,
    cta_primary_label: String(formData.get("cta_primary_label") || "").trim() || null,
    cta_primary_href: String(formData.get("cta_primary_href") || "").trim() || null,
    cta_secondary_label: String(formData.get("cta_secondary_label") || "").trim() || null,
    cta_secondary_href: String(formData.get("cta_secondary_href") || "").trim() || null,
    image_url: String(formData.get("image_url") || "").trim() || null,
    video_url: String(formData.get("video_url") || "").trim() || null,
    is_active: formData.get("is_active") === "on",
    sort_order: Number(formData.get("sort_order") || 0) || 0,
  };
  let heroId = id;
  if (id) {
    await supabase.from("hero_sections").update(payload).eq("id", id);
  } else {
    const { data } = await supabase
      .from("hero_sections")
      .insert(payload)
      .select("id")
      .single();
    heroId = data?.id ?? "";
  }

  // Enforce a single active hero per page: if this one is active,
  // deactivate every other hero on the same page.
  if (payload.is_active && heroId) {
    await supabase
      .from("hero_sections")
      .update({ is_active: false })
      .eq("page_key", payload.page_key)
      .neq("id", heroId);
  }

  revalidatePath("/admin/hero");
  revalidatePath("/", "layout");
}

export type HeroActionResult = { ok: boolean; error?: string };

/**
 * Activate one hero and deactivate all other heroes on the same page,
 * guaranteeing exactly one active hero per page_key.
 */
export async function activateHero(id: string): Promise<HeroActionResult> {
  await requireStaff();
  if (!id) return { ok: false, error: "Missing hero id." };
  const supabase = await createClient();

  const { data: hero, error: fetchErr } = await supabase
    .from("hero_sections")
    .select("page_key")
    .eq("id", id)
    .maybeSingle();
  if (fetchErr) return { ok: false, error: fetchErr.message };
  if (!hero) return { ok: false, error: "Hero not found." };

  const { error: offErr } = await supabase
    .from("hero_sections")
    .update({ is_active: false })
    .eq("page_key", hero.page_key)
    .neq("id", id);
  if (offErr) return { ok: false, error: offErr.message };

  const { error: onErr } = await supabase
    .from("hero_sections")
    .update({ is_active: true })
    .eq("id", id);
  if (onErr) return { ok: false, error: onErr.message };

  revalidatePath("/admin/hero");
  revalidatePath("/", "layout");
  return { ok: true };
}

/**
 * Delete a hero. Refuses to delete the only active hero on a page while
 * other (inactive) heroes still exist — the user must activate another first.
 */
export async function deleteHero(id: string): Promise<HeroActionResult> {
  await requireStaff();
  if (!id) return { ok: false, error: "Missing hero id." };
  const supabase = await createClient();

  const { data: hero } = await supabase
    .from("hero_sections")
    .select("id, page_key, is_active")
    .eq("id", id)
    .maybeSingle();
  if (!hero) return { ok: false, error: "Hero not found." };

  if (hero.is_active) {
    const { count: otherActive } = await supabase
      .from("hero_sections")
      .select("*", { head: true, count: "exact" })
      .eq("page_key", hero.page_key)
      .eq("is_active", true)
      .neq("id", id);
    const { count: otherTotal } = await supabase
      .from("hero_sections")
      .select("*", { head: true, count: "exact" })
      .eq("page_key", hero.page_key)
      .neq("id", id);

    if ((otherActive ?? 0) === 0 && (otherTotal ?? 0) > 0) {
      return {
        ok: false,
        error:
          "This is the only active hero for this page. Activate another hero first, then delete this one.",
      };
    }
  }

  const { error } = await supabase.from("hero_sections").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/hero");
  revalidatePath("/", "layout");
  return { ok: true };
}

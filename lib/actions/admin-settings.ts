"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

export type SettingsState = { ok: boolean; message: string };

/** Update the singleton site_settings row (admin only). */
export async function updateSettings(
  _prev: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  await requireAdmin();
  const supabase = await createClient();

  const get = (k: string) => String(formData.get(k) ?? "").trim();

  const { error } = await supabase
    .from("site_settings")
    .update({
      whatsapp_number: get("whatsapp_number"),
      phone: get("phone"),
      email: get("email"),
      address: get("address"),
      rera_number: get("rera_number"),
      facebook_url: get("facebook_url"),
      instagram_url: get("instagram_url"),
      linkedin_url: get("linkedin_url"),
      youtube_url: get("youtube_url"),
      twitter_url: get("twitter_url"),
      ga4_id: get("ga4_id"),
      gtm_id: get("gtm_id"),
      meta_pixel_id: get("meta_pixel_id"),
      map_embed_url: get("map_embed_url"),
    })
    .eq("id", 1);

  if (error) {
    console.error("[settings] update:", error);
    return { ok: false, message: "Could not save settings." };
  }

  revalidatePath("/", "layout");
  return { ok: true, message: "Settings saved." };
}

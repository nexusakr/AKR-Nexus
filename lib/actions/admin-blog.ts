"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, requireStaff } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import type { PublishStatus } from "@/types/database";

/** Create or update a blog post, then redirect back to the list. */
export async function savePost(formData: FormData) {
  await requireStaff();
  const { userId } = await getCurrentUser();
  const supabase = await createClient();

  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  if (!title) return;

  const slug =
    String(formData.get("slug") || "").trim() || slugify(title);
  const status = (String(formData.get("status") || "draft") as PublishStatus);
  const categoryId = String(formData.get("category_id") || "");

  const payload = {
    title,
    slug,
    excerpt: String(formData.get("excerpt") || "").trim() || null,
    body: String(formData.get("body") || "") || null,
    cover_image: String(formData.get("cover_image") || "").trim() || null,
    category_id: categoryId || null,
    author_name: String(formData.get("author_name") || "").trim() || null,
    seo_title: String(formData.get("seo_title") || "").trim() || null,
    seo_description: String(formData.get("seo_description") || "").trim() || null,
    status,
  };

  if (id) {
    // Preserve/refresh published_at on publish transitions.
    const { data: existing } = await supabase
      .from("blog_posts")
      .select("published_at, status")
      .eq("id", id)
      .maybeSingle();
    const published_at =
      status === "published"
        ? existing?.published_at || new Date().toISOString()
        : existing?.published_at || null;
    await supabase.from("blog_posts").update({ ...payload, published_at }).eq("id", id);
  } else {
    await supabase.from("blog_posts").insert({
      ...payload,
      published_at: status === "published" ? new Date().toISOString() : null,
      created_by: userId,
    });
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect("/admin/blog");
}

/** Toggle publish/unpublish for a post. */
export async function togglePostPublish(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  const next = String(formData.get("next") || "draft") as PublishStatus;
  if (!id) return;
  await supabase
    .from("blog_posts")
    .update({
      status: next,
      published_at: next === "published" ? new Date().toISOString() : null,
    })
    .eq("id", id);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function deletePost(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await supabase.from("blog_posts").delete().eq("id", id);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function createCategory(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();
  const name = String(formData.get("name") || "").trim();
  if (!name) return;
  await supabase
    .from("blog_categories")
    .insert({ name, slug: slugify(name) });
  revalidatePath("/admin/blog");
}

export async function deleteCategory(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await supabase.from("blog_categories").delete().eq("id", id);
  revalidatePath("/admin/blog");
}

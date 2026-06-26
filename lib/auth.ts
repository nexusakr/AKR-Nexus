import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/data";
import type { Profile } from "@/types/database";

/** Returns the current authed user + their profile (or nulls). */
export async function getCurrentUser(): Promise<{
  userId: string | null;
  profile: Profile | null;
}> {
  if (!isSupabaseConfigured()) return { userId: null, profile: null };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { userId: null, profile: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return { userId: user.id, profile: profile ?? null };
}

/** Guards admin routes: requires an authenticated staff member (admin/editor). */
export async function requireStaff(): Promise<Profile> {
  const { profile } = await getCurrentUser();
  if (!profile) redirect("/admin/login");
  if (profile.role !== "admin" && profile.role !== "editor") {
    redirect("/admin/login?error=forbidden");
  }
  return profile;
}

/** Guards admin-only routes (settings, user management, deletes). */
export async function requireAdmin(): Promise<Profile> {
  const profile = await requireStaff();
  if (profile.role !== "admin") redirect("/admin?error=forbidden");
  return profile;
}

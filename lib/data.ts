import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type {
  BlogCategory,
  BlogPost,
  CustomerProgram,
  Division,
  HeroSection,
  Listing,
  ListingImage,
  ListingType,
  Partner,
  SiteSettings,
  TeamMember,
  Testimonial,
  Venture,
  VentureImage,
} from "@/types/database";

/** True when Supabase env vars are present (lets the site render during setup). */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export const getSiteSettings = cache(async (): Promise<SiteSettings | null> => {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  return data ?? null;
});

export const getFeaturedVentures = cache(async (): Promise<Venture[]> => {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("ventures")
    .select("*")
    .eq("status", "published")
    .eq("is_featured", true)
    .order("sort_order", { ascending: true })
    .limit(3);
  return data ?? [];
});

export const getPublishedVentures = cache(async (): Promise<Venture[]> => {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("ventures")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true });
  return data ?? [];
});

export const getVentureBySlug = cache(
  async (slug: string): Promise<(Venture & { images: VentureImage[] }) | null> => {
    if (!isSupabaseConfigured()) return null;
    const supabase = await createClient();
    const { data: venture } = await supabase
      .from("ventures")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    if (!venture) return null;
    const { data: images } = await supabase
      .from("venture_images")
      .select("*")
      .eq("venture_id", venture.id)
      .order("sort_order", { ascending: true });
    return { ...venture, images: images ?? [] };
  }
);

export const getPublishedPosts = cache(
  async (limit?: number): Promise<BlogPost[]> => {
    if (!isSupabaseConfigured()) return [];
    const supabase = await createClient();
    let query = supabase
      .from("blog_posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });
    if (limit) query = query.limit(limit);
    const { data } = await query;
    return data ?? [];
  }
);

export const getPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return data ?? null;
});

export const getCategories = cache(async (): Promise<BlogCategory[]> => {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_categories")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
});

export const getPublishedPartners = cache(async (): Promise<Partner[]> => {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("partners")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true });
  return data ?? [];
});

export const getPrograms = cache(async (): Promise<CustomerProgram[]> => {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("customer_programs")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true });
  return data ?? [];
});

export const getDivisions = cache(async (): Promise<Division[]> => {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("divisions")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
});

export const getPublishedTestimonials = cache(async (): Promise<Testimonial[]> => {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true });
  return data ?? [];
});

export const getTeam = cache(async (): Promise<TeamMember[]> => {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("team_members")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true });
  return data ?? [];
});

export const getHero = cache(
  async (pageKey = "home"): Promise<HeroSection | null> => {
    if (!isSupabaseConfigured()) return null;
    const supabase = await createClient();
    const { data } = await supabase
      .from("hero_sections")
      .select("*")
      .eq("page_key", pageKey)
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .limit(1)
      .maybeSingle();
    return data ?? null;
  }
);

export type ListingFilters = {
  listingType?: string;
  propertyType?: string;
  featured?: boolean;
};

export const getPublishedListings = cache(
  async (filters: ListingFilters = {}): Promise<Listing[]> => {
    if (!isSupabaseConfigured()) return [];
    const supabase = await createClient();
    let query = supabase
      .from("listings")
      .select("*")
      .eq("status", "published")
      .order("is_featured", { ascending: false })
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (filters.listingType)
      query = query.eq("listing_type", filters.listingType as ListingType);
    if (filters.propertyType)
      query = query.eq("property_type", filters.propertyType);
    if (filters.featured) query = query.eq("is_featured", true);
    const { data } = await query;
    return data ?? [];
  }
);

export const getFeaturedListings = cache(async (): Promise<Listing[]> => {
  return getPublishedListings({ featured: true });
});

export const getListingBySlug = cache(
  async (slug: string): Promise<(Listing & { images: ListingImage[] }) | null> => {
    if (!isSupabaseConfigured()) return null;
    const supabase = await createClient();
    const { data: listing } = await supabase
      .from("listings")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    if (!listing) return null;
    const { data: images } = await supabase
      .from("listing_images")
      .select("*")
      .eq("listing_id", listing.id)
      .order("sort_order", { ascending: true });
    return { ...listing, images: images ?? [] };
  }
);

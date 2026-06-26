/**
 * Hand-written Supabase Database types for AKR Nexus.
 * Mirrors supabase/migrations/0001_init.sql.
 *
 * NOTE: Row types are `type` aliases (not `interface`) on purpose — Supabase's
 * `GenericTable` constraint requires assignability to `Record<string, unknown>`,
 * which interfaces do not satisfy but object `type` aliases do.
 *
 * Regenerate with `supabase gen types typescript` once the CLI is linked.
 */

export type UserRole = "admin" | "editor" | "viewer";
export type PublishStatus = "draft" | "published";
export type LeadStatusValue =
  | "new"
  | "contacted"
  | "interested"
  | "site_visit_scheduled"
  | "negotiation"
  | "converted"
  | "closed";
export type EnquiryTypeValue =
  | "general"
  | "consultation"
  | "investor"
  | "partner"
  | "nri"
  | "dham";
export type VentureStatus = "coming_soon" | "upcoming" | "ongoing" | "completed";
export type PartnerTypeValue = "developer" | "bank" | "legal" | "other";

export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
};

export type Lead = {
  id: string;
  name: string;
  mobile: string;
  email: string | null;
  city: string | null;
  lead_source: string | null;
  enquiry_type: EnquiryTypeValue;
  interest_type: string | null;
  message: string | null;
  status: LeadStatusValue;
  assigned_to: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type LeadActivity = {
  id: string;
  lead_id: string;
  author: string | null;
  status_from: LeadStatusValue | null;
  status_to: LeadStatusValue | null;
  note: string | null;
  created_at: string;
};

export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  created_at: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  cover_image: string | null;
  category_id: string | null;
  author_name: string | null;
  status: PublishStatus;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type Partner = {
  id: string;
  name: string;
  partner_type: PartnerTypeValue;
  logo_url: string | null;
  website: string | null;
  description: string | null;
  sort_order: number;
  status: PublishStatus;
  created_at: string;
  updated_at: string;
};

export type Venture = {
  id: string;
  title: string;
  slug: string;
  brand: string;
  venture_status: VentureStatus;
  location: string | null;
  summary: string | null;
  body: string | null;
  cover_image: string | null;
  brochure_url: string | null;
  is_featured: boolean;
  sort_order: number;
  status: PublishStatus;
  created_at: string;
  updated_at: string;
};

export type VentureImage = {
  id: string;
  venture_id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
};

export type CustomerProgram = {
  id: string;
  slug: string;
  name: string;
  segment: string | null;
  summary: string | null;
  body: string | null;
  icon: string | null;
  sort_order: number;
  status: PublishStatus;
  created_at: string;
  updated_at: string;
};

export type Division = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  is_coming_soon: boolean;
  sort_order: number;
  updated_at: string;
};

export type Testimonial = {
  id: string;
  author_name: string;
  author_role: string | null;
  photo_url: string | null;
  quote: string;
  sort_order: number;
  status: PublishStatus;
  created_at: string;
  updated_at: string;
};

export type PageContent = {
  id: string;
  page_key: string;
  section_key: string;
  value: Record<string, unknown>;
  updated_at: string;
};

export type SiteSettings = {
  id: number;
  whatsapp_number: string;
  phone: string;
  email: string;
  address: string;
  rera_number: string;
  facebook_url: string;
  instagram_url: string;
  linkedin_url: string;
  youtube_url: string;
  twitter_url: string;
  ga4_id: string;
  gtm_id: string;
  meta_pixel_id: string;
  map_embed_url: string;
  updated_at: string;
};

export type MediaAsset = {
  id: string;
  bucket: string;
  path: string;
  url: string;
  folder: string | null;
  alt: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  uploaded_by: string | null;
  created_at: string;
};

export type NewsletterSubscriber = {
  id: string;
  email: string | null;
  mobile: string | null;
  name: string | null;
  source: string | null;
  created_at: string;
};

export type AuditLog = {
  id: string;
  actor: string | null;
  action: string;
  entity: string | null;
  entity_id: string | null;
  meta: Record<string, unknown>;
  created_at: string;
};

type TableDef<R extends Record<string, unknown>> = {
  Row: R;
  Insert: Partial<R>;
  Update: Partial<R>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: TableDef<Profile>;
      leads: TableDef<Lead>;
      lead_activities: TableDef<LeadActivity>;
      blog_categories: TableDef<BlogCategory>;
      blog_posts: TableDef<BlogPost>;
      partners: TableDef<Partner>;
      ventures: TableDef<Venture>;
      venture_images: TableDef<VentureImage>;
      customer_programs: TableDef<CustomerProgram>;
      divisions: TableDef<Division>;
      testimonials: TableDef<Testimonial>;
      page_content: TableDef<PageContent>;
      site_settings: TableDef<SiteSettings>;
      media_assets: TableDef<MediaAsset>;
      newsletter_subscribers: TableDef<NewsletterSubscriber>;
      audit_log: TableDef<AuditLog>;
    };
    Views: Record<string, never>;
    Functions: {
      is_staff: { Args: Record<string, never>; Returns: boolean };
      is_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: {
      user_role: UserRole;
      publish_status: PublishStatus;
      lead_status: LeadStatusValue;
      enquiry_type: EnquiryTypeValue;
      venture_status: VentureStatus;
      partner_type: PartnerTypeValue;
    };
    CompositeTypes: Record<string, never>;
  };
};

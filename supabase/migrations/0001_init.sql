-- ════════════════════════════════════════════════════════════════════
-- AKR Nexus — initial schema
-- Postgres / Supabase. Run in the Supabase SQL editor or via CLI.
-- ════════════════════════════════════════════════════════════════════

create extension if not exists "pgcrypto";

-- ── Idempotent reset ────────────────────────────────────────────────
-- This is the project's INITIAL setup migration. Drop any app tables from a
-- previous or partially-applied run so it always completes start-to-finish.
-- Without this, `create table if not exists` would silently skip a stale table
-- that is missing newer columns (e.g. `status`), and the following index/policy
-- on that column fails with: ERROR 42703 column "status" does not exist.
-- (CASCADE also removes their indexes, triggers and policies.)
-- Safe on a fresh project (drops nothing). Run before any real data exists.
drop table if exists
  audit_log,
  newsletter_subscribers,
  media_assets,
  site_settings,
  page_content,
  testimonials,
  divisions,
  customer_programs,
  venture_images,
  ventures,
  partners,
  blog_posts,
  blog_categories,
  lead_activities,
  leads,
  profiles
cascade;

-- ── Enums ───────────────────────────────────────────────────────────
do $$ begin
  create type user_role as enum ('admin', 'editor', 'viewer');
exception when duplicate_object then null; end $$;

do $$ begin
  create type publish_status as enum ('draft', 'published');
exception when duplicate_object then null; end $$;

do $$ begin
  create type lead_status as enum (
    'new', 'contacted', 'interested', 'site_visit_scheduled',
    'negotiation', 'converted', 'closed'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type enquiry_type as enum (
    'general', 'consultation', 'investor', 'partner', 'nri', 'dham'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type venture_status as enum ('coming_soon', 'upcoming', 'ongoing', 'completed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type partner_type as enum ('developer', 'bank', 'legal', 'other');
exception when duplicate_object then null; end $$;

-- ── updated_at helper ───────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ════════════════════════════════════════════════════════════════════
-- profiles (mirrors auth.users; holds role for RBAC)
-- ════════════════════════════════════════════════════════════════════
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  role user_role not null default 'viewer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists trg_profiles_updated on profiles;
create trigger trg_profiles_updated before update on profiles
  for each row execute function set_updated_at();

-- Auto-create a profile row when a new auth user signs up.
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function handle_new_user();

-- Role helpers (security definer: read role without recursive RLS).
create or replace function is_staff()
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'editor')
  );
$$;

create or replace function is_admin()
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ════════════════════════════════════════════════════════════════════
-- leads (the CRM) + lead_activities (pipeline history / notes)
-- ════════════════════════════════════════════════════════════════════
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  mobile text not null,
  email text,
  city text,
  lead_source text,            -- e.g. page/blog/segment the lead came from
  enquiry_type enquiry_type not null default 'general',
  interest_type text,
  message text,
  status lead_status not null default 'new',
  assigned_to uuid references profiles(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_leads_status on leads(status);
create index if not exists idx_leads_enquiry on leads(enquiry_type);
create index if not exists idx_leads_created on leads(created_at desc);
drop trigger if exists trg_leads_updated on leads;
create trigger trg_leads_updated before update on leads
  for each row execute function set_updated_at();

create table if not exists lead_activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  author uuid references profiles(id) on delete set null,
  status_from lead_status,
  status_to lead_status,
  note text,
  created_at timestamptz not null default now()
);
create index if not exists idx_lead_activities_lead on lead_activities(lead_id, created_at desc);

-- ════════════════════════════════════════════════════════════════════
-- blog
-- ════════════════════════════════════════════════════════════════════
create table if not exists blog_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  body text,                   -- Markdown
  cover_image text,
  category_id uuid references blog_categories(id) on delete set null,
  author_name text,
  status publish_status not null default 'draft',
  published_at timestamptz,
  seo_title text,
  seo_description text,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_blog_status on blog_posts(status, published_at desc);
create index if not exists idx_blog_category on blog_posts(category_id);
drop trigger if exists trg_blog_updated on blog_posts;
create trigger trg_blog_updated before update on blog_posts
  for each row execute function set_updated_at();

-- ════════════════════════════════════════════════════════════════════
-- partners (logos hidden until admin uploads — business rule)
-- ════════════════════════════════════════════════════════════════════
create table if not exists partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  partner_type partner_type not null default 'other',
  logo_url text,
  website text,
  description text,
  sort_order int not null default 0,
  status publish_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists trg_partners_updated on partners;
create trigger trg_partners_updated before update on partners
  for each row execute function set_updated_at();

-- ════════════════════════════════════════════════════════════════════
-- ventures (Dham Developers projects) + gallery images
-- ════════════════════════════════════════════════════════════════════
create table if not exists ventures (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  brand text not null default 'Dham Developers',
  venture_status venture_status not null default 'upcoming',
  location text,
  summary text,
  body text,                   -- Markdown
  cover_image text,
  brochure_url text,
  is_featured boolean not null default false,
  sort_order int not null default 0,
  status publish_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_ventures_status on ventures(status);
drop trigger if exists trg_ventures_updated on ventures;
create trigger trg_ventures_updated before update on ventures
  for each row execute function set_updated_at();

create table if not exists venture_images (
  id uuid primary key default gen_random_uuid(),
  venture_id uuid not null references ventures(id) on delete cascade,
  image_url text not null,
  caption text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists idx_venture_images on venture_images(venture_id, sort_order);

-- ════════════════════════════════════════════════════════════════════
-- customer_programs (editable copy for the six programs)
-- ════════════════════════════════════════════════════════════════════
create table if not exists customer_programs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  segment text,
  summary text,
  body text,
  icon text,
  sort_order int not null default 0,
  status publish_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists trg_programs_updated on customer_programs;
create trigger trg_programs_updated before update on customer_programs
  for each row execute function set_updated_at();

-- ════════════════════════════════════════════════════════════════════
-- divisions (future verticals — Coming Soon by default)
-- ════════════════════════════════════════════════════════════════════
create table if not exists divisions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text,
  is_coming_soon boolean not null default true,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);
drop trigger if exists trg_divisions_updated on divisions;
create trigger trg_divisions_updated before update on divisions
  for each row execute function set_updated_at();

-- ════════════════════════════════════════════════════════════════════
-- testimonials (EMPTY by default — no fake testimonials)
-- ════════════════════════════════════════════════════════════════════
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_role text,
  photo_url text,
  quote text not null,
  sort_order int not null default 0,
  status publish_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists trg_testimonials_updated on testimonials;
create trigger trg_testimonials_updated before update on testimonials
  for each row execute function set_updated_at();

-- ════════════════════════════════════════════════════════════════════
-- page_content (editable text blocks for marketing pages)
-- key = page slug, section = block key, value = jsonb payload
-- ════════════════════════════════════════════════════════════════════
create table if not exists page_content (
  id uuid primary key default gen_random_uuid(),
  page_key text not null,
  section_key text not null,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (page_key, section_key)
);
drop trigger if exists trg_page_content_updated on page_content;
create trigger trg_page_content_updated before update on page_content
  for each row execute function set_updated_at();

-- ════════════════════════════════════════════════════════════════════
-- site_settings (singleton row id = 1)
-- ════════════════════════════════════════════════════════════════════
create table if not exists site_settings (
  id int primary key default 1 check (id = 1),
  whatsapp_number text default '918210480043',
  phone text default '+918210480043',
  email text default 'nexusakr@gmail.com',
  address text default 'Deoghar, Jharkhand, India',
  rera_number text default '',          -- BLANK until admin adds (business rule)
  facebook_url text default '',
  instagram_url text default '',
  linkedin_url text default '',
  youtube_url text default '',
  twitter_url text default '',
  ga4_id text default '',
  gtm_id text default '',
  meta_pixel_id text default '',
  map_embed_url text default '',
  updated_at timestamptz not null default now()
);
drop trigger if exists trg_site_settings_updated on site_settings;
create trigger trg_site_settings_updated before update on site_settings
  for each row execute function set_updated_at();
insert into site_settings (id) values (1) on conflict (id) do nothing;

-- ════════════════════════════════════════════════════════════════════
-- media_assets (library metadata for uploaded files)
-- ════════════════════════════════════════════════════════════════════
create table if not exists media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket text not null,
  path text not null,
  url text not null,
  folder text default 'general',
  alt text,
  mime_type text,
  size_bytes bigint,
  uploaded_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (bucket, path)
);
create index if not exists idx_media_folder on media_assets(folder, created_at desc);

-- ════════════════════════════════════════════════════════════════════
-- newsletter_subscribers (soft conversions / lead magnets)
-- ════════════════════════════════════════════════════════════════════
create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text,
  mobile text,
  name text,
  source text,
  created_at timestamptz not null default now()
);

-- ════════════════════════════════════════════════════════════════════
-- audit_log (admin accountability)
-- ════════════════════════════════════════════════════════════════════
create table if not exists audit_log (
  id uuid primary key default gen_random_uuid(),
  actor uuid references profiles(id) on delete set null,
  action text not null,
  entity text,
  entity_id text,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists idx_audit_created on audit_log(created_at desc);

-- ════════════════════════════════════════════════════════════════════
-- Row Level Security
-- ════════════════════════════════════════════════════════════════════
alter table profiles               enable row level security;
alter table leads                  enable row level security;
alter table lead_activities        enable row level security;
alter table blog_categories        enable row level security;
alter table blog_posts             enable row level security;
alter table partners               enable row level security;
alter table ventures               enable row level security;
alter table venture_images         enable row level security;
alter table customer_programs      enable row level security;
alter table divisions              enable row level security;
alter table testimonials           enable row level security;
alter table page_content           enable row level security;
alter table site_settings          enable row level security;
alter table media_assets           enable row level security;
alter table newsletter_subscribers enable row level security;
alter table audit_log              enable row level security;

-- profiles: a user can read/update their own row; admins manage all.
drop policy if exists profiles_self_read on profiles;
create policy profiles_self_read on profiles for select
  using (id = auth.uid() or is_admin());
drop policy if exists profiles_self_update on profiles;
create policy profiles_self_update on profiles for update
  using (id = auth.uid() or is_admin()) with check (id = auth.uid() or is_admin());
drop policy if exists profiles_admin_all on profiles;
create policy profiles_admin_all on profiles for all
  using (is_admin()) with check (is_admin());

-- leads: PUBLIC may INSERT (lead capture); only staff may read/update/delete.
drop policy if exists leads_public_insert on leads;
create policy leads_public_insert on leads for insert to anon, authenticated with check (true);
drop policy if exists leads_staff_select on leads;
create policy leads_staff_select on leads for select using (is_staff());
drop policy if exists leads_staff_update on leads;
create policy leads_staff_update on leads for update using (is_staff()) with check (is_staff());
drop policy if exists leads_admin_delete on leads;
create policy leads_admin_delete on leads for delete using (is_admin());

-- lead_activities: staff only.
drop policy if exists lead_activities_staff on lead_activities;
create policy lead_activities_staff on lead_activities for all
  using (is_staff()) with check (is_staff());

-- newsletter_subscribers: public insert, staff read.
drop policy if exists news_public_insert on newsletter_subscribers;
create policy news_public_insert on newsletter_subscribers for insert to anon, authenticated with check (true);
drop policy if exists news_staff_select on newsletter_subscribers;
create policy news_staff_select on newsletter_subscribers for select using (is_staff());

-- audit_log: staff insert/read.
drop policy if exists audit_staff on audit_log;
create policy audit_staff on audit_log for all using (is_staff()) with check (is_staff());

-- ── Published-content read pattern + staff write ────────────────────
-- Macro applied per table below.

-- blog_categories: public read; staff write.
drop policy if exists blogcat_public_read on blog_categories;
create policy blogcat_public_read on blog_categories for select using (true);
drop policy if exists blogcat_staff_write on blog_categories;
create policy blogcat_staff_write on blog_categories for all using (is_staff()) with check (is_staff());

-- blog_posts: public reads published; staff full access.
drop policy if exists blog_public_read on blog_posts;
create policy blog_public_read on blog_posts for select
  using (status = 'published' or is_staff());
drop policy if exists blog_staff_write on blog_posts;
create policy blog_staff_write on blog_posts for all using (is_staff()) with check (is_staff());

-- partners: public reads published; staff full access.
drop policy if exists partners_public_read on partners;
create policy partners_public_read on partners for select
  using (status = 'published' or is_staff());
drop policy if exists partners_staff_write on partners;
create policy partners_staff_write on partners for all using (is_staff()) with check (is_staff());

-- ventures: public reads published; staff full access.
drop policy if exists ventures_public_read on ventures;
create policy ventures_public_read on ventures for select
  using (status = 'published' or is_staff());
drop policy if exists ventures_staff_write on ventures;
create policy ventures_staff_write on ventures for all using (is_staff()) with check (is_staff());

-- venture_images: public read for published parent; staff write.
drop policy if exists venture_images_public_read on venture_images;
create policy venture_images_public_read on venture_images for select
  using (
    exists (select 1 from ventures v where v.id = venture_id and (v.status = 'published' or is_staff()))
  );
drop policy if exists venture_images_staff_write on venture_images;
create policy venture_images_staff_write on venture_images for all using (is_staff()) with check (is_staff());

-- customer_programs: public reads published; staff full access.
drop policy if exists programs_public_read on customer_programs;
create policy programs_public_read on customer_programs for select
  using (status = 'published' or is_staff());
drop policy if exists programs_staff_write on customer_programs;
create policy programs_staff_write on customer_programs for all using (is_staff()) with check (is_staff());

-- divisions: public read; staff write.
drop policy if exists divisions_public_read on divisions;
create policy divisions_public_read on divisions for select using (true);
drop policy if exists divisions_staff_write on divisions;
create policy divisions_staff_write on divisions for all using (is_staff()) with check (is_staff());

-- testimonials: public reads published; staff full access.
drop policy if exists testimonials_public_read on testimonials;
create policy testimonials_public_read on testimonials for select
  using (status = 'published' or is_staff());
drop policy if exists testimonials_staff_write on testimonials;
create policy testimonials_staff_write on testimonials for all using (is_staff()) with check (is_staff());

-- page_content: public read; staff write.
drop policy if exists page_content_public_read on page_content;
create policy page_content_public_read on page_content for select using (true);
drop policy if exists page_content_staff_write on page_content;
create policy page_content_staff_write on page_content for all using (is_staff()) with check (is_staff());

-- site_settings: public read; admin write.
drop policy if exists site_settings_public_read on site_settings;
create policy site_settings_public_read on site_settings for select using (true);
drop policy if exists site_settings_admin_write on site_settings;
create policy site_settings_admin_write on site_settings for all using (is_admin()) with check (is_admin());

-- media_assets: staff read/write (URLs are public via storage buckets).
drop policy if exists media_staff on media_assets;
create policy media_staff on media_assets for all using (is_staff()) with check (is_staff());

-- ════════════════════════════════════════════════════════════════════
-- Storage buckets (public read; staff write enforced via policies)
-- ════════════════════════════════════════════════════════════════════
insert into storage.buckets (id, name, public) values
  ('media', 'media', true),
  ('blog', 'blog', true),
  ('partners', 'partners', true),
  ('ventures', 'ventures', true),
  ('brochures', 'brochures', true)
on conflict (id) do nothing;

drop policy if exists storage_public_read on storage.objects;
create policy storage_public_read on storage.objects for select
  using (bucket_id in ('media','blog','partners','ventures','brochures'));

drop policy if exists storage_staff_write on storage.objects;
create policy storage_staff_write on storage.objects for insert to authenticated
  with check (bucket_id in ('media','blog','partners','ventures','brochures') and is_staff());

drop policy if exists storage_staff_update on storage.objects;
create policy storage_staff_update on storage.objects for update to authenticated
  using (bucket_id in ('media','blog','partners','ventures','brochures') and is_staff());

drop policy if exists storage_staff_delete on storage.objects;
create policy storage_staff_delete on storage.objects for delete to authenticated
  using (bucket_id in ('media','blog','partners','ventures','brochures') and is_staff());

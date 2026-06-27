-- ════════════════════════════════════════════════════════════════════
-- AKR Nexus — CMS expansion
-- Adds: property listings (+images), team members, hero sections,
-- and two new enquiry types (property, callback).
-- Idempotent and safe to re-run. Run AFTER 0001_init.sql and 0002_seed.sql.
-- ════════════════════════════════════════════════════════════════════

-- New enquiry types for property inquiries and callback requests.
-- (PG12+ allows ADD VALUE inside a transaction as long as it isn't used in
--  the same transaction — this migration only adds the labels.)
alter type enquiry_type add value if not exists 'property';
alter type enquiry_type add value if not exists 'callback';

-- ── listings ────────────────────────────────────────────────────────
create table if not exists listings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,                       -- Markdown
  listing_type text not null default 'sale' check (listing_type in ('sale','rent')),
  property_type text not null default 'plot',  -- plot | apartment | villa | house | commercial | farmland
  price numeric,
  price_label text,                      -- e.g. "₹45 Lakh" or "Price on request"
  area_value numeric,
  area_unit text default 'sqft',         -- sqft | acre | katha | bigha
  bedrooms int,
  bathrooms int,
  location text,
  address text,
  latitude numeric,
  longitude numeric,
  amenities text[] not null default '{}',
  cover_image text,
  video_url text,
  floor_plans text[] not null default '{}',
  brochure_url text,
  is_featured boolean not null default false,
  sort_order int not null default 0,
  status publish_status not null default 'draft',
  seo_title text,
  seo_description text,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- Self-healing guards: ensure every column exists even if a previous/partial
-- run left a `listings` table without all of them. Non-destructive (existing
-- rows are preserved; columns with defaults backfill automatically).
alter table listings
  add column if not exists title text,
  add column if not exists slug text,
  add column if not exists description text,
  add column if not exists listing_type text not null default 'sale',
  add column if not exists property_type text not null default 'plot',
  add column if not exists price numeric,
  add column if not exists price_label text,
  add column if not exists area_value numeric,
  add column if not exists area_unit text default 'sqft',
  add column if not exists bedrooms int,
  add column if not exists bathrooms int,
  add column if not exists location text,
  add column if not exists address text,
  add column if not exists latitude numeric,
  add column if not exists longitude numeric,
  add column if not exists amenities text[] not null default '{}',
  add column if not exists cover_image text,
  add column if not exists video_url text,
  add column if not exists floor_plans text[] not null default '{}',
  add column if not exists brochure_url text,
  add column if not exists is_featured boolean not null default false,
  add column if not exists sort_order int not null default 0,
  add column if not exists status publish_status not null default 'draft',
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists created_by uuid references profiles(id) on delete set null,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create index if not exists idx_listings_status on listings(status);
create index if not exists idx_listings_featured on listings(is_featured);
create index if not exists idx_listings_type on listings(listing_type, property_type);
drop trigger if exists trg_listings_updated on listings;
create trigger trg_listings_updated before update on listings
  for each row execute function set_updated_at();

create table if not exists listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings(id) on delete cascade,
  image_url text not null,
  caption text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
alter table listing_images
  add column if not exists listing_id uuid references listings(id) on delete cascade,
  add column if not exists image_url text,
  add column if not exists caption text,
  add column if not exists sort_order int not null default 0,
  add column if not exists created_at timestamptz not null default now();
create index if not exists idx_listing_images on listing_images(listing_id, sort_order);

-- ── team_members ────────────────────────────────────────────────────
create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  photo_url text,
  bio text,
  email text,
  linkedin_url text,
  sort_order int not null default 0,
  status publish_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table team_members
  add column if not exists name text,
  add column if not exists role text,
  add column if not exists photo_url text,
  add column if not exists bio text,
  add column if not exists email text,
  add column if not exists linkedin_url text,
  add column if not exists sort_order int not null default 0,
  add column if not exists status publish_status not null default 'published',
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();
drop trigger if exists trg_team_updated on team_members;
create trigger trg_team_updated before update on team_members
  for each row execute function set_updated_at();

-- ── hero_sections ───────────────────────────────────────────────────
create table if not exists hero_sections (
  id uuid primary key default gen_random_uuid(),
  page_key text not null default 'home',
  heading text,
  subtitle text,
  eyebrow text,
  cta_primary_label text,
  cta_primary_href text,
  cta_secondary_label text,
  cta_secondary_href text,
  image_url text,
  video_url text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);
alter table hero_sections
  add column if not exists page_key text not null default 'home',
  add column if not exists heading text,
  add column if not exists subtitle text,
  add column if not exists eyebrow text,
  add column if not exists cta_primary_label text,
  add column if not exists cta_primary_href text,
  add column if not exists cta_secondary_label text,
  add column if not exists cta_secondary_href text,
  add column if not exists image_url text,
  add column if not exists video_url text,
  add column if not exists is_active boolean not null default true,
  add column if not exists sort_order int not null default 0,
  add column if not exists updated_at timestamptz not null default now();
create index if not exists idx_hero_page on hero_sections(page_key, is_active);
drop trigger if exists trg_hero_updated on hero_sections;
create trigger trg_hero_updated before update on hero_sections
  for each row execute function set_updated_at();

-- ── RLS ─────────────────────────────────────────────────────────────
alter table listings        enable row level security;
alter table listing_images  enable row level security;
alter table team_members    enable row level security;
alter table hero_sections   enable row level security;

drop policy if exists listings_public_read on listings;
create policy listings_public_read on listings for select
  using (status = 'published' or is_staff());
drop policy if exists listings_staff_write on listings;
create policy listings_staff_write on listings for all using (is_staff()) with check (is_staff());

drop policy if exists listing_images_public_read on listing_images;
create policy listing_images_public_read on listing_images for select
  using (
    exists (select 1 from listings l where l.id = listing_id and (l.status = 'published' or is_staff()))
  );
drop policy if exists listing_images_staff_write on listing_images;
create policy listing_images_staff_write on listing_images for all using (is_staff()) with check (is_staff());

drop policy if exists team_public_read on team_members;
create policy team_public_read on team_members for select
  using (status = 'published' or is_staff());
drop policy if exists team_staff_write on team_members;
create policy team_staff_write on team_members for all using (is_staff()) with check (is_staff());

drop policy if exists hero_public_read on hero_sections;
create policy hero_public_read on hero_sections for select using (true);
drop policy if exists hero_staff_write on hero_sections;
create policy hero_staff_write on hero_sections for all using (is_staff()) with check (is_staff());

-- ── Storage buckets ─────────────────────────────────────────────────
insert into storage.buckets (id, name, public) values
  ('listings', 'listings', true),
  ('team', 'team', true),
  ('hero', 'hero', true)
on conflict (id) do nothing;

-- Extend storage policies to the new buckets (replaces prior definitions).
drop policy if exists storage_public_read on storage.objects;
create policy storage_public_read on storage.objects for select
  using (bucket_id in ('media','blog','partners','ventures','brochures','listings','team','hero'));

drop policy if exists storage_staff_write on storage.objects;
create policy storage_staff_write on storage.objects for insert to authenticated
  with check (bucket_id in ('media','blog','partners','ventures','brochures','listings','team','hero') and is_staff());

drop policy if exists storage_staff_update on storage.objects;
create policy storage_staff_update on storage.objects for update to authenticated
  using (bucket_id in ('media','blog','partners','ventures','brochures','listings','team','hero') and is_staff());

drop policy if exists storage_staff_delete on storage.objects;
create policy storage_staff_delete on storage.objects for delete to authenticated
  using (bucket_id in ('media','blog','partners','ventures','brochures','listings','team','hero') and is_staff());

-- ── Seed: default home hero (mirrors the existing on-page copy) ──────
insert into hero_sections (page_key, eyebrow, heading, subtitle,
  cta_primary_label, cta_primary_href, cta_secondary_label, cta_secondary_href, is_active)
select 'home', 'AKR Nexus · Deoghar',
  'Your Trusted Property Partner in Deoghar',
  'From your first site visit to final possession — guided with transparency, local expertise and end-to-end accountability.',
  'Schedule Consultation', '/contact', 'Explore Ventures', '/ventures', true
where not exists (select 1 from hero_sections where page_key = 'home');

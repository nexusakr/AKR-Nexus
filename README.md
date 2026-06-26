# AKR Nexus

Premium real-estate platform for **AKR Nexus** (Deoghar) — public marketing site,
lead CRM, and a no-code admin dashboard.

- **Brand:** AKR Nexus — _Connecting Vision. Creating Value._
- **Sub-brand:** Dham Developers — _From Property to Possession._
- **Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Supabase
  (Postgres / Auth / Storage / RLS) · Resend · React Markdown.

---

## 1. Prerequisites

- Node.js 20.9+ (LTS) and npm
- A free [Supabase](https://supabase.com) project
- (Optional) a [Resend](https://resend.com) account for lead-notification emails

## 2. Install

```bash
npm install
```

## 3. Configure environment

Copy `.env.example` to `.env.local` and fill in values:

```bash
cp .env.example .env.local
```

| Variable | Where to find it |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API (**server-only**) |
| `RESEND_API_KEY`, `LEAD_NOTIFY_TO`, `LEAD_NOTIFY_FROM` | Resend dashboard |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile (optional spam protection) |
| `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_META_PIXEL_ID` | Analytics (optional) |

> The site renders fine before Supabase is configured (empty content); admin
> routes redirect to login until env is set.

## 4. Set up the database

In the Supabase **SQL Editor**, run the migrations in order:

1. `supabase/migrations/0001_init.sql` — tables, enums, RLS policies, storage buckets, triggers
2. `supabase/migrations/0002_seed.sql` — blog categories, the six customer programs, future divisions

This also creates the public storage buckets: `media`, `blog`, `partners`, `ventures`, `brochures`.

## 5. Create your first admin user

1. In Supabase → **Authentication → Users**, add a user (email + password).
   A `profiles` row is created automatically by a trigger.
2. In the **SQL Editor**, promote that user to admin:

   ```sql
   update profiles set role = 'admin'
   where email = 'you@example.com';
   ```

Roles: `admin` (full access incl. settings/deletes), `editor` (content + CRM), `viewer`.

## 6. Run

```bash
npm run dev      # development (http://localhost:3000)
npm run build    # production build
npm run start    # serve production build
```

- Public site: `/`
- Admin dashboard: `/admin` (sign in at `/admin/login`)

---

## Project structure

```
app/
  (site)/        # public pages: home, about, services, ventures, customer-programs,
                 # blog, contact, investor, partner-with-us, nri-property-care, privacy, terms
  (admin)/admin/
    login/       # public login
    (panel)/     # auth-guarded: dashboard, leads, blog, ventures, partners,
                 # programs, media, content, settings
  sitemap.ts  robots.ts
components/    ui/ · site/ · admin/ · seo/
lib/          site.ts · data.ts · auth.ts · validations.ts · email.ts · supabase/ · actions/
supabase/migrations/   SQL schema + seed
types/database.ts      Supabase types (type aliases — required by supabase-js)
proxy.ts               Next 16 middleware (session refresh + admin guard)
```

## Key features

- **10 marketing pages** + privacy/terms, SEO (metadata, dynamic sitemap/robots, JSON-LD), responsive premium design.
- **6 enquiry types** captured to Supabase via a validated Server Action with honeypot + optional Turnstile, plus Resend email alerts.
- **Lead CRM** with the 7-stage pipeline (New → Contacted → Interested → Site Visit Scheduled → Negotiation → Converted → Closed), notes & activity history.
- **No-code admin** for blog (+categories), ventures (+gallery & brochure), partners, programs, media library, page content, and site settings.
- **WhatsApp** floating button + mobile action bar + click-to-WhatsApp (`+91 82104 80043`).
- **Analytics placeholders** (GA4 / GTM / Meta Pixel) — set the `NEXT_PUBLIC_*` env vars to activate.

## Business rules honoured

Only **Dham Developers** is an active venture; Construction / Infrastructure /
Investment / PropTech show as **Coming Soon**. No fabricated projects,
testimonials, statistics, ROI, partner/bank logos or RERA number — those
sections render only once real data is added by the admin.

## Deploy

Recommended: **Vercel** (web) + Supabase cloud. Add all env vars in the Vercel
project settings. Set `NEXT_PUBLIC_SITE_URL` to your production domain so
canonical URLs and the sitemap are correct.

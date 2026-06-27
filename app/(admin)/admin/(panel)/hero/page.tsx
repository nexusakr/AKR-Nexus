import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ImageUpload } from "@/components/admin/image-upload";
import { HeroList } from "@/components/admin/hero-list";
import { saveHero } from "@/lib/actions/admin-cms";
import type { HeroSection } from "@/types/database";

const input =
  "w-full rounded-md border border-border px-3 py-2 text-sm focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200";

export default async function AdminHeroPage({
  searchParams,
}: PageProps<"/admin/hero">) {
  const sp = await searchParams;
  const editId = typeof sp.edit === "string" ? sp.edit : null;
  const supabase = await createClient();
  const { data } = await supabase.from("hero_sections").select("*").order("page_key");
  const heroes = (data as HeroSection[]) ?? [];
  const editing = editId ? heroes.find((h) => h.id === editId) ?? null : null;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="rounded-xl border border-border bg-white p-6">
        <h2 className="font-serif text-lg text-navy-900">{editing ? "Edit" : "Add"} Hero</h2>
        <form action={saveHero} className="mt-4 space-y-3" key={editing?.id || "new"}>
          {editing && <input type="hidden" name="id" value={editing.id} />}
          <input name="page_key" placeholder="Page key (e.g. home)" defaultValue={editing?.page_key || "home"} className={input} />
          <input name="eyebrow" placeholder="Eyebrow" defaultValue={editing?.eyebrow || ""} className={input} />
          <input name="heading" placeholder="Heading" defaultValue={editing?.heading || ""} className={input} />
          <textarea name="subtitle" rows={3} placeholder="Subtitle" defaultValue={editing?.subtitle || ""} className={input} />
          <div className="grid grid-cols-2 gap-2">
            <input name="cta_primary_label" placeholder="Primary CTA label" defaultValue={editing?.cta_primary_label || ""} className={input} />
            <input name="cta_primary_href" placeholder="Primary CTA link" defaultValue={editing?.cta_primary_href || ""} className={input} />
            <input name="cta_secondary_label" placeholder="Secondary CTA label" defaultValue={editing?.cta_secondary_label || ""} className={input} />
            <input name="cta_secondary_href" placeholder="Secondary CTA link" defaultValue={editing?.cta_secondary_href || ""} className={input} />
          </div>
          <input name="video_url" placeholder="Background video URL (optional)" defaultValue={editing?.video_url || ""} className={input} />
          <input name="sort_order" type="number" placeholder="Sort order" defaultValue={editing?.sort_order ?? 0} className={input} />
          <ImageUpload name="image_url" bucket="hero" defaultUrl={editing?.image_url || ""} label="Background image (optional)" />
          <label className="flex items-center gap-2 text-sm text-navy-800">
            <input type="checkbox" name="is_active" defaultChecked={editing ? editing.is_active : true} />
            Active
          </label>
          <div className="flex gap-2">
            <button className="rounded-md bg-gold-500 px-5 py-2 text-sm font-semibold text-navy-950 hover:bg-gold-600">
              {editing ? "Update" : "Add"}
            </button>
            {editing && (
              <Link href="/admin/hero" className="rounded-md border border-border px-4 py-2 text-sm text-navy-700 hover:bg-muted">
                Cancel
              </Link>
            )}
          </div>
        </form>
      </div>

      <div className="lg:col-span-2 space-y-3">
        <h1 className="font-serif text-2xl text-navy-900">Hero Sections</h1>
        <p className="text-sm text-muted-foreground">
          The active hero for <code>home</code> drives the homepage banner.
        </p>
        <HeroList heroes={heroes} />
      </div>
    </div>
  );
}

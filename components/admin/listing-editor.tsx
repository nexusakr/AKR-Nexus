"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveListing } from "@/lib/actions/admin-listings";
import { useToast } from "@/components/admin/toast";
import { ImageUpload } from "@/components/admin/image-upload";
import { FileUpload } from "@/components/admin/file-upload";
import { MultiImageField } from "@/components/admin/multi-image-field";
import { listingTypes, propertyTypes, areaUnits, commonAmenities } from "@/lib/site";
import { slugify } from "@/lib/utils";
import type { Listing } from "@/types/database";

const input =
  "w-full rounded-md border border-border px-3 py-2 text-sm focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200";

function Save({ pending }: { pending: boolean }) {
  return (
    <button
      disabled={pending}
      className="rounded-md bg-gold-500 px-6 py-2.5 text-sm font-semibold text-navy-950 hover:bg-gold-600 disabled:opacity-60"
    >
      {pending ? "Saving…" : "Save Property"}
    </button>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-navy-800">{label}</label>
      {children}
    </div>
  );
}

export function ListingEditor({ listing }: { listing: Listing | null }) {
  const [slug, setSlug] = useState(listing?.slug || "");
  const selected = new Set(listing?.amenities || []);
  const router = useRouter();
  const toast = useToast();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await saveListing(fd);
      if (res.ok) {
        toast("success", listing?.id ? "Property updated." : "Property created.");
        if (!listing?.id && res.id) router.push(`/admin/listings/${res.id}`);
        else router.refresh();
      } else {
        toast("error", res.error || "Could not save property.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
      {listing?.id && <input type="hidden" name="id" value={listing.id} />}

      <div className="space-y-4 lg:col-span-2">
        <div className="space-y-4 rounded-xl border border-border bg-white p-6">
          <Field label="Title *">
            <input
              name="title"
              required
              defaultValue={listing?.title}
              onChange={(e) => {
                if (!listing?.id) setSlug(slugify(e.target.value));
              }}
              className={input}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Slug">
              <input name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} className={input} />
            </Field>
            <Field label="Location">
              <input name="location" defaultValue={listing?.location || ""} className={input} />
            </Field>
          </div>
          <Field label="Address">
            <input name="address" defaultValue={listing?.address || ""} className={input} />
          </Field>
          <Field label="Description (Markdown)">
            <textarea name="description" rows={8} defaultValue={listing?.description || ""} className={`${input} font-mono`} />
          </Field>
        </div>

        {/* Specs */}
        <div className="space-y-4 rounded-xl border border-border bg-white p-6">
          <h2 className="font-serif text-lg text-navy-900">Details</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Listing type">
              <select name="listing_type" defaultValue={listing?.listing_type || "sale"} className={input}>
                {listingTypes.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Property type">
              <select name="property_type" defaultValue={listing?.property_type || "plot"} className={input}>
                {propertyTypes.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Price (₹, number)">
              <input name="price" type="number" step="any" defaultValue={listing?.price ?? ""} className={input} />
            </Field>
            <Field label="Price label (overrides)">
              <input name="price_label" placeholder="e.g. Price on request" defaultValue={listing?.price_label || ""} className={input} />
            </Field>
            <Field label="Area value">
              <input name="area_value" type="number" step="any" defaultValue={listing?.area_value ?? ""} className={input} />
            </Field>
            <Field label="Area unit">
              <select name="area_unit" defaultValue={listing?.area_unit || "sqft"} className={input}>
                {areaUnits.map((u) => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Bedrooms">
              <input name="bedrooms" type="number" defaultValue={listing?.bedrooms ?? ""} className={input} />
            </Field>
            <Field label="Bathrooms">
              <input name="bathrooms" type="number" defaultValue={listing?.bathrooms ?? ""} className={input} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Latitude">
              <input name="latitude" type="number" step="any" defaultValue={listing?.latitude ?? ""} className={input} />
            </Field>
            <Field label="Longitude">
              <input name="longitude" type="number" step="any" defaultValue={listing?.longitude ?? ""} className={input} />
            </Field>
          </div>
        </div>

        {/* Amenities */}
        <div className="rounded-xl border border-border bg-white p-6">
          <h2 className="font-serif text-lg text-navy-900">Amenities</h2>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {commonAmenities.map((a) => (
              <label key={a} className="flex items-center gap-2 text-sm text-navy-800">
                <input type="checkbox" name="amenities" value={a} defaultChecked={selected.has(a)} />
                {a}
              </label>
            ))}
          </div>
          <Field label="Additional amenities (comma-separated)">
            <input
              name="amenities_custom"
              defaultValue={(listing?.amenities || []).filter((a) => !commonAmenities.includes(a as (typeof commonAmenities)[number])).join(", ")}
              className={input}
            />
          </Field>
        </div>

        {/* SEO */}
        <div className="space-y-4 rounded-xl border border-border bg-white p-6">
          <h2 className="font-serif text-lg text-navy-900">SEO</h2>
          <Field label="SEO title">
            <input name="seo_title" defaultValue={listing?.seo_title || ""} className={input} />
          </Field>
          <Field label="Meta description">
            <textarea name="seo_description" rows={2} defaultValue={listing?.seo_description || ""} className={input} />
          </Field>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        <div className="space-y-4 rounded-xl border border-border bg-white p-6">
          <Field label="Status">
            <select name="status" defaultValue={listing?.status || "draft"} className={input}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </Field>
          <label className="flex items-center gap-2 text-sm text-navy-800">
            <input type="checkbox" name="is_featured" defaultChecked={listing?.is_featured} />
            Feature on homepage & top of listings
          </label>
          <ImageUpload name="cover_image" bucket="listings" defaultUrl={listing?.cover_image || ""} label="Cover image" />
          <Field label="Video URL (YouTube or MP4)">
            <input name="video_url" defaultValue={listing?.video_url || ""} className={input} />
          </Field>
          <MultiImageField name="floor_plans" bucket="listings" label="Floor plans" defaultUrls={listing?.floor_plans || []} />
          <FileUpload name="brochure_url" bucket="brochures" defaultUrl={listing?.brochure_url || ""} label="Brochure (PDF)" />
          <Save pending={isPending} />
        </div>
      </div>
    </form>
  );
}

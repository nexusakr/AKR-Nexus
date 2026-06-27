import type { Metadata } from "next";
import Link from "next/link";
import { Home as HomeIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/site/page-hero";
import { CtaBand } from "@/components/site/cta-band";
import { ListingCard } from "@/components/site/listing-card";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { getPublishedListings } from "@/lib/data";
import { listingTypes, propertyTypes } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Properties for Sale & Rent in Deoghar",
  description:
    "Browse title-verified plots, apartments, villas and commercial properties in Deoghar with AKR Nexus — transparent pricing and end-to-end support.",
  alternates: { canonical: "/listings" },
};

export const revalidate = 300;

export default async function ListingsPage({
  searchParams,
}: PageProps<"/listings">) {
  const sp = await searchParams;
  const listingType = typeof sp.type === "string" ? sp.type : undefined;
  const propertyType = typeof sp.property === "string" ? sp.property : undefined;

  const listings = await getPublishedListings({ listingType, propertyType });

  const buildHref = (params: Record<string, string | undefined>) => {
    const merged = { type: listingType, property: propertyType, ...params };
    const qs = Object.entries(merged)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}=${v}`)
      .join("&");
    return qs ? `/listings?${qs}` : "/listings";
  };

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Properties", url: "/listings" },
        ]}
      />
      <PageHero
        eyebrow="Properties"
        title="Find your place in Deoghar"
        subtitle="Title-verified plots, homes and commercial spaces — every listing explained with transparency."
      />

      <section className="py-12">
        <Container>
          {/* Filters */}
          <div className="mb-8 space-y-3">
            <div className="flex flex-wrap gap-2">
              <FilterChip label="All" href={buildHref({ type: undefined })} active={!listingType} />
              {listingTypes.map((t) => (
                <FilterChip
                  key={t.value}
                  label={t.label}
                  href={buildHref({ type: t.value })}
                  active={listingType === t.value}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <FilterChip
                label="All types"
                href={buildHref({ property: undefined })}
                active={!propertyType}
              />
              {propertyTypes.map((t) => (
                <FilterChip
                  key={t.value}
                  label={t.label}
                  href={buildHref({ property: t.value })}
                  active={propertyType === t.value}
                />
              ))}
            </div>
          </div>

          {listings.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-muted p-12 text-center">
              <HomeIcon className="mx-auto h-10 w-10 text-gold-600" />
              <h2 className="mt-3 font-serif text-xl text-navy-900">
                No properties match your filters yet
              </h2>
              <p className="mx-auto mt-2 max-w-md text-muted-foreground">
                New listings are added regularly. Tell us what you're looking for
                and we'll alert you first.
              </p>
              <Link
                href="/contact"
                className="mt-5 inline-block rounded-[var(--radius)] bg-gold-500 px-6 py-3 font-semibold text-navy-950 hover:bg-gold-600"
              >
                Register Your Requirement
              </Link>
            </div>
          )}
        </Container>
      </section>

      <CtaBand
        title="Can't find what you're looking for?"
        whatsappMessage="Hi AKR Nexus, I'm looking for a property in Deoghar."
      />
    </>
  );
}

function FilterChip({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full px-4 py-1.5 text-sm",
        active
          ? "bg-navy-900 text-white"
          : "border border-border text-navy-700 hover:bg-navy-50"
      )}
    >
      {label}
    </Link>
  );
}

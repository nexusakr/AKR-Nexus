import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, BedDouble, Bath, Maximize, Download, Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/site/page-hero";
import { Markdown } from "@/components/site/markdown";
import { LeadForm } from "@/components/site/lead-form";
import { formatPrice } from "@/components/site/listing-card";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { getListingBySlug } from "@/lib/data";
import { site } from "@/lib/site";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: PageProps<"/listings/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) return { title: "Property not found" };
  return {
    title: listing.seo_title || listing.title,
    description:
      listing.seo_description ||
      `${listing.title} in ${listing.location || "Deoghar"} — ${formatPrice(listing)}.`,
    alternates: { canonical: `/listings/${listing.slug}` },
    openGraph: {
      title: listing.title,
      description: listing.seo_description || listing.location || "",
      images: listing.cover_image ? [listing.cover_image] : undefined,
    },
  };
}

function VideoEmbed({ url }: { url: string }) {
  const yt = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/
  );
  if (yt) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-xl">
        <iframe
          src={`https://www.youtube.com/embed/${yt[1]}`}
          title="Property video"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }
  return (
    <video controls className="w-full rounded-xl" src={url}>
      Your browser does not support video.
    </video>
  );
}

export default async function ListingDetailPage({
  params,
}: PageProps<"/listings/[slug]">) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) notFound();

  const gallery = [
    ...(listing.cover_image ? [{ id: "cover", image_url: listing.cover_image, caption: null }] : []),
    ...listing.images,
  ];

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Properties", url: "/listings" },
          { name: listing.title, url: `/listings/${listing.slug}` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Residence",
            name: listing.title,
            description: listing.seo_description || listing.location,
            url: `${site.url}/listings/${listing.slug}`,
            image: listing.cover_image || undefined,
            address: {
              "@type": "PostalAddress",
              addressLocality: listing.location || site.city,
              addressRegion: site.state,
              addressCountry: "IN",
            },
          }),
        }}
      />

      <PageHero eyebrow={listing.property_type} title={listing.title} />

      <section className="py-10">
        <Container className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant={listing.listing_type === "rent" ? "default" : "gold"}>
                {listing.listing_type === "rent" ? "For Rent" : "For Sale"}
              </Badge>
              {listing.location && (
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" /> {listing.location}
                </span>
              )}
              <span className="ml-auto font-serif text-2xl font-semibold text-gold-700">
                {formatPrice(listing)}
              </span>
            </div>

            {/* Gallery */}
            {gallery.length > 0 && (
              <div className="mt-5 space-y-3">
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-navy-100">
                  <Image
                    src={gallery[0].image_url}
                    alt={listing.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width:1024px) 100vw, 66vw"
                  />
                </div>
                {gallery.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {gallery.slice(1, 9).map((img) => (
                      <div
                        key={img.id}
                        className="relative aspect-square overflow-hidden rounded-lg bg-navy-100"
                      >
                        <Image
                          src={img.image_url}
                          alt={img.caption || listing.title}
                          fill
                          className="object-cover"
                          sizes="25vw"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Key specs */}
            <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-border bg-muted p-5 sm:grid-cols-4">
              {listing.bedrooms != null && (
                <Spec icon={<BedDouble className="h-5 w-5" />} label="Bedrooms" value={String(listing.bedrooms)} />
              )}
              {listing.bathrooms != null && (
                <Spec icon={<Bath className="h-5 w-5" />} label="Bathrooms" value={String(listing.bathrooms)} />
              )}
              {listing.area_value != null && (
                <Spec
                  icon={<Maximize className="h-5 w-5" />}
                  label="Area"
                  value={`${listing.area_value} ${listing.area_unit}`}
                />
              )}
              <Spec icon={<MapPin className="h-5 w-5" />} label="Type" value={listing.property_type} />
            </div>

            {/* Description */}
            {listing.description && (
              <div className="mt-8">
                <h2 className="font-serif text-2xl text-navy-900">Overview</h2>
                <div className="mt-3">
                  <Markdown>{listing.description}</Markdown>
                </div>
              </div>
            )}

            {/* Amenities */}
            {listing.amenities.length > 0 && (
              <div className="mt-8">
                <h2 className="font-serif text-2xl text-navy-900">Amenities</h2>
                <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {listing.amenities.map((a) => (
                    <li key={a} className="flex items-center gap-2 text-navy-800">
                      <Check className="h-4 w-4 text-gold-600" /> {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Floor plans */}
            {listing.floor_plans.length > 0 && (
              <div className="mt-8">
                <h2 className="font-serif text-2xl text-navy-900">Floor Plans</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {listing.floor_plans.map((fp, i) => (
                    <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-white">
                      <Image src={fp} alt={`Floor plan ${i + 1}`} fill className="object-contain" sizes="50vw" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Video */}
            {listing.video_url && (
              <div className="mt-8">
                <h2 className="font-serif text-2xl text-navy-900">Video Tour</h2>
                <div className="mt-4">
                  <VideoEmbed url={listing.video_url} />
                </div>
              </div>
            )}

            {listing.brochure_url && (
              <a
                href={listing.brochure_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-[var(--radius)] border border-navy-900 px-5 py-3 font-medium text-navy-900 hover:bg-navy-900 hover:text-white"
              >
                <Download className="h-4 w-4" /> Download Brochure
              </a>
            )}
          </div>

          {/* Inquiry sidebar */}
          <aside>
            <div className="sticky top-24 rounded-2xl border border-border bg-muted p-6">
              <h2 className="font-serif text-xl text-navy-900">Enquire about this property</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Get pricing, documents and a site-visit slot.
              </p>
              <div className="mt-4">
                <LeadForm
                  enquiryType="property"
                  lockEnquiryType
                  compact
                  source={`listing:${listing.slug}`}
                  submitLabel="Request Details"
                />
              </div>
              <Link href="/listings" className="mt-4 inline-block text-sm text-gold-700 hover:underline">
                ← Back to all properties
              </Link>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}

function Spec({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-gold-600">{icon}</span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium capitalize text-navy-900">{value}</p>
      </div>
    </div>
  );
}

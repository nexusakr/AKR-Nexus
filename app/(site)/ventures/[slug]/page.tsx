import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/site/page-hero";
import { Markdown } from "@/components/site/markdown";
import { LeadForm } from "@/components/site/lead-form";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { getVentureBySlug } from "@/lib/data";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: PageProps<"/ventures/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const venture = await getVentureBySlug(slug);
  if (!venture) return { title: "Venture not found" };
  return {
    title: venture.title,
    description: venture.summary || `${venture.title} by Dham Developers.`,
    alternates: { canonical: `/ventures/${venture.slug}` },
  };
}

export default async function VentureDetailPage({
  params,
}: PageProps<"/ventures/[slug]">) {
  const { slug } = await params;
  const venture = await getVentureBySlug(slug);
  if (!venture) notFound();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Ventures", url: "/ventures" },
          { name: venture.title, url: `/ventures/${venture.slug}` },
        ]}
      />
      <PageHero eyebrow={venture.brand} title={venture.title} />

      <section className="py-12">
        <Container className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant={venture.venture_status}>
                {venture.venture_status.replace("_", " ")}
              </Badge>
              {venture.location && (
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" /> {venture.location}
                </span>
              )}
            </div>

            {venture.cover_image && (
              <div className="relative mt-5 aspect-[16/9] overflow-hidden rounded-xl bg-navy-100">
                <Image
                  src={venture.cover_image}
                  alt={venture.title}
                  fill
                  className="object-cover"
                  sizes="(max-width:1024px) 100vw, 66vw"
                  priority
                />
              </div>
            )}

            {venture.summary && (
              <p className="mt-6 text-lg text-navy-800">{venture.summary}</p>
            )}

            {venture.body && (
              <div className="mt-6">
                <Markdown>{venture.body}</Markdown>
              </div>
            )}

            {/* Gallery */}
            {venture.images.length > 0 && (
              <div className="mt-10">
                <h2 className="font-serif text-2xl text-navy-900">Gallery</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {venture.images.map((img) => (
                    <div
                      key={img.id}
                      className="relative aspect-[4/3] overflow-hidden rounded-xl bg-navy-100"
                    >
                      <Image
                        src={img.image_url}
                        alt={img.caption || venture.title}
                        fill
                        className="object-cover"
                        sizes="(max-width:640px) 100vw, 50vw"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {venture.brochure_url && (
              <a
                href={venture.brochure_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-[var(--radius)] border border-navy-900 px-5 py-3 font-medium text-navy-900 hover:bg-navy-900 hover:text-white"
              >
                <Download className="h-4 w-4" /> Download Brochure
              </a>
            )}
          </div>

          {/* Enquiry sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-border bg-muted p-6">
              <h2 className="font-serif text-xl text-navy-900">
                Enquire about this project
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Get pricing, availability and site-visit details.
              </p>
              <div className="mt-4">
                <LeadForm
                  enquiryType="dham"
                  lockEnquiryType
                  compact
                  source={`venture:${venture.slug}`}
                  submitLabel="Request Details"
                />
              </div>
              <Link
                href="/ventures"
                className="mt-4 inline-block text-sm text-gold-700 hover:underline"
              >
                ← Back to all ventures
              </Link>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}

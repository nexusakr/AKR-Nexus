import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Building2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { PageHero } from "@/components/site/page-hero";
import { CtaBand } from "@/components/site/cta-band";
import { Button } from "@/components/ui/button";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { getPublishedVentures, getDivisions } from "@/lib/data";
import { divisions as staticDivisions, subBrand } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ventures",
  description:
    "Dham Developers is the active development venture of AKR Nexus. Explore current and upcoming projects in Deoghar. Construction, infrastructure and investment divisions coming soon.",
  alternates: { canonical: "/ventures" },
};

// Refresh published ventures periodically (ISR).
export const revalidate = 300;

export default async function VenturesPage() {
  const [ventures, divisions] = await Promise.all([
    getPublishedVentures(),
    getDivisions(),
  ]);
  const divisionList = divisions.length ? divisions : staticDivisions;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Ventures", url: "/ventures" },
        ]}
      />
      <PageHero
        eyebrow={subBrand.name}
        title="Our Ventures"
        subtitle={`${subBrand.name} — ${subBrand.tagline} Our active development venture, with more divisions on the way.`}
      />

      {/* Dham intro */}
      <section id="dham" className="scroll-mt-24 py-16">
        <Container className="rounded-2xl bg-navy-900 p-10 text-white">
          <h2 className="font-serif text-3xl">{subBrand.name}</h2>
          <p className="mt-3 max-w-2xl text-navy-100">
            {subBrand.description} As the build-and-deliver arm of AKR Nexus,
            Dham Developers turns plans into keys — with the same transparency and
            accountability you expect at the advisory stage.
          </p>
        </Container>
      </section>

      {/* Projects */}
      <section id="projects" className="scroll-mt-24 pb-16">
        <Container>
          <SectionHeading eyebrow="Projects" title="Current & Upcoming" />
          {ventures.length > 0 ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {ventures.map((v) => (
                <Link
                  key={v.id}
                  href={`/ventures/${v.slug}`}
                  className="group overflow-hidden rounded-xl border border-border bg-white transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] bg-navy-100">
                    {v.cover_image && (
                      <Image
                        src={v.cover_image}
                        alt={v.title}
                        fill
                        className="object-cover"
                        sizes="(max-width:768px) 100vw, 33vw"
                      />
                    )}
                    <span className="absolute left-3 top-3">
                      <Badge variant={v.venture_status}>
                        {v.venture_status.replace("_", " ")}
                      </Badge>
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-lg text-navy-900">{v.title}</h3>
                    {v.location && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {v.location}
                      </p>
                    )}
                    {v.summary && (
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {v.summary}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-2xl border border-dashed border-border bg-muted p-10 text-center">
              <Building2 className="mx-auto h-10 w-10 text-gold-600" />
              <h3 className="mt-3 font-serif text-xl text-navy-900">
                Projects launching soon
              </h3>
              <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
                Dham Developers projects will be published here as they are
                announced. Register your interest to hear first.
              </p>
              <Button href="/contact" className="mt-5">
                Register Interest
              </Button>
            </div>
          )}
        </Container>
      </section>

      {/* Future divisions — coming soon */}
      <section className="bg-muted py-16">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="On the Roadmap"
            title="Future Divisions"
            subtitle="As AKR Nexus grows from advisory into integrated development, these divisions will come online in a gated, trust-first sequence."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {divisionList.map((d) => (
              <div
                key={d.slug}
                id={d.slug}
                className="scroll-mt-24 rounded-xl border border-border bg-white p-6"
              >
                <Badge variant="soon">Coming Soon</Badge>
                <h3 className="mt-3 font-serif text-lg text-navy-900">
                  {d.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{d.summary}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand
        title="Interested in a Dham Developers project?"
        whatsappMessage="Hi AKR Nexus, I'd like details on Dham Developers projects."
      />
    </>
  );
}

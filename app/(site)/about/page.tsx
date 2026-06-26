import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { PageHero } from "@/components/site/page-hero";
import { CtaBand } from "@/components/site/cta-band";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { site, subBrand } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "AKR Nexus is a Deoghar-based real estate advisory, brokerage and developer-partnership company. Learn our story, values and the Dham Developers vision.",
  alternates: { canonical: "/about" },
};

const values = [
  { name: "Trust (Aastha)", text: "We protect the customer's money and faith as if it were our own — verified titles, clear pricing, no hidden costs." },
  { name: "Transparency", text: "Full disclosure on documents, fees, risks and timelines, in language the customer understands." },
  { name: "Competence (Kshamta)", text: "Professional, well-trained teams who know the market, the law and the build process." },
  { name: "Relationships (Rishta)", text: "We measure success in lifelong relationships and referrals, not one-time transactions." },
  { name: "Accountability", text: "We own the outcome from first visit to final possession — and beyond, through after-sales care." },
  { name: "Community & Dignity", text: "Every home and project should raise the dignity and quality of life of the people we serve." },
];

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "About Us", url: "/about" },
        ]}
      />
      <PageHero
        eyebrow="About AKR Nexus"
        title="A property partner you can trust — from vision to value."
        subtitle={`AKR — ${site.akrFullForm}. In the language of the region, ${site.akrHindiForm}.`}
      />

      <section className="py-16">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Our Story" title="Born from a simple promise" />
            <div className="mt-4 space-y-4 text-muted-foreground">
              <p>
                Deoghar is a city of faith. Yet for families who live here — and
                the many who dream of owning a home near this sacred city — the
                path to property has long meant confusing paperwork, unclear
                titles and brokers who vanish once the commission is paid.
              </p>
              <p>
                {site.name} was founded to change that: treat every buyer's money
                and trust as if it were our own family's, and stay accountable
                from the first conversation to the day the keys change hands.
              </p>
              <p>
                What began as honest brokerage and consultancy grew into
                end-to-end property assistance and developer partnerships. Now,
                through {subBrand.name}, we are moving “{subBrand.tagline}” —
                building the homes and projects we once only helped people find.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-muted p-8">
            <h3 className="font-serif text-xl text-navy-900">Mission</h3>
            <p className="mt-2 text-muted-foreground">
              To make property ownership simple, transparent and secure for every
              family and investor we serve — guiding them from aspiration to
              possession with honest advice and dependable delivery.
            </p>
            <h3 className="mt-6 font-serif text-xl text-navy-900">Vision</h3>
            <p className="mt-2 text-muted-foreground">
              To become Eastern India's most trusted name in real estate and
              integrated development — building homes, smart townships and
              infrastructure for dignified, well-planned living.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-muted py-16">
        <Container>
          <SectionHeading align="center" eyebrow="What We Stand For" title="Our Core Values" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v) => (
              <div key={v.name} className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="font-serif text-lg text-navy-900">{v.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container className="rounded-2xl bg-navy-900 p-10 text-center text-white">
          <h2 className="font-serif text-2xl">{subBrand.name}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-navy-100">
            The development arm of AKR Nexus — designing, building and delivering
            homes and projects in the Deoghar region. {subBrand.tagline}
          </p>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}

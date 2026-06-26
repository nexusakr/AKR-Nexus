import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { PageHero } from "@/components/site/page-hero";
import { CtaBand } from "@/components/site/cta-band";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { services } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Real estate brokerage, property consultancy, end-to-end assistance, developer partnerships and NRI services in Deoghar — from AKR Nexus.",
  alternates: { canonical: "/services" },
};

const details: Record<string, string[]> = {
  brokerage: [
    "Curated, title-verified listings of land, homes and commercial property",
    "Honest price guidance and negotiation support",
    "Site visits coordinated around your schedule",
  ],
  consultancy: [
    "Location and pricing advisory backed by local data",
    "Legal due-diligence and investment-suitability assessment",
    "Independent, fee-based advice — even when it costs us a sale",
  ],
  "end-to-end-assistance": [
    "Title checks and documentation",
    "Registration and home-loan facilitation",
    "Possession and after-sales support",
  ],
  "developer-partnerships": [
    "Structured marketing and sales for developer inventory",
    "Vetted projects only — we protect our customers' trust",
    "Transparent, documented arrangements",
  ],
  "nri-services": [
    "Remote, fully-managed buying with virtual tours",
    "End-to-end legal, registration and documentation",
    "Ongoing property upkeep, monitoring and reporting",
  ],
};

export default function ServicesPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
        ]}
      />
      <PageHero
        eyebrow="What We Do"
        title="End-to-end property services"
        subtitle="From first advice to final possession — one accountable partner across the whole journey."
      />

      <section className="py-16">
        <Container className="space-y-12">
          {services.map((s, i) => (
            <div
              key={s.slug}
              id={s.slug}
              className="grid scroll-mt-24 gap-6 rounded-2xl border border-border p-8 lg:grid-cols-3"
            >
              <div className="lg:col-span-1">
                <span className="font-serif text-3xl text-gold-600">
                  0{i + 1}
                </span>
                <h2 className="mt-2 font-serif text-2xl text-navy-900">
                  {s.title}
                </h2>
                <p className="mt-2 text-muted-foreground">{s.summary}</p>
              </div>
              <ul className="space-y-3 lg:col-span-2">
                {(details[s.slug] || []).map((d) => (
                  <li key={d} className="flex gap-3 text-navy-800">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Container>
      </section>

      <section className="bg-muted py-12">
        <Container className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div>
            <SectionHeading
              title="Looking for a program tailored to you?"
              subtitle="Explore our six customer programs for women, teachers, defence personnel, doctors, NRIs and first-time buyers."
            />
          </div>
          <Link
            href="/customer-programs"
            className="shrink-0 rounded-[var(--radius)] bg-gold-500 px-6 py-3 font-semibold text-navy-950 hover:bg-gold-600"
          >
            View Customer Programs
          </Link>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}

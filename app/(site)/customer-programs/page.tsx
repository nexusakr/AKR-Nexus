import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/site/page-hero";
import { CtaBand } from "@/components/site/cta-band";
import { LeadForm } from "@/components/site/lead-form";
import { SectionHeading } from "@/components/ui/section-heading";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { getPrograms } from "@/lib/data";
import { customerPrograms as staticPrograms } from "@/lib/site";

export const metadata: Metadata = {
  title: "Customer Programs",
  description:
    "Six signature AKR Nexus programs for women, teachers, defence personnel, doctors, NRIs and first-time buyers — preferential terms and dedicated guidance.",
  alternates: { canonical: "/customer-programs" },
};

export const revalidate = 600;

export default async function CustomerProgramsPage() {
  const programs = await getPrograms();
  const list = programs.length ? programs : staticPrograms;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Customer Programs", url: "/customer-programs" },
        ]}
      />
      <PageHero
        eyebrow="For People Like You"
        title="Customer Programs"
        subtitle="Each program combines preferential terms, dedicated guidance and trust-building safeguards tailored to a segment's real concerns."
      />

      <section className="py-16">
        <Container className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <div
              key={p.slug}
              id={p.slug}
              className="scroll-mt-24 rounded-xl border border-border bg-white p-6 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">
                {p.segment}
              </p>
              <h2 className="mt-1 font-serif text-xl text-navy-900">{p.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{p.summary}</p>
            </div>
          ))}
        </Container>
      </section>

      <section className="bg-muted py-16">
        <Container className="grid items-start gap-10 lg:grid-cols-2">
          <SectionHeading
            eyebrow="See If You Qualify"
            title="Tell us which program fits you"
            subtitle="Share your details and the segment you belong to — we'll guide you through the benefits and next steps."
          />
          <div className="rounded-2xl border border-border bg-white p-6">
            <LeadForm
              enquiryType="consultation"
              lockEnquiryType
              source="customer-programs"
              submitLabel="Check Eligibility"
            />
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}

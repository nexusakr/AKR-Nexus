import type { Metadata } from "next";
import { Building, Landmark, Scale, Users } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { LeadForm } from "@/components/site/lead-form";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Partner With Us",
  description:
    "Collaborate with AKR Nexus — landowners, developers, banks and legal associates. Explore developer partnerships and associations in Deoghar.",
  alternates: { canonical: "/partner-with-us" },
};

const partnerTypes = [
  { icon: Building, title: "Developers", text: "Market and sell your inventory through a trust-first, transparent partner." },
  { icon: Users, title: "Landowners", text: "Unlock value from your land with structured, accountable arrangements." },
  { icon: Landmark, title: "Banks & Lenders", text: "Reach qualified, document-ready buyers for home-loan products." },
  { icon: Scale, title: "Legal & Registration", text: "Support our customers' due-diligence and registration journeys." },
];

export default function PartnerPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Partner With Us", url: "/partner-with-us" },
        ]}
      />
      <PageHero
        eyebrow="Collaborate"
        title="Partner With AKR Nexus"
        subtitle="We build long-term, transparent relationships with developers, landowners, banks and professional associates across the Deoghar region."
      />

      <section className="py-16">
        <Container className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {partnerTypes.map((p) => (
            <div key={p.title} className="rounded-xl border border-border bg-white p-6">
              <p.icon className="h-8 w-8 text-gold-600" />
              <h3 className="mt-3 font-serif text-lg text-navy-900">{p.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.text}</p>
            </div>
          ))}
        </Container>
      </section>

      <section className="bg-muted py-16">
        <Container className="grid items-start gap-10 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Partner Enquiry"
            title="Tell us about your proposal"
            subtitle="Share your organisation, location and the nature of the collaboration. Our business-development team will be in touch."
          />
          <div className="rounded-2xl border border-border bg-white p-6">
            <LeadForm
              enquiryType="partner"
              lockEnquiryType
              source="partner-page"
              submitLabel="Submit Partner Enquiry"
            />
          </div>
        </Container>
      </section>
    </>
  );
}

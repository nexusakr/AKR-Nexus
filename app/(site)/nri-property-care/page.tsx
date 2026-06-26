import type { Metadata } from "next";
import { Plane, Video, FileText, Eye } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { LeadForm } from "@/components/site/lead-form";
import { CtaBand } from "@/components/site/cta-band";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "NRI Property Care",
  description:
    "Remote, trustworthy property buying and ongoing care for NRIs in Deoghar — virtual tours, end-to-end legal and registration, upkeep and reporting.",
  alternates: { canonical: "/nri-property-care" },
};

const features = [
  { icon: Video, title: "Virtual Tours", text: "Inspect properties remotely with guided video walkthroughs." },
  { icon: FileText, title: "End-to-End Legal", text: "Documentation, registration and title verification handled for you." },
  { icon: Eye, title: "Upkeep & Monitoring", text: "Ongoing property care, monitoring and periodic reporting from afar." },
  { icon: Plane, title: "Visit-Ready", text: "We coordinate everything so your trips home are productive, not stressful." },
];

export default function NriPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "NRI Property Care", url: "/nri-property-care" },
        ]}
      />
      <PageHero
        eyebrow="NRI Property Care"
        title="Buy and manage Deoghar property — from anywhere"
        subtitle="Our NRI Property Care Program lets you buy, own and maintain property in Deoghar with complete transparency, without being physically present."
      />

      <section className="py-16">
        <Container className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-border bg-white p-6">
              <f.icon className="h-8 w-8 text-gold-600" />
              <h3 className="mt-3 font-serif text-lg text-navy-900">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </Container>
      </section>

      <section className="bg-muted py-16">
        <Container className="grid items-start gap-10 lg:grid-cols-2">
          <SectionHeading
            eyebrow="NRI Enquiry"
            title="Start your remote property journey"
            subtitle="Tell us your time zone and what you're looking for. We'll arrange a convenient call and a tailored plan."
          />
          <div className="rounded-2xl border border-border bg-white p-6">
            <LeadForm
              enquiryType="nri"
              lockEnquiryType
              source="nri-page"
              submitLabel="Submit NRI Enquiry"
            />
          </div>
        </Container>
      </section>

      <CtaBand
        title="Questions about buying from abroad?"
        whatsappMessage="Hi AKR Nexus, I'm an NRI interested in property care."
      />
    </>
  );
}

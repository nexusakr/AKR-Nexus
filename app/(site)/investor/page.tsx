import type { Metadata } from "next";
import { TrendingUp, ShieldCheck, Map, FileSearch } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { LeadForm } from "@/components/site/lead-form";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Investor",
  description:
    "Data-led property investment advisory in Deoghar from AKR Nexus — vetted opportunities, growth corridors and transparent governance.",
  alternates: { canonical: "/investor" },
};

const points = [
  { icon: FileSearch, title: "Vetted Opportunities", text: "We surface only title-verified, due-diligenced opportunities — no surprises." },
  { icon: Map, title: "Growth Corridors", text: "Local mastery of Deoghar's emerging neighbourhoods and demand drivers." },
  { icon: ShieldCheck, title: "Transparent Governance", text: "Clear documentation and honest risk disclosure on every recommendation." },
  { icon: TrendingUp, title: "End-to-End", text: "From acquisition through to property management — one accountable partner." },
];

export default function InvestorPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Investor", url: "/investor" },
        ]}
      />
      <PageHero
        eyebrow="For Investors"
        title="Invest in Deoghar — with data, not guesswork"
        subtitle="AKR Nexus offers data-led advisory and vetted opportunities. We share what we genuinely know — and never publish returns we cannot stand behind."
      />

      <section className="py-16">
        <Container className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((p) => (
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
            eyebrow="Investor Enquiry"
            title="Speak with a senior advisor"
            subtitle="Tell us your investment goals and we'll route you to senior advisory. No fabricated projections — just an honest, data-grounded conversation."
          />
          <div className="rounded-2xl border border-border bg-white p-6">
            <LeadForm
              enquiryType="investor"
              lockEnquiryType
              source="investor-page"
              submitLabel="Submit Investor Enquiry"
            />
          </div>
        </Container>
      </section>
    </>
  );
}

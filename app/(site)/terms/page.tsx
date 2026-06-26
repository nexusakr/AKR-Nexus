import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/site/page-hero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms governing your use of the AKR Nexus website.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <PageHero title="Terms of Use" />
      <section className="py-12">
        <Container className="prose-akr max-w-3xl text-navy-800">
          <p>
            By using this website you agree to these terms. The content here is
            provided for general information about AKR Nexus and its services.
          </p>
          <h2>No offer or guarantee</h2>
          <p>
            Information on this site does not constitute a financial, legal or
            investment offer. Property availability, pricing and project details
            are subject to change and confirmation. We do not publish guaranteed
            returns.
          </p>
          <h2>Enquiries</h2>
          <p>
            Submitting an enquiry authorises AKR Nexus to contact you regarding
            your request. Please provide accurate information.
          </p>
          <h2>Intellectual property</h2>
          <p>
            The AKR Nexus and Dham Developers names, logos and content are the
            property of AKR Nexus and may not be used without permission.
          </p>
          <h2>Contact</h2>
          <p>
            Questions about these terms? Email{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>
        </Container>
      </section>
    </>
  );
}

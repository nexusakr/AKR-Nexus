import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/site/page-hero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How AKR Nexus collects, uses and protects your information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero title="Privacy Policy" />
      <section className="py-12">
        <Container className="prose-akr max-w-3xl text-navy-800">
          <p>
            AKR Nexus respects your privacy. This policy explains what
            information we collect through this website and how we use it.
          </p>
          <h2>Information we collect</h2>
          <p>
            When you submit an enquiry or subscribe, we collect the details you
            provide — such as your name, mobile number, email, city and message —
            to respond to you and assist with your property needs.
          </p>
          <h2>How we use it</h2>
          <p>
            Your information is used solely to contact you, provide advisory and
            services, and share relevant updates if you opt in. We do not sell
            your data to third parties.
          </p>
          <h2>Data storage</h2>
          <p>
            Enquiries are stored securely in our customer management system with
            access restricted to authorised AKR Nexus staff.
          </p>
          <h2>Your choices</h2>
          <p>
            You may request access to, correction of, or deletion of your data
            at any time by contacting us at{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>
          <h2>Contact</h2>
          <p>
            {site.name}, {site.address}. Phone: {site.phoneDisplay}. Email:{" "}
            {site.email}.
          </p>
        </Container>
      </section>
    </>
  );
}

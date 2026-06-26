import type { Metadata } from "next";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/site/page-hero";
import { LeadForm } from "@/components/site/lead-form";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { getSiteSettings } from "@/lib/data";
import { site, telUrl, whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact AKR Nexus in Deoghar — schedule a consultation, call, email or message us on WhatsApp. We respond promptly.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const mapUrl = settings?.map_embed_url?.trim();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Contact Us", url: "/contact" },
        ]}
      />
      <PageHero
        eyebrow="Get in Touch"
        title="Let's start your property journey"
        subtitle="Tell us what you're looking for and an advisor will reach out. Prefer to talk now? Call or WhatsApp us."
      />

      <section className="py-16">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-2xl text-navy-900">Send an enquiry</h2>
            <p className="mt-1 text-muted-foreground">
              All enquiries are saved securely and routed to the right advisor.
            </p>
            <div className="mt-6">
              <LeadForm source="contact-page" submitLabel="Schedule Consultation" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-border p-6">
              <h3 className="font-serif text-lg text-navy-900">Reach us directly</h3>
              <ul className="mt-4 space-y-3 text-navy-800">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-gold-600" />
                  {settings?.address || site.address}
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gold-600" />
                  <a href={telUrl()} className="hover:text-gold-700">
                    {site.phoneDisplay}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gold-600" />
                  <a href={`mailto:${site.email}`} className="hover:text-gold-700">
                    {site.email}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <MessageCircle className="h-5 w-5 text-[#25D366]" />
                  <a
                    href={whatsappUrl("Hi AKR Nexus, I'd like to talk to an advisor.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gold-700"
                  >
                    WhatsApp us
                  </a>
                </li>
              </ul>
            </div>

            <div className="overflow-hidden rounded-xl border border-border">
              {mapUrl ? (
                <iframe
                  src={mapUrl}
                  title="AKR Nexus location"
                  className="h-72 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <iframe
                  title="Deoghar map"
                  className="h-72 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps?q=Deoghar,Jharkhand&output=embed"
                />
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

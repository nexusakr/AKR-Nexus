import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { whatsappUrl } from "@/lib/site";

/** Closing conversion band reused across pages (blueprint CTA strategy). */
export function CtaBand({
  title = "Ready to find your place in Deoghar?",
  subtitle = "Schedule a no-obligation consultation with an AKR Nexus advisor — or message us on WhatsApp.",
  whatsappMessage = "Hi AKR Nexus, I'd like to schedule a consultation.",
}: {
  title?: string;
  subtitle?: string;
  whatsappMessage?: string;
}) {
  return (
    <section className="bg-navy-900">
      <Container className="flex flex-col items-center gap-6 py-14 text-center">
        <div className="max-w-2xl">
          <h2 className="font-serif text-3xl text-white sm:text-4xl">{title}</h2>
          <p className="mt-3 text-navy-100">{subtitle}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="/contact" size="lg">
            Schedule Consultation
          </Button>
          <Button
            href={whatsappUrl(whatsappMessage)}
            variant="outlineLight"
            size="lg"
            target="_blank"
            rel="noopener noreferrer"
          >
            Chat on WhatsApp
          </Button>
        </div>
      </Container>
    </section>
  );
}

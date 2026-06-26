import { MessageCircle, Phone, CalendarCheck } from "lucide-react";
import { telUrl, whatsappUrl } from "@/lib/site";

/** Floating WhatsApp button (desktop + mobile, bottom-right). */
export function FloatingWhatsApp() {
  return (
    <a
      href={whatsappUrl("Hi AKR Nexus, I'd like to talk to an advisor.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-20 right-4 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 md:bottom-6"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}

/** Fixed bottom action bar for mobile: Call · WhatsApp · Schedule. */
export function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-border bg-white md:hidden">
      <a
        href={telUrl()}
        className="flex flex-col items-center justify-center gap-0.5 py-2.5 text-xs font-medium text-navy-800"
      >
        <Phone className="h-5 w-5" />
        Call
      </a>
      <a
        href={whatsappUrl("Hi AKR Nexus, I'd like to talk to an advisor.")}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center gap-0.5 bg-[#25D366] py-2.5 text-xs font-semibold text-white"
      >
        <MessageCircle className="h-5 w-5" />
        WhatsApp
      </a>
      <a
        href="/contact"
        className="flex flex-col items-center justify-center gap-0.5 bg-gold-500 py-2.5 text-xs font-semibold text-navy-950"
      >
        <CalendarCheck className="h-5 w-5" />
        Schedule
      </a>
    </div>
  );
}

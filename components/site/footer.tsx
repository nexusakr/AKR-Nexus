import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/site/logo";
import { NewsletterForm } from "@/components/site/newsletter-form";
import {
  mainNav,
  segmentNav,
  services,
  site,
  subBrand,
  telUrl,
  whatsappUrl,
} from "@/lib/site";
import type { SiteSettings } from "@/types/database";

export function Footer({ settings }: { settings: SiteSettings | null }) {
  const rera = settings?.rera_number?.trim();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-navy-950 text-navy-100">
      <Container className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <Logo light />
          <p className="mt-4 text-sm leading-relaxed text-navy-200">
            {site.tagline}
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-gold-300">
            AKR — {site.akrFullForm}
          </p>
          <p className="mt-4 text-sm text-navy-300">
            {subBrand.name} — <span className="italic">{subBrand.tagline}</span>
          </p>
        </div>

        {/* Explore */}
        <div>
          <h3 className="font-serif text-base text-white">Explore</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-navy-200 hover:text-gold-300">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services & Programs */}
        <div>
          <h3 className="font-serif text-base text-white">Services & Programs</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {services.slice(0, 4).map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services#${s.slug}`}
                  className="text-navy-200 hover:text-gold-300"
                >
                  {s.title}
                </Link>
              </li>
            ))}
            {segmentNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-navy-200 hover:text-gold-300">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-serif text-base text-white">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-gold-300" />
              <span>{settings?.address || site.address}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gold-300" />
              <a href={telUrl()} className="hover:text-gold-300">
                {site.phoneDisplay}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gold-300" />
              <a href={`mailto:${site.email}`} className="hover:text-gold-300">
                {site.email}
              </a>
            </li>
            <li>
              <a
                href={whatsappUrl("Hi AKR Nexus, I'd like to talk to an advisor.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-md bg-gold-500 px-4 py-2 text-sm font-semibold text-navy-950 hover:bg-gold-600"
              >
                Chat on WhatsApp
              </a>
            </li>
          </ul>
          <div className="mt-6">
            <p className="text-xs text-navy-300">Get our Deoghar market insights</p>
            <NewsletterForm />
          </div>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-3 py-5 text-xs text-navy-300 sm:flex-row">
          <p>
            © {year} {site.name}. All rights reserved.
            {rera ? ` · RERA: ${rera}` : ""}
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-gold-300">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gold-300">
              Terms
            </Link>
            <Link href="/sitemap.xml" className="hover:text-gold-300">
              Sitemap
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}

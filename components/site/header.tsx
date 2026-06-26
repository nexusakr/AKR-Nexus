"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { mainNav, segmentNav, site, telUrl, whatsappUrl } from "@/lib/site";

const servicesMenu = [
  { label: "Brokerage", href: "/services#brokerage" },
  { label: "Property Consultancy", href: "/services#consultancy" },
  { label: "End-to-End Assistance", href: "/services#end-to-end-assistance" },
  { label: "Developer Partnerships", href: "/services#developer-partnerships" },
  { label: "NRI Services", href: "/nri-property-care" },
  { label: "Customer Programs", href: "/customer-programs" },
];

const venturesMenu = [
  { label: "Dham Developers", href: "/ventures#dham" },
  { label: "Projects", href: "/ventures#projects" },
  { label: "Construction (Coming Soon)", href: "/ventures#construction" },
  { label: "Infrastructure (Coming Soon)", href: "/ventures#infrastructure" },
  { label: "Investments (Coming Soon)", href: "/investor" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Utility strip */}
      <div className="hidden bg-navy-950 text-navy-100 md:block">
        <Container className="flex h-9 items-center justify-between text-xs">
          <span>{site.address}</span>
          <div className="flex items-center gap-4">
            <a href={telUrl()} className="hover:text-white">
              {site.phoneDisplay}
            </a>
            <a href={`mailto:${site.email}`} className="hover:text-white">
              {site.email}
            </a>
            <a
              href={whatsappUrl("Hi AKR Nexus, I'd like to know more.")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-300 hover:text-gold-200"
            >
              WhatsApp
            </a>
          </div>
        </Container>
      </div>

      {/* Main bar */}
      <div className="border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <Container className="flex h-16 items-center justify-between">
          <Logo />

          <nav className="hidden items-center gap-1 lg:flex">
            {mainNav.map((item) => {
              const hasMenu =
                item.label === "Services" || item.label === "Ventures";
              const menu =
                item.label === "Services"
                  ? servicesMenu
                  : item.label === "Ventures"
                    ? venturesMenu
                    : null;
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              if (hasMenu && menu) {
                return (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => setOpenMenu(item.label)}
                    onMouseLeave={() => setOpenMenu(null)}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "text-gold-700"
                          : "text-navy-800 hover:text-gold-700"
                      )}
                    >
                      {item.label}
                      <ChevronDown className="h-3.5 w-3.5" />
                    </Link>
                    {openMenu === item.label && (
                      <div className="absolute left-0 top-full w-64 rounded-[var(--radius)] border border-border bg-white p-2 shadow-lg">
                        {menu.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className="block rounded-md px-3 py-2 text-sm text-navy-700 hover:bg-navy-50 hover:text-gold-700"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active ? "text-gold-700" : "text-navy-800 hover:text-gold-700"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={telUrl()}
              className="flex items-center gap-1.5 text-sm font-medium text-navy-800 hover:text-gold-700"
            >
              <Phone className="h-4 w-4" />
              {site.phoneDisplay}
            </a>
            <Button href="/contact" size="sm">
              Schedule Consultation
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-navy-900 lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </Container>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="border-b border-border bg-white lg:hidden">
          <Container className="flex flex-col py-3">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-2 py-3 text-base font-medium text-navy-800 hover:bg-navy-50"
              >
                {item.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-border" />
            {segmentNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-2 py-3 text-sm text-navy-700 hover:bg-navy-50"
              >
                {item.label}
              </Link>
            ))}
            <Button href="/contact" className="mt-3 w-full">
              Schedule Consultation
            </Button>
          </Container>
        </div>
      )}
    </header>
  );
}

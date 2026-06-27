"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Building2,
  Home,
  Handshake,
  Sparkles,
  Image as ImageIcon,
  FileEdit,
  Quote,
  UserSquare2,
  GalleryHorizontalEnd,
  Settings,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Leads (CRM)", href: "/admin/leads", icon: Users },
  { label: "Properties", href: "/admin/listings", icon: Home },
  { label: "Ventures", href: "/admin/ventures", icon: Building2 },
  { label: "Blog", href: "/admin/blog", icon: FileText },
  { label: "Partners", href: "/admin/partners", icon: Handshake },
  { label: "Programs", href: "/admin/programs", icon: Sparkles },
  { label: "Testimonials", href: "/admin/testimonials", icon: Quote },
  { label: "Team", href: "/admin/team", icon: UserSquare2 },
  { label: "Hero Sections", href: "/admin/hero", icon: GalleryHorizontalEnd },
  { label: "Media", href: "/admin/media", icon: ImageIcon },
  { label: "Content", href: "/admin/content", icon: FileEdit },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1 p-3">
      {nav.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-gold-500 text-navy-950"
                : "text-navy-100 hover:bg-navy-800"
            )}
          >
            <item.icon className="h-4.5 w-4.5" />
            {item.label}
          </Link>
        );
      })}
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-navy-300 hover:bg-navy-800"
      >
        <ExternalLink className="h-4.5 w-4.5" />
        View Website
      </a>
    </nav>
  );
}

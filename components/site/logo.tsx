import Link from "next/link";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

/**
 * Wordmark logo for AKR Nexus.
 * (Swap for an <Image> once a logo file is uploaded by the admin.)
 */
export function Logo({
  light = false,
  withTagline = false,
  className,
}: {
  light?: boolean;
  withTagline?: boolean;
  className?: string;
}) {
  return (
    <Link href="/" className={cn("group inline-flex flex-col leading-none", className)}>
      <span className="flex items-baseline gap-1.5">
        <span
          className={cn(
            "font-serif text-2xl font-bold tracking-tight",
            light ? "text-white" : "text-navy-900"
          )}
        >
          AKR
        </span>
        <span
          className={cn(
            "font-serif text-2xl font-semibold tracking-tight",
            light ? "text-gold-300" : "text-gold-600"
          )}
        >
          Nexus
        </span>
      </span>
      {withTagline && (
        <span
          className={cn(
            "mt-1 text-[10px] uppercase tracking-[0.2em]",
            light ? "text-navy-100" : "text-muted-foreground"
          )}
        >
          {site.tagline}
        </span>
      )}
    </Link>
  );
}

import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  default: "bg-navy-100 text-navy-800",
  gold: "bg-gold-100 text-gold-800",
  soon: "bg-muted text-muted-foreground border border-border",
  ongoing: "bg-green-100 text-green-800",
  upcoming: "bg-gold-100 text-gold-800",
  completed: "bg-navy-100 text-navy-800",
  coming_soon: "bg-muted text-muted-foreground border border-border",
};

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: keyof typeof styles;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        styles[variant] ?? styles.default,
        className
      )}
    >
      {children}
    </span>
  );
}

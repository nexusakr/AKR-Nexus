import { Container } from "@/components/ui/container";

/** Compact hero band for inner pages. */
export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-navy-950">
      <div
        aria-hidden
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 85% 0%, #c5a047 0, transparent 40%)",
        }}
      />
      <Container className="relative py-16 sm:py-20">
        {eyebrow && (
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-gold-300">
            {eyebrow}
          </p>
        )}
        <h1 className="max-w-3xl font-serif text-4xl text-white sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-lg text-navy-100">{subtitle}</p>
        )}
      </Container>
    </section>
  );
}

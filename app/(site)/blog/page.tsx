import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/site/page-hero";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { getCategories, getPublishedPosts } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog & Insights",
  description:
    "Property buying guides, investment insights, Deoghar real estate, legal and NRI guides — practical knowledge from AKR Nexus.",
  alternates: { canonical: "/blog" },
};

export const revalidate = 300;

export default async function BlogPage({
  searchParams,
}: PageProps<"/blog">) {
  const sp = await searchParams;
  const activeCategory = typeof sp.category === "string" ? sp.category : null;

  const [categories, posts] = await Promise.all([
    getCategories(),
    getPublishedPosts(),
  ]);

  const filtered = activeCategory
    ? posts.filter((p) => {
        const cat = categories.find((c) => c.slug === activeCategory);
        return cat && p.category_id === cat.id;
      })
    : posts;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
        ]}
      />
      <PageHero
        eyebrow="Insights"
        title="AKR Nexus Blog"
        subtitle="Awareness, education and trust — knowledge to help you transact safely in Deoghar."
      />

      <section className="py-12">
        <Container>
          {/* Category filter */}
          {categories.length > 0 && (
            <div className="mb-10 flex flex-wrap gap-2">
              <Link
                href="/blog"
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm",
                  !activeCategory
                    ? "bg-navy-900 text-white"
                    : "border border-border text-navy-700 hover:bg-navy-50"
                )}
              >
                All
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/blog?category=${c.slug}`}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm",
                    activeCategory === c.slug
                      ? "bg-navy-900 text-white"
                      : "border border-border text-navy-700 hover:bg-navy-50"
                  )}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          )}

          {filtered.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group overflow-hidden rounded-xl border border-border bg-white transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-[16/9] bg-navy-100">
                    {post.cover_image && (
                      <Image
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width:768px) 100vw, 33vw"
                      />
                    )}
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-muted-foreground">
                      {formatDate(post.published_at)}
                    </p>
                    <h2 className="mt-1 font-serif text-lg text-navy-900">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-muted p-12 text-center">
              <h2 className="font-serif text-xl text-navy-900">
                Insights coming soon
              </h2>
              <p className="mx-auto mt-2 max-w-md text-muted-foreground">
                We're preparing practical guides on buying, investing and legal
                checks in Deoghar. Check back shortly.
              </p>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}

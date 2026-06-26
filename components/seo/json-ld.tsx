import { site, social, subBrand } from "@/lib/site";

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Organization + LocalBusiness schema for the whole site. */
export function OrganizationJsonLd() {
  const sameAs = Object.values(social).filter(Boolean);
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "RealEstateAgent",
        name: site.name,
        description: site.description,
        url: site.url,
        telephone: site.phone,
        email: site.email,
        slogan: site.tagline,
        areaServed: "Deoghar, Jharkhand, India",
        address: {
          "@type": "PostalAddress",
          addressLocality: site.city,
          addressRegion: site.state,
          addressCountry: "IN",
        },
        subOrganization: {
          "@type": "Organization",
          name: subBrand.name,
          slogan: subBrand.tagline,
        },
        ...(sameAs.length ? { sameAs } : {}),
      }}
    />
  );
}

/** BlogPosting schema for an article. */
export function BlogPostingJsonLd({
  title,
  description,
  slug,
  image,
  publishedAt,
  author,
}: {
  title: string;
  description: string;
  slug: string;
  image?: string | null;
  publishedAt?: string | null;
  author?: string | null;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: title,
        description,
        image: image || undefined,
        datePublished: publishedAt || undefined,
        author: { "@type": "Organization", name: author || site.name },
        publisher: { "@type": "Organization", name: site.name },
        mainEntityOfPage: `${site.url}/blog/${slug}`,
      }}
    />
  );
}

/** Breadcrumb schema. */
export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: `${site.url}${item.url}`,
        })),
      }}
    />
  );
}

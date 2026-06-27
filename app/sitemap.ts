import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import {
  getPublishedPosts,
  getPublishedVentures,
  getPublishedListings,
} from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url.replace(/\/$/, "");

  const staticRoutes = [
    "",
    "/about",
    "/listings",
    "/services",
    "/ventures",
    "/customer-programs",
    "/blog",
    "/contact",
    "/investor",
    "/partner-with-us",
    "/nri-property-care",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const [posts, ventures, listings] = await Promise.all([
    getPublishedPosts(),
    getPublishedVentures(),
    getPublishedListings(),
  ]);

  const postRoutes = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const ventureRoutes = ventures.map((v) => ({
    url: `${base}/ventures/${v.slug}`,
    lastModified: v.updated_at ? new Date(v.updated_at) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const listingRoutes = listings.map((l) => ({
    url: `${base}/listings/${l.slug}`,
    lastModified: l.updated_at ? new Date(l.updated_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...postRoutes, ...ventureRoutes, ...listingRoutes];
}

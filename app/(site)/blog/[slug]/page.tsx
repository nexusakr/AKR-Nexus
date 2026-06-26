import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Markdown } from "@/components/site/markdown";
import { CtaBand } from "@/components/site/cta-band";
import { BlogPostingJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { getPostBySlug } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { site } from "@/lib/site";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Article not found" };
  return {
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt || site.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt || "",
      images: post.cover_image ? [post.cover_image] : undefined,
      publishedTime: post.published_at || undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <BlogPostingJsonLd
        title={post.title}
        description={post.excerpt || ""}
        slug={post.slug}
        image={post.cover_image}
        publishedAt={post.published_at}
        author={post.author_name}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: post.title, url: `/blog/${post.slug}` },
        ]}
      />

      <article className="py-12">
        <Container className="max-w-3xl">
          <Link href="/blog" className="text-sm text-gold-700 hover:underline">
            ← Back to Blog
          </Link>
          <h1 className="mt-4 font-serif text-3xl text-navy-900 sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {formatDate(post.published_at)}
            {post.author_name ? ` · ${post.author_name}` : ""}
          </p>

          {post.cover_image && (
            <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-xl bg-navy-100">
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 768px"
                priority
              />
            </div>
          )}

          <div className="mt-8">
            {post.body ? (
              <Markdown>{post.body}</Markdown>
            ) : (
              <p className="text-muted-foreground">{post.excerpt}</p>
            )}
          </div>
        </Container>
      </article>

      <CtaBand
        title="Have a property question?"
        subtitle="Our advisors are happy to help — book a consultation or message us on WhatsApp."
      />
    </>
  );
}

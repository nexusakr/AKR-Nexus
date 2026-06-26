import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PostEditor } from "@/components/admin/post-editor";
import type { BlogCategory, BlogPost } from "@/types/database";

export default async function EditPostPage({
  params,
}: PageProps<"/admin/blog/[id]">) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: post }, { data: categories }] = await Promise.all([
    supabase.from("blog_posts").select("*").eq("id", id).maybeSingle(),
    supabase.from("blog_categories").select("*").order("sort_order"),
  ]);

  if (!post) notFound();

  return (
    <div className="space-y-6">
      <Link href="/admin/blog" className="text-sm text-gold-700 hover:underline">
        ← Back to blog
      </Link>
      <h1 className="font-serif text-2xl text-navy-900">Edit Post</h1>
      <PostEditor
        post={post as BlogPost}
        categories={(categories as BlogCategory[]) ?? []}
      />
    </div>
  );
}

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PostEditor } from "@/components/admin/post-editor";
import type { BlogCategory } from "@/types/database";

export default async function NewPostPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("blog_categories")
    .select("*")
    .order("sort_order");

  return (
    <div className="space-y-6">
      <Link href="/admin/blog" className="text-sm text-gold-700 hover:underline">
        ← Back to blog
      </Link>
      <h1 className="font-serif text-2xl text-navy-900">New Post</h1>
      <PostEditor post={null} categories={(categories as BlogCategory[]) ?? []} />
    </div>
  );
}

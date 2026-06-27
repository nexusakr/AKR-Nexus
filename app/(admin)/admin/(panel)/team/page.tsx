import Link from "next/link";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ImageUpload } from "@/components/admin/image-upload";
import { saveTeamMember, deleteTeamMember } from "@/lib/actions/admin-cms";
import type { TeamMember } from "@/types/database";

const input =
  "w-full rounded-md border border-border px-3 py-2 text-sm focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200";

export default async function AdminTeamPage({
  searchParams,
}: PageProps<"/admin/team">) {
  const sp = await searchParams;
  const editId = typeof sp.edit === "string" ? sp.edit : null;
  const supabase = await createClient();
  const { data } = await supabase.from("team_members").select("*").order("sort_order");
  const team = (data as TeamMember[]) ?? [];
  const editing = editId ? team.find((t) => t.id === editId) ?? null : null;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="rounded-xl border border-border bg-white p-6">
        <h2 className="font-serif text-lg text-navy-900">{editing ? "Edit" : "Add"} Team Member</h2>
        <form action={saveTeamMember} className="mt-4 space-y-3" key={editing?.id || "new"}>
          {editing && <input type="hidden" name="id" value={editing.id} />}
          <input name="name" placeholder="Full name *" required defaultValue={editing?.name} className={input} />
          <input name="role" placeholder="Role / designation" defaultValue={editing?.role || ""} className={input} />
          <textarea name="bio" rows={3} placeholder="Short bio" defaultValue={editing?.bio || ""} className={input} />
          <input name="email" placeholder="Email" defaultValue={editing?.email || ""} className={input} />
          <input name="linkedin_url" placeholder="LinkedIn URL" defaultValue={editing?.linkedin_url || ""} className={input} />
          <input name="sort_order" type="number" placeholder="Sort order" defaultValue={editing?.sort_order ?? 0} className={input} />
          <ImageUpload name="photo_url" bucket="team" defaultUrl={editing?.photo_url || ""} label="Photo" />
          <select name="status" defaultValue={editing?.status || "published"} className={input}>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <div className="flex gap-2">
            <button className="rounded-md bg-gold-500 px-5 py-2 text-sm font-semibold text-navy-950 hover:bg-gold-600">
              {editing ? "Update" : "Add"}
            </button>
            {editing && (
              <Link href="/admin/team" className="rounded-md border border-border px-4 py-2 text-sm text-navy-700 hover:bg-muted">
                Cancel
              </Link>
            )}
          </div>
        </form>
      </div>

      <div className="lg:col-span-2 space-y-3">
        <h1 className="font-serif text-2xl text-navy-900">Team Members</h1>
        <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-white">
          {team.length ? (
            team.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-4 hover:bg-muted">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full bg-navy-100">
                    {t.photo_url && <Image src={t.photo_url} alt="" fill className="object-cover" sizes="40px" />}
                  </div>
                  <div>
                    <Link href={`/admin/team?edit=${t.id}`} className="font-medium text-navy-900 hover:text-gold-700">
                      {t.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
                <form action={deleteTeamMember}>
                  <input type="hidden" name="id" value={t.id} />
                  <button className="rounded border border-red-200 p-1 text-red-600 hover:bg-red-50">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
            ))
          ) : (
            <p className="p-10 text-center text-muted-foreground">No team members yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

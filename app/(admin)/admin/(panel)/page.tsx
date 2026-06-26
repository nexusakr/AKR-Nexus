import Link from "next/link";
import { Users, FileText, Building2, Handshake } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { leadStatuses } from "@/lib/site";
import { formatDate } from "@/lib/utils";
import type { Lead } from "@/types/database";

async function count(table: string, filter?: { col: string; val: string }) {
  const supabase = await createClient();
  let q = supabase.from(table).select("*", { count: "exact", head: true });
  if (filter) q = q.eq(filter.col, filter.val);
  const { count } = await q;
  return count ?? 0;
}

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [leadsTotal, newLeads, posts, ventures, partners] = await Promise.all([
    count("leads"),
    count("leads", { col: "status", val: "new" }),
    count("blog_posts"),
    count("ventures"),
    count("partners"),
  ]);

  const { data: recent } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(8);

  const { data: allLeads } = await supabase.from("leads").select("status");
  const statusList = (allLeads ?? []) as { status: string }[];
  const byStatus = leadStatuses.map((s) => ({
    ...s,
    n: statusList.filter((l) => l.status === s.value).length,
  }));

  const cards = [
    { label: "Total Leads", value: leadsTotal, icon: Users, href: "/admin/leads" },
    { label: "New Leads", value: newLeads, icon: Users, href: "/admin/leads?status=new" },
    { label: "Blog Posts", value: posts, icon: FileText, href: "/admin/blog" },
    { label: "Ventures", value: ventures, icon: Building2, href: "/admin/ventures" },
    { label: "Partners", value: partners, icon: Handshake, href: "/admin/partners" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl text-navy-900">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your leads and content.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-xl border border-border bg-white p-5 transition-shadow hover:shadow-md"
          >
            <c.icon className="h-6 w-6 text-gold-600" />
            <p className="mt-3 text-3xl font-semibold text-navy-900">{c.value}</p>
            <p className="text-sm text-muted-foreground">{c.label}</p>
          </Link>
        ))}
      </div>

      {/* Pipeline summary */}
      <div className="rounded-xl border border-border bg-white p-5">
        <h2 className="font-serif text-lg text-navy-900">Lead Pipeline</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-7">
          {byStatus.map((s) => (
            <div key={s.value} className="rounded-lg bg-muted p-3 text-center">
              <p className="text-2xl font-semibold text-navy-900">{s.n}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent leads */}
      <div className="rounded-xl border border-border bg-white">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-serif text-lg text-navy-900">Recent Leads</h2>
          <Link href="/admin/leads" className="text-sm text-gold-700 hover:underline">
            View all
          </Link>
        </div>
        <div className="divide-y divide-border">
          {(recent as Lead[] | null)?.length ? (
            (recent as Lead[]).map((lead) => (
              <Link
                key={lead.id}
                href={`/admin/leads/${lead.id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-muted"
              >
                <div>
                  <p className="font-medium text-navy-900">{lead.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {lead.mobile} · {lead.enquiry_type} · {formatDate(lead.created_at)}
                  </p>
                </div>
                <span className="rounded-full bg-navy-100 px-2.5 py-0.5 text-xs font-medium text-navy-700">
                  {lead.status.replace(/_/g, " ")}
                </span>
              </Link>
            ))
          ) : (
            <p className="px-5 py-8 text-center text-sm text-muted-foreground">
              No leads yet. Submissions from the website will appear here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { enquiryTypes, leadStatuses } from "@/lib/site";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Lead, LeadStatusValue, EnquiryTypeValue } from "@/types/database";

export default async function LeadsPage({
  searchParams,
}: PageProps<"/admin/leads">) {
  const sp = await searchParams;
  const status = typeof sp.status === "string" ? sp.status : null;
  const enquiry = typeof sp.enquiry === "string" ? sp.enquiry : null;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";

  const supabase = await createClient();
  let query = supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });
  if (status) query = query.eq("status", status as LeadStatusValue);
  if (enquiry) query = query.eq("enquiry_type", enquiry as EnquiryTypeValue);
  if (q) {
    const safe = q.replace(/[%,()]/g, " ");
    query = query.or(
      `name.ilike.%${safe}%,mobile.ilike.%${safe}%,email.ilike.%${safe}%,city.ilike.%${safe}%`
    );
  }
  const { data } = await query;
  const leads = (data ?? []) as Lead[];

  const exportHref = `/admin/leads/export${
    status ? `?status=${status}` : enquiry ? `?enquiry=${enquiry}` : ""
  }`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl text-navy-900">Leads (CRM)</h1>
          <p className="text-sm text-muted-foreground">
            {leads.length} lead{leads.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <form method="get" className="flex items-center gap-2">
            {status && <input type="hidden" name="status" value={status} />}
            {enquiry && <input type="hidden" name="enquiry" value={enquiry} />}
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Search name, mobile, email…"
              className="w-56 rounded-md border border-border px-3 py-2 text-sm focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200"
            />
            <button className="rounded-md bg-navy-900 px-3 py-2 text-sm text-white hover:bg-navy-800">
              Search
            </button>
          </form>
          <a
            href={exportHref}
            className="rounded-md border border-border px-4 py-2 text-sm font-medium text-navy-800 hover:bg-muted"
          >
            Export CSV
          </a>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <FilterChip label="All statuses" href="/admin/leads" active={!status} />
          {leadStatuses.map((s) => (
            <FilterChip
              key={s.value}
              label={s.label}
              href={`/admin/leads?status=${s.value}`}
              active={status === s.value}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterChip label="All types" href="/admin/leads" active={!enquiry} />
          {enquiryTypes.map((e) => (
            <FilterChip
              key={e.value}
              label={e.label}
              href={`/admin/leads?enquiry=${e.value}`}
              active={enquiry === e.value}
            />
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Mobile</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {leads.length ? (
              leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-muted">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="font-medium text-navy-900 hover:text-gold-700"
                    >
                      {lead.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-navy-700">{lead.mobile}</td>
                  <td className="px-4 py-3 text-navy-700">{lead.enquiry_type}</td>
                  <td className="px-4 py-3 text-navy-700">{lead.city || "—"}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-navy-100 px-2.5 py-0.5 text-xs font-medium text-navy-700">
                      {lead.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(lead.created_at)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  No leads match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FilterChip({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full px-3 py-1 text-xs",
        active
          ? "bg-navy-900 text-white"
          : "border border-border text-navy-700 hover:bg-navy-50"
      )}
    >
      {label}
    </Link>
  );
}

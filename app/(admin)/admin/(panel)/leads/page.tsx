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

  const supabase = await createClient();
  let query = supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });
  if (status) query = query.eq("status", status as LeadStatusValue);
  if (enquiry) query = query.eq("enquiry_type", enquiry as EnquiryTypeValue);
  const { data } = await query;
  const leads = (data ?? []) as Lead[];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl text-navy-900">Leads (CRM)</h1>
          <p className="text-sm text-muted-foreground">
            {leads.length} lead{leads.length === 1 ? "" : "s"}
          </p>
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

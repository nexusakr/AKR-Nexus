import Link from "next/link";
import { notFound } from "next/navigation";
import { Phone, MessageCircle, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { leadStatuses } from "@/lib/site";
import { whatsappUrl } from "@/lib/site";
import { formatDate } from "@/lib/utils";
import { updateLeadStatus, addLeadNote } from "@/lib/actions/admin-leads";
import type { Lead, LeadActivity } from "@/types/database";

export default async function LeadDetailPage({
  params,
}: PageProps<"/admin/leads/[id]">) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: lead } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!lead) notFound();
  const l = lead as Lead;

  const { data: activities } = await supabase
    .from("lead_activities")
    .select("*")
    .eq("lead_id", id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <Link href="/admin/leads" className="text-sm text-gold-700 hover:underline">
        ← Back to leads
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-border bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="font-serif text-2xl text-navy-900">{l.name}</h1>
                <p className="text-sm text-muted-foreground">
                  {l.enquiry_type} · received {formatDate(l.created_at)}
                </p>
              </div>
              <span className="rounded-full bg-navy-100 px-3 py-1 text-sm font-medium text-navy-700">
                {l.status.replace(/_/g, " ")}
              </span>
            </div>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Mobile" value={l.mobile} />
              <Field label="Email" value={l.email || "—"} />
              <Field label="City" value={l.city || "—"} />
              <Field label="Interest" value={l.interest_type || "—"} />
              <Field label="Source" value={l.lead_source || "—"} />
              <Field label="Enquiry type" value={l.enquiry_type} />
            </dl>

            {l.message && (
              <div className="mt-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Message
                </p>
                <p className="mt-1 whitespace-pre-wrap text-navy-800">
                  {l.message}
                </p>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`tel:${l.mobile}`}
                className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm text-navy-800 hover:bg-muted"
              >
                <Phone className="h-4 w-4" /> Call
              </a>
              <a
                href={whatsappUrl(`Hello ${l.name}, this is AKR Nexus.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-[#25D366] px-4 py-2 text-sm font-medium text-white"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
              {l.email && (
                <a
                  href={`mailto:${l.email}`}
                  className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm text-navy-800 hover:bg-muted"
                >
                  <Mail className="h-4 w-4" /> Email
                </a>
              )}
            </div>
          </div>

          {/* Activity timeline */}
          <div className="rounded-xl border border-border bg-white p-6">
            <h2 className="font-serif text-lg text-navy-900">Activity & Notes</h2>
            <form action={addLeadNote} className="mt-4 flex gap-2">
              <input type="hidden" name="lead_id" value={l.id} />
              <input
                name="note"
                placeholder="Add a note…"
                className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200"
              />
              <button className="rounded-md bg-navy-900 px-4 py-2 text-sm font-medium text-white hover:bg-navy-800">
                Add
              </button>
            </form>

            <ul className="mt-5 space-y-4">
              {(activities as LeadActivity[] | null)?.length ? (
                (activities as LeadActivity[]).map((a) => (
                  <li key={a.id} className="border-l-2 border-gold-300 pl-4">
                    <p className="text-sm text-navy-800">{a.note}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(a.created_at)}
                      {a.status_to ? ` · → ${a.status_to.replace(/_/g, " ")}` : ""}
                    </p>
                  </li>
                ))
              ) : (
                <li className="text-sm text-muted-foreground">No activity yet.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Pipeline control */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-white p-6">
            <h2 className="font-serif text-lg text-navy-900">Pipeline Stage</h2>
            <form action={updateLeadStatus} className="mt-4 space-y-3">
              <input type="hidden" name="lead_id" value={l.id} />
              <select
                name="status"
                defaultValue={l.status}
                className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200"
              >
                {leadStatuses.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <button className="w-full rounded-md bg-gold-500 px-4 py-2 text-sm font-semibold text-navy-950 hover:bg-gold-600">
                Update Stage
              </button>
            </form>

            <div className="mt-5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Pipeline
              </p>
              <ol className="mt-2 space-y-1 text-sm">
                {leadStatuses.map((s) => (
                  <li
                    key={s.value}
                    className={
                      s.value === l.status
                        ? "font-semibold text-gold-700"
                        : "text-muted-foreground"
                    }
                  >
                    {s.value === l.status ? "● " : "○ "}
                    {s.label}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-0.5 text-navy-900">{value}</dd>
    </div>
  );
}

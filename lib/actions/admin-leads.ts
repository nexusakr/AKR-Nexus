"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, requireStaff } from "@/lib/auth";
import type { LeadStatusValue } from "@/types/database";

const STATUSES: LeadStatusValue[] = [
  "new",
  "contacted",
  "interested",
  "site_visit_scheduled",
  "negotiation",
  "converted",
  "closed",
];

/** Move a lead to a new pipeline stage and record the change in history. */
export async function updateLeadStatus(formData: FormData) {
  await requireStaff();
  const { userId } = await getCurrentUser();
  const leadId = String(formData.get("lead_id") || "");
  const status = String(formData.get("status") || "") as LeadStatusValue;
  if (!leadId || !STATUSES.includes(status)) return;

  const supabase = await createClient();
  const { data: current } = await supabase
    .from("leads")
    .select("status")
    .eq("id", leadId)
    .maybeSingle();

  const { error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", leadId);
  if (error) {
    console.error("[admin-leads] status update:", error);
    return;
  }

  await supabase.from("lead_activities").insert({
    lead_id: leadId,
    author: userId,
    status_from: current?.status ?? null,
    status_to: status,
    note: `Status changed to ${status.replace(/_/g, " ")}`,
  });

  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

/** Add a free-text note to a lead's activity timeline. */
export async function addLeadNote(formData: FormData) {
  await requireStaff();
  const { userId } = await getCurrentUser();
  const leadId = String(formData.get("lead_id") || "");
  const note = String(formData.get("note") || "").trim();
  if (!leadId || !note) return;

  const supabase = await createClient();
  await supabase.from("lead_activities").insert({
    lead_id: leadId,
    author: userId,
    note,
  });
  revalidatePath(`/admin/leads/${leadId}`);
}

/** Delete a lead (admin-only enforced by RLS). */
export async function deleteLead(formData: FormData) {
  await requireStaff();
  const leadId = String(formData.get("lead_id") || "");
  if (!leadId) return;
  const supabase = await createClient();
  await supabase.from("leads").delete().eq("id", leadId);
  revalidatePath("/admin/leads");
}

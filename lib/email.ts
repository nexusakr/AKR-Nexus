import { Resend } from "resend";
import type { Lead } from "@/types/database";
import { enquiryTypes } from "@/lib/site";

/**
 * Sends a new-lead notification email via Resend.
 * Best-effort: failures are logged, never thrown, so they don't block
 * the lead from being saved.
 */
export async function sendLeadNotification(lead: Lead): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_TO || "nexusakr@gmail.com";
  const from = process.env.LEAD_NOTIFY_FROM || "AKR Nexus <onboarding@resend.dev>";

  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set — skipping lead notification.");
    return;
  }

  const enquiryLabel =
    enquiryTypes.find((e) => e.value === lead.enquiry_type)?.label ||
    lead.enquiry_type;

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to,
      replyTo: lead.email || undefined,
      subject: `New ${enquiryLabel} — ${lead.name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto">
          <h2 style="color:#0e1b2e">New lead — AKR Nexus</h2>
          <table style="width:100%;border-collapse:collapse">
            ${row("Enquiry type", enquiryLabel)}
            ${row("Name", lead.name)}
            ${row("Mobile", lead.mobile)}
            ${row("Email", lead.email || "—")}
            ${row("City", lead.city || "—")}
            ${row("Interest", lead.interest_type || "—")}
            ${row("Source", lead.lead_source || "—")}
            ${row("Message", lead.message || "—")}
            ${row("Received", new Date(lead.created_at).toLocaleString("en-IN"))}
          </table>
          <p style="margin-top:16px;color:#5b6573;font-size:13px">
            Manage this lead in your AKR Nexus admin dashboard.
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error("[email] Failed to send lead notification:", err);
  }
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:6px 8px;border:1px solid #e6e8ec;background:#f5f6f8;font-weight:bold;width:140px">${label}</td>
    <td style="padding:6px 8px;border:1px solid #e6e8ec">${escapeHtml(value)}</td>
  </tr>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

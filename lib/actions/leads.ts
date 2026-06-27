"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { leadSchema, subscribeSchema } from "@/lib/validations";
import { sendLeadNotification } from "@/lib/email";
import { verifyTurnstile } from "@/lib/turnstile";
import type { Lead } from "@/types/database";

export type LeadFormState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
};

/**
 * Public lead-capture Server Action.
 * Validates, blocks bots (honeypot + optional Turnstile), saves to Supabase,
 * and fires a best-effort email notification.
 */
export async function submitLead(
  _prev: LeadFormState,
  formData: FormData
): Promise<LeadFormState> {
  const raw = Object.fromEntries(formData) as Record<string, string>;

  const parsed = leadSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !errors[key]) errors[key] = issue.message;
    }
    // Honeypot tripped → pretend success to the bot, but don't save.
    if (errors.company) {
      return { ok: true, message: "Thank you. We'll be in touch shortly." };
    }
    return { ok: false, message: "Please check the highlighted fields.", errors };
  }

  const data = parsed.data;

  // Honeypot must be empty.
  if (data.company) {
    return { ok: true, message: "Thank you. We'll be in touch shortly." };
  }

  // Optional spam protection.
  const tokenOk = await verifyTurnstile(raw["cf-turnstile-response"]);
  if (!tokenOk) {
    return { ok: false, message: "Spam check failed. Please try again." };
  }

  // Capture a light source hint from the referer header.
  let source = data.lead_source || "";
  if (!source) {
    try {
      const h = await headers();
      source = h.get("referer") || "website";
    } catch {
      source = "website";
    }
  }

  try {
    // Uses the anon server client; RLS policy `leads_public_insert` permits
    // public inserts, so this works without the service-role key.
    const supabase = await createClient();
    const insertPayload = {
      name: data.name,
      mobile: data.mobile,
      email: data.email || null,
      city: data.city || null,
      enquiry_type: data.enquiry_type,
      interest_type: data.interest_type || null,
      message: data.message || null,
      lead_source: source,
      status: "new" as const,
    };
    const { error } = await supabase.from("leads").insert(insertPayload);

    if (error) {
      console.error("[leads] insert error:", error);
      return {
        ok: false,
        message: "Something went wrong saving your enquiry. Please try WhatsApp.",
      };
    }

    // Build the notification from validated data (anon cannot read the row back).
    await sendLeadNotification({
      ...insertPayload,
      created_at: new Date().toISOString(),
    } as Lead);

    return {
      ok: true,
      message: "Thank you! Your enquiry has been received. We'll reach out shortly.",
    };
  } catch (err) {
    console.error("[leads] unexpected error:", err);
    return {
      ok: false,
      message: "Something went wrong. Please contact us on WhatsApp.",
    };
  }
}

export type SubscribeState = { ok: boolean; message: string };

/** Newsletter / lead-magnet subscription Server Action. */
export async function subscribe(
  _prev: SubscribeState,
  formData: FormData
): Promise<SubscribeState> {
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const parsed = subscribeSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: "Please enter a valid email address." };
  }
  if (parsed.data.company) {
    return { ok: true, message: "Subscribed. Thank you!" };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("newsletter_subscribers").insert({
      email: parsed.data.email,
      name: parsed.data.name || null,
      source: parsed.data.source || "footer",
    });
    if (error) {
      console.error("[subscribe] error:", error);
      return { ok: false, message: "Could not subscribe. Please try again." };
    }
    return { ok: true, message: "Subscribed. Thank you for joining our insights." };
  } catch {
    return { ok: false, message: "Could not subscribe. Please try again." };
  }
}

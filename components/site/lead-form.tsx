"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { submitLead, type LeadFormState } from "@/lib/actions/leads";
import { enquiryTypes, interestTypes, type EnquiryType } from "@/lib/site";
import { Turnstile } from "@/components/site/turnstile";
import { cn } from "@/lib/utils";

const initial: LeadFormState = { ok: false, message: "" };

const inputClass =
  "w-full rounded-[var(--radius)] border border-border bg-white px-3.5 py-2.5 text-sm text-navy-900 placeholder:text-muted-foreground focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 w-full items-center justify-center rounded-[var(--radius)] bg-gold-500 px-6 font-semibold text-navy-950 transition-colors hover:bg-gold-600 disabled:opacity-60"
    >
      {pending ? "Sending…" : label}
    </button>
  );
}

export function LeadForm({
  enquiryType = "general",
  lockEnquiryType = false,
  source,
  compact = false,
  submitLabel = "Send Enquiry",
  className,
}: {
  enquiryType?: EnquiryType;
  lockEnquiryType?: boolean;
  source?: string;
  compact?: boolean;
  submitLabel?: string;
  className?: string;
}) {
  const [state, formAction] = useActionState(submitLead, initial);
  // Bump after each server response so the Turnstile widget mints a fresh,
  // single-use token for retries.
  const [turnstileReset, setTurnstileReset] = useState(0);
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    setTurnstileReset((k) => k + 1);
  }, [state]);

  if (state.ok) {
    return (
      <div
        className={cn(
          "rounded-[var(--radius)] border border-green-200 bg-green-50 p-6 text-center",
          className
        )}
      >
        <p className="font-serif text-lg text-navy-900">Thank you!</p>
        <p className="mt-1 text-sm text-navy-700">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className={cn("space-y-3", className)}>
      {/* Honeypot — visually hidden */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] h-0 w-0"
        aria-hidden="true"
      />

      <input type="hidden" name="lead_source" value={source || ""} />
      {lockEnquiryType && (
        <input type="hidden" name="enquiry_type" value={enquiryType} />
      )}

      <div className={cn("grid gap-3", !compact && "sm:grid-cols-2")}>
        <div>
          <input
            name="name"
            placeholder="Your name *"
            required
            className={inputClass}
          />
          {state.errors?.name && (
            <p className="mt-1 text-xs text-red-600">{state.errors.name}</p>
          )}
        </div>
        <div>
          <input
            name="mobile"
            type="tel"
            inputMode="tel"
            placeholder="Mobile number *"
            required
            className={inputClass}
          />
          {state.errors?.mobile && (
            <p className="mt-1 text-xs text-red-600">{state.errors.mobile}</p>
          )}
        </div>
      </div>

      <div className={cn("grid gap-3", !compact && "sm:grid-cols-2")}>
        <input name="email" type="email" placeholder="Email" className={inputClass} />
        <input name="city" placeholder="City" className={inputClass} />
      </div>

      {!lockEnquiryType && (
        <select name="enquiry_type" defaultValue={enquiryType} className={inputClass}>
          {enquiryTypes.map((e) => (
            <option key={e.value} value={e.value}>
              {e.label}
            </option>
          ))}
        </select>
      )}

      <select name="interest_type" defaultValue="" className={inputClass}>
        <option value="">I'm interested in… (optional)</option>
        {interestTypes.map((i) => (
          <option key={i.value} value={i.value}>
            {i.label}
          </option>
        ))}
      </select>

      <textarea
        name="message"
        rows={compact ? 2 : 3}
        placeholder="Your message (optional)"
        className={inputClass}
      />

      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
        <Turnstile
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          resetKey={turnstileReset}
        />
      )}

      {!state.ok && state.message && (
        <p className="text-sm text-red-600">{state.message}</p>
      )}

      <SubmitButton label={submitLabel} />
      <p className="text-center text-xs text-muted-foreground">
        By submitting, you agree to be contacted by AKR Nexus.
      </p>
    </form>
  );
}
